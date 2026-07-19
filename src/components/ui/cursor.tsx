'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CursorMode = 'default' | 'edit' | 'pen' | 'crosshair' | 'grab' | 'pointer';
export type CursorStyle = 'nova-glow' | 'orbit-ring' | 'energy-pulse';

interface CustomCursorProps {
  mode?: CursorMode;
  className?: string;
}

const cursorStyles = {
  default: {
    size: 16,
    borderColor: '#FFDAB9',
    backgroundColor: 'rgba(255, 218, 185, 0.1)',
  },
  edit: {
    size: 20,
    borderColor: '#5C3317',
    backgroundColor: 'rgba(92, 51, 23, 0.2)',
  },
  pen: {
    size: 18,
    borderColor: '#FFDAB9',
    backgroundColor: 'rgba(255, 218, 185, 0.3)',
  },
  crosshair: {
    size: 20,
    borderColor: '#FFDAB9',
    backgroundColor: 'transparent',
  },
  grab: {
    size: 24,
    borderColor: '#FFDAB9',
    backgroundColor: 'rgba(255, 218, 185, 0.15)',
  },
  pointer: {
    size: 18,
    borderColor: '#FFDAB9',
    backgroundColor: 'rgba(255, 218, 185, 0.2)',
  },
};

export function CustomCursor({ mode = 'default', className }: CustomCursorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>('nova-glow');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkCursorVisibility = () => {
      const stored = localStorage.getItem('supernova-cursor-enabled');
      if (stored !== null) {
        setCursorEnabled(stored === 'true');
      }
    };
    
    const checkCursorStyle = () => {
      const stored = localStorage.getItem('supernova_cursor_style');
      if (stored) {
        setCursorStyle(stored as CursorStyle);
      }
    };
    
    checkCursorVisibility();
    checkCursorStyle();

    const handleStorageChange = () => {
      checkCursorVisibility();
      checkCursorStyle();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cursor-settings-changed', handleStorageChange);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener('mousemove', moveCursor);

    const interactiveElements = document.querySelectorAll('button, a, input, textarea, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cursor-settings-changed', handleStorageChange);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY, isVisible]);

  if (!cursorEnabled) return null;

  const style = cursorStyles[mode];
  const scale = isHovered ? 1.5 : 1;

  if (!isVisible) return null;

  // Orbit Ring cursor
  if (cursorStyle === 'orbit-ring') {
    return (
      <motion.div
        className={cn('fixed top-0 left-0 pointer-events-none z-[9999]', className)}
        style={{ x: cursorXSpring, y: cursorYSpring }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 rounded-full border-2 border-[#FFDAB9]/40" />
          <div className="absolute inset-2 rounded-full border border-[#8B5A2B]/50" />
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-[#FFDAB9] to-[#5C3317] shadow-[0_0_15px_rgba(255,218,185,0.8)]"
            animate={{ scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    );
  }

  // Energy Pulse cursor
  if (cursorStyle === 'energy-pulse') {
    return (
      <motion.div
        className={cn('fixed top-0 left-0 pointer-events-none z-[9999]', className)}
        style={{ x: cursorXSpring, y: cursorYSpring }}
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#FFDAB9]/20"
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-[#8B5A2B]/30"
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#FFDAB9] to-[#5C3317] shadow-[0_0_20px_rgba(255,218,185,0.6)]" />
          <motion.div
            className="absolute inset-[30%] rounded-full bg-white"
            animate={{ opacity: isHovered ? [0.6, 1, 0.6] : [0.8, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.div>
    );
  }

  // Default: Nova Glow cursor
  return (
    <motion.div
      className={cn('fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference', className)}
      style={{ x: cursorXSpring, y: cursorYSpring }}
      animate={{ scale, opacity: isVisible ? 1 : 0 }}
      transition={{ scale: { type: 'spring', stiffness: 500, damping: 28 }, opacity: { duration: 0.2 } }}
    >
      <motion.div className="relative" style={{ width: style.size, height: style.size }}>
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: style.borderColor, backgroundColor: style.backgroundColor }}
          animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFDAB9]"
          style={{ width: mode === 'crosshair' ? 2 : 4, height: mode === 'crosshair' ? 2 : 4 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${style.borderColor} 0%, transparent 70%)`, filter: 'blur(4px)' }}
          animate={{ scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1], opacity: isHovered ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

export function CursorTrail() {
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const checkCursorVisibility = () => {
      const stored = localStorage.getItem('supernova-cursor-enabled');
      if (stored !== null) {
        setCursorEnabled(stored === 'true');
      }
    };
    checkCursorVisibility();

    const handleStorageChange = () => checkCursorVisibility();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cursor-settings-changed', handleStorageChange);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setTrails(prev => {
        const newTrail = { x: e.clientX, y: e.clientY, id: Date.now() };
        return [...prev, newTrail].slice(-8);
      });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cursor-settings-changed', handleStorageChange);
    };
  }, [cursorX, cursorY]);

  if (!cursorEnabled) return null;

  return (
    <>
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ x: trail.x, y: trail.y, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            width: 8 - index,
            height: 8 - index,
            backgroundColor: `rgba(255, 218, 185, ${0.3 - index * 0.03})`,
            borderRadius: '50%',
          }}
        />
      ))}
    </>
  );
}

export function useCursorMode() {
  const [mode, setMode] = useState<CursorMode>('default');
  const setCursorMode = (newMode: CursorMode) => {
    setMode(newMode);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'none';
    }
  };
  return { mode, setCursorMode };
}

export function useCursorVisibility() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('supernova-cursor-enabled');
    if (stored !== null) {
      setIsEnabled(stored === 'true');
    }
  }, []);

  const toggleCursor = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('supernova-cursor-enabled', String(newValue));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cursor-settings-changed'));
  };

  return { isEnabled, toggleCursor };
}
