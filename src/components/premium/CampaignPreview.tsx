'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  Link, 
  Search, 
  FileText, 
  Image, 
  Film, 
  Rocket,
  Check,
  ChevronRight,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';

/**
 * Campaign Preview - Right sidebar showing workflow pipeline
 * Features:
 * - Animated workflow visualization
 * - Step-by-step pipeline display
 * - Estimated output preview
 * - Features list
 */

const workflowSteps = [
  { id: 'url', label: 'URL', icon: Link, description: 'Paste product URL' },
  { id: 'research', label: 'Research', icon: Search, description: 'AI analyzes page' },
  { id: 'copy', label: 'Copy', icon: FileText, description: 'Generate script' },
  { id: 'images', label: 'Images', icon: Image, description: 'Create visuals' },
  { id: 'video', label: 'Video', icon: Film, description: 'Render video' },
  { id: 'publish', label: 'Publish', icon: Rocket, description: 'Download & share' },
];

const features = [
  'AI-powered script generation',
  'Multiple brand palettes',
  'Horizontal & vertical formats',
  'Human-quality voiceover',
  'Background music selection',
  'One-click download',
];

export function CampaignPreview() {
  const { step, videoSettings } = useStore();
  const currentStepIndex = step === 'url' ? 0 : step === 'product' ? 2 : step === 'script' ? 4 : 5;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs text-[rgba(255,255,255,0.5)] uppercase tracking-wider">
            Workflow Preview
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white">
          Campaign Pipeline
        </h3>
      </motion.div>

      {/* Workflow Pipeline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-5 rounded-2xl"
        style={{
          background: 'rgba(17, 17, 17, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 218, 185, 0.08)',
        }}
      >
        {/* Vertical workflow */}
        <div className="relative">
          {workflowSteps.map((item, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            const Icon = item.icon;
            
            return (
              <div key={item.id} className="relative">
                {/* Connector line */}
                {idx < workflowSteps.length - 1 && (
                  <div className="absolute left-[27px] top-14 bottom-0 w-0.5">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isCompleted ? 1 : isActive ? 0.5 : 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformOrigin: 'top' }}
                      className="w-full h-full bg-gradient-to-b from-[#5C3317] to-[#FFDAB9] rounded-full"
                    />
                  </div>
                )}
                
                {/* Step item */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 pb-6 last:pb-0"
                >
                  {/* Icon circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      'relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300',
                      isCompleted && 'bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] shadow-lg',
                      isActive && 'bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] shadow-[0_0_25px_rgba(92,51,23,0.4)]',
                      !isCompleted && !isActive && 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-[#FFDAB9]" />
                    ) : (
                      <Icon className={cn(
                        'w-6 h-6 transition-colors duration-300',
                        isActive ? 'text-[#09090B]' : 'text-[rgba(255,255,255,0.4)]'
                      )} />
                    )}
                    
                    {/* Pulse for active */}
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#22C55E]"
                      />
                    )}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className={cn(
                      'font-medium text-sm transition-colors duration-300',
                      (isCompleted || isActive) && 'text-white',
                      !isCompleted && !isActive && 'text-[rgba(255,255,255,0.4)]'
                    )}>
                      {item.label}
                    </p>
                    <p className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center"
                    >
                      <ChevronRight className="w-5 h-5 text-[#FFDAB9]" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Estimated Output */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(92, 51, 23, 0.15) 0%, rgba(255, 218, 185, 0.05) 100%)',
          border: '1px solid rgba(255, 218, 185, 0.1)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#FFDAB9]" />
          <span className="text-xs text-[rgba(255,218,185,0.8)] uppercase tracking-wider font-medium">
            Estimated Output
          </span>
        </div>
        
        <div className="space-y-3">
          {/* Video format */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgba(255,255,255,0.6)]">Format</span>
            <span className="text-sm font-medium text-white">
              {videoSettings.ratio} • {videoSettings.duration}s
            </span>
          </div>
          
          {/* Brand palette */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgba(255,255,255,0.6)]">Style</span>
            <span className="text-sm font-medium text-white capitalize">
              {videoSettings.brandPalette.replace('-', ' ')}
            </span>
          </div>
          
          {/* Time estimate */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgba(255,255,255,0.6)]">Est. Time</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[rgba(255,255,255,0.4)]" />
              <span className="text-sm font-medium text-white">2-3 minutes</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-1 p-5 rounded-2xl"
        style={{
          background: 'rgba(17, 17, 17, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 218, 185, 0.08)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[#FFDAB9]" />
          <span className="text-xs text-[rgba(255,218,185,0.8)] uppercase tracking-wider font-medium">
            Included Features
          </span>
        </div>
        
        <div className="space-y-2.5">
          {features.map((feature, idx) => (
            <motion.div
              key={feature}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-[rgba(34,197,94,0.2)] flex items-center justify-center">
                <Check className="w-3 h-3 text-[#22C55E]" />
              </div>
              <span className="text-sm text-[rgba(255,255,255,0.6)]">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-[rgba(255,255,255,0.3)]">
          Hover over steps for details
        </p>
      </motion.div>
    </div>
  );
}
