export type CampaignStatus = 'Researching' | 'Generating' | 'Rendering' | 'Completed' | 'Failed';
export type AssetType = 'video' | 'image' | 'audio' | 'script';
export type CampaignType = 'ad' | 'b-roll';

export interface Campaign {
  id: string;
  title: string;
  product_url: string;
  company: string;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  cover_image?: string;
  campaign_type: CampaignType;
  product_data?: any;
}

export interface Project {
  id: string;
  campaign_id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  project_id: string;
  campaign_id: string;
  type: AssetType;
  storage_path: string;
  public_url: string;
  thumbnail?: string;
  duration?: number;
  width?: number;
  height?: number;
  file_size: number;
  created_at: string;
  name?: string;
}

export interface Script {
  id: string;
  campaign_id: string;
  script: string;
  style?: string;
  duration?: number;
  created_at: string;
}

export interface Analytics {
  campaign_id: string;
  videos_generated: number;
  images_generated: number;
  downloads: number;
  last_generated?: string;
  total_assets: number;
}

export interface Activity {
  id: string;
  campaign_id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface StorageStats {
  used: number;
  total: number;
  videos: number;
  images: number;
  audio: number;
}
