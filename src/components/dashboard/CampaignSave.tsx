'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { CheckCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

export function CampaignSave() {
  const { product, script, marketIntelligence, adImages, b2SaveStatus, b2SaveError, retrySaveCampaign } = useStore();

  // Only show if auto-save failed
  if (b2SaveStatus !== 'error') return null;

  // Don't show if no product
  if (!product) return null;

  const handleRetry = () => {
    retrySaveCampaign();
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="p-6 rounded-2xl glass border border-red-500/30 bg-red-500/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-1">
              Save Failed
            </h3>
            <p className="text-sm text-muted-foreground">
              Campaign was not saved to Gallery
            </p>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center"
          >
            <AlertCircle className="w-6 h-6 text-red-500" />
          </motion.div>
        </div>

        {/* Error Message */}
        {b2SaveError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {b2SaveError}
          </div>
        )}

        {/* Retry Button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRetry}
            disabled={b2SaveStatus === 'saving'}
            className="flex-1 h-12 rounded-xl gradient-primary text-background font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {b2SaveStatus === 'saving' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Retry Save
              </>
            )}
          </Button>
        </div>

        {/* Campaign Summary */}
        <div className="mt-4 pt-4 border-t border-red-500/20">
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
