'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'minimal' | 'icon-only';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: { icon: 28, text: 'text-base', container: 'w-9 h-9' },
  md: { icon: 36, text: 'text-lg', container: 'w-11 h-11' },
  lg: { icon: 44, text: 'text-xl', container: 'w-14 h-14' },
  xl: { icon: 56, text: 'text-2xl', container: 'w-16 h-16' },
};

/**
 * Supernova Logo - Official PNG brand logo
 * Single source of truth for all Supernova branding
 */
export function SupernovaMinimalLogo({ 
  size = 'md', 
  variant = 'full',
  className = '',
  animate = false 
}: LogoProps) {
  const { icon, container } = sizes[size];

  return (
    <motion.div
      className={cn('relative flex items-center justify-center', container, className)}
      whileHover={animate ? { scale: 1.05 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5C3317]/40 to-[#FFDAB9]/20 rounded-lg blur-xl opacity-60" />
      
      {/* Main Container */}
      <motion.div
        className="relative w-full h-full rounded-lg bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center overflow-hidden p-1"
        whileHover={animate ? { 
          boxShadow: '0 0 30px rgba(92, 51, 23, 0.5), 0 0 60px rgba(255, 218, 185, 0.2)'
        } : undefined}
      >
        <Image
          src="/Logo.png"
          alt="Supernova Logo"
          width={icon}
          height={icon}
          className="w-full h-full object-contain"
          priority
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Supernova Text Logo - Clean typography
 */
export function SupernovaTextLogo({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
}) {
  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <h1 className={cn(
        'font-bold tracking-tight',
        textSizes[size],
        'bg-gradient-to-r from-[#FFDAB9] via-[#FFDAB9] to-[#8B5A2B] bg-clip-text text-transparent'
      )}>
        Supernova
      </h1>
      <p className="text-[10px] text-[rgba(255,218,185,0.5)] font-medium tracking-wider uppercase">
        AI Marketing Agent
      </p>
    </div>
  );
}

/**
 * Full Logo with Minimal Icon + Text
 */
export function Logo({ 
  size = 'md', 
  variant = 'full',
  showText = true,
  animate = false,
  className = '' 
}: LogoProps) {
  const { icon, text, container } = sizes[size];

  // Icon-only variant
  if (variant === 'icon-only') {
    return (
      <motion.div
        className={cn(container, className)}
        whileHover={animate ? { scale: 1.1, rotate: 5 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <SupernovaMinimalLogo size={size} animate={animate} />
      </motion.div>
    );
  }

  // Minimal variant - just icon and text horizontally
  if (variant === 'minimal') {
    return (
      <motion.div
        className={cn('flex items-center gap-2.5', className)}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={animate ? { x: 2 } : undefined}
        transition={{ duration: 0.3 }}
      >
        <SupernovaMinimalLogo size={size} animate={animate} />
        {showText && (
          <SupernovaTextLogo size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'} />
        )}
      </motion.div>
    );
  }

  // Full variant - original style with online indicator
  return (
    <motion.div
      className={cn('flex items-center gap-3', className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Premium Logo Container */}
      <div className={`relative ${container}`}>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5C3317]/30 to-[#FFDAB9]/20 rounded-xl blur-xl animate-pulse" />
        
        {/* Main Logo Container */}
        <motion.div
          className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <SupernovaMinimalLogo size={size} animate={animate} />
        </motion.div>
        
        {/* Online Indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#09090B]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold ${text} text-[#FFDAB9] tracking-tight`}>
            Supernova
          </h1>
          <p className="text-[10px] text-[rgba(255,218,185,0.5)] font-medium tracking-wider uppercase">
            AI Marketing Agent
          </p>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Logo for Dashboard - Premium animated version
 */
export function DashboardLogo({ className = '' }: { className?: string }) {
  return (
    <Logo size="lg" variant="minimal" animate={true} className={className} />
  );
}

/**
 * Logo for Create/Settings pages - Minimal clean version
 */
export function PageLogo({ className = '' }: { className?: string }) {
  return (
    <Logo size="md" variant="minimal" animate={true} className={className} />
  );
}

/**
 * Logo Icon - Just the icon for compact spaces
 */
export function LogoIcon({ 
  size = 'md', 
  className = '',
  showBadge = false 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
  showBadge?: boolean;
}) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div 
      className={cn('relative', iconSizes[size], className)}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5C3317]/40 to-[#FFDAB9]/20 rounded-lg blur-md" />
      <SupernovaMinimalLogo size={size} animate={true} />
      
      {showBadge && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22C55E] rounded-full border border-[#09090B]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
