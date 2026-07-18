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

export async function POST(request: Request) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const timingLog: TimingLog[] = [];

  console.log(`[${requestId}] Market intelligence request started`);
  console.log(`[${requestId}] Backend URL: ${FASTAPI_URL}`);

  if (!FASTAPI_URL) {
    console.error(`[${requestId}] FastAPI URL not configured. Set NEXT_PUBLIC_API_URL or FASTAPI_URL environment variable.`);
    return NextResponse.json(
      { 
        error: 'Backend unavailable. Please contact support.',
        code: 'BACKEND_NOT_CONFIGURED',
        requestId 
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
    timingLog.push({ stage: 'parse_request', duration_ms: Date.now() - startTime });
  } catch {
    return NextResponse.json(
      { 
        error: 'Invalid request body',
        code: 'INVALID_REQUEST',
        requestId 
      },
      { status: 400 }
    );
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

    // Handle different error types with detailed responses
    if (!response.ok) {
      let errorDetail = 'Failed to generate market intelligence';
      let errorCode = 'GENERATION_FAILED';

      try {
        const error = await response.json();
        errorDetail = error.detail || error.message || errorDetail;
        errorCode = error.code || errorCode;
      } catch {
        // Response body is not JSON or empty
      }

      // Map HTTP status codes to error codes
      const statusCodeMap: Record<number, string> = {
        400: 'INVALID_REQUEST',
        401: 'AUTHENTICATION_ERROR',
        403: 'FORBIDDEN',
        404: 'ENDPOINT_NOT_FOUND',
        408: 'REQUEST_TIMEOUT',
        422: 'VALIDATION_ERROR',
        429: 'RATE_LIMITED',
        500: 'INTERNAL_ERROR',
        502: 'BAD_GATEWAY',
        503: 'SERVICE_UNAVAILABLE',
        504: 'GATEWAY_TIMEOUT',
      };

      const totalDuration = Date.now() - startTime;
      console.error(`[${requestId}] Error response: ${response.status} - ${errorDetail}`);
      console.error(`[${requestId}] Total duration: ${totalDuration}ms`);
      console.error(`[${requestId}] Timing breakdown:`, JSON.stringify(timingLog));

      return NextResponse.json(
        { 
          error: errorDetail,
          code: statusCodeMap[response.status] || errorCode,
          status: response.status,
          requestId,
          timing: timingLog,
          totalDurationMs: totalDuration
        },
        { status: response.status }
      );
    }

    const parseStart = Date.now();
    const data = await response.json();
    timingLog.push({ stage: 'parse_response', duration_ms: Date.now() - parseStart });

    const totalDuration = Date.now() - startTime;
    timingLog.push({ stage: 'total', duration_ms: totalDuration });

    console.log(`[${requestId}] Market intelligence generation successful`);
    console.log(`[${requestId}] Total duration: ${totalDuration}ms`);
    console.log(`[${requestId}] Timing breakdown:`, JSON.stringify(timingLog));
    
    return NextResponse.json({
      ...data,
      requestId,
      timing: timingLog,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] Market intelligence proxy error after ${totalDuration}ms:`, error);

    let errorMessage = 'Backend unavailable. Please try again later.';
    let errorCode = 'BACKEND_ERROR';
    let statusCode = 503;

    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        errorMessage = `Request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds. The AI generation is taking longer than expected.`;
        errorCode = 'REQUEST_TIMEOUT';
        statusCode = 504;
        console.error(`[${requestId}] Timeout error detected`);
      } else if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Network error connecting to backend. Please check your connection.';
        errorCode = 'NETWORK_ERROR';
        statusCode = 503;
        console.error(`[${requestId}] Network error detected`);
      }
    }

    console.error(`[${requestId}] Timing breakdown:`, JSON.stringify(timingLog));

    return NextResponse.json(
      { 
        error: errorMessage,
        code: errorCode,
        requestId,
        timing: timingLog,
        totalDurationMs: totalDuration
      },
      { status: statusCode }
    );
  }
}
