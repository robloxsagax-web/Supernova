'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: 'text-lg', container: 'w-10 h-10' },
  md: { icon: 40, text: 'text-xl', container: 'w-12 h-12' },
  lg: { icon: 48, text: 'text-2xl', container: 'w-14 h-14' },
  xl: { icon: 56, text: 'text-3xl', container: 'w-16 h-16' },
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { icon, text, container } = sizes[size];

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Premium Neural Network Logo */}
      <div className={`relative ${container}`}>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5C3317]/30 to-[#FFDAB9]/20 rounded-xl blur-xl animate-pulse" />
        
        {/* Main Logo Container */}
        <motion.div
          className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <svg
            width={icon}
            height={icon}
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Neural Network Nodes */}
            <circle cx="28" cy="14" r="4" fill="#FFDAB9" className="animate-pulse">
              <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="14" cy="28" r="3.5" fill="#FFDAB9" className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" begin="0.5s" />
            </circle>
            <circle cx="42" cy="28" r="3.5" fill="#FFDAB9" className="animate-pulse" style={{ animationDelay: '1s' }}>
              <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" begin="1s" />
            </circle>
            <circle cx="28" cy="42" r="4" fill="#FFDAB9" className="animate-pulse" style={{ animationDelay: '1.5s' }}>
              <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" begin="1.5s" />
            </circle>
            
            {/* Center Node - Larger */}
            <circle cx="28" cy="28" r="6" fill="#FFDAB9" className="animate-pulse-glow">
              <animate attributeName="r" values="6;7;6" dur="3s" repeatCount="indefinite" />
            </circle>
            
            {/* Neural Connections */}
            <g stroke="#FFDAB9" strokeWidth="1.5" strokeOpacity="0.6" fill="none">
              {/* Top to Left */}
              <motion.line
                x1="28" y1="14" x2="14" y2="28"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
              </motion.line>
              
              {/* Top to Right */}
              <motion.line
                x1="28" y1="14" x2="42" y2="28"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="0.7s" />
              </motion.line>
              
              {/* Left to Center */}
              <motion.line
                x1="14" y1="28" x2="28" y2="28"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="1.4s" />
              </motion.line>
              
              {/* Center to Right */}
              <motion.line
                x1="28" y1="28" x2="42" y2="28"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="2.1s" />
              </motion.line>
              
              {/* Center to Bottom */}
              <motion.line
                x1="28" y1="28" x2="28" y2="42"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="2.8s" />
              </motion.line>
              
              {/* Cross connections */}
              <motion.line
                x1="14" y1="28" x2="28" y2="42"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" begin="3.5s" />
              </motion.line>
              
              <motion.line
                x1="42" y1="28" x2="28" y2="42"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" begin="4.2s" />
              </motion.line>
            </g>
            
            {/* Spark Effects */}
            <g fill="#FFDAB9">
              <circle cx="20" cy="20" r="1.5" className="animate-ping" style={{ animationDuration: '1.5s' }}>
                <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="36" cy="36" r="1.5" className="animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.5s' }}>
                <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite" begin="0.5s" />
              </circle>
              <circle cx="36" cy="20" r="1" className="animate-ping" style={{ animationDuration: '1.3s', animationDelay: '1s' }}>
                <animate attributeName="opacity" values="1;0;1" dur="1.3s" repeatCount="indefinite" begin="1s" />
              </circle>
              <circle cx="20" cy="36" r="1" className="animate-ping" style={{ animationDuration: '1.6s', animationDelay: '1.5s' }}>
                <animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite" begin="1.5s" />
              </circle>
            </g>
          </svg>
        </motion.div>
        
        {/* Status Indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#09090B]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold ${text} text-[#FFDAB9] tracking-tight`}>
            Supernova
          </h1>
          <p className="text-xs text-[rgba(255,218,185,0.65)] font-medium">
            AI Marketing Agent
          </p>
        </div>
      )}
    </motion.div>
  );
}
