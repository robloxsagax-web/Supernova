"""Storage routes for Backblaze B2 operations."""

import io
import json
import logging
import time
import traceback
import zipfile
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Query
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field
from botocore.exceptions import ClientError

from app.repo.b2_storage import (
    get_storage, 
    CampaignMetadata, 
    CAMPAIGN_PREFIX, 
    CAMPAIGNS_PREFIX,
    METADATA_FILE,
    metadata_key,
    data_key,
    campaign_folder
)

logger = logging.getLogger("api.routes.storage")

router = APIRouter(prefix="/storage", tags=["storage"])


class CampaignSearchRequest(BaseModel):
    """Campaign search request model."""
    search_term: Optional[str] = None
    status: Optional[str] = None
    ai_provider: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    max_results: int = Field(default=50, ge=1, le=100)


class CampaignUploadRequest(BaseModel):
    """Campaign upload request model."""
    campaign_id: str
    product_title: str
    product_description: str
    prompt: str = ""
    ai_provider: str = "genblaze"
    generation_time: float = 0.0


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint for storage service."""
    storage = get_storage()
    return {
        "status": "ok" if storage.is_available() else "unavailable",
        "provider": "Backblaze B2",
        "available": storage.is_available()
    }


@router.get("/campaigns")
async def list_campaigns(
    max_keys: int = Query(default=100, ge=1, le=500)
) -> Dict[str, Any]:
    """List all campaigns with full metadata."""
    logger.info(f"Campaign list request received: max_keys={max_keys}")

    try:
        storage = get_storage()
        if not storage.is_available():
            logger.error("Storage not available for list campaigns")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Storage not configured"
            )

        # Get campaign IDs first
        campaign_ids = storage.list_campaigns(max_keys=max_keys)
        logger.info(f"Found {len(campaign_ids)} campaign folders in B2")
        
        # Now fetch metadata for each campaign
        campaigns = []
        for campaign_id in campaign_ids:
            try:
                # Try to get metadata.json - check both locations for backward compatibility
                canonical_path = metadata_key(campaign_id)
                legacy_path = f"{campaign_folder(campaign_id)}data/{METADATA_FILE}"
                metadata = None
                
                try:
                    metadata = storage.download_json(canonical_path)
                    logger.info(f"Found metadata at canonical location: {canonical_path}")
                except ClientError as e:
                    if e.response['Error']['Code'] == 'NoSuchKey':
                        # Try legacy location
                        logger.warning(f"Metadata not at {canonical_path}, trying legacy: {legacy_path}")
                        try:
                            metadata = storage.download_json(legacy_path)
                            logger.info(f"Found metadata at legacy location: {legacy_path}")
                            # Migrate to canonical location for future reads
                            try:
                                storage.upload_json(campaign_id, metadata, METADATA_FILE)
                                logger.info(f"Migrated metadata to canonical location")
                            except Exception as migrate_err:
                                logger.warning(f"Could not migrate metadata: {migrate_err}")
                        except ClientError:
                            # No metadata at either location - create minimal entry
                            logger.warning(f"Campaign {campaign_id} has no metadata.json, creating minimal entry")
                            campaigns.append({
                                'campaign_id': campaign_id,
                                'product_title': campaign_id,
                                'product_description': '',
                                'prompt': '',
                                'status': 'incomplete',
                                'created_at': '',
                                'updated_at': '',
                                'ai_provider': 'genblaze',
                                'image_count': 0,
                                'generation_time': 0.0,
                                'object_keys': []
                            })
                            continue
                    else:
                        raise
                
                if not metadata:
                    continue
                    
                # Ensure campaign_id is in metadata
                if 'campaign_id' not in metadata:
                    metadata['campaign_id'] = campaign_id
                campaigns.append(metadata)
                logger.info(f"  - {campaign_id}: {metadata.get('product_title', 'N/A')} (status: {metadata.get('status', 'N/A')})")
            except Exception as e:
                logger.error(f"Unexpected error for campaign {campaign_id}: {e}")
                # Skip corrupted campaigns instead of crashing
                continue
        
        # Sort by created_at descending (newest first)
        campaigns.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        logger.info(f"Returning {len(campaigns)} campaigns with full metadata")
        return {"campaigns": campaigns, "count": len(campaigns)}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"List campaigns failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to list campaigns: {str(e)}", "campaigns": [], "count": 0}
        )


@router.post("/campaigns/search")
async def search_campaigns(request: CampaignSearchRequest) -> Dict[str, Any]:
    """Search campaigns by metadata."""
    logger.info(f"Searching campaigns: term={request.search_term}, status={request.status}")

    try:
        storage = get_storage()
        if not storage.is_available():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Storage not configured"
            )

        campaigns = storage.search_campaigns(
            search_term=request.search_term,
            status=request.status,
            ai_provider=request.ai_provider,
            start_date=request.start_date,
            end_date=request.end_date,
            max_results=request.max_results
        )

        return {"campaigns": campaigns, "count": len(campaigns)}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Search campaigns failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to search campaigns: {str(e)}", "campaigns": [], "count": 0}
        )


@router.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: str) -> Dict[str, Any]:
    """Get full campaign data with presigned URLs."""
    logger.info(f"Getting campaign: {campaign_id}")

    try:
        storage = get_storage()
        if not storage.is_available():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Storage not configured"
            )

        campaign = storage.get_campaign(campaign_id)
        if not campaign:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"error": "Campaign not found"}
            )

        return campaign

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get campaign failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to get campaign: {str(e)}"}
        )


@router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str) -> Dict[str, Any]:
    """Delete a campaign and all its assets."""
    logger.info(f"Delete campaign request received: {campaign_id}")

    try:
        storage = get_storage()
        if not storage.is_available():
            logger.error(f"Storage not available for delete: {campaign_id}")
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"error": "Storage not configured"}
            )

        deleted_count = storage.delete_campaign(campaign_id)
        logger.info(f"Campaign deleted: {campaign_id}, objects_removed={deleted_count}")
        
        return {
            "success": True,
            "campaign_id": campaign_id,
            "deleted_count": deleted_count
        }

    except Exception as e:
        logger.error(f"Delete campaign failed: {campaign_id}, error={e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to delete campaign: {str(e)}"}
        )


@router.post("/campaigns")
async def upload_campaign(request: CampaignUploadRequest) -> Dict[str, Any]:
    """Initialize a campaign upload (create metadata placeholder)."""
    logger.info(f"Initializing campaign upload: {request.campaign_id}")

    try:
        storage = get_storage()
        if not storage.is_available():
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"error": "Storage not configured"}
            )

        now = time.time()
        metadata = CampaignMetadata(
            campaign_id=request.campaign_id,
            created_at=f"_{now}",  # Placeholder until all uploads complete
            updated_at=f"_{now}",
            product_title=request.product_title,
            product_description=request.product_description,
            prompt=request.prompt,
            ai_provider=request.ai_provider,
            generation_time=request.generation_time,
            status="uploading"
        )

        metadata_key = storage.upload_json(
            campaign_id=request.campaign_id,
            data=metadata.__dict__,
            filename="metadata.json"
        )

        return {
            "success": True,
            "campaign_id": request.campaign_id,
            "metadata_key": metadata_key
        }

    except Exception as e:
        logger.error(f"Initialize campaign upload failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to initialize campaign upload: {str(e)}"}
        )


@router.post("/campaigns/{campaign_id}/upload/{asset_type}")
async def upload_campaign_asset(
    campaign_id: str,
    asset_type: str,
    filename: str = Form(...),
    content: UploadFile = File(...),
    metadata_json: Optional[str] = Form(None)
) -> Dict[str, Any]:
    """Upload an asset to a campaign."""
    logger.info(f"Uploading asset: campaign={campaign_id}, type={asset_type}, file={filename}")

    try:
        storage = get_storage()
        if not storage.is_available():
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"error": "Storage not configured"}
            )

        # Validate asset type
        allowed_types = ["images", "data", "scripts", "market-insights", "audience", "competitor-analysis", "analytics", "prompt"]
        if asset_type not in allowed_types:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"error": f"Invalid asset type. Allowed: {allowed_types}"}
            )

        # Read content
        content_bytes = await content.read()
        content_type = content.content_type or "application/octet-stream"

        # Build metadata
        metadata = {}
        if metadata_json:
            try:
                metadata = json.loads(metadata_json)
            except json.JSONDecodeError:
                pass

        metadata["campaign_id"] = campaign_id
        metadata["asset_type"] = asset_type
        metadata["uploaded_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")

        # Upload
        object_key = storage.upload_asset(
            campaign_id=campaign_id,
            asset_type=asset_type,
            filename=filename,
            content=content_bytes,
            content_type=content_type,
            metadata=metadata
        )

        return {
            "success": True,
            "object_key": object_key
        }

    except Exception as e:
        logger.error(f"Upload asset failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to upload asset: {str(e)}"}
        )


@router.post("/campaigns/{campaign_id}/upload-json/{filename:path}")
async def upload_campaign_json(
    campaign_id: str,
    filename: str,
    data: Dict[str, Any]
) -> Dict[str, Any]:
    """Upload JSON data to a campaign."""
    logger.info(f"Upload JSON request received: campaign={campaign_id}, file={filename}")
    logger.info(f"JSON data keys: {list(data.keys()) if isinstance(data, dict) else 'N/A'}")
    
    try:
        storage = get_storage()
        if not storage.is_available():
            logger.error(f"Storage not available for campaign {campaign_id}")
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"error": "Storage not configured"}
            )

        object_key = storage.upload_json(
            campaign_id=campaign_id,
            data=data,
            filename=filename
        )
        
        logger.info(f"JSON uploaded successfully: campaign={campaign_id}, key={object_key}")

        return {
            "success": True,
            "object_key": object_key
        }

    except Exception as e:
        logger.error(f"Upload JSON failed: campaign={campaign_id}, file={filename}, error={e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to upload JSON: {str(e)}"}
        )


@router.post("/campaigns/{campaign_id}/finalize")
async def finalize_campaign(
    campaign_id: str,
    metadata: Dict[str, Any]
) -> Dict[str, Any]:
    """Finalize campaign upload (update metadata with completion info)."""
    logger.info(f"Campaign finalized request received: {campaign_id}")
    logger.info(f"Metadata: product_title={metadata.get('product_title', 'N/A')}, status={metadata.get('status', 'N/A')}")

    try:
        storage = get_storage()
        if not storage.is_available():
            logger.error(f"Storage not available for finalize: {campaign_id}")
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"error": "Storage not configured"}
            )

        # Update metadata
        metadata_key = storage.upload_json(
            campaign_id=campaign_id,
            data=metadata,
            filename="metadata.json"
        )
        
        logger.info(f"Campaign finalized successfully: {campaign_id}")
        logger.info(f"Metadata uploaded: {metadata_key}")
        logger.info(f"Object keys: {metadata.get('object_keys', [])}")

        return {
            "success": True,
            "campaign_id": campaign_id,
            "metadata_key": metadata_key
        }

    except Exception as e:
        logger.error(f"Finalize campaign failed: {campaign_id}, error={e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to finalize campaign: {str(e)}"}
        )


@router.get("/campaigns/{campaign_id}/download")
async def download_campaign_zip(campaign_id: str) -> StreamingResponse:
    """Download all campaign assets as a ZIP file."""
    logger.info(f"Downloading campaign as ZIP: {campaign_id}")

    try:
        storage = get_storage()
        if not storage.is_available():
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"error": "Storage not configured"}
            )

        # Get campaign data
        campaign = storage.get_campaign(campaign_id)
        if not campaign:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"error": "Campaign not found"}
            )

        # Create ZIP in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Add metadata
            metadata_content = json.dumps(campaign['metadata'], indent=2)
            zip_file.writestr("metadata.json", metadata_content)

            # Add all objects
            for object_key, obj_info in campaign['objects'].items():
                # Download and add to ZIP
                try:
                    content = storage.download_object(object_key)
                    # Extract relative path within campaign folder
                    relative_path = object_key.split(f"{campaign_id}/", 1)[-1]
                    zip_file.writestr(relative_path, content)
                except Exception as e:
                    logger.warning(f"Failed to add {object_key} to ZIP: {e}")
                    continue

        zip_buffer.seek(0)

        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename=campaign_{campaign_id}.zip"
            }
        )

    except Exception as e:
        logger.error(f"Download campaign ZIP failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to download campaign: {str(e)}"}
        )


@router.get("/presigned-url/{object_key:path}")
async def get_presigned_url(
    object_key: str,
    expiry: int = Query(default=3600, ge=60, le=86400)
) -> Dict[str, Any]:
    """Generate a presigned URL for an object."""
    logger.info(f"Generating presigned URL for: {object_key}")

    try:
        storage = get_storage()
        if not storage.is_available():
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"error": "Storage not configured"}
            )

        url = storage.generate_presigned_url(object_key, expiry_seconds=expiry)
        return {
            "url": url,
            "expires_in": expiry,
            "object_key": object_key
        }

    except Exception as e:
        logger.error(f"Generate presigned URL failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"Failed to generate presigned URL: {str(e)}"}
        )
