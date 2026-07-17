'use client';

import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/components/ui/theme-provider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
