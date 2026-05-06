import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppContext } from '../context/AppContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Assets() {
  const { savedThumbnails } = useAppContext();

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] border-t border-white/5 font-sans w-full">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Your Assets</h1>
            <p className="text-white/40 text-sm mt-1">Manage your generated graphics.</p>
          </div>
        </div>

        {/* Assets Grid */}
        {savedThumbnails.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-2xl">
            <span className="material-symbols-outlined text-4xl text-white/20 mb-3">image_not_supported</span>
            <h3 className="text-white font-bold text-lg mb-1">No generated assets</h3>
            <p className="text-white/40 text-sm">Created thumbnails will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {savedThumbnails.map((asset) => (
              <div key={asset.id} className="group cursor-pointer flex flex-col gap-3">
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-white/5 relative border border-white/5 group-hover:border-white/30 transition-all flex flex-col items-center justify-center">
                   <img src={asset.url} alt={asset.topic} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute top-2 right-2 bg-[#0A0A0A] px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                     Select
                   </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-white/90 transition-colors truncate" title={asset.topic}>
                    {asset.topic || 'Generated Thumbnail'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-white/40">Custom</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
