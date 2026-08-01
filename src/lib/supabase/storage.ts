import { createClient } from './client';
import { AssetType } from './types';

const BUCKET_NAMES = {
  videos: 'videos',
  images: 'images',
  thumbnails: 'thumbnails',
  audio: 'audio',
} as const;

export async function uploadAsset(
  file: Blob | File,
  type: AssetType,
  campaignId: string,
  fileName?: string
): Promise<{ path: string; url: string } | null> {
  try {
    const supabase = createClient();
    
    const bucket = type === 'video' ? BUCKET_NAMES.videos 
      : type === 'image' ? BUCKET_NAMES.images
      : type === 'audio' ? BUCKET_NAMES.audio
      : BUCKET_NAMES.images;
    
    const timestamp = Date.now();
    const name = fileName || `${type}_${timestamp}`;
    const extension = type === 'video' ? 'mp4' : type === 'audio' ? 'mp3' : 'png';
    const path = `${campaignId}/${name}.${extension}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return {
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
}

export async function uploadBase64Image(
  base64Data: string,
  campaignId: string,
  fileName?: string
): Promise<{ path: string; url: string } | null> {
  try {
    const supabase = createClient();
    const timestamp = Date.now();
    const name = fileName || `image_${timestamp}`;
    const path = `${campaignId}/${name}.png`;
    
    // Convert base64 to blob
    const response = await fetch(base64Data);
    const blob = await response.blob();
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAMES.images)
      .upload(path, blob, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAMES.images)
      .getPublicUrl(data.path);
    
    return {
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
}

export async function deleteAsset(path: string, type: AssetType): Promise<boolean> {
  try {
    const supabase = createClient();
    const bucket = type === 'video' ? BUCKET_NAMES.videos 
      : type === 'image' ? BUCKET_NAMES.images
      : type === 'audio' ? BUCKET_NAMES.audio
      : BUCKET_NAMES.images;
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    return !error;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}

export async function getStorageStats(): Promise<{
  used: number;
  videos: number;
  images: number;
  audio: number;
}> {
  try {
    const supabase = createClient();
    let totalUsed = 0;
    let videos = 0;
    let images = 0;
    let audio = 0;
    
    const buckets = [BUCKET_NAMES.videos, BUCKET_NAMES.images, BUCKET_NAMES.audio];
    
    for (const bucket of buckets) {
      const { data: files } = await supabase.storage.from(bucket).list();
      if (files) {
        for (const file of files) {
          totalUsed += file.metadata?.size || 0;
          if (bucket === BUCKET_NAMES.videos) videos++;
          else if (bucket === BUCKET_NAMES.images) images++;
          else if (bucket === BUCKET_NAMES.audio) audio++;
        }
      }
    }
    
    return { used: totalUsed, videos, images, audio };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return { used: 0, videos: 0, images: 0, audio: 0 };
  }
}

export function getPublicUrl(path: string, type: AssetType): string {
  const supabase = createClient();
  const bucket = type === 'video' ? BUCKET_NAMES.videos 
    : type === 'image' ? BUCKET_NAMES.images
    : type === 'audio' ? BUCKET_NAMES.audio
    : BUCKET_NAMES.images;
  
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
