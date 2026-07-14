'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  TrendingUp,
  Image,
  Video,
  Folder,
  Plus,
  Search,
  Bell,
  Zap,
  ArrowRight,
  Download,
  Share2,
  Trash2,
  Sparkles,
  Activity,
  Database,
  FileText,
  Clock,
  Edit3,
  Copy
} from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function DashboardPage() {
  const router = useRouter();
  const [timeOfDay, setTimeOfDay] = useState('Morning');
  
  // Get data directly from Zustand store ONLY - no Supabase, no fallbacks
  const projects = useStore((state) => state.projects);
  const assets = useStore((state) => state.assets);
  const activities = useStore((state) => state.activities);
  const deleteProject = useStore((state) => state.deleteProject);
  const deleteAsset = useStore((state) => state.deleteAsset);
  
  // Calculate counts from REAL data only
  const campaignsCount = projects.length;
  const videosCount = assets.filter((a) => a.type === 'video').length;
  const imagesCount = assets.filter((a) => a.type === 'image').length;
  const storageUsed = assets.reduce((total, asset) => total + asset.size, 0);
  const recentProjects = projects.slice(0, 6);
  const recentAssets = assets.slice(0, 12);
  const recentActivities = activities.slice(0, 10);
  
  // Empty state when NO real data
  const isEmpty = campaignsCount === 0 && videosCount === 0 && imagesCount === 0;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 18) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  const getActivityIcon = (type: string) => {
    if (type.includes('video')) return <Video className="w-4 h-4 text-white" />;
    if (type.includes('image')) return <Image className="w-4 h-4 text-white" />;
    if (type.includes('script')) return <FileText className="w-4 h-4 text-white" />;
    if (type.includes('campaign')) return <Zap className="w-4 h-4 text-white" />;
    if (type.includes('deleted')) return <Trash2 className="w-4 h-4 text-white" />;
    if (type.includes('renamed')) return <Edit3 className="w-4 h-4 text-white" />;
    return <Sparkles className="w-4 h-4 text-white" />;
  };

  const getActivityGradient = (type: string) => {
    if (type.includes('video')) return 'from-blue-500 to-cyan-500';
    if (type.includes('image')) return 'from-purple-500 to-pink-500';
    if (type.includes('script')) return 'from-emerald-500 to-teal-500';
    if (type.includes('campaign')) return 'from-primary to-accent';
    if (type.includes('deleted')) return 'from-red-500 to-rose-500';
    if (type.includes('renamed')) return 'from-orange-500 to-yellow-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090B]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-3xl translate-x-1/2"
        />
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-start justify-between"
        >
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-red-800 to-accent bg-clip-text text-transparent">
              Good {timeOfDay},
            </h1>
            <h2 className="text-4xl font-bold text-foreground">
              Welcome back to Supernova
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Your AI Marketing Agent - Create campaigns, generate creatives, and manage your marketing assets.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 rounded-xl glass hover:bg-white/10 transition-all"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/create')}
              className="px-6 py-2.5 rounded-xl gradient-primary text-background font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Campaign
            </motion.button>
          </div>
        </motion.div>

        {/* Empty State - ONLY shown when truly no data */}
        {isEmpty ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-24 px-8 rounded-3xl glass border border-border"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
              No campaigns yet
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Create your first AI marketing campaign to begin building your creative library.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/create')}
              className="px-8 py-4 rounded-2xl gradient-primary text-background font-bold text-lg flex items-center gap-3 shadow-lg"
            >
              <Sparkles className="w-6 h-6" />
              Create Your First Campaign
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* KPI Cards - ONLY showing REAL data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-8 rounded-3xl glass border border-border hover:border-peach/50 transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg">
                    <LayoutDashboard className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-foreground mb-2">{campaignsCount}</div>
                  <div className="text-sm text-muted-foreground">Campaigns</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-8 rounded-3xl glass border border-border hover:border-peach/50 transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
                    <Video className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-foreground mb-2">{videosCount}</div>
                  <div className="text-sm text-muted-foreground">Videos Generated</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-8 rounded-3xl glass border border-border hover:border-peach/50 transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
                    <Image className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-foreground mb-2">{imagesCount}</div>
                  <div className="text-sm text-muted-foreground">Images Created</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-8 rounded-3xl glass border border-border hover:border-peach/50 transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-foreground mb-2">{formatBytes(storageUsed)}</div>
                  <div className="text-sm text-muted-foreground">Storage Used</div>
                </div>
              </motion.div>
            </div>

            {/* Recent Projects - ONLY showing real projects */}
            {recentProjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">Recent Projects</h3>
                  <button 
                    onClick={() => router.push('/projects')}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-2"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentProjects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="p-6 rounded-3xl glass border border-border hover:border-peach/50 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-full">
                          <h4 className="font-bold text-foreground mb-1 truncate">{project.name}</h4>
                          <div className="text-xs text-muted-foreground">
                            {project.product?.company_name || 'No product linked'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">{formatTimeAgo(project.updatedAt)}</div>
                        <button 
                          onClick={() => router.push('/create')}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-foreground transition-all flex items-center gap-2"
                        >
                          Open <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Assets - ONLY showing real assets */}
            {recentAssets.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">Recent Assets</h3>
                  <button 
                    onClick={() => router.push('/assets')}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-2"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recentAssets.map((asset, idx) => (
                    <motion.div
                      key={asset.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + idx * 0.05 }}
                      whileHover={{ y: -8, scale: 1.05 }}
                      className="group relative aspect-square rounded-2xl overflow-hidden glass border border-border hover:border-peach/50 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {asset.type === 'video' && <Video className="w-12 h-12 text-primary/50" />}
                        {asset.type === 'image' && <Image className="w-12 h-12 text-primary/50" />}
                        {asset.type === 'script' && <FileText className="w-12 h-12 text-primary/50" />}
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                          title="Download"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteAsset(asset.id)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </motion.button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
                        <div className="text-[10px] text-white/80 truncate">{asset.name}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="p-8 rounded-3xl glass border border-border"
              >
                <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Create Campaign', icon: Plus, gradient: 'from-primary to-accent', action: () => router.push('/create') },
                    { label: 'Video Ad', icon: Video, gradient: 'from-blue-500 to-cyan-500', action: () => router.push('/create') },
                    { label: 'Image Ad', icon: Image, gradient: 'from-purple-500 to-pink-500', action: () => router.push('/create') },
                    { label: 'View Assets', icon: Folder, gradient: 'from-emerald-500 to-teal-500', action: () => router.push('/assets') },
                  ].map((action, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.action}
                      className="p-6 rounded-2xl glass border border-border hover:border-peach/50 transition-all duration-300 flex flex-col items-center gap-3 group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Activity Feed - ONLY showing real activities */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="p-8 rounded-3xl glass border border-border"
              >
                <h3 className="text-xl font-bold text-foreground mb-6">Activity Feed</h3>
                {recentActivities.length > 0 ? (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {recentActivities.map((activity, idx) => (
                      <motion.div 
                        key={activity.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 + idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getActivityGradient(activity.type)} flex items-center justify-center flex-shrink-0`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-foreground truncate">{activity.description}</div>
                          <div className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">No activity yet</p>
                    <p className="text-xs text-muted-foreground/70">Start creating to see activity here</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Storage Card - ONLY showing real storage */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="p-8 rounded-3xl glass border border-border relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Database className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">Supabase</div>
                      <div className="flex items-center gap-2 text-xs text-blue-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Connected
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{formatBytes(storageUsed)}</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Storage Used</span>
                    <span className="text-sm font-medium text-foreground">{formatBytes(storageUsed)} / 5 GB</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((storageUsed / (5 * 1024 * 1024 * 1024)) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
