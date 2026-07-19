'use client';

import { useEffect, useState, useCallback, useRef, memo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { AccessibilityPanel, useAccessibility, useApplyAccessibility } from '@/components/ui/accessibility-panel';
import { useCursorVisibility } from '@/components/ui/cursor';
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
  Check,
  X,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIModelsSection, ExternalServicesSection } from '@/components/ui/IntegrationsPanel';

// Storage keys
const STORAGE_KEYS = {
  CURSOR_ENABLED: 'supernova_cursor_enabled',
  NOTIFICATIONS: 'supernova_notifications',
  PUSH_NOTIFICATIONS: 'supernova_push_notifications',
  AUTO_SAVE: 'supernova_auto_save',
} as const;

interface SettingCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  delay?: number;
}

const SettingCard = memo(function SettingCard({ icon: Icon, title, description, badge, badgeColor, onClick, delay = 0 }: SettingCardProps) {
  return (
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={onClick ? { scale: 1.01, x: 4 } : {}}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full p-5 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden"
      style={{
        background: 'rgba(17, 17, 17, 0.6)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 218, 185, 0.08)',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#5C3317]/10 to-transparent" />
      
      <div className="relative z-10 flex items-start gap-4">
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
        
        {onClick && (
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center"
          >
            <ChevronRight className="w-5 h-5 text-[rgba(255,255,255,0.3)] group-hover:text-[#FFDAB9] transition-colors" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
});

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

const ToggleSwitch = memo(function ToggleSwitch({ enabled, onChange, label }: ToggleSwitchProps) {
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3"
    >
      <div
        className={cn(
          'relative w-12 h-7 rounded-full transition-colors duration-300',
          enabled ? 'bg-gradient-to-r from-[#5C3317] to-[#8B5A2B] shadow-[0_0_15px_rgba(92,51,23,0.4)]' : 'bg-[rgba(255,255,255,0.1)]'
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
});

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[100]"
    >
      <div className={cn(
        'flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl',
        type === 'success' 
          ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' 
          : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
      )}>
        {type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
        <span className="font-medium">{message}</span>
      </div>
    </motion.div>
  );
}

// Delete Confirmation Dialog
function DeleteDialog({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md"
          >
            <div 
              className="p-6 rounded-2xl"
              style={{ 
                background: '#111111', 
                border: '1px solid rgba(239, 68, 68, 0.2)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#EF4444]/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-[#EF4444]" />
                </div>
                <h3 className="text-xl font-bold text-white">Are you sure?</h3>
              </div>
              <p className="text-[rgba(255,255,255,0.6)] mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-sm"
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors"
                >
                  Delete Account
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [showAccessibility, setShowAccessibility] = useState(false);
  const { settings, updateSettings } = useAccessibility();
  useApplyAccessibility(settings);
  const { mode, setCursorMode } = useCursorMode();
  const { isEnabled: cursorEnabled, toggleCursor } = useCursorVisibility();
  
  // Settings state - loaded from localStorage
  const [notifications, setNotifications] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) !== 'false';
  });
  
  const [pushNotifications, setPushNotifications] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEYS.PUSH_NOTIFICATIONS) !== 'false';
  });
  
  const [autoSave, setAutoSave] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEYS.AUTO_SAVE) !== 'false';
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Track initial state for change detection
  const initialStateRef = useRef({ notifications, pushNotifications, autoSave, cursorEnabled, settings });

  // Check for changes
  useEffect(() => {
    const changed = 
      notifications !== initialStateRef.current.notifications ||
      pushNotifications !== initialStateRef.current.pushNotifications ||
      autoSave !== initialStateRef.current.autoSave ||
      cursorEnabled !== initialStateRef.current.cursorEnabled;
    setHasChanges(changed);
  }, [notifications, pushNotifications, autoSave, cursorEnabled]);

  // Auth protection
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth');
    }
  }, [isLoggedIn, isLoading, router]);

  // Save all settings
  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, String(notifications));
    localStorage.setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS, String(pushNotifications));
    localStorage.setItem(STORAGE_KEYS.AUTO_SAVE, String(autoSave));
    localStorage.setItem(STORAGE_KEYS.CURSOR_ENABLED, String(cursorEnabled));
    
    // Apply cursor setting
    if (!cursorEnabled) {
      document.body.style.cursor = 'auto';
    }
    
    initialStateRef.current = { notifications, pushNotifications, autoSave, cursorEnabled, settings };
    setHasChanges(false);
    setToastMessage('Preferences saved successfully.');
    setToastType('success');
    setShowToast(true);
  }, [notifications, pushNotifications, autoSave, cursorEnabled, settings]);

  // Delete account
  const handleDeleteAccount = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('supernova_is_logged_in');
    localStorage.removeItem('supernova_current_user');
    localStorage.removeItem('supernova_users');
    logout();
    router.push('/auth');
  }, [logout, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] opacity-50 blur-sm animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <>
      
      <div className="min-h-screen relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#5C3317]/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
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
                  badge={notifications || pushNotifications ? "Enabled" : "Disabled"}
                  badgeColor={notifications || pushNotifications ? "#22C55E" : undefined}
                  delay={0.15}
                />
              </div>
            </section>

            {/* Appearance Section */}
            <section>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(255,218,185,0.1)] flex items-center justify-center">
                  <Palette className="w-4 h-4 text-[#FFDAB9]" />
                </div>
                <h2 className="text-lg font-semibold text-white uppercase tracking-wider">
                  Appearance
                </h2>
              </motion.div>
              
              <div className="space-y-3">
                <SettingCard 
                  icon={Moon} 
                  title="Dark Mode" 
                  description="Always dark for optimal viewing"
                  badge="Active"
                  badgeColor="#22C55E"
                  delay={0.15}
                />
                <SettingCard 
                  icon={MousePointer2} 
                  title="Custom Cursor" 
                  description="Enable animated custom cursor"
                  badge={cursorEnabled ? "Enabled" : "Disabled"}
                  badgeColor={cursorEnabled ? "#22C55E" : undefined}
                  onClick={toggleCursor}
                  delay={0.2}
                />
                
                {/* Brand Colors */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'rgba(17, 17, 17, 0.6)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 218, 185, 0.08)',
                  }}
                >
                  <p className="text-sm font-semibold text-white mb-3">Supernova Signature Theme</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className="p-4 rounded-xl flex flex-col items-center justify-center gap-2"
                      style={{ background: 'rgba(92, 51, 23, 0.3)' }}
                    >
                      <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: '#5C3317' }} />
                      <span className="text-xs text-white font-medium">Maroon</span>
                      <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-mono">#5C3317</span>
                    </div>
                    <div 
                      className="p-4 rounded-xl flex flex-col items-center justify-center gap-2"
                      style={{ background: 'rgba(255, 218, 185, 0.2)' }}
                    >
                      <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: '#FFDAB9' }} />
                      <span className="text-xs text-white font-medium">Peach Puff</span>
                      <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-mono">#FFDAB9</span>
                    </div>
                  </div>
                </motion.div>
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
            <section className="space-y-8">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(255,218,185,0.1)] flex items-center justify-center">
                  <Key className="w-4 h-4 text-[#FFDAB9]" />
                </div>
                <h2 className="text-lg font-semibold text-white uppercase tracking-wider">
                  Integrations
                </h2>
              </motion.div>
              
              {/* AI Models Section */}
              <AIModelsSection />
              
              {/* External Services Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(92,51,23,0.3)' }}>
                    <Cloud className="w-4 h-4 text-[#FFDAB9]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">External Services</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.5)]">Connected external platforms and APIs</p>
                  </div>
                </div>
                <ExternalServicesSection />
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
                    onClick={() => setShowDeleteDialog(true)}
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
                whileHover={hasChanges ? { scale: 1.02, y: -2 } : {}}
                whileTap={hasChanges ? { scale: 0.98 } : {}}
                onClick={handleSave}
                disabled={!hasChanges}
                className={cn(
                  'w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300',
                  hasChanges 
                    ? 'cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                )}
                style={{
                  background: hasChanges 
                    ? 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)' 
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: hasChanges 
                    ? '0 0 40px rgba(92, 51, 23, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)' 
                    : 'none',
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

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <Toast 
            message={toastMessage} 
            type={toastType} 
            onClose={() => setShowToast(false)} 
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}
