# Haywire

A minimal (less than 1k minified and gzipped) javascript library for network issues detection.

[![License](https://img.shields.io/apm/l/vim-mode.svg)](http://github.com/omnia-salud/delta/blob/master/LICENSE.txt)

## How to use it?

To start checking your connection status:

```javascript
    Haywire.start({ 'callback': function (status) {
        console.log('connection status is:' + JSON.stringify(status));
    }});
```

## How to get it

You can the development, minified and minified + gzipped releases in the [build folder](https://github.com/omnia-salud/delta/tree/master/src).

## How does it work?


## Need help?

send me an [email](mailto:pablo@omniasalud.com) or ask me via [twitter](http://twitter.com/fernandezpablo)
