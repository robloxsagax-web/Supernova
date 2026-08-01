'use client';

import { motion, MemoExoticComponent } from 'framer-motion';
import { memo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Supernova Official Logo Component
 * Single source of truth for all Supernova branding
 * This is the animated logo used on the authentication page
 */

interface SupernovaLogoProps {
  className?: string;
  size?: number;
}

// Shared animated logo - the official Supernova brand mark
export const SupernovaLogo: MemoExoticComponent<React.FC<SupernovaLogoProps>> = memo(function SupernovaLogo({ 
  className, 
  size = 48 
}: SupernovaLogoProps) {
  return (
    <motion.div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Outer energy ring */}
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="url(#outerGradient)"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeDasharray="4 2"
          className="animate-[spin_20s_linear_infinite]"
        />
        
        {/* Middle glow ring */}
        <circle
          cx="24"
          cy="24"
          r="18"
          stroke="url(#middleGradient)"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        
        {/* Core gradient definitions */}
        <defs>
          <radialGradient id="coreGradient" cx="0.3" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#FFDAB9" />
            <stop offset="50%" stopColor="#8B5A2B" />
            <stop offset="100%" stopColor="#5C3317" />
          </radialGradient>
          <linearGradient id="outerGradient" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#FFDAB9" />
            <stop offset="100%" stopColor="#5C3317" />
          </linearGradient>
          <linearGradient id="middleGradient" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#8B5A2B" />
            <stop offset="100%" stopColor="#5C3317" />
          </linearGradient>
        </defs>
        
        {/* Core circle with energy burst */}
        <circle
          cx="24"
          cy="24"
          r="12"
          fill="url(#coreGradient)"
        />
        
        {/* Inner dark core */}
        <circle
          cx="24"
          cy="24"
          r="7"
          fill="#09090B"
        />
        
        {/* AI spark - center light */}
        <motion.circle
          cx="24"
          cy="24"
          r="4"
          fill="#FFDAB9"
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Energy rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.line
            key={i}
            x1="24"
            y1="24"
            x2={24 + Math.cos((angle * Math.PI) / 180) * 16}
            y2={24 + Math.sin((angle * Math.PI) / 180) * 16}
            stroke="#FFDAB9"
            strokeWidth="1"
            strokeOpacity="0.3"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
        
        {/* Orbital accent dots */}
        {[0, 120, 240].map((angle, i) => (
          <motion.circle
            key={i}
            cx={24 + Math.cos((angle * Math.PI) / 180) * 20}
            cy={24 + Math.sin((angle * Math.PI) / 180) * 20}
            r="1.5"
            fill="#FFDAB9"
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </svg>
    </motion.div>
  );
});

export default SupernovaLogo;
