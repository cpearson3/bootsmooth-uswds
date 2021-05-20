// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/uswds/dist/js/uswds.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);

    return o;
  }

  return r;
})()({
  1: [function (require, module, exports) {
    "use strict";
    /*
     * classList.js: Cross-browser full element.classList implementation.
     * 1.1.20170427
     *
     * By Eli Grey, http://eligrey.com
     * License: Dedicated to the public domain.
     *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
     */

    /*global self, document, DOMException */

    /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

    if ("document" in window.self) {
      // Full polyfill for browsers with no classList support
      // Including IE < Edge missing SVGElement.classList
      if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {
        (function (view) {
          "use strict";

          if (!('Element' in view)) return;

          var classListProp = "classList",
              protoProp = "prototype",
              elemCtrProto = view.Element[protoProp],
              objCtr = Object,
              strTrim = String[protoProp].trim || function () {
            return this.replace(/^\s+|\s+$/g, "");
          },
              arrIndexOf = Array[protoProp].indexOf || function (item) {
            var i = 0,
                len = this.length;

            for (; i < len; i++) {
              if (i in this && this[i] === item) {
                return i;
              }
            }

            return -1;
          } // Vendors: please allow content code to instantiate DOMExceptions
          ,
              DOMEx = function DOMEx(type, message) {
            this.name = type;
            this.code = DOMException[type];
            this.message = message;
          },
              checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
            if (token === "") {
              throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
            }

            if (/\s/.test(token)) {
              throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
            }

            return arrIndexOf.call(classList, token);
          },
              ClassList = function ClassList(elem) {
            var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                i = 0,
                len = classes.length;

            for (; i < len; i++) {
              this.push(classes[i]);
            }

            this._updateClassName = function () {
              elem.setAttribute("class", this.toString());
            };
          },
              classListProto = ClassList[protoProp] = [],
              classListGetter = function classListGetter() {
            return new ClassList(this);
          }; // Most DOMException implementations don't allow calling DOMException's toString()
          // on non-DOMExceptions. Error's toString() is sufficient here.


          DOMEx[protoProp] = Error[protoProp];

          classListProto.item = function (i) {
            return this[i] || null;
          };

          classListProto.contains = function (token) {
            token += "";
            return checkTokenAndGetIndex(this, token) !== -1;
          };

          classListProto.add = function () {
            var tokens = arguments,
                i = 0,
                l = tokens.length,
                token,
                updated = false;

            do {
              token = tokens[i] + "";

              if (checkTokenAndGetIndex(this, token) === -1) {
                this.push(token);
                updated = true;
              }
            } while (++i < l);

            if (updated) {
              this._updateClassName();
            }
          };

          classListProto.remove = function () {
            var tokens = arguments,
                i = 0,
                l = tokens.length,
                token,
                updated = false,
                index;

            do {
              token = tokens[i] + "";
              index = checkTokenAndGetIndex(this, token);

              while (index !== -1) {
                this.splice(index, 1);
                updated = true;
                index = checkTokenAndGetIndex(this, token);
              }
            } while (++i < l);

            if (updated) {
              this._updateClassName();
            }
          };

          classListProto.toggle = function (token, force) {
            token += "";
            var result = this.contains(token),
                method = result ? force !== true && "remove" : force !== false && "add";

            if (method) {
              this[method](token);
            }

            if (force === true || force === false) {
              return force;
            } else {
              return !result;
            }
          };

          classListProto.toString = function () {
            return this.join(" ");
          };

          if (objCtr.defineProperty) {
            var classListPropDesc = {
              get: classListGetter,
              enumerable: true,
              configurable: true
            };

            try {
              objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            } catch (ex) {
              // IE 8 doesn't support enumerable:true
              // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
              // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
              if (ex.number === undefined || ex.number === -0x7FF5EC54) {
                classListPropDesc.enumerable = false;
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
              }
            }
          } else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
          }
        })(window.self);
      } // There is full or partial native classList support, so just check if we need
      // to normalize the add/remove and toggle APIs.


      (function () {
        "use strict";

        var testElement = document.createElement("_");
        testElement.classList.add("c1", "c2"); // Polyfill for IE 10/11 and Firefox <26, where classList.add and
        // classList.remove exist but support only one argument at a time.

        if (!testElement.classList.contains("c2")) {
          var createMethod = function createMethod(method) {
            var original = DOMTokenList.prototype[method];

            DOMTokenList.prototype[method] = function (token) {
              var i,
                  len = arguments.length;

              for (i = 0; i < len; i++) {
                token = arguments[i];
                original.call(this, token);
              }
            };
          };

          createMethod('add');
          createMethod('remove');
        }

        testElement.classList.toggle("c3", false); // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
        // support the second argument.

        if (testElement.classList.contains("c3")) {
          var _toggle = DOMTokenList.prototype.toggle;

          DOMTokenList.prototype.toggle = function (token, force) {
            if (1 in arguments && !this.contains(token) === !force) {
              return force;
            } else {
              return _toggle.call(this, token);
            }
          };
        }

        testElement = null;
      })();
    }
  }, {}],
  2: [function (require, module, exports) {
    "use strict";

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }
    /*!
      * domready (c) Dustin Diaz 2014 - License MIT
      */


    !function (name, definition) {
      if (typeof module != 'undefined') module.exports = definition();else if (typeof define == 'function' && _typeof(define.amd) == 'object') define(definition);else this[name] = definition();
    }('domready', function () {
      var fns = [],
          _listener,
          doc = document,
          hack = doc.documentElement.doScroll,
          domContentLoaded = 'DOMContentLoaded',
          loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

      if (!loaded) doc.addEventListener(domContentLoaded, _listener = function listener() {
        doc.removeEventListener(domContentLoaded, _listener);
        loaded = 1;

        while (_listener = fns.shift()) {
          _listener();
        }
      });
      return function (fn) {
        loaded ? setTimeout(fn, 0) : fns.push(fn);
      };
    });
  }, {}],
  3: [function (require, module, exports) {
    'use strict';

    function useNative() {
      var elem = document.createElement('div');
      elem.setAttribute('data-a-b', 'c');
      return Boolean(elem.dataset && elem.dataset.aB === 'c');
    }

    function nativeDataset(element) {
      return element.dataset;
    }

    module.exports = useNative() ? nativeDataset : function (element) {
      var map = {};
      var attributes = element.attributes;

      function getter() {
        return this.value;
      }

      function setter(name, value) {
        if (typeof value === 'undefined') {
          this.removeAttribute(name);
        } else {
          this.setAttribute(name, value);
        }
      }

      for (var i = 0, j = attributes.length; i < j; i++) {
        var attribute = attributes[i];

        if (attribute) {
          var name = attribute.name;

          if (name.indexOf('data-') === 0) {
            var prop = name.slice(5).replace(/-./g, function (u) {
              return u.charAt(1).toUpperCase();
            });
            var value = attribute.value;
            Object.defineProperty(map, prop, {
              enumerable: true,
              get: getter.bind({
                value: value || ''
              }),
              set: setter.bind(element, name)
            });
          }
        }
      }

      return map;
    };
  }, {}],
  4: [function (require, module, exports) {
    "use strict"; // element-closest | CC0-1.0 | github.com/jonathantneal/closest

    (function (ElementProto) {
      if (typeof ElementProto.matches !== 'function') {
        ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
          var element = this;
          var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
          var index = 0;

          while (elements[index] && elements[index] !== element) {
            ++index;
          }

          return Boolean(elements[index]);
        };
      }

      if (typeof ElementProto.closest !== 'function') {
        ElementProto.closest = function closest(selector) {
          var element = this;

          while (element && element.nodeType === 1) {
            if (element.matches(selector)) {
              return element;
            }

            element = element.parentNode;
          }

          return null;
        };
      }
    })(window.Element.prototype);
  }, {}],
  5: [function (require, module, exports) {
    "use strict";
    /* global define, KeyboardEvent, module */

    (function () {
      var keyboardeventKeyPolyfill = {
        polyfill: polyfill,
        keys: {
          3: 'Cancel',
          6: 'Help',
          8: 'Backspace',
          9: 'Tab',
          12: 'Clear',
          13: 'Enter',
          16: 'Shift',
          17: 'Control',
          18: 'Alt',
          19: 'Pause',
          20: 'CapsLock',
          27: 'Escape',
          28: 'Convert',
          29: 'NonConvert',
          30: 'Accept',
          31: 'ModeChange',
          32: ' ',
          33: 'PageUp',
          34: 'PageDown',
          35: 'End',
          36: 'Home',
          37: 'ArrowLeft',
          38: 'ArrowUp',
          39: 'ArrowRight',
          40: 'ArrowDown',
          41: 'Select',
          42: 'Print',
          43: 'Execute',
          44: 'PrintScreen',
          45: 'Insert',
          46: 'Delete',
          48: ['0', ')'],
          49: ['1', '!'],
          50: ['2', '@'],
          51: ['3', '#'],
          52: ['4', '$'],
          53: ['5', '%'],
          54: ['6', '^'],
          55: ['7', '&'],
          56: ['8', '*'],
          57: ['9', '('],
          91: 'OS',
          93: 'ContextMenu',
          144: 'NumLock',
          145: 'ScrollLock',
          181: 'VolumeMute',
          182: 'VolumeDown',
          183: 'VolumeUp',
          186: [';', ':'],
          187: ['=', '+'],
          188: [',', '<'],
          189: ['-', '_'],
          190: ['.', '>'],
          191: ['/', '?'],
          192: ['`', '~'],
          219: ['[', '{'],
          220: ['\\', '|'],
          221: [']', '}'],
          222: ["'", '"'],
          224: 'Meta',
          225: 'AltGraph',
          246: 'Attn',
          247: 'CrSel',
          248: 'ExSel',
          249: 'EraseEof',
          250: 'Play',
          251: 'ZoomOut'
        }
      }; // Function keys (F1-24).

      var i;

      for (i = 1; i < 25; i++) {
        keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
      } // Printable ASCII characters.


      var letter = '';

      for (i = 65; i < 91; i++) {
        letter = String.fromCharCode(i);
        keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
      }

      function polyfill() {
        if (!('KeyboardEvent' in window) || 'key' in KeyboardEvent.prototype) {
          return false;
        } // Polyfill `key` on `KeyboardEvent`.


        var proto = {
          get: function get(x) {
            var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];

            if (Array.isArray(key)) {
              key = key[+this.shiftKey];
            }

            return key;
          }
        };
        Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
        return proto;
      }

      if (typeof define === 'function' && define.amd) {
        define('keyboardevent-key-polyfill', keyboardeventKeyPolyfill);
      } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = keyboardeventKeyPolyfill;
      } else if (window) {
        window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
      }
    })();
  }, {}],
  6: [function (require, module, exports) {
    (function (global) {
      (function () {
        "use strict";

        function _typeof(obj) {
          "@babel/helpers - typeof";

          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
          }

          return _typeof(obj);
        }
        /**
         * lodash (Custom Build) <https://lodash.com/>
         * Build: `lodash modularize exports="npm" -o ./`
         * Copyright jQuery Foundation and other contributors <https://jquery.org/>
         * Released under MIT license <https://lodash.com/license>
         * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
         * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
         */

        /** Used as the `TypeError` message for "Functions" methods. */


        var FUNC_ERROR_TEXT = 'Expected a function';
        /** Used as references for various `Number` constants. */

        var NAN = 0 / 0;
        /** `Object#toString` result references. */

        var symbolTag = '[object Symbol]';
        /** Used to match leading and trailing whitespace. */

        var reTrim = /^\s+|\s+$/g;
        /** Used to detect bad signed hexadecimal string values. */

        var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
        /** Used to detect binary string values. */

        var reIsBinary = /^0b[01]+$/i;
        /** Used to detect octal string values. */

        var reIsOctal = /^0o[0-7]+$/i;
        /** Built-in method references without a dependency on `root`. */

        var freeParseInt = parseInt;
        /** Detect free variable `global` from Node.js. */

        var freeGlobal = (typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global && global.Object === Object && global;
        /** Detect free variable `self`. */

        var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
        /** Used as a reference to the global object. */

        var root = freeGlobal || freeSelf || Function('return this')();
        /** Used for built-in method references. */

        var objectProto = Object.prototype;
        /**
         * Used to resolve the
         * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
         * of values.
         */

        var objectToString = objectProto.toString;
        /* Built-in method references for those with the same name as other `lodash` methods. */

        var nativeMax = Math.max,
            nativeMin = Math.min;
        /**
         * Gets the timestamp of the number of milliseconds that have elapsed since
         * the Unix epoch (1 January 1970 00:00:00 UTC).
         *
         * @static
         * @memberOf _
         * @since 2.4.0
         * @category Date
         * @returns {number} Returns the timestamp.
         * @example
         *
         * _.defer(function(stamp) {
         *   console.log(_.now() - stamp);
         * }, _.now());
         * // => Logs the number of milliseconds it took for the deferred invocation.
         */

        var now = function now() {
          return root.Date.now();
        };
        /**
         * Creates a debounced function that delays invoking `func` until after `wait`
         * milliseconds have elapsed since the last time the debounced function was
         * invoked. The debounced function comes with a `cancel` method to cancel
         * delayed `func` invocations and a `flush` method to immediately invoke them.
         * Provide `options` to indicate whether `func` should be invoked on the
         * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
         * with the last arguments provided to the debounced function. Subsequent
         * calls to the debounced function return the result of the last `func`
         * invocation.
         *
         * **Note:** If `leading` and `trailing` options are `true`, `func` is
         * invoked on the trailing edge of the timeout only if the debounced function
         * is invoked more than once during the `wait` timeout.
         *
         * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
         * until to the next tick, similar to `setTimeout` with a timeout of `0`.
         *
         * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
         * for details over the differences between `_.debounce` and `_.throttle`.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Function
         * @param {Function} func The function to debounce.
         * @param {number} [wait=0] The number of milliseconds to delay.
         * @param {Object} [options={}] The options object.
         * @param {boolean} [options.leading=false]
         *  Specify invoking on the leading edge of the timeout.
         * @param {number} [options.maxWait]
         *  The maximum time `func` is allowed to be delayed before it's invoked.
         * @param {boolean} [options.trailing=true]
         *  Specify invoking on the trailing edge of the timeout.
         * @returns {Function} Returns the new debounced function.
         * @example
         *
         * // Avoid costly calculations while the window size is in flux.
         * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
         *
         * // Invoke `sendMail` when clicked, debouncing subsequent calls.
         * jQuery(element).on('click', _.debounce(sendMail, 300, {
         *   'leading': true,
         *   'trailing': false
         * }));
         *
         * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
         * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
         * var source = new EventSource('/stream');
         * jQuery(source).on('message', debounced);
         *
         * // Cancel the trailing debounced invocation.
         * jQuery(window).on('popstate', debounced.cancel);
         */


        function debounce(func, wait, options) {
          var lastArgs,
              lastThis,
              maxWait,
              result,
              timerId,
              lastCallTime,
              lastInvokeTime = 0,
              leading = false,
              maxing = false,
              trailing = true;

          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }

          wait = toNumber(wait) || 0;

          if (isObject(options)) {
            leading = !!options.leading;
            maxing = 'maxWait' in options;
            maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
            trailing = 'trailing' in options ? !!options.trailing : trailing;
          }

          function invokeFunc(time) {
            var args = lastArgs,
                thisArg = lastThis;
            lastArgs = lastThis = undefined;
            lastInvokeTime = time;
            result = func.apply(thisArg, args);
            return result;
          }

          function leadingEdge(time) {
            // Reset any `maxWait` timer.
            lastInvokeTime = time; // Start the timer for the trailing edge.

            timerId = setTimeout(timerExpired, wait); // Invoke the leading edge.

            return leading ? invokeFunc(time) : result;
          }

          function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime,
                timeSinceLastInvoke = time - lastInvokeTime,
                result = wait - timeSinceLastCall;
            return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
          }

          function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime,
                timeSinceLastInvoke = time - lastInvokeTime; // Either this is the first call, activity has stopped and we're at the
            // trailing edge, the system time has gone backwards and we're treating
            // it as the trailing edge, or we've hit the `maxWait` limit.

            return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
          }

          function timerExpired() {
            var time = now();

            if (shouldInvoke(time)) {
              return trailingEdge(time);
            } // Restart the timer.


            timerId = setTimeout(timerExpired, remainingWait(time));
          }

          function trailingEdge(time) {
            timerId = undefined; // Only invoke if we have `lastArgs` which means `func` has been
            // debounced at least once.

            if (trailing && lastArgs) {
              return invokeFunc(time);
            }

            lastArgs = lastThis = undefined;
            return result;
          }

          function cancel() {
            if (timerId !== undefined) {
              clearTimeout(timerId);
            }

            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined;
          }

          function flush() {
            return timerId === undefined ? result : trailingEdge(now());
          }

          function debounced() {
            var time = now(),
                isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;

            if (isInvoking) {
              if (timerId === undefined) {
                return leadingEdge(lastCallTime);
              }

              if (maxing) {
                // Handle invocations in a tight loop.
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
              }
            }

            if (timerId === undefined) {
              timerId = setTimeout(timerExpired, wait);
            }

            return result;
          }

          debounced.cancel = cancel;
          debounced.flush = flush;
          return debounced;
        }
        /**
         * Checks if `value` is the
         * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
         * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an object, else `false`.
         * @example
         *
         * _.isObject({});
         * // => true
         *
         * _.isObject([1, 2, 3]);
         * // => true
         *
         * _.isObject(_.noop);
         * // => true
         *
         * _.isObject(null);
         * // => false
         */


        function isObject(value) {
          var type = _typeof(value);

          return !!value && (type == 'object' || type == 'function');
        }
        /**
         * Checks if `value` is object-like. A value is object-like if it's not `null`
         * and has a `typeof` result of "object".
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
         * @example
         *
         * _.isObjectLike({});
         * // => true
         *
         * _.isObjectLike([1, 2, 3]);
         * // => true
         *
         * _.isObjectLike(_.noop);
         * // => false
         *
         * _.isObjectLike(null);
         * // => false
         */


        function isObjectLike(value) {
          return !!value && _typeof(value) == 'object';
        }
        /**
         * Checks if `value` is classified as a `Symbol` primitive or object.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
         * @example
         *
         * _.isSymbol(Symbol.iterator);
         * // => true
         *
         * _.isSymbol('abc');
         * // => false
         */


        function isSymbol(value) {
          return _typeof(value) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
        }
        /**
         * Converts `value` to a number.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to process.
         * @returns {number} Returns the number.
         * @example
         *
         * _.toNumber(3.2);
         * // => 3.2
         *
         * _.toNumber(Number.MIN_VALUE);
         * // => 5e-324
         *
         * _.toNumber(Infinity);
         * // => Infinity
         *
         * _.toNumber('3.2');
         * // => 3.2
         */


        function toNumber(value) {
          if (typeof value == 'number') {
            return value;
          }

          if (isSymbol(value)) {
            return NAN;
          }

          if (isObject(value)) {
            var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
            value = isObject(other) ? other + '' : other;
          }

          if (typeof value != 'string') {
            return value === 0 ? value : +value;
          }

          value = value.replace(reTrim, '');
          var isBinary = reIsBinary.test(value);
          return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
        }

        module.exports = debounce;
      }).call(this);
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}],
  7: [function (require, module, exports) {
    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
    'use strict';
    /* eslint-disable no-unused-vars */

    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    function toObject(val) {
      if (val === null || val === undefined) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
      }

      return Object(val);
    }

    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        } // Detect buggy property enumeration order in older V8 versions.
        // https://bugs.chromium.org/p/v8/issues/detail?id=4118


        var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

        test1[5] = 'de';

        if (Object.getOwnPropertyNames(test1)[0] === '5') {
          return false;
        } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


        var test2 = {};

        for (var i = 0; i < 10; i++) {
          test2['_' + String.fromCharCode(i)] = i;
        }

        var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
          return test2[n];
        });

        if (order2.join('') !== '0123456789') {
          return false;
        } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


        var test3 = {};
        'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
          test3[letter] = letter;
        });

        if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
          return false;
        }

        return true;
      } catch (err) {
        // We don't expect any of the above to throw, but better to be safe.
        return false;
      }
    }

    module.exports = shouldUseNative() ? Object.assign : function (target, source) {
      var from;
      var to = toObject(target);
      var symbols;

      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);

        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }

        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);

          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }

      return to;
    };
  }, {}],
  8: [function (require, module, exports) {
    "use strict";

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    var assign = require('object-assign');

    var delegate = require('../delegate');

    var delegateAll = require('../delegateAll');

    var DELEGATE_PATTERN = /^(.+):delegate\((.+)\)$/;
    var SPACE = ' ';

    var getListeners = function getListeners(type, handler) {
      var match = type.match(DELEGATE_PATTERN);
      var selector;

      if (match) {
        type = match[1];
        selector = match[2];
      }

      var options;

      if (_typeof(handler) === 'object') {
        options = {
          capture: popKey(handler, 'capture'),
          passive: popKey(handler, 'passive')
        };
      }

      var listener = {
        selector: selector,
        delegate: _typeof(handler) === 'object' ? delegateAll(handler) : selector ? delegate(selector, handler) : handler,
        options: options
      };

      if (type.indexOf(SPACE) > -1) {
        return type.split(SPACE).map(function (_type) {
          return assign({
            type: _type
          }, listener);
        });
      } else {
        listener.type = type;
        return [listener];
      }
    };

    var popKey = function popKey(obj, key) {
      var value = obj[key];
      delete obj[key];
      return value;
    };

    module.exports = function behavior(events, props) {
      var listeners = Object.keys(events).reduce(function (memo, type) {
        var listeners = getListeners(type, events[type]);
        return memo.concat(listeners);
      }, []);
      return assign({
        add: function addBehavior(element) {
          listeners.forEach(function (listener) {
            element.addEventListener(listener.type, listener.delegate, listener.options);
          });
        },
        remove: function removeBehavior(element) {
          listeners.forEach(function (listener) {
            element.removeEventListener(listener.type, listener.delegate, listener.options);
          });
        }
      }, props);
    };
  }, {
    "../delegate": 10,
    "../delegateAll": 11,
    "object-assign": 7
  }],
  9: [function (require, module, exports) {
    "use strict";

    module.exports = function compose(functions) {
      return function (e) {
        return functions.some(function (fn) {
          return fn.call(this, e) === false;
        }, this);
      };
    };
  }, {}],
  10: [function (require, module, exports) {
    "use strict"; // polyfill Element.prototype.closest

    require('element-closest');

    module.exports = function delegate(selector, fn) {
      return function delegation(event) {
        var target = event.target.closest(selector);

        if (target) {
          return fn.call(target, event);
        }
      };
    };
  }, {
    "element-closest": 4
  }],
  11: [function (require, module, exports) {
    "use strict";

    var delegate = require('../delegate');

    var compose = require('../compose');

    var SPLAT = '*';

    module.exports = function delegateAll(selectors) {
      var keys = Object.keys(selectors); // XXX optimization: if there is only one handler and it applies to
      // all elements (the "*" CSS selector), then just return that
      // handler

      if (keys.length === 1 && keys[0] === SPLAT) {
        return selectors[SPLAT];
      }

      var delegates = keys.reduce(function (memo, selector) {
        memo.push(delegate(selector, selectors[selector]));
        return memo;
      }, []);
      return compose(delegates);
    };
  }, {
    "../compose": 9,
    "../delegate": 10
  }],
  12: [function (require, module, exports) {
    "use strict";

    module.exports = function ignore(element, fn) {
      return function ignorance(e) {
        if (element !== e.target && !element.contains(e.target)) {
          return fn.call(this, e);
        }
      };
    };
  }, {}],
  13: [function (require, module, exports) {
    "use strict";

    module.exports = {
      behavior: require('./behavior'),
      delegate: require('./delegate'),
      delegateAll: require('./delegateAll'),
      ignore: require('./ignore'),
      keymap: require('./keymap')
    };
  }, {
    "./behavior": 8,
    "./delegate": 10,
    "./delegateAll": 11,
    "./ignore": 12,
    "./keymap": 14
  }],
  14: [function (require, module, exports) {
    "use strict";

    require('keyboardevent-key-polyfill'); // these are the only relevant modifiers supported on all platforms,
    // according to MDN:
    // <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState>


    var MODIFIERS = {
      'Alt': 'altKey',
      'Control': 'ctrlKey',
      'Ctrl': 'ctrlKey',
      'Shift': 'shiftKey'
    };
    var MODIFIER_SEPARATOR = '+';

    var getEventKey = function getEventKey(event, hasModifiers) {
      var key = event.key;

      if (hasModifiers) {
        for (var modifier in MODIFIERS) {
          if (event[MODIFIERS[modifier]] === true) {
            key = [modifier, key].join(MODIFIER_SEPARATOR);
          }
        }
      }

      return key;
    };

    module.exports = function keymap(keys) {
      var hasModifiers = Object.keys(keys).some(function (key) {
        return key.indexOf(MODIFIER_SEPARATOR) > -1;
      });
      return function (event) {
        var key = getEventKey(event, hasModifiers);
        return [key, key.toLowerCase()].reduce(function (result, _key) {
          if (_key in keys) {
            result = keys[key].call(this, event);
          }

          return result;
        }, undefined);
      };
    };

    module.exports.MODIFIERS = MODIFIERS;
  }, {
    "keyboardevent-key-polyfill": 5
  }],
  15: [function (require, module, exports) {
    "use strict";

    module.exports = function once(listener, options) {
      var wrapped = function wrappedOnce(e) {
        e.currentTarget.removeEventListener(e.type, wrapped, options);
        return listener.call(this, e);
      };

      return wrapped;
    };
  }, {}],
  16: [function (require, module, exports) {
    'use strict';

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    var RE_TRIM = /(^\s+)|(\s+$)/g;
    var RE_SPLIT = /\s+/;
    var trim = String.prototype.trim ? function (str) {
      return str.trim();
    } : function (str) {
      return str.replace(RE_TRIM, '');
    };

    var queryById = function queryById(id) {
      return this.querySelector('[id="' + id.replace(/"/g, '\\"') + '"]');
    };

    module.exports = function resolveIds(ids, doc) {
      if (typeof ids !== 'string') {
        throw new Error('Expected a string but got ' + _typeof(ids));
      }

      if (!doc) {
        doc = window.document;
      }

      var getElementById = doc.getElementById ? doc.getElementById.bind(doc) : queryById.bind(doc);
      ids = trim(ids).split(RE_SPLIT); // XXX we can short-circuit here because trimming and splitting a
      // string of just whitespace produces an array containing a single,
      // empty string

      if (ids.length === 1 && ids[0] === '') {
        return [];
      }

      return ids.map(function (id) {
        var el = getElementById(id);

        if (!el) {
          throw new Error('no element with id: "' + id + '"');
        }

        return el;
      });
    };
  }, {}],
  17: [function (require, module, exports) {
    "use strict";

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var select = require("../utils/select");

    var behavior = require("../utils/behavior");

    var toggle = require("../utils/toggle");

    var isElementInViewport = require("../utils/is-in-viewport");

    var _require = require("../events"),
        CLICK = _require.CLICK;

    var _require2 = require("../config"),
        PREFIX = _require2.prefix;

    var ACCORDION = ".".concat(PREFIX, "-accordion, .").concat(PREFIX, "-accordion--bordered");
    var BUTTON = ".".concat(PREFIX, "-accordion__button[aria-controls]");
    var EXPANDED = "aria-expanded";
    var MULTISELECTABLE = "aria-multiselectable";
    /**
     * Get an Array of button elements belonging directly to the given
     * accordion element.
     * @param {HTMLElement} accordion
     * @return {array<HTMLButtonElement>}
     */

    var getAccordionButtons = function getAccordionButtons(accordion) {
      var buttons = select(BUTTON, accordion);
      return buttons.filter(function (button) {
        return button.closest(ACCORDION) === accordion;
      });
    };
    /**
     * Toggle a button's "pressed" state, optionally providing a target
     * state.
     *
     * @param {HTMLButtonElement} button
     * @param {boolean?} expanded If no state is provided, the current
     * state will be toggled (from false to true, and vice-versa).
     * @return {boolean} the resulting state
     */


    var toggleButton = function toggleButton(button, expanded) {
      var accordion = button.closest(ACCORDION);
      var safeExpanded = expanded;

      if (!accordion) {
        throw new Error("".concat(BUTTON, " is missing outer ").concat(ACCORDION));
      }

      safeExpanded = toggle(button, expanded); // XXX multiselectable is opt-in, to preserve legacy behavior

      var multiselectable = accordion.getAttribute(MULTISELECTABLE) === "true";

      if (safeExpanded && !multiselectable) {
        getAccordionButtons(accordion).forEach(function (other) {
          if (other !== button) {
            toggle(other, false);
          }
        });
      }
    };
    /**
     * @param {HTMLButtonElement} button
     * @return {boolean} true
     */


    var showButton = function showButton(button) {
      return toggleButton(button, true);
    };
    /**
     * @param {HTMLButtonElement} button
     * @return {boolean} false
     */


    var hideButton = function hideButton(button) {
      return toggleButton(button, false);
    };

    var accordion = behavior(_defineProperty({}, CLICK, _defineProperty({}, BUTTON, function (event) {
      event.preventDefault();
      toggleButton(this);

      if (this.getAttribute(EXPANDED) === "true") {
        // We were just expanded, but if another accordion was also just
        // collapsed, we may no longer be in the viewport. This ensures
        // that we are still visible, so the user isn't confused.
        if (!isElementInViewport(this)) this.scrollIntoView();
      }
    })), {
      init: function init(root) {
        select(BUTTON, root).forEach(function (button) {
          var expanded = button.getAttribute(EXPANDED) === "true";
          toggleButton(button, expanded);
        });
      },
      ACCORDION: ACCORDION,
      BUTTON: BUTTON,
      show: showButton,
      hide: hideButton,
      toggle: toggleButton,
      getButtons: getAccordionButtons
    });
    module.exports = accordion;
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45,
    "../utils/is-in-viewport": 47,
    "../utils/select": 50,
    "../utils/toggle": 53
  }],
  18: [function (require, module, exports) {
    "use strict";

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var behavior = require("../utils/behavior");

    var _require = require("../events"),
        CLICK = _require.CLICK;

    var _require2 = require("../config"),
        PREFIX = _require2.prefix;

    var HEADER = ".".concat(PREFIX, "-banner__header");
    var EXPANDED_CLASS = "".concat(PREFIX, "-banner__header--expanded");

    var toggleBanner = function toggleEl(event) {
      event.preventDefault();
      this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
    };

    module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, "".concat(HEADER, " [aria-controls]"), toggleBanner)));
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45
  }],
  19: [function (require, module, exports) {
    "use strict";

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var select = require("../utils/select");

    var behavior = require("../utils/behavior");

    var _require = require("../config"),
        PREFIX = _require.prefix;

    var CHARACTER_COUNT = ".".concat(PREFIX, "-character-count");
    var INPUT = ".".concat(PREFIX, "-character-count__field");
    var MESSAGE = ".".concat(PREFIX, "-character-count__message");
    var VALIDATION_MESSAGE = "The content is too long.";
    var MESSAGE_INVALID_CLASS = "".concat(PREFIX, "-character-count__message--invalid");
    /**
     * The elements within the character count.
     * @typedef {Object} CharacterCountElements
     * @property {HTMLDivElement} characterCountEl
     * @property {HTMLSpanElement} messageEl
     */

    /**
     * Returns the root and message element
     * for an character count input
     *
     * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
     * @returns {CharacterCountElements} elements The root and message element.
     */

    var getCharacterCountElements = function getCharacterCountElements(inputEl) {
      var characterCountEl = inputEl.closest(CHARACTER_COUNT);

      if (!characterCountEl) {
        throw new Error("".concat(INPUT, " is missing outer ").concat(CHARACTER_COUNT));
      }

      var messageEl = characterCountEl.querySelector(MESSAGE);

      if (!messageEl) {
        throw new Error("".concat(CHARACTER_COUNT, " is missing inner ").concat(MESSAGE));
      }

      return {
        characterCountEl: characterCountEl,
        messageEl: messageEl
      };
    };
    /**
     * Update the character count component
     *
     * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
     */


    var updateCountMessage = function updateCountMessage(inputEl) {
      var _getCharacterCountEle = getCharacterCountElements(inputEl),
          characterCountEl = _getCharacterCountEle.characterCountEl,
          messageEl = _getCharacterCountEle.messageEl;

      var maxlength = parseInt(characterCountEl.getAttribute("data-maxlength"), 10);
      if (!maxlength) return;
      var newMessage = "";
      var currentLength = inputEl.value.length;
      var isOverLimit = currentLength && currentLength > maxlength;

      if (currentLength === 0) {
        newMessage = "".concat(maxlength, " characters allowed");
      } else {
        var difference = Math.abs(maxlength - currentLength);
        var characters = "character".concat(difference === 1 ? "" : "s");
        var guidance = isOverLimit ? "over limit" : "left";
        newMessage = "".concat(difference, " ").concat(characters, " ").concat(guidance);
      }

      messageEl.classList.toggle(MESSAGE_INVALID_CLASS, isOverLimit);
      messageEl.innerHTML = newMessage;

      if (isOverLimit && !inputEl.validationMessage) {
        inputEl.setCustomValidity(VALIDATION_MESSAGE);
      }

      if (!isOverLimit && inputEl.validationMessage === VALIDATION_MESSAGE) {
        inputEl.setCustomValidity("");
      }
    };
    /**
     * Setup the character count component
     *
     * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
     */


    var setupAttributes = function setupAttributes(inputEl) {
      var _getCharacterCountEle2 = getCharacterCountElements(inputEl),
          characterCountEl = _getCharacterCountEle2.characterCountEl;

      var maxlength = inputEl.getAttribute("maxlength");
      if (!maxlength) return;
      inputEl.removeAttribute("maxlength");
      characterCountEl.setAttribute("data-maxlength", maxlength);
    };

    var characterCount = behavior({
      input: _defineProperty({}, INPUT, function () {
        updateCountMessage(this);
      })
    }, {
      init: function init(root) {
        select(INPUT, root).forEach(function (input) {
          setupAttributes(input);
          updateCountMessage(input);
        });
      },
      MESSAGE_INVALID_CLASS: MESSAGE_INVALID_CLASS,
      VALIDATION_MESSAGE: VALIDATION_MESSAGE
    });
    module.exports = characterCount;
  }, {
    "../config": 36,
    "../utils/behavior": 45,
    "../utils/select": 50
  }],
  20: [function (require, module, exports) {
    "use strict";

    var _CLICK, _keydown, _behavior;

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var keymap = require("receptor/keymap");

    var select = require("../utils/select");

    var behavior = require("../utils/behavior");

    var _require = require("../config"),
        PREFIX = _require.prefix;

    var _require2 = require("../events"),
        CLICK = _require2.CLICK;

    var COMBO_BOX_CLASS = "".concat(PREFIX, "-combo-box");
    var COMBO_BOX_PRISTINE_CLASS = "".concat(COMBO_BOX_CLASS, "--pristine");
    var SELECT_CLASS = "".concat(COMBO_BOX_CLASS, "__select");
    var INPUT_CLASS = "".concat(COMBO_BOX_CLASS, "__input");
    var CLEAR_INPUT_BUTTON_CLASS = "".concat(COMBO_BOX_CLASS, "__clear-input");
    var CLEAR_INPUT_BUTTON_WRAPPER_CLASS = "".concat(CLEAR_INPUT_BUTTON_CLASS, "__wrapper");
    var INPUT_BUTTON_SEPARATOR_CLASS = "".concat(COMBO_BOX_CLASS, "__input-button-separator");
    var TOGGLE_LIST_BUTTON_CLASS = "".concat(COMBO_BOX_CLASS, "__toggle-list");
    var TOGGLE_LIST_BUTTON_WRAPPER_CLASS = "".concat(TOGGLE_LIST_BUTTON_CLASS, "__wrapper");
    var LIST_CLASS = "".concat(COMBO_BOX_CLASS, "__list");
    var LIST_OPTION_CLASS = "".concat(COMBO_BOX_CLASS, "__list-option");
    var LIST_OPTION_FOCUSED_CLASS = "".concat(LIST_OPTION_CLASS, "--focused");
    var LIST_OPTION_SELECTED_CLASS = "".concat(LIST_OPTION_CLASS, "--selected");
    var STATUS_CLASS = "".concat(COMBO_BOX_CLASS, "__status");
    var COMBO_BOX = ".".concat(COMBO_BOX_CLASS);
    var SELECT = ".".concat(SELECT_CLASS);
    var INPUT = ".".concat(INPUT_CLASS);
    var CLEAR_INPUT_BUTTON = ".".concat(CLEAR_INPUT_BUTTON_CLASS);
    var TOGGLE_LIST_BUTTON = ".".concat(TOGGLE_LIST_BUTTON_CLASS);
    var LIST = ".".concat(LIST_CLASS);
    var LIST_OPTION = ".".concat(LIST_OPTION_CLASS);
    var LIST_OPTION_FOCUSED = ".".concat(LIST_OPTION_FOCUSED_CLASS);
    var LIST_OPTION_SELECTED = ".".concat(LIST_OPTION_SELECTED_CLASS);
    var STATUS = ".".concat(STATUS_CLASS);
    var DEFAULT_FILTER = ".*{{query}}.*";

    var noop = function noop() {};
    /**
     * set the value of the element and dispatch a change event
     *
     * @param {HTMLInputElement|HTMLSelectElement} el The element to update
     * @param {string} value The new value of the element
     */


    var changeElementValue = function changeElementValue(el) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var elementToChange = el;
      elementToChange.value = value;
      var event = new CustomEvent("change", {
        bubbles: true,
        cancelable: true,
        detail: {
          value: value
        }
      });
      elementToChange.dispatchEvent(event);
    };
    /**
     * The elements within the combo box.
     * @typedef {Object} ComboBoxContext
     * @property {HTMLElement} comboBoxEl
     * @property {HTMLSelectElement} selectEl
     * @property {HTMLInputElement} inputEl
     * @property {HTMLUListElement} listEl
     * @property {HTMLDivElement} statusEl
     * @property {HTMLLIElement} focusedOptionEl
     * @property {HTMLLIElement} selectedOptionEl
     * @property {HTMLButtonElement} toggleListBtnEl
     * @property {HTMLButtonElement} clearInputBtnEl
     * @property {boolean} isPristine
     * @property {boolean} disableFiltering
     */

    /**
     * Get an object of elements belonging directly to the given
     * combo box component.
     *
     * @param {HTMLElement} el the element within the combo box
     * @returns {ComboBoxContext} elements
     */


    var getComboBoxContext = function getComboBoxContext(el) {
      var comboBoxEl = el.closest(COMBO_BOX);

      if (!comboBoxEl) {
        throw new Error("Element is missing outer ".concat(COMBO_BOX));
      }

      var selectEl = comboBoxEl.querySelector(SELECT);
      var inputEl = comboBoxEl.querySelector(INPUT);
      var listEl = comboBoxEl.querySelector(LIST);
      var statusEl = comboBoxEl.querySelector(STATUS);
      var focusedOptionEl = comboBoxEl.querySelector(LIST_OPTION_FOCUSED);
      var selectedOptionEl = comboBoxEl.querySelector(LIST_OPTION_SELECTED);
      var toggleListBtnEl = comboBoxEl.querySelector(TOGGLE_LIST_BUTTON);
      var clearInputBtnEl = comboBoxEl.querySelector(CLEAR_INPUT_BUTTON);
      var isPristine = comboBoxEl.classList.contains(COMBO_BOX_PRISTINE_CLASS);
      var disableFiltering = comboBoxEl.dataset.disableFiltering === "true";
      return {
        comboBoxEl: comboBoxEl,
        selectEl: selectEl,
        inputEl: inputEl,
        listEl: listEl,
        statusEl: statusEl,
        focusedOptionEl: focusedOptionEl,
        selectedOptionEl: selectedOptionEl,
        toggleListBtnEl: toggleListBtnEl,
        clearInputBtnEl: clearInputBtnEl,
        isPristine: isPristine,
        disableFiltering: disableFiltering
      };
    };
    /**
     * Disable the combo-box component
     *
     * @param {HTMLInputElement} el An element within the combo box component
     */


    var disable = function disable(el) {
      var _getComboBoxContext = getComboBoxContext(el),
          inputEl = _getComboBoxContext.inputEl,
          toggleListBtnEl = _getComboBoxContext.toggleListBtnEl,
          clearInputBtnEl = _getComboBoxContext.clearInputBtnEl;

      clearInputBtnEl.hidden = true;
      clearInputBtnEl.disabled = true;
      toggleListBtnEl.disabled = true;
      inputEl.disabled = true;
    };
    /**
     * Enable the combo-box component
     *
     * @param {HTMLInputElement} el An element within the combo box component
     */


    var enable = function enable(el) {
      var _getComboBoxContext2 = getComboBoxContext(el),
          inputEl = _getComboBoxContext2.inputEl,
          toggleListBtnEl = _getComboBoxContext2.toggleListBtnEl,
          clearInputBtnEl = _getComboBoxContext2.clearInputBtnEl;

      clearInputBtnEl.hidden = false;
      clearInputBtnEl.disabled = false;
      toggleListBtnEl.disabled = false;
      inputEl.disabled = false;
    };
    /**
     * Enhance a select element into a combo box component.
     *
     * @param {HTMLElement} _comboBoxEl The initial element of the combo box component
     */


    var enhanceComboBox = function enhanceComboBox(_comboBoxEl) {
      var comboBoxEl = _comboBoxEl.closest(COMBO_BOX);

      if (comboBoxEl.dataset.enhanced) return;
      var selectEl = comboBoxEl.querySelector("select");

      if (!selectEl) {
        throw new Error("".concat(COMBO_BOX, " is missing inner select"));
      }

      var selectId = selectEl.id;
      var selectLabel = document.querySelector("label[for=\"".concat(selectId, "\"]"));
      var listId = "".concat(selectId, "--list");
      var listIdLabel = "".concat(selectId, "-label");
      var assistiveHintID = "".concat(selectId, "--assistiveHint");
      var additionalAttributes = [];
      var defaultValue = comboBoxEl.dataset.defaultValue;
      var placeholder = comboBoxEl.dataset.placeholder;
      var selectedOption;

      if (placeholder) {
        additionalAttributes.push("placeholder=\"".concat(placeholder, "\""));
      }

      if (defaultValue) {
        for (var i = 0, len = selectEl.options.length; i < len; i += 1) {
          var optionEl = selectEl.options[i];

          if (optionEl.value === defaultValue) {
            selectedOption = optionEl;
            break;
          }
        }
      }
      /**
       * Throw error if combobox is missing a label or label is missing
       * `for` attribute. Otherwise, set the ID to match the <ul> aria-labelledby
       */


      if (!selectLabel || !selectLabel.matches("label[for=\"".concat(selectId, "\"]"))) {
        throw new Error("".concat(COMBO_BOX, " for ").concat(selectId, " is either missing a label or a \"for\" attribute"));
      } else {
        selectLabel.setAttribute("id", listIdLabel);
      }

      selectLabel.setAttribute("id", listIdLabel);
      selectEl.setAttribute("aria-hidden", "true");
      selectEl.setAttribute("tabindex", "-1");
      selectEl.classList.add("usa-sr-only", SELECT_CLASS);
      selectEl.id = "";
      selectEl.value = "";
      ["required", "aria-label", "aria-labelledby"].forEach(function (name) {
        if (selectEl.hasAttribute(name)) {
          var value = selectEl.getAttribute(name);
          additionalAttributes.push("".concat(name, "=\"").concat(value, "\""));
          selectEl.removeAttribute(name);
        }
      });
      comboBoxEl.insertAdjacentHTML("beforeend", ["<input\n        aria-owns=\"".concat(listId, "\"\n        aria-autocomplete=\"list\"\n        aria-describedby=\"").concat(assistiveHintID, "\"\n        aria-expanded=\"false\"\n        autocapitalize=\"off\"\n        autocomplete=\"off\"\n        id=\"").concat(selectId, "\"\n        class=\"").concat(INPUT_CLASS, "\"\n        type=\"text\"\n        role=\"combobox\"\n        ").concat(additionalAttributes.join(" "), "\n      >"), "<span class=\"".concat(CLEAR_INPUT_BUTTON_WRAPPER_CLASS, "\" tabindex=\"-1\">\n        <button type=\"button\" class=\"").concat(CLEAR_INPUT_BUTTON_CLASS, "\" aria-label=\"Clear the select contents\">&nbsp;</button>\n      </span>"), "<span class=\"".concat(INPUT_BUTTON_SEPARATOR_CLASS, "\">&nbsp;</span>"), "<span class=\"".concat(TOGGLE_LIST_BUTTON_WRAPPER_CLASS, "\" tabindex=\"-1\">\n        <button type=\"button\" tabindex=\"-1\" class=\"").concat(TOGGLE_LIST_BUTTON_CLASS, "\" aria-label=\"Toggle the dropdown list\">&nbsp;</button>\n      </span>"), "<ul\n        tabindex=\"-1\"\n        id=\"".concat(listId, "\"\n        class=\"").concat(LIST_CLASS, "\"\n        role=\"listbox\"\n        aria-labelledby=\"").concat(listIdLabel, "\"\n        hidden>\n      </ul>"), "<div class=\"".concat(STATUS_CLASS, " usa-sr-only\" role=\"status\"></div>"), "<span id=\"".concat(assistiveHintID, "\" class=\"usa-sr-only\">\n        When autocomplete results are available use up and down arrows to review and enter to select.\n        Touch device users, explore by touch or with swipe gestures.\n      </span>")].join(""));

      if (selectedOption) {
        var _getComboBoxContext3 = getComboBoxContext(comboBoxEl),
            inputEl = _getComboBoxContext3.inputEl;

        changeElementValue(selectEl, selectedOption.value);
        changeElementValue(inputEl, selectedOption.text);
        comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
      }

      if (selectEl.disabled) {
        disable(comboBoxEl);
        selectEl.disabled = false;
      }

      comboBoxEl.dataset.enhanced = "true";
    };
    /**
     * Manage the focused element within the list options when
     * navigating via keyboard.
     *
     * @param {HTMLElement} el An anchor element within the combo box component
     * @param {HTMLElement} nextEl An element within the combo box component
     * @param {Object} options options
     * @param {boolean} options.skipFocus skip focus of highlighted item
     * @param {boolean} options.preventScroll should skip procedure to scroll to element
     */


    var highlightOption = function highlightOption(el, nextEl) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          skipFocus = _ref.skipFocus,
          preventScroll = _ref.preventScroll;

      var _getComboBoxContext4 = getComboBoxContext(el),
          inputEl = _getComboBoxContext4.inputEl,
          listEl = _getComboBoxContext4.listEl,
          focusedOptionEl = _getComboBoxContext4.focusedOptionEl;

      if (focusedOptionEl) {
        focusedOptionEl.classList.remove(LIST_OPTION_FOCUSED_CLASS);
        focusedOptionEl.setAttribute("tabIndex", "-1");
      }

      if (nextEl) {
        inputEl.setAttribute("aria-activedescendant", nextEl.id);
        nextEl.setAttribute("tabIndex", "0");
        nextEl.classList.add(LIST_OPTION_FOCUSED_CLASS);

        if (!preventScroll) {
          var optionBottom = nextEl.offsetTop + nextEl.offsetHeight;
          var currentBottom = listEl.scrollTop + listEl.offsetHeight;

          if (optionBottom > currentBottom) {
            listEl.scrollTop = optionBottom - listEl.offsetHeight;
          }

          if (nextEl.offsetTop < listEl.scrollTop) {
            listEl.scrollTop = nextEl.offsetTop;
          }
        }

        if (!skipFocus) {
          nextEl.focus({
            preventScroll: preventScroll
          });
        }
      } else {
        inputEl.setAttribute("aria-activedescendant", "");
        inputEl.focus();
      }
    };
    /**
     * Generate a dynamic regular expression based off of a replaceable and possibly filtered value.
     *
     * @param {string} el An element within the combo box component
     * @param {string} query The value to use in the regular expression
     * @param {object} extras An object of regular expressions to replace and filter the query
     */


    var generateDynamicRegExp = function generateDynamicRegExp(filter) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var extras = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var escapeRegExp = function escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      };

      var find = filter.replace(/{{(.*?)}}/g, function (m, $1) {
        var key = $1.trim();
        var queryFilter = extras[key];

        if (key !== "query" && queryFilter) {
          var matcher = new RegExp(queryFilter, "i");
          var matches = query.match(matcher);

          if (matches) {
            return escapeRegExp(matches[1]);
          }

          return "";
        }

        return escapeRegExp(query);
      });
      find = "^(?:" + find + ")$";
      return new RegExp(find, "i");
    };
    /**
     * Display the option list of a combo box component.
     *
     * @param {HTMLElement} el An element within the combo box component
     */


    var displayList = function displayList(el) {
      var _getComboBoxContext5 = getComboBoxContext(el),
          comboBoxEl = _getComboBoxContext5.comboBoxEl,
          selectEl = _getComboBoxContext5.selectEl,
          inputEl = _getComboBoxContext5.inputEl,
          listEl = _getComboBoxContext5.listEl,
          statusEl = _getComboBoxContext5.statusEl,
          isPristine = _getComboBoxContext5.isPristine,
          disableFiltering = _getComboBoxContext5.disableFiltering;

      var selectedItemId;
      var firstFoundId;
      var listOptionBaseId = "".concat(listEl.id, "--option-");
      var inputValue = (inputEl.value || "").toLowerCase();
      var filter = comboBoxEl.dataset.filter || DEFAULT_FILTER;
      var regex = generateDynamicRegExp(filter, inputValue, comboBoxEl.dataset);
      var options = [];

      for (var i = 0, len = selectEl.options.length; i < len; i += 1) {
        var optionEl = selectEl.options[i];
        var optionId = "".concat(listOptionBaseId).concat(options.length);

        if (optionEl.value && (disableFiltering || isPristine || !inputValue || regex.test(optionEl.text))) {
          if (selectEl.value && optionEl.value === selectEl.value) {
            selectedItemId = optionId;
          }

          if (disableFiltering && !firstFoundId && regex.test(optionEl.text)) {
            firstFoundId = optionId;
          }

          options.push(optionEl);
        }
      }

      var numOptions = options.length;
      var optionHtml = options.map(function (option, index) {
        var optionId = "".concat(listOptionBaseId).concat(index);
        var classes = [LIST_OPTION_CLASS];
        var tabindex = "-1";
        var ariaSelected = "false";

        if (optionId === selectedItemId) {
          classes.push(LIST_OPTION_SELECTED_CLASS, LIST_OPTION_FOCUSED_CLASS);
          tabindex = "0";
          ariaSelected = "true";
        }

        if (!selectedItemId && index === 0) {
          classes.push(LIST_OPTION_FOCUSED_CLASS);
          tabindex = "0";
        }

        return "<li\n          aria-selected=\"false\"\n          aria-setsize=\"".concat(options.length, "\"\n          aria-posinset=\"").concat(index + 1, "\"\n          aria-selected=\"").concat(ariaSelected, "\"\n          id=\"").concat(optionId, "\"\n          class=\"").concat(classes.join(" "), "\"\n          tabindex=\"").concat(tabindex, "\"\n          role=\"option\"\n          data-value=\"").concat(option.value, "\"\n        >").concat(option.text, "</li>");
      }).join("");
      var noResults = "<li class=\"".concat(LIST_OPTION_CLASS, "--no-results\">No results found</li>");
      listEl.hidden = false;
      listEl.innerHTML = numOptions ? optionHtml : noResults;
      inputEl.setAttribute("aria-expanded", "true");
      statusEl.innerHTML = numOptions ? "".concat(numOptions, " result").concat(numOptions > 1 ? "s" : "", " available.") : "No results.";
      var itemToFocus;

      if (isPristine && selectedItemId) {
        itemToFocus = listEl.querySelector("#" + selectedItemId);
      } else if (disableFiltering && firstFoundId) {
        itemToFocus = listEl.querySelector("#" + firstFoundId);
      }

      if (itemToFocus) {
        highlightOption(listEl, itemToFocus, {
          skipFocus: true
        });
      }
    };
    /**
     * Hide the option list of a combo box component.
     *
     * @param {HTMLElement} el An element within the combo box component
     */


    var hideList = function hideList(el) {
      var _getComboBoxContext6 = getComboBoxContext(el),
          inputEl = _getComboBoxContext6.inputEl,
          listEl = _getComboBoxContext6.listEl,
          statusEl = _getComboBoxContext6.statusEl,
          focusedOptionEl = _getComboBoxContext6.focusedOptionEl;

      statusEl.innerHTML = "";
      inputEl.setAttribute("aria-expanded", "false");
      inputEl.setAttribute("aria-activedescendant", "");

      if (focusedOptionEl) {
        focusedOptionEl.classList.remove(LIST_OPTION_FOCUSED_CLASS);
      }

      listEl.scrollTop = 0;
      listEl.hidden = true;
    };
    /**
     * Select an option list of the combo box component.
     *
     * @param {HTMLElement} listOptionEl The list option being selected
     */


    var selectItem = function selectItem(listOptionEl) {
      var _getComboBoxContext7 = getComboBoxContext(listOptionEl),
          comboBoxEl = _getComboBoxContext7.comboBoxEl,
          selectEl = _getComboBoxContext7.selectEl,
          inputEl = _getComboBoxContext7.inputEl;

      changeElementValue(selectEl, listOptionEl.dataset.value);
      changeElementValue(inputEl, listOptionEl.textContent);
      comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
      hideList(comboBoxEl);
      inputEl.focus();
    };
    /**
     * Clear the input of the combo box
     *
     * @param {HTMLButtonElement} clearButtonEl The clear input button
     */


    var clearInput = function clearInput(clearButtonEl) {
      var _getComboBoxContext8 = getComboBoxContext(clearButtonEl),
          comboBoxEl = _getComboBoxContext8.comboBoxEl,
          listEl = _getComboBoxContext8.listEl,
          selectEl = _getComboBoxContext8.selectEl,
          inputEl = _getComboBoxContext8.inputEl;

      var listShown = !listEl.hidden;
      if (selectEl.value) changeElementValue(selectEl);
      if (inputEl.value) changeElementValue(inputEl);
      comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS);
      if (listShown) displayList(comboBoxEl);
      inputEl.focus();
    };
    /**
     * Reset the select based off of currently set select value
     *
     * @param {HTMLElement} el An element within the combo box component
     */


    var resetSelection = function resetSelection(el) {
      var _getComboBoxContext9 = getComboBoxContext(el),
          comboBoxEl = _getComboBoxContext9.comboBoxEl,
          selectEl = _getComboBoxContext9.selectEl,
          inputEl = _getComboBoxContext9.inputEl;

      var selectValue = selectEl.value;
      var inputValue = (inputEl.value || "").toLowerCase();

      if (selectValue) {
        for (var i = 0, len = selectEl.options.length; i < len; i += 1) {
          var optionEl = selectEl.options[i];

          if (optionEl.value === selectValue) {
            if (inputValue !== optionEl.text) {
              changeElementValue(inputEl, optionEl.text);
            }

            comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
            return;
          }
        }
      }

      if (inputValue) {
        changeElementValue(inputEl);
      }
    };
    /**
     * Select an option list of the combo box component based off of
     * having a current focused list option or
     * having test that completely matches a list option.
     * Otherwise it clears the input and select.
     *
     * @param {HTMLElement} el An element within the combo box component
     */


    var completeSelection = function completeSelection(el) {
      var _getComboBoxContext10 = getComboBoxContext(el),
          comboBoxEl = _getComboBoxContext10.comboBoxEl,
          selectEl = _getComboBoxContext10.selectEl,
          inputEl = _getComboBoxContext10.inputEl,
          statusEl = _getComboBoxContext10.statusEl;

      statusEl.textContent = "";
      var inputValue = (inputEl.value || "").toLowerCase();

      if (inputValue) {
        for (var i = 0, len = selectEl.options.length; i < len; i += 1) {
          var optionEl = selectEl.options[i];

          if (optionEl.text.toLowerCase() === inputValue) {
            changeElementValue(selectEl, optionEl.value);
            changeElementValue(inputEl, optionEl.text);
            comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
            return;
          }
        }
      }

      resetSelection(comboBoxEl);
    };
    /**
     * Handle the escape event within the combo box component.
     *
     * @param {KeyboardEvent} event An event within the combo box component
     */


    var handleEscape = function handleEscape(event) {
      var _getComboBoxContext11 = getComboBoxContext(event.target),
          comboBoxEl = _getComboBoxContext11.comboBoxEl,
          inputEl = _getComboBoxContext11.inputEl;

      hideList(comboBoxEl);
      resetSelection(comboBoxEl);
      inputEl.focus();
    };
    /**
     * Handle the down event within the combo box component.
     *
     * @param {KeyboardEvent} event An event within the combo box component
     */


    var handleDownFromInput = function handleDownFromInput(event) {
      var _getComboBoxContext12 = getComboBoxContext(event.target),
          comboBoxEl = _getComboBoxContext12.comboBoxEl,
          listEl = _getComboBoxContext12.listEl;

      if (listEl.hidden) {
        displayList(comboBoxEl);
      }

      var nextOptionEl = listEl.querySelector(LIST_OPTION_FOCUSED) || listEl.querySelector(LIST_OPTION);

      if (nextOptionEl) {
        highlightOption(comboBoxEl, nextOptionEl);
      }

      event.preventDefault();
    };
    /**
     * Handle the enter event from an input element within the combo box component.
     *
     * @param {KeyboardEvent} event An event within the combo box component
     */


    var handleEnterFromInput = function handleEnterFromInput(event) {
      var _getComboBoxContext13 = getComboBoxContext(event.target),
          comboBoxEl = _getComboBoxContext13.comboBoxEl,
          listEl = _getComboBoxContext13.listEl;

      var listShown = !listEl.hidden;
      completeSelection(comboBoxEl);

      if (listShown) {
        hideList(comboBoxEl);
      }

      event.preventDefault();
    };
    /**
     * Handle the down event within the combo box component.
     *
     * @param {KeyboardEvent} event An event within the combo box component
     */


    var handleDownFromListOption = function handleDownFromListOption(event) {
      var focusedOptionEl = event.target;
      var nextOptionEl = focusedOptionEl.nextSibling;

      if (nextOptionEl) {
        highlightOption(focusedOptionEl, nextOptionEl);
      }

      event.preventDefault();
    };
    /**
     * Handle the tab event from an list option element within the combo box component.
     *
     * @param {KeyboardEvent} event An event within the combo box component
     */


    var handleTabFromListOption = function handleTabFromListOption(event) {
      selectItem(event.target);
      event.preventDefault();
    };
    /**
     * Handle the enter event from list option within the combo box component.
     *
     * @param {KeyboardEvent} event An event within the combo box component
     */


    var handleEnterFromListOption = function handleEnterFromListOption(event) {
      selectItem(event.target);
      event.preventDefault();
    };
    /**
     * Handle the up event from list option within the combo box component.
     *
     * @param {KeyboardEvent} event An event within the combo box component
     */


    var handleUpFromListOption = function handleUpFromListOption(event) {
      var _getComboBoxContext14 = getComboBoxContext(event.target),
          comboBoxEl = _getComboBoxContext14.comboBoxEl,
          listEl = _getComboBoxContext14.listEl,
          focusedOptionEl = _getComboBoxContext14.focusedOptionEl;

      var nextOptionEl = focusedOptionEl && focusedOptionEl.previousSibling;
      var listShown = !listEl.hidden;
      highlightOption(comboBoxEl, nextOptionEl);

      if (listShown) {
        event.preventDefault();
      }

      if (!nextOptionEl) {
        hideList(comboBoxEl);
      }
    };
    /**
     * Select list option on the mousemove event.
     *
     * @param {MouseEvent} event The mousemove event
     * @param {HTMLLIElement} listOptionEl An element within the combo box component
     */


    var handleMousemove = function handleMousemove(listOptionEl) {
      var isCurrentlyFocused = listOptionEl.classList.contains(LIST_OPTION_FOCUSED_CLASS);
      if (isCurrentlyFocused) return;
      highlightOption(listOptionEl, listOptionEl, {
        preventScroll: true
      });
    };
    /**
     * Toggle the list when the button is clicked
     *
     * @param {HTMLElement} el An element within the combo box component
     */


    var toggleList = function toggleList(el) {
      var _getComboBoxContext15 = getComboBoxContext(el),
          comboBoxEl = _getComboBoxContext15.comboBoxEl,
          listEl = _getComboBoxContext15.listEl,
          inputEl = _getComboBoxContext15.inputEl;

      if (listEl.hidden) {
        displayList(comboBoxEl);
      } else {
        hideList(comboBoxEl);
      }

      inputEl.focus();
    };
    /**
     * Handle click from input
     *
     * @param {HTMLInputElement} el An element within the combo box component
     */


    var handleClickFromInput = function handleClickFromInput(el) {
      var _getComboBoxContext16 = getComboBoxContext(el),
          comboBoxEl = _getComboBoxContext16.comboBoxEl,
          listEl = _getComboBoxContext16.listEl;

      if (listEl.hidden) {
        displayList(comboBoxEl);
      }
    };

    var comboBox = behavior((_behavior = {}, _defineProperty(_behavior, CLICK, (_CLICK = {}, _defineProperty(_CLICK, INPUT, function () {
      if (this.disabled) return;
      handleClickFromInput(this);
    }), _defineProperty(_CLICK, TOGGLE_LIST_BUTTON, function () {
      if (this.disabled) return;
      toggleList(this);
    }), _defineProperty(_CLICK, LIST_OPTION, function () {
      if (this.disabled) return;
      selectItem(this);
    }), _defineProperty(_CLICK, CLEAR_INPUT_BUTTON, function () {
      if (this.disabled) return;
      clearInput(this);
    }), _CLICK)), _defineProperty(_behavior, "focusout", _defineProperty({}, COMBO_BOX, function (event) {
      if (!this.contains(event.relatedTarget)) {
        resetSelection(this);
        hideList(this);
      }
    })), _defineProperty(_behavior, "keydown", (_keydown = {}, _defineProperty(_keydown, COMBO_BOX, keymap({
      Escape: handleEscape
    })), _defineProperty(_keydown, INPUT, keymap({
      Enter: handleEnterFromInput,
      ArrowDown: handleDownFromInput,
      Down: handleDownFromInput
    })), _defineProperty(_keydown, LIST_OPTION, keymap({
      ArrowUp: handleUpFromListOption,
      Up: handleUpFromListOption,
      ArrowDown: handleDownFromListOption,
      Down: handleDownFromListOption,
      Enter: handleEnterFromListOption,
      Tab: handleTabFromListOption,
      "Shift+Tab": noop
    })), _keydown)), _defineProperty(_behavior, "input", _defineProperty({}, INPUT, function () {
      var comboBoxEl = this.closest(COMBO_BOX);
      comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS);
      displayList(this);
    })), _defineProperty(_behavior, "mousemove", _defineProperty({}, LIST_OPTION, function () {
      handleMousemove(this);
    })), _behavior), {
      init: function init(root) {
        select(COMBO_BOX, root).forEach(function (comboBoxEl) {
          enhanceComboBox(comboBoxEl);
        });
      },
      getComboBoxContext: getComboBoxContext,
      enhanceComboBox: enhanceComboBox,
      generateDynamicRegExp: generateDynamicRegExp,
      disable: disable,
      enable: enable,
      displayList: displayList,
      hideList: hideList,
      COMBO_BOX_CLASS: COMBO_BOX_CLASS
    });
    module.exports = comboBox;
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45,
    "../utils/select": 50,
    "receptor/keymap": 14
  }],
  21: [function (require, module, exports) {
    "use strict";

    var _CLICK, _keydown, _focusout, _datePickerEvents;

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    var keymap = require("receptor/keymap");

    var behavior = require("../utils/behavior");

    var select = require("../utils/select");

    var _require = require("../config"),
        PREFIX = _require.prefix;

    var _require2 = require("../events"),
        CLICK = _require2.CLICK;

    var activeElement = require("../utils/active-element");

    var isIosDevice = require("../utils/is-ios-device");

    var DATE_PICKER_CLASS = "".concat(PREFIX, "-date-picker");
    var DATE_PICKER_WRAPPER_CLASS = "".concat(DATE_PICKER_CLASS, "__wrapper");
    var DATE_PICKER_INITIALIZED_CLASS = "".concat(DATE_PICKER_CLASS, "--initialized");
    var DATE_PICKER_ACTIVE_CLASS = "".concat(DATE_PICKER_CLASS, "--active");
    var DATE_PICKER_INTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__internal-input");
    var DATE_PICKER_EXTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__external-input");
    var DATE_PICKER_BUTTON_CLASS = "".concat(DATE_PICKER_CLASS, "__button");
    var DATE_PICKER_CALENDAR_CLASS = "".concat(DATE_PICKER_CLASS, "__calendar");
    var DATE_PICKER_STATUS_CLASS = "".concat(DATE_PICKER_CLASS, "__status");
    var CALENDAR_DATE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date");
    var CALENDAR_DATE_FOCUSED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--focused");
    var CALENDAR_DATE_SELECTED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--selected");
    var CALENDAR_DATE_PREVIOUS_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--previous-month");
    var CALENDAR_DATE_CURRENT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--current-month");
    var CALENDAR_DATE_NEXT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--next-month");
    var CALENDAR_DATE_RANGE_DATE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date");
    var CALENDAR_DATE_TODAY_CLASS = "".concat(CALENDAR_DATE_CLASS, "--today");
    var CALENDAR_DATE_RANGE_DATE_START_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-start");
    var CALENDAR_DATE_RANGE_DATE_END_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-end");
    var CALENDAR_DATE_WITHIN_RANGE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--within-range");
    var CALENDAR_PREVIOUS_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year");
    var CALENDAR_PREVIOUS_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-month");
    var CALENDAR_NEXT_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year");
    var CALENDAR_NEXT_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-month");
    var CALENDAR_MONTH_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-selection");
    var CALENDAR_YEAR_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-selection");
    var CALENDAR_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month");
    var CALENDAR_MONTH_FOCUSED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--focused");
    var CALENDAR_MONTH_SELECTED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--selected");
    var CALENDAR_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year");
    var CALENDAR_YEAR_FOCUSED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--focused");
    var CALENDAR_YEAR_SELECTED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--selected");
    var CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year-chunk");
    var CALENDAR_NEXT_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year-chunk");
    var CALENDAR_DATE_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date-picker");
    var CALENDAR_MONTH_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-picker");
    var CALENDAR_YEAR_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-picker");
    var CALENDAR_TABLE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__table");
    var CALENDAR_ROW_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__row");
    var CALENDAR_CELL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__cell");
    var CALENDAR_CELL_CENTER_ITEMS_CLASS = "".concat(CALENDAR_CELL_CLASS, "--center-items");
    var CALENDAR_MONTH_LABEL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-label");
    var CALENDAR_DAY_OF_WEEK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__day-of-week");
    var DATE_PICKER = ".".concat(DATE_PICKER_CLASS);
    var DATE_PICKER_BUTTON = ".".concat(DATE_PICKER_BUTTON_CLASS);
    var DATE_PICKER_INTERNAL_INPUT = ".".concat(DATE_PICKER_INTERNAL_INPUT_CLASS);
    var DATE_PICKER_EXTERNAL_INPUT = ".".concat(DATE_PICKER_EXTERNAL_INPUT_CLASS);
    var DATE_PICKER_CALENDAR = ".".concat(DATE_PICKER_CALENDAR_CLASS);
    var DATE_PICKER_STATUS = ".".concat(DATE_PICKER_STATUS_CLASS);
    var CALENDAR_DATE = ".".concat(CALENDAR_DATE_CLASS);
    var CALENDAR_DATE_FOCUSED = ".".concat(CALENDAR_DATE_FOCUSED_CLASS);
    var CALENDAR_DATE_CURRENT_MONTH = ".".concat(CALENDAR_DATE_CURRENT_MONTH_CLASS);
    var CALENDAR_PREVIOUS_YEAR = ".".concat(CALENDAR_PREVIOUS_YEAR_CLASS);
    var CALENDAR_PREVIOUS_MONTH = ".".concat(CALENDAR_PREVIOUS_MONTH_CLASS);
    var CALENDAR_NEXT_YEAR = ".".concat(CALENDAR_NEXT_YEAR_CLASS);
    var CALENDAR_NEXT_MONTH = ".".concat(CALENDAR_NEXT_MONTH_CLASS);
    var CALENDAR_YEAR_SELECTION = ".".concat(CALENDAR_YEAR_SELECTION_CLASS);
    var CALENDAR_MONTH_SELECTION = ".".concat(CALENDAR_MONTH_SELECTION_CLASS);
    var CALENDAR_MONTH = ".".concat(CALENDAR_MONTH_CLASS);
    var CALENDAR_YEAR = ".".concat(CALENDAR_YEAR_CLASS);
    var CALENDAR_PREVIOUS_YEAR_CHUNK = ".".concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS);
    var CALENDAR_NEXT_YEAR_CHUNK = ".".concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS);
    var CALENDAR_DATE_PICKER = ".".concat(CALENDAR_DATE_PICKER_CLASS);
    var CALENDAR_MONTH_PICKER = ".".concat(CALENDAR_MONTH_PICKER_CLASS);
    var CALENDAR_YEAR_PICKER = ".".concat(CALENDAR_YEAR_PICKER_CLASS);
    var CALENDAR_MONTH_FOCUSED = ".".concat(CALENDAR_MONTH_FOCUSED_CLASS);
    var CALENDAR_YEAR_FOCUSED = ".".concat(CALENDAR_YEAR_FOCUSED_CLASS);
    var VALIDATION_MESSAGE = "Please enter a valid date";
    var MONTH_LABELS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var DAY_OF_WEEK_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ENTER_KEYCODE = 13;
    var YEAR_CHUNK = 12;
    var DEFAULT_MIN_DATE = "0000-01-01";
    var DEFAULT_EXTERNAL_DATE_FORMAT = "MM/DD/YYYY";
    var INTERNAL_DATE_FORMAT = "YYYY-MM-DD";
    var NOT_DISABLED_SELECTOR = ":not([disabled])";

    var processFocusableSelectors = function processFocusableSelectors() {
      for (var _len = arguments.length, selectors = new Array(_len), _key = 0; _key < _len; _key++) {
        selectors[_key] = arguments[_key];
      }

      return selectors.map(function (query) {
        return query + NOT_DISABLED_SELECTOR;
      }).join(", ");
    };

    var DATE_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR, CALENDAR_PREVIOUS_MONTH, CALENDAR_YEAR_SELECTION, CALENDAR_MONTH_SELECTION, CALENDAR_NEXT_YEAR, CALENDAR_NEXT_MONTH, CALENDAR_DATE_FOCUSED);
    var MONTH_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_MONTH_FOCUSED);
    var YEAR_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR_CHUNK, CALENDAR_NEXT_YEAR_CHUNK, CALENDAR_YEAR_FOCUSED); // #region Date Manipulation Functions

    /**
     * Keep date within month. Month would only be over by 1 to 3 days
     *
     * @param {Date} dateToCheck the date object to check
     * @param {number} month the correct month
     * @returns {Date} the date, corrected if needed
     */

    var keepDateWithinMonth = function keepDateWithinMonth(dateToCheck, month) {
      if (month !== dateToCheck.getMonth()) {
        dateToCheck.setDate(0);
      }

      return dateToCheck;
    };
    /**
     * Set date from month day year
     *
     * @param {number} year the year to set
     * @param {number} month the month to set (zero-indexed)
     * @param {number} date the date to set
     * @returns {Date} the set date
     */


    var setDate = function setDate(year, month, date) {
      var newDate = new Date(0);
      newDate.setFullYear(year, month, date);
      return newDate;
    };
    /**
     * todays date
     *
     * @returns {Date} todays date
     */


    var today = function today() {
      var newDate = new Date();
      var day = newDate.getDate();
      var month = newDate.getMonth();
      var year = newDate.getFullYear();
      return setDate(year, month, day);
    };
    /**
     * Set date to first day of the month
     *
     * @param {number} date the date to adjust
     * @returns {Date} the adjusted date
     */


    var startOfMonth = function startOfMonth(date) {
      var newDate = new Date(0);
      newDate.setFullYear(date.getFullYear(), date.getMonth(), 1);
      return newDate;
    };
    /**
     * Set date to last day of the month
     *
     * @param {number} date the date to adjust
     * @returns {Date} the adjusted date
     */


    var lastDayOfMonth = function lastDayOfMonth(date) {
      var newDate = new Date(0);
      newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
      return newDate;
    };
    /**
     * Add days to date
     *
     * @param {Date} _date the date to adjust
     * @param {number} numDays the difference in days
     * @returns {Date} the adjusted date
     */


    var addDays = function addDays(_date, numDays) {
      var newDate = new Date(_date.getTime());
      newDate.setDate(newDate.getDate() + numDays);
      return newDate;
    };
    /**
     * Subtract days from date
     *
     * @param {Date} _date the date to adjust
     * @param {number} numDays the difference in days
     * @returns {Date} the adjusted date
     */


    var subDays = function subDays(_date, numDays) {
      return addDays(_date, -numDays);
    };
    /**
     * Add weeks to date
     *
     * @param {Date} _date the date to adjust
     * @param {number} numWeeks the difference in weeks
     * @returns {Date} the adjusted date
     */


    var addWeeks = function addWeeks(_date, numWeeks) {
      return addDays(_date, numWeeks * 7);
    };
    /**
     * Subtract weeks from date
     *
     * @param {Date} _date the date to adjust
     * @param {number} numWeeks the difference in weeks
     * @returns {Date} the adjusted date
     */


    var subWeeks = function subWeeks(_date, numWeeks) {
      return addWeeks(_date, -numWeeks);
    };
    /**
     * Set date to the start of the week (Sunday)
     *
     * @param {Date} _date the date to adjust
     * @returns {Date} the adjusted date
     */


    var startOfWeek = function startOfWeek(_date) {
      var dayOfWeek = _date.getDay();

      return subDays(_date, dayOfWeek);
    };
    /**
     * Set date to the end of the week (Saturday)
     *
     * @param {Date} _date the date to adjust
     * @param {number} numWeeks the difference in weeks
     * @returns {Date} the adjusted date
     */


    var endOfWeek = function endOfWeek(_date) {
      var dayOfWeek = _date.getDay();

      return addDays(_date, 6 - dayOfWeek);
    };
    /**
     * Add months to date and keep date within month
     *
     * @param {Date} _date the date to adjust
     * @param {number} numMonths the difference in months
     * @returns {Date} the adjusted date
     */


    var addMonths = function addMonths(_date, numMonths) {
      var newDate = new Date(_date.getTime());
      var dateMonth = (newDate.getMonth() + 12 + numMonths) % 12;
      newDate.setMonth(newDate.getMonth() + numMonths);
      keepDateWithinMonth(newDate, dateMonth);
      return newDate;
    };
    /**
     * Subtract months from date
     *
     * @param {Date} _date the date to adjust
     * @param {number} numMonths the difference in months
     * @returns {Date} the adjusted date
     */


    var subMonths = function subMonths(_date, numMonths) {
      return addMonths(_date, -numMonths);
    };
    /**
     * Add years to date and keep date within month
     *
     * @param {Date} _date the date to adjust
     * @param {number} numYears the difference in years
     * @returns {Date} the adjusted date
     */


    var addYears = function addYears(_date, numYears) {
      return addMonths(_date, numYears * 12);
    };
    /**
     * Subtract years from date
     *
     * @param {Date} _date the date to adjust
     * @param {number} numYears the difference in years
     * @returns {Date} the adjusted date
     */


    var subYears = function subYears(_date, numYears) {
      return addYears(_date, -numYears);
    };
    /**
     * Set months of date
     *
     * @param {Date} _date the date to adjust
     * @param {number} month zero-indexed month to set
     * @returns {Date} the adjusted date
     */


    var setMonth = function setMonth(_date, month) {
      var newDate = new Date(_date.getTime());
      newDate.setMonth(month);
      keepDateWithinMonth(newDate, month);
      return newDate;
    };
    /**
     * Set year of date
     *
     * @param {Date} _date the date to adjust
     * @param {number} year the year to set
     * @returns {Date} the adjusted date
     */


    var setYear = function setYear(_date, year) {
      var newDate = new Date(_date.getTime());
      var month = newDate.getMonth();
      newDate.setFullYear(year);
      keepDateWithinMonth(newDate, month);
      return newDate;
    };
    /**
     * Return the earliest date
     *
     * @param {Date} dateA date to compare
     * @param {Date} dateB date to compare
     * @returns {Date} the earliest date
     */


    var min = function min(dateA, dateB) {
      var newDate = dateA;

      if (dateB < dateA) {
        newDate = dateB;
      }

      return new Date(newDate.getTime());
    };
    /**
     * Return the latest date
     *
     * @param {Date} dateA date to compare
     * @param {Date} dateB date to compare
     * @returns {Date} the latest date
     */


    var max = function max(dateA, dateB) {
      var newDate = dateA;

      if (dateB > dateA) {
        newDate = dateB;
      }

      return new Date(newDate.getTime());
    };
    /**
     * Check if dates are the in the same year
     *
     * @param {Date} dateA date to compare
     * @param {Date} dateB date to compare
     * @returns {boolean} are dates in the same year
     */


    var isSameYear = function isSameYear(dateA, dateB) {
      return dateA && dateB && dateA.getFullYear() === dateB.getFullYear();
    };
    /**
     * Check if dates are the in the same month
     *
     * @param {Date} dateA date to compare
     * @param {Date} dateB date to compare
     * @returns {boolean} are dates in the same month
     */


    var isSameMonth = function isSameMonth(dateA, dateB) {
      return isSameYear(dateA, dateB) && dateA.getMonth() === dateB.getMonth();
    };
    /**
     * Check if dates are the same date
     *
     * @param {Date} dateA the date to compare
     * @param {Date} dateA the date to compare
     * @returns {boolean} are dates the same date
     */


    var isSameDay = function isSameDay(dateA, dateB) {
      return isSameMonth(dateA, dateB) && dateA.getDate() === dateB.getDate();
    };
    /**
     * return a new date within minimum and maximum date
     *
     * @param {Date} date date to check
     * @param {Date} minDate minimum date to allow
     * @param {Date} maxDate maximum date to allow
     * @returns {Date} the date between min and max
     */


    var keepDateBetweenMinAndMax = function keepDateBetweenMinAndMax(date, minDate, maxDate) {
      var newDate = date;

      if (date < minDate) {
        newDate = minDate;
      } else if (maxDate && date > maxDate) {
        newDate = maxDate;
      }

      return new Date(newDate.getTime());
    };
    /**
     * Check if dates is valid.
     *
     * @param {Date} date date to check
     * @param {Date} minDate minimum date to allow
     * @param {Date} maxDate maximum date to allow
     * @return {boolean} is there a day within the month within min and max dates
     */


    var isDateWithinMinAndMax = function isDateWithinMinAndMax(date, minDate, maxDate) {
      return date >= minDate && (!maxDate || date <= maxDate);
    };
    /**
     * Check if dates month is invalid.
     *
     * @param {Date} date date to check
     * @param {Date} minDate minimum date to allow
     * @param {Date} maxDate maximum date to allow
     * @return {boolean} is the month outside min or max dates
     */


    var isDatesMonthOutsideMinOrMax = function isDatesMonthOutsideMinOrMax(date, minDate, maxDate) {
      return lastDayOfMonth(date) < minDate || maxDate && startOfMonth(date) > maxDate;
    };
    /**
     * Check if dates year is invalid.
     *
     * @param {Date} date date to check
     * @param {Date} minDate minimum date to allow
     * @param {Date} maxDate maximum date to allow
     * @return {boolean} is the month outside min or max dates
     */


    var isDatesYearOutsideMinOrMax = function isDatesYearOutsideMinOrMax(date, minDate, maxDate) {
      return lastDayOfMonth(setMonth(date, 11)) < minDate || maxDate && startOfMonth(setMonth(date, 0)) > maxDate;
    };
    /**
     * Parse a date with format M-D-YY
     *
     * @param {string} dateString the date string to parse
     * @param {string} dateFormat the format of the date string
     * @param {boolean} adjustDate should the date be adjusted
     * @returns {Date} the parsed date
     */


    var parseDateString = function parseDateString(dateString) {
      var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;
      var adjustDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var date;
      var month;
      var day;
      var year;
      var parsed;

      if (dateString) {
        var monthStr, dayStr, yearStr;

        if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
          var _dateString$split = dateString.split("/");

          var _dateString$split2 = _slicedToArray(_dateString$split, 3);

          monthStr = _dateString$split2[0];
          dayStr = _dateString$split2[1];
          yearStr = _dateString$split2[2];
        } else {
          var _dateString$split3 = dateString.split("-");

          var _dateString$split4 = _slicedToArray(_dateString$split3, 3);

          yearStr = _dateString$split4[0];
          monthStr = _dateString$split4[1];
          dayStr = _dateString$split4[2];
        }

        if (yearStr) {
          parsed = parseInt(yearStr, 10);

          if (!Number.isNaN(parsed)) {
            year = parsed;

            if (adjustDate) {
              year = Math.max(0, year);

              if (yearStr.length < 3) {
                var currentYear = today().getFullYear();
                var currentYearStub = currentYear - currentYear % Math.pow(10, yearStr.length);
                year = currentYearStub + parsed;
              }
            }
          }
        }

        if (monthStr) {
          parsed = parseInt(monthStr, 10);

          if (!Number.isNaN(parsed)) {
            month = parsed;

            if (adjustDate) {
              month = Math.max(1, month);
              month = Math.min(12, month);
            }
          }
        }

        if (month && dayStr && year != null) {
          parsed = parseInt(dayStr, 10);

          if (!Number.isNaN(parsed)) {
            day = parsed;

            if (adjustDate) {
              var lastDayOfTheMonth = setDate(year, month, 0).getDate();
              day = Math.max(1, day);
              day = Math.min(lastDayOfTheMonth, day);
            }
          }
        }

        if (month && day && year != null) {
          date = setDate(year, month - 1, day);
        }
      }

      return date;
    };
    /**
     * Format a date to format MM-DD-YYYY
     *
     * @param {Date} date the date to format
     * @param {string} dateFormat the format of the date string
     * @returns {string} the formatted date string
     */


    var formatDate = function formatDate(date) {
      var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;

      var padZeros = function padZeros(value, length) {
        return "0000".concat(value).slice(-length);
      };

      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();

      if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
        return [padZeros(month, 2), padZeros(day, 2), padZeros(year, 4)].join("/");
      }

      return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join("-");
    }; // #endregion Date Manipulation Functions

    /**
     * Create a grid string from an array of html strings
     *
     * @param {string[]} htmlArray the array of html items
     * @param {number} rowSize the length of a row
     * @returns {string} the grid string
     */


    var listToGridHtml = function listToGridHtml(htmlArray, rowSize) {
      var grid = [];
      var row = [];
      var i = 0;

      while (i < htmlArray.length) {
        row = [];

        while (i < htmlArray.length && row.length < rowSize) {
          row.push("<td>".concat(htmlArray[i], "</td>"));
          i += 1;
        }

        grid.push("<tr>".concat(row.join(""), "</tr>"));
      }

      return grid.join("");
    };
    /**
     * set the value of the element and dispatch a change event
     *
     * @param {HTMLInputElement} el The element to update
     * @param {string} value The new value of the element
     */


    var changeElementValue = function changeElementValue(el) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var elementToChange = el;
      elementToChange.value = value;
      var event = new CustomEvent("change", {
        bubbles: true,
        cancelable: true,
        detail: {
          value: value
        }
      });
      elementToChange.dispatchEvent(event);
    };
    /**
     * The properties and elements within the date picker.
     * @typedef {Object} DatePickerContext
     * @property {HTMLDivElement} calendarEl
     * @property {HTMLElement} datePickerEl
     * @property {HTMLInputElement} internalInputEl
     * @property {HTMLInputElement} externalInputEl
     * @property {HTMLDivElement} statusEl
     * @property {HTMLDivElement} firstYearChunkEl
     * @property {Date} calendarDate
     * @property {Date} minDate
     * @property {Date} maxDate
     * @property {Date} selectedDate
     * @property {Date} rangeDate
     * @property {Date} defaultDate
     */

    /**
     * Get an object of the properties and elements belonging directly to the given
     * date picker component.
     *
     * @param {HTMLElement} el the element within the date picker
     * @returns {DatePickerContext} elements
     */


    var getDatePickerContext = function getDatePickerContext(el) {
      var datePickerEl = el.closest(DATE_PICKER);

      if (!datePickerEl) {
        throw new Error("Element is missing outer ".concat(DATE_PICKER));
      }

      var internalInputEl = datePickerEl.querySelector(DATE_PICKER_INTERNAL_INPUT);
      var externalInputEl = datePickerEl.querySelector(DATE_PICKER_EXTERNAL_INPUT);
      var calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
      var toggleBtnEl = datePickerEl.querySelector(DATE_PICKER_BUTTON);
      var statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);
      var firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);
      var inputDate = parseDateString(externalInputEl.value, DEFAULT_EXTERNAL_DATE_FORMAT, true);
      var selectedDate = parseDateString(internalInputEl.value);
      var calendarDate = parseDateString(calendarEl.dataset.value);
      var minDate = parseDateString(datePickerEl.dataset.minDate);
      var maxDate = parseDateString(datePickerEl.dataset.maxDate);
      var rangeDate = parseDateString(datePickerEl.dataset.rangeDate);
      var defaultDate = parseDateString(datePickerEl.dataset.defaultDate);

      if (minDate && maxDate && minDate > maxDate) {
        throw new Error("Minimum date cannot be after maximum date");
      }

      return {
        calendarDate: calendarDate,
        minDate: minDate,
        toggleBtnEl: toggleBtnEl,
        selectedDate: selectedDate,
        maxDate: maxDate,
        firstYearChunkEl: firstYearChunkEl,
        datePickerEl: datePickerEl,
        inputDate: inputDate,
        internalInputEl: internalInputEl,
        externalInputEl: externalInputEl,
        calendarEl: calendarEl,
        rangeDate: rangeDate,
        defaultDate: defaultDate,
        statusEl: statusEl
      };
    };
    /**
     * Disable the date picker component
     *
     * @param {HTMLElement} el An element within the date picker component
     */


    var disable = function disable(el) {
      var _getDatePickerContext = getDatePickerContext(el),
          externalInputEl = _getDatePickerContext.externalInputEl,
          toggleBtnEl = _getDatePickerContext.toggleBtnEl;

      toggleBtnEl.disabled = true;
      externalInputEl.disabled = true;
    };
    /**
     * Enable the date picker component
     *
     * @param {HTMLElement} el An element within the date picker component
     */


    var enable = function enable(el) {
      var _getDatePickerContext2 = getDatePickerContext(el),
          externalInputEl = _getDatePickerContext2.externalInputEl,
          toggleBtnEl = _getDatePickerContext2.toggleBtnEl;

      toggleBtnEl.disabled = false;
      externalInputEl.disabled = false;
    }; // #region Validation

    /**
     * Validate the value in the input as a valid date of format M/D/YYYY
     *
     * @param {HTMLElement} el An element within the date picker component
     */


    var isDateInputInvalid = function isDateInputInvalid(el) {
      var _getDatePickerContext3 = getDatePickerContext(el),
          externalInputEl = _getDatePickerContext3.externalInputEl,
          minDate = _getDatePickerContext3.minDate,
          maxDate = _getDatePickerContext3.maxDate;

      var dateString = externalInputEl.value;
      var isInvalid = false;

      if (dateString) {
        isInvalid = true;
        var dateStringParts = dateString.split("/");

        var _dateStringParts$map = dateStringParts.map(function (str) {
          var value;
          var parsed = parseInt(str, 10);
          if (!Number.isNaN(parsed)) value = parsed;
          return value;
        }),
            _dateStringParts$map2 = _slicedToArray(_dateStringParts$map, 3),
            month = _dateStringParts$map2[0],
            day = _dateStringParts$map2[1],
            year = _dateStringParts$map2[2];

        if (month && day && year != null) {
          var checkDate = setDate(year, month - 1, day);

          if (checkDate.getMonth() === month - 1 && checkDate.getDate() === day && checkDate.getFullYear() === year && dateStringParts[2].length === 4 && isDateWithinMinAndMax(checkDate, minDate, maxDate)) {
            isInvalid = false;
          }
        }
      }

      return isInvalid;
    };
    /**
     * Validate the value in the input as a valid date of format M/D/YYYY
     *
     * @param {HTMLElement} el An element within the date picker component
     */


    var validateDateInput = function validateDateInput(el) {
      var _getDatePickerContext4 = getDatePickerContext(el),
          externalInputEl = _getDatePickerContext4.externalInputEl;

      var isInvalid = isDateInputInvalid(externalInputEl);

      if (isInvalid && !externalInputEl.validationMessage) {
        externalInputEl.setCustomValidity(VALIDATION_MESSAGE);
      }

      if (!isInvalid && externalInputEl.validationMessage === VALIDATION_MESSAGE) {
        externalInputEl.setCustomValidity("");
      }
    }; // #endregion Validation

    /**
     * Enable the date picker component
     *
     * @param {HTMLElement} el An element within the date picker component
     */


    var reconcileInputValues = function reconcileInputValues(el) {
      var _getDatePickerContext5 = getDatePickerContext(el),
          internalInputEl = _getDatePickerContext5.internalInputEl,
          inputDate = _getDatePickerContext5.inputDate;

      var newValue = "";

      if (inputDate && !isDateInputInvalid(el)) {
        newValue = formatDate(inputDate);
      }

      if (internalInputEl.value !== newValue) {
        changeElementValue(internalInputEl, newValue);
      }
    };
    /**
     * Select the value of the date picker inputs.
     *
     * @param {HTMLButtonElement} el An element within the date picker component
     * @param {string} dateString The date string to update in YYYY-MM-DD format
     */


    var setCalendarValue = function setCalendarValue(el, dateString) {
      var parsedDate = parseDateString(dateString);

      if (parsedDate) {
        var formattedDate = formatDate(parsedDate, DEFAULT_EXTERNAL_DATE_FORMAT);

        var _getDatePickerContext6 = getDatePickerContext(el),
            datePickerEl = _getDatePickerContext6.datePickerEl,
            internalInputEl = _getDatePickerContext6.internalInputEl,
            externalInputEl = _getDatePickerContext6.externalInputEl;

        changeElementValue(internalInputEl, dateString);
        changeElementValue(externalInputEl, formattedDate);
        validateDateInput(datePickerEl);
      }
    };
    /**
     * Enhance an input with the date picker elements
     *
     * @param {HTMLElement} el The initial wrapping element of the date picker component
     */


    var enhanceDatePicker = function enhanceDatePicker(el) {
      var datePickerEl = el.closest(DATE_PICKER);
      var defaultValue = datePickerEl.dataset.defaultValue;
      var internalInputEl = datePickerEl.querySelector("input");

      if (!internalInputEl) {
        throw new Error("".concat(DATE_PICKER, " is missing inner input"));
      }

      if (internalInputEl.value) {
        internalInputEl.value = "";
      }

      var minDate = parseDateString(datePickerEl.dataset.minDate || internalInputEl.getAttribute("min"));
      datePickerEl.dataset.minDate = minDate ? formatDate(minDate) : DEFAULT_MIN_DATE;
      var maxDate = parseDateString(datePickerEl.dataset.maxDate || internalInputEl.getAttribute("max"));

      if (maxDate) {
        datePickerEl.dataset.maxDate = formatDate(maxDate);
      }

      var calendarWrapper = document.createElement("div");
      calendarWrapper.classList.add(DATE_PICKER_WRAPPER_CLASS);
      calendarWrapper.tabIndex = "-1";
      var externalInputEl = internalInputEl.cloneNode();
      externalInputEl.classList.add(DATE_PICKER_EXTERNAL_INPUT_CLASS);
      externalInputEl.type = "text";
      externalInputEl.name = "";
      calendarWrapper.appendChild(externalInputEl);
      calendarWrapper.insertAdjacentHTML("beforeend", ["<button type=\"button\" class=\"".concat(DATE_PICKER_BUTTON_CLASS, "\" aria-haspopup=\"true\" aria-label=\"Toggle calendar\">&nbsp;</button>"), "<div class=\"".concat(DATE_PICKER_CALENDAR_CLASS, "\" role=\"dialog\" aria-modal=\"true\" hidden></div>"), "<div class=\"usa-sr-only ".concat(DATE_PICKER_STATUS_CLASS, "\" role=\"status\" aria-live=\"polite\"></div>")].join(""));
      internalInputEl.setAttribute("aria-hidden", "true");
      internalInputEl.setAttribute("tabindex", "-1");
      internalInputEl.classList.add("usa-sr-only", DATE_PICKER_INTERNAL_INPUT_CLASS);
      internalInputEl.id = "";
      internalInputEl.required = false;
      datePickerEl.appendChild(calendarWrapper);
      datePickerEl.classList.add(DATE_PICKER_INITIALIZED_CLASS);

      if (defaultValue) {
        setCalendarValue(datePickerEl, defaultValue);
      }

      if (internalInputEl.disabled) {
        disable(datePickerEl);
        internalInputEl.disabled = false;
      }
    }; // #region Calendar - Date Selection View

    /**
     * render the calendar.
     *
     * @param {HTMLElement} el An element within the date picker component
     * @param {Date} _dateToDisplay a date to render on the calendar
     * @returns {HTMLElement} a reference to the new calendar element
     */


    var renderCalendar = function renderCalendar(el, _dateToDisplay) {
      var _getDatePickerContext7 = getDatePickerContext(el),
          datePickerEl = _getDatePickerContext7.datePickerEl,
          calendarEl = _getDatePickerContext7.calendarEl,
          statusEl = _getDatePickerContext7.statusEl,
          selectedDate = _getDatePickerContext7.selectedDate,
          maxDate = _getDatePickerContext7.maxDate,
          minDate = _getDatePickerContext7.minDate,
          rangeDate = _getDatePickerContext7.rangeDate;

      var todaysDate = today();
      var dateToDisplay = _dateToDisplay || todaysDate;
      var calendarWasHidden = calendarEl.hidden;
      var focusedDate = addDays(dateToDisplay, 0);
      var focusedMonth = dateToDisplay.getMonth();
      var focusedYear = dateToDisplay.getFullYear();
      var prevMonth = subMonths(dateToDisplay, 1);
      var nextMonth = addMonths(dateToDisplay, 1);
      var currentFormattedDate = formatDate(dateToDisplay);
      var firstOfMonth = startOfMonth(dateToDisplay);
      var prevButtonsDisabled = isSameMonth(dateToDisplay, minDate);
      var nextButtonsDisabled = isSameMonth(dateToDisplay, maxDate);
      var rangeConclusionDate = selectedDate || dateToDisplay;
      var rangeStartDate = rangeDate && min(rangeConclusionDate, rangeDate);
      var rangeEndDate = rangeDate && max(rangeConclusionDate, rangeDate);
      var withinRangeStartDate = rangeDate && addDays(rangeStartDate, 1);
      var withinRangeEndDate = rangeDate && subDays(rangeEndDate, 1);
      var monthLabel = MONTH_LABELS[focusedMonth];

      var generateDateHtml = function generateDateHtml(dateToRender) {
        var classes = [CALENDAR_DATE_CLASS];
        var day = dateToRender.getDate();
        var month = dateToRender.getMonth();
        var year = dateToRender.getFullYear();
        var dayOfWeek = dateToRender.getDay();
        var formattedDate = formatDate(dateToRender);
        var tabindex = "-1";
        var isDisabled = !isDateWithinMinAndMax(dateToRender, minDate, maxDate);
        var isSelected = isSameDay(dateToRender, selectedDate);

        if (isSameMonth(dateToRender, prevMonth)) {
          classes.push(CALENDAR_DATE_PREVIOUS_MONTH_CLASS);
        }

        if (isSameMonth(dateToRender, focusedDate)) {
          classes.push(CALENDAR_DATE_CURRENT_MONTH_CLASS);
        }

        if (isSameMonth(dateToRender, nextMonth)) {
          classes.push(CALENDAR_DATE_NEXT_MONTH_CLASS);
        }

        if (isSelected) {
          classes.push(CALENDAR_DATE_SELECTED_CLASS);
        }

        if (isSameDay(dateToRender, todaysDate)) {
          classes.push(CALENDAR_DATE_TODAY_CLASS);
        }

        if (rangeDate) {
          if (isSameDay(dateToRender, rangeDate)) {
            classes.push(CALENDAR_DATE_RANGE_DATE_CLASS);
          }

          if (isSameDay(dateToRender, rangeStartDate)) {
            classes.push(CALENDAR_DATE_RANGE_DATE_START_CLASS);
          }

          if (isSameDay(dateToRender, rangeEndDate)) {
            classes.push(CALENDAR_DATE_RANGE_DATE_END_CLASS);
          }

          if (isDateWithinMinAndMax(dateToRender, withinRangeStartDate, withinRangeEndDate)) {
            classes.push(CALENDAR_DATE_WITHIN_RANGE_CLASS);
          }
        }

        if (isSameDay(dateToRender, focusedDate)) {
          tabindex = "0";
          classes.push(CALENDAR_DATE_FOCUSED_CLASS);
        }

        var monthStr = MONTH_LABELS[month];
        var dayStr = DAY_OF_WEEK_LABELS[dayOfWeek];
        return "<button\n      type=\"button\"\n      tabindex=\"".concat(tabindex, "\"\n      class=\"").concat(classes.join(" "), "\" \n      data-day=\"").concat(day, "\" \n      data-month=\"").concat(month + 1, "\" \n      data-year=\"").concat(year, "\" \n      data-value=\"").concat(formattedDate, "\"\n      aria-label=\"").concat(day, " ").concat(monthStr, " ").concat(year, " ").concat(dayStr, "\"\n      aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n      ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n    >").concat(day, "</button>");
      }; // set date to first rendered day


      dateToDisplay = startOfWeek(firstOfMonth);
      var days = [];

      while (days.length < 28 || dateToDisplay.getMonth() === focusedMonth || days.length % 7 !== 0) {
        days.push(generateDateHtml(dateToDisplay));
        dateToDisplay = addDays(dateToDisplay, 1);
      }

      var datesHtml = listToGridHtml(days, 7);
      var newCalendar = calendarEl.cloneNode();
      newCalendar.dataset.value = currentFormattedDate;
      newCalendar.style.top = "".concat(datePickerEl.offsetHeight, "px");
      newCalendar.hidden = false;
      newCalendar.innerHTML = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_DATE_PICKER_CLASS, "\">\n      <div class=\"").concat(CALENDAR_ROW_CLASS, "\">\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_YEAR_CLASS, "\"\n            aria-label=\"Navigate back one year\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_MONTH_CLASS, "\"\n            aria-label=\"Navigate back one month\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_MONTH_LABEL_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_MONTH_SELECTION_CLASS, "\" aria-label=\"").concat(monthLabel, ". Click to select month\"\n          >").concat(monthLabel, "</button>\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_YEAR_SELECTION_CLASS, "\" aria-label=\"").concat(focusedYear, ". Click to select year\"\n          >").concat(focusedYear, "</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_MONTH_CLASS, "\"\n            aria-label=\"Navigate forward one month\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_YEAR_CLASS, "\"\n            aria-label=\"Navigate forward one year\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n      </div>\n      <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <thead>\n          <tr>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Sunday\">S</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Monday\">M</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Tuesday\">T</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Wednesday\">W</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Thursday\">Th</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Friday\">F</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Saturday\">S</th>\n          </tr>\n        </thead>\n        <tbody>\n          ").concat(datesHtml, "\n        </tbody>\n      </table>\n    </div>");
      calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
      datePickerEl.classList.add(DATE_PICKER_ACTIVE_CLASS);
      var statuses = [];

      if (isSameDay(selectedDate, focusedDate)) {
        statuses.push("Selected date");
      }

      if (calendarWasHidden) {
        statuses.push("You can navigate by day using left and right arrows", "Weeks by using up and down arrows", "Months by using page up and page down keys", "Years by using shift plus page up and shift plus page down", "Home and end keys navigate to the beginning and end of a week");
        statusEl.textContent = "";
      } else {
        statuses.push("".concat(monthLabel, " ").concat(focusedYear));
      }

      statusEl.textContent = statuses.join(". ");
      return newCalendar;
    };
    /**
     * Navigate back one year and display the calendar.
     *
     * @param {HTMLButtonElement} _buttonEl An element within the date picker component
     */


    var displayPreviousYear = function displayPreviousYear(_buttonEl) {
      if (_buttonEl.disabled) return;

      var _getDatePickerContext8 = getDatePickerContext(_buttonEl),
          calendarEl = _getDatePickerContext8.calendarEl,
          calendarDate = _getDatePickerContext8.calendarDate,
          minDate = _getDatePickerContext8.minDate,
          maxDate = _getDatePickerContext8.maxDate;

      var date = subYears(calendarDate, 1);
      date = keepDateBetweenMinAndMax(date, minDate, maxDate);
      var newCalendar = renderCalendar(calendarEl, date);
      var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR);

      if (nextToFocus.disabled) {
        nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
      }

      nextToFocus.focus();
    };
    /**
     * Navigate back one month and display the calendar.
     *
     * @param {HTMLButtonElement} _buttonEl An element within the date picker component
     */


    var displayPreviousMonth = function displayPreviousMonth(_buttonEl) {
      if (_buttonEl.disabled) return;

      var _getDatePickerContext9 = getDatePickerContext(_buttonEl),
          calendarEl = _getDatePickerContext9.calendarEl,
          calendarDate = _getDatePickerContext9.calendarDate,
          minDate = _getDatePickerContext9.minDate,
          maxDate = _getDatePickerContext9.maxDate;

      var date = subMonths(calendarDate, 1);
      date = keepDateBetweenMinAndMax(date, minDate, maxDate);
      var newCalendar = renderCalendar(calendarEl, date);
      var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_MONTH);

      if (nextToFocus.disabled) {
        nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
      }

      nextToFocus.focus();
    };
    /**
     * Navigate forward one month and display the calendar.
     *
     * @param {HTMLButtonElement} _buttonEl An element within the date picker component
     */


    var displayNextMonth = function displayNextMonth(_buttonEl) {
      if (_buttonEl.disabled) return;

      var _getDatePickerContext10 = getDatePickerContext(_buttonEl),
          calendarEl = _getDatePickerContext10.calendarEl,
          calendarDate = _getDatePickerContext10.calendarDate,
          minDate = _getDatePickerContext10.minDate,
          maxDate = _getDatePickerContext10.maxDate;

      var date = addMonths(calendarDate, 1);
      date = keepDateBetweenMinAndMax(date, minDate, maxDate);
      var newCalendar = renderCalendar(calendarEl, date);
      var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_MONTH);

      if (nextToFocus.disabled) {
        nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
      }

      nextToFocus.focus();
    };
    /**
     * Navigate forward one year and display the calendar.
     *
     * @param {HTMLButtonElement} _buttonEl An element within the date picker component
     */


    var displayNextYear = function displayNextYear(_buttonEl) {
      if (_buttonEl.disabled) return;

      var _getDatePickerContext11 = getDatePickerContext(_buttonEl),
          calendarEl = _getDatePickerContext11.calendarEl,
          calendarDate = _getDatePickerContext11.calendarDate,
          minDate = _getDatePickerContext11.minDate,
          maxDate = _getDatePickerContext11.maxDate;

      var date = addYears(calendarDate, 1);
      date = keepDateBetweenMinAndMax(date, minDate, maxDate);
      var newCalendar = renderCalendar(calendarEl, date);
      var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR);

      if (nextToFocus.disabled) {
        nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
      }

      nextToFocus.focus();
    };
    /**
     * Hide the calendar of a date picker component.
     *
     * @param {HTMLElement} el An element within the date picker component
     */


    var hideCalendar = function hideCalendar(el) {
      var _getDatePickerContext12 = getDatePickerContext(el),
          datePickerEl = _getDatePickerContext12.datePickerEl,
          calendarEl = _getDatePickerContext12.calendarEl,
          statusEl = _getDatePickerContext12.statusEl;

      datePickerEl.classList.remove(DATE_PICKER_ACTIVE_CLASS);
      calendarEl.hidden = true;
      statusEl.textContent = "";
    };
    /**
     * Select a date within the date picker component.
     *
     * @param {HTMLButtonElement} calendarDateEl A date element within the date picker component
     */


    var selectDate = function selectDate(calendarDateEl) {
      if (calendarDateEl.disabled) return;

      var _getDatePickerContext13 = getDatePickerContext(calendarDateEl),
          datePickerEl = _getDatePickerContext13.datePickerEl,
          externalInputEl = _getDatePickerContext13.externalInputEl;

      setCalendarValue(calendarDateEl, calendarDateEl.dataset.value);
      hideCalendar(datePickerEl);
      externalInputEl.focus();
    };
    /**
     * Toggle the calendar.
     *
     * @param {HTMLButtonElement} el An element within the date picker component
     */


    var toggleCalendar = function toggleCalendar(el) {
      if (el.disabled) return;

      var _getDatePickerContext14 = getDatePickerContext(el),
          calendarEl = _getDatePickerContext14.calendarEl,
          inputDate = _getDatePickerContext14.inputDate,
          minDate = _getDatePickerContext14.minDate,
          maxDate = _getDatePickerContext14.maxDate,
          defaultDate = _getDatePickerContext14.defaultDate;

      if (calendarEl.hidden) {
        var dateToDisplay = keepDateBetweenMinAndMax(inputDate || defaultDate || today(), minDate, maxDate);
        var newCalendar = renderCalendar(calendarEl, dateToDisplay);
        newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
      } else {
        hideCalendar(el);
      }
    };
    /**
     * Update the calendar when visible.
     *
     * @param {HTMLElement} el an element within the date picker
     */


    var updateCalendarIfVisible = function updateCalendarIfVisible(el) {
      var _getDatePickerContext15 = getDatePickerContext(el),
          calendarEl = _getDatePickerContext15.calendarEl,
          inputDate = _getDatePickerContext15.inputDate,
          minDate = _getDatePickerContext15.minDate,
          maxDate = _getDatePickerContext15.maxDate;

      var calendarShown = !calendarEl.hidden;

      if (calendarShown && inputDate) {
        var dateToDisplay = keepDateBetweenMinAndMax(inputDate, minDate, maxDate);
        renderCalendar(calendarEl, dateToDisplay);
      }
    }; // #endregion Calendar - Date Selection View
    // #region Calendar - Month Selection View

    /**
     * Display the month selection screen in the date picker.
     *
     * @param {HTMLButtonElement} el An element within the date picker component
     * @returns {HTMLElement} a reference to the new calendar element
     */


    var displayMonthSelection = function displayMonthSelection(el, monthToDisplay) {
      var _getDatePickerContext16 = getDatePickerContext(el),
          calendarEl = _getDatePickerContext16.calendarEl,
          statusEl = _getDatePickerContext16.statusEl,
          calendarDate = _getDatePickerContext16.calendarDate,
          minDate = _getDatePickerContext16.minDate,
          maxDate = _getDatePickerContext16.maxDate;

      var selectedMonth = calendarDate.getMonth();
      var focusedMonth = monthToDisplay == null ? selectedMonth : monthToDisplay;
      var months = MONTH_LABELS.map(function (month, index) {
        var monthToCheck = setMonth(calendarDate, index);
        var isDisabled = isDatesMonthOutsideMinOrMax(monthToCheck, minDate, maxDate);
        var tabindex = "-1";
        var classes = [CALENDAR_MONTH_CLASS];
        var isSelected = index === selectedMonth;

        if (index === focusedMonth) {
          tabindex = "0";
          classes.push(CALENDAR_MONTH_FOCUSED_CLASS);
        }

        if (isSelected) {
          classes.push(CALENDAR_MONTH_SELECTED_CLASS);
        }

        return "<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(index, "\"\n        data-label=\"").concat(month, "\"\n        aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(month, "</button>");
      });
      var monthsHtml = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_MONTH_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n      <tbody>\n        ").concat(listToGridHtml(months, 3), "\n      </tbody>\n    </table>\n  </div>");
      var newCalendar = calendarEl.cloneNode();
      newCalendar.innerHTML = monthsHtml;
      calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
      statusEl.textContent = "Select a month.";
      return newCalendar;
    };
    /**
     * Select a month in the date picker component.
     *
     * @param {HTMLButtonElement} monthEl An month element within the date picker component
     */


    var selectMonth = function selectMonth(monthEl) {
      if (monthEl.disabled) return;

      var _getDatePickerContext17 = getDatePickerContext(monthEl),
          calendarEl = _getDatePickerContext17.calendarEl,
          calendarDate = _getDatePickerContext17.calendarDate,
          minDate = _getDatePickerContext17.minDate,
          maxDate = _getDatePickerContext17.maxDate;

      var selectedMonth = parseInt(monthEl.dataset.value, 10);
      var date = setMonth(calendarDate, selectedMonth);
      date = keepDateBetweenMinAndMax(date, minDate, maxDate);
      var newCalendar = renderCalendar(calendarEl, date);
      newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
    }; // #endregion Calendar - Month Selection View
    // #region Calendar - Year Selection View

    /**
     * Display the year selection screen in the date picker.
     *
     * @param {HTMLButtonElement} el An element within the date picker component
     * @param {number} yearToDisplay year to display in year selection
     * @returns {HTMLElement} a reference to the new calendar element
     */


    var displayYearSelection = function displayYearSelection(el, yearToDisplay) {
      var _getDatePickerContext18 = getDatePickerContext(el),
          calendarEl = _getDatePickerContext18.calendarEl,
          statusEl = _getDatePickerContext18.statusEl,
          calendarDate = _getDatePickerContext18.calendarDate,
          minDate = _getDatePickerContext18.minDate,
          maxDate = _getDatePickerContext18.maxDate;

      var selectedYear = calendarDate.getFullYear();
      var focusedYear = yearToDisplay == null ? selectedYear : yearToDisplay;
      var yearToChunk = focusedYear;
      yearToChunk -= yearToChunk % YEAR_CHUNK;
      yearToChunk = Math.max(0, yearToChunk);
      var prevYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk - 1), minDate, maxDate);
      var nextYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk + YEAR_CHUNK), minDate, maxDate);
      var years = [];
      var yearIndex = yearToChunk;

      while (years.length < YEAR_CHUNK) {
        var isDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearIndex), minDate, maxDate);
        var tabindex = "-1";
        var classes = [CALENDAR_YEAR_CLASS];
        var isSelected = yearIndex === selectedYear;

        if (yearIndex === focusedYear) {
          tabindex = "0";
          classes.push(CALENDAR_YEAR_FOCUSED_CLASS);
        }

        if (isSelected) {
          classes.push(CALENDAR_YEAR_SELECTED_CLASS);
        }

        years.push("<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(yearIndex, "\"\n        aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(yearIndex, "</button>"));
        yearIndex += 1;
      }

      var yearsHtml = listToGridHtml(years, 3);
      var newCalendar = calendarEl.cloneNode();
      newCalendar.innerHTML = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_YEAR_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <tbody>\n          <tr>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"Navigate back ").concat(YEAR_CHUNK, " years\"\n                ").concat(prevYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n            <td colspan=\"3\">\n              <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n                <tbody>\n                  ").concat(yearsHtml, "\n                </tbody>\n              </table>\n            </td>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"Navigate forward ").concat(YEAR_CHUNK, " years\"\n                ").concat(nextYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>");
      calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
      statusEl.textContent = "Showing years ".concat(yearToChunk, " to ").concat(yearToChunk + YEAR_CHUNK - 1, ". Select a year.");
      return newCalendar;
    };
    /**
     * Navigate back by years and display the year selection screen.
     *
     * @param {HTMLButtonElement} el An element within the date picker component
     */


    var displayPreviousYearChunk = function displayPreviousYearChunk(el) {
      if (el.disabled) return;

      var _getDatePickerContext19 = getDatePickerContext(el),
          calendarEl = _getDatePickerContext19.calendarEl,
          calendarDate = _getDatePickerContext19.calendarDate,
          minDate = _getDatePickerContext19.minDate,
          maxDate = _getDatePickerContext19.maxDate;

      var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
      var selectedYear = parseInt(yearEl.textContent, 10);
      var adjustedYear = selectedYear - YEAR_CHUNK;
      adjustedYear = Math.max(0, adjustedYear);
      var date = setYear(calendarDate, adjustedYear);
      var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
      var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
      var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR_CHUNK);

      if (nextToFocus.disabled) {
        nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
      }

      nextToFocus.focus();
    };
    /**
     * Navigate forward by years and display the year selection screen.
     *
     * @param {HTMLButtonElement} el An element within the date picker component
     */


    var displayNextYearChunk = function displayNextYearChunk(el) {
      if (el.disabled) return;

      var _getDatePickerContext20 = getDatePickerContext(el),
          calendarEl = _getDatePickerContext20.calendarEl,
          calendarDate = _getDatePickerContext20.calendarDate,
          minDate = _getDatePickerContext20.minDate,
          maxDate = _getDatePickerContext20.maxDate;

      var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
      var selectedYear = parseInt(yearEl.textContent, 10);
      var adjustedYear = selectedYear + YEAR_CHUNK;
      adjustedYear = Math.max(0, adjustedYear);
      var date = setYear(calendarDate, adjustedYear);
      var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
      var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
      var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR_CHUNK);

      if (nextToFocus.disabled) {
        nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
      }

      nextToFocus.focus();
    };
    /**
     * Select a year in the date picker component.
     *
     * @param {HTMLButtonElement} yearEl A year element within the date picker component
     */


    var selectYear = function selectYear(yearEl) {
      if (yearEl.disabled) return;

      var _getDatePickerContext21 = getDatePickerContext(yearEl),
          calendarEl = _getDatePickerContext21.calendarEl,
          calendarDate = _getDatePickerContext21.calendarDate,
          minDate = _getDatePickerContext21.minDate,
          maxDate = _getDatePickerContext21.maxDate;

      var selectedYear = parseInt(yearEl.innerHTML, 10);
      var date = setYear(calendarDate, selectedYear);
      date = keepDateBetweenMinAndMax(date, minDate, maxDate);
      var newCalendar = renderCalendar(calendarEl, date);
      newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
    }; // #endregion Calendar - Year Selection View
    // #region Calendar Event Handling

    /**
     * Hide the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */


    var handleEscapeFromCalendar = function handleEscapeFromCalendar(event) {
      var _getDatePickerContext22 = getDatePickerContext(event.target),
          datePickerEl = _getDatePickerContext22.datePickerEl,
          externalInputEl = _getDatePickerContext22.externalInputEl;

      hideCalendar(datePickerEl);
      externalInputEl.focus();
      event.preventDefault();
    }; // #endregion Calendar Event Handling
    // #region Calendar Date Event Handling

    /**
     * Adjust the date and display the calendar if needed.
     *
     * @param {function} adjustDateFn function that returns the adjusted date
     */


    var adjustCalendar = function adjustCalendar(adjustDateFn) {
      return function (event) {
        var _getDatePickerContext23 = getDatePickerContext(event.target),
            calendarEl = _getDatePickerContext23.calendarEl,
            calendarDate = _getDatePickerContext23.calendarDate,
            minDate = _getDatePickerContext23.minDate,
            maxDate = _getDatePickerContext23.maxDate;

        var date = adjustDateFn(calendarDate);
        var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);

        if (!isSameDay(calendarDate, cappedDate)) {
          var newCalendar = renderCalendar(calendarEl, cappedDate);
          newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
        }

        event.preventDefault();
      };
    };
    /**
     * Navigate back one week and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */


    var handleUpFromDate = adjustCalendar(function (date) {
      return subWeeks(date, 1);
    });
    /**
     * Navigate forward one week and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleDownFromDate = adjustCalendar(function (date) {
      return addWeeks(date, 1);
    });
    /**
     * Navigate back one day and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleLeftFromDate = adjustCalendar(function (date) {
      return subDays(date, 1);
    });
    /**
     * Navigate forward one day and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleRightFromDate = adjustCalendar(function (date) {
      return addDays(date, 1);
    });
    /**
     * Navigate to the start of the week and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleHomeFromDate = adjustCalendar(function (date) {
      return startOfWeek(date);
    });
    /**
     * Navigate to the end of the week and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleEndFromDate = adjustCalendar(function (date) {
      return endOfWeek(date);
    });
    /**
     * Navigate forward one month and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handlePageDownFromDate = adjustCalendar(function (date) {
      return addMonths(date, 1);
    });
    /**
     * Navigate back one month and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handlePageUpFromDate = adjustCalendar(function (date) {
      return subMonths(date, 1);
    });
    /**
     * Navigate forward one year and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleShiftPageDownFromDate = adjustCalendar(function (date) {
      return addYears(date, 1);
    });
    /**
     * Navigate back one year and display the calendar.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleShiftPageUpFromDate = adjustCalendar(function (date) {
      return subYears(date, 1);
    });
    /**
     * display the calendar for the mousemove date.
     *
     * @param {MouseEvent} event The mousemove event
     * @param {HTMLButtonElement} dateEl A date element within the date picker component
     */

    var handleMousemoveFromDate = function handleMousemoveFromDate(dateEl) {
      if (dateEl.disabled) return;
      var calendarEl = dateEl.closest(DATE_PICKER_CALENDAR);
      var currentCalendarDate = calendarEl.dataset.value;
      var hoverDate = dateEl.dataset.value;
      if (hoverDate === currentCalendarDate) return;
      var dateToDisplay = parseDateString(hoverDate);
      var newCalendar = renderCalendar(calendarEl, dateToDisplay);
      newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
    }; // #endregion Calendar Date Event Handling
    // #region Calendar Month Event Handling

    /**
     * Adjust the month and display the month selection screen if needed.
     *
     * @param {function} adjustMonthFn function that returns the adjusted month
     */


    var adjustMonthSelectionScreen = function adjustMonthSelectionScreen(adjustMonthFn) {
      return function (event) {
        var monthEl = event.target;
        var selectedMonth = parseInt(monthEl.dataset.value, 10);

        var _getDatePickerContext24 = getDatePickerContext(monthEl),
            calendarEl = _getDatePickerContext24.calendarEl,
            calendarDate = _getDatePickerContext24.calendarDate,
            minDate = _getDatePickerContext24.minDate,
            maxDate = _getDatePickerContext24.maxDate;

        var currentDate = setMonth(calendarDate, selectedMonth);
        var adjustedMonth = adjustMonthFn(selectedMonth);
        adjustedMonth = Math.max(0, Math.min(11, adjustedMonth));
        var date = setMonth(calendarDate, adjustedMonth);
        var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);

        if (!isSameMonth(currentDate, cappedDate)) {
          var newCalendar = displayMonthSelection(calendarEl, cappedDate.getMonth());
          newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
        }

        event.preventDefault();
      };
    };
    /**
     * Navigate back three months and display the month selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */


    var handleUpFromMonth = adjustMonthSelectionScreen(function (month) {
      return month - 3;
    });
    /**
     * Navigate forward three months and display the month selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleDownFromMonth = adjustMonthSelectionScreen(function (month) {
      return month + 3;
    });
    /**
     * Navigate back one month and display the month selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleLeftFromMonth = adjustMonthSelectionScreen(function (month) {
      return month - 1;
    });
    /**
     * Navigate forward one month and display the month selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleRightFromMonth = adjustMonthSelectionScreen(function (month) {
      return month + 1;
    });
    /**
     * Navigate to the start of the row of months and display the month selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleHomeFromMonth = adjustMonthSelectionScreen(function (month) {
      return month - month % 3;
    });
    /**
     * Navigate to the end of the row of months and display the month selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleEndFromMonth = adjustMonthSelectionScreen(function (month) {
      return month + 2 - month % 3;
    });
    /**
     * Navigate to the last month (December) and display the month selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handlePageDownFromMonth = adjustMonthSelectionScreen(function () {
      return 11;
    });
    /**
     * Navigate to the first month (January) and display the month selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handlePageUpFromMonth = adjustMonthSelectionScreen(function () {
      return 0;
    });
    /**
     * update the focus on a month when the mouse moves.
     *
     * @param {MouseEvent} event The mousemove event
     * @param {HTMLButtonElement} monthEl A month element within the date picker component
     */

    var handleMousemoveFromMonth = function handleMousemoveFromMonth(monthEl) {
      if (monthEl.disabled) return;
      if (monthEl.classList.contains(CALENDAR_MONTH_FOCUSED_CLASS)) return;
      var focusMonth = parseInt(monthEl.dataset.value, 10);
      var newCalendar = displayMonthSelection(monthEl, focusMonth);
      newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
    }; // #endregion Calendar Month Event Handling
    // #region Calendar Year Event Handling

    /**
     * Adjust the year and display the year selection screen if needed.
     *
     * @param {function} adjustYearFn function that returns the adjusted year
     */


    var adjustYearSelectionScreen = function adjustYearSelectionScreen(adjustYearFn) {
      return function (event) {
        var yearEl = event.target;
        var selectedYear = parseInt(yearEl.dataset.value, 10);

        var _getDatePickerContext25 = getDatePickerContext(yearEl),
            calendarEl = _getDatePickerContext25.calendarEl,
            calendarDate = _getDatePickerContext25.calendarDate,
            minDate = _getDatePickerContext25.minDate,
            maxDate = _getDatePickerContext25.maxDate;

        var currentDate = setYear(calendarDate, selectedYear);
        var adjustedYear = adjustYearFn(selectedYear);
        adjustedYear = Math.max(0, adjustedYear);
        var date = setYear(calendarDate, adjustedYear);
        var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);

        if (!isSameYear(currentDate, cappedDate)) {
          var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
          newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
        }

        event.preventDefault();
      };
    };
    /**
     * Navigate back three years and display the year selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */


    var handleUpFromYear = adjustYearSelectionScreen(function (year) {
      return year - 3;
    });
    /**
     * Navigate forward three years and display the year selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleDownFromYear = adjustYearSelectionScreen(function (year) {
      return year + 3;
    });
    /**
     * Navigate back one year and display the year selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleLeftFromYear = adjustYearSelectionScreen(function (year) {
      return year - 1;
    });
    /**
     * Navigate forward one year and display the year selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleRightFromYear = adjustYearSelectionScreen(function (year) {
      return year + 1;
    });
    /**
     * Navigate to the start of the row of years and display the year selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleHomeFromYear = adjustYearSelectionScreen(function (year) {
      return year - year % 3;
    });
    /**
     * Navigate to the end of the row of years and display the year selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handleEndFromYear = adjustYearSelectionScreen(function (year) {
      return year + 2 - year % 3;
    });
    /**
     * Navigate to back 12 years and display the year selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handlePageUpFromYear = adjustYearSelectionScreen(function (year) {
      return year - YEAR_CHUNK;
    });
    /**
     * Navigate forward 12 years and display the year selection screen.
     *
     * @param {KeyboardEvent} event the keydown event
     */

    var handlePageDownFromYear = adjustYearSelectionScreen(function (year) {
      return year + YEAR_CHUNK;
    });
    /**
     * update the focus on a year when the mouse moves.
     *
     * @param {MouseEvent} event The mousemove event
     * @param {HTMLButtonElement} dateEl A year element within the date picker component
     */

    var handleMousemoveFromYear = function handleMousemoveFromYear(yearEl) {
      if (yearEl.disabled) return;
      if (yearEl.classList.contains(CALENDAR_YEAR_FOCUSED_CLASS)) return;
      var focusYear = parseInt(yearEl.dataset.value, 10);
      var newCalendar = displayYearSelection(yearEl, focusYear);
      newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
    }; // #endregion Calendar Year Event Handling
    // #region Focus Handling Event Handling


    var tabHandler = function tabHandler(focusable) {
      var getFocusableContext = function getFocusableContext(el) {
        var _getDatePickerContext26 = getDatePickerContext(el),
            calendarEl = _getDatePickerContext26.calendarEl;

        var focusableElements = select(focusable, calendarEl);
        var firstTabIndex = 0;
        var lastTabIndex = focusableElements.length - 1;
        var firstTabStop = focusableElements[firstTabIndex];
        var lastTabStop = focusableElements[lastTabIndex];
        var focusIndex = focusableElements.indexOf(activeElement());
        var isLastTab = focusIndex === lastTabIndex;
        var isFirstTab = focusIndex === firstTabIndex;
        var isNotFound = focusIndex === -1;
        return {
          focusableElements: focusableElements,
          isNotFound: isNotFound,
          firstTabStop: firstTabStop,
          isFirstTab: isFirstTab,
          lastTabStop: lastTabStop,
          isLastTab: isLastTab
        };
      };

      return {
        tabAhead: function tabAhead(event) {
          var _getFocusableContext = getFocusableContext(event.target),
              firstTabStop = _getFocusableContext.firstTabStop,
              isLastTab = _getFocusableContext.isLastTab,
              isNotFound = _getFocusableContext.isNotFound;

          if (isLastTab || isNotFound) {
            event.preventDefault();
            firstTabStop.focus();
          }
        },
        tabBack: function tabBack(event) {
          var _getFocusableContext2 = getFocusableContext(event.target),
              lastTabStop = _getFocusableContext2.lastTabStop,
              isFirstTab = _getFocusableContext2.isFirstTab,
              isNotFound = _getFocusableContext2.isNotFound;

          if (isFirstTab || isNotFound) {
            event.preventDefault();
            lastTabStop.focus();
          }
        }
      };
    };

    var datePickerTabEventHandler = tabHandler(DATE_PICKER_FOCUSABLE);
    var monthPickerTabEventHandler = tabHandler(MONTH_PICKER_FOCUSABLE);
    var yearPickerTabEventHandler = tabHandler(YEAR_PICKER_FOCUSABLE); // #endregion Focus Handling Event Handling
    // #region Date Picker Event Delegation Registration / Component

    var datePickerEvents = (_datePickerEvents = {}, _defineProperty(_datePickerEvents, CLICK, (_CLICK = {}, _defineProperty(_CLICK, DATE_PICKER_BUTTON, function () {
      toggleCalendar(this);
    }), _defineProperty(_CLICK, CALENDAR_DATE, function () {
      selectDate(this);
    }), _defineProperty(_CLICK, CALENDAR_MONTH, function () {
      selectMonth(this);
    }), _defineProperty(_CLICK, CALENDAR_YEAR, function () {
      selectYear(this);
    }), _defineProperty(_CLICK, CALENDAR_PREVIOUS_MONTH, function () {
      displayPreviousMonth(this);
    }), _defineProperty(_CLICK, CALENDAR_NEXT_MONTH, function () {
      displayNextMonth(this);
    }), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR, function () {
      displayPreviousYear(this);
    }), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR, function () {
      displayNextYear(this);
    }), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR_CHUNK, function () {
      displayPreviousYearChunk(this);
    }), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR_CHUNK, function () {
      displayNextYearChunk(this);
    }), _defineProperty(_CLICK, CALENDAR_MONTH_SELECTION, function () {
      var newCalendar = displayMonthSelection(this);
      newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
    }), _defineProperty(_CLICK, CALENDAR_YEAR_SELECTION, function () {
      var newCalendar = displayYearSelection(this);
      newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
    }), _CLICK)), _defineProperty(_datePickerEvents, "keyup", _defineProperty({}, DATE_PICKER_CALENDAR, function (event) {
      var keydown = this.dataset.keydownKeyCode;

      if ("".concat(event.keyCode) !== keydown) {
        event.preventDefault();
      }
    })), _defineProperty(_datePickerEvents, "keydown", (_keydown = {}, _defineProperty(_keydown, DATE_PICKER_EXTERNAL_INPUT, function (event) {
      if (event.keyCode === ENTER_KEYCODE) {
        validateDateInput(this);
      }
    }), _defineProperty(_keydown, CALENDAR_DATE, keymap({
      Up: handleUpFromDate,
      ArrowUp: handleUpFromDate,
      Down: handleDownFromDate,
      ArrowDown: handleDownFromDate,
      Left: handleLeftFromDate,
      ArrowLeft: handleLeftFromDate,
      Right: handleRightFromDate,
      ArrowRight: handleRightFromDate,
      Home: handleHomeFromDate,
      End: handleEndFromDate,
      PageDown: handlePageDownFromDate,
      PageUp: handlePageUpFromDate,
      "Shift+PageDown": handleShiftPageDownFromDate,
      "Shift+PageUp": handleShiftPageUpFromDate
    })), _defineProperty(_keydown, CALENDAR_DATE_PICKER, keymap({
      Tab: datePickerTabEventHandler.tabAhead,
      "Shift+Tab": datePickerTabEventHandler.tabBack
    })), _defineProperty(_keydown, CALENDAR_MONTH, keymap({
      Up: handleUpFromMonth,
      ArrowUp: handleUpFromMonth,
      Down: handleDownFromMonth,
      ArrowDown: handleDownFromMonth,
      Left: handleLeftFromMonth,
      ArrowLeft: handleLeftFromMonth,
      Right: handleRightFromMonth,
      ArrowRight: handleRightFromMonth,
      Home: handleHomeFromMonth,
      End: handleEndFromMonth,
      PageDown: handlePageDownFromMonth,
      PageUp: handlePageUpFromMonth
    })), _defineProperty(_keydown, CALENDAR_MONTH_PICKER, keymap({
      Tab: monthPickerTabEventHandler.tabAhead,
      "Shift+Tab": monthPickerTabEventHandler.tabBack
    })), _defineProperty(_keydown, CALENDAR_YEAR, keymap({
      Up: handleUpFromYear,
      ArrowUp: handleUpFromYear,
      Down: handleDownFromYear,
      ArrowDown: handleDownFromYear,
      Left: handleLeftFromYear,
      ArrowLeft: handleLeftFromYear,
      Right: handleRightFromYear,
      ArrowRight: handleRightFromYear,
      Home: handleHomeFromYear,
      End: handleEndFromYear,
      PageDown: handlePageDownFromYear,
      PageUp: handlePageUpFromYear
    })), _defineProperty(_keydown, CALENDAR_YEAR_PICKER, keymap({
      Tab: yearPickerTabEventHandler.tabAhead,
      "Shift+Tab": yearPickerTabEventHandler.tabBack
    })), _defineProperty(_keydown, DATE_PICKER_CALENDAR, function (event) {
      this.dataset.keydownKeyCode = event.keyCode;
    }), _defineProperty(_keydown, DATE_PICKER, function (event) {
      var keyMap = keymap({
        Escape: handleEscapeFromCalendar
      });
      keyMap(event);
    }), _keydown)), _defineProperty(_datePickerEvents, "focusout", (_focusout = {}, _defineProperty(_focusout, DATE_PICKER_EXTERNAL_INPUT, function () {
      validateDateInput(this);
    }), _defineProperty(_focusout, DATE_PICKER, function (event) {
      if (!this.contains(event.relatedTarget)) {
        hideCalendar(this);
      }
    }), _focusout)), _defineProperty(_datePickerEvents, "input", _defineProperty({}, DATE_PICKER_EXTERNAL_INPUT, function () {
      reconcileInputValues(this);
      updateCalendarIfVisible(this);
    })), _datePickerEvents);

    if (!isIosDevice()) {
      var _datePickerEvents$mou;

      datePickerEvents.mousemove = (_datePickerEvents$mou = {}, _defineProperty(_datePickerEvents$mou, CALENDAR_DATE_CURRENT_MONTH, function () {
        handleMousemoveFromDate(this);
      }), _defineProperty(_datePickerEvents$mou, CALENDAR_MONTH, function () {
        handleMousemoveFromMonth(this);
      }), _defineProperty(_datePickerEvents$mou, CALENDAR_YEAR, function () {
        handleMousemoveFromYear(this);
      }), _datePickerEvents$mou);
    }

    var datePicker = behavior(datePickerEvents, {
      init: function init(root) {
        select(DATE_PICKER, root).forEach(function (datePickerEl) {
          enhanceDatePicker(datePickerEl);
        });
      },
      getDatePickerContext: getDatePickerContext,
      disable: disable,
      enable: enable,
      isDateInputInvalid: isDateInputInvalid,
      setCalendarValue: setCalendarValue,
      validateDateInput: validateDateInput,
      renderCalendar: renderCalendar,
      updateCalendarIfVisible: updateCalendarIfVisible
    }); // #endregion Date Picker Event Delegation Registration / Component

    module.exports = datePicker;
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/active-element": 44,
    "../utils/behavior": 45,
    "../utils/is-ios-device": 48,
    "../utils/select": 50,
    "receptor/keymap": 14
  }],
  22: [function (require, module, exports) {
    "use strict";

    var _inputChange;

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    var behavior = require("../utils/behavior");

    var select = require("../utils/select");

    var _require = require("../config"),
        PREFIX = _require.prefix;

    var _require2 = require("./date-picker"),
        getDatePickerContext = _require2.getDatePickerContext,
        isDateInputInvalid = _require2.isDateInputInvalid,
        updateCalendarIfVisible = _require2.updateCalendarIfVisible;

    var DATE_PICKER_CLASS = "".concat(PREFIX, "-date-picker");
    var DATE_RANGE_PICKER_CLASS = "".concat(PREFIX, "-date-range-picker");
    var DATE_RANGE_PICKER_RANGE_START_CLASS = "".concat(DATE_RANGE_PICKER_CLASS, "__range-start");
    var DATE_RANGE_PICKER_RANGE_END_CLASS = "".concat(DATE_RANGE_PICKER_CLASS, "__range-end");
    var DATE_PICKER = ".".concat(DATE_PICKER_CLASS);
    var DATE_RANGE_PICKER = ".".concat(DATE_RANGE_PICKER_CLASS);
    var DATE_RANGE_PICKER_RANGE_START = ".".concat(DATE_RANGE_PICKER_RANGE_START_CLASS);
    var DATE_RANGE_PICKER_RANGE_END = ".".concat(DATE_RANGE_PICKER_RANGE_END_CLASS);
    var DEFAULT_MIN_DATE = "0000-01-01";
    /**
     * The properties and elements within the date range picker.
     * @typedef {Object} DateRangePickerContext
     * @property {HTMLElement} dateRangePickerEl
     * @property {HTMLElement} rangeStartEl
     * @property {HTMLElement} rangeEndEl
     */

    /**
     * Get an object of the properties and elements belonging directly to the given
     * date picker component.
     *
     * @param {HTMLElement} el the element within the date picker
     * @returns {DateRangePickerContext} elements
     */

    var getDateRangePickerContext = function getDateRangePickerContext(el) {
      var dateRangePickerEl = el.closest(DATE_RANGE_PICKER);

      if (!dateRangePickerEl) {
        throw new Error("Element is missing outer ".concat(DATE_RANGE_PICKER));
      }

      var rangeStartEl = dateRangePickerEl.querySelector(DATE_RANGE_PICKER_RANGE_START);
      var rangeEndEl = dateRangePickerEl.querySelector(DATE_RANGE_PICKER_RANGE_END);
      return {
        dateRangePickerEl: dateRangePickerEl,
        rangeStartEl: rangeStartEl,
        rangeEndEl: rangeEndEl
      };
    };
    /**
     * handle update from range start date picker
     *
     * @param {HTMLElement} el an element within the date range picker
     */


    var handleRangeStartUpdate = function handleRangeStartUpdate(el) {
      var _getDateRangePickerCo = getDateRangePickerContext(el),
          dateRangePickerEl = _getDateRangePickerCo.dateRangePickerEl,
          rangeStartEl = _getDateRangePickerCo.rangeStartEl,
          rangeEndEl = _getDateRangePickerCo.rangeEndEl;

      var _getDatePickerContext = getDatePickerContext(rangeStartEl),
          internalInputEl = _getDatePickerContext.internalInputEl;

      var updatedDate = internalInputEl.value;

      if (updatedDate && !isDateInputInvalid(internalInputEl)) {
        rangeEndEl.dataset.minDate = updatedDate;
        rangeEndEl.dataset.rangeDate = updatedDate;
        rangeEndEl.dataset.defaultDate = updatedDate;
      } else {
        rangeEndEl.dataset.minDate = dateRangePickerEl.dataset.minDate || "";
        rangeEndEl.dataset.rangeDate = "";
        rangeEndEl.dataset.defaultDate = "";
      }

      updateCalendarIfVisible(rangeEndEl);
    };
    /**
     * handle update from range start date picker
     *
     * @param {HTMLElement} el an element within the date range picker
     */


    var handleRangeEndUpdate = function handleRangeEndUpdate(el) {
      var _getDateRangePickerCo2 = getDateRangePickerContext(el),
          dateRangePickerEl = _getDateRangePickerCo2.dateRangePickerEl,
          rangeStartEl = _getDateRangePickerCo2.rangeStartEl,
          rangeEndEl = _getDateRangePickerCo2.rangeEndEl;

      var _getDatePickerContext2 = getDatePickerContext(rangeEndEl),
          internalInputEl = _getDatePickerContext2.internalInputEl;

      var updatedDate = internalInputEl.value;

      if (updatedDate && !isDateInputInvalid(internalInputEl)) {
        rangeStartEl.dataset.maxDate = updatedDate;
        rangeStartEl.dataset.rangeDate = updatedDate;
        rangeStartEl.dataset.defaultDate = updatedDate;
      } else {
        rangeStartEl.dataset.maxDate = dateRangePickerEl.dataset.maxDate || "";
        rangeStartEl.dataset.rangeDate = "";
        rangeStartEl.dataset.defaultDate = "";
      }

      updateCalendarIfVisible(rangeStartEl);
    };
    /**
     * Enhance an input with the date picker elements
     *
     * @param {HTMLElement} el The initial wrapping element of the date range picker component
     */


    var enhanceDateRangePicker = function enhanceDateRangePicker(el) {
      var dateRangePickerEl = el.closest(DATE_RANGE_PICKER);

      var _select = select(DATE_PICKER, dateRangePickerEl),
          _select2 = _slicedToArray(_select, 2),
          rangeStart = _select2[0],
          rangeEnd = _select2[1];

      if (!rangeStart) {
        throw new Error("".concat(DATE_RANGE_PICKER, " is missing inner two '").concat(DATE_PICKER, "' elements"));
      }

      if (!rangeEnd) {
        throw new Error("".concat(DATE_RANGE_PICKER, " is missing second '").concat(DATE_PICKER, "' element"));
      }

      rangeStart.classList.add(DATE_RANGE_PICKER_RANGE_START_CLASS);
      rangeEnd.classList.add(DATE_RANGE_PICKER_RANGE_END_CLASS);

      if (!dateRangePickerEl.dataset.minDate) {
        dateRangePickerEl.dataset.minDate = DEFAULT_MIN_DATE;
      }

      var minDate = dateRangePickerEl.dataset.minDate;
      rangeStart.dataset.minDate = minDate;
      rangeEnd.dataset.minDate = minDate;
      var maxDate = dateRangePickerEl.dataset.maxDate;

      if (maxDate) {
        rangeStart.dataset.maxDate = maxDate;
        rangeEnd.dataset.maxDate = maxDate;
      }

      handleRangeStartUpdate(dateRangePickerEl);
      handleRangeEndUpdate(dateRangePickerEl);
    };

    var dateRangePicker = behavior({
      "input change": (_inputChange = {}, _defineProperty(_inputChange, DATE_RANGE_PICKER_RANGE_START, function () {
        handleRangeStartUpdate(this);
      }), _defineProperty(_inputChange, DATE_RANGE_PICKER_RANGE_END, function () {
        handleRangeEndUpdate(this);
      }), _inputChange)
    }, {
      init: function init(root) {
        select(DATE_RANGE_PICKER, root).forEach(function (dateRangePickerEl) {
          enhanceDateRangePicker(dateRangePickerEl);
        });
      }
    });
    module.exports = dateRangePicker;
  }, {
    "../config": 36,
    "../utils/behavior": 45,
    "../utils/select": 50,
    "./date-picker": 21
  }],
  23: [function (require, module, exports) {
    "use strict";

    var select = require("../utils/select");

    var behavior = require("../utils/behavior");

    var _require = require("../config"),
        PREFIX = _require.prefix;

    var DROPZONE_CLASS = "".concat(PREFIX, "-file-input");
    var DROPZONE = ".".concat(DROPZONE_CLASS);
    var INPUT_CLASS = "".concat(PREFIX, "-file-input__input");
    var TARGET_CLASS = "".concat(PREFIX, "-file-input__target");
    var INPUT = ".".concat(INPUT_CLASS);
    var BOX_CLASS = "".concat(PREFIX, "-file-input__box");
    var INSTRUCTIONS_CLASS = "".concat(PREFIX, "-file-input__instructions");
    var PREVIEW_CLASS = "".concat(PREFIX, "-file-input__preview");
    var PREVIEW_HEADING_CLASS = "".concat(PREFIX, "-file-input__preview-heading");
    var DISABLED_CLASS = "".concat(PREFIX, "-file-input--disabled");
    var CHOOSE_CLASS = "".concat(PREFIX, "-file-input__choose");
    var ACCEPTED_FILE_MESSAGE_CLASS = "".concat(PREFIX, "-file-input__accepted-files-message");
    var DRAG_TEXT_CLASS = "".concat(PREFIX, "-file-input__drag-text");
    var DRAG_CLASS = "".concat(PREFIX, "-file-input--drag");
    var LOADING_CLASS = "is-loading";
    var HIDDEN_CLASS = "display-none";
    var INVALID_FILE_CLASS = "has-invalid-file";
    var GENERIC_PREVIEW_CLASS_NAME = "".concat(PREFIX, "-file-input__preview-image");
    var GENERIC_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--generic");
    var PDF_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--pdf");
    var WORD_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--word");
    var VIDEO_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--video");
    var EXCEL_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--excel");
    var SPACER_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    /**
     * The properties and elements within the file input.
     * @typedef {Object} FileInputContext
     * @property {HTMLDivElement} dropZoneEl
     * @property {HTMLInputElement} inputEl
     */

    /**
     * Get an object of the properties and elements belonging directly to the given
     * file input component.
     *
     * @param {HTMLElement} el the element within the file input
     * @returns {FileInputContext} elements
     */

    var getFileInputContext = function getFileInputContext(el) {
      var dropZoneEl = el.closest(DROPZONE);

      if (!dropZoneEl) {
        throw new Error("Element is missing outer ".concat(DROPZONE));
      }

      var inputEl = dropZoneEl.querySelector(INPUT);
      return {
        dropZoneEl: dropZoneEl,
        inputEl: inputEl
      };
    };
    /**
     * Disable the file input component
     *
     * @param {HTMLElement} el An element within the file input component
     */


    var disable = function disable(el) {
      var _getFileInputContext = getFileInputContext(el),
          dropZoneEl = _getFileInputContext.dropZoneEl,
          inputEl = _getFileInputContext.inputEl;

      inputEl.disabled = true;
      dropZoneEl.classList.add(DISABLED_CLASS);
      dropZoneEl.setAttribute("aria-disabled", "true");
    };
    /**
     * Enable the file input component
     *
     * @param {HTMLElement} el An element within the file input component
     */


    var enable = function enable(el) {
      var _getFileInputContext2 = getFileInputContext(el),
          dropZoneEl = _getFileInputContext2.dropZoneEl,
          inputEl = _getFileInputContext2.inputEl;

      inputEl.disabled = false;
      dropZoneEl.classList.remove(DISABLED_CLASS);
      dropZoneEl.removeAttribute("aria-disabled");
    };
    /**
     * Creates an ID name for each file that strips all invalid characters.
     * @param {string} name - name of the file added to file input
     * @returns {string} same characters as the name with invalid chars removed
     */


    var makeSafeForID = function makeSafeForID(name) {
      return name.replace(/[^a-z0-9]/g, function replaceName(s) {
        var c = s.charCodeAt(0);
        if (c === 32) return "-";
        if (c >= 65 && c <= 90) return "img_".concat(s.toLowerCase());
        return "__".concat(("000", c.toString(16)).slice(-4));
      });
    };
    /**
     * Builds full file input comonent
     * @param {HTMLElement} fileInputEl - original file input on page
     * @returns {HTMLElement|HTMLElement} - Instructions, target area div
     */


    var buildFileInput = function buildFileInput(fileInputEl) {
      var acceptsMultiple = fileInputEl.hasAttribute("multiple");
      var fileInputParent = document.createElement("div");
      var dropTarget = document.createElement("div");
      var box = document.createElement("div");
      var instructions = document.createElement("div");
      var disabled = fileInputEl.hasAttribute("disabled"); // Adds class names and other attributes

      fileInputEl.classList.remove(DROPZONE_CLASS);
      fileInputEl.classList.add(INPUT_CLASS);
      fileInputParent.classList.add(DROPZONE_CLASS);
      box.classList.add(BOX_CLASS);
      instructions.classList.add(INSTRUCTIONS_CLASS);
      instructions.setAttribute("aria-hidden", "true");
      dropTarget.classList.add(TARGET_CLASS); // Adds child elements to the DOM

      fileInputEl.parentNode.insertBefore(dropTarget, fileInputEl);
      fileInputEl.parentNode.insertBefore(fileInputParent, dropTarget);
      dropTarget.appendChild(fileInputEl);
      fileInputParent.appendChild(dropTarget);
      fileInputEl.parentNode.insertBefore(instructions, fileInputEl);
      fileInputEl.parentNode.insertBefore(box, fileInputEl); // Disabled styling

      if (disabled) {
        disable(fileInputEl);
      } // Sets instruction test based on whether or not multiple files are accepted


      if (acceptsMultiple) {
        instructions.innerHTML = "<span class=\"".concat(DRAG_TEXT_CLASS, "\">Drag files here or </span><span class=\"").concat(CHOOSE_CLASS, "\">choose from folder</span>");
      } else {
        instructions.innerHTML = "<span class=\"".concat(DRAG_TEXT_CLASS, "\">Drag file here or </span><span class=\"").concat(CHOOSE_CLASS, "\">choose from folder</span>");
      } // IE11 and Edge do not support drop files on file inputs, so we've removed text that indicates that


      if (/rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) {
        fileInputParent.querySelector(".".concat(DRAG_TEXT_CLASS)).outerHTML = "";
      }

      return {
        instructions: instructions,
        dropTarget: dropTarget
      };
    };
    /**
     * Removes image previews, we want to start with a clean list every time files are added to the file input
     * @param {HTMLElement} dropTarget - target area div that encases the input
     * @param {HTMLElement} instructions - text to inform users to drag or select files
     */


    var removeOldPreviews = function removeOldPreviews(dropTarget, instructions) {
      var filePreviews = dropTarget.querySelectorAll(".".concat(PREVIEW_CLASS));
      var currentPreviewHeading = dropTarget.querySelector(".".concat(PREVIEW_HEADING_CLASS));
      var currentErrorMessage = dropTarget.querySelector(".".concat(ACCEPTED_FILE_MESSAGE_CLASS)); // Remove the heading above the previews

      if (currentPreviewHeading) {
        currentPreviewHeading.outerHTML = "";
      } // Remove existing error messages


      if (currentErrorMessage) {
        currentErrorMessage.outerHTML = "";
        dropTarget.classList.remove(INVALID_FILE_CLASS);
      } // Get rid of existing previews if they exist, show instructions


      if (filePreviews !== null) {
        if (instructions) {
          instructions.classList.remove(HIDDEN_CLASS);
        }

        Array.prototype.forEach.call(filePreviews, function removeImages(node) {
          node.parentNode.removeChild(node);
        });
      }
    };
    /**
     * When using an Accept attribute, invalid files will be hidden from
     * file browser, but they can still be dragged to the input. This
     * function prevents them from being dragged and removes error states
     * when correct files are added.
     * @param {event} e
     * @param {HTMLElement} fileInputEl - file input element
     * @param {HTMLElement} instructions - text to inform users to drag or select files
     * @param {HTMLElement} dropTarget - target area div that encases the input
     */


    var preventInvalidFiles = function preventInvalidFiles(e, fileInputEl, instructions, dropTarget) {
      var acceptedFilesAttr = fileInputEl.getAttribute("accept");
      dropTarget.classList.remove(INVALID_FILE_CLASS); // Runs if only specific files are accepted

      if (acceptedFilesAttr) {
        var acceptedFiles = acceptedFilesAttr.split(",");
        var errorMessage = document.createElement("div"); // If multiple files are dragged, this iterates through them and look for any files that are not accepted.

        var allFilesAllowed = true;

        for (var i = 0; i < e.dataTransfer.files.length; i += 1) {
          var file = e.dataTransfer.files[i];

          if (allFilesAllowed) {
            for (var j = 0; j < acceptedFiles.length; j += 1) {
              var fileType = acceptedFiles[j];
              allFilesAllowed = file.name.indexOf(fileType) > 0 || file.type.includes(fileType.replace(/\*/g, ""));
              if (allFilesAllowed) break;
            }
          } else break;
        } // If dragged files are not accepted, this removes them from the value of the input and creates and error state


        if (!allFilesAllowed) {
          removeOldPreviews(dropTarget, instructions);
          fileInputEl.value = ""; // eslint-disable-line no-param-reassign

          dropTarget.insertBefore(errorMessage, fileInputEl);
          errorMessage.innerHTML = "This is not a valid file type.";
          errorMessage.classList.add(ACCEPTED_FILE_MESSAGE_CLASS);
          dropTarget.classList.add(INVALID_FILE_CLASS);
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
    /**
     * When new files are applied to file input, this function generates previews
     * and removes old ones.
     * @param {event} e
     * @param {HTMLElement} fileInputEl - file input element
     * @param {HTMLElement} instructions - text to inform users to drag or select files
     * @param {HTMLElement} dropTarget - target area div that encases the input
     */


    var handleChange = function handleChange(e, fileInputEl, instructions, dropTarget) {
      var fileNames = e.target.files;
      var filePreviewsHeading = document.createElement("div"); // First, get rid of existing previews

      removeOldPreviews(dropTarget, instructions); // Iterates through files list and creates previews

      var _loop = function _loop(i) {
        var reader = new FileReader();
        var fileName = fileNames[i].name; // Starts with a loading image while preview is created

        reader.onloadstart = function createLoadingImage() {
          var imageId = makeSafeForID(fileName);
          var previewImage = "<img id=\"".concat(imageId, "\" src=\"").concat(SPACER_GIF, "\" alt=\"\" class=\"").concat(GENERIC_PREVIEW_CLASS_NAME, " ").concat(LOADING_CLASS, "\"/>");
          instructions.insertAdjacentHTML("afterend", "<div class=\"".concat(PREVIEW_CLASS, "\" aria-hidden=\"true\">").concat(previewImage).concat(fileName, "<div>"));
        }; // Not all files will be able to generate previews. In case this happens, we provide several types "generic previews" based on the file extension.


        reader.onloadend = function createFilePreview() {
          var imageId = makeSafeForID(fileName);
          var previewImage = document.getElementById(imageId);

          if (fileName.indexOf(".pdf") > 0) {
            previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(PDF_PREVIEW_CLASS, "\")"));
          } else if (fileName.indexOf(".doc") > 0 || fileName.indexOf(".pages") > 0) {
            previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(WORD_PREVIEW_CLASS, "\")"));
          } else if (fileName.indexOf(".xls") > 0 || fileName.indexOf(".numbers") > 0) {
            previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(EXCEL_PREVIEW_CLASS, "\")"));
          } else if (fileName.indexOf(".mov") > 0 || fileName.indexOf(".mp4") > 0) {
            previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(VIDEO_PREVIEW_CLASS, "\")"));
          } else {
            previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(GENERIC_PREVIEW_CLASS, "\")"));
          } // Removes loader and displays preview


          previewImage.classList.remove(LOADING_CLASS);
          previewImage.src = reader.result;
        };

        if (fileNames[i]) {
          reader.readAsDataURL(fileNames[i]);
        } // Adds heading above file previews, pluralizes if there are multiple


        if (i === 0) {
          dropTarget.insertBefore(filePreviewsHeading, instructions);
          filePreviewsHeading.innerHTML = "Selected file <span class=\"usa-file-input__choose\">Change file</span>";
        } else if (i >= 1) {
          dropTarget.insertBefore(filePreviewsHeading, instructions);
          filePreviewsHeading.innerHTML = "".concat(i + 1, " files selected <span class=\"usa-file-input__choose\">Change files</span>");
        } // Hides null state content and sets preview heading class


        if (filePreviewsHeading) {
          instructions.classList.add(HIDDEN_CLASS);
          filePreviewsHeading.classList.add(PREVIEW_HEADING_CLASS);
        }
      };

      for (var i = 0; i < fileNames.length; i += 1) {
        _loop(i);
      }
    };

    var fileInput = behavior({}, {
      init: function init(root) {
        select(DROPZONE, root).forEach(function (fileInputEl) {
          var _buildFileInput = buildFileInput(fileInputEl),
              instructions = _buildFileInput.instructions,
              dropTarget = _buildFileInput.dropTarget;

          dropTarget.addEventListener("dragover", function handleDragOver() {
            this.classList.add(DRAG_CLASS);
          }, false);
          dropTarget.addEventListener("dragleave", function handleDragLeave() {
            this.classList.remove(DRAG_CLASS);
          }, false);
          dropTarget.addEventListener("drop", function handleDrop(e) {
            preventInvalidFiles(e, fileInputEl, instructions, dropTarget);
            this.classList.remove(DRAG_CLASS);
          }, false); // eslint-disable-next-line no-param-reassign

          fileInputEl.onchange = function (e) {
            handleChange(e, fileInputEl, instructions, dropTarget);
          };
        });
      },
      getFileInputContext: getFileInputContext,
      disable: disable,
      enable: enable
    });
    module.exports = fileInput;
  }, {
    "../config": 36,
    "../utils/behavior": 45,
    "../utils/select": 50
  }],
  24: [function (require, module, exports) {
    "use strict";

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var debounce = require("lodash.debounce");

    var behavior = require("../utils/behavior");

    var select = require("../utils/select");

    var _require = require("../events"),
        CLICK = _require.CLICK;

    var _require2 = require("../config"),
        PREFIX = _require2.prefix;

    var HIDDEN = "hidden";
    var SCOPE = ".".concat(PREFIX, "-footer--big");
    var NAV = "".concat(SCOPE, " nav");
    var BUTTON = "".concat(NAV, " .").concat(PREFIX, "-footer__primary-link");
    var COLLAPSIBLE = ".".concat(PREFIX, "-footer__primary-content--collapsible");
    var HIDE_MAX_WIDTH = 480;
    var DEBOUNCE_RATE = 180;

    function showPanel() {
      if (window.innerWidth < HIDE_MAX_WIDTH) {
        var collapseEl = this.closest(COLLAPSIBLE);
        collapseEl.classList.toggle(HIDDEN); // NB: this *should* always succeed because the button
        // selector is scoped to ".{prefix}-footer-big nav"

        var collapsibleEls = select(COLLAPSIBLE, collapseEl.closest(NAV));
        collapsibleEls.forEach(function (el) {
          if (el !== collapseEl) {
            el.classList.add(HIDDEN);
          }
        });
      }
    }

    var lastInnerWidth;
    var resize = debounce(function () {
      if (lastInnerWidth === window.innerWidth) return;
      lastInnerWidth = window.innerWidth;
      var hidden = window.innerWidth < HIDE_MAX_WIDTH;
      select(COLLAPSIBLE).forEach(function (list) {
        return list.classList.toggle(HIDDEN, hidden);
      });
    }, DEBOUNCE_RATE);
    module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, BUTTON, showPanel)), {
      // export for use elsewhere
      HIDE_MAX_WIDTH: HIDE_MAX_WIDTH,
      DEBOUNCE_RATE: DEBOUNCE_RATE,
      init: function init() {
        resize();
        window.addEventListener("resize", resize);
      },
      teardown: function teardown() {
        window.removeEventListener("resize", resize);
      }
    });
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45,
    "../utils/select": 50,
    "lodash.debounce": 6
  }],
  25: [function (require, module, exports) {
    "use strict";

    var accordion = require("./accordion");

    var banner = require("./banner");

    var characterCount = require("./character-count");

    var comboBox = require("./combo-box");

    var fileInput = require("./file-input");

    var footer = require("./footer");

    var inputPrefixSuffix = require("./input-prefix-suffix");

    var modal = require("./modal");

    var navigation = require("./navigation");

    var password = require("./password");

    var search = require("./search");

    var skipnav = require("./skipnav");

    var tooltip = require("./tooltip");

    var validator = require("./validator");

    var datePicker = require("./date-picker");

    var dateRangePicker = require("./date-range-picker");

    var timePicker = require("./time-picker");

    var table = require("./table");

    module.exports = {
      accordion: accordion,
      banner: banner,
      characterCount: characterCount,
      comboBox: comboBox,
      datePicker: datePicker,
      dateRangePicker: dateRangePicker,
      fileInput: fileInput,
      footer: footer,
      inputPrefixSuffix: inputPrefixSuffix,
      modal: modal,
      navigation: navigation,
      password: password,
      search: search,
      skipnav: skipnav,
      table: table,
      timePicker: timePicker,
      tooltip: tooltip,
      validator: validator
    };
  }, {
    "./accordion": 17,
    "./banner": 18,
    "./character-count": 19,
    "./combo-box": 20,
    "./date-picker": 21,
    "./date-range-picker": 22,
    "./file-input": 23,
    "./footer": 24,
    "./input-prefix-suffix": 26,
    "./modal": 27,
    "./navigation": 28,
    "./password": 29,
    "./search": 30,
    "./skipnav": 31,
    "./table": 32,
    "./time-picker": 33,
    "./tooltip": 34,
    "./validator": 35
  }],
  26: [function (require, module, exports) {
    "use strict";

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var behavior = require("../utils/behavior");

    var select = require("../utils/select");

    var _require = require("../config"),
        PREFIX = _require.prefix;

    var _require2 = require("../events"),
        CLICK = _require2.CLICK;

    var CONTAINER = ".".concat(PREFIX, "-input-group");
    var INPUT = "".concat(CONTAINER, " .").concat(PREFIX, "-input");
    var DECORATION = "".concat(CONTAINER, " .").concat(PREFIX, "-input-prefix, ").concat(CONTAINER, " .").concat(PREFIX, "-input-suffix");
    var FOCUS_CLASS = "is-focused";

    function setFocus(el) {
      el.closest(CONTAINER).querySelector(".".concat(PREFIX, "-input")).focus();
    }

    function handleFocus() {
      this.closest(CONTAINER).classList.add(FOCUS_CLASS);
    }

    function handleBlur() {
      this.closest(CONTAINER).classList.remove(FOCUS_CLASS);
    }

    var inputPrefixSuffix = behavior(_defineProperty({}, CLICK, _defineProperty({}, DECORATION, function () {
      setFocus(this);
    })), {
      init: function init(root) {
        select(INPUT, root).forEach(function (inputEl) {
          inputEl.addEventListener("focus", handleFocus, false);
          inputEl.addEventListener("blur", handleBlur, false);
        });
      }
    });
    module.exports = inputPrefixSuffix;
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45,
    "../utils/select": 50
  }],
  27: [function (require, module, exports) {
    "use strict";

    var _CLICK;

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var behavior = require("../utils/behavior");

    var select = require("../utils/select");

    var FocusTrap = require("../utils/focus-trap");

    var ScrollBarWidth = require("../utils/scrollbar-width");

    var _require = require("../events"),
        CLICK = _require.CLICK;

    var _require2 = require("../config"),
        PREFIX = _require2.prefix;

    var MODAL_CLASSNAME = "".concat(PREFIX, "-modal");
    var OVERLAY_CLASSNAME = "".concat(MODAL_CLASSNAME, "-overlay");
    var WRAPPER_CLASSNAME = "".concat(MODAL_CLASSNAME, "-wrapper");
    var OPENER_ATTRIBUTE = "data-open-modal";
    var CLOSER_ATTRIBUTE = "data-close-modal";
    var FORCE_ACTION_ATTRIBUTE = "data-force-action";
    var MODAL = ".".concat(MODAL_CLASSNAME);
    var INITIAL_FOCUS = ".".concat(WRAPPER_CLASSNAME, " *[data-focus]");
    var CLOSE_BUTTON = "".concat(WRAPPER_CLASSNAME, " *[").concat(CLOSER_ATTRIBUTE, "]");
    var OPENERS = "*[".concat(OPENER_ATTRIBUTE, "][aria-controls]");
    var CLOSERS = "".concat(CLOSE_BUTTON, ", .").concat(OVERLAY_CLASSNAME, ":not([").concat(FORCE_ACTION_ATTRIBUTE, "])");
    var ACTIVE_CLASS = "usa-js-modal--active";
    var PREVENT_CLICK_CLASS = "usa-js-no-click";
    var VISIBLE_CLASS = "is-visible";
    var HIDDEN_CLASS = "is-hidden";
    var nonModals = document.querySelectorAll("body > *:not(".concat(MODAL, "):not([aria-hidden])"));
    var modal;

    var isActive = function isActive() {
      return document.body.classList.contains(ACTIVE_CLASS);
    };

    var SCROLLBAR_WIDTH = ScrollBarWidth();
    var INITIAL_PADDING = window.getComputedStyle(document.body).getPropertyValue("padding-right");
    var TEMPORARY_PADDING = parseInt(INITIAL_PADDING.replace(/px/, ""), 10) + parseInt(SCROLLBAR_WIDTH.replace(/px/, ""), 10) + "px";
    /**
     *  Is bound to escape key, closes modal when
     */

    var onMenuClose = function onMenuClose() {
      modal.toggleModal.call(modal, false);
    };
    /**
     *  Toggle the visibility of a modal window
     *
     * @param {KeyboardEvent} event the keydown event
     * @returns {boolean} safeActive if mobile is open
     */


    function toggleModal(event) {
      var originalOpener;
      var clickedElement = event.target;
      var _document = document,
          body = _document.body;
      var safeActive = !isActive();
      var modalId = clickedElement ? clickedElement.getAttribute("aria-controls") : document.querySelector(".usa-modal-wrapper.is-visible");
      var targetModal = safeActive ? document.getElementById(modalId) : document.querySelector(".usa-modal-wrapper.is-visible");
      var openFocusEl = targetModal.querySelector(INITIAL_FOCUS) ? targetModal.querySelector(INITIAL_FOCUS) : targetModal.querySelector(".usa-modal");
      var returnFocus = document.getElementById(targetModal.getAttribute("data-opener"));
      var menuButton = body.querySelector(OPENERS);
      var forceUserAction = targetModal.getAttribute(FORCE_ACTION_ATTRIBUTE); // Sets the clicked element to the close button
      // so esc key always closes modal

      if (event.type === "keydown" && targetModal !== null) {
        clickedElement = targetModal.querySelector(CLOSE_BUTTON);
      } // When we're not hitting the escape key…


      if (clickedElement) {
        // Make sure we click the opener
        // If it doesn't have an ID, make one
        // Store id as data attribute on modal
        if (clickedElement.hasAttribute(OPENER_ATTRIBUTE)) {
          if (this.getAttribute("id") === null) {
            originalOpener = "modal-".concat(Math.floor(Math.random() * 900000) + 100000);
            this.setAttribute("id", originalOpener);
          } else {
            originalOpener = this.getAttribute("id");
          }

          targetModal.setAttribute("data-opener", originalOpener);
        } // This basically stops the propagation if the element
        // is inside the modal and not a close button or
        // element inside a close button


        if (clickedElement.closest(".".concat(MODAL_CLASSNAME))) {
          if (clickedElement.hasAttribute(CLOSER_ATTRIBUTE) || clickedElement.closest("[".concat(CLOSER_ATTRIBUTE, "]"))) {// do nothing. move on.
          } else {
            event.stopPropagation();
            return false;
          }
        }
      } // Active class shares same as navigation


      body.classList.toggle(ACTIVE_CLASS, safeActive);
      targetModal.classList.toggle(VISIBLE_CLASS, safeActive);
      targetModal.classList.toggle(HIDDEN_CLASS, !safeActive); // If user is forced to take an action, adding
      // a class to the body that prevents clicking underneath
      // overlay

      if (forceUserAction) {
        body.classList.toggle(PREVENT_CLICK_CLASS, safeActive);
      } // Account for content shifting from body overflow: hidden
      // We only check paddingRight in case apps are adding other properties
      // to the body element


      body.style.paddingRight = body.style.paddingRight === TEMPORARY_PADDING ? INITIAL_PADDING : TEMPORARY_PADDING; // Handle the focus actions

      if (safeActive && openFocusEl) {
        // The modal window is opened. Focus is set to close button.
        // Binds escape key if we're not forcing
        // the user to take an action
        if (forceUserAction) {
          modal.focusTrap = FocusTrap(targetModal);
        } else {
          modal.focusTrap = FocusTrap(targetModal, {
            Escape: onMenuClose
          });
        } // Handles focus setting and interactions


        modal.focusTrap.update(safeActive);
        openFocusEl.focus(); // Hides everything that is not the modal from screen readers

        for (var i = 0; i < nonModals.length; i += 1) {
          nonModals[i].setAttribute("aria-hidden", "true");
        }
      } else if (!safeActive && menuButton && returnFocus) {
        // The modal window is closed.
        // Non-modals now accesible to screen reader
        for (var _i = 0; _i < nonModals.length; _i += 1) {
          nonModals[_i].removeAttribute("aria-hidden");
        } // Focus is returned to the opener


        returnFocus.focus();
        modal.focusTrap.update(safeActive);
      }

      return safeActive;
    }
    /**
     *  Builds modal window from base HTML
     *
     * @param {HTMLElement} baseComponent the modal html in the DOM
     */


    var setUpAttributes = function setUpAttributes(baseComponent) {
      var modalContent = baseComponent;
      var modalWrapper = document.createElement("div");
      var overlayDiv = document.createElement("div");
      var modalID = baseComponent.getAttribute("id");
      var ariaLabelledBy = baseComponent.getAttribute("aria-labelledby");
      var ariaDescribedBy = baseComponent.getAttribute("aria-describedby");
      var forceUserAction = baseComponent.hasAttribute(FORCE_ACTION_ATTRIBUTE) ? baseComponent.hasAttribute(FORCE_ACTION_ATTRIBUTE) : false; // Rebuild the modal element

      modalContent.parentNode.insertBefore(modalWrapper, modalContent);
      modalWrapper.appendChild(modalContent);
      modalContent.parentNode.insertBefore(overlayDiv, modalContent);
      overlayDiv.appendChild(modalContent); // Add classes and attributes

      modalWrapper.classList.add(HIDDEN_CLASS);
      modalWrapper.classList.add(WRAPPER_CLASSNAME);
      overlayDiv.classList.add(OVERLAY_CLASSNAME); // Set attributes

      modalWrapper.setAttribute("role", "dialog");
      modalWrapper.setAttribute("id", modalID);

      if (ariaLabelledBy) {
        modalWrapper.setAttribute("aria-labelledby", ariaLabelledBy);
      }

      if (ariaDescribedBy) {
        modalWrapper.setAttribute("aria-describedby", ariaDescribedBy);
      }

      if (forceUserAction) {
        modalWrapper.setAttribute(FORCE_ACTION_ATTRIBUTE, "true");
      } // Update the base element HTML


      baseComponent.removeAttribute("id");
      baseComponent.removeAttribute("aria-labelledby");
      baseComponent.removeAttribute("aria-describedby");
      baseComponent.setAttribute("tabindex", "-1"); // Add aria-controls

      var modalClosers = modalWrapper.querySelectorAll(CLOSERS);
      select(modalClosers).forEach(function (el) {
        el.setAttribute("aria-controls", modalID);
      }); // Move all modals to the end of the DOM. Doing this allows us to
      // more easily find the elements to hide from screen readers
      // when the modal is open.

      document.body.appendChild(modalWrapper);
    };

    modal = behavior(_defineProperty({}, CLICK, (_CLICK = {}, _defineProperty(_CLICK, OPENERS, toggleModal), _defineProperty(_CLICK, CLOSERS, toggleModal), _CLICK)), {
      init: function init(root) {
        select(MODAL, root).forEach(function (modalWindow) {
          setUpAttributes(modalWindow);
        });
        select(OPENERS, root).forEach(function (item) {
          // Turn anchor links into buttons because of
          // VoiceOver on Safari
          if (item.nodeName === "A") {
            item.setAttribute("role", "button");
            item.addEventListener("click", function (e) {
              e.preventDefault();
            });
          } // Can uncomment when aria-haspopup="dialog" is supported
          // https://a11ysupport.io/tech/aria/aria-haspopup_attribute
          // Most screen readers support aria-haspopup, but might announce
          // as opening a menu if "dialog" is not supported.
          // item.setAttribute("aria-haspopup", "dialog");

        });
      },
      focusTrap: null,
      toggleModal: toggleModal
    });
    module.exports = modal;
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45,
    "../utils/focus-trap": 46,
    "../utils/scrollbar-width": 49,
    "../utils/select": 50
  }],
  28: [function (require, module, exports) {
    "use strict";

    var _CLICK;

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var behavior = require("../utils/behavior");

    var select = require("../utils/select");

    var toggle = require("../utils/toggle");

    var FocusTrap = require("../utils/focus-trap");

    var accordion = require("./accordion");

    var ScrollBarWidth = require("../utils/scrollbar-width");

    var _require = require("../events"),
        CLICK = _require.CLICK;

    var _require2 = require("../config"),
        PREFIX = _require2.prefix;

    var BODY = "body";
    var NAV = ".".concat(PREFIX, "-nav");
    var NAV_LINKS = "".concat(NAV, " a");
    var NAV_CONTROL = "button.".concat(PREFIX, "-nav__link");
    var OPENERS = ".".concat(PREFIX, "-menu-btn");
    var CLOSE_BUTTON = ".".concat(PREFIX, "-nav__close");
    var OVERLAY = ".".concat(PREFIX, "-overlay");
    var CLOSERS = "".concat(CLOSE_BUTTON, ", .").concat(PREFIX, "-overlay");
    var TOGGLES = [NAV, OVERLAY].join(", ");
    var ACTIVE_CLASS = "usa-js-mobile-nav--active";
    var VISIBLE_CLASS = "is-visible";
    var navigation;
    var navActive;

    var isActive = function isActive() {
      return document.body.classList.contains(ACTIVE_CLASS);
    };

    var SCROLLBAR_WIDTH = ScrollBarWidth();
    var INITIAL_PADDING = window.getComputedStyle(document.body).getPropertyValue('padding-right');
    var TEMPORARY_PADDING = parseInt(INITIAL_PADDING.replace(/px/, ""), 10) + parseInt(SCROLLBAR_WIDTH.replace(/px/, ""), 10) + "px";

    var toggleNav = function toggleNav(active) {
      var _document = document,
          body = _document.body;
      var safeActive = typeof active === "boolean" ? active : !isActive();
      body.classList.toggle(ACTIVE_CLASS, safeActive);
      select(TOGGLES).forEach(function (el) {
        return el.classList.toggle(VISIBLE_CLASS, safeActive);
      });
      navigation.focusTrap.update(safeActive);
      var closeButton = body.querySelector(CLOSE_BUTTON);
      var menuButton = body.querySelector(OPENERS);
      body.style.paddingRight = body.style.paddingRight === TEMPORARY_PADDING ? INITIAL_PADDING : TEMPORARY_PADDING;

      if (safeActive && closeButton) {
        // The mobile nav was just activated, so focus on the close button,
        // which is just before all the nav elements in the tab order.
        closeButton.focus();
      } else if (!safeActive && document.activeElement === closeButton && menuButton) {
        // The mobile nav was just deactivated, and focus was on the close
        // button, which is no longer visible. We don't want the focus to
        // disappear into the void, so focus on the menu button if it's
        // visible (this may have been what the user was just focused on,
        // if they triggered the mobile nav by mistake).
        menuButton.focus();
      }

      return safeActive;
    };

    var resize = function resize() {
      var closer = document.body.querySelector(CLOSE_BUTTON);

      if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
        // When the mobile nav is active, and the close box isn't visible,
        // we know the user's viewport has been resized to be larger.
        // Let's make the page state consistent by deactivating the mobile nav.
        navigation.toggleNav.call(closer, false);
      }
    };

    var onMenuClose = function onMenuClose() {
      return navigation.toggleNav.call(navigation, false);
    };

    var hideActiveNavDropdown = function hideActiveNavDropdown() {
      toggle(navActive, false);
      navActive = null;
    };

    navigation = behavior(_defineProperty({}, CLICK, (_CLICK = {}, _defineProperty(_CLICK, NAV_CONTROL, function () {
      // If another nav is open, close it
      if (navActive && navActive !== this) {
        hideActiveNavDropdown();
      } // store a reference to the last clicked nav link element, so we
      // can hide the dropdown if another element on the page is clicked


      if (navActive) {
        hideActiveNavDropdown();
      } else {
        navActive = this;
        toggle(navActive, true);
      } // Do this so the event handler on the body doesn't fire


      return false;
    }), _defineProperty(_CLICK, BODY, function () {
      if (navActive) {
        hideActiveNavDropdown();
      }
    }), _defineProperty(_CLICK, OPENERS, toggleNav), _defineProperty(_CLICK, CLOSERS, toggleNav), _defineProperty(_CLICK, NAV_LINKS, function () {
      // A navigation link has been clicked! We want to collapse any
      // hierarchical navigation UI it's a part of, so that the user
      // can focus on whatever they've just selected.
      // Some navigation links are inside accordions; when they're
      // clicked, we want to collapse those accordions.
      var acc = this.closest(accordion.ACCORDION);

      if (acc) {
        accordion.getButtons(acc).forEach(function (btn) {
          return accordion.hide(btn);
        });
      } // If the mobile navigation menu is active, we want to hide it.


      if (isActive()) {
        navigation.toggleNav.call(navigation, false);
      }
    }), _CLICK)), {
      init: function init(root) {
        var trapContainer = root.querySelector(NAV);

        if (trapContainer) {
          navigation.focusTrap = FocusTrap(trapContainer, {
            Escape: onMenuClose
          });
        }

        resize();
        window.addEventListener("resize", resize, false);
      },
      teardown: function teardown() {
        window.removeEventListener("resize", resize, false);
        navActive = false;
      },
      focusTrap: null,
      toggleNav: toggleNav
    });
    module.exports = navigation;
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45,
    "../utils/focus-trap": 46,
    "../utils/scrollbar-width": 49,
    "../utils/select": 50,
    "../utils/toggle": 53,
    "./accordion": 17
  }],
  29: [function (require, module, exports) {
    "use strict";

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var behavior = require("../utils/behavior");

    var toggleFormInput = require("../utils/toggle-form-input");

    var _require = require("../events"),
        CLICK = _require.CLICK;

    var _require2 = require("../config"),
        PREFIX = _require2.prefix;

    var LINK = ".".concat(PREFIX, "-show-password, .").concat(PREFIX, "-show-multipassword");

    function toggle(event) {
      event.preventDefault();
      toggleFormInput(this);
    }

    module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, LINK, toggle)));
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45,
    "../utils/toggle-form-input": 52
  }],
  30: [function (require, module, exports) {
    "use strict";

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var ignore = require("receptor/ignore");

    var behavior = require("../utils/behavior");

    var select = require("../utils/select");

    var _require = require("../events"),
        CLICK = _require.CLICK;

    var BUTTON = ".js-search-button";
    var FORM = ".js-search-form";
    var INPUT = "[type=search]";
    var CONTEXT = "header"; // XXX

    var lastButton;

    var getForm = function getForm(button) {
      var context = button.closest(CONTEXT);
      return context ? context.querySelector(FORM) : document.querySelector(FORM);
    };

    var toggleSearch = function toggleSearch(button, active) {
      var form = getForm(button);

      if (!form) {
        throw new Error("No ".concat(FORM, " found for search toggle in ").concat(CONTEXT, "!"));
      }
      /* eslint-disable no-param-reassign */


      button.hidden = active;
      form.hidden = !active;
      /* eslint-enable */

      if (!active) {
        return;
      }

      var input = form.querySelector(INPUT);

      if (input) {
        input.focus();
      } // when the user clicks _outside_ of the form w/ignore(): hide the
      // search, then remove the listener


      var listener = ignore(form, function () {
        if (lastButton) {
          hideSearch.call(lastButton); // eslint-disable-line no-use-before-define
        }

        document.body.removeEventListener(CLICK, listener);
      }); // Normally we would just run this code without a timeout, but
      // IE11 and Edge will actually call the listener *immediately* because
      // they are currently handling this exact type of event, so we'll
      // make sure the browser is done handling the current click event,
      // if any, before we attach the listener.

      setTimeout(function () {
        document.body.addEventListener(CLICK, listener);
      }, 0);
    };

    function showSearch() {
      toggleSearch(this, true);
      lastButton = this;
    }

    function hideSearch() {
      toggleSearch(this, false);
      lastButton = undefined;
    }

    var search = behavior(_defineProperty({}, CLICK, _defineProperty({}, BUTTON, showSearch)), {
      init: function init(target) {
        select(BUTTON, target).forEach(function (button) {
          toggleSearch(button, false);
        });
      },
      teardown: function teardown() {
        // forget the last button clicked
        lastButton = undefined;
      }
    });
    module.exports = search;
  }, {
    "../events": 37,
    "../utils/behavior": 45,
    "../utils/select": 50,
    "receptor/ignore": 12
  }],
  31: [function (require, module, exports) {
    "use strict";

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var once = require("receptor/once");

    var behavior = require("../utils/behavior");

    var _require = require("../events"),
        CLICK = _require.CLICK;

    var _require2 = require("../config"),
        PREFIX = _require2.prefix;

    var LINK = ".".concat(PREFIX, "-skipnav[href^=\"#\"], .").concat(PREFIX, "-footer__return-to-top [href^=\"#\"]");
    var MAINCONTENT = "main-content";

    function setTabindex() {
      // NB: we know because of the selector we're delegating to below that the
      // href already begins with '#'
      var id = encodeURI(this.getAttribute("href"));
      var target = document.getElementById(id === "#" ? MAINCONTENT : id.slice(1));

      if (target) {
        target.style.outline = "0";
        target.setAttribute("tabindex", 0);
        target.focus();
        target.addEventListener("blur", once(function () {
          target.setAttribute("tabindex", -1);
        }));
      } else {// throw an error?
      }
    }

    module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, LINK, setTabindex)));
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45,
    "receptor/once": 15
  }],
  32: [function (require, module, exports) {
    "use strict";

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var select = require("../utils/select");

    var behavior = require("../utils/behavior");

    var _require = require("../events"),
        CLICK = _require.CLICK;

    var _require2 = require("../config"),
        PREFIX = _require2.prefix;

    var TABLE = ".".concat(PREFIX, "-table");
    var SORTED = "aria-sort";
    var ASCENDING = "ascending";
    var DESCENDING = "descending";
    var SORT_OVERRIDE = "data-sort-value";
    var ICON_SOURCE = "\n  <svg class=\"".concat(PREFIX, "-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n    <g class=\"descending\" fill=\"transparent\">\n      <path d=\"M17 17L15.59 15.59L12.9999 18.17V2H10.9999V18.17L8.41 15.58L7 17L11.9999 22L17 17Z\" />\n    </g>\n    <g class=\"ascending\" fill=\"transparent\">\n      <path transform=\"rotate(180, 12, 12)\" d=\"M17 17L15.59 15.59L12.9999 18.17V2H10.9999V18.17L8.41 15.58L7 17L11.9999 22L17 17Z\" />\n    </g>\n    <g class=\"unsorted\" fill=\"transparent\">\n      <polygon points=\"15.17 15 13 17.17 13 6.83 15.17 9 16.58 7.59 12 3 7.41 7.59 8.83 9 11 6.83 11 17.17 8.83 15 7.42 16.41 12 21 16.59 16.41 15.17 15\"/>\n    </g>\n  </svg>\n");
    var SORT_BUTTON_CLASS = "".concat(PREFIX, "-table__header__button");
    var SORT_BUTTON = ".".concat(SORT_BUTTON_CLASS);
    var SORTABLE_HEADER = "th[data-sortable]";
    var ANNOUNCEMENT_REGION = ".".concat(PREFIX, "-table__announcement-region[aria-live=\"polite\"]");
    /** Gets the data-sort-value attribute value, if provided — otherwise, gets
     * the innerText or textContent — of the child element (HTMLTableCellElement)
     * at the specified index of the given table row
     *
     * @param {number} index
     * @param {array<HTMLTableRowElement>} tr
     * @return {boolean}
     */

    var getCellValue = function getCellValue(tr, index) {
      return tr.children[index].getAttribute(SORT_OVERRIDE) || tr.children[index].innerText || tr.children[index].textContent;
    };
    /**
     * Compares the values of two row array items at the given index, then sorts by the given direction
     * @param {number} index
     * @param {string} direction
     * @return {boolean}
     */


    var compareFunction = function compareFunction(index, isAscending) {
      return function (thisRow, nextRow) {
        // get values to compare from data attribute or cell content
        var value1 = getCellValue(isAscending ? thisRow : nextRow, index);
        var value2 = getCellValue(isAscending ? nextRow : thisRow, index); // if neither value is empty, and if both values are already numbers, compare numerically

        if (value1 && value2 && !Number.isNaN(Number(value1)) && !Number.isNaN(Number(value2))) {
          return value1 - value2;
        } // Otherwise, compare alphabetically based on current user locale


        return value1.toString().localeCompare(value2, navigator.language, {
          numeric: true,
          ignorePunctuation: true
        });
      };
    };
    /**
     * Get an Array of column headers elements belonging directly to the given
     * table element.
     * @param {HTMLTableElement} table
     * @return {array<HTMLTableHeaderCellElement>}
     */


    var getColumnHeaders = function getColumnHeaders(table) {
      var headers = select(SORTABLE_HEADER, table);
      return headers.filter(function (header) {
        return header.closest(TABLE) === table;
      });
    };
    /**
     * Update the button label within the given header element, resetting it
     * to the default state (ready to sort ascending) if it's no longer sorted
     * @param {HTMLTableHeaderCellElement} header
     */


    var updateSortLabel = function updateSortLabel(header) {
      var headerName = header.innerText;
      var sortedAscending = header.getAttribute(SORTED) === ASCENDING;
      var isSorted = header.getAttribute(SORTED) === ASCENDING || header.getAttribute(SORTED) === DESCENDING || false;
      var headerLabel = "".concat(headerName, "', sortable column, currently ").concat(isSorted ? "".concat(sortedAscending ? "sorted ".concat(ASCENDING) : "sorted ".concat(DESCENDING)) : "unsorted");
      var headerButtonLabel = "Click to sort by ".concat(headerName, " in ").concat(sortedAscending ? DESCENDING : ASCENDING, " order.");
      header.setAttribute("aria-label", headerLabel);
      header.querySelector(SORT_BUTTON).setAttribute("title", headerButtonLabel);
    };
    /**
     * Remove the aria-sort attribute on the given header element, and reset the label and button icon
     * @param {HTMLTableHeaderCellElement} header
     */


    var unsetSort = function unsetSort(header) {
      header.removeAttribute(SORTED);
      updateSortLabel(header);
    };
    /**
     * Sort rows either ascending or descending, based on a given header's aria-sort attribute
     * @param {HTMLTableHeaderCellElement} header
     * @param {boolean} isAscending
     * @return {boolean} true
     */


    var sortRows = function sortRows(header, isAscending) {
      header.setAttribute(SORTED, isAscending === true ? DESCENDING : ASCENDING);
      updateSortLabel(header);
      var tbody = header.closest(TABLE).querySelector("tbody"); // We can use Array.from() and Array.sort() instead once we drop IE11 support, likely in the summer of 2021
      //
      // Array.from(tbody.querySelectorAll('tr').sort(
      //   compareFunction(
      //     Array.from(header.parentNode.children).indexOf(header),
      //     !isAscending)
      //   )
      // .forEach(tr => tbody.appendChild(tr) );
      // [].slice.call() turns array-like sets into true arrays so that we can sort them

      var allRows = [].slice.call(tbody.querySelectorAll("tr"));
      var allHeaders = [].slice.call(header.parentNode.children);
      var thisHeaderIndex = allHeaders.indexOf(header);
      allRows.sort(compareFunction(thisHeaderIndex, !isAscending)).forEach(function (tr) {
        [].slice.call(tr.children).forEach(function (td) {
          return td.removeAttribute("data-sort-active");
        });
        tr.children[thisHeaderIndex].setAttribute("data-sort-active", true);
        tbody.appendChild(tr);
      });
      return true;
    };
    /**
     * Update the live region immediately following the table whenever sort changes.
     * @param {HTMLTableElement} table
     * @param {HTMLTableHeaderCellElement} sortedHeader
     */


    var updateLiveRegion = function updateLiveRegion(table, sortedHeader) {
      var caption = table.querySelector("caption").innerText;
      var sortedAscending = sortedHeader.getAttribute(SORTED) === ASCENDING;
      var headerLabel = sortedHeader.innerText;
      var liveRegion = table.nextElementSibling;

      if (liveRegion && liveRegion.matches(ANNOUNCEMENT_REGION)) {
        var sortAnnouncement = "The table named \"".concat(caption, "\" is now sorted by ").concat(headerLabel, " in ").concat(sortedAscending ? ASCENDING : DESCENDING, " order.");
        liveRegion.innerText = sortAnnouncement;
      } else {
        throw new Error("Table containing a sortable column header is not followed by an aria-live region.");
      }
    };
    /**
     * Toggle a header's sort state, optionally providing a target
     * state.
     *
     * @param {HTMLTableHeaderCellElement} header
     * @param {boolean?} isAscending If no state is provided, the current
     * state will be toggled (from false to true, and vice-versa).
     */


    var toggleSort = function toggleSort(header, isAscending) {
      var table = header.closest(TABLE);
      var safeAscending = isAscending;

      if (typeof safeAscending !== "boolean") {
        safeAscending = header.getAttribute(SORTED) === ASCENDING;
      }

      if (!table) {
        throw new Error("".concat(SORTABLE_HEADER, " is missing outer ").concat(TABLE));
      }

      safeAscending = sortRows(header, isAscending);

      if (safeAscending) {
        getColumnHeaders(table).forEach(function (otherHeader) {
          if (otherHeader !== header) {
            unsetSort(otherHeader);
          }
        });
        updateLiveRegion(table, header);
      }
    };
    /**
     ** Inserts a button with icon inside a sortable header
     * @param {HTMLTableHeaderCellElement} header
     */


    var createHeaderButton = function createHeaderButton(header) {
      var buttonEl = document.createElement("button");
      buttonEl.setAttribute("tabindex", "0");
      buttonEl.classList.add(SORT_BUTTON_CLASS);
      buttonEl.innerHTML = "".concat(ICON_SOURCE);
      header.appendChild(buttonEl);
      updateSortLabel(header);
    };

    var table = behavior(_defineProperty({}, CLICK, _defineProperty({}, SORT_BUTTON, function (event) {
      event.preventDefault();
      toggleSort(event.target.closest(SORTABLE_HEADER), event.target.closest(SORTABLE_HEADER).getAttribute(SORTED) === ASCENDING);
    })), {
      init: function init(root) {
        var sortableHeaders = select(SORTABLE_HEADER, root);
        sortableHeaders.forEach(function (header) {
          return createHeaderButton(header);
        });
        var firstSorted = sortableHeaders.filter(function (header) {
          return header.getAttribute(SORTED) === ASCENDING || header.getAttribute(SORTED) === DESCENDING;
        })[0];

        if (typeof firstSorted === "undefined") {
          // no sortable headers found
          return;
        }

        var sortDir = firstSorted.getAttribute(SORTED);

        if (sortDir === ASCENDING) {
          toggleSort(firstSorted, true);
        } else if (sortDir === DESCENDING) {
          toggleSort(firstSorted, false);
        }
      },
      TABLE: TABLE,
      SORTABLE_HEADER: SORTABLE_HEADER,
      SORT_BUTTON: SORT_BUTTON
    });
    module.exports = table;
  }, {
    "../config": 36,
    "../events": 37,
    "../utils/behavior": 45,
    "../utils/select": 50
  }],
  33: [function (require, module, exports) {
    "use strict";

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    var behavior = require("../utils/behavior");

    var select = require("../utils/select");

    var _require = require("../config"),
        PREFIX = _require.prefix;

    var _require2 = require("./combo-box"),
        COMBO_BOX_CLASS = _require2.COMBO_BOX_CLASS,
        enhanceComboBox = _require2.enhanceComboBox;

    var TIME_PICKER_CLASS = "".concat(PREFIX, "-time-picker");
    var TIME_PICKER = ".".concat(TIME_PICKER_CLASS);
    var MAX_TIME = 60 * 24 - 1;
    var MIN_TIME = 0;
    var DEFAULT_STEP = 30;
    var MIN_STEP = 1;
    var FILTER_DATASET = {
      filter: "0?{{ hourQueryFilter }}:{{minuteQueryFilter}}.*{{ apQueryFilter }}m?",
      apQueryFilter: "([ap])",
      hourQueryFilter: "([1-9][0-2]?)",
      minuteQueryFilter: "[\\d]+:([0-9]{0,2})"
    };
    /**
     * Parse a string of hh:mm into minutes
     *
     * @param {string} timeStr the time string to parse
     * @returns {number} the number of minutes
     */

    var parseTimeString = function parseTimeString(timeStr) {
      var minutes;

      if (timeStr) {
        var _timeStr$split$map = timeStr.split(":").map(function (str) {
          var value;
          var parsed = parseInt(str, 10);
          if (!Number.isNaN(parsed)) value = parsed;
          return value;
        }),
            _timeStr$split$map2 = _slicedToArray(_timeStr$split$map, 2),
            hours = _timeStr$split$map2[0],
            mins = _timeStr$split$map2[1];

        if (hours != null && mins != null) {
          minutes = hours * 60 + mins;
        }
      }

      return minutes;
    };
    /**
     * Enhance an input with the date picker elements
     *
     * @param {HTMLElement} el The initial wrapping element of the date picker component
     */


    var transformTimePicker = function transformTimePicker(el) {
      var timePickerEl = el.closest(TIME_PICKER);
      var initialInputEl = timePickerEl.querySelector("input");

      if (!initialInputEl) {
        throw new Error("".concat(TIME_PICKER, " is missing inner input"));
      }

      var selectEl = document.createElement("select");
      ["id", "name", "required", "aria-label", "aria-labelledby"].forEach(function (name) {
        if (initialInputEl.hasAttribute(name)) {
          var value = initialInputEl.getAttribute(name);
          selectEl.setAttribute(name, value);
          initialInputEl.removeAttribute(name);
        }
      });

      var padZeros = function padZeros(value, length) {
        return "0000".concat(value).slice(-length);
      };

      var getTimeContext = function getTimeContext(minutes) {
        var minute = minutes % 60;
        var hour24 = Math.floor(minutes / 60);
        var hour12 = hour24 % 12 || 12;
        var ampm = hour24 < 12 ? "am" : "pm";
        return {
          minute: minute,
          hour24: hour24,
          hour12: hour12,
          ampm: ampm
        };
      };

      var minTime = Math.max(MIN_TIME, parseTimeString(timePickerEl.dataset.minTime) || MIN_TIME);
      var maxTime = Math.min(MAX_TIME, parseTimeString(timePickerEl.dataset.maxTime) || MAX_TIME);
      var step = Math.floor(Math.max(MIN_STEP, timePickerEl.dataset.step || DEFAULT_STEP));

      for (var time = minTime; time <= maxTime; time += step) {
        var _getTimeContext = getTimeContext(time),
            minute = _getTimeContext.minute,
            hour24 = _getTimeContext.hour24,
            hour12 = _getTimeContext.hour12,
            ampm = _getTimeContext.ampm;

        var option = document.createElement("option");
        option.value = "".concat(padZeros(hour24, 2), ":").concat(padZeros(minute, 2));
        option.text = "".concat(hour12, ":").concat(padZeros(minute, 2)).concat(ampm);
        selectEl.appendChild(option);
      }

      timePickerEl.classList.add(COMBO_BOX_CLASS); // combo box properties

      Object.keys(FILTER_DATASET).forEach(function (key) {
        timePickerEl.dataset[key] = FILTER_DATASET[key];
      });
      timePickerEl.dataset.disableFiltering = "true";
      timePickerEl.appendChild(selectEl);
      initialInputEl.style.display = "none";
    };

    var timePicker = behavior({}, {
      init: function init(root) {
        select(TIME_PICKER, root).forEach(function (timePickerEl) {
          transformTimePicker(timePickerEl);
          enhanceComboBox(timePickerEl);
        });
      },
      FILTER_DATASET: FILTER_DATASET
    });
    module.exports = timePicker;
  }, {
    "../config": 36,
    "../utils/behavior": 45,
    "../utils/select": 50,
    "./combo-box": 20
  }],
  34: [function (require, module, exports) {
    "use strict"; // Tooltips

    var select = require("../utils/select");

    var behavior = require("../utils/behavior");

    var _require = require("../config"),
        PREFIX = _require.prefix;

    var isElementInViewport = require("../utils/is-in-viewport");

    var TOOLTIP = ".".concat(PREFIX, "-tooltip");
    var TOOLTIP_TRIGGER_CLASS = "".concat(PREFIX, "-tooltip__trigger");
    var TOOLTIP_CLASS = "".concat(PREFIX, "-tooltip");
    var TOOLTIP_BODY_CLASS = "".concat(PREFIX, "-tooltip__body");
    var SET_CLASS = "is-set";
    var VISIBLE_CLASS = "is-visible";
    var TRIANGLE_SIZE = 5;
    var ADJUST_WIDTH_CLASS = "".concat(PREFIX, "-tooltip__body--wrap");
    /**
     * Add one or more listeners to an element
     * @param {DOMElement} element - DOM element to add listeners to
     * @param {events} eventNames - space separated list of event names, e.g. 'click change'
     * @param {Function} listener - function to attach for each event as a listener
     */

    var addListenerMulti = function addListenerMulti(element, eventNames, listener) {
      var events = eventNames.split(" ");

      for (var i = 0, iLen = events.length; i < iLen; i += 1) {
        element.addEventListener(events[i], listener, false);
      }
    };
    /**
     * Shows the tooltip
     * @param {HTMLElement} tooltipTrigger - the element that initializes the tooltip
     */


    var showToolTip = function showToolTip(tooltipBody, tooltipTrigger, position) {
      tooltipBody.setAttribute("aria-hidden", "false"); // This sets up the tooltip body. The opacity is 0, but
      // we can begin running the calculations below.

      tooltipBody.classList.add(SET_CLASS);
      /**
       * Position the tooltip body when the trigger is hovered
       * Removes old positioning classnames and reapplies. This allows
       * positioning to change in case the user resizes browser or DOM manipulation
       * causes tooltip to get clipped from viewport
       *
       * @param {string} setPos - can be "top", "bottom", "right", "left"
       */

      var setPositionClass = function setPositionClass(setPos) {
        tooltipBody.classList.remove("".concat(TOOLTIP_BODY_CLASS, "--top"));
        tooltipBody.classList.remove("".concat(TOOLTIP_BODY_CLASS, "--bottom"));
        tooltipBody.classList.remove("".concat(TOOLTIP_BODY_CLASS, "--right"));
        tooltipBody.classList.remove("".concat(TOOLTIP_BODY_CLASS, "--left"));
        tooltipBody.classList.add("".concat(TOOLTIP_BODY_CLASS, "--").concat(setPos));
      };
      /**
       * Removes old positioning styles. This allows
       * re-positioning to change without inheriting other
       * dynamic styles
       *
       * @param {HTMLElement} e - this is the tooltip body
       */


      var resetPositionStyles = function resetPositionStyles(e) {
        // we don't override anything in the stylesheet when finding alt positions
        e.style.top = null;
        e.style.bottom = null;
        e.style.right = null;
        e.style.left = null;
        e.style.margin = null;
      };
      /**
       * get margin offset calculations
       *
       * @param {HTMLElement} target - this is the tooltip body
       * @param {String} propertyValue - this is the tooltip body
       */


      var offsetMargin = function offsetMargin(target, propertyValue) {
        return parseInt(window.getComputedStyle(target).getPropertyValue(propertyValue), 10);
      }; // offsetLeft = the left position, and margin of the element, the left
      // padding, scrollbar and border of the offsetParent element
      // offsetWidth = The offsetWidth property returns the viewable width of an
      // element in pixels, including padding, border and scrollbar, but not
      // the margin.

      /**
       * Calculate margin offset
       * tooltip trigger margin(position) offset + tooltipBody offsetWidth
       * @param {String} marginPosition
       * @param {Number} tooltipBodyOffset
       * @param {HTMLElement} trigger
       */


      var calculateMarginOffset = function calculateMarginOffset(marginPosition, tooltipBodyOffset, trigger) {
        var offset = offsetMargin(trigger, "margin-".concat(marginPosition)) > 0 ? tooltipBodyOffset - offsetMargin(trigger, "margin-".concat(marginPosition)) : tooltipBodyOffset;
        return offset;
      };
      /**
       * Positions tooltip at the top
       * @param {HTMLElement} e - this is the tooltip body
       */


      var positionTop = function positionTop(e) {
        resetPositionStyles(e); // ensures we start from the same point
        // get details on the elements object with

        var topMargin = calculateMarginOffset("top", e.offsetHeight, tooltipTrigger);
        var leftMargin = calculateMarginOffset("left", e.offsetWidth, tooltipTrigger);
        setPositionClass("top");
        e.style.left = "50%"; // center the element

        e.style.top = "-".concat(TRIANGLE_SIZE, "px"); // consider the psuedo element
        // apply our margins based on the offest

        e.style.margin = "-".concat(topMargin, "px 0 0 -").concat(leftMargin / 2, "px");
      };
      /**
       * Positions tooltip at the bottom
       * @param {HTMLElement} e - this is the tooltip body
       */


      var positionBottom = function positionBottom(e) {
        resetPositionStyles(e);
        var leftMargin = calculateMarginOffset("left", e.offsetWidth, tooltipTrigger);
        setPositionClass("bottom");
        e.style.left = "50%";
        e.style.margin = "".concat(TRIANGLE_SIZE, "px 0 0 -").concat(leftMargin / 2, "px");
      };
      /**
       * Positions tooltip at the right
       * @param {HTMLElement} e - this is the tooltip body
       */


      var positionRight = function positionRight(e) {
        resetPositionStyles(e);
        var topMargin = calculateMarginOffset("top", e.offsetHeight, tooltipTrigger);
        setPositionClass("right");
        e.style.top = "50%";
        e.style.left = "".concat(tooltipTrigger.offsetLeft + tooltipTrigger.offsetWidth + TRIANGLE_SIZE, "px");
        e.style.margin = "-".concat(topMargin / 2, "px 0 0 0");
      };
      /**
       * Positions tooltip at the right
       * @param {HTMLElement} e - this is the tooltip body
       */


      var positionLeft = function positionLeft(e) {
        resetPositionStyles(e);
        var topMargin = calculateMarginOffset("top", e.offsetHeight, tooltipTrigger); // we have to check for some utility margins

        var leftMargin = calculateMarginOffset("left", tooltipTrigger.offsetLeft > e.offsetWidth ? tooltipTrigger.offsetLeft - e.offsetWidth : e.offsetWidth, tooltipTrigger);
        setPositionClass("left");
        e.style.top = "50%";
        e.style.left = "-".concat(TRIANGLE_SIZE, "px");
        e.style.margin = "-".concat(topMargin / 2, "px 0 0 ").concat(tooltipTrigger.offsetLeft > e.offsetWidth ? leftMargin : -leftMargin, "px"); // adjust the margin
      };
      /**
       * We try to set the position based on the
       * original intention, but make adjustments
       * if the element is clipped out of the viewport
       * we constrain the width only as a last resort
       * @param {HTMLElement} element(alias tooltipBody)
       * @param {Number} attempt (--flag)
       */


      var maxAttempts = 2;

      function findBestPosition(element) {
        var attempt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1; // create array of optional positions

        var positions = [positionTop, positionBottom, positionRight, positionLeft];
        var hasVisiblePosition = false; // we take a recursive approach

        function tryPositions(i) {
          if (i < positions.length) {
            var pos = positions[i];
            pos(element);

            if (!isElementInViewport(element)) {
              // eslint-disable-next-line no-param-reassign
              tryPositions(i += 1);
            } else {
              hasVisiblePosition = true;
            }
          }
        }

        tryPositions(0); // if we can't find a position we compress it and try again

        if (!hasVisiblePosition) {
          element.classList.add(ADJUST_WIDTH_CLASS);

          if (attempt <= maxAttempts) {
            // eslint-disable-next-line no-param-reassign
            findBestPosition(element, attempt += 1);
          }
        }
      }

      switch (position) {
        case "top":
          positionTop(tooltipBody);

          if (!isElementInViewport(tooltipBody)) {
            findBestPosition(tooltipBody);
          }

          break;

        case "bottom":
          positionBottom(tooltipBody);

          if (!isElementInViewport(tooltipBody)) {
            findBestPosition(tooltipBody);
          }

          break;

        case "right":
          positionRight(tooltipBody);

          if (!isElementInViewport(tooltipBody)) {
            findBestPosition(tooltipBody);
          }

          break;

        case "left":
          positionLeft(tooltipBody);

          if (!isElementInViewport(tooltipBody)) {
            findBestPosition(tooltipBody);
          }

          break;

        default:
          // skip default case
          break;
      }
      /**
       * Actually show the tooltip. The VISIBLE_CLASS
       * will change the opacity to 1
       */


      setTimeout(function () {
        tooltipBody.classList.add(VISIBLE_CLASS);
      }, 20);
    };
    /**
     * Removes all the properties to show and position the tooltip,
     * and resets the tooltip position to the original intention
     * in case the window is resized or the element is moved through
     * DOM maniulation.
     * @param {HTMLElement} tooltipBody - The body of the tooltip
     */


    var hideToolTip = function hideToolTip(tooltipBody) {
      tooltipBody.classList.remove(VISIBLE_CLASS);
      tooltipBody.classList.remove(SET_CLASS);
      tooltipBody.classList.remove(ADJUST_WIDTH_CLASS);
      tooltipBody.setAttribute("aria-hidden", "true");
    };
    /**
     * Setup the tooltip component
     * @param {HTMLElement} tooltipTrigger The element that creates the tooltip
     */


    var setUpAttributes = function setUpAttributes(tooltipTrigger) {
      var tooltipID = "tooltip-".concat(Math.floor(Math.random() * 900000) + 100000);
      var tooltipContent = tooltipTrigger.getAttribute("title");
      var wrapper = document.createElement("span");
      var tooltipBody = document.createElement("span");
      var position = tooltipTrigger.getAttribute("data-position") ? tooltipTrigger.getAttribute("data-position") : "top";
      var additionalClasses = tooltipTrigger.getAttribute("data-classes"); // Set up tooltip attributes

      tooltipTrigger.setAttribute("aria-describedby", tooltipID);
      tooltipTrigger.setAttribute("tabindex", "0");
      tooltipTrigger.setAttribute("title", "");
      tooltipTrigger.classList.remove(TOOLTIP_CLASS);
      tooltipTrigger.classList.add(TOOLTIP_TRIGGER_CLASS); // insert wrapper before el in the DOM tree

      tooltipTrigger.parentNode.insertBefore(wrapper, tooltipTrigger); // set up the wrapper

      wrapper.appendChild(tooltipTrigger);
      wrapper.classList.add(TOOLTIP_CLASS);
      wrapper.appendChild(tooltipBody); // Apply additional class names to wrapper element

      if (additionalClasses) {
        var classesArray = additionalClasses.split(" ");
        classesArray.forEach(function (classname) {
          return wrapper.classList.add(classname);
        });
      } // set up the tooltip body


      tooltipBody.classList.add(TOOLTIP_BODY_CLASS);
      tooltipBody.setAttribute("id", tooltipID);
      tooltipBody.setAttribute("role", "tooltip");
      tooltipBody.setAttribute("aria-hidden", "true"); // place the text in the tooltip

      tooltipBody.innerHTML = tooltipContent;
      return {
        tooltipBody: tooltipBody,
        position: position,
        tooltipContent: tooltipContent,
        wrapper: wrapper
      };
    }; // Setup our function to run on various events


    var tooltip = behavior({}, {
      init: function init(root) {
        select(TOOLTIP, root).forEach(function (tooltipTrigger) {
          var _setUpAttributes = setUpAttributes(tooltipTrigger),
              tooltipBody = _setUpAttributes.tooltipBody,
              position = _setUpAttributes.position,
              tooltipContent = _setUpAttributes.tooltipContent,
              wrapper = _setUpAttributes.wrapper;

          if (tooltipContent) {
            // Listeners for showing and hiding the tooltip
            addListenerMulti(tooltipTrigger, "mouseenter focus", function () {
              showToolTip(tooltipBody, tooltipTrigger, position, wrapper);
              return false;
            }); // Keydown here prevents tooltips from being read twice by
            // screen reader. also allows excape key to close it
            // (along with any other.)

            addListenerMulti(tooltipTrigger, "mouseleave blur keydown", function () {
              hideToolTip(tooltipBody);
              return false;
            });
          } else {// throw error or let other tooltips on page function?
          }
        });
      }
    });
    module.exports = tooltip;
  }, {
    "../config": 36,
    "../utils/behavior": 45,
    "../utils/is-in-viewport": 47,
    "../utils/select": 50
  }],
  35: [function (require, module, exports) {
    "use strict";

    var behavior = require("../utils/behavior");

    var validate = require("../utils/validate-input");

    function change() {
      validate(this);
    }

    var validator = behavior({
      "keyup change": {
        "input[data-validation-element]": change
      }
    });
    module.exports = validator;
  }, {
    "../utils/behavior": 45,
    "../utils/validate-input": 54
  }],
  36: [function (require, module, exports) {
    "use strict";

    module.exports = {
      prefix: "usa"
    };
  }, {}],
  37: [function (require, module, exports) {
    "use strict";

    module.exports = {
      // This used to be conditionally dependent on whether the
      // browser supported touch events; if it did, `CLICK` was set to
      // `touchstart`.  However, this had downsides:
      //
      // * It pre-empted mobile browsers' default behavior of detecting
      //   whether a touch turned into a scroll, thereby preventing
      //   users from using some of our components as scroll surfaces.
      //
      // * Some devices, such as the Microsoft Surface Pro, support *both*
      //   touch and clicks. This meant the conditional effectively dropped
      //   support for the user's mouse, frustrating users who preferred
      //   it on those systems.
      CLICK: "click"
    };
  }, {}],
  38: [function (require, module, exports) {
    "use strict";
    /* eslint-disable consistent-return */

    /* eslint-disable func-names */

    (function () {
      if (typeof window.CustomEvent === "function") return false;

      function CustomEvent(event, _params) {
        var params = _params || {
          bubbles: false,
          cancelable: false,
          detail: null
        };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }

      window.CustomEvent = CustomEvent;
    })();
  }, {}],
  39: [function (require, module, exports) {
    "use strict";

    var elproto = window.HTMLElement.prototype;
    var HIDDEN = "hidden";

    if (!(HIDDEN in elproto)) {
      Object.defineProperty(elproto, HIDDEN, {
        get: function get() {
          return this.hasAttribute(HIDDEN);
        },
        set: function set(value) {
          if (value) {
            this.setAttribute(HIDDEN, "");
          } else {
            this.removeAttribute(HIDDEN);
          }
        }
      });
    }
  }, {}],
  40: [function (require, module, exports) {
    "use strict"; // polyfills HTMLElement.prototype.classList and DOMTokenList

    require("classlist-polyfill"); // polyfills HTMLElement.prototype.hidden


    require("./element-hidden"); // polyfills Number.isNaN()


    require("./number-is-nan"); // polyfills CustomEvent


    require("./custom-event"); // polyfills svg4everybody


    require("./svg4everybody");
  }, {
    "./custom-event": 38,
    "./element-hidden": 39,
    "./number-is-nan": 41,
    "./svg4everybody": 42,
    "classlist-polyfill": 1
  }],
  41: [function (require, module, exports) {
    "use strict";

    Number.isNaN = Number.isNaN || function isNaN(input) {
      // eslint-disable-next-line no-self-compare
      return typeof input === "number" && input !== input;
    };
  }, {}],
  42: [function (require, module, exports) {
    "use strict";
    /* eslint-disable */

    !function (factory) {
      module.exports = factory();
    }(function () {
      /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
      function embed(parent, svg, target, use) {
        // if the target exists
        if (target) {
          // create a document fragment to hold the contents of the target
          var fragment = document.createDocumentFragment(),
              viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox"); // conditionally set the viewBox on the svg

          viewBox && svg.setAttribute("viewBox", viewBox); // copy the contents of the clone into the fragment

          for ( // clone the target
          var clone = document.importNode ? document.importNode(target, !0) : target.cloneNode(!0), g = document.createElementNS(svg.namespaceURI || "http://www.w3.org/2000/svg", "g"); clone.childNodes.length;) {
            g.appendChild(clone.firstChild);
          }

          if (use) {
            for (var i = 0; use.attributes.length > i; i++) {
              var attr = use.attributes[i];
              "xlink:href" !== attr.name && "href" !== attr.name && g.setAttribute(attr.name, attr.value);
            }
          }

          fragment.appendChild(g), // append the fragment into the svg
          parent.appendChild(fragment);
        }
      }

      function loadreadystatechange(xhr, use) {
        // listen to changes in the request
        xhr.onreadystatechange = function () {
          // if the request is ready
          if (4 === xhr.readyState) {
            // get the cached html document
            var cachedDocument = xhr._cachedDocument; // ensure the cached html document based on the xhr response

            cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), cachedDocument.body.innerHTML = xhr.responseText, // ensure domains are the same, otherwise we'll have issues appending the
            // element in IE 11
            cachedDocument.domain !== document.domain && (cachedDocument.domain = document.domain), xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
            xhr._embeds.splice(0).map(function (item) {
              // get the cached target
              var target = xhr._cachedTarget[item.id]; // ensure the cached target

              target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), // embed the target into the svg
              embed(item.parent, item.svg, target, use);
            });
          }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
      }

      function svg4everybody(rawopts) {
        function oninterval() {
          // if all <use>s in the array are being bypassed, don't proceed.
          if (numberOfSvgUseElementsToBypass && uses.length - numberOfSvgUseElementsToBypass <= 0) {
            return void requestAnimationFrame(oninterval, 67);
          } // if there are <use>s to process, proceed.
          // reset the bypass counter, since the counter will be incremented for every bypassed element,
          // even ones that were counted before.


          numberOfSvgUseElementsToBypass = 0; // while the index exists in the live <use> collection

          for ( // get the cached <use> index
          var index = 0; index < uses.length;) {
            // get the current <use>
            var use = uses[index],
                parent = use.parentNode,
                svg = getSVGAncestor(parent),
                src = use.getAttribute("xlink:href") || use.getAttribute("href");

            if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)), svg && src) {
              if (polyfill) {
                if (!opts.validate || opts.validate(src, svg, use)) {
                  // remove the <use> element
                  parent.removeChild(use); // parse the src and get the url and id

                  var srcSplit = src.split("#"),
                      url = srcSplit.shift(),
                      id = srcSplit.join("#"); // if the link is external

                  if (url.length) {
                    // get the cached xhr request
                    var xhr = requests[url]; // ensure the xhr request exists

                    xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                    xhr._embeds.push({
                      parent: parent,
                      svg: svg,
                      id: id
                    }), // prepare the xhr ready state change event
                    loadreadystatechange(xhr, use);
                  } else {
                    // embed the local id into the svg
                    embed(parent, svg, document.getElementById(id), use);
                  }
                } else {
                  // increase the index when the previous value was not "valid"
                  ++index, ++numberOfSvgUseElementsToBypass;
                }
              }
            } else {
              // increase the index when the previous value was not "valid"
              ++index;
            }
          } // continue the interval


          requestAnimationFrame(oninterval, 67);
        }

        var polyfill,
            opts = Object(rawopts),
            newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,
            webkitUA = /\bAppleWebKit\/(\d+)\b/,
            olderEdgeUA = /\bEdge\/12\.(\d+)\b/,
            edgeUA = /\bEdge\/.(\d+)\b/,
            inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe; // create xhr requests object

        var requests = {},
            requestAnimationFrame = window.requestAnimationFrame || setTimeout,
            uses = document.getElementsByTagName("use"),
            numberOfSvgUseElementsToBypass = 0; // conditionally start the interval if the polyfill is active

        polyfill && oninterval();
      }

      function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode);) {}

        return svg;
      }

      return svg4everybody;
    });
  }, {}],
  43: [function (require, module, exports) {
    "use strict";

    var domready = require("domready");

    window.uswdsPresent = true; // GLOBAL variable to indicate that the uswds.js has loaded in the DOM.

    /**
     * The 'polyfills' define key ECMAScript 5 methods that may be missing from
     * older browsers, so must be loaded first.
     */

    require("./polyfills");

    var uswds = require("./config");

    var components = require("./components");

    var svg4everybody = require("./polyfills/svg4everybody");

    uswds.components = components;
    domready(function () {
      var target = document.body;
      Object.keys(components).forEach(function (key) {
        var behavior = components[key];
        behavior.on(target);
      });
      svg4everybody();
    });
    module.exports = uswds;
  }, {
    "./components": 25,
    "./config": 36,
    "./polyfills": 40,
    "./polyfills/svg4everybody": 42,
    "domready": 2
  }],
  44: [function (require, module, exports) {
    "use strict";

    module.exports = function () {
      var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      return htmlDocument.activeElement;
    };
  }, {}],
  45: [function (require, module, exports) {
    "use strict";

    var assign = require("object-assign");

    var Behavior = require("receptor/behavior");
    /**
     * @name sequence
     * @param {...Function} seq an array of functions
     * @return { closure } callHooks
     */
    // We use a named function here because we want it to inherit its lexical scope
    // from the behavior props object, not from the module


    var sequence = function sequence() {
      for (var _len = arguments.length, seq = new Array(_len), _key = 0; _key < _len; _key++) {
        seq[_key] = arguments[_key];
      }

      return function callHooks() {
        var _this = this;

        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
        seq.forEach(function (method) {
          if (typeof _this[method] === "function") {
            _this[method].call(_this, target);
          }
        });
      };
    };
    /**
     * @name behavior
     * @param {object} events
     * @param {object?} props
     * @return {receptor.behavior}
     */


    module.exports = function (events, props) {
      return Behavior(events, assign({
        on: sequence("init", "add"),
        off: sequence("teardown", "remove")
      }, props));
    };
  }, {
    "object-assign": 7,
    "receptor/behavior": 8
  }],
  46: [function (require, module, exports) {
    "use strict";

    var assign = require("object-assign");

    var _require = require("receptor"),
        keymap = _require.keymap;

    var behavior = require("./behavior");

    var select = require("./select");

    var activeElement = require("./active-element");

    var FOCUSABLE = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

    var tabHandler = function tabHandler(context) {
      var focusableElements = select(FOCUSABLE, context);
      var firstTabStop = focusableElements[0];
      var lastTabStop = focusableElements[focusableElements.length - 1]; // Special rules for when the user is tabbing forward from the last focusable element,
      // or when tabbing backwards from the first focusable element

      function tabAhead(event) {
        if (activeElement() === lastTabStop) {
          event.preventDefault();
          firstTabStop.focus();
        }
      }

      function tabBack(event) {
        if (activeElement() === firstTabStop) {
          event.preventDefault();
          lastTabStop.focus();
        } // This checks if you want to set the initial focus to a container
        // instead of an element within, and the user tabs back. 
        // Then we set the focus to the first
        else if (!focusableElements.includes(activeElement())) {
            event.preventDefault();
            firstTabStop.focus();
          }
      }

      return {
        firstTabStop: firstTabStop,
        lastTabStop: lastTabStop,
        tabAhead: tabAhead,
        tabBack: tabBack
      };
    };

    module.exports = function (context) {
      var additionalKeyBindings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var tabEventHandler = tabHandler(context);
      var bindings = additionalKeyBindings;
      var Esc = bindings.Esc,
          Escape = bindings.Escape;
      if (Escape && !Esc) bindings.Esc = Escape; //  TODO: In the future, loop over additional keybindings and pass an array
      // of functions, if necessary, to the map keys. Then people implementing
      // the focus trap could pass callbacks to fire when tabbing

      var keyMappings = keymap(assign({
        Tab: tabEventHandler.tabAhead,
        "Shift+Tab": tabEventHandler.tabBack
      }, additionalKeyBindings));
      var focusTrap = behavior({
        keydown: keyMappings
      }, {
        init: function init() {
          // TODO: is this desireable behavior? Should the trap always do this by default or should
          // the component getting decorated handle this?
          if (tabEventHandler.firstTabStop) {
            tabEventHandler.firstTabStop.focus();
          }
        },
        update: function update(isActive) {
          if (isActive) {
            this.on();
          } else {
            this.off();
          }
        }
      });
      return focusTrap;
    };
  }, {
    "./active-element": 44,
    "./behavior": 45,
    "./select": 50,
    "object-assign": 7,
    "receptor": 13
  }],
  47: [function (require, module, exports) {
    "use strict"; // https://stackoverflow.com/a/7557433

    function isElementInViewport(el) {
      var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
      var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
      var rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
    }

    module.exports = isElementInViewport;
  }, {}],
  48: [function (require, module, exports) {
    "use strict"; // iOS detection from: http://stackoverflow.com/a/9039885/177710

    function isIosDevice() {
      return typeof navigator !== "undefined" && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
    }

    module.exports = isIosDevice;
  }, {}],
  49: [function (require, module, exports) {
    "use strict";

    module.exports = function getScrollbarWidth() {
      // Creating invisible container
      var outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll'; // forcing scrollbar to appear

      outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

      document.body.appendChild(outer); // Creating inner element and placing it in the container

      var inner = document.createElement('div');
      outer.appendChild(inner); // Calculating difference between container's full width and the child width

      var scrollbarWidth = "".concat(outer.offsetWidth - inner.offsetWidth, "px"); // Removing temporary elements from the DOM

      outer.parentNode.removeChild(outer);
      return scrollbarWidth;
    };
  }, {}],
  50: [function (require, module, exports) {
    "use strict";

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }
    /**
     * @name isElement
     * @desc returns whether or not the given argument is a DOM element.
     * @param {any} value
     * @return {boolean}
     */


    var isElement = function isElement(value) {
      return value && _typeof(value) === "object" && value.nodeType === 1;
    };
    /**
     * @name select
     * @desc selects elements from the DOM by class selector or ID selector.
     * @param {string} selector - The selector to traverse the DOM with.
     * @param {Document|HTMLElement?} context - The context to traverse the DOM
     *   in. If not provided, it defaults to the document.
     * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
     */


    module.exports = function (selector, context) {
      if (typeof selector !== "string") {
        return [];
      }

      if (!context || !isElement(context)) {
        context = window.document; // eslint-disable-line no-param-reassign
      }

      var selection = context.querySelectorAll(selector);
      return Array.prototype.slice.call(selection);
    };
  }, {}],
  51: [function (require, module, exports) {
    "use strict";
    /**
     * Flips given INPUT elements between masked (hiding the field value) and unmasked
     * @param {Array.HTMLElement} fields - An array of INPUT elements
     * @param {Boolean} mask - Whether the mask should be applied, hiding the field value
     */

    module.exports = function (field, mask) {
      field.setAttribute("autocapitalize", "off");
      field.setAttribute("autocorrect", "off");
      field.setAttribute("type", mask ? "password" : "text");
    };
  }, {}],
  52: [function (require, module, exports) {
    "use strict";

    var resolveIdRefs = require("resolve-id-refs");

    var toggleFieldMask = require("./toggle-field-mask");

    var CONTROLS = "aria-controls";
    var PRESSED = "aria-pressed";
    var SHOW_ATTR = "data-show-text";
    var HIDE_ATTR = "data-hide-text";
    /**
     * Replace the word "Show" (or "show") with "Hide" (or "hide") in a string.
     * @param {string} showText
     * @return {strong} hideText
     */

    var getHideText = function getHideText(showText) {
      return showText.replace(/\bShow\b/i, function (show) {
        return "".concat(show[0] === "S" ? "H" : "h", "ide");
      });
    };
    /**
     * Component that decorates an HTML element with the ability to toggle the
     * masked state of an input field (like a password) when clicked.
     * The ids of the fields to be masked will be pulled directly from the button's
     * `aria-controls` attribute.
     *
     * @param  {HTMLElement} el    Parent element containing the fields to be masked
     * @return {boolean}
     */


    module.exports = function (el) {
      // this is the *target* state:
      // * if the element has the attr and it's !== "true", pressed is true
      // * otherwise, pressed is false
      var pressed = el.hasAttribute(PRESSED) && el.getAttribute(PRESSED) !== "true";
      var fields = resolveIdRefs(el.getAttribute(CONTROLS));
      fields.forEach(function (field) {
        return toggleFieldMask(field, pressed);
      });

      if (!el.hasAttribute(SHOW_ATTR)) {
        el.setAttribute(SHOW_ATTR, el.textContent);
      }

      var showText = el.getAttribute(SHOW_ATTR);
      var hideText = el.getAttribute(HIDE_ATTR) || getHideText(showText);
      el.textContent = pressed ? showText : hideText; // eslint-disable-line no-param-reassign

      el.setAttribute(PRESSED, pressed);
      return pressed;
    };
  }, {
    "./toggle-field-mask": 51,
    "resolve-id-refs": 16
  }],
  53: [function (require, module, exports) {
    "use strict";

    var EXPANDED = "aria-expanded";
    var CONTROLS = "aria-controls";
    var HIDDEN = "hidden";

    module.exports = function (button, expanded) {
      var safeExpanded = expanded;

      if (typeof safeExpanded !== "boolean") {
        safeExpanded = button.getAttribute(EXPANDED) === "false";
      }

      button.setAttribute(EXPANDED, safeExpanded);
      var id = button.getAttribute(CONTROLS);
      var controls = document.getElementById(id);

      if (!controls) {
        throw new Error("No toggle target found with id: \"".concat(id, "\""));
      }

      if (safeExpanded) {
        controls.removeAttribute(HIDDEN);
      } else {
        controls.setAttribute(HIDDEN, "");
      }

      return safeExpanded;
    };
  }, {}],
  54: [function (require, module, exports) {
    "use strict";

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    var dataset = require("elem-dataset");

    var _require = require("../config"),
        PREFIX = _require.prefix;

    var CHECKED = "aria-checked";
    var CHECKED_CLASS = "".concat(PREFIX, "-checklist__item--checked");

    module.exports = function validate(el) {
      var data = dataset(el);
      var id = data.validationElement;
      var checkList = id.charAt(0) === "#" ? document.querySelector(id) : document.getElementById(id);

      if (!checkList) {
        throw new Error("No validation element found with id: \"".concat(id, "\""));
      }

      Object.entries(data).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        if (key.startsWith("validate")) {
          var validatorName = key.substr("validate".length).toLowerCase();
          var validatorPattern = new RegExp(value);
          var validatorSelector = "[data-validator=\"".concat(validatorName, "\"]");
          var validatorCheckbox = checkList.querySelector(validatorSelector);

          if (!validatorCheckbox) {
            throw new Error("No validator checkbox found for: \"".concat(validatorName, "\""));
          }

          var checked = validatorPattern.test(el.value);
          validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);
          validatorCheckbox.setAttribute(CHECKED, checked);
        }
      });
    };
  }, {
    "../config": 36,
    "elem-dataset": 3
  }]
}, {}, [43]);
},{}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/jquery/dist/jquery.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var define;
/*!
 * jQuery JavaScript Library v3.6.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2021-03-02T17:08Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.6.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						// Support: Chrome 86+
						// In Chrome, if an element having a focusout handler is blurred by
						// clicking outside of it, it invokes the handler synchronously. If
						// that handler calls `.remove()` on the element, the data is cleared,
						// leaving `result` undefined. We need to guard against this.
						return result && result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		// Suppress native focus or blur as it's already being fired
		// in leverageNative.
		_default: function() {
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is display: block
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{"process":"../node_modules/process/browser.js"}],"../node_modules/lity/dist/lity.js":[function(require,module,exports) {
var define;
/*! Lity - v2.4.1 - 2020-04-26
* http://sorgalla.com/lity/
* Copyright (c) 2015-2020 Jan Sorgalla; Licensed MIT */
(function(window, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            return factory(window, $);
        });
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(window, require('jquery'));
    } else {
        window.lity = factory(window, window.jQuery || window.Zepto);
    }
}(typeof window !== "undefined" ? window : this, function(window, $) {
    'use strict';

    var document = window.document;

    var _win = $(window);
    var _deferred = $.Deferred;
    var _html = $('html');
    var _instances = [];

    var _attrAriaHidden = 'aria-hidden';
    var _dataAriaHidden = 'lity-' + _attrAriaHidden;

    var _focusableElementsSelector = 'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';

    var _defaultOptions = {
        esc: true,
        handler: null,
        handlers: {
            image: imageHandler,
            inline: inlineHandler,
            youtube: youtubeHandler,
            vimeo: vimeoHandler,
            googlemaps: googlemapsHandler,
            facebookvideo: facebookvideoHandler,
            iframe: iframeHandler
        },
        template: '<div class="lity" role="dialog" aria-label="Dialog Window (Press escape to close)" tabindex="-1"><div class="lity-wrap" data-lity-close role="document"><div class="lity-loader" aria-hidden="true">Loading...</div><div class="lity-container"><div class="lity-content"></div><button class="lity-close" type="button" aria-label="Close (Press escape to close)" data-lity-close>&times;</button></div></div></div>'
    };

    var _imageRegexp = /(^data:image\/)|(\.(png|jpe?g|gif|svg|webp|bmp|ico|tiff?)(\?\S*)?$)/i;
    var _youtubeRegex = /(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i;
    var _vimeoRegex =  /(vimeo(pro)?.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/;
    var _googlemapsRegex = /((maps|www)\.)?google\.([^\/\?]+)\/?((maps\/?)?\?)(.*)/i;
    var _facebookvideoRegex = /(facebook\.com)\/([a-z0-9_-]*)\/videos\/([0-9]*)(.*)?$/i;

    var _transitionEndEvent = (function() {
        var el = document.createElement('div');

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }

        return false;
    })();

    function transitionEnd(element) {
        var deferred = _deferred();

        if (!_transitionEndEvent || !element.length) {
            deferred.resolve();
        } else {
            element.one(_transitionEndEvent, deferred.resolve);
            setTimeout(deferred.resolve, 500);
        }

        return deferred.promise();
    }

    function settings(currSettings, key, value) {
        if (arguments.length === 1) {
            return $.extend({}, currSettings);
        }

        if (typeof key === 'string') {
            if (typeof value === 'undefined') {
                return typeof currSettings[key] === 'undefined'
                    ? null
                    : currSettings[key];
            }

            currSettings[key] = value;
        } else {
            $.extend(currSettings, key);
        }

        return this;
    }

    function parseQueryParams(params) {
        var pairs = decodeURI(params.split('#')[0]).split('&');
        var obj = {}, p;

        for (var i = 0, n = pairs.length; i < n; i++) {
            if (!pairs[i]) {
                continue;
            }

            p = pairs[i].split('=');
            obj[p[0]] = p[1];
        }

        return obj;
    }

    function appendQueryParams(url, params) {
        return url + (url.indexOf('?') > -1 ? '&' : '?') + $.param(params);
    }

    function transferHash(originalUrl, newUrl) {
        var pos = originalUrl.indexOf('#');

        if (-1 === pos) {
            return newUrl;
        }

        if (pos > 0) {
            originalUrl = originalUrl.substr(pos);
        }

        return newUrl + originalUrl;
    }

    function error(msg) {
        return $('<span class="lity-error"></span>').append(msg);
    }

    function imageHandler(target, instance) {
        var desc = (instance.opener() && instance.opener().data('lity-desc')) || 'Image with no description';
        var img = $('<img src="' + target + '" alt="' + desc + '"/>');
        var deferred = _deferred();
        var failed = function() {
            deferred.reject(error('Failed loading image'));
        };

        img
            .on('load', function() {
                if (this.naturalWidth === 0) {
                    return failed();
                }

                deferred.resolve(img);
            })
            .on('error', failed)
        ;

        return deferred.promise();
    }

    imageHandler.test = function(target) {
        return _imageRegexp.test(target);
    };

    function inlineHandler(target, instance) {
        var el, placeholder, hasHideClass;

        try {
            el = $(target);
        } catch (e) {
            return false;
        }

        if (!el.length) {
            return false;
        }

        placeholder = $('<i style="display:none !important"></i>');
        hasHideClass = el.hasClass('lity-hide');

        instance
            .element()
            .one('lity:remove', function() {
                placeholder
                    .before(el)
                    .remove()
                ;

                if (hasHideClass && !el.closest('.lity-content').length) {
                    el.addClass('lity-hide');
                }
            })
        ;

        return el
            .removeClass('lity-hide')
            .after(placeholder)
        ;
    }

    function youtubeHandler(target) {
        var matches = _youtubeRegex.exec(target);

        if (!matches) {
            return false;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://www.youtube' + (matches[2] || '') + '.com/embed/' + matches[4],
                    $.extend(
                        {
                            autoplay: 1
                        },
                        parseQueryParams(matches[5] || '')
                    )
                )
            )
        );
    }

    function vimeoHandler(target) {
        var matches = _vimeoRegex.exec(target);

        if (!matches) {
            return false;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://player.vimeo.com/video/' + matches[3],
                    $.extend(
                        {
                            autoplay: 1
                        },
                        parseQueryParams(matches[4] || '')
                    )
                )
            )
        );
    }

    function facebookvideoHandler(target) {
        var matches = _facebookvideoRegex.exec(target);

        if (!matches) {
            return false;
        }

        if (0 !== target.indexOf('http')) {
            target = 'https:' + target;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://www.facebook.com/plugins/video.php?href=' + target,
                    $.extend(
                        {
                            autoplay: 1
                        },
                        parseQueryParams(matches[4] || '')
                    )
                )
            )
        );
    }

    function googlemapsHandler(target) {
        var matches = _googlemapsRegex.exec(target);

        if (!matches) {
            return false;
        }

        return iframeHandler(
            transferHash(
                target,
                appendQueryParams(
                    'https://www.google.' + matches[3] + '/maps?' + matches[6],
                    {
                        output: matches[6].indexOf('layer=c') > 0 ? 'svembed' : 'embed'
                    }
                )
            )
        );
    }

    function iframeHandler(target) {
        return '<div class="lity-iframe-container"><iframe frameborder="0" allowfullscreen allow="autoplay; fullscreen" src="' + target + '"/></div>';
    }

    function winHeight() {
        return document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : Math.round(_win.height());
    }

    function keydown(e) {
        var current = currentInstance();

        if (!current) {
            return;
        }

        // ESC key
        if (e.keyCode === 27 && !!current.options('esc')) {
            current.close();
        }

        // TAB key
        if (e.keyCode === 9) {
            handleTabKey(e, current);
        }
    }

    function handleTabKey(e, instance) {
        var focusableElements = instance.element().find(_focusableElementsSelector);
        var focusedIndex = focusableElements.index(document.activeElement);

        if (e.shiftKey && focusedIndex <= 0) {
            focusableElements.get(focusableElements.length - 1).focus();
            e.preventDefault();
        } else if (!e.shiftKey && focusedIndex === focusableElements.length - 1) {
            focusableElements.get(0).focus();
            e.preventDefault();
        }
    }

    function resize() {
        $.each(_instances, function(i, instance) {
            instance.resize();
        });
    }

    function registerInstance(instanceToRegister) {
        if (1 === _instances.unshift(instanceToRegister)) {
            _html.addClass('lity-active');

            _win
                .on({
                    resize: resize,
                    keydown: keydown
                })
            ;
        }

        $('body > *').not(instanceToRegister.element())
            .addClass('lity-hidden')
            .each(function() {
                var el = $(this);

                if (undefined !== el.data(_dataAriaHidden)) {
                    return;
                }

                el.data(_dataAriaHidden, el.attr(_attrAriaHidden) || null);
            })
            .attr(_attrAriaHidden, 'true')
        ;
    }

    function removeInstance(instanceToRemove) {
        var show;

        instanceToRemove
            .element()
            .attr(_attrAriaHidden, 'true')
        ;

        if (1 === _instances.length) {
            _html.removeClass('lity-active');

            _win
                .off({
                    resize: resize,
                    keydown: keydown
                })
            ;
        }

        _instances = $.grep(_instances, function(instance) {
            return instanceToRemove !== instance;
        });

        if (!!_instances.length) {
            show = _instances[0].element();
        } else {
            show = $('.lity-hidden');
        }

        show
            .removeClass('lity-hidden')
            .each(function() {
                var el = $(this), oldAttr = el.data(_dataAriaHidden);

                if (!oldAttr) {
                    el.removeAttr(_attrAriaHidden);
                } else {
                    el.attr(_attrAriaHidden, oldAttr);
                }

                el.removeData(_dataAriaHidden);
            })
        ;
    }

    function currentInstance() {
        if (0 === _instances.length) {
            return null;
        }

        return _instances[0];
    }

    function factory(target, instance, handlers, preferredHandler) {
        var handler = 'inline', content;

        var currentHandlers = $.extend({}, handlers);

        if (preferredHandler && currentHandlers[preferredHandler]) {
            content = currentHandlers[preferredHandler](target, instance);
            handler = preferredHandler;
        } else {
            // Run inline and iframe handlers after all other handlers
            $.each(['inline', 'iframe'], function(i, name) {
                delete currentHandlers[name];

                currentHandlers[name] = handlers[name];
            });

            $.each(currentHandlers, function(name, currentHandler) {
                // Handler might be "removed" by setting callback to null
                if (!currentHandler) {
                    return true;
                }

                if (
                    currentHandler.test &&
                    !currentHandler.test(target, instance)
                ) {
                    return true;
                }

                content = currentHandler(target, instance);

                if (false !== content) {
                    handler = name;
                    return false;
                }
            });
        }

        return {handler: handler, content: content || ''};
    }

    function Lity(target, options, opener, activeElement) {
        var self = this;
        var result;
        var isReady = false;
        var isClosed = false;
        var element;
        var content;

        options = $.extend(
            {},
            _defaultOptions,
            options
        );

        element = $(options.template);

        // -- API --

        self.element = function() {
            return element;
        };

        self.opener = function() {
            return opener;
        };

        self.options  = $.proxy(settings, self, options);
        self.handlers = $.proxy(settings, self, options.handlers);

        self.resize = function() {
            if (!isReady || isClosed) {
                return;
            }

            content
                .css('max-height', winHeight() + 'px')
                .trigger('lity:resize', [self])
            ;
        };

        self.close = function() {
            if (!isReady || isClosed) {
                return;
            }

            isClosed = true;

            removeInstance(self);

            var deferred = _deferred();

            // We return focus only if the current focus is inside this instance
            if (
                activeElement &&
                (
                    document.activeElement === element[0] ||
                    $.contains(element[0], document.activeElement)
                )
            ) {
                try {
                    activeElement.focus();
                } catch (e) {
                    // Ignore exceptions, eg. for SVG elements which can't be
                    // focused in IE11
                }
            }

            content.trigger('lity:close', [self]);

            element
                .removeClass('lity-opened')
                .addClass('lity-closed')
            ;

            transitionEnd(content.add(element))
                .always(function() {
                    content.trigger('lity:remove', [self]);
                    element.remove();
                    element = undefined;
                    deferred.resolve();
                })
            ;

            return deferred.promise();
        };

        // -- Initialization --

        result = factory(target, self, options.handlers, options.handler);

        element
            .attr(_attrAriaHidden, 'false')
            .addClass('lity-loading lity-opened lity-' + result.handler)
            .appendTo('body')
            .focus()
            .on('click', '[data-lity-close]', function(e) {
                if ($(e.target).is('[data-lity-close]')) {
                    self.close();
                }
            })
            .trigger('lity:open', [self])
        ;

        registerInstance(self);

        $.when(result.content)
            .always(ready)
        ;

        function ready(result) {
            content = $(result)
                .css('max-height', winHeight() + 'px')
            ;

            element
                .find('.lity-loader')
                .each(function() {
                    var loader = $(this);

                    transitionEnd(loader)
                        .always(function() {
                            loader.remove();
                        })
                    ;
                })
            ;

            element
                .removeClass('lity-loading')
                .find('.lity-content')
                .empty()
                .append(content)
            ;

            isReady = true;

            content
                .trigger('lity:ready', [self])
            ;
        }
    }

    function lity(target, options, opener) {
        if (!target.preventDefault) {
            opener = $(opener);
        } else {
            target.preventDefault();
            opener = $(this);
            target = opener.data('lity-target') || opener.attr('href') || opener.attr('src');
        }

        var instance = new Lity(
            target,
            $.extend(
                {},
                opener.data('lity-options') || opener.data('lity'),
                options
            ),
            opener,
            document.activeElement
        );

        if (!target.preventDefault) {
            return instance;
        }
    }

    lity.version  = '2.4.1';
    lity.options  = $.proxy(settings, lity, _defaultOptions);
    lity.handlers = $.proxy(settings, lity, _defaultOptions.handlers);
    lity.current  = currentInstance;

    $(document).on('click.lity', '[data-lity]', lity);

    return lity;
}));

},{"jquery":"../node_modules/jquery/dist/jquery.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _uswds = _interopRequireDefault(require("../node_modules/uswds/dist/js/uswds"));

var _jquery = _interopRequireDefault(require("../node_modules/jquery/dist/jquery"));

var _lity = _interopRequireDefault(require("../node_modules/lity/dist/lity"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jQuery(function () {
  // global code here
  console.log('Start your engines...');
}); // attach lightbox to product image

jQuery(document).on('click', '.woocommerce-product-gallery__image a', _lity.default);
},{"../node_modules/uswds/dist/js/uswds":"../node_modules/uswds/dist/js/uswds.js","../node_modules/jquery/dist/jquery":"../node_modules/jquery/dist/jquery.js","../node_modules/lity/dist/lity":"../node_modules/lity/dist/lity.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55790" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.js.map