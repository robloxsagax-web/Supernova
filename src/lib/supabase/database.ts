import { createClient } from './client';
import { Campaign, Project, Asset, Script, Analytics, Activity } from './types';

// Campaign Operations
export async function createCampaign(data: Partial<Campaign>): Promise<Campaign | null> {
  try {
    const supabase = createClient();
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return campaign;
  } catch (error) {
    console.error('Create campaign error:', error);
    return null;
  }
}

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get campaigns error:', error);
    return [];
  }
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get campaign error:', error);
    return null;
  }
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('campaigns')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    return !error;
  } catch (error) {
    console.error('Update campaign error:', error);
    return false;
  }
}

export async function deleteCampaign(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);
    
    return !error;
  } catch (error) {
    console.error('Delete campaign error:', error);
    return false;
  }
}

// Asset Operations
export async function createAsset(data: Partial<Asset>): Promise<Asset | null> {
  try {
    const supabase = createClient();
    const { data: asset, error } = await supabase
      .from('assets')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update analytics
    await updateAnalytics(asset.campaign_id, asset.type);
    
    return asset;
  } catch (error) {
    console.error('Create asset error:', error);
    return null;
  }
}

export async function getAssets(campaignId?: string): Promise<Asset[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('assets').select('*').order('created_at', { ascending: false });
    
    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get assets error:', error);
    return [];
  }
}

export async function deleteAsset(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('assets').delete().eq('id', id);
    return !error;
  } catch (error) {
    console.error('Delete asset error:', error);
    return false;
  }
}

// Script Operations
export async function createScript(data: Partial<Script>): Promise<Script | null> {
  try {
    const supabase = createClient();
    const { data: script, error } = await supabase
      .from('scripts')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return script;
  } catch (error) {
    console.error('Create script error:', error);
    return null;
  }
}

export async function getScripts(campaignId: string): Promise<Script[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get scripts error:', error);
    return [];
  }
}

// Analytics Operations
export async function updateAnalytics(campaignId: string, type: string): Promise<void> {
  try {
    const supabase = createClient();
    
    const { data: existing } = await supabase
      .from('analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .single();
    
    const updates: Partial<Analytics> = {
      last_generated: new Date().toISOString()
    };
    
    if (type === 'video') {
      updates.videos_generated = (existing?.videos_generated || 0) + 1;
    } else if (type === 'image') {
      updates.images_generated = (existing?.images_generated || 0) + 1;
    }
    
    updates.total_assets = (existing?.total_assets || 0) + 1;
    
    if (existing) {
      await supabase.from('analytics').update(updates).eq('campaign_id', campaignId);
    } else {
      await supabase.from('analytics').insert({ campaign_id: campaignId, ...updates });
    }
  } catch (error) {
    console.error('Update analytics error:', error);
  }
}

// Activity Operations
export async function createActivity(data: Partial<Activity>): Promise<Activity | null> {
  try {
    const supabase = createClient();
    const { data: activity, error } = await supabase
      .from('activities')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return activity;
  } catch (error) {
    console.error('Create activity error:', error);
    return null;
  }
}

export async function getActivities(limit = 20): Promise<Activity[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get activities error:', error);
    return [];
  }
}

// Stats Operations
export async function getDashboardStats(): Promise<{
  campaigns: number;
  videos: number;
  images: number;
  assets: number;
}> {
  try {
    const supabase = createClient();
    
    const [campaignsResult, assetsResult] = await Promise.all([
      supabase.from('campaigns').select('id'),
      supabase.from('assets').select('type')
    ]);
    
    const assets = assetsResult.data || [];
    
    return {
      campaigns: campaignsResult.data?.length || 0,
      videos: assets.filter(a => a.type === 'video').length,
      images: assets.filter(a => a.type === 'image').length,
      assets: assets.length
    };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return { campaigns: 0, videos: 0, images: 0, assets: 0 };
  }
}
