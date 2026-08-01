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
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'undefined' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'undefined'
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
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'undefined' &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'undefined'
      );

      if (isConfigured) {
        const data = await getCampaigns();
        setCampaigns(data);
      } else {
        // NO FALLBACK - Return empty array, use Zustand store instead
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      setCampaigns([]);
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
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'undefined' &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'undefined'
      );

      if (isConfigured) {
        const data = await getAssets(campaignId);
        setAssets(data);
      } else {
        // NO FALLBACK - Return empty array, use Zustand store instead
        setAssets([]);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      setAssets([]);
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
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'undefined' &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'undefined'
      );

      if (isConfigured) {
        const data = await getActivities();
        setActivities(data);
      } else {
        // NO FALLBACK - Return empty array, use Zustand store instead
        setActivities([]);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setActivities([]);
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
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'undefined' &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'undefined'
      );

      if (isConfigured) {
        const data = await getDashboardStats();
        setStats({ ...data, storage: 0 });
      } else {
        // NO FALLBACK - Return zeros, use Zustand store instead
        setStats({
          campaigns: 0,
          videos: 0,
          images: 0,
          assets: 0,
          storage: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        campaigns: 0,
        videos: 0,
        images: 0,
        assets: 0,
        storage: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, refetch: fetchStats };
}
