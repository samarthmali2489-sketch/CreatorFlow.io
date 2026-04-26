import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Image as ImageIcon, View, Layers, Share2, ThumbsUp, Repeat, Send } from 'lucide-react';

const ICONS = [Heart, MessageCircle, ImageIcon, View, Layers, Share2, ThumbsUp, Repeat, Send];

export function FloatingSpaceBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-50/20 to-slate-50 lg:via-transparent z-10"></div>
      
      {/* Reduced elements, using pure CSS animations */}
      <div className="absolute top-1/4 left-1/4 text-rose-400 opacity-50 animate-slow-spin">
        <Heart size={32} />
      </div>
      <div className="absolute top-3/4 left-1/3 text-blue-400 opacity-50 animate-slow-spin" style={{ animationDirection: 'reverse', animationDuration: '24s' }}>
        <MessageCircle size={40} />
      </div>
      <div className="absolute top-1/3 right-1/4 text-purple-400 opacity-50 animate-slow-spin" style={{ animationDuration: '20s' }}>
        <ImageIcon size={24} />
      </div>
      <div className="absolute bottom-1/4 right-1/3 text-amber-400 opacity-50 animate-slow-spin" style={{ animationDirection: 'reverse' }}>
        <View size={36} />
      </div>
    </div>
  );
}

