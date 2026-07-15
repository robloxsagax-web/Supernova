'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Accessibility, 
  Sun, 
  Moon, 
  Type, 
  Gauge, 
  Eye, 
  Sparkles,
  X,
  Check
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

export function AccessibilityPanel({ isOpen, onClose, onSettingsChange }: AccessibilityPanelProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      onSettingsChange(parsed);
    }
  }, [onSettingsChange]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    onSettingsChange(newSettings);
  };

  const fontSizeLabels = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    'extra-large': 'Extra Large',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
            className="fixed right-0 top-0 h-screen w-full max-w-md glass-panel z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] flex items-center justify-center">
                    <Accessibility className="w-6 h-6 text-[#FFDAB9]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Accessibility</h2>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Customize your experience</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg glass-button flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* High Contrast Mode */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(92,51,23,0.3)] flex items-center justify-center">
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
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(92,51,23,0.3)] flex items-center justify-center">
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
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        settings.fontSize === size
                          ? 'bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] text-[#FFDAB9] shadow-lg'
                          : 'glass-button text-white hover:bg-white/10'
                      )}
                    >
                      {fontSizeLabels[size]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced Motion */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(92,51,23,0.3)] flex items-center justify-center">
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
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(92,51,23,0.3)] flex items-center justify-center">
                    <Eye className="w-5 h-5 text-[#FFDAB9]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Color Blind Mode</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.65)]">Optimize colors for better visibility</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'protanopia', label: 'Protanopia' },
                    { value: 'deuteranopia', label: 'Deuteranopia' },
                    { value: 'tritanopia', label: 'Tritanopia' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateSettings({ 
                        colorBlindMode: option.value as AccessibilitySettings['colorBlindMode'] 
                      })}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        settings.colorBlindMode === option.value
                          ? 'bg-gradient-to-br from-[#5C3317] to-[#8B5A2B] text-[#FFDAB9] shadow-lg'
                          : 'glass-button text-white hover:bg-white/10'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSettings(defaultSettings);
                  localStorage.removeItem('accessibility-settings');
                  onSettingsChange(defaultSettings);
                }}
                className="w-full py-3 rounded-xl glass-button text-white hover:bg-white/10 transition-all font-medium"
              >
                Reset to Defaults
              </button>

              {/* Brand Colors Preview */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="font-semibold text-white">Brand Colors</h3>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-16 rounded-lg bg-[#5C3317] flex items-center justify-center">
                      <span className="text-[#FFDAB9] text-xs font-medium">Maroon</span>
                    </div>
                    <p className="text-xs text-center text-[rgba(255,255,255,0.65)]">#5C3317</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-16 rounded-lg bg-[#FFDAB9] flex items-center justify-center">
                      <span className="text-[#5C3317] text-xs font-medium">Peach Puff</span>
                    </div>
                    <p className="text-xs text-center text-[rgba(255,255,255,0.65)]">#FFDAB9</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
        className={cn(
          'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
          enabled
            ? 'bg-gradient-to-r from-[#5C3317] to-[#8B5A2B]'
            : 'bg-white/10'
        )}
      >
        <motion.div
          className={cn(
            'inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg',
            enabled ? 'translate-x-7' : 'translate-x-1'
          )}
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
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
}

// Apply accessibility settings to document
export function useApplyAccessibility(settings: AccessibilitySettings) {
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px',
    };
    root.style.setProperty('--base-font-size', fontSizes[settings.fontSize]);

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
