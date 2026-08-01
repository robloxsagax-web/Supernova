'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Storage key for checking auth
const STORAGE_KEY = 'supernova_is_logged_in';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check localStorage directly
    const isLoggedIn = localStorage.getItem(STORAGE_KEY) === 'true';
    
    if (isLoggedIn) {
      router.replace('/dashboard');
    } else {
      router.replace('/auth');
    }
  }, [router]);

  // Minimal loading state
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] opacity-50 blur-sm animate-pulse" />
      </div>
    </div>
  );
}
