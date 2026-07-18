"""Genblaze pipeline for Market Intelligence generation.

This module implements the market intelligence generation logic using Genblaze
with deepseek/deepseek-v3.2 model via OpenRouter.
"""

import json
import logging
import os
import re
import time
import traceback
from typing import Any, Dict, List

from genblaze_openai import chat

from app.repo.provider_catalog import get_market_intel_provider, get_market_intel_models

logger = logging.getLogger("api.market_intelligence_pipeline")

# Market Intelligence model configuration
MARKET_INTEL_MODEL = "deepseek/deepseek-v3.2"
MARKET_INTEL_BASE_URL = "https://openrouter.ai/api/v1"


def build_product_info(product: Dict[str, Any]) -> str:
    """Build product info string for prompts."""
    features = product.get("features", [])
    features_str = "\n".join([f"- {f}" for f in features]) if features else "No features listed"
    
    return f"""Product: {product.get('title', 'N/A')}
Price: {product.get('price', 'Not specified')}
Description: {product.get('description', 'N/A')}
Key Features:
{features_str}"""


def build_market_intelligence_prompt(product: Dict[str, Any], script: str) -> str:
    """Build market intelligence prompt for senior growth marketer analysis."""
    product_info = build_product_info(product)
    
    return f"""You are an elite AI marketing strategist combining expertise from:
- Senior DTC (Direct-to-Consumer) growth marketer
- Expert DTC consultant with 15+ years experience
- Paid ads expert (Meta Ads, Google Ads, TikTok Ads)
- TikTok organic and paid strategy specialist
- Meta Ads campaign manager
- E-commerce conversion optimization consultant

Your task: Generate comprehensive, production-quality market intelligence for a product video campaign.

PRODUCT INFORMATION:
{product_info}

EXISTING VIDEO SCRIPT:
{script}

Analyze the product and script to produce actionable intelligence that will:
1. Identify the ideal target audience with precision
2. Profile key competitors honestly
3. Surface marketing angles that will actually convert
4. Identify emotional triggers specific to this product
5. Recommend optimal platforms with suitability scores
6. Craft campaign strategies that drive measurable results
7. Generate a confidence score based on data richness

CRITICAL REQUIREMENTS:
- Think like a consultant billing $500/hour
- Be specific, not generic
- Ground analysis in the actual product features
- Consider real competitor landscape
- Focus on actionable insights, not platitudes

Return ONLY valid JSON in this exact schema:
{{
  "target_audience": {{
    "age": "specific age range (e.g., '28-42', '35-50')",
    "gender": "target gender or 'mixed'",
    "income": "income level (e.g., 'middle-class', '$75K-$150K')",
    "interests": ["interest1", "interest2", "interest3"],
    "pain_points": ["pain1", "pain2", "pain3"],
    "buying_motivation": ["motivation1", "motivation2", "motivation3"]
  }},
  "competitors": [
    {{
      "name": "Competitor Name",
      "strength": "Their actual strength in this market",
      "weakness": "Their actual weakness you can exploit",
      "position": "How they position themselves"
    }}
  ],
  "marketing_angles": ["angle1", "angle2", "angle3", "angle4", "angle5"],
  "emotional_hooks": ["hook1", "hook2", "hook3", "hook4"],
  "recommended_platforms": [
    {{
      "name": "Platform Name",
      "suitability": 85
    }}
  ],
  "campaign_strategy": {{
    "primary": "Specific primary strategy based on product analysis",
    "secondary": "Supporting secondary strategy",
    "cta": "Specific, actionable call-to-action"
  }},
  "confidence_score": 92
}}

IMPORTANT:
- Return ONLY the JSON, nothing else
- Do NOT include markdown code blocks
- Do NOT include explanations or preamble
- Do NOT use placeholders - be specific to this product
- confidence_score should be 85-99 based on how much you can confidently analyze

Return JSON now:"""


def validate_json_response(response_text: str) -> Dict[str, Any] | None:
    """Validate and parse JSON response."""
    if not response_text:
        return None
    
    # Clean the response
    cleaned = response_text.strip()
    
    # Remove markdown code blocks if present
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    
    # Remove any leading/trailing whitespace
    cleaned = cleaned.strip()
    
    # Try to find JSON object
    json_match = re.search(r'\{[\s\S]*\}', cleaned)
    if json_match:
        cleaned = json_match.group(0)
    
    try:
        data = json.loads(cleaned)
        
        # Validate required fields
        required_fields = [
            "target_audience",
            "competitors",
            "marketing_angles",
            "emotional_hooks",
            "recommended_platforms",
            "campaign_strategy",
            "confidence_score"
        ]
        
        for field in required_fields:
            if field not in data:
                logger.warning(f"Missing required field: {field}")
                return None
        
        # Validate nested structures
        audience = data.get("target_audience", {})
        required_audience_fields = ["age", "gender", "income", "interests", "pain_points", "buying_motivation"]
        for field in required_audience_fields:
            if field not in audience:
                logger.warning(f"Missing required audience field: {field}")
                return None
        
        # Validate competitors structure
        competitors = data.get("competitors", [])
        if competitors and isinstance(competitors, list):
            for comp in competitors:
                if not all(k in comp for k in ["name", "strength", "weakness", "position"]):
                    logger.warning("Competitor missing required fields")
                    return None
        
        # Validate platforms structure
        platforms = data.get("recommended_platforms", [])
        if platforms and isinstance(platforms, list):
            for platform in platforms:
                if not all(k in platform for k in ["name", "suitability"]):
                    logger.warning("Platform missing required fields")
                    return None
        
        # Validate campaign strategy
        strategy = data.get("campaign_strategy", {})
        required_strategy_fields = ["primary", "secondary", "cta"]
        for field in required_strategy_fields:
            if field not in strategy:
                logger.warning(f"Missing required strategy field: {field}")
                return None
        
        return data
        
    except json.JSONDecodeError as e:
        logger.warning(f"JSON parse error: {e}")
        return None


def generate_market_intelligence(product: Dict[str, Any], script: str) -> Dict[str, Any]:
    """Generate market intelligence using Genblaze.
    
    Args:
        product: Product information dictionary
        script: Generated video script
    
    Returns:
        Market intelligence dictionary with target audience, competitors, etc.
    
    Raises:
        ValueError: If generation fails
    """
    logger.info("=" * 60)
    logger.info("MARKET INTELLIGENCE GENERATION STARTED")
    logger.info("=" * 60)
    
    # Get provider configuration
    provider = get_market_intel_provider()
    if not provider or not provider.is_available():
        logger.error("Market Intel provider not available - OPENROUTER_API_KEY is not set or invalid")
        raise ValueError("OPENROUTER_API_KEY environment variable is not set")
    
    logger.info("=" * 50)
    logger.info("MARKET INTEL PROVIDER CONFIGURATION")
    logger.info("=" * 50)
    logger.info(f"Provider: {provider.name}")
    logger.info(f"Model: {provider.model}")
    logger.info(f"Base URL: {provider.base_url}")
    logger.info(f"Temperature: {provider.temperature}")
    logger.info("=" * 50)
    
    # Build prompt
    prompt = build_market_intelligence_prompt(product, script)
    
    # Get models to try
    models_to_try = get_market_intel_models()
    logger.info(f"Models available for generation: {models_to_try}")
    
    generation_start_time = time.time()
    last_exception = None
    
    # Try each model
    for model in models_to_try:
        model_start_time = time.time()
        logger.info(f"Attempting market intelligence with model: {model}")
        
        try:
            logger.info("Calling genblaze_openai.chat() for market intelligence...")
            
            response = chat(
                model=model,
                prompt=prompt,
                api_key=provider.api_key,
                base_url=provider.base_url,
                system="You are an elite AI marketing strategist. Return ONLY valid JSON with no explanations, markdown, or preamble.",
                temperature=provider.temperature,
                max_tokens=4000
            )
            
            model_duration = time.time() - model_start_time
            total_duration = time.time() - generation_start_time
            
            logger.info(f"genblaze_openai.chat() returned successfully with model {model}")
            logger.info(f"Response type: {type(response)}")
            logger.info(f"TIMING - OpenRouter call: {model_duration:.2f}s, Total: {total_duration:.2f}s")
            
            response_text = response.text if hasattr(response, 'text') else str(response)
            response_text = response_text.strip() if response_text else ""
            
            if not response_text:
                logger.warning(f"Empty response from model {model}, trying next...")
                continue
            
            logger.info(f"Response length: {len(response_text)} characters")
            logger.info(f"Response preview: {response_text[:200]}...")
            
            # Validate and parse JSON
            data = validate_json_response(response_text)
            
            if data:
                logger.info("=" * 60)
                logger.info("MARKET INTELLIGENCE GENERATED SUCCESSFULLY")
                logger.info("=" * 60)
                logger.info(f"Target audience: {data.get('target_audience', {}).get('age')}, {data.get('target_audience', {}).get('gender')}")
                logger.info(f"Competitors: {len(data.get('competitors', []))}")
                logger.info(f"Marketing angles: {len(data.get('marketing_angles', []))}")
                logger.info(f"Confidence score: {data.get('confidence_score')}")
                logger.info(f"Timings: model={model_duration:.2f}s, total={total_duration:.2f}s")
                logger.info("=" * 60)
                return data
            
            logger.warning(f"Invalid JSON response from model {model}, trying next...")
            
        except Exception as e:
            error_str = str(e)
            error_type = type(e).__name__
            
            logger.warning(f"Model {model} failed: {error_type} - {error_str}")
            last_exception = e
            
            # Check if this is a model not found / 404 error
            is_model_error = (
                "404" in error_str or 
                "No endpoints found" in error_str or
                "model not found" in error_str.lower() or
                "does not exist" in error_str.lower()
            )
            
            if not is_model_error:
                logger.error("Non-model error occurred, not attempting fallback")
                logger.error("=" * 60)
                logger.error("MARKET INTELLIGENCE GENERATION FAILED")
                logger.error("=" * 60)
                traceback.print_exc()
                logger.error("=" * 60)
                raise
    
    # All models failed
    logger.error("=" * 60)
    logger.error("MARKET INTELLIGENCE GENERATION FAILED - All models exhausted")
    logger.error("=" * 60)
    logger.error(f"All models tried: {models_to_try}")
    logger.error(f"Last exception: {last_exception}")
    traceback.print_exc()
    logger.error("=" * 60)
    raise last_exception or ValueError("All models failed")
