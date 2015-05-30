/// <reference path="haywire.d.ts" />
var Haywire;
(function (Haywire) {
    var Pinger = (function () {
        function Pinger(options) {
            this.options = options;
        }
        Pinger.prototype.doPing = function (callback) {
            var xhr = new XMLHttpRequest();
            xhr.timeout = this.options.timeout;
            var status = this.options.status;
            xhr.onreadystatechange = function (event) {
                if (xhr.readyState === 4) {
                    callback(xhr.status === status);
                }
            };
            xhr.open(this.options.verb, this.options.path, true);
            xhr.send();
        };
        Pinger.prototype.ping = function (callback) {
            // don't even try to make an xhr if we're offline.
            if (false === window.navigator.onLine) {
                callback(false);
            }
            else {
                this.doPing(callback);
            }
        };
        return Pinger;
    })();
    var CircularBuffer = (function () {
        function CircularBuffer(size) {
            this.size = size;
            this.values = [];
        }
        CircularBuffer.prototype.add = function (value) {
            if (this.values.length === this.size) {
                this.values.shift();
            }
            this.values.push(value);
        };
        CircularBuffer.prototype.allOk = function () {
            return this.values.every(function (v) { return v; });
        };
        CircularBuffer.prototype.allFailed = function () {
            return this.values.every(function (v) { return !v; });
        };
        CircularBuffer.prototype.last = function () {
            return this.values.slice(-1)[0];
        };
        return CircularBuffer;
    })();
    Haywire.CircularBuffer = CircularBuffer;
    var pinger;
    var buffer;
    var states = [
        { id: 0, text: "Ok" },
        { id: 1, text: "Flaky" },
        { id: 2, text: "Offline" },
    ];
    var defaults = {
        threshold: 4,
        ping: {
            verb: 'GET',
            path: '/healthcheck',
            timeout: 1500,
            status: 200
        },
        interval: 500,
        limit: 8000,
        onChange: function () {
        },
        backoffPolicy: function (result, last, interval, options) {
            if (result === last) {
                return Math.min(interval * 2, options.limit);
            }
            else {
                return options.interval;
            }
        }
    };
    function _merge(a, b) {
        for (var key in b) {
            a[key] = b[key];
        }
        return a;
    }
    Haywire._merge = _merge;
    function _extend() {
        var os = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            os[_i - 0] = arguments[_i];
        }
        return os.reduce(function (a, b) { return _merge(a, b); }, {});
    }
    Haywire._extend = _extend;
    function start(options) {
        var opts = _extend(defaults, options);
        buffer = new CircularBuffer(opts.threshold);
        pinger = new Pinger(opts.ping);
        var interval = opts.interval;
        function _do() {
            setTimeout(function () {
                pinger.ping(function (current) {
                    var last = buffer.last();
                    interval = opts.backoffPolicy(current, last, interval, opts);
                    buffer.add(current);
                    opts.onChange(status());
                    _do();
                });
            }, interval);
        }
        setTimeout(_do, 0);
    }
    Haywire.start = start;
    function status() {
        if (buffer.allOk()) {
            return states[0];
        }
        else if (buffer.allFailed()) {
            return states[2];
        }
        else {
            return states[1];
        }
    }
    Haywire.status = status;
})(Haywire || (Haywire = {}));
