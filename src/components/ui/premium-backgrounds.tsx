'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Premium Background Components
 * Aceternity-inspired animated backgrounds
 */

// ============================================
// AURORA BACKGROUND
// ============================================
export function PremiumAuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn('fixed inset-0 -z-50 overflow-hidden', className)}>
      {/* Base Background */}
      <div className="absolute inset-0 bg-background transition-colors duration-300" />
      
      {/* Primary Aurora Glow - Top Left */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 50, 0],
          y: [0, -40, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className="absolute -top-60 -left-60 w-[1000px] h-[1000px] 
                   bg-gradient-to-br from-[#5C3317]/60 via-[#8B5A2B]/40 to-transparent 
                   rounded-full blur-[200px]"
      />
      
      {/* Secondary Aurora Glow - Bottom Right */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, -60, 0],
          y: [0, 50, 0],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 3
        }}
        className="absolute -bottom-60 -right-60 w-[900px] h-[900px] 
                   bg-gradient-to-tr from-[#5C3317]/50 via-[#FFDAB9]/30 to-transparent 
                   rounded-full blur-[180px]"
      />
      
      {/* Tertiary Glow - Top Right */}
      <motion.div 
        animate={{ 
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, -40, 0],
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 6
        }}
        className="absolute -top-40 right-1/4 w-[700px] h-[700px] 
                   bg-gradient-to-bl from-[#FFDAB9]/30 via-[#5C3317]/20 to-transparent 
                   rounded-full blur-[160px]"
      />
      
      {/* Accent Glow - Bottom Left */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
          y: [0, 30, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 9
        }}
        className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] 
                   bg-gradient-to-tr from-[#8B5A2B]/25 to-transparent 
                   rounded-full blur-[140px]"
      />

      {/* Center Glow */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 2
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] 
                   bg-gradient-radial from-[#5C3317]/20 to-transparent 
                   rounded-full blur-[120px]"
      />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Bottom Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      
      {/* Top Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

// ============================================
// BACKGROUND BEAMS
// ============================================
interface BeamProps {
  delay?: number;
  duration?: number;
  position?: 'left' | 'right';
}

function Beam({ delay = 0, duration = 20, position = 'left' }: BeamProps) {
  return (
    <motion.div
      animate={{
        y: ['-100%', '100%'],
        opacity: [0, 0.3, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: 'linear',
        delay: delay,
      }}
      className={cn(
        'absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#FFDAB9]/30 to-transparent',
        position === 'left' ? 'left-1/4' : 'right-1/4'
      )}
    />
  );
}

export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Beam 
          key={`beam-left-${i}`} 
          delay={i * 4} 
          duration={25}
          position="left"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <Beam 
          key={`beam-right-${i}`} 
          delay={i * 4 + 2} 
          duration={20}
          position="right"
        />
      ))}
    </div>
  );
}

// ============================================
// SPOTLIGHT EFFECT
// ============================================
interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export function Spotlight({ children, className, color = 'rgba(255, 218, 185, 0.15)' }: SpotlightProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-3xl', className)}>
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle 600px at 20% 20%, ${color}, transparent 100%)`,
            `radial-gradient(circle 600px at 80% 80%, ${color}, transparent 100%)`,
            `radial-gradient(circle 600px at 20% 20%, ${color}, transparent 100%)`,
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {children}
    </div>
  );
}

// ============================================
// MOVING GRADIENT
// ============================================
export function MovingGradient({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <motion.div
        className="absolute -inset-[100%]"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, rgba(92, 51, 23, 0.1) 60deg, transparent 120deg)`,
        }}
      />
    </div>
  );
}

// ============================================
// FLOATING ORBS
// ============================================
interface OrbProps {
  size?: number;
  delay?: number;
  position?: string;
  color?: string;
}

function Orb({ size = 100, delay = 0, position = 'top-0 left-0', color = '#5C3317' }: OrbProps) {
  return (
    <motion.div
      className={cn('absolute rounded-full blur-3xl opacity-20 pointer-events-none', position)}
      style={{ width: size, height: size, background: color }}
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
}

export function FloatingOrbs({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <Orb size={400} delay={0} position="top-[-200px] left-[-100px]" color="#5C3317" />
      <Orb size={300} delay={2} position="top-[20%] right-[-100px]" color="#FFDAB9" />
      <Orb size={350} delay={4} position="bottom-[-150px] left-[30%]" color="#8B5A2B" />
      <Orb size={250} delay={6} position="bottom-[10%] right-[10%]" color="#5C3317" />
    </div>
  );
}

// ============================================
// PARTICLE GRID
// ============================================
export function ParticleGrid({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#FFDAB9]/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// GLOW LINE
// ============================================
export function GlowLine({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <div className={cn('absolute pointer-events-none', className)}>
      <motion.div
        className={cn(
          'bg-gradient-to-r from-transparent via-[#FFDAB9]/30 to-transparent',
          vertical ? 'w-px h-full' : 'h-px w-full'
        )}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
