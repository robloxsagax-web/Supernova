'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import {
  getDashboardStats,
  getCampaigns,
  getAssets,
  getActivities,
  createCampaign,
  createAsset,
  deleteAsset as dbDeleteAsset,
  createActivity
} from '@/lib/supabase/database';
import { uploadAsset, uploadBase64Image, deleteAsset as storageDeleteAsset } from '@/lib/supabase/storage';
import type { Campaign, Asset, Activity, AssetType } from '@/lib/supabase/types';

export function useSupabase() {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const configured = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    setIsSupabaseConfigured(configured);
  }, []);

  return { isSupabaseConfigured, isLoading };
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { projects } = useStore();

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const isConfigured = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      if (isConfigured) {
        const data = await getCampaigns();
        setCampaigns(data);
      } else {
        setCampaigns(projects.map((p) => ({
          id: p.id,
          title: p.name,
          product_url: p.product?.url || '',
          company: p.product?.company_name || '',
          status: 'Completed' as any,
          campaign_type: 'ad',
          created_at: p.createdAt,
          updated_at: p.updatedAt,
          cover_image: p.product?.image
        })));
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projects]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, isLoading, refetch: fetchCampaigns };
}

export function useAssets(campaignId?: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { assets: localAssets } = useStore();

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const isConfigured = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      if (isConfigured) {
        const data = await getAssets(campaignId);
        setAssets(data);
      } else {
        setAssets(localAssets.map((a) => ({
          id: a.id,
          campaign_id: a.projectId || '',
          project_id: a.projectId || '',
          type: a.type,
          storage_path: a.url,
          public_url: a.url,
          thumbnail: a.thumbnail,
          file_size: a.size,
          name: a.name,
          created_at: a.createdAt
        })));
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, localAssets]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { assets, isLoading, refetch: fetchAssets };
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { activities: localActivities } = useStore();

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const isConfigured = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      if (isConfigured) {
        const data = await getActivities();
        setActivities(data);
      } else {
        setActivities(localActivities.map((a) => ({
          id: a.id,
          campaign_id: '',
          type: a.type,
          description: a.description,
          timestamp: a.timestamp
        })));
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  }, [localActivities]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, isLoading, refetch: fetchActivities };
}

export function useDashboardStats() {
  const [stats, setStats] = useState({
    campaigns: 0,
    videos: 0,
    images: 0,
    assets: 0,
    storage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const isConfigured = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      if (isConfigured) {
        const data = await getDashboardStats();
        setStats({ ...data, storage: 0 });
      } else {
        const { assets, projects } = useStore.getState();
        setStats({
          campaigns: projects.length,
          videos: assets.filter(a => a.type === 'video').length,
          images: assets.filter(a => a.type === 'image').length,
          assets: assets.length,
          storage: assets.reduce((sum, a) => sum + a.size, 0)
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, refetch: fetchStats };
}
