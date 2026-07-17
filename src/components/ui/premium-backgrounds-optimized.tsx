'use client';

/**
 * PERFORMANCE OPTIMIZED Premium Background Components
 * 
 * Optimizations applied:
 * - GPU acceleration with transform: translate3d
 * - will-change hints for animated elements
 * - Reduced animation complexity where possible
 * - Memoized particle positions
 * - CSS containment for isolated repaints
 */

import { motion, MotionValue } from 'framer-motion';
import { useMemo, memo } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// OPTIMIZED AURORA BACKGROUND
// ============================================
const AuroraGlow = memo(function AuroraGlow({ 
  className,
  animate,
  style,
  transition
}: { 
  className?: string;
  animate: { scale?: number[]; opacity?: number[]; x?: number[]; y?: number[] };
  style: React.CSSProperties;
  transition: { duration: number; repeat: number; ease: string; delay?: number };
}) {
  return (
    <motion.div 
      className={cn('absolute will-change-transform', className)}
      animate={animate}
      transition={transition}
      style={{
        ...style,
        transform: 'translate3d(0, 0, 0)', // Force GPU layer
      }}
    />
  );
});

export const PremiumAuroraBackground = memo(function PremiumAuroraBackground({ 
  className 
}: { className?: string }) {
  return (
    <div className={cn('fixed inset-0 -z-50 overflow-hidden contain-strict', className)}>
      {/* Base Background - Static, no animation */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Primary Aurora Glow - GPU Accelerated */}
      <AuroraGlow 
        className="-top-60 -left-60 w-[1000px] h-[1000px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 50, 0],
          y: [0, -40, 0],
        }}
        style={{
          background: 'radial-gradient(circle, rgba(92, 51, 23, 0.6) 0%, transparent 70%)',
          filter: 'blur(200px)',
          transform: 'translate3d(0, 0, 0)',
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Secondary Aurora Glow */}
      <AuroraGlow 
        className="-bottom-60 -right-60 w-[900px] h-[900px]"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, -60, 0],
          y: [0, 50, 0],
        }}
        style={{
          background: 'radial-gradient(circle, rgba(92, 51, 23, 0.5) 0%, transparent 70%)',
          filter: 'blur(180px)',
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      
      {/* Tertiary Glow - Top Right */}
      <AuroraGlow 
        className="-top-40 right-1/4 w-[700px] h-[700px]"
        animate={{ 
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, -40, 0],
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 218, 185, 0.3) 0%, transparent 70%)',
          filter: 'blur(160px)',
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
      
      {/* Accent Glow - Bottom Left */}
      <AuroraGlow 
        className="bottom-1/4 -left-40 w-[600px] h-[600px]"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
          y: [0, 30, 0],
        }}
        style={{
          background: 'radial-gradient(circle, rgba(139, 90, 43, 0.25) 0%, transparent 70%)',
          filter: 'blur(140px)',
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
      />

      {/* Center Glow */}
      <AuroraGlow 
        className="top-1/2 left-1/2 w-[800px] h-[800px]"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        style={{
          background: 'radial-gradient(circle, rgba(92, 51, 23, 0.2) 0%, transparent 70%)',
          filter: 'blur(120px)',
          transform: 'translate(-50%, -50%) translate3d(0, 0, 0)',
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      
      {/* Static Grid Pattern - No animation */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />
      
      {/* Static Noise Texture - No animation */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Static Gradient Fades */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none" />
    </div>
  );
});

// ============================================
// OPTIMIZED FLOATING ORBS
// ============================================
const Orb = memo(function Orb({ 
  size = 100, 
  delay = 0, 
  position = 'top-0 left-0', 
  color = '#5C3317' 
}: { 
  size?: number;
  delay?: number;
  position?: string;
  color?: string;
}) {
  return (
    <motion.div
      className={cn('absolute rounded-full pointer-events-none will-change-transform', position)}
      style={{ 
        width: size, 
        height: size, 
        background: color,
        filter: 'blur(60px)',
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
    />
  );
});

export const FloatingOrbs = memo(function FloatingOrbs({ className }: { className?: string }) {
  return (
    <div 
      className={cn('absolute inset-0 overflow-hidden pointer-events-none contain-strict', className)}
      style={{ contain: 'layout paint' }}
    >
      <Orb size={400} delay={0} position="top-[-200px] left-[-100px]" color="#5C3317" />
      <Orb size={300} delay={2} position="top-[20%] right-[-100px]" color="#FFDAB9" />
      <Orb size={350} delay={4} position="bottom-[-150px] left-[30%]" color="#8B5A2B" />
      <Orb size={250} delay={6} position="bottom-[10%] right-[10%]" color="#5C3317" />
    </div>
  );
});

// ============================================
// OPTIMIZED PARTICLE GRID
// ============================================
interface Particle {
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export const ParticleGrid = memo(function ParticleGrid({ className }: { className?: string }) {
  // Memoize particle positions - only computed once
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div 
      className={cn('absolute inset-0 pointer-events-none overflow-hidden contain-strict', className)}
      style={{ contain: 'layout paint' }}
    >
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: 'rgba(255, 218, 185, 0.2)',
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
});
