import React from 'react';

export default function AIConcepts({ stepCount }) {
  const concepts = [
    { label: "Problem Type", value: "State Space Search" },
    { label: "Algorithm", value: "Breadth-First Search" },
    { label: "Initial State", value: "(8, 0, 0)" },
    { label: "Goal State", value: "(4, 4, 0)" },
    { label: "Operators", value: "6 Types" },
    { label: "Steps to Solve", value: stepCount || "?" },
  ];

  return (
    <div className="w-full bg-[#000000] border-b border-[#1a1a1a] flex flex-col">
      <div className="w-full flex justify-start md:justify-center py-2 px-6 overflow-x-auto custom-scrollbar">
        <div className="flex flex-row items-center divide-x divide-[#1a1a1a] whitespace-nowrap min-w-max">
          {concepts.map((c, i) => (
            <div key={i} className="flex flex-col px-4 md:px-6 first:pl-0 last:pr-0 text-center">
              <span className="text-[11px] text-[#888888] font-[400] mb-[2px]">
                {c.label}
              </span>
              <span className="text-[13px] text-[#ffffff] font-[400]">
                {c.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full text-center py-[6px] text-[#666666] text-[11px] font-mono border-t border-[#1a1a1a]">
        Operators: A→B | A→C | B→A | B→C | C→A | C→B
      </div>
    </div>
  );
}
