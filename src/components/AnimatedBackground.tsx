import React from 'react';
import { motion } from 'motion/react';

interface AnimatedBackgroundProps {
  reducedMotion?: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ reducedMotion = false }) => {
  if (reducedMotion) {
    return (
      <div 
        tabIndex={-1}
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F8F7F3] focus:outline-none"
      />
    );
  }

  return (
    <div 
      tabIndex={-1}
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F8F7F3] focus:outline-none"
    >
      {/* Soft playful floating decorative blobs */}
      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, -30, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#7667D9]/8 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 35, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -left-28 w-96 h-96 rounded-full bg-[#F28B82]/8 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, 20, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-24 right-1/4 w-88 h-88 rounded-full bg-[#91C9B7]/10 blur-3xl"
      />

      {/* Small floating geometric symbols */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 15, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-28 left-[10%] w-6 h-6 rounded-lg bg-[#F4D58D]/40 rotate-12"
      />

      <motion.div
        animate={{
          y: [0, 18, 0],
          rotate: [0, -20, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/4 right-[8%] w-5 h-5 rounded-full border-2 border-[#7667D9]/30"
      />

      <motion.div
        animate={{
          y: [0, -12, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/3 left-[7%] w-4 h-4 rounded-full bg-[#91C9B7]/50"
      />

      <motion.div
        animate={{
          y: [0, 14, 0],
          rotate: [45, 90, 45],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-24 right-[12%] w-5 h-5 rounded-sm bg-[#F28B82]/30 rotate-45"
      />
    </div>
  );
};
