import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppContext } from '../context/AppContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();
  const { signOut } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans selection:bg-white/20">
      
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#0F0F0F] border-r border-white/5 flex flex-col shrink-0 h-screen sticky top-0">
        
        {/* Logo */}
        <div className="p-6 pb-8 border-b border-white/5 mb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-shadow">
              <span className="material-symbols-outlined text-[20px] font-bold">bolt</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Klipora</h1>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">AI Thumbnail Editor</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {[
            { name: 'Thumbnails', icon: 'wallpaper', path: '/analytics' },
            { name: 'YT & Insta Posts', icon: 'dynamic_feed', path: '/content-lab/yt-insta-posts' },
            { name: 'LinkedIn Carousels', icon: 'view_carousel', path: '/content-lab/linkedin-carousels' },
            { name: 'Assets', icon: 'folder', path: '/assets' },
          ].map((item, i) => {
             const active = location.pathname === item.path || (item.path === '/analytics' && location.pathname === '/');
             return (
               <Link 
                 key={i} 
                 to={item.path} 
                 className={cn(
                   "flex items-center justify-between px-3 py-3 rounded-xl transition-all",
                   active 
                     ? "bg-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" 
                     : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                 )}
               >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
               </Link>
             );
          })}

          <div className="my-6 border-t border-white/5 mx-2" />

          {[
            { name: 'Upgrade plan', icon: 'arrow_upward', path: '/upgrade' },
            { name: 'Settings', icon: 'settings', path: '/settings' },
          ].map((item, i) => {
             const active = location.pathname === item.path;
             return (
               <Link 
                 key={i} 
                 to={item.path} 
                 className={cn(
                   "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                   active
                     ? "bg-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                     : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                 )}
               >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.name}</span>
               </Link>
             );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/5 mt-auto">
          <Link to="/help" className="flex items-center justify-between px-3 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">help</span>
              <span className="font-semibold text-sm">Get help</span>
            </div>
            <span className="material-symbols-outlined text-[16px]">north_east</span>
          </Link>
          <button onClick={signOut} className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-1">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="font-semibold text-sm">Log out</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center px-8 gap-6 shrink-0 bg-[#0F0F0F]/50 backdrop-blur-md sticky top-0 z-10">
          
          {/* Workspace selector */}
          <button className="flex items-center gap-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-2.5">
            <span className="font-bold text-[13px]">Solo Sandbox</span>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded bg-black/40">Owner</span>
          </button>
          
          {/* Search */}
          <div className="flex-1 max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-white/40 text-[20px] group-focus-within:text-white transition-colors">search</span>
            </div>
            <input 
              type="text" 
              placeholder="Search thumbnails..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/30 focus:bg-white/5 rounded-xl py-2.5 pl-12 pr-12 text-sm outline-none transition-all placeholder:text-white/30" 
            />
            <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center">
               <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-colors">
                 <span className="material-symbols-outlined text-[16px] text-white/50">youtube_searched_for</span>
               </button>
            </div>
          </div>

          {/* Profile */}
          <button className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center ml-auto font-bold shadow-sm hover:scale-105 transition-transform">
             <span className="material-symbols-outlined text-[20px]">person</span>
          </button>

        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}
