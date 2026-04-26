import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured) {
      setError('Connection failed. Database configuration missing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Verification email sent. Please check your inbox.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-primary/20 selection:text-primary">
      
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-zinc-900">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none">
          <motion.div 
            animate={{ 
              x: ['0%', '5%', '-5%', '0%'],
              y: ['0%', '10%', '-5%', '0%'],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary/40 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: ['0%', '-10%', '5%', '0%'],
              y: ['0%', '-5%', '10%', '0%'],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/40 blur-[120px]"
          />
        </div>

        {/* Brand / Typography overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full">
          <Link to="/" className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">stream</span>
            </div>
            Klipora.
          </Link>

          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6"
            >
              Unleash your creative potential.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/70 font-medium leading-relaxed"
            >
              Every tool you need to ideate, craft, and distribute content faster than ever before.
            </motion.p>
          </div>

          <div className="text-sm font-medium text-white/50">
            © {new Date().getFullYear()} Klipora. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-hidden bg-white dark:bg-zinc-950">
        {/* Mobile back button */}
        <Link to="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-semibold text-sm">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </Link>

        {/* Ambient subtle glow behind form in light mode, mostly hidden in dark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none opacity-50 dark:opacity-20"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Logo on mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[24px]">stream</span>
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-zinc-500 font-medium text-base">
              {isSignUp ? 'Join thousands of creators building the future.' : 'Enter your details to access your workspace.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium flex items-start gap-3">
                    <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">error</span>
                    <p className="leading-relaxed">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-zinc-400 group-focus-within/input:text-primary transition-colors text-[20px]">mail</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium placeholder:text-zinc-400"
                  placeholder="creator@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Password</label>
                {!isSignUp && (
                  <button type="button" className="text-sm font-semibold text-primary hover:text-primary-dim transition-colors">Forgot?</button>
                )}
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-zinc-400 group-focus-within/input:text-primary transition-colors text-[20px]">lock</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium placeholder:text-zinc-400 tracking-widest"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-primary text-white rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary-dim disabled:opacity-70 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
              ) : (
                <>
                  {isSignUp ? 'Get Started' : 'Log In'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-zinc-500 font-medium text-sm">
              {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-primary hover:text-primary-dim font-bold transition-colors"
              >
                {isSignUp ? 'Log in here' : 'Sign up for free'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
