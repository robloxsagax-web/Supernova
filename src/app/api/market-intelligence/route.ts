import { NextResponse } from 'next/server';

// Railway backend timeout (max 120s on free tier)
export const maxDuration = 120;

// Timeout for AI generation (120 seconds = 2 minutes)
const REQUEST_TIMEOUT_MS = 120000;

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL || '';

interface TimingLog {
  stage: string;
  duration_ms: number;
}

// Minimal fallback response - always valid JSON
const FALLBACK_RESPONSE = {
  target_audience: {
    age: "25-45",
    gender: "mixed",
    income: "middle-class",
    interests: ["e-commerce", "online shopping", "digital marketing"],
    pain_points: ["finding quality products", "price concerns", "shipping time"],
    buying_motivation: ["value", "quality", "convenience"]
  },
  competitors: [
    {
      name: "Generic Competitor",
      strength: "Brand recognition",
      weakness: "Higher prices",
      position: "Premium positioning"
    }
  ],
  marketing_angles: [
    "Quality assurance",
    "Best value",
    "Fast shipping",
    "Customer reviews",
    "Limited time offer"
  ],
  emotional_hooks: [
    "Trust and reliability",
    "Fear of missing out",
    "Social proof",
    "Value proposition"
  ],
  recommended_platforms: [
    { name: "Instagram", suitability: 85 },
    { name: "TikTok", suitability: 80 },
    { name: "Facebook", suitability: 75 }
  ],
  campaign_strategy: {
    primary: "Highlight unique value proposition",
    secondary: "Build trust through social proof",
    cta: "Shop now and save"
  },
  confidence_score: 50,
  _fallback: true,
  _reason: "Backend unavailable, using minimal fallback"
};

export async function POST(request: Request) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const timingLog: TimingLog[] = [];

  console.log(`[${requestId}] Market intelligence request started`);
  console.log(`[${requestId}] Backend URL: ${FASTAPI_URL}`);

  // If no backend configured, return fallback immediately (HTTP 200)
  if (!FASTAPI_URL) {
    console.warn(`[${requestId}] FastAPI URL not configured. Returning fallback response.`);
    return NextResponse.json({
      ...FALLBACK_RESPONSE,
      requestId,
      timing: [{ stage: 'no_backend', duration_ms: Date.now() - startTime }],
      totalDurationMs: Date.now() - startTime
    });
  }

  let body: unknown;
  try {
    body = await request.json();
    timingLog.push({ stage: 'parse_request', duration_ms: Date.now() - startTime });
  } catch {
    // Invalid request body - return fallback with HTTP 200 (never fail)
    console.warn(`[${requestId}] Invalid request body, returning fallback`);
    return NextResponse.json({
      ...FALLBACK_RESPONSE,
      requestId,
      timing: [{ stage: 'invalid_body', duration_ms: Date.now() - startTime }],
      totalDurationMs: Date.now() - startTime
    });
  }

  try {
    // Forward the request to FastAPI with extended timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error(`[${requestId}] Request timeout after ${REQUEST_TIMEOUT_MS}ms`);
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    const fetchStart = Date.now();
    console.log(`[${requestId}] Forwarding to FastAPI: ${FASTAPI_URL}/market-intelligence`);

    const response = await fetch(`${FASTAPI_URL}/market-intelligence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });

    const fetchDuration = Date.now() - fetchStart;
    timingLog.push({ stage: 'fastapi_response', duration_ms: fetchDuration });
    console.log(`[${requestId}] FastAPI response received in ${fetchDuration}ms, status: ${response.status}`);

    clearTimeout(timeoutId);

    // EVEN IF FastAPI returns non-200, try to parse the response
    // The FastAPI backend is designed to always return valid JSON
    const parseStart = Date.now();
    let data;
    try {
      data = await response.json();
      timingLog.push({ stage: 'parse_response', duration_ms: Date.now() - parseStart });
    } catch {
      // Failed to parse response - return fallback
      console.warn(`[${requestId}] Failed to parse FastAPI response, returning fallback`);
      return NextResponse.json({
        ...FALLBACK_RESPONSE,
        requestId,
        timing: timingLog,
        totalDurationMs: Date.now() - startTime
      });
    }

    const totalDuration = Date.now() - startTime;
    timingLog.push({ stage: 'total', duration_ms: totalDuration });

    console.log(`[${requestId}] Market intelligence generation successful`);
    console.log(`[${requestId}] Total duration: ${totalDuration}ms`);
    console.log(`[${requestId}] Timing breakdown:`, JSON.stringify(timingLog));
    
    // Always return HTTP 200 with the data (even if FastAPI returned non-200)
    return NextResponse.json({
      ...data,
      requestId,
      timing: timingLog,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] Market intelligence proxy error after ${totalDuration}ms:`, error);

    // Return fallback with HTTP 200 - NEVER return error status codes
    console.warn(`[${requestId}] Returning fallback response due to error`);
    
    const updatedFallback = {
      ...FALLBACK_RESPONSE,
      _fallback: true,
      _reason: error instanceof Error ? error.message.slice(0, 100) : 'Unknown error'
    };

    return NextResponse.json({
      ...updatedFallback,
      requestId,
      timing: [...timingLog, { stage: 'error_handled', duration_ms: Date.now() - startTime }],
      totalDurationMs: totalDuration
    });
  }
}
