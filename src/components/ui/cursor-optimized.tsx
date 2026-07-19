'use client';

/**
 * PERFORMANCE OPTIMIZED Custom Cursor
 * 
 * Optimizations:
 * - Throttled mousemove events
 * - Passive event listeners
 * - GPU acceleration
 * - Multiple cursor styles support
 */

import { useEffect, useState, useCallback, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CursorMode = 'default' | 'edit' | 'pen' | 'crosshair' | 'grab' | 'pointer';
export type CursorStyle = 'nova-glow' | 'orbit-ring' | 'energy-pulse';

interface CustomCursorProps {
  mode?: CursorMode;
  className?: string;
}

const cursorStyles: Record<CursorMode, { size: number; borderColor: string; backgroundColor: string }> = {
  default: { size: 16, borderColor: '#FFDAB9', backgroundColor: 'rgba(255, 218, 185, 0.1)' },
  edit: { size: 20, borderColor: '#5C3317', backgroundColor: 'rgba(92, 51, 23, 0.2)' },
  pen: { size: 18, borderColor: '#FFDAB9', backgroundColor: 'rgba(255, 218, 185, 0.3)' },
  crosshair: { size: 20, borderColor: '#FFDAB9', backgroundColor: 'transparent' },
  grab: { size: 24, borderColor: '#FFDAB9', backgroundColor: 'rgba(255, 218, 185, 0.15)' },
  pointer: { size: 18, borderColor: '#FFDAB9', backgroundColor: 'rgba(255, 218, 185, 0.2)' },
};

// Throttle helper
function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): T {
  let inThrottle = false;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

export const CustomCursor = memo(function CustomCursor({ 
  mode = 'default', 
  className 
}: CustomCursorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>('nova-glow');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 700 });

  const style = cursorStyles[mode];
  const scale = isHovered ? 1.5 : 1;

  useEffect(() => {
    const checkCursorVisibility = () => {
      const stored = localStorage.getItem('supernova-cursor-enabled');
      if (stored !== null) setCursorEnabled(stored === 'true');
    };
    
    const checkCursorStyle = () => {
      const stored = localStorage.getItem('supernova_cursor_style');
      if (stored) setCursorStyle(stored as CursorStyle);
    };
    
    checkCursorVisibility();
    checkCursorStyle();

    const handleStorageChange = () => {
      checkCursorVisibility();
      checkCursorStyle();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cursor-settings-changed', handleStorageChange);

    const moveCursor = throttle((e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    }, 16);

    window.addEventListener('mousemove', moveCursor, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cursor-settings-changed', handleStorageChange);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!cursorEnabled || !isVisible) return null;

  // Orbit Ring cursor - small ball orbits the cursor
  if (cursorStyle === 'orbit-ring') {
    return (
      <motion.div
        className={cn('fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform', className)}
        style={{ x: cursorXSpring, y: cursorYSpring }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {/* Static ring */}
          <div className="w-10 h-10 rounded-full border border-[#FFDAB9]/30" />
          {/* Inner ring */}
          <div className="absolute inset-1 rounded-full border border-[#8B5A2B]/30" />
          {/* Center dot - static cursor position */}
          <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-[#FFDAB9] to-[#5C3317] shadow-[0_0_10px_rgba(255,218,185,0.5)]" />
          {/* Orbiting ball - this circles around */}
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#FFDAB9] to-[#5C3317] shadow-[0_0_8px_rgba(255,218,185,0.8)]"
            animate={{ 
              x: [0, 18, 0, -18, 0],
              y: [-18, 0, 18, 0, -18]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            style={{ top: '50%', left: '50%', marginTop: -5, marginLeft: -5 }}
          />
        </div>
      </motion.div>
    );
  }

  // Energy Pulse cursor - sleek modern cursor with pulse effect
  if (cursorStyle === 'energy-pulse') {
    return (
      <motion.div
        className={cn('fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform', className)}
        style={{ x: cursorXSpring, y: cursorYSpring }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {/* Expanding pulse rings from center */}
          <motion.div
            className="absolute rounded-full border border-[#FFDAB9]/40"
            style={{ top: '50%', left: '50%', width: 8, height: 8, marginTop: -4, marginLeft: -4 }}
            animate={{ scale: [1, 8], opacity: [0.6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute rounded-full border border-[#FFDAB9]/30"
            style={{ top: '50%', left: '50%', width: 8, height: 8, marginTop: -4, marginLeft: -4 }}
            animate={{ scale: [1, 10], opacity: [0.4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
          />
          {/* Main cursor dot */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFDAB9] to-[#5C3317] shadow-[0_0_15px_rgba(255,218,185,0.6)]" />
          {/* Inner glow */}
          <div className="absolute inset-[25%] rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </div>
      </motion.div>
    );
  }

  // Default: Nova Glow cursor
  return (
    <motion.div
      className={cn('fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference will-change-transform', className)}
      style={{ x: cursorXSpring, y: cursorYSpring }}
      animate={{ scale, opacity: isVisible ? 1 : 0 }}
      transition={{ scale: { type: 'spring', stiffness: 500, damping: 28 }, opacity: { duration: 0.2 } }}
    >
      <motion.div className="relative will-change-transform" style={{ width: style.size, height: style.size }}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 will-change-transform"
          style={{ borderColor: style.borderColor, backgroundColor: style.backgroundColor }}
          animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute rounded-full bg-[#FFDAB9] will-change-transform"
          style={{
            width: mode === 'crosshair' ? 2 : 4,
            height: mode === 'crosshair' ? 2 : 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full opacity-30 will-change-transform"
          style={{ background: `radial-gradient(circle, ${style.borderColor} 0%, transparent 70%)`, filter: 'blur(4px)' }}
          animate={{ scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1], opacity: isHovered ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
});

export const CursorTrail = memo(function CursorTrail() {
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailIdRef = useRef(0);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    const checkCursorVisibility = () => {
      const stored = localStorage.getItem('supernova-cursor-enabled');
      if (stored !== null) setCursorEnabled(stored === 'true');
    };
    checkCursorVisibility();

    const handleStorageChange = () => checkCursorVisibility();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cursor-settings-changed', handleStorageChange);

    const moveCursor = throttle((e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTrailTime.current > 50) {
        lastTrailTime.current = now;
        trailIdRef.current++;
        setTrails(prev => {
          const newTrail = { x: e.clientX, y: e.clientY, id: trailIdRef.current };
          return [...prev, newTrail].slice(-5);
        });
      }
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    }, 16);

    window.addEventListener('mousemove', moveCursor, { passive: true });

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
          className="fixed pointer-events-none z-[9998] will-change-transform rounded-full"
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ x: trail.x, y: trail.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            width: 6 - index,
            height: 6 - index,
            backgroundColor: 'rgba(255, 218, 185, 0.25)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </>
  );
});

export function useCursorMode() {
  const [mode, setMode] = useState<CursorMode>('default');

  const setCursorMode = useCallback((newMode: CursorMode) => {
    setMode(newMode);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'none';
    }
  }, []);

  return { mode, setCursorMode };
}

export function useCursorVisibility() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('supernova-cursor-enabled');
    if (stored !== null) setIsEnabled(stored === 'true');
  }, []);

  const toggleCursor = useCallback(() => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('supernova-cursor-enabled', String(newValue));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cursor-settings-changed'));
  }, [isEnabled]);

  return { isEnabled, toggleCursor };
}
