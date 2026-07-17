'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    }
  }, [isLoggedIn, isLoading, router]);

  // Loading state
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] opacity-50 blur-sm animate-pulse" />
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] p-[2px]">
          <div className="w-full h-full rounded-full bg-[#09090B]" />
        </div>
      </div>
    </div>
  );
}
