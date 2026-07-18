import { NextResponse } from 'next/server';

// Railway backend timeout
export const maxDuration = 120;
const REQUEST_TIMEOUT_MS = 120000;

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL || '';

interface TimingLog {
  stage: string;
  duration_ms: number;
}

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const timingLog: TimingLog[] = [];

  console.log(`[${requestId}] Storage health check`);

  if (!FASTAPI_URL) {
    return NextResponse.json(
      { 
        error: 'Backend unavailable',
        code: 'BACKEND_NOT_CONFIGURED',
        requestId 
      },
      { status: 503 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    const response = await fetch(`${FASTAPI_URL}/storage/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const totalDuration = Date.now() - startTime;
      return NextResponse.json(
        { 
          error: 'Storage service unavailable',
          requestId,
          totalDurationMs: totalDuration
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const totalDuration = Date.now() - startTime;

    return NextResponse.json({
      ...data,
      requestId,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] Storage health check failed:`, error);

    let errorMessage = 'Storage service unavailable';
    let statusCode = 503;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out';
        statusCode = 504;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        code: 'STORAGE_ERROR',
        requestId,
        totalDurationMs: totalDuration
      },
      { status: statusCode }
    );
  }
}
