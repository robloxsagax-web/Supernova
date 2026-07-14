'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { 
  Search,
  Brain,
  Wand2,
  Play,
  CheckCircle2
} from 'lucide-react';

const workflowSteps = [
  { id: 'research', label: 'Research', icon: Search },
  { id: 'analyze', label: 'Analyze', icon: Brain },
  { id: 'generate', label: 'Generate', icon: Wand2 },
  { id: 'render', label: 'Render', icon: Play },
  { id: 'complete', label: 'Complete', icon: CheckCircle2 },
];

export function WorkflowProgress() {
  const { step } = useStore();
  
  const stepIndex = workflowSteps.findIndex(s => s.id === step);
  const currentStepId = step || 'research';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-4xl mx-auto mb-12"
    >
      <div className="relative p-6 rounded-2xl glass">
        {/* Progress Line Background */}
        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-border -translate-y-1/2" />
        
        {/* Active Progress Line */}
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${(stepIndex / (workflowSteps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute top-1/2 left-8 h-0.5 bg-gradient-to-r from-maroon to-peach -translate-y-1/2"
          style={{ width: `calc(${(stepIndex / (workflowSteps.length - 1)) * 100}% - 2rem)` }}
        />

        {/* Steps */}
        <div className="relative flex items-center justify-between">
          {workflowSteps.map((workflowStep, index) => {
            const Icon = workflowStep.icon;
            const isActive = workflowStep.id === currentStepId;
            const isCompleted = index < stepIndex;
            const isCurrent = index === stepIndex;

            return (
              <motion.div
                key={workflowStep.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="flex flex-col items-center gap-3"
              >
                {/* Icon Container */}
                <div className="relative">
                  <motion.div
                    animate={isCurrent ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(92, 51, 23, 0)',
                        '0 0 20px 10px rgba(92, 51, 23, 0.3)',
                        '0 0 0 0 rgba(92, 51, 23, 0)',
                      ],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive || isCompleted
                        ? 'gradient-primary glow-maroon'
                        : 'glass bg-white/5'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${
                      isActive || isCompleted
                        ? 'text-background'
                        : 'text-muted-foreground'
                    }`} />
                  </motion.div>

                  {/* Active Pulse */}
                  {isCurrent && (
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-maroon to-peach -z-10"
                    />
                  )}
                </div>

                {/* Label */}
                <motion.span
                  animate={isCurrent ? { scale: 1.05 } : { scale: 1 }}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive || isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {workflowStep.label}
                </motion.span>

                {/* Status Indicator */}
                {isCurrent && (
                  <motion.div
                    layoutId="activeStep"
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-success"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-full h-full rounded-full bg-success/50"
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
