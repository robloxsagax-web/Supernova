'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CursorMode = 'default' | 'edit' | 'pen' | 'crosshair' | 'grab' | 'pointer';

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

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener('mousemove', moveCursor);
    
    // Add listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY, isVisible]);

  const style = cursorStyles[mode];
  const scale = isHovered ? 1.5 : 1;

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn('fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference', className)}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        scale: { type: 'spring', stiffness: 500, damping: 28 },
        opacity: { duration: 0.2 },
      }}
    >
      {/* Cursor Ring */}
      <motion.div
        className="relative"
        style={{
          width: style.size,
          height: style.size,
        }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor,
          }}
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.3,
          }}
        />

        {/* Inner Dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFDAB9]"
          style={{
            width: mode === 'crosshair' ? 2 : 4,
            height: mode === 'crosshair' ? 2 : 4,
          }}
        />

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${style.borderColor} 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }}
          animate={{
            scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1],
            opacity: isHovered ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// Cursor Trail Effect
export function CursorTrail() {
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      setTrails(prev => {
        const newTrail = { x: e.clientX, y: e.clientY, id: Date.now() };
        const updated = [...prev, newTrail].slice(-8); // Keep last 8 trails
        return updated;
      });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{
            x: trail.x,
            y: trail.y,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
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

// Hook to manage cursor mode globally
export function useCursorMode() {
  const [mode, setMode] = useState<CursorMode>('default');

  const setCursorMode = (newMode: CursorMode) => {
    setMode(newMode);
    // Update document cursor
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'none';
    }
  };

  return { mode, setCursorMode };
}
