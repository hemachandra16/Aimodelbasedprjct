import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StateCard({ currentState, status }) {
  const getBadgeStyles = () => {
    switch(status) {
      case 'INITIAL': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'SOLVING': return 'bg-orange-500/20 text-[--color-orange] border-orange-500/30';
      case 'GOAL': return 'bg-green-500/20 text-[--color-green] border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="glass p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden h-full">
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getBadgeStyles()}`}>
          {status}
        </span>
      </div>
      
      <p className="text-gray-400 mb-2 font-mono uppercase text-sm tracking-widest">
        Current State
      </p>
      
      <div className="text-6xl md:text-8xl font-bold font-mono tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentState.join(',')}
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-block"
          >
            ({currentState[0]}, {currentState[1]}, {currentState[2]})
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
