'use client';

import { useState, useEffect, useCallback, memo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Mail, 
  Lock, 
  User, 
  Sparkle,
  Video, 
  ImageIcon, 
  Brain, 
  Rocket, 
  BarChart3, 
  Cloud,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

// Premium Brand Logo - Official PNG Supernova Logo
const SupernovaLogo = memo(function SupernovaLogo({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('relative', className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Image
        src="/Logo.png"
        alt="Supernova Logo"
        width={48}
        height={48}
        className="drop-shadow-lg"
        priority
      />
    </motion.div>
  );
});

// Premium Feature Card Component
const FeatureCard = memo(function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color,
  index
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  color: string;
  index?: number;
}) {
  return (
    <motion.div
      className="relative p-5 rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        background: 'rgba(17, 17, 17, 0.5)',
        border: '1px solid rgba(255, 218, 185, 0.08)',
        backdropFilter: 'blur(20px)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + (index || 0) * 0.08, duration: 0.4 }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        borderColor: `${color}40`
      }}
    >
      {/* Subtle glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${color}15 0%, transparent 60%)`,
        }}
      />
      
      {/* Accent line on hover */}
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
      
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon container with glow */}
        <div 
          className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`,
            boxShadow: `0 0 20px ${color}15`
          }}
        >
          {/* Inner glow effect */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${color}40 0%, transparent 60%)`
            }}
          />
          <Icon 
            className="w-5 h-5 relative z-10" 
            style={{ color }} 
            strokeWidth={1.75} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white mb-1.5 tracking-tight">{title}</h4>
          <p className="text-xs text-[rgba(255,255,255,0.45)] leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
});

// Stats Counter
const StatsCounter = memo(function StatsCounter({ 
  value, 
  label 
}: { 
  value: string; 
  label: string;
}) {
  return (
    <div className="text-center px-4">
      <motion.div
        className="text-2xl font-bold bg-gradient-to-r from-[#FFDAB9] to-[#8B5A2B] bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {value}
      </motion.div>
      <div className="text-xs text-[rgba(255,255,255,0.4)] mt-1.5 tracking-wide">{label}</div>
    </div>
  );
});

// Input Field Component
const InputField = memo(function InputField({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  name,
  error,
}: {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center group-focus-within:border-[#5C3317] transition-colors">
          <Icon className="w-4 h-4 text-[rgba(255,255,255,0.4)] group-focus-within:text-[#FFDAB9] transition-colors" />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full pl-14 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.03)] border transition-all duration-300 outline-none',
            error 
              ? 'border-red-500/50 focus:border-red-500' 
              : 'border-[rgba(255,255,255,0.08)] focus:border-[#5C3317] focus:bg-[rgba(255,255,255,0.05)]'
          )}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </motion.p>
      )}
    </div>
  );
});

// Tab Button Component
const TabButton = memo(function TabButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative px-6 py-2.5 text-sm font-medium transition-colors duration-300',
        active ? 'text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white'
      )}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#5C3317] to-[#FFDAB9] rounded-full"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
});

// Premium Button
const PremiumButton = memo(function PremiumButton({
  children,
  onClick,
  loading,
  variant = 'primary',
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}) {
  const baseClasses = 'relative px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#5C3317] to-[#8B5A2B] text-[#FFDAB9] hover:shadow-[0_0_30px_rgba(92,51,23,0.5)]',
    secondary: 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]',
    ghost: 'text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      className={cn(baseClasses, variants[variant], loading && 'opacity-50 cursor-not-allowed', className)}
      whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
      />
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : children}
      </span>
    </motion.button>
  );
});

// Features data with premium descriptions
const FEATURES = [
  { icon: Video, title: 'AI Video Studio', description: 'Professional-grade video generation', color: '#FF6B00' },
  { icon: ImageIcon, title: 'Image Generation', description: 'High-converting visual creatives', color: '#22C55E' },
  { icon: Brain, title: 'Marketing Intelligence', description: 'Deep competitor & audience insights', color: '#8B5CF6' },
  { icon: Rocket, title: 'Campaign Automation', description: 'One-click multi-channel execution', color: '#F59E0B' },
  { icon: BarChart3, title: 'Performance Analytics', description: 'Real-time campaign tracking', color: '#3B82F6' },
  { icon: Cloud, title: 'Cloud Projects', description: 'Secure asset management & sync', color: '#06B6D4' },
];

function AuthPageContent() {
  const router = useRouter();
  const { isLoggedIn, isLoading, login, signup, demoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in (after loading is complete)
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoading, isLoggedIn, router]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setFormError(null);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (activeTab === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [activeTab, formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeTab === 'signin') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          router.push('/dashboard');
        } else {
          setFormError(result.error || 'Sign in failed');
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      } else {
        const result = await signup(formData.name, formData.email, formData.password);
        if (result.success) {
          setSuccessMessage('Account created successfully! Please sign in.');
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          setActiveTab('signin');
        } else {
          setFormError(result.error || 'Sign up failed');
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      }
    } catch (err) {
      setFormError('An unexpected error occurred');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  }, [activeTab, formData, login, signup, router, validateForm]);

  const handleDemoLogin = useCallback(() => {
    demoLogin();
    router.push('/dashboard');
  }, [demoLogin, router]);

  const handleTabSwitch = useCallback((tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setFormError(null);
    setSuccessMessage(null);
    setErrors({});
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] flex overflow-hidden">
      {/* Left Panel - 55% */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#09090B] via-[#0D0D10] to-[#09090B]" />
          
          {/* Aurora glows */}
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(92, 51, 23, 0.4) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 218, 185, 0.3) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, delay: 5 }}
          />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
          
          {/* Noise texture */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 w-full">
          {/* Logo & Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-10"
          >
            <SupernovaLogo />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#FFDAB9] via-[#8B5A2B] to-[#FFDAB9] bg-clip-text text-transparent">
                  SUPERNOVA
                </span>
              </h1>
              <p className="text-sm text-[rgba(255,255,255,0.45)] mt-1 tracking-wide">AI Marketing Agent Platform</p>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-5xl font-bold leading-tight mb-4 tracking-tight">
              <span className="text-white">Transform ideas into </span>
              <span className="bg-gradient-to-r from-[#FFDAB9] to-[#8B5A2B] bg-clip-text text-transparent">
                high-converting campaigns
              </span>
            </h2>
            <p className="text-base text-[rgba(255,255,255,0.55)] leading-relaxed max-w-lg">
              Generate stunning videos, create image ads, research competitors, write persuasive copy. 
              All powered by autonomous AI agents.
            </p>
          </motion.div>

          {/* Capability Cards - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 mb-10"
          >
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-between px-8 py-5 rounded-2xl"
            style={{
              background: 'rgba(17, 17, 17, 0.6)',
              border: '1px solid rgba(255, 218, 185, 0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />
            <StatsCounter value="10K+" label="Campaigns Created" />
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />
            <StatsCounter value="99.2%" label="Success Rate" />
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />
            <StatsCounter value="45s" label="Avg Render Time" />
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />
            <StatsCounter value="24/7" label="AI Agent Online" />
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Right Panel - 45% */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(92, 51, 23, 0.2) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* Auth Card */}
        <motion.div
          className={cn(
            'relative w-full max-w-md p-8 rounded-3xl',
            'bg-[rgba(255,218,185,0.03)] backdrop-blur-2xl',
            'border border-[rgba(255,218,185,0.12)]',
            'shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]',
            shake && 'animate-shake'
          )}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <SupernovaLogo />
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-[#5C3317] to-[#FFDAB9] bg-clip-text text-transparent">
                SUPERNOVA
              </span>
            </h1>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-[rgba(255,255,255,0.5)]">
              {activeTab === 'signin' 
                ? 'Sign in to access your AI Marketing Workspace'
                : 'Join Supernova and start creating campaigns'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] mb-8">
            <TabButton 
              active={activeTab === 'signin'} 
              onClick={() => handleTabSwitch('signin')}
            >
              Sign In
            </TabButton>
            <TabButton 
              active={activeTab === 'signup'} 
              onClick={() => handleTabSwitch('signup')}
            >
              Sign Up
            </TabButton>
          </div>

          {/* Error/Success Messages */}
          <AnimatePresence mode="wait">
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{formError}</p>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
              >
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-300">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === 'signup' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <InputField
                    icon={User}
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <InputField
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            
            <InputField
              icon={Lock}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
            />

            <AnimatePresence mode="wait">
              {activeTab === 'signup' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <InputField
                    icon={Lock}
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember me for signin only */}
            <AnimatePresence mode="wait">
              {activeTab === 'signin' && (
                <motion.div
                  key="extras"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#5C3317] checked:border-[#5C3317]"
                    />
                    <span className="text-[rgba(255,255,255,0.5)] group-hover:text-white transition-colors">
                      Remember me
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <PremiumButton 
              type="submit" 
              loading={isSubmitting}
              className="w-full mt-6"
            >
              {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </PremiumButton>
          </form>

          {/* Demo Login */}
          <div className="mt-6">
            <div className="relative flex items-center gap-4">
              {/* Left line fragment */}
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
              
              {/* Text with transparent background */}
              <span className="text-xs text-[rgba(255,255,255,0.3)] whitespace-nowrap">or continue with</span>
              
              {/* Right line fragment */}
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
            </div>
            
            <PremiumButton
              variant="secondary"
              onClick={handleDemoLogin}
              className="w-full mt-4"
            >
              <Sparkle className="w-4 h-4" />
              Explore Demo
            </PremiumButton>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-[rgba(255,255,255,0.4)]">
            {activeTab === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button 
                  onClick={() => handleTabSwitch('signup')}
                  className="text-[#FFDAB9] hover:text-white transition-colors"
                >
                  Create one today
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => handleTabSwitch('signin')}
                  className="text-[#FFDAB9] hover:text-white transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoadingScreen />}>
      <AuthPageContent />
    </Suspense>
  );
}

// Premium Loading Screen
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#09090B] via-[#0D0D10] to-[#09090B]" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(92, 51, 23, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="mb-8"
        >
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5C3317] via-[#8B5A2B] to-[#FFDAB9] opacity-50 blur-sm" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#5C3317] via-[#8B5A2B] to-[#FFDAB9] p-[3px]">
              <div className="w-full h-full rounded-full bg-[#09090B] flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Image
                    src="/Logo.png"
                    alt="Supernova Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Brand name */}
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          <span className="bg-gradient-to-r from-[#5C3317] via-[#8B5A2B] to-[#FFDAB9] bg-clip-text text-transparent">
            SUPERNOVA
          </span>
        </h1>

        {/* Loading text */}
        <p className="text-sm text-[rgba(255,255,255,0.5)] mb-8">
          Initializing AI Workspace...
        </p>

        {/* Progress bar */}
        <div className="w-48 h-1 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#5C3317] to-[#FFDAB9]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>

        {/* Please wait */}
        <p className="text-xs text-[rgba(255,255,255,0.3)] mt-4">
          Please wait...
        </p>
      </motion.div>
    </div>
  );
}
