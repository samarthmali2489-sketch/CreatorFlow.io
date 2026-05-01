import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Twitter, Zap, X, Gift } from 'lucide-react';

interface FounderRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderRewardModal: React.FC<FounderRewardModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <Gift size={32} />
              </div>
              
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white mb-2 font-headline uppercase">
                Welcome Gift!
              </h2>
              
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-8 leading-relaxed">
                We've allocated 1,000 free credits to your account. Claim them now and start building.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={onClose}
                  className="w-full bg-primary text-white py-4 rounded-xl font-black text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  Claim 1,000 Credits
                </button>
                
                <a 
                  href="https://x.com/samarth2489" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 py-3 rounded-xl font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Twitter size={14} fill="currentColor" />
                  Follow Founder on X
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
