'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { KPICard } from '@/components/ui/kpi-card';
import { 
  Sparkles,
  Video,
  Image as ImageIcon,
  FileText,
  Target,
  Layers,
  ArrowRight,
  Check,
  Bot,
  Activity,
  RefreshCw,
  Zap,
  TrendingUp,
  Cloud,
  Search,
  Bell,
  User,
  ChevronRight,
  Brain,
  Lightbulb,
  Palette,
  BarChart3,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      label: 'Video Ads', 
      icon: Video, 
      gradient: 'from-[#5C3317] to-[#FFDAB9]',
      description: 'AI-powered video creation',
      action: () => router.push('/create'),
    },
    { 
      label: 'Image Ads', 
      icon: ImageIcon, 
      gradient: 'from-[#8B5A2B] to-[#FFDAB9]',
      description: 'Generate stunning visuals',
      action: () => router.push('/create'),
    },
    { 
      label: 'Marketing Copy', 
      icon: FileText, 
      gradient: 'from-[#5C3317] to-[#8B5A2B]',
      description: 'AI copywriting assistant',
      action: () => router.push('/create'),
    },
    { 
      label: 'Strategy', 
      icon: Target, 
      gradient: 'from-[#FFDAB9] to-[#5C3317]',
      description: 'Campaign planning',
      action: () => router.push('/create'),
    },
  ];

  const creativeTools = [
    { label: 'Video Studio', icon: Video, color: '#5C3317' },
    { label: 'Image Studio', icon: ImageIcon, color: '#8B5A2B' },
    { label: 'Copy Assistant', icon: FileText, color: '#5C3317' },
    { label: 'Brand Kit', icon: Palette, color: '#FFDAB9' },
  ];

  const agentActivities = [
    { id: 1, text: 'Analyzing product', completed: true, time: '2s ago' },
    { id: 2, text: 'Understanding brand voice', completed: true, time: '5s ago' },
    { id: 3, text: 'Researching competitors', completed: true, time: '8s ago' },
    { id: 4, text: 'Creating campaign', completed: false, time: 'now' },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1600px] mx-auto space-y-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Hero Card */}
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5C3317]/20 via-transparent to-[#FFDAB9]/10" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#5C3317]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#FFDAB9]/20 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative p-12 backdrop-blur-xl rounded-3xl border border-[rgba(255,218,185,0.15)]">
              {/* Top Navigation */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#09090B]" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#22C55E] rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                      Good {timeOfDay}
                      <span className="inline-block ml-3">👋</span>
                    </h1>
                    <p className="text-lg text-[rgba(255,255,255,0.65)] mt-2">
                      Welcome to your AI Marketing Command Center
                    </p>
                  </div>
                </div>
                
                {/* Quick Search */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(255,255,255,0.45)]" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-80 pl-12 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.45)] focus:outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#5C3317]/20 transition-all"
                    />
                  </div>
                  <button className="p-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-all">
                    <Bell className="w-5 h-5 text-[rgba(255,255,255,0.65)]" />
                  </button>
                  <button className="p-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-all">
                    <User className="w-5 h-5 text-[rgba(255,255,255,0.65)]" />
                  </button>
                </div>
              </div>
              
              {/* Hero Text */}
              <div className="max-w-4xl">
                <h2 className="text-6xl md:text-7xl font-bold leading-tight">
                  <span className="gradient-text">Supernova</span>
                </h2>
                <p className="text-2xl text-[rgba(255,255,255,0.65)] mt-4 max-w-2xl leading-relaxed">
                  Your Autonomous AI Marketing Agent
                </p>
                <p className="text-lg text-[rgba(255,255,255,0.45)] mt-3 max-w-xl">
                  Generate complete marketing campaigns, AI videos, image ads, marketing copy, brand strategies, and creative assets from a single product URL.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex items-center gap-4 mt-10">
                <motion.button
                  onClick={() => router.push('/create')}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(92, 51, 23, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-[#5C3317] to-[#8B5A2B] text-[#FFDAB9] font-bold text-lg shadow-xl shadow-[#5C3317]/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    Create Campaign
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-5 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,218,185,0.2)] text-[#FFDAB9] font-medium text-lg hover:bg-[rgba(255,255,255,0.1)] transition-all"
                >
                  View Projects
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Campaigns Created"
              value={projects.length || 12}
              icon={Sparkles}
              trend={{ value: 24, isPositive: true }}
              delay={0.1}
            />
            <KPICard
              title="Videos Generated"
              value={projects.length * 2 || 28}
              icon={Video}
              trend={{ value: 18, isPositive: true }}
              delay={0.2}
            />
            <KPICard
              title="Images Created"
              value={projects.length * 4 || 64}
              icon={ImageIcon}
              trend={{ value: 32, isPositive: true }}
              delay={0.3}
            />
            <KPICard
              title="Total Assets"
              value={projects.length * 7 || 156}
              icon={Layers}
              trend={{ value: 12, isPositive: true }}
              delay={0.4}
            />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Command Center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SpotlightCard className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] flex items-center justify-center">
                    <Brain className="w-7 h-7 text-[#09090B]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Marketing Agent</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                      <span className="text-sm text-[rgba(255,255,255,0.65)]">Agent Online</span>
                    </div>
                  </div>
                </div>
                
                {/* URL Input */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Paste a product URL to start..."
                    className="w-full px-6 py-5 pl-14 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,218,185,0.15)] text-white placeholder:text-[rgba(255,255,255,0.45)] focus:outline-none focus:border-[#5C3317] focus:ring-2 focus:ring-[#5C3317]/20 transition-all text-lg"
                  />
                  <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFDAB9]" />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/create')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#5C3317] to-[#8B5A2B] text-[#FFDAB9] font-semibold shadow-lg"
                  >
                    Generate
                  </motion.button>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, idx) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.action}
                      className="group relative p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,218,185,0.1)] hover:border-[rgba(255,218,185,0.25)] transition-all text-center"
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <action.icon className="w-6 h-6 text-[#09090B]" />
                      </div>
                      <p className="text-sm font-medium text-white">{action.label}</p>
                      <p className="text-xs text-[rgba(255,255,255,0.45)] mt-1">{action.description}</p>
                    </motion.button>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Creative Workspace Hub */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white">Creative Workspace</h3>
                <p className="text-[rgba(255,255,255,0.65)] mt-1">Access all your marketing tools</p>
              </div>
              
              <BentoGrid>
                {/* Video Studio */}
                <BentoCard colSpan="double" delay={0.5}>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] flex items-center justify-center shadow-xl">
                      <Video className="w-10 h-10 text-[#09090B]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">Video Studio</h4>
                      <p className="text-sm text-[rgba(255,255,255,0.65)]">Create stunning AI-powered video ads with automated editing, transitions, and effects.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/create')}
                      className="p-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,218,185,0.2)] hover:bg-[rgba(255,255,255,0.1)] transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-[#FFDAB9]" />
                    </motion.button>
                  </div>
                </BentoCard>
                
                {/* Image Studio */}
                <BentoCard delay={0.55}>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#FFDAB9] flex items-center justify-center shadow-xl">
                      <ImageIcon className="w-8 h-8 text-[#09090B]" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Image Studio</h4>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Generate ad creatives</p>
                  </div>
                </BentoCard>
                
                {/* Campaign Strategy */}
                <BentoCard delay={0.6}>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center shadow-xl">
                      <Target className="w-8 h-8 text-[#FFDAB9]" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Strategy</h4>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Plan campaigns</p>
                  </div>
                </BentoCard>
                
                {/* Marketing Copy */}
                <BentoCard delay={0.65}>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FFDAB9] to-[#5C3317] flex items-center justify-center shadow-xl">
                      <FileText className="w-8 h-8 text-[#09090B]" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Copy</h4>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">AI copywriting</p>
                  </div>
                </BentoCard>
                
                {/* Competitor Analysis */}
                <BentoCard delay={0.7}>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#5C3317] flex items-center justify-center shadow-xl">
                      <Lightbulb className="w-8 h-8 text-[#FFDAB9]" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Research</h4>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Competitor intel</p>
                  </div>
                </BentoCard>
              </BentoGrid>
            </motion.div>
          </div>

          {/* Right Column - Agent Status & Activity */}
          <div className="space-y-8">
            
            {/* Agent Status Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <SpotlightCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[#09090B]" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#22C55E] rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Supernova Agent</h4>
                    <span className="text-xs text-[rgba(255,255,255,0.45)]">AI Marketing Intelligence</span>
                  </div>
                </div>
                
                {/* Status Grid */}
                <div className="space-y-3">
                  {[
                    { label: 'Research Engine', status: 'Online', icon: Brain, color: '#22C55E' },
                    { label: 'Vision Model', status: 'Qwen 2.5', icon: Zap, color: '#FFDAB9' },
                    { label: 'Campaign Planner', status: 'Ready', icon: Target, color: '#22C55E' },
                    { label: 'Storage', status: 'Connected', icon: Cloud, color: '#22C55E' },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + idx * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" style={{ color: item.color }} />
                        <span className="text-sm text-[rgba(255,255,255,0.65)]">{item.label}</span>
                      </div>
                      <span className="text-xs font-medium" style={{ color: item.color }}>{item.status}</span>
                    </motion.div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Live Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <SpotlightCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-[#FFDAB9]" />
                  <h4 className="text-lg font-bold text-white">Live Activity</h4>
                </div>
                
                <div className="space-y-3">
                  {agentActivities.map((activity, idx) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        activity.completed 
                          ? 'bg-gradient-to-br from-[#5C3317] to-[#FFDAB9]' 
                          : 'bg-[rgba(92,51,23,0.3)]'
                      )}>
                        {activity.completed ? (
                          <Check className="w-4 h-4 text-[#09090B]" />
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="w-4 h-4 text-[#FFDAB9]" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-medium truncate',
                          activity.completed ? 'text-white' : 'text-[rgba(255,255,255,0.65)]'
                        )}>
                          {activity.text}
                        </p>
                        <p className="text-xs text-[rgba(255,255,255,0.45)]">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Performance Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <SpotlightCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-[#FFDAB9]" />
                  <h4 className="text-lg font-bold text-white">Performance</h4>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'Uptime', value: '99.9%', color: '#22C55E' },
                    { label: 'Avg. Generation', value: '2.3s', color: '#FFDAB9' },
                    { label: 'Success Rate', value: '98.5%', color: '#22C55E' },
                  ].map((stat, idx) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
                    >
                      <span className="text-sm text-[rgba(255,255,255,0.65)]">{stat.label}</span>
                      <span className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
            >
              <SpotlightCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-[#FFDAB9]" />
                    <h4 className="text-lg font-bold text-white">Recent Campaigns</h4>
                  </div>
                  <button className="text-sm text-[#FFDAB9] hover:underline">View All</button>
                </div>
                
                <div className="space-y-3">
                  {['Nike Campaign', 'Apple AirPods', 'Samsung Galaxy'].map((project, idx) => (
                    <motion.div
                      key={project}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + idx * 0.05 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5C3317]/30 to-[#FFDAB9]/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#FFDAB9]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{project}</p>
                        <p className="text-xs text-[rgba(255,255,255,0.45)]">3 assets · 2 days ago</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.3)]" />
                    </motion.div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-12" />
      </div>
    </div>
  );
}
