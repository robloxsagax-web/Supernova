'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles,
  Video,
  Image as ImageIcon,
  Copy,
  Users,
  Share2,
  Target,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const actionItems = [
  {
    icon: Sparkles,
    title: 'Create Campaign',
    description: 'Start a new marketing campaign',
    gradient: 'from-maroon/20 to-peach/20',
    iconColor: 'text-peach',
  },
  {
    icon: Video,
    title: 'Generate Video Ads',
    description: 'AI-powered video generation',
    gradient: 'from-peach/20 to-maroon/20',
    iconColor: 'text-maroon',
  },
  {
    icon: ImageIcon,
    title: 'Generate Image Ads',
    description: 'Create stunning visuals',
    gradient: 'from-maroon/20 to-peach/20',
    iconColor: 'text-peach',
  },
  {
    icon: Copy,
    title: 'Marketing Copy',
    description: 'Compelling ad copy',
    gradient: 'from-peach/20 to-maroon/20',
    iconColor: 'text-maroon',
  },
  {
    icon: Users,
    title: 'Competitor Research',
    description: 'Analyze market landscape',
    gradient: 'from-maroon/20 to-peach/20',
    iconColor: 'text-peach',
  },
  {
    icon: Share2,
    title: 'Social Media Kit',
    description: 'Multi-platform assets',
    gradient: 'from-peach/20 to-maroon/20',
    iconColor: 'text-maroon',
  },
  {
    icon: Target,
    title: 'Brand Analysis',
    description: 'Deep brand insights',
    gradient: 'from-maroon/20 to-peach/20',
    iconColor: 'text-peach',
  },
  {
    icon: Lightbulb,
    title: 'Campaign Strategy',
    description: 'Strategic planning',
    gradient: 'from-peach/20 to-maroon/20',
    iconColor: 'text-maroon',
  },
];

export function ActionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actionItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <motion.div
            key={item.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative p-6 rounded-2xl glass glass-hover cursor-pointer overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
              item.gradient
            )} />
            
            {/* Glow Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-maroon/30 to-peach/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl glass flex items-center justify-center',
                  'group-hover:scale-110 transition-transform duration-300'
                )}>
                  <Icon className={cn('w-6 h-6', item.iconColor)} />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
              </div>
              
              <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-peach transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            
            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-maroon/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        );
      })}
    </div>
  );
}
