/**
 * Campaign Storage Service
 * 
 * Handles all interactions with the B2 storage backend
 * for saving and retrieving campaign assets.
 */

import { MarketIntelligence } from '@/types/product';

// Types
export interface CampaignMetadata {
  campaign_id: string;
  created_at: string;
  updated_at: string;
  product_title: string;
  product_description: string;
  prompt: string;
  image_count: number;
  ai_provider: string;
  status: string;
  generation_time: number;
  object_keys: string[];
}

export interface CampaignObject {
  key: string;
  url: string;
  size: number;
  last_modified: string;
}

export interface Campaign {
  metadata: CampaignMetadata;
  objects: Record<string, CampaignObject>;
}

export interface SearchFilters {
  searchTerm?: string;
  status?: string;
  aiProvider?: string;
  startDate?: string;
  endDate?: string;
  maxResults?: number;
}

export interface StorageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  requestId?: string;
  totalDurationMs?: number;
}

// API Base URL
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || process.env.FASTAPI_URL || '';
};

// Storage Service Class
class StorageService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if storage is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch('/api/storage');
      if (!response.ok) return false;
      const data = await response.json();
      return data.available === true;
    } catch {
      return false;
    }
  }

  /**
   * List all campaigns
   */
  async listCampaigns(filters?: SearchFilters): Promise<CampaignMetadata[]> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.set('search', filters.searchTerm);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.aiProvider) params.set('aiProvider', filters.aiProvider);
    if (filters?.startDate) params.set('startDate', filters.startDate);
    if (filters?.endDate) params.set('endDate', filters.endDate);
    if (filters?.maxResults) params.set('maxResults', String(filters.maxResults));

    const queryString = params.toString();
    const url = `/api/storage/campaigns${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to list campaigns');
    }

    const data = await response.json();
    return data.campaigns || [];
  }

  /**
   * Get a single campaign with all details
   */
  async getCampaign(campaignId: string): Promise<Campaign> {
    const cacheKey = `campaign_${campaignId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const response = await fetch(`/api/storage/campaigns/${campaignId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Campaign not found');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to get campaign');
    }

    const data = await response.json();
    
    // Cache the result
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(campaignId: string): Promise<void> {
    // Clear cache
    this.cache.delete(`campaign_${campaignId}`);

    const response = await fetch(`/api/storage/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete campaign');
    }
  }

  /**
   * Save a campaign to storage
   */
  async saveCampaign(data: {
    campaignId: string;
    productTitle: string;
    productDescription: string;
    prompt?: string;
    aiProvider?: string;
    generationTime?: number;
    script?: string;
    marketIntelligence?: MarketIntelligence;
    audience?: any;
    competitorAnalysis?: any;
    images?: string[];
  }): Promise<void> {
    const response = await fetch('/api/storage/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save campaign');
    }
  }

  /**
   * Get presigned URL for an object
   */
  async getPresignedUrl(objectKey: string, expiry: number = 3600): Promise<string> {
    const response = await fetch(
      `/api/storage/presigned-url/${encodeURIComponent(objectKey)}?expiry=${expiry}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get presigned URL');
    }

    const data = await response.json();
    return data.url;
  }

  /**
   * Download campaign as ZIP
   */
  async downloadCampaignZip(campaignId: string): Promise<Blob> {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/storage/campaigns/${campaignId}/download`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to download campaign');
    }

    return response.blob();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Invalidate cache for a specific campaign
   */
  invalidateCampaign(campaignId: string): void {
    this.cache.delete(`campaign_${campaignId}`);
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Export types
export type { CampaignMetadata, Campaign, CampaignObject, SearchFilters };
