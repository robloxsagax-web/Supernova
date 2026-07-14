import { create } from 'zustand';
import { AppState, Product, VideoSettings } from '@/types/product';

type Step = 'url' | 'product' | 'script' | 'video';
type GenerationType = 'ad' | 'b-roll';

// B-Roll configuration types
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
  clipDuration?: number;
  alternationEnabled?: boolean;
  framesPerContent?: number;
  centerPosition?: string;
  centerSize?: number;
  overlayPosition?: string;
  overlaySize?: number;
  overlayOpacity?: number;
  overlayTransition?: string;
  overlayBorderRadius?: number;
  overlayShadow?: string;
  showGradient?: boolean;
  gradientIntensity?: number;
  loopBackground?: boolean;
  ctaStartFrame?: number;
  ctaFrames?: number;
  backgroundColor?: string;
  showCaptions?: boolean;
  framesPerClip?: number;
}

const initialVideoSettings: VideoSettings = {
  ratio: '16:9',
  duration: 30,
  captionStyle: 'feature_badge',
  brandPalette: 'noir-gold',
};

const initialState: AppState & { 
  generationType: GenerationType;
  bRollConfig: BRollConfig | null;
  productImages: string[];
  adImages: string[];
} = {
  step: 'url' as Step,
  product: null,
  script: null,
  videoUrl: null,
  videoSettings: initialVideoSettings,
  generationType: 'ad' as GenerationType,
  bRollConfig: null,
  productImages: [],
  adImages: [],
  isLoading: false,
  error: null,
};

export const useStore = create<AppState & { 
  generationType: GenerationType;
  bRollConfig: BRollConfig | null;
  productImages: string[];
  adImages: string[];
  setStep: (step: Step) => void;
  setProduct: (product: Product) => void;
  setScript: (script: string) => void;
  setVideo: (videoUrl: string) => void;
  setVideoSettings: (settings: VideoSettings) => void;
  setGenerationType: (type: GenerationType) => void;
  setBRollConfig: (config: BRollConfig | null) => void;
  setProductImages: (images: string[]) => void;
  setAdImages: (images: string[]) => void;
  addAdImage: (image: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setProduct: (product) => set({ product }),
  setScript: (script) => set({ script }),
  setVideo: (videoUrl) => set({ videoUrl }),
  setVideoSettings: (settings) => set({ videoSettings: settings }),
  setGenerationType: (type) => set({ generationType: type }),
  setBRollConfig: (config) => set({ bRollConfig: config }),
  setProductImages: (images) => set({ productImages: images }),
  setAdImages: (images) => set({ adImages: images }),
  addAdImage: (image) => set((state) => ({ adImages: [...state.adImages, image] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
})); 