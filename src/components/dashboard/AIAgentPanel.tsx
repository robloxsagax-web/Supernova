'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  Bot,
  CheckCircle2,
  Circle,
  Sparkles,
  Loader2
} from 'lucide-react';

const agentStatuses = [
  'Reading product page',
  'Understanding brand',
  'Researching competitors',
  'Planning campaign',
  'Generating scripts',
  'Creating images',
  'Rendering video',
  'Saving assets',
  'Ready to publish',
];

export function AIAgentPanel() {
  const [activeStatus, setActiveStatus] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setActiveStatus((prev) => (prev + 1) % agentStatuses.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      className="fixed right-0 top-16 bottom-0 w-80 glass border-l border-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-maroon">
              <Bot className="w-6 h-6 text-peach" />
            </div>
            {isProcessing && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4">
                <Loader2 className="w-4 h-4 text-success animate-spin" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Supernova Agent</h3>
            <p className="text-xs text-muted-foreground">
              {isProcessing ? 'Processing...' : 'Ready'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-medium">AI Agent Active</span>
        </div>
      </div>

      {/* Status List */}
      <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-16rem)]">
        {agentStatuses.map((status, index) => {
          const isActive = index === activeStatus;
          const isCompleted = index < activeStatus;
          
          return (
            <motion.div
              key={status}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'glass bg-primary/10'
                  : isCompleted
                  ? 'bg-success/5'
                  : 'bg-white/5'
              }`}
            >
              {/* Status Icon */}
              <div className="relative">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : isActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Circle className="w-5 h-5 text-peach fill-peach/20" />
                  </motion.div>
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/30" />
                )}
              </div>

              {/* Status Text */}
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? 'text-foreground'
                  : isCompleted
                  ? 'text-success'
                  : 'text-muted-foreground'
              }`}>
                {status}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeStatus"
                  className="ml-auto flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4 text-peach" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border glass">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Estimated time: ~2 min
          </span>
          <button className="text-xs text-peach hover:underline">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
