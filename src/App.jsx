import React from 'react';
import Navbar from './components/Navbar';
import JugSimulation from './components/JugSimulation';
import Controls from './components/Controls';
import ActionLog from './components/ActionLog';
import BFSGraph from './components/BFSGraph';
import AIConcepts from './components/AIConcepts';
import GoalBanner from './components/GoalBanner';
import { useWaterJug } from './hooks/useWaterJug';
import { CAPACITIES } from './utils/bfs';

function App() {
  const {
    currentState,
    status,
    actionLog,
    graphNodes,
    playbackSpeed,
    setPlaybackSpeed,
    isStepMode,
    setIsStepMode,
    algorithm,
    setAlgorithm,
    algorithmStats,
    explainMode,
    setExplainMode,
    currentExplanation,
    nextStep,
    manualPour,
    autoSolve,
    reset
  } = useWaterJug();

  return (
    <div className="min-h-screen text-[#cccccc] pb-20 relative font-syne bg-[#000000]">
      
      {/* ZONE 1: Sticky Navbar */}
      <Navbar 
        currentState={currentState}
        status={status}
        autoSolve={autoSolve}
        reset={reset}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        isStepMode={isStepMode}
        setIsStepMode={setIsStepMode}
        nextStep={nextStep}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        algorithmStats={algorithmStats}
        explainMode={explainMode}
        setExplainMode={setExplainMode}
      />

      {/* ZONE 4: Static Strip AI Concepts */}
      <AIConcepts stepCount={actionLog.length - 1} algorithm={algorithm} />
      
      {/* GOAL BANNER (Inline Flowing) */}
      <GoalBanner status={status} />
      
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-8 md:text-lg">
        
        {/* ZONE 2: Simulation & Logs Row */}
        <div className="flex flex-col lg:flex-row w-full gap-8 items-stretch h-auto min-h-[600px]">
          
          {/* Left Column (Jugs + Manual Controls) */}
          <div className="flex-1 lg:w-3/5 flex flex-col gap-6">
            <JugSimulation currentState={currentState} capacities={CAPACITIES}>
               <Controls currentState={currentState} status={status} manualPour={manualPour} />
            </JugSimulation>
          </div>

          {/* Right Column (Action Log) */}
          <div className="w-full lg:w-2/5 flex flex-col h-full">
             <ActionLog 
               logs={actionLog} 
               explainMode={explainMode} 
               currentExplanation={currentExplanation} 
             />
          </div>
          
        </div>

        {/* ZONE 3: BFS/DFS Graph */}
        <div className="w-full">
          <BFSGraph nodes={graphNodes} algorithm={algorithm} />
        </div>

      </main>
      
    </div>
  );
}

export default App;
