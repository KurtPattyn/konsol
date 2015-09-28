var assert = require("assert");
var util = require("util");

describe("Konsol", function() {
  describe("constructor", function() {
    it("should throw an assertion failure with a null module name", function (done) {
      assert.throws(function () {
          require("..")(null);
        }, /AssertionError/,
        "Should throw an AssertionError");
      done();
    });

    it("should throw an assertion failure with an empty module name", function (done) {
      assert.throws(function () {
          require("..")("");
        }, /AssertionError/,
        "Should throw an AssertionError");
      done();
    });

    it("should initialize the Konsol object correctly", function (done) {
      var k = require("..")("moduleName");

      assert.equal(k._moduleName, "moduleName");
      done();
    });
  });

  describe("API", function() {
    it("should implement the same methods as the console object", function(done) {
      var k = require("..")("mymodule");

      ["log", "info", "warn", "error", "trace", "dir", "time", "timeEnd"].forEach(function(name) {
        assert(k.hasOwnProperty(name));
        assert(util.isFunction(k[name]));
      });
      done();
    });
  });

  describe(".enable", function() {
    it("is a static method", function(done) {
      var Konsol = require("..");

      assert.doesNotThrow(function() {
        Konsol.enable("mymodule");
      }, "Should not throw an exception");

      require("..").disable("mymodule");

      done();
    });

    it("should not throw when enable is called twice", function(done) {
      var Konsol = require("..");

      assert.doesNotThrow(function() {
        Konsol.enable("mymodule");
        Konsol.enable("mymodule");
      }, "Should not throw an exception");

      require("..").disable("mymodule");

      done();
    });

    it("cannot be called upon an instance", function(done) {
      var k = require("..")("mymodule");

      assert.throws(function() {
        k.enable("mymodule");
      }, /TypeError/,
      "Should throw an exception");

      require("..").disable("mymodule");

      done();
    });
  });

  describe(".disable", function() {
    it("is a static method", function(done) {
      var Konsol = require("..");

      Konsol.enable("mymodule");

      assert.doesNotThrow(function() {
        Konsol.disable("mymodule");
      }, "Should not throw an exception");
      done();
    });

    it("should not throw when disable is called twice", function(done) {
      var Konsol = require("..");

      Konsol.enable("mymodule");

      assert.doesNotThrow(function() {
        Konsol.disable("mymodule");
        Konsol.disable("mymodule");
      }, "Should not throw an exception");
      done();
    });

    it("should not throw when disable is called for a non-enabled module", function(done) {
      var Konsol = require("..");

      assert.doesNotThrow(function() {
        Konsol.disable("mymodule");
      }, "Should not throw an exception");
      done();
    });

    it("cannot be called upon an instance", function(done) {
      var k = require("..")("mymodule");

      assert.throws(function() {
          k.disable("mymodule");
        }, /TypeError/,
        "Should throw an exception");
      done();
    });
  });

  describe("output redirection", function() {
    var oldLoggingMethod = null;
    var numCalls = 0;

    beforeEach(function(done) {
      oldLoggingMethod = console.info;
      numCalls = 0;
      console.info = function() {
        ++numCalls;

        //oldLoggingMethod.apply(console, arguments);
      };
      done();
    });

    afterEach(function(done) {
      console.info = oldLoggingMethod;
      done();
    });

    it("should not output to the console when not explicitly enabled", function(done) {
      var k = require("..")("mymodule");

      k.info("Should be suppressed");
      assert.equal(numCalls, 0);
      done();
    });

    it("should output to the console when explicitly enabled", function(done) {
      var k = require("..")("mymodule");

      require("..").enable("mymodule");

      k.info("Should not be suppressed");

      require("..").disable("mymodule");

      assert.equal(numCalls, 1);
      done();
    });

    it("should only output to the console for the enabled module and not for others", function(done) {
      var k1 = require("..")("mymodule");
      var k2 = require("..")("myothermodule");

      require("..").enable("mymodule");

      k1.info("Should not be suppressed");
      k2.info("Should be suppressed");

      require("..").disable("mymodule");

      assert.equal(numCalls, 1);
      done();
    });

    it("should not output to the console after explicitly disabled", function(done) {
      var k = require("..")("mymodule");

      require("..").enable("mymodule");

      k.info("Should not be suppressed");

      assert.equal(numCalls, 1);

      require("..").disable("mymodule");

      k.info("Should be suppressed");

      assert.equal(numCalls, 1);

      done();
    });

    it("should only output to the console for the non-disabled module", function(done) {
      var k1 = require("..")("mymodule");
      var k2 = require("..")("myothermodule");

      require("..").enable("mymodule");
      require("..").enable("myothermodule");

      k1.info("Should not be suppressed");
      k2.info("Should not be suppressed");

      assert.equal(numCalls, 2);

      require("..").disable("mymodule");

      k1.info("Should be suppressed");
      k2.info("Should not be suppressed");

      assert.equal(numCalls, 3);

      done();
    });

    it("should output to the console when the KONSOL env variable has been set", function(done) {
      process.env["KONSOL"] = "mymodule";
      var k = require("..")("mymodule");

      k.info("Should not be suppressed");

      delete process.env["KONSOL"];

      require("..").disable("mymodule");

      assert.equal(numCalls, 1);

      done();
    });

    it("should not output to the console when the KONSOL env variable has been set afterwards", function(done) {
      var k = require("..")("mymodule");

      process.env["KONSOL"] = "mymodule";

      k.info("Should not be suppressed");

      delete process.env["KONSOL"];

      require("..").disable("mymodule");

      assert.equal(numCalls, 0);

      done();
    });

    it("should output to the console for all modules space delimited listed into the KONSOL env variable", function(done) {
      process.env["KONSOL"] = "mymodule myothermodule";
      var k1 = require("..")("mymodule");
      var k2 = require("..")("myothermodule");

      k1.info("Should not be suppressed");
      k2.info("Should not be suppressed");

      delete process.env["KONSOL"];

      require("..").disable("mymodule");
      require("..").disable("myothermodule");

      assert.equal(numCalls, 2);

      done();
    });

    it("should output to the console for all modules comma delimited listed into the KONSOL env variable", function(done) {
      process.env["KONSOL"] = "mymodule,myothermodule";
      var k1 = require("..")("mymodule");
      var k2 = require("..")("myothermodule");

      k1.info("Should not be suppressed");
      k2.info("Should not be suppressed");

      delete process.env["KONSOL"];

      require("..").disable("mymodule");
      require("..").disable("myothermodule");

      assert.equal(numCalls, 2);

      done();
    });

    it("should output to the console for all modules comma-space delimited listed into the KONSOL env variable", function(done) {
      process.env["KONSOL"] = "mymodule , myothermodule";
      var k1 = require("..")("mymodule");
      var k2 = require("..")("myothermodule");

      k1.info("Should not be suppressed");
      k2.info("Should not be suppressed");

      delete process.env["KONSOL"];

      require("..").disable("mymodule");
      require("..").disable("myothermodule");

      assert.equal(numCalls, 2);

      done();
    });
  });
});
