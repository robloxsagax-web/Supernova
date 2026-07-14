'use client';

import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ActionCards } from '@/components/dashboard/ActionCards';
import { AIAgentPanel } from '@/components/dashboard/AIAgentPanel';
import { URLInputForm } from '@/components/dashboard/URLInputForm';
import { WorkflowProgress } from '@/components/dashboard/WorkflowProgress';
import { useStore } from '@/lib/store';
import { Loader } from '@/components/Loader';
import { ProductPreview } from '@/components/ProductPreview';
import { ScriptPreview } from '@/components/ScriptPreview';
import { VideoPlayer } from '@/components/VideoPlayer';
import { AIAdStudio } from '@/components/AIAdStudio';

const loadingMessages: Record<'url' | 'product' | 'script' | 'video', string> = {
  url: 'Analyzing product page...',
  product: 'Generating ad script...',
  script: 'Creating video...',
  video: 'Processing video...',
};

export function Dashboard() {
  const { step, isLoading, error } = useStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="ml-64 mr-80 pt-16 min-h-screen"
      >
        <div className="p-8">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold text-foreground mb-4 leading-tight"
            >
              What would you like{' '}
              <span className="bg-gradient-to-r from-maroon to-peach bg-clip-text text-transparent">
                Supernova
              </span>{' '}
              to create?
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Your AI Marketing Agent that researches products, generates campaigns,
              creates images, produces videos, and manages creative assets automatically.
            </motion.p>
          </div>

          {/* Workflow Progress */}
          <WorkflowProgress />

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-4xl mx-auto mb-8 p-4 rounded-xl bg-error/10 border border-error/20 text-error"
            >
              {error}
            </motion.div>
          )}

          {/* Main Content */}
          {isLoading ? (
            <div className="max-w-4xl mx-auto">
              <Loader message={loadingMessages[step]} />
            </div>
          ) : (
            <>
              {/* URL Input Form - Initial State */}
              {step === 'url' && (
                <div className="mb-12">
                  <URLInputForm />
                </div>
              )}

              {/* Action Cards - Only show when at initial state */}
              {step === 'url' && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Quick Actions
                    </h2>
                    <p className="text-muted-foreground">
                      Choose what you want to create
                    </p>
                  </div>
                  <ActionCards />
                </motion.div>
              )}

              {/* Product Preview */}
              {step === 'product' && <ProductPreview />}

              {/* Script Preview */}
              {step === 'script' && <ScriptPreview />}

              {/* Video Player and AI Ad Studio */}
              {step === 'video' && (
                <div className="space-y-8">
                  <VideoPlayer />
                  <AIAdStudio />
                </div>
              )}
            </>
          )}
        </div>
      </motion.main>

      {/* AI Agent Panel */}
      <AIAgentPanel />
    </div>
  );
}
