import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Product } from '@/types/product';

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const MODEL = "llama-3.1-8b-instant";

function validateJson(jsonStr: string): any {
  try {
    return JSON.parse(jsonStr);
  } catch {
    const match = jsonStr.match(/\{.*\}/s);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function buildProductInfo(product: Product): string {
  return `Product: ${product.title}
Price: ${product.price || 'Not specified'}
Description: ${product.description}
Key Features:
${product.features.map((f: string) => `- ${f}`).join('\n')}`;
}

function buildMarketIntelligencePrompt(product: Product, script: string): string {
  const productInfo = buildProductInfo(product);
  
  return `You are an expert AI Marketing Strategist. Analyze the following product and generate comprehensive market intelligence insights.

PRODUCT INFORMATION:
${productInfo}

EXISTING SCRIPT:
${script}

Your task: Generate detailed market intelligence that will help marketers understand:
1. Who should buy this product
2. Who are the competitors
3. What marketing angles should be used
4. What emotional hooks work
5. What platform fits best
6. Which demographics convert best
7. What makes this product unique

IMPORTANT: You must return ONLY valid JSON in the exact format specified below. No explanations, no markdown, no additional text.

Return this EXACT JSON structure:
{
  "target_audience": {
    "age": "specific age range",
    "gender": "target gender",
    "income": "income level",
    "interests": ["interest1", "interest2", "interest3"],
    "pain_points": ["pain1", "pain2", "pain3"],
    "buying_motivation": ["motivation1", "motivation2", "motivation3"]
  },
  "competitors": [
    {
      "name": "Competitor Name",
      "strength": "Their strength",
      "weakness": "Their weakness",
      "position": "Market position"
    }
  ],
  "marketing_angles": ["angle1", "angle2", "angle3", "angle4", "angle5"],
  "emotional_hooks": ["hook1", "hook2", "hook3", "hook4"],
  "recommended_platforms": [
    {
      "name": "Platform Name",
      "suitability": 85
    }
  ],
  "campaign_strategy": {
    "primary": "Primary strategy description",
    "secondary": "Secondary strategy description",
    "cta": "Recommended call-to-action"
  },
  "confidence_score": 92
}

Return ONLY the JSON. Start with { and end with }.`;
}

export async function POST(request: Request) {
  try {
    const { product, script } = await request.json();

    if (!product) {
      return NextResponse.json(
        { error: 'Product data is required' },
        { status: 400 }
      );
    }

    if (!script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: GROQ_BASE_URL,
    });

    const prompt = buildMarketIntelligencePrompt(product, script);

    // Try with retry logic
    let result = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const completion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI Marketing Strategist. Return ONLY valid JSON with no additional text or explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content?.trim();
      
      if (content) {
        result = validateJson(content);
        if (result) break;
      }
    }

    if (!result) {
      throw new Error('Failed to generate valid JSON after retries');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Market intelligence generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate market intelligence' },
      { status: 500 }
    );
  }
}
