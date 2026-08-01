'use client';

import { motion } from 'framer-motion';
import { useState, useCallback, useMemo, memo } from 'react';
import { cn } from '@/lib/utils';
import { 
  BrainIcon, 
  UrlIcon, 
  ZapIcon, 
  CampaignIcon, 
  VideoIcon, 
  ImageIcon, 
  CopyIcon,
  StrategyIcon,
  SparkleIcon
} from '@/components/ui/premium-icons';

/**
 * Premium AI Command Center
 * Central input for the marketing agent with quick actions
 * Performance optimized with memoization
 */

// Memoized quick action icons
const QuickActionIcon = memo(function QuickActionIcon({ 
  Icon, 
  isSelected 
}: { 
  Icon: React.ElementType; 
  isSelected: boolean 
}) {
  return (
    <Icon 
      size={24} 
      className={cn(
        'mb-2 transition-colors',
        isSelected ? 'text-[#FFDAB9]' : 'text-[rgba(255,218,185,0.6)]'
      )} 
    />
  );
});

interface AICommandCenterProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const AICommandCenter = memo(function AICommandCenter({ 
  onSubmit, 
  isLoading = false, 
  className 
}: AICommandCenterProps) {
  const [url, setUrl] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const quickActions = useMemo(() => [
    { id: 'video', icon: VideoIcon, label: 'Generate Video Ads', description: 'Create viral video content' },
    { id: 'image', icon: ImageIcon, label: 'Generate Image Ads', description: 'Design stunning visuals' },
    { id: 'copy', icon: CopyIcon, label: 'Marketing Copy', description: 'Write compelling copy' },
    { id: 'strategy', icon: StrategyIcon, label: 'Campaign Strategy', description: 'Build your roadmap' },
  ], []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  }, [url, onSubmit]);

  const handleActionClick = useCallback((actionId: string) => {
    setSelectedAction(actionId);
  }, []);

  const isSubmitDisabled = !url.trim() || isLoading;

  return (
    <section className={cn('relative', className)}>
      {/* Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 218, 185, 0.1)',
          boxShadow: '0 0 60px rgba(92, 51, 23, 0.1), 0 25px 50px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Glow effect on top */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 218, 185, 0.5) 50%, transparent 100%)',
          }}
        />

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                  boxShadow: '0 0 30px rgba(92, 51, 23, 0.4)',
                }}
              >
                <BrainIcon size={28} className="text-[#FFDAB9]" />
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl border-2 border-[#FFDAB9]/30 animate-ping" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-white">Supernova Marketing Agent</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-sm text-[rgba(255,255,255,0.65)]">Agent Online</span>
              </div>
            </div>
          </div>

          {/* URL Input */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative group">
              {/* Focus glow */}
              <motion.div
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(92, 51, 23, 0.3) 0%, rgba(255, 218, 185, 0.2) 100%)',
                  filter: 'blur(8px)',
                }}
              />
              
              <div 
                className="relative flex items-center rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 218, 185, 0.15)',
                }}
              >
                <div className="pl-5 pr-3">
                  <UrlIcon size={24} className="text-[rgba(255,218,185,0.5)]" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste a product URL to start..."
                  disabled={isLoading}
                  className="flex-1 py-5 pr-5 bg-transparent text-white text-lg placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="m-2 px-8 py-4 rounded-xl font-semibold text-[#FFDAB9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                    boxShadow: '0 0 20px rgba(92, 51, 23, 0.3)',
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <SparkleIcon size={20} />
                      </motion.div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ZapIcon size={20} />
                      Generate
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </form>

          {/* Quick Actions */}
          <div>
            <p className="text-sm text-[rgba(255,255,255,0.45)] mb-4 uppercase tracking-wider">Quick Actions</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleActionClick(action.id)}
                  className={cn(
                    'p-4 rounded-2xl text-left transition-all backdrop-blur-xl',
                    selectedAction === action.id
                      ? 'bg-[rgba(92,51,23,0.3)] border border-[rgba(255,218,185,0.3)]'
                      : 'bg-white/5 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,218,185,0.2)]'
                  )}
                >
                  <QuickActionIcon Icon={action.icon} isSelected={selectedAction === action.id} />
                  <p className={cn(
                    'text-sm font-medium transition-colors',
                    selectedAction === action.id ? 'text-white' : 'text-[rgba(255,255,255,0.75)]'
                  )}>
                    {action.label}
                  </p>
                  <p className="text-xs text-[rgba(255,255,255,0.4)] mt-0.5">
                    {action.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
});

export default AICommandCenter;
