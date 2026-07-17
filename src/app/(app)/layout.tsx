'use client';

import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { PremiumAuroraBackground, FloatingOrbs } from '@/components/ui/premium-backgrounds-optimized';
import { CustomCursor, CursorTrail } from '@/components/ui/cursor-optimized';
import { Sidebar } from '@/components/Sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PremiumAuroraBackground />
        <FloatingOrbs />
        <Sidebar />
        <main className="ml-[280px] min-h-screen transition-all duration-300 relative z-10">
          {children}
        </main>
        <CustomCursor />
        <CursorTrail />
      </AuthProvider>
    </ThemeProvider>
  );
}
