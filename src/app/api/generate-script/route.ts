import { NextResponse } from 'next/server';

/**
 * Script Generation Proxy Route
 * 
 * This route acts as a proxy to the Genblaze FastAPI service.
 * The backend URL is configured via environment variables:
 * - NEXT_PUBLIC_API_URL (preferred)
 * - FASTAPI_URL (fallback)
 * 
 * In production, this should point to your deployed FastAPI backend.
 */

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL || '';

export async function POST(request: Request) {
  if (!FASTAPI_URL) {
    console.error('FastAPI URL not configured. Set NEXT_PUBLIC_API_URL or FASTAPI_URL environment variable.');
    return NextResponse.json(
      { error: 'Backend unavailable. Please contact support.' },
      { status: 503 }
    );
  }

  try {
    // Forward the request to FastAPI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(`${FASTAPI_URL}/script`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(await request.json()),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      try {
        const error = await response.json();
        return NextResponse.json(
          { error: error.detail || 'Failed to generate script' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: 'Failed to generate script' },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Script generation proxy error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 504 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Backend unavailable. Please try again later.' },
      { status: 503 }
    );
  }
}
