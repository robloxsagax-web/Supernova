'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { 
  Sparkles, 
  Check, 
  ChevronDown, 
  Zap,
  Crown,
  Building2,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

// Pricing data
const plans = {
  starter: {
    name: 'Starter',
    badge: null,
    description: 'Perfect for learning and testing',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '5 Campaigns',
      'Image Generation',
      'Video Generation',
      'AI Copywriting',
      'Community Support',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  pro: {
    name: 'Pro',
    badge: 'MOST POPULAR',
    description: 'Best for creators and small businesses',
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      'Unlimited Campaigns',
      'AI Video Studio',
      'AI Image Studio',
      'Advanced Analytics',
      'Brand Kit',
      'Faster Rendering',
      'Priority Queue',
      'Premium Templates',
      'Priority Support',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    badge: null,
    description: 'Built for agencies and teams',
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      'Everything in Pro',
      'Team Workspace',
      'Unlimited Storage',
      'API Access',
      'Dedicated Infrastructure',
      'White Label',
      'SLA',
      'Dedicated Support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
};

const comparisonFeatures = [
  { name: 'Campaigns', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Video Ads', starter: true, pro: true, enterprise: true },
  { name: 'Image Ads', starter: true, pro: true, enterprise: true },
  { name: 'AI Copy', starter: true, pro: true, enterprise: true },
  { name: 'Projects', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Storage', starter: '1 GB', pro: '50 GB', enterprise: 'Unlimited' },
  { name: 'Support', starter: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
  { name: 'Priority Queue', starter: false, pro: true, enterprise: true },
  { name: 'API Access', starter: false, pro: false, enterprise: true },
  { name: 'Brand Kit', starter: false, pro: true, enterprise: true },
  { name: 'Analytics', starter: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
  { name: 'Team Workspace', starter: false, pro: false, enterprise: true },
];

const faqItems = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any differences.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Absolutely. Start with our free Starter plan and upgrade when you\'re ready. Pro comes with a 14-day money-back guarantee.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Cancel anytime with no questions asked. Your plan remains active until the end of your billing period.',
  },
  {
    question: 'Do you offer team discounts?',
    answer: 'Yes! Teams of 5+ get 20% off. Contact our sales team for custom enterprise pricing and dedicated support.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and wire transfers for annual enterprise contracts.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auth protection
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth');
    }
  }, [isLoggedIn, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] opacity-50 blur-sm animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#5C3317] to-[#FFDAB9] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#09090B]" />
          </div>
        </div>
      </div>
    );
  }

  // Don't Render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="min-h-screen relative">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#5C3317]/15 rounded-full blur-[200px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#FFDAB9]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/2 w-[500px] h-[500px] bg-[#5C3317]/10 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full"
            style={{
              background: 'rgba(255, 218, 185, 0.08)',
              border: '1px solid rgba(255, 218, 185, 0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Sparkles className="w-4 h-4 text-[#FFDAB9]" />
            <span className="text-xs font-medium text-[rgba(255,218,185,0.8)] uppercase tracking-wider">
              Transparent Pricing
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Choose Your </span>
            <span className="bg-gradient-to-r from-[#FFDAB9] via-[#FFDAB9] to-[#8B5A2B] bg-clip-text text-transparent">
              Plan
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-[rgba(255,255,255,0.5)] max-w-2xl mx-auto leading-relaxed">
            Scale your AI marketing workflow with premium features built for creators, startups, and growing businesses.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div 
            className="inline-flex items-center p-1 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 218, 185, 0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                !isYearly 
                  ? 'text-[#FFDAB9]' 
                  : 'text-[rgba(255,255,255,0.5)] hover:text-white'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2',
                isYearly 
                  ? 'text-[#FFDAB9]' 
                  : 'text-[rgba(255,255,255,0.5)] hover:text-white'
              )}
            >
              Yearly
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                  color: '#FFDAB9',
                }}
              >
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {/* Starter Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="relative rounded-3xl p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 218, 185, 0.08)',
            }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">{plans.starter.name}</h3>
              <p className="text-sm text-[rgba(255,255,255,0.5)]">{plans.starter.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isYearly ? 'yearly' : 'monthly'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-5xl font-bold text-white"
                  >
                    ${isYearly ? plans.starter.yearlyPrice : plans.starter.monthlyPrice}
                  </motion.span>
                </AnimatePresence>
                {plans.starter.monthlyPrice > 0 && (
                  <span className="text-[rgba(255,255,255,0.4)]">/mo</span>
                )}
              </div>
              {isYearly && plans.starter.yearlyPrice > 0 && (
                <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
                  ${plans.starter.yearlyPrice * 12}/year
                </p>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {plans.starter.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[rgba(34,197,94,0.2)] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#22C55E]" />
                  </div>
                  <span className="text-sm text-[rgba(255,255,255,0.7)]">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className={cn(
                'w-full py-4 rounded-xl font-semibold transition-all duration-300',
                'border text-[rgba(255,255,255,0.6)] cursor-default',
                'hover:border-[rgba(255,218,185,0.2)]'
              )}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(255, 218, 185, 0.1)',
              }}
            >
              {plans.starter.cta}
            </button>
          </motion.div>

          {/* Pro Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="relative rounded-3xl p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(92, 51, 23, 0.2) 0%, rgba(139, 90, 43, 0.1) 100%)',
              backdropFilter: 'blur(24px)',
              border: '2px solid rgba(255, 218, 185, 0.2)',
              boxShadow: '0 0 60px rgba(92, 51, 23, 0.3), 0 25px 50px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
                style={{
                  background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                  color: '#FFDAB9',
                  boxShadow: '0 0 20px rgba(92, 51, 23, 0.4)',
                }}
              >
                <Crown className="w-3 h-3" />
                {plans.pro.badge}
              </motion.div>
            </div>

            <div className="mb-6 pt-4">
              <h3 className="text-xl font-semibold text-white mb-2">{plans.pro.name}</h3>
              <p className="text-sm text-[rgba(255,255,255,0.5)]">{plans.pro.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isYearly ? 'yearly' : 'monthly'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-5xl font-bold text-white"
                  >
                    ${isYearly ? plans.pro.yearlyPrice : plans.pro.monthlyPrice}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[rgba(255,255,255,0.4)]">/mo</span>
              </div>
              {isYearly && (
                <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
                  ${plans.pro.yearlyPrice * 12}/year
                </p>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {plans.pro.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[rgba(34,197,94,0.2)] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#22C55E]" />
                  </div>
                  <span className="text-sm text-[rgba(255,255,255,0.7)]">{feature}</span>
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-4 rounded-xl font-semibold overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                color: '#FFDAB9',
                boxShadow: '0 0 30px rgba(92, 51, 23, 0.4)',
              }}
            >
              {/* Shine animation */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
              />
              <span className="relative flex items-center justify-center gap-2">
                {plans.pro.cta}
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>
          </motion.div>

          {/* Enterprise Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="relative rounded-3xl p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 218, 185, 0.08)',
            }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">{plans.enterprise.name}</h3>
              <p className="text-sm text-[rgba(255,255,255,0.5)]">{plans.enterprise.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
                Tailored for your needs
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {plans.enterprise.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[rgba(34,197,94,0.2)] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#22C55E]" />
                  </div>
                  <span className="text-sm text-[rgba(255,255,255,0.7)]">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={cn(
                'w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                'hover:border-[rgba(255,218,185,0.3)]'
              )}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 218, 185, 0.15)',
                color: '#FFDAB9',
              }}
            >
              <MessageCircle className="w-4 h-4" />
              {plans.enterprise.cta}
            </button>
          </motion.div>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Compare <span className="text-[#FFDAB9]">Features</span>
          </h2>

          <div 
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 218, 185, 0.08)',
            }}
          >
            {/* Table Header */}
            <div 
              className="grid grid-cols-4 gap-4 p-6"
              style={{
                borderBottom: '1px solid rgba(255, 218, 185, 0.08)',
              }}
            >
              <div className="text-sm font-medium text-[rgba(255,255,255,0.5)]">Feature</div>
              <div className="text-sm font-medium text-white text-center">Starter</div>
              <div className="text-sm font-medium text-[#FFDAB9] text-center">Pro</div>
              <div className="text-sm font-medium text-white text-center">Enterprise</div>
            </div>

            {/* Table Rows */}
            {comparisonFeatures.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="grid grid-cols-4 gap-4 p-6 items-center"
                style={{
                  borderBottom: i < comparisonFeatures.length - 1 
                    ? '1px solid rgba(255, 218, 185, 0.04)' 
                    : 'none',
                }}
              >
                <div className="text-sm text-[rgba(255,255,255,0.7)]">{feature.name}</div>
                <div className="text-sm text-white text-center">
                  {typeof feature.starter === 'boolean' ? (
                    feature.starter ? (
                      <Check className="w-5 h-5 text-[#22C55E] mx-auto" />
                    ) : (
                      <span className="text-[rgba(255,255,255,0.2)]">—</span>
                    )
                  ) : (
                    feature.starter
                  )}
                </div>
                <div className="text-sm text-white text-center">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? (
                      <Check className="w-5 h-5 text-[#22C55E] mx-auto" />
                    ) : (
                      <span className="text-[rgba(255,255,255,0.2)]">—</span>
                    )
                  ) : (
                    feature.pro
                  )}
                </div>
                <div className="text-sm text-white text-center">
                  {typeof feature.enterprise === 'boolean' ? (
                    feature.enterprise ? (
                      <Check className="w-5 h-5 text-[#22C55E] mx-auto" />
                    ) : (
                      <span className="text-[rgba(255,255,255,0.2)]">—</span>
                    )
                  ) : (
                    feature.enterprise
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked <span className="text-[#FFDAB9]">Questions</span>
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 218, 185, 0.08)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-base font-medium text-white">{item.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-[rgba(255,255,255,0.4)]" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-sm text-[rgba(255,255,255,0.5)] leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(92, 51, 23, 0.15) 0%, rgba(139, 90, 43, 0.05) 100%)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 218, 185, 0.1)',
          }}
        >
          {/* Glow effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#FFDAB9]/30 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#5C3317]/50 to-transparent" />

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to create better marketing faster?
          </h2>
          <p className="text-lg text-[rgba(255,255,255,0.5)] mb-10 max-w-xl mx-auto">
            Join thousands of creators using Supernova to build stunning marketing campaigns.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-semibold flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #5C3317 0%, #8B5A2B 100%)',
                color: '#FFDAB9',
                boxShadow: '0 0 40px rgba(92, 51, 23, 0.4)',
              }}
            >
              <Zap className="w-5 h-5" />
              Start Creating
            </motion.button>

            <button
              className="px-8 py-4 rounded-xl font-semibold flex items-center gap-2"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 218, 185, 0.15)',
                color: '#FFDAB9',
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
