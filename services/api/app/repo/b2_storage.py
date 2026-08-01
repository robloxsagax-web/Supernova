"""Backblaze B2 Storage module for campaign assets.

This module provides AWS S3-compatible storage using Backblaze B2
for storing non-video campaign assets. B2 is optional - API will start
even if B2 is unavailable.
"""

import io
import json
import logging
import os
import time
from typing import Any, BinaryIO, Dict, List, Optional
from dataclasses import dataclass, field

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

logger = logging.getLogger("api.b2_storage")

# B2 Configuration from environment
B2_ENDPOINT = os.environ.get("B2_ENDPOINT", "https://s3.us-east-005.backblazeb2.com")
B2_REGION = os.environ.get("B2_REGION", "us-east-005")
B2_ACCESS_KEY = os.environ.get("B2_ACCESS_KEY_ID", "")
B2_SECRET_KEY = os.environ.get("B2_SECRET_KEY", "")
B2_BUCKET_NAME = os.environ.get("B2_BUCKET_NAME", "Supernova1231")

# Presigned URL expiration (seconds)
PRESIGNED_URL_EXPIRY = 3600  # 1 hour

# =============================================================================
# CENTRALIZED STORAGE PATH CONSTANTS
# =============================================================================
# All storage paths must use these constants. No hardcoded strings allowed.

# Campaign folder prefix
CAMPAIGN_PREFIX = "campaigns/"

# Subfolder prefixes within a campaign
DATA_PREFIX = "data/"
IMAGE_PREFIX = "images/"
VIDEO_PREFIX = "videos/"
AUDIO_PREFIX = "audio/"

# Metadata file name
METADATA_FILE = "metadata.json"

def campaign_folder(campaign_id: str) -> str:
    """Get the full folder path for a campaign."""
    return f"{CAMPAIGN_PREFIX}{campaign_id}/"

def metadata_key(campaign_id: str) -> str:
    """Get the full object key for a campaign's metadata.json."""
    return f"{campaign_folder(campaign_id)}{METADATA_FILE}"

def data_key(campaign_id: str, filename: str) -> str:
    """Get the full object key for a data file."""
    # filename may include subpath like "data/script.json" - strip any leading data/ to avoid duplication
    if filename.startswith(DATA_PREFIX):
        filename = filename[len(DATA_PREFIX):]
    return f"{campaign_folder(campaign_id)}{DATA_PREFIX}{filename}"

def image_key(campaign_id: str, filename: str) -> str:
    """Get the full object key for an image file."""
    return f"{campaign_folder(campaign_id)}{IMAGE_PREFIX}{filename}"

def video_key(campaign_id: str, filename: str) -> str:
    """Get the full object key for a video file."""
    return f"{campaign_folder(campaign_id)}{VIDEO_PREFIX}{filename}"

def audio_key(campaign_id: str, filename: str) -> str:
    """Get the full object key for an audio file."""
    return f"{campaign_folder(campaign_id)}{AUDIO_PREFIX}{filename}"

# Backward compatibility alias
CAMPAIGNS_PREFIX = CAMPAIGN_PREFIX

# Log config at module load
logger.info("=" * 60)
logger.info("B2 STORAGE MODULE LOADING")
logger.info("=" * 60)
logger.info(f"B2_ENDPOINT: {B2_ENDPOINT}")
logger.info(f"B2_REGION: {B2_REGION}")
logger.info(f"B2_BUCKET_NAME: {B2_BUCKET_NAME}")
logger.info(f"B2_ACCESS_KEY_ID env var present: {'B2_ACCESS_KEY_ID' in os.environ}")
logger.info(f"B2_SECRET_KEY env var present: {'B2_SECRET_KEY' in os.environ}")
if B2_ACCESS_KEY:
    logger.info(f"B2_ACCESS_KEY loaded (length): {len(B2_ACCESS_KEY)}")
    logger.info(f"B2_ACCESS_KEY (first 8 chars): {B2_ACCESS_KEY[:8]}...")
else:
    logger.info("B2_ACCESS_KEY: NOT SET")
if B2_SECRET_KEY:
    logger.info(f"B2_SECRET_KEY loaded (length): {len(B2_SECRET_KEY)}")
else:
    logger.info("B2_SECRET_KEY: NOT SET")
logger.info("=" * 60)


@dataclass
class CampaignMetadata:
    """Campaign metadata structure."""
    campaign_id: str
    created_at: str
    updated_at: str
    product_title: str
    product_description: str
    prompt: str = ""
    image_count: int = 0
    ai_provider: str = "genblaze"
    status: str = "pending"
    generation_time: float = 0.0
    object_keys: List[str] = field(default_factory=list)


class B2Storage:
    """Backblaze B2 storage client for campaign assets."""

    def __init__(self):
        """Initialize B2 storage client."""
        self._client = None
        self._resource = None
        self._available = False
        self._auth_error = None
        
        # Try to connect, but don't fail startup
        self._connect()

    def _connect(self) -> None:
        """Connect to B2 and test credentials. Sets _available flag."""
        if not B2_ACCESS_KEY or not B2_SECRET_KEY:
            logger.warning("B2 credentials not configured - storage will be unavailable")
            self._available = False
            return

        logger.info("Testing B2 connection...")
        
        try:
            config = Config(
                signature_version='s3v4',
                retries={'max_attempts': 1, 'mode': 'standard'},
                connect_timeout=5,
                read_timeout=30,
            )
            
            test_client = boto3.client(
                's3',
                endpoint_url=B2_ENDPOINT,
                aws_access_key_id=B2_ACCESS_KEY,
                aws_secret_access_key=B2_SECRET_KEY,
                region_name=B2_REGION,
                config=config
            )
            
            # Test with head_bucket
            logger.info(f"Calling head_bucket for bucket: {B2_BUCKET_NAME}")
            response = test_client.head_bucket(Bucket=B2_BUCKET_NAME)
            logger.info(f"head_bucket response: {response}")
            
            # Try to get bucket location to check IAM capabilities
            try:
                location_response = test_client.get_bucket_location(Bucket=B2_BUCKET_NAME)
                logger.info(f"Bucket location: {location_response.get('LocationConstraint')}")
            except Exception as e:
                logger.warning(f"Could not get bucket location: {e}")
            
            # Try list_objects_v2 to verify read permissions
            try:
                list_response = test_client.list_objects_v2(Bucket=B2_BUCKET_NAME, MaxKeys=1)
                logger.info(f"list_objects_v2 succeeded - read access confirmed")
                logger.info(f"Listed {list_response.get('KeyCount', 0)} objects")
            except ClientError as list_err:
                if list_err.response['Error']['Code'] == 'AccessDenied':
                    logger.warning("Access denied for list_objects_v2 - limited permissions")
                else:
                    logger.warning(f"list_objects_v2 error: {list_err}")
            
            self._available = True
            self._client = test_client
            logger.info("=" * 60)
            logger.info("B2 CONNECTION SUCCESSFUL")
            logger.info(f"Endpoint: {B2_ENDPOINT}")
            logger.info(f"Bucket: {B2_BUCKET_NAME}")
            logger.info(f"Access Key ID: {B2_ACCESS_KEY[:8]}...")
            logger.info("IAM Capabilities: READ, WRITE (if tested)")
            logger.info("=" * 60)
            
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            error_message = e.response.get('Error', {}).get('Message', 'Unknown')
            self._auth_error = f"{error_code}: {error_message}"
            
            logger.error("=" * 60)
            logger.error("B2 CONNECTION FAILED")
            logger.error(f"Error Code: {error_code}")
            logger.error(f"Error Message: {error_message}")
            logger.error(f"Access Key ID used: {B2_ACCESS_KEY[:8]}..." if B2_ACCESS_KEY else "N/A")
            logger.error("=" * 60)
            logger.error("B2 is OPTIONAL - API will continue starting")
            logger.error("Set correct B2_ACCESS_KEY_ID and B2_SECRET_KEY to enable storage")
            
            self._available = False
            
        except Exception as e:
            self._auth_error = f"{type(e).__name__}: {str(e)}"
            
            logger.error("=" * 60)
            logger.error("B2 CONNECTION FAILED")
            logger.error(f"Error: {type(e).__name__}: {str(e)}")
            logger.error(f"Access Key ID used: {B2_ACCESS_KEY[:8]}..." if B2_ACCESS_KEY else "N/A")
            logger.error("=" * 60)
            logger.error("B2 is OPTIONAL - API will continue starting")
            
            self._available = False

    def _get_client(self):
        """Get or create B2 S3 client."""
        if not self._available:
            raise ValueError("B2 storage not available. Check credentials and bucket permissions.")
        
        if not self._client:
            config = Config(
                signature_version='s3v4',
                retries={'max_attempts': 3, 'mode': 'standard'},
                connect_timeout=5,
                read_timeout=30,
            )

            self._client = boto3.client(
                's3',
                endpoint_url=B2_ENDPOINT,
                aws_access_key_id=B2_ACCESS_KEY,
                aws_secret_access_key=B2_SECRET_KEY,
                region_name=B2_REGION,
                config=config
            )

        return self._client

    def _get_resource(self):
        """Get or create B2 S3 resource."""
        if not self._resource:
            if not B2_ACCESS_KEY or not B2_SECRET_KEY:
                raise ValueError("B2 credentials not configured")

            config = Config(
                signature_version='s3v4',
                retries={'max_attempts': 3, 'mode': 'standard'},
                connect_timeout=5,
                read_timeout=30,
            )

            self._resource = boto3.resource(
                's3',
                endpoint_url=B2_ENDPOINT,
                aws_access_key_id=B2_ACCESS_KEY,
                aws_secret_access_key=B2_SECRET_KEY,
                region_name=B2_REGION,
                config=config
            )

        return self._resource

    def is_available(self) -> bool:
        """Check if B2 storage is available."""
        return self._available

    def get_auth_error(self) -> Optional[str]:
        """Get the authentication error if any."""
        return self._auth_error

    def upload_asset(
        self,
        campaign_id: str,
        asset_type: str,
        filename: str,
        content: bytes | BinaryIO,
        content_type: str = "application/octet-stream",
        metadata: Optional[Dict[str, str]] = None
    ) -> str:
        """Upload an asset to B2.

        Args:
            campaign_id: Campaign identifier
            asset_type: Type of asset (images, videos, data, etc.)
            filename: Name of the file (may include subpath like "data/script.json")
            content: File content as bytes or file-like object
            content_type: MIME type
            metadata: Optional metadata dict

        Returns:
            Object key in B2

        Raises:
            ValueError: If storage not configured
            ClientError: If upload fails
        """
        if not self.is_available():
            raise ValueError("B2 storage not configured")

        # Build object key using centralized path functions
        if asset_type == "images":
            object_key = image_key(campaign_id, filename)
        elif asset_type == "videos":
            object_key = video_key(campaign_id, filename)
        elif asset_type == "audio":
            object_key = audio_key(campaign_id, filename)
        elif asset_type == "data":
            # Handle both "data/script.json" and "script.json" formats
            object_key = data_key(campaign_id, filename)
        elif filename == METADATA_FILE:
            # Special case for metadata.json - always at root of campaign folder
            object_key = metadata_key(campaign_id)
        else:
            # Generic fallback
            object_key = f"{campaign_folder(campaign_id)}{filename}"

        extra_args = {"ContentType": content_type}

        if metadata:
            extra_args["Metadata"] = metadata

        logger.info(f"Uploading to B2: {object_key}")

        try:
            client = self._get_client()
            if isinstance(content, bytes):
                client.put_object(
                    Bucket=B2_BUCKET_NAME,
                    Key=object_key,
                    Body=content,
                    **extra_args
                )
            else:
                # File-like object
                client.upload_fileobj(
                    content,
                    B2_BUCKET_NAME,
                    object_key,
                    ExtraArgs=extra_args
                )

            logger.info(f"Uploaded successfully: {object_key}")
            return object_key

        except ClientError as e:
            logger.error(f"Upload failed: {e}")
            raise

    def upload_json(
        self,
        campaign_id: str,
        data: Dict[str, Any],
        filename: str
    ) -> str:
        """Upload JSON data to B2.

        Args:
            campaign_id: Campaign identifier
            data: JSON-serializable data
            filename: Name of JSON file (e.g., metadata.json, data/script.json)

        Returns:
            Object key in B2
        """
        content = json.dumps(data, indent=2).encode('utf-8')
        
        # Determine proper object key
        if filename == METADATA_FILE:
            # metadata.json goes to campaign root, not data/ folder
            object_key = metadata_key(campaign_id)
        else:
            # Other JSON files go to data/ folder
            object_key = data_key(campaign_id, filename)
        
        logger.info(f"Uploading JSON to B2: {object_key}")
        
        try:
            client = self._get_client()
            client.put_object(
                Bucket=B2_BUCKET_NAME,
                Key=object_key,
                Body=content,
                ContentType="application/json",
                Metadata={"campaign_id": campaign_id}
            )
            logger.info(f"JSON uploaded successfully: {object_key}")
            return object_key
            
        except ClientError as e:
            logger.error(f"JSON upload failed: {e}")
            raise

    def generate_presigned_url(
        self,
        object_key: str,
        expiry_seconds: int = PRESIGNED_URL_EXPIRY
    ) -> str:
        """Generate a presigned GET URL for an object.

        Args:
            object_key: Object key in B2
            expiry_seconds: URL expiration time

        Returns:
            Presigned URL

        Raises:
            ValueError: If storage not configured
            ClientError: If URL generation fails
        """
        if not self.is_available():
            raise ValueError("B2 storage not configured")

        try:
            client = self._get_client()
            url = client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': B2_BUCKET_NAME,
                    'Key': object_key
                },
                ExpiresIn=expiry_seconds
            )
            return url

        except ClientError as e:
            logger.error(f"Presigned URL generation failed: {e}")
            raise

    def download_object(self, object_key: str) -> bytes:
        """Download an object from B2.

        Args:
            object_key: Object key in B2

        Returns:
            Object content as bytes

        Raises:
            ValueError: If storage not configured
            ClientError: If download fails
        """
        if not self.is_available():
            raise ValueError("B2 storage not configured")

        try:
            client = self._get_client()
            response = client.get_object(
                Bucket=B2_BUCKET_NAME,
                Key=object_key
            )
            return response['Body'].read()

        except ClientError as e:
            logger.error(f"Download failed: {e}")
            raise

    def download_json(self, object_key: str) -> Dict[str, Any]:
        """Download and parse JSON from B2.

        Args:
            object_key: Object key in B2

        Returns:
            Parsed JSON data
        """
        content = self.download_object(object_key)
        return json.loads(content.decode('utf-8'))

    def list_campaigns(
        self,
        prefix: str = CAMPAIGNS_PREFIX,
        max_keys: int = 100
    ) -> List[str]:
        """List all campaign IDs.

        Args:
            prefix: Object prefix to search
            max_keys: Maximum number of results

        Returns:
            List of campaign IDs
        """
        if not self.is_available():
            raise ValueError("B2 storage not configured")

        try:
            client = self._get_client()
            response = client.list_objects_v2(
                Bucket=B2_BUCKET_NAME,
                Prefix=prefix,
                Delimiter='/',
                MaxKeys=max_keys
            )

            campaign_ids = []
            if 'CommonPrefixes' in response:
                for obj in response['CommonPrefixes']:
                    # Extract campaign ID from prefix like "campaigns/{id}/"
                    full_prefix = obj['Prefix']
                    if full_prefix.startswith(CAMPAIGNS_PREFIX):
                        rest = full_prefix[len(CAMPAIGNS_PREFIX):]
                        campaign_id = rest.rstrip('/')
                        if campaign_id:
                            campaign_ids.append(campaign_id)

            logger.info(f"Found {len(campaign_ids)} campaigns")
            return campaign_ids

        except ClientError as e:
            logger.error(f"List campaigns failed: {e}")
            raise

    def list_campaign_objects(
        self,
        campaign_id: str,
        prefix_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """List all objects for a campaign.

        Args:
            campaign_id: Campaign identifier
            prefix_filter: Optional filter (e.g., "images/")

        Returns:
            List of object metadata dicts
        """
        if not self.is_available():
            raise ValueError("B2 storage not configured")

        prefix = f"{CAMPAIGNS_PREFIX}{campaign_id}/"
        if prefix_filter:
            prefix = f"{prefix}{prefix_filter}"

        try:
            client = self._get_client()
            response = client.list_objects_v2(
                Bucket=B2_BUCKET_NAME,
                Prefix=prefix
            )

            objects = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    objects.append({
                        'key': obj['Key'],
                        'size': obj['Size'],
                        'last_modified': obj['LastModified'].isoformat(),
                        'etag': obj['ETag'].strip('"')
                    })

            return objects

        except ClientError as e:
            logger.error(f"List objects failed: {e}")
            raise

    def delete_object(self, object_key: str) -> None:
        """Delete an object from B2.

        Args:
            object_key: Object key in B2

        Raises:
            ValueError: If storage not configured
            ClientError: If delete fails
        """
        if not self.is_available():
            raise ValueError("B2 storage not configured")

        try:
            client = self._get_client()
            client.delete_object(
                Bucket=B2_BUCKET_NAME,
                Key=object_key
            )
            logger.info(f"Deleted: {object_key}")

        except ClientError as e:
            logger.error(f"Delete failed: {e}")
            raise

    def delete_campaign(self, campaign_id: str) -> int:
        """Delete all objects for a campaign.

        Args:
            campaign_id: Campaign identifier

        Returns:
            Number of objects deleted

        Raises:
            ValueError: If storage not configured
            ClientError: If delete fails
        """
        if not self.is_available():
            raise ValueError("B2 storage not configured")

        prefix = f"{CAMPAIGNS_PREFIX}{campaign_id}/"

        try:
            client = self._get_client()
            deleted_count = 0

            # List and delete in batches
            while True:
                response = client.list_objects_v2(
                    Bucket=B2_BUCKET_NAME,
                    Prefix=prefix
                )

                if 'Contents' not in response or not response['Contents']:
                    break

                # Delete objects in batch (max 1000 per request)
                objects_to_delete = [{'Key': obj['Key']} for obj in response['Contents']]

                client.delete_objects(
                    Bucket=B2_BUCKET_NAME,
                    Delete={'Objects': objects_to_delete}
                )

                deleted_count += len(objects_to_delete)

                # Check if there are more objects
                if not response.get('IsTruncated'):
                    break

            logger.info(f"Deleted {deleted_count} objects for campaign {campaign_id}")
            return deleted_count

        except ClientError as e:
            logger.error(f"Delete campaign failed: {e}")
            raise

    def search_campaigns(
        self,
        search_term: Optional[str] = None,
        status: Optional[str] = None,
        ai_provider: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        max_results: int = 50
    ) -> List[Dict[str, Any]]:
        """Search campaigns by metadata.

        Args:
            search_term: Text to search in title/description/prompt
            status: Filter by status
            ai_provider: Filter by AI provider
            start_date: Filter by created_at >= start_date
            end_date: Filter by created_at <= end_date
            max_results: Maximum number of results

        Returns:
            List of campaign metadata dicts
        """
        if not self.is_available():
            raise ValueError("B2 storage not configured")

        campaigns = []
        seen_ids = set()

        try:
            # List all campaigns
            campaign_ids = self.list_campaigns(max_keys=max_results)

            for campaign_id in campaign_ids:
                if campaign_id in seen_ids:
                    continue

                try:
                    # Try to get metadata.json - check both locations for backward compatibility
                    mkey = metadata_key(campaign_id)
                    metadata = None
                    
                    try:
                        metadata = self.download_json(mkey)
                    except ClientError as e:
                        if e.response['Error']['Code'] == 'NoSuchKey':
                            # Try legacy location
                            legacy_mkey = f"{campaign_folder(campaign_id)}{DATA_PREFIX}{METADATA_FILE}"
                            try:
                                metadata = self.download_json(legacy_mkey)
                                # Migrate for future reads
                                try:
                                    self.upload_json(campaign_id, metadata, METADATA_FILE)
                                except:
                                    pass
                            except ClientError:
                                continue  # Skip campaigns without metadata
                        else:
                            raise
                    
                    if not metadata:
                        continue
                    
                    # Ensure campaign_id is in metadata
                    if 'campaign_id' not in metadata:
                        metadata['campaign_id'] = campaign_id

                    # Apply filters
                    if search_term:
                        search_lower = search_term.lower()
                        matches = (
                            search_lower in metadata.get('product_title', '').lower() or
                            search_lower in metadata.get('product_description', '').lower() or
                            search_lower in metadata.get('prompt', '').lower()
                        )
                        if not matches:
                            continue

                    if status and metadata.get('status') != status:
                        continue

                    if ai_provider and metadata.get('ai_provider') != ai_provider:
                        continue

                    if start_date and metadata.get('created_at', '') < start_date:
                        continue

                    if end_date and metadata.get('created_at', '') > end_date:
                        continue

                    campaigns.append(metadata)
                    seen_ids.add(campaign_id)

                    if len(campaigns) >= max_results:
                        break

                except ClientError:
                    # Metadata not found for this campaign, skip
                    continue

            # Sort by created_at descending
            campaigns.sort(key=lambda x: x.get('created_at', ''), reverse=True)

            return campaigns

        except ClientError as e:
            logger.error(f"Search failed: {e}")
            raise

    def get_campaign(self, campaign_id: str) -> Optional[Dict[str, Any]]:
        """Get full campaign data.

        Args:
            campaign_id: Campaign identifier

        Returns:
            Campaign data dict with metadata and presigned URLs, or None if not found
        """
        if not self.is_available():
            raise ValueError("B2 storage not configured")

        try:
            # Try to get metadata - check both locations for backward compatibility
            mkey = metadata_key(campaign_id)
            metadata = None
            
            try:
                metadata = self.download_json(mkey)
                logger.info(f"Found metadata at canonical location: {mkey}")
            except ClientError as e:
                if e.response['Error']['Code'] == 'NoSuchKey':
                    # Try legacy location (in data/ folder)
                    legacy_mkey = f"{campaign_folder(campaign_id)}{DATA_PREFIX}{METADATA_FILE}"
                    logger.warning(f"Metadata not at {mkey}, trying legacy location: {legacy_mkey}")
                    try:
                        metadata = self.download_json(legacy_mkey)
                        logger.info(f"Found metadata at legacy location: {legacy_mkey}")
                        # Update to canonical location for future reads
                        try:
                            self.upload_json(campaign_id, metadata, METADATA_FILE)
                            logger.info(f"Migrated metadata from legacy to canonical location")
                        except Exception as migrate_err:
                            logger.warning(f"Could not migrate metadata: {migrate_err}")
                    except ClientError:
                        # Metadata not found at either location
                        logger.error(f"Metadata not found at either location for campaign {campaign_id}")
                        return None
                else:
                    raise
            
            # Ensure campaign_id is in metadata
            if metadata and 'campaign_id' not in metadata:
                metadata['campaign_id'] = campaign_id

            # Get all object keys
            objects = self.list_campaign_objects(campaign_id)

            # Generate presigned URLs for each object
            object_urls = {}
            for obj in objects:
                if obj['key'] not in [mkey, f"{campaign_folder(campaign_id)}{DATA_PREFIX}{METADATA_FILE}"]:
                    object_urls[obj['key']] = {
                        'url': self.generate_presigned_url(obj['key']),
                        'size': obj['size'],
                        'last_modified': obj['last_modified']
                    }

            # Build response
            campaign = {
                'metadata': metadata,
                'objects': object_urls
            }

            return campaign

        except ClientError as e:
            if e.response['Error']['Code'] == 'NoSuchKey':
                logger.info(f"Campaign not found: {campaign_id}")
                return None
            logger.error(f"Get campaign failed: {e}")
            raise


# Global storage instance
_storage: Optional[B2Storage] = None


def get_storage() -> B2Storage:
    """Get the global B2 storage instance."""
    global _storage
    if _storage is None:
        _storage = B2Storage()
    return _storage
