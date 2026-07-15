'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  Sparkles,
  Plus,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  ArrowRight,
  Check,
  Zap,
  Cloud,
  ChevronRight,
  Clock,
  Search,
  Bot,
  TrendingUp,
  Video,
  FileText,
  Mic,
  Share2,
  RefreshCw,
  Activity,
  Brain,
  Target
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [timeOfDay, setTimeOfDay] = useState('Afternoon');
  const [searchQuery, setSearchQuery] = useState('');
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
      icon: Sparkles, 
      gradient: 'from-[#FF6A00] to-[#FFB347]',
      description: 'Start from a product URL',
      action: () => router.push('/create'),
      glow: 'shadow-[#FF6A00]/50'
    },
    { 
      label: 'Video Ad', 
      icon: Video, 
      gradient: 'from-purple-500 to-pink-500',
      description: 'Create video content',
      action: () => router.push('/create'),
      glow: 'shadow-purple-500/50'
    },
    { 
      label: 'Image Campaign', 
      icon: ImageIcon, 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Generate ad creatives',
      action: () => router.push('/create'),
      glow: 'shadow-blue-500/50'
    },
    { 
      label: 'Marketing Copy', 
      icon: FileText, 
      gradient: 'from-emerald-500 to-teal-500',
      description: 'AI-powered copywriting',
      action: () => router.push('/create'),
      glow: 'shadow-emerald-500/50'
    },
    { 
      label: 'Product Analysis', 
      icon: Target, 
      gradient: 'from-violet-500 to-purple-500',
      description: 'Deep market research',
      action: () => router.push('/create'),
      glow: 'shadow-violet-500/50'
    },
    { 
      label: 'Storyboard', 
      icon: Layers, 
      gradient: 'from-orange-500 to-amber-500',
      description: 'Visual story planning',
      action: () => router.push('/create'),
      glow: 'shadow-orange-500/50'
    },
  ];

  const workflowSteps = [
    { icon: Brain, label: 'Research', status: 'done' },
    { icon: Zap, label: 'Strategy', status: 'active' },
    { icon: FileText, label: 'Script', status: 'pending' },
    { icon: ImageIcon, label: 'Visuals', status: 'pending' },
    { icon: Video, label: 'Video', status: 'pending' },
    { icon: Mic, label: 'Voice', status: 'pending' },
    { icon: Share2, label: 'Publish', status: 'pending' },
  ];

  const agentActivities = [
    { id: 1, text: 'Product analyzed', completed: true, time: '2s ago' },
    { id: 2, text: 'Audience identified', completed: true, time: '5s ago' },
    { id: 3, text: 'Competitors researched', completed: true, time: '8s ago' },
    { id: 4, text: 'Strategy created', completed: true, time: '12s ago' },
    { id: 5, text: 'Generating visuals...', completed: false, time: 'now' },
    { id: 6, text: 'Rendering video...', completed: false, time: 'in progress' },
    { id: 7, text: 'Uploading to storage', completed: false, time: 'pending' },
    { id: 8, text: 'Ready to publish', completed: false, time: 'pending' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#050505]" />
        
        {/* Ambient Orange Glow - Top Left */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-gradient-to-br from-[#FF6A00]/40 via-[#FFB347]/20 to-transparent rounded-full blur-[200px]"
        />
        
        {/* Ambient Orange Glow - Bottom Right */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute -bottom-60 -right-60 w-[800px] h-[800px] bg-gradient-to-tr from-[#FF6A00]/30 via-[#FFB347]/15 to-transparent rounded-full blur-[180px]"
        />

        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-12 space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 pt-8"
        >
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-8xl md:text-9xl font-bold text-white leading-none tracking-tight"
            >
              Good {timeOfDay}
              <span className="inline-block ml-4">👋</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-[#FF6A00] via-[#FFB347] to-[#FF6A00] bg-clip-text text-transparent">
                Supernova
              </h2>
              <p className="text-2xl md:text-3xl text-[#B7B7B7] max-w-4xl leading-relaxed">
                Your AI Creative Command Center
              </p>
              <p className="text-xl text-[#7A7A7A] max-w-3xl leading-relaxed">
                Turn products into high-converting marketing campaigns using autonomous AI agents
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-6 pt-6"
          >
            <motion.button
              onClick={() => router.push('/create')}
              whileHover={{ scale: 1.03, boxShadow: '0 0 60px rgba(255, 106, 0, 0.6)' }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-14 py-6 rounded-[28px] bg-gradient-to-r from-[#FF6A00] to-[#FFB347] text-white font-bold text-2xl shadow-2xl shadow-[#FF6A00]/40 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-4">
                <Sparkles className="w-7 h-7" />
                Create Campaign
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-6 rounded-[28px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[20px] text-white font-semibold text-xl hover:bg-[rgba(255,255,255,0.08)] transition-all flex items-center gap-3"
            >
              <LayoutTemplate className="w-6 h-6" />
              Browse Templates
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6A00]/20 to-[#FFB347]/20 rounded-[28px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-[#7A7A7A]" />
              <input
                type="text"
                placeholder="Search campaigns, products, assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-20 pl-20 pr-8 rounded-[28px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[20px] text-white text-xl placeholder:text-[#7A7A7A] focus:outline-none focus:border-[#FF6A00]/50 focus:shadow-[0_0_40px_rgba(255,106,0,0.2)] transition-all duration-300"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Main Content - Left 2/3 */}
          <div className="xl:col-span-2 space-y-12">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-white">Quick Actions</h3>
                <p className="text-lg text-[#7A7A7A]">Choose how to start creating</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    onClick={action.action}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    whileHover={{ y: -12, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative p-8 rounded-[28px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[16px] hover:border-[rgba(255,106,0,0.5)] transition-all duration-500 overflow-hidden"
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 shadow-[inset_0_0_60px_rgba(255,106,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10 flex flex-col items-start space-y-6">
                      <div className={`w-20 h-20 rounded-[24px] bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-xl ${action.glow} group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-left space-y-2">
                        <h4 className="text-2xl font-bold text-white">{action.label}</h4>
                        <p className="text-base text-[#B7B7B7]">{action.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Campaign Workflow */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-white">Campaign Workflow</h3>
                <p className="text-lg text-[#7A7A7A]">From idea to publish in minutes</p>
              </div>

              <div className="relative p-10 rounded-[28px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[20px]">
                <div className="relative flex items-center justify-between gap-3 overflow-x-auto pb-4">
                  {workflowSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 + idx * 0.1 }}
                        className="flex flex-col items-center gap-3 flex-shrink-0"
                      >
                        <div className={`
                          relative w-16 h-16 rounded-[20px] backdrop-blur-[20px] border flex items-center justify-center transition-all duration-500
                          ${step.status === 'done' ? 'bg-gradient-to-br from-[#FF6A00] to-[#FFB347] border-transparent shadow-[0_0_30px_rgba(255,106,0,0.4)]' : 
                            step.status === 'active' ? 'bg-[rgba(255,106,0,0.2)] border-[#FF6A00]/50 shadow-[0_0_20px_rgba(255,106,0,0.3)] animate-pulse' : 
                            'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)]'}
                        `}>
                          <step.icon className={`w-7 h-7 ${step.status === 'done' ? 'text-white' : step.status === 'active' ? 'text-[#FF6A00]' : 'text-[#7A7A7A]'}`} />
                          
                          {step.status === 'done' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-[#FF6A00]" />
                            </motion.div>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-[#B7B7B7]">{step.label}</span>
                      </motion.div>
                      
                      {idx < workflowSteps.length - 1 && (
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ delay: 1.1 + idx * 0.1 }}
                          className="w-8 h-1.5 bg-gradient-to-r from-[#FF6A00] to-[#FFB347] rounded-full flex-shrink-0"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Campaigns */}
            {hasCampaigns ? (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-white">Recent Campaigns</h3>
                    <p className="text-lg text-[#7A7A7A]">Your latest creations</p>
                  </div>
                  <motion.button
                    onClick={() => router.push('/create')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-[20px] bg-gradient-to-r from-[#FF6A00] to-[#FFB347] text-white font-bold text-lg shadow-xl shadow-[#FF6A00]/30 flex items-center gap-3"
                  >
                    <Plus className="w-5 h-5" />
                    New Campaign
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projects.slice(0, 4).map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + idx * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative p-8 rounded-[28px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[16px] hover:border-[#FF6A00]/50 transition-all duration-500 cursor-pointer overflow-hidden"
                      onClick={() => router.push('/create')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10 space-y-6">
                        <div className="w-full h-40 rounded-[20px] bg-gradient-to-br from-[#FF6A00]/20 to-[#FFB347]/10 flex items-center justify-center group-hover:shadow-[0_0_40px_rgba(255,106,0,0.2)] transition-all duration-500">
                          <Sparkles className="w-16 h-16 text-[#FF6A00]/60" />
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-2xl font-bold text-white truncate">{project.name}</h4>
                          <div className="flex items-center gap-3 text-[#7A7A7A]">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[#FF6A00] font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          Open Campaign 
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Beautiful Empty State */
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6A00]/10 via-transparent to-[#FFB347]/10 rounded-[28px] blur-xl" />
                <div className="relative p-16 rounded-[28px] bg-[rgba(255,255,255,0.04)] border border-[#FF6A00]/20 backdrop-blur-[20px]">
                  <div className="max-w-4xl mx-auto text-center space-y-10">
                    <div className="space-y-6">
                      <div className="w-32 h-32 mx-auto rounded-[32px] bg-gradient-to-br from-[#FF6A00] to-[#FFB347] flex items-center justify-center shadow-2xl shadow-[#FF6A00]/40">
                        <Sparkles className="w-16 h-16 text-white" />
                      </div>
                      <h3 className="text-6xl font-bold text-white">
                        Start Your First Campaign
                      </h3>
                      <p className="text-2xl text-[#B7B7B7] leading-relaxed max-w-2xl mx-auto">
                        Import any Amazon or Shopify product and Supernova will generate a complete marketing campaign in minutes
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                      {[
                        'Analyze product',
                        'Generate strategy',
                        'Create assets'
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.3 + idx * 0.1 }}
                          className="flex items-center gap-4 p-6 rounded-[20px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FFB347] flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-lg text-white font-semibold">{item}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      onClick={() => router.push('/create')}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 80px rgba(255, 106, 0, 0.6)' }}
                      whileTap={{ scale: 0.95 }}
                      className="group px-16 py-7 rounded-[28px] bg-gradient-to-r from-[#FF6A00] to-[#FFB347] text-white font-bold text-2xl shadow-2xl shadow-[#FF6A00]/40 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative flex items-center gap-4">
                        <Sparkles className="w-7 h-7" />
                        Create Campaign
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-8">
            {/* AI Agent Panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A00]/10 to-transparent rounded-[28px] blur-xl" />
              
              <div className="relative p-8 rounded-[28px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[20px] space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#FF6A00] to-[#FFB347] flex items-center justify-center">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Supernova Agent</h3>
                    <p className="text-sm text-[#7A7A7A]">AI Marketing Intelligence</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#7A7A7A] mb-4">
                    <Activity className="w-4 h-4" />
                    <span>Live Activity</span>
                  </div>
                  
                  {agentActivities.map((activity, idx) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + idx * 0.15 }}
                      className="flex items-center gap-4 p-4 rounded-[16px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]"
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${activity.completed ? 'bg-gradient-to-br from-[#FF6A00] to-[#FFB347]' : 'bg-[rgba(255,106,0,0.2)]'}
                      `}>
                        {activity.completed ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="w-4 h-4 text-[#FF6A00]" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${activity.completed ? 'text-white' : 'text-[#B7B7B7]'}`}>
                          {activity.text}
                        </p>
                        <p className="text-xs text-[#7A7A7A]">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-[28px] blur-xl" />
              
              <div className="relative p-8 rounded-[28px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[20px] space-y-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-[#FF6A00]" />
                  <h3 className="text-xl font-bold text-white">Performance</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-[16px] bg-[rgba(255,255,255,0.02)]">
                    <span className="text-[#B7B7B7]">Campaigns</span>
                    <span className="text-2xl font-bold text-white">{projects.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-[16px] bg-[rgba(255,255,255,0.02)]">
                    <span className="text-[#B7B7B7]">Assets Generated</span>
                    <span className="text-2xl font-bold text-white">{projects.length * 3}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-[16px] bg-[rgba(255,255,255,0.02)]">
                    <span className="text-[#B7B7B7]">Videos Created</span>
                    <span className="text-2xl font-bold text-white">{projects.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Uptime', value: '99.9%', icon: Cloud },
                { label: 'Speed', value: '2x', icon: Zap },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-[20px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[16px] space-y-3"
                >
                  <stat.icon className="w-6 h-6 text-[#FF6A00]" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-[#7A7A7A]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="h-20" />
      </div>
    </div>
  );
}
