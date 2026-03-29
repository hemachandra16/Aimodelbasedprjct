export const CAPACITIES = [8, 5, 3];
export const INITIAL_STATE = [8, 0, 0];
export const GOAL_STATE = [4, 4, 0];

// Order tweaked to naturally discover the 7-step path first during tree generation
export const OPERATORS = [
  { id: 'A_TO_B', name: 'Pour A → B', from: 0, to: 1 },
  { id: 'B_TO_C', name: 'Pour B → C', from: 1, to: 2 },
  { id: 'C_TO_A', name: 'Pour C → A', from: 2, to: 0 },
  { id: 'A_TO_C', name: 'Pour A → C', from: 0, to: 2 },
  { id: 'B_TO_A', name: 'Pour B → A', from: 1, to: 0 },
  { id: 'C_TO_B', name: 'Pour C → B', from: 2, to: 1 },
];

export function getStateString(state) {
  return `${state[0]},${state[1]},${state[2]}`;
}

export function isGoal(state) {
  return state[0] === GOAL_STATE[0] && state[1] === GOAL_STATE[1] && state[2] === GOAL_STATE[2];
}

export function isValidPour(state, fromIdx, toIdx) {
  const amountToPour = state[fromIdx];
  const targetAvailable = CAPACITIES[toIdx] - state[toIdx];
  return amountToPour > 0 && targetAvailable > 0;
}

export function applyOperator(state, fromIdx, toIdx) {
  if (!isValidPour(state, fromIdx, toIdx)) return null;

  const newState = [...state];
  const amountToPour = Math.min(state[fromIdx], CAPACITIES[toIdx] - state[toIdx]);
  
  newState[fromIdx] -= amountToPour;
  newState[toIdx] += amountToPour;
  
  return newState;
}

export function solveBFS() {
  const queue = [{ state: INITIAL_STATE, path: [] }];
  const visited = new Set([getStateString(INITIAL_STATE)]);
  const allExploredNodes = []; 

  while (queue.length > 0) {
    const { state, path } = queue.shift();
    const currentStateStr = getStateString(state);
    
    // Level is defined by path length
    const level = path.length;
    const parentOperator = path.length > 0 ? path[path.length - 1].operator : null;

    allExploredNodes.push({
      state,
      parentId: path.length > 0 ? getStateString(path[path.length - 1].state) : null,
      id: currentStateStr,
      level: level,
      operatorSource: parentOperator
    });

    if (isGoal(state)) {
      return {
        solution: [...path, { state, operator: null, stepNumber: level }],
        explored: allExploredNodes
      };
    }

    for (const op of OPERATORS) {
      if (isValidPour(state, op.from, op.to)) {
        const nextState = applyOperator(state, op.from, op.to);
        const nextStateStr = getStateString(nextState);

        if (!visited.has(nextStateStr)) {
          visited.add(nextStateStr);
          queue.push({
            state: nextState,
            path: [...path, { state, operator: op, stepNumber: level }]
          });
        }
      }
    }
  }

  return { solution: null, explored: allExploredNodes };
}
