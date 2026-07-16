'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DockItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  color?: string;
}

interface DockProps {
  items: DockItem[];
  className?: string;
  position?: 'bottom' | 'top';
  magnification?: number;
}

/**
 * Premium Dock Navigation Component
 * Inspired by Magic UI and macOS Dock
 * Creates a magnification effect on hover
 */
export function Dock({ 
  items, 
  className,
  position = 'bottom',
  magnification = 1.4
}: DockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const positionClasses = {
    bottom: 'bottom-8 left-1/2 -translate-x-1/2 flex-row',
    top: 'top-8 left-1/2 -translate-x-1/2 flex-row',
    left: 'left-8 top-1/2 -translate-y-1/2 flex-col',
    right: 'right-8 top-1/2 -translate-y-1/2 flex-col',
  };

  return (
    <motion.div
      className={cn(
        'fixed z-50 flex gap-2 p-3',
        'bg-[rgba(17,17,17,0.8)] backdrop-blur-xl',
        'border border-[rgba(255,218,185,0.1)]',
        'rounded-2xl',
        positionClasses[position],
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const isHovered = hoveredIndex === index;
        const isActive = item.active;
        
        return (
          <motion.div
            key={item.label}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            animate={{
              scale: isHovered ? magnification : 1,
              y: isHovered ? -8 : 0,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <button
              onClick={item.onClick}
              className={cn(
                'relative w-14 h-14 rounded-xl',
                'flex items-center justify-center',
                'transition-all duration-300',
                isActive 
                  ? 'bg-gradient-to-br from-[#5C3317] to-[#8B5A2B]' 
                  : 'bg-white/5 hover:bg-white/10',
                'border border-transparent hover:border-[rgba(255,218,185,0.2)]'
              )}
            >
              <Icon 
                className={cn(
                  'w-6 h-6 transition-all duration-300',
                  isActive 
                    ? 'text-[#FFDAB9]' 
                    : 'text-white group-hover:text-[#FFDAB9]',
                  isHovered && 'scale-110'
                )} 
              />
              
              {/* Glow effect on hover */}
              {isHovered && (
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle, ${item.color || 'rgba(92, 51, 23, 0.4)'} 0%, transparent 70%)`,
                    filter: 'blur(12px)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </button>
            
            {/* Tooltip */}
            <motion.div
              className={cn(
                'absolute px-3 py-1.5 rounded-lg',
                'bg-[#1a1a1a] border border-[rgba(255,218,185,0.2)]',
                'text-sm font-medium text-white',
                'pointer-events-none opacity-0'
              )}
              style={{
                whiteSpace: 'nowrap',
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 5,
              }}
              transition={{ duration: 0.15 }}
            >
              {item.label}
              
              {/* Tooltip arrow */}
              <div 
                className={cn(
                  'absolute w-2 h-2 rotate-45',
                  'bg-[#1a1a1a] border-[rgba(255,218,185,0.2)]',
                  position === 'bottom' && 'top-0 -translate-y-1/2 border-t-0 border-l-0',
                  position === 'top' && 'bottom-0 translate-y-1/2 border-b-0 border-r-0'
                )}
                style={{
                  left: '50%',
                  marginLeft: '-4px',
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/**
 * Vertical Dock for side placement
 */
export function VerticalDock({ items, className }: Omit<DockProps, 'position'>) {
  return <Dock items={items} position="right" className={className} />;
}
