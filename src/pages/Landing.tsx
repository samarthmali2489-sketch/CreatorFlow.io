import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FloatingSpaceBackground } from '../components/FloatingSpaceBackground';

export default function Landing() {
  
  // ensure we scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 font-sans selection:bg-primary-container selection:text-on-primary-container pb-0 relative">
      <FloatingSpaceBackground />
      
      {/* Navigation */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center p-4 py-6 pointer-events-none">
        <header className="flex justify-between items-center px-4 md:px-6 py-3 border border-white/20 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] w-full max-w-[1000px] pointer-events-auto transition-all duration-300 hover:bg-white/80">
          <Link to="/" className="text-lg font-black tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
            </div>
            CreatorFlow
          </Link>
          <div className="hidden md:flex gap-1 p-1 bg-zinc-100/50 rounded-full border border-zinc-200/50">
            <a href="#capabilities" className="text-zinc-600 hover:text-zinc-900 hover:bg-white/60 px-4 py-1.5 rounded-full transition-colors text-sm font-semibold">Capabilities</a>
            <a href="#pricing" className="text-zinc-600 hover:text-zinc-900 hover:bg-white/60 px-4 py-1.5 rounded-full transition-colors text-sm font-semibold">Pricing</a>
            <a href="#enterprise" className="text-zinc-600 hover:text-zinc-900 hover:bg-white/60 px-4 py-1.5 rounded-full transition-colors text-sm font-semibold">Enterprise</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="hidden sm:block text-sm font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-full hover:bg-zinc-100/50 transition-colors">Log in</Link>
            <Link to="/auth" className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg border border-zinc-800">Start Free</Link>
          </div>
        </header>
      </div>

      {/* Hero */}
      <main className="max-w-[1200px] mx-auto px-6 relative z-10">
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

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto relative z-10">
            <Link to="/auth" className="bg-primary text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              Start Building
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link to="/auth" className="bg-white text-zinc-700 border border-zinc-200 px-8 py-4 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors shadow-sm">
              Documentation
            </Link>
          </div>
        </section>

        {/* Social Proof / Metrics */}
        <section className="pb-24 pt-12 border-b border-zinc-200 flex flex-col items-center">
            <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-8">Trusted by 10,000+ Next-Gen Creators</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="text-2xl font-black tracking-tighter">YouTube</div>
               <div className="text-2xl font-black tracking-tight">Instagram</div>
               <div className="text-2xl font-black tracking-normal">TikTok</div>
               <div className="text-2xl font-bold tracking-tight">LinkedIn</div>
               <div className="text-2xl font-black tracking-tighter italic">X / Twitter</div>
            </div>
        </section>

        {/* Capabilities */}
        <section id="capabilities" className="py-32">
          <div className="flex flex-col md:flex-row justify-between mb-20 gap-10 items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Module 01
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-[1.1]">
                Precision<br/>
                <span className="text-zinc-400">Capabilities.</span>
              </h2>
            </div>
            <div className="md:w-[450px]">
              <p className="text-zinc-500 text-lg leading-relaxed font-medium">Built for high-output environments requiring absolute structural integrity of brand voice and omnichannel scaling.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[380px]">
            {/* 01: Video to Reels (Span 7) */}
            <div className="lg:col-span-7 bg-white rounded-[2rem] p-10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-300 border border-zinc-200 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-12 -translate-y-12">
                <span className="material-symbols-outlined text-[200px]">smartphone</span>
              </div>
              
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[32px]">smartphone</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-3xl font-black tracking-tight text-zinc-900 group-hover:text-primary transition-colors">Video to Reels</h3>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold tracking-widest uppercase shadow-sm">AI Powered</span>
                </div>
                <p className="text-zinc-500 text-lg leading-relaxed max-w-[85%] font-medium">Algorithmic extraction of high-retention narrative segments from long-form content, optimized automatically for vertical viewing.</p>
              </div>
            </div>

            {/* 02: Post Creator (Span 5) */}
            <div className="lg:col-span-5 bg-zinc-950 text-white rounded-[2rem] p-10 shadow-2xl border border-zinc-800 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950"></div>
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-12 -translate-y-12 text-zinc-100">
                <span className="material-symbols-outlined text-[200px]">edit_document</span>
              </div>

              <div className="w-16 h-16 bg-zinc-800 text-zinc-300 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[32px]">edit_document</span>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight mb-4 group-hover:text-zinc-200 transition-colors">Post Creator</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium">Omnichannel post synthesis engineered to replicate your specific brand voice across all major platforms.</p>
              </div>
            </div>

            {/* 03: LinkedIn Carousel Maker (Span 5) */}
            <div className="lg:col-span-5 bg-primary text-white rounded-[2rem] p-10 shadow-2xl shadow-primary/20 hover:-translate-y-1 hover:shadow-primary/30 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dim"></div>
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none transform translate-x-12 -translate-y-12">
                <span className="material-symbols-outlined text-[200px]">view_carousel</span>
              </div>

              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[32px]">view_carousel</span>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight mb-4 leading-tight">LinkedIn Carousels</h3>
                <p className="text-blue-50 text-lg leading-relaxed font-medium">Systematic conversion of unstructured ideas into high-conversion PDF slide decks.</p>
              </div>
            </div>

            {/* 04: Thumbnail Maker (Span 7) */}
            <div className="lg:col-span-7 bg-white rounded-[2rem] p-10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-300 border border-zinc-200 group flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-12 -translate-y-12">
                <span className="material-symbols-outlined text-[200px]">wallpaper</span>
              </div>
              
               <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[32px]">wallpaper</span>
               </div>
               
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                   <h3 className="text-3xl font-black tracking-tight text-zinc-900 group-hover:text-indigo-600 transition-colors">Thumbnail Maker</h3>
                   <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold tracking-widest uppercase shadow-sm">Vision AI</span>
                 </div>
                 <p className="text-zinc-500 text-lg leading-relaxed max-w-[85%] font-medium">Generate CTR-optimized YouTube assets utilizing deep style-transfer and reference image uploading to exactly map your existing channel aesthetics.</p>
               </div>
            </div>
          </div>
        </section>

        {/* Workflow / Pipeline */}
        <section className="py-32">
          <div className="mb-24 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/20 mx-auto md:mx-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Module 02
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-[1.1]">
              The<br className="hidden md:block"/>
              <span className="text-zinc-400">Pipeline.</span>
            </h2>
            <p className="text-zinc-500 text-lg font-medium max-w-2xl mt-8 leading-relaxed mx-auto md:mx-0">Automate your content lifecycles from ideation to omnichannel distribution in three deterministic steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-zinc-200 via-primary/50 to-zinc-200 z-0"></div>

            <div className="flex flex-col relative z-10 group">
              <div className="w-36 h-36 bg-zinc-50 rounded-[2rem] border-2 border-zinc-200 flex items-center justify-center mb-8 shadow-sm group-hover:border-primary/50 transition-colors mx-auto md:mx-0 relative overflow-hidden backdrop-blur-xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                 <div className="text-6xl font-black text-zinc-200 font-mono tracking-tighter group-hover:text-primary/20 transition-colors relative z-10">01</div>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4 text-center md:text-left tracking-tight">Sync & Ingest</h3>
              <p className="text-zinc-500 font-medium leading-relaxed text-center md:text-left text-lg">Connect your existing accounts or drop in raw assets. We process the telemetry and extract the underlying narrative structures.</p>
            </div>
            
            <div className="flex flex-col relative z-10 group">
              <div className="w-36 h-36 bg-white rounded-[2rem] border-2 border-primary flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(var(--color-primary),0.15)] group-hover:scale-105 transition-transform mx-auto md:mx-0 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                 <div className="text-6xl font-black text-primary/30 font-mono tracking-tighter group-hover:text-primary transition-colors relative z-10">02</div>
              </div>
              <h3 className="text-2xl font-black text-primary mb-4 text-center md:text-left tracking-tight">Neural Transmutation</h3>
              <p className="text-zinc-500 font-medium leading-relaxed text-center md:text-left text-lg">Our models apply style-transfer algorithms to align the new assets perfectly with your established historical tone and brand voice.</p>
            </div>
            
            <div className="flex flex-col relative z-10 group">
              <div className="w-36 h-36 bg-zinc-50 rounded-[2rem] border-2 border-zinc-200 flex items-center justify-center mb-8 shadow-sm group-hover:border-primary/50 transition-colors mx-auto md:mx-0 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                 <div className="text-6xl font-black text-zinc-200 font-mono tracking-tighter group-hover:text-primary/20 transition-colors relative z-10">03</div>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4 text-center md:text-left tracking-tight">Omnichannel Export</h3>
              <p className="text-zinc-500 font-medium leading-relaxed text-center md:text-left text-lg">Deploy tailored variations to YouTube, LinkedIn, X, and TikTok simultaneously with format-specific optimizations.</p>
            </div>
          </div>
        </section>

        {/* Pricing Structure */}
        <section id="pricing" className="py-24 border-t border-zinc-200">
          <div className="mb-16 text-center md:text-left">
            <div className="text-xs uppercase tracking-widest text-primary mb-3 font-bold">Module 03</div>
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

        {/* FAQ & Support Section */}
        <section className="py-32">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Module 04
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-[1.1]">
                Operations &amp; <br/>
                <span className="text-zinc-400">Logistics.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Help Hub Focus Card */}
              <div className="md:col-span-5 bg-zinc-950 rounded-[2rem] p-8 text-white sticky top-32 shadow-2xl overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                   <span className="material-symbols-outlined text-[150px]">support_agent</span>
                 </div>
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-8 relative z-10 backdrop-blur-md">
                    <span className="material-symbols-outlined text-[32px] text-white">menu_book</span>
                 </div>
                 <h3 className="text-3xl font-black mb-4 tracking-tight relative z-10">Help Center &amp;<br/>Support Matrix</h3>
                 <p className="text-zinc-400 font-medium leading-relaxed mb-8 relative z-10">
                   Access detailed documentation directly inside your workspace, or ping our 24/7 dedicated engineering support channel for immediate unblocking.
                 </p>
                 <Link to="/auth" className="w-full bg-white text-zinc-900 py-3.5 rounded-xl font-bold hover:bg-zinc-100 transition-colors flex items-center justify-center border border-zinc-200 relative z-10">
                   Access Documentation
                 </Link>
              </div>

              {/* FAQs Accordion Replacement / Grid */}
              <div className="md:col-span-7 flex flex-col gap-6">
                
                <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 group cursor-default relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125"></div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3 flex items-center gap-3 relative z-10">
                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary shrink-0">
                       <span className="material-symbols-outlined text-[20px]">psychology</span>
                     </div>
                     Does it actually sound like me?
                  </h3>
                  <p className="text-zinc-500 font-medium leading-relaxed pl-12 ml-1 relative z-10">Yes. CreatorFlow analyzes your connected profiles (YouTube, LinkedIn) to extract structural data about your phrasing, pacing, and vocabulary. It doesn't use generic AI templates; it clones your blueprint.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all duration-300 group cursor-default relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 focus:outline rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125"></div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3 flex items-center gap-3 relative z-10">
                     <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 text-blue-600 shrink-0">
                       <span className="material-symbols-outlined text-[20px]">movie</span>
                     </div>
                     How does Video to Reels work?
                  </h3>
                  <p className="text-zinc-500 font-medium leading-relaxed pl-12 ml-1 relative z-10">Upload your horizontal video. Our AI face-tracking automatically crops perfectly to 9:16, extracts peak-retention moments, and burns-in Alex Hormozi-style dynamic captions.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-lg hover:border-amber-500/30 transition-all duration-300 group cursor-default relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125"></div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3 flex items-center gap-3 relative z-10">
                     <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 text-amber-600 shrink-0">
                       <span className="material-symbols-outlined text-[20px]">database</span>
                     </div>
                     How do credits work?
                  </h3>
                  <p className="text-zinc-500 font-medium leading-relaxed pl-12 ml-1 relative z-10">Credits map directly to compute cost. Heavy visual operations like <i>Video to Reels</i> cost 30 credits due to transcription and frame analysis. Text-based generations like Posts cost 10 credits.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-lg hover:border-rose-500/30 transition-all duration-300 group cursor-default relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125"></div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3 flex items-center gap-3 relative z-10">
                     <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300 text-rose-600 shrink-0">
                       <span className="material-symbols-outlined text-[20px]">cancel</span>
                     </div>
                     Can I cancel anytime?
                  </h3>
                  <p className="text-zinc-500 font-medium leading-relaxed pl-12 ml-1 relative z-10">Absolutely. The subscriptions are entirely self-managed. You can downgrade, pause, or terminate your license immediately from your dashboard settings panel.</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Ribbon */}
        <section className="py-32 border-t border-zinc-200 text-center relative overflow-hidden -mx-6 px-6 bg-zinc-950 text-white">
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 max-w-2xl mx-auto leading-[1.1]">
                Ready to scale your <span className="text-primary">architectural output?</span>
              </h2>
              <p className="text-zinc-400 font-medium mb-12 max-w-xl mx-auto text-lg">Stop doing manual distribution. Start building systems.</p>
              <Link to="/auth" className="inline-flex bg-primary text-white px-10 py-5 rounded-2xl text-base font-bold tracking-wide hover:bg-primary-dim transition-all shadow-[0_0_40px_rgba(var(--color-primary),0.3)] items-center justify-center gap-3 hover:scale-105 active:scale-95 duration-200">
                Launch CreatorFlow
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              </Link>
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
