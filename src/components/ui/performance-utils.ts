'use client';

import { memo } from 'react';

/**
 * Performance Optimization Utilities
 * 
 * This file contains memoized hooks and utilities for performance optimization
 */

// Memoize expensive objects that don't change
export const MEMOIZED_THEME = {
  colors: {
    primary: '#5C3317',
    secondary: '#8B5A2B',
    accent: '#FFDAB9',
    background: '#09090B',
    surface: '#111111',
    text: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.5)',
    border: 'rgba(255,218,185,0.08)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
    peach: 'linear-gradient(135deg, rgba(92, 51, 23, 0.15) 0%, rgba(255, 218, 185, 0.05) 100%)',
  },
  shadows: {
    glow: '0 0 30px rgba(92, 51, 23, 0.4)',
    card: '0 8px 32px rgba(0, 0, 0, 0.3)',
    elevated: '0 25px 50px rgba(0, 0, 0, 0.4)',
  },
  blur: {
    sm: 'blur(12px)',
    md: 'blur(16px)',
    lg: 'blur(24px)',
    xl: 'blur(40px)',
  },
} as const;

// Memoized navigation items
export const MEMOIZED_NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/create', label: 'Create' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/settings', label: 'Settings' },
] as const;

// Memoized animation variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
} as const;

// Memoized spring configs
export const SPRING_CONFIGS = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  smooth: { type: 'spring' as const, stiffness: 200, damping: 20 },
  snappy: { type: 'spring' as const, stiffness: 300, damping: 25 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15 },
} as const;

// Throttle function for event handlers
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle = false;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

// Debounce function for expensive operations
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), limit);
  }) as T;
}

// Memoized style objects
export const CARD_STYLES = {
  glass: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 218, 185, 0.08)',
    borderRadius: '1.5rem',
  },
  glassHover: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 218, 185, 0.15)',
  },
  gradient: {
    background: 'linear-gradient(135deg, rgba(92, 51, 23, 0.15) 0%, rgba(255, 218, 185, 0.05) 100%)',
    border: '1px solid rgba(255, 218, 185, 0.1)',
    borderRadius: '1.5rem',
  },
} as const;

// GPU acceleration utilities
export const GPU_HELPERS = {
  forceGPU: { transform: 'translate3d(0, 0, 0)' },
  willChange: 'transform, opacity',
  backfaceHidden: { backfaceVisibility: 'hidden' as const },
  perspective: { perspective: '1000px' },
} as const;

// CSS containment utilities
export const CONTAINMENT = {
  strict: { contain: 'strict' },
  layout: { contain: 'layout paint' },
  paint: { contain: 'paint' },
  content: { contain: 'content' },
} as const;

// Export optimized motion wrapper
export const OptimizedMotionDiv = memo(function OptimizedMotionDiv({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`will-change-transform ${className || ''}`}
      style={{
        transform: 'translate3d(0, 0, 0)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
