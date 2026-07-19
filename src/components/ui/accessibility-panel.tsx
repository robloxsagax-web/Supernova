'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Accessibility, 
  Sun, 
  Type, 
  Gauge, 
  Eye, 
  Copy,
  Check,
  X
} from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'medium',
  reducedMotion: false,
  colorBlindMode: 'none',
};

// Toast notification component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[200] px-4 py-3 rounded-xl bg-[#111111] border border-[#22C55E]/30 shadow-lg flex items-center gap-2"
    >
      <Check className="w-4 h-4 text-[#22C55E]" />
      <span className="text-sm text-white">{message}</span>
    </motion.div>
  );
}

// Copy button component
function CopyButton({ text, onCopied }: { text: string; onCopied: (text: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied(text);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-1.5 rounded-lg transition-all duration-200',
        'hover:bg-white/10 active:scale-95',
        copied ? 'text-[#22C55E]' : 'text-[rgba(255,255,255,0.4)] hover:text-white'
      )}
      title="Copy hex code"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function AccessibilityPanel({ isOpen, onClose, onSettingsChange }: AccessibilityPanelProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('supernova-accessibility-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      onSettingsChange(parsed);
    }
  }, [onSettingsChange]);

  const updateSettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('supernova-accessibility-settings', JSON.stringify(newSettings));
    onSettingsChange(newSettings);
  }, [settings, onSettingsChange]);

  const handleResetDefaults = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.setItem('supernova-accessibility-settings', JSON.stringify(defaultSettings));
    onSettingsChange(defaultSettings);
    setToastMessage('Settings reset to defaults');
  }, [onSettingsChange]);

  const fontSizeLabels = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    'extra-large': 'XL',
  };

  const colorBlindModes = [
    { value: 'none', label: 'None' },
    { value: 'protanopia', label: 'Protanopia' },
    { value: 'deuteranopia', label: 'Deuteranopia' },
    { value: 'tritanopia', label: 'Tritanopia' },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* SVG Filters for Color Blindness */}
          <svg className="color-blind-filters" aria-hidden="true">
            <defs>
              <filter id="protanopia-filter">
                <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0"/>
              </filter>
              <filter id="deuteranopia-filter">
                <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0"/>
              </filter>
              <filter id="tritanopia-filter">
                <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0"/>
              </filter>
            </defs>
          </svg>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md z-50 overflow-y-auto"
            style={{
              background: 'rgba(17, 17, 17, 0.95)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(255, 218, 185, 0.08)',
            }}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                    boxShadow: '0 4px 15px rgba(92, 51, 23, 0.3)',
                  }}>
                    <Accessibility className="w-6 h-6 text-[#FFDAB9]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Accessibility</h2>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Customize your experience</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* High Contrast Mode */}
              <div className="space-y-3 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(92,51,23,0.3)' }}>
                    <Sun className="w-5 h-5 text-[#FFDAB9]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">High Contrast Mode</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Increase visibility with higher contrast</p>
                  </div>
                </div>
                <Toggle
                  enabled={settings.highContrast}
                  onChange={(enabled) => updateSettings({ highContrast: enabled })}
                  label={settings.highContrast ? 'Enabled' : 'Disabled'}
                />
              </div>

              {/* Font Size */}
              <div className="space-y-3 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(92,51,23,0.3)' }}>
                    <Type className="w-5 h-5 text-[#FFDAB9]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Font Size</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Adjust text size for better readability</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(fontSizeLabels) as Array<keyof typeof fontSizeLabels>).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSettings({ fontSize: size })}
                      className={cn(
                        'px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                        settings.fontSize === size
                          ? 'text-white shadow-lg'
                          : 'text-[rgba(255,255,255,0.7)] hover:bg-white/10'
                      )}
                      style={settings.fontSize === size ? {
                        background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                        boxShadow: '0 4px 15px rgba(92, 51, 23, 0.3)',
                      } : {}}
                    >
                      {fontSizeLabels[size]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced Motion */}
              <div className="space-y-3 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(92,51,23,0.3)' }}>
                    <Gauge className="w-5 h-5 text-[#FFDAB9]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Reduced Motion</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Minimize animations and transitions</p>
                  </div>
                </div>
                <Toggle
                  enabled={settings.reducedMotion}
                  onChange={(enabled) => updateSettings({ reducedMotion: enabled })}
                  label={settings.reducedMotion ? 'Enabled' : 'Disabled'}
                />
              </div>

              {/* Color Blind Mode */}
              <div className="space-y-3 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(92,51,23,0.3)' }}>
                    <Eye className="w-5 h-5 text-[#FFDAB9]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Color Blind Mode</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Optimize colors for better visibility</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {colorBlindModes.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateSettings({ colorBlindMode: option.value })}
                      className={cn(
                        'px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                        settings.colorBlindMode === option.value
                          ? 'text-white shadow-lg'
                          : 'text-[rgba(255,255,255,0.7)] hover:bg-white/10'
                      )}
                      style={settings.colorBlindMode === option.value ? {
                        background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                        boxShadow: '0 4px 15px rgba(92, 51, 23, 0.3)',
                      } : {}}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Colors */}
              <div className="space-y-3 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 className="font-semibold text-white">Brand Colors</h3>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="h-16 rounded-xl flex items-center justify-center relative group cursor-pointer"
                      style={{ background: '#5C3317' }}
                    >
                      <span className="text-[#FFDAB9] text-sm font-medium">Maroon</span>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text="#5C3317" onCopied={(text) => setToastMessage(`Copied ${text}`)} />
                      </div>
                    </motion.div>
                    <div className="flex items-center justify-center gap-1">
                      <code className="text-xs text-[rgba(255,255,255,0.65)]">#5C3317</code>
                      <CopyButton text="#5C3317" onCopied={(text) => setToastMessage(`Copied ${text}`)} />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="h-16 rounded-xl flex items-center justify-center relative group cursor-pointer"
                      style={{ background: '#FFDAB9' }}
                    >
                      <span className="text-[#5C3317] text-sm font-medium">Peach Puff</span>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text="#FFDAB9" onCopied={(text) => setToastMessage(`Copied ${text}`)} />
                      </div>
                    </motion.div>
                    <div className="flex items-center justify-center gap-1">
                      <code className="text-xs text-[rgba(255,255,255,0.65)]">#FFDAB9</code>
                      <CopyButton text="#FFDAB9" onCopied={(text) => setToastMessage(`Copied ${text}`)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleResetDefaults}
                className="w-full py-3 rounded-xl text-white hover:bg-white/10 transition-all font-medium"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Reset to Defaults
              </button>
            </div>
          </motion.div>

          {/* Toast */}
          <AnimatePresence>
            {toastMessage && (
              <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

// Toggle Component
interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(!enabled)}
        className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
        style={{
          background: enabled 
            ? 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)' 
            : 'rgba(255,255,255,0.1)',
          boxShadow: enabled ? '0 0 15px rgba(92, 51, 23, 0.4)' : 'none',
        }}
        aria-pressed={enabled}
      >
        <motion.div
          className="absolute inline-flex h-6 w-6 items-center justify-center rounded-full shadow-lg"
          style={{ background: '#FFFFFF', left: enabled ? 'calc(100% - 28px)' : '2px' }}
          animate={{ left: enabled ? 'calc(100% - 28px)' : '2px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {enabled && <Check className="w-4 h-4 text-[#5C3317]" />}
        </motion.div>
      </button>
      {label && <span className="text-sm text-[rgba(255,255,255,0.65)]">{label}</span>}
    </div>
  );
}

// Hook to use accessibility settings
export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('supernova-accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('supernova-accessibility-settings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
}

// Apply accessibility settings to document
export function useApplyAccessibility(settings: AccessibilitySettings) {
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size class
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-extra-large');
    root.classList.add(`font-size-${settings.fontSize}`);

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
      root.style.setProperty('--animation-duration', '0.01ms');
    } else {
      root.classList.remove('reduced-motion');
      root.style.setProperty('--animation-duration', 'normal');
    }

    // Color blind modes
    root.setAttribute('data-color-blind', settings.colorBlindMode);
  }, [settings]);
}
