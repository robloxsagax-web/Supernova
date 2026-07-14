'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Sparkles, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

type UrlFormData = z.infer<typeof urlSchema>;

export function URLInputForm() {
  const { setStep, setLoading } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
  });

  const onSubmit = async (data: UrlFormData) => {
    setIsSubmitting(true);
    setLoading(true);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In real implementation, this would call the API
    console.log('Product URL:', data.url);
    
    setLoading(false);
    setStep('product');
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="relative p-8 rounded-3xl glass overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-maroon/10 via-transparent to-peach/10" />
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-maroon/20 to-peach/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-peach/20 to-maroon/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 glow-maroon"
            >
              <LinkIcon className="w-8 h-8 text-peach" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Enter Product URL
            </h2>
            <p className="text-muted-foreground">
              Paste any product URL to start generating marketing assets
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative group">
              <input
                type="url"
                placeholder="https://amazon.com/product/..."
                {...register('url')}
                className="w-full h-14 px-6 pr-14 rounded-2xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-peach/50 focus:bg-white/10 transition-all duration-300 text-base"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-maroon/10 to-peach/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            </div>
            
            {errors.url && (
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-sm text-error px-4"
              >
                {errors.url.message}
              </motion.p>
            )}

            {/* Example URLs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['Amazon', 'Shopify', 'eBay', 'Etsy'].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  className="px-4 py-1.5 rounded-lg text-xs text-muted-foreground glass hover:text-foreground hover:bg-white/10 transition-all duration-300"
                >
                  {platform}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-4"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl gradient-primary text-base font-semibold text-background hover:opacity-90 transition-all duration-300 shadow-lg glow-maroon disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start Campaign
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Automatic Research', icon: '🔍' },
                { label: 'AI-Powered Copy', icon: '✨' },
                { label: 'Video Generation', icon: '🎬' },
              ].map((feature) => (
                <div key={feature.label} className="space-y-1">
                  <div className="text-2xl">{feature.icon}</div>
                  <p className="text-xs text-muted-foreground">{feature.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
