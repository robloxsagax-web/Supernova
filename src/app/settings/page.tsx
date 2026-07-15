'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { AccessibilityPanel, useAccessibility, useApplyAccessibility } from '@/components/ui/accessibility-panel';
import { CustomCursor, CursorTrail } from '@/components/ui/cursor';
import { useCursorMode } from '@/components/ui/cursor';
import { User, Bell, Shield, Palette, Cloud, Key, Accessibility, MousePointer2, Type, Sparkles, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [showAccessibility, setShowAccessibility] = useState(false);
  const { settings, updateSettings } = useAccessibility();
  useApplyAccessibility(settings);
  const { mode, setCursorMode } = useCursorMode();

  return (
    <>
      <CursorTrail />
      <CustomCursor mode={mode} />
      
      <div className="p-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
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
            { label: 'Storage', icon: Cloud, description: 'Cloud storage and backups' },
            { label: 'API Keys', icon: Key, description: 'Manage API credentials' },
          ].map((setting, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 4, scale: 1.01 }}
              className="p-6 rounded-2xl glass border border-border hover:border-peach/50 transition-all cursor-pointer flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center flex-shrink-0">
                <setting.icon className="w-6 h-6 text-[#FFDAB9]" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-foreground mb-1 group-hover:text-[#FFDAB9] transition-colors">{setting.label}</div>
                <div className="text-sm text-muted-foreground">{setting.description}</div>
              </div>
            </motion.div>
          ))}

          {/* Accessibility Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl glass border border-border hover:border-peach/50 transition-all cursor-pointer flex items-start gap-4 group"
            onClick={() => setShowAccessibility(true)}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center flex-shrink-0">
              <Accessibility className="w-6 h-6 text-[#FFDAB9]" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-foreground mb-1 group-hover:text-[#FFDAB9] transition-colors">Accessibility</div>
              <div className="text-sm text-muted-foreground">High contrast, font size, reduced motion, color blind modes</div>
              
              {/* Quick Settings */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Contrast</div>
                  <div className="text-sm font-semibold text-white">
                    {settings.highContrast ? 'High' : 'Normal'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Font Size</div>
                  <div className="text-sm font-semibold text-white capitalize">
                    {settings.fontSize}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Motion</div>
                  <div className="text-sm font-semibold text-white">
                    {settings.reducedMotion ? 'Reduced' : 'Full'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Custom Cursors Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="p-6 rounded-2xl glass border border-border hover:border-peach/50 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center flex-shrink-0">
                <MousePointer2 className="w-6 h-6 text-[#FFDAB9]" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-foreground mb-1">Custom Cursors</div>
                <div className="text-sm text-muted-foreground">Choose cursor styles for different modes</div>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { mode: 'default' as const, label: 'Default' },
                { mode: 'edit' as const, label: 'Edit' },
                { mode: 'pen' as const, label: 'Pen' },
                { mode: 'crosshair' as const, label: 'Crosshair' },
                { mode: 'grab' as const, label: 'Grab' },
                { mode: 'pointer' as const, label: 'Pointer' },
              ].map(({ mode: cursorMode, label }) => (
                <button
                  key={cursorMode}
                  onClick={() => setCursorMode(cursorMode)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    mode === cursorMode
                      ? 'bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] border border-[rgba(255,218,185,0.3)]'
                      : 'glass-button hover:bg-white/10'
                  }`}
                >
                  <MousePointer2 className="w-6 h-6 mx-auto mb-2 text-[#FFDAB9]" />
                  <div className="text-xs font-semibold text-white">{label}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Appearance Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl glass border border-border hover:border-peach/50 transition-all cursor-pointer flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center flex-shrink-0">
              <Palette className="w-6 h-6 text-[#FFDAB9]" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-foreground mb-1 group-hover:text-[#FFDAB9] transition-colors">Appearance</div>
              <div className="text-sm text-muted-foreground">Theme and display settings</div>
              
              {/* Brand Colors */}
              <div className="mt-4 flex gap-4">
                <div className="flex-1 p-4 rounded-lg bg-[#5C3317] flex items-center justify-center">
                  <span className="text-[#FFDAB9] font-bold text-sm">Maroon</span>
                </div>
                <div className="flex-1 p-4 rounded-lg bg-[#FFDAB9] flex items-center justify-center">
                  <span className="text-[#5C3317] font-bold text-sm">Peach Puff</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="pt-4">
            <Button
              onClick={() => setShowAccessibility(true)}
              className="w-full"
              size="lg"
            >
              Open Full Accessibility Panel
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Accessibility Panel Modal */}
      <AccessibilityPanel
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
        onSettingsChange={updateSettings}
      />
    </>
  );
}
