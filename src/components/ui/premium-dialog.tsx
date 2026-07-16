'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

/**
 * Premium Dialog Component
 * Enhanced dialog with glow effects and smooth animations
 * Inspired by shadcn/ui Dialog
 */

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
  glowEffect?: boolean;
}

export function Dialog({ 
  isOpen, 
  onClose, 
  children, 
  className,
  showClose = true,
  glowEffect = true
}: DialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className={cn(
              'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
              'w-full max-w-lg max-h-[85vh] overflow-auto',
              'rounded-2xl border border-[rgba(255,218,185,0.2)]',
              'bg-[#111111]',
              glowEffect && 'dialog-glow',
              className
            )}
          >
            {showClose && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5 text-[#A1A1AA] hover:text-white" />
              </button>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div className={cn('p-6 pb-0', className)}>
      {children}
    </div>
  );
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn('text-xl font-semibold text-white', className)}>
      {children}
    </h2>
  );
}

interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={cn('text-sm text-[#A1A1AA] mt-1', className)}>
      {children}
    </p>
  );
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}

interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn('p-6 pt-0 flex justify-end gap-3', className)}>
      {children}
    </div>
  );
}

/**
 * Premium Sheet Component
 * Side panel with slide-in animation
 */

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export function Sheet({ 
  isOpen, 
  onClose, 
  children, 
  side = 'right',
  className 
}: SheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Sheet */}
          <motion.div
            initial={sideVariants[side].initial}
            animate={sideVariants[side].animate}
            exit={sideVariants[side].exit}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 200
            }}
            className={cn(
              'fixed top-0 bottom-0 w-full max-w-md z-50',
              'bg-[#111111] border-l border-[rgba(255,218,185,0.1)]',
              'sheet-slide-in',
              side === 'right' ? 'right-0' : 'left-0',
              className
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface SheetHeaderProps {
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

export function SheetHeader({ children, className, onClose }: SheetHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between p-6 border-b border-border', className)}>
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-[#A1A1AA]" />
        </button>
      )}
    </div>
  );
}
