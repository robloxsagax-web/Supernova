'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 gap-6",
      "md:grid-cols-2 lg:grid-cols-3",
      "auto-rows-[minmax(200px,auto)]",
      className
    )}>
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  colSpan?: 'single' | 'double' | 'triple';
  rowSpan?: 'single' | 'double';
  delay?: number;
}

export function BentoCard({ 
  children, 
  className, 
  colSpan = 'single',
  rowSpan = 'single',
  delay = 0
}: BentoCardProps) {
  const colSpanClasses = {
    single: '',
    double: 'md:col-span-2',
    triple: 'lg:col-span-3',
  };

  const rowSpanClasses = {
    single: '',
    double: 'md:row-span-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-[rgba(255,218,185,0.08)] to-[rgba(255,218,185,0.02)]',
        'backdrop-blur-xl border border-[rgba(255,218,185,0.15)]',
        'p-6 transition-all duration-300',
        'hover:border-[rgba(255,218,185,0.30)]',
        'shadow-lg hover:shadow-2xl',
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5C3317]/5 to-transparent" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFDAB9]/5 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,218,185,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
