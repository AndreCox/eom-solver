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

const testEom = (t: number, x: number, v: number): number => {
  return -x;
};

const eomSolver = (
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
    let a = eom(t, x, v);
    console.log(a);
    x += v * stepSize;
    v += a * stepSize;
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

export default eomSolver;
export type { EOMSolver, State, TimeSpan };
