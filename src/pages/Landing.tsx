import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Wand2,
  MousePointerClick,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  Play
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Landing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[150px] rounded-full opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-[100] px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Zap size={20} className="fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">Klipora</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/auth" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/auth" className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm tracking-tight hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center">
          <div className="max-w-5xl mx-auto w-full">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-bold tracking-wide mb-8 backdrop-blur-md">
                <Sparkles size={14} className="text-primary" />
                <span>Thumio Alternative Built for Scale</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-5xl md:text-7xl lg:text-[6rem] leading-[1.05] font-black tracking-[-0.04em] mb-8">
                Create better YouTube<br className="hidden md:block"/> thumbnails faster
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
                Klipora is an AI-powered thumbnail editor built for YouTube creators. Edit existing thumbnails, generate variations, compare concepts, and publish faster.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/auth" className="group relative bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-all overflow-hidden flex items-center gap-2">
                  <div className="absolute inset-0 w-full h-full bg-white/20 blur-md group-hover:bg-transparent transition-all" />
                  <span className="relative z-10">Launch studio</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#pricing" className="text-white/60 hover:text-white px-8 py-4 text-lg font-bold transition-colors">
                  View pricing
                </a>
              </div>
            </FadeIn>
            
            {/* UI Mockup Hero */}
            <FadeIn delay={0.5} className="mt-24 w-full">
              <div className="relative w-full max-w-5xl mx-auto aspect-video sm:aspect-[21/9] bg-[#0A0A0A] rounded-[2rem] border border-white/10 shadow-[0_0_100px_rgba(var(--color-primary),0.15)] overflow-hidden flex flex-col group">
                
                {/* Mac Window Header */}
                <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2 shrink-0 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                  </div>
                  <div className="mx-auto text-xs font-medium text-white/30 truncate px-4">Klipora Editor - "I built an AI agent to code for me"</div>
                  <div className="flex gap-2 ml-auto">
                    <div className="px-3 py-1 bg-white/10 rounded-md text-[10px] font-bold text-white/60">Export HQ</div>
                  </div>
                </div>

                {/* Editor Body */}
                <div className="flex-1 flex overflow-hidden relative">
                  
                  {/* Left Sidebar (Tools) */}
                  <div className="w-16 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-white/[0.02]">
                    {[MousePointerClick, ImageIcon, Wand2, Layers, Sparkles].map((Icon, i) => (
                      <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${i === 2 ? 'bg-primary/20 text-primary border border-primary/30' : 'text-white/40 border border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <Icon size={20} />
                      </div>
                    ))}
                  </div>

                  {/* Main Canvas Area */}
                  <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent">
                    {/* The Thumbnail being edited */}
                    <div className="relative w-full max-w-[600px] aspect-video bg-zinc-800 rounded-xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                       <img src="https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70" alt="Main Edit" />
                       
                       {/* Floating AI UI on top of thumbnail */}
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                         <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
                           <Wand2 className="text-primary" size={24} />
                           <div className="flex flex-col text-left">
                             <span className="text-sm font-bold text-white">Extracting Subject...</span>
                             <div className="h-1.5 w-32 bg-white/20 rounded-full mt-2 overflow-hidden">
                               <div className="h-full w-[80%] bg-primary rounded-full relative">
                                 <div className="absolute inset-0 bg-white/30 animate-pulse" />
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>

                       <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-xs font-bold text-white/70">Highest CTR Prediction</span>
                       </div>
                    </div>
                  </div>

                  {/* Right Sidebar (Settings) */}
                  <div className="w-64 border-l border-white/5 bg-white/[0.02] p-4 hidden md:flex flex-col gap-6 overflow-y-auto">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-white/40 uppercase tracking-wider">AI Prompts</div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/80">
                        "Make the subject pop more and add a tech vibe background with blue and purple neons."
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-bold">Generate</button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Variations</div>
                      <div className="grid grid-cols-2 gap-2">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`aspect-video rounded-lg border ${i === 1 ? 'border-primary shadow-[0_0_10px_rgba(var(--color-primary),0.3)]' : 'border-white/10 opacity-50'} overflow-hidden relative cursor-pointer`}>
                             <img src={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200&auto=format&fit=crop&sig=${i}`} className="w-full h-full object-cover" alt="Variation" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 md:text-center">
              <FadeIn>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">What Klipora helps you do</h2>
                <p className="text-xl text-white/50 font-medium max-w-2xl mx-auto">Everything you need to replace your entire design workflow.</p>
              </FadeIn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[350px]">
              
              {/* Feature 1 */}
              <FadeIn delay={0.1} className="md:col-span-8 group relative overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                    <Wand2 size={24} />
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-3xl font-bold mb-3">AI-first editing</h3>
                    <p className="text-white/50 text-lg font-medium leading-relaxed">
                      Upload an existing thumbnail, ask for the change you want, and let Klipora reshoot, restyle, or refine it in seconds.
                    </p>
                  </div>
                </div>
                {/* Decoration Element */}
                <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none translate-x-12 translate-y-24 group-hover:translate-x-8 group-hover:translate-y-20 transition-all duration-700">
                  <div className="h-full w-full bg-gradient-to-t from-primary/40 to-transparent blur-3xl rotate-45" />
                </div>
              </FadeIn>

              {/* Feature 2 */}
              <FadeIn delay={0.2} className="md:col-span-4 group relative overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Targeted workflows</h3>
                    <p className="text-white/50 font-medium leading-relaxed">
                      Expression changes, background cleanup, and fast export are all built exactly for YouTube.
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* Feature 3 */}
              <FadeIn delay={0.3} className="md:col-span-12 group relative overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-full md:w-1/2 p-8 md:p-12 z-10 flex flex-col justify-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm mb-6">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Fast publishing loop</h3>
                  <p className="text-white/50 text-xl font-medium leading-relaxed max-w-lg">
                    Move from concept to publish-ready thumbnail without a heavyweight editor or a long design workflow. Iteration is instant.
                  </p>
                </div>
                {/* Decorative Timeline */}
                <div className="hidden md:flex flex-1 items-center justify-center pr-12 relative z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex-1 h-1 bg-white/10 rounded-full relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-y-0 left-0 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" 
                      />
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-primary flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(var(--color-primary),0.2)]">
                      <Play className="text-primary ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10 blur-3xl opacity-50" />
          
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <FadeIn>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Pricing structure</h2>
                <p className="text-xl text-white/50 font-medium max-w-2xl mx-auto">Start free, then upgrade when thumbnails become part of your weekly growth workflow.</p>
              </FadeIn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Free */}
              <FadeIn delay={0.1}>
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col hover:border-white/20 transition-colors h-full relative group shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-[2rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-2xl font-bold mb-4">Free to start</h3>
                  <p className="text-white/40 text-[15px] mb-8 min-h-[60px] leading-relaxed">Create thumbnails and test AI workflows before you commit.</p>
                  
                  <div className="text-5xl font-black mb-8">$0<span className="text-lg text-white/30 font-medium tracking-normal ml-1">/mo</span></div>
                  
                  <ul className="space-y-4 mb-10 flex-1 text-white/60 font-medium">
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-white/20" /> 80 Monthly Credits</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-white/20" /> Standard Templates</li>
                  </ul>
                  
                  <Link to="/auth" className="block w-full py-4 text-center font-bold tracking-wide rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">Start free</Link>
                </div>
              </FadeIn>

              {/* Pro */}
              <FadeIn delay={0.2}>
                <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/10 rounded-[2rem] p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">Most Popular</div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent rounded-[2rem] pointer-events-none" />
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">Paid for speed</h3>
                  <p className="text-white/50 text-[15px] mb-8 min-h-[60px] leading-relaxed">Step up your thumbnail game with more credits and advanced AI tools to move faster.</p>
                  
                  <div className="text-5xl font-black mb-8 text-white">$5<span className="text-lg text-white/40 font-medium tracking-normal ml-1">/mo</span></div>
                  
                  <ul className="space-y-4 mb-10 flex-1 text-white/80 font-medium">
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-primary" /> 250 Monthly Credits</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-primary" /> AI Heatmap Analysis</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-primary" /> Auto Background Removal</li>
                  </ul>
                  
                  <Link to="/auth" className="block w-full py-4 text-center font-bold tracking-wide rounded-xl bg-white text-black hover:bg-white/90 transition-colors shadow-lg">Upgrade to Speed</Link>
                </div>
              </FadeIn>

              {/* Infinite */}
              <FadeIn delay={0.3}>
                <div className="bg-primary/5 backdrop-blur-xl border border-primary/20 rounded-[2rem] p-8 flex flex-col hover:border-primary/40 hover:bg-primary/10 transition-colors h-full relative group">
                  <h3 className="text-2xl font-bold mb-4 text-white">Infinite</h3>
                  <p className="text-white/60 text-[15px] mb-8 min-h-[60px] leading-relaxed">Upgrade when you need unlimited exports and zero friction in your publishing workflow.</p>
                  
                  <div className="text-5xl font-black mb-8">$15<span className="text-lg text-white/40 font-medium tracking-normal ml-1">/mo</span></div>
                  
                  <ul className="space-y-4 mb-10 flex-1 text-white/80 font-medium">
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-primary" /> 750 Monthly Credits</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-white/50" /> Fast Generation</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-white/50" /> Priority Support</li>
                  </ul>
                  
                  <Link to="/auth" className="block w-full py-4 text-center font-bold tracking-wide rounded-xl bg-primary text-black hover:bg-primary/90 transition-colors">Go Infinite</Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Big CTA */}
        <section className="py-24 px-6 mb-20">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready to grow your channel?</h2>
              <Link to="/auth" className="inline-flex flex-col sm:flex-row items-center justify-center gap-4">
                 <div className="bg-white text-black px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                   Launch Studio <ArrowRight size={20} />
                 </div>
                 <div className="text-white/40 font-medium text-sm">No credit card required</div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/5 bg-black/50 backdrop-blur-3xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
                <Zap size={16} className="fill-current" />
              </div>
              <span className="text-lg font-bold tracking-tight">Klipora</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm font-medium text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

