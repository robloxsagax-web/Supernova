"""
Script Generation API using Genblaze with OpenRouter

Vercel Python Function for generating marketing scripts.
Uses Genblaze's genblaze_openai.chat() for script generation.
"""

import json
import os
from typing import Any, Literal, Optional

from genblaze_openai import chat


# Configuration
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL = "qwen/qwen-turbo"
TEMPERATURE = 0.7


def handler(request: Any) -> dict:
    """
    Main handler for the Genblaze script generation route.
    Compatible with Vercel Python runtime.
    """
    
    # Handle GET requests for health check
    if request.method == "GET":
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "status": "ok",
                "provider": "Genblaze",
                "model": MODEL
            })
        }
    
    # Handle POST requests for script generation
    if request.method == "POST":
        return generate_script(request)
    
    # Method not allowed
    return {
        "statusCode": 405,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"error": "Method not allowed"})
    }


def generate_script(request: Any) -> dict:
    """Generate marketing script using Genblaze."""
    
    try:
        # Parse request body
        data = request.get_json()
        
        if not data:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Product data is required"})
            }
        
        product = data.get("product")
        duration = data.get("duration", 30)
        generation_type = data.get("generationType", "ad")
        
        # Validate product data
        if not product:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Product data is required"})
            }
        
        if not product.get("title") or not product.get("description"):
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Product must have a title and description"})
            }
        
        # Validate API key
        if not OPENROUTER_API_KEY:
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "OPENROUTER_API_KEY environment variable is not set"})
            }
        
        # Normalize generation type
        gen_type: Literal["ad", "b-roll"] = "b-roll" if generation_type == "b-roll" else "ad"
        
        # Build prompt and system message
        prompt = build_script_prompt(product, duration, gen_type)
        system_prompt = get_system_prompt(gen_type)
        
        # Calculate max tokens based on duration
        max_tokens = calculate_max_tokens(duration)
        
        # Generate script using Genblaze
        try:
            response = chat(
                model=MODEL,
                prompt=prompt,
                api_key=OPENROUTER_API_KEY,
                base_url=OPENROUTER_BASE_URL,
                system_prompt=system_prompt,
                temperature=TEMPERATURE,
                max_tokens=max_tokens
            )
        except Exception as e:
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": f"Failed to generate script: {str(e)}"})
            }
        
        # Extract script from response
        script = response.text if hasattr(response, 'text') else str(response)
        
        if not script:
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Failed to generate script"})
            }
        
        # Clean up script
        script = script.strip()
        
        # Return response matching original format exactly
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "script": script,
                "generationType": gen_type
            })
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": f"Failed to generate script: {str(e)}"})
        }


def build_product_info(product: dict) -> str:
    """Build product info string for prompts."""
    features = product.get("features", [])
    features_str = "\n".join([f"- {f}" for f in features]) if features else "No features listed"
    
    return f"""Product: {product.get('title', 'N/A')}
Price: {product.get('price', 'Not specified')}
Description: {product.get('description', 'N/A')}
Key Features:
{features_str}"""


def build_ad_prompt(product: dict, duration: int) -> str:
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


def build_broll_prompt(product: dict, duration: int) -> str:
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


def build_script_prompt(product: dict, duration: int = 30, gen_type: Literal["ad", "b-roll"] = "ad") -> str:
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
