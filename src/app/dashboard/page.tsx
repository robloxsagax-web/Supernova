'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  Sparkles,
  Plus,
  Link,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Play,
  ArrowRight,
  Check,
  Zap,
  Palette,
  Cloud,
  ChevronRight,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [timeOfDay, setTimeOfDay] = useState('Afternoon');
  const projects = useStore((state) => state.projects);
  
  const hasCampaigns = projects.length > 0;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  const quickActions = [
    { 
      label: 'New Campaign', 
      icon: Plus, 
      gradient: 'from-[#ff7a00] to-[#ff9a3c]',
      description: 'Start from a product URL',
      action: () => router.push('/create')
    },
    { 
      label: 'Import Product URL', 
      icon: Link, 
      gradient: 'from-purple-500 to-pink-500',
      description: 'Analyze any product page',
      action: () => router.push('/create')
    },
    { 
      label: 'Upload Images', 
      icon: ImageIcon, 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Use your own visuals',
      action: () => router.push('/create')
    },
    { 
      label: 'Start From Scratch', 
      icon: Layers, 
      gradient: 'from-emerald-500 to-teal-500',
      description: 'No product required',
      action: () => router.push('/create')
    },
    { 
      label: 'Browse Templates', 
      icon: LayoutTemplate, 
      gradient: 'from-violet-500 to-purple-500',
      description: 'Explore pre-built campaigns',
      action: () => router.push('/create')
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI Strategy Engine',
      description: 'Generates comprehensive marketing strategies before creating content. Analyzes competitors and market trends automatically.',
      gradient: 'from-[#ff7a00]/20 to-transparent'
    },
    {
      icon: Palette,
      title: 'Creative Studio',
      description: 'Creates scripts, visuals, videos and all marketing assets in one unified workspace. Professional quality, every time.',
      gradient: 'from-purple-500/20 to-transparent'
    },
    {
      icon: Cloud,
      title: 'Cloud Media Library',
      description: 'Automatically stores every generated asset securely. Access your entire creative library from anywhere.',
      gradient: 'from-blue-500/20 to-transparent'
    },
  ];

  const steps = [
    { label: 'Product URL', icon: Link },
    { label: 'AI Analysis', icon: Sparkles },
    { label: 'Strategy', icon: Zap },
    { label: 'Script', icon: Layers },
    { label: 'Visuals', icon: ImageIcon },
    { label: 'Video', icon: Play },
    { label: 'Storage', icon: Cloud },
    { label: 'Publish', icon: Check },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#000000]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-[#ff7a00]/30 via-[#ff9a3c]/10 to-transparent rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, delay: 3 }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 pt-20"
        >
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-bold text-white">
              Good {timeOfDay} 👋
            </h1>
            <div className="space-y-2">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#ff7a00] via-[#ff9a3c] to-[#ffb366] bg-clip-text text-transparent">
                Supernova Creative Studio
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Turn any product into high-converting AI marketing campaigns, videos, images, and creative assets in minutes.
              </p>
            </div>
          </div>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <motion.button
              onClick={() => router.push('/create')}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 122, 0, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="group px-12 py-5 rounded-2xl bg-gradient-to-r from-[#ff7a00] to-[#ff9a3c] text-white font-bold text-xl shadow-2xl shadow-[#ff7a00]/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                Create Campaign
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-5 rounded-2xl glass border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-4">Get Started</h3>
            <p className="text-gray-400 text-lg">Choose how you want to begin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                onClick={action.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-8 rounded-3xl glass border border-white/10 hover:border-[#ff7a00]/50 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10 flex flex-col items-start space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-bold text-white mb-2">{action.label}</h4>
                    <p className="text-sm text-gray-400">{action.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[#ff7a00] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Start <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-12"
        >
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-4">How It Works</h3>
            <p className="text-gray-400 text-lg">From product to published campaign in minutes</p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="flex flex-col items-center space-y-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center group hover:border-[#ff7a00]/50 transition-all"
                  >
                    <step.icon className="w-7 h-7 text-[#ff7a00]" />
                  </motion.div>
                  <span className="text-xs text-gray-400 text-center font-medium">{step.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-4">Powerful Features</h3>
            <p className="text-gray-400 text-lg">Everything you need to create professional marketing content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl glass border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff7a00] to-[#ff9a3c] flex items-center justify-center shadow-lg">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {!hasCampaigns && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a00]/10 via-transparent to-[#ff9a3c]/10 rounded-3xl blur-xl" />
            <div className="relative p-12 rounded-3xl glass border border-[#ff7a00]/20 bg-gradient-to-br from-[#ff7a00]/5 to-transparent">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                  <h3 className="text-5xl font-bold text-white">
                    Ready to create your first campaign?
                  </h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    Paste any Amazon, Shopify or product URL and Supernova will automatically:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {[
                    'Analyze your product',
                    'Build a marketing strategy',
                    'Write the script',
                    'Generate scenes',
                    'Create AI visuals',
                    'Produce the final video',
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + idx * 0.05 }}
                      className="flex items-center gap-3 text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff7a00] to-[#ff9a3c] flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg text-white font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={() => router.push('/create')}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255, 122, 0, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-16 py-6 rounded-2xl bg-gradient-to-r from-[#ff7a00] to-[#ff9a3c] text-white font-bold text-2xl shadow-2xl shadow-[#ff7a00]/40 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative flex items-center gap-4">
                    <Sparkles className="w-8 h-8" />
                    Create First Campaign
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {hasCampaigns && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-4xl font-bold text-white mb-2">Recent Activity</h3>
                <p className="text-gray-400 text-lg">Your latest campaigns and creations</p>
              </div>
              <motion.button
                onClick={() => router.push('/create')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff7a00] to-[#ff9a3c] text-white font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Campaign
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + idx * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="p-6 rounded-2xl glass border border-white/10 hover:border-[#ff7a00]/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => router.push('/create')}
                >
                  <div className="space-y-4">
                    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[#ff7a00]/20 to-[#ff9a3c]/10 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-[#ff7a00]/50" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1 truncate">{project.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#ff7a00] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Campaign <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="h-20" />
      </div>
    </div>
  );
}
