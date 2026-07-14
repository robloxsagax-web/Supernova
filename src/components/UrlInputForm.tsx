'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { 
  VideoRatio, 
  VideoDuration, 
  BrandPaletteId,
  BRAND_PALETTES
} from '@/types/product';
import { Sparkles } from 'lucide-react';

type GenerationType = 'ad' | 'b-roll';

const generationTypes: { type: GenerationType; label: string; subtext: string; emoji: string }[] = [
  {
    type: 'ad',
    label: 'High-Conversion Ad',
    subtext: 'Aggressive problem-solving sales hooks, optimized for paid social.',
    emoji: '🚀'
  },
  {
    type: 'b-roll',
    label: 'Organic B-Roll',
    subtext: 'Aesthetic storytelling and educational narratives, optimized for viral.',
    emoji: '🎬'
  }
];

export function UrlInputForm() {
  const [url, setUrl] = useState('');
  const [generationType, setGenerationType] = useState<GenerationType>('ad');
  const [ratio, setRatio] = useState<VideoRatio>('16:9');
  const [duration, setDuration] = useState<VideoDuration>(30);
  const [brandPalette, setBrandPalette] = useState<BrandPaletteId>('noir-gold');
  const { setLoading, setError, setProduct, setStep, setVideoSettings, setGenerationType: setStoreGenerationType } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      setVideoSettings({ ratio, duration, captionStyle: 'feature_badge', brandPalette });
      setStoreGenerationType(generationType);

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape product data');
      }

      const product = await response.json();
      setProduct(product);
      setStep('product');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const selectedBrand = BRAND_PALETTES[brandPalette];
  const selectedType = generationTypes.find(t => t.type === generationType);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative p-8 rounded-3xl glass overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-maroon/10 via-transparent to-peach/10" />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-maroon/20 to-peach/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-peach/20 to-maroon/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 glow-maroon"
          >
            <Sparkles className="w-8 h-8 text-peach" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Generate AI Video Ad
          </h2>
          <p className="text-muted-foreground">
            Paste a product URL from Amazon or Shopify to generate a video ad
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Generation Type Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Content Style</label>
            <div className="relative">
              {/* Sliding background */}
              <motion.div
                initial={false}
                animate={{ x: generationType === 'ad' ? 0 : '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-br from-maroon/20 to-peach/20 rounded-xl border border-border"
                style={{ width: '50%' }}
              />
              <div className="relative grid grid-cols-2 gap-2 p-1.5">
                {generationTypes.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setGenerationType(item.type)}
                    className="relative z-10 px-4 py-4 rounded-lg transition-all duration-300"
                  >
                    <div className="text-center space-y-2">
                      <p className="text-2xl">{item.emoji}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        {item.subtext}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* URL Input */}
          <div className="relative group">
            <Input
              type="url"
              placeholder="https://www.amazon.com/product-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-peach/50 focus:bg-white/10 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-maroon/10 to-peach/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
          
          {/* Video Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ratio */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Video Ratio</label>
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value as VideoRatio)}
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-border text-foreground focus:outline-none focus:border-peach/50 transition-all duration-300"
              >
                <option value="16:9">16:9 (Horizontal)</option>
                <option value="9:16">9:16 (Vertical)</option>
              </select>
            </div>
            
            {/* Duration */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Duration</label>
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{ x: duration === 15 ? '0%' : duration === 30 ? '25%' : duration === 45 ? '50%' : '75%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute top-0 bottom-0 rounded-xl gradient-primary"
                  style={{ width: '25%' }}
                />
                <div className="relative grid grid-cols-4 gap-2 p-1.5">
                  {([15, 30, 45, 60] as VideoDuration[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className="px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Brand Palette */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Brand Identity Color Palette</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(BRAND_PALETTES) as BrandPaletteId[]).map((paletteId) => {
                const palette = BRAND_PALETTES[paletteId];
                const isSelected = brandPalette === paletteId;
                return (
                  <motion.button
                    key={paletteId}
                    type="button"
                    onClick={() => setBrandPalette(paletteId)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected 
                        ? 'border-peach shadow-lg glow-peach' 
                        : 'border-border hover:border-peach/50 glass-hover'
                    }`}
                  >
                    {/* Color swatches */}
                    <div className="flex gap-2 mb-3 justify-center">
                      <div 
                        className="w-6 h-6 rounded-full shadow-lg" 
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full shadow-lg" 
                        style={{ backgroundColor: palette.secondary }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-center text-foreground">
                      {palette.name}
                    </p>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-primary flex items-center justify-center shadow-lg"
                      >
                        <span className="text-[10px] text-background font-bold">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl gradient-primary text-base font-semibold text-background hover:opacity-90 transition-all duration-300 shadow-lg glow-maroon"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {selectedType?.type === 'b-roll' ? 'Generate B-Roll Video' : 'Generate Video Ad'}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {selectedType?.emoji} {ratio === '9:16' ? '📱' : '🖥️'} {ratio} • {duration}s • {selectedBrand.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
} 