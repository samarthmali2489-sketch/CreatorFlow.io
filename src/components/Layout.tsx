import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppContext } from '../context/AppContext';
import { FloatingSpaceBackground } from './FloatingSpaceBackground';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();
  const { 
    signOut, subscriptionPlan, credits, 
    savedPosts, savedCarousels, savedReels, savedThumbnails 
  } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isContentLabOpen, setIsContentLabOpen] = useState(location.pathname.includes('/content-lab'));
  const [isLibraryOpen, setIsLibraryOpen] = useState(location.pathname.includes('/saved-') || location.pathname.includes('/content-lab/saved-thumbnails'));
  const [isShopifyToolsOpen, setIsShopifyToolsOpen] = useState(location.pathname.includes('/shopify-tools'));
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const performSearch = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    
    const results = [];
    
    // Search posts
    savedPosts?.forEach(post => {
      if (post.content.toLowerCase().includes(q) || post.platform.toLowerCase().includes(q) || post.tags.some(t => t.toLowerCase().includes(q))) {
        results.push({ type: 'post', id: post.id, title: `${post.platform} Post`, preview: post.content.substring(0, 60) + '...', link: '/saved-posts' });
      }
    });

    // Search carousels
    savedCarousels?.forEach(c => {
      if (c.topic.toLowerCase().includes(q)) {
        results.push({ type: 'carousel', id: c.id, title: 'LinkedIn Carousel', preview: c.topic, link: '/saved-carousels' });
      }
    });

    // Search reels
    savedReels?.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.hook.toLowerCase().includes(q)) {
        results.push({ type: 'reel', id: r.id, title: 'Short-Form Reel', preview: r.title, link: '/content-lab/video-to-reels' });
      }
    });

    // Search thumbnails
    savedThumbnails?.forEach(t => {
      if (t.topic.toLowerCase().includes(q) || (t.thumbnailText && t.thumbnailText.toLowerCase().includes(q))) {
        results.push({ type: 'thumbnail', id: t.id, title: 'Thumbnail', preview: t.topic, link: '/content-lab/saved-thumbnails' });
      }
    });

    return results.slice(0, 10);
  };

  const searchResults = performSearch();

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container relative">
      <FloatingSpaceBackground />
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white dark:bg-zinc-900/70 backdrop-blur-sm border-b border-white/20 shadow-sm flex justify-between items-center px-6 py-3 transition-all duration-300">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
            </div>
            Klipora
          </span>
          <div className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800/50">
            <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold px-4 py-1.5 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-800/50 text-sm">Workspaces</div>
            <div className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-white dark:bg-zinc-900/50 cursor-pointer font-medium px-4 py-1.5 rounded-md transition-colors text-sm">Recent</div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-6 relative z-50">
           <div className="relative w-full group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <span className="material-symbols-outlined text-zinc-400 group-focus-within:text-primary transition-colors text-[20px]">search</span>
             </div>
             <input 
                type="text" 
                placeholder="Search resources, generated content..." 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 focus:border-primary/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-primary/10 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-zinc-100 transition-all outline-none placeholder:text-zinc-500 shadow-sm" 
             />
             
             {/* Search Dropdown */}
             {isSearchFocused && searchQuery.trim().length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 max-h-[400px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                    Search Results
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500 text-sm">No content found for "{searchQuery}"</div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {searchResults.map((result) => (
                        <Link 
                           key={result.id} 
                           to={result.link}
                           className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors group cursor-pointer"
                        >
                           <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                              <span className="material-symbols-outlined text-[18px] text-zinc-500 group-hover:text-primary transition-colors">
                                {result.type === 'post' ? 'article' : result.type === 'carousel' ? 'view_carousel' : result.type === 'reel' ? 'movie' : 'wallpaper'}
                              </span>
                           </div>
                           <div className="overflow-hidden">
                              <div className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-primary transition-colors">{result.title}</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{result.preview}</div>
                           </div>
                        </Link>
                      ))}
                    </div>
                  )}
               </div>
             )}
           </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/help" className="hidden sm:flex items-center gap-2 px-3 py-2 text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:bg-zinc-800/80 hover:text-zinc-900 dark:text-white transition-colors rounded-lg text-sm">
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span>Help</span>
          </Link>
          <div className="h-5 w-[1px] bg-zinc-200 mx-1"></div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800/80 hover:text-zinc-900 dark:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="flex items-center pl-1 relative">
            <button 
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white dark:text-zinc-900 px-4 py-2 rounded-full font-semibold text-sm transition-all active:scale-[0.98] duration-200 flex items-center gap-2 shadow-md hover:shadow-lg border border-zinc-700"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Create
            </button>

            {isCreateMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsCreateMenuOpen(false)}></div>
                <div className="absolute top-12 right-0 w-64 bg-white dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200 ring-1 ring-black/5">
                  <div className="px-3 py-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Content Lab</div>
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-colors text-zinc-400 dark:text-zinc-500 pointer-events-none opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">movie</span>
                      <span className="font-semibold text-sm">Video to Reels</span>
                    </div>
                    <span className="text-[10px] font-bold bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-1.5 py-0.5 rounded-full shrink-0">Soon</span>
                  </div>
                  <Link onClick={() => setIsCreateMenuOpen(false)} to="/content-lab/thumbnail-creator" className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-300 hover:text-primary group">
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 group-hover:text-primary transition-colors">wallpaper</span>
                    <span className="font-semibold text-sm">Thumbnail Creator</span>
                  </Link>
                  <Link onClick={() => setIsCreateMenuOpen(false)} to="/content-lab/linkedin-carousels" className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-300 hover:text-primary group">
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 group-hover:text-primary transition-colors">view_carousel</span>
                    <span className="font-semibold text-sm">LinkedIn Carousel</span>
                  </Link>
                  <Link onClick={() => setIsCreateMenuOpen(false)} to="/content-lab/yt-insta-posts" className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-300 hover:text-primary group">
                    <span className="material-symbols-outlined text-[20px] text-zinc-400 group-hover:text-primary transition-colors">dynamic_feed</span>
                    <span className="font-semibold text-sm">YT & Insta Post</span>
                  </Link>
                  
                  <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-2 mx-2"></div>
                  <div className="px-3 py-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Shopify Tools</div>
                  <Link onClick={() => setIsCreateMenuOpen(false)} to="/shopify-tools/product-photo-studio" className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-300 hover:text-primary group">
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
      <aside className={cn("fixed left-0 top-0 h-full border-r border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm flex-col pt-20 pb-6 z-40 hidden md:flex transition-all duration-300", isSidebarOpen ? "w-64 px-4" : "w-16 px-2 items-center")}>
        <div className={cn("mb-8 px-2 flex items-center justify-between", !isSidebarOpen && "justify-center")}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white dark:text-zinc-900 font-bold shrink-0">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </div>
            {isSidebarOpen && <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight whitespace-nowrap">Pro Studio</h2>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden sm:flex text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors shrink-0">
             <span className="material-symbols-outlined text-[20px]">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
          </button>
        </div>
        {isSidebarOpen && <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-11 uppercase tracking-widest font-bold -mt-8 mb-6">Enterprise Plan</p>}
        
        <nav className="flex-1 space-y-1 w-full relative">
          <Link to="/analytics" title={!isSidebarOpen ? "Analytics" : undefined} className={cn("w-full flex items-center gap-3 py-2.5 transition-all rounded-xl", isSidebarOpen ? "px-3" : "justify-center px-0", location.pathname === '/analytics' ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:bg-zinc-800 hover:text-zinc-900 dark:text-white")}>
            <span className="material-symbols-outlined shrink-0">insert_chart</span>
            {isSidebarOpen && <span className="whitespace-nowrap">Analytics</span>}
          </Link>

          <div className="py-1 w-full group/menu relative">
            <button 
              onClick={() => isSidebarOpen && setIsContentLabOpen(!isContentLabOpen)}
              title={!isSidebarOpen ? "Content Lab" : undefined}
              className={cn("w-full flex items-center transition-all rounded-xl", isSidebarOpen ? "justify-between px-3 py-2.5" : "justify-center py-2.5 px-0", location.pathname.includes('/content-lab') ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:bg-zinc-800 hover:text-zinc-900 dark:text-white")}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="material-symbols-outlined shrink-0">science</span>
                {isSidebarOpen && <span className="whitespace-nowrap">Content Lab</span>}
              </div>
              {isSidebarOpen && (
                <span className="material-symbols-outlined text-sm transition-transform shrink-0">
                  {isContentLabOpen ? 'expand_more' : 'chevron_right'}
                </span>
              )}
            </button>
            
            {isContentLabOpen && isSidebarOpen && (
              <div className="ml-9 mt-2 space-y-1 border-l-2 border-primary/10 pl-3">
                <div className={cn("flex items-center justify-between px-3 py-2 text-sm transition-all rounded-lg opacity-60 cursor-not-allowed text-zinc-500 dark:text-zinc-400")}>
                  <span className="whitespace-nowrap">Video to Reels</span>
                  <span className="text-[10px] font-bold bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-1.5 py-0.5 rounded-full shrink-0">Soon</span>
                </div>
                <Link to="/content-lab/thumbnail-creator" className={cn("block px-3 py-2 text-sm transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis", location.pathname === '/content-lab/thumbnail-creator' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-50 dark:bg-zinc-800")}>Thumbnail Creator</Link>
                <Link to="/content-lab/linkedin-carousels" className={cn("block px-3 py-2 text-sm transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis", location.pathname === '/content-lab/linkedin-carousels' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-50 dark:bg-zinc-800")}>LinkedIn Carousels</Link>
                <Link to="/content-lab/yt-insta-posts" className={cn("block px-3 py-2 text-sm transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis", location.pathname === '/content-lab/yt-insta-posts' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-50 dark:bg-zinc-800")}>YT & Insta Posts</Link>
              </div>
            )}
          </div>

          <div className="py-1 w-full">
            <button 
              onClick={() => isSidebarOpen && setIsLibraryOpen(!isLibraryOpen)}
              title={!isSidebarOpen ? "Library" : undefined}
              className={cn("w-full flex items-center transition-all rounded-xl", isSidebarOpen ? "justify-between px-3 py-2.5" : "justify-center py-2.5 px-0", (location.pathname.includes('/saved-') || location.pathname.includes('/content-lab/saved-thumbnails')) ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:bg-zinc-800 hover:text-zinc-900 dark:text-white")}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="material-symbols-outlined shrink-0">collections_bookmark</span>
                {isSidebarOpen && <span className="whitespace-nowrap">Library</span>}
              </div>
              {isSidebarOpen && (
                <span className="material-symbols-outlined text-sm transition-transform shrink-0">
                  {isLibraryOpen ? 'expand_more' : 'chevron_right'}
                </span>
              )}
            </button>
            
            {isLibraryOpen && isSidebarOpen && (
              <div className="ml-9 mt-2 space-y-1 border-l-2 border-primary/10 pl-3">
                <Link to="/content-lab/saved-thumbnails" className={cn("block px-3 py-2 text-sm transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis", location.pathname === '/content-lab/saved-thumbnails' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-50 dark:bg-zinc-800")}>Saved Thumbnails</Link>
                <Link to="/saved-posts" className={cn("block px-3 py-2 text-sm transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis", location.pathname === '/saved-posts' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-50 dark:bg-zinc-800")}>Saved Posts</Link>
                <Link to="/saved-carousels" className={cn("block px-3 py-2 text-sm transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis", location.pathname === '/saved-carousels' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-50 dark:bg-zinc-800")}>Saved Carousels</Link>
              </div>
            )}
          </div>

          <div className="py-1 w-full">
            <button 
              onClick={() => isSidebarOpen && setIsShopifyToolsOpen(!isShopifyToolsOpen)}
              title={!isSidebarOpen ? "Shopify Tools" : undefined}
              className={cn("w-full flex items-center transition-all rounded-xl", isSidebarOpen ? "justify-between px-3 py-2.5" : "justify-center py-2.5 px-0", location.pathname.includes('/shopify-tools') ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:bg-zinc-800 hover:text-zinc-900 dark:text-white")}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="material-symbols-outlined shrink-0">shopping_cart</span>
                {isSidebarOpen && <span className="whitespace-nowrap">Shopify Tools</span>}
              </div>
              {isSidebarOpen && (
                <span className="material-symbols-outlined text-sm transition-transform shrink-0">
                  {isShopifyToolsOpen ? 'expand_more' : 'chevron_right'}
                </span>
              )}
            </button>
            
            {isShopifyToolsOpen && isSidebarOpen && (
              <div className="ml-9 mt-2 space-y-1 border-l-2 border-primary/10 pl-3">
                <Link to="/shopify-tools/product-photo-studio" className={cn("flex items-center justify-between px-3 py-2 text-sm transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis", location.pathname === '/shopify-tools/product-photo-studio' ? "text-primary font-bold bg-primary/5" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-50 dark:bg-zinc-800")}>
                  <span>Product Photo Studio</span>
                  <span className="text-[10px] font-bold bg-zinc-200 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-full shrink-0">Soon</span>
                </Link>
                <a href="#" className="flex items-center justify-between px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-50 dark:bg-zinc-800 transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis">
                  <span>SEO Copywriter</span>
                  <span className="text-[10px] font-bold bg-zinc-200 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-full shrink-0">Soon</span>
                </a>
              </div>
            )}
          </div>

          <Link to="/settings" title={!isSidebarOpen ? "Settings" : undefined} className={cn("w-full flex items-center gap-3 py-2.5 transition-all rounded-xl", isSidebarOpen ? "px-3" : "px-0 justify-center", location.pathname === '/settings' ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:bg-zinc-800 hover:text-zinc-900 dark:text-white")}>
            <span className="material-symbols-outlined shrink-0">settings</span>
            {isSidebarOpen && <span className="whitespace-nowrap">Settings</span>}
          </Link>
          <Link to="/integrations" title={!isSidebarOpen ? "Integrations" : undefined} className={cn("w-full flex items-center gap-3 py-2.5 transition-all rounded-xl", isSidebarOpen ? "px-3" : "px-0 justify-center", location.pathname === '/integrations' ? "text-primary font-bold bg-primary/5 shadow-sm border border-primary/10" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:bg-zinc-800 hover:text-zinc-900 dark:text-white")}>
            <span className="material-symbols-outlined shrink-0">link</span>
            {isSidebarOpen && <span className="whitespace-nowrap">Integrations</span>}
          </Link>
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800 w-full">
          {isSidebarOpen ? (
            <div className="bg-primary/5 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">
                  {subscriptionPlan === 'infinity' ? 'Infinity Plan' : subscriptionPlan === 'pro' ? 'Pro Plan' : 'Starter Plan'}
                </p>
                <span className="text-[10px] font-black bg-white dark:bg-zinc-900 px-2 py-0.5 rounded text-primary border border-primary/10 shadow-sm">
                  {subscriptionPlan === 'infinity' ? '∞' : `${credits} CR`}
                </span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-1.5 mb-3 overflow-hidden">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: subscriptionPlan === 'infinity' ? '100%' : subscriptionPlan === 'pro' ? `${(credits / 500) * 100}%` : `${(credits / 80) * 100}%` }}
                ></div>
              </div>
              <Link to="/upgrade" className={cn("w-full flex items-center justify-center py-2 text-white dark:text-zinc-900 text-xs font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap", subscriptionPlan === 'infinity' ? 'bg-primary hover:bg-primary-dim cursor-default' : 'bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-700')}>
                {subscriptionPlan === 'infinity' ? 'Your Plan: Infinity' : subscriptionPlan === 'pro' ? 'Upgrade to Infinity' : 'Upgrade Plan'}
              </Link>
            </div>
          ) : (
            <Link to="/upgrade" title="Upgrade Plan" className="w-10 h-10 mx-auto bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">
              <span className="material-symbols-outlined text-sm shrink-0">rocket_launch</span>
            </Link>
          )}
          <button onClick={signOut} title={!isSidebarOpen ? "Log Out" : undefined} className={cn("w-full flex items-center transition-colors text-zinc-500 dark:text-zinc-400 hover:text-error", isSidebarOpen ? "px-3 py-2.5 gap-3" : "py-2.5 px-0 justify-center")}>
            <span className="material-symbols-outlined shrink-0">logout</span>
            {isSidebarOpen && <span className="whitespace-nowrap">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={cn("pt-24 pb-12 min-h-screen relative z-10 bg-white dark:bg-zinc-900/40 transition-all duration-300", isSidebarOpen ? "md:ml-64" : "md:ml-16")}>
        <Outlet />
      </main>
    </div>
  );
}
