'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/auth'];

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return;

    // Skip if on public route
    if (PUBLIC_ROUTES.some(route => pathname?.startsWith(route))) {
      // If logged in and trying to access auth, redirect to dashboard
      if (isLoggedIn && pathname?.startsWith('/auth')) {
        router.push('/dashboard');
      }
      return;
    }

    // If not logged in, redirect to auth
    if (!isLoggedIn) {
      router.push('/auth');
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  // Show loading spinner while checking auth or redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <motion.div
          className="relative w-12 h-12"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] opacity-50 blur-sm" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#09090B]" />
          </div>
        </motion.div>
      </div>
    );
  }

  // Don't render children if not authenticated and on protected route
  if (!isLoggedIn && !PUBLIC_ROUTES.some(route => pathname?.startsWith(route))) {
    return null;
  }

  // Don't render auth page content if logged in
  if (isLoggedIn && pathname?.startsWith('/auth')) {
    return null;
  }

  return <>{children}</>;
}
