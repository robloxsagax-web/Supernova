import { NextResponse } from 'next/server';

// Railway backend timeout (longer for uploads)
export const maxDuration = 180;
const REQUEST_TIMEOUT_MS = 180000;

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL || '';

interface TimingLog {
  stage: string;
  duration_ms: number;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const timingLog: TimingLog[] = [];

  console.log(`[${requestId}] Uploading campaign`);

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

  let body: any;
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

  const { campaignId, productTitle, productDescription, prompt, aiProvider, generationTime, script, marketIntelligence, audience, competitorAnalysis, images } = body;

  if (!campaignId || !productTitle) {
    return NextResponse.json(
      { 
        error: 'Missing required fields',
        code: 'MISSING_FIELDS',
        requestId 
      },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    // Initialize campaign upload
    const initResponse = await fetch(`${FASTAPI_URL}/storage/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaign_id: campaignId,
        product_title: productTitle,
        product_description: productDescription,
        prompt: prompt || '',
        ai_provider: aiProvider || 'genblaze',
        generation_time: generationTime || 0
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!initResponse.ok) {
      const errorData = await initResponse.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to initialize upload');
    }

    timingLog.push({ stage: 'init_upload', duration_ms: Date.now() - startTime });

    // Upload script
    if (script) {
      await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/script.json`, {
        content: script,
        timestamp: new Date().toISOString()
      });
    }

    // Upload market intelligence
    if (marketIntelligence) {
      await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/market-insights.json`, {
        ...marketIntelligence,
        timestamp: new Date().toISOString()
      });
    }

    // Upload audience analysis
    if (audience) {
      await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/audience.json`, {
        ...audience,
        timestamp: new Date().toISOString()
      });
    }

    // Upload competitor analysis
    if (competitorAnalysis) {
      await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/competitor-analysis.json`, {
        ...competitorAnalysis,
        timestamp: new Date().toISOString()
      });
    }

    timingLog.push({ stage: 'upload_json', duration_ms: Date.now() - startTime - timingLog[0].duration_ms });

    // Upload images (parallel)
    const imageUploadPromises: Promise<any>[] = [];
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const filename = `image-${i + 1}.png`;
        
        // Fetch image and upload
        imageUploadPromises.push(
          fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
              const formData = new FormData();
              formData.append('filename', filename);
              formData.append('content', blob);
              
              return fetch(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload/images`, {
                method: 'POST',
                body: formData,
              });
            })
            .then(res => {
              if (!res.ok) {
                console.error(`Failed to upload image ${filename}`);
              }
              return res.json();
            })
            .catch(err => {
              console.error(`Image upload error:`, err);
              return { success: false };
            })
        );
      }

      await Promise.all(imageUploadPromises);
    }

    timingLog.push({ stage: 'upload_images', duration_ms: Date.now() - startTime - timingLog.reduce((a, b) => a + b.duration_ms, 0) });

    // Finalize campaign
    const finalizeData = {
      campaign_id: campaignId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_title: productTitle,
      product_description: productDescription,
      prompt: prompt || '',
      image_count: images?.length || 0,
      ai_provider: aiProvider || 'genblaze',
      status: 'completed',
      generation_time: generationTime || 0,
      object_keys: [
        `${campaignId}/metadata.json`,
        `${campaignId}/data/script.json`,
        `${campaignId}/data/market-insights.json`,
        `${campaignId}/data/audience.json`,
        `${campaignId}/data/competitor-analysis.json`,
        ...(images?.map((_: any, i: number) => `${campaignId}/images/image-${i + 1}.png`) || [])
      ]
    };

    const finalizeResponse = await fetch(`${FASTAPI_URL}/storage/campaigns/${campaignId}/finalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalizeData),
    });

    if (!finalizeResponse.ok) {
      throw new Error('Failed to finalize campaign');
    }

    const totalDuration = Date.now() - startTime;
    console.log(`[${requestId}] Campaign uploaded successfully in ${totalDuration}ms`);

    return NextResponse.json({
      success: true,
      campaignId,
      timing: timingLog,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] Upload failed:`, error);

    let errorMessage = 'Failed to upload campaign';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Upload timed out';
        statusCode = 504;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        code: 'UPLOAD_ERROR',
        requestId,
        totalDurationMs: totalDuration
      },
      { status: statusCode }
    );
  }
}

async function uploadJson(url: string, data: any): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to upload JSON to ${url}`);
  }
}
