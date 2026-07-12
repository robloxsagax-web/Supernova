'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Sparkles, Download, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

type AdStyle = 'bold' | 'luxury' | 'minimal' | 'vibrant' | 'elegant' | 'modern';
type ImageFormat = '1:1' | '9:16' | '4:5' | '16:9';

interface GeneratedPoster {
  id: string;
  url: string;
  style: AdStyle;
  format: ImageFormat;
  productName: string;
  companyName: string;
}

const AD_STYLES: { id: AdStyle; name: string; emoji: string; prompt: string }[] = [
  { id: 'bold', name: 'Bold', emoji: '🔥', prompt: 'bold vibrant colors, dynamic composition, eye-catching design' },
  { id: 'luxury', name: 'Luxury', emoji: '✨', prompt: 'luxury elegant design, gold accents, sophisticated premium quality' },
  { id: 'minimal', name: 'Minimal', emoji: '💎', prompt: 'minimal clean design, white space, Scandinavian aesthetic' },
  { id: 'vibrant', name: 'Vibrant', emoji: '🌈', prompt: 'vibrant colorful, rainbow gradient, playful Gen-Z style' },
  { id: 'elegant', name: 'Elegant', emoji: '🌸', prompt: 'elegant sophisticated, soft pastel colors, French chic' },
  { id: 'modern', name: 'Modern', emoji: '🚀', prompt: 'modern futuristic, holographic effects, tech aesthetic' },
];

const FORMATS: { id: ImageFormat; name: string; emoji: string; ratio: { w: number; h: number } }[] = [
  { id: '1:1', name: '1:1', emoji: '📱', ratio: { w: 1, h: 1 } },
  { id: '9:16', name: '9:16', emoji: '🎬', ratio: { w: 2, h: 3 } },
  { id: '4:5', name: '4:5', emoji: '📲', ratio: { w: 4, h: 5 } },
  { id: '16:9', name: '16:9', emoji: '🖥️', ratio: { w: 16, h: 9 } },
];

export function AIAdStudio() {
  const { product, adImages, addAdImage } = useStore();
  const [selectedStyle, setSelectedStyle] = useState<AdStyle>('bold');
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [posters, setPosters] = useState<GeneratedPoster[]>([]);
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

  // Build dynamic prompt using product data
  const buildPrompt = (): string => {
    const productName = product?.title || 'Premium Product';
    const companyName = product?.company_name || 'Exclusive Brand';
    const styleObj = AD_STYLES.find(s => s.id === selectedStyle);
    const formatObj = FORMATS.find(f => f.id === selectedFormat);
    const features = product?.features?.slice(0, 3).join(', ') || '';
    const description = product?.description?.substring(0, 100) || '';
    
    // Enhanced prompt for image-to-image with NO TEXT policy
    return `Transform the provided product image into a professional ${styleObj?.name.toLowerCase()} style advertisement for ${productName} by ${companyName}. ${features ? `Key features: ${features}.` : ''} ${description ? `Product description: ${description}.` : ''} ${formatObj?.name} format.

NO TEXT: Do not render any artificial text, slogans, or branding on the image. The image must contain only the product and the aesthetic environment.

Visual Focus: High-end studio photography, cinematic lighting, commercial advertising quality.

Composition: Maintain product authenticity, minimalist luxury background.

Negative Prompt: Exclude any generated text, misspellings, or fictional branding.`;
  };

  // Convert image URL to base64 for Puter.js
  const imageToBase64 = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to convert image to base64:', error);
      return null;
    }
  };

  // Generate poster using image-to-image
  const generatePoster = async (): Promise<string | null> => {
    if (!product?.image) {
      console.error('No product image available');
      return null;
    }

    const prompt = buildPrompt();
    const formatObj = FORMATS.find(f => f.id === selectedFormat);
    
    try {
      if (!(window as any).puter?.ai) {
        setStatusMessage('AI service not ready. Please wait...');
        return null;
      }

      console.log('Generating poster with prompt:', prompt);
      console.log('Using input image:', product.image);
      
      // Convert image to base64 for reliable image-to-image
      setStatusMessage('Processing product image...');
      const base64Image = await imageToBase64(product.image);
      
      if (!base64Image) {
        setStatusMessage('Failed to process image. Trying direct URL...');
        // Fallback to direct URL if base64 conversion fails
      }
      
      const generationOptions: any = {
        model: 'gpt-image-1-mini',
        quality: 'low',
        ratio: formatObj?.ratio,
      };
      
      // Use base64 if available, otherwise fallback to URL
      if (base64Image) {
        generationOptions.input_image = base64Image;
      } else {
        generationOptions.input_image = product.image;
      }
      
      setStatusMessage('Generating poster...');
      
      const result = await (window as any).puter.ai.txt2img(prompt, generationOptions);

      console.log('Generation result:', result);

      if (!result) return null;

      if (result.src) return result.src;
      if (result instanceof HTMLImageElement) return result.src;
      if (result instanceof HTMLCanvasElement) return result.toDataURL('image/png');
      if (result.image?.src) return result.image.src;
      
      return null;
    } catch (error) {
      console.error('Image generation failed:', error);
      setStatusMessage(`Generation failed: ${error}`);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (isGenerating || !product?.image) return;
    
    setIsGenerating(true);
    setStatusMessage('Generating poster...');
    
    try {
      const imageUrl = await generatePoster();
      if (imageUrl) {
        const newPoster: GeneratedPoster = {
          id: Date.now().toString(),
          url: imageUrl,
          style: selectedStyle,
          format: selectedFormat,
          productName: product.title,
          companyName: product.company_name,
        };
        setPosters(prev => [newPoster, ...prev]);
        addAdImage(imageUrl);
        setStatusMessage('Poster generated successfully!');
      } else {
        setStatusMessage('Failed to generate poster. Please try again.');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setStatusMessage('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (poster: GeneratedPoster, index: number) => {
    try {
      const response = await fetch(poster.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ad-${poster.style}-${poster.format}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(poster.url, '_blank');
    }
  };

  const formatAspectClass = (format: ImageFormat): string => {
    switch (format) {
      case '16:9': return 'aspect-video';
      case '1:1': return 'aspect-square';
      default: return 'aspect-[3/4]';
    }
  };

  const isDisabled = !product?.image || !puterReady || isGenerating;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Ad Studio</h3>
            <p className="text-xs text-gray-400">Powered by Puter.js</p>
          </div>
        </div>
        
        {/* Product Badge */}
        {product && (
          <div className="px-3 py-1.5 bg-gray-800 rounded-full border border-gray-600">
            <span className="text-xs text-gray-300">{product.company_name}</span>
          </div>
        )}
      </div>

      {/* Status Banner */}
      {statusMessage && (
        <div className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-xl ${
          statusMessage.includes('failed') || statusMessage.includes('Failed')
            ? 'bg-red-900/30 border border-red-700'
            : statusMessage.includes('Loading')
              ? 'bg-yellow-900/30 border border-yellow-700'
              : 'bg-green-900/30 border border-green-700'
        }`}>
          {statusMessage.includes('failed') || statusMessage.includes('Failed') ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : statusMessage.includes('Loading') ? (
            <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-green-400" />
          )}
          <span className={`text-sm ${
            statusMessage.includes('failed') || statusMessage.includes('Failed')
              ? 'text-red-300'
              : statusMessage.includes('Loading')
                ? 'text-yellow-300'
                : 'text-green-300'
          }`}>{statusMessage}</span>
        </div>
      )}

      {/* Style Selector */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
          Select Style
        </label>
        <div className="flex flex-wrap gap-2">
          {AD_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedStyle === style.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="mr-1">{style.emoji}</span>
              <span className="text-white">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Format Selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
          Select Format
        </label>
        <div className="grid grid-cols-4 gap-2">
          {FORMATS.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              disabled={isDisabled}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                selectedFormat === format.id
                  ? 'border-purple-500 bg-purple-900/30'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-2xl mb-1">{format.emoji}</div>
              <div className="text-xs font-bold text-white">{format.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isDisabled}
        className={`w-full h-12 text-base font-bold ${
          !product?.image
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
        } ${isGenerating ? 'opacity-70' : ''}`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            <span className="text-white">Generating...</span>
          </>
        ) : !product?.image ? (
          <>
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-gray-400">Enter URL to Enable</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="text-white">Generate {selectedFormat} Poster</span>
          </>
        )}
      </Button>

      {/* Generated Posters Gallery */}
      {posters.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Generated Posters ({posters.length})
            </h4>
          </div>
          
          <div 
            ref={containerRef}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto scrollbar-thin"
          >
            {posters.map((poster, index) => (
              <div
                key={poster.id}
                className="relative group rounded-xl overflow-hidden border-2 border-gray-600 hover:border-purple-500 transition-all shadow-lg"
              >
                <div className={`w-full ${formatAspectClass(poster.format)} bg-gray-800`}>
                  <img
                    src={poster.url}
                    alt={`Generated poster ${index + 1}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                
                {/* Hover overlay with download */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDownload(poster, index)}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-xl"
                  >
                    <Download className="w-5 h-5 text-gray-900" />
                  </button>
                </div>
                
                {/* Labels */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-bold">
                      {AD_STYLES.find(s => s.id === poster.style)?.emoji} {poster.style}
                    </span>
                    <span className="text-gray-300 text-xs">{poster.format}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isGenerating && posters.length === 0 && (
        <div className="mt-8 pt-6 border-t border-gray-700 text-center py-8">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-sm text-gray-500">
            Generated posters will appear here
          </p>
        </div>
      )}
    </div>
  );
}
