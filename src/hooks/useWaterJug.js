import { useState, useCallback, useRef, useEffect } from 'react';
import { INITIAL_STATE, solveBFS, applyOperator, isGoal, OPERATORS, getStateString, CAPACITIES } from '../utils/bfs';
import { solveDFS } from '../utils/dfs';

export function useWaterJug() {
  const [currentState, setCurrentState] = useState(INITIAL_STATE);
  const [status, setStatus] = useState('INITIAL');
  const [actionLog, setActionLog] = useState([{ state: INITIAL_STATE, operator: null, stepNumber: 0 }]);
  const [playbackSpeed, setPlaybackSpeed] = useState(500); 
  const [isStepMode, setIsStepMode] = useState(false);
  const [graphNodes, setGraphNodes] = useState([
    { id: getStateString(INITIAL_STATE), state: INITIAL_STATE, parentId: null, isPath: true, isGoal: false, level: 0 }
  ]);
  
  // Feature 2: Algorithm toggle
  const [algorithm, setAlgorithm] = useState('BFS');
  const [algorithmStats, setAlgorithmStats] = useState(null);

  // Feature 3: Explain mode
  const [explainMode, setExplainMode] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState(null);

  const manualStepCount = useRef(0);
  const solvingRef = useRef(false);
  const cachedResult = useRef(null);
  const stepIndexRef = useRef(1);

  // CRITICAL: invalidate cache when algorithm changes
  useEffect(() => {
    cachedResult.current = null;
  }, [algorithm]);

  const solve = useCallback(() => {
    return algorithm === 'BFS' ? solveBFS() : solveDFS();
  }, [algorithm]);

  const jugLabels = ['A', 'B', 'C'];

  const computeExplanation = useCallback((operator, stateBefore, stateAfter) => {
    if (!operator || !stateBefore || !stateAfter) return null;
    const fromIdx = operator.from;
    const toIdx = operator.to;
    const fromLabel = jugLabels[fromIdx];
    const toLabel = jugLabels[toIdx];
    const amountBefore = stateBefore[fromIdx];
    const spaceAvailable = CAPACITIES[toIdx] - stateBefore[toIdx];
    const amountPoured = Math.min(amountBefore, spaceAvailable);
    return {
      action: operator.name,
      reason: `Jug ${fromLabel} had ${amountBefore}L. Jug ${toLabel} had ${spaceAvailable}L space. Poured ${amountPoured}L from ${fromLabel} to ${toLabel}.`,
      result: [...stateAfter]
    };
  }, []);

  const checkGoal = useCallback((state) => {
    if (isGoal(state)) {
      setStatus('GOAL');
      solvingRef.current = false;
      return true;
    }
    return false;
  }, []);

  const manualPour = useCallback((fromIdx, toIdx) => {
    if (status === 'SOLVING' || status === 'GOAL') return;

    const op = OPERATORS.find(o => o.from === fromIdx && o.to === toIdx);
    const newState = applyOperator(currentState, fromIdx, toIdx);
    if (!newState) return;

    setStatus('SOLVING');
    manualStepCount.current += 1;
    
    const stepNumber = actionLog.length;
    const newId = getStateString(newState);
    const goalReached = checkGoal(newState);

    // Explain mode
    if (explainMode && op) {
      setCurrentExplanation(computeExplanation(op, currentState, newState));
    }

    if (isStepMode) {
      if (!cachedResult.current) {
          const result = solve();
          const solutionIds = new Set(result.solution.map(s => getStateString(s.state)));
          const mappedExplored = result.explored.map(n => ({
              ...n,
              isPath: solutionIds.has(getStateString(n.state)),
              isGoal: isGoal(n.state)
          }));
          cachedResult.current = { solution: result.solution, explored: mappedExplored };
      }
      
      const { solution, explored } = cachedResult.current;
      const currentIndex = stepIndexRef.current;
      
      let matchesPath = false;
      if (currentIndex < solution.length) {
          const expectedStep = solution[currentIndex];
          if (getStateString(expectedStep.state) === newId) {
             matchesPath = true;
          }
      }

      setActionLog(prev => [...prev, { state: newState, operator: op, stepNumber }]);
      
      if (matchesPath) {
          const nodesUpToLevel = explored.filter(n => n.level <= currentIndex);
          setGraphNodes(nodesUpToLevel);
          stepIndexRef.current += 1;
      }
      
      setCurrentState(newState);
      if (!goalReached) setStatus('INITIAL');
      return;
    }
    
    setActionLog(prev => [...prev, { state: newState, operator: op, stepNumber }]);
    setGraphNodes(prev => {
      const exists = prev.find(n => n.id === newId);
      if (exists) return prev;
      return [...prev, {
        id: newId,
        state: newState,
        parentId: getStateString(currentState),
        isPath: true,
        isGoal: goalReached,
        level: manualStepCount.current,
        operatorSource: op
      }];
    });

    setCurrentState(newState);
    if (!goalReached) setStatus('INITIAL');

  }, [currentState, status, actionLog.length, checkGoal, isStepMode, explainMode, solve, computeExplanation]);

  const autoSolve = useCallback(async () => {
    if (status === 'SOLVING' || status === 'GOAL') return;
    
    const result = solve();
    if (!result.solution) return;

    setStatus('SOLVING');
    solvingRef.current = true;
    stepIndexRef.current = 1;
    
    setCurrentState(INITIAL_STATE);
    setActionLog([{ state: INITIAL_STATE, operator: null, stepNumber: 0 }]);
    setGraphNodes([]);

    const solutionIds = new Set(result.solution.map(s => getStateString(s.state)));

    for (let i = 0; i < result.explored.length; i++) {
        if (!solvingRef.current) break;
        
        const node = result.explored[i];
        await new Promise(resolve => setTimeout(resolve, playbackSpeed));
        
        const isCurrentGoal = isGoal(node.state);
        const isSolutionPathNode = solutionIds.has(node.id);

        setGraphNodes(prev => {
            if (prev.find(p => p.id === node.id)) return prev;
            return [...prev, {
                ...node,
                isPath: isSolutionPathNode,
                isGoal: isCurrentGoal
            }];
        });

        if (isSolutionPathNode) {
            setCurrentState(node.state);
            const solStep = result.solution.find(s => getStateString(s.state) === node.id);
            if (solStep && node.level > 0) { 
                setActionLog(prev => {
                    if (prev.find(p => getStateString(p.state) === node.id)) return prev;
                    return [...prev, { state: solStep.state, operator: node.operatorSource, stepNumber: node.level }];
                });

                // Explain mode for autoSolve
                if (explainMode && node.operatorSource) {
                  const prevSolIndex = result.solution.findIndex(s => getStateString(s.state) === node.id);
                  const prevState = prevSolIndex > 0 ? result.solution[prevSolIndex - 1].state : INITIAL_STATE;
                  setCurrentExplanation(computeExplanation(node.operatorSource, prevState, node.state));
                }
            }
        }

        if (isCurrentGoal) {
            setStatus('GOAL');
            solvingRef.current = false;

            // Set algorithm stats after solve completes
            setAlgorithmStats({
              statesExplored: result.explored.length,
              steps: result.solution.length - 1,
              pathOptimal: algorithm === 'BFS'
            });
        }
    }
  }, [status, playbackSpeed, solve, explainMode, algorithm, computeExplanation]);

  const nextStep = useCallback(() => {
    if (status === 'SOLVING' || status === 'GOAL') return;
    setStatus('SOLVING'); 
    
    if (!cachedResult.current) {
        const result = solve();
        const solutionIds = new Set(result.solution.map(s => getStateString(s.state)));
        const mappedExplored = result.explored.map(n => ({
            ...n,
            isPath: solutionIds.has(getStateString(n.state)),
            isGoal: isGoal(n.state)
        }));
        cachedResult.current = { solution: result.solution, explored: mappedExplored };
        
        if (getStateString(currentState) !== getStateString(INITIAL_STATE)) {
            setCurrentState(INITIAL_STATE);
            setActionLog([{ state: INITIAL_STATE, operator: null, stepNumber: 0 }]);
            setGraphNodes([]);
            stepIndexRef.current = 1;
        }
    }
    
    const { solution, explored } = cachedResult.current;
    if (!solution) return;
    
    const currentIndex = stepIndexRef.current;
    
    if (currentIndex < solution.length) {
        const step = solution[currentIndex];
        const isCurrentGoal = isGoal(step.state);
        
        setCurrentState(step.state);
        const operatorThatLedHere = solution[currentIndex - 1].operator;
        
        setActionLog(prev => [...prev, { state: step.state, operator: operatorThatLedHere, stepNumber: prev.length }]);
        
        const nodesUpToLevel = explored.filter(n => n.level <= currentIndex);
        setGraphNodes(nodesUpToLevel);
        
        stepIndexRef.current += 1;

        // Explain mode for nextStep
        if (explainMode && operatorThatLedHere) {
          const prevState = solution[currentIndex - 1].state;
          setCurrentExplanation(computeExplanation(operatorThatLedHere, prevState, step.state));
        }

        if (isCurrentGoal) {
            setStatus('GOAL');

            // Set algorithm stats on goal
            setAlgorithmStats({
              statesExplored: explored.length,
              steps: solution.length - 1,
              pathOptimal: algorithm === 'BFS'
            });
        } else {
            setStatus('INITIAL');
        }
    } else {
      setStatus('GOAL');
    }
  }, [status, currentState, solve, explainMode, algorithm, computeExplanation]);

  const reset = useCallback(() => {
    solvingRef.current = false;
    cachedResult.current = null;
    manualStepCount.current = 0;
    stepIndexRef.current = 1;
    setCurrentState(INITIAL_STATE);
    setStatus('INITIAL');
    setActionLog([{ state: INITIAL_STATE, operator: null, stepNumber: 0 }]);
    setAlgorithmStats(null);
    setCurrentExplanation(null);
    
    if (isStepMode) {
       setGraphNodes([]);
    } else {
       setGraphNodes([
         { id: getStateString(INITIAL_STATE), state: INITIAL_STATE, parentId: null, isPath: true, isGoal: false, level: 0 }
       ]);
    }
  }, [isStepMode]);

  // Effect to clear graph when toggling step mode on initial screen
  useEffect(() => {
    if (isStepMode && actionLog.length === 1 && status === 'INITIAL') {
       setGraphNodes([]);
    } else if (!isStepMode && actionLog.length === 1 && status === 'INITIAL' && graphNodes.length === 0) {
       setGraphNodes([
         { id: getStateString(INITIAL_STATE), state: INITIAL_STATE, parentId: null, isPath: true, isGoal: false, level: 0 }
       ]);
    }
  }, [isStepMode, actionLog.length, status, graphNodes.length]);

  return {
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
    manualPour,
    autoSolve,
    nextStep,
    reset
  };
}
