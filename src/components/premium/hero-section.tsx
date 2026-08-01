'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SupernovaLogo } from '@/components/branding';
import { CampaignIcon, VideoIcon, ImageIcon, CopyIcon, UrlIcon } from '@/components/ui/premium-icons';

interface HeroSectionProps {
  onCreateCampaign: () => void;
  className?: string;
}

export function PremiumHeroSection({ onCreateCampaign, className }: HeroSectionProps) {
  return (
    <section className={cn('relative w-full', className)}>
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {/* Primary glow */}
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(circle, rgba(92, 51, 23, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        
        {/* Secondary glow */}
        <motion.div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 218, 185, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5C3317]/10 via-transparent to-[#FFDAB9]/5" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 px-8 py-16 md:py-24"
      >
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="relative"
          >
            <SupernovaLogo size={64} />
            {/* Glow ring */}
            <div 
              className="absolute inset-0 rounded-full animate-ping opacity-30" 
              style={{ background: 'radial-gradient(circle, rgba(255, 218, 185, 0.3) 0%, transparent 70%)' }} 
            />
          </motion.div>
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#5C3317] via-[#8B5A2B] to-[#FFDAB9] bg-clip-text text-transparent">
                Supernova
              </span>
            </h1>
            <p className="text-lg text-[rgba(255,255,255,0.65)] mt-1">AI Marketing Agent</p>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mb-10"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            <span className="text-white">Transform any product into a</span>
            <br />
            <span className="bg-gradient-to-r from-[#FFDAB9] to-[#5C3317] bg-clip-text text-transparent">
              complete marketing campaign
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-[rgba(255,255,255,0.65)] max-w-2xl leading-relaxed">
            Generate stunning videos, compelling copy, strategic insights, and creative assets — all powered by advanced AI from a single product URL.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center gap-4 mb-12"
        >
          <motion.button
            onClick={onCreateCampaign}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-10 py-5 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
              boxShadow: '0 0 40px rgba(92, 51, 23, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
            />
            
            <span className="relative flex items-center gap-3 text-lg font-semibold text-[#FFDAB9]">
              <CampaignIcon size={24} />
              Create Campaign
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-5 rounded-2xl bg-white/5 border border-[rgba(255,218,185,0.2)] text-[#FFDAB9] font-medium text-lg hover:bg-white/10 transition-all backdrop-blur-xl"
          >
            View Demo
          </motion.button>
        </motion.div>

        {/* Quick Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-3"
        >
          {[
            { icon: VideoIcon, label: 'AI Videos' },
            { icon: ImageIcon, label: 'Image Ads' },
            { icon: CopyIcon, label: 'Marketing Copy' },
            { icon: UrlIcon, label: 'Strategy' },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[rgba(255,255,255,0.08)] backdrop-blur-xl"
            >
              <feature.icon size={16} />
              <span className="text-sm text-[rgba(255,255,255,0.75)]">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl border border-[rgba(255,218,185,0.1)] pointer-events-none" />
    </section>
  );
}
