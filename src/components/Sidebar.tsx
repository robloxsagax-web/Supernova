'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Plus, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/create', label: 'Create', icon: Plus },
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
      className="fixed left-0 top-0 h-screen glass border-r border-border flex flex-col z-50"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
        >
          <span className="text-xl">✨</span>
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="ml-3"
            >
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Supernova
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-r-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 flex-shrink-0" />
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
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-3 space-y-2">
        {/* Collapse Toggle */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
