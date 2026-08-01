'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { 
  VideoRatio, 
  VideoDuration, 
  BrandPaletteId,
  BRAND_PALETTES
} from '@/types/product';
import { 
  Sparkles, 
  Search, 
  Zap,
  Rocket,
  Check,
  Film,
  Image,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { cleanProduct } from '@/lib/productCleaner';

type GenerationType = 'ad' | 'b-roll';

const generationTypes: { 
  type: GenerationType; 
  label: string; 
  subtext: string; 
  badge: string;
}[] = [
  {
    type: 'ad',
    label: 'High-Conversion Ad',
    subtext: 'Aggressive problem-solving sales hooks, optimized for paid social.',
    badge: 'Sales'
  },
  {
    type: 'b-roll',
    label: 'Organic B-Roll',
    subtext: 'Aesthetic storytelling and educational narratives, optimized for viral.',
    badge: 'Viral'
  }
];

// Platform detection icons
const platforms = [
  { name: 'Amazon', color: '#FF9900', icon: 'A' },
  { name: 'Shopify', color: '#96BF48', icon: 'S' },
  { name: 'Etsy', color: '#F16421', icon: 'E' },
  { name: 'eBay', color: '#E53238', icon: 'e' },
];

export function UrlInputForm() {
  const [url, setUrl] = useState('');
  const [generationType, setGenerationType] = useState<GenerationType>('ad');
  const [ratio, setRatio] = useState<VideoRatio>('16:9');
  const [duration, setDuration] = useState<VideoDuration>(30);
  const [brandPalette, setBrandPalette] = useState<BrandPaletteId>('noir-gold');
  const [isFocused, setIsFocused] = useState(false);
  const { setLoading, setError, setProduct, setStep, setVideoSettings, setGenerationType: setStoreGenerationType, createProject, isLoading } = useStore();

  // Detect platform from URL
  const detectedPlatform = platforms.find(p => url.toLowerCase().includes(p.name.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate requests
    
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to scrape product data');
      }

      const rawProduct = await response.json();
      
      // Clean product data before storing
      const product = {
        ...rawProduct,
        ...cleanProduct(rawProduct),
        // Preserve original images if cleaned result is empty
        images: rawProduct.images?.length > 0 ? rawProduct.images : cleanProduct(rawProduct).images,
        // Preserve original features if cleaned result is empty
        features: rawProduct.features?.length > 0 ? rawProduct.features : cleanProduct(rawProduct).features,
      };
      
      setProduct(product);
      
      const campaignName = product.title || `Campaign ${new Date().toLocaleDateString()}`;
      createProject(campaignName, product);
      
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
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative"
    >
      {/* Main Form Card */}
      <div 
        className="relative p-8 rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(17, 17, 17, 0.6)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 218, 185, 0.08)',
        }}
      >
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#5C3317]/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FFDAB9]/5 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 relative"
              style={{
                background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                boxShadow: '0 0 40px rgba(92, 51, 23, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Sparkles className="w-8 h-8 text-[#FFDAB9]" />
              {/* Glow pulse */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-[#FFDAB9]/30"
              />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Generate AI Video Ad
            </h2>
            <p className="text-[rgba(255,255,255,0.5)]">
              Paste a product URL to generate a stunning video ad
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Content Style Selector - Premium Cards */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-[rgba(255,255,255,0.7)] uppercase tracking-wider">
                Content Style
              </label>
              <div className="grid grid-cols-2 gap-4">
                {generationTypes.map((item) => {
                  const isSelected = generationType === item.type;
                  return (
                    <motion.button
                      key={item.type}
                      type="button"
                      onClick={() => setGenerationType(item.type)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'relative p-5 rounded-2xl transition-all duration-300 text-left',
                        'border-2 overflow-hidden',
                        isSelected
                          ? 'border-[#FFDAB9] shadow-[0_0_30px_rgba(255,218,185,0.2)]'
                          : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,218,185,0.3)]'
                      )}
                      style={{
                        background: isSelected 
                          ? 'linear-gradient(135deg, rgba(92, 51, 23, 0.3) 0%, rgba(255, 218, 185, 0.1) 100%)'
                          : 'rgba(255, 255, 255, 0.02)',
                      }}
                    >
                      {/* Background glow for selected */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#5C3317]/20 to-transparent" />
                      )}
                      
                      <div className="relative z-10">
                        {/* Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={cn(
                            'text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider',
                            isSelected
                              ? 'bg-[#FFDAB9] text-[#09090B]'
                              : 'bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]'
                          )}>
                            {item.badge}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full bg-[#FFDAB9] flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-[#09090B]" />
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-3">
                          {item.type === 'ad' ? (
                            <Rocket className={cn('w-5 h-5', isSelected ? 'text-[#FFDAB9]' : 'text-[rgba(255,255,255,0.5)]')} />
                          ) : (
                            <Film className={cn('w-5 h-5', isSelected ? 'text-[#FFDAB9]' : 'text-[rgba(255,255,255,0.5)]')} />
                          )}
                        </div>
                        
                        <h3 className={cn(
                          'font-semibold text-sm mb-1 transition-colors',
                          isSelected ? 'text-white' : 'text-[rgba(255,255,255,0.7)]'
                        )}>
                          {item.label}
                        </h3>
                        <p className="text-xs text-[rgba(255,255,255,0.4)] leading-relaxed">
                          {item.subtext}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* URL Input - Premium Style */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-[rgba(255,255,255,0.7)] uppercase tracking-wider">
                Product URL
              </label>
              <div className="relative group">
                {/* Glow effect on focus */}
                <motion.div
                  animate={{ opacity: isFocused ? 1 : 0 }}
                  className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#5C3317] to-[#FFDAB9] opacity-30 blur-sm"
                  style={{ transition: 'opacity 0.3s' }}
                />
                
                {/* Input container */}
                <div 
                  className={cn(
                    'relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300',
                    'border-2',
                    isFocused 
                      ? 'border-[rgba(255,218,185,0.5)] bg-[rgba(255,218,185,0.05)]'
                      : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]'
                  )}
                >
                  {/* Search icon */}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300',
                    isFocused ? 'bg-[#5C3317]/50' : 'bg-[rgba(255,255,255,0.05)]'
                  )}>
                    <Search className={cn(
                      'w-5 h-5 transition-colors',
                      isFocused ? 'text-[#FFDAB9]' : 'text-[rgba(255,255,255,0.4)]'
                    )} />
                  </div>
                  
                  {/* Platform detection */}
                  {detectedPlatform && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)]"
                    >
                      <div 
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: detectedPlatform.color, color: 'white' }}
                      >
                        {detectedPlatform.icon}
                      </div>
                      <span className="text-xs text-[rgba(255,255,255,0.5)]">{detectedPlatform.name}</span>
                    </motion.div>
                  )}
                  
                  <input
                    type="url"
                    placeholder="https://www.amazon.com/product-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required
                    className="flex-1 bg-transparent text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none text-base"
                  />
                  
                  {/* Clear button */}
                  {url && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      type="button"
                      onClick={() => setUrl('')}
                      className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                    >
                      <span className="text-[rgba(255,255,255,0.3)]">×</span>
                    </motion.button>
                  )}
                </div>
              </div>
              
              {/* Platform hints */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[rgba(255,255,255,0.3)]">Supported:</span>
                {platforms.map((p) => (
                  <span 
                    key={p.name}
                    className="text-xs px-2 py-1 rounded-md bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.4)]"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Video Settings - Two Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ratio Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.7)] uppercase tracking-wider">
                  Video Ratio
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['16:9', '9:16'] as VideoRatio[]).map((r) => {
                    const isSelected = ratio === r;
                    const isVertical = r === '9:16';
                    return (
                      <motion.button
                        key={r}
                        type="button"
                        onClick={() => setRatio(r)}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'relative p-4 rounded-xl transition-all duration-300 border-2',
                          isSelected
                            ? 'border-[#FFDAB9] bg-[rgba(255,218,185,0.1)]'
                            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,218,185,0.3)]'
                        )}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {/* Ratio preview */}
                          <div 
                            className={cn(
                              'border-2 flex items-center justify-center',
                              isSelected ? 'border-[#FFDAB9]' : 'border-[rgba(255,255,255,0.2)]'
                            )}
                            style={{
                              width: isVertical ? '24px' : '48px',
                              height: isVertical ? '42px' : '27px',
                              background: 'rgba(255,255,255,0.05)',
                              borderRadius: '4px',
                            }}
                          />
                          <span className={cn(
                            'text-sm font-medium',
                            isSelected ? 'text-white' : 'text-[rgba(255,255,255,0.5)]'
                          )}>
                            {r}
                          </span>
                          <span className="text-[10px] text-[rgba(255,255,255,0.3)]">
                            {isVertical ? 'Mobile' : 'Desktop'}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Check className="w-4 h-4 text-[#FFDAB9]" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              {/* Duration Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.7)] uppercase tracking-wider">
                  Duration
                </label>
                <div className="relative">
                  {/* Sliding indicator */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      x: duration === 15 ? 0 : duration === 30 ? '100%' : duration === 45 ? '200%' : '300%' 
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute top-0 bottom-0 left-0 w-[calc(25%-6px)] ml-[3px] rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                      boxShadow: '0 0 20px rgba(92, 51, 23, 0.4)',
                    }}
                  />
                  <div className="relative flex items-center gap-2 p-1.5">
                    {([15, 30, 45, 60] as VideoDuration[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={cn(
                          'relative z-10 flex-1 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center',
                          duration === d ? 'text-[#09090B]' : 'text-[rgba(255,255,255,0.6)]'
                        )}
                      >
                        {d}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Palette - Premium Cards */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-[rgba(255,255,255,0.7)] uppercase tracking-wider">
                Brand Identity Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(Object.keys(BRAND_PALETTES) as BrandPaletteId[]).map((paletteId) => {
                  const palette = BRAND_PALETTES[paletteId];
                  const isSelected = brandPalette === paletteId;
                  return (
                    <motion.button
                      key={paletteId}
                      type="button"
                      onClick={() => setBrandPalette(paletteId)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'relative p-4 rounded-2xl transition-all duration-300 border-2 overflow-hidden',
                        isSelected
                          ? 'border-[#FFDAB9] shadow-[0_0_25px_rgba(255,218,185,0.3)]'
                          : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,218,185,0.3)]'
                      )}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                      }}
                    >
                      {/* Selected glow */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#5C3317]/20 to-transparent" />
                      )}
                      
                      <div className="relative z-10">
                        {/* Color swatches with preview */}
                        <div className="flex gap-2 mb-3 justify-center">
                          <div 
                            className="w-8 h-8 rounded-lg shadow-lg ring-2 ring-white/10"
                            style={{ backgroundColor: palette.primary }}
                          />
                          <div 
                            className="w-8 h-8 rounded-lg shadow-lg ring-2 ring-white/10"
                            style={{ backgroundColor: palette.secondary }}
                          />
                        </div>
                        <p className="text-xs font-semibold text-center capitalize" style={{
                          color: isSelected ? '#FFDAB9' : 'rgba(255,255,255,0.7)'
                        }}>
                          {palette.name}
                        </p>
                      </div>
                      
                      {/* Check indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                            boxShadow: '0 0 15px rgba(92, 51, 23, 0.5)',
                          }}
                        >
                          <Check className="w-3.5 h-3.5 text-[#FFDAB9]" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button - Premium */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01, y: -2 } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
              className={cn(
                'relative w-full py-5 rounded-2xl font-bold text-lg overflow-hidden group transition-all duration-300',
                isLoading && 'opacity-80 cursor-not-allowed'
              )}
              style={{
                background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 50%, #5C3317 100%)',
                boxShadow: '0 0 40px rgba(92, 51, 23, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Shimmer effect - only when not loading */}
              {!isLoading && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                      transform: 'translateX(-100%)',
                      animation: 'shimmer 2s ease-in-out infinite',
                    }}
                  />
                </div>
              )}
              
              {/* Glow pulse */}
              {!isLoading && (
                <div className="absolute inset-0 opacity-50">
                  <div 
                    className="absolute inset-0"
                    style={{
                      boxShadow: '0 0 60px rgba(255, 218, 185, 0.3)',
                      animation: 'pulse 3s ease-in-out infinite',
                    }}
                  />
                </div>
              )}
              
              <span className="relative flex items-center justify-center gap-3 text-[#FFDAB9]">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scraping Product...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {selectedType?.type === 'b-roll' ? 'Generate B-Roll Video' : 'Generate Video Ad'}
                    <Zap className="w-5 h-5" />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Footer Summary */}
          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)] text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-[rgba(255,255,255,0.4)]">
              <span>{selectedType?.badge}</span>
              <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
              <span>{ratio === '9:16' ? '📱' : '🖥️'} {ratio}</span>
              <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
              <span>{duration}s</span>
              <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
              <span className="capitalize">{selectedBrand.name}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </motion.div>
  );
} 