import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

// Cool animated Poly Robot for the Auth Page
const PolyRobot = ({ focusState, emailLength }: { focusState: 'idle' | 'email' | 'password' | 'loading' | 'error', emailLength: number }) => {
  // Eye variations based on state
  const isPassword = focusState === 'password';
  const isEmail = focusState === 'email';
  const isLoading = focusState === 'loading';
  const isError = focusState === 'error';

  // Calculate some head movement based on email string length
  const lookOffset = isEmail ? Math.min(emailLength * 2, 30) - 15 : 0;

  return (
    <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
      {/* Small floating thoughts */}
      <AnimatePresence>
        {isEmail && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-0 right-4 bg-white text-zinc-900 text-xs px-3 py-1.5 rounded-xl font-bold shadow-lg"
          >
            I'm reading that! ¬‿¬
          </motion.div>
        )}
        {isPassword && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-0 left-4 bg-white text-zinc-900 text-xs px-3 py-1.5 rounded-xl font-bold shadow-lg"
          >
            No peeking! 🙈
          </motion.div>
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-4 right-10 flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.6 }}
                className="w-2 h-2 rounded-full bg-white"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.svg
        width="200" height="200" viewBox="0 0 200 200"
        className="drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]"
      >
        {/* Antennas */}
        <motion.line
          x1="100" y1="80" x2="100" y2="40"
          stroke="#475569" strokeWidth="4"
          animate={{ scaleY: isLoading ? [1, 1.2, 1] : 1, y: isLoading ? [-2, 2, -2] : 0 }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
        <motion.circle cx="100" cy="40" r="8" fill={isError ? "#ef4444" : isLoading ? "#3b82f6" : "#cbd5e1"} 
          animate={isLoading ? { scale: [1, 1.5, 1], fill: ["#3b82f6", "#60a5fa", "#3b82f6"] } : {}}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />

        {/* Head */}
        <motion.rect
          x="60" y="80" width="80" height="70" rx="15"
          fill="#1e293b"
          stroke="#334155" strokeWidth="4"
          animate={{
            rotate: isPassword ? 5 : isError ? [-5, 5, -5, 5, 0] : 0,
            x: lookOffset
          }}
          transition={
            isError 
              ? { rotate: { duration: 0.4 }, x: { type: "spring", stiffness: 200, damping: 15 } } 
              : { type: "spring", stiffness: 200, damping: 15 }
          }
        />

        {/* Face Screen */}
        <motion.rect
          x="70" y="90" width="60" height="40" rx="8"
          fill="#0f172a"
          animate={{ x: lookOffset }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />

        {/* Eyes inside Face Screen */}
        {/* Eye 1 */}
        <motion.path
          d={
            isPassword ? "M 78 105 L 90 105" : // Closed Line
            isError ? "M 78 100 L 90 110 M 78 110 L 90 100" : // X
            "M 80 105 A 4 4 0 1 0 88 105 A 4 4 0 1 0 80 105" // Open Circle (Default)
          }
          fill={isPassword || isError ? "transparent" : "#3b82f6"}
          stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"
          animate={{ x: lookOffset + (isEmail ? lookOffset * 0.2 : 0) }}
        />
        {/* Eye 2 */}
        <motion.path
          d={
            isPassword ? "M 110 105 L 122 105" :
            isError ? "M 110 100 L 122 110 M 110 110 L 122 100" :
            "M 112 105 A 4 4 0 1 0 120 105 A 4 4 0 1 0 112 105"
          }
          fill={isPassword || isError ? "transparent" : "#3b82f6"}
          stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"
          animate={{ x: lookOffset + (isEmail ? lookOffset * 0.2 : 0) }}
        />

        {/* Arms (Covering Eyes when Password focused) */}
        <motion.g
          animate={{
            y: isPassword ? -40 : 0,
            x: isPassword ? 0 : 0,
            opacity: isPassword ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
        >
          {/* Left Arm covering */}
          <rect x="65" y="140" width="30" height="15" rx="5" fill="#475569" stroke="#334155" strokeWidth="2" transform="rotate(-30 80 140)"/>
          {/* Right Arm covering */}
          <rect x="105" y="140" width="30" height="15" rx="5" fill="#475569" stroke="#334155" strokeWidth="2" transform="rotate(30 120 140)"/>
        </motion.g>

        {/* Body Base */}
        <path d="M 75 160 Q 100 150 125 160 L 130 190 L 70 190 Z" fill="#1e293b" stroke="#334155" strokeWidth="3" />
      </motion.svg>
    </div>
  );
};

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for interactive robot
  const [focusState, setFocusState] = useState<'idle' | 'email' | 'password' | 'loading' | 'error'>('idle');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFocusState('loading');
    setError(null);

    // Wait a tiny bit just to show the loading animation of robot
    await new Promise(r => setTimeout(r, 800));

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
        setError('Connection failed. Please ensure you have added a valid Supabase URL and Anon Key to your environment variables or Developer Settings.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
      setFocusState('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Side - Interactive Poly Robot */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900 border-r border-white/5 flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-zinc-900 to-zinc-900"></div>
        <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 w-full max-w-lg">
          <PolyRobot focusState={focusState} emailLength={email.length} />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              CreatorFlow<span className="text-blue-500">.</span>OS
            </h2>
            <p className="text-lg text-zinc-400 font-medium max-w-md mx-auto">
              Your automated companion. Provide access credentials to initiate your creative engine.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-surface relative">
        <div className="max-w-md w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left mb-10"
          >
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
              {isSignUp ? 'Initialize Access' : 'Welcome back, Creator'}
            </h1>
            <p className="text-on-surface-variant text-lg">
              {isSignUp ? 'Generate your secure creative workspace.' : 'Enter your credentials to continue.'}
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3"
              >
                <span className="material-symbols-outlined text-red-500">error</span>
                <p className="mt-0.5">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email Identity</label>
              <input
                type="email"
                value={email}
                onFocus={() => setFocusState('email')}
                onBlur={() => setFocusState('idle')}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm outline-none font-medium"
                placeholder="creator@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Secure Passkey</label>
              <input
                type="password"
                value={password}
                onFocus={() => setFocusState('password')}
                onBlur={() => setFocusState('idle')}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm outline-none font-medium text-lg tracking-widest"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                isSignUp ? 'Generate Workspace' : 'Authorize Access'
              )}
            </motion.button>
          </form>

          <div className="mt-12 text-center text-sm">
            <p className="text-on-surface-variant font-medium">
              {isSignUp ? 'Already authorized?' : "Need a workspace?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setFocusState('idle');
                }}
                className="text-blue-600 hover:text-blue-700 hover:underline font-bold transition-colors"
              >
                {isSignUp ? 'Sign in here' : 'Sign up now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
