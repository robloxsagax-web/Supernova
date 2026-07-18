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

  console.log(`[Upload] Campaign upload started`);
  console.log(`[Upload] Backend URL: ${FASTAPI_URL}`);

  if (!FASTAPI_URL) {
    console.warn(`[Upload] Backend not configured - returning fallback`);
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
    // Finalize campaign metadata first (this creates the metadata.json)
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
      object_keys: [] as string[]
    };
    
    console.log(`[Upload] Processing campaign: ${campaignId}, product: ${productTitle}`);

    // Upload script to data/script.json
    if (script) {
      console.log(`[Upload] Uploading script for campaign: ${campaignId}`);
      const result = await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/data/script.json`, {
        content: script,
        timestamp: new Date().toISOString()
      });
      if (result.success) {
        finalizeData.object_keys.push(`${campaignId}/data/script.json`);
        console.log(`[Upload] Script uploaded successfully: ${campaignId}/data/script.json`);
      }
    }

    // Upload market intelligence to data/market-insights.json
    if (marketIntelligence) {
      console.log(`[Upload] Uploading market intelligence for campaign: ${campaignId}`);
      const result = await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/data/market-insights.json`, {
        ...marketIntelligence,
        timestamp: new Date().toISOString()
      });
      if (result.success) {
        finalizeData.object_keys.push(`${campaignId}/data/market-insights.json`);
        console.log(`[Upload] Market intelligence uploaded successfully: ${campaignId}/data/market-insights.json`);
      }
    }

    // Upload audience to data/audience.json
    if (audience) {
      const result = await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/data/audience.json`, {
        ...audience,
        timestamp: new Date().toISOString()
      });
      if (result.success) {
        finalizeData.object_keys.push(`${campaignId}/data/audience.json`);
      }
    }

    // Upload competitor analysis to data/competitor-analysis.json
    if (competitorAnalysis) {
      const result = await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/data/competitor-analysis.json`, {
        ...competitorAnalysis,
        timestamp: new Date().toISOString()
      });
      if (result.success) {
        finalizeData.object_keys.push(`${campaignId}/data/competitor-analysis.json`);
      }
    }

    timingLog.push({ stage: 'upload_json', duration_ms: Date.now() - startTime });

    // Upload images in parallel
    const imageKeys: string[] = [];
    if (images && Array.isArray(images)) {
      console.log(`[Upload] Starting image upload: ${images.length} images for campaign ${campaignId}`);
      
      const imageUploadPromises = images.map(async (imageUrl: string, i: number) => {
        const filename = `image-${i + 1}.png`;
        try {
          console.log(`[Upload] Fetching image ${i + 1}/${images.length}: ${filename}`);
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          const formData = new FormData();
          formData.append('filename', filename);
          formData.append('content', blob);
          
          console.log(`[Upload] Uploading image ${i + 1}/${images.length}: ${filename}`);
          const uploadResponse = await fetch(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload/images`, {
            method: 'POST',
            body: formData,
          });
          
          if (uploadResponse.ok) {
            imageKeys.push(`${campaignId}/images/${filename}`);
            console.log(`[Upload] Image uploaded successfully: ${filename}`);
            return { success: true };
          }
        } catch (err) {
          console.error(`[Upload] Image upload error for ${filename}:`, err);
        }
        return { success: false };
      });

      await Promise.all(imageUploadPromises);
      console.log(`[Upload] Image upload complete: ${imageKeys.length}/${images.length} successful`);
    }

    finalizeData.object_keys.push(...imageKeys);
    finalizeData.object_keys.push(`${campaignId}/metadata.json`);

    timingLog.push({ stage: 'upload_images', duration_ms: Date.now() - startTime });

    // Finalize campaign with metadata
    console.log(`[Upload] Finalizing campaign: ${campaignId}`);
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
    console.log(`[Upload] Campaign finalized successfully: ${campaignId}, duration: ${totalDuration}ms`);

    return NextResponse.json({
      success: true,
      campaignId,
      imageCount: imageKeys.length,
      timing: timingLog,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[Upload] Campaign upload failed:`, error);

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
    
    console.error(`[Upload] Error details: ${errorMessage}, campaign: ${campaignId || 'N/A'}`);

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

async function uploadJson(url: string, data: any): Promise<{success: boolean; object_key?: string}> {
  try {
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

    return await response.json();
  } catch (error) {
    console.error(`[Upload] JSON upload error to ${url}:`, error);
    return { success: false };
  }
}
