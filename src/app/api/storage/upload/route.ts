import { NextResponse } from 'next/server';

// Railway backend timeout (longer for uploads with video)
export const maxDuration = 300;
const REQUEST_TIMEOUT_MS = 300000;

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

  const { 
    campaignId, 
    productTitle, 
    productDescription, 
    prompt, 
    aiProvider, 
    generationTime, 
    script, 
    marketIntelligence, 
    audience, 
    competitorAnalysis, 
    images,
    video,      // Base64 or URL of the final merged video
    audio       // Base64 or URL of the narration audio
  } = body;

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

    // Upload script to data/script.json
    if (script) {
      const result = await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/data/script.json`, {
        content: script,
        timestamp: new Date().toISOString()
      });
      if (result.success) {
        finalizeData.object_keys.push(`${campaignId}/data/script.json`);
      }
    }

    // Upload market intelligence to data/market-insights.json
    if (marketIntelligence) {
      const result = await uploadJson(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload-json/data/market-insights.json`, {
        ...marketIntelligence,
        timestamp: new Date().toISOString()
      });
      if (result.success) {
        finalizeData.object_keys.push(`${campaignId}/data/market-insights.json`);
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
      const imageUploadPromises = images.map(async (imageUrl: string, i: number) => {
        const filename = `image-${i + 1}.png`;
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          const formData = new FormData();
          formData.append('filename', filename);
          formData.append('content', blob);
          
          const uploadResponse = await fetch(`${FASTAPI_URL}/storage/campaigns/${campaignId}/upload/images`, {
            method: 'POST',
            body: formData,
          });
          
          if (uploadResponse.ok) {
            imageKeys.push(`${campaignId}/images/${filename}`);
            return { success: true };
          }
        } catch (err) {
          console.error(`Image upload error for ${filename}:`, err);
        }
        return { success: false };
      });

      await Promise.all(imageUploadPromises);
    }

    finalizeData.object_keys.push(...imageKeys);
    timingLog.push({ stage: 'upload_images', duration_ms: Date.now() - startTime });

    // Upload audio (narration) if provided
    if (audio) {
      try {
        console.log(`[Upload] Uploading audio narration`);
        const audioResult = await uploadMediaAsset(
          `${FASTAPI_URL}/storage/campaigns/${campaignId}/upload/audio`,
          'narration.mp3',
          audio,
          'audio/mpeg'
        );
        if (audioResult.success) {
          finalizeData.object_keys.push(`${campaignId}/audio/narration.mp3`);
          console.log(`[Upload] Audio uploaded successfully`);
        }
      } catch (err) {
        console.error(`[Upload] Audio upload error:`, err);
        // Don't fail the whole upload for audio - continue
      }
    }

    // Upload video (final merged video) if provided
    if (video) {
      try {
        console.log(`[Upload] Uploading final video`);
        const videoResult = await uploadMediaAsset(
          `${FASTAPI_URL}/storage/campaigns/${campaignId}/upload/videos`,
          'final.webm',
          video,
          'video/webm'
        );
        if (videoResult.success) {
          finalizeData.object_keys.push(`${campaignId}/videos/final.webm`);
          console.log(`[Upload] Video uploaded successfully`);
        }
      } catch (err) {
        console.error(`[Upload] Video upload error:`, err);
        // Don't fail the whole upload for video - continue
      }
    }

    timingLog.push({ stage: 'upload_media', duration_ms: Date.now() - startTime });

    // Always add metadata.json to object_keys
    finalizeData.object_keys.push(`${campaignId}/metadata.json`);

    console.log(`[Upload] Final object_keys:`, finalizeData.object_keys);

    // Finalize campaign with metadata
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

    return NextResponse.json({
      success: true,
      campaignId,
      imageCount: imageKeys.length,
      objectKeys: finalizeData.object_keys,
      timing: timingLog,
      totalDurationMs: totalDuration
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;

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
    console.error(`JSON upload error to ${url}:`, error);
    return { success: false };
  }
}

async function uploadMediaAsset(
  uploadUrl: string,
  filename: string,
  mediaData: string,  // Base64 or URL
  contentType: string
): Promise<{success: boolean; object_key?: string}> {
  try {
    let blob: Blob;
    
    // Check if it's a URL or base64
    if (mediaData.startsWith('data:')) {
      // Base64 data URL
      const response = await fetch(mediaData);
      blob = await response.blob();
    } else if (mediaData.startsWith('http')) {
      // URL - fetch and convert to blob
      const response = await fetch(mediaData);
      blob = await response.blob();
    } else {
      // Assume raw base64 - convert to blob
      const base64Response = await fetch(`data:${contentType};base64,${mediaData}`);
      blob = await base64Response.blob();
    }

    const formData = new FormData();
    formData.append('filename', filename);
    formData.append('content', blob);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status ${uploadResponse.status}`);
    }

    return await uploadResponse.json();
  } catch (error) {
    console.error(`Media upload error (${filename}):`, error);
    return { success: false };
  }
}
