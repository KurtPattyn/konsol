"use strict";

var assert = require("assert");
var util = require("util");

var verbosityEnabled = {};
var consoleMethods =  ["log", "info", "warn", "error", "trace", "dir", "time", "timeEnd"];

/**
 * Konsol is a drop-in replacement for the console. It adds verbosity control; i.e. output can
 * be enabled or disabled.
 * Konsol implements the same logging methods as console (log, info, warn, error, trace, dir, time,
 * timeEnd), but adds conditional output.
 * Per default, the output of Konsol is suppressed.
 * To enable output, you can use the KONSOL environment variable or the static `enable()` method.
 * The latter allows applications to dynamically turning on output without restarting the application.
 * The KONSOL environment variable is a comma- or space-separated list of module names (caution:
 * the names are case-sensitive).
 *
 * @param {!String} moduleName - Name of the module; should not be empty. You should use the same
 * name as known to the end-user (i.e. the name as stated in the module's package.json file).
 * @returns {Konsol}
 * @constructor
 *
 * @example
 * var konsol = require("Konsol")("mymodule");
 * ...
 * konsol.log("This will be suppressed.");
 * ...
 * //require("Konsol").enable()` is normally called outside the module itself,
 * //e.g. from within the application requiring this module (see next example).
 * require("Konsol").enable("mymodule");
 * ...
 * konsol.log("This will not be suppressed.");
 *
 * @example
 * //file mymodule.js
 * var konsol = require("Konsol")("mymodule");
 * ...
 * konsol.log("Some interesting information.");
 *
 * //file app.js
 * var mymodule = require("mymodule");
 * var Konsol = require("Konsol");
 * ...
 * //per default all output of mymodule will be suppressed
 * Konsol.enable("mymodule");  //now all output of mymodule will be shown
 */
function Konsol(moduleName) {
  assert(util.isString(moduleName));
  assert(moduleName.length > 0);
  if (!(this instanceof Konsol)) {
    return new Konsol(moduleName);
  }

  this._moduleName = moduleName;

  var self = this;

  consoleMethods.forEach(function(val) {
// jscs:disable jsDoc
    self[val] = function() {
// jscs:enable jsDoc
      if (verbosityEnabled[self._moduleName]) {
        console[val].apply(console, Array.prototype.slice.call(arguments));
      }
    };
  });

  if (process.env.KONSOL) {
    process.env.KONSOL.split(/[\s,]+/).forEach(function(moduleName) {
      verbosityEnabled[moduleName] = true;
    });
  }
}

module.exports = Konsol;

/**
 * Enables output for the given `moduleName`. This method allows enabling output without
 * restarting the application.
 *
 * @param {!String} moduleName - Name of the module to enable output for; should not be empty.
 * @static
 */
Konsol.enable = function enable(moduleName) {
  assert(util.isString(moduleName));
  assert(moduleName.length > 0);
  if (!(moduleName in verbosityEnabled)) {
    verbosityEnabled[moduleName] = true;
  }
};

/**
 * Disables output for the given `moduleName`. This method allows disabling output without
 * restarting the application.
 *
 * @param {!String} moduleName - Name of the module to suppress output for; should not be empty.
 * @static
 */
Konsol.disable = function disable(moduleName) {
  assert(util.isString(moduleName));
  assert(moduleName.length > 0);
  if (moduleName in verbosityEnabled) {
    delete verbosityEnabled[moduleName];
  }
};
