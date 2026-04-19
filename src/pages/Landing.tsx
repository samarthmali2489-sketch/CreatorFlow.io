import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Video, FileImage, LayoutGrid, Zap, 
  ArrowRight, TrendingUp, CheckCircle2, Play, 
  Users, Star, ArrowUpRight, BarChart3, Clock, 
  Wand2, Globe, Lock 
} from 'lucide-react';

export default function Landing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter Plan",
      badge: "",
      price: "$0",
      period: "/mo",
      desc: "Perfect for getting started.",
      features: [
        "50 Free Credits",
        "30 Credits per Video to Reel",
        "10 Credits per other features",
        "Access to ALL Features"
      ],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Pro Plan",
      badge: "Most Popular",
      price: "$19",
      period: "/mo",
      desc: "Unlock full access to AI social media generation.",
      features: [
        "Unlimited YT & Insta Posts generation",
        "Unlimited LinkedIn Carousels",
        "AI-powered YouTube Thumbnails",
        "Export Videos to Reels, Shorts, and TikTok"
      ],
      cta: "Upgrade to Pro",
      highlight: true
    },
    {
      name: "Infinity",
      badge: "",
      price: "$100",
      period: "/mo",
      desc: "For agencies and power users.",
      features: [
        "Infinite Generations",
        "Premium AI Models",
        "Unlimited Profiles",
        "API Access",
        "Dedicated Account Manager"
      ],
      cta: "Go Infinite",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1] }} 
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }} 
          className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full mix-blend-screen"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">CreatorFlow<span className="text-blue-500">.</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth" className="hidden sm:block text-sm font-semibold text-slate-300 hover:text-white transition-colors">Log in</Link>
            <Link to="/auth" className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform flex items-center gap-2">
                Start Free <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300 tracking-wide">Introducing CreatorFlow OS 2.0</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[1.05] mb-8 max-w-5xl">
              Create at the speed of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient">thought.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto mb-10">
              Transform a single idea into highly-engaging videos, 
              stunning carousels, and viral thumbnails in seconds. 
              The ultimate AI engine for serious creators.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link to="/auth" className="w-full sm:w-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-3">
                  Start Creating For Free
                  <Sparkles className="w-5 h-5" />
                </div>
              </Link>
            </div>

            <div className="mt-12 text-sm font-semibold text-slate-500 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-black" alt="user" />
                ))}
              </div>
              <span className="ml-2">Trusted by 10,000+ creators & brands</span>
            </div>
          </motion.div>

          {/* Sexy UI Mockup Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.2 }}
            className="mt-20 relative max-w-6xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-t from-blue-600/40 to-purple-600/40 blur-3xl opacity-60 rounded-3xl" />
            <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden backdrop-blur-sm -mb-32 md:-mb-64">
               {/* Browser bar */}
               <div className="h-10 border-b border-white/10 bg-[#111] flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                 <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                 <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                 <div className="mx-auto px-6 py-1 rounded bg-white/5 text-[11px] text-slate-400 font-mono flex items-center gap-2 border border-white/5 shadow-inner">
                   <Lock className="w-3 h-3" /> creatorflow.os
                 </div>
               </div>
               {/* App content mock recreated perfectly from screenshot */}
               <div className="bg-[#f8f9fc] dark:bg-[#050505] relative overflow-hidden flex text-left w-full h-[550px] text-slate-800 dark:text-slate-200">
                  {/* Sidebar Mock */}
                  <div className="w-[240px] border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] p-4 flex flex-col pt-6 hidden md:flex shrink-0">
                     <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                           <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                           <div className="font-bold text-sm leading-tight text-slate-900 dark:text-white">Pro Studio</div>
                           <div className="text-[10px] text-slate-500 font-bold tracking-wider">ENTERPRISE PLAN</div>
                        </div>
                     </div>
                     
                     <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg font-semibold text-sm border border-blue-100 dark:border-blue-500/20">
                           <BarChart3 className="w-4 h-4" /> Analytics
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg font-medium text-sm">
                           <Video className="w-4 h-4" /> Content Lab
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg font-medium text-sm">
                           <FileImage className="w-4 h-4" /> Thumbnail Pro
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg font-medium text-sm">
                           <LayoutGrid className="w-4 h-4" /> Auto-Carousels
                        </div>
                     </div>
                     
                     <div className="mt-auto mb-4 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-1 tracking-wider">Plan Usage</div>
                        <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full mb-1">
                           <div className="bg-blue-500 h-1.5 rounded-full w-[45%]" />
                        </div>
                        <div className="text-xs text-slate-500 px-1 font-medium mt-2">45 / 100 Credits</div>
                     </div>
                  </div>

                  {/* Main View Mock */}
                  <div className="flex-1 p-8 bg-slate-50 dark:bg-[#020202] overflow-hidden flex flex-col">
                     <div className="flex items-end justify-between mb-8">
                       <div>
                         <div className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Performance Overview</div>
                         <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Analytics Lab</h2>
                       </div>
                       <div className="hidden lg:flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm gap-1">
                         <div className="px-4 py-1 bg-white dark:bg-[#222] shadow text-sm font-semibold rounded border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white">Last 30 Days</div>
                         <div className="px-4 py-1 text-slate-500 text-sm font-medium">Last Quarter</div>
                         <div className="px-4 py-1 text-slate-500 text-sm font-medium">Yearly</div>
                         <div className="px-4 py-1 text-slate-500 text-sm font-medium">Custom</div>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-4">
                             <div className="text-slate-500 font-medium text-sm">Total Generations</div>
                             <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                               <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                             </div>
                           </div>
                           <div className="text-4xl font-black text-slate-800 dark:text-white mb-4">25</div>
                           <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 text-xs font-bold">
                             <ArrowUpRight className="w-3 h-3" /> Active this session
                           </div>
                        </div>

                        {/* Card 2 (Dark Theme) */}
                        <div className="bg-[#1a1c23] dark:bg-[#111] border border-[#2a2d3d] dark:border-white/10 rounded-2xl p-6 shadow-lg transform hover:-translate-y-1 transition-transform">
                           <div className="flex justify-between items-start mb-4">
                             <div className="text-slate-300 font-medium text-sm">Videos Processed</div>
                             <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                               <Video className="w-4 h-4 text-slate-300" />
                             </div>
                           </div>
                           <div className="text-4xl font-black text-white mb-4">4</div>
                           <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                             <div className="w-3 h-0.5 bg-slate-400 rounded-full"></div> Stable performance
                           </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-4">
                             <div className="text-slate-500 font-medium text-sm">Platforms Connected</div>
                             <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                               <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                             </div>
                           </div>
                           <div className="text-4xl font-black text-slate-800 dark:text-white mb-4">1</div>
                           <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 text-xs font-bold">
                             <ArrowUpRight className="w-3 h-3" /> Ready for distribution
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col">
                           <div className="text-lg font-bold text-slate-800 dark:text-white mb-4">Growth Projection</div>
                           {/* Chart placeholder */}
                           <div className="w-full flex-1 flex items-end gap-2 mt-auto pb-2">
                             {[30, 45, 25, 60, 40, 70, 85, 100, 80, 50, 65, 95].map((h, i) => (
                               <div key={i} className="flex-1 bg-slate-50 dark:bg-blue-900/10 rounded-t relative group overflow-hidden h-full flex items-end">
                                 <motion.div 
                                   initial={{ height: "0%" }}
                                   whileInView={{ height: `${h}%` }}
                                   transition={{ duration: 1, delay: i * 0.05 }}
                                   className="w-full bg-slate-200 dark:bg-slate-800/50 rounded-t group-hover:bg-blue-500 dark:group-hover:bg-blue-500/80 transition-colors" 
                                 />
                               </div>
                             ))}
                           </div>
                        </div>
                        <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                           <div className="text-lg font-bold text-slate-800 dark:text-white mb-6">Traffic Sources</div>
                           <div className="space-y-6">
                             <div>
                               <div className="flex justify-between text-sm font-bold mb-2 text-slate-800 dark:text-slate-200"><span>YouTube Shorts</span><span className="text-slate-500">14%</span></div>
                               <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '14%' }} transition={{ duration: 1 }} className="bg-[#FF0000] h-full rounded-full"></motion.div></div>
                             </div>
                             <div>
                               <div className="flex justify-between text-sm font-bold mb-2 text-slate-800 dark:text-slate-200"><span>Instagram Reels</span><span className="text-slate-500">41%</span></div>
                               <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '41%' }} transition={{ duration: 1, delay: 0.1 }} className="bg-gradient-to-r from-[#FFDC80] via-[#F56040] to-[#C13584] h-full rounded-full"></motion.div></div>
                             </div>
                             <div>
                               <div className="flex justify-between text-sm font-bold mb-2 text-slate-800 dark:text-slate-200"><span>LinkedIn</span><span className="text-slate-500">45%</span></div>
                               <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: '45%' }} transition={{ duration: 1, delay: 0.2 }} className="bg-[#0077b5] h-full rounded-full"></motion.div></div>
                             </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* LOGO CLOUD */}
        <div className="border-y border-white/5 bg-white/[0.02] py-16 mt-32 md:mt-64 mb-32 z-10 relative overflow-hidden backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Creators using our platform to automate at</p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale">
              <span className="text-2xl font-black font-sans">YouTube</span>
              <span className="text-2xl font-bold font-serif italic">Instagram</span>
              <span className="text-2xl font-black tracking-widest">LinkedIn</span>
              <span className="text-2xl font-bold">TikTok</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">X (Twitter)</span>
            </div>
          </div>
        </div>

        {/* FEATURES BENTO GRID */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
            >
              Everything you need to <span className="text-blue-400">go viral.</span>
            </motion.h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
              One unified workspace substituting five different subscriptions. 
              Built purely to maximize your output and retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-2 group relative rounded-[2rem] p-[1px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-[#1A1A1A] to-[#0A0A0A] opacity-80" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="relative h-full bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col justify-end min-h-[350px]">
                 <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/30 blur-[80px] rounded-full group-hover:bg-indigo-500/40 transition-colors" />
                 
                 <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                    <Video className="w-6 h-6 text-indigo-300" />
                 </div>
                 
                 <div className="relative z-10 w-full mt-auto">
                   <h3 className="text-3xl font-bold text-white mb-3">Video to Reels Gen-AI</h3>
                   <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                     Extract viral gold from long-form content. AI tracks faces, frames B-roll, and bakes in subtitles.
                   </p>
                 </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative rounded-[2rem] p-[1px] overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-[#1A1A1A] to-[#0A0A0A] opacity-80" />
               <div className="relative h-full bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 flex flex-col justify-end min-h-[350px]">
                 <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                    <LayoutGrid className="w-6 h-6 text-blue-300" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3">LinkedIn Carousels</h3>
                 <p className="text-slate-400 leading-relaxed">
                   Turn brain-dumps into stunning PDF carousels built for millions of impressions.
                 </p>
               </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative rounded-[2rem] p-[1px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/30 via-[#1A1A1A] to-[#0A0A0A] opacity-80" />
              <div className="relative h-full bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 flex flex-col justify-end min-h-[350px]">
                 <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <FileImage className="w-6 h-6 text-emerald-300" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3">Viral Thumbnails</h3>
                 <p className="text-slate-400 leading-relaxed">
                   Generate heavily CTR-optimized YouTube thumbnails using specialized vision AI.
                 </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-4 group relative rounded-[2rem] p-[1px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30 opacity-80 group-hover:opacity-100 transition duration-500" />
              <div className="relative h-full bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                 
                 <div className="relative z-10 max-w-2xl">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                      <Wand2 className="w-7 h-7 text-white" />
                   </div>
                   <h3 className="text-4xl font-black text-white mb-4">Style Matching AI Engine</h3>
                   <p className="text-slate-400 text-lg leading-relaxed">
                     Paste your social profiles, and CreatorFlow learns your exact tone, quirks, and audience format preferences. Keep your specific, unique voice across 5+ platforms magically.
                   </p>
                 </div>

                 <div className="flex-1 w-full flex justify-end">
                    <div className="p-4 rounded-2xl bg-[#111] border border-white/5 shadow-2xl relative w-full max-w-sm rotate-3 group-hover:rotate-0 transition-transform duration-500 origin-bottom-right">
                       <div className="flex items-center gap-3 mb-4">
                          <img src="https://i.pravatar.cc/150?u=a" className="w-10 h-10 rounded-full" alt="profile"/>
                          <div>
                             <div className="w-20 h-2 bg-white/10 rounded mb-1"/>
                             <div className="w-12 h-2 bg-white/5 rounded"/>
                          </div>
                          <div className="ml-auto w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center"><CheckCircle2 className="w-4 h-4"/></div>
                       </div>
                       <div className="space-y-2">
                         <div className="w-full h-3 bg-white/10 rounded"/>
                         <div className="w-5/6 h-3 bg-white/10 rounded"/>
                         <div className="w-4/6 h-3 bg-white/10 rounded"/>
                       </div>
                    </div>
                 </div>

              </div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS / NUMBERS */}
        <section id="how-it-works" className="py-24 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">Scale without the burnout.</h2>
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                    Most creators spend 80% of their time editing and distributing, and 20% actually ideating. CreatorFlow flips the script.
                  </p>
                  
                  <div className="space-y-8">
                    {[
                       { icon: Clock, title: "Save 20+ hours a week", desc: "Automate your entire post-production and formatting pipeline." },
                       { icon: BarChart3, title: "Grow 3x faster", desc: "Omnichannel presence becomes effortless. Be everywhere at once." },
                       { icon: Globe, title: "Global reach natively", desc: "Auto-translate and adapt your content to 10+ languages." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                          <p className="text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stats visuals */}
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
                  <div className="relative grid grid-cols-2 gap-4">
                     <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center shadow-xl translate-y-8">
                        <span className="text-5xl font-black text-white mb-2">10x</span>
                        <span className="text-slate-400 font-medium">Content Output</span>
                     </div>
                     <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center shadow-xl">
                        <span className="text-5xl font-black text-blue-400 mb-2">90%</span>
                        <span className="text-slate-400 font-medium">Cost Reduction</span>
                     </div>
                     <div className="bg-gradient-to-br from-blue-600 to-indigo-600 border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center shadow-xl col-span-2">
                        <span className="text-5xl font-black text-white mb-2">1.2B+</span>
                        <span className="text-blue-200 font-medium">Impressions Generated for Users</span>
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Simple, transparent pricing.</h2>
            
            <div className="inline-flex items-center bg-[#0A0A0A] border border-white/10 rounded-full p-1 mx-auto relative cursor-pointer" onClick={() => setIsAnnual(!isAnnual)}>
              <div className={`absolute inset-y-1 w-1/2 bg-blue-600 rounded-full transition-transform duration-300 ease-out ${isAnnual ? 'translate-x-0 left-1' : 'translate-x-[calc(100%-8px)] left-1'}`} />
              <div className="relative z-10 flex text-sm font-bold">
                <div className={`px-6 py-2 rounded-full transition-colors ${isAnnual ? 'text-white' : 'text-slate-400'}`}>Annually (-20%)</div>
                <div className={`px-6 py-2 rounded-full transition-colors ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Monthly</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {plans.map((plan, i) => (
                <div key={i} className={`relative rounded-[2.5rem] p-[1px] overflow-hidden ${plan.highlight ? 'block' : 'mt-0 md:mt-8'}`}>
                  {plan.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 animate-slow-spin opacity-50" />
                  )}
                  <div className={`relative h-full rounded-[2.5rem] p-10 md:p-12 flex flex-col ${plan.highlight ? 'bg-[#0A0A0A]/95 backdrop-blur-xl shadow-2xl shadow-blue-900/20' : 'bg-[#0A0A0A] border border-white/10'}`}>
                    
                    {plan.badge && (
                      <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                          {plan.badge}
                        </div>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 h-12">{plan.desc}</p>
                    
                    <div className="my-8 flex items-baseline gap-2">
                       <span className="text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                       <span className="text-slate-500 font-bold">{plan.period}</span>
                    </div>

                    <Link to="/auth" className={`w-full py-4 rounded-2xl font-bold text-lg flex justify-center items-center transition-all ${plan.highlight ? 'bg-white text-black hover:bg-slate-200 hover:scale-[1.02]' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
                      {plan.cta}
                    </Link>

                    <div className="h-[1px] w-full bg-white/5 my-8" />

                    <ul className="flex-1 space-y-4">
                      {plan.features.map((feat, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-blue-500' : 'text-slate-500'}`} />
                          <span className={`${plan.highlight ? 'text-slate-200' : 'text-slate-400'}`}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
             ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="bg-gradient-to-b from-blue-900/30 to-[#0A0A0A] border border-blue-500/30 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
             
             <div className="relative z-10">
               <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
                 <Zap className="w-10 h-10 text-white" />
               </div>
               
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                 Ready to go <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">viral?</span>
               </h2>
               <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                 Join thousands of creators producing 10x more content in half the time. Start for free today.
               </p>
               <Link to="/auth" className="relative group inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative inline-flex px-12 py-5 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-transform flex-row items-center gap-3">
                    Launch CreatorFlow OS
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
               </Link>
             </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#020202] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-blue-500" />
                <span className="font-black text-xl text-white tracking-tight">CreatorFlow.</span>
              </div>
              <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                The AI-powered operating system for modern creators. Edit less, distribute more, grow faster.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-3 text-slate-500">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-slate-500">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">© 2026 CreatorFlow Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 text-slate-600 text-sm font-semibold tracking-wider">
               <span>MADE WITH ❤️ IN CLOUD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
