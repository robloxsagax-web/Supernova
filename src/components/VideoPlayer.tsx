'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Player } from '@remotion/player';
import { VantaShowcase } from './vanta/VantaShowcase';
import { BRAND_PALETTES, BrandPaletteId } from '@/types/product';
import { Download, Music, Loader2 } from 'lucide-react';

const FPS = 30;

// CORS-open ambient music from a reliable public source
const BACKGROUND_MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

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
  const { bRollConfig, productImages } = store;
  const { script, product, videoSettings, generationType } = store;
  
  const playerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string>('');
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [isPreparingVideo, setIsPreparingVideo] = useState(true);
  const [showBRollNote, setShowBRollNote] = useState(true);
  
  // Derived values
  const { ratio, duration, captionStyle, brandPalette } = videoSettings;
  const brandPaletteObject = BRAND_PALETTES[brandPalette as BrandPaletteId] || BRAND_PALETTES['noir-gold'];
  const isVertical = ratio === '9:16';
  const compositionWidth = isVertical ? 1080 : 1920;
  const compositionHeight = isVertical ? 1920 : 1080;
  const totalFrames = duration * FPS;
  
  // Cleanup recorded blob URL on unmount
  useEffect(() => {
    return () => {
      if (recordedBlobUrl) {
        URL.revokeObjectURL(recordedBlobUrl);
      }
    };
  }, [recordedBlobUrl]);
  
  // Cleanup MediaRecorder on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);
  
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
        
        if (response.ok && mounted) {
          const blob = await response.blob();
          currentUrl = URL.createObjectURL(blob);
          setVoiceoverUrl(currentUrl);
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
  const onRecordingComplete = useCallback((blob: Blob, downloadUrl: string) => {
    // Clean up previous blob URL if exists
    if (recordedBlobUrl) {
      URL.revokeObjectURL(recordedBlobUrl);
    }

    setRecordedBlobUrl(downloadUrl);
    setIsDownloading(false);
    setDownloadProgress('');
  }, [recordedBlobUrl]);

  /**
   * Trigger the actual file download and cleanup
   */
  const triggerDownload = useCallback((downloadUrl: string) => {
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = 'brand-ad.mp4';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();

    // Clean up after a short delay to ensure download starts
    requestAnimationFrame(() => {
      document.body.removeChild(anchor);
      // Revoke the URL after click to free memory
      URL.revokeObjectURL(downloadUrl);
    });

    // Clear the recorded URL state
    setRecordedBlobUrl(null);
  }, []);

  /**
   * Start the recording process
   */
  const startRecording = useCallback(async (mimeType: string) => {
    const container = playerRef.current;
    if (!container) throw new Error('Player container not found');

    // Wait for canvas to be available (with timeout)
    let canvas: HTMLCanvasElement | null = null;
    const maxWaitTime = 10000; // 10 seconds timeout
    const checkInterval = 100;
    const startTime = Date.now();

    while (!canvas && (Date.now() - startTime) < maxWaitTime) {
      canvas = container.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }

    if (!canvas) {
      throw new Error('Canvas element not found after waiting. Please ensure the video player is fully loaded.');
    }

    // Get video stream from canvas
    const videoStream = canvas.captureStream(FPS);
    let combinedStream = videoStream;

    // Try to add audio
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      const destination = audioContext.createMediaStreamDestination();

      const audioElements = container.querySelectorAll('audio');

      for (const audio of audioElements) {
        try {
          audio.crossOrigin = 'anonymous';
          const source = audioContext.createMediaElementSource(audio);
          source.connect(destination);
        } catch {
          // Ignore audio capture errors
        }
      }

      const mixedStream = new MediaStream();
      videoStream.getVideoTracks().forEach(t => mixedStream.addTrack(t));
      destination.stream.getAudioTracks().forEach(t => mixedStream.addTrack(t));
      combinedStream = mixedStream;
    } catch (audioError) {
      console.log('Audio capture not available:', audioError);
    }

    // Store stream reference for cleanup
    streamRef.current = combinedStream;

    // Create MediaRecorder
    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 5000000,
    });

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    // Set up event handlers
    mediaRecorder.ondataavailable = (event) => {
      if (event.data?.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      setIsDownloading(false);
      setDownloadProgress('');
    };

    // Start recording
    mediaRecorder.start(1000);

    return mediaRecorder;
  }, []);

  /**
   * Stop recording and wait for all data to be available
   */
  const stopRecordingAndWait = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        reject(new Error('MediaRecorder not initialized'));
        return;
      }

      // Create a one-time handler for when recording stops
      const handleStop = () => {
        mediaRecorder.removeEventListener('stop', handleStop);
        mediaRecorder.removeEventListener('error', handleError);

        // Small delay to ensure all chunks are collected
        setTimeout(() => {
          try {
            const mimeType = mediaRecorder.mimeType || 'video/webm';
            const blob = new Blob(chunksRef.current, { type: mimeType });
            resolve(blob);
          } catch (error) {
            reject(error);
          }
        }, 100);
      };

      const handleError = () => {
        mediaRecorder.removeEventListener('stop', handleStop);
        mediaRecorder.removeEventListener('error', handleError);
        reject(new Error('MediaRecorder error event'));
      };

      mediaRecorder.addEventListener('stop', handleStop);
      mediaRecorder.addEventListener('error', handleError);

      // Stop the recording
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }

      // Clean up tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    });
  }, []);

  // EARLY RETURN AFTER ALL HOOKS
  if (!script || !product) return null;

  // Robust video download with onRecordingComplete callback
  const handleDownloadVideo = async () => {
    if (!playerRef.current) {
      alert('Player not ready. Please try again.');
      return;
    }

    // If we already have a recording, trigger download immediately
    if (recordedBlobUrl) {
      triggerDownload(recordedBlobUrl);
      return;
    }

    setIsDownloading(true);
    setDownloadProgress('Initializing...');

    try {
      // Wait for player to be fully loaded
      setDownloadProgress('Waiting for player...');
      
      // Wait until isPlayerLoaded is true
      const maxWaitTime = 15000; // 15 seconds timeout
      const startTime = Date.now();
      while (!isPlayerLoaded && (Date.now() - startTime) < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (!isPlayerLoaded) {
        throw new Error('Player did not load in time. Please try again.');
      }

      // Additional requestAnimationFrame delay to ensure canvas is painted
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      // Small delay to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 500));

      // Determine MIME type
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }

      setDownloadProgress('Starting recording...');

      // Start the recording
      await startRecording(mimeType);

      setDownloadProgress(`Recording ${duration} seconds...`);

      // Wait for the full duration
      await new Promise(resolve => setTimeout(resolve, (duration * 1000) + 500));

      setDownloadProgress('Finalizing recording...');

      // Stop recording and get the blob - this waits for onstop callback
      const blob = await stopRecordingAndWait();

      setDownloadProgress('Creating file...');

      // Create download URL from blob
      const downloadUrl = URL.createObjectURL(blob);

      // Call the completion callback
      onRecordingComplete(blob, downloadUrl);

      // Trigger download
      triggerDownload(downloadUrl);

    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
      setDownloadProgress('');
      alert('Download failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

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
    return (
      <div className="w-full">
        {/* B-Roll Loading Note */}
        {showBRollNote && generationType === 'b-roll' && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <span className="font-medium">Note:</span> B-roll clips are being fetched from external sources. If the video looks empty or doesn&apos;t play smoothly, please wait a few seconds for the assets to load and play it again.
                </p>
              </div>
              <button
                onClick={() => setShowBRollNote(false)}
                className="flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                aria-label="Dismiss note"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Full-width transparent player container */}
        <div 
          ref={playerRef} 
          className={`${containerClass} mx-auto relative overflow-hidden rounded-xl shadow-2xl`}
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
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
            inputProps={{
              script,
              product,
              settings: { ratio, duration, captionStyle, brandPalette },
              brandPalette: brandPaletteObject,
              voiceoverUrl,
              backgroundMusicUrl: BACKGROUND_MUSIC_URL,
              generationType,
              bRollConfig: bRollConfig || undefined,
              productImages: productImages || [],
            }}
            controls
            acknowledgeRemotionLicense={true}
          />
        </div>
        
        {/* Controls below video */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <Button
            onClick={handleDownloadVideo}
            disabled={isDownloading}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {downloadProgress || 'Recording...'}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Video
              </>
            )}
          </Button>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {voiceoverUrl ? '✅' : <Loader2 className="w-3 h-3 animate-spin" />}
              Voiceover {voiceoverUrl ? 'ready' : 'generating...'}
            </span>
            <span className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              Background music
            </span>
          </div>
        </div>
      </div>
    );
  }

  // AD mode: traditional card layout
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Generated Video Ad</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={playerRef} className={`${containerClass} relative bg-black rounded-lg overflow-hidden`}>
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
            inputProps={{
              script,
              product,
              settings: { ratio, duration, captionStyle, brandPalette },
              brandPalette: brandPaletteObject,
              voiceoverUrl,
              backgroundMusicUrl: BACKGROUND_MUSIC_URL,
              generationType,
              bRollConfig: bRollConfig || undefined,
              productImages: productImages || [],
            }}
            controls
            acknowledgeRemotionLicense={true}
          />
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleDownloadVideo}
            disabled={isDownloading}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {downloadProgress || 'Recording...'}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Video (MP4)
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col items-center gap-2 w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {isGeneratingVoiceover ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating voiceover...
              </span>
            ) : voiceoverUrl ? (
              <span>ElevenLabs voiceover ready</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-3 h-3" />
            <span>Background music enabled</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
