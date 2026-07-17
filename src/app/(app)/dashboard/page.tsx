'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { PremiumHeroSection, AICommandCenter, AgentStatusPanel, WorkspaceHub } from '@/components/premium';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const projects = useStore((state) => state.projects);
  const isLoadingStore = useStore((state) => state.isLoading);

  // Auth protection
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth');
    }
  }, [isLoggedIn, isLoading, router]);

  const handleCreateCampaign = () => {
    router.push('/create');
  };

  const handleSelectTool = (tool: string) => {
    router.push('/create');
  };

  const handleSubmitUrl = (url: string) => {
    router.push(`/create?url=${encodeURIComponent(url)}`);
  };

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

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <main className="relative z-10 min-h-screen">
        <div className="max-w-[1800px] mx-auto px-6 md:px-8 py-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-[rgba(255,255,255,0.5)] mt-1">Welcome to Supernova</p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateCampaign}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm"
                style={{
                  background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                  color: '#FFDAB9',
                  boxShadow: '0 0 20px rgba(92, 51, 23, 0.3)',
                }}
              >
                <span>New Campaign</span>
              </motion.button>
            </div>
          </motion.header>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <PremiumHeroSection onCreateCampaign={handleCreateCampaign} />
              
              {/* AI Command Center */}
              <AICommandCenter 
                onSubmit={handleSubmitUrl}
                isLoading={isLoadingStore}
              />
              
              {/* Workspace Hub */}
              <WorkspaceHub onSelectTool={handleSelectTool} />
            </div>

            {/* Right Column - Agent Status */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <AgentStatusPanel isProcessing={false} currentStep={0} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
