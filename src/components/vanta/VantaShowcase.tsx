import { 
  AbsoluteFill, 
  useCurrentFrame, 
  useVideoConfig,
  interpolate, 
  Img, 
  Audio,
  Video,
} from "remotion";
import React, { useMemo } from "react";
import { HardcodedFeatureBadge } from './HardcodedFeatureBadge';
import { 
  Product, 
  VideoSettings, 
  BrandPalette, 
  BRAND_PALETTES,
  CaptionStyleId
} from "@/types/product";

/**
 * LUXURY BRANDED VIDEO SHOWCASE — Audio-Synchronized Production
 * 
 * Features:
 * - Audio duration as master clock for all visual transitions
 * - Caption timestamps synchronized to voiceover
 * - Image transitions triggered by audio timeline
 * - 8 premium brand color palettes with dynamic state mapping
 * - 5 distinct caption styles
 */

// Video constants
const FPS = 30;
const PARTICLE_COUNT = 12;
const BOKEH_COUNT = 5;
const CONFETTI_COUNT = 35;

// Caption segment interface
export interface CaptionSegment {
  id: number;
  text: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  startFrame: number;
  endFrame: number;
}

// Default props
const defaultProps: {
  product?: {
    title: string;
    description: string;
    features: string[];
    image: string;
    images: string[];
    url: string;
  };
  script?: string;
  settings?: VideoSettings;
  voiceoverUrl?: string;
  backgroundMusicUrl?: string;
} = {
  product: {
    title: 'Transform Your Day Now',
    description: 'Premium quality product',
    features: [],
    image: 'https://via.placeholder.com/800x600?text=Product',
    images: [],
    url: '',
  },
  script: 'Experience the future of innovation. This revolutionary product delivers unmatched quality.',
  settings: {
    ratio: '16:9',
    duration: 30,
    captionStyle: 'feature_badge',
    brandPalette: 'noir-gold',
  },
};

// Comprehensive text cleaner
function cleanText(text: string): string {
  if (!text) return '';
  
  let cleaned = text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/[^\s<>"{}|\\^`[\]]+/g, '')
    .replace(/[iI]tps?:\/\/\S+/g, '')
    .replace(/\[\/?[^\]]*\]/g, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/^[-*_]{3,}\s*$/gm, '')
    .replace(/Scene\s*\d+:?\s*/gi, '')
    .replace(/\*\*Scene\s*\d+:?\*\*/gi, '')
    .replace(/\[Visual:?\s*[^\]]*\]/gi, '')
    .replace(/\bVO:\s*/gi, '')
    .replace(/\bVO\b\s*/gi, '');
  
  cleaned = cleaned
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\.{2,}/g, '.')
    .trim();
  
  if (/[\[\](){}]/.test(cleaned)) {
    cleaned = cleaned.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
  }
  
  return cleaned || '';
}

// Sanitize price - extracts only valid price format
function sanitizePrice(price: string | undefined | null): string {
  if (!price) return '';
  
  // Remove any markdown or text artifacts
  const sanitized = price
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/https?:\/\/[^\s]*/gi, '')
    .replace(/\[|\]|\(|\)|\{|\}/g, '')
    .replace(/!/g, '');
  
  // Try to extract valid price pattern (numbers with optional currency symbols)
  const priceMatch = sanitized.match(/[\$£€¥₹]?\s*[\d,]+\.?\d*/);
  
  if (priceMatch) {
    return priceMatch[0].trim();
  }
  
  // If no valid price found, return empty
  return '';
}

// Extract clean image URL
function extractImageUrl(text: string): string | null {
  const match = text.match(/!\[.*?\]\((.*?)\)/) || text.match(/(https?:\/\/[^\s"'<>]+)/);
  return match ? match[1] : null;
}

/**
 * Parse script into timed caption segments synchronized to audio
 * Each segment has start/end times that will sync with the voiceover
 */
function parseScriptWithTimestamps(script: string, audioDurationSeconds: number): CaptionSegment[] {
  if (!script || audioDurationSeconds <= 0) return [];
  
  const fullyCleanedScript = cleanText(script);
  
  // Extract raw sentences/phrases from the script
  let parts = fullyCleanedScript
    .split(/(?:\*\*Scene\s*\d+:?\*\*|Scene\s*\d+:?|[-–—])\s*/gi)
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 200);
  
  // If no scene markers, split by sentence boundaries
  if (parts.length <= 1) {
    parts = fullyCleanedScript
      .split(/[.!?]+/)
      .map(s => cleanText(s))
      .filter(s => s.length > 10 && s.length < 200);
  }
  
  // If still no good splits, use the whole text as one segment
  if (parts.length === 0 || (parts.length === 1 && parts[0].length < 10)) {
    parts = [fullyCleanedScript.substring(0, Math.min(fullyCleanedScript.length, 150))];
  }
  
  // Limit to 6 segments max for readability
  parts = parts.slice(0, 6);
  
  // Distribute time evenly across segments
  // Leave 5% at end for CTA, 2% at start for intro
  const usableDuration = audioDurationSeconds * 0.93; // 93% for content
  const startPadding = audioDurationSeconds * 0.02;
  const endPadding = audioDurationSeconds * 0.05;
  
  const timePerSegment = usableDuration / parts.length;
  const transitionTime = 0.3; // 300ms overlap between segments
  
  const segments: CaptionSegment[] = parts.map((text, index) => {
    const startTime = startPadding + (index * timePerSegment);
    const endTime = index === parts.length - 1 
      ? audioDurationSeconds - endPadding 
      : startTime + timePerSegment - transitionTime;
    
    return {
      id: index,
      text,
      startTime,
      endTime,
      startFrame: Math.floor(startTime * FPS),
      endFrame: Math.floor(endTime * FPS),
    };
  });
  
  return segments;
}

/**
 * Get the currently active caption segment based on current time
 */
export function getActiveCaptionSegment(
  segments: CaptionSegment[], 
  currentTimeSeconds: number
): CaptionSegment | null {
  for (const segment of segments) {
    if (currentTimeSeconds >= segment.startTime && currentTimeSeconds <= segment.endTime) {
      return segment;
    }
  }
  return null;
}

/**
 * Get the previous caption segment (for exit animation)
 */
export function getPreviousCaptionSegment(
  segments: CaptionSegment[],
  currentTimeSeconds: number
): CaptionSegment | null {
  for (let i = segments.length - 1; i >= 0; i--) {
    if (segments[i].endTime < currentTimeSeconds) {
      return segments[i];
    }
  }
  return null;
}

/**
 * Calculate image index based on audio timeline
 * Images change at specific time points in the audio
 */
export function getImageIndexForTime(
  images: string[],
  currentTimeSeconds: number,
  audioDurationSeconds: number
): number {
  if (images.length <= 1) return 0;
  
  // Divide audio into segments based on number of images
  // Each image gets equal time in the audio
  const segmentDuration = audioDurationSeconds / images.length;
  
  // Find which segment we're in
  const segmentIndex = Math.min(
    Math.floor(currentTimeSeconds / segmentDuration),
    images.length - 1
  );
  
  return Math.max(0, segmentIndex);
}

/**
 * Calculate progress within a caption segment (0 to 1)
 */
export function getCaptionProgress(
  segment: CaptionSegment,
  currentTimeSeconds: number
): number {
  const elapsed = currentTimeSeconds - segment.startTime;
  const duration = segment.endTime - segment.startTime;
  return Math.min(1, Math.max(0, elapsed / duration));
}

// Get ALL clean product images with 3-10 bounds enforcement
function getProductImages(product: Product): string[] {
  const allImages: string[] = [];
  const imageSources = [product.image, ...(product.images || [])];
  
  for (const img of imageSources) {
    if (!img || typeof img !== 'string') continue;
    if (img.includes('360') || img.toLowerCase().includes('spin') || img.includes('data:')) continue;
    
    const url = extractImageUrl(img);
    const finalUrl = url || img;
    
    if (finalUrl && !allImages.includes(finalUrl)) {
      allImages.push(finalUrl);
    }
  }
  
  // ENFORCE 3-10 IMAGE BOUNDS
  if (allImages.length === 0) {
    // Fallback: use placeholder
    return ['https://via.placeholder.com/800x600?text=Product'];
  }
  
  if (allImages.length < 3) {
    // Pad to minimum 3 by repeating available images
    const padded: string[] = [];
    for (let i = 0; i < 5; i++) {
      padded.push(allImages[i % allImages.length]);
    }
    return padded;
  }
  
  if (allImages.length > 10) {
    // Cap at 10 unique images
    return allImages.slice(0, 10);
  }
  
  return allImages;
}

// Seeded random
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Bokeh Light Leaks
const BokehOrbs: React.FC<{ frame: number; seed: number; palette: BrandPalette }> = ({ frame, seed, palette }) => {
  const orbs = useMemo(() => {
    return Array.from({ length: BOKEH_COUNT }, (_, i) => {
      const s = seed + i;
      return {
        x: seededRandom(s * 1.1) * 100,
        y: seededRandom(s * 2.2) * 100,
        size: 100 + seededRandom(s * 3.3) * 200,
        opacity: 0.04 + seededRandom(s * 4.4) * 0.06,
        driftX: (seededRandom(s * 5.5) - 0.5) * 20,
        driftY: (seededRandom(s * 6.6) - 0.5) * 15,
      };
    });
  }, [seed]);
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {orbs.map((orb, i) => {
        const timeOffset = frame * 0.02;
        const x = orb.x + Math.sin(timeOffset + i) * orb.driftX;
        const y = orb.y + Math.cos(timeOffset * 0.7 + i) * orb.driftY;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${palette.primary}99 0%, transparent 70%)`,
              opacity: orb.opacity,
              filter: 'blur(30px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Confetti
const ConfettiBlast: React.FC<{ triggerFrame: number; totalFrames: number; palette: BrandPalette }> = ({ triggerFrame, totalFrames, palette }) => {
  const confetti = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => {
      const angle = (i / CONFETTI_COUNT) * 360 + seededRandom(i * 23) * 30;
      const speed = 200 + seededRandom(i * 37) * 300;
      const size = 4 + seededRandom(i * 47) * 8;
      const colors = [palette.primary, '#FFD700', '#FF6B6B', '#4ECDC4', '#96CEB4', palette.secondary];
      return {
        angle,
        speed,
        size,
        color: colors[Math.floor(seededRandom(i * 53) * colors.length)],
        rotation: seededRandom(i * 61) * 360,
      };
    });
  }, [triggerFrame]);
  
  const frame = useCurrentFrame();
  if (frame < triggerFrame) return null;
  
  const progress = Math.min(1, (frame - triggerFrame) / (totalFrames - triggerFrame));
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {confetti.map((c, i) => {
        const rad = (c.angle * Math.PI) / 180;
        const gravity = progress * progress * 400;
        const x = 50 + Math.cos(rad) * c.speed * progress;
        const y = 50 + Math.sin(rad) * c.speed * progress + gravity;
        const rot = c.rotation + progress * 720;
        const opacity = 1 - progress * 0.5;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: c.size,
              height: c.size * 0.6,
              backgroundColor: c.color,
              borderRadius: '2px',
              opacity: Math.max(0, opacity),
              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Trust Badge
const TrustBadge: React.FC<{ opacity: number; isVertical: boolean }> = ({ opacity, isVertical }) => (
  <div style={{ position: 'absolute', bottom: isVertical ? '16%' : '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', opacity }}>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#FFD700" style={{ filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))' }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: isVertical ? 10 : 12, fontWeight: 600, fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
      Highly Rated by 10,000+ Customers
    </p>
  </div>
);

// Border Frame
const BorderFrame: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
    {[
      { top: 16, left: 16, borderRadius: '8px 0 0 0' },
      { top: 16, right: 16, borderRadius: '0 8px 0 0' },
      { bottom: 16, left: 16, borderRadius: '0 0 0 8px' },
      { bottom: 16, right: 16, borderRadius: '0 0 8px 0' },
    ].map((pos, i) => (
      <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...pos, borderTop: i < 2 ? `1px solid rgba(255,255,255,${opacity * 0.3})` : 'none', borderBottom: i >= 2 ? `1px solid rgba(255,255,255,${opacity * 0.3})` : 'none', borderLeft: i % 2 === 0 ? `1px solid rgba(255,255,255,${opacity * 0.3})` : 'none', borderRight: i % 2 === 1 ? `1px solid rgba(255,255,255,${opacity * 0.3})` : 'none' }} />
    ))}
  </AbsoluteFill>
);

// Floating Particles
const FloatingParticles: React.FC<{ durationFrames: number; seed: number }> = ({ seed }) => {
  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    x: seededRandom((seed + i) * 1.1) * 100,
    y: seededRandom((seed + i) * 2.2) * 100,
    size: 1 + seededRandom((seed + i) * 3.3) * 2,
    opacity: 0.2 + seededRandom((seed + i) * 4.4) * 0.3,
    speedY: 0.5 + seededRandom((seed + i) * 5.5) * 0.5,
  })), [seed]);
  
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const y = ((p.y - (frame * p.speedY * 0.5)) % 120 + 120) % 120;
        return (
          <div key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${y}%`, width: p.size, height: p.size, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)', opacity: p.opacity, boxShadow: '0 0 6px rgba(255,255,255,0.5)' }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Film Grain
const FilmGrainOverlay: React.FC = () => (
  <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.025, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)', mixBlendMode: 'overlay' }} />
  </AbsoluteFill>
);

// Progress Timer Bar with brand color
const ProgressTimerBar: React.FC<{ progress: number; brandColor: string }> = ({ progress, brandColor }) => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100 }}>
    <div style={{ height: '100%', width: `${progress * 100}%`, background: `linear-gradient(90deg, ${brandColor}, ${brandColor}88)`, boxShadow: `0 0 10px ${brandColor}, 0 0 20px ${brandColor}` }} />
  </div>
);

// Caption Styles Component
const CaptionLayer: React.FC<{
  caption: string;
  style: CaptionStyleId;
  brandPalette: BrandPalette;
  isVertical: boolean;
  opacity: number;
  frame: number;
}> = ({ caption, style, brandPalette, isVertical, opacity, frame }) => {
  const words = caption.split(/\s+/).filter(w => w.length > 0);
  const progress = Math.min(1, frame / 45);
  const visibleCount = Math.max(1, Math.ceil(words.length * Math.min(1, progress * 1.2)));
  
  const baseFontSize = isVertical ? 20 : 28;
  
  if (style === 'clean-minimal') {
    // Clean Minimal: white text in subtle glass capsule
    return (
      <div style={{ position: 'absolute', bottom: isVertical ? '8%' : '7%', left: '50%', transform: 'translateX(-50%)', opacity, maxWidth: '92%', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px',
          backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)',
          padding: isVertical ? '14px 24px' : '16px 36px', borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <span style={{ color: '#ffffff', fontSize: baseFontSize, fontWeight: 600, fontFamily: 'Inter, sans-serif', lineHeight: 1.35, letterSpacing: '0.01em' }}>
            {words.slice(0, visibleCount).join(' ').toUpperCase()}
          </span>
        </div>
      </div>
    );
  }
  
  if (style === 'cinematic-outline') {
    // Cinematic Outline: bold, ultra-wide, readable text with thick shadow outline
    // NO background box - pure text visibility over any image
    const fontSize = isVertical ? baseFontSize + 12 : baseFontSize + 18;
    return (
      <div style={{ 
        position: 'absolute', 
        bottom: isVertical ? '8%' : '7%', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        opacity, 
        maxWidth: '98%', 
        textAlign: 'center',
        padding: '12px 20px',
      }}>
        <span style={{
          color: '#ffffff',
          fontSize: fontSize,
          fontWeight: 900, // Ultra bold
          fontFamily: 'Inter, system-ui, sans-serif',
          lineHeight: 1.1,
          letterSpacing: '0.12em', // Widest tracking
          textTransform: 'uppercase',
          // Thick 3px outer shadow for ultimate readability
          textShadow: `
            -4px -4px 0 #000,
            4px -4px 0 #000,
            -4px 4px 0 #000,
            4px 4px 0 #000,
            -4px 0 0 #000,
            4px 0 0 #000,
            0 -4px 0 #000,
            0 4px 0 #000,
            0 6px 12px rgba(0,0,0,0.7),
            0 0 40px rgba(0,0,0,0.5)
          `,
          WebkitTextStroke: '2px #000',
          textDecoration: 'none',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
        }}>
          {words.slice(0, visibleCount).join(' ').toUpperCase()}
        </span>
      </div>
    );
  }
  
  if (style === 'bold-impact') {
    // Bold Impact: massive wide text with high contrast
    const fontSize = isVertical ? baseFontSize + 8 : baseFontSize + 14;
    return (
      <div style={{ position: 'absolute', bottom: isVertical ? '8%' : '7%', left: '50%', transform: 'translateX(-50%)', opacity, maxWidth: '95%', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          padding: isVertical ? '16px 28px' : '20px 48px',
          borderRadius: 4,
          border: `2px solid ${brandPalette.primary}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 40px ${brandPalette.primary}33`,
        }}>
          <span style={{
            color: '#ffffff',
            fontSize: fontSize,
            fontWeight: 900,
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.1,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}>
            {words.slice(0, visibleCount).join(' ').toUpperCase()}
          </span>
        </div>
      </div>
    );
  }
  
  if (style === 'underline-focus') {
    // Underline Focus: clean text with animated accent underline
    const text = words.slice(0, visibleCount).join(' ').toUpperCase();
    const underlineWidth = Math.min(100, text.length * 4);
    return (
      <div style={{ position: 'absolute', bottom: isVertical ? '8%' : '7%', left: '50%', transform: 'translateX(-50%)', opacity, maxWidth: '92%', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{
            color: brandPalette.text,
            fontSize: baseFontSize,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.3,
            letterSpacing: '0.02em',
          }}>
            {text}
          </span>
          <div style={{
            height: 4,
            width: `${underlineWidth}%`,
            backgroundColor: brandPalette.primary,
            borderRadius: 2,
            boxShadow: `0 0 12px ${brandPalette.primary}`,
          }} />
        </div>
      </div>
    );
  }
  
  if (style === 'feature_badge') {
    // Clean Feature Badge: Glassmorphism badge with cycling trust signals
    // Positioned at top: 20px, left: 20px - persistent throughout video
    const TRUST_SIGNALS = [
      'Free Delivery',
      '100% Money-Back Guarantee', 
      'Rated 5 Stars',
      'Premium Quality',
      'Limited Time Offer'
    ];
    
    // Cycle through trust signals based on frame (changes every 3 seconds = 90 frames)
    const signalIndex = Math.floor(frame / 90) % TRUST_SIGNALS.length;
    const currentSignal = TRUST_SIGNALS[signalIndex];
    
    // Subtle pulse animation for emphasis
    const pulseScale = 1 + Math.sin(frame * 0.1) * 0.02;
    
    return (
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        opacity, 
        zIndex: 60, // Above captions
      }}>
        <div style={{
          transform: `scale(${pulseScale})`,
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
          padding: isVertical ? '12px 18px' : '14px 24px',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <span style={{ 
            color: '#ffffff', 
            fontSize: isVertical ? 13 : 15, 
            fontWeight: 600, 
            fontFamily: 'Inter, sans-serif', 
            lineHeight: 1.3, 
            letterSpacing: '0.02em',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}>
            {currentSignal.toUpperCase()}
          </span>
        </div>
      </div>
    );
  }
  
  // Luxury Accent: active word in brand accent color
  return (
    <div style={{ position: 'absolute', bottom: isVertical ? '8%' : '7%', left: '50%', transform: 'translateX(-50%)', opacity, maxWidth: '92%', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px',
        backgroundColor: brandPalette.secondary + 'E6', backdropFilter: 'blur(10px)',
        padding: isVertical ? '12px 20px' : '14px 28px', borderRadius: 8,
      }}>
        {words.slice(0, visibleCount).map((word, i) => {
          const isActive = i === visibleCount - 1 && visibleCount < words.length;
          return (
            <span
              key={i}
              style={{
                color: isActive ? brandPalette.primary : brandPalette.text,
                fontSize: baseFontSize - 2, fontWeight: isActive ? 800 : 500,
                fontFamily: 'Inter, sans-serif', lineHeight: 1.4,
                letterSpacing: isActive ? '0.02em' : '0',
                transition: 'color 0.2s ease',
                textShadow: isActive ? `0 0 10px ${brandPalette.primary}66` : 'none',
              }}
            >
              {word.toUpperCase()}{i < visibleCount - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Product Scene - Audio-synchronized with caption timing
const ProductScene: React.FC<{
  image: string;
  caption: string;
  durationFrames: number;
  sceneIndex: number;
  isVertical: boolean;
  sceneProgress: number;
  brandPalette: BrandPalette;
  captionStyle: CaptionStyleId;
  currentTimeSeconds: number;
  activeSegment?: CaptionSegment | null;
  captionSegments: CaptionSegment[];
  imageCycleIndex: number;
}> = ({ 
  image, 
  caption, 
  durationFrames, 
  sceneIndex, 
  isVertical, 
  sceneProgress, 
  brandPalette, 
  captionStyle,
  currentTimeSeconds,
  activeSegment
}) => {
  const frame = useCurrentFrame();
  
  const scale = interpolate(frame, [0, durationFrames], [1.0, 1.08], { extrapolateRight: 'clamp' });
  const isEven = sceneIndex % 2 === 0;
  const panX = interpolate(frame, [0, durationFrames], [isEven ? -8 : 8, isEven ? 8 : -8], { extrapolateRight: 'clamp' });
  
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationFrames - 15, durationFrames], [1, 0], { extrapolateRight: 'clamp' });
  const opacity = fadeIn * fadeOut;
  
  // Calculate caption opacity based on audio timeline
  // Caption fades in during segment start, holds, then fades out
  const captionOpacity = useMemo(() => {
    if (!activeSegment) return 0;
    
    const elapsed = currentTimeSeconds - activeSegment.startTime;
    const segmentDuration = activeSegment.endTime - activeSegment.startTime;
    
    // Fade in: first 10% of segment
    if (elapsed < segmentDuration * 0.1) {
      return elapsed / (segmentDuration * 0.1);
    }
    
    // Fade out: last 10% of segment
    if (elapsed > segmentDuration * 0.9) {
      return 1 - (elapsed - segmentDuration * 0.9) / (segmentDuration * 0.1);
    }
    
    return 1;
  }, [currentTimeSeconds, activeSegment]);
  
  // FIXED: 9:16 vertical layout - product takes 70%+ of screen height
  const cardWidth = isVertical ? '92%' : '80%';
  const cardHeight = isVertical ? '72%' : '65%'; // 72% for vertical = 70%+ screen height
  const cardTop = isVertical ? '12%' : '18%'; // Slightly higher for vertical to fit bigger image
  
  return (
    <AbsoluteFill style={{ backgroundColor: brandPalette.secondary }}>
      {/* LAYER 1: Heavy blurred background image */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
        <Img 
          src={image} 
          style={{ 
            width: '120%', 
            height: '120%', 
            objectFit: 'cover',
            filter: 'blur(30px) brightness(0.4) saturate(0.7)',
            transform: 'translate(-8%, -8%)',
          }} 
        />
      </div>
      
      {/* LAYER 2: Dark gradient overlay for depth */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, 
        width: '100%', 
        height: '100%', 
        background: `radial-gradient(ellipse at center, ${brandPalette.secondary}00 0%, ${brandPalette.secondary}DD 100%)` 
      }} />
      
      {/* LAYER 3: Floating white card wrapper - 70%+ height for vertical */}
      <div style={{
        position: 'absolute', 
        top: cardTop, 
        left: '50%', 
        transform: `translateX(-50%) scale(${scale}) translateX(${panX}px)`,
        width: cardWidth, 
        height: cardHeight,
        opacity,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: isVertical ? 20 : 24,
        padding: isVertical ? 12 : 16,
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.35), 0 10px 30px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* LAYER 4: Crisp product image inside the card - full size */}
        <Img 
          src={image} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
          }} 
        />
      </div>
      
      <BokehOrbs frame={frame} seed={sceneIndex * 10} palette={brandPalette} />
      <FloatingParticles durationFrames={durationFrames} seed={sceneIndex + 1} />
      <FilmGrainOverlay />
      <BorderFrame opacity={1} />
      
      <ProgressTimerBar progress={sceneProgress} brandColor={brandPalette.primary} />
      {/* Hardcoded FeatureBadge - always visible at top-left */}
      <HardcodedFeatureBadge isVertical={isVertical} frame={frame} brandPalette={brandPalette} />
      
      {/* Use captionOpacity for audio-synchronized caption visibility - z-index 50 to ensure it's above particles */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, pointerEvents: 'none' }}>
        <CaptionLayer 
          caption={caption} 
          style={captionStyle} 
          brandPalette={brandPalette} 
          isVertical={isVertical} 
          opacity={captionOpacity} 
          frame={frame} 
        />
      </div>
    </AbsoluteFill>
  );
};

// CTA Scene with brand colors - audio-synchronized
const CTAScene: React.FC<{
  productTitle: string;
  productImage: string;
  durationFrames: number;
  isVertical: boolean;
  brandPalette: BrandPalette;
  ctaProgress?: number; // 0 to 1 progress based on audio timeline
  imageCycleIndex?: number;
}> = ({ productImage, durationFrames, isVertical, brandPalette, ctaProgress = 0 }) => {
  const frame = useCurrentFrame();
  
  // Use audio-based progress for smooth animations
  const audioProgress = ctaProgress;
  
  const fadeIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const contentFade = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: 'clamp' });
  
  // Use audio progress for slide animation (more predictable)
  const slideUp = interpolate(audioProgress, [0, 0.3], [60, 0], { extrapolateRight: 'clamp' });
  
  // Pulse tied to overall audio timeline
  const pulsePhase = (audioProgress * Math.PI * 8);
  const pulseScale = 1 + Math.sin(pulsePhase) * 0.05;
  const pulseGlow = 0.4 + Math.sin(pulsePhase) * 0.2;
  
  const headlineSize = isVertical ? 30 : 52;
  const buttonSize = isVertical ? 16 : 20;
  
  return (
    <AbsoluteFill style={{ backgroundColor: brandPalette.secondary }}>
      {/* Brand gradient background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 50% 30%, ${brandPalette.primary}33 0%, transparent 50%), radial-gradient(ellipse at center, ${brandPalette.secondary} 0%, ${brandPalette.secondary} 100%)`,
        opacity: fadeIn,
      }} />
      
      <BokehOrbs frame={frame} seed={100} palette={brandPalette} />
      <FloatingParticles durationFrames={durationFrames} seed={200} />
      <FilmGrainOverlay />
      <BorderFrame opacity={contentFade} />
      <ConfettiBlast triggerFrame={5} totalFrames={durationFrames} palette={brandPalette} />
      
      {/* Product Image */}
      <div style={{
        position: 'absolute', top: isVertical ? '10%' : '12%', left: '50%',
        transform: `translateX(-50%) scale(${isVertical ? 0.5 : 0.65})`,
        width: 280, height: 200, opacity: contentFade,
        backgroundColor: `${brandPalette.primary}11`, backdropFilter: 'blur(8px)',
        borderRadius: 24, padding: 14, border: `1px solid ${brandPalette.primary}33`,
        boxShadow: `0 30px 80px ${brandPalette.primary}33`,
      }}>
        <img src={productImage} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      
      {/* ORDER YOURS TODAY */}
      <div style={{ position: 'absolute', top: isVertical ? '48%' : '42%', left: '50%', transform: `translate(-50%, ${slideUp}px)`, opacity: contentFade, textAlign: 'center', padding: '0 20px', maxWidth: isVertical ? '94%' : '88%' }}>
        <h1 style={{ color: brandPalette.text, fontSize: headlineSize, fontWeight: 900, fontFamily: 'Inter, sans-serif', lineHeight: 1.1, letterSpacing: '-0.02em', textShadow: `0 4px 40px ${brandPalette.text}33`, margin: 0 }}>
          ORDER YOURS TODAY
        </h1>
      </div>
      
      {/* Pulsing CTA Button */}
      <div style={{ position: 'absolute', top: isVertical ? '62%' : '55%', left: '50%', transform: `translate(-50%, ${slideUp}px) scale(${pulseScale})`, opacity: contentFade }}>
        <div style={{
          background: `linear-gradient(135deg, ${brandPalette.primary} 0%, ${brandPalette.primary}AA 50%, ${brandPalette.primary} 100%)`,
          padding: isVertical ? '18px 48px' : '24px 72px', borderRadius: 50,
          boxShadow: `0 20px 60px ${brandPalette.primary}${Math.round(pulseGlow * 255).toString(16).padStart(2, '0')}, inset 0 2px 0 rgba(255,255,255,0.3)`,
          border: `2px solid ${brandPalette.primary}`,
        }}>
          <span style={{ color: brandPalette.secondary, fontSize: buttonSize, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}>
            Shop Now
          </span>
        </div>
      </div>
      
      <TrustBadge opacity={contentFade} isVertical={isVertical} />
      
      {/* Subtext */}
      <div style={{ position: 'absolute', bottom: isVertical ? '6%' : '8%', left: '50%', transform: 'translateX(-50%)', opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp' }), textAlign: 'center' }}>
        <p style={{ color: brandPalette.textSecondary || 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif', letterSpacing: '0.16em', textTransform: 'uppercase', margin: 0 }}>
          TAP THE LINK BELOW TO PURCHASE
        </p>
      </div>
      
      {/* Hardcoded FeatureBadge - always visible at top-left */}
      <HardcodedFeatureBadge isVertical={isVertical} frame={frame} brandPalette={brandPalette} />
    </AbsoluteFill>
  );
};

// Main component - Audio-synchronized with captions based on voiceover timestamps
// B-Roll configuration interface
interface BRollConfig {
  clips: Array<{
    id: number;
    url: string;
    thumbnail: string;
    duration: number;
  }>;
  bRollImages?: string[];
  keywords: string[];
  totalDuration: number;
  clipDuration?: number;
  overlayPosition?: 'center-bottom' | 'center-right' | 'center';
  overlaySize?: number;
  overlayOpacity?: number;
  overlayTransition?: 'slide-up' | 'fade-in' | 'scale-in';
  overlayBorderRadius?: number;
  overlayShadow?: string;
  showGradient?: boolean;
  gradientIntensity?: number;
  alternationEnabled?: boolean;
  framesPerClip?: number;
  centerPosition?: string;
  centerSize?: number;
  loopBackground?: boolean;
  ctaStartFrame?: number;
  ctaFrames?: number;
  backgroundColor?: string;
  showCaptions?: boolean;
}

export const VantaShowcase: React.FC<{
  script?: string;
  product?: Product;
  settings?: VideoSettings;
  voiceoverUrl?: string;
  backgroundMusicUrl?: string;
  brandPalette?: BrandPalette;
  generationType?: 'ad' | 'b-roll';
  bRollConfig?: BRollConfig;
  productImages?: string[];
}> = (props) => {
  const { product, script, settings, voiceoverUrl, backgroundMusicUrl, brandPalette: brandPaletteProp, generationType = 'ad', bRollConfig, productImages } = { ...defaultProps, ...props } as typeof defaultProps & typeof props;

  const isBRoll = generationType === 'b-roll';
  
  // ALL HOOKS AT TOP LEVEL - CRITICAL
  const { durationInFrames, fps } = useVideoConfig();
  const currentFrame = useCurrentFrame();
  
  // Calculate current time in seconds from frame
  const currentTimeSeconds = currentFrame / (fps || FPS);
  
  // Always calculate derived values
  // Use videoConfig duration or fall back to settings
  const totalFrames = durationInFrames || (settings?.duration ?? 30) * FPS;
  // Convert frames to seconds for audio duration
  const audioDurationSeconds = totalFrames / (fps || FPS);
  
  const isVertical = (settings?.ratio || '16:9') === '9:16';
  
  // Use brandPalette directly from props if provided, otherwise derive from settings
  const brandPalette = brandPaletteProp || BRAND_PALETTES[settings?.brandPalette || 'noir-gold'];
  const captionStyle = settings?.captionStyle || 'clean-minimal';
  
  const images = getProductImages(product!);
  
  // Generate caption segments synchronized to audio duration
  const captionSegments = useMemo(() => {
    return parseScriptWithTimestamps(script || '', audioDurationSeconds);
  }, [script, audioDurationSeconds]);
  
  // Get currently active caption based on audio time
  const activeSegment = getActiveCaptionSegment(captionSegments, currentTimeSeconds);
  
  // Simple modulo-based image cycling - smooth sequential loop
  // Each image displays for ~150 frames (5 seconds at 30fps)
  // Change FRAMES_PER_IMAGE to adjust how long each image shows
  // Use productImages for b-roll mode
  const displayImages = isBRoll && productImages?.length 
    ? productImages 
    : images;

  const FRAMES_PER_IMAGE = 150;
  const imageCycleIndex = Math.floor(currentFrame / FRAMES_PER_IMAGE) % Math.max(1, displayImages.length);
  const displayImage = displayImages[imageCycleIndex];
  
  // Calculate CTA timing - appears in final 15% of audio
  const ctaStartTime = audioDurationSeconds * 0.85;
  const ctaStartFrame = Math.floor(ctaStartTime * FPS);
  const ctaDurationFrames = totalFrames - ctaStartFrame;
  const isInCTARegion = currentTimeSeconds >= ctaStartTime;
  
  // Fade out audio at end
  const fadeOutStart = totalFrames - (FPS * 2);
  const audioFade = currentFrame > fadeOutStart 
    ? interpolate(currentFrame, [fadeOutStart, totalFrames], [1, 0], { extrapolateRight: 'clamp' })
    : 1;
  
  // Calculate scene index for visual effects
  const sceneIndex = captionSegments.findIndex(
    seg => currentTimeSeconds >= seg.startTime && currentTimeSeconds <= seg.endTime
  );
  const totalScenes = captionSegments.length || 1;
  const sceneProgress = (sceneIndex + 1) / totalScenes;

  // =====================================================
  // B-ROLL MODE: Alternating pattern - 2 videos, 1 product image, repeat
  // =====================================================
  
  // =====================================================
  // B-ROLL MODE: Show clips and product images in sequence
  // =====================================================

  const isBRollMode = isBRoll === true &&
                      !!(bRollConfig?.clips?.length) &&
                      !!(productImages?.length);

  const framesPerSegment = bRollConfig?.framesPerClip || 90;
  const bRollClips = bRollConfig?.clips || [];
  const bRollImages = bRollConfig?.bRollImages || [];
  const prodImages = productImages || [];
  const bRollCtaStartFrame = bRollConfig?.ctaStartFrame || (totalFrames - 90);
  const bRollCtaFrames = bRollConfig?.ctaFrames || 90;

  // Check if we're in B-Roll CTA scene
  const isBRollCTAScene = currentFrame >= bRollCtaStartFrame;
  const bRollCtaProgress = isBRollCTAScene 
    ? interpolate(currentFrame, [bRollCtaStartFrame, bRollCtaStartFrame + bRollCtaFrames], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  // Pattern: 3 clips -> (Product + 3 Pexels) x N -> CTA Scene
  // Clips shown in segments 0,1,2 ONLY
  // Then segments: Product, Pexels1, Pexels2, Pexels3 (4 segments per cycle)
  // Final segment: CTA Scene
  const CLIP_SEGMENTS = 3; // Only at start
  const CYCLE_SEGMENTS = 4; // Product + 3 Pexels
  const CLIPS_END_FRAME = CLIP_SEGMENTS * framesPerSegment;

  // Determine what's shown
  const currentSegment = Math.floor(currentFrame / framesPerSegment);
  let segmentType: 'clip' | 'product' | 'broll' | 'cta' = 'clip';
  let clipIdx = -1;
  let prodImgIdx = -1;
  let bRollImgIdx = -1;

  if (isBRollCTAScene) {
    // CTA scene at the end
    segmentType = 'cta';
  } else if (currentFrame < CLIPS_END_FRAME) {
    // Show clips only in the first 3 segments
    segmentType = 'clip';
    clipIdx = Math.floor(currentFrame / framesPerSegment) % bRollClips.length;
  } else {
    // After clips: Product + 3 Pexels + Product + 3 Pexels...
    const afterClipsFrame = currentFrame - CLIPS_END_FRAME;
    const cyclePosition = Math.floor(afterClipsFrame / framesPerSegment) % CYCLE_SEGMENTS;
    const fullCycles = Math.floor(afterClipsFrame / framesPerSegment / CYCLE_SEGMENTS);
    
    if (cyclePosition === 0) {
      // Product image
      segmentType = 'product';
      prodImgIdx = fullCycles % prodImages.length;
    } else {
      // Pexels images
      segmentType = 'broll';
      const pexelsIndex = (cyclePosition - 1) + (fullCycles * 3);
      bRollImgIdx = pexelsIndex % Math.max(1, bRollImages.length);
    }
  }

  const activeClip = segmentType === 'clip' ? bRollClips[clipIdx] : null;
  const activeProductImg = segmentType === 'product' ? prodImages[prodImgIdx] : null;
  const activeBRollImg = segmentType === 'broll' ? bRollImages[bRollImgIdx] : null;

  // Crossfade transition calculations - FAST transitions
  const TRANSITION_FRAMES = 5; // ~0.17 seconds - snappy, no fade
  const frameInSegment = currentFrame % framesPerSegment;
  
  // Fade out current content (at end of segment)
  const fadeOutCurrent = frameInSegment > (framesPerSegment - TRANSITION_FRAMES)
    ? Math.max(0, 1 - (frameInSegment - (framesPerSegment - TRANSITION_FRAMES)) / TRANSITION_FRAMES)
    : 1;
  
  // Combined opacity for smooth crossfade
  const contentOpacity = isBRollCTAScene 
    ? Math.max(0, 1 - (currentFrame - bRollCtaStartFrame) / TRANSITION_FRAMES)
    : 1;
  
  // Use fadeOutCurrent for normal segments (combines with fadeOutCurrent for crossfade)
  const effectiveOpacity = Math.min(fadeOutCurrent, contentOpacity);



  return (
    <AbsoluteFill style={{ backgroundColor: isBRollMode ? 'transparent' : brandPalette.secondary }}>
      {/* Background music - low volume, looping */}
      {backgroundMusicUrl && (
        <Audio
          src={backgroundMusicUrl}
          volume={isBRoll ? 0.08 : 0.12}
          loop={true}
        />
      )}

      {/* Voiceover - full volume with fade out, this is our MASTER CLOCK */}
      {voiceoverUrl && <Audio src={voiceoverUrl} volume={audioFade} />}

      {/* B-ROLL MODE: Video layer with crossfade transitions */}
      {isBRollMode && (
        <>
          {/* Show video if we have an active clip */}
          {activeClip && effectiveOpacity > 0.05 && (
            <Video
              key={`clip-${clipIdx}-${currentSegment}`}
              src={activeClip.url}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                opacity: fadeOutCurrent,
              }}
              loop={false}
            />
          )}
          
          {/* Show product image - with crossfade */}
          {activeProductImg && effectiveOpacity > 0.05 && (
            <img
              key={`product-${prodImgIdx}-${currentSegment}`}
              src={activeProductImg}
              alt="Product"
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'contain',
                backgroundColor: 'transparent',
                mixBlendMode: 'normal',
                opacity: fadeOutCurrent,
              }}
            />
          )}
          
          {/* Show B-roll image - with crossfade */}
          {activeBRollImg && effectiveOpacity > 0.05 && (
            <img
              key={`broll-${bRollImgIdx}-${currentSegment}`}
              src={activeBRollImg}
              alt="B-roll"
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: fadeOutCurrent,
              }}
            />
          )}
          
          {/* Fallback if nothing is shown */}
          {!activeClip && !activeProductImg && !activeBRollImg && effectiveOpacity > 0.05 && (
            <img
              src={prodImages[0] || 'https://via.placeholder.com/800x1200?text=Product'}
              alt="Product"
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'contain',
                backgroundColor: 'transparent',
                opacity: fadeOutCurrent,
              }}
            />
          )}
        </>
      )}

      {/* B-ROLL MODE: Debug indicator */}
      {isBRollMode && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: 6,
          fontSize: 11,
          fontFamily: 'monospace',
          zIndex: 100,
        }}>
          {segmentType === 'cta' ? '🎯 CTA Scene' :
           segmentType === 'clip' ? `📹 Clip ${clipIdx + 1}` : 
           segmentType === 'product' ? `🖼️ Product ${prodImgIdx + 1}` : 
           `📷 Pexels ${bRollImgIdx + 1}`}
        </div>
      )}

      {/* B-ROLL MODE: Premium CTA Scene - Glassmorphic Design */}
      {isBRollMode && segmentType === 'cta' && (
        <>
          {/* Fade overlay - black to transparent for smooth transition */}
          <AbsoluteFill style={{
            backgroundColor: '#000000',
            opacity: interpolate(bRollCtaProgress, [0, 0.25], [1, 0], { extrapolateRight: 'clamp' }),
          }} />
          
          {/* Main CTA container */}
          <AbsoluteFill style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Brand accent glow */}
            <AbsoluteFill style={{
              background: `radial-gradient(ellipse at center, ${brandPalette.primary}30 0%, transparent 50%)`,
              opacity: interpolate(bRollCtaProgress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
            }} />
            
            {/* Premium Glassmorphic Card Container */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: isVertical ? '85%' : '60%',
              maxWidth: isVertical ? 400 : 500,
              padding: isVertical ? 32 : 40,
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 32,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: `0 25px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
              opacity: interpolate(bRollCtaProgress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `scale(${interpolate(bRollCtaProgress, [0, 0.3], [0.9, 1], { extrapolateRight: 'clamp' })})`,
            }}>
              
              {/* Product Image - Floating Animation with Glowing Border */}
              <div style={{
                position: 'relative',
                width: isVertical ? '55%' : '40%',
                aspectRatio: '1',
                marginBottom: isVertical ? 20 : 28,
                opacity: interpolate(bRollCtaProgress, [0.1, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
                transform: `scale(${interpolate(bRollCtaProgress, [0.1, 0.5], [0.8, 1], { extrapolateRight: 'clamp' })})`,
              }}>
                {/* Glow ring */}
                <div style={{
                  position: 'absolute',
                  inset: -8,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${brandPalette.primary}40 0%, transparent 70%)`,
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                {/* Image container */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: `3px solid ${brandPalette.primary}60`,
                  overflow: 'hidden',
                  boxShadow: `0 0 30px ${brandPalette.primary}30`,
                }}>
                  <img
                    src={prodImages[0] || 'https://via.placeholder.com/400x400?text=Product'}
                    alt="Product"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>

              {/* Clean Product Title - No truncation */}
              {(() => {
                // True title cleansing - remove ALL markdown and artifacts
                const rawTitle = product?.title || '';
                const cleanTitle = rawTitle
                  .replace(/!\[.*?\]\(.*?\)/g, '') // markdown images
                  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown links
                  .replace(/https?:\/\/[^\s<>"{}|\\^`[\]]+/gi, '') // URLs
                  .replace(/\[|\]|\(|\)|\{|\}/g, '') // brackets
                  .replace(/!/g, '') // exclamation marks
                  .replace(/\|/g, '') // pipes
                  .replace(/<[^>]*>/g, '') // HTML tags
                  .replace(/[#*_`~]/g, '') // markdown chars
                  .replace(/\s+/g, ' ') // multiple spaces
                  .trim() || 'Premium Product';
                
                return (
                  <p style={{
                    color: '#ffffff',
                    fontSize: isVertical ? 16 : 20,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: 8,
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    maxWidth: '100%',
                    lineHeight: 1.3,
                  }}>
                    {cleanTitle}
                  </p>
                );
              })()}

              {/* Price - Golden Accent */}
              {(() => {
                const cleanPrice = sanitizePrice(product?.price);
                return cleanPrice ? (
                  <p style={{
                    color: brandPalette.primary,
                    fontSize: isVertical ? 28 : 36,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: 16,
                    textShadow: `0 0 20px ${brandPalette.primary}60`,
                  }}>
                    {cleanPrice}
                  </p>
                ) : null;
              })()}

              {/* Premium Feature Badges - 3 Column Grid */}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: isVertical ? 8 : 16,
                marginBottom: 20,
                opacity: interpolate(bRollCtaProgress, [0.4, 0.7], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                {[
                  { icon: '⭐', text: '5-Star' },
                  { icon: '🚚', text: 'Free Ship' },
                  { icon: '🔒', text: 'Secure' },
                ].map((badge, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: isVertical ? '6px 10px' : '8px 14px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 20,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}>
                    <span style={{ fontSize: isVertical ? 12 : 14 }}>{badge.icon}</span>
                    <span style={{
                      color: '#ffffff',
                      fontSize: isVertical ? 10 : 12,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                    }}>
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Premium Shop Now CTA Button */}
              <div style={{
                position: 'relative',
                opacity: interpolate(bRollCtaProgress, [0.5, 0.8], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                {/* Pulse ring */}
                <div style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: 50,
                  border: `2px solid ${brandPalette.primary}`,
                  opacity: interpolate(bRollCtaProgress, [0.6, 1], [0.6, 0], { extrapolateRight: 'clamp' }),
                  animation: 'pulse 1.5s ease-out infinite',
                }} />
                <div
                  style={{
                    position: 'relative',
                    background: `linear-gradient(135deg, ${brandPalette.primary} 0%, ${brandPalette.primary}dd 50%, ${brandPalette.primary} 100%)`,
                    color: '#000000',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: isVertical ? 18 : 24,
                    fontWeight: 900,
                    padding: isVertical ? '20px 60px' : '24px 80px',
                    borderRadius: 50,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    boxShadow: `0 10px 40px ${brandPalette.primary}80, 0 0 60px ${brandPalette.primary}40, inset 0 2px 0 rgba(255,255,255,0.3)`,
                    border: '2px solid rgba(255,255,255,0.2)',
                    textShadow: '0 1px 0 rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                  }}
                >
                  Shop Now
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </>
      )}

      {/* Brand CTA Button (only for non-CTA segments) */}
      {isBRollMode && segmentType !== 'cta' && product?.ctaButton?.text && (
        <div
          style={{
            position: 'absolute',
            bottom: isVertical ? '10%' : '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: brandPalette.primary,
              color: brandPalette.text,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: isVertical ? 12 : 14,
              fontWeight: 700,
              padding: '14px 40px',
              borderRadius: 50,
              boxShadow: `0 8px 30px ${brandPalette.primary}80`,
              letterSpacing: 1.5,
            }}
          >
            {product?.ctaButton?.text}
          </div>
        </div>
      )}

      {/* AD MODE: Audio-synchronized Product Scene */}
      {!isBRollMode && !isInCTARegion && (
        <ProductScene
          image={displayImage}
          caption={activeSegment?.text || ''}
          durationFrames={totalFrames}
          sceneIndex={sceneIndex >= 0 ? sceneIndex : 0}
          isVertical={isVertical}
          sceneProgress={sceneProgress}
          brandPalette={brandPalette}
          captionStyle={captionStyle}
          currentTimeSeconds={currentTimeSeconds}
          activeSegment={activeSegment}
          captionSegments={captionSegments}
          imageCycleIndex={imageCycleIndex}
        />
      )}

      {/* AD MODE: CTA Scene - triggered by audio timeline */}
      {!isBRollMode && isInCTARegion && ctaDurationFrames > 0 && (
        <CTAScene
          productTitle={cleanText(product?.title || '') || 'Premium Product'}
          productImage={displayImage}
          durationFrames={ctaDurationFrames}
          isVertical={isVertical}
          brandPalette={brandPalette}
          ctaProgress={Math.min(1, (currentTimeSeconds - ctaStartTime) / (ctaDurationFrames / FPS))}
          imageCycleIndex={imageCycleIndex}
        />
      )}

    </AbsoluteFill>
  );
};

export default VantaShowcase;
