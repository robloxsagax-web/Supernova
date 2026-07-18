import { NextResponse } from 'next/server';

// Railway backend timeout
export const maxDuration = 120;
const REQUEST_TIMEOUT_MS = 120000;

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL || '';

interface TimingLog {
  stage: string;
  duration_ms: number;
}

// GET /api/storage/campaigns/[campaignId] - Get campaign details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const timingLog: TimingLog[] = [];

  const { campaignId } = await params;
  console.log(`[${requestId}] Getting campaign: ${campaignId}`);

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

    const response = await fetch(`${FASTAPI_URL}/storage/campaigns/${campaignId}`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    timingLog.push({ stage: 'fastapi_response', duration_ms: Date.now() - startTime });

    if (!response.ok) {
      const totalDuration = Date.now() - startTime;
      console.error(`[${requestId}] Error response: ${response.status}`);
      
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: 'Campaign not found',
            code: 'NOT_FOUND',
            requestId,
            totalDurationMs: totalDuration
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Failed to get campaign',
          requestId,
          totalDurationMs: totalDuration
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const totalDuration = Date.now() - startTime;
    timingLog.push({ stage: 'parse_response', duration_ms: Date.now() - startTime - timingLog[0].duration_ms });

    console.log(`[${requestId}] Got campaign in ${totalDuration}ms`);

    return NextResponse.json({
      ...data,
      requestId,
      timing: timingLog,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] Get campaign failed:`, error);

    let errorMessage = 'Failed to get campaign';
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
        code: 'GET_CAMPAIGN_ERROR',
        requestId,
        totalDurationMs: totalDuration
      },
      { status: statusCode }
    );
  }
}

// DELETE /api/storage/campaigns/[campaignId] - Delete campaign
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const timingLog: TimingLog[] = [];

  const { campaignId } = await params;
  console.log(`[${requestId}] Deleting campaign: ${campaignId}`);

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

    const response = await fetch(`${FASTAPI_URL}/storage/campaigns/${campaignId}`, {
      method: 'DELETE',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    timingLog.push({ stage: 'fastapi_response', duration_ms: Date.now() - startTime });

    if (!response.ok) {
      const totalDuration = Date.now() - startTime;
      console.error(`[${requestId}] Error response: ${response.status}`);
      return NextResponse.json(
        { 
          error: 'Failed to delete campaign',
          requestId,
          totalDurationMs: totalDuration
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const totalDuration = Date.now() - startTime;
    timingLog.push({ stage: 'parse_response', duration_ms: Date.now() - startTime - timingLog[0].duration_ms });

    console.log(`[${requestId}] Deleted campaign (${data.deleted_count} objects) in ${totalDuration}ms`);

    return NextResponse.json({
      ...data,
      requestId,
      timing: timingLog,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] Delete campaign failed:`, error);

    let errorMessage = 'Failed to delete campaign';
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
        code: 'DELETE_CAMPAIGN_ERROR',
        requestId,
        totalDurationMs: totalDuration
      },
      { status: statusCode }
    );
  }
}
