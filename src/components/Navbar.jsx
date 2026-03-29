import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({
  currentState,
  status,
  autoSolve,
  reset,
  playbackSpeed,
  setPlaybackSpeed,
  isStepMode,
  setIsStepMode,
  nextStep
}) {
  const getDotStyles = () => {
    switch(status) {
      case 'INITIAL': return { color: '#888888', dot: 'bg-[#888888]' };
      case 'SOLVING': return { color: '#ff9100', dot: 'bg-[#ff9100]' };
      case 'GOAL': return { color: '#00e676', dot: 'bg-[#00e676]' };
      default: return { color: '#888888', dot: 'bg-[#888888]' };
    }
  };

  const isSolvingOrGoal = status === 'SOLVING' || status === 'GOAL';
  const statusConfig = getDotStyles();

  return (
    <nav className="sticky top-0 z-50 w-full md:h-[64px] flex items-center bg-[#000000] border-b border-[#1a1a1a] px-4 md:px-6 py-3 md:py-0">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        
        {/* Row 1 / Left Side: Titles (and status on mobile) */}
        <div className="w-full md:w-auto flex items-center justify-between md:flex-col md:justify-center md:items-start flex-1 gap-2 md:gap-0">
          <div>
            <h1 className="text-[16px] md:text-[18px] font-[800] text-white leading-tight m-0">
              Water Jug Problem
            </h1>
            <div className="text-[10px] md:text-[11px] text-[#888888] m-0 leading-tight">
              BFS State Space Search
            </div>
          </div>
          {/* Status badge right on mobile only */}
          <div className="md:hidden flex items-center gap-1.5 uppercase tracking-widest text-[10px]" style={{ color: statusConfig.color }}>
             <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
             {status}
          </div>
        </div>

        {/* Row 2 / Center: State Tuple inline with badge (badge visible on md+) */}
        <div className="flex-1 flex items-center justify-center gap-3">
          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3">
            <span className="text-[13px] md:text-[16px] text-[#ffffff] font-mono tracking-tight mt-0 md:mt-1">State (A,B,C) =</span>
            <div className="text-[32px] md:text-[40px] font-[800] font-mono text-white leading-none tracking-tighter flex items-center mt-1 md:mt-0">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={currentState.join(',')}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  className="inline-block"
                >
                  ({currentState[0]}, {currentState[1]}, {currentState[2]})
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 uppercase tracking-widest text-[10px]" style={{ color: statusConfig.color }}>
             <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
             {status}
          </div>
        </div>

        {/* Row 3 / Right Side: Inline Controls */}
        <div className="flex-1 w-full md:w-auto flex items-center justify-center md:justify-end gap-3 md:gap-6 overflow-x-auto pb-1 md:pb-0 whitespace-nowrap">
          
          <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer shrink-0">
            <span className="text-[9px] md:text-[10px] text-[#888888] uppercase tracking-[1px] md:tracking-[2px]">Step Mode</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isStepMode} 
                onChange={() => setIsStepMode(!isStepMode)}
                disabled={isSolvingOrGoal}
              />
              <div className={`w-7 h-3.5 md:w-8 md:h-4 rounded-full transition ${isStepMode ? 'bg-[#7b61ff]' : 'bg-[#333333]'}`}></div>
              <div className={`absolute top-0.5 left-0.5 bg-white w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition transform ${isStepMode ? 'translate-x-3.5 md:translate-x-4' : ''}`}></div>
            </div>
          </label>

          <div className="flex items-center gap-1.5 md:gap-2 group w-16 md:w-24 shrink-0">
            <span className="text-[9px] md:text-[10px] text-[#888888] uppercase tracking-[1px] md:tracking-[2px]">Speed</span>
            <input 
              type="range" 
              min="100" max="1000" step="100"
              value={1100 - playbackSpeed}
              onChange={(e) => setPlaybackSpeed(1100 - parseInt(e.target.value))}
              disabled={isSolvingOrGoal || isStepMode}
              className="w-full h-1 bg-[#333333] appearance-none cursor-pointer accent-[#7b61ff] disabled:opacity-30"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {isStepMode ? (
              <button
                onClick={nextStep}
                disabled={status === 'GOAL'}
                className="h-[26px] md:h-[30px] px-3 md:px-4 rounded-[4px] bg-[#0d0d0d] border border-[#333333] text-white text-[10px] md:text-[12px] font-bold tracking-widest hover:border-[#7b61ff] hover:text-[#7b61ff] transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase"
              >
                NEXT
              </button>
            ) : (
              <button 
                onClick={autoSolve}
                disabled={status !== 'INITIAL'}
                className="h-[26px] md:h-[30px] px-3 md:px-4 rounded-[4px] bg-[#0d0d0d] border border-[#333333] text-white text-[10px] md:text-[12px] font-bold tracking-widest hover:border-[#7b61ff] hover:text-[#7b61ff] transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase"
              >
                AUTO SOLVE
              </button>
            )}
            
            <button 
              onClick={reset}
              className="h-[26px] md:h-[30px] px-3 md:px-4 rounded-[4px] bg-[#0d0d0d] border border-[#333333] text-[#888888] text-[10px] md:text-[12px] font-bold tracking-widest hover:border-red-500 hover:text-red-500 transition-colors uppercase"
            >
              RESET
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}
