'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function SpotlightCard({ 
  children, 
  className, 
  glowColor = 'rgba(92, 51, 23, 0.25)'
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-[rgba(17,17,17,0.8)]',
        'backdrop-blur-xl',
        'border border-[rgba(255,218,185,0.10)]',
        'transition-all duration-300',
        'hover:border-[rgba(255,218,185,0.25)]',
        className
      )}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle 400px at ${position.x}px ${position.y}px, ${glowColor}, transparent 100%)`,
          ],
        }}
        transition={{ duration: 0.3 }}
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Inner glow border */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 400px at ${position.x}px ${position.y}px, transparent 50%, rgba(92, 51, 23, 0.1) 100%)`,
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
