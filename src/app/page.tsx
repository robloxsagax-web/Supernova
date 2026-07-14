'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Stepper } from '@/components/Stepper';
import { UrlInputForm } from '@/components/UrlInputForm';
import { ProductPreview } from '@/components/ProductPreview';
import { ScriptPreview } from '@/components/ScriptPreview';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Loader } from '@/components/Loader';
import { AIAdStudio } from '@/components/AIAdStudio';
import { Sparkles } from 'lucide-react';

const loadingMessages: Record<'url' | 'product' | 'script' | 'video', string> = {
  url: 'Analyzing product page...',
  product: 'Generating ad script...',
  script: 'Creating video...',
  video: 'Processing video...',
};

export default function Home() {
  const { step, isLoading, error } = useStore();

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header Section */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <Sparkles className="w-4 h-4 text-peach" />
              <span className="text-sm text-muted-foreground">Powered by Advanced AI</span>
            </div>
            <h1 className="text-5xl font-bold text-foreground">
              <span className="bg-gradient-to-r from-maroon to-peach bg-clip-text text-transparent">
                Supernova
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any product page into stunning video ads and creative assets
            </p>
          </motion.div>

          {/* Stepper */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Stepper />
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-center glass"
            >
              {error}
            </motion.div>
          )}

          {/* Main Content */}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader message={loadingMessages[step]} />
            </motion.div>
          ) : (
            <>
              {step === 'url' && <UrlInputForm />}
              {step === 'product' && <ProductPreview />}
              {step === 'script' && <ScriptPreview />}
              {step === 'video' && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <VideoPlayer />
                  <AIAdStudio />
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
