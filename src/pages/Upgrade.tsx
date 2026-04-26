import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Upgrade() {
  const { credits, subscriptionPlan, setSubscriptionPlan } = useAppContext();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Use the env var checkout URL, fall back to a default demo Lemon Squeezy URL
  const [lsCheckoutUrl] = useState(() => {
    return import.meta.env.VITE_LEMON_SQUEEZY_CHECKOUT_URL || "https://creator-flow-io.lemonsqueezy.com/checkout/buy/2af2c0ff-2dbe-4309-a6c6-b15853ae6e8b";
  });

  // Check for successful redirect from LemonSqueezy hosted checkout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('success') || urlParams.has('orderId') || urlParams.has('checkoutId')) {
        setSubscriptionPlan((window as any).__pendingPlan || 'pro');
        setShowSuccessMessage(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [setSubscriptionPlan]);

  useEffect(() => {
    // Dynamically load the Lemon.js script for the overlay
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://app.lemonsqueezy.com/js/lemon.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if ((window as any).createLemonSqueezy) {
          (window as any).createLemonSqueezy();
          
          if ((window as any).LemonSqueezy && (window as any).LemonSqueezy.Setup) {
            (window as any).LemonSqueezy.Setup({
              eventHandler: (event: any) => {
                if (event.event === 'Checkout.Success') {
                  const plan = (window as any).__pendingPlan || 'pro';
                  setSubscriptionPlan(plan);
                  setShowSuccessMessage(true);
                }
              }
            });
          }
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [setSubscriptionPlan]);

  const handleUpgradeClick = (e: React.MouseEvent, plan: 'pro' | 'infinity', checkoutUrl: string) => {
    e.preventDefault();
    (window as any).__pendingPlan = plan;
    if (typeof window !== 'undefined' && (window as any).LemonSqueezy && (window as any).LemonSqueezy.Url) {
      // Open in Lemon Squeezy overlay for a seamless experience
      (window as any).LemonSqueezy.Url.Open(checkoutUrl);
    } else {
      // Fallback to redirecting to the hosted page
      window.open(checkoutUrl, '_self');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 lg:p-12 relative">

      {showSuccessMessage && (
        <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-700 dark:text-green-400 font-bold text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4">
          <span className="material-symbols-outlined">check_circle</span>
          Upgrade Successful! Welcome to Pro.
        </div>
      )}
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">Upgrade Your Flow</h1>
        <p className="text-on-surface-variant text-xl max-w-2xl mx-auto">Choose the perfect plan to scale your content creation.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Free Plan */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/20 flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Starter Plan</h2>
          <p className="text-on-surface-variant mb-6">Perfect for getting started.</p>
          <div className="text-5xl font-black mb-8">$0<span className="text-lg text-on-surface-variant font-medium">/mo</span></div>
          
          <div className="bg-surface-container-low p-4 rounded-xl mb-8 flex items-center justify-between border border-outline-variant/20">
            <span className="text-sm font-bold text-on-surface-variant">Credits:</span>
            <span className="text-sm font-black text-on-surface">
              {subscriptionPlan === 'infinity' ? '∞' : subscriptionPlan === 'pro' ? `${credits} / 500` : `${credits} / 80`}
            </span>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> 80 Free Credits</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> 30 Credits per Video to Reel</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> 10 Credits per other features</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Access to ALL Features</li>
          </ul>
          
          {subscriptionPlan === 'free' ? (
            <button className="w-full py-4 rounded-xl font-bold bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors">Current Plan</button>
          ) : (
            <button disabled className="w-full py-4 rounded-xl font-bold bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 transition-colors opacity-50 cursor-not-allowed">Included</button>
          )}
        </div>

        {/* Starter Plan / Pro Plan */}
        <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[2rem] p-8 border border-zinc-800 flex flex-col relative transform md:-translate-y-4 shadow-lg">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white dark:text-zinc-900 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Most Popular</div>
          <h2 className="text-2xl font-bold mb-2">Pro Plan</h2>
          <p className="text-zinc-400 mb-6">Unlock full access to AI social media generation.</p>
          <div className="text-5xl font-black mb-8">$19<span className="text-lg text-zinc-400 font-medium">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400 text-sm">check_circle</span> <strong className="text-white dark:text-zinc-900">500 Credits</strong> per month</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400 text-sm">check_circle</span> High-fidelity Video to Reels</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400 text-sm">check_circle</span> Unlimited LinkedIn Carousels</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400 text-sm">check_circle</span> AI-powered YouTube Thumbnails ("Nano Banana")</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400 text-sm">check_circle</span> Export Videos to Reels, Shorts, and TikTok</li>
          </ul>
          
          {subscriptionPlan === 'pro' || subscriptionPlan === 'infinity' ? (
            <button className="w-full py-4 rounded-xl font-bold bg-surface-container text-on-surface transition-colors cursor-default text-center flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-green-400">check_circle</span>
              {subscriptionPlan === 'pro' ? 'Current Plan' : 'Included in Infinity'}
            </button>
          ) : (
            <button 
              onClick={(e) => handleUpgradeClick(e, 'pro', lsCheckoutUrl)}
              className="w-full py-4 rounded-xl font-bold bg-primary text-white dark:text-zinc-900 hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              Upgrade to Pro
            </button>
          )}
        </div>

        {/* Infinity Plan */}
        <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-[2rem] p-8 border border-primary/20 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-9xl text-primary">all_inclusive</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">Infinity</h2>
          <p className="text-on-surface-variant mb-6 relative z-10">For agencies and power users.</p>
          <div className="text-5xl font-black mb-8 relative z-10">$50<span className="text-lg text-on-surface-variant font-medium">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> <strong className="text-primary">Infinite Generations</strong></li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Premium AI Models</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Unlimited Profiles</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> API Access</li>
            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">check</span> Dedicated Account Manager</li>
          </ul>
          
          {subscriptionPlan === 'infinity' ? (
            <button className="w-full py-4 rounded-xl font-bold bg-surface-container text-on-surface transition-colors cursor-default text-center flex items-center justify-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
              Current Plan
            </button>
          ) : (
            <button 
              onClick={(e) => handleUpgradeClick(e, 'infinity', 'https://creator-flow-io.lemonsqueezy.com/checkout/buy/eacc7548-c9e0-4133-b4d6-f02d79c1841d')}
              className="w-full py-4 rounded-xl font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-black transition-colors relative z-10 text-center block"
            >
              Go Infinite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
