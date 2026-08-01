'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  BrainIcon, 
  CloudIcon, 
  ActivityIcon, 
  ZapIcon, 
  CheckIcon,
  SparkleIcon,
  VideoIcon,
  ImageIcon,
  CopyIcon,
  DownloadIcon
} from '@/components/ui/premium-icons';

/**
 * Premium Agent Status Panel
 * Shows live AI activity and system status
 */

interface AgentStatusPanelProps {
  isProcessing?: boolean;
  currentStep?: number;
  className?: string;
}

export function AgentStatusPanel({ isProcessing = false, currentStep = 0, className }: AgentStatusPanelProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const agentSteps = [
    { id: 'analyzing', label: 'Analyzing Product', icon: BrainIcon },
    { id: 'researching', label: 'Researching Brand', icon: ActivityIcon },
    { id: 'competitors', label: 'Studying Competitors', icon: ActivityIcon },
    { id: 'strategy', label: 'Building Strategy', icon: SparkleIcon },
    { id: 'scripts', label: 'Writing Scripts', icon: CopyIcon },
    { id: 'images', label: 'Generating Images', icon: ImageIcon },
    { id: 'video', label: 'Creating Video', icon: VideoIcon },
    { id: 'uploading', label: 'Finalizing Assets', icon: CloudIcon },
    { id: 'complete', label: 'Campaign Ready', icon: CheckIcon },
  ];

  const systemStatus = [
    { label: 'Vision Model', value: 'Qwen 2.5', status: 'online' },
    { label: 'Research Engine', value: 'Active', status: 'online' },
    { label: 'Storage', value: 'Connected', status: 'online' },
    { label: 'Latency', value: `${Math.floor(Math.random() * 50 + 20)}ms`, status: 'online' },
  ];

  return (
    <section className={cn('relative', className)}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative rounded-3xl overflow-hidden h-full"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 218, 185, 0.08)',
          boxShadow: '0 0 40px rgba(92, 51, 23, 0.08)',
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Agent Status</h3>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[#22C55E]"
              />
              <span className="text-xs text-[rgba(255,255,255,0.5)]">Live</span>
            </div>
          </div>
          
          {/* Time Display */}
          <div className="text-3xl font-mono text-[#FFDAB9]">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>

        {/* Live Activity */}
        <div className="p-6">
          <p className="text-xs uppercase tracking-wider text-[rgba(255,255,255,0.4)] mb-4">
            Live Activity
          </p>
          
          {/* Activity Steps */}
          <div className="space-y-3">
            {agentSteps.map((step, index) => {
              const isActive = isProcessing && index === currentStep;
              const isCompleted = isProcessing && index < currentStep;
              const isPending = !isProcessing || index > currentStep;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl transition-all',
                    isActive && 'bg-[rgba(92,51,23,0.2)] border border-[rgba(255,218,185,0.2)]',
                    isCompleted && 'opacity-60',
                    isPending && 'opacity-40'
                  )}
                >
                  {/* Status Icon */}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                    isActive && 'bg-[rgba(92,51,23,0.4)]',
                    isCompleted && 'bg-[rgba(34,197,94,0.2)]',
                    isPending && 'bg-white/5'
                  )}>
                    {isCompleted ? (
                      <CheckIcon size={20} className="text-[#22C55E]" />
                    ) : isActive ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <step.icon size={20} className="text-[#FFDAB9]" />
                      </motion.div>
                    ) : (
                      <step.icon size={20} className="text-[rgba(255,255,255,0.3)]" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    'flex-1 text-sm font-medium transition-colors',
                    isActive && 'text-white',
                    isCompleted && 'text-[rgba(255,255,255,0.6)]',
                    isPending && 'text-[rgba(255,255,255,0.4)]'
                  )}>
                    {step.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#FFDAB9]"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="p-6 border-t border-[rgba(255,255,255,0.05)]">
          <p className="text-xs uppercase tracking-wider text-[rgba(255,255,255,0.4)] mb-4">
            System Status
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {systemStatus.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-3 rounded-xl bg-white/5"
              >
                <p className="text-xs text-[rgba(255,255,255,0.4)] mb-1">{item.label}</p>
                <p className="text-sm font-medium text-white">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Queue Status */}
        <div className="p-6 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[rgba(255,255,255,0.4)]">Queue</span>
            <span className="text-xs text-[#FFDAB9]">Idle</span>
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ width: '0%', background: 'linear-gradient(90deg, #5C3317 0%, #FFDAB9 100%)' }}
              animate={{ width: ['0%', '0%'] }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
