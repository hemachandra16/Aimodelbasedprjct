import React from 'react';

export default function Header() {
  return (
    <header className="py-8 text-center glass rounded-b-3xl mb-8 mx-auto w-full max-w-6xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[--color-accent] to-[--color-purple]">
        Water Jug Problem
      </h1>
      <h2 className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
        BFS State Space Search
      </h2>
      <div className="flex flex-wrap justify-center gap-3 font-mono-code text-xs md:text-sm">
        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-[--color-accent] border border-blue-500/30">
          #AI
        </span>
        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-[--color-purple] border border-purple-500/30">
          #BreadthFirstSearch
        </span>
        <span className="px-3 py-1 rounded-full bg-green-500/20 text-[--color-green] border border-green-500/30">
          #StateSpace
        </span>
      </div>
    </header>
  );
}
