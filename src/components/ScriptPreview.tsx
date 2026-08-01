import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Player } from '@remotion/player';
import { VantaShowcase } from './vanta/VantaShowcase';
import { BRAND_PALETTES, BrandPaletteId } from '@/types/product';
import { Loader2 } from 'lucide-react';

export function ScriptPreview() {
  const { 
    script, 
    product, 
    videoSettings, 
    generationType, 
    bRollConfig,
    productImages,
    setLoading, 
    setError, 
    setStep,
    setBRollConfig,
    setProductImages,
    isLoading
  } = useStore();

  if (!script || !product) return null;

  const { ratio, duration, captionStyle, brandPalette } = videoSettings;
  
  // Get the actual brand palette object
  const brandPaletteObject = BRAND_PALETTES[brandPalette as BrandPaletteId] || BRAND_PALETTES['noir-gold'];
  
  const isVertical = ratio === '9:16';
  const compositionWidth = isVertical ? 1080 : 1920;
  const compositionHeight = isVertical ? 1920 : 1080;
  const totalFrames = duration * 30;

  const containerClass = isVertical
    ? 'aspect-[9/16] max-h-[60vh] mx-auto'
    : 'aspect-video';

  const isBRoll = generationType === 'b-roll';

  const handleGenerateVideo = async () => {
    if (isLoading) return; // Prevent duplicate requests
    // Navigate to Market Intelligence step
    setStep('marketIntelligence');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Generated {isBRoll ? 'B-Roll' : 'Ad'} Script</CardTitle>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            isBRoll 
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          }`}>
            {isBRoll ? '🎬 B-Roll' : '🚀 Ad'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm">
          <p className="whitespace-pre-wrap">{script}</p>
        </div>
        {/* Video preview hidden but kept mounted for functionality */}
        <div className="hidden">
          <div className={containerClass}>
            <Player
              component={VantaShowcase}
              durationInFrames={totalFrames}
              fps={30}
              compositionWidth={compositionWidth}
              compositionHeight={compositionHeight}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              inputProps={{
                script,
                product,
                settings: { ratio, duration, captionStyle, brandPalette },
                brandPalette: brandPaletteObject,
                generationType,
                bRollConfig: bRollConfig || undefined,
                productImages: productImages || [],
              }}
              controls
              acknowledgeRemotionLicense={true}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateVideo} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Continue to Market Intelligence'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
