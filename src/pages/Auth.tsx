import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

// Cozy, relaxed animated Cat
const CozyCat = ({ focusState, inputLength }: { focusState: 'idle' | 'email' | 'password' | 'loading' | 'error', inputLength: number }) => {
  const isPassword = focusState === 'password';
  const isEmail = focusState === 'email';
  const isLoading = focusState === 'loading';
  const isError = focusState === 'error';
  const isIdle = focusState === 'idle';

  // Calculate subtle eye movement based on typing
  const lookOffset = isEmail ? Math.min(inputLength, 15) - 7.5 : 0;

  return (
    <div className="relative w-80 h-80 mx-auto mb-8 flex items-center justify-center">
      
      {/* Floating Zzz's when sleeping/idle */}
      <AnimatePresence>
        {(isIdle || isLoading) && !isError && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 0, x: -10, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -60, x: 10, scale: 1.5 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 }}
              className="absolute top-16 right-20 text-white/60 font-black text-xl"
            >
              z
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 0, x: -10, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -70, x: 20, scale: 1.2 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-12 right-12 text-white/50 font-black text-2xl"
            >
              Z
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating alert when error */}
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-10 right-14 bg-white text-rose-500 rounded-full px-3 py-1 font-bold text-sm shadow-lg"
          >
            !
          </motion.div>
        )}
      </AnimatePresence>

      <svg width="260" height="260" viewBox="0 0 200 200" className="drop-shadow-2xl z-10 relative">
        {/* Tail (swishes gently when idle or typing, spiked when error) */}
        <motion.path 
          d="M 145 150 C 190 140, 190 80, 150 75" 
          fill="none" 
          stroke="#f97316" 
          strokeWidth="18" 
          strokeLinecap="round"
          animate={{ 
            rotate: isIdle ? [0, 8, 0] : isError ? -15 : 0, 
            transformOrigin: "145px 150px",
            scale: isError ? 1.05 : 1
          }}
          transition={
            isError 
              ? { type: "spring", stiffness: 300, damping: 10 } 
              : { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
          }
        />
        
        {/* Shadow under cat */}
        <ellipse cx="100" cy="165" rx="60" ry="12" fill="#000000" opacity="0.2" />

        {/* Body Group - Breathing animation */}
        <motion.g 
          animate={{ 
            scaleY: isIdle || isLoading ? [1, 1.04, 1] : 1, 
            y: isIdle || isLoading ? [0, -2, 0] : 0 
          }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        >
          {/* Main Body */}
          <ellipse cx="100" cy="140" rx="55" ry="38" fill="#f97316" />
          {/* Light Belly */}
          <ellipse cx="100" cy="148" rx="35" ry="22" fill="#fef3c7" />
        </motion.g>

        {/* Head Group */}
        <motion.g
          animate={{ 
            y: isIdle ? [0, 2, 0] : isPassword ? 8 : isError ? -5 : 0,
            rotate: isEmail && inputLength > 5 ? (inputLength % 2 === 0 ? 2 : -2) : 0
          }}
          transition={
            isIdle || isLoading 
              ? { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
              : { type: "spring", stiffness: 150, damping: 15 }
          }
        >
          {/* Back Ears (Orange) */}
          <polygon points="65,90 50,45 90,65" fill="#f97316" />
          <polygon points="135,90 150,45 110,65" fill="#f97316" />
          
          {/* Inside Ears (Soft Pink) */}
          <polygon points="65,85 55,55 85,70" fill="#fbcfe8" />
          <polygon points="135,85 145,55 115,70" fill="#fbcfe8" />
          
          {/* Face Base */}
          <circle cx="100" cy="98" r="42" fill="#f97316" />
          
          {/* Snout/Muzzle (Cream) */}
          <ellipse cx="100" cy="112" rx="22" ry="14" fill="#fef3c7" />
          
          {/* Nose (Pink) */}
          <circle cx="100" cy="105" r="4.5" fill="#f43f5e" />
          
          {/* Mouth (Happy W) */}
          <path d="M 94 112 Q 97 116 100 112 L 100 112 Q 103 116 106 112" fill="none" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />

          {/* Eyes Base (Closed for sleeping/idle/password, Open for Email, X for Error) */}
          <motion.g animate={{ x: lookOffset }}>
            {isEmail ? (
              // Awake tracking eyes
              <>
                <circle cx="80" cy="92" r="5" fill="#451a03" />
                <circle cx="120" cy="92" r="5" fill="#451a03" />
              </>
            ) : isError ? (
              // Error eyes (X's)
              <>
                <path d="M 75 88 L 85 96 M 75 96 L 85 88" stroke="#451a03" strokeWidth="3" strokeLinecap="round"/>
                <path d="M 115 88 L 125 96 M 115 96 L 125 88" stroke="#451a03" strokeWidth="3" strokeLinecap="round"/>
              </>
            ) : (
              // Sleeping / Relaxed curves
              <>
                <path d="M 72 92 Q 80 97 88 92" fill="none" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
                <path d="M 112 92 Q 120 97 128 92" fill="none" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
          </motion.g>

          {/* Slight blush */}
          <circle cx="68" cy="106" r="6" fill="#fca5a5" opacity="0.4" />
          <circle cx="132" cy="106" r="6" fill="#fca5a5" opacity="0.4" />
        </motion.g>

        {/* Front Paws (Animate up to hide eyes during password) */}
        <motion.g
          animate={{ 
            y: isPassword ? -34 : isIdle ? [0, -1, 0] : 0, 
            x: isPassword ? 0 : 0 
          }}
          transition={
            isPassword 
              ? { type: "spring", stiffness: 200, damping: 20 }
              : { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
          }
        >
          {/* Left Paw */}
          <rect x="72" y="140" width="20" height="28" rx="10" fill="#f97316" />
          <path d="M 78 160 L 78 165 M 86 160 L 86 165" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Right Paw */}
          <rect x="108" y="140" width="20" height="28" rx="10" fill="#f97316" />
          <path d="M 114 160 L 114 165 M 122 160 L 122 165" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
      </svg>
    </div>
  );
};

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for interactive cozy cat
  const [focusState, setFocusState] = useState<'idle' | 'email' | 'password' | 'loading' | 'error'>('idle');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured) {
      setError('Connection failed. Please ensure the backend is properly configured with your Supabase credentials.');
      setFocusState('error');
      return;
    }

    setLoading(true);
    setFocusState('loading');
    setError(null);

    // Artificial delay for relaxing visual
    await new Promise(r => setTimeout(r, 1200));

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
        setFocusState('idle');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Connection failed. Please ensure your Supabase parameters are correct.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
      setFocusState('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-blue-500/30 selection:text-blue-900">
      
      {/* Left Side - Dark Mode & Cozy Animation */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12 bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,58,138,0.2)_0%,_rgba(15,23,42,1)_100%)] z-10 pointer-events-none"></div>
        {/* Soft magical stars/dust */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full opacity-50 animate-ping shadow-[0_0_10px_white]"></div>
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-blue-200 rounded-full opacity-30 animate-pulse shadow-[0_0_10px_blue]"></div>
        <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"></div>
        
        <div className="relative z-20 w-full max-w-lg flex flex-col items-center">
          <CozyCat focusState={focusState} inputLength={email.length} />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-6"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
              Rest easy, we've got the <span className="text-blue-400">heavy lifting.</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
              Log in to let your AI agents handle the grind while you focus on the creative vision.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Light Mode Sleek Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden bg-white">
        {/* Subtle right-side ambient warmth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none text-transparent">glow</div>

        <div className="max-w-md w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left mb-10"
          >
            <div className="lg:hidden mb-12">
               <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.3)]">
                  <span className="material-symbols-outlined text-white text-xl">stream</span>
               </div>
            </div>
            {/* Logo for Auth Header */}
            <div className="hidden lg:flex items-center gap-2 text-xl font-black text-slate-900 tracking-tighter mb-12">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">stream</span>
              </div>
              Klipora.
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {isSignUp ? 'Create Workspace' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              {isSignUp ? 'Set up your creative environment.' : 'Take a deep breath and jump back in.'}
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-medium border border-rose-100 flex items-start gap-3">
                  <span className="material-symbols-outlined text-rose-500">error</span>
                  <p className="mt-0.5 leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2 relative group">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 transition-colors ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-blue-500 transition-colors">mail</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onFocus={() => setFocusState('email')}
                  onBlur={() => setFocusState('idle')}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm outline-none font-medium placeholder:text-slate-400"
                  placeholder="creator@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 transition-colors">Password</label>
                {!isSignUp && (
                  <button type="button" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-blue-500 transition-colors">key</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onFocus={() => setFocusState('password')}
                  onBlur={() => setFocusState('idle')}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm outline-none font-medium placeholder:text-slate-400 tracking-widest"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] hover:bg-primary-dim disabled:opacity-70 flex items-center justify-center gap-2 mt-8 transition-all"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-white">refresh</span>
              ) : (
                <>
                  {isSignUp ? 'Create Workspace' : 'Log In'}
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center text-sm">
            <p className="text-slate-500 font-medium">
              {isSignUp ? 'Already have an account?' : "New to Klipora?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setFocusState('idle');
                }}
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors ml-1"
              >
                {isSignUp ? 'Sign in' : 'Sign up for free'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
