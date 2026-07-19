'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { UrlInputForm } from '@/components/UrlInputForm';
import { ProductPreview } from '@/components/ProductPreview';
import { ScriptPreview } from '@/components/ScriptPreview';
import { MarketIntelligence } from '@/components/MarketIntelligence';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Loader } from '@/components/Loader';
import { AIAdStudio } from '@/components/AIAdStudio';
import { 
  Sparkles, 
  ArrowRight, 
  Zap,
  FileText,
  Image,
  Film,
  Rocket,
  Check
} from 'lucide-react';
import { PremiumStepper } from '@/components/premium/PremiumStepper';
import { CampaignPreview } from '@/components/premium/CampaignPreview';

const loadingMessages: Record<'url' | 'product' | 'script' | 'marketIntelligence' | 'video', string> = {
  url: 'Analyzing product page...',
  product: 'Generating ad script...',
  script: 'Creating video...',
  marketIntelligence: 'Generating market intelligence...',
  video: 'Processing video...',
};

/**
 * Premium Create Page - Complete UI overhaul
 * Inspired by Linear, Vercel, Arc Browser
 * Features:
 * - Premium hero header with badge
 * - Animated horizontal stepper
 * - Campaign preview sidebar
 * - All existing functionality preserved
 */
export default function CreatePage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const { step, isLoading: isStoreLoading, error } = useStore();

  // Auth protection
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth');
    }
  }, [isLoggedIn, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] opacity-50 blur-sm animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#09090B]" />
          </div>
        </div>
      </div>
    );
  }

  // Don't Render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="h-screen overflow-hidden relative">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top gradient glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5C3317]/10 rounded-full blur-[150px]" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#FFDAB9]/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Content Grid - Full height with flex */}
      <div className="relative z-10 flex h-full">
        {/* Left/Center Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Premium Hero Header */}
            <motion.div 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="mb-12"
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full"
                style={{
                  background: 'rgba(92, 51, 23, 0.15)',
                  border: '1px solid rgba(255, 218, 185, 0.15)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="relative flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  <Zap className="w-3 h-3 text-[#FFDAB9]" />
                </div>
                <span className="text-xs font-medium text-[rgba(255,218,185,0.8)] uppercase tracking-wider">
                  AI Marketing Workspace
                </span>
              </motion.div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
                <span className="text-white">Create </span>
                <span className="bg-gradient-to-r from-[#FFDAB9] via-[#FFDAB9] to-[#8B5A2B] bg-clip-text text-transparent">
                  Campaign
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-[rgba(255,255,255,0.5)] max-w-xl leading-relaxed">
                Build cinematic marketing assets powered by autonomous AI agents.
                Transform any product URL into stunning video content.
              </p>
            </motion.div>

            {/* Premium Stepper */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <PremiumStepper />
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ y: -20, opacity: 0, height: 0 }}
                  animate={{ y: 0, opacity: 1, height: 'auto' }}
                  exit={{ y: -20, opacity: 0, height: 0 }}
                  className="mb-8 p-4 rounded-2xl"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <p className="text-sm text-[#EF4444] text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader message={loadingMessages[step]} />
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  {step === 'url' && <UrlInputForm />}
                  {step === 'product' && <ProductPreview />}
                  {step === 'script' && <ScriptPreview />}
                  {step === 'marketIntelligence' && <MarketIntelligence />}
                  {step === 'video' && (
                    <div className="space-y-8">
                      <VideoPlayer />
                      <AIAdStudio />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar - Campaign Preview */}
        <motion.aside
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="hidden xl:block w-80 flex-shrink-0 h-full overflow-hidden p-6"
        >
          <div className="h-full flex flex-col">
            <CampaignPreview />
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
