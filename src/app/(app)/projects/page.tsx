'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Folder, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function ProjectsPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  // Auth protection
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth');
    }
  }, [isLoggedIn, isLoading, router]);

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

  // Don't Render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Projects
            </h1>
            <p className="text-muted-foreground">
              Organize and manage your marketing campaigns
            </p>
          </div>
          <button className="px-6 py-3 rounded-xl gradient-primary text-background font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-2xl glass border border-border hover:border-peach/50 transition-all cursor-pointer group"
            >
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                <Folder className="w-12 h-12 text-primary" />
              </div>
              <div className="font-semibold text-foreground mb-1">Project {i}</div>
              <div className="text-sm text-muted-foreground mb-2">5 videos • Last edited 2 days ago</div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                  Active
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
