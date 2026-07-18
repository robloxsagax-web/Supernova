"""Market Intelligence generation route using Genblaze."""

import logging
import traceback
from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.repo.market_intelligence_pipeline import generate_market_intelligence
from app.repo.provider_catalog import get_market_intel_provider

logger = logging.getLogger("api.routes.market_intelligence")

router = APIRouter(prefix="/market-intelligence", tags=["market-intelligence"])


class Product(BaseModel):
    """Product data model."""
    title: str
    description: str
    price: Optional[str] = None
    features: list[str] = Field(default_factory=list)


class MarketIntelligenceRequest(BaseModel):
    """Market Intelligence generation request model."""
    product: Product
    script: str


class TargetAudience(BaseModel):
    """Target audience data model."""
    age: str
    gender: str
    income: str
    interests: list[str]
    pain_points: list[str]
    buying_motivation: list[str]


class Competitor(BaseModel):
    """Competitor data model."""
    name: str
    strength: str
    weakness: str
    position: str


class Platform(BaseModel):
    """Recommended platform data model."""
    name: str
    suitability: int


class CampaignStrategy(BaseModel):
    """Campaign strategy data model."""
    primary: str
    secondary: str
    cta: str


class MarketIntelligenceResponse(BaseModel):
    """Market Intelligence response model."""
    target_audience: TargetAudience
    competitors: list[Competitor]
    marketing_angles: list[str]
    emotional_hooks: list[str]
    recommended_platforms: list[Platform]
    campaign_strategy: CampaignStrategy
    confidence_score: int


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint for the market intelligence service."""
    provider = get_market_intel_provider()
    return {
        "status": "ok",
        "provider": "Genblaze",
        "model": provider.model if provider else "unknown"
    }


@router.post("", response_model=MarketIntelligenceResponse)
async def generate_market_intelligence_endpoint(request: MarketIntelligenceRequest) -> MarketIntelligenceResponse:
    """Generate market intelligence using Genblaze.
    
    Args:
        request: Market Intelligence request with product and script
    
    Returns:
        MarketIntelligenceResponse with generated intelligence
    
    Raises:
        HTTPException: If generation fails
    """
    logger.info(f"Received market intelligence request for product: {request.product.title}")
    logger.info(f"Script length: {len(request.script)} characters")
    
    try:
        # Validate product
        if not request.product.title or not request.product.description:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product must have a title and description"
            )
        
        if not request.script:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Script is required for market intelligence"
            )
        
        # Generate market intelligence
        result = generate_market_intelligence(
            product=request.product.model_dump(),
            script=request.script
        )
        
        logger.info(f"Market intelligence generated successfully")
        logger.info(f"Target audience: {result.get('target_audience', {}).get('age')}")
        logger.info(f"Competitors: {len(result.get('competitors', []))}")
        logger.info(f"Marketing angles: {len(result.get('marketing_angles', []))}")
        logger.info(f"Confidence score: {result.get('confidence_score')}")
        
        return MarketIntelligenceResponse(
            target_audience=TargetAudience(**result["target_audience"]),
            competitors=[Competitor(**c) for c in result["competitors"]],
            marketing_angles=result["marketing_angles"],
            emotional_hooks=result["emotional_hooks"],
            recommended_platforms=[Platform(**p) for p in result["recommended_platforms"]],
            campaign_strategy=CampaignStrategy(**result["campaign_strategy"]),
            confidence_score=result["confidence_score"]
        )
        
    except ValueError as e:
        logger.error("=" * 60)
        logger.error("VALIDATION ERROR in market intelligence route")
        logger.error("=" * 60)
        logger.error(f"Exception type: {type(e).__name__}")
        logger.error(f"Exception message: {str(e)}")
        logger.error("Full traceback:")
        traceback.print_exc()
        logger.error("=" * 60)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error("=" * 60)
        logger.error("MARKET INTELLIGENCE GENERATION ERROR in route")
        logger.error("=" * 60)
        logger.error(f"Exception type: {type(e).__name__}")
        logger.error(f"Exception message: {str(e)}")
        logger.error(f"Exception module: {type(e).__module__}")
        logger.error("Full traceback:")
        traceback.print_exc()
        
        # Log request details for debugging
        logger.error("Request details:")
        logger.error(f"  Product title: {request.product.title}")
        logger.error(f"  Product description length: {len(request.product.description)}")
        logger.error(f"  Script length: {len(request.script)}")
        
        logger.error("=" * 60)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate market intelligence"
        )
