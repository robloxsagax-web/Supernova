'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Player } from '@remotion/player';
import { VantaShowcase } from './vanta/VantaShowcase';
import { BRAND_PALETTES, BrandPaletteId } from '@/types/product';
import { Loader2, CheckCircle, AlertCircle, Save, CloudOff, ArrowRight } from 'lucide-react';

const FPS = 30;

// CORS-open ambient music from a reliable public source
const BACKGROUND_MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

// Loading timeout constants
const PREPARING_VIDEO_TIMEOUT_MS = 20000; // 20 seconds
const B_ROLL_NOTE_DISMISS_TIMEOUT_MS = 35000; // 35 seconds
const CANVAS_CHECK_INTERVAL_MS = 500; // 500ms

/**
 * Client-side script cleaner - mirrors server-side logic
 */
function cleanScriptForVoiceover(rawScript: string): string {
  if (!rawScript) return '';
  
  let text = rawScript;
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  text = text.replace(/https?:\/\/\S+/g, '');
  text = text.replace(/\[[^\]]*\]/g, '');
  text = text.replace(/\{[^}]*\}/g, '');
  text = text.replace(/\([^)]*\)/g, '');
  text = text.replace(/\bScene\s*\d+[\s:.-]*/gi, '');
  text = text.replace(/\bScene\s+[A-Za-z]+[\s:.-]*/gi, '');
  text = text.replace(/\bVO\s*:?\s*/gi, '');
  text = text.replace(/\bVoiceover\s*:?\s*/gi, '');
  text = text.replace(/\bNarrator\s*:?\s*/gi, '');
  text = text.replace(/\bSpeech\s*:?\s*/gi, '');
  text = text.replace(/\bLine\s*\d+[\s:.-]*/gi, '');
  text = text.replace(/\bVisual\s*:?\s*/gi, '');
  text = text.replace(/\bAction\s*:?\s*/gi, '');
  text = text.replace(/\bMusic\s*:?\s*/gi, '');
  text = text.replace(/\bSound\s*:?\s*/gi, '');
  text = text.replace(/\bFade\s*:?\s*/gi, '');
  text = text.replace(/\*+/g, '');
  text = text.replace(/_+/g, '');
  text = text.replace(/#+/g, '');
  text = text.replace(/-+/g, ' ');
  text = text.replace(/^[\s]*[-•*][\s]*/gm, '');
  text = text.replace(/^[\s]*\d+[\.\)][\s]*/gm, '');
  
  const lines = text.split(/\n+/);
  const spokenLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length >= 3 && /[a-zA-Z]{3,}/.test(trimmed)) {
      spokenLines.push(trimmed);
    }
  }
  
  let cleaned = spokenLines.join('. ');
  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .replace(/\.{2,}/g, '.')
    .replace(/,\./g, '.')
    .replace(/^\.+/, '')
    .replace(/\.+$/, '')
    .trim();
  
  return cleaned || '';
}

export function VideoPlayer() {
  // ALL HOOKS AT TOP LEVEL
  const store = useStore();
  const { bRollConfig, productImages, addAsset, createProject, autoSaveCampaign, b2SaveStatus, b2SaveError, b2LastSavedId, loadB2Campaigns, narrationUrl, setNarration } = store;
  const { script, product, videoSettings, generationType, adImages } = store;
  const router = useRouter();
  
  const playerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState(false);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [isPreparingVideo, setIsPreparingVideo] = useState(true);
  const [showBRollNote, setShowBRollNote] = useState(true);
  
  // Handle Save Campaign button
  const handleSaveCampaign = async () => {
    if (!product) return;
    
    const generationTime = Date.now() - startTimeRef.current;
    
    try {
      await autoSaveCampaign(generationTime);
      // Refresh projects list
      await loadB2Campaigns();
    } catch (err) {
      console.error('[VideoPlayer] Save campaign failed:', err);
    }
  };
  
  // Handle View in Projects
  const handleViewInProjects = async () => {
    await loadB2Campaigns();
    router.push('/projects');
  };
  
  // Derived values
  const { ratio, duration, captionStyle, brandPalette } = videoSettings;
  const brandPaletteObject = BRAND_PALETTES[brandPalette as BrandPaletteId] || BRAND_PALETTES['noir-gold'];
  const isVertical = ratio === '9:16';
  const compositionWidth = isVertical ? 1080 : 1920;
  const compositionHeight = isVertical ? 1920 : 1080;
  const totalFrames = duration * FPS;
  
  // Memoize inputProps to prevent unnecessary Player re-renders
  // Ensure voiceoverUrl is always a valid string or undefined, never null (causes Html5Audio crash)
  const safeVoiceoverUrl = typeof voiceoverUrl === 'string' && voiceoverUrl.length > 0 
    ? voiceoverUrl 
    : undefined;
  
  const inputProps = useMemo(() => ({
    script,
    product,
    settings: { ratio, duration, captionStyle, brandPalette },
    brandPalette: brandPaletteObject,
    voiceoverUrl: safeVoiceoverUrl,
    backgroundMusicUrl: BACKGROUND_MUSIC_URL,
    generationType,
    bRollConfig: bRollConfig || undefined,
    productImages: productImages || [],
  }), [
    script, 
    product, 
    ratio, 
    duration, 
    captionStyle, 
    brandPalette, 
    brandPaletteObject, 
    safeVoiceoverUrl, 
    generationType, 
    bRollConfig, 
    productImages
  ]);
  
  // Detect when player canvas is ready
  useEffect(() => {
    if (!playerRef.current) return;
    
    const checkForCanvas = () => {
      const canvas = playerRef.current?.querySelector('canvas');
      if (canvas) {
        setIsPlayerLoaded(true);
      }
    };
    
    // Check immediately
    checkForCanvas();
    
    // Also set up a small interval to catch when player loads
    const interval = setInterval(checkForCanvas, 500);
    
    // Also try MutationObserver to detect canvas insertion
    const observer = new MutationObserver(checkForCanvas);
    observer.observe(playerRef.current, { childList: true, subtree: true });
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [voiceoverUrl, product]);
  
  // 20-second fake loading screen to let clips/images load and voiceover generate
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreparingVideo(false);
    }, 20000); // 20 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  // Auto-dismiss B-Roll note after 35 seconds
  useEffect(() => {
    if (generationType === 'b-roll' && showBRollNote) {
      const dismissTimer = setTimeout(() => {
        setShowBRollNote(false);
      }, 35000); // 35 seconds
      
      return () => clearTimeout(dismissTimer);
    }
  }, [generationType, showBRollNote]);
  
  // Generate voiceover
  useEffect(() => {
    let mounted = true;
    let currentUrl: string | null = null;
    
    const generateVoiceover = async () => {
      if (!script || isGeneratingVoiceover) return;
      
      setIsGeneratingVoiceover(true);
      try {
        const cleanedScript = cleanScriptForVoiceover(script);
        
        if (!cleanedScript || cleanedScript.length < 5) {
          setIsGeneratingVoiceover(false);
          return;
        }
        
        const response = await fetch('/api/voiceover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: cleanedScript,
            voiceId: 'JBFqnCBsd6RMkjVDRZzb'
          }),
        });
        
        // Handle both success and graceful failure (returns 200 with success: false)
        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          
          if (contentType.includes('audio/')) {
            // Successful audio response
            const blob = await response.blob();
            currentUrl = URL.createObjectURL(blob);
            setVoiceoverUrl(currentUrl);
            // Also save to store for campaign persistence
            setNarration(currentUrl);
          } else {
            // JSON response - likely an error fallback
            const data = await response.json().catch(() => ({}));
            if (data.message) {
              console.log('[VideoPlayer] Voiceover unavailable:', data.message);
            }
            // Don't set error state - just continue without narration
          }
        } else {
          // HTTP error - continue without narration
          console.warn('[VideoPlayer] Voiceover request failed:', response.status);
        }
      } catch (error) {
        console.log('Voiceover generation failed:', error);
      } finally {
        if (mounted) setIsGeneratingVoiceover(false);
      }
    };
    
    generateVoiceover();
    
    return () => {
      mounted = false;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [script]);

  /**
   * Callback fired when recording is complete and blob is ready
   */

  /**
   * Trigger the actual file download and cleanup
   */

  /**
   * Start the recording process
   */

  /**
   * Stop recording and wait for all data to be available
   */

  // EARLY RETURN AFTER ALL HOOKS
  if (!script || !product) return null;

  const containerClass = isVertical 
    ? 'aspect-[9/16] max-h-[85vh] mx-auto' 
    : 'aspect-video';

  // Show loading screen while video prepares
  if (isPreparingVideo) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Preparing Your Video...</CardTitle>
        </CardHeader>
        <CardContent className="py-12 space-y-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <p className="text-center text-muted-foreground">
            Loading clips and generating voiceover...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-primary h-2.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if B-Roll mode for transparent layout
  const isBRoll = generationType === 'b-roll' && bRollConfig;

  // B-Roll mode: transparent container, no card wrapper
  if (isBRoll) {
    const isSaving = b2SaveStatus === 'saving';
    const isSaved = b2SaveStatus === 'saved';
    const saveError = b2SaveError;
    
    return (
      <div className="w-full">
        {/* Save Campaign Success Card */}
        {isSaved && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4 p-6 rounded-2xl glass border border-green-500/30 bg-green-50/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-500">Campaign Saved Successfully</h3>
                <p className="text-sm text-muted-foreground">Your campaign has been saved to cloud storage</p>
              </div>
            </div>
            <button
              onClick={handleViewInProjects}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              View in Projects
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
        
        {/* Save Campaign Error Card */}
        {saveError && !isSaving && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4 p-6 rounded-2xl glass border border-red-500/30 bg-red-50/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-500">Failed to Save Campaign</h3>
                <p className="text-sm text-red-400/80">{saveError}</p>
              </div>
            </div>
            <button
              onClick={handleSaveCampaign}
              disabled={isSaving || !product}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CloudOff className="w-4 h-4" />
              Retry Save
            </button>
          </motion.div>
        )}
        
        {/* Save Campaign Button */}
        {!isSaved && !saveError && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4"
          >
            <button
              onClick={handleSaveCampaign}
              disabled={isSaving || !product || isPreparingVideo}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Campaign...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  💾 Save Campaign
                </>
              )}
            </button>
            {isPreparingVideo && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Preparing your video...
              </p>
            )}
          </motion.div>
        )}
        
        {/* B-Roll Loading Note */}
        {showBRollNote && generationType === 'b-roll' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4 p-4 glass rounded-xl border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground/80">
                  <span className="font-medium text-foreground">Note:</span> B-roll clips are being fetched from external sources. If the video looks empty, please wait a few seconds for assets to load.
                </p>
              </div>
              <button
                onClick={() => setShowBRollNote(false)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss note"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Full-width transparent player container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          ref={playerRef}
          className={`${containerClass} mx-auto relative overflow-hidden rounded-2xl shadow-3xl`}
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}
        >
          <Player
            component={VantaShowcase}
            durationInFrames={totalFrames}
            fps={FPS}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            inputProps={inputProps}
            controls
            acknowledgeRemotionLicense={true}
          />
        </motion.div>
      </div>
    );
  }

  // AD mode: traditional card layout
  const isSaving = b2SaveStatus === 'saving';
  const isSaved = b2SaveStatus === 'saved';
  const saveError = b2SaveError;
  
  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      <CardHeader className="glass border-b border-border">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Generated Video Ad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {/* Save Campaign Success Card */}
        {isSaved && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-6 rounded-2xl glass border border-green-500/30 bg-green-50/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-500">Campaign Saved Successfully</h3>
                <p className="text-sm text-muted-foreground">Your campaign has been saved to cloud storage</p>
              </div>
            </div>
            <button
              onClick={handleViewInProjects}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              View in Projects
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
        
        {/* Save Campaign Error Card */}
        {saveError && !isSaving && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-6 rounded-2xl glass border border-red-500/30 bg-red-50/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-500">Failed to Save Campaign</h3>
                <p className="text-sm text-red-400/80">{saveError}</p>
              </div>
            </div>
            <button
              onClick={handleSaveCampaign}
              disabled={isSaving || !product}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CloudOff className="w-4 h-4" />
              Retry Save
            </button>
          </motion.div>
        )}
        
        {/* Save Campaign Button */}
        {!isSaved && !saveError && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <button
              onClick={handleSaveCampaign}
              disabled={isSaving || !product || isPreparingVideo}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Campaign...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  💾 Save Campaign
                </>
              )}
            </button>
            {isPreparingVideo && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Preparing your video...
              </p>
            )}
          </motion.div>
        )}
        
        {/* Video Player */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          ref={playerRef}
          className={`${containerClass} relative bg-black rounded-xl overflow-hidden shadow-2xl`}
        >
          <Player
            component={VantaShowcase}
            durationInFrames={totalFrames}
            fps={FPS}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            inputProps={inputProps}
            controls
            acknowledgeRemotionLicense={true}
          />
        </motion.div>
      </CardContent>
      <CardFooter className="glass border-t border-border p-6">
        <div className="flex items-center justify-center gap-6 w-full text-sm text-muted-foreground">
          {isGeneratingVoiceover && (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating voiceover...
            </span>
          )}
          {voiceoverUrl && (
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Voiceover ready
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
