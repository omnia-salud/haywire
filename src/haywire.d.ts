interface State {
  id: number;
  text: string;
}

interface PingOpts {
  verb?: string;
  path?: string;
  timeout?: number;
  status?: number;
}

interface HaywireOpts {
  threshold?: number;
  interval?: number;
  limit?: number;
  ping?: PingOpts;
  onChange?: (state: State) => any;
  backoffPolicy: (current: boolean, last: boolean, interval: number, opts: HaywireOpts) => number;
}