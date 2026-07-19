'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  Check,
  Link,
  FileSearch,
  Brain,
  Search,
  Mic,
  Film,
  TrendingUp,
  Sparkles,
  Play
} from 'lucide-react';

/**
 * Premium Workflow Timeline Component
 * Animated workflow steps with glass cards, glows, and smooth transitions
 */
export function PremiumWorkflowTimeline() {
  const { step, isLoading, generationType } = useStore();
  
  const steps = [
    {
      id: 'url',
      label: 'Research',
      description: 'AI analyzes page',
      icon: Link,
      color: '#22C55E',
    },
    {
      id: 'product',
      label: 'Script',
      description: 'Generate ad copy',
      icon: FileSearch,
      color: '#F59E0B',
    },
    {
      id: 'marketIntelligence',
      label: 'Market Intel',
      description: 'Analyze competitors & audience',
      icon: TrendingUp,
      color: '#8B5CF6',
    },
    {
      id: 'script',
      label: 'Visuals',
      description: 'Create assets',
      icon: Sparkles,
      color: '#EC4899',
    },
    {
      id: 'video',
      label: 'Video',
      description: 'Render & edit',
      icon: Film,
      color: '#06B6D4',
    },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);
  const isActive = isLoading && currentStepIndex >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5C3317]/20 via-[#FFDAB9]/10 to-[#5C3317]/20 rounded-3xl blur-xl" />
        
        <div className="relative p-8 rounded-3xl overflow-hidden" style={{
          background: 'rgba(17, 17, 17, 0.9)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 218, 185, 0.1)',
        }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              animate={isActive ? { rotate: 360 } : {}}
              transition={isActive ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
            >
              <Sparkles className="w-5 h-5 text-[#FFDAB9]" />
            </motion.div>
            <span className="text-white font-semibold text-lg">AI Workflow</span>
            {isActive && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-auto flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span className="text-sm text-[rgba(255,255,255,0.5)]">Processing</span>
              </motion.div>
            )}
          </div>

          {/* Timeline Steps */}
          <div className="relative">
            {steps.map((stepItem, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;
              
              return (
                <div key={stepItem.id} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-5 top-14 w-0.5 h-12 z-0">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: isCompleted ? 1 : 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="w-full h-full bg-gradient-to-b from-[#22C55E] to-[#22C55E]/50"
                      />
                      {!isCompleted && (
                        <div className="absolute inset-0 bg-[rgba(255,255,255,0.1)]" />
                      )}
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-500',
                      isCurrent && 'bg-gradient-to-r from-[#5C3317]/30 to-transparent',
                      isCompleted && 'bg-[rgba(34,197,94,0.1)]',
                      isPending && 'bg-[rgba(255,255,255,0.02)]'
                    )}
                  >
                    {/* Icon Container */}
                    <motion.div
                      whileHover={isPending ? {} : { scale: 1.1 }}
                      className={cn(
                        'relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 z-10',
                        isCompleted && 'bg-[#22C55E]/20',
                        isCurrent && 'bg-[#5C3317]/40 shadow-[0_0_20px_rgba(92,51,23,0.4)]',
                        isPending && 'bg-[rgba(255,255,255,0.05)]'
                      )}
                    >
                      {/* Glow effect for current */}
                      {isCurrent && (
                        <motion.div
                          animate={{ 
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-xl bg-[#5C3317]/40 blur-md"
                        />
                      )}
                      
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Check className="w-6 h-6 text-[#22C55E]" />
                        </motion.div>
                      ) : isCurrent ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <Play className="w-6 h-6 text-[#FFDAB9]" />
                        </motion.div>
                      ) : (
                        <stepItem.icon className="w-6 h-6 text-[rgba(255,255,255,0.3)]" />
                      )}
                    </motion.div>

                    {/* Labels */}
                    <div className="flex-1">
                      <motion.p
                        animate={isCurrent ? { color: '#FFDAB9' } : {}}
                        className={cn(
                          'font-semibold transition-colors duration-300',
                          isCompleted && 'text-[#22C55E]',
                          isCurrent && 'text-[#FFDAB9]',
                          isPending && 'text-[rgba(255,255,255,0.4)]'
                        )}
                      >
                        {isCompleted && <Check className="w-4 h-4 inline mr-2" />}
                        {stepItem.label}
                      </motion.p>
                      <motion.p
                        animate={isCurrent ? { opacity: 1 } : {}}
                        initial={{ opacity: 0 }}
                        className={cn(
                          'text-sm transition-colors duration-300',
                          isCurrent ? 'text-[rgba(255,255,255,0.7)]' : 'text-[rgba(255,255,255,0.4)]'
                        )}
                      >
                        {stepItem.description}
                      </motion.p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-xs px-3 py-1 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-medium"
                        >
                          Complete
                        </motion.span>
                      )}
                      {isCurrent && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="flex items-center gap-1.5"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#FFDAB9] animate-pulse" />
                          <span className="text-xs text-[#FFDAB9] font-medium">Active</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
