'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Clock, Star } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your AI marketing campaigns.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Campaigns', value: '12', icon: LayoutDashboard, color: 'from-primary to-accent' },
            { label: 'Videos Generated', value: '48', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
            { label: 'Hours Saved', value: '24h', icon: Clock, color: 'from-purple-500 to-pink-500' },
            { label: 'Avg. Rating', value: '4.9', icon: Star, color: 'from-yellow-500 to-orange-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl glass border border-border hover:border-peach/50 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="p-8 rounded-2xl glass border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-border">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-lg">🎬</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">Campaign {i}</div>
                  <div className="text-sm text-muted-foreground">Video generated successfully</div>
                </div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
