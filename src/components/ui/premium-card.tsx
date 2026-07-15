'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: 'maroon' | 'peach' | 'orange' | 'green';
  hoverScale?: boolean;
}

export function PremiumCard({
  children,
  className,
  onClick,
  glowColor = 'maroon',
  hoverScale = true,
}: PremiumCardProps) {
  const glowColors = {
    maroon: 'rgba(92, 51, 23, 0.4)',
    peach: 'rgba(255, 218, 185, 0.4)',
    orange: 'rgba(255, 122, 0, 0.4)',
    green: 'rgba(34, 197, 94, 0.4)',
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverScale ? { scale: 1.02, y: -4 } : { y: -4 }}
      whileTap={hoverScale ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-[rgba(255,218,185,0.08)] to-[rgba(255,218,185,0.02)]',
        'backdrop-blur-xl',
        'border border-[rgba(255,218,185,0.15)]',
        'p-6 transition-all duration-300',
        'hover:border-[rgba(255,218,185,0.30)]',
        'shadow-lg hover:shadow-2xl',
        'group cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Glow Effect on Hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColors[glowColor]} 0%, transparent 70%)`,
        }}
      />

      {/* Icon Container Lift Effect */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom Glow Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,218,185,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Top Right Corner Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFDAB9]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

interface IconCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  glowColor?: 'maroon' | 'peach' | 'orange' | 'green';
}

export function IconCard({ icon, title, description, className, onClick, glowColor = 'maroon' }: IconCardProps) {
  return (
    <PremiumCard onClick={onClick} glowColor={glowColor} className={className}>
      <div className="flex flex-col gap-4">
        {/* Icon Container with Lift Effect */}
        <motion.div
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center shadow-lg"
          whileHover={{ y: -4, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Glow on icon container */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(92, 51, 23, 0.4) 0%, transparent 70%)',
              filter: 'blur(12px)',
            }}
          />
          <div className="relative z-10 text-[#FFDAB9]">
            {icon}
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-[#FFDAB9] transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[rgba(255,255,255,0.65)] group-hover:text-[rgba(255,255,255,0.8)] transition-colors">
              {description}
            </p>
          )}
        </div>
      </div>
    </PremiumCard>
  );
}

interface StatCardProps {
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ value, label, trend, icon, className }: StatCardProps) {
  return (
    <PremiumCard className={className}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          {/* Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.div>

          {/* Label */}
          <div className="text-sm text-[rgba(255,255,255,0.65)]">{label}</div>

          {/* Trend */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
                trend.isPositive
                  ? 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]'
                  : 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </motion.div>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <motion.div
            className="w-12 h-12 rounded-xl bg-[rgba(92,51,23,0.3)] flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="text-[#FFDAB9]">{icon}</div>
          </motion.div>
        )}
      </div>
    </PremiumCard>
  );
}
