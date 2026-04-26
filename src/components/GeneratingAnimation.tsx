import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GeneratingAnimationProps {
  text?: string;
}

const loadingPhrases = [
  "Analyzing context and extracting vectors...",
  "Applying AI magic and color theory...",
  "Synthesizing creative variables...",
  "Distilling brilliance...",
  "Building your masterpiece...",
  "Connecting to the creative matrix...",
  "Rendering pixels and possibilities..."
];

export function GeneratingAnimation({ text = "Generating..." }: GeneratingAnimationProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[450px] relative rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800">
      {/* Animated blob backgrounds */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: ['-20%', '20%', '-10%', '-20%'],
            y: ['-20%', '10%', '20%', '-20%'],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 90, 180, 360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-500 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{
            x: ['20%', '-20%', '20%', '20%'],
            y: ['20%', '-10%', '-20%', '20%'],
            scale: [0.9, 1.1, 1.2, 0.9],
            rotate: [360, 180, 90, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 text-primary rounded-full blur-[90px]"
        />
        <motion.div
          animate={{
            x: ['0%', '30%', '-30%', '0%'],
            y: ['30%', '0%', '-30%', '30%'],
            scale: [1.1, 0.9, 1.1, 1.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-purple-500 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Glowing loader orb */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-t-white border-r-white/30 border-b-white/10 border-l-white/50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-dashed border-white/40"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="material-symbols-outlined text-4xl text-white animate-pulse">auto_awesome</span>
          </div>
        </div>

        <motion.h3
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl font-black text-white tracking-tight mb-3"
        >
          {text}
        </motion.h3>

        <div className="h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-white/60 font-medium text-sm md:text-base"
            >
              {loadingPhrases[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
