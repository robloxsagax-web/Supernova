'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Sparkles, Download, Loader2, Image as ImageIcon, AlertCircle, ChevronDown, Upload, X, Wand2 } from 'lucide-react';

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

const AD_STYLES: { id: AdStyle; name: string; emoji: string; description: string }[] = [
  { id: 'bold', name: 'Bold', emoji: '🔥', description: 'Dynamic & eye-catching' },
  { id: 'luxury', name: 'Luxury', emoji: '✨', description: 'Premium & elegant' },
  { id: 'minimal', name: 'Minimal', emoji: '💎', description: 'Clean & refined' },
  { id: 'vibrant', name: 'Vibrant', emoji: '🌈', description: 'Colorful & playful' },
  { id: 'elegant', name: 'Elegant', emoji: '🌸', description: 'Sophisticated & chic' },
  { id: 'modern', name: 'Modern', emoji: '🚀', description: 'Futuristic & sleek' },
];

const FORMATS: { id: ImageFormat; name: string; description: string }[] = [
  { id: '1:1', name: 'Square', description: '1:1 Ratio' },
  { id: '16:9', name: 'Landscape', description: '16:9 Ratio' },
  { id: '9:16', name: 'Portrait', description: '9:16 Ratio' },
  { id: '4:5', name: 'Instagram', description: '4:5 Ratio' },
];

export function AIAdStudio() {
  const { product, addAdImage } = useStore();
  const [selectedStyle, setSelectedStyle] = useState<AdStyle>('bold');
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [posters, setPosters] = useState<GeneratedPoster[]>([]);
  const [puterReady, setPuterReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
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
        // Negative prompt to prevent text hallucination
        negative_prompt: 'text, words, letters, gibberish, branding, slogan, logo, watermark, signature, caption',
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
      case '1:1': return 'aspect-square';
      case '9:16': return 'aspect-[9/16]';
      case '4:5': return 'aspect-[4/5]';
      case '16:9': return 'aspect-video';
      default: return 'aspect-square';
    }
  };

  const isDisabled = !product?.image || !puterReady || isGenerating;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full rounded-3xl glass overflow-hidden"
    >
      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-maroon/10 via-transparent to-peach/10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-maroon/20 to-peach/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-peach/20 to-maroon/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Main Container */}
      <div className="relative z-10 p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center glow-maroon"
            >
              <Wand2 className="w-7 h-7 text-peach" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">AI Image Studio</h2>
              <p className="text-muted-foreground text-sm">Generate premium advertising creatives using AI</p>
            </div>
          </div>
          {product && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-4 py-2 rounded-full glass">
              <span className="text-sm text-muted-foreground">{product.company_name}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Status Banner */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${
                statusMessage.includes('failed') || statusMessage.includes('Failed')
                  ? 'bg-error/10 border-error/20'
                  : statusMessage.includes('Loading')
                    ? 'bg-yellow-500/10 border-yellow-500/20'
                    : 'bg-success/10 border-success/20'
              }`}
            >
              {statusMessage.includes('failed') || statusMessage.includes('Failed') ? (
                <AlertCircle className="w-5 h-5 text-error" />
              ) : statusMessage.includes('Loading') ? (
                <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 text-success" />
              )}
              <span className={`text-sm font-medium ${
                statusMessage.includes('failed') || statusMessage.includes('Failed')
                  ? 'text-error'
                  : statusMessage.includes('Loading')
                    ? 'text-yellow-500'
                    : 'text-success'
              }`}>{statusMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creative Style Section */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Creative Style</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {AD_STYLES.map((style) => (
              <motion.button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                disabled={isDisabled}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 glass-hover ${
                  selectedStyle === style.id
                    ? 'border-peach glow-peach bg-gradient-to-br from-maroon/20 to-peach/20'
                    : 'border-border hover:border-peach/50'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-3xl mb-2">{style.emoji}</div>
                <div className="text-sm font-semibold text-foreground mb-1">{style.name}</div>
                <div className="text-xs text-muted-foreground">{style.description}</div>
                {selectedStyle === style.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                    <span className="text-[10px] text-background font-bold">✓</span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Aspect Ratio Section */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Aspect Ratio</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FORMATS.map((format) => (
              <motion.button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                disabled={isDisabled}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 glass-hover ${
                  selectedFormat === format.id
                    ? 'border-peach glow-peach bg-gradient-to-br from-maroon/20 to-peach/20'
                    : 'border-border hover:border-peach/50'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className={`bg-gradient-to-br from-maroon to-peach transition-all duration-300 ${
                    format.id === '1:1' ? 'w-12 h-12' : format.id === '16:9' ? 'w-14 h-8' : format.id === '9:16' ? 'w-8 h-14' : 'w-10 h-12'
                  } rounded-lg`} />
                </div>
                <div className="text-base font-bold text-foreground mb-1">{format.name}</div>
                <div className="text-xs text-muted-foreground">{format.description}</div>
                {selectedFormat === format.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                    <span className="text-[10px] text-background font-bold">✓</span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Reference Image Section */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Reference Image</h3>
          <div className="relative">
            {product?.image ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative rounded-2xl overflow-hidden glass border-2 border-border">
                <img src={product.image} alt="Product reference" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-sm font-semibold text-foreground">{product.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{product.company_name}</div>
                </div>
              </motion.div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center glass">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">Enter a product URL above to enable image generation</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Advanced Options (Collapsible) */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-3">
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full text-left glass-hover rounded-xl p-4 transition-all duration-300">
            <span className="text-sm font-semibold text-foreground">Generation Settings</span>
            <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="p-6 rounded-2xl glass space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Quality</label>
                      <select className="w-full h-11 px-4 rounded-xl bg-white/5 border border-border text-foreground focus:outline-none focus:border-peach/50 transition-all">
                        <option>Standard</option><option>High</option><option>Ultra</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Creativity</label>
                      <select className="w-full h-11 px-4 rounded-xl bg-white/5 border border-border text-foreground focus:outline-none focus:border-peach/50 transition-all">
                        <option>Balanced</option><option>Precise</option><option>Creative</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Steps</label>
                      <select className="w-full h-11 px-4 rounded-xl bg-white/5 border border-border text-foreground focus:outline-none focus:border-peach/50 transition-all">
                        <option>20</option><option>30</option><option>50</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Negative Prompt</label>
                    <textarea placeholder="text, words, letters, gibberish, branding..." className="w-full h-20 px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-peach/50 transition-all resize-none" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Generate Button */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} whileHover={{ scale: isDisabled ? 1 : 1.01 }} whileTap={{ scale: isDisabled ? 1 : 0.99 }}>
          <Button onClick={handleGenerate} disabled={isDisabled} className={`w-full h-16 rounded-2xl text-lg font-bold transition-all duration-300 ${
            !product?.image ? 'glass text-muted-foreground cursor-not-allowed' : isGenerating ? 'gradient-primary opacity-70' : 'gradient-primary glow-maroon hover:opacity-90 text-background'
          }`}>
            {isGenerating ? (<><Loader2 className="w-6 h-6 mr-3 animate-spin" /><span>Generating Creative...</span></>) : !product?.image ? (<><AlertCircle className="w-6 h-6 mr-3" /><span>Enter URL to Enable</span></>) : (<><Sparkles className="w-6 h-6 mr-3" /><span>✨ Generate Creative</span></>)}
          </Button>
        </motion.div>

        {/* Generated Results Gallery */}
        <AnimatePresence>
          {posters.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="space-y-6 pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3"><ImageIcon className="w-6 h-6 text-peach" />Generated Creatives ({posters.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posters.map((poster, index) => (
                  <motion.div key={poster.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} className="relative group rounded-2xl overflow-hidden glass border-2 border-border hover:border-peach/50 transition-all duration-300">
                    <div className={`w-full ${formatAspectClass(poster.format)} bg-card overflow-hidden`}>
                      <img src={poster.url} alt={`Generated creative ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
                      <motion.button onClick={() => handleDownload(poster, index)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="px-5 py-2.5 rounded-xl gradient-primary text-background font-semibold text-sm flex items-center gap-2 shadow-lg">
                        <Download className="w-4 h-4" />Download
                      </motion.button>
                      <motion.button onClick={() => handleDelete(poster.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="px-5 py-2.5 rounded-xl bg-error/20 backdrop-blur-xl border border-error/30 text-error font-semibold text-sm flex items-center gap-2 hover:bg-error/30 transition-all">
                        <X className="w-4 h-4" />Delete
                      </motion.button>
                    </div>
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <div className="px-3 py-1.5 rounded-lg glass text-xs font-semibold text-foreground">{AD_STYLES.find(s => s.id === poster.style)?.emoji} {poster.style}</div>
                      <div className="px-3 py-1.5 rounded-lg glass text-xs font-semibold text-muted-foreground">{poster.format}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!isGenerating && posters.length === 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-12 pb-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center glow-maroon">
                <ImageIcon className="w-10 h-10 text-peach" />
              </motion.div>
              <h4 className="text-xl font-bold text-foreground mb-2">Ready to Create</h4>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">Your generated creatives will appear here. Select a style, ratio, and hit generate to create stunning advertising images.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
