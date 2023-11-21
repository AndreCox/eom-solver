interface EOMSolver {
  eom: (t: number, x: number, v: number) => number;
  initialState: State;
  timeSpan: TimeSpan;
  stepSize: number;
}

interface State {
  t: number;
  x: number;
  v: number;
  a: number;
}

interface TimeSpan {
  start: number;
  end: number;
}

const eulerEomSolver = (
  eom: (t: number, x: number, v: number) => number,
  initialState: {
    x: number;
    v: number;
  },
  timeSpan: TimeSpan,
  stepSize: number
): number[][] => {
  let history: number[][] = [];

  let t = 0;
  let x = initialState.x;
  let v = initialState.v;

  if (stepSize < 0.0001) {
    return history;
  }

  let totalSteps = timeSpan.end / stepSize;

  history.push([t, x]);

  for (let i = 0; i < totalSteps; i++) {
    x += v * stepSize;
    v += eom(t, x, v) * stepSize;
    t += stepSize;
    // make sure t does not have weird decimal places
    t = Math.round(t * 1000000) / 1000000;
    // history is a 2d array of [time, position]
    history.push([t, x]);
  }

  // if we have a time range that does not start at 0 we need to remove the first data until we reach the start time
  if (timeSpan.start !== 0) {
    let startIndex = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i][0] >= timeSpan.start) {
        startIndex = i;
        break;
      }
    }
    history = history.slice(startIndex);
  }

  // cull the history to not have too many points
  let maxPoints = 200;

  if (history.length > maxPoints) {
    let cullFactor = Math.ceil(history.length / maxPoints);
    history = history.filter((_, i) => i % cullFactor === 0);
  }

  return history;
};

const rungeEomSolver = (
  eom: (t: number, x: number, v: number) => number,
  initialState: {
    x: number;
    v: number;
  },
  timeSpan: TimeSpan,
  stepSize: number
): number[][] => {
  let history: number[][] = [];

  let t = 0;
  let x = initialState.x;
  let v = initialState.v;

  let totalSteps = timeSpan.end / stepSize;

  for (let i = 0; i < totalSteps; i++) {
    // use runge kutta to get the next position
    let k1 = stepSize * v;
    let l1 = stepSize * eom(t, x, v);
    let k2 = stepSize * (v + l1 / 2);
    let l2 = stepSize * eom(t + stepSize / 2, x + k1 / 2, v + l1 / 2);
    let k3 = stepSize * (v + l2 / 2);
    let l3 = stepSize * eom(t + stepSize / 2, x + k2 / 2, v + l2 / 2);
    let k4 = stepSize * (v + l3);
    let l4 = stepSize * eom(t + stepSize, x + k3, v + l3);

    x += (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    v += (l1 + 2 * l2 + 2 * l3 + l4) / 6;
    t += stepSize;
    // make sure t does not have weird decimal places
    t = Math.round(t * 1000000) / 1000000;
    // history is a 2d array of [time, position]

    history.push([t, x]);
  }

  // if we have a time range that does not start at 0 we need to remove the first data until we reach the start time
  if (timeSpan.start !== 0) {
    let startIndex = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i][0] >= timeSpan.start) {
        startIndex = i;
        break;
      }
    }
    history = history.slice(startIndex);
  }

  // cull the history to not have too many points
  let maxPoints = 200;

  if (history.length > maxPoints) {
    let cullFactor = Math.ceil(history.length / maxPoints);
    history = history.filter((_, i) => i % cullFactor === 0);
  }

  return history;
};

export { eulerEomSolver, rungeEomSolver };
export type { EOMSolver, State, TimeSpan };
