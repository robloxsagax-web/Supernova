'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { 
  VideoRatio, 
  VideoDuration, 
  BrandPaletteId,
  BRAND_PALETTES
} from '@/types/product';

type GenerationType = 'ad' | 'b-roll';

const generationTypes: { type: GenerationType; label: string; subtext: string; icon: string }[] = [
  {
    type: 'ad',
    label: '🚀 High-Conversion Ad',
    subtext: 'Aggressive problem-solving sales hooks, optimized for paid social.',
    icon: '🚀'
  },
  {
    type: 'b-roll',
    label: '🎬 Organic B-Roll',
    subtext: 'Aesthetic storytelling and educational narratives, optimized for viral Reels/Shorts.',
    icon: '🎬'
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
      // Save video settings with brand palette
      setVideoSettings({ ratio, duration, captionStyle: 'feature_badge', brandPalette });
      // Save generation type to store
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate AI Video Ad</CardTitle>
        <CardDescription>
          Paste a product URL from Amazon or Shopify to generate a video ad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Generation Type Selector - Premium Segment Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Content Style</label>
            <div className="relative">
              {/* Sliding background */}
              <div 
                className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20 transition-all duration-300 ease-out"
                style={{
                  width: '50%',
                  left: generationType === 'ad' ? '0%' : '50%',
                }}
              />
              <div className="relative grid grid-cols-2 gap-1 p-1 bg-muted/50 rounded-xl">
                {generationTypes.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setGenerationType(item.type)}
                    className={`relative z-10 px-4 py-3 rounded-lg transition-all duration-300 ${
                      generationType === item.type
                        ? 'bg-background shadow-sm'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-center space-y-1">
                      <p className={`text-sm font-semibold transition-colors ${
                        generationType === item.type ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {item.icon} {item.label.split(' ').slice(1).join(' ')}
                      </p>
                      <p className={`text-[10px] leading-tight transition-colors ${
                        generationType === item.type ? 'text-foreground/80' : 'text-muted-foreground/70'
                      }`}>
                        {item.subtext}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* URL Input */}
          <Input
            type="url"
            placeholder="https://www.amazon.com/product-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full"
          />
          
          {/* Video Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ratio */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Video Ratio</label>
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value as VideoRatio)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="16:9">16:9 (Horizontal)</option>
                <option value="9:16">9:16 (Vertical)</option>
              </select>
            </div>
            
            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) as VideoDuration)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
              </select>
            </div>
          </div>

          {/* Brand Palette */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Identity Color Palette</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(BRAND_PALETTES) as BrandPaletteId[]).map((paletteId) => {
                const palette = BRAND_PALETTES[paletteId];
                const isSelected = brandPalette === paletteId;
                return (
                  <button
                    key={paletteId}
                    type="button"
                    onClick={() => setBrandPalette(paletteId)}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? 'border-primary shadow-md scale-[1.02]' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {/* Color swatches */}
                    <div className="flex gap-1 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: palette.secondary }}
                      />
                    </div>
                    <p className="text-xs font-medium text-center leading-tight">
                      {palette.name}
                    </p>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-primary-foreground">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="w-full mt-2">
            {selectedType?.type === 'b-roll' ? 'Generate B-Roll Video' : 'Generate Video Ad'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground text-center">
          {selectedType?.icon} {ratio === '9:16' ? '📱' : '🖥️'} {ratio} • {duration}s • {selectedBrand.name}
        </p>
      </CardFooter>
    </Card>
  );
} 