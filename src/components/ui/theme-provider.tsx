'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Dark-only theme - no light mode
const ThemeContext = createContext<{
  theme: 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'dark') => void;
  mounted: boolean;
} | undefined>(undefined);

export function ThemeProvider({ 
  children
}: { 
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Always set dark theme
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('supernova-theme', 'dark');
  }, []);

  // No-op functions since we're locked to dark
  const toggleTheme = () => {};
  const setTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // Return default dark theme if context is undefined (SSR)
  if (context === undefined) {
    return { 
      theme: 'dark' as const, 
      toggleTheme: () => {}, 
      setTheme: () => {},
      mounted: false 
    };
  }
  return context;
}
