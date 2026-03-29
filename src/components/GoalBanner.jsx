import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoalBanner({ status }) {
  return (
    <AnimatePresence>
      {status === 'GOAL' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full bg-[#000000] border-t-2 border-b-2 border-[#00e676] overflow-hidden"
        >
          <div className="py-4 text-center">
            <h2 className="text-[20px] font-bold text-[#ffffff] m-0 tracking-widest uppercase">
              SOLVED — (4,4,0)
            </h2>
            <p className="text-[12px] text-[#ffffff] m-0 mt-2 font-[400] opacity-90">
              🎉 Both friends receive exactly 4L — BFS found the optimal path in 7 steps.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
