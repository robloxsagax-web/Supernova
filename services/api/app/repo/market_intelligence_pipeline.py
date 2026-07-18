"""Genblaze pipeline for Market Intelligence generation.

This module implements the market intelligence generation logic using Genblaze
with deepseek/deepseek-v3.2 model via OpenRouter.

NEVER FAILS - Always returns valid JSON. Uses multiple fallback strategies:
1. JSON repair on parse failure
2. Regex extraction of JSON objects
3. Retry with different model
4. Return minimal valid object as last resort
"""

import json
import logging
import os
import re
import time
import traceback
from typing import Any, Dict, List, Optional

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

Return ONLY valid JSON in this exact schema (no markdown, no explanation):
{{
  "target_audience": {{
    "age": "specific age range",
    "gender": "target gender or mixed",
    "income": "income level",
    "interests": ["interest1", "interest2", "interest3"],
    "pain_points": ["pain1", "pain2", "pain3"],
    "buying_motivation": ["motivation1", "motivation2", "motivation3"]
  }},
  "competitors": [
    {{
      "name": "Competitor Name",
      "strength": "Their actual strength",
      "weakness": "Their weakness",
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
    "primary": "Primary strategy",
    "secondary": "Secondary strategy",
    "cta": "Call-to-action"
  }},
  "confidence_score": 92
}}

Return JSON now:"""


def get_minimal_market_intelligence(product: Dict[str, Any]) -> Dict[str, Any]:
    """Return a minimal valid market intelligence object as fallback."""
    product_title = product.get('title', 'Unknown Product') if product else 'Unknown Product'
    
    return {
        "target_audience": {
            "age": "25-45",
            "gender": "mixed",
            "income": "middle-class",
            "interests": ["e-commerce", "online shopping", "digital marketing"],
            "pain_points": ["finding quality products", "price concerns", "shipping time"],
            "buying_motivation": ["value", "quality", "convenience"]
        },
        "competitors": [
            {
                "name": "Generic Competitor",
                "strength": "Brand recognition",
                "weakness": "Higher prices",
                "position": "Premium positioning"
            }
        ],
        "marketing_angles": [
            "Quality assurance",
            "Best value",
            "Fast shipping",
            "Customer reviews",
            "Limited time offer"
        ],
        "emotional_hooks": [
            "Trust and reliability",
            "Fear of missing out",
            "Social proof",
            "Value proposition"
        ],
        "recommended_platforms": [
            {"name": "Instagram", "suitability": 85},
            {"name": "TikTok", "suitability": 80},
            {"name": "Facebook", "suitability": 75}
        ],
        "campaign_strategy": {
            "primary": f"Highlight {product_title} unique value proposition",
            "secondary": "Build trust through social proof",
            "cta": "Shop now and save"
        },
        "confidence_score": 50,
        "_fallback": True,
        "_reason": "Generated minimal fallback due to LLM parsing issues"
    }


def repair_json(json_str: str) -> Optional[str]:
    """Attempt to repair malformed JSON."""
    if not json_str:
        return None
    
    # Remove markdown code blocks
    cleaned = json_str.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()
    
    # Common JSON issues and fixes
    fixes = [
        # Remove trailing commas
        (r',(\s*[}\]])', r'\1'),
        # Fix single quotes to double quotes (simple cases)
        (r"'([^']*)':", r'"\1":'),
        (r':\s*\'([^\']*)\'', r': "\1"'),
        # Fix unquoted property names
        (r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":'),
        # Remove comments
        (r'//.*?$', '', 0, re.MULTILINE),
        (r'/\*.*?\*/', '', 0, re.DOTALL),
    ]
    
    for fix in fixes:
        if len(fix) == 2:
            pattern, replacement = fix
            cleaned = re.sub(pattern, replacement, cleaned)
        else:
            pattern, replacement, flags = fix
            cleaned = re.sub(pattern, replacement, cleaned, flags=flags)
    
    return cleaned


def extract_json_objects(text: str) -> List[str]:
    """Extract all JSON objects/arrays from text using regex."""
    objects = []
    
    # Find JSON objects
    for match in re.finditer(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text):
        objects.append(match.group(0))
    
    # Find JSON arrays  
    for match in re.finditer(r'\[[^\[\]]*(?:\[[^\[\]]*\][^\[\]]*)*\]', text):
        objects.append(match.group(0))
    
    return objects


def try_parse_json(json_str: str) -> Optional[Dict[str, Any]]:
    """Try to parse JSON string, return None on failure."""
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return None


def validate_and_fill_schema(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate JSON has required schema and fill missing fields with defaults."""
    required_structure = {
        "target_audience": {
            "age": "25-45",
            "gender": "mixed",
            "income": "middle-class",
            "interests": ["general"],
            "pain_points": ["value"],
            "buying_motivation": ["quality"]
        },
        "competitors": [{"name": "Competitor", "strength": "N/A", "weakness": "N/A", "position": "N/A"}],
        "marketing_angles": ["quality", "value"],
        "emotional_hooks": ["trust"],
        "recommended_platforms": [{"name": "Instagram", "suitability": 75}],
        "campaign_strategy": {"primary": "General marketing", "secondary": "N/A", "cta": "Buy now"},
        "confidence_score": 70
    }
    
    result = {}
    
    # Fill in target_audience
    result["target_audience"] = {
        "age": data.get("target_audience", {}).get("age", "25-45"),
        "gender": data.get("target_audience", {}).get("gender", "mixed"),
        "income": data.get("target_audience", {}).get("income", "middle-class"),
        "interests": data.get("target_audience", {}).get("interests", ["general"]),
        "pain_points": data.get("target_audience", {}).get("pain_points", ["value"]),
        "buying_motivation": data.get("target_audience", {}).get("buying_motivation", ["quality"])
    }
    
    # Fill in competitors
    competitors = data.get("competitors", [])
    if competitors and isinstance(competitors, list):
        result["competitors"] = competitors
    else:
        result["competitors"] = required_structure["competitors"]
    
    # Fill in marketing_angles
    result["marketing_angles"] = data.get("marketing_angles", ["quality", "value"])
    if not isinstance(result["marketing_angles"], list):
        result["marketing_angles"] = ["quality", "value"]
    
    # Fill in emotional_hooks
    result["emotional_hooks"] = data.get("emotional_hooks", ["trust"])
    if not isinstance(result["emotional_hooks"], list):
        result["emotional_hooks"] = ["trust"]
    
    # Fill in recommended_platforms
    platforms = data.get("recommended_platforms", [])
    if platforms and isinstance(platforms, list):
        result["recommended_platforms"] = platforms
    else:
        result["recommended_platforms"] = required_structure["recommended_platforms"]
    
    # Fill in campaign_strategy
    result["campaign_strategy"] = data.get("campaign_strategy", required_structure["campaign_strategy"])
    if not isinstance(result["campaign_strategy"], dict):
        result["campaign_strategy"] = required_structure["campaign_strategy"]
    
    # Fill in confidence_score
    result["confidence_score"] = data.get("confidence_score", 70)
    try:
        result["confidence_score"] = int(result["confidence_score"])
    except (ValueError, TypeError):
        result["confidence_score"] = 70
    
    return result


def parse_json_response(response_text: str) -> Optional[Dict[str, Any]]:
    """Parse JSON from response text with multiple repair strategies."""
    if not response_text:
        return None
    
    # Strategy 1: Direct parse
    data = try_parse_json(response_text.strip())
    if data:
        return validate_and_fill_schema(data)
    
    # Strategy 2: Repair JSON
    repaired = repair_json(response_text)
    if repaired:
        data = try_parse_json(repaired)
        if data:
            logger.info("JSON repair successful")
            return validate_and_fill_schema(data)
    
    # Strategy 3: Extract JSON objects via regex
    json_objects = extract_json_objects(response_text)
    for obj_str in json_objects:
        data = try_parse_json(obj_str)
        if data and isinstance(data, dict):
            # Check if it's a meaningful object (has more than 3 keys)
            if len(data) >= 3:
                logger.info(f"Regex extraction successful, found {len(data)} keys")
                return validate_and_fill_schema(data)
    
    # Strategy 4: Try each extracted object
    for obj_str in json_objects:
        data = try_parse_json(obj_str)
        if data:
            logger.info(f"Regex extraction successful")
            return validate_and_fill_schema(data)
    
    return None


def generate_market_intelligence(product: Dict[str, Any], script: str) -> Dict[str, Any]:
    """Generate market intelligence using Genblaze.
    
    NEVER FAILS - Always returns valid JSON.
    Uses multiple fallback strategies for JSON parsing.
    
    Args:
        product: Product information dictionary
        script: Generated video script
    
    Returns:
        Market intelligence dictionary (always valid, never None)
    """
    logger.info("=" * 60)
    logger.info("MARKET INTELLIGENCE GENERATION STARTED")
    logger.info("=" * 60)
    
    # Get provider configuration
    provider = get_market_intel_provider()
    if not provider or not provider.is_available():
        logger.warning("Market Intel provider not available - returning minimal valid object")
        return get_minimal_market_intelligence(product)
    
    logger.info(f"Provider: {provider.name}")
    logger.info(f"Model: {provider.model}")
    logger.info(f"Base URL: {provider.base_url}")
    
    # Build prompt
    prompt = build_market_intelligence_prompt(product, script)
    
    # Get models to try
    models_to_try = get_market_intel_models()
    logger.info(f"Models to try: {models_to_try}")
    
    generation_start_time = time.time()
    
    # Try each model
    for model in models_to_try:
        model_start_time = time.time()
        logger.info(f"Trying model: {model}")
        
        try:
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
            
            response_text = ""
            if hasattr(response, 'text'):
                response_text = response.text
            elif hasattr(response, 'content'):
                response_text = response.content
            else:
                response_text = str(response)
            
            response_text = response_text.strip() if response_text else ""
            
            if not response_text:
                logger.warning(f"Empty response from {model}, trying next...")
                continue
            
            logger.info(f"Response length: {len(response_text)} chars")
            
            # Try parsing with all repair strategies
            data = parse_json_response(response_text)
            
            if data:
                logger.info("=" * 60)
                logger.info("MARKET INTELLIGENCE GENERATED SUCCESSFULLY")
                logger.info("=" * 60)
                logger.info(f"Target audience: {data.get('target_audience', {}).get('age')}")
                logger.info(f"Confidence score: {data.get('confidence_score')}")
                logger.info(f"Timings: model={model_duration:.2f}s, total={total_duration:.2f}s")
                logger.info("=" * 60)
                return data
            
            logger.warning(f"Could not parse valid JSON from {model}, trying next...")
            
        except Exception as e:
            error_str = str(e)
            error_type = type(e).__name__
            
            logger.warning(f"Model {model} failed: {error_type} - {error_str}")
            
            # Check if model not found - skip to next
            is_model_error = any(x in error_str.lower() for x in [
                "404", "model not found", "does not exist", "no endpoints found"
            ])
            
            if is_model_error:
                logger.info(f"Model {model} not available, trying next...")
                continue
            
            # For other errors, continue to next model
            logger.warning(f"Non-fatal error from {model}: {error_str}")
            continue
    
    # All models failed or couldn't parse - return minimal valid object
    logger.warning("=" * 60)
    logger.warning("ALL MODELS FAILED OR COULD NOT PARSE - Returning minimal valid object")
    logger.warning("This ensures the pipeline continues without blocking the user")
    logger.warning("=" * 60)
    
    minimal = get_minimal_market_intelligence(product)
    minimal["_all_models_failed"] = True
    minimal["_reason"] = "All models failed or returned unparseable JSON"
    
    return minimal
