import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Side - Image/Animation */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900 items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            alt="Abstract 3D shapes" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent"></div>
        </div>
        <div className="relative z-10 p-12 max-w-xl text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
            <span className="material-symbols-outlined text-5xl text-white">auto_awesome</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            The ultimate engine for your content creation.
          </h2>
          <p className="text-lg text-zinc-300 leading-relaxed">
            Turn videos into viral reels, generate high-converting carousels, and manage your entire creator workflow in one place.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-surface">
        <div className="max-w-md w-full">
          <div className="text-left mb-10">
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-on-surface-variant text-lg">
              {isSignUp ? 'Start automating your content today.' : 'Sign in to continue to your workspace.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="mt-0.5">{error}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-lg hover:bg-primary-dim hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-on-surface-variant">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-primary hover:underline font-bold"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
