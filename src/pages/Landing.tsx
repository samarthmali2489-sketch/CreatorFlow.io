import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  
  // ensure we scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 font-sans selection:bg-primary-container selection:text-on-primary-container pb-0">
      
      {/* Navigation */}
      <header className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">bolt</span>
          </div>
          CreatorFlow
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-semibold">
          <a href="#capabilities" className="text-zinc-500 hover:text-zinc-900 transition-colors">Capabilities</a>
          <a href="#pricing" className="text-zinc-500 hover:text-zinc-900 transition-colors">Pricing</a>
          <a href="#enterprise" className="text-zinc-500 hover:text-zinc-900 transition-colors">Enterprise</a>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/auth" className="hidden sm:block text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">Log in</Link>
          <Link to="/auth" className="bg-primary hover:bg-primary-dim text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm shadow-primary/20">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-[1200px] mx-auto px-6">
        <section className="py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide mb-8 border border-primary/20">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            The Content Infrastructure
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] text-zinc-900 mb-8 max-w-4xl">
            Architect your <span className="text-primary">content.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl font-medium mb-12 leading-relaxed">
            A utilitarian approach to digital presence. Transform core assets into synchronized channels with mathematical precision.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link to="/auth" className="bg-primary text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              Start Building
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link to="/auth" className="bg-white text-zinc-700 border border-zinc-200 px-8 py-4 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors shadow-sm">
              Documentation
            </Link>
          </div>
        </section>

        {/* Capabilities */}
        <section id="capabilities" className="py-24 border-t border-zinc-200">
          <div className="flex flex-col md:flex-row justify-between mb-16 gap-8 items-end">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary mb-3 font-bold">Module 01</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">Precision Capabilities.</h2>
            </div>
            <div className="md:w-[400px]">
              <p className="text-zinc-500 text-base leading-relaxed font-medium">Built for high-output environments requiring absolute structural integrity of brand voice.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 01: Video to Reels (Span 2) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-10 lg:p-12 hover:shadow-xl hover:shadow-zinc-200/50 transition-all border border-zinc-200 group flex flex-col justify-between min-h-[360px] relative overflow-hidden">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-12 border border-blue-100">
                <span className="material-symbols-outlined text-[32px]">smartphone</span>
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-extrabold mb-3 tracking-tight text-zinc-900 group-hover:text-primary transition-colors">Video to Reels</h3>
                <p className="text-zinc-500 text-base leading-relaxed max-w-[80%] font-medium">Algorithmic extraction of high-retention narrative segments from long-form content, optimized automatically for vertical viewing.</p>
              </div>
            </div>

            {/* 02: Post Creator (Span 1) */}
            <div className="md:col-span-1 bg-zinc-950 text-white rounded-3xl p-10 lg:p-12 shadow-xl border border-zinc-800 transition-all group flex flex-col justify-between min-h-[360px]">
              <div className="w-16 h-16 bg-zinc-800 text-zinc-300 rounded-2xl flex items-center justify-center mb-12 border border-zinc-700">
                <span className="material-symbols-outlined text-[32px]">edit_document</span>
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-extrabold mb-3 tracking-tight">Post Creator</h3>
                <p className="text-zinc-400 text-base leading-relaxed font-medium">Omnichannel post synthesis engineered to replicate your specific brand voice across all major platforms.</p>
              </div>
            </div>

            {/* 03: LinkedIn Carousel Maker (Span 1) */}
            <div className="md:col-span-1 bg-primary text-white rounded-3xl p-10 lg:p-12 shadow-xl border border-primary-dim transition-all group flex flex-col justify-between min-h-[360px]">
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-12 border border-white/30">
                <span className="material-symbols-outlined text-[32px]">view_carousel</span>
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-extrabold mb-3 tracking-tight leading-tight">LinkedIn Carousel Maker</h3>
                <p className="text-blue-100 text-base leading-relaxed font-medium">Systematic conversion of unstructured ideas into high-conversion PDF slide decks.</p>
              </div>
            </div>

            {/* 04: Thumbnail Maker (Span 2) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-10 lg:p-12 hover:shadow-xl hover:shadow-zinc-200/50 transition-all border border-zinc-200 group flex flex-col justify-between min-h-[360px]">
               <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-12 border border-indigo-100">
                <span className="material-symbols-outlined text-[32px]">wallpaper</span>
               </div>
               <div>
                 <h3 className="text-2xl lg:text-3xl font-extrabold mb-3 tracking-tight text-zinc-900 group-hover:text-primary transition-colors">Thumbnail Maker</h3>
                 <p className="text-zinc-500 text-base leading-relaxed max-w-[80%] font-medium">Generate CTR-optimized YouTube assets utilizing deep style-transfer and reference image uploading to exactly map your existing channel aesthetics.</p>
               </div>
            </div>
          </div>
        </section>

        {/* Pricing Structure */}
        <section id="pricing" className="py-24 border-t border-zinc-200">
          <div className="mb-16 text-center md:text-left">
            <div className="text-xs uppercase tracking-widest text-primary mb-3 font-bold">Module 02</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">Pricing Structure.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className="bg-white rounded-3xl p-10 border border-zinc-200 shadow-sm flex flex-col hover:shadow-lg transition-shadow">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold tracking-wide mb-6 border border-zinc-200">Basic</div>
               <div className="flex items-baseline gap-2 mb-10">
                 <span className="text-6xl font-black tracking-tighter text-zinc-900">$0</span>
                 <span className="text-sm text-zinc-500 font-semibold">/mo</span>
               </div>
               
               <ul className="space-y-4 flex-1 mb-10 text-sm text-zinc-600 font-medium">
                 <li className="flex items-start gap-3">
                   <span className="material-symbols-outlined text-[20px] text-zinc-400">check</span>
                   <span>150 Free Credits / Mo</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <span className="material-symbols-outlined text-[20px] text-zinc-400">check</span>
                   <span>All Platform Features Unlocked</span>
                 </li>
                 <li className="flex items-start gap-3 pl-8 text-zinc-500">
                   <span className="text-xs opacity-60 mt-1">↳</span>
                   <span>30 Credits / Reels Export</span>
                 </li>
                 <li className="flex items-start gap-3 pl-8 text-zinc-500">
                   <span className="text-xs opacity-60 mt-1">↳</span>
                   <span>10 Credits / Core Features</span>
                 </li>
               </ul>

               <Link to="/auth" className="w-full border border-zinc-200 py-3.5 rounded-xl font-bold bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors flex items-center justify-center">Get Started Free</Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-zinc-950 text-white rounded-3xl p-10 border border-zinc-800 shadow-xl flex flex-col relative scale-[1.02] z-10">
               <div className="absolute -top-4 inset-x-0 flex justify-center">
                 <div className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-primary-dim">Most Popular</div>
               </div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold tracking-wide mb-6 border border-zinc-700 self-start">Professional</div>
               <div className="flex items-baseline gap-2 mb-10">
                 <span className="text-6xl font-black tracking-tighter">$19</span>
                 <span className="text-sm text-zinc-400 font-semibold">/mo</span>
               </div>
               
               <ul className="space-y-4 flex-1 mb-10 text-sm text-zinc-300 font-medium">
                 <li className="flex items-start gap-3">
                   <span className="material-symbols-outlined text-[20px] text-primary">check</span>
                   <span>1000 Monthly Credits</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <span className="material-symbols-outlined text-[20px] text-primary">check</span>
                   <span>All Platform Features Unlocked</span>
                 </li>
                 <li className="flex items-start gap-3 pl-8 text-zinc-400">
                   <span className="text-xs opacity-60 mt-1">↳</span>
                   <span>30 Credits / Reels Export</span>
                 </li>
                 <li className="flex items-start gap-3 pl-8 text-zinc-400">
                   <span className="text-xs opacity-60 mt-1">↳</span>
                   <span>10 Credits / Core Features</span>
                 </li>
               </ul>

               <Link to="/auth" className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20 flex items-center justify-center">Upgrade to Pro</Link>
            </div>

            {/* Infinity / Enterprise Plan */}
            <div id="enterprise" className="bg-white rounded-3xl p-10 border border-zinc-200 shadow-sm flex flex-col hover:shadow-lg transition-shadow">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold tracking-wide mb-6 border border-zinc-200 self-start">Enterprise</div>
               <div className="flex items-baseline gap-2 mb-10">
                 <span className="text-6xl font-black tracking-tighter text-zinc-900">$50</span>
                 <span className="text-sm text-zinc-500 font-semibold">/mo</span>
               </div>
               
               <ul className="space-y-4 flex-1 mb-10 text-sm text-zinc-600 font-medium">
                 <li className="flex items-start gap-3">
                   <span className="material-symbols-outlined text-[20px] text-zinc-400">check</span>
                   <span>Infinite Generations</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <span className="material-symbols-outlined text-[20px] text-zinc-400">check</span>
                   <span>All Platform Features Unlocked</span>
                 </li>
                 <li className="flex items-start gap-3 pl-8 text-zinc-500">
                   <span className="text-xs opacity-60 mt-1">↳</span>
                   <span>Dedicated Infrastructure</span>
                 </li>
                 <li className="flex items-start gap-3 pl-8 text-zinc-500">
                   <span className="text-xs opacity-60 mt-1">↳</span>
                   <span>API Documentation Access</span>
                 </li>
               </ul>

               <Link to="/auth" className="w-full border border-zinc-200 py-3.5 rounded-xl font-bold bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors flex items-center justify-center">Request Access</Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-zinc-100 pt-20 pb-12 mt-12 w-full border-t border-zinc-200">
        <div className="max-w-[1200px] mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 text-zinc-900">
              <div className="md:col-span-5">
                <div className="text-lg font-black tracking-tight flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-primary rounded bg-opacity-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[14px]">bolt</span>
                  </div>
                  CreatorFlow
                </div>
                <div className="text-sm text-zinc-500 leading-relaxed font-medium">
                   © 2026 CreatorFlow AI<br/>
                   Engineered for the precision architect.
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs font-bold mb-6 text-zinc-900 uppercase tracking-wider">Platform</div>
                <div className="flex flex-col gap-4 text-sm text-zinc-500 font-medium">
                   <a href="#" className="hover:text-primary transition-colors">Privacy Protocol</a>
                   <a href="#" className="hover:text-primary transition-colors">Terms of Operation</a>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs font-bold mb-6 text-zinc-900 uppercase tracking-wider">Resources</div>
                <div className="flex flex-col gap-4 text-sm text-zinc-500 font-medium">
                   <a href="#" className="hover:text-primary transition-colors">System Status</a>
                   <a href="#" className="hover:text-primary transition-colors">Documentation</a>
                </div>
              </div>
              <div className="md:col-span-3 lg:col-span-2">
                <div className="text-xs font-bold mb-6 text-zinc-900 uppercase tracking-wider">Social</div>
                <div className="flex flex-col gap-4 text-sm text-zinc-500 font-medium">
                   <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                   <a href="#" className="hover:text-primary transition-colors">X / Twitter</a>
                </div>
              </div>
           </div>
        </div>
      </footer>

    </div>
  );
}
