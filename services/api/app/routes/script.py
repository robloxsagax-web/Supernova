"""Script generation route using Genblaze."""

import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.repo.pipelines import generate_script
from app.repo.provider_catalog import get_default_provider

logger = logging.getLogger("api.routes.script")

router = APIRouter(prefix="/script", tags=["script"])


class Product(BaseModel):
    """Product data model."""
    title: str
    description: str
    price: Optional[str] = None
    features: list[str] = Field(default_factory=list)


class ScriptRequest(BaseModel):
    """Script generation request model."""
    product: Product
    duration: int = Field(default=30, ge=1, le=120)
    generationType: str = Field(default="ad")


class ScriptResponse(BaseModel):
    """Script generation response model."""
    script: str
    generationType: str


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint for the script generation service."""
    provider = get_default_provider()
    return {
        "status": "ok",
        "provider": "Genblaze",
        "model": provider.model if provider else "qwen/qwen-turbo"
    }


@router.post("", response_model=ScriptResponse)
async def generate_script_endpoint(request: ScriptRequest) -> ScriptResponse:
    """Generate a marketing script using Genblaze.
    
    Args:
        request: Script generation request with product, duration, and generation type
    
    Returns:
        ScriptResponse with generated script
    
    Raises:
        HTTPException: If generation fails
    """
    try:
        # Validate product
        if not request.product.title or not request.product.description:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product must have a title and description"
            )
        
        # Generate script
        script = generate_script(
            product=request.product.model_dump(),
            duration=request.duration,
            generation_type=request.generationType
        )
        
        return ScriptResponse(
            script=script,
            generationType=request.generationType
        )
        
    except ValueError as e:
        logger.error("Validation error", extra={"error": str(e)})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error("Script generation failed", extra={"error": str(e)})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate script"
        )
