'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sparkles,
  LayoutDashboard,
  Settings,
  User,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkle,
  CreditCard,
  LogOut,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SupernovaMinimalLogo, SupernovaTextLogo } from '@/components/ui/logo';
import { useAuth } from '@/lib/auth';

/**
 * Premium Glass Sidebar - Performance Optimized
 * 
 * Optimizations:
 * - Memoized nav items
 * - Memoized NavItem component
 * - useCallback for handlers
 * - useMemo for stable object references
 */

// Memoized navigation items
const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create', label: 'Create Campaign', icon: Sparkles },
  { href: '/gallery', label: 'Gallery', icon: FolderOpen },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
] as const;

const BOTTOM_NAV_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

// Memoized NavItem component
const NavItem = memo(function NavItem({ 
  href, 
  label, 
  icon: Icon, 
  isActive, 
  isCollapsed, 
  onClick 
}: { 
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        className={cn(
          'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group',
          isActive
            ? 'bg-gradient-to-r from-[#5C3317]/40 to-[#5C3317]/20 text-[#FFDAB9]'
            : 'text-[rgba(255,255,255,0.6)] hover:text-[#FFDAB9] hover:bg-[rgba(255,255,255,0.05)]'
        )}
        whileHover={{ x: 4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isActive && (
          <>
            {/* Active left border - maroon glow */}
            <motion.div
              layoutId="activeBorder"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 bg-gradient-to-b from-[#5C3317] via-[#FFDAB9] to-[#5C3317] rounded-r-full shadow-[0_0_15px_rgba(255,218,185,0.5)]"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
            
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#5C3317]/15 to-transparent rounded-xl" />
            
            {/* Pulse dot */}
            <motion.div
              layoutId="activeDot"
              className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFDAB9] shadow-[0_0_10px_rgba(255,218,185,0.8)]"
            />
          </>
        )}
        
        {/* Icon container with hover lift */}
        <motion.div
          whileHover={{ y: -2, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            'relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 will-change-transform',
            isActive 
              ? 'bg-[#5C3317]/50 shadow-[0_0_20px_rgba(92,51,23,0.4)]' 
              : 'bg-[rgba(255,255,255,0.03)] group-hover:bg-[#5C3317]/30'
          )}
        >
          <Icon className={cn(
            'w-5 h-5 transition-all duration-300 will-change-transform',
            isActive ? 'text-[#FFDAB9]' : 'text-[rgba(255,255,255,0.6)] group-hover:text-[#FFDAB9]'
          )} />
          
          {/* Icon glow on hover */}
          {!isActive && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#5C3317]/0 to-[#FFDAB9]/0 group-hover:from-[#5C3317]/20 group-hover:to-transparent transition-all duration-300 opacity-0 group-hover:opacity-100" />
          )}
        </motion.div>
        
        {/* Label */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden will-change-transform"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
});

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Memoize handlers to prevent unnecessary rerenders
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const handleExpandSidebar = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/auth');
  }, [logout, router]);

  // Memoize active states to prevent recalculation
  const activeItems = useMemo(() => {
    const active = new Set<string>();
    NAV_ITEMS.forEach(item => {
      if (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) {
        active.add(item.href);
      }
    });
    return active;
  }, [pathname]);

  return (
    <>
      {/* Premium Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 280 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-screen flex flex-col z-50 overflow-hidden"
      >
        {/* Glass Background */}
        <div className="absolute inset-0 bg-[rgba(17,17,17,0.8)] backdrop-blur-[30px] border-r border-[rgba(255,218,185,0.08)]" />
        
        {/* Ambient glow top */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#5C3317]/10 to-transparent pointer-events-none" />
        
        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center px-4 shrink-0">
            <div className="flex items-center gap-3 w-full">
              {/* Premium Logo */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="relative flex-shrink-0 will-change-transform"
              >
                <SupernovaMinimalLogo size="md" animate={true} />
              </motion.div>
              
              {/* Logo Text */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden will-change-transform"
                  >
                    <SupernovaTextLogo size="sm" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Collapse Button */}
              <button
                onClick={handleToggleCollapse}
                className={cn(
                  'ml-auto p-1.5 rounded-lg transition-all duration-300 will-change-transform',
                  'hover:bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)] hover:text-[#FFDAB9]',
                  isCollapsed && 'mx-auto ml-0'
                )}
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>

          {/* Online Status Badge */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-3 will-change-transform"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-xs text-[rgba(255,255,255,0.6)]">All systems operational</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <nav className="flex-1 py-2 px-3 overflow-y-auto">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeItems.has(item.href);
                return (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                  />
                );
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-[rgba(255,255,255,0.06)] p-3 space-y-2 shrink-0">
            {/* Bottom nav items */}
            {BOTTOM_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                />
              );
            })}

            {/* Upgrade CTA - Glass Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                'mt-3 rounded-xl p-4 transition-all duration-300 will-change-transform',
                'bg-gradient-to-br from-[#5C3317]/20 to-[rgba(255,218,185,0.05)]',
                'border border-[rgba(255,218,185,0.1)]',
                'hover:border-[rgba(255,218,185,0.2)] hover:bg-gradient-to-br hover:from-[#5C3317]/30 hover:to-[rgba(255,218,185,0.08)]',
                isCollapsed && 'p-2'
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center shadow-lg will-change-transform"
                >
                  <ArrowUpCircle className="w-5 h-5 text-[#FFDAB9]" />
                </motion.div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 will-change-transform"
                    >
                      <p className="text-sm font-semibold text-[#FFDAB9]">Upgrade Plan</p>
                      <p className="text-xs text-[rgba(255,255,255,0.5)]">Unlimited campaigns</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/pricing')}
                className={cn(
                  'w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 will-change-transform',
                  'bg-gradient-to-r from-[#5C3317] to-[#8B5A2B]',
                  'text-[#FFDAB9] shadow-lg hover:shadow-xl',
                  'hover:shadow-[0_8px_30px_rgba(92,51,23,0.4)]',
                  isCollapsed && 'px-2'
                )}
              >
                {isCollapsed ? (
                  <Sparkle className="w-4 h-4 mx-auto" />
                ) : (
                  'Upgrade Now'
                )}
              </motion.button>
            </motion.div>

            {/* User Profile - Premium Glass */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 will-change-transform',
                'bg-[rgba(255,255,255,0.03)]',
                'hover:bg-[rgba(255,255,255,0.08)]',
                'border border-transparent hover:border-[rgba(255,218,185,0.15)]',
                'group',
                isCollapsed && 'justify-center p-2'
              )}
            >
              {/* Avatar with premium gradient */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative flex-shrink-0 will-change-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C3317] via-[#8B5A2B] to-[#FFDAB9] p-[2px]">
                  <div className="w-full h-full rounded-[10px] bg-[#111111] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#FFDAB9]" />
                  </div>
                </div>
                
                {/* Online status */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#111111]" />
              </motion.div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 min-w-0 will-change-transform"
                  >
                    <p className="text-sm font-medium text-white truncate group-hover:text-[#FFDAB9] transition-colors">
                      {user?.name || 'Guest'}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#5C3317]/50 to-[#8B5A2B]/50 text-[#FFDAB9] font-medium">
                        Starter
                      </span>
                      <span className="text-xs text-[rgba(255,255,255,0.4)]">
                        Plan
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'p-2 rounded-lg transition-all duration-300 will-change-transform',
                  'hover:bg-red-500/20 text-[rgba(255,255,255,0.4)] hover:text-red-400',
                  isCollapsed ? 'mx-auto' : 'ml-auto'
                )}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Expand button when collapsed */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleExpandSidebar}
            className="fixed left-[72px] top-20 z-50 p-2 rounded-lg bg-[#111111] border border-[rgba(255,218,185,0.1)] hover:border-[rgba(255,218,185,0.2)] hover:bg-[#1a1a1a] transition-all duration-300 will-change-transform"
          >
            <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.6)]" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
