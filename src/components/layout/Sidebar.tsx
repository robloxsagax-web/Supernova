'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles,
  LayoutDashboard,
  Plus,
  FolderOpen,
  Palette,
  Video,
  Image,
  Archive,
  Paintbrush,
  BarChart3,
  HardDrive,
  Settings,
  ArrowUpCircle,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '#' },
  { icon: Plus, label: 'Create Campaign', href: '#' },
  { icon: FolderOpen, label: 'Projects', href: '#' },
  { icon: Palette, label: 'Creative Studio', href: '#' },
  { icon: Video, label: 'Video Ads', href: '#' },
  { icon: Image, label: 'Image Ads', href: '#' },
  { icon: Archive, label: 'Asset Library', href: '#' },
  { icon: Paintbrush, label: 'Brand Kit', href: '#' },
  { icon: BarChart3, label: 'Analytics', href: '#' },
  { icon: HardDrive, label: 'Storage', href: '#' },
];

const bottomNavItems = [
  { icon: Settings, label: 'Settings', href: '#' },
];

interface SidebarProps {
  activeItem?: string;
}

export function Sidebar({ activeItem = 'Dashboard' }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-64 glass flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-maroon">
              <Sparkles className="w-6 h-6 text-peach" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Supernova</h1>
            <p className="text-xs text-muted-foreground">AI Marketing Agent</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {mainNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;
            
            return (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'glass bg-primary/10 text-peach glow-maroon'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'text-peach')} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-peach"
                  />
                )}
              </motion.a>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-3 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          );
        })}
        
        {/* Upgrade CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 rounded-xl gradient-muted border border-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <ArrowUpCircle className="w-5 h-5 text-peach" />
            <span className="text-sm font-semibold text-foreground">Upgrade Plan</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Unlock unlimited campaigns and advanced features
          </p>
          <button className="w-full py-2 rounded-lg gradient-primary text-sm font-semibold text-background hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </motion.div>

        {/* User Profile */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl glass-hover cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
            <User className="w-5 h-5 text-background" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Alex Chen</p>
            <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}
