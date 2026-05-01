import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ArrowRight, 
  Play, 
  Smartphone, 
  Layers, 
  Sparkles, 
  Github, 
  Twitter,
  MoveRight,
  Plus
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, direction = 'up' }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right', key?: React.Key }) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

const CapabilityCard = ({ icon: Icon, title, description, color, span, badge, children }: any) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className={`relative group overflow-hidden bg-white/80 dark:bg-zinc-900/40 backdrop-blur-3xl border border-zinc-200/50 dark:border-white/5 rounded-[3rem] p-10 flex flex-col justify-between ${span} shadow-2xl shadow-black/5 hover:shadow-primary/10 transition-all duration-500`}
  >
    <div className={`absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-1000 blur-[100px] -mr-40 -mt-40 pointer-events-none`} />
    
    <div className="relative z-10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center border border-zinc-200/50 dark:border-white/10 shadow-lg bg-white dark:bg-zinc-800 text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Icon size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white font-headline leading-none">
              {title}
            </h3>
            {badge && (
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/20">
                {badge}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-tight mb-10 max-w-sm">
        {description}
      </p>

      {/* Feature Visualization Slot */}
      <div className="flex-1 w-full bg-zinc-50/50 dark:bg-zinc-950/30 rounded-3xl border border-dashed border-zinc-200 dark:border-white/5 overflow-hidden p-4 relative group-hover:border-primary/30 transition-colors duration-500">
        {children}
      </div>

      <div className="mt-8 flex items-center gap-2 text-primary font-black text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0">
        Explore Module <MoveRight size={18} />
      </div>
    </div>
  </motion.div>
);

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-body selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-[100] flex justify-center p-6 pointer-events-none">
        <header className="flex justify-between items-center px-6 py-2 border border-zinc-200/50 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-full shadow-2xl shadow-black/5 w-full max-w-5xl pointer-events-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tighter font-headline">KLIPORA</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {['Capabilities', 'Pipeline', 'Pricing'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-5 py-2 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm font-bold text-zinc-600 dark:text-zinc-400 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
              Log in
            </Link>
            <Link to="/auth" className="bg-primary hover:bg-primary-dim text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
              Get Access
            </Link>
          </div>
        </header>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-xs font-bold tracking-widest uppercase mb-12">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Intelligence-Led Content Infrastructure
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.85] font-headline mb-12">
              <span className="block italic font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-primary-dim animate-gradient">Design</span>
              Your Impact.
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto font-medium mb-16 leading-tight">
              A high-precision engine for multi-channel dominance. <br className="hidden md:block"/>
              Engineered to turn unstructured signals into viral distribution.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
              <Link to="/auth" className="group bg-primary text-white px-10 py-5 rounded-[2rem] text-lg font-black tracking-tight hover:bg-primary-dim transition-all shadow-xl shadow-primary/25 flex items-center gap-3 hover:scale-105">
                Launch System
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-zinc-950 bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                  +1.2k
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-overlay animate-float" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-overlay animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Social Proof */}
      <section className="py-24 border-y border-zinc-100 dark:border-white/5 overflow-hidden">
        <div className="flex gap-20 whitespace-nowrap overflow-hidden group">
          <div className="flex gap-20 animate-infinite-scroll group-hover:pause duration-[40s]">
            {['YOUTUBE', 'INSTAGRAM', 'TIKTOK', 'LINKEDIN', 'TWITTER', 'THREADS', 'FACEBOOK', 'SUBSTACK'].map((label) => (
              <span key={label} className="text-4xl font-black font-headline tracking-tighter opacity-10 dark:opacity-5 hover:opacity-100 transition-opacity cursor-default">
                {label}
              </span>
            ))}
          </div>
          {/* Duplicate for seamless scroll */}
          <div className="flex gap-20 animate-infinite-scroll group-hover:pause duration-[40s]" aria-hidden="true">
            {['YOUTUBE', 'INSTAGRAM', 'TIKTOK', 'LINKEDIN', 'TWITTER', 'THREADS', 'FACEBOOK', 'SUBSTACK'].map((label) => (
              <span key={label + '-2'} className="text-4xl font-black font-headline tracking-tighter opacity-10 dark:opacity-5 hover:opacity-100 transition-opacity cursor-default">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-32">
            <div className="max-w-2xl">
              <FadeIn direction="left">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-12 h-px bg-primary" />
                  <span className="text-primary font-black tracking-[0.3em] text-xs uppercase">Engine Modules // 01</span>
                </div>
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter font-headline leading-[0.85]">
                  Absolute <br/>
                  <span className="text-zinc-200 dark:text-zinc-900 stroke-zinc-900/10 transition-colors">Output.</span>
                </h2>
              </FadeIn>
            </div>
            <FadeIn direction="right">
              <p className="text-xl text-zinc-500 dark:text-zinc-500 font-medium max-w-sm border-l-2 border-primary/20 pl-8">
                High-precision distribution systems for elite creators. Turn raw signals into narrative assets.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 auto-rows-[600px]">
             {/* 01: Video to Reels */}
             <CapabilityCard 
              span="md:col-span-12 lg:col-span-8"
              icon={Smartphone}
              title="Video to Reels"
              description="Algorithmic extraction of high-retention segments. Vertical optimization with dynamic face-tracking and auto-captioning."
              color="from-primary/30 to-transparent"
              badge="Coming Soon"
            >
              <div className="flex gap-6 h-full p-4 relative">
                {/* Main Video Frame */}
                <div className="w-[40%] h-[95%] bg-zinc-900 rounded-[2.5rem] border border-white/10 relative overflow-hidden self-end translate-y-6 group-hover:translate-y-2 transition-all duration-1000 shadow-2xl">
                   <div className="absolute top-6 left-1/2 -translate-x-1/2 h-1.5 w-12 bg-white/10 rounded-full" />
                   <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                   
                   {/* Face Tracking Box */}
                   <motion.div 
                     animate={{ 
                       x: [0, 10, -5, 0],
                       y: [0, 5, -10, 0]
                     }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-primary/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
                     <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />
                     <span className="absolute -top-6 left-0 text-[10px] font-black text-primary bg-zinc-900/80 px-2 py-0.5 rounded">ID: ACTIVE_SPEAKER</span>
                   </motion.div>

                   <div className="absolute bottom-12 inset-x-6 space-y-3">
                     <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ['0%', '100%'] }} 
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          className="h-full bg-primary" 
                        />
                     </div>
                     <p className="text-[10px] font-black text-white/80 leading-tight">"And that's why content intelligence is the next frontier..."</p>
                   </div>
                </div>

                {/* Analysis Sidebar */}
                <div className="flex-1 flex flex-col gap-4 py-8 opacity-40 group-hover:opacity-100 transition-all duration-700">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Retention Probability</span>
                      <span className="text-primary text-xs font-black">94%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full w-[94%] bg-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="aspect-video bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/50 dark:border-white/5 flex items-center justify-center">
                        <Play size={12} className="text-zinc-400" />
                      </div>
                    ))}
                  </div>

                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mt-auto">
                    <p className="text-[10px] font-mono text-primary/80 uppercase mb-1">Status Report</p>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-200">Narrative arc complete. Exporting vertical segments.</p>
                  </div>
                </div>
              </div>
            </CapabilityCard>

            {/* 02: Post Synthesis */}
            <CapabilityCard 
              span="md:col-span-12 lg:col-span-4"
              icon={Plus}
              title="Post Synthesis"
              description="Deterministic expansion tailored to your unique brand DNA across all channels."
              color="from-indigo-500/30 to-transparent"
            >
              <div className="h-full flex flex-col items-center justify-center p-6 space-y-6">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center relative">
                   <div className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full animate-slow-spin" />
                   <Zap size={32} className="text-indigo-500 animate-pulse" />
                </div>

                <div className="w-full space-y-3">
                   {[
                     { p: 'X', c: 'bg-zinc-900', t: 'Atomic Thread Expansion' },
                     { p: 'LI', c: 'bg-blue-600', t: 'Professional Synthesis' },
                     { p: 'INSTA', c: 'bg-pink-600', t: 'Visual Copywriter' }
                   ].map((item, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: -20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.15 }}
                       className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-white/10 flex items-center gap-3 group-hover:border-indigo-500/30 transition-colors shadow-sm"
                     >
                       <div className={`w-8 h-8 ${item.c} rounded-lg flex items-center justify-center text-white text-[10px] font-black`}>{item.p}</div>
                       <div className="flex-1">
                          <div className="h-1 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-1.5" />
                          <div className="h-1.5 w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-full" />
                       </div>
                     </motion.div>
                   ))}
                </div>
              </div>
            </CapabilityCard>

            {/* 04: Thumbnail Creator */}
            <CapabilityCard 
              span="md:col-span-12 lg:col-span-7"
              icon={Sparkles}
              title="Thumbnail Creator"
              description="CTR-optimized assets utilizing vision AI to map your aesthetic to viral visual patterns."
              color="from-amber-400/30 to-transparent"
              badge="Vision AI"
            >
               <div className="h-full flex gap-6 p-4 relative group/thumb">
                 <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] overflow-hidden relative border border-zinc-200/50 dark:border-white/5 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop" 
                      alt="Thumbnail Analysis" 
                      className="w-full h-full object-cover grayscale group-hover/thumb:grayscale-0 group-hover/thumb:scale-105 transition-all duration-1000" 
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-[10px] font-black uppercase tracking-widest bg-primary/20 backdrop-blur-md px-2 py-1 rounded">Visual Heatmap</span>
                        <div className="flex gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                           <span className="text-green-400 text-[10px] font-black">ACTIVE</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Est. CTR</span>
                        <span className="text-amber-400 text-lg font-black tracking-tighter">12.4%</span>
                      </div>
                    </div>

                    {/* AI Scanning Line */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 h-1/2 w-full -translate-y-full group-hover/thumb:animate-[scan_3s_linear_infinite] pointer-events-none" />
                 </div>
                 
                 <div className="hidden sm:flex flex-col gap-3 w-32 justify-center">
                    {[
                      { icon: 'target', label: 'Hook' },
                      { icon: 'face', label: 'Emotion' },
                      { icon: 'palette', label: 'Color' }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md border border-white/20 dark:border-white/5 p-3 rounded-2xl flex flex-col items-center gap-1 group-hover/thumb:translate-x-2 transition-transform duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                        <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-40">{item.label}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </CapabilityCard>

            {/* 04: Carousel Engine */}
            <CapabilityCard 
              span="md:col-span-12 lg:col-span-5"
              icon={Layers}
              title="Carousel Engine"
              description="Systematic conversion of unstructured signals into high-conversion PDF slides."
              color="from-blue-500/30 to-transparent"
            >
              <div className="h-full flex items-center justify-center relative translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                {/* 3D Stacked Slides */}
                <div className="relative w-64 h-80">
                  {[3, 2, 1].map((slide, i) => (
                    <motion.div 
                      key={slide}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ 
                        opacity: 1, 
                        scale: 1,
                        x: i * 20,
                        y: i * -20,
                        rotate: i * 2
                      }}
                      className="absolute inset-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-xl p-8 flex flex-col justify-between"
                    >
                       <div className="space-y-3">
                         <div className="h-2 w-12 bg-primary/20 rounded-full" />
                         <div className="h-6 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
                         <div className="h-4 w-2/3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg" />
                       </div>
                       
                       <div className="flex-1 flex flex-col justify-center gap-2 py-6">
                         {[1, 2, 3].map(line => (
                           <div key={line} className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                         ))}
                       </div>

                       <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Page 0{slide}</span>
                         <ArrowRight size={14} className="text-primary" />
                       </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CapabilityCard>
          </div>
        </div>
      </section>

      {/* Intelligence Layer Section (New Depth) */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div>
              <FadeIn direction="left">
                <span className="text-primary font-black tracking-[0.3em] text-xs uppercase mb-6 block">Deep Tech // 02</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter font-headline leading-[0.9] mb-12">
                  The Neural <br/> Backbone.
                </h2>
                <div className="space-y-12">
                   {[
                     { t: 'Multi-Modal DNA', d: 'Our engine processes video, audio, and text simultaneously to identify narrative high-points with 98% accuracy.' },
                     { t: 'Style Persistence', d: 'Klipora maps your historical performance data to ensure every new asset carries your unique brand signal.' },
                     { t: 'Deterministic Scaling', d: 'Remove the friction of distribution. One ingest point, total platform saturation in seconds.' }
                   ].map((feature, i) => (
                     <div key={i} className="flex gap-8 group">
                       <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black border border-primary/20 group-hover:scale-110 transition-transform">
                          {i + 1}
                       </div>
                       <div>
                         <h4 className="text-2xl font-black mb-3 font-headline uppercase tracking-tight">{feature.t}</h4>
                         <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-sm">{feature.d}</p>
                       </div>
                     </div>
                   ))}
                </div>
              </FadeIn>
            </div>

            <div className="relative">
              <FadeIn direction="right">
                <div className="aspect-square bg-zinc-50 dark:bg-zinc-900 rounded-[4rem] border border-zinc-200 dark:border-white/10 p-12 relative group">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                   
                   {/* Abstract Tech Visual */}
                   <div className="w-full h-full border border-dashed border-zinc-200 dark:border-white/10 rounded-[3rem] p-8 flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <div className="space-y-2">
                           <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">System Health</span>
                           <div className="flex gap-1 animate-pulse">
                              {[1, 2, 3, 4, 5].map(b => <div key={b} className="w-4 h-1 bg-primary rounded-full" />)}
                           </div>
                        </div>
                        <Zap className="text-primary fill-primary" size={24} />
                     </div>

                     <div className="flex-1 flex items-center justify-center">
                        <div className="relative w-full h-40">
                           <svg className="w-full h-full text-primary/20" viewBox="0 0 400 200">
                             <motion.path 
                               d="M0 100 Q 50 20, 100 100 T 200 180 T 300 40 T 400 100" 
                               fill="none" 
                               stroke="currentColor" 
                               strokeWidth="1"
                               initial={{ pathLength: 0 }}
                               whileInView={{ pathLength: 1 }}
                               transition={{ duration: 3 }}
                             />
                             <motion.path 
                               d="M0 80 Q 80 40, 150 120 T 300 20 T 400 80" 
                               fill="none" 
                               stroke="currentColor" 
                               strokeWidth="2"
                               className="text-primary"
                               initial={{ pathLength: 0 }}
                               whileInView={{ pathLength: 1 }}
                               transition={{ duration: 4 }}
                             />
                           </svg>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="h-12 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-white/10 p-4 flex items-center justify-between">
                          <span className="text-[10px] font-black text-zinc-400">LATENCY</span>
                          <span className="text-[10px] font-black text-primary">12ms</span>
                        </div>
                        <div className="h-12 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-white/10 p-4 flex items-center justify-between">
                          <span className="text-[10px] font-black text-zinc-400">NEURAL_LOAD</span>
                          <span className="text-[10px] font-black text-primary">2.4TFLOPS</span>
                        </div>
                     </div>
                   </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* The Pipeline */}
      <section id="pipeline" className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <span className="text-primary font-black tracking-[0.2em] text-xs uppercase mb-4 block">Workflow / 02</span>
             <h2 className="text-6xl md:text-8xl font-black tracking-tighter font-headline mb-8">The Pipeline.</h2>
             <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">Three deterministic steps from raw idea to global saturation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative">
            <div className="hidden md:block absolute top-20 left-[15%] right-[15%] h-[2px] bg-zinc-200 dark:bg-zinc-800" />
            
            {[
              { num: '01', title: 'Ingest', text: 'Connect sources or drop raw assets. We extract the narrative DNA.' },
              { num: '02', title: 'Transmute', text: 'Neural models align assets with your unique historical style.' },
              { num: '03', title: 'Deploy', text: 'Simultaneous distribution across X, LinkedIn, TikTok and YouTube.' }
            ].map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.2}>
                <div className="group relative text-center">
                  <div className="w-40 h-40 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-white/10 shadow-2xl shadow-black/5 flex items-center justify-center mx-auto mb-10 group-hover:-translate-y-2 transition-transform duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-7xl font-black font-headline text-zinc-100 dark:text-zinc-800 group-hover:text-white transition-colors relative z-10">{step.num}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-4 font-headline">{step.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed px-4">{step.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-primary font-black tracking-[0.2em] text-xs uppercase mb-4 block">Access Models / 03</span>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter font-headline">Pricing Structure.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Free */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[3rem] p-12 flex flex-col justify-between hover:shadow-2xl transition-all">
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-8 block">Entry</span>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-6xl font-black font-headline tracking-tighter">$0</span>
                  <span className="text-zinc-400 font-bold">/mo</span>
                </div>
                <ul className="space-y-6 mb-12">
                  {['80 Monthly Credits', 'Unlimited Posts', 'Basic Analysis'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 font-bold text-sm">
                      <Plus size={16} className="text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/auth" className="w-full py-5 border border-zinc-200 dark:border-white/10 rounded-2xl font-black text-sm tracking-tight text-center hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">Start Free</Link>
            </div>

            {/* Pro */}
            <div className="bg-primary rounded-[3rem] p-12 flex flex-col justify-between text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Zap size={150} fill="currentColor" />
              </div>
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-white/60 mb-8 block">Accelerator</span>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-6xl font-black font-headline tracking-tighter">$19</span>
                  <span className="text-white/60 font-bold">/mo</span>
                </div>
                <ul className="space-y-6 mb-12">
                  {['500 Monthly Credits', 'Vision AI Access', 'Reels + Shorts Pipeline'].map(f => (
                    <li key={f} className="flex items-center gap-3 font-bold text-sm">
                      <Plus size={16} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/auth" className="w-full py-5 bg-white text-primary rounded-2xl font-black text-sm tracking-tight text-center hover:bg-zinc-50 transition-colors shadow-xl">Go Pro</Link>
            </div>

            {/* Infinity */}
            <div className="bg-zinc-950 text-white rounded-[3rem] p-12 border border-white/10 flex flex-col justify-between hover:shadow-2xl transition-all">
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-zinc-500 mb-8 block">Absolute</span>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-6xl font-black font-headline tracking-tighter">$50</span>
                  <span className="text-zinc-500 font-bold">/mo</span>
                </div>
                <ul className="space-y-6 mb-12">
                  {['Infinite Scale', 'Custom Neural Models', 'Dedicated Engineer'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-zinc-400 font-bold text-sm">
                      <Plus size={16} className="text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/auth" className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-sm tracking-tight text-center hover:bg-white/10 transition-colors">Contact for Scale</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter font-headline leading-none mb-12">
              Ready to <br/>
              <span className="font-serif italic font-black text-primary">Infiltrate</span> the Feed?
            </h2>
            <Link to="/auth" className="inline-flex items-center gap-4 bg-primary text-white px-12 py-6 rounded-[2.5rem] text-xl font-black tracking-tight hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40">
              Start Building <ArrowRight />
            </Link>
          </FadeIn>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-zinc-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div className="max-w-sm">
              <Link to="/" className="flex items-center gap-2 mb-8">
                <Zap size={24} className="text-primary fill-primary" />
                <span className="text-2xl font-black tracking-tighter font-headline">KLIPORA</span>
              </Link>
              <p className="text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed mb-8">
                The content infrastructure for high-output architects. Precision-engineered for global saturation.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-6 block">Capabilities</span>
                <div className="flex flex-col gap-4 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  <a href="#" className="hover:text-primary">Shorts Engine</a>
                  <a href="#" className="hover:text-primary">Voice Cloner</a>
                  <a href="#" className="hover:text-primary">Distribution</a>
                </div>
              </div>
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-6 block">Social</span>
                <div className="flex flex-col gap-4 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  <a href="#" className="flex items-center gap-2 hover:text-primary"><Twitter size={16} /> Twitter</a>
                  <a href="#" className="flex items-center gap-2 hover:text-primary"><Github size={16} /> GitHub</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-zinc-100 dark:border-white/5 gap-6">
            <span className="text-xs font-black text-zinc-400 tracking-widest uppercase">© 2026 Klipora. Engineered Solo.</span>
            <div className="flex items-center gap-8 text-xs font-black text-zinc-400 tracking-widest uppercase">
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
