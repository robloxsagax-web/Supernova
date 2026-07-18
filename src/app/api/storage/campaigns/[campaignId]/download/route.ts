import { NextResponse } from 'next/server';

// Railway backend timeout (longer for ZIP download)
export const maxDuration = 300;
const REQUEST_TIMEOUT_MS = 300000;

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL || '';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  
  const { campaignId } = await params;
  const downloadUrl = `${FASTAPI_URL}/storage/campaigns/${campaignId}/download`;
  
  console.log(`[${requestId}] Downloading campaign ZIP: ${campaignId}`);
  console.log(`[${requestId}] Backend URL: ${downloadUrl}`);

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

    console.log(`[${requestId}] Fetching ZIP from: ${downloadUrl}`);
    
    const response = await fetch(downloadUrl, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    console.log(`[${requestId}] Response status: ${response.status}`);
    console.log(`[${requestId}] Content-Type: ${response.headers.get('content-type')}`);

    if (!response.ok) {
      // Try to parse error as JSON
      let errorMessage = 'Failed to download campaign';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Not JSON - might be HTML error page
        const text = await response.text();
        console.error(`[${requestId}] Non-JSON error response (${response.status}):`, text.substring(0, 200));
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          code: 'DOWNLOAD_ERROR',
          requestId,
          status: response.status
        },
        { status: response.status }
      );
    }

    // Get the blob from the response
    const blob = await response.blob();
    console.log(`[${requestId}] Downloaded ZIP blob, size: ${blob.size} bytes`);

    // Return the blob as a streaming response
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=campaign_${campaignId}.zip`,
        'Content-Length': blob.size.toString(),
      },
    });

  } catch (error) {
    console.error(`[${requestId}] Download failed:`, error);

    let errorMessage = 'Failed to download campaign';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Download timed out';
        statusCode = 504;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        code: 'DOWNLOAD_ERROR',
        requestId
      },
      { status: statusCode }
    );
  }
}
