'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  VideoIcon, 
  ImageIcon, 
  CopyIcon, 
  StrategyIcon,
  AnalyticsIcon,
  BrandIcon,
  LibraryIcon,
  SparkleIcon
} from '@/components/ui/premium-icons';

/**
 * Premium Workspace Hub with Bento Grid
 * Card-based layout for creative tools
 */

interface WorkspaceHubProps {
  onSelectTool: (tool: string) => void;
  className?: string;
}

export function WorkspaceHub({ onSelectTool, className }: WorkspaceHubProps) {
  const tools = [
    {
      id: 'video',
      icon: VideoIcon,
      title: 'Video Studio',
      description: 'Create stunning video ads',
      size: 'large',
      gradient: 'from-[#5C3317]/30 to-transparent',
    },
    {
      id: 'image',
      icon: ImageIcon,
      title: 'Image Studio',
      description: 'Design visual assets',
      size: 'normal',
      gradient: 'from-[#8B5A2B]/30 to-transparent',
    },
    {
      id: 'copy',
      icon: CopyIcon,
      title: 'Marketing Copy',
      description: 'Write compelling content',
      size: 'normal',
      gradient: 'from-[#FFDAB9]/20 to-transparent',
    },
    {
      id: 'strategy',
      icon: StrategyIcon,
      title: 'Campaign Strategy',
      description: 'Build your roadmap',
      size: 'normal',
      gradient: 'from-[#5C3317]/20 to-transparent',
    },
    {
      id: 'analytics',
      icon: AnalyticsIcon,
      title: 'Analytics',
      description: 'Track performance',
      size: 'normal',
      gradient: 'from-[#8B5A2B]/20 to-transparent',
    },
    {
      id: 'brand',
      icon: BrandIcon,
      title: 'Brand Kit',
      description: 'Manage your identity',
      size: 'normal',
      gradient: 'from-[#FFDAB9]/15 to-transparent',
    },
    {
      id: 'library',
      icon: LibraryIcon,
      title: 'Asset Library',
      description: 'Organize your assets',
      size: 'wide',
      gradient: 'from-[#5C3317]/25 to-transparent',
    },
  ];

  return (
    <section className={cn('relative', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Creative Workspace</h3>
            <p className="text-[rgba(255,255,255,0.5)] mt-1">Tools for your marketing arsenal</p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          {tools.map((tool, index) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTool(tool.id)}
              className={cn(
                'group relative rounded-2xl p-6 text-left overflow-hidden transition-all duration-300',
                'backdrop-blur-xl border border-[rgba(255,255,255,0.08)]',
                'hover:border-[rgba(255,218,185,0.25)] hover:shadow-lg',
                tool.size === 'large' && 'col-span-2 row-span-2',
                tool.size === 'wide' && 'col-span-2'
              )}
              style={{
                background: `linear-gradient(135deg, ${tool.gradient.replace('from-', 'rgba(92, 51, 23, 0.1)').replace(' to-transparent', ', transparent)'), rgba(0, 0, 0, 0.3))`,
              }}
            >
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255, 218, 185, 0.1) 0%, transparent 70%)',
                }}
              />

              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px]">
                <div 
                  className="h-full w-full rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(92, 51, 23, 0.5) 0%, rgba(255, 218, 185, 0.3) 50%, rgba(92, 51, 23, 0.5) 100%)',
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Icon */}
                <motion.div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300',
                    'bg-[rgba(92,51,23,0.2)] group-hover:bg-[rgba(92,51,23,0.3)]'
                  )}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                >
                  <tool.icon size={28} className="text-[#FFDAB9]" />
                </motion.div>

                {/* Text */}
                <div className="mt-auto">
                  <h4 className="text-lg font-semibold text-white group-hover:text-[#FFDAB9] transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-sm text-[rgba(255,255,255,0.45)] mt-1">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div 
                  className="absolute top-0 right-0 w-full h-full"
                  style={{
                    background: 'radial-gradient(circle at top right, rgba(255, 218, 185, 0.15) 0%, transparent 70%)',
                  }}
                />
              </div>
            </motion.button>
          ))}

          {/* Quick Start Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="col-span-2 rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(92, 51, 23, 0.2) 0%, rgba(139, 90, 43, 0.1) 100%)',
              border: '1px solid rgba(255, 218, 185, 0.1)',
            }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 0% 100%, rgba(255, 218, 185, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 0%, rgba(255, 218, 185, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 100%, rgba(255, 218, 185, 0.1) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <SparkleIcon size={24} className="text-[#FFDAB9]" />
                <h4 className="text-lg font-semibold text-white">Start Fresh</h4>
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.5)] mb-4">
                Paste any product URL to generate a complete marketing campaign in minutes.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(255,218,185,0.1)] text-[#FFDAB9] text-sm font-medium">
                <span>Try Now</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
