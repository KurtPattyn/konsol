### konsol
  [![License][license-image]][license-url]
  [![NPM Package][npm-image]][npm-url]
  [![NPM Downloads][npm-downloads-image]][npm-downloads-url]
  [![Build Status][travis-image]][travis-url]
  [![Test Coverage][coveralls-image]][coveralls-url]
  [![Code Climate][codeclimate-image]][codeclimate-url]
  [![Dependency Status][david-image]][david-url]
  [![devDependency Status][david-dev-image]][david-dev-url]

##### Author: [Kurt Pattyn](https://github.com/kurtpattyn).

Konsol is a drop-in replacement for the node.js console. It adds the ability to enable and disable the output.  
Suppression of the output can be controlled at run-time through the `enable` and `disable` static methods,
or at start-time through the use of the `KONSOL` environment variable.

## Motivation
When using modules, one often wants to see debug output from those modules.  
During `normal` operation these messages should not be shown. But during development these messages
can be very helpful for debugging.  
Also during production it can be very helpful to be able to also get log output from included modules (e.g. in case of troubleshooting).  
By using Konsol you can log messages just like with `console` from within your own modules, but `Konsol` adds the capability to enable or surpress
its output.  
By default output is disabled.

## Installation

```bashp
$ npm install konsol
```

or

```bashp
$ npm install konsol --production
```
for a production only installation (no tests, documentation, ...).

## Usage
``` javascript
  var konsol = require("konsol")("mymodule");
  ...
  //we use konsol instead of console to do our logging
  konsol.log("...");  //or info, warn, err, ...
  
  module.exports = mymodule;
```
Running `node mymodule.js` will generate no output (default behaviour).  
When we run `KONSOL=mymodule node mymodule.js` the output will enabled and written the stdout.  

Output can also programmatically enabled and disabled:

```javascript
  var Konsol = require("konsol");
  Konsol.enable("mymodule");
  var mm = require("mymodule");
```

In the above example, the output of `mymodule` will be visible.

## API
### Konsol(moduleName)
Used in a (sub)module for logging. Registers `moduleName` with `Konsol` and returns a `Konsol` logger.

**Parameters**

  * `moduleName` (`String`, required): name of the module; this name should match the name by which the module is known to the end-user

  Although not strictly required, it is good practice to use the same name as the name by which the module
  is known to the end-user. In the case of `Konsol` for instance, this would be `konsol`.  
  
**Example**
```js
  var konsol = require("konsol")("mymodule");

  konsol.log("The sky is blue.");
  //can also use .info, .warn, .error, .dir, .time, .timeEnd
```

### [static] Konsol.enable(moduleName)
Enables output for the given `moduleName`.
  
**Parameters**

  * `moduleName` (`String`, required): name of the module to enable output for
    
**Example**
```js
  var myModule = require("mymodule");
  var Konsol = require("konsol");

  Konsol.enable("mymodule");
  //from now, all output of mymodule will be redirected to the console.
```

### [static] Konsol.disable(moduleName)
Disables output for the given `moduleName`.
  
**Parameters**

  * `moduleName` (`String`, required): name of the module to disable output for
    
**Example**
```js
  var myModule = require("mymodule");
  var Konsol = require("konsol");

  Konsol.disable("mymodule");
  //from now, all output of Konsol will be suppressed.
```

## `KONSOL` Environment Variable
By default, all `Konsol` output is suppressed. Output can be enabled either by calling `Konsol.enable()` or
by setting the `KONSOL` environment variable.  
E.g. calling `Konsol.enable("mymodule")` is the same as starting node with `KONSOL=mymodule node myapp.js`.  

The difference between setting the `KONSOL` environment variable and calling `Konsol.enable()` is
that the `enable()` method can change the output at run-time.  
 
The `KONSOL` environment variable is a comma- and/or space-separated list of modules for which
to enable the output.  
E.g.  
`KONSOL=mymodule, yourmodule node app.js`  
is the same as  
`KONSOL=mymodule yourmodule node app.js`

## Tests

#### Unit Tests

```bashp
$ npm test
```

#### Unit Tests with Code Coverage

```bashp
$ npm run test-cov
```

This will generate a folder `coverage` containing coverage information and a folder `coverage/lcov-report` containing an HTML report with the coverage results.

```bashp
$ npm run test-ci
```
will create a folder `coverage` containing `lcov` formatted coverage information to be consumed by a 3rd party coverage analysis tool. This script is typically used on a continuous integration server.

#### Checkstyle

Executing

```bashp
$ npm run check-style
```

will run the `jscs` stylechecker against the code.

#### Static Code Analysis

Executing

```bashp
$ npm run code-analysis
```

will run `jshint` to analyse the code.

#### Code Documentation

Executing

```bashp
$ npm run make-docs
```

will run `jsdoc` to create documentation.

## License

  [MIT](LICENSE)

[npm-image]: https://badge.fury.io/js/konsol.svg
[npm-url]: https://www.npmjs.com/package/konsol
[npm-downloads-image]: https://img.shields.io/npm/dm/konsol.svg?style=flat
[npm-downloads-url]: https://www.npmjs.org/package/konsol
[coveralls-image]: https://coveralls.io/repos/KurtPattyn/konsol/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/KurtPattyn/konsol?branch=master
[travis-image]: https://travis-ci.org/KurtPattyn/konsol.svg?branch=master
[travis-url]: https://travis-ci.org/KurtPattyn/konsol
[codeclimate-image]: https://codeclimate.com/github/KurtPattyn/konsol/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/KurtPattyn/konsol
[david-image]: https://david-dm.org/kurtpattyn/konsol.svg
[david-url]: https://david-dm.org/kurtpattyn/konsol
[david-dev-image]: https://david-dm.org/kurtpattyn/konsol/dev-status.svg
[david-dev-url]: https://david-dm.org/kurtpattyn/konsol#info=devDependencies
[kimbu-url]: https://www.npmjs.com/package/konsol
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

