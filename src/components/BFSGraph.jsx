import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BFSGraph({ nodes }) {
  const scrollRef = useRef(null);
  const [showFullTree, setShowFullTree] = useState(false);

  const displayedNodes = useMemo(() => {
    return showFullTree ? nodes : nodes.filter(n => n.isPath);
  }, [nodes, showFullTree]);

  const levels = useMemo(() => {
    const grouped = [];
    displayedNodes.forEach(node => {
      if (!grouped[node.level]) {
        grouped[node.level] = [];
      }
      grouped[node.level].push(node);
    });
    return grouped;
  }, [displayedNodes]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [levels]);

  return (
    <div className="bg-[#000000] p-6 md:p-8 mt-6 w-full max-h-[60vh] md:max-h-none h-[60vh] md:h-[600px] flex flex-col relative overflow-hidden border-t border-[#1a1a1a]">
      <div className="flex justify-between items-center mb-6 sticky top-0 z-10 w-full pb-2 bg-[#000000]">
        <h2 className="text-[13px] md:text-[15px] font-[700] tracking-[1px] text-white m-0">
          BFS Exploration Tree
        </h2>
        
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <span className="hidden md:inline text-[10px] uppercase font-[400] text-[#888888] tracking-[2px]">Show Full Tree</span>
          <div className="relative shrink-0">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={showFullTree} 
              onChange={() => setShowFullTree(!showFullTree)}
            />
            <div className={`w-8 h-4 rounded-full transition ${showFullTree ? 'bg-[#7b61ff]' : 'bg-[#333333]'}`}></div>
            <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition transform ${showFullTree ? 'translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto custom-scrollbar w-full"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="md:hidden text-center text-[9px] text-[#888888] pb-4">
          ← scroll to explore →
        </div>

        <div className="flex flex-col items-center gap-0 pb-20 min-w-[500px] md:min-w-[600px] w-full">
          <AnimatePresence>
            {levels.map((levelNodes, levelIndex) => (
              <div 
                key={`level-${levelIndex}`}
                className="flex justify-center gap-4 md:gap-12 flex-nowrap px-4"
              >
                {levelNodes.map((node, nodeIndex) => {
                  
                  let boxClass = "bg-[#0d0d0d] border-[#333333] border text-white";
                  let shadowClass = "";
                  let lineClass = "border-[#333333] border-l";
                  let operatorColor = "text-[#888888]";

                  if (node.isGoal) {
                    boxClass = "bg-[#001a0d] border-[#00e676] border-2 text-[#00e676]";
                    shadowClass = "shadow-[0_0_16px_rgba(0,230,118,0.5)]";
                    lineClass = "border-[#00e676] border-l-2";
                    operatorColor = "text-[#00e676]";
                  } else if (node.isPath) {
                    boxClass = "bg-[#1a0f2e] border-[#7b61ff] border-2 text-[#7b61ff]";
                    shadowClass = "shadow-[0_0_12px_rgba(123,97,255,0.4)]";
                    lineClass = "border-[#7b61ff] border-l-2";
                    operatorColor = "text-[#7b61ff]";
                  }

                  const opName = node.operatorSource ? node.operatorSource.name : "";
                  const displayOpName = opName.length > 10 ? opName.substring(0, 10) + '...' : opName;

                  return (
                    <div key={`${node.id}-${nodeIndex}`} className="flex flex-col items-center relative">
                      {/* Connector Line ANIMATING */}
                      {levelIndex > 0 && node.operatorSource && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 40, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`w-px flex flex-col items-center justify-center relative ${lineClass}`}
                          style={{ minHeight: '40px' }}
                        >
                           <span className={`absolute bg-[#000000] px-1 md:px-2 text-[8px] md:text-[9px] uppercase tracking-widest whitespace-nowrap ${operatorColor}`}>
                             {displayOpName}
                           </span>
                        </motion.div>
                      )}

                      {/* Node Box ANIMATING */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: levelIndex > 0 ? 0.1 : 0 }}
                        className={`px-2 py-1 md:px-4 md:py-2 font-mono text-[10px] md:text-[12px] font-[400] transition-colors rounded-none whitespace-nowrap min-w-[80px] max-w-[100px] md:min-w-0 md:max-w-none flex justify-center items-center ${boxClass} ${shadowClass}`}
                      >
                        ({node.state[0]}, {node.state[1]}, {node.state[2]})
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            ))}
          </AnimatePresence>

          {nodes.length === 0 && (
            <div className="text-[13px] text-[#888888] font-[400] italic m-auto mt-20">Awaiting exploration...</div>
          )}
        </div>
      </div>
    </div>
  );
}
