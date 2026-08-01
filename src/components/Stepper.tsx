import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const steps = [
  { id: 'url', label: 'Enter URL' },
  { id: 'product', label: 'Product Details' },
  { id: 'script', label: 'Generate Script' },
  { id: 'video', label: 'Create Video' },
] as const;

export function Stepper() {
  const { step } = useStore();
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative p-6 rounded-2xl glass">
        {/* Progress Line Background */}
        <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-border -translate-y-1/2" />

        {/* Active Progress Line */}
        <motion.div
          initial={false}
          animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute top-1/2 left-16 h-0.5 bg-gradient-to-r from-maroon to-peach -translate-y-1/2 rounded-full"
        />

        {/* Steps */}
        <div className="relative flex items-center justify-between">
          {steps.map((s, idx) => {
            const isActive = idx <= currentStepIndex;

            return (
              <div key={s.id} className="flex flex-col items-center gap-3 flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1, type: 'spring' }}
                  className={cn(
                    'relative flex items-center justify-center w-14 h-14 rounded-2xl text-base font-bold transition-all duration-300 flex-shrink-0',
                    isActive
                      ? 'gradient-primary glow-maroon text-background'
                      : 'glass bg-white/5 text-muted-foreground'
                  )}
                >
                  {idx + 1}
                  {idx === currentStepIndex && (
                    <motion.div
                      layoutId="activeStep"
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-full h-full rounded-full bg-success/50"
                      />
                    </motion.div>
                  )}
                </motion.div>
                <div className="text-center hidden md:block px-2">
                  <span className={cn(
                    'text-xs font-medium leading-tight block',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
