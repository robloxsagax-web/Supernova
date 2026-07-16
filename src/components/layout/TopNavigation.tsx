'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Plus, Command, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoIcon } from '@/components/ui/logo';

/**
 * Premium Top Navigation - Inspired by Linear, Notion, Vercel
 * Features:
 * - Glass navbar with subtle blur
 * - Search with ⌘K command palette style
 * - Notification bell with indicator
 * - New Campaign button
 * - Premium animations and hover effects
 */

interface TopNavigationProps {
  onNewCampaign?: () => void;
  className?: string;
}

export function TopNavigation({ onNewCampaign, className }: TopNavigationProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search on keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Container */}
              <div className="relative bg-[#111111] rounded-2xl border border-[rgba(255,218,185,0.15)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#5C3317]/10 to-transparent pointer-events-none" />
                
                {/* Search Input */}
                <div className="relative flex items-center gap-4 p-5">
                  <Search className="w-6 h-6 text-[rgba(255,218,185,0.5)]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search campaigns, projects, assets..."
                    className="flex-1 bg-transparent text-lg text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                  >
                    <X className="w-5 h-5 text-[rgba(255,255,255,0.4)]" />
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[rgba(255,218,185,0.1)] to-transparent" />

                {/* Quick Actions */}
                <div className="p-4">
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-3 px-2">
                    Quick Actions
                  </p>
                  <div className="space-y-1">
                    {[
                      { label: 'Create new campaign', shortcut: '⌘N', icon: Plus },
                      { label: 'View recent projects', shortcut: '⌘P', icon: Search },
                    ].map((action, i) => (
                      <motion.button
                        key={action.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[rgba(255,218,185,0.1)] flex items-center justify-center group-hover:bg-[rgba(255,218,185,0.15)] transition-colors">
                          <action.icon className="w-4 h-4 text-[#FFDAB9]" />
                        </div>
                        <span className="flex-1 text-left text-sm text-white">{action.label}</span>
                        <span className="text-xs text-[rgba(255,255,255,0.3)] px-2 py-1 rounded-md bg-[rgba(255,255,255,0.05)]">
                          {action.shortcut}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          'fixed top-0 right-0 h-16 z-40',
          'flex items-center justify-between gap-4 px-6',
          'border-b border-[rgba(255,218,185,0.08)]',
          'bg-[rgba(9,9,11,0.8)] backdrop-blur-xl',
          className
        )}
      >
        {/* Left: Logo (mobile only) */}
        <div className="hidden max-[1024px:block">
          <LogoIcon size="sm" showBadge />
        </div>

        {/* Center: Search */}
        <motion.button
          onClick={() => setSearchOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 rounded-xl',
            'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]',
            'hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]',
            'transition-all duration-200 group'
          )}
        >
          <Search className="w-4 h-4 text-[rgba(255,255,255,0.4)] group-hover:text-[rgba(255,255,255,0.6)] transition-colors" />
          <span className="text-sm text-[rgba(255,255,255,0.4)] group-hover:text-[rgba(255,255,255,0.6)] transition-colors hidden md:block">
            Search campaigns...
          </span>
          <div className="hidden md:flex items-center gap-1 ml-4 px-2 py-1 rounded-md bg-[rgba(255,255,255,0.05)]">
            <Command className="w-3 h-3 text-[rgba(255,255,255,0.3)]" />
            <span className="text-xs text-[rgba(255,255,255,0.3)]">K</span>
          </div>
        </motion.button>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* New Campaign Button */}
          <motion.button
            onClick={onNewCampaign}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl',
              'bg-gradient-to-r from-[#5C3317] to-[#8B5A2B]',
              'text-[#FFDAB9] font-semibold text-sm',
              'shadow-lg hover:shadow-xl transition-all duration-200',
              'hover:shadow-[0_8px_30px_rgba(92,51,23,0.4)]'
            )}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">New Campaign</span>
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'relative p-2.5 rounded-xl',
              'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]',
              'hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]',
              'transition-all duration-200'
            )}
          >
            <Bell className="w-5 h-5 text-[rgba(255,255,255,0.6)]" />
            
            {/* Notification indicator */}
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          </motion.button>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C3317] via-[#8B5A2B] to-[#FFDAB9] p-[2px]">
              <div className="w-full h-full rounded-[10px] bg-[#111111] flex items-center justify-center">
                <span className="text-sm font-semibold text-[#FFDAB9]">AC</span>
              </div>
            </div>
            
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#09090B]" />
          </motion.div>
        </div>
      </motion.header>
    </>
  );
}

/**
 * Mobile Navigation - Simplified for small screens
 */
export function MobileNavigation({ onNewCampaign }: { onNewCampaign?: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="flex items-center justify-around px-4 py-3 bg-[rgba(17,17,17,0.95)] backdrop-blur-xl border-t border-[rgba(255,218,185,0.08)]">
        <NavButton href="/dashboard" icon={Search} label="Dashboard" />
        <NavButton href="/create" icon={Plus} label="Create" primary onClick={onNewCampaign} />
        <NavButton href="/settings" icon={Bell} label="Settings" />
      </div>
    </div>
  );
}

function NavButton({ 
  href, 
  icon: Icon, 
  label, 
  primary = false,
  onClick 
}: { 
  href?: string; 
  icon: React.ElementType; 
  label: string; 
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-xl transition-colors',
        primary
          ? 'bg-gradient-to-r from-[#5C3317] to-[#8B5A2B] text-[#FFDAB9]'
          : 'text-[rgba(255,255,255,0.5)] hover:text-white'
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </motion.button>
  );
}
