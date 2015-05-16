# Haywire

A minimal (less than 1k minified and gzipped) javascript library for network issues detection.

[![License](https://img.shields.io/apm/l/vim-mode.svg)](http://github.com/omnia-salud/delta/blob/master/LICENSE.txt)

## How does Haywire work?

* Checks the availability of your site by pinging a healthcheck url.
* Remembers past results so it can tell between **offline**, **online** and **_"flaky"_**  (intermittent) conections.
* Uses an exponential backoff policy so it doesn't flood your servers with requests.
* It's fully [configurable](https://github.com/omnia-salud/haywire#configuration-and-defaults).

## A trivial example

To start checking your connection status:

```javascript
    Haywire.start({ 'callback': function (status) {
        console.log('connection status is:' + JSON.stringify(status));
    }});
```

## Another example

Here, Haywire periodically pings your `/healthcheck` url. If everything's fine, it increases the interval time and tries again in the future. Every time the status is checked, your `callback` function is invoked.

```javascript
    function reportNetworkStatus(status) {
        if (status.id === 0){
            console.log('looking good :)');
        } else if (status.id === 1) {
            console.log('connection looks a bit unstable :S');
        } else {
            console.log('you\'re offline :(');
        }
    }
    var opts = {
        ping: { verb: 'HEAD', path: '/heartbeat'},
        interval: 500,
        limit: 8000,
        onChange: reportNetworkStatus
    }

    Haywire.start(opts);
```

In this example, not only do you set the callback function, but also:
* `interval` how often do you ping (initially), in milliseconds
* `limit` if the ping is succesful, the interval is doubled (backoff), the limit is the maximum value between pings.
* `ping.verb` and `ping.path` these define your healthcheck url.

# Configuration and defaults

These are the configuration options you can pass to Haywire, with their defaults:

```javascript
{
    'threshold': 4, // number of requests that should fail/succeed before considering the connection to be offline/online
    'ping': {
      'verb': 'GET', // ping request http verb
      'path': '/healthcheck', // ping request path
      'timeout': 1500, // ping request connection timeout in milliseconds
      'status': 200 // expected http status code from the ping response
    },
    'interval': 500, // initial ping interval
    'limit': 8000, // maximum ping interval
    'onChange': function () {} // callback executed after every ping
}

```

# How to get it

You can the development, minified and minified + gzipped releases in the [build folder](https://github.com/omnia-salud/haywire/tree/master/build).

## Need help?

send me an [email](mailto:pablo@omniasalud.com) or ask me via [twitter](http://twitter.com/fernandezpablo)
