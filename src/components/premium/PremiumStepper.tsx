'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Link, FileSearch, FileText, Film, Check } from 'lucide-react';

const steps = [
  { id: 'url', label: 'Enter URL', icon: Link },
  { id: 'product', label: 'Product Details', icon: FileSearch },
  { id: 'script', label: 'Generate Script', icon: FileText },
  { id: 'video', label: 'Create Video', icon: Film },
] as const;

/**
 * Premium Stepper - Animated horizontal timeline
 * Features:
 * - Glass circles with gradient fills
 * - Animated connector lines
 * - Active maroon glow
 * - Completed peach checkmarks
 * - Premium hover animations
 */
export function PremiumStepper() {
  const { step } = useStore();
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="relative">
      {/* Background Card */}
      <div 
        className="relative p-6 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(17, 17, 17, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 218, 185, 0.08)',
        }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5C3317]/5 via-transparent to-[#FFDAB9]/5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Steps Container */}
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;
              const Icon = s.icon;
              
              return (
                <div key={s.id} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300 }}
                      className="relative"
                    >
                      {/* Glow ring for active */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-[#5C3317]/30 blur-md"
                        />
                      )}
                      
                      {/* Circle */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={cn(
                          'relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300',
                          isCompleted && 'bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] shadow-lg',
                          isActive && 'bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] shadow-[0_0_30px_rgba(92,51,23,0.5)]',
                          !isCompleted && !isActive && 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
                        )}
                      >
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <Check className="w-6 h-6 text-[#FFDAB9]" />
                          </motion.div>
                        ) : (
                          <Icon className={cn(
                            'w-6 h-6 transition-colors duration-300',
                            isActive ? 'text-[#09090B]' : 'text-[rgba(255,255,255,0.4)]'
                          )} />
                        )}
                        
                        {/* Active pulse */}
                        {isActive && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-full h-full rounded-full bg-[#22C55E]"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                    
                    {/* Label */}
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 + 0.1 }}
                      className="mt-3 text-center"
                    >
                      <p className={cn(
                        'text-sm font-medium transition-colors duration-300',
                        isCompleted && 'text-[#FFDAB9]',
                        isActive && 'text-white',
                        !isCompleted && !isActive && 'text-[rgba(255,255,255,0.4)]'
                      )}>
                        {s.label}
                      </p>
                    </motion.div>
                  </div>

                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className="flex-1 px-4">
                      <div className="h-0.5 rounded-full bg-[rgba(255,255,255,0.1)] relative overflow-hidden">
                        {/* Active/Filled portion */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isCompleted ? 1 : isActive ? 0.5 : 0 }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          style={{ transformOrigin: 'left' }}
                          className="absolute inset-0 bg-gradient-to-r from-[#5C3317] to-[#FFDAB9] rounded-full"
                        />
                        
                        {/* Animated dots for active */}
                        {isActive && (
                          <motion.div
                            animate={{ x: ['0%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFDAB9] shadow-[0_0_10px_rgba(255,218,185,0.8)]"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
