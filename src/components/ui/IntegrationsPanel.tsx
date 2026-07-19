'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Brain,
  Sparkles,
  TrendingUp,
  Globe,
  HardDrive,
  Mic,
  Search,
  Music,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react';

interface IntegrationCardProps {
  icon: React.ElementType;
  provider: string;
  model: string;
  status: 'active' | 'fallback' | 'backup' | 'configured' | 'available';
  purpose?: string;
  endpoint?: string;
  showStatus?: boolean;
  delay?: number;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useState(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[200] px-4 py-3 rounded-xl bg-[#111111] border border-[#22C55E]/30 shadow-lg flex items-center gap-2"
    >
      <Check className="w-4 h-4 text-[#22C55E]" />
      <span className="text-sm text-white">{message}</span>
    </motion.div>
  );
}

const statusConfig = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.3)' },
  fallback: { label: 'Fallback', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.3)' },
  backup: { label: 'Backup', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.3)' },
  configured: { label: 'Configured', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.3)' },
  available: { label: 'Available', color: '#FFFFFF', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.15)' },
  primary: { label: 'Primary', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.3)' },
};

function IntegrationCard({ icon: Icon, provider, model, status, purpose, endpoint, showStatus = true, delay = 0 }: IntegrationCardProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const config = statusConfig[status];

  const handleCopyEndpoint = useCallback(async () => {
    if (endpoint) {
      try {
        await navigator.clipboard.writeText(endpoint);
        setCopied(true);
        setShowToast(true);
        setTimeout(() => {
          setCopied(false);
          setShowToast(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }, [endpoint]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative p-4 rounded-2xl transition-all duration-300 group"
        style={{
          background: 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 218, 185, 0.08)',
        }}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
          style={{ boxShadow: '0 0 30px rgba(92, 51, 23, 0.3), inset 0 0 30px rgba(92, 51, 23, 0.1)' }} 
        />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                boxShadow: '0 4px 15px rgba(92, 51, 23, 0.3)',
              }}>
                <Icon className="w-5 h-5 text-[#FFDAB9]" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{provider}</h4>
                {purpose && <p className="text-xs text-[rgba(255,255,255,0.5)]">{purpose}</p>}
              </div>
            </div>
            {showStatus && (
              <span 
                className="text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase"
                style={{ 
                  background: config.bg, 
                  color: config.color, 
                  border: `1px solid ${config.border}` 
                }}
              >
                {config.label}
              </span>
            )}
          </div>

          {/* Model */}
          <div className="mb-3">
            <p className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-1">Model</p>
            <code className="text-sm text-[rgba(255,255,255,0.8)] block truncate">{model}</code>
          </div>

          {/* Endpoint with copy button */}
          {endpoint && (
            <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Globe className="w-3.5 h-3.5 text-[rgba(255,255,255,0.3)] flex-shrink-0" />
              <code className="text-xs text-[rgba(255,255,255,0.5)] flex-1 truncate">{endpoint}</code>
              <button
                onClick={handleCopyEndpoint}
                className={cn(
                  'p-1.5 rounded-lg transition-all duration-200 flex-shrink-0',
                  copied ? 'text-[#22C55E]' : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-white/10'
                )}
                title="Copy endpoint"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Toast */}
      {showToast && (
        <Toast message={`Copied ${endpoint}`} onClose={() => setShowToast(false)} />
      )}
    </>
  );
}

// AI Models Section
export function AIModelsSection() {
  const scriptModels = [
    { provider: 'Qwen', model: 'qwen/qwen3.6-flash', status: 'active' as const },
    { provider: 'Qwen', model: 'qwen/qwen3.7-plus', status: 'fallback' as const },
    { provider: 'Qwen', model: 'qwen/qwen3.6-plus:free', status: 'backup' as const },
  ];

  const marketIntelModels = [
    { provider: 'DeepSeek', model: 'deepseek/deepseek-v3.2', status: 'primary' as const },
    { provider: 'Claude', model: 'anthropic/claude-sonnet-4-20250514', status: 'fallback' as const },
    { provider: 'Gemini', model: 'google/gemini-2.5-flash', status: 'fallback' as const },
    { provider: 'Qwen', model: 'qwen/qwen3.6-plus', status: 'fallback' as const },
    { provider: 'Mistral', model: 'mistral/mistral-nemo', status: 'backup' as const },
  ];

  return (
    <div className="space-y-8">
      {/* Script Generation */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(92,51,23,0.3)' }}>
            <Sparkles className="w-4 h-4 text-[#FFDAB9]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Script Generation</h3>
            <p className="text-sm text-[rgba(255,255,255,0.5)]">AI models for marketing copy</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scriptModels.map((model, index) => (
            <IntegrationCard
              key={model.model}
              icon={Sparkles}
              provider={model.provider}
              model={model.model}
              status={model.status}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Market Intelligence */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(92,51,23,0.3)' }}>
            <TrendingUp className="w-4 h-4 text-[#FFDAB9]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Market Intelligence</h3>
            <p className="text-sm text-[rgba(255,255,255,0.5)]">AI models for competitor analysis</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketIntelModels.map((model, index) => (
            <IntegrationCard
              key={model.model}
              icon={model.status === 'primary' ? TrendingUp : Brain}
              provider={model.provider}
              model={model.model}
              status={model.status}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// External Services Section
export function ExternalServicesSection() {
  const services = [
    {
      icon: Layers,
      provider: 'OpenRouter',
      purpose: 'AI Model Routing',
      endpoint: 'https://openrouter.ai/api/v1',
      status: 'configured' as const,
    },
    {
      icon: HardDrive,
      provider: 'Backblaze B2',
      purpose: 'Campaign Storage',
      endpoint: 'https://s3.us-east-005.backblazeb2.com',
      status: 'configured' as const,
    },
    {
      icon: Mic,
      provider: 'ElevenLabs',
      purpose: 'Voice Generation',
      endpoint: 'https://api.elevenlabs.io/v1/text-to-speech/',
      status: 'configured' as const,
    },
    {
      icon: Search,
      provider: 'JINA Reader',
      purpose: 'Product Scraping',
      endpoint: 'https://r.jina.ai/',
      status: 'configured' as const,
    },
    {
      icon: Layers,
      provider: 'Pexels Videos',
      purpose: 'B-roll Video Search',
      endpoint: 'https://api.pexels.com/videos/search',
      status: 'configured' as const,
    },
    {
      icon: Layers,
      provider: 'Pexels Photos',
      purpose: 'Stock Image Search',
      endpoint: 'https://api.pexels.com/v1/search',
      status: 'configured' as const,
    },
    {
      icon: Music,
      provider: 'SoundHelix',
      purpose: 'Background Music',
      endpoint: 'https://www.soundhelix.com/',
      status: 'available' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service, index) => (
        <IntegrationCard
          key={service.provider}
          icon={service.icon}
          provider={service.provider}
          model={service.purpose}
          status={service.status}
          purpose={service.purpose}
          endpoint={service.endpoint}
          showStatus={true}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
