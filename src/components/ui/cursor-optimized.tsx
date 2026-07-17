'use client';

/**
 * PERFORMANCE OPTIMIZED Custom Cursor
 * 
 * Optimizations:
 * - Throttled mousemove events
 * - Passive event listeners
 * - Reduced trail count
 * - Simplified animations
 * - GPU acceleration
 */

import { useEffect, useState, useCallback, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CursorMode = 'default' | 'edit' | 'pen' | 'crosshair' | 'grab' | 'pointer';

interface CustomCursorProps {
  mode?: CursorMode;
  className?: string;
}

// Memoize cursor styles to prevent recreation
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

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Use spring for smooth cursor movement
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 700 });

  const style = cursorStyles[mode];
  const scale = isHovered ? 1.5 : 1;

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

    // Throttled cursor movement for better performance
    const moveCursor = throttle((e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    }, 16); // ~60fps

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Passive event listener for better scroll performance
    window.addEventListener('mousemove', moveCursor, { passive: true });
    
    // Use event delegation instead of attaching to each element
    const observer = new MutationObserver(() => {
      const interactiveElements = document.querySelectorAll('button, a, input, textarea, [role="button"]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter, { passive: true });
        el.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial attachment
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      el.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  if (!cursorEnabled || !isVisible) return null;

  return (
    <motion.div
      className={cn('fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference will-change-transform', className)}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        transform: 'translate3d(0, 0, 0)',
      }}
      animate={{ scale, opacity: isVisible ? 1 : 0 }}
      transition={{
        scale: { type: 'spring', stiffness: 500, damping: 28 },
        opacity: { duration: 0.2 },
      }}
    >
      {/* Cursor Ring */}
      <motion.div
        className="relative will-change-transform"
        style={{ width: style.size, height: style.size }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 will-change-transform"
          style={{
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor,
            transform: 'translate3d(0, 0, 0)',
          }}
          animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Inner Dot */}
        <motion.div
          className="absolute rounded-full bg-[#FFDAB9] will-change-transform"
          style={{
            width: mode === 'crosshair' ? 2 : 4,
            height: mode === 'crosshair' ? 2 : 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translate3d(0, 0, 0)',
          }}
        />
      </motion.div>
    </motion.div>
  );
});

// Simplified cursor trail with reduced complexity
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
      if (stored !== null) {
        setCursorEnabled(stored === 'true');
      }
    };
    checkCursorVisibility();

    const handleStorageChange = () => checkCursorVisibility();
    window.addEventListener('storage', handleStorageChange);

    // Reduced trail count and throttled updates
    const moveCursor = throttle((e: MouseEvent) => {
      const now = Date.now();
      // Only add trail point every 50ms max
      if (now - lastTrailTime.current > 50) {
        lastTrailTime.current = now;
        trailIdRef.current++;
        
        setTrails(prev => {
          const newTrail = { x: e.clientX, y: e.clientY, id: trailIdRef.current };
          // Reduced from 8 to 5 trails for better performance
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
          animate={{
            x: trail.x,
            y: trail.y,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          style={{
            width: 6 - index,
            height: 6 - index,
            backgroundColor: 'rgba(255, 218, 185, 0.25)',
            transform: 'translate(-50%, -50%) translate3d(0, 0, 0)',
          }}
        />
      ))}
    </>
  );
});

// Hook to manage cursor mode globally
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

// Hook to toggle cursor visibility
export function useCursorVisibility() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('supernova-cursor-enabled');
    if (stored !== null) {
      setIsEnabled(stored === 'true');
    }
  }, []);

  const toggleCursor = useCallback(() => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('supernova-cursor-enabled', String(newValue));
    window.dispatchEvent(new Event('storage'));
  }, [isEnabled]);

  return { isEnabled, toggleCursor };
}
