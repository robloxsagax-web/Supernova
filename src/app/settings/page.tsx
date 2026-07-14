'use client';

import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Cloud, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        {/* Settings Sections */}
        {[
          { label: 'Account', icon: User, description: 'Profile and account settings' },
          { label: 'Notifications', icon: Bell, description: 'Email and push notifications' },
          { label: 'Security', icon: Shield, description: 'Password and authentication' },
          { label: 'Appearance', icon: Palette, description: 'Theme and display settings' },
          { label: 'Storage', icon: Cloud, description: 'Cloud storage and backups' },
          { label: 'API Keys', icon: Key, description: 'Manage API credentials' },
        ].map((setting, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ x: 4 }}
            className="p-6 rounded-2xl glass border border-border hover:border-peach/50 transition-all cursor-pointer flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <setting.icon className="w-6 h-6 text-background" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-foreground mb-1">{setting.label}</div>
              <div className="text-sm text-muted-foreground">{setting.description}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
