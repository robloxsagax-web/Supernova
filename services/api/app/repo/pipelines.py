"""Genblaze pipelines for script generation.

This module implements the script generation logic using Genblaze.
"""

import logging
import os
import time
import traceback
from typing import Any, Dict, Literal

from genblaze_openai import chat

from app.repo.provider_catalog import get_default_provider, get_available_models

logger = logging.getLogger("api.pipelines")


def log_genblaze_context(provider) -> None:
    """Log detailed context about the Genblaze configuration."""
    logger.info("=== GENBLAZE CONTEXT ===")
    logger.info(f"Provider: {provider.name if provider else 'None'}")
    logger.info(f"Model: {provider.model if provider else 'N/A'}")
    logger.info(f"Base URL: {provider.base_url if provider else 'N/A'}")
    logger.info(f"Temperature: {provider.temperature if provider else 'N/A'}")
    logger.info(f"OPENROUTER_API_KEY exists: {bool(os.environ.get('OPENROUTER_API_KEY'))}")
    logger.info(f"OPENROUTER_API_KEY prefix: {os.environ.get('OPENROUTER_API_KEY', '')[:10] if os.environ.get('OPENROUTER_API_KEY') else 'NOT SET'}...")
    logger.info("=========================")


def build_product_info(product: Dict[str, Any]) -> str:
    """Build product info string for prompts."""
    features = product.get("features", [])
    features_str = "\n".join([f"- {f}" for f in features]) if features else "No features listed"
    
    return f"""Product: {product.get('title', 'N/A')}
Price: {product.get('price', 'Not specified')}
Description: {product.get('description', 'N/A')}
Key Features:
{features_str}"""


def build_ad_prompt(product: Dict[str, Any], duration: int) -> str:
    """Build ad-type prompt based on duration."""
    product_info = build_product_info(product)
    title = product.get("title", "the product")
    
    if duration <= 15:
        return f"""You are a world-class Direct Response Copywriter. Write a punchy, high-impact 15-second video ad with exactly 4 distinct scenes.

PRODUCT INFO:
{product_info}

RULES:
- Hook with the product name in first 2 seconds
- 35-45 words TOTAL, exactly 4 distinct scenes
- SHORT punchy sentences. No flowery language. No fluff.
- 8-12 words per scene
- Each line = one clear BENEFIT, not a feature
- End with URGENT CTA
- TikTok/Reels energy: fast, aggressive, direct

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO stage directions.

Start now - the product name "{title}" is your hook:"""
    
    if duration <= 30:
        return f"""You are a world-class Direct Response Copywriter. Write a compelling 30-second video ad with exactly 7 distinct scenes.

PRODUCT INFO:
{product_info}

RULES:
- Hook with the product name in first 2 seconds
- 75-90 words TOTAL, exactly 7 distinct scenes
- SHORT punchy sentences. No fluff.
- 10-13 words per scene
- Each line = one clear BENEFIT, not a feature
- End with urgent, irresistible CTA
- TikTok/Reels energy: aggressive and direct

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO stage directions.

Start now - the product name "{title}" is your hook:"""
    
    if duration <= 45:
        return f"""You are a world-class Direct Response Copywriter. Write a high-impact 45-second video ad with exactly 10 distinct scenes.

PRODUCT INFO:
{product_info}

RULES:
- Hook with the product name in first 2 seconds
- 110-135 words TOTAL, exactly 10 distinct scenes
- SHORT punchy sentences. No fluff.
- 11-13 words per scene
- Each line = one clear BENEFIT, not a feature
- End with powerful, urgent CTA
- TikTok/Reels energy: aggressive and direct

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO stage directions.

Start now - the product name "{title}" is your hook:"""
    
    # 60 seconds
    return f"""You are a world-class Direct Response Copywriter. Write a massive 60-second commercial with 12-15 fast-paced scenes.

PRODUCT INFO:
{product_info}

RULES:
- Hook with the product name in first 2 seconds
- 150-180 words TOTAL, 12-15 distinct scenes
- SHORT punchy sentences. Every word EARNs its place.
- 10-15 words per scene
- High-velocity storytelling with relentless benefits
- End with POWERFUL, urgent CTA
- TikTok/Reels energy: maximum impact, no hesitation

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO stage directions.

Start now - the product name "{title}" is your hook:"""


def build_broll_prompt(product: Dict[str, Any], duration: int) -> str:
    """Build b-roll type prompt based on duration."""
    product_info = build_product_info(product)
    
    if duration <= 15:
        return f"""You are a TikTok storytelling expert. Write an organic, relatable 15-second b-roll script that weaves in the product naturally.

PRODUCT INFO:
{product_info}

STYLE:
- Story-driven, not salesy
- Relatable hook that solves a problem
- Natural product mention (NOT a hard sell)
- Educational or entertaining value
- 35-45 words TOTAL

STRUCTURE:
1. Hook: Relatable pain point or question (first 3 seconds)
2. Context: Quick relatable moment
3. Product mention: Weave it in naturally, like a friend recommending
4. Value: End with useful tip or relatable insight

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO aggressive selling. NO CTAs.

Start now:"""
    
    if duration <= 30:
        return f"""You are a TikTok storytelling expert. Write an engaging 30-second b-roll script for Shorts with organic product integration.

PRODUCT INFO:
{product_info}

STYLE:
- Storytelling that feels authentic and native to TikTok
- Build curiosity and value first
- Product woven in naturally, like a genuine recommendation
- 75-90 words TOTAL

STRUCTURE:
1. Hook: Grab attention with relatable moment or question (3 seconds)
2. Build: Create curiosity or provide value (15 seconds)
3. Product: Mention naturally, not as an ad (8 seconds)
4. Value: Leave viewer with useful insight or feel-good moment (4 seconds)

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO hard selling. NO aggressive CTAs.

Start now:"""
    
    if duration <= 45:
        return f"""You are a TikTok storytelling expert. Write an engaging 45-second b-roll narrative with authentic product integration.

PRODUCT INFO:
{product_info}

STYLE:
- Deep, organic storytelling that builds genuine connection
- Product woven in naturally, like a genuine friend recommendation
- Educational or inspirational value throughout
- 110-135 words TOTAL

STRUCTURE:
1. Hook: Powerful relatable opening (4 seconds) - grab attention with a question or relatable pain point
2. Build: Create curiosity and provide value (25 seconds) - build narrative around problem/solution
3. Product: Hero moment (10 seconds) - show product solving the problem naturally
4. Takeaway: Inspiring or actionable insight (6 seconds) - leave viewer with useful tip

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO aggressive selling. NO pushy CTAs.

Start now:"""
    
    # 60 seconds
    return f"""You are a TikTok storytelling expert. Write a compelling 60-second b-roll narrative with authentic product integration.

PRODUCT INFO:
{product_info}

STYLE:
- Deep storytelling that builds genuine connection
- Product is the hero, not the star
- Educational or inspirational value throughout
- 150-180 words TOTAL

STRUCTURE:
1. Hook: Powerful relatable opening (5 seconds)
2. Story: Build narrative around the problem/solution (30 seconds)
3. Product: Hero moment - show it solving the problem naturally (15 seconds)
4. Value: End with inspiring takeaway or actionable insight (10 seconds)

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO aggressive selling. NO pushy CTAs.

Start now:"""


def build_script_prompt(product: Dict[str, Any], duration: int = 30, gen_type: Literal["ad", "b-roll"] = "ad") -> str:
    """Build the complete script prompt based on type and duration."""
    if gen_type == "b-roll":
        return build_broll_prompt(product, duration)
    return build_ad_prompt(product, duration)


def get_system_prompt(gen_type: Literal["ad", "b-roll"]) -> str:
    """Get system prompt based on generation type."""
    if gen_type == "b-roll":
        return "You are a TikTok storytelling expert. Write organic, narrative-style scripts that feel authentic and native to TikTok/Shorts. Focus on storytelling, relatable hooks, and natural product integration. NO aggressive selling. NO pushy CTAs. Write ONLY raw speakable words - no labels, no brackets, no quotes."
    return "You are a world-class Direct Response Copywriter. Your goal is to write high-conversion video ads. Write ONLY pure speakable words - no labels, no brackets, no stage directions, no camera notes, no music cues, no quotes. Just aggressive, benefit-driven sales copy."


def calculate_max_tokens(duration: int) -> int:
    """Calculate max tokens based on duration."""
    if duration <= 15:
        return 300
    if duration <= 30:
        return 500
    if duration <= 45:
        return 750
    return 1000


def generate_script(product: Dict[str, Any], duration: int = 30, generation_type: str = "ad") -> str:
    """Generate a marketing script using Genblaze.
    
    Args:
        product: Product information dictionary
        duration: Video duration in seconds (15, 30, 45, or 60)
        generation_type: Type of script ('ad' or 'b-roll')
    
    Returns:
        Generated script string
    """
    # Get provider configuration
    provider = get_default_provider()
    if not provider or not provider.is_available():
        logger.error("Provider not available - OPENROUTER_API_KEY is not set or invalid")
        log_genblaze_context(provider)
        raise ValueError("OPENROUTER_API_KEY environment variable is not set")
    
    # Log configuration context
    log_genblaze_context(provider)
    provider.log_config()
    
    # Normalize generation type
    gen_type: Literal["ad", "b-roll"] = "b-roll" if generation_type == "b-roll" else "ad"
    
    # Build prompts
    prompt = build_script_prompt(product, duration, gen_type)
    system_prompt = get_system_prompt(gen_type)
    
    # Calculate max tokens
    max_tokens = calculate_max_tokens(duration)
    
    logger.info("Generating script", extra={
        "duration": duration,
        "generation_type": gen_type,
        "model": provider.model,
        "max_tokens": max_tokens,
        "base_url": provider.base_url
    })
    
    # Get list of models to try
    models_to_try = get_available_models()
    logger.info(f"Models available for fallback: {models_to_try}")
    
    last_exception = None
    generation_start_time = time.time()
    
    # Try each model in order
    for model in models_to_try:
        model_start_time = time.time()
        logger.info(f"Attempting to generate script with model: {model}")
        
        try:
            logger.info("Calling genblaze_openai.chat()...")
            
            response = chat(
                model=model,
                prompt=prompt,
                api_key=provider.api_key,
                base_url=provider.base_url,
                system=system_prompt,
                temperature=provider.temperature,
                max_tokens=max_tokens
            )
            
            model_duration = time.time() - model_start_time
            total_duration = time.time() - generation_start_time
            
            logger.info(f"genblaze_openai.chat() returned successfully with model {model}")
            logger.info(f"Response type: {type(response)}")
            logger.info(f"TIMING - OpenRouter call: {model_duration:.2f}s, Total generation: {total_duration:.2f}s")
            
            script = response.text if hasattr(response, 'text') else str(response)
            script = script.strip() if script else ""
            
            if not script:
                logger.warning(f"Empty response from model {model}, trying next model...")
                continue
            
            logger.info("Script generated successfully", extra={
                "script_length": len(script),
                "model_used": model,
                "script_preview": script[:100] + "..." if len(script) > 100 else script,
                "timing": {
                    "openrouter_duration_s": round(model_duration, 2),
                    "total_duration_s": round(total_duration, 2),
                    "models_tried": len([m for m in models_to_try if m != model])
                }
            })
            
            return script
            
        except Exception as e:
            error_str = str(e)
            error_type = type(e).__name__
            
            logger.warning(f"Model {model} failed: {error_type} - {error_str}")
            last_exception = e
            
            # Check if this is a model not found / 404 error that should trigger fallback
            is_model_error = (
                "404" in error_str or 
                "No endpoints found" in error_str or
                "model not found" in error_str.lower() or
                "does not exist" in error_str.lower()
            )
            
            if not is_model_error:
                # Non-model error (auth, rate limit, etc.) - don't try other models
                logger.error("Non-model error occurred, not attempting fallback")
                logger.error("=" * 60)
                logger.error("SCRIPT GENERATION FAILED (non-model error)")
                logger.error("=" * 60)
                logger.error(f"Exception type: {error_type}")
                logger.error(f"Exception message: {error_str}")
                logger.error("Full traceback:")
                traceback.print_exc()
                logger.error("=" * 60)
                raise
    
    # All models failed
    logger.error("=" * 60)
    logger.error("SCRIPT GENERATION FAILED - All models exhausted")
    logger.error("=" * 60)
    logger.error(f"All models tried: {models_to_try}")
    logger.error(f"Last exception type: {type(last_exception).__name__}")
    logger.error(f"Last exception message: {str(last_exception)}")
    logger.error("Full traceback of last exception:")
    traceback.print_exc()
    logger.error("=" * 60)
    raise last_exception or ValueError("All models failed")
