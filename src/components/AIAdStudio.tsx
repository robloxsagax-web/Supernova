'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Sparkles, Download, Loader2, Image as ImageIcon } from 'lucide-react';

type AdStyle = 'bold' | 'luxury' | 'minimal' | 'vibrant' | 'elegant' | 'modern';
type ImageFormat = '1:1' | '9:16' | '4:5' | '16:9';

interface GeneratedImage {
  id: string;
  url: string;
  style: AdStyle;
  format: ImageFormat;
}

const AD_STYLES: { id: AdStyle; name: string; emoji: string }[] = [
  { id: 'bold', name: 'Bold', emoji: '🔥' },
  { id: 'luxury', name: 'Luxury', emoji: '✨' },
  { id: 'minimal', name: 'Minimal', emoji: '💎' },
  { id: 'vibrant', name: 'Vibrant', emoji: '🌈' },
  { id: 'elegant', name: 'Elegant', emoji: '🌸' },
  { id: 'modern', name: 'Modern', emoji: '🚀' },
];

const FORMATS: { id: ImageFormat; name: string; emoji: string; dimensions: string }[] = [
  { id: '1:1', name: '1:1', emoji: '📱', dimensions: '1080×1080' },
  { id: '9:16', name: '9:16', emoji: '🎬', dimensions: '1080×1920' },
  { id: '4:5', name: '4:5', emoji: '📲', dimensions: '1080×1350' },
  { id: '16:9', name: '16:9', emoji: '🖥️', dimensions: '1920×1080' },
];

const STYLE_PROMPTS: Record<AdStyle, string> = {
  bold: 'bold vibrant colors, dynamic composition, eye-catching design, neon accents, high impact commercial',
  luxury: 'luxury elegant design, gold accents, marble textures, sophisticated premium quality, Vogue magazine style',
  minimal: 'minimal clean design, white space, Scandinavian aesthetic, simple modern, Apple-inspired',
  vibrant: 'vibrant colorful, rainbow gradient, playful Gen-Z style, energetic pop art, Coachella vibes',
  elegant: 'elegant sophisticated, soft pastel colors, French chic, botanical accents, Parisian luxury',
  modern: 'modern futuristic, holographic effects, tech aesthetic, cutting-edge design, cyberpunk',
};

const FORMAT_PROMPTS: Record<ImageFormat, string> = {
  '1:1': 'square format Instagram post, 4K',
  '9:16': 'vertical format TikTok Reels story, 4K',
  '4:5': 'portrait format Instagram, 4K',
  '16:9': 'horizontal format YouTube thumbnail, 4K',
};

export function AIAdStudio() {
  const { product, adImages, addAdImage } = useStore();
  const [selectedStyle, setSelectedStyle] = useState<AdStyle>('bold');
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [localImages, setLocalImages] = useState<GeneratedImage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const buildPrompt = (): string => {
    const productTitle = product?.title || 'trendy product';
    const productDesc = product?.description || 'high quality commercial product';
    
    return `Professional product advertisement featuring ${productTitle}, ${STYLE_PROMPTS[selectedStyle]}, ${FORMAT_PROMPTS[selectedFormat]}, highly detailed, 8k photorealistic, commercial photography quality, ${productDesc}`;
  };

  const generateImage = async (style: AdStyle, format: ImageFormat): Promise<string | null> => {
    const prompt = buildPrompt();
    
    try {
      // Check if Puter.js is available
      if (!(window as any).puter || !(window as any).puter.ai) {
        console.error('Puter.js not loaded');
        return null;
      }

      const width = format === '16:9' ? 1920 : 1080;
      const height = format === '9:16' ? 1920 : format === '4:5' ? 1350 : format === '16:9' ? 1080 : 1080;

      const imageElement = await (window as any).puter.ai.txt2img(prompt, {
        model: 'black-forest-labs/flux-2-klein-9b-base',
        width,
        height,
      });

      if (imageElement) {
        // Puter.js returns an img element with src
        if (imageElement.src) return imageElement.src;
        if (imageElement instanceof HTMLImageElement) return imageElement.src;
        if (imageElement instanceof HTMLCanvasElement) {
          return imageElement.toDataURL('image/png');
        }
      }
      
      return null;
    } catch (error) {
      console.error('Image generation failed:', error);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const imageUrl = await generateImage(selectedStyle, selectedFormat);
      if (imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: imageUrl,
          style: selectedStyle,
          format: selectedFormat,
        };
        setLocalImages(prev => [newImage, ...prev]);
        addAdImage(imageUrl);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAllStyles = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    for (let i = 0; i < AD_STYLES.length; i++) {
      const style = AD_STYLES[i].id;
      const imageUrl = await generateImage(style, selectedFormat);
      if (imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString() + i,
          url: imageUrl,
          style,
          format: selectedFormat,
        };
        setLocalImages(prev => [...prev, newImage]);
        addAdImage(imageUrl);
      }
      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsGenerating(false);
  };

  const handleDownload = async (image: GeneratedImage, index: number) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ad-${image.style}-${image.format}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(image.url, '_blank');
    }
  };

  const handlePlatformClick = (format: ImageFormat) => {
    setSelectedFormat(format);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Ad Studio
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate stunning ad creatives with Puter.js AI • No API keys needed
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Style Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Style</label>
          <div className="flex flex-wrap gap-2">
            {AD_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                disabled={isGenerating}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStyle === style.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800'
                }`}
              >
                {style.emoji} {style.name}
              </button>
            ))}
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Format</label>
          <div className="grid grid-cols-4 gap-2">
            {FORMATS.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                disabled={isGenerating}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  selectedFormat === format.id
                    ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-lg'
                    : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="text-2xl mb-1">{format.emoji}</div>
                <div className="text-xs font-bold">{format.name}</div>
                <div className="text-[10px] text-muted-foreground">{format.dimensions}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Presets */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Quick Platforms</label>
          <div className="flex gap-2">
            <button
              onClick={() => handlePlatformClick('9:16')}
              disabled={isGenerating}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                selectedFormat === '9:16'
                  ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 bg-white dark:bg-gray-800'
              }`}
            >
              🎬 TikTok/Reels
            </button>
            <button
              onClick={() => handlePlatformClick('1:1')}
              disabled={isGenerating}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                selectedFormat === '1:1'
                  ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 bg-white dark:bg-gray-800'
              }`}
            >
              📱 Instagram
            </button>
            <button
              onClick={() => handlePlatformClick('16:9')}
              disabled={isGenerating}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                selectedFormat === '16:9'
                  ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 bg-white dark:bg-gray-800'
              }`}
            >
              🖥️ YouTube
            </button>
          </div>
        </div>

        {/* Generate Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            Generate {selectedFormat} Poster
          </Button>
          
          <Button
            onClick={handleGenerateAllStyles}
            disabled={isGenerating}
            variant="outline"
            className="h-12 px-6 border-2 border-purple-300 dark:border-purple-700"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImageIcon className="w-5 h-5 mr-2" />
            )}
            All Styles (6x)
          </Button>
        </div>

        {/* Generated Images Grid */}
        {localImages.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <h4 className="font-bold flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Generated Ad Creatives ({localImages.length})
              </h4>
            </div>
            
            <div 
              ref={containerRef}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              id="ad-image-container"
            >
              {localImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative group rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 transition-all shadow-lg"
                >
                  <img
                    src={image.url}
                    alt={`Generated ad ${index + 1}`}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDownload(image, index)}
                      className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-xl"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <span className="text-white text-sm font-bold">
                      {AD_STYLES.find(s => s.id === image.style)?.emoji} {image.style} • {image.format}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isGenerating && localImages.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-xl bg-purple-50/50 dark:bg-purple-900/10">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              Select style & format, then click Generate
            </p>
            <p className="text-xs text-purple-500 mt-1">
              Powered by Puter.js AI • No API keys required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
