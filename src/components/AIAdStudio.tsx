'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Sparkles, Download, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

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
  const [puterReady, setPuterReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if Puter.js is loaded
  useEffect(() => {
    const checkPuter = () => {
      if ((window as any).puter && (window as any).puter.ai) {
        setPuterReady(true);
        setStatusMessage(null);
      } else {
        setPuterReady(false);
        setStatusMessage('Loading AI service...');
        setTimeout(checkPuter, 1000);
      }
    };
    
    const timer = setTimeout(checkPuter, 2000);
    return () => clearTimeout(timer);
  }, []);

  const buildPrompt = (): string => {
    const productTitle = product?.title || 'trendy product';
    const productDesc = product?.description || 'high quality commercial product';
    
    return `Professional product advertisement featuring ${productTitle}, ${STYLE_PROMPTS[selectedStyle]}, ${FORMAT_PROMPTS[selectedFormat]}, highly detailed, 8k photorealistic, commercial photography quality, ${productDesc}`;
  };

  const generateImage = async (style: AdStyle, format: ImageFormat): Promise<string | null> => {
    const prompt = buildPrompt();
    
    try {
      if (!(window as any).puter?.ai) {
        console.error('Puter.js AI not loaded');
        setStatusMessage('AI service not ready. Please wait...');
        return null;
      }

      // Map format to OpenAI ratio
      // OpenAI supports: 1024x1024 (square), 1536x1024 (portrait 3:2), 1024x1536 (portrait 2:3)
      // We map: 1:1 -> square, 9:16 -> portrait 2:3, 4:5 -> portrait, 16:9 -> landscape 3:2
      const ratioMap: Record<ImageFormat, { w: number; h: number }> = {
        '1:1': { w: 1, h: 1 },
        '9:16': { w: 2, h: 3 },
        '4:5': { w: 4, h: 5 },
        '16:9': { w: 16, h: 9 },
      };
      const ratio = ratioMap[format];

      console.log('Generating image with prompt:', prompt);
      console.log('Using ratio:', ratio);
      
      const result = await (window as any).puter.ai.txt2img(prompt, {
        model: 'gpt-image-1-mini', // OpenAI default model
        quality: 'low',
        ratio: ratio,
      });

      console.log('Generation result:', result);

      if (!result) return null;

      // Puter.js returns an HTMLImageElement with src property
      if (result.src) return result.src;
      if (result instanceof HTMLImageElement) return result.src;
      if (result instanceof HTMLCanvasElement) return result.toDataURL('image/png');
      if (result.image?.src) return result.image.src;
      
      console.error('Unknown result format:', result);
      return null;
    } catch (error) {
      console.error('Image generation failed:', error);
      setStatusMessage(`Generation failed: ${error}`);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setStatusMessage(null);
    
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
        setStatusMessage('Image generated successfully!');
      } else {
        setStatusMessage('Failed to generate image. Please try again.');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setStatusMessage('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAllStyles = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setStatusMessage('Generating 6 styles...');
    
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
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsGenerating(false);
    setStatusMessage('All images generated!');
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
        {/* Status Banner */}
        {statusMessage && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            statusMessage.includes('failed') || statusMessage.includes('Failed')
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          }`}>
            {statusMessage.includes('failed') || statusMessage.includes('Failed') ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Sparkles className="w-5 h-5 text-green-600" />
            )}
            <span className={`text-sm ${
              statusMessage.includes('failed') || statusMessage.includes('Failed')
                ? 'text-red-700 dark:text-red-300'
                : 'text-green-700 dark:text-green-300'
            }`}>{statusMessage}</span>
          </div>
        )}

        {!puterReady && !statusMessage && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />
            <span className="text-sm text-yellow-700 dark:text-yellow-300">Loading AI service...</span>
          </div>
        )}

        {/* Style Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Style</label>
          <div className="flex flex-wrap gap-2">
            {AD_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                disabled={isGenerating || !puterReady}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStyle === style.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 hover:bg-purple-100 border border-purple-200 dark:border-purple-800'
                } ${!puterReady || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                disabled={isGenerating || !puterReady}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  selectedFormat === format.id
                    ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30'
                    : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 bg-white dark:bg-gray-800'
                } ${!puterReady || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            {[
              { format: '9:16' as ImageFormat, emoji: '🎬', name: 'TikTok/Reels' },
              { format: '1:1' as ImageFormat, emoji: '📱', name: 'Instagram' },
              { format: '16:9' as ImageFormat, emoji: '🖥️', name: 'YouTube' },
            ].map((platform) => (
              <button
                key={platform.name}
                onClick={() => handlePlatformClick(platform.format)}
                disabled={isGenerating || !puterReady}
                className={`flex-1 py-3 px-2 rounded-xl border-2 font-medium text-sm transition-all ${
                  selectedFormat === platform.format
                    ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 bg-white dark:bg-gray-800'
                } ${!puterReady || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {platform.emoji} {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !puterReady}
            className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            Generate {selectedFormat}
          </Button>
          
          <Button
            onClick={handleGenerateAllStyles}
            disabled={isGenerating || !puterReady}
            variant="outline"
            className="h-12 px-4 border-2 border-purple-300 dark:border-purple-700"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImageIcon className="w-5 h-5 mr-2" />
            )}
            All 6x
          </Button>
        </div>

        {/* Generated Images Grid */}
        {localImages.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <h4 className="font-bold flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Generated ({localImages.length})
              </h4>
            </div>
            
            <div 
              ref={containerRef}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              id="ad-image-container"
            >
              {localImages.map((image, index) => {
                // Calculate aspect ratio class based on format
                const aspectClass = image.format === '16:9' ? 'aspect-video' : 
                                  image.format === '1:1' ? 'aspect-square' : 
                                  'aspect-[3/4]';
                return (
                <div
                  key={image.id}
                  className="relative group rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 transition-all shadow-lg"
                >
                  <img
                    src={image.url}
                    alt={`Generated ad ${index + 1}`}
                    className={`w-full ${aspectClass} object-contain bg-gray-100 dark:bg-gray-800`}
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDownload(image, index)}
                      className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-xl"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <span className="text-white text-sm font-bold">
                      {AD_STYLES.find(s => s.id === image.style)?.emoji} {image.style} • {image.format}
                    </span>
                  </div>
                </div>
              );
              })}
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
              Powered by Puter.js AI
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
