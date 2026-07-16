'use client';

import { motion } from 'framer-motion';

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-background transition-colors duration-300" />
      
      {/* Primary Aurora Glow - Top Left */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ opacity: 'var(--aurora-opacity, 1)' }}
        className="absolute -top-60 -left-60 w-[900px] h-[900px] 
                   bg-gradient-to-br from-[#5C3317]/50 via-[#8B5A2B]/30 to-transparent 
                   rounded-full blur-[180px] transition-opacity duration-300"
      />
      
      {/* Secondary Aurora Glow - Bottom Right */}
      <motion.div 
        animate={{ 
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 3
        }}
        style={{ opacity: 'var(--aurora-opacity, 1)' }}
        className="absolute -bottom-60 -right-60 w-[800px] h-[800px] 
                   bg-gradient-to-tr from-[#5C3317]/40 via-[#FFDAB9]/20 to-transparent 
                   rounded-full blur-[160px] transition-opacity duration-300"
      />
      
      {/* Tertiary Glow - Top Right */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -30, 0],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 6
        }}
        style={{ opacity: 'var(--aurora-opacity, 1)' }}
        className="absolute -top-40 right-1/4 w-[600px] h-[600px] 
                   bg-gradient-to-bl from-[#FFDAB9]/20 via-[#5C3317]/10 to-transparent 
                   rounded-full blur-[140px] transition-opacity duration-300"
      />
      
      {/* Accent Glow - Bottom Left */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.25, 0.1],
          y: [0, 20, 0],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 9
        }}
        style={{ opacity: 'var(--aurora-opacity, 1)' }}
        className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] 
                   bg-gradient-to-tr from-[#8B5A2B]/15 to-transparent 
                   rounded-full blur-[120px] transition-opacity duration-300"
      />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 'var(--aurora-opacity, 1)',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: 'calc(var(--aurora-opacity, 1) * 0.02)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Bottom Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none transition-colors duration-300" />
      
      {/* Top Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none transition-colors duration-300" />
    </div>
  );
}
