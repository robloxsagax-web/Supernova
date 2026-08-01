'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
  variant?: 'maroon-peach' | 'gold' | 'sunset' | 'aurora';
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}

/**
 * Animated Gradient Text Component
 * Creates smooth animated gradient text effects
 * Inspired by Aceternity UI gradient text
 */
export function AnimatedGradientText({ 
  children, 
  className,
  speed = 'normal',
  variant = 'maroon-peach',
  as: Component = 'span'
}: AnimatedGradientTextProps) {
  const speedClasses = {
    slow: 'duration-[6000ms]',
    normal: 'duration-[4000ms]',
    fast: 'duration-[2000ms]',
  };

  const gradientClasses = {
    'maroon-peach': 'from-[#5C3317] via-[#FFDAB9] via-50% to-[#8B5A2B]',
    'gold': 'from-[#FFD700] via-[#FFA500] to-[#B8860B]',
    'sunset': 'from-[#FF6B6B] via-[#FFE66D] to-[#4ECDC4]',
    'aurora': 'from-[#5C3317] via-[#FFDAB9] via-30% to-[#22C55E] to-70% via-[#FFDAB9]',
  };

  return (
    <Component
      className={cn(
        'bg-clip-text text-transparent bg-no-repeat',
        'bg-[length:200%_auto]',
        'animate-gradient-shift',
        speedClasses[speed],
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${variant === 'maroon-peach' ? '#5C3317 0%, #FFDAB9 25%, #8B5A2B 50%, #FFDAB9 75%, #5C3317 100%' : variant === 'gold' ? '#FFD700 0%, #FFA500 50%, #B8860B 100%' : variant === 'sunset' ? '#FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%' : '#5C3317 0%, #FFDAB9 30%, #22C55E 60%, #FFDAB9 100%'})`,
      }}
    >
      {children}
    </Component>
  );
}

interface HeroTextProps {
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Hero Animated Text
 * For large hero sections with animated gradient
 */
export function HeroAnimatedText({ title, subtitle, className }: HeroTextProps) {
  return (
    <div className={cn('space-y-4 text-center', className)}>
      <h1 className="text-5xl md:text-7xl font-bold">
        <AnimatedGradientText 
          variant="maroon-peach" 
          speed="slow"
          as="span"
        >
          {title}
        </AnimatedGradientText>
      </h1>
      {subtitle && (
        <p className="text-xl text-[rgba(255,255,255,0.65)] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface GradientButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'maroon-peach' | 'gold' | 'sunset';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Gradient Button with animated hover effect
 */
export function GradientButton({ 
  children, 
  className,
  variant = 'maroon-peach',
  size = 'md',
  onClick,
  disabled = false
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const gradientStyles = {
    'maroon-peach': {
      background: 'linear-gradient(135deg, #5C3317 0%, #FFDAB9 100%)',
      hover: 'linear-gradient(135deg, #7A4320 0%, #FFDAB9 100%)',
    },
    'gold': {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      hover: 'linear-gradient(135deg, #FFC000 0%, #FF8C00 100%)',
    },
    'sunset': {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
      hover: 'linear-gradient(135deg, #FF5252 0%, #FFD93D 100%)',
    },
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-xl font-semibold transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      style={{
        background: gradientStyles[variant].background,
        color: variant === 'sunset' ? '#09090B' : '#FFDAB9',
      }}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface GlowingTextProps {
  children: ReactNode;
  className?: string;
  color?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
}

/**
 * Glowing Text
 * Text with animated glow effect
 */
export function GlowingText({ 
  children, 
  className,
  color = '#FFDAB9',
  glowIntensity = 'medium'
}: GlowingTextProps) {
  const glowSizes = {
    low: '0 0 10px',
    medium: '0 0 20px',
    high: '0 0 40px',
  };

  return (
    <motion.span
      className={cn('relative inline-block', className)}
      animate={{
        textShadow: [
          `${glowSizes[glowIntensity]} ${color}`,
          `${glowSizes[glowIntensity === 'low' ? 'medium' : 'high']} ${color}`,
          `${glowSizes[glowIntensity]} ${color}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
}
