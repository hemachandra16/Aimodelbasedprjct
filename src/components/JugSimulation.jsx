import React from 'react';
import { motion } from 'framer-motion';

export function Jug({ id, label, currentAmount, capacity }) {
  const fillPercentage = (currentAmount / Math.max(capacity, 1)) * 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 text-[14px] text-white font-[700] m-0">
        {id}
      </div>
      
      {/* Container */}
      <div 
        className="relative w-24 min-w-[80px] md:min-w-[120px] bg-[#000000] overflow-hidden border border-[#1a1a1a] flex items-end"
        style={{ height: '350px' }}
      >
        <motion.div 
          className="w-full bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-300 relative"
          initial={{ height: 0 }}
          animate={{ height: `${fillPercentage}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
        >
          {currentAmount > 0 && (
             <div className="absolute inset-0 flex items-center justify-center font-mono text-white text-[24px] font-[800] z-10 pointer-events-none">
                {currentAmount}L
             </div>
          )}
        </motion.div>
        
        {/* Visual Measurement Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
          {Array.from({ length: capacity + 1 }).map((_, i) => (
            <div key={i} className="w-full h-px bg-[#1a1a1a] border-none m-0"></div>
          ))}
        </div>
      </div>
      
      {/* Max Capacity Label Below */}
      <div className="mt-4 text-[11px] text-[#888888] font-[400] tracking-widest uppercase m-0">
        MAX <span className="text-[#888888]">{capacity}L</span>
      </div>
    </div>
  );
}

export default function JugSimulation({ currentState, capacities, children }) {
  return (
    <div className="card-minimal flex flex-col items-center justify-between h-full w-full">
      <div className="flex justify-center items-end gap-6 sm:gap-10 md:gap-16 w-full mt-10 mb-10">
        <Jug id="Jug A" currentAmount={currentState[0]} capacity={ capacities[0] } />
        <Jug id="Jug B" currentAmount={currentState[1]} capacity={ capacities[1] } />
        <Jug id="Jug C" currentAmount={currentState[2]} capacity={ capacities[2] } />
      </div>
      
      <div className="w-full pb-6 px-4 sm:px-8 shrink-0">
        {children}
      </div>
    </div>
  );
}
