'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * Loading Skeleton Components
 * Premium skeleton loaders for content placeholders
 * Inspired by shadcn/ui Skeleton
 */

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const variantClasses = {
    text: 'skeleton skeleton-text',
    circular: 'skeleton skeleton-avatar rounded-full',
    rectangular: 'skeleton',
    card: 'skeleton skeleton-card',
  };

  return (
    <div className={cn(variantClasses[variant], className)} />
  );
}

interface SkeletonCardProps {
  showImage?: boolean;
  lines?: number;
  className?: string;
}

/**
 * Skeleton Card - A complete card placeholder
 */
export function SkeletonCard({ showImage = true, lines = 3, className }: SkeletonCardProps) {
  return (
    <div className={cn('p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5 space-y-4', className)}>
      {showImage && (
        <Skeleton variant="card" className="w-full h-40" />
      )}
      <Skeleton variant="heading" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            variant="text" 
            className="w-full" 
            style={{ opacity: 1 - (i * 0.2) }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Skeleton variant="circular" className="w-8 h-8" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

interface SkeletonListProps {
  items?: number;
  className?: string;
}

/**
 * Skeleton List - Multiple skeleton items in a list
 */
export function SkeletonList({ items = 5, className }: SkeletonListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02]">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Skeleton Table - Table placeholder
 */
export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4 p-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-3 rounded-lg bg-white/[0.02]">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className="h-4 flex-1" 
              style={{ opacity: 1 - (rowIndex * 0.1) }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface SkeletonDashboardProps {
  className?: string;
}

/**
 * Skeleton Dashboard - Full dashboard placeholder
 */
export function SkeletonDashboard({ className }: SkeletonDashboardProps) {
  return (
    <div className={cn('space-y-8 p-8', className)}>
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} showImage={false} lines={2} />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      
      {/* Table */}
      <SkeletonTable rows={4} columns={4} />
    </div>
  );
}

/**
 * Animated Skeleton Line
 * For inline content loading
 */
export function SkeletonLine({ width = '100%', className }: { width?: string; className?: string }) {
  return (
    <motion.div
      className={cn('skeleton h-4 rounded', className)}
      style={{ width }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/**
 * Pulse Skeleton
 * Simple pulsing skeleton
 */
export function PulseSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('bg-white/5 rounded-lg', className)}
      animate={{
        scale: [1, 1.02, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
