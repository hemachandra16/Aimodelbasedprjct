import { useState, useCallback, useRef, useEffect } from 'react';
import { INITIAL_STATE, solveBFS, applyOperator, isGoal, OPERATORS, getStateString } from '../utils/bfs';

export function useWaterJug() {
  const [currentState, setCurrentState] = useState(INITIAL_STATE);
  const [status, setStatus] = useState('INITIAL');
  const [actionLog, setActionLog] = useState([{ state: INITIAL_STATE, operator: null, stepNumber: 0 }]);
  const [playbackSpeed, setPlaybackSpeed] = useState(500); 
  const [isStepMode, setIsStepMode] = useState(false);
  const [graphNodes, setGraphNodes] = useState([
    { id: getStateString(INITIAL_STATE), state: INITIAL_STATE, parentId: null, isPath: true, isGoal: false, level: 0 }
  ]);
  
  const manualStepCount = useRef(0);
  const solvingRef = useRef(false);
  const cachedResult = useRef(null);

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
    setActionLog(prev => [...prev, { state: newState, operator: op, stepNumber }]);
    
    const newId = getStateString(newState);
    const goalReached = checkGoal(newState);
    
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

  }, [currentState, status, actionLog.length, checkGoal]);

  const autoSolve = useCallback(async () => {
    if (status === 'SOLVING' || status === 'GOAL') return;
    
    const result = solveBFS();
    if (!result.solution) return;

    setStatus('SOLVING');
    solvingRef.current = true;
    
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
            }
        }

        if (isCurrentGoal) {
            setStatus('GOAL');
            solvingRef.current = false;
        }
    }
  }, [status, playbackSpeed]);

  const nextStep = useCallback(() => {
    if (status === 'SOLVING' || status === 'GOAL') return;
    setStatus('SOLVING'); 
    
    if (!cachedResult.current) {
        const result = solveBFS();
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
        }
    }
    
    const { solution, explored } = cachedResult.current;
    if (!solution) return;
    
    const nextIndex = actionLog.length;
    
    if (nextIndex < solution.length) {
        const step = solution[nextIndex];
        const isCurrentGoal = isGoal(step.state);
        
        setCurrentState(step.state);
        const operatorThatLedHere = solution[nextIndex - 1].operator;
        
        setActionLog(prev => [...prev, { state: step.state, operator: operatorThatLedHere, stepNumber: nextIndex }]);
        
        // Push all explored nodes up to this level
        const nodesUpToLevel = explored.filter(n => n.level <= nextIndex);
        setGraphNodes(nodesUpToLevel);

        if (isCurrentGoal) {
            setStatus('GOAL');
        } else {
            setStatus('INITIAL');
        }
    } else {
      setStatus('GOAL');
    }
  }, [status, actionLog, currentState]);

  const reset = useCallback(() => {
    solvingRef.current = false;
    cachedResult.current = null;
    manualStepCount.current = 0;
    setCurrentState(INITIAL_STATE);
    setStatus('INITIAL');
    setActionLog([{ state: INITIAL_STATE, operator: null, stepNumber: 0 }]);
    
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
    manualPour,
    autoSolve,
    nextStep,
    reset
  };
}
