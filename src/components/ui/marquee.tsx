'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode[];
  speed?: number; // Duration in seconds for one cycle
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  className?: string;
}

/**
 * Marquee Component
 * Creates a smooth horizontal scrolling effect for text or content
 * Inspired by Magic UI
 */
export function Marquee({ 
  children, 
  speed = 20,
  pauseOnHover = true,
  direction = 'left',
  className 
}: MarqueeProps) {
  const content = [...children, ...children]; // Duplicate for seamless loop

  return (
    <div 
      className={cn(
        'marquee-container relative overflow-hidden',
        className
      )}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <div
        className={cn(
          'marquee-content',
          pauseOnHover && 'group-hover:animation-paused'
        )}
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {content.map((child, index) => (
          <div key={index} className="inline-block px-4">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

interface InfiniteMarqueeProps {
  items: Array<{
    icon?: ReactNode;
    text: string;
  }>;
  speed?: number;
  separator?: string;
  className?: string;
}

/**
 * Infinite Marquee for tags, features, or labels
 */
export function InfiniteMarquee({
  items,
  speed = 20,
  separator = '•',
  className
}: InfiniteMarqueeProps) {
  const content = items.flatMap((item, index) => [
    <span key={`item-${index}`} className="inline-flex items-center gap-2">
      {item.icon}
      <span className="text-sm font-medium">{item.text}</span>
    </span>,
    <span key={`sep-${index}`} className="text-[#FFDAB9] mx-4">
      {separator}
    </span>,
  ]);

  return (
    <Marquee speed={speed} className={className}>
      {content}
    </Marquee>
  );
}
