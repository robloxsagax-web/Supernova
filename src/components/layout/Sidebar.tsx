'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  Plus,
  Settings,
  ArrowUpCircle,
  User,
  Accessibility
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { NavItem, NavGroup } from '@/components/ui/navigation';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AccessibilityPanel, useAccessibility, useApplyAccessibility } from '@/components/ui/accessibility-panel';

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Plus, label: 'Create Campaign', href: '/create' },
];

const bottomNavItems = [
  { icon: Settings, label: 'Settings', href: '#' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showAccessibility, setShowAccessibility] = useState(false);
  const { settings, updateSettings } = useAccessibility();
  useApplyAccessibility(settings);

  const getActiveItem = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/create') return 'Create Campaign';
    return 'Dashboard';
  };

  const handleNavClick = (href: string) => {
    if (href !== '#') {
      router.push(href);
    }
  };

  return (
    <>
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed left-0 top-0 h-screen w-64 glass flex flex-col z-50"
      >
        {/* Premium Logo */}
        <div className="p-6 border-b border-border">
          <Logo size="md" />
        </div>

        {/* Main Navigation with Enhanced Effects */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <NavGroup
            items={mainNavItems.map((item) => ({
              icon: item.icon,
              label: item.label,
              isActive: item.label === getActiveItem(),
              onClick: () => handleNavClick(item.href),
            }))}
          />
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border p-3 space-y-1">
          {/* Accessibility Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowAccessibility(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300 group"
          >
            <div className="relative w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[rgba(92,51,23,0.3)] flex items-center justify-center transition-all duration-300">
              <Accessibility className="w-5 h-5" />
              {/* Glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(92, 51, 23, 0.4) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />
            </div>
            <span>Accessibility</span>
          </motion.button>

          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                onClick={() => handleNavClick(item.href)}
              />
            );
          })}
          
          {/* Upgrade CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 p-4 rounded-xl gradient-muted border border-border premium-card hover:border-[rgba(255,218,185,0.20)]"
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
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl glass-hover cursor-pointer group"
          >
            <motion.div
              className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-5 h-5 text-background" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-[#FFDAB9] transition-colors">Alex Chen</p>
              <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
        onSettingsChange={updateSettings}
      />
    </>
  );
}
