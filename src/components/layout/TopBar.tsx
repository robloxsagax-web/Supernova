'use client';

import { motion } from 'framer-motion';
import { Search, Plus, Bell, Sparkles } from 'lucide-react';

interface TopBarProps {
  onNewCampaign?: () => void;
}

export function TopBar({ onNewCampaign }: TopBarProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 right-0 left-64 h-16 glass border-b border-border z-40"
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-peach transition-colors" />
            <input
              type="text"
              placeholder="Search campaigns, projects, assets..."
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-peach/50 focus:bg-white/10 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-maroon/20 to-peach/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-6">
          {/* New Campaign Button */}
          <motion.button
            onClick={onNewCampaign}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-sm font-semibold text-background hover:opacity-90 transition-all duration-300 shadow-lg glow-maroon"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-xl glass text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </motion.button>

          {/* Profile Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center cursor-pointer"
          >
            <span className="text-sm font-semibold text-background">AC</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
