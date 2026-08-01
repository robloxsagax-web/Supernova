'use client';

import { SVGProps } from 'react';
import { SupernovaLogo as SharedSupernovaLogo } from '@/components/branding';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  gradient?: boolean;
};

/**
 * Premium Custom SVG Icons for Supernova
 * Brand colors: Maroon (#5C3317), Peach (#FFDAB9)
 * Each icon features gradients, glows, and premium wireframe style
 * SupernovaLogo is now imported from @/components/branding
 */

// Video Icon - Cinematic camera with film strip
export const VideoIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="videoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="videoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFDAB9" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#5C3317" stopOpacity="0.2" />
      </linearGradient>
      <filter id="videoGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Background glow */}
    <ellipse cx="24" cy="24" rx="18" ry="14" fill="url(#videoGrad2)" opacity="0.3" filter="url(#videoGlow)" />
    {/* Camera body */}
    <rect x="8" y="16" width="24" height="16" rx="3" fill="url(#videoGrad)" stroke="url(#videoGrad)" strokeWidth="1.5" filter="url(#videoGlow)" />
    {/* Lens */}
    <circle cx="34" cy="24" r="6" fill="#111111" stroke="url(#videoGrad)" strokeWidth="1.5" />
    <circle cx="34" cy="24" r="3" fill="url(#videoGrad)" opacity="0.6" />
    {/* Film reels */}
    <circle cx="14" cy="12" r="4" fill="none" stroke="url(#videoGrad)" strokeWidth="1.2" />
    <circle cx="26" cy="12" r="4" fill="none" stroke="url(#videoGrad)" strokeWidth="1.2" />
    <circle cx="14" cy="12" r="1.5" fill="#FFDAB9" />
    <circle cx="26" cy="12" r="1.5" fill="#FFDAB9" />
    {/* Play indicator */}
    <path d="M21 20L21 28L27 24Z" fill="#FFDAB9" />
  </svg>
);

// Image Icon - Gallery with frames
export const ImageIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="imageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="imageGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDAB9" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#5C3317" stopOpacity="0.2" />
      </linearGradient>
      <filter id="imageGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Background */}
    <rect x="6" y="10" width="36" height="28" rx="4" fill="url(#imageGrad2)" opacity="0.3" />
    {/* Frame */}
    <rect x="8" y="12" width="32" height="24" rx="3" fill="#111111" stroke="url(#imageGrad)" strokeWidth="1.5" filter="url(#imageGlow)" />
    {/* Mountain/landscape */}
    <path d="M8 28L16 20L22 26L28 18L40 32V36H8V28Z" fill="url(#imageGrad)" opacity="0.6" />
    {/* Sun */}
    <circle cx="32" cy="18" r="4" fill="url(#imageGrad)" />
    <circle cx="32" cy="18" r="2" fill="#FFDAB9" />
    {/* Frame accent */}
    <path d="M8 16L14 22L8 28" stroke="url(#imageGrad)" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// Copy/Writing Icon - Quill pen with paper
export const CopyIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="copyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="copyGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FFDAB9" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#5C3317" stopOpacity="0.2" />
      </linearGradient>
      <filter id="copyGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Paper */}
    <rect x="10" y="8" width="28" height="34" rx="3" fill="#111111" stroke="url(#copyGrad)" strokeWidth="1.5" filter="url(#copyGlow)" />
    {/* Lines on paper */}
    <path d="M16 16H32M16 22H28M16 28H30M16 34H24" stroke="url(#copyGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    {/* Quill pen */}
    <path d="M28 6C32 10 38 20 42 38C40 40 36 38 34 36C26 24 20 12 18 8C20 10 26 10 28 6Z" fill="url(#copyGrad2)" stroke="url(#copyGrad)" strokeWidth="1.2" filter="url(#copyGlow)" />
    {/* Pen nib detail */}
    <path d="M34 36L38 42L32 38" stroke="#FFDAB9" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// Strategy/Target Icon - Crosshair with concentric rings
export const StrategyIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="strategyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <filter id="strategyGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Outer ring */}
    <circle cx="24" cy="24" r="20" fill="none" stroke="url(#strategyGrad)" strokeWidth="1.5" opacity="0.4" />
    {/* Middle ring */}
    <circle cx="24" cy="24" r="14" fill="none" stroke="url(#strategyGrad)" strokeWidth="1.5" opacity="0.6" filter="url(#strategyGlow)" />
    {/* Inner ring */}
    <circle cx="24" cy="24" r="8" fill="none" stroke="url(#strategyGrad)" strokeWidth="2" opacity="0.8" />
    {/* Center dot */}
    <circle cx="24" cy="24" r="3" fill="url(#strategyGrad)" />
    <circle cx="24" cy="24" r="1.5" fill="#FFDAB9" />
    {/* Crosshairs */}
    <path d="M24 4V14M24 34V44M4 24H14M34 24H44" stroke="url(#strategyGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    {/* Corner markers */}
    <path d="M8 8L14 8M8 8L8 14" stroke="url(#strategyGrad)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M40 8L34 8M40 8L40 14" stroke="url(#strategyGrad)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 40L14 40M8 40L8 34" stroke="url(#strategyGrad)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M40 40L34 40M40 40L40 34" stroke="url(#strategyGrad)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Campaign/Launch Icon - Rocket launching
export const CampaignIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="campaignGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="flameGrad" x1="50%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="#FFDAB9" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#FF7A00" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#5C3317" stopOpacity="0" />
      </linearGradient>
      <filter id="campaignGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Flame */}
    <path d="M24 46C20 42 18 38 20 32C22 26 24 28 24 28C24 28 26 26 28 32C30 38 28 42 24 46Z" fill="url(#flameGrad)" filter="url(#campaignGlow)" />
    <path d="M24 42C22 40 21 38 22 34C23 30 24 31 24 31C24 31 25 30 26 34C27 38 26 40 24 42Z" fill="#FFDAB9" opacity="0.8" />
    {/* Rocket body */}
    <path d="M24 4C28 8 30 14 30 24C30 30 28 34 24 38C20 34 18 30 18 24C18 14 20 8 24 4Z" fill="url(#campaignGrad)" filter="url(#campaignGlow)" />
    {/* Window */}
    <circle cx="24" cy="18" r="4" fill="#111111" stroke="url(#campaignGrad)" strokeWidth="1.5" />
    <circle cx="24" cy="18" r="2" fill="#FFDAB9" opacity="0.6" />
    {/* Fins */}
    <path d="M18 28C14 32 12 36 14 38L18 34" fill="url(#campaignGrad)" />
    <path d="M30 28C34 32 36 36 34 38L30 34" fill="url(#campaignGrad)" />
    {/* Stars */}
    <circle cx="10" cy="10" r="1" fill="#FFDAB9" opacity="0.6" />
    <circle cx="38" cy="8" r="1.5" fill="#FFDAB9" opacity="0.8" />
    <circle cx="42" cy="18" r="1" fill="#FFDAB9" opacity="0.5" />
  </svg>
);

// Analytics/Charts Icon - Growth chart
export const AnalyticsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="analyticsGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <filter id="analyticsGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Chart background */}
    <rect x="6" y="10" width="36" height="28" rx="3" fill="#111111" stroke="url(#analyticsGrad)" strokeWidth="1.2" opacity="0.5" />
    {/* Grid lines */}
    <path d="M6 18H42M6 26H42M6 34H42M14 10V38M22 10V38M30 10V38M38 10V38" stroke="url(#analyticsGrad)" strokeWidth="0.5" opacity="0.2" />
    {/* Bar chart */}
    <rect x="10" y="28" width="6" height="8" rx="1" fill="url(#analyticsGrad)" opacity="0.5" />
    <rect x="18" y="24" width="6" height="12" rx="1" fill="url(#analyticsGrad)" opacity="0.7" />
    <rect x="26" y="18" width="6" height="18" rx="1" fill="url(#analyticsGrad)" opacity="0.85" filter="url(#analyticsGlow)" />
    {/* Growth line */}
    <path d="M13 30L21 26L29 20L37 10" stroke="#FFDAB9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#analyticsGlow)" />
    {/* Dot on line */}
    <circle cx="37" cy="10" r="3" fill="#FFDAB9" filter="url(#analyticsGlow)" />
    <circle cx="37" cy="10" r="1.5" fill="#111111" />
  </svg>
);

// Brand Kit Icon - Color palette
export const BrandIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <filter id="brandGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Palette shape */}
    <path d="M24 6C14 6 6 14 6 24C6 34 14 42 24 42C34 42 42 34 42 24C42 14 34 6 24 6Z" fill="#111111" stroke="url(#brandGrad)" strokeWidth="1.5" filter="url(#brandGlow)" />
    {/* Color dots */}
    <circle cx="16" cy="16" r="4" fill="#5C3317" />
    <circle cx="32" cy="16" r="4" fill="#8B5A2B" />
    <circle cx="16" cy="32" r="4" fill="#FFDAB9" />
    <circle cx="32" cy="32" r="4" fill="#22C55E" />
    <circle cx="24" cy="24" r="6" fill="url(#brandGrad)" filter="url(#brandGlow)" />
    {/* Thumb hole */}
    <circle cx="24" cy="6" r="3" fill="#111111" stroke="url(#brandGrad)" strokeWidth="1" />
  </svg>
);

// Library/Storage Icon - Folder with layers
export const LibraryIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="libraryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <filter id="libraryGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Back folder */}
    <path d="M8 14C8 12 10 10 12 10H20L24 14H36C38 14 40 16 40 18V36C40 38 38 40 36 40H12C10 40 8 38 8 36V14Z" fill="#111111" stroke="url(#libraryGrad)" strokeWidth="1.2" opacity="0.5" />
    {/* Front folder */}
    <path d="M4 18C4 16 6 14 8 14H18L22 18H36C38 18 40 20 40 22V38C40 40 38 42 36 42H8C6 42 4 40 4 38V18Z" fill="#111111" stroke="url(#libraryGrad)" strokeWidth="1.5" filter="url(#libraryGlow)" />
    {/* Document lines */}
    <path d="M14 26H34M14 32H28M14 38H22" stroke="url(#libraryGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// Sparkles/Magic Icon - Stars and sparkles
export const SparkleIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="1" />
      </linearGradient>
      <filter id="sparkleGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Center sparkle */}
    <path d="M24 4L26 18L40 20L26 22L24 36L22 22L8 20L22 18L24 4Z" fill="url(#sparkleGrad)" filter="url(#sparkleGlow)" />
    <path d="M24 10L25 18L33 19L25 20L24 28L23 20L15 19L23 18L24 10Z" fill="#FFDAB9" opacity="0.8" />
    {/* Small sparkles */}
    <path d="M12 8L13 12L17 13L13 14L12 18L11 14L7 13L11 12L12 8Z" fill="url(#sparkleGrad)" opacity="0.6" />
    <path d="M36 30L37 34L41 35L37 36L36 40L35 36L31 35L35 34L36 30Z" fill="url(#sparkleGrad)" opacity="0.7" />
    <path d="M8 34L9 36L11 37L9 38L8 40L7 38L5 37L7 36L8 34Z" fill="url(#sparkleGrad)" opacity="0.5" />
  </svg>
);

// Supernova Logo - The official brand mark (re-exported from shared component)
export const SupernovaLogo = ({ size = 24, className, ...props }: IconProps) => (
  <SharedSupernovaLogo size={size} className={className} {...props} />
);

// URL/Link Icon - Connected nodes
export const UrlIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="urlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <filter id="urlGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Connection line */}
    <path d="M12 18L20 26M28 22L36 30M12 30L20 22M28 26L36 18" stroke="url(#urlGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    {/* Left node */}
    <circle cx="10" cy="16" r="6" fill="#111111" stroke="url(#urlGrad)" strokeWidth="2" filter="url(#urlGlow)" />
    <circle cx="10" cy="32" r="6" fill="#111111" stroke="url(#urlGrad)" strokeWidth="2" filter="url(#urlGlow)" />
    {/* Right node */}
    <circle cx="38" cy="22" r="6" fill="#111111" stroke="url(#urlGrad)" strokeWidth="2" filter="url(#urlGlow)" />
    <circle cx="38" cy="30" r="6" fill="#111111" stroke="url(#urlGrad)" strokeWidth="2" filter="url(#urlGlow)" />
    {/* Inner dots */}
    <circle cx="10" cy="16" r="2" fill="#FFDAB9" />
    <circle cx="10" cy="32" r="2" fill="#FFDAB9" />
    <circle cx="38" cy="22" r="2" fill="#FFDAB9" />
    <circle cx="38" cy="30" r="2" fill="#FFDAB9" />
  </svg>
);

// Download Icon - Downward arrow with tray
export const DownloadIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="downloadGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFDAB9" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#5C3317" stopOpacity="0.8" />
      </linearGradient>
      <filter id="downloadGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Tray */}
    <path d="M8 28H40V34C40 37 38 40 34 40H14C10 40 8 37 8 34V28Z" fill="#111111" stroke="url(#downloadGrad)" strokeWidth="1.5" filter="url(#downloadGlow)" />
    <path d="M8 32H40" stroke="url(#downloadGrad)" strokeWidth="1.2" opacity="0.5" />
    {/* Arrow */}
    <path d="M24 8V32M24 32L18 26M24 32L30 26" stroke="url(#downloadGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#downloadGlow)" />
    {/* Base */}
    <rect x="16" y="40" width="16" height="4" rx="1" fill="url(#downloadGrad)" opacity="0.5" />
  </svg>
);

// Settings/Gear Icon - Premium cog
export const SettingsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <filter id="settingsGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Gear teeth */}
    <path d="M24 6L26 10L30 8L30 12L34 14L32 18L36 20L34 24L36 28L32 30L34 34L30 36L30 40L26 38L24 42L22 38L18 40L18 36L14 34L16 30L12 28L14 24L10 22L14 18L12 14L16 12L18 8L22 10L24 6Z" fill="#111111" stroke="url(#settingsGrad)" strokeWidth="1.5" filter="url(#settingsGlow)" />
    {/* Inner circle */}
    <circle cx="24" cy="24" r="10" fill="url(#settingsGrad)" opacity="0.3" />
    <circle cx="24" cy="24" r="7" fill="#111111" stroke="url(#settingsGrad)" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="3" fill="url(#settingsGrad)" />
  </svg>
);

// Search Icon
export const SearchIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="12" fill="none" stroke="url(#searchGrad)" strokeWidth="2.5" />
    <path d="M30 30L42 42" stroke="url(#searchGrad)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Bell/Notification Icon
export const BellIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="bellGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <filter id="bellGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M24 6C16 6 10 12 10 20V32L8 38H40L38 32V20C38 12 32 6 24 6Z" fill="#111111" stroke="url(#bellGrad)" strokeWidth="2" filter="url(#bellGlow)" />
    <path d="M20 38V40M28 38V40" stroke="url(#bellGrad)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="20" r="6" fill="url(#bellGrad)" opacity="0.3" />
    <circle cx="36" cy="10" r="4" fill="#EF4444" stroke="#111111" strokeWidth="1" />
  </svg>
);

// User/Profile Icon
export const UserIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="userGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="16" r="10" fill="#111111" stroke="url(#userGrad)" strokeWidth="2" />
    <circle cx="24" cy="14" r="4" fill="url(#userGrad)" opacity="0.5" />
    <path d="M8 44C8 34 14 28 24 28C34 28 40 34 40 44" fill="#111111" stroke="url(#userGrad)" strokeWidth="2" />
    <path d="M14 38C16 32 20 30 24 30C28 30 32 32 34 38" fill="url(#userGrad)" opacity="0.3" />
  </svg>
);

// Plus Icon
export const PlusIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="plusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path d="M24 8V40M8 24H40" stroke="url(#plusGrad)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Arrow Right Icon
export const ArrowRightIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="arrowGrad" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path d="M8 24H40M32 16L40 24L32 32" stroke="url(#arrowGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Check Icon
export const CheckIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path d="M10 26L20 36L38 14" stroke="url(#checkGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Brain/AI Icon
export const BrainIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8B5A2B" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
      <filter id="brainGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Brain outline */}
    <path d="M24 6C14 6 8 12 8 20C8 26 12 30 16 32C14 34 12 38 12 40C14 42 18 44 24 44C30 44 34 42 36 40C36 38 34 34 32 32C36 30 40 26 40 20C40 12 34 6 24 6Z" fill="#111111" stroke="url(#brainGrad)" strokeWidth="2" filter="url(#brainGlow)" />
    {/* Neural connections */}
    <path d="M14 14C18 16 20 20 20 24M34 14C30 16 28 20 28 24M14 32C18 30 20 28 20 24M34 32C30 30 28 28 28 24" stroke="url(#brainGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    {/* Neural nodes */}
    <circle cx="20" cy="14" r="3" fill="url(#brainGrad)" />
    <circle cx="28" cy="14" r="3" fill="url(#brainGrad)" />
    <circle cx="20" cy="32" r="3" fill="url(#brainGrad)" />
    <circle cx="28" cy="32" r="3" fill="url(#brainGrad)" />
    <circle cx="24" cy="24" r="5" fill="url(#brainGrad)" filter="url(#brainGlow)" />
    <circle cx="24" cy="24" r="2" fill="#FFDAB9" />
  </svg>
);

// Cloud/Upload Icon
export const CloudIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.8" />
      </linearGradient>
      <filter id="cloudGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Cloud shape */}
    <path d="M38 26C42 26 44 23 44 20C44 17 42 14 38 14C38 8 34 4 28 4C22 4 16 10 16 18C12 18 8 21 8 26C8 31 12 34 16 34C16 36 18 38 22 38C26 38 30 36 32 34C36 36 40 32 38 26Z" fill="#111111" stroke="url(#cloudGrad)" strokeWidth="2" filter="url(#cloudGlow)" />
    {/* Inner glow */}
    <path d="M34 24C36 24 38 22 38 20C38 18 36 16 34 16C34 12 30 10 26 10C22 10 18 14 18 20C16 20 14 22 14 26C14 28 16 30 20 30C22 30 24 29 26 28" fill="url(#cloudGrad)" opacity="0.3" />
  </svg>
);

// Activity/Live Icon
export const ActivityIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="activityGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path d="M6 24L14 32L22 20L30 28L38 14L42 18" stroke="url(#activityGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="32" r="3" fill="#FFDAB9" />
    <circle cx="22" cy="20" r="3" fill="#FFDAB9" />
    <circle cx="30" cy="28" r="3" fill="#FFDAB9" />
    <circle cx="38" cy="14" r="3" fill="#FFDAB9" />
  </svg>
);

// Zap/Lightning Icon
export const ZapIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="zapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFDAB9" stopOpacity="1" />
        <stop offset="100%" stopColor="#5C3317" stopOpacity="0.8" />
      </linearGradient>
      <filter id="zapGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M28 4L12 26H24L20 44L36 20H26L28 4Z" fill="url(#zapGrad)" filter="url(#zapGlow)" />
    <path d="M26 10L16 24H22L20 38L32 22H26L26 10Z" fill="#FFDAB9" opacity="0.5" />
  </svg>
);

// Layers/Stack Icon
export const LayersIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="layersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    {/* Back layer */}
    <path d="M8 20L24 32L40 20" fill="#111111" stroke="url(#layersGrad)" strokeWidth="2" opacity="0.5" />
    {/* Middle layer */}
    <path d="M8 28L24 40L40 28" fill="#111111" stroke="url(#layersGrad)" strokeWidth="2" opacity="0.7" />
    {/* Front layer */}
    <path d="M8 16L24 4L40 16L24 28L8 16Z" fill="#111111" stroke="url(#layersGrad)" strokeWidth="2" />
    {/* Front detail */}
    <path d="M24 4L24 28" stroke="url(#layersGrad)" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

// Trending/Up Icon
export const TrendingIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="trendingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5C3317" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#22C55E" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path d="M6 38L18 26L28 32L42 14" stroke="url(#trendingGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 14H42V22" stroke="url(#trendingGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="42" cy="14" r="4" fill="#22C55E" />
  </svg>
);

// Export all icons as a named export object
export const Icons = {
  Video: VideoIcon,
  Image: ImageIcon,
  Copy: CopyIcon,
  Strategy: StrategyIcon,
  Campaign: CampaignIcon,
  Analytics: AnalyticsIcon,
  Brand: BrandIcon,
  Library: LibraryIcon,
  Sparkle: SparkleIcon,
  Supernova: SupernovaLogo,
  Url: UrlIcon,
  Download: DownloadIcon,
  Settings: SettingsIcon,
  Search: SearchIcon,
  Bell: BellIcon,
  User: UserIcon,
  Plus: PlusIcon,
  ArrowRight: ArrowRightIcon,
  Check: CheckIcon,
  Brain: BrainIcon,
  Cloud: CloudIcon,
  Activity: ActivityIcon,
  Zap: ZapIcon,
  Layers: LayersIcon,
  Trending: TrendingIcon,
};
