'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  suffix = '',
  prefix = '',
  trend,
  className,
  delay = 0
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate the counter
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-[rgba(255,218,185,0.08)] to-[rgba(255,218,185,0.02)]',
        'backdrop-blur-xl',
        'border border-[rgba(255,218,185,0.15)]',
        'p-6 transition-all duration-300',
        'hover:border-[rgba(255,218,185,0.30)]',
        'shadow-lg hover:shadow-xl',
        'hover:shadow-[#5C3317]/10',
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#5C3317]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-[rgba(255,255,255,0.65)]">
            {title}
          </span>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C3317]/20 to-[#FFDAB9]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#FFDAB9]" />
          </div>
        </div>
        
        {/* Value */}
        <div className="flex items-baseline gap-2">
          {prefix && (
            <span className="text-2xl font-bold text-[rgba(255,255,255,0.65)]">
              {prefix}
            </span>
          )}
          <motion.span 
            key={displayValue}
            className="text-4xl font-bold text-white tracking-tight"
          >
            {displayValue.toLocaleString()}
          </motion.span>
          {suffix && (
            <span className="text-lg text-[rgba(255,255,255,0.45)]">
              {suffix}
            </span>
          )}
        </div>
        
        {/* Trend */}
        {trend && (
          <div className="mt-3 flex items-center gap-2">
            <span className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'
            )}>
              <svg 
                className={cn(
                  'w-4 h-4',
                  !trend.isPositive && 'rotate-180'
                )}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 10l7-7m0 0l7 7m-7-7v18" 
                />
              </svg>
              {trend.value}%
            </span>
            <span className="text-xs text-[rgba(255,255,255,0.45)]">
              vs last month
            </span>
          </div>
        )}
      </div>
      
      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,218,185,0.3)] to-transparent" />
    </motion.div>
  );
}
