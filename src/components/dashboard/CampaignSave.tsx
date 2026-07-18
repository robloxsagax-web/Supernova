'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { storageService } from '@/lib/storage';
import { Save, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function CampaignSave() {
  const { product, script, marketIntelligence, adImages, saveCampaignToB2 } = useStore();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (saveStatus === 'saving') return;
    
    setSaveStatus('saving');
    setError(null);

    try {
      // Generate campaign ID
      const campaignId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Get generation time (estimate based on current time minus page load)
      const generationTime = Math.round(performance.now());

      // Prepare data
      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          productTitle: product?.title || 'Untitled Campaign',
          productDescription: product?.description || '',
          prompt: product?.features?.join(', ') || '',
          aiProvider: 'genblaze',
          generationTime,
          script: script || undefined,
          marketIntelligence: marketIntelligence || undefined,
          images: adImages.length > 0 ? adImages : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save campaign');
      }

      setSaveStatus('saved');
      
      // Reload campaigns in Gallery
      const { loadB2Campaigns } = useStore.getState();
      await loadB2Campaigns();
      
    } catch (err) {
      console.error('Save campaign failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaveStatus('error');
    }
  };

  const handleRetry = () => {
    setSaveStatus('idle');
    setError(null);
    handleSave();
  };

  // Don't show if no product
  if (!product) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="p-6 rounded-2xl glass border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Campaign Complete
            </h3>
            <p className="text-sm text-muted-foreground">
              Save your campaign to access it later
            </p>
          </div>
          
          {/* Status Icon */}
          {saveStatus === 'saved' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center"
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
            </motion.div>
          )}
          {saveStatus === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center"
            >
              <AlertCircle className="w-6 h-6 text-red-500" />
            </motion.div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {saveStatus === 'idle' && (
            <Button
              onClick={handleSave}
              className="flex-1 h-12 rounded-xl gradient-primary text-background font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Campaign
            </Button>
          )}
          
          {saveStatus === 'saving' && (
            <Button
              disabled
              className="flex-1 h-12 rounded-xl bg-primary/50 text-background font-semibold cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </Button>
          )}
          
          {saveStatus === 'saved' && (
            <Button
              disabled
              className="flex-1 h-12 rounded-xl bg-green-500/20 text-green-500 font-semibold cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Saved
            </Button>
          )}
          
          {saveStatus === 'error' && (
            <>
              <Button
                onClick={handleRetry}
                className="flex-1 h-12 rounded-xl gradient-primary text-background font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Retry
              </Button>
              <Button
                onClick={() => setSaveStatus('idle')}
                variant="outline"
                className="h-12 rounded-xl border-border text-foreground hover:bg-white/5"
              >
                Dismiss
              </Button>
            </>
          )}
        </div>

        {/* Campaign Summary */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Product:</span>
              <span className="ml-2 text-foreground font-medium line-clamp-1">
                {product?.title || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Images:</span>
              <span className="ml-2 text-foreground font-medium">
                {adImages.length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Script:</span>
              <span className="ml-2 text-foreground font-medium">
                {script ? 'Generated' : 'Not available'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Insights:</span>
              <span className="ml-2 text-foreground font-medium">
                {marketIntelligence ? 'Generated' : 'Not available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
