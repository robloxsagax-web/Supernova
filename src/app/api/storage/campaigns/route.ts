import { NextResponse } from 'next/server';

// Railway backend timeout
export const maxDuration = 120;
const REQUEST_TIMEOUT_MS = 120000;

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL || '';

interface TimingLog {
  stage: string;
  duration_ms: number;
}

// GET /api/storage/campaigns - List all campaigns
export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const timingLog: TimingLog[] = [];

  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const aiProvider = searchParams.get('aiProvider') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const maxResults = parseInt(searchParams.get('maxResults') || '50');

  console.log(`[${requestId}] Listing campaigns: search=${searchTerm}, status=${status}`);

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

    // Use search endpoint if any filters are applied
    const hasFilters = searchTerm || status || aiProvider || startDate || endDate;
    const endpoint = hasFilters 
      ? `${FASTAPI_URL}/storage/campaigns/search`
      : `${FASTAPI_URL}/storage/campaigns`;

    const body = hasFilters ? JSON.stringify({
      search_term: searchTerm || undefined,
      status: status || undefined,
      ai_provider: aiProvider || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      max_results: maxResults
    }) : undefined;

    const response = await fetch(endpoint, {
      method: hasFilters ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    timingLog.push({ stage: 'fastapi_response', duration_ms: Date.now() - startTime });

    if (!response.ok) {
      const totalDuration = Date.now() - startTime;
      console.error(`[${requestId}] Error response: ${response.status}`);
      return NextResponse.json(
        { 
          error: 'Failed to list campaigns',
          requestId,
          totalDurationMs: totalDuration
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const totalDuration = Date.now() - startTime;
    timingLog.push({ stage: 'parse_response', duration_ms: Date.now() - startTime - timingLog[0].duration_ms });

    console.log(`[${requestId}] Found ${data.count || 0} campaigns in ${totalDuration}ms`);

    return NextResponse.json({
      ...data,
      requestId,
      timing: timingLog,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] List campaigns failed:`, error);

    let errorMessage = 'Failed to list campaigns';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out';
        statusCode = 504;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        code: 'LIST_CAMPAIGNS_ERROR',
        requestId,
        totalDurationMs: totalDuration
      },
      { status: statusCode }
    );
  }
}
