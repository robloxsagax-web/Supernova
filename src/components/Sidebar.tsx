'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles,
  LayoutDashboard,
  FolderOpen,
  Palette,
  Video,
  Image,
  Archive,
  Paintbrush,
  BarChart3,
  HardDrive,
  Settings,
  User,
  ArrowUpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create', label: 'Create', icon: Sparkles },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/creative-studio', label: 'Creative Studio', icon: Palette },
  { href: '/asset-library', label: 'Asset Library', icon: Archive },
  { href: '/brand-kit', label: 'Brand Kit', icon: Paintbrush },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/storage', label: 'Storage', icon: HardDrive },
];

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen glass-panel flex flex-col z-50 overflow-hidden"
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-5 border-b border-[rgba(255,255,255,0.08)] shrink-0">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C3317] via-[#8B5A2B] to-[#5C3317] flex items-center justify-center shadow-lg glow-maroon"
          >
            <Sparkles className="w-6 h-6 text-[#FFDAB9]" />
            {/* Glow dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#22C55E] rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="text-xl font-bold font-heading tracking-tight">
                  <span className="gradient-text">Supernova</span>
                </h1>
                <p className="text-xs text-[rgba(255,255,255,0.45)] font-medium">
                  AI Marketing Agent
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-[#5C3317]/30 to-[#FFDAB9]/10 text-[#FFDAB9] border border-[rgba(255,218,185,0.2)]'
                      : 'text-[rgba(255,255,255,0.65)] hover:text-[#FFDAB9] hover:bg-[rgba(255,255,255,0.05)]'
                  )}
                >
                  {isActive && (
                    <>
                      {/* Active indicator bar */}
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#5C3317] to-[#FFDAB9] rounded-r-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#5C3317]/10 to-transparent rounded-xl blur-md -z-10" />
                    </>
                  )}
                  <motion.div
                    whileHover={{ rotate: isActive ? 0 : 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'w-6 h-6 flex items-center justify-center',
                      isActive && 'text-[#FFDAB9]'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="ml-auto w-2 h-2 rounded-full bg-[#FFDAB9] shadow-lg shadow-[#FFDAB9]/50"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[rgba(255,255,255,0.08)] p-3 space-y-2 shrink-0">
        {/* Bottom nav items */}
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-[rgba(255,218,185,0.1)] text-[#FFDAB9]'
                    : 'text-[rgba(255,255,255,0.65)] hover:text-[#FFDAB9] hover:bg-[rgba(255,255,255,0.05)]'
                )}
              >
                <Icon className="w-5 h-5" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}

        {/* Upgrade CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#5C3317]/20 to-[#FFDAB9]/5 border border-[rgba(255,218,185,0.15)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <ArrowUpCircle className="w-5 h-5 text-[#FFDAB9]" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-semibold text-[#FFDAB9]"
                >
                  Upgrade Plan
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-[rgba(255,255,255,0.45)] mb-3"
              >
                Unlock unlimited campaigns
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-[#5C3317] to-[#8B5A2B] text-[#FFDAB9] text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Upgrade Now
          </motion.button>
        </motion.div>

        {/* User Profile */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl glass-button cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <User className="w-5 h-5 text-[#09090B]" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate group-hover:text-[#FFDAB9] transition-colors">
                  Alex Chen
                </p>
                <p className="text-xs text-[rgba(255,255,255,0.45)] truncate">
                  Pro Plan
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
}
