import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppContext } from '../context/AppContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Analytics() {
  const navigate = useNavigate();
  const { savedThumbnails } = useAppContext();

  return (
    <div className="p-8 h-full flex flex-col font-sans border-t border-white/5 bg-[#0A0A0A]">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-8">
        
        <h1 className="text-2xl font-bold text-white tracking-tight">Your Thumbnails</h1>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button 
             onClick={() => navigate('/content-lab/thumbnail-creator')}
             className="h-10 pl-3 pr-4 flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create
          </button>
        </div>

      </div>

      {/* Sorting / Header Row */}
      <div className="flex items-center gap-6 px-2 mb-6 text-xs font-bold text-white/40">
        <button className="hover:text-white transition-colors flex items-center gap-1 text-white">
          Updated
        </button>
        <button className="hover:text-white transition-colors">
          Created
        </button>
        <button className="hover:text-white transition-colors">
          Name
        </button>
        <button className="hover:text-white transition-colors ml-2">
          <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Create New Card */}
        <Link to="/content-lab/thumbnail-creator" className="group cursor-pointer flex flex-col gap-3">
          <div className="aspect-[16/9] w-full border border-dashed border-white/20 rounded-xl bg-white/5 group-hover:bg-white/10 group-hover:border-white/40 transition-all flex items-center justify-center">
             <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-white/60 text-[24px]">add</span>
             </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-white/90 transition-colors">New Thumbnail</h3>
            <p className="text-xs text-white/40 mt-1">Start with any image</p>
          </div>
        </Link>

        {/* Existing Thumbnails */}
        {savedThumbnails.map(thumb => (
          <div key={thumb.id} className="group cursor-pointer flex flex-col gap-3">
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-white/5 relative border border-white/5 group-hover:border-white/30 transition-all">
               <img src={thumb.url} alt={thumb.topic} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold border border-white/10">
                 Saved
               </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-white/90 transition-colors truncate">{thumb.topic}</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-white/40">{thumb.date}</p>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <p className="text-xs text-white/40">Custom</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
