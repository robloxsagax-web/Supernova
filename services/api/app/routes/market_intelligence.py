"""Market Intelligence generation route using Genblaze.

ALWAYS returns HTTP 200 with valid JSON. The pipeline never fails.
"""

import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.repo.market_intelligence_pipeline import generate_market_intelligence, get_minimal_market_intelligence
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
    """Market Intelligence response model - ALWAYS valid JSON."""
    target_audience: TargetAudience
    competitors: list[Competitor]
    marketing_angles: list[str]
    emotional_hooks: list[str]
    recommended_platforms: list[Platform]
    campaign_strategy: CampaignStrategy
    confidence_score: int
    # Optional metadata (excluded from serialization by default)
    is_fallback: Optional[bool] = Field(default=None, serialization_alias="_fallback")
    fallback_reason: Optional[str] = Field(default=None, serialization_alias="_reason")
    all_models_failed: Optional[bool] = Field(default=None, serialization_alias="_all_models_failed")
    
    class Config:
        populate_by_name = True


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
    
    NEVER FAILS - Always returns HTTP 200 with valid JSON.
    Even if all models fail, returns a minimal valid object.
    
    Args:
        request: Market Intelligence request with product and script
    
    Returns:
        MarketIntelligenceResponse with generated intelligence (always valid)
    """
    logger.info(f"Received market intelligence request for product: {request.product.title}")
    
    try:
        # Generate market intelligence - NEVER throws
        result = generate_market_intelligence(
            product=request.product.model_dump(),
            script=request.script
        )
        
        logger.info(f"Market intelligence response ready")
        logger.info(f"Confidence score: {result.get('confidence_score')}")
        
        # Check if this is a fallback response
        if result.get("_fallback") or result.get("_all_models_failed"):
            logger.warning(f"Returning fallback market intelligence (confidence: {result.get('confidence_score')})")
        
        return MarketIntelligenceResponse(
            target_audience=TargetAudience(**result["target_audience"]),
            competitors=[Competitor(**c) for c in result["competitors"]],
            marketing_angles=result["marketing_angles"],
            emotional_hooks=result["emotional_hooks"],
            recommended_platforms=[Platform(**p) for p in result["recommended_platforms"]],
            campaign_strategy=CampaignStrategy(**result["campaign_strategy"]),
            confidence_score=result["confidence_score"]
        )
        
    except Exception as e:
        # ABSOLUTE FINAL FALLBACK - Never return HTTP 400 or HTTP 500
        # This ensures the API NEVER fails because of JSON parsing issues
        logger.error(f"Unexpected error in market intelligence endpoint: {e}")
        logger.warning("Returning minimal valid market intelligence as absolute fallback")
        
        # Generate minimal fallback with product info
        minimal = get_minimal_market_intelligence(request.product.model_dump())
        minimal["_fallback"] = True
        minimal["_reason"] = f"Exception fallback: {str(e)[:100]}"
        
        return MarketIntelligenceResponse(
            target_audience=TargetAudience(**minimal["target_audience"]),
            competitors=[Competitor(**c) for c in minimal["competitors"]],
            marketing_angles=minimal["marketing_angles"],
            emotional_hooks=minimal["emotional_hooks"],
            recommended_platforms=[Platform(**p) for p in minimal["recommended_platforms"]],
            campaign_strategy=CampaignStrategy(**minimal["campaign_strategy"]),
            confidence_score=minimal["confidence_score"]
        )
