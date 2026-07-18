'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { MarketIntelligence as MarketIntelligenceType } from '@/types/product';
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp, 
  Heart, 
  Smartphone, 
  Rocket,
  Award,
  Loader2
} from 'lucide-react';

// Animated progress indicator
const AnimatedProgress = ({ progress, label }: { progress: number; label: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-white/10"
        />
        <motion.circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-[#FFDAB9]"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 351" }}
          animate={{ strokeDasharray: `${progress * 3.51} 351` }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-white">{progress}%</div>
          <div className="text-xs text-white/60">AI Confidence</div>
        </motion.div>
      </div>
    </div>
  </div>
);

// Loading messages
const loadingMessages = [
  'Analyzing audience...',
  'Researching competitors...',
  'Finding positioning...',
  'Generating marketing hooks...',
  'Done.'
];

export function MarketIntelligence() {
  const { 
    product, 
    script, 
    marketIntelligence,
    videoSettings,
    generationType,
    setMarketIntelligence,
    setBRollConfig,
    setProductImages,
    setLoading, 
    setError, 
    setStep,
    isLoading,
    error 
  } = useStore();
  
  const [loadingMessage, setLoadingMessage] = useState(0);

  const handleGenerate = async () => {
    if (!product || !script) return;
    
    setLoading(true);
    setError(null);
    setLoadingMessage(0);

    try {
      // Simulate loading messages
      const messageInterval = setInterval(() => {
        setLoadingMessage((prev) => Math.min(prev + 1, loadingMessages.length - 1));
      }, 2000);

      const response = await fetch('/api/market-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, script }),
      });

      clearInterval(messageInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate market intelligence');
      }

      const data = await response.json();
      setMarketIntelligence(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch video/BRoll config before navigating to video step
      const videoResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          script,
          generationType,
          product,
          duration: videoSettings.duration,
          videoSettings
        }),
      });

      if (videoResponse.ok) {
        const videoData = await videoResponse.json();
        // Store B-roll config if provided (for b-roll mode)
        if (videoData.bRollConfig) {
          setBRollConfig(videoData.bRollConfig);
          setProductImages(videoData.productImages || []);
        }
      }
    } catch (err) {
      // Log error but don't block navigation - video will still play with fallback content
      console.error('Video initialization error:', err);
    } finally {
      setLoading(false);
    }

    setStep('video');
  };

  // No product or script
  if (!product || !script) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center text-white/60">
          Product and script are required to generate market intelligence.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative inline-flex items-center justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] flex items-center justify-center shadow-[0_0_40px_rgba(92,51,23,0.5)]">
              <Brain className="w-12 h-12 text-[#FFDAB9]" />
            </div>
          </motion.div>
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4">
          Market Intelligence
        </h1>
        <p className="text-lg text-white/65 max-w-2xl mx-auto">
          Supernova analyzed your product and generated strategic marketing insights before campaign production.
        </p>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            <div className="p-12 rounded-2xl text-center space-y-6"
              style={{
                background: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 218, 185, 0.08)',
              }}
            >
              <Loader2 className="w-16 h-16 text-[#FFDAB9] animate-spin mx-auto" />
              <p className="text-xl text-white font-medium">
                {loadingMessages[loadingMessage]}
              </p>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#5C3317] to-[#FFDAB9]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 10, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto p-6 rounded-2xl"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <p className="text-center mb-4 text-[#EF4444]">{error}</p>
            <Button onClick={handleGenerate} className="w-full">
              Retry
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Button - Show when no data and not loading */}
      <AnimatePresence>
        {!marketIntelligence && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-2xl mx-auto"
          >
            <Button
              onClick={handleGenerate}
              className="w-full h-16 rounded-2xl text-xl font-bold bg-gradient-to-r from-[#5C3317] to-[#FFDAB9] hover:opacity-90 transition-all"
              style={{
                boxShadow: '0 0 30px rgba(92, 51, 23, 0.5)',
              }}
            >
              <Rocket className="w-6 h-6 mr-3" />
              Generate Market Intelligence
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Display */}
      <AnimatePresence>
        {marketIntelligence && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Confidence Score */}
            <div className="flex justify-center">
              <AnimatedProgress progress={marketIntelligence.confidence_score} label="AI Confidence" />
            </div>

            {/* Target Audience */}
            <div className="p-8 rounded-2xl"
              style={{
                background: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 218, 185, 0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#FFDAB9]/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#FFDAB9]" />
                </div>
                <h2 className="text-2xl font-bold text-white">🎯 Target Audience</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60">Age:</span>
                    <span className="text-white font-medium">{marketIntelligence.target_audience.age}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60">Gender:</span>
                    <span className="text-white font-medium">{marketIntelligence.target_audience.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60">Income:</span>
                    <span className="text-white font-medium">{marketIntelligence.target_audience.income}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-white/60 block mb-2">Interests:</span>
                    <div className="flex flex-wrap gap-2">
                      {marketIntelligence.target_audience.interests.map((interest, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-[#FFDAB9]/10 text-[#FFDAB9] text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-white/60 block mb-2">Pain Points:</span>
                  <ul className="space-y-1">
                    {marketIntelligence.target_audience.pain_points.map((pain, i) => (
                      <li key={i} className="text-white text-sm">• {pain}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-sm text-white/60 block mb-2">Buying Motivation:</span>
                  <ul className="space-y-1">
                    {marketIntelligence.target_audience.buying_motivation.map((motivation, i) => (
                      <li key={i} className="text-white text-sm">• {motivation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="p-8 rounded-2xl"
              style={{
                background: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 218, 185, 0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#FFDAB9]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#FFDAB9]" />
                </div>
                <h2 className="text-2xl font-bold text-white">🏆 Competitor Analysis</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketIntelligence.competitors.map((competitor, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFDAB9]/30 transition-all">
                    <h3 className="font-bold text-white mb-2">{competitor.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-[#22C55E]">Strength:</span>
                        <p className="text-white/80">{competitor.strength}</p>
                      </div>
                      <div>
                        <span className="text-red-400">Weakness:</span>
                        <p className="text-white/80">{competitor.weakness}</p>
                      </div>
                      <div>
                        <span className="text-[#FFDAB9]">Position:</span>
                        <p className="text-white/80">{competitor.position}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing Angles */}
            <div className="p-8 rounded-2xl"
              style={{
                background: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 218, 185, 0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#FFDAB9]/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#FFDAB9]" />
                </div>
                <h2 className="text-2xl font-bold text-white">🚀 Marketing Angles</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {marketIntelligence.marketing_angles.map((angle, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#5C3317] to-[#FFDAB9] text-white font-medium hover:scale-105 transition-transform cursor-pointer"
                  >
                    {angle}
                  </span>
                ))}
              </div>
            </div>

            {/* Emotional Hooks */}
            <div className="p-8 rounded-2xl"
              style={{
                background: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 218, 185, 0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#FFDAB9]/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#FFDAB9]" />
                </div>
                <h2 className="text-2xl font-bold text-white">❤️ Emotional Hooks</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketIntelligence.emotional_hooks.map((hook, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-[#FFDAB9]" />
                    <span className="text-white">{hook}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Platforms */}
            <div className="p-8 rounded-2xl"
              style={{
                background: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 218, 185, 0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#FFDAB9]/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-[#FFDAB9]" />
                </div>
                <h2 className="text-2xl font-bold text-white">📱 Best Platforms</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketIntelligence.recommended_platforms.map((platform, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFDAB9]/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">{platform.name}</span>
                      <span className="text-[#FFDAB9] font-bold">{platform.suitability}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#5C3317] to-[#FFDAB9]"
                        initial={{ width: 0 }}
                        animate={{ width: `${platform.suitability}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Strategy */}
            <div className="p-8 rounded-2xl border-2 border-[#FFDAB9]/30"
              style={{
                background: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5C3317] to-[#FFDAB9] flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">📈 Recommended Campaign</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <span className="text-sm text-[#FFDAB9] font-semibold block mb-2">Primary Strategy</span>
                  <p className="text-xl text-white font-medium">{marketIntelligence.campaign_strategy.primary}</p>
                </div>
                
                <div>
                  <span className="text-sm text-white/60 block mb-2">Secondary Strategy</span>
                  <p className="text-white">{marketIntelligence.campaign_strategy.secondary}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-[#FFDAB9]/10 border border-[#FFDAB9]/30">
                  <span className="text-sm text-[#FFDAB9] font-semibold block mb-2">Call to Action</span>
                  <p className="text-white font-bold text-lg">{marketIntelligence.campaign_strategy.cta}</p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              className="w-full h-16 rounded-2xl text-xl font-bold bg-gradient-to-r from-[#5C3317] to-[#FFDAB9] hover:opacity-90 transition-all"
              style={{
                boxShadow: '0 0 30px rgba(92, 51, 23, 0.5)',
              }}
            >
              Continue to Video Generation
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
