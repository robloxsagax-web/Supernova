'use client';

import { motion } from 'framer-motion';
import { Image, Video, FileText, Download } from 'lucide-react';

export default function AssetsPage() {
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
            Assets
          </h1>
          <p className="text-muted-foreground">
            Browse and manage your generated media files
          </p>
        </div>

        {/* Asset Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Images', count: 142, icon: Image, color: 'from-pink-500 to-rose-500' },
            { label: 'Videos', count: 48, icon: Video, color: 'from-blue-500 to-indigo-500' },
            { label: 'Scripts', count: 89, icon: FileText, color: 'from-emerald-500 to-green-500' },
          ].map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-8 rounded-2xl glass border border-border hover:border-peach/50 transition-all cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">{category.count}</div>
              <div className="text-lg font-semibold text-foreground mb-1">{category.label}</div>
              <div className="text-sm text-muted-foreground">Click to browse</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Assets */}
        <div className="p-8 rounded-2xl glass border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Assets</h2>
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-border text-sm font-medium text-foreground hover:bg-white/10 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border hover:border-peach/50 transition-all cursor-pointer"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
