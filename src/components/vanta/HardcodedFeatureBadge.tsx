'use client';

import React from 'react';
import { BrandPalette } from '@/types/product';

// Trust signals that cycle through the badge
const BADGE_TRUST_SIGNALS = [
  'Free Delivery',
  '100% Money-Back Guarantee',
  'Rated 5 Stars',
  'Premium Quality',
  'Limited Time Offer'
];

interface HardcodedFeatureBadgeProps {
  isVertical: boolean;
  frame: number;
  brandPalette: BrandPalette;
}

export const HardcodedFeatureBadge: React.FC<HardcodedFeatureBadgeProps> = ({ 
  isVertical, 
  frame,
  brandPalette 
}) => {
  // Cycle through trust signals based on frame (changes every 3 seconds = 90 frames)
  const signalIndex = Math.floor(frame / 90) % BADGE_TRUST_SIGNALS.length;
  const currentSignal = BADGE_TRUST_SIGNALS[signalIndex];
  
  // Subtle pulse animation
  const pulseScale = 1 + Math.sin(frame * 0.1) * 0.015;
  
  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 999,
      pointerEvents: 'none',
    }}>
      <div style={{
        transform: `scale(${pulseScale})`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
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
          display: 'block',
        }}>
          {currentSignal.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default HardcodedFeatureBadge;
