import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Product, VideoSettings, MarketIntelligence } from '@/types/product';
import { storageService, CampaignMetadata } from './storage';

type Step = 'url' | 'product' | 'script' | 'marketIntelligence' | 'video';
type GenerationType = 'ad' | 'b-roll';
type AssetType = 'image' | 'video' | 'script';
type ActivityType = 'campaign_created' | 'image_generated' | 'video_generated' | 'script_generated' | 'asset_deleted' | 'project_renamed' | 'campaign_saved' | 'campaign_deleted';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface BRollClip {
  id: number;
  url: string;
  thumbnail: string;
  duration: number;
}

export interface BRollConfig {
  clips: BRollClip[];
  bRollImages?: string[];
  keywords: string[];
  totalDuration: number;
}

export interface Project {
  id: string;
  name: string;
  product: Product | null;
  createdAt: string;
  updatedAt: string;
  assets: string[];
}

export interface Asset {
  id: string;
  type: AssetType;
  url: string;
  thumbnail?: string;
  name: string;
  size: number;
  createdAt: string;
  projectId?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
}

const initialVideoSettings: VideoSettings = {
  ratio: '16:9',
  duration: 30,
  captionStyle: 'feature_badge',
  brandPalette: 'noir-gold',
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const estimateAssetSize = (type: AssetType): number => {
  switch (type) {
    case 'image': return Math.floor(Math.random() * 5000000) + 500000;
    case 'video': return Math.floor(Math.random() * 50000000) + 10000000;
    case 'script': return Math.floor(Math.random() * 50000) + 5000;
    default: return 0;
  }
};

interface StoreState {
  step: Step;
  product: Product | null;
  script: string | null;
  marketIntelligence: MarketIntelligence | null;
  videoUrl: string | null;
  narrationUrl: string | null;  // Audio narration URL
  videoSettings: VideoSettings;
  generationType: GenerationType;
  bRollConfig: BRollConfig | null;
  productImages: string[];
  adImages: string[];
  isLoading: boolean;
  error: string | null;
  projects: Project[];
  assets: Asset[];
  activities: Activity[];
  // B2 storage related
  b2Campaigns: CampaignMetadata[];
  b2Loading: boolean;
  b2Error: string | null;
  b2SaveStatus: SaveStatus;
  b2SaveError: string | null;
  b2LastSavedId: string | null;
  setStep: (step: Step) => void;
  setProduct: (product: Product) => void;
  setScript: (script: string) => void;
  setMarketIntelligence: (data: MarketIntelligence) => void;
  setVideo: (videoUrl: string) => void;
  setNarration: (narrationUrl: string) => void;
  setVideoSettings: (settings: VideoSettings) => void;
  setGenerationType: (type: GenerationType) => void;
  setBRollConfig: (config: BRollConfig | null) => void;
  setProductImages: (images: string[]) => void;
  setAdImages: (images: string[]) => void;
  addAdImage: (image: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  createProject: (name: string, product: Product | null) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  renameProject: (id: string, newName: string) => void;
  addAsset: (type: AssetType, url: string, name: string, projectId?: string) => Asset;
  deleteAsset: (id: string) => void;
  addActivity: (type: ActivityType, description: string) => void;
  // B2 storage methods
  loadB2Campaigns: (filters?: any) => Promise<void>;
  autoSaveCampaign: (generationTime?: number) => Promise<void>;
  deleteCampaignFromB2: (campaignId: string) => Promise<void>;
  clearB2Cache: () => void;
  resetSaveStatus: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      step: 'url' as Step,
      product: null,
      script: null,
      marketIntelligence: null,
      videoUrl: null,
      narrationUrl: null,
      videoSettings: initialVideoSettings,
      generationType: 'ad' as GenerationType,
      bRollConfig: null,
      productImages: [],
      adImages: [],
      isLoading: false,
      error: null,
      projects: [],
      assets: [],
      activities: [],
      // B2 storage state
      b2Campaigns: [],
      b2Loading: false,
      b2Error: null,
      b2SaveStatus: 'idle' as SaveStatus,
      b2SaveError: null,
      b2LastSavedId: null,

      setStep: (step) => set({ step }),
      setProduct: (product) => set({ product }),
      setScript: (script) => set({ script }),
      setMarketIntelligence: (data) => set({ marketIntelligence: data }),
      setVideo: (videoUrl) => set({ videoUrl }),
      setNarration: (narrationUrl) => set({ narrationUrl }),
      setVideoSettings: (settings) => set({ videoSettings: settings }),
      setGenerationType: (type) => set({ generationType: type }),
      setBRollConfig: (config) => set({ bRollConfig: config }),
      setProductImages: (images) => set({ productImages: images }),
      setAdImages: (images) => set({ adImages: images }),
      addAdImage: (image) => set((state) => ({ adImages: [...state.adImages, image] })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set({
        step: 'url',
        product: null,
        script: null,
        videoUrl: null,
        narrationUrl: null,
        isLoading: false,
        error: null,
      }),

      createProject: (name, product) => {
        const newProject: Project = {
          id: generateId(),
          name,
          product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assets: [],
        };
        set((state) => ({ projects: [newProject, ...state.projects] }));
        get().addActivity('campaign_created', `Created campaign: ${name}`);
        return newProject;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
        get().addActivity('asset_deleted', `Deleted project`);
      },

      renameProject: (id, newName) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p
          ),
        }));
        get().addActivity('project_renamed', `Renamed to: ${newName}`);
      },

      addAsset: (type, url, name, projectId) => {
        const newAsset: Asset = {
          id: generateId(),
          type,
          url,
          name,
          size: estimateAssetSize(type),
          createdAt: new Date().toISOString(),
          projectId,
        };
        set((state) => {
          const newAssets = [newAsset, ...state.assets];
          const updatedProjects = projectId
            ? state.projects.map((p) =>
                p.id === projectId
                  ? { ...p, assets: [newAsset.id, ...p.assets], updatedAt: new Date().toISOString() }
                  : p
              )
            : state.projects;
          return { assets: newAssets, projects: updatedProjects };
        });
        const activityType = type === 'image' ? 'image_generated' 
          : type === 'video' ? 'video_generated' 
          : 'script_generated';
        get().addActivity(activityType, `Generated ${type}: ${name}`);
        return newAsset;
      },

      deleteAsset: (id) => {
        set((state) => ({ assets: state.assets.filter((a) => a.id !== id) }));
        get().addActivity('asset_deleted', `Deleted asset`);
      },

      addActivity: (type, description) => {
        const newActivity: Activity = {
          id: generateId(),
          type,
          description,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          activities: [newActivity, ...state.activities].slice(0, 50),
        }));
      },

      // B2 storage methods
      loadB2Campaigns: async (filters) => {
        set({ b2Loading: true, b2Error: null });
        try {
          const campaigns = await storageService.listCampaigns(filters);
          set({ b2Campaigns: campaigns, b2Loading: false });
        } catch (error) {
          console.error('Failed to load B2 campaigns:', error);
          set({ 
            b2Error: error instanceof Error ? error.message : 'Failed to load campaigns',
            b2Loading: false 
          });
        }
      },

      autoSaveCampaign: async (generationTime) => {
        const state = get();
        const { product, script, marketIntelligence, adImages, videoUrl, narrationUrl } = state;
        
        if (!product) {
          throw new Error('No product to save');
        }

        const campaignId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Set saving status
        set({ b2SaveStatus: 'saving' as SaveStatus, b2SaveError: null });

        try {
          // Call the storage upload API
          const response = await fetch('/api/storage/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              campaignId,
              productTitle: product.title,
              productDescription: product.description || '',
              prompt: product.features?.join(', ') || '',
              aiProvider: 'genblaze',
              generationTime: generationTime || Math.round(performance.now()),
              script: script || undefined,
              marketIntelligence: marketIntelligence || undefined,
              images: adImages.length > 0 ? adImages : undefined,
              // Include video URL (blob URL or remote URL)
              video: videoUrl || undefined,
              // Include narration audio URL
              audio: narrationUrl || undefined,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to save campaign');
          }

          // Success
          set({ b2SaveStatus: 'saved' as SaveStatus, b2LastSavedId: campaignId });
          get().addActivity('campaign_saved', `Saved campaign: ${product.title}`);
          
        } catch (error) {
          set({ 
            b2SaveStatus: 'error' as SaveStatus,
            b2SaveError: error instanceof Error ? error.message : 'Failed to save campaign'
          });
          throw error;
        }
      },

      deleteCampaignFromB2: async (campaignId) => {
        try {
          await storageService.deleteCampaign(campaignId);
          
          // Update local state immediately without reload
          set(state => ({
            b2Campaigns: state.b2Campaigns.filter(c => c.campaign_id !== campaignId)
          }));
          
          get().addActivity('campaign_deleted', `Deleted campaign: ${campaignId}`);
        } catch (error) {
          console.error('Failed to delete campaign from B2:', error);
          throw error;
        }
      },

      clearB2Cache: () => {
        storageService.clearCache();
      },

      resetSaveStatus: () => {
        set({ b2SaveStatus: 'idle' as SaveStatus, b2SaveError: null });
      },
    }),
    {
      name: 'supernova-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        assets: state.assets,
        activities: state.activities,
      }),
    }
  )
);
