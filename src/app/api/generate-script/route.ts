import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Product } from '@/types/product';

type GenerationType = 'ad' | 'b-roll';

/**
 * Build product info string for prompts
 */
function buildProductInfo(product: Product): string {
  return `Product: ${product.title}
Price: ${product.price || 'Not specified'}
Description: ${product.description}
Key Features:
${product.features.map((feature: string) => `- ${feature}`).join('\n')}`;
}

/**
 * AD TYPE PROMPTS - High-energy, high-conversion marketing scripts
 */
function buildAdPrompt(product: Product, duration: number): string {
  const productInfo = buildProductInfo(product);

  if (duration <= 15) {
    return `You are a world-class Direct Response Copywriter. Write a punchy, high-impact 15-second video ad with exactly 4 distinct scenes.

PRODUCT INFO:
${productInfo}

RULES:
- Hook with the product name in first 2 seconds
- 35-45 words TOTAL, exactly 4 distinct scenes
- SHORT punchy sentences. No flowery language. No fluff.
- 8-12 words per scene
- Each line = one clear BENEFIT, not a feature
- End with URGENT CTA
- TikTok/Reels energy: fast, aggressive, direct

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO stage directions.

Start now - the product name "${product.title}" is your hook:`;
  }

  if (duration <= 30) {
    return `You are a world-class Direct Response Copywriter. Write a compelling 30-second video ad with exactly 7 distinct scenes.

PRODUCT INFO:
${productInfo}

RULES:
- Hook with the product name in first 2 seconds
- 75-90 words TOTAL, exactly 7 distinct scenes
- SHORT punchy sentences. No fluff.
- 10-13 words per scene
- Each line = one clear BENEFIT, not a feature
- End with urgent, irresistible CTA
- TikTok/Reels energy: aggressive and direct

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO stage directions.

Start now - the product name "${product.title}" is your hook:`;
  }

  if (duration <= 45) {
    return `You are a world-class Direct Response Copywriter. Write a high-impact 45-second video ad with exactly 10 distinct scenes.

PRODUCT INFO:
${productInfo}

RULES:
- Hook with the product name in first 2 seconds
- 110-135 words TOTAL, exactly 10 distinct scenes
- SHORT punchy sentences. No fluff.
- 11-13 words per scene
- Each line = one clear BENEFIT, not a feature
- End with powerful, urgent CTA
- TikTok/Reels energy: aggressive and direct

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO stage directions.

Start now - the product name "${product.title}" is your hook:`;
  }

  // 60 seconds
  return `You are a world-class Direct Response Copywriter. Write a massive 60-second commercial with 12-15 fast-paced scenes.

PRODUCT INFO:
${productInfo}

RULES:
- Hook with the product name in first 2 seconds
- 150-180 words TOTAL, 12-15 distinct scenes
- SHORT punchy sentences. Every word EARNs its place.
- 10-15 words per scene
- High-velocity storytelling with relentless benefits
- End with POWERFUL, urgent CTA
- TikTok/Reels energy: maximum impact, no hesitation

FORMAT: Raw script lines only, separated by newlines. NO brackets. NO labels. NO quotes. NO stage directions.

Start now - the product name "${product.title}" is your hook:`;
}

/**
 * B-ROLL TYPE PROMPTS - Organic, narrative-style storytelling
 */
function buildBRollPrompt(product: Product, duration: number): string {
  const productInfo = buildProductInfo(product);

  if (duration <= 15) {
    return `You are a TikTok storytelling expert. Write an organic, relatable 15-second b-roll script that weaves in the product naturally.

PRODUCT INFO:
${productInfo}

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

Start now:`;
  }

  if (duration <= 30) {
    return `You are a TikTok storytelling expert. Write an engaging 30-second b-roll script for Shorts with organic product integration.

PRODUCT INFO:
${productInfo}

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

Start now:`;
  }

  if (duration <= 45) {
    return `You are a TikTok storytelling expert. Write an engaging 45-second b-roll narrative with authentic product integration.

PRODUCT INFO:
${productInfo}

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

Start now:`;
  }

  // 60 seconds
  return `You are a TikTok storytelling expert. Write a compelling 60-second b-roll narrative with authentic product integration.

PRODUCT INFO:
${productInfo}

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

Start now:`;
}

/**
 * Dynamic script generation based on type and duration
 */
function buildScriptPrompt(product: Product, duration: number = 30, type: GenerationType = 'ad'): string {
  if (type === 'b-roll') {
    return buildBRollPrompt(product, duration);
  }
  return buildAdPrompt(product, duration);
}

/**
 * Get system prompt based on generation type
 */
function getSystemPrompt(type: GenerationType): string {
  if (type === 'b-roll') {
    return 'You are a TikTok storytelling expert. Write organic, narrative-style scripts that feel authentic and native to TikTok/Shorts. Focus on storytelling, relatable hooks, and natural product integration. NO aggressive selling. NO pushy CTAs. Write ONLY raw speakable words - no labels, no brackets, no quotes.';
  }
  return 'You are a world-class Direct Response Copywriter. Your goal is to write high-conversion video ads. Write ONLY pure speakable words - no labels, no brackets, no stage directions, no camera notes, no music cues, no quotes. Just aggressive, benefit-driven sales copy.';
}

export async function POST(request: Request) {
  try {
    const { product, duration = 30, generationType = 'ad' } = await request.json();

    // Validate generation type
    const type: GenerationType = (generationType === 'b-roll' ? 'b-roll' : 'ad');

    if (!product) {
      return NextResponse.json(
        { error: 'Product data is required' },
        { status: 400 }
      );
    }

    // Validate product data
    if (!product.title || !product.description) {
      return NextResponse.json(
        { error: 'Product must have a title and description' },
        { status: 400 }
      );
    }

    // Get OpenAI API key for Alibaba Cloud Qwen
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client with Alibaba Cloud Qwen base URL
    const client = new OpenAI({
      baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
      apiKey: apiKey,
    });

    // Build dynamic prompt based on type and duration
    const prompt = buildScriptPrompt(product, duration, type);
    const systemPrompt = getSystemPrompt(type);
    
    // Adjust max_tokens based on duration
    const maxTokens = duration <= 15 ? 300 : duration <= 30 ? 500 : duration <= 45 ? 750 : 1000;

    // Generate script using Alibaba Cloud Qwen model
    const completion = await client.chat.completions.create({
      model: 'Qwen-Turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const script = completion.choices?.[0]?.message?.content;

    if (!script) {
      throw new Error('Failed to generate script');
    }

    // Return backward-compatible JSON structure
    return NextResponse.json({ 
      script,
      generationType: type // Include type in response for transparency
    });
  } catch (error) {
    console.error('Script generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate script' },
      { status: 500 }
    );
  }
}
