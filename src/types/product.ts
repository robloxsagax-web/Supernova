export type Step = 'url' | 'product' | 'script' | 'marketIntelligence' | 'video';

export type VideoRatio = '9:16' | '16:9';
export type VideoDuration = 15 | 30 | 45 | 60;

// Brand color palette presets
export type BrandPaletteId = 
  | 'noir-gold'
  | 'old-money-navy'
  | 'emerald-pearl'
  | 'minimalist-monochrome'
  | 'rose-quartz-wine'
  | 'cyber-neon'
  | 'sunset-ochre'
  | 'eucalyptus-mint';

export interface BrandPalette {
  id: BrandPaletteId;
  name: string;
  primary: string;      // Primary accent (buttons, highlights)
  secondary: string;    // Secondary/canvas color
  text: string;          // Primary text color
  textSecondary: string; // Secondary/muted text
}

// 8 premium brand palettes
export const BRAND_PALETTES: Record<BrandPaletteId, BrandPalette> = {
  'noir-gold': {
    id: 'noir-gold',
    name: 'Noir & Gold',
    primary: '#D4AF37',      // Gold
    secondary: '#111111',    // Noir black
    text: '#FFFFFF',         // White
    textSecondary: '#888888', // Muted
  },
  'old-money-navy': {
    id: 'old-money-navy',
    name: 'Old Money Navy',
    primary: '#0B1D3A',      // Deep navy
    secondary: '#FDFBF7',    // Cream
    text: '#0B1D3A',         // Navy text
    textSecondary: '#6B7280', // Muted
  },
  'emerald-pearl': {
    id: 'emerald-pearl',
    name: 'Emerald & Pearl',
    primary: '#0A2F1D',     // Deep emerald
    secondary: '#F5F5F3',   // Pearl
    text: '#0A2F1D',        // Emerald text
    textSecondary: '#6B7280', // Muted
  },
  'minimalist-monochrome': {
    id: 'minimalist-monochrome',
    name: 'Minimalist Monochrome',
    primary: '#1A1A1A',     // Black
    secondary: '#FFFFFF',   // White
    text: '#1A1A1A',        // Black text
    textSecondary: '#666666', // Muted
  },
  'rose-quartz-wine': {
    id: 'rose-quartz-wine',
    name: 'Rose Quartz & Wine',
    primary: '#4A0E17',      // Deep wine
    secondary: '#E8C5C8',   // Rose quartz
    text: '#4A0E17',        // Wine text
    textSecondary: '#8B7355', // Muted
  },
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    primary: '#A855F7',     // Purple neon
    secondary: '#0D0D11',  // Dark charcoal
    text: '#FFFFFF',        // White
    textSecondary: '#A855F7', // Purple
  },
  'sunset-ochre': {
    id: 'sunset-ochre',
    name: 'Sunset Ochre',
    primary: '#F3E8EE',     // Soft blush
    secondary: '#4A2C2A',   // Deep terracotta
    text: '#FFFFFF',        // White
    textSecondary: '#F3E8EE', // Blush
  },
  'eucalyptus-mint': {
    id: 'eucalyptus-mint',
    name: 'Eucalyptus & Mint',
    primary: '#2C3E35',     // Deep eucalyptus
    secondary: '#A7F3D0',   // Mint
    text: '#1A1A1A',        // Dark text
    textSecondary: '#6B7280', // Muted
  },
};

// Caption style presets
export type CaptionStyleId = 
  | 'clean-minimal'
  | 'cinematic-outline'
  | 'luxury-accent'
  | 'bold-impact'
  | 'underline-focus'
  | 'feature_badge';

export interface CaptionStyleConfig {
  id: CaptionStyleId;
  name: string;
  description: string;
}

export const CAPTION_STYLES: Record<CaptionStyleId, CaptionStyleConfig> = {
  'clean-minimal': {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Crisp white text in subtle glass capsule',
  },
  'cinematic-outline': {
    id: 'cinematic-outline',
    name: 'Cinematic Outline',
    description: 'Bold text with sharp outline stroke',
  },
  'luxury-accent': {
    id: 'luxury-accent',
    name: 'Luxury Accent',
    description: 'Brand color highlights on active words',
  },
  'bold-impact': {
    id: 'bold-impact',
    name: 'Bold Impact',
    description: 'Massive wide text with high contrast',
  },
  'underline-focus': {
    id: 'underline-focus',
    name: 'Underline Focus',
    description: 'Clean text with animated accent underline',
  },
  'feature_badge': {
    id: 'feature_badge',
    name: 'Clean Feature Badge',
    description: 'Premium glass badge with product feature text',
  },
};

export interface VideoSettings {
  ratio: VideoRatio;
  duration: VideoDuration;
  captionStyle: CaptionStyleId;
  brandPalette: BrandPaletteId;
}

export interface Product {
  title: string;
  company_name: string;
  image: string;
  images: string[];
  price?: string;
  description: string;
  features: string[];
  url: string;
  ctaButton?: {
    text: string;
    link?: string;
  };
}

export interface GeneratedScript {
  script: string;
}

export interface VideoResult {
  videoUrl: string;
}

export interface MarketIntelligence {
  target_audience: {
    age: string;
    gender: string;
    income: string;
    interests: string[];
    pain_points: string[];
    buying_motivation: string[];
  };
  competitors: Array<{
    name: string;
    strength: string;
    weakness: string;
    position: string;
  }>;
  marketing_angles: string[];
  emotional_hooks: string[];
  recommended_platforms: Array<{
    name: string;
    suitability: number;
  }>;
  campaign_strategy: {
    primary: string;
    secondary: string;
    cta: string;
  };
  confidence_score: number;
}

export interface AppState {
  step: Step;
  product: Product | null;
  script: string | null;
  marketIntelligence: MarketIntelligence | null;
  videoUrl: string | null;
  videoSettings: VideoSettings;
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_STEP'; payload: AppState['step'] }
  | { type: 'SET_PRODUCT'; payload: Product }
  | { type: 'SET_SCRIPT'; payload: string }
  | { type: 'SET_VIDEO'; payload: string }
  | { type: 'SET_VIDEO_SETTINGS'; payload: VideoSettings }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }; 