'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  Check, 
  Circle, 
  Loader2,
  Link,
  FileSearch,
  FileText,
  Brain,
  Film,
  Search,
  Sparkles,
  Mic,
  Play,
  Rocket
} from 'lucide-react';

export type GenerationStage = 
  | 'idle'
  | 'scraping'
  | 'script'
  | 'market_intelligence'
  | 'broll'
  | 'voiceover'
  | 'video'
  | 'complete';

interface GenerationStep {
  id: GenerationStage;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  duration?: number;
}

const generationSteps: GenerationStep[] = [
  { id: 'scraping', label: 'Scraping Product', sublabel: 'Extracting details...', icon: Link },
  { id: 'script', label: 'Generating AI Script', sublabel: 'Crafting narrative...', icon: FileText },
  { id: 'market_intelligence', label: 'Market Intelligence', sublabel: 'Analyzing competitors...', icon: Brain },
  { id: 'broll', label: 'Finding Cinematic B-roll', sublabel: 'Searching Pexels...', icon: Search },
  { id: 'voiceover', label: 'Preparing Voiceover', sublabel: 'Generating audio...', icon: Mic },
  { id: 'video', label: 'Building Timeline', sublabel: 'Rendering frames...', icon: Film },
  { id: 'complete', label: 'Launching Editor', sublabel: 'Almost ready...', icon: Rocket },
];

/**
 * Map store step to generation stage
 */
function getCurrentStage(step: string, isLoading: boolean, generationType: string): GenerationStage {
  if (!isLoading) return 'idle';
  
  switch (step) {
    case 'url':
      return 'scraping';
    case 'product':
      return 'script';
    case 'script':
      return generationType === 'b-roll' ? 'broll' : 'market_intelligence';
    case 'marketIntelligence':
      return 'video';
    case 'video':
      return 'voiceover';
    default:
      return 'idle';
  }
}

function getActiveSteps(stage: GenerationStage): number {
  const index = generationSteps.findIndex(s => s.id === stage);
  return index >= 0 ? index + 1 : 0;
}

/**
 * Generation Progress Component
 * Multi-stage progress UI for production-quality generation pipeline
 */
export function GenerationProgress() {
  const { step, isLoading, generationType } = useStore();
  const currentStage = getCurrentStage(step, isLoading, generationType);
  const activeCount = getActiveSteps(currentStage);
  
  // Don't show if not loading or in idle state
  if (!isLoading || currentStage === 'idle') {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      {/* Progress Card */}
      <div 
        className="relative p-6 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 218, 185, 0.1)',
        }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-[#5C3317]/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5 text-[#FFDAB9]" />
              </motion.div>
              <span className="text-white font-semibold">Generating Your Content</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[#22C55E]"
              />
              <span className="text-[rgba(255,255,255,0.5)] text-sm">
                {Math.round((activeCount / generationSteps.length) * 100)}%
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 rounded-full bg-[rgba(255,255,255,0.1)] mb-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(activeCount / generationSteps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#5C3317] to-[#FFDAB9]"
            />
          </div>
          
          {/* Steps */}
          <div className="space-y-3">
            {generationSteps.map((s, idx) => {
              const isActive = s.id === currentStage;
              const isCompleted = idx < activeCount - 1;
              const Icon = s.icon;
              
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-xl transition-all duration-300',
                    isActive && 'bg-[rgba(255,218,185,0.1)]',
                    isCompleted && 'bg-[rgba(34,197,94,0.1)]',
                    !isActive && !isCompleted && 'bg-[rgba(255,255,255,0.02)]'
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                    isCompleted && 'bg-[#22C55E]/20',
                    isActive && 'bg-[#5C3317]/30',
                    !isActive && !isCompleted && 'bg-[rgba(255,255,255,0.05)]'
                  )}>
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Check className="w-5 h-5 text-[#22C55E]" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="w-5 h-5 text-[#FFDAB9]" />
                      </motion.div>
                    ) : (
                      <Icon className="w-5 h-5 text-[rgba(255,255,255,0.3)]" />
                    )}
                  </div>
                  
                  {/* Labels */}
                  <div className="flex-1">
                    <p className={cn(
                      'font-medium transition-colors duration-300',
                      isCompleted && 'text-[#22C55E]',
                      isActive && 'text-white',
                      !isActive && !isCompleted && 'text-[rgba(255,255,255,0.4)]'
                    )}>
                      {isCompleted && <Check className="w-4 h-4 inline mr-2" />}
                      {s.label}
                    </p>
                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-[rgba(255,255,255,0.5)] mt-0.5"
                        >
                          {s.sublabel}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Status */}
                  <div>
                    {isCompleted && (
                      <span className="text-xs text-[#22C55E] font-medium">Done</span>
                    )}
                    {isActive && (
                      <span className="flex items-center gap-1">
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-[#FFDAB9]"
                        />
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Compact inline progress for buttons
 */
export function InlineProgress({ stage }: { stage: GenerationStage }) {
  const step = generationSteps.find(s => s.id === stage);
  if (!step) return null;
  
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-4 h-4" />
      </motion.div>
      {step.label}...
    </motion.span>
  );
}
