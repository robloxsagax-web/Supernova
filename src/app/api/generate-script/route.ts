import { NextResponse } from 'next/server';

/**
 * Script Generation Proxy Route
 * 
 * This route acts as a proxy to the Genblaze FastAPI service.
 * It receives requests from the frontend and forwards them to the local FastAPI server.
 */

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    // Forward the request to FastAPI
    const response = await fetch(`${FASTAPI_URL}/script`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(await request.json()),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'Failed to generate script' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
}
