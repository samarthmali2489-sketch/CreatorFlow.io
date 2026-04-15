import React from 'react';

export default function ProductPhotoStudio() {
  return (
    <div className="px-6 lg:px-12 transition-all h-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-surface-container-lowest rounded-[2rem] p-12 border border-outline-variant/15 flex flex-col items-center text-center max-w-2xl w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative z-10">
          <span className="material-symbols-outlined text-primary text-5xl">photo_camera</span>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-4 relative z-10">Product Photo Studio</h1>
        <p className="text-on-surface-variant text-lg leading-relaxed mb-8 relative z-10">
          Transform your Shopify product shots into editorial-grade marketing assets using AI-powered background removal and scene generation.
        </p>
        
        <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 px-4 py-2 rounded-full font-bold text-sm relative z-10">
          <span className="material-symbols-outlined text-sm">schedule</span>
          Coming Soon
        </div>
      </div>
    </div>
  );
}
