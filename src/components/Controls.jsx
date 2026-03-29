import React from 'react';
import { OPERATORS } from '../utils/bfs';

export default function Controls({ currentState, status, manualPour }) {
  const isSolvingOrGoal = status === 'SOLVING' || status === 'GOAL';

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {OPERATORS.map(op => {
          let disabledReason = null;
          if (isSolvingOrGoal) {
            disabledReason = "Solver is active";
          } else if (currentState[op.from] === 0) {
            disabledReason = `Jug ${['A','B','C'][op.from]} is empty`;
          } else if (currentState[op.to] === [8,5,3][op.to]) {
            disabledReason = `Jug ${['A','B','C'][op.to]} is full`;
          }

          const disabled = !!disabledReason;

          return (
            <button
              key={op.id}
              onClick={() => manualPour(op.from, op.to)}
              disabled={disabled}
              title={disabledReason || ""}
              className={`
                h-[40px] px-4 font-mono font-[700] rounded-[6px] text-[12px] transition-colors relative 
                bg-[#0d0d0d]
                ${disabled 
                  ? 'border border-[#333333] text-[#555555] opacity-30 cursor-not-allowed' 
                  : 'border border-[#ffffff] text-[#ffffff] hover:border-[#7b61ff] hover:text-[#7b61ff] cursor-pointer'
                }
              `}
            >
              {op.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
