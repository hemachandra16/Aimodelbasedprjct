import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isGoal } from '../utils/bfs';

export default function ActionLog({ logs, explainMode, currentExplanation }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="card-minimal p-6 md:p-8 flex flex-col h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-[700] text-white m-0 tracking-[1px] leading-none">
          Action Log
        </h2>
        <span className="text-[11px] font-[400] text-[#888888] tracking-widest uppercase">
          State Count: {logs.length}
        </span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar"
      >
        <AnimatePresence>
          {logs.map((log, index) => {
            const isLast = index === logs.length - 1;
            const logIsGoal = isGoal(log.state);

            let rowClass = "border-[#1a1a1a] border-l-[#1a1a1a]";
            let tupleColor = "text-[#888888]";

            if (isLast) {
              if (logIsGoal) {
                rowClass = "border-[#1a1a1a] border-l-[#00e676]";
                tupleColor = "text-[#00e676]";
              } else {
                rowClass = "border-[#1a1a1a] border-l-[#7b61ff]";
                tupleColor = "text-[#7b61ff]";
              }
            }

            return (
              <motion.div
                key={`${log.stepNumber}-${index}`}
                initial={{ opacity: 0, scale: 0.98, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between bg-[#0d0d0d] border border-l-2 p-3 ${rowClass}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-[#888888] w-6">
                    #{log.stepNumber}
                  </span>
                  
                  {log.operator ? (
                    <span className="text-[13px] text-white font-[400]">
                      {log.operator.name}
                    </span>
                  ) : (
                    <span className="text-[13px] text-[#888888] italic">
                      Initial State
                    </span>
                  )}
                </div>
                
                <span className={`font-mono text-[13px] font-[800] ${tupleColor}`}>
                  ({log.state.join(',')})
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Explain Card — pinned at bottom of action log */}
      {explainMode && currentExplanation && (
        <div
          style={{
            borderTop: '1px solid #1a1a1a',
            borderRight: 'none',
            borderBottom: 'none',
            borderLeft: '2px solid #7b61ff',
            background: '#0d0d0d',
            padding: '12px',
            marginTop: '0',
            maxHeight: '80px',
            overflow: 'hidden'
          }}
          className="md:max-h-none md:overflow-visible"
        >
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            color: '#ffffff',
            marginBottom: '4px'
          }}>
            Action: {currentExplanation.action}
          </div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: '#888888',
            marginBottom: '4px'
          }}>
            Reason: {currentExplanation.reason}
          </div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            color: '#7b61ff'
          }}>
            Result: ({currentExplanation.result[0]}, {currentExplanation.result[1]}, {currentExplanation.result[2]})
          </div>
        </div>
      )}
    </div>
  );
}
