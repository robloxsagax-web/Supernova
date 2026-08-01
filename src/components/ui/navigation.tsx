'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NavItem({ icon: Icon, label, isActive = false, onClick, className }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group',
        isActive
          ? 'bg-[#5C3317]/20 text-[#FFDAB9]'
          : 'text-[rgba(255,255,255,0.65)] hover:text-white hover:bg-white/5',
        className
      )}
    >
      {/* Glow Effect on Active */}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute inset-0 bg-gradient-to-r from-[#5C3317]/20 to-[#FFDAB9]/10 rounded-xl border border-[rgba(255,218,185,0.3)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Icon Container with Lift Effect */}
      <motion.div
        className={cn(
          'relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
          isActive
            ? 'bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] shadow-lg'
            : 'bg-white/5 group-hover:bg-white/10'
        )}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(92, 51, 23, 0.4) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
        
        <Icon
          className={cn(
            'w-5 h-5 relative z-10 transition-all duration-300',
            isActive
              ? 'text-[#FFDAB9] drop-shadow-lg'
              : 'text-current group-hover:text-[#FFDAB9]'
          )}
        />
      </motion.div>

      {/* Label */}
      <span className="relative z-10 flex-1 text-left">{label}</span>

      {/* Active Indicator Dot */}
      {isActive && (
        <motion.div
          layoutId="activeDot"
          className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#FFDAB9] shadow-lg shadow-[#FFDAB9]/50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        />
      )}

      {/* Hover Glow Line */}
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#FFDAB9]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </motion.button>
  );
}

interface NavSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function NavSection({ title, children, className }: NavSectionProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {title && (
        <h3 className="px-4 py-2 text-xs font-semibold text-[rgba(255,255,255,0.45)] uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

interface NavGroupProps {
  items: NavItemProps[];
  className?: string;
}

export function NavGroup({ items, className }: NavGroupProps) {
  return (
    <motion.div
      className={cn('space-y-1', className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <NavItem {...item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
