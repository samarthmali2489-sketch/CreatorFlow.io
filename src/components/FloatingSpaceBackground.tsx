import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Image as ImageIcon, View, Layers, Share2, ThumbsUp, Repeat, Send } from 'lucide-react';

const ICONS = [Heart, MessageCircle, ImageIcon, View, Layers, Share2, ThumbsUp, Repeat, Send];

interface FloatingElement {
  id: number;
  Icon: React.ElementType;
  initialX: number;
  initialY: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  rotationDirection: number;
}

const COLORS = [
  'text-rose-400', 
  'text-blue-400', 
  'text-green-400', 
  'text-purple-400', 
  'text-amber-400', 
  'text-indigo-400',
  'text-sky-400',
  'text-pink-400'
];

export function FloatingSpaceBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Generate a fixed number of elements to float around
    const generateElements = () => {
      const newElements: FloatingElement[] = [];
      const count = 35; // Number of floating objects
      for (let i = 0; i < count; i++) {
        newElements.push({
          id: i,
          Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
          initialX: Math.random() * 100, // percentage vw
          initialY: Math.random() * 100, // percentage vh
          size: Math.random() * 32 + 20, // 20px to 52px
          duration: Math.random() * 50 + 40, // 40s to 90s
          delay: Math.random() * -60, // random start time offset
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotationDirection: Math.random() > 0.5 ? 1 : -1
        });
      }
      setElements(newElements);
    };

    generateElements();
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-40">
      {/* Deep space gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-50/50 to-slate-50 lg:via-transparent z-10"></div>
      
      {elements.map((el) => {
        // Random drift destination
        const endX = el.initialX + (Math.random() * 40 - 20); 
        const endY = el.initialY + (Math.random() * 40 - 20);
        
        return (
          <motion.div
            key={el.id}
            className={`absolute ${el.color}`}
            initial={{ 
              x: `${el.initialX}vw`, 
              y: `${el.initialY}vh`,
              rotate: 0,
              scale: 0
            }}
            animate={{
              x: [`${el.initialX}vw`, `${endX}vw`, `${el.initialX}vw`],
              y: [`${el.initialY}vh`, `${endY}vh`, `${el.initialY}vh`],
              rotate: [0, 360 * el.rotationDirection],
              scale: [0.8, 1.1, 0.8],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              ease: "linear",
              delay: el.delay,
            }}
            style={{ width: el.size, height: el.size }}
          >
            <el.Icon size={el.size} strokeWidth={1.5} className="drop-shadow-lg" />
          </motion.div>
        );
      })}
    </div>
  );
}
