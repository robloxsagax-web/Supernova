'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  variant?: 'glow' | 'rotate';
  speed?: 'slow' | 'normal' | 'fast';
}

/**
 * Animated Border Component
 * Creates premium animated border effects inspired by Magic UI and Aceternity
 * 
 * Variants:
 * - glow: Pulsing glow effect on the border
 * - rotate: Rotating conic gradient border (requires CSS @property support)
 */
export function AnimatedBorder({ 
  children, 
  className,
  variant = 'glow',
  speed = 'normal'
}: AnimatedBorderProps) {
  const speedClasses = {
    slow: 'duration-[4000ms]',
    normal: 'duration-[3000ms]',
    fast: 'duration-[2000ms]',
  };

  if (variant === 'rotate') {
    return (
      <div className={cn('animated-border relative', className)}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'relative rounded-2xl p-[1px] overflow-hidden',
        speedClasses[speed],
        className
      )}
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255, 218, 185, 0.3), transparent)',
        backgroundSize: '200% 100%',
        animation: `shimmer 3s ease-in-out infinite`,
      }}
    >
      <div className="absolute inset-[1px] rounded-2xl bg-[#111111] z-[-1]" />
      {children}
    </div>
  );
}

interface BorderGlowProps {
  children: ReactNode;
  className?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * Border Glow Component
 * Creates a subtle animated glow on the border
 */
export function BorderGlow({ 
  children, 
  className,
  color = 'rgba(255, 218, 185, 0.5)',
  intensity = 'medium'
}: BorderGlowProps) {
  const intensityValues = {
    low: '0 0 20px',
    medium: '0 0 30px',
    high: '0 0 50px',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border animate-border-glow',
        className
      )}
      style={{
        borderColor: 'rgba(255, 218, 185, 0.3)',
        boxShadow: `${intensityValues[intensity]} ${color}`,
      }}
    >
      {children}
    </div>
  );
}
