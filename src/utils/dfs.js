import { CAPACITIES, INITIAL_STATE, GOAL_STATE, OPERATORS, getStateString, isGoal, isValidPour, applyOperator } from './bfs';

export function solveDFS() {
  const stack = [{ state: INITIAL_STATE, path: [] }];
  const visited = new Set([getStateString(INITIAL_STATE)]);
  const allExploredNodes = [];

  while (stack.length > 0) {
    const { state, path } = stack.pop(); // LIFO — DFS
    const currentStateStr = getStateString(state);

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
          stack.push({
            state: nextState,
            path: [...path, { state, operator: op, stepNumber: level }]
          });
        }
      }
    }
  }

  return { solution: null, explored: allExploredNodes };
}
