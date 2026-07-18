"""Backblaze B2 Storage module for campaign assets.

This module provides AWS S3-compatible storage using Backblaze B2
for storing non-video campaign assets.
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
B2_ENDPOINT = os.environ.get("B2_ENDPOINT", "https://s3.backblazeb2.com")
B2_REGION = os.environ.get("B2_REGION", "us-west-002")
B2_ACCESS_KEY = os.environ.get("B2_ACCESS_KEY_ID", "")
B2_SECRET_KEY = os.environ.get("B2_SECRET_KEY", "")
B2_BUCKET_NAME = os.environ.get("B2_BUCKET_NAME", "supernova-campaigns")

# Presigned URL expiration (seconds)
PRESIGNED_URL_EXPIRY = 3600  # 1 hour

# Campaign folder prefix
CAMPAIGNS_PREFIX = "campaigns/"


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
        self._validate_config()

    def _validate_config(self) -> None:
        """Validate B2 configuration."""
        if not B2_ACCESS_KEY or not B2_SECRET_KEY:
            logger.warning("B2 credentials not configured - storage operations will fail")
        else:
            logger.info("B2 storage configured")
            logger.info(f"Endpoint: {B2_ENDPOINT}")
            logger.info(f"Bucket: {B2_BUCKET_NAME}")

    def _get_client(self):
        """Get or create B2 S3 client."""
        if not self._client:
            if not B2_ACCESS_KEY or not B2_SECRET_KEY:
                raise ValueError("B2 credentials not configured")

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
        return bool(B2_ACCESS_KEY and B2_SECRET_KEY)

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
            asset_type: Type of asset (images, scripts, etc.)
            filename: Name of the file
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

        # Build object key
        if asset_type == "images":
            object_key = f"{CAMPAIGNS_PREFIX}{campaign_id}/images/{filename}"
        else:
            object_key = f"{CAMPAIGNS_PREFIX}{campaign_id}/{asset_type}/{filename}"

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
            filename: Name of JSON file (e.g., metadata.json)

        Returns:
            Object key in B2
        """
        content = json.dumps(data, indent=2).encode('utf-8')
        return self.upload_asset(
            campaign_id=campaign_id,
            asset_type="data",
            filename=filename,
            content=content,
            content_type="application/json",
            metadata={"campaign_id": campaign_id}
        )

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
                    # Try to get metadata.json
                    metadata_key = f"{CAMPAIGNS_PREFIX}{campaign_id}/metadata.json"
                    metadata = self.download_json(metadata_key)

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
            # Get metadata
            metadata_key = f"{CAMPAIGNS_PREFIX}{campaign_id}/metadata.json"
            metadata = self.download_json(metadata_key)

            # Get all object keys
            objects = self.list_campaign_objects(campaign_id)

            # Generate presigned URLs for each object
            object_urls = {}
            for obj in objects:
                if obj['key'] != metadata_key:  # Don't include metadata URL
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
