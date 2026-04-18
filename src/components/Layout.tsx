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
  const { signOut, subscriptionPlan, credits } = useAppContext();
  const [isContentLabOpen, setIsContentLabOpen] = useState(location.pathname.includes('/content-lab'));
  const [isShopifyToolsOpen, setIsShopifyToolsOpen] = useState(location.pathname.includes('/shopify-tools'));
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black text-zinc-900 tracking-tight">CreatorFlow</span>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-blue-600 font-bold border-b-2 border-blue-600 px-1 py-0.5">Workspaces</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/help" className="hidden sm:flex items-center gap-2 px-4 py-2 text-zinc-500 font-medium hover:bg-zinc-100 transition-colors rounded-md">
            <span className="material-symbols-outlined text-xl">help</span>
            <span>Help</span>
          </Link>
          <div className="h-8 w-[1px] bg-zinc-200 mx-2"></div>
          <button className="material-symbols-outlined text-zinc-500 hover:text-primary transition-colors">notifications</button>
          <div className="flex items-center gap-3 pl-2 relative">
            <button 
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="bg-primary hover:bg-primary-dim text-white px-5 py-2 rounded-md font-semibold text-sm transition-all active:scale-[0.98] duration-200 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create New
            </button>

            {isCreateMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsCreateMenuOpen(false)}></div>
                <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Content Lab</div>
                  <Link onClick={() => setIsCreateMenuOpen(false)} to="/content-lab/video-to-reels" className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-700 hover:text-primary group">
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 group-hover:text-primary transition-colors">movie</span>
                    <span className="font-semibold text-sm">Video to Reels</span>
                  </Link>
                  <Link onClick={() => setIsCreateMenuOpen(false)} to="/content-lab/thumbnail-creator" className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-700 hover:text-primary group">
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 group-hover:text-primary transition-colors">wallpaper</span>
                    <span className="font-semibold text-sm">Thumbnail Creator</span>
                  </Link>
                  <Link onClick={() => setIsCreateMenuOpen(false)} to="/content-lab/linkedin-carousels" className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-700 hover:text-primary group">
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 group-hover:text-primary transition-colors">view_carousel</span>
                    <span className="font-semibold text-sm">LinkedIn Carousel</span>
                  </Link>
                  <Link onClick={() => setIsCreateMenuOpen(false)} to="/content-lab/yt-insta-posts" className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-700 hover:text-primary group">
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 group-hover:text-primary transition-colors">dynamic_feed</span>
                    <span className="font-semibold text-sm">YT & Insta Post</span>
                  </Link>
                  
                  <div className="h-[1px] bg-zinc-100 my-2 mx-2"></div>
                  <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Shopify Tools</div>
                  <Link onClick={() => setIsCreateMenuOpen(false)} to="/shopify-tools/product-photo-studio" className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-700 hover:text-primary group">
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 group-hover:text-primary transition-colors">shopping_cart</span>
                    <span className="font-semibold text-sm">Product Photo Studio</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-zinc-100 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-col pt-20 pb-6 px-4 z-40 hidden md:flex">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Pro Studio</h2>
          </div>
          <p className="text-xs text-zinc-500 ml-11 uppercase tracking-widest font-bold">Enterprise Plan</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link to="/analytics" className={cn("flex items-center gap-3 px-3 py-2.5 transition-all rounded-xl", location.pathname === '/analytics' ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900")}>
            <span className="material-symbols-outlined">insert_chart</span>
            <span>Analytics</span>
          </Link>

          <div className="py-1">
            <button 
              onClick={() => setIsContentLabOpen(!isContentLabOpen)}
              className={cn("w-full flex items-center justify-between px-3 py-2.5 transition-all rounded-xl group", location.pathname.includes('/content-lab') ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900")}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">science</span>
                <span>Content Lab</span>
              </div>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-90">
                {isContentLabOpen ? 'expand_more' : 'chevron_right'}
              </span>
            </button>
            
            {isContentLabOpen && (
              <div className="ml-9 mt-2 space-y-1 border-l-2 border-primary/10 pl-3">
                <Link to="/content-lab/video-to-reels" className={cn("flex items-center justify-between px-3 py-2 text-sm transition-all rounded-lg", location.pathname === '/content-lab/video-to-reels' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50")}>
                  <span>Video to Reels</span>
                </Link>
                <Link to="/content-lab/thumbnail-creator" className={cn("block px-3 py-2 text-sm transition-all rounded-lg", location.pathname === '/content-lab/thumbnail-creator' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50")}>Thumbnail Creator</Link>
                <Link to="/content-lab/linkedin-carousels" className={cn("block px-3 py-2 text-sm transition-all rounded-lg", location.pathname === '/content-lab/linkedin-carousels' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50")}>LinkedIn Carousels</Link>
                <Link to="/content-lab/yt-insta-posts" className={cn("block px-3 py-2 text-sm transition-all rounded-lg", location.pathname === '/content-lab/yt-insta-posts' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50")}>YT & Insta Posts</Link>
              </div>
            )}
          </div>

          <div className="py-1">
            <button 
              onClick={() => setIsShopifyToolsOpen(!isShopifyToolsOpen)}
              className={cn("w-full flex items-center justify-between px-3 py-2.5 transition-all rounded-xl group", location.pathname.includes('/shopify-tools') ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900")}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span>Shopify Tools</span>
              </div>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-90">
                {isShopifyToolsOpen ? 'expand_more' : 'chevron_right'}
              </span>
            </button>
            
            {isShopifyToolsOpen && (
              <div className="ml-9 mt-2 space-y-1 border-l-2 border-primary/10 pl-3">
                <Link to="/shopify-tools/product-photo-studio" className={cn("flex items-center justify-between px-3 py-2 text-sm transition-all rounded-lg", location.pathname === '/shopify-tools/product-photo-studio' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50")}>
                  <span>Product Photo Studio</span>
                  <span className="text-[10px] font-bold bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-full">Soon</span>
                </Link>
                <a href="#" className="flex items-center justify-between px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all rounded-lg">
                  <span>SEO Copywriter</span>
                  <span className="text-[10px] font-bold bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-full">Soon</span>
                </a>
              </div>
            )}
          </div>

          <Link to="/settings" className={cn("flex items-center gap-3 px-3 py-2.5 transition-all rounded-xl", location.pathname === '/settings' ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900")}>
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </Link>
          <Link to="/integrations" className={cn("flex items-center gap-3 px-3 py-2.5 transition-all rounded-xl", location.pathname === '/integrations' ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900")}>
            <span className="material-symbols-outlined">link</span>
            <span>Integrations</span>
          </Link>
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-zinc-100">
          <div className="bg-primary/5 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">
                {subscriptionPlan === 'pro' ? 'Pro Plan' : 'Starter Plan'}
              </p>
              <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded text-primary border border-primary/10 shadow-sm">
                {subscriptionPlan === 'pro' ? '∞' : `${credits} CR`}
              </span>
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-1.5 mb-3 overflow-hidden">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                style={{ width: subscriptionPlan === 'pro' ? '100%' : `${(credits / 50) * 100}%` }}
              ></div>
            </div>
            <Link to="/upgrade" className={cn("w-full flex items-center justify-center py-2 text-white text-xs font-bold rounded-lg transition-colors shadow-sm", subscriptionPlan === 'pro' ? 'bg-primary hover:bg-primary-dim cursor-default' : 'bg-zinc-900 hover:bg-zinc-800')}>
              {subscriptionPlan === 'pro' ? 'Starter Plan' : 'Upgrade Plan'}
            </Link>
          </div>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-error transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 pt-24 pb-12 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
