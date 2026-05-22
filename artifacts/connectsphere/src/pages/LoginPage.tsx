import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, Shield, Users, Sparkles, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/context/AuthContext';

interface DemoCard {
  role: UserRole;
  label: string;
  name: string;
  title: string;
  email: string;
  password: string;
  color: string;
  bg: string;
}

const DEMO_CARDS: DemoCard[] = [
  {
    role: 'employee',
    label: 'Employee',
    name: 'Alex Rivera',
    title: 'Senior Engineer',
    email: 'employee@connectsphere.com',
    password: 'password123',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/50',
  },
  {
    role: 'admin',
    label: 'HR Admin',
    name: 'Michael Torres',
    title: 'HR Director',
    email: 'admin@connectsphere.com',
    password: 'admin123',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50',
  },
  {
    role: 'ceo',
    label: 'CEO',
    name: 'Sarah Chen',
    title: 'Chief Executive Officer',
    email: 'ceo@connectsphere.com',
    password: 'ceo123',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50',
  },
];

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { loginWithCredentials } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('employee@connectsphere.com');
  const [password, setPassword] = useState('password123');
  const [activeCard, setActiveCard] = useState<UserRole>('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectDemoCard = (card: DemoCard) => {
    setActiveCard(card.role);
    setEmail(card.email);
    setPassword(card.password);
    setError(null);
  };

  const handleSignIn = () => {
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    // Small delay to show the loading state
    setTimeout(() => {
      const result = loginWithCredentials(email, password);
      if (result.success) {
        setLocation('/');
      } else {
        setLoading(false);
        setError(result.error ?? 'Sign in failed.');
      }
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSignIn();
  };

  return (
    <AuthLayout>
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={24} className="text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-foreground">ConnectSphere</span>
              <span className="text-sm font-semibold text-indigo-500 block -mt-1">AI Intranet</span>
            </div>
          </motion.div>
          <p className="text-muted-foreground text-sm">Your company, connected. Sign in to continue.</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-card-border rounded-2xl shadow-lg overflow-hidden">
          {/* Social sign-in */}
          <div className="p-6 pb-0">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <Button variant="outline" className="gap-2 h-10" data-testid="button-google-login">
                <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </Button>
              <Button variant="outline" className="gap-2 h-10" data-testid="button-microsoft-login">
                <svg viewBox="0 0 23 23" className="w-4 h-4"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#00a4ef" d="M12 0h11v11H12z"/><path fill="#7fba00" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg>
                Microsoft
              </Button>
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or sign in with email</span></div>
            </div>

            {/* Email + Password */}
            <div className="space-y-4" onKeyDown={handleKeyDown}>
              <div>
                <Label htmlFor="email" className="text-xs font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(null); }}
                  className="mt-1.5 h-10"
                  placeholder="you@connectsphere.com"
                  autoComplete="email"
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(null); }}
                    className="h-10 pr-10"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(v => !v)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5" data-testid="auth-error">
                    <AlertCircle size={13} className="flex-shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Demo account cards */}
          <div className="px-6 pt-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Demo accounts — click to fill credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CARDS.map(card => (
                <button
                  key={card.role}
                  onClick={() => selectDemoCard(card)}
                  className={`border rounded-xl p-3 text-left transition-all duration-200 cursor-pointer ${card.bg} ${activeCard === card.role ? 'ring-2 ring-primary' : ''}`}
                  data-testid={`button-login-${card.role}`}
                >
                  <div className={`text-xs font-bold ${card.color} mb-1`}>{card.label}</div>
                  <div className="text-xs font-medium text-foreground truncate">{card.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{card.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sign in button */}
          <div className="p-6 pt-4">
            <Button
              className="w-full h-10 gap-2"
              onClick={handleSignIn}
              disabled={loading}
              data-testid="button-sign-in"
            >
              {loading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Shield size={12} />SOC 2 Certified</span>
          <span className="flex items-center gap-1.5"><Users size={12} />245 Employees</span>
          <span className="flex items-center gap-1.5"><Sparkles size={12} />AI-Powered</span>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
