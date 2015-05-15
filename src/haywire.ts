/// <reference path="haywire.d.ts" />

module Haywire {
  class Pinger {
    options: PingOpts

    constructor(options: PingOpts) {
      this.options = options;
    }

    ping(callback: (success: boolean) => void) {
      var xhr = new XMLHttpRequest();
      xhr.timeout = this.options.timeout;

      var status = this.options.status;
      xhr.onreadystatechange = function (ev) {
        if (xhr.readyState === 4) {
          callback(xhr.status === status)
        }
      }
      xhr.open(this.options.verb, this.options.path, true);
      xhr.send();
    }
  }

  class CircularBuffer {
    size: number;
    values: boolean[];

    constructor(size: number) {
      this.size = size;
      this.values = [];
    }

    add(value: boolean): void {
      if (this.values.length > this.size) {
        this.values.shift()
      }
      this.values.push(value);
    }

    allOk(): boolean {
      return this.values.every((v) => v)
    }

    allFailed(): boolean {
      return this.values.every((v) => !v)
    }

    last(): boolean {
      return this.values.slice(-1)[0];
    }
  }

  var pinger: Pinger;
  var buffer: CircularBuffer;
  var states: State[] = [
    { id: 0, text: "Ok" },
    { id: 1, text: "Flaky" },
    { id: 2, text: "Offline" },
  ];
  var defaults: HaywireOpts = {
    threshold: 5,
    ping: {
      verb: 'GET',
      path: '/healthcheck',
      timeout: 1500,
      status: 200
    },
    interval: 500,
    limit: 8000,
    onChange: function () {} // do nothing.
  }

  export function _merge(a, b: any): any {
    for (var key in b) {
      a[key] = b[key]
    }
    return a;
  }

  export function _extend(...os: any[]): any {
    return os.reduce((a, b) => _merge(a, b), {});
  }

  export function start(options?: HaywireOpts) {
    var opts: HaywireOpts = _extend(defaults, options);
    buffer = new CircularBuffer(opts.threshold);
    pinger = new Pinger(opts.ping);

    var interval: number = opts.interval;

    function updateInterval(result, last: boolean): number {
      if (result === last) {
        return Math.min(interval * 2, opts.limit)
      } else {
        return opts.interval;
      }
    }

    function _do() {
      setTimeout(() => {
        pinger.ping((current) => {
          var last = buffer.last();
          interval = updateInterval(current, last);
          buffer.add(current);
          opts.onChange(status())
          _do();
        });
      }, interval);
    }

    setTimeout(_do, 0);
  }

  export function status (): State {
    if (buffer.allOk()) {
      return states[0];
    } else if (buffer.allFailed()) {
      return states[2];
    } else {
      return states[1];
    }
  }
}