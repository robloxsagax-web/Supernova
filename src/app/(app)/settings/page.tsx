'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { AccessibilityPanel, useAccessibility, useApplyAccessibility } from '@/components/ui/accessibility-panel';
import { CustomCursor, CursorTrail, useCursorVisibility } from '@/components/ui/cursor';
import { useCursorMode } from '@/components/ui/cursor';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Cloud, 
  Key, 
  Accessibility, 
  MousePointer2, 
  Sparkles, 
  Settings2,
  Save,
  ChevronRight,
  Eye,
  Moon,
  Zap,
  AlertTriangle,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  delay?: number;
}

function SettingCard({ icon: Icon, title, description, badge, badgeColor, onClick, delay = 0 }: SettingCardProps) {
  return (
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full p-5 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden"
      style={{
        background: 'rgba(17, 17, 17, 0.6)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 218, 185, 0.08)',
      }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#5C3317]/10 to-transparent" />
      
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
            boxShadow: '0 4px 15px rgba(92, 51, 23, 0.3)',
          }}
        >
          <Icon className="w-6 h-6 text-[#FFDAB9]" />
        </motion.div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-white group-hover:text-[#FFDAB9] transition-colors">
              {title}
            </h3>
            {badge && (
              <span 
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase"
                style={{
                  background: badgeColor || 'rgba(255, 218, 185, 0.2)',
                  color: badgeColor ? '#09090B' : '#FFDAB9',
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-[rgba(255,255,255,0.5)]">{description}</p>
        </div>
        
        {/* Arrow */}
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center"
        >
          <ChevronRight className="w-5 h-5 text-[rgba(255,255,255,0.3)] group-hover:text-[#FFDAB9] transition-colors" />
        </motion.div>
      </div>
    </motion.button>
  );
}

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

function ToggleSwitch({ enabled, onChange, label }: ToggleSwitchProps) {
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3"
    >
      <div
        className={cn(
          'relative w-12 h-7 rounded-full transition-colors duration-300',
          enabled ? 'bg-gradient-to-r from-[#5C3317] to-[#8B5A2B]' : 'bg-[rgba(255,255,255,0.1)]'
        )}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
        />
      </div>
      {label && <span className="text-sm text-[rgba(255,255,255,0.7)]">{label}</span>}
    </motion.button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [showAccessibility, setShowAccessibility] = useState(false);
  const { settings, updateSettings } = useAccessibility();
  useApplyAccessibility(settings);
  const { mode, setCursorMode } = useCursorMode();
  const { isEnabled: cursorEnabled, toggleCursor } = useCursorVisibility();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [analytics, setAnalytics] = useState(false);

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
    <>
      <CursorTrail />
      <CustomCursor mode={mode} />
      
      <div className="min-h-screen relative">
        {/* Background ambient effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#5C3317]/10 rounded-full blur-[150px]" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full"
              style={{
                background: 'rgba(92, 51, 23, 0.15)',
                border: '1px solid rgba(255, 218, 185, 0.15)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Settings2 className="w-4 h-4 text-[#FFDAB9]" />
              <span className="text-xs font-medium text-[rgba(255,218,185,0.8)] uppercase tracking-wider">
                Preferences
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              <span className="text-white">Settings</span>
            </h1>
            <p className="text-lg text-[rgba(255,255,255,0.5)] max-w-xl">
              Manage your account, preferences, and customize your experience.
            </p>
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {/* General Section */}
            <section>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(255,218,185,0.1)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FFDAB9]" />
                </div>
                <h2 className="text-lg font-semibold text-white uppercase tracking-wider">
                  General
                </h2>
              </motion.div>
              
              <div className="space-y-3">
                <SettingCard 
                  icon={User} 
                  title="Account" 
                  description="Profile information and account settings" 
                  delay={0.1}
                />
                <SettingCard 
                  icon={Bell} 
                  title="Notifications" 
                  description="Email and push notification preferences"
                  badge="Enabled"
                  badgeColor="#22C55E"
                  delay={0.15}
                />
              </div>
            </section>

            {/* Appearance Section */}
            <section>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(255,218,185,0.1)] flex items-center justify-center">
                  <Palette className="w-4 h-4 text-[#FFDAB9]" />
                </div>
                <h2 className="text-lg font-semibold text-white uppercase tracking-wider">
                  Appearance
                </h2>
              </motion.div>
              
              <div 
                className="p-6 rounded-2xl space-y-6"
                style={{
                  background: 'rgba(17, 17, 17, 0.6)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 218, 185, 0.08)',
                }}
              >
                {/* Theme Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-[#FFDAB9]" />
                    <div>
                      <p className="text-sm font-medium text-white">Dark Mode</p>
                      <p className="text-xs text-[rgba(255,255,255,0.4)]">Always dark for optimal viewing</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                    Active
                  </span>
                </div>

                <div className="h-px bg-[rgba(255,255,255,0.06)]" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-[rgba(255,255,255,0.5)]" />
                    <div>
                      <p className="text-sm font-medium text-white">Auto-save</p>
                      <p className="text-xs text-[rgba(255,255,255,0.4)]">Automatically save your work</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={autoSave} onChange={setAutoSave} />
                </div>

                <div className="h-px bg-[rgba(255,255,255,0.06)]" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MousePointer2 className="w-5 h-5 text-[rgba(255,255,255,0.5)]" />
                    <div>
                      <p className="text-sm font-medium text-white">Custom Cursor</p>
                      <p className="text-xs text-[rgba(255,255,255,0.4)]">Enable animated custom cursor</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={cursorEnabled} onChange={toggleCursor} />
                </div>

                <div className="h-px bg-[rgba(255,255,255,0.06)]" />

                {/* Brand Colors Display */}
                <div>
                  <p className="text-sm font-medium text-white mb-3">Brand Colors</p>
                  <div className="flex gap-3">
                    <div 
                      className="flex-1 p-4 rounded-xl flex items-center justify-center"
                      style={{ background: '#5C3317' }}
                    >
                      <span className="text-[#FFDAB9] font-bold text-sm">Maroon</span>
                    </div>
                    <div 
                      className="flex-1 p-4 rounded-xl flex items-center justify-center"
                      style={{ background: '#FFDAB9' }}
                    >
                      <span className="text-[#5C3317] font-bold text-sm">Peach Puff</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Accessibility Section */}
            <section>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(255,218,185,0.1)] flex items-center justify-center">
                  <Accessibility className="w-4 h-4 text-[#FFDAB9]" />
                </div>
                <h2 className="text-lg font-semibold text-white uppercase tracking-wider">
                  Accessibility
                </h2>
              </motion.div>
              
              <div className="space-y-3">
                <SettingCard 
                  icon={Accessibility} 
                  title="Accessibility Settings" 
                  description="High contrast, font size, reduced motion, color blind modes"
                  onClick={() => setShowAccessibility(true)}
                  delay={0.3}
                />
                
                {/* Quick Settings Preview */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'rgba(17, 17, 17, 0.6)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 218, 185, 0.08)',
                  }}
                >
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-4">Current Settings</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-[10px] text-[rgba(255,255,255,0.4)] mb-1">Contrast</p>
                      <p className="text-sm font-semibold text-white">
                        {settings.highContrast ? 'High' : 'Normal'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-[10px] text-[rgba(255,255,255,0.4)] mb-1">Font Size</p>
                      <p className="text-sm font-semibold text-white capitalize">
                        {settings.fontSize}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-[10px] text-[rgba(255,255,255,0.4)] mb-1">Motion</p>
                      <p className="text-sm font-semibold text-white">
                        {settings.reducedMotion ? 'Reduced' : 'Full'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Integrations Section */}
            <section>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(255,218,185,0.1)] flex items-center justify-center">
                  <Key className="w-4 h-4 text-[#FFDAB9]" />
                </div>
                <h2 className="text-lg font-semibold text-white uppercase tracking-wider">
                  Integrations
                </h2>
              </motion.div>
              
              <div className="space-y-3">
                <SettingCard 
                  icon={Key} 
                  title="API Keys" 
                  description="Manage your API credentials for AI services"
                  delay={0.4}
                />
                <SettingCard 
                  icon={Cloud} 
                  title="Supabase" 
                  description="Database and authentication settings"
                  badge="Connected"
                  badgeColor="#22C55E"
                  delay={0.45}
                />
              </div>
            </section>

            {/* Danger Zone */}
            <section>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                </div>
                <h2 className="text-lg font-semibold text-[#EF4444] uppercase tracking-wider">
                  Danger Zone
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Delete Account</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.5)]">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] text-sm font-semibold hover:bg-[#EF4444]/30 transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </section>

            {/* Save Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-8"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                  boxShadow: '0 0 40px rgba(92, 51, 23, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Save className="w-5 h-5 text-[#FFDAB9]" />
                <span className="text-[#FFDAB9]">Save Changes</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
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
