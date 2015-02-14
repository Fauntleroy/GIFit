(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/content.jsx":[function(require,module,exports){
// automatically inject CSS
require('./styles/content.less');

var React = require('react');

var GifitButton = require('./components/GifitButton.jsx');
var GifitApp = require('./components/GifitApp.jsx');

var toggleApp = function(){
	if( app_shown ){
		GifitApp.hide();
	} else {
		GifitApp.show();
	}
};

var youtube_player_chrome_element = document.querySelector('#player-api .html5-player-chrome');
var youtube_player_controls_element = document.querySelector('#player-api .html5-video-controls');

// We need containers since React.renderComponent annihilates the contents of its target
var gifit_button_container_element = document.createElement('div');
gifit_button_container_element.classList.add('ytp-button', 'ytp-button-gif');
var gifit_app_container_element = document.createElement('div');
youtube_player_chrome_element.appendChild( gifit_button_container_element );
youtube_player_controls_element.appendChild( gifit_app_container_element );

React.render( React.createElement(GifitButton, {onClick: toggleApp}), gifit_button_container_element );
React.render( React.createElement(GifitApp, null), gifit_app_container_element );

},{"./components/GifitApp.jsx":"c:\\Users\\Timothy\\repos\\gifit\\src\\components\\GifitApp.jsx","./components/GifitButton.jsx":"c:\\Users\\Timothy\\repos\\gifit\\src\\components\\GifitButton.jsx","./styles/content.less":"c:\\Users\\Timothy\\repos\\gifit\\src\\styles\\content.less","react":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\react.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\events\\events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\inherits\\inherits_browser.js":[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\util\\support\\isBufferBrowser.js":[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\util\\util.js":[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\util\\support\\isBufferBrowser.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js","inherits":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\inherits\\inherits_browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\lessify\\node_modules\\cssify\\browser.js":[function(require,module,exports){
module.exports = function (css) {
  var head = document.getElementsByTagName('head')[0],
      style = document.createElement('style');

  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  
  head.appendChild(style);
};

module.exports.byUrl = function(url) {
  var head = document.getElementsByTagName('head')[0],
      link = document.createElement('link');

  link.rel = 'stylesheet';
  link.href = url;
  
  head.appendChild(link);
};
},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\lessify\\transform.js":[function(require,module,exports){
module.exports = require('cssify');

},{"cssify":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\lessify\\node_modules\\cssify\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\AutoFocusMixin.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AutoFocusMixin
 * @typechecks static-only
 */

"use strict";

var focusNode = require("./focusNode");

var AutoFocusMixin = {
  componentDidMount: function() {
    if (this.props.autoFocus) {
      focusNode(this.getDOMNode());
    }
  }
};

module.exports = AutoFocusMixin;

},{"./focusNode":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\focusNode.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\BeforeInputEventPlugin.js":[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule BeforeInputEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var SyntheticInputEvent = require("./SyntheticInputEvent");

var keyOf = require("./keyOf");

var canUseTextInputEvent = (
  ExecutionEnvironment.canUseDOM &&
  'TextEvent' in window &&
  !('documentMode' in document || isPresto())
);

/**
 * Opera <= 12 includes TextEvent in window, but does not fire
 * text input events. Rely on keypress instead.
 */
function isPresto() {
  var opera = window.opera;
  return (
    typeof opera === 'object' &&
    typeof opera.version === 'function' &&
    parseInt(opera.version(), 10) <= 12
  );
}

var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

var topLevelTypes = EventConstants.topLevelTypes;

// Events and their corresponding property names.
var eventTypes = {
  beforeInput: {
    phasedRegistrationNames: {
      bubbled: keyOf({onBeforeInput: null}),
      captured: keyOf({onBeforeInputCapture: null})
    },
    dependencies: [
      topLevelTypes.topCompositionEnd,
      topLevelTypes.topKeyPress,
      topLevelTypes.topTextInput,
      topLevelTypes.topPaste
    ]
  }
};

// Track characters inserted via keypress and composition events.
var fallbackChars = null;

// Track whether we've ever handled a keypress on the space key.
var hasSpaceKeypress = false;

/**
 * Return whether a native keypress event is assumed to be a command.
 * This is required because Firefox fires `keypress` events for key commands
 * (cut, copy, select-all, etc.) even though no character is inserted.
 */
function isKeypressCommand(nativeEvent) {
  return (
    (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) &&
    // ctrlKey && altKey is equivalent to AltGr, and is not a command.
    !(nativeEvent.ctrlKey && nativeEvent.altKey)
  );
}

/**
 * Create an `onBeforeInput` event to match
 * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
 *
 * This event plugin is based on the native `textInput` event
 * available in Chrome, Safari, Opera, and IE. This event fires after
 * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
 *
 * `beforeInput` is spec'd but not implemented in any browsers, and
 * the `input` event does not provide any useful information about what has
 * actually been added, contrary to the spec. Thus, `textInput` is the best
 * available event to identify the characters that have actually been inserted
 * into the target node.
 */
var BeforeInputEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    var chars;

    if (canUseTextInputEvent) {
      switch (topLevelType) {
        case topLevelTypes.topKeyPress:
          /**
           * If native `textInput` events are available, our goal is to make
           * use of them. However, there is a special case: the spacebar key.
           * In Webkit, preventing default on a spacebar `textInput` event
           * cancels character insertion, but it *also* causes the browser
           * to fall back to its default spacebar behavior of scrolling the
           * page.
           *
           * Tracking at:
           * https://code.google.com/p/chromium/issues/detail?id=355103
           *
           * To avoid this issue, use the keypress event as if no `textInput`
           * event is available.
           */
          var which = nativeEvent.which;
          if (which !== SPACEBAR_CODE) {
            return;
          }

          hasSpaceKeypress = true;
          chars = SPACEBAR_CHAR;
          break;

        case topLevelTypes.topTextInput:
          // Record the characters to be added to the DOM.
          chars = nativeEvent.data;

          // If it's a spacebar character, assume that we have already handled
          // it at the keypress level and bail immediately. Android Chrome
          // doesn't give us keycodes, so we need to blacklist it.
          if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
            return;
          }

          // Otherwise, carry on.
          break;

        default:
          // For other native event types, do nothing.
          return;
      }
    } else {
      switch (topLevelType) {
        case topLevelTypes.topPaste:
          // If a paste event occurs after a keypress, throw out the input
          // chars. Paste events should not lead to BeforeInput events.
          fallbackChars = null;
          break;
        case topLevelTypes.topKeyPress:
          /**
           * As of v27, Firefox may fire keypress events even when no character
           * will be inserted. A few possibilities:
           *
           * - `which` is `0`. Arrow keys, Esc key, etc.
           *
           * - `which` is the pressed key code, but no char is available.
           *   Ex: 'AltGr + d` in Polish. There is no modified character for
           *   this key combination and no character is inserted into the
           *   document, but FF fires the keypress for char code `100` anyway.
           *   No `input` event will occur.
           *
           * - `which` is the pressed key code, but a command combination is
           *   being used. Ex: `Cmd+C`. No character is inserted, and no
           *   `input` event will occur.
           */
          if (nativeEvent.which && !isKeypressCommand(nativeEvent)) {
            fallbackChars = String.fromCharCode(nativeEvent.which);
          }
          break;
        case topLevelTypes.topCompositionEnd:
          fallbackChars = nativeEvent.data;
          break;
      }

      // If no changes have occurred to the fallback string, no relevant
      // event has fired and we're done.
      if (fallbackChars === null) {
        return;
      }

      chars = fallbackChars;
    }

    // If no characters are being inserted, no BeforeInput event should
    // be fired.
    if (!chars) {
      return;
    }

    var event = SyntheticInputEvent.getPooled(
      eventTypes.beforeInput,
      topLevelTargetID,
      nativeEvent
    );

    event.data = chars;
    fallbackChars = null;
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  }
};

module.exports = BeforeInputEventPlugin;

},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./EventPropagators":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPropagators.js","./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./SyntheticInputEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticInputEvent.js","./keyOf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CSSProperty.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSProperty
 */

"use strict";

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
var isUnitlessNumber = {
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  strokeOpacity: true
};

/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function(prop) {
  prefixes.forEach(function(prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

/**
 * Most style properties can be unset by doing .style[prop] = '' but IE8
 * doesn't like doing that with shorthand properties so for the properties that
 * IE8 breaks on, which are listed here, we instead unset each of the
 * individual properties. See http://bugs.jquery.com/ticket/12385.
 * The 4-value 'clock' properties like margin, padding, border-width seem to
 * behave without any problems. Curiously, list-style works too without any
 * special prodding.
 */
var shorthandPropertyExpansions = {
  background: {
    backgroundImage: true,
    backgroundPosition: true,
    backgroundRepeat: true,
    backgroundColor: true
  },
  border: {
    borderWidth: true,
    borderStyle: true,
    borderColor: true
  },
  borderBottom: {
    borderBottomWidth: true,
    borderBottomStyle: true,
    borderBottomColor: true
  },
  borderLeft: {
    borderLeftWidth: true,
    borderLeftStyle: true,
    borderLeftColor: true
  },
  borderRight: {
    borderRightWidth: true,
    borderRightStyle: true,
    borderRightColor: true
  },
  borderTop: {
    borderTopWidth: true,
    borderTopStyle: true,
    borderTopColor: true
  },
  font: {
    fontStyle: true,
    fontVariant: true,
    fontWeight: true,
    fontSize: true,
    lineHeight: true,
    fontFamily: true
  }
};

var CSSProperty = {
  isUnitlessNumber: isUnitlessNumber,
  shorthandPropertyExpansions: shorthandPropertyExpansions
};

module.exports = CSSProperty;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CSSPropertyOperations.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSPropertyOperations
 * @typechecks static-only
 */

"use strict";

var CSSProperty = require("./CSSProperty");
var ExecutionEnvironment = require("./ExecutionEnvironment");

var camelizeStyleName = require("./camelizeStyleName");
var dangerousStyleValue = require("./dangerousStyleValue");
var hyphenateStyleName = require("./hyphenateStyleName");
var memoizeStringOnly = require("./memoizeStringOnly");
var warning = require("./warning");

var processStyleName = memoizeStringOnly(function(styleName) {
  return hyphenateStyleName(styleName);
});

var styleFloatAccessor = 'cssFloat';
if (ExecutionEnvironment.canUseDOM) {
  // IE8 only supports accessing cssFloat (standard) as styleFloat
  if (document.documentElement.style.cssFloat === undefined) {
    styleFloatAccessor = 'styleFloat';
  }
}

if ("production" !== process.env.NODE_ENV) {
  var warnedStyleNames = {};

  var warnHyphenatedStyleName = function(name) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'Unsupported style property ' + name + '. Did you mean ' +
      camelizeStyleName(name) + '?'
    ) : null);
  };
}

/**
 * Operations for dealing with CSS properties.
 */
var CSSPropertyOperations = {

  /**
   * Serializes a mapping of style properties for use as inline styles:
   *
   *   > createMarkupForStyles({width: '200px', height: 0})
   *   "width:200px;height:0;"
   *
   * Undefined values are ignored so that declarative programming is easier.
   * The result should be HTML-escaped before insertion into the DOM.
   *
   * @param {object} styles
   * @return {?string}
   */
  createMarkupForStyles: function(styles) {
    var serialized = '';
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      if ("production" !== process.env.NODE_ENV) {
        if (styleName.indexOf('-') > -1) {
          warnHyphenatedStyleName(styleName);
        }
      }
      var styleValue = styles[styleName];
      if (styleValue != null) {
        serialized += processStyleName(styleName) + ':';
        serialized += dangerousStyleValue(styleName, styleValue) + ';';
      }
    }
    return serialized || null;
  },

  /**
   * Sets the value for multiple styles on a node.  If a value is specified as
   * '' (empty string), the corresponding style property will be unset.
   *
   * @param {DOMElement} node
   * @param {object} styles
   */
  setValueForStyles: function(node, styles) {
    var style = node.style;
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      if ("production" !== process.env.NODE_ENV) {
        if (styleName.indexOf('-') > -1) {
          warnHyphenatedStyleName(styleName);
        }
      }
      var styleValue = dangerousStyleValue(styleName, styles[styleName]);
      if (styleName === 'float') {
        styleName = styleFloatAccessor;
      }
      if (styleValue) {
        style[styleName] = styleValue;
      } else {
        var expansion = CSSProperty.shorthandPropertyExpansions[styleName];
        if (expansion) {
          // Shorthand property that IE8 won't like unsetting, so unset each
          // component to placate it
          for (var individualStyleName in expansion) {
            style[individualStyleName] = '';
          }
        } else {
          style[styleName] = '';
        }
      }
    }
  }

};

module.exports = CSSPropertyOperations;

}).call(this,require('_process'))
},{"./CSSProperty":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CSSProperty.js","./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./camelizeStyleName":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\camelizeStyleName.js","./dangerousStyleValue":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\dangerousStyleValue.js","./hyphenateStyleName":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\hyphenateStyleName.js","./memoizeStringOnly":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\memoizeStringOnly.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CallbackQueue.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CallbackQueue
 */

"use strict";

var PooledClass = require("./PooledClass");

var assign = require("./Object.assign");
var invariant = require("./invariant");

/**
 * A specialized pseudo-event module to help keep track of components waiting to
 * be notified when their DOM representations are available for use.
 *
 * This implements `PooledClass`, so you should never need to instantiate this.
 * Instead, use `CallbackQueue.getPooled()`.
 *
 * @class ReactMountReady
 * @implements PooledClass
 * @internal
 */
function CallbackQueue() {
  this._callbacks = null;
  this._contexts = null;
}

assign(CallbackQueue.prototype, {

  /**
   * Enqueues a callback to be invoked when `notifyAll` is invoked.
   *
   * @param {function} callback Invoked when `notifyAll` is invoked.
   * @param {?object} context Context to call `callback` with.
   * @internal
   */
  enqueue: function(callback, context) {
    this._callbacks = this._callbacks || [];
    this._contexts = this._contexts || [];
    this._callbacks.push(callback);
    this._contexts.push(context);
  },

  /**
   * Invokes all enqueued callbacks and clears the queue. This is invoked after
   * the DOM representation of a component has been created or updated.
   *
   * @internal
   */
  notifyAll: function() {
    var callbacks = this._callbacks;
    var contexts = this._contexts;
    if (callbacks) {
      ("production" !== process.env.NODE_ENV ? invariant(
        callbacks.length === contexts.length,
        "Mismatched list of contexts in callback queue"
      ) : invariant(callbacks.length === contexts.length));
      this._callbacks = null;
      this._contexts = null;
      for (var i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i].call(contexts[i]);
      }
      callbacks.length = 0;
      contexts.length = 0;
    }
  },

  /**
   * Resets the internal queue.
   *
   * @internal
   */
  reset: function() {
    this._callbacks = null;
    this._contexts = null;
  },

  /**
   * `PooledClass` looks for this.
   */
  destructor: function() {
    this.reset();
  }

});

PooledClass.addPoolingTo(CallbackQueue);

module.exports = CallbackQueue;

}).call(this,require('_process'))
},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./PooledClass":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\PooledClass.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ChangeEventPlugin.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ChangeEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var ReactUpdates = require("./ReactUpdates");
var SyntheticEvent = require("./SyntheticEvent");

var isEventSupported = require("./isEventSupported");
var isTextInputElement = require("./isTextInputElement");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  change: {
    phasedRegistrationNames: {
      bubbled: keyOf({onChange: null}),
      captured: keyOf({onChangeCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topChange,
      topLevelTypes.topClick,
      topLevelTypes.topFocus,
      topLevelTypes.topInput,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyUp,
      topLevelTypes.topSelectionChange
    ]
  }
};

/**
 * For IE shims
 */
var activeElement = null;
var activeElementID = null;
var activeElementValue = null;
var activeElementValueProp = null;

/**
 * SECTION: handle `change` event
 */
function shouldUseChangeEvent(elem) {
  return (
    elem.nodeName === 'SELECT' ||
    (elem.nodeName === 'INPUT' && elem.type === 'file')
  );
}

var doesChangeEventBubble = false;
if (ExecutionEnvironment.canUseDOM) {
  // See `handleChange` comment below
  doesChangeEventBubble = isEventSupported('change') && (
    !('documentMode' in document) || document.documentMode > 8
  );
}

function manualDispatchChangeEvent(nativeEvent) {
  var event = SyntheticEvent.getPooled(
    eventTypes.change,
    activeElementID,
    nativeEvent
  );
  EventPropagators.accumulateTwoPhaseDispatches(event);

  // If change and propertychange bubbled, we'd just bind to it like all the
  // other events and have it go through ReactBrowserEventEmitter. Since it
  // doesn't, we manually listen for the events and so we have to enqueue and
  // process the abstract event manually.
  //
  // Batching is necessary here in order to ensure that all event handlers run
  // before the next rerender (including event handlers attached to ancestor
  // elements instead of directly on the input). Without this, controlled
  // components don't work properly in conjunction with event bubbling because
  // the component is rerendered and the value reverted before all the event
  // handlers can run. See https://github.com/facebook/react/issues/708.
  ReactUpdates.batchedUpdates(runEventInBatch, event);
}

function runEventInBatch(event) {
  EventPluginHub.enqueueEvents(event);
  EventPluginHub.processEventQueue();
}

function startWatchingForChangeEventIE8(target, targetID) {
  activeElement = target;
  activeElementID = targetID;
  activeElement.attachEvent('onchange', manualDispatchChangeEvent);
}

function stopWatchingForChangeEventIE8() {
  if (!activeElement) {
    return;
  }
  activeElement.detachEvent('onchange', manualDispatchChangeEvent);
  activeElement = null;
  activeElementID = null;
}

function getTargetIDForChangeEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topChange) {
    return topLevelTargetID;
  }
}
function handleEventsForChangeEventIE8(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topFocus) {
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForChangeEventIE8();
    startWatchingForChangeEventIE8(topLevelTarget, topLevelTargetID);
  } else if (topLevelType === topLevelTypes.topBlur) {
    stopWatchingForChangeEventIE8();
  }
}


/**
 * SECTION: handle `input` event
 */
var isInputEventSupported = false;
if (ExecutionEnvironment.canUseDOM) {
  // IE9 claims to support the input event but fails to trigger it when
  // deleting text, so we ignore its input events
  isInputEventSupported = isEventSupported('input') && (
    !('documentMode' in document) || document.documentMode > 9
  );
}

/**
 * (For old IE.) Replacement getter/setter for the `value` property that gets
 * set on the active element.
 */
var newValueProp =  {
  get: function() {
    return activeElementValueProp.get.call(this);
  },
  set: function(val) {
    // Cast to a string so we can do equality checks.
    activeElementValue = '' + val;
    activeElementValueProp.set.call(this, val);
  }
};

/**
 * (For old IE.) Starts tracking propertychange events on the passed-in element
 * and override the value property so that we can distinguish user events from
 * value changes in JS.
 */
function startWatchingForValueChange(target, targetID) {
  activeElement = target;
  activeElementID = targetID;
  activeElementValue = target.value;
  activeElementValueProp = Object.getOwnPropertyDescriptor(
    target.constructor.prototype,
    'value'
  );

  Object.defineProperty(activeElement, 'value', newValueProp);
  activeElement.attachEvent('onpropertychange', handlePropertyChange);
}

/**
 * (For old IE.) Removes the event listeners from the currently-tracked element,
 * if any exists.
 */
function stopWatchingForValueChange() {
  if (!activeElement) {
    return;
  }

  // delete restores the original property definition
  delete activeElement.value;
  activeElement.detachEvent('onpropertychange', handlePropertyChange);

  activeElement = null;
  activeElementID = null;
  activeElementValue = null;
  activeElementValueProp = null;
}

/**
 * (For old IE.) Handles a propertychange event, sending a `change` event if
 * the value of the active element has changed.
 */
function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== 'value') {
    return;
  }
  var value = nativeEvent.srcElement.value;
  if (value === activeElementValue) {
    return;
  }
  activeElementValue = value;

  manualDispatchChangeEvent(nativeEvent);
}

/**
 * If a `change` event should be fired, returns the target's ID.
 */
function getTargetIDForInputEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topInput) {
    // In modern browsers (i.e., not IE8 or IE9), the input event is exactly
    // what we want so fall through here and trigger an abstract event
    return topLevelTargetID;
  }
}

// For IE8 and IE9.
function handleEventsForInputEventIE(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topFocus) {
    // In IE8, we can capture almost all .value changes by adding a
    // propertychange handler and looking for events with propertyName
    // equal to 'value'
    // In IE9, propertychange fires for most input events but is buggy and
    // doesn't fire when text is deleted, but conveniently, selectionchange
    // appears to fire in all of the remaining cases so we catch those and
    // forward the event if the value has changed
    // In either case, we don't want to call the event handler if the value
    // is changed from JS so we redefine a setter for `.value` that updates
    // our activeElementValue variable, allowing us to ignore those changes
    //
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForValueChange();
    startWatchingForValueChange(topLevelTarget, topLevelTargetID);
  } else if (topLevelType === topLevelTypes.topBlur) {
    stopWatchingForValueChange();
  }
}

// For IE8 and IE9.
function getTargetIDForInputEventIE(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topSelectionChange ||
      topLevelType === topLevelTypes.topKeyUp ||
      topLevelType === topLevelTypes.topKeyDown) {
    // On the selectionchange event, the target is just document which isn't
    // helpful for us so just check activeElement instead.
    //
    // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
    // propertychange on the first input event after setting `value` from a
    // script and fires only keydown, keypress, keyup. Catching keyup usually
    // gets it and catching keydown lets us fire an event for the first
    // keystroke if user does a key repeat (it'll be a little delayed: right
    // before the second keystroke). Other input methods (e.g., paste) seem to
    // fire selectionchange normally.
    if (activeElement && activeElement.value !== activeElementValue) {
      activeElementValue = activeElement.value;
      return activeElementID;
    }
  }
}


/**
 * SECTION: handle `click` event
 */
function shouldUseClickEvent(elem) {
  // Use the `click` event to detect changes to checkbox and radio inputs.
  // This approach works across all browsers, whereas `change` does not fire
  // until `blur` in IE8.
  return (
    elem.nodeName === 'INPUT' &&
    (elem.type === 'checkbox' || elem.type === 'radio')
  );
}

function getTargetIDForClickEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topClick) {
    return topLevelTargetID;
  }
}

/**
 * This plugin creates an `onChange` event that normalizes change events
 * across form elements. This event fires at a time when it's possible to
 * change the element's value without seeing a flicker.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - select
 */
var ChangeEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    var getTargetIDFunc, handleEventFunc;
    if (shouldUseChangeEvent(topLevelTarget)) {
      if (doesChangeEventBubble) {
        getTargetIDFunc = getTargetIDForChangeEvent;
      } else {
        handleEventFunc = handleEventsForChangeEventIE8;
      }
    } else if (isTextInputElement(topLevelTarget)) {
      if (isInputEventSupported) {
        getTargetIDFunc = getTargetIDForInputEvent;
      } else {
        getTargetIDFunc = getTargetIDForInputEventIE;
        handleEventFunc = handleEventsForInputEventIE;
      }
    } else if (shouldUseClickEvent(topLevelTarget)) {
      getTargetIDFunc = getTargetIDForClickEvent;
    }

    if (getTargetIDFunc) {
      var targetID = getTargetIDFunc(
        topLevelType,
        topLevelTarget,
        topLevelTargetID
      );
      if (targetID) {
        var event = SyntheticEvent.getPooled(
          eventTypes.change,
          targetID,
          nativeEvent
        );
        EventPropagators.accumulateTwoPhaseDispatches(event);
        return event;
      }
    }

    if (handleEventFunc) {
      handleEventFunc(
        topLevelType,
        topLevelTarget,
        topLevelTargetID
      );
    }
  }

};

module.exports = ChangeEventPlugin;

},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./EventPluginHub":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginHub.js","./EventPropagators":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPropagators.js","./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./ReactUpdates":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js","./SyntheticEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticEvent.js","./isEventSupported":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isEventSupported.js","./isTextInputElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isTextInputElement.js","./keyOf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ClientReactRootIndex.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ClientReactRootIndex
 * @typechecks
 */

"use strict";

var nextReactRootIndex = 0;

var ClientReactRootIndex = {
  createReactRootIndex: function() {
    return nextReactRootIndex++;
  }
};

module.exports = ClientReactRootIndex;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CompositionEventPlugin.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CompositionEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var ReactInputSelection = require("./ReactInputSelection");
var SyntheticCompositionEvent = require("./SyntheticCompositionEvent");

var getTextContentAccessor = require("./getTextContentAccessor");
var keyOf = require("./keyOf");

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
var START_KEYCODE = 229;

var useCompositionEvent = (
  ExecutionEnvironment.canUseDOM &&
  'CompositionEvent' in window
);

// In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. In Korean, for example,
// the compositionend event contains only one character regardless of
// how many characters have been composed since compositionstart.
// We therefore use the fallback data while still using the native
// events as triggers.
var useFallbackData = (
  !useCompositionEvent ||
  (
    'documentMode' in document &&
    document.documentMode > 8 &&
    document.documentMode <= 11
  )
);

var topLevelTypes = EventConstants.topLevelTypes;
var currentComposition = null;

// Events and their corresponding property names.
var eventTypes = {
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionEnd: null}),
      captured: keyOf({onCompositionEndCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionEnd,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionStart: null}),
      captured: keyOf({onCompositionStartCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionStart,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionUpdate: null}),
      captured: keyOf({onCompositionUpdateCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionUpdate,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  }
};

/**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */
function getCompositionEventType(topLevelType) {
  switch (topLevelType) {
    case topLevelTypes.topCompositionStart:
      return eventTypes.compositionStart;
    case topLevelTypes.topCompositionEnd:
      return eventTypes.compositionEnd;
    case topLevelTypes.topCompositionUpdate:
      return eventTypes.compositionUpdate;
  }
}

/**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackStart(topLevelType, nativeEvent) {
  return (
    topLevelType === topLevelTypes.topKeyDown &&
    nativeEvent.keyCode === START_KEYCODE
  );
}

/**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackEnd(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case topLevelTypes.topKeyUp:
      // Command keys insert or clear IME input.
      return (END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1);
    case topLevelTypes.topKeyDown:
      // Expect IME keyCode on each keydown. If we get any other
      // code we must have exited earlier.
      return (nativeEvent.keyCode !== START_KEYCODE);
    case topLevelTypes.topKeyPress:
    case topLevelTypes.topMouseDown:
    case topLevelTypes.topBlur:
      // Events are not possible without cancelling IME.
      return true;
    default:
      return false;
  }
}

/**
 * Helper class stores information about selection and document state
 * so we can figure out what changed at a later date.
 *
 * @param {DOMEventTarget} root
 */
function FallbackCompositionState(root) {
  this.root = root;
  this.startSelection = ReactInputSelection.getSelection(root);
  this.startValue = this.getText();
}

/**
 * Get current text of input.
 *
 * @return {string}
 */
FallbackCompositionState.prototype.getText = function() {
  return this.root.value || this.root[getTextContentAccessor()];
};

/**
 * Text that has changed since the start of composition.
 *
 * @return {string}
 */
FallbackCompositionState.prototype.getData = function() {
  var endValue = this.getText();
  var prefixLength = this.startSelection.start;
  var suffixLength = this.startValue.length - this.startSelection.end;

  return endValue.substr(
    prefixLength,
    endValue.length - suffixLength - prefixLength
  );
};

/**
 * This plugin creates `onCompositionStart`, `onCompositionUpdate` and
 * `onCompositionEnd` events on inputs, textareas and contentEditable
 * nodes.
 */
var CompositionEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    var eventType;
    var data;

    if (useCompositionEvent) {
      eventType = getCompositionEventType(topLevelType);
    } else if (!currentComposition) {
      if (isFallbackStart(topLevelType, nativeEvent)) {
        eventType = eventTypes.compositionStart;
      }
    } else if (isFallbackEnd(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionEnd;
    }

    if (useFallbackData) {
      // The current composition is stored statically and must not be
      // overwritten while composition continues.
      if (!currentComposition && eventType === eventTypes.compositionStart) {
        currentComposition = new FallbackCompositionState(topLevelTarget);
      } else if (eventType === eventTypes.compositionEnd) {
        if (currentComposition) {
          data = currentComposition.getData();
          currentComposition = null;
        }
      }
    }

    if (eventType) {
      var event = SyntheticCompositionEvent.getPooled(
        eventType,
        topLevelTargetID,
        nativeEvent
      );
      if (data) {
        // Inject data generated from fallback path into the synthetic event.
        // This matches the property of native CompositionEventInterface.
        event.data = data;
      }
      EventPropagators.accumulateTwoPhaseDispatches(event);
      return event;
    }
  }
};

module.exports = CompositionEventPlugin;

},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./EventPropagators":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPropagators.js","./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./ReactInputSelection":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInputSelection.js","./SyntheticCompositionEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticCompositionEvent.js","./getTextContentAccessor":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getTextContentAccessor.js","./keyOf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMChildrenOperations.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMChildrenOperations
 * @typechecks static-only
 */

"use strict";

var Danger = require("./Danger");
var ReactMultiChildUpdateTypes = require("./ReactMultiChildUpdateTypes");

var getTextContentAccessor = require("./getTextContentAccessor");
var invariant = require("./invariant");

/**
 * The DOM property to use when setting text content.
 *
 * @type {string}
 * @private
 */
var textContentAccessor = getTextContentAccessor();

/**
 * Inserts `childNode` as a child of `parentNode` at the `index`.
 *
 * @param {DOMElement} parentNode Parent node in which to insert.
 * @param {DOMElement} childNode Child node to insert.
 * @param {number} index Index at which to insert the child.
 * @internal
 */
function insertChildAt(parentNode, childNode, index) {
  // By exploiting arrays returning `undefined` for an undefined index, we can
  // rely exclusively on `insertBefore(node, null)` instead of also using
  // `appendChild(node)`. However, using `undefined` is not allowed by all
  // browsers so we must replace it with `null`.
  parentNode.insertBefore(
    childNode,
    parentNode.childNodes[index] || null
  );
}

var updateTextContent;
if (textContentAccessor === 'textContent') {
  /**
   * Sets the text content of `node` to `text`.
   *
   * @param {DOMElement} node Node to change
   * @param {string} text New text content
   */
  updateTextContent = function(node, text) {
    node.textContent = text;
  };
} else {
  /**
   * Sets the text content of `node` to `text`.
   *
   * @param {DOMElement} node Node to change
   * @param {string} text New text content
   */
  updateTextContent = function(node, text) {
    // In order to preserve newlines correctly, we can't use .innerText to set
    // the contents (see #1080), so we empty the element then append a text node
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    if (text) {
      var doc = node.ownerDocument || document;
      node.appendChild(doc.createTextNode(text));
    }
  };
}

/**
 * Operations for updating with DOM children.
 */
var DOMChildrenOperations = {

  dangerouslyReplaceNodeWithMarkup: Danger.dangerouslyReplaceNodeWithMarkup,

  updateTextContent: updateTextContent,

  /**
   * Updates a component's children by processing a series of updates. The
   * update configurations are each expected to have a `parentNode` property.
   *
   * @param {array<object>} updates List of update configurations.
   * @param {array<string>} markupList List of markup strings.
   * @internal
   */
  processUpdates: function(updates, markupList) {
    var update;
    // Mapping from parent IDs to initial child orderings.
    var initialChildren = null;
    // List of children that will be moved or removed.
    var updatedChildren = null;

    for (var i = 0; update = updates[i]; i++) {
      if (update.type === ReactMultiChildUpdateTypes.MOVE_EXISTING ||
          update.type === ReactMultiChildUpdateTypes.REMOVE_NODE) {
        var updatedIndex = update.fromIndex;
        var updatedChild = update.parentNode.childNodes[updatedIndex];
        var parentID = update.parentID;

        ("production" !== process.env.NODE_ENV ? invariant(
          updatedChild,
          'processUpdates(): Unable to find child %s of element. This ' +
          'probably means the DOM was unexpectedly mutated (e.g., by the ' +
          'browser), usually due to forgetting a <tbody> when using tables, ' +
          'nesting tags like <form>, <p>, or <a>, or using non-SVG elements '+
          'in an <svg> parent. Try inspecting the child nodes of the element ' +
          'with React ID `%s`.',
          updatedIndex,
          parentID
        ) : invariant(updatedChild));

        initialChildren = initialChildren || {};
        initialChildren[parentID] = initialChildren[parentID] || [];
        initialChildren[parentID][updatedIndex] = updatedChild;

        updatedChildren = updatedChildren || [];
        updatedChildren.push(updatedChild);
      }
    }

    var renderedMarkup = Danger.dangerouslyRenderMarkup(markupList);

    // Remove updated children first so that `toIndex` is consistent.
    if (updatedChildren) {
      for (var j = 0; j < updatedChildren.length; j++) {
        updatedChildren[j].parentNode.removeChild(updatedChildren[j]);
      }
    }

    for (var k = 0; update = updates[k]; k++) {
      switch (update.type) {
        case ReactMultiChildUpdateTypes.INSERT_MARKUP:
          insertChildAt(
            update.parentNode,
            renderedMarkup[update.markupIndex],
            update.toIndex
          );
          break;
        case ReactMultiChildUpdateTypes.MOVE_EXISTING:
          insertChildAt(
            update.parentNode,
            initialChildren[update.parentID][update.fromIndex],
            update.toIndex
          );
          break;
        case ReactMultiChildUpdateTypes.TEXT_CONTENT:
          updateTextContent(
            update.parentNode,
            update.textContent
          );
          break;
        case ReactMultiChildUpdateTypes.REMOVE_NODE:
          // Already removed by the for-loop above.
          break;
      }
    }
  }

};

module.exports = DOMChildrenOperations;

}).call(this,require('_process'))
},{"./Danger":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Danger.js","./ReactMultiChildUpdateTypes":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMultiChildUpdateTypes.js","./getTextContentAccessor":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getTextContentAccessor.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMProperty.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMProperty
 * @typechecks static-only
 */

/*jslint bitwise: true */

"use strict";

var invariant = require("./invariant");

function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}

var DOMPropertyInjection = {
  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  MUST_USE_ATTRIBUTE: 0x1,
  MUST_USE_PROPERTY: 0x2,
  HAS_SIDE_EFFECTS: 0x4,
  HAS_BOOLEAN_VALUE: 0x8,
  HAS_NUMERIC_VALUE: 0x10,
  HAS_POSITIVE_NUMERIC_VALUE: 0x20 | 0x10,
  HAS_OVERLOADED_BOOLEAN_VALUE: 0x40,

  /**
   * Inject some specialized knowledge about the DOM. This takes a config object
   * with the following properties:
   *
   * isCustomAttribute: function that given an attribute name will return true
   * if it can be inserted into the DOM verbatim. Useful for data-* or aria-*
   * attributes where it's impossible to enumerate all of the possible
   * attribute names,
   *
   * Properties: object mapping DOM property name to one of the
   * DOMPropertyInjection constants or null. If your attribute isn't in here,
   * it won't get written to the DOM.
   *
   * DOMAttributeNames: object mapping React attribute name to the DOM
   * attribute name. Attribute names not specified use the **lowercase**
   * normalized name.
   *
   * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
   * Property names not specified use the normalized name.
   *
   * DOMMutationMethods: Properties that require special mutation methods. If
   * `value` is undefined, the mutation method should unset the property.
   *
   * @param {object} domPropertyConfig the config as described above.
   */
  injectDOMPropertyConfig: function(domPropertyConfig) {
    var Properties = domPropertyConfig.Properties || {};
    var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
    var DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
    var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

    if (domPropertyConfig.isCustomAttribute) {
      DOMProperty._isCustomAttributeFunctions.push(
        domPropertyConfig.isCustomAttribute
      );
    }

    for (var propName in Properties) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !DOMProperty.isStandardName.hasOwnProperty(propName),
        'injectDOMPropertyConfig(...): You\'re trying to inject DOM property ' +
        '\'%s\' which has already been injected. You may be accidentally ' +
        'injecting the same DOM property config twice, or you may be ' +
        'injecting two configs that have conflicting property names.',
        propName
      ) : invariant(!DOMProperty.isStandardName.hasOwnProperty(propName)));

      DOMProperty.isStandardName[propName] = true;

      var lowerCased = propName.toLowerCase();
      DOMProperty.getPossibleStandardName[lowerCased] = propName;

      if (DOMAttributeNames.hasOwnProperty(propName)) {
        var attributeName = DOMAttributeNames[propName];
        DOMProperty.getPossibleStandardName[attributeName] = propName;
        DOMProperty.getAttributeName[propName] = attributeName;
      } else {
        DOMProperty.getAttributeName[propName] = lowerCased;
      }

      DOMProperty.getPropertyName[propName] =
        DOMPropertyNames.hasOwnProperty(propName) ?
          DOMPropertyNames[propName] :
          propName;

      if (DOMMutationMethods.hasOwnProperty(propName)) {
        DOMProperty.getMutationMethod[propName] = DOMMutationMethods[propName];
      } else {
        DOMProperty.getMutationMethod[propName] = null;
      }

      var propConfig = Properties[propName];
      DOMProperty.mustUseAttribute[propName] =
        checkMask(propConfig, DOMPropertyInjection.MUST_USE_ATTRIBUTE);
      DOMProperty.mustUseProperty[propName] =
        checkMask(propConfig, DOMPropertyInjection.MUST_USE_PROPERTY);
      DOMProperty.hasSideEffects[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_SIDE_EFFECTS);
      DOMProperty.hasBooleanValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_BOOLEAN_VALUE);
      DOMProperty.hasNumericValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_NUMERIC_VALUE);
      DOMProperty.hasPositiveNumericValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_POSITIVE_NUMERIC_VALUE);
      DOMProperty.hasOverloadedBooleanValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_OVERLOADED_BOOLEAN_VALUE);

      ("production" !== process.env.NODE_ENV ? invariant(
        !DOMProperty.mustUseAttribute[propName] ||
          !DOMProperty.mustUseProperty[propName],
        'DOMProperty: Cannot require using both attribute and property: %s',
        propName
      ) : invariant(!DOMProperty.mustUseAttribute[propName] ||
        !DOMProperty.mustUseProperty[propName]));
      ("production" !== process.env.NODE_ENV ? invariant(
        DOMProperty.mustUseProperty[propName] ||
          !DOMProperty.hasSideEffects[propName],
        'DOMProperty: Properties that have side effects must use property: %s',
        propName
      ) : invariant(DOMProperty.mustUseProperty[propName] ||
        !DOMProperty.hasSideEffects[propName]));
      ("production" !== process.env.NODE_ENV ? invariant(
        !!DOMProperty.hasBooleanValue[propName] +
          !!DOMProperty.hasNumericValue[propName] +
          !!DOMProperty.hasOverloadedBooleanValue[propName] <= 1,
        'DOMProperty: Value can be one of boolean, overloaded boolean, or ' +
        'numeric value, but not a combination: %s',
        propName
      ) : invariant(!!DOMProperty.hasBooleanValue[propName] +
        !!DOMProperty.hasNumericValue[propName] +
        !!DOMProperty.hasOverloadedBooleanValue[propName] <= 1));
    }
  }
};
var defaultValueCache = {};

/**
 * DOMProperty exports lookup objects that can be used like functions:
 *
 *   > DOMProperty.isValid['id']
 *   true
 *   > DOMProperty.isValid['foobar']
 *   undefined
 *
 * Although this may be confusing, it performs better in general.
 *
 * @see http://jsperf.com/key-exists
 * @see http://jsperf.com/key-missing
 */
var DOMProperty = {

  ID_ATTRIBUTE_NAME: 'data-reactid',

  /**
   * Checks whether a property name is a standard property.
   * @type {Object}
   */
  isStandardName: {},

  /**
   * Mapping from lowercase property names to the properly cased version, used
   * to warn in the case of missing properties.
   * @type {Object}
   */
  getPossibleStandardName: {},

  /**
   * Mapping from normalized names to attribute names that differ. Attribute
   * names are used when rendering markup or with `*Attribute()`.
   * @type {Object}
   */
  getAttributeName: {},

  /**
   * Mapping from normalized names to properties on DOM node instances.
   * (This includes properties that mutate due to external factors.)
   * @type {Object}
   */
  getPropertyName: {},

  /**
   * Mapping from normalized names to mutation methods. This will only exist if
   * mutation cannot be set simply by the property or `setAttribute()`.
   * @type {Object}
   */
  getMutationMethod: {},

  /**
   * Whether the property must be accessed and mutated as an object property.
   * @type {Object}
   */
  mustUseAttribute: {},

  /**
   * Whether the property must be accessed and mutated using `*Attribute()`.
   * (This includes anything that fails `<propName> in <element>`.)
   * @type {Object}
   */
  mustUseProperty: {},

  /**
   * Whether or not setting a value causes side effects such as triggering
   * resources to be loaded or text selection changes. We must ensure that
   * the value is only set if it has changed.
   * @type {Object}
   */
  hasSideEffects: {},

  /**
   * Whether the property should be removed when set to a falsey value.
   * @type {Object}
   */
  hasBooleanValue: {},

  /**
   * Whether the property must be numeric or parse as a
   * numeric and should be removed when set to a falsey value.
   * @type {Object}
   */
  hasNumericValue: {},

  /**
   * Whether the property must be positive numeric or parse as a positive
   * numeric and should be removed when set to a falsey value.
   * @type {Object}
   */
  hasPositiveNumericValue: {},

  /**
   * Whether the property can be used as a flag as well as with a value. Removed
   * when strictly equal to false; present without a value when strictly equal
   * to true; present with a value otherwise.
   * @type {Object}
   */
  hasOverloadedBooleanValue: {},

  /**
   * All of the isCustomAttribute() functions that have been injected.
   */
  _isCustomAttributeFunctions: [],

  /**
   * Checks whether a property name is a custom attribute.
   * @method
   */
  isCustomAttribute: function(attributeName) {
    for (var i = 0; i < DOMProperty._isCustomAttributeFunctions.length; i++) {
      var isCustomAttributeFn = DOMProperty._isCustomAttributeFunctions[i];
      if (isCustomAttributeFn(attributeName)) {
        return true;
      }
    }
    return false;
  },

  /**
   * Returns the default property value for a DOM property (i.e., not an
   * attribute). Most default values are '' or false, but not all. Worse yet,
   * some (in particular, `type`) vary depending on the type of element.
   *
   * TODO: Is it better to grab all the possible properties when creating an
   * element to avoid having to create the same element twice?
   */
  getDefaultValueForProperty: function(nodeName, prop) {
    var nodeDefaults = defaultValueCache[nodeName];
    var testElement;
    if (!nodeDefaults) {
      defaultValueCache[nodeName] = nodeDefaults = {};
    }
    if (!(prop in nodeDefaults)) {
      testElement = document.createElement(nodeName);
      nodeDefaults[prop] = testElement[prop];
    }
    return nodeDefaults[prop];
  },

  injection: DOMPropertyInjection
};

module.exports = DOMProperty;

}).call(this,require('_process'))
},{"./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMPropertyOperations.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMPropertyOperations
 * @typechecks static-only
 */

"use strict";

var DOMProperty = require("./DOMProperty");

var escapeTextForBrowser = require("./escapeTextForBrowser");
var memoizeStringOnly = require("./memoizeStringOnly");
var warning = require("./warning");

function shouldIgnoreValue(name, value) {
  return value == null ||
    (DOMProperty.hasBooleanValue[name] && !value) ||
    (DOMProperty.hasNumericValue[name] && isNaN(value)) ||
    (DOMProperty.hasPositiveNumericValue[name] && (value < 1)) ||
    (DOMProperty.hasOverloadedBooleanValue[name] && value === false);
}

var processAttributeNameAndPrefix = memoizeStringOnly(function(name) {
  return escapeTextForBrowser(name) + '="';
});

if ("production" !== process.env.NODE_ENV) {
  var reactProps = {
    children: true,
    dangerouslySetInnerHTML: true,
    key: true,
    ref: true
  };
  var warnedProperties = {};

  var warnUnknownProperty = function(name) {
    if (reactProps.hasOwnProperty(name) && reactProps[name] ||
        warnedProperties.hasOwnProperty(name) && warnedProperties[name]) {
      return;
    }

    warnedProperties[name] = true;
    var lowerCasedName = name.toLowerCase();

    // data-* attributes should be lowercase; suggest the lowercase version
    var standardName = (
      DOMProperty.isCustomAttribute(lowerCasedName) ?
        lowerCasedName :
      DOMProperty.getPossibleStandardName.hasOwnProperty(lowerCasedName) ?
        DOMProperty.getPossibleStandardName[lowerCasedName] :
        null
    );

    // For now, only warn when we have a suggested correction. This prevents
    // logging too much when using transferPropsTo.
    ("production" !== process.env.NODE_ENV ? warning(
      standardName == null,
      'Unknown DOM property ' + name + '. Did you mean ' + standardName + '?'
    ) : null);

  };
}

/**
 * Operations for dealing with DOM properties.
 */
var DOMPropertyOperations = {

  /**
   * Creates markup for the ID property.
   *
   * @param {string} id Unescaped ID.
   * @return {string} Markup string.
   */
  createMarkupForID: function(id) {
    return processAttributeNameAndPrefix(DOMProperty.ID_ATTRIBUTE_NAME) +
      escapeTextForBrowser(id) + '"';
  },

  /**
   * Creates markup for a property.
   *
   * @param {string} name
   * @param {*} value
   * @return {?string} Markup string, or null if the property was invalid.
   */
  createMarkupForProperty: function(name, value) {
    if (DOMProperty.isStandardName.hasOwnProperty(name) &&
        DOMProperty.isStandardName[name]) {
      if (shouldIgnoreValue(name, value)) {
        return '';
      }
      var attributeName = DOMProperty.getAttributeName[name];
      if (DOMProperty.hasBooleanValue[name] ||
          (DOMProperty.hasOverloadedBooleanValue[name] && value === true)) {
        return escapeTextForBrowser(attributeName);
      }
      return processAttributeNameAndPrefix(attributeName) +
        escapeTextForBrowser(value) + '"';
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        return '';
      }
      return processAttributeNameAndPrefix(name) +
        escapeTextForBrowser(value) + '"';
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
    return null;
  },

  /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */
  setValueForProperty: function(node, name, value) {
    if (DOMProperty.isStandardName.hasOwnProperty(name) &&
        DOMProperty.isStandardName[name]) {
      var mutationMethod = DOMProperty.getMutationMethod[name];
      if (mutationMethod) {
        mutationMethod(node, value);
      } else if (shouldIgnoreValue(name, value)) {
        this.deleteValueForProperty(node, name);
      } else if (DOMProperty.mustUseAttribute[name]) {
        // `setAttribute` with objects becomes only `[object]` in IE8/9,
        // ('' + value) makes it output the correct toString()-value.
        node.setAttribute(DOMProperty.getAttributeName[name], '' + value);
      } else {
        var propName = DOMProperty.getPropertyName[name];
        // Must explicitly cast values for HAS_SIDE_EFFECTS-properties to the
        // property type before comparing; only `value` does and is string.
        if (!DOMProperty.hasSideEffects[name] ||
            ('' + node[propName]) !== ('' + value)) {
          // Contrary to `setAttribute`, object properties are properly
          // `toString`ed by IE8/9.
          node[propName] = value;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        node.removeAttribute(name);
      } else {
        node.setAttribute(name, '' + value);
      }
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
  },

  /**
   * Deletes the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  deleteValueForProperty: function(node, name) {
    if (DOMProperty.isStandardName.hasOwnProperty(name) &&
        DOMProperty.isStandardName[name]) {
      var mutationMethod = DOMProperty.getMutationMethod[name];
      if (mutationMethod) {
        mutationMethod(node, undefined);
      } else if (DOMProperty.mustUseAttribute[name]) {
        node.removeAttribute(DOMProperty.getAttributeName[name]);
      } else {
        var propName = DOMProperty.getPropertyName[name];
        var defaultValue = DOMProperty.getDefaultValueForProperty(
          node.nodeName,
          propName
        );
        if (!DOMProperty.hasSideEffects[name] ||
            ('' + node[propName]) !== defaultValue) {
          node[propName] = defaultValue;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      node.removeAttribute(name);
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
  }

};

module.exports = DOMPropertyOperations;

}).call(this,require('_process'))
},{"./DOMProperty":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMProperty.js","./escapeTextForBrowser":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\escapeTextForBrowser.js","./memoizeStringOnly":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\memoizeStringOnly.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Danger.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Danger
 * @typechecks static-only
 */

/*jslint evil: true, sub: true */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var createNodesFromMarkup = require("./createNodesFromMarkup");
var emptyFunction = require("./emptyFunction");
var getMarkupWrap = require("./getMarkupWrap");
var invariant = require("./invariant");

var OPEN_TAG_NAME_EXP = /^(<[^ \/>]+)/;
var RESULT_INDEX_ATTR = 'data-danger-index';

/**
 * Extracts the `nodeName` from a string of markup.
 *
 * NOTE: Extracting the `nodeName` does not require a regular expression match
 * because we make assumptions about React-generated markup (i.e. there are no
 * spaces surrounding the opening tag and there is at least one attribute).
 *
 * @param {string} markup String of markup.
 * @return {string} Node name of the supplied markup.
 * @see http://jsperf.com/extract-nodename
 */
function getNodeName(markup) {
  return markup.substring(1, markup.indexOf(' '));
}

var Danger = {

  /**
   * Renders markup into an array of nodes. The markup is expected to render
   * into a list of root nodes. Also, the length of `resultList` and
   * `markupList` should be the same.
   *
   * @param {array<string>} markupList List of markup strings to render.
   * @return {array<DOMElement>} List of rendered nodes.
   * @internal
   */
  dangerouslyRenderMarkup: function(markupList) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'dangerouslyRenderMarkup(...): Cannot render markup in a worker ' +
      'thread. Make sure `window` and `document` are available globally ' +
      'before requiring React when unit testing or use ' +
      'React.renderToString for server rendering.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    var nodeName;
    var markupByNodeName = {};
    // Group markup by `nodeName` if a wrap is necessary, else by '*'.
    for (var i = 0; i < markupList.length; i++) {
      ("production" !== process.env.NODE_ENV ? invariant(
        markupList[i],
        'dangerouslyRenderMarkup(...): Missing markup.'
      ) : invariant(markupList[i]));
      nodeName = getNodeName(markupList[i]);
      nodeName = getMarkupWrap(nodeName) ? nodeName : '*';
      markupByNodeName[nodeName] = markupByNodeName[nodeName] || [];
      markupByNodeName[nodeName][i] = markupList[i];
    }
    var resultList = [];
    var resultListAssignmentCount = 0;
    for (nodeName in markupByNodeName) {
      if (!markupByNodeName.hasOwnProperty(nodeName)) {
        continue;
      }
      var markupListByNodeName = markupByNodeName[nodeName];

      // This for-in loop skips the holes of the sparse array. The order of
      // iteration should follow the order of assignment, which happens to match
      // numerical index order, but we don't rely on that.
      for (var resultIndex in markupListByNodeName) {
        if (markupListByNodeName.hasOwnProperty(resultIndex)) {
          var markup = markupListByNodeName[resultIndex];

          // Push the requested markup with an additional RESULT_INDEX_ATTR
          // attribute.  If the markup does not start with a < character, it
          // will be discarded below (with an appropriate console.error).
          markupListByNodeName[resultIndex] = markup.replace(
            OPEN_TAG_NAME_EXP,
            // This index will be parsed back out below.
            '$1 ' + RESULT_INDEX_ATTR + '="' + resultIndex + '" '
          );
        }
      }

      // Render each group of markup with similar wrapping `nodeName`.
      var renderNodes = createNodesFromMarkup(
        markupListByNodeName.join(''),
        emptyFunction // Do nothing special with <script> tags.
      );

      for (i = 0; i < renderNodes.length; ++i) {
        var renderNode = renderNodes[i];
        if (renderNode.hasAttribute &&
            renderNode.hasAttribute(RESULT_INDEX_ATTR)) {

          resultIndex = +renderNode.getAttribute(RESULT_INDEX_ATTR);
          renderNode.removeAttribute(RESULT_INDEX_ATTR);

          ("production" !== process.env.NODE_ENV ? invariant(
            !resultList.hasOwnProperty(resultIndex),
            'Danger: Assigning to an already-occupied result index.'
          ) : invariant(!resultList.hasOwnProperty(resultIndex)));

          resultList[resultIndex] = renderNode;

          // This should match resultList.length and markupList.length when
          // we're done.
          resultListAssignmentCount += 1;

        } else if ("production" !== process.env.NODE_ENV) {
          console.error(
            "Danger: Discarding unexpected node:",
            renderNode
          );
        }
      }
    }

    // Although resultList was populated out of order, it should now be a dense
    // array.
    ("production" !== process.env.NODE_ENV ? invariant(
      resultListAssignmentCount === resultList.length,
      'Danger: Did not assign to every index of resultList.'
    ) : invariant(resultListAssignmentCount === resultList.length));

    ("production" !== process.env.NODE_ENV ? invariant(
      resultList.length === markupList.length,
      'Danger: Expected markup to render %s nodes, but rendered %s.',
      markupList.length,
      resultList.length
    ) : invariant(resultList.length === markupList.length));

    return resultList;
  },

  /**
   * Replaces a node with a string of markup at its current position within its
   * parent. The markup must render into a single root node.
   *
   * @param {DOMElement} oldChild Child node to replace.
   * @param {string} markup Markup to render in place of the child node.
   * @internal
   */
  dangerouslyReplaceNodeWithMarkup: function(oldChild, markup) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a ' +
      'worker thread. Make sure `window` and `document` are available ' +
      'globally before requiring React when unit testing or use ' +
      'React.renderToString for server rendering.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    ("production" !== process.env.NODE_ENV ? invariant(markup, 'dangerouslyReplaceNodeWithMarkup(...): Missing markup.') : invariant(markup));
    ("production" !== process.env.NODE_ENV ? invariant(
      oldChild.tagName.toLowerCase() !== 'html',
      'dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the ' +
      '<html> node. This is because browser quirks make this unreliable ' +
      'and/or slow. If you want to render to the root you must use ' +
      'server rendering. See renderComponentToString().'
    ) : invariant(oldChild.tagName.toLowerCase() !== 'html'));

    var newChild = createNodesFromMarkup(markup, emptyFunction)[0];
    oldChild.parentNode.replaceChild(newChild, oldChild);
  }

};

module.exports = Danger;

}).call(this,require('_process'))
},{"./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./createNodesFromMarkup":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\createNodesFromMarkup.js","./emptyFunction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js","./getMarkupWrap":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getMarkupWrap.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DefaultEventPluginOrder.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DefaultEventPluginOrder
 */

"use strict";

 var keyOf = require("./keyOf");

/**
 * Module that is injectable into `EventPluginHub`, that specifies a
 * deterministic ordering of `EventPlugin`s. A convenient way to reason about
 * plugins, without having to package every one of them. This is better than
 * having plugins be ordered in the same order that they are injected because
 * that ordering would be influenced by the packaging order.
 * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
 * preventing default on events is convenient in `SimpleEventPlugin` handlers.
 */
var DefaultEventPluginOrder = [
  keyOf({ResponderEventPlugin: null}),
  keyOf({SimpleEventPlugin: null}),
  keyOf({TapEventPlugin: null}),
  keyOf({EnterLeaveEventPlugin: null}),
  keyOf({ChangeEventPlugin: null}),
  keyOf({SelectEventPlugin: null}),
  keyOf({CompositionEventPlugin: null}),
  keyOf({BeforeInputEventPlugin: null}),
  keyOf({AnalyticsEventPlugin: null}),
  keyOf({MobileSafariClickEventPlugin: null})
];

module.exports = DefaultEventPluginOrder;

},{"./keyOf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EnterLeaveEventPlugin.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EnterLeaveEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var SyntheticMouseEvent = require("./SyntheticMouseEvent");

var ReactMount = require("./ReactMount");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;
var getFirstReactDOM = ReactMount.getFirstReactDOM;

var eventTypes = {
  mouseEnter: {
    registrationName: keyOf({onMouseEnter: null}),
    dependencies: [
      topLevelTypes.topMouseOut,
      topLevelTypes.topMouseOver
    ]
  },
  mouseLeave: {
    registrationName: keyOf({onMouseLeave: null}),
    dependencies: [
      topLevelTypes.topMouseOut,
      topLevelTypes.topMouseOver
    ]
  }
};

var extractedEvents = [null, null];

var EnterLeaveEventPlugin = {

  eventTypes: eventTypes,

  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    if (topLevelType === topLevelTypes.topMouseOver &&
        (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
      return null;
    }
    if (topLevelType !== topLevelTypes.topMouseOut &&
        topLevelType !== topLevelTypes.topMouseOver) {
      // Must not be a mouse in or mouse out - ignoring.
      return null;
    }

    var win;
    if (topLevelTarget.window === topLevelTarget) {
      // `topLevelTarget` is probably a window object.
      win = topLevelTarget;
    } else {
      // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
      var doc = topLevelTarget.ownerDocument;
      if (doc) {
        win = doc.defaultView || doc.parentWindow;
      } else {
        win = window;
      }
    }

    var from, to;
    if (topLevelType === topLevelTypes.topMouseOut) {
      from = topLevelTarget;
      to =
        getFirstReactDOM(nativeEvent.relatedTarget || nativeEvent.toElement) ||
        win;
    } else {
      from = win;
      to = topLevelTarget;
    }

    if (from === to) {
      // Nothing pertains to our managed components.
      return null;
    }

    var fromID = from ? ReactMount.getID(from) : '';
    var toID = to ? ReactMount.getID(to) : '';

    var leave = SyntheticMouseEvent.getPooled(
      eventTypes.mouseLeave,
      fromID,
      nativeEvent
    );
    leave.type = 'mouseleave';
    leave.target = from;
    leave.relatedTarget = to;

    var enter = SyntheticMouseEvent.getPooled(
      eventTypes.mouseEnter,
      toID,
      nativeEvent
    );
    enter.type = 'mouseenter';
    enter.target = to;
    enter.relatedTarget = from;

    EventPropagators.accumulateEnterLeaveDispatches(leave, enter, fromID, toID);

    extractedEvents[0] = leave;
    extractedEvents[1] = enter;

    return extractedEvents;
  }

};

module.exports = EnterLeaveEventPlugin;

},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./EventPropagators":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPropagators.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./SyntheticMouseEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticMouseEvent.js","./keyOf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventConstants
 */

"use strict";

var keyMirror = require("./keyMirror");

var PropagationPhases = keyMirror({bubbled: null, captured: null});

/**
 * Types of raw signals from the browser caught at the top level.
 */
var topLevelTypes = keyMirror({
  topBlur: null,
  topChange: null,
  topClick: null,
  topCompositionEnd: null,
  topCompositionStart: null,
  topCompositionUpdate: null,
  topContextMenu: null,
  topCopy: null,
  topCut: null,
  topDoubleClick: null,
  topDrag: null,
  topDragEnd: null,
  topDragEnter: null,
  topDragExit: null,
  topDragLeave: null,
  topDragOver: null,
  topDragStart: null,
  topDrop: null,
  topError: null,
  topFocus: null,
  topInput: null,
  topKeyDown: null,
  topKeyPress: null,
  topKeyUp: null,
  topLoad: null,
  topMouseDown: null,
  topMouseMove: null,
  topMouseOut: null,
  topMouseOver: null,
  topMouseUp: null,
  topPaste: null,
  topReset: null,
  topScroll: null,
  topSelectionChange: null,
  topSubmit: null,
  topTextInput: null,
  topTouchCancel: null,
  topTouchEnd: null,
  topTouchMove: null,
  topTouchStart: null,
  topWheel: null
});

var EventConstants = {
  topLevelTypes: topLevelTypes,
  PropagationPhases: PropagationPhases
};

module.exports = EventConstants;

},{"./keyMirror":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyMirror.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventListener.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventListener
 * @typechecks
 */

var emptyFunction = require("./emptyFunction");

/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen: function(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },

  /**
   * Listen to DOM events during the capture phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  capture: function(target, eventType, callback) {
    if (!target.addEventListener) {
      if ("production" !== process.env.NODE_ENV) {
        console.error(
          'Attempted to listen to events during the capture phase on a ' +
          'browser that does not support the capture phase. Your application ' +
          'will not receive some events.'
        );
      }
      return {
        remove: emptyFunction
      };
    } else {
      target.addEventListener(eventType, callback, true);
      return {
        remove: function() {
          target.removeEventListener(eventType, callback, true);
        }
      };
    }
  },

  registerDefault: function() {}
};

module.exports = EventListener;

}).call(this,require('_process'))
},{"./emptyFunction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginHub.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginHub
 */

"use strict";

var EventPluginRegistry = require("./EventPluginRegistry");
var EventPluginUtils = require("./EventPluginUtils");

var accumulateInto = require("./accumulateInto");
var forEachAccumulated = require("./forEachAccumulated");
var invariant = require("./invariant");

/**
 * Internal store for event listeners
 */
var listenerBank = {};

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */
var eventQueue = null;

/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @private
 */
var executeDispatchesAndRelease = function(event) {
  if (event) {
    var executeDispatch = EventPluginUtils.executeDispatch;
    // Plugins can provide custom behavior when dispatching events.
    var PluginModule = EventPluginRegistry.getPluginModuleForEvent(event);
    if (PluginModule && PluginModule.executeDispatch) {
      executeDispatch = PluginModule.executeDispatch;
    }
    EventPluginUtils.executeDispatchesInOrder(event, executeDispatch);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};

/**
 * - `InstanceHandle`: [required] Module that performs logical traversals of DOM
 *   hierarchy given ids of the logical DOM elements involved.
 */
var InstanceHandle = null;

function validateInstanceHandle() {
  var invalid = !InstanceHandle||
    !InstanceHandle.traverseTwoPhase ||
    !InstanceHandle.traverseEnterLeave;
  if (invalid) {
    throw new Error('InstanceHandle not injected before use!');
  }
}

/**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */
var EventPluginHub = {

  /**
   * Methods for injecting dependencies.
   */
  injection: {

    /**
     * @param {object} InjectedMount
     * @public
     */
    injectMount: EventPluginUtils.injection.injectMount,

    /**
     * @param {object} InjectedInstanceHandle
     * @public
     */
    injectInstanceHandle: function(InjectedInstanceHandle) {
      InstanceHandle = InjectedInstanceHandle;
      if ("production" !== process.env.NODE_ENV) {
        validateInstanceHandle();
      }
    },

    getInstanceHandle: function() {
      if ("production" !== process.env.NODE_ENV) {
        validateInstanceHandle();
      }
      return InstanceHandle;
    },

    /**
     * @param {array} InjectedEventPluginOrder
     * @public
     */
    injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

    /**
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     */
    injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

  },

  eventNameDispatchConfigs: EventPluginRegistry.eventNameDispatchConfigs,

  registrationNameModules: EventPluginRegistry.registrationNameModules,

  /**
   * Stores `listener` at `listenerBank[registrationName][id]`. Is idempotent.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {?function} listener The callback to store.
   */
  putListener: function(id, registrationName, listener) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !listener || typeof listener === 'function',
      'Expected %s listener to be a function, instead got type %s',
      registrationName, typeof listener
    ) : invariant(!listener || typeof listener === 'function'));

    var bankForRegistrationName =
      listenerBank[registrationName] || (listenerBank[registrationName] = {});
    bankForRegistrationName[id] = listener;
  },

  /**
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @return {?function} The stored callback.
   */
  getListener: function(id, registrationName) {
    var bankForRegistrationName = listenerBank[registrationName];
    return bankForRegistrationName && bankForRegistrationName[id];
  },

  /**
   * Deletes a listener from the registration bank.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   */
  deleteListener: function(id, registrationName) {
    var bankForRegistrationName = listenerBank[registrationName];
    if (bankForRegistrationName) {
      delete bankForRegistrationName[id];
    }
  },

  /**
   * Deletes all listeners for the DOM element with the supplied ID.
   *
   * @param {string} id ID of the DOM element.
   */
  deleteAllListeners: function(id) {
    for (var registrationName in listenerBank) {
      delete listenerBank[registrationName][id];
    }
  },

  /**
   * Allows registered plugins an opportunity to extract events from top-level
   * native browser events.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @internal
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var events;
    var plugins = EventPluginRegistry.plugins;
    for (var i = 0, l = plugins.length; i < l; i++) {
      // Not every plugin in the ordering may be loaded at runtime.
      var possiblePlugin = plugins[i];
      if (possiblePlugin) {
        var extractedEvents = possiblePlugin.extractEvents(
          topLevelType,
          topLevelTarget,
          topLevelTargetID,
          nativeEvent
        );
        if (extractedEvents) {
          events = accumulateInto(events, extractedEvents);
        }
      }
    }
    return events;
  },

  /**
   * Enqueues a synthetic event that should be dispatched when
   * `processEventQueue` is invoked.
   *
   * @param {*} events An accumulation of synthetic events.
   * @internal
   */
  enqueueEvents: function(events) {
    if (events) {
      eventQueue = accumulateInto(eventQueue, events);
    }
  },

  /**
   * Dispatches all synthetic events on the event queue.
   *
   * @internal
   */
  processEventQueue: function() {
    // Set `eventQueue` to null before processing it so that we can tell if more
    // events get enqueued while processing.
    var processingEventQueue = eventQueue;
    eventQueue = null;
    forEachAccumulated(processingEventQueue, executeDispatchesAndRelease);
    ("production" !== process.env.NODE_ENV ? invariant(
      !eventQueue,
      'processEventQueue(): Additional events were enqueued while processing ' +
      'an event queue. Support for this has not yet been implemented.'
    ) : invariant(!eventQueue));
  },

  /**
   * These are needed for tests only. Do not use!
   */
  __purge: function() {
    listenerBank = {};
  },

  __getListenerBank: function() {
    return listenerBank;
  }

};

module.exports = EventPluginHub;

}).call(this,require('_process'))
},{"./EventPluginRegistry":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginRegistry.js","./EventPluginUtils":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginUtils.js","./accumulateInto":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\accumulateInto.js","./forEachAccumulated":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\forEachAccumulated.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginRegistry.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginRegistry
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Injectable ordering of event plugins.
 */
var EventPluginOrder = null;

/**
 * Injectable mapping from names to event plugin modules.
 */
var namesToPlugins = {};

/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */
function recomputePluginOrdering() {
  if (!EventPluginOrder) {
    // Wait until an `EventPluginOrder` is injected.
    return;
  }
  for (var pluginName in namesToPlugins) {
    var PluginModule = namesToPlugins[pluginName];
    var pluginIndex = EventPluginOrder.indexOf(pluginName);
    ("production" !== process.env.NODE_ENV ? invariant(
      pluginIndex > -1,
      'EventPluginRegistry: Cannot inject event plugins that do not exist in ' +
      'the plugin ordering, `%s`.',
      pluginName
    ) : invariant(pluginIndex > -1));
    if (EventPluginRegistry.plugins[pluginIndex]) {
      continue;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      PluginModule.extractEvents,
      'EventPluginRegistry: Event plugins must implement an `extractEvents` ' +
      'method, but `%s` does not.',
      pluginName
    ) : invariant(PluginModule.extractEvents));
    EventPluginRegistry.plugins[pluginIndex] = PluginModule;
    var publishedEvents = PluginModule.eventTypes;
    for (var eventName in publishedEvents) {
      ("production" !== process.env.NODE_ENV ? invariant(
        publishEventForPlugin(
          publishedEvents[eventName],
          PluginModule,
          eventName
        ),
        'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.',
        eventName,
        pluginName
      ) : invariant(publishEventForPlugin(
        publishedEvents[eventName],
        PluginModule,
        eventName
      )));
    }
  }
}

/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */
function publishEventForPlugin(dispatchConfig, PluginModule, eventName) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName),
    'EventPluginHub: More than one plugin attempted to publish the same ' +
    'event name, `%s`.',
    eventName
  ) : invariant(!EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName)));
  EventPluginRegistry.eventNameDispatchConfigs[eventName] = dispatchConfig;

  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(
          phasedRegistrationName,
          PluginModule,
          eventName
        );
      }
    }
    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(
      dispatchConfig.registrationName,
      PluginModule,
      eventName
    );
    return true;
  }
  return false;
}

/**
 * Publishes a registration name that is used to identify dispatched events and
 * can be used with `EventPluginHub.putListener` to register listeners.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */
function publishRegistrationName(registrationName, PluginModule, eventName) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !EventPluginRegistry.registrationNameModules[registrationName],
    'EventPluginHub: More than one plugin attempted to publish the same ' +
    'registration name, `%s`.',
    registrationName
  ) : invariant(!EventPluginRegistry.registrationNameModules[registrationName]));
  EventPluginRegistry.registrationNameModules[registrationName] = PluginModule;
  EventPluginRegistry.registrationNameDependencies[registrationName] =
    PluginModule.eventTypes[eventName].dependencies;
}

/**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */
var EventPluginRegistry = {

  /**
   * Ordered list of injected plugins.
   */
  plugins: [],

  /**
   * Mapping from event name to dispatch config
   */
  eventNameDispatchConfigs: {},

  /**
   * Mapping from registration name to plugin module
   */
  registrationNameModules: {},

  /**
   * Mapping from registration name to event name
   */
  registrationNameDependencies: {},

  /**
   * Injects an ordering of plugins (by plugin name). This allows the ordering
   * to be decoupled from injection of the actual plugins so that ordering is
   * always deterministic regardless of packaging, on-the-fly injection, etc.
   *
   * @param {array} InjectedEventPluginOrder
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginOrder}
   */
  injectEventPluginOrder: function(InjectedEventPluginOrder) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !EventPluginOrder,
      'EventPluginRegistry: Cannot inject event plugin ordering more than ' +
      'once. You are likely trying to load more than one copy of React.'
    ) : invariant(!EventPluginOrder));
    // Clone the ordering so it cannot be dynamically mutated.
    EventPluginOrder = Array.prototype.slice.call(InjectedEventPluginOrder);
    recomputePluginOrdering();
  },

  /**
   * Injects plugins to be used by `EventPluginHub`. The plugin names must be
   * in the ordering injected by `injectEventPluginOrder`.
   *
   * Plugins can be injected as part of page initialization or on-the-fly.
   *
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginsByName}
   */
  injectEventPluginsByName: function(injectedNamesToPlugins) {
    var isOrderingDirty = false;
    for (var pluginName in injectedNamesToPlugins) {
      if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
        continue;
      }
      var PluginModule = injectedNamesToPlugins[pluginName];
      if (!namesToPlugins.hasOwnProperty(pluginName) ||
          namesToPlugins[pluginName] !== PluginModule) {
        ("production" !== process.env.NODE_ENV ? invariant(
          !namesToPlugins[pluginName],
          'EventPluginRegistry: Cannot inject two different event plugins ' +
          'using the same name, `%s`.',
          pluginName
        ) : invariant(!namesToPlugins[pluginName]));
        namesToPlugins[pluginName] = PluginModule;
        isOrderingDirty = true;
      }
    }
    if (isOrderingDirty) {
      recomputePluginOrdering();
    }
  },

  /**
   * Looks up the plugin for the supplied event.
   *
   * @param {object} event A synthetic event.
   * @return {?object} The plugin that created the supplied event.
   * @internal
   */
  getPluginModuleForEvent: function(event) {
    var dispatchConfig = event.dispatchConfig;
    if (dispatchConfig.registrationName) {
      return EventPluginRegistry.registrationNameModules[
        dispatchConfig.registrationName
      ] || null;
    }
    for (var phase in dispatchConfig.phasedRegistrationNames) {
      if (!dispatchConfig.phasedRegistrationNames.hasOwnProperty(phase)) {
        continue;
      }
      var PluginModule = EventPluginRegistry.registrationNameModules[
        dispatchConfig.phasedRegistrationNames[phase]
      ];
      if (PluginModule) {
        return PluginModule;
      }
    }
    return null;
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _resetEventPlugins: function() {
    EventPluginOrder = null;
    for (var pluginName in namesToPlugins) {
      if (namesToPlugins.hasOwnProperty(pluginName)) {
        delete namesToPlugins[pluginName];
      }
    }
    EventPluginRegistry.plugins.length = 0;

    var eventNameDispatchConfigs = EventPluginRegistry.eventNameDispatchConfigs;
    for (var eventName in eventNameDispatchConfigs) {
      if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
        delete eventNameDispatchConfigs[eventName];
      }
    }

    var registrationNameModules = EventPluginRegistry.registrationNameModules;
    for (var registrationName in registrationNameModules) {
      if (registrationNameModules.hasOwnProperty(registrationName)) {
        delete registrationNameModules[registrationName];
      }
    }
  }

};

module.exports = EventPluginRegistry;

}).call(this,require('_process'))
},{"./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginUtils.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginUtils
 */

"use strict";

var EventConstants = require("./EventConstants");

var invariant = require("./invariant");

/**
 * Injected dependencies:
 */

/**
 * - `Mount`: [required] Module that can convert between React dom IDs and
 *   actual node references.
 */
var injection = {
  Mount: null,
  injectMount: function(InjectedMount) {
    injection.Mount = InjectedMount;
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? invariant(
        InjectedMount && InjectedMount.getNode,
        'EventPluginUtils.injection.injectMount(...): Injected Mount module ' +
        'is missing getNode.'
      ) : invariant(InjectedMount && InjectedMount.getNode));
    }
  }
};

var topLevelTypes = EventConstants.topLevelTypes;

function isEndish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseUp ||
         topLevelType === topLevelTypes.topTouchEnd ||
         topLevelType === topLevelTypes.topTouchCancel;
}

function isMoveish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseMove ||
         topLevelType === topLevelTypes.topTouchMove;
}
function isStartish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseDown ||
         topLevelType === topLevelTypes.topTouchStart;
}


var validateEventDispatches;
if ("production" !== process.env.NODE_ENV) {
  validateEventDispatches = function(event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchIDs = event._dispatchIDs;

    var listenersIsArr = Array.isArray(dispatchListeners);
    var idsIsArr = Array.isArray(dispatchIDs);
    var IDsLen = idsIsArr ? dispatchIDs.length : dispatchIDs ? 1 : 0;
    var listenersLen = listenersIsArr ?
      dispatchListeners.length :
      dispatchListeners ? 1 : 0;

    ("production" !== process.env.NODE_ENV ? invariant(
      idsIsArr === listenersIsArr && IDsLen === listenersLen,
      'EventPluginUtils: Invalid `event`.'
    ) : invariant(idsIsArr === listenersIsArr && IDsLen === listenersLen));
  };
}

/**
 * Invokes `cb(event, listener, id)`. Avoids using call if no scope is
 * provided. The `(listener,id)` pair effectively forms the "dispatch" but are
 * kept separate to conserve memory.
 */
function forEachEventDispatch(event, cb) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      cb(event, dispatchListeners[i], dispatchIDs[i]);
    }
  } else if (dispatchListeners) {
    cb(event, dispatchListeners, dispatchIDs);
  }
}

/**
 * Default implementation of PluginModule.executeDispatch().
 * @param {SyntheticEvent} SyntheticEvent to handle
 * @param {function} Application-level callback
 * @param {string} domID DOM id to pass to the callback.
 */
function executeDispatch(event, listener, domID) {
  event.currentTarget = injection.Mount.getNode(domID);
  var returnValue = listener(event, domID);
  event.currentTarget = null;
  return returnValue;
}

/**
 * Standard/simple iteration through an event's collected dispatches.
 */
function executeDispatchesInOrder(event, executeDispatch) {
  forEachEventDispatch(event, executeDispatch);
  event._dispatchListeners = null;
  event._dispatchIDs = null;
}

/**
 * Standard/simple iteration through an event's collected dispatches, but stops
 * at the first dispatch execution returning true, and returns that id.
 *
 * @return id of the first dispatch execution who's listener returns true, or
 * null if no listener returned true.
 */
function executeDispatchesInOrderStopAtTrueImpl(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      if (dispatchListeners[i](event, dispatchIDs[i])) {
        return dispatchIDs[i];
      }
    }
  } else if (dispatchListeners) {
    if (dispatchListeners(event, dispatchIDs)) {
      return dispatchIDs;
    }
  }
  return null;
}

/**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */
function executeDispatchesInOrderStopAtTrue(event) {
  var ret = executeDispatchesInOrderStopAtTrueImpl(event);
  event._dispatchIDs = null;
  event._dispatchListeners = null;
  return ret;
}

/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return The return value of executing the single dispatch.
 */
function executeDirectDispatch(event) {
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  var dispatchListener = event._dispatchListeners;
  var dispatchID = event._dispatchIDs;
  ("production" !== process.env.NODE_ENV ? invariant(
    !Array.isArray(dispatchListener),
    'executeDirectDispatch(...): Invalid `event`.'
  ) : invariant(!Array.isArray(dispatchListener)));
  var res = dispatchListener ?
    dispatchListener(event, dispatchID) :
    null;
  event._dispatchListeners = null;
  event._dispatchIDs = null;
  return res;
}

/**
 * @param {SyntheticEvent} event
 * @return {bool} True iff number of dispatches accumulated is greater than 0.
 */
function hasDispatches(event) {
  return !!event._dispatchListeners;
}

/**
 * General utilities that are useful in creating custom Event Plugins.
 */
var EventPluginUtils = {
  isEndish: isEndish,
  isMoveish: isMoveish,
  isStartish: isStartish,

  executeDirectDispatch: executeDirectDispatch,
  executeDispatch: executeDispatch,
  executeDispatchesInOrder: executeDispatchesInOrder,
  executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
  hasDispatches: hasDispatches,
  injection: injection,
  useTouchEvents: false
};

module.exports = EventPluginUtils;

}).call(this,require('_process'))
},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPropagators.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPropagators
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");

var accumulateInto = require("./accumulateInto");
var forEachAccumulated = require("./forEachAccumulated");

var PropagationPhases = EventConstants.PropagationPhases;
var getListener = EventPluginHub.getListener;

/**
 * Some event types have a notion of different registration names for different
 * "phases" of propagation. This finds listeners by a given phase.
 */
function listenerAtPhase(id, event, propagationPhase) {
  var registrationName =
    event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener(id, registrationName);
}

/**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */
function accumulateDirectionalDispatches(domID, upwards, event) {
  if ("production" !== process.env.NODE_ENV) {
    if (!domID) {
      throw new Error('Dispatching id must not be null');
    }
  }
  var phase = upwards ? PropagationPhases.bubbled : PropagationPhases.captured;
  var listener = listenerAtPhase(domID, event, phase);
  if (listener) {
    event._dispatchListeners =
      accumulateInto(event._dispatchListeners, listener);
    event._dispatchIDs = accumulateInto(event._dispatchIDs, domID);
  }
}

/**
 * Collect dispatches (must be entirely collected before dispatching - see unit
 * tests). Lazily allocate the array to conserve memory.  We must loop through
 * each event and perform the traversal for each one. We can not perform a
 * single traversal for the entire collection of events because each event may
 * have a different target.
 */
function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    EventPluginHub.injection.getInstanceHandle().traverseTwoPhase(
      event.dispatchMarker,
      accumulateDirectionalDispatches,
      event
    );
  }
}


/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */
function accumulateDispatches(id, ignoredDirection, event) {
  if (event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener(id, registrationName);
    if (listener) {
      event._dispatchListeners =
        accumulateInto(event._dispatchListeners, listener);
      event._dispatchIDs = accumulateInto(event._dispatchIDs, id);
    }
  }
}

/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */
function accumulateDirectDispatchesSingle(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches(event.dispatchMarker, null, event);
  }
}

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
}

function accumulateEnterLeaveDispatches(leave, enter, fromID, toID) {
  EventPluginHub.injection.getInstanceHandle().traverseEnterLeave(
    fromID,
    toID,
    accumulateDispatches,
    leave,
    enter
  );
}


function accumulateDirectDispatches(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle);
}



/**
 * A small set of propagation patterns, each of which will accept a small amount
 * of information, and generate a set of "dispatch ready event objects" - which
 * are sets of events that have already been annotated with a set of dispatched
 * listener functions/ids. The API is designed this way to discourage these
 * propagation strategies from actually executing the dispatches, since we
 * always want to collect the entire set of dispatches before executing event a
 * single one.
 *
 * @constructor EventPropagators
 */
var EventPropagators = {
  accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
  accumulateDirectDispatches: accumulateDirectDispatches,
  accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
};

module.exports = EventPropagators;

}).call(this,require('_process'))
},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./EventPluginHub":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginHub.js","./accumulateInto":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\accumulateInto.js","./forEachAccumulated":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\forEachAccumulated.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ExecutionEnvironment
 */

/*jslint evil: true */

"use strict";

var canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners:
    canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\HTMLDOMPropertyConfig.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule HTMLDOMPropertyConfig
 */

/*jslint bitwise: true*/

"use strict";

var DOMProperty = require("./DOMProperty");
var ExecutionEnvironment = require("./ExecutionEnvironment");

var MUST_USE_ATTRIBUTE = DOMProperty.injection.MUST_USE_ATTRIBUTE;
var MUST_USE_PROPERTY = DOMProperty.injection.MUST_USE_PROPERTY;
var HAS_BOOLEAN_VALUE = DOMProperty.injection.HAS_BOOLEAN_VALUE;
var HAS_SIDE_EFFECTS = DOMProperty.injection.HAS_SIDE_EFFECTS;
var HAS_NUMERIC_VALUE = DOMProperty.injection.HAS_NUMERIC_VALUE;
var HAS_POSITIVE_NUMERIC_VALUE =
  DOMProperty.injection.HAS_POSITIVE_NUMERIC_VALUE;
var HAS_OVERLOADED_BOOLEAN_VALUE =
  DOMProperty.injection.HAS_OVERLOADED_BOOLEAN_VALUE;

var hasSVG;
if (ExecutionEnvironment.canUseDOM) {
  var implementation = document.implementation;
  hasSVG = (
    implementation &&
    implementation.hasFeature &&
    implementation.hasFeature(
      'http://www.w3.org/TR/SVG11/feature#BasicStructure',
      '1.1'
    )
  );
}


var HTMLDOMPropertyConfig = {
  isCustomAttribute: RegExp.prototype.test.bind(
    /^(data|aria)-[a-z_][a-z\d_.\-]*$/
  ),
  Properties: {
    /**
     * Standard Properties
     */
    accept: null,
    acceptCharset: null,
    accessKey: null,
    action: null,
    allowFullScreen: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    allowTransparency: MUST_USE_ATTRIBUTE,
    alt: null,
    async: HAS_BOOLEAN_VALUE,
    autoComplete: null,
    // autoFocus is polyfilled/normalized by AutoFocusMixin
    // autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    cellPadding: null,
    cellSpacing: null,
    charSet: MUST_USE_ATTRIBUTE,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    classID: MUST_USE_ATTRIBUTE,
    // To set className on SVG elements, it's necessary to use .setAttribute;
    // this works on HTML elements too in all browsers except IE8. Conveniently,
    // IE8 doesn't support SVG and so we can simply use the attribute in
    // browsers that support SVG and the property in browsers that don't,
    // regardless of whether the element is HTML or SVG.
    className: hasSVG ? MUST_USE_ATTRIBUTE : MUST_USE_PROPERTY,
    cols: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    colSpan: null,
    content: null,
    contentEditable: null,
    contextMenu: MUST_USE_ATTRIBUTE,
    controls: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    coords: null,
    crossOrigin: null,
    data: null, // For `<object />` acts as `src`.
    dateTime: MUST_USE_ATTRIBUTE,
    defer: HAS_BOOLEAN_VALUE,
    dir: null,
    disabled: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: null,
    encType: null,
    form: MUST_USE_ATTRIBUTE,
    formAction: MUST_USE_ATTRIBUTE,
    formEncType: MUST_USE_ATTRIBUTE,
    formMethod: MUST_USE_ATTRIBUTE,
    formNoValidate: HAS_BOOLEAN_VALUE,
    formTarget: MUST_USE_ATTRIBUTE,
    frameBorder: MUST_USE_ATTRIBUTE,
    height: MUST_USE_ATTRIBUTE,
    hidden: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    href: null,
    hrefLang: null,
    htmlFor: null,
    httpEquiv: null,
    icon: null,
    id: MUST_USE_PROPERTY,
    label: null,
    lang: null,
    list: MUST_USE_ATTRIBUTE,
    loop: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    manifest: MUST_USE_ATTRIBUTE,
    marginHeight: null,
    marginWidth: null,
    max: null,
    maxLength: MUST_USE_ATTRIBUTE,
    media: MUST_USE_ATTRIBUTE,
    mediaGroup: null,
    method: null,
    min: null,
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    name: null,
    noValidate: HAS_BOOLEAN_VALUE,
    open: null,
    pattern: null,
    placeholder: null,
    poster: null,
    preload: null,
    radioGroup: null,
    readOnly: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    rel: null,
    required: HAS_BOOLEAN_VALUE,
    role: MUST_USE_ATTRIBUTE,
    rows: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: null,
    sandbox: null,
    scope: null,
    scrolling: null,
    seamless: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    shape: null,
    size: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    sizes: MUST_USE_ATTRIBUTE,
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: null,
    src: null,
    srcDoc: MUST_USE_PROPERTY,
    srcSet: MUST_USE_ATTRIBUTE,
    start: HAS_NUMERIC_VALUE,
    step: null,
    style: null,
    tabIndex: null,
    target: null,
    title: null,
    type: null,
    useMap: null,
    value: MUST_USE_PROPERTY | HAS_SIDE_EFFECTS,
    width: MUST_USE_ATTRIBUTE,
    wmode: MUST_USE_ATTRIBUTE,

    /**
     * Non-standard Properties
     */
    autoCapitalize: null, // Supported in Mobile Safari for keyboard hints
    autoCorrect: null, // Supported in Mobile Safari for keyboard hints
    itemProp: MUST_USE_ATTRIBUTE, // Microdata: http://schema.org/docs/gs.html
    itemScope: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE, // Microdata: http://schema.org/docs/gs.html
    itemType: MUST_USE_ATTRIBUTE, // Microdata: http://schema.org/docs/gs.html
    property: null // Supports OG in meta tags
  },
  DOMAttributeNames: {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
  },
  DOMPropertyNames: {
    autoCapitalize: 'autocapitalize',
    autoComplete: 'autocomplete',
    autoCorrect: 'autocorrect',
    autoFocus: 'autofocus',
    autoPlay: 'autoplay',
    encType: 'enctype',
    hrefLang: 'hreflang',
    radioGroup: 'radiogroup',
    spellCheck: 'spellcheck',
    srcDoc: 'srcdoc',
    srcSet: 'srcset'
  }
};

module.exports = HTMLDOMPropertyConfig;

},{"./DOMProperty":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMProperty.js","./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\LinkedValueUtils.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule LinkedValueUtils
 * @typechecks static-only
 */

"use strict";

var ReactPropTypes = require("./ReactPropTypes");

var invariant = require("./invariant");

var hasReadOnlyValue = {
  'button': true,
  'checkbox': true,
  'image': true,
  'hidden': true,
  'radio': true,
  'reset': true,
  'submit': true
};

function _assertSingleLink(input) {
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.checkedLink == null || input.props.valueLink == null,
    'Cannot provide a checkedLink and a valueLink. If you want to use ' +
    'checkedLink, you probably don\'t want to use valueLink and vice versa.'
  ) : invariant(input.props.checkedLink == null || input.props.valueLink == null));
}
function _assertValueLink(input) {
  _assertSingleLink(input);
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.value == null && input.props.onChange == null,
    'Cannot provide a valueLink and a value or onChange event. If you want ' +
    'to use value or onChange, you probably don\'t want to use valueLink.'
  ) : invariant(input.props.value == null && input.props.onChange == null));
}

function _assertCheckedLink(input) {
  _assertSingleLink(input);
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.checked == null && input.props.onChange == null,
    'Cannot provide a checkedLink and a checked property or onChange event. ' +
    'If you want to use checked or onChange, you probably don\'t want to ' +
    'use checkedLink'
  ) : invariant(input.props.checked == null && input.props.onChange == null));
}

/**
 * @param {SyntheticEvent} e change event to handle
 */
function _handleLinkedValueChange(e) {
  /*jshint validthis:true */
  this.props.valueLink.requestChange(e.target.value);
}

/**
  * @param {SyntheticEvent} e change event to handle
  */
function _handleLinkedCheckChange(e) {
  /*jshint validthis:true */
  this.props.checkedLink.requestChange(e.target.checked);
}

/**
 * Provide a linked `value` attribute for controlled forms. You should not use
 * this outside of the ReactDOM controlled form components.
 */
var LinkedValueUtils = {
  Mixin: {
    propTypes: {
      value: function(props, propName, componentName) {
        if (!props[propName] ||
            hasReadOnlyValue[props.type] ||
            props.onChange ||
            props.readOnly ||
            props.disabled) {
          return;
        }
        return new Error(
          'You provided a `value` prop to a form field without an ' +
          '`onChange` handler. This will render a read-only field. If ' +
          'the field should be mutable use `defaultValue`. Otherwise, ' +
          'set either `onChange` or `readOnly`.'
        );
      },
      checked: function(props, propName, componentName) {
        if (!props[propName] ||
            props.onChange ||
            props.readOnly ||
            props.disabled) {
          return;
        }
        return new Error(
          'You provided a `checked` prop to a form field without an ' +
          '`onChange` handler. This will render a read-only field. If ' +
          'the field should be mutable use `defaultChecked`. Otherwise, ' +
          'set either `onChange` or `readOnly`.'
        );
      },
      onChange: ReactPropTypes.func
    }
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {*} current value of the input either from value prop or link.
   */
  getValue: function(input) {
    if (input.props.valueLink) {
      _assertValueLink(input);
      return input.props.valueLink.value;
    }
    return input.props.value;
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {*} current checked status of the input either from checked prop
   *             or link.
   */
  getChecked: function(input) {
    if (input.props.checkedLink) {
      _assertCheckedLink(input);
      return input.props.checkedLink.value;
    }
    return input.props.checked;
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {function} change callback either from onChange prop or link.
   */
  getOnChange: function(input) {
    if (input.props.valueLink) {
      _assertValueLink(input);
      return _handleLinkedValueChange;
    } else if (input.props.checkedLink) {
      _assertCheckedLink(input);
      return _handleLinkedCheckChange;
    }
    return input.props.onChange;
  }
};

module.exports = LinkedValueUtils;

}).call(this,require('_process'))
},{"./ReactPropTypes":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTypes.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\LocalEventTrapMixin.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule LocalEventTrapMixin
 */

"use strict";

var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");

var accumulateInto = require("./accumulateInto");
var forEachAccumulated = require("./forEachAccumulated");
var invariant = require("./invariant");

function remove(event) {
  event.remove();
}

var LocalEventTrapMixin = {
  trapBubbledEvent:function(topLevelType, handlerBaseName) {
    ("production" !== process.env.NODE_ENV ? invariant(this.isMounted(), 'Must be mounted to trap events') : invariant(this.isMounted()));
    var listener = ReactBrowserEventEmitter.trapBubbledEvent(
      topLevelType,
      handlerBaseName,
      this.getDOMNode()
    );
    this._localEventListeners =
      accumulateInto(this._localEventListeners, listener);
  },

  // trapCapturedEvent would look nearly identical. We don't implement that
  // method because it isn't currently needed.

  componentWillUnmount:function() {
    if (this._localEventListeners) {
      forEachAccumulated(this._localEventListeners, remove);
    }
  }
};

module.exports = LocalEventTrapMixin;

}).call(this,require('_process'))
},{"./ReactBrowserEventEmitter":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserEventEmitter.js","./accumulateInto":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\accumulateInto.js","./forEachAccumulated":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\forEachAccumulated.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\MobileSafariClickEventPlugin.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule MobileSafariClickEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");

var emptyFunction = require("./emptyFunction");

var topLevelTypes = EventConstants.topLevelTypes;

/**
 * Mobile Safari does not fire properly bubble click events on non-interactive
 * elements, which means delegated click listeners do not fire. The workaround
 * for this bug involves attaching an empty click listener on the target node.
 *
 * This particular plugin works around the bug by attaching an empty click
 * listener on `touchstart` (which does fire on every element).
 */
var MobileSafariClickEventPlugin = {

  eventTypes: null,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    if (topLevelType === topLevelTypes.topTouchStart) {
      var target = nativeEvent.target;
      if (target && !target.onclick) {
        target.onclick = emptyFunction;
      }
    }
  }

};

module.exports = MobileSafariClickEventPlugin;

},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./emptyFunction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js":[function(require,module,exports){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Object.assign
 */

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign

function assign(target, sources) {
  if (target == null) {
    throw new TypeError('Object.assign target cannot be null or undefined');
  }

  var to = Object(target);
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
    var nextSource = arguments[nextIndex];
    if (nextSource == null) {
      continue;
    }

    var from = Object(nextSource);

    // We don't currently support accessors nor proxies. Therefore this
    // copy cannot throw. If we ever supported this then we must handle
    // exceptions and side-effects. We don't support symbols so they won't
    // be transferred.

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
  }

  return to;
};

module.exports = assign;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\PooledClass.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PooledClass
 */

"use strict";

var invariant = require("./invariant");

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function(a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function(a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fiveArgumentPooler = function(a1, a2, a3, a4, a5) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4, a5);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4, a5);
  }
};

var standardReleaser = function(instance) {
  var Klass = this;
  ("production" !== process.env.NODE_ENV ? invariant(
    instance instanceof Klass,
    'Trying to release an instance into a pool of a different type.'
  ) : invariant(instance instanceof Klass));
  if (instance.destructor) {
    instance.destructor();
  }
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances (optional).
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function(CopyConstructor, pooler) {
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fiveArgumentPooler: fiveArgumentPooler
};

module.exports = PooledClass;

}).call(this,require('_process'))
},{"./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\React.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule React
 */

"use strict";

var DOMPropertyOperations = require("./DOMPropertyOperations");
var EventPluginUtils = require("./EventPluginUtils");
var ReactChildren = require("./ReactChildren");
var ReactComponent = require("./ReactComponent");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");
var ReactDOM = require("./ReactDOM");
var ReactDOMComponent = require("./ReactDOMComponent");
var ReactDefaultInjection = require("./ReactDefaultInjection");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactLegacyElement = require("./ReactLegacyElement");
var ReactMount = require("./ReactMount");
var ReactMultiChild = require("./ReactMultiChild");
var ReactPerf = require("./ReactPerf");
var ReactPropTypes = require("./ReactPropTypes");
var ReactServerRendering = require("./ReactServerRendering");
var ReactTextComponent = require("./ReactTextComponent");

var assign = require("./Object.assign");
var deprecated = require("./deprecated");
var onlyChild = require("./onlyChild");

ReactDefaultInjection.inject();

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;

if ("production" !== process.env.NODE_ENV) {
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
}

// TODO: Drop legacy elements once classes no longer export these factories
createElement = ReactLegacyElement.wrapCreateElement(
  createElement
);
createFactory = ReactLegacyElement.wrapCreateFactory(
  createFactory
);

var render = ReactPerf.measure('React', 'render', ReactMount.render);

var React = {
  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    only: onlyChild
  },
  DOM: ReactDOM,
  PropTypes: ReactPropTypes,
  initializeTouchEvents: function(shouldUseTouch) {
    EventPluginUtils.useTouchEvents = shouldUseTouch;
  },
  createClass: ReactCompositeComponent.createClass,
  createElement: createElement,
  createFactory: createFactory,
  constructAndRenderComponent: ReactMount.constructAndRenderComponent,
  constructAndRenderComponentByID: ReactMount.constructAndRenderComponentByID,
  render: render,
  renderToString: ReactServerRendering.renderToString,
  renderToStaticMarkup: ReactServerRendering.renderToStaticMarkup,
  unmountComponentAtNode: ReactMount.unmountComponentAtNode,
  isValidClass: ReactLegacyElement.isValidClass,
  isValidElement: ReactElement.isValidElement,
  withContext: ReactContext.withContext,

  // Hook for JSX spread, don't use this for anything else.
  __spread: assign,

  // Deprecations (remove for 0.13)
  renderComponent: deprecated(
    'React',
    'renderComponent',
    'render',
    this,
    render
  ),
  renderComponentToString: deprecated(
    'React',
    'renderComponentToString',
    'renderToString',
    this,
    ReactServerRendering.renderToString
  ),
  renderComponentToStaticMarkup: deprecated(
    'React',
    'renderComponentToStaticMarkup',
    'renderToStaticMarkup',
    this,
    ReactServerRendering.renderToStaticMarkup
  ),
  isValidComponent: deprecated(
    'React',
    'isValidComponent',
    'isValidElement',
    this,
    ReactElement.isValidElement
  )
};

// Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
    Component: ReactComponent,
    CurrentOwner: ReactCurrentOwner,
    DOMComponent: ReactDOMComponent,
    DOMPropertyOperations: DOMPropertyOperations,
    InstanceHandles: ReactInstanceHandles,
    Mount: ReactMount,
    MultiChild: ReactMultiChild,
    TextComponent: ReactTextComponent
  });
}

if ("production" !== process.env.NODE_ENV) {
  var ExecutionEnvironment = require("./ExecutionEnvironment");
  if (ExecutionEnvironment.canUseDOM && window.top === window.self) {

    // If we're in Chrome, look for the devtools marker and provide a download
    // link if not installed.
    if (navigator.userAgent.indexOf('Chrome') > -1) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
        console.debug(
          'Download the React DevTools for a better development experience: ' +
          'http://fb.me/react-devtools'
        );
      }
    }

    var expectedFeatures = [
      // shims
      Array.isArray,
      Array.prototype.every,
      Array.prototype.forEach,
      Array.prototype.indexOf,
      Array.prototype.map,
      Date.now,
      Function.prototype.bind,
      Object.keys,
      String.prototype.split,
      String.prototype.trim,

      // shams
      Object.create,
      Object.freeze
    ];

    for (var i = 0; i < expectedFeatures.length; i++) {
      if (!expectedFeatures[i]) {
        console.error(
          'One or more ES5 shim/shams expected by React are not available: ' +
          'http://fb.me/react-warning-polyfills'
        );
        break;
      }
    }
  }
}

// Version exists only in the open-source version of React, not in Facebook's
// internal version.
React.version = '0.12.2';

module.exports = React;

}).call(this,require('_process'))
},{"./DOMPropertyOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMPropertyOperations.js","./EventPluginUtils":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginUtils.js","./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactChildren":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactChildren.js","./ReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactComponent.js","./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactContext":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactContext.js","./ReactCurrentOwner":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCurrentOwner.js","./ReactDOM":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOM.js","./ReactDOMComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMComponent.js","./ReactDefaultInjection":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDefaultInjection.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactElementValidator":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElementValidator.js","./ReactInstanceHandles":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInstanceHandles.js","./ReactLegacyElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactLegacyElement.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./ReactMultiChild":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMultiChild.js","./ReactPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js","./ReactPropTypes":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTypes.js","./ReactServerRendering":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactServerRendering.js","./ReactTextComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactTextComponent.js","./deprecated":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\deprecated.js","./onlyChild":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\onlyChild.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactBrowserComponentMixin
 */

"use strict";

var ReactEmptyComponent = require("./ReactEmptyComponent");
var ReactMount = require("./ReactMount");

var invariant = require("./invariant");

var ReactBrowserComponentMixin = {
  /**
   * Returns the DOM node rendered by this component.
   *
   * @return {DOMElement} The root node of this component.
   * @final
   * @protected
   */
  getDOMNode: function() {
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isMounted(),
      'getDOMNode(): A component must be mounted to have a DOM node.'
    ) : invariant(this.isMounted()));
    if (ReactEmptyComponent.isNullComponentID(this._rootNodeID)) {
      return null;
    }
    return ReactMount.getNode(this._rootNodeID);
  }
};

module.exports = ReactBrowserComponentMixin;

}).call(this,require('_process'))
},{"./ReactEmptyComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactEmptyComponent.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserEventEmitter.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactBrowserEventEmitter
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");
var EventPluginRegistry = require("./EventPluginRegistry");
var ReactEventEmitterMixin = require("./ReactEventEmitterMixin");
var ViewportMetrics = require("./ViewportMetrics");

var assign = require("./Object.assign");
var isEventSupported = require("./isEventSupported");

/**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactEventListener, which is injected and can therefore support pluggable
 *    event sources. This is the only work that occurs in the main thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */

var alreadyListeningTo = {};
var isMonitoringScrollValue = false;
var reactTopListenersCounter = 0;

// For events like 'submit' which don't consistently bubble (which we trap at a
// lower node than `document`), binding at `document` would cause duplicate
// events so we don't include them here
var topEventMapping = {
  topBlur: 'blur',
  topChange: 'change',
  topClick: 'click',
  topCompositionEnd: 'compositionend',
  topCompositionStart: 'compositionstart',
  topCompositionUpdate: 'compositionupdate',
  topContextMenu: 'contextmenu',
  topCopy: 'copy',
  topCut: 'cut',
  topDoubleClick: 'dblclick',
  topDrag: 'drag',
  topDragEnd: 'dragend',
  topDragEnter: 'dragenter',
  topDragExit: 'dragexit',
  topDragLeave: 'dragleave',
  topDragOver: 'dragover',
  topDragStart: 'dragstart',
  topDrop: 'drop',
  topFocus: 'focus',
  topInput: 'input',
  topKeyDown: 'keydown',
  topKeyPress: 'keypress',
  topKeyUp: 'keyup',
  topMouseDown: 'mousedown',
  topMouseMove: 'mousemove',
  topMouseOut: 'mouseout',
  topMouseOver: 'mouseover',
  topMouseUp: 'mouseup',
  topPaste: 'paste',
  topScroll: 'scroll',
  topSelectionChange: 'selectionchange',
  topTextInput: 'textInput',
  topTouchCancel: 'touchcancel',
  topTouchEnd: 'touchend',
  topTouchMove: 'touchmove',
  topTouchStart: 'touchstart',
  topWheel: 'wheel'
};

/**
 * To ensure no conflicts with other potential React instances on the page
 */
var topListenersIDKey = "_reactListenersID" + String(Math.random()).slice(2);

function getListeningForDocument(mountAt) {
  // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
  // directly.
  if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
    mountAt[topListenersIDKey] = reactTopListenersCounter++;
    alreadyListeningTo[mountAt[topListenersIDKey]] = {};
  }
  return alreadyListeningTo[mountAt[topListenersIDKey]];
}

/**
 * `ReactBrowserEventEmitter` is used to attach top-level event listeners. For
 * example:
 *
 *   ReactBrowserEventEmitter.putListener('myID', 'onClick', myFunction);
 *
 * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
 *
 * @internal
 */
var ReactBrowserEventEmitter = assign({}, ReactEventEmitterMixin, {

  /**
   * Injectable event backend
   */
  ReactEventListener: null,

  injection: {
    /**
     * @param {object} ReactEventListener
     */
    injectReactEventListener: function(ReactEventListener) {
      ReactEventListener.setHandleTopLevel(
        ReactBrowserEventEmitter.handleTopLevel
      );
      ReactBrowserEventEmitter.ReactEventListener = ReactEventListener;
    }
  },

  /**
   * Sets whether or not any created callbacks should be enabled.
   *
   * @param {boolean} enabled True if callbacks should be enabled.
   */
  setEnabled: function(enabled) {
    if (ReactBrowserEventEmitter.ReactEventListener) {
      ReactBrowserEventEmitter.ReactEventListener.setEnabled(enabled);
    }
  },

  /**
   * @return {boolean} True if callbacks are enabled.
   */
  isEnabled: function() {
    return !!(
      ReactBrowserEventEmitter.ReactEventListener &&
      ReactBrowserEventEmitter.ReactEventListener.isEnabled()
    );
  },

  /**
   * We listen for bubbled touch events on the document object.
   *
   * Firefox v8.01 (and possibly others) exhibited strange behavior when
   * mounting `onmousemove` events at some node that was not the document
   * element. The symptoms were that if your mouse is not moving over something
   * contained within that mount point (for example on the background) the
   * top-level listeners for `onmousemove` won't be called. However, if you
   * register the `mousemove` on the document object, then it will of course
   * catch all `mousemove`s. This along with iOS quirks, justifies restricting
   * top-level listeners to the document object only, at least for these
   * movement types of events and possibly all events.
   *
   * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
   *
   * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
   * they bubble to document.
   *
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {object} contentDocumentHandle Document which owns the container
   */
  listenTo: function(registrationName, contentDocumentHandle) {
    var mountAt = contentDocumentHandle;
    var isListening = getListeningForDocument(mountAt);
    var dependencies = EventPluginRegistry.
      registrationNameDependencies[registrationName];

    var topLevelTypes = EventConstants.topLevelTypes;
    for (var i = 0, l = dependencies.length; i < l; i++) {
      var dependency = dependencies[i];
      if (!(
            isListening.hasOwnProperty(dependency) &&
            isListening[dependency]
          )) {
        if (dependency === topLevelTypes.topWheel) {
          if (isEventSupported('wheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topWheel,
              'wheel',
              mountAt
            );
          } else if (isEventSupported('mousewheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topWheel,
              'mousewheel',
              mountAt
            );
          } else {
            // Firefox needs to capture a different mouse scroll event.
            // @see http://www.quirksmode.org/dom/events/tests/scroll.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topWheel,
              'DOMMouseScroll',
              mountAt
            );
          }
        } else if (dependency === topLevelTypes.topScroll) {

          if (isEventSupported('scroll', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
              topLevelTypes.topScroll,
              'scroll',
              mountAt
            );
          } else {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topScroll,
              'scroll',
              ReactBrowserEventEmitter.ReactEventListener.WINDOW_HANDLE
            );
          }
        } else if (dependency === topLevelTypes.topFocus ||
            dependency === topLevelTypes.topBlur) {

          if (isEventSupported('focus', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
              topLevelTypes.topFocus,
              'focus',
              mountAt
            );
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
              topLevelTypes.topBlur,
              'blur',
              mountAt
            );
          } else if (isEventSupported('focusin')) {
            // IE has `focusin` and `focusout` events which bubble.
            // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topFocus,
              'focusin',
              mountAt
            );
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topBlur,
              'focusout',
              mountAt
            );
          }

          // to make sure blur and focus event listeners are only attached once
          isListening[topLevelTypes.topBlur] = true;
          isListening[topLevelTypes.topFocus] = true;
        } else if (topEventMapping.hasOwnProperty(dependency)) {
          ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
            dependency,
            topEventMapping[dependency],
            mountAt
          );
        }

        isListening[dependency] = true;
      }
    }
  },

  trapBubbledEvent: function(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
      topLevelType,
      handlerBaseName,
      handle
    );
  },

  trapCapturedEvent: function(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
      topLevelType,
      handlerBaseName,
      handle
    );
  },

  /**
   * Listens to window scroll and resize events. We cache scroll values so that
   * application code can access them without triggering reflows.
   *
   * NOTE: Scroll events do not bubble.
   *
   * @see http://www.quirksmode.org/dom/events/scroll.html
   */
  ensureScrollValueMonitoring: function(){
    if (!isMonitoringScrollValue) {
      var refresh = ViewportMetrics.refreshScrollValues;
      ReactBrowserEventEmitter.ReactEventListener.monitorScrollValue(refresh);
      isMonitoringScrollValue = true;
    }
  },

  eventNameDispatchConfigs: EventPluginHub.eventNameDispatchConfigs,

  registrationNameModules: EventPluginHub.registrationNameModules,

  putListener: EventPluginHub.putListener,

  getListener: EventPluginHub.getListener,

  deleteListener: EventPluginHub.deleteListener,

  deleteAllListeners: EventPluginHub.deleteAllListeners

});

module.exports = ReactBrowserEventEmitter;

},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./EventPluginHub":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginHub.js","./EventPluginRegistry":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginRegistry.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactEventEmitterMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactEventEmitterMixin.js","./ViewportMetrics":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ViewportMetrics.js","./isEventSupported":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isEventSupported.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactChildren.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactChildren
 */

"use strict";

var PooledClass = require("./PooledClass");

var traverseAllChildren = require("./traverseAllChildren");
var warning = require("./warning");

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var threeArgumentPooler = PooledClass.threeArgumentPooler;

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.forEachFunction = forEachFunction;
  this.forEachContext = forEachContext;
}
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(traverseContext, child, name, i) {
  var forEachBookKeeping = traverseContext;
  forEachBookKeeping.forEachFunction.call(
    forEachBookKeeping.forEachContext, child, i);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc.
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }

  var traverseContext =
    ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, mapFunction, mapContext) {
  this.mapResult = mapResult;
  this.mapFunction = mapFunction;
  this.mapContext = mapContext;
}
PooledClass.addPoolingTo(MapBookKeeping, threeArgumentPooler);

function mapSingleChildIntoContext(traverseContext, child, name, i) {
  var mapBookKeeping = traverseContext;
  var mapResult = mapBookKeeping.mapResult;

  var keyUnique = !mapResult.hasOwnProperty(name);
  ("production" !== process.env.NODE_ENV ? warning(
    keyUnique,
    'ReactChildren.map(...): Encountered two children with the same key, ' +
    '`%s`. Child keys must be unique; when two children share a key, only ' +
    'the first child will be used.',
    name
  ) : null);

  if (keyUnique) {
    var mappedChild =
      mapBookKeeping.mapFunction.call(mapBookKeeping.mapContext, child, i);
    mapResult[name] = mappedChild;
  }
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * TODO: This may likely break any calls to `ReactChildren.map` that were
 * previously relying on the fact that we guarded against null children.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} mapFunction.
 * @param {*} mapContext Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var mapResult = {};
  var traverseContext = MapBookKeeping.getPooled(mapResult, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
  return mapResult;
}

function forEachSingleChildDummy(traverseContext, child, name, i) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, forEachSingleChildDummy, null);
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  count: countChildren
};

module.exports = ReactChildren;

}).call(this,require('_process'))
},{"./PooledClass":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\PooledClass.js","./traverseAllChildren":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\traverseAllChildren.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactComponent.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponent
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactOwner = require("./ReactOwner");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var invariant = require("./invariant");
var keyMirror = require("./keyMirror");

/**
 * Every React component is in one of these life cycles.
 */
var ComponentLifeCycle = keyMirror({
  /**
   * Mounted components have a DOM node representation and are capable of
   * receiving new props.
   */
  MOUNTED: null,
  /**
   * Unmounted components are inactive and cannot receive new props.
   */
  UNMOUNTED: null
});

var injected = false;

/**
 * Optionally injectable environment dependent cleanup hook. (server vs.
 * browser etc). Example: A browser system caches DOM nodes based on component
 * ID and must remove that cache entry when this instance is unmounted.
 *
 * @private
 */
var unmountIDFromEnvironment = null;

/**
 * The "image" of a component tree, is the platform specific (typically
 * serialized) data that represents a tree of lower level UI building blocks.
 * On the web, this "image" is HTML markup which describes a construction of
 * low level `div` and `span` nodes. Other platforms may have different
 * encoding of this "image". This must be injected.
 *
 * @private
 */
var mountImageIntoNode = null;

/**
 * Components are the basic units of composition in React.
 *
 * Every component accepts a set of keyed input parameters known as "props" that
 * are initialized by the constructor. Once a component is mounted, the props
 * can be mutated using `setProps` or `replaceProps`.
 *
 * Every component is capable of the following operations:
 *
 *   `mountComponent`
 *     Initializes the component, renders markup, and registers event listeners.
 *
 *   `receiveComponent`
 *     Updates the rendered DOM nodes to match the given component.
 *
 *   `unmountComponent`
 *     Releases any resources allocated by this component.
 *
 * Components can also be "owned" by other components. Being owned by another
 * component means being constructed by that component. This is different from
 * being the child of a component, which means having a DOM representation that
 * is a child of the DOM representation of that component.
 *
 * @class ReactComponent
 */
var ReactComponent = {

  injection: {
    injectEnvironment: function(ReactComponentEnvironment) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !injected,
        'ReactComponent: injectEnvironment() can only be called once.'
      ) : invariant(!injected));
      mountImageIntoNode = ReactComponentEnvironment.mountImageIntoNode;
      unmountIDFromEnvironment =
        ReactComponentEnvironment.unmountIDFromEnvironment;
      ReactComponent.BackendIDOperations =
        ReactComponentEnvironment.BackendIDOperations;
      injected = true;
    }
  },

  /**
   * @internal
   */
  LifeCycle: ComponentLifeCycle,

  /**
   * Injected module that provides ability to mutate individual properties.
   * Injected into the base class because many different subclasses need access
   * to this.
   *
   * @internal
   */
  BackendIDOperations: null,

  /**
   * Base functionality for every ReactComponent constructor. Mixed into the
   * `ReactComponent` prototype, but exposed statically for easy access.
   *
   * @lends {ReactComponent.prototype}
   */
  Mixin: {

    /**
     * Checks whether or not this component is mounted.
     *
     * @return {boolean} True if mounted, false otherwise.
     * @final
     * @protected
     */
    isMounted: function() {
      return this._lifeCycleState === ComponentLifeCycle.MOUNTED;
    },

    /**
     * Sets a subset of the props.
     *
     * @param {object} partialProps Subset of the next props.
     * @param {?function} callback Called after props are updated.
     * @final
     * @public
     */
    setProps: function(partialProps, callback) {
      // Merge with the pending element if it exists, otherwise with existing
      // element props.
      var element = this._pendingElement || this._currentElement;
      this.replaceProps(
        assign({}, element.props, partialProps),
        callback
      );
    },

    /**
     * Replaces all of the props.
     *
     * @param {object} props New props.
     * @param {?function} callback Called after props are updated.
     * @final
     * @public
     */
    replaceProps: function(props, callback) {
      ("production" !== process.env.NODE_ENV ? invariant(
        this.isMounted(),
        'replaceProps(...): Can only update a mounted component.'
      ) : invariant(this.isMounted()));
      ("production" !== process.env.NODE_ENV ? invariant(
        this._mountDepth === 0,
        'replaceProps(...): You called `setProps` or `replaceProps` on a ' +
        'component with a parent. This is an anti-pattern since props will ' +
        'get reactively updated when rendered. Instead, change the owner\'s ' +
        '`render` method to pass the correct value as props to the component ' +
        'where it is created.'
      ) : invariant(this._mountDepth === 0));
      // This is a deoptimized path. We optimize for always having a element.
      // This creates an extra internal element.
      this._pendingElement = ReactElement.cloneAndReplaceProps(
        this._pendingElement || this._currentElement,
        props
      );
      ReactUpdates.enqueueUpdate(this, callback);
    },

    /**
     * Schedule a partial update to the props. Only used for internal testing.
     *
     * @param {object} partialProps Subset of the next props.
     * @param {?function} callback Called after props are updated.
     * @final
     * @internal
     */
    _setPropsInternal: function(partialProps, callback) {
      // This is a deoptimized path. We optimize for always having a element.
      // This creates an extra internal element.
      var element = this._pendingElement || this._currentElement;
      this._pendingElement = ReactElement.cloneAndReplaceProps(
        element,
        assign({}, element.props, partialProps)
      );
      ReactUpdates.enqueueUpdate(this, callback);
    },

    /**
     * Base constructor for all React components.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.construct.call(this, ...)`.
     *
     * @param {ReactElement} element
     * @internal
     */
    construct: function(element) {
      // This is the public exposed props object after it has been processed
      // with default props. The element's props represents the true internal
      // state of the props.
      this.props = element.props;
      // Record the component responsible for creating this component.
      // This is accessible through the element but we maintain an extra
      // field for compatibility with devtools and as a way to make an
      // incremental update. TODO: Consider deprecating this field.
      this._owner = element._owner;

      // All components start unmounted.
      this._lifeCycleState = ComponentLifeCycle.UNMOUNTED;

      // See ReactUpdates.
      this._pendingCallbacks = null;

      // We keep the old element and a reference to the pending element
      // to track updates.
      this._currentElement = element;
      this._pendingElement = null;
    },

    /**
     * Initializes the component, renders markup, and registers event listeners.
     *
     * NOTE: This does not insert any nodes into the DOM.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.mountComponent.call(this, ...)`.
     *
     * @param {string} rootID DOM ID of the root node.
     * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
     * @param {number} mountDepth number of components in the owner hierarchy.
     * @return {?string} Rendered markup to be inserted into the DOM.
     * @internal
     */
    mountComponent: function(rootID, transaction, mountDepth) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !this.isMounted(),
        'mountComponent(%s, ...): Can only mount an unmounted component. ' +
        'Make sure to avoid storing components between renders or reusing a ' +
        'single component instance in multiple places.',
        rootID
      ) : invariant(!this.isMounted()));
      var ref = this._currentElement.ref;
      if (ref != null) {
        var owner = this._currentElement._owner;
        ReactOwner.addComponentAsRefTo(this, ref, owner);
      }
      this._rootNodeID = rootID;
      this._lifeCycleState = ComponentLifeCycle.MOUNTED;
      this._mountDepth = mountDepth;
      // Effectively: return '';
    },

    /**
     * Releases any resources allocated by `mountComponent`.
     *
     * NOTE: This does not remove any nodes from the DOM.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.unmountComponent.call(this)`.
     *
     * @internal
     */
    unmountComponent: function() {
      ("production" !== process.env.NODE_ENV ? invariant(
        this.isMounted(),
        'unmountComponent(): Can only unmount a mounted component.'
      ) : invariant(this.isMounted()));
      var ref = this._currentElement.ref;
      if (ref != null) {
        ReactOwner.removeComponentAsRefFrom(this, ref, this._owner);
      }
      unmountIDFromEnvironment(this._rootNodeID);
      this._rootNodeID = null;
      this._lifeCycleState = ComponentLifeCycle.UNMOUNTED;
    },

    /**
     * Given a new instance of this component, updates the rendered DOM nodes
     * as if that instance was rendered instead.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.receiveComponent.call(this, ...)`.
     *
     * @param {object} nextComponent Next set of properties.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    receiveComponent: function(nextElement, transaction) {
      ("production" !== process.env.NODE_ENV ? invariant(
        this.isMounted(),
        'receiveComponent(...): Can only update a mounted component.'
      ) : invariant(this.isMounted()));
      this._pendingElement = nextElement;
      this.performUpdateIfNecessary(transaction);
    },

    /**
     * If `_pendingElement` is set, update the component.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    performUpdateIfNecessary: function(transaction) {
      if (this._pendingElement == null) {
        return;
      }
      var prevElement = this._currentElement;
      var nextElement = this._pendingElement;
      this._currentElement = nextElement;
      this.props = nextElement.props;
      this._owner = nextElement._owner;
      this._pendingElement = null;
      this.updateComponent(transaction, prevElement);
    },

    /**
     * Updates the component's currently mounted representation.
     *
     * @param {ReactReconcileTransaction} transaction
     * @param {object} prevElement
     * @internal
     */
    updateComponent: function(transaction, prevElement) {
      var nextElement = this._currentElement;

      // If either the owner or a `ref` has changed, make sure the newest owner
      // has stored a reference to `this`, and the previous owner (if different)
      // has forgotten the reference to `this`. We use the element instead
      // of the public this.props because the post processing cannot determine
      // a ref. The ref conceptually lives on the element.

      // TODO: Should this even be possible? The owner cannot change because
      // it's forbidden by shouldUpdateReactComponent. The ref can change
      // if you swap the keys of but not the refs. Reconsider where this check
      // is made. It probably belongs where the key checking and
      // instantiateReactComponent is done.

      if (nextElement._owner !== prevElement._owner ||
          nextElement.ref !== prevElement.ref) {
        if (prevElement.ref != null) {
          ReactOwner.removeComponentAsRefFrom(
            this, prevElement.ref, prevElement._owner
          );
        }
        // Correct, even if the owner is the same, and only the ref has changed.
        if (nextElement.ref != null) {
          ReactOwner.addComponentAsRefTo(
            this,
            nextElement.ref,
            nextElement._owner
          );
        }
      }
    },

    /**
     * Mounts this component and inserts it into the DOM.
     *
     * @param {string} rootID DOM ID of the root node.
     * @param {DOMElement} container DOM element to mount into.
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     * @final
     * @internal
     * @see {ReactMount.render}
     */
    mountComponentIntoNode: function(rootID, container, shouldReuseMarkup) {
      var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
      transaction.perform(
        this._mountComponentIntoNode,
        this,
        rootID,
        container,
        transaction,
        shouldReuseMarkup
      );
      ReactUpdates.ReactReconcileTransaction.release(transaction);
    },

    /**
     * @param {string} rootID DOM ID of the root node.
     * @param {DOMElement} container DOM element to mount into.
     * @param {ReactReconcileTransaction} transaction
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     * @final
     * @private
     */
    _mountComponentIntoNode: function(
        rootID,
        container,
        transaction,
        shouldReuseMarkup) {
      var markup = this.mountComponent(rootID, transaction, 0);
      mountImageIntoNode(markup, container, shouldReuseMarkup);
    },

    /**
     * Checks if this component is owned by the supplied `owner` component.
     *
     * @param {ReactComponent} owner Component to check.
     * @return {boolean} True if `owners` owns this component.
     * @final
     * @internal
     */
    isOwnedBy: function(owner) {
      return this._owner === owner;
    },

    /**
     * Gets another component, that shares the same owner as this one, by ref.
     *
     * @param {string} ref of a sibling Component.
     * @return {?ReactComponent} the actual sibling Component.
     * @final
     * @internal
     */
    getSiblingByRef: function(ref) {
      var owner = this._owner;
      if (!owner || !owner.refs) {
        return null;
      }
      return owner.refs[ref];
    }
  }
};

module.exports = ReactComponent;

}).call(this,require('_process'))
},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactOwner":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactOwner.js","./ReactUpdates":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./keyMirror":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyMirror.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactComponentBrowserEnvironment.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponentBrowserEnvironment
 */

/*jslint evil: true */

"use strict";

var ReactDOMIDOperations = require("./ReactDOMIDOperations");
var ReactMarkupChecksum = require("./ReactMarkupChecksum");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");
var ReactReconcileTransaction = require("./ReactReconcileTransaction");

var getReactRootElementInContainer = require("./getReactRootElementInContainer");
var invariant = require("./invariant");
var setInnerHTML = require("./setInnerHTML");


var ELEMENT_NODE_TYPE = 1;
var DOC_NODE_TYPE = 9;


/**
 * Abstracts away all functionality of `ReactComponent` requires knowledge of
 * the browser context.
 */
var ReactComponentBrowserEnvironment = {
  ReactReconcileTransaction: ReactReconcileTransaction,

  BackendIDOperations: ReactDOMIDOperations,

  /**
   * If a particular environment requires that some resources be cleaned up,
   * specify this in the injected Mixin. In the DOM, we would likely want to
   * purge any cached node ID lookups.
   *
   * @private
   */
  unmountIDFromEnvironment: function(rootNodeID) {
    ReactMount.purgeID(rootNodeID);
  },

  /**
   * @param {string} markup Markup string to place into the DOM Element.
   * @param {DOMElement} container DOM Element to insert markup into.
   * @param {boolean} shouldReuseMarkup Should reuse the existing markup in the
   * container if possible.
   */
  mountImageIntoNode: ReactPerf.measure(
    'ReactComponentBrowserEnvironment',
    'mountImageIntoNode',
    function(markup, container, shouldReuseMarkup) {
      ("production" !== process.env.NODE_ENV ? invariant(
        container && (
          container.nodeType === ELEMENT_NODE_TYPE ||
            container.nodeType === DOC_NODE_TYPE
        ),
        'mountComponentIntoNode(...): Target container is not valid.'
      ) : invariant(container && (
        container.nodeType === ELEMENT_NODE_TYPE ||
          container.nodeType === DOC_NODE_TYPE
      )));

      if (shouldReuseMarkup) {
        if (ReactMarkupChecksum.canReuseMarkup(
          markup,
          getReactRootElementInContainer(container))) {
          return;
        } else {
          ("production" !== process.env.NODE_ENV ? invariant(
            container.nodeType !== DOC_NODE_TYPE,
            'You\'re trying to render a component to the document using ' +
            'server rendering but the checksum was invalid. This usually ' +
            'means you rendered a different component type or props on ' +
            'the client from the one on the server, or your render() ' +
            'methods are impure. React cannot handle this case due to ' +
            'cross-browser quirks by rendering at the document root. You ' +
            'should look for environment dependent code in your components ' +
            'and ensure the props are the same client and server side.'
          ) : invariant(container.nodeType !== DOC_NODE_TYPE));

          if ("production" !== process.env.NODE_ENV) {
            console.warn(
              'React attempted to use reuse markup in a container but the ' +
              'checksum was invalid. This generally means that you are ' +
              'using server rendering and the markup generated on the ' +
              'server was not what the client was expecting. React injected ' +
              'new markup to compensate which works but you have lost many ' +
              'of the benefits of server rendering. Instead, figure out ' +
              'why the markup being generated is different on the client ' +
              'or server.'
            );
          }
        }
      }

      ("production" !== process.env.NODE_ENV ? invariant(
        container.nodeType !== DOC_NODE_TYPE,
        'You\'re trying to render a component to the document but ' +
          'you didn\'t use server rendering. We can\'t do this ' +
          'without using server rendering due to cross-browser quirks. ' +
          'See renderComponentToString() for server rendering.'
      ) : invariant(container.nodeType !== DOC_NODE_TYPE));

      setInnerHTML(container, markup);
    }
  )
};

module.exports = ReactComponentBrowserEnvironment;

}).call(this,require('_process'))
},{"./ReactDOMIDOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMIDOperations.js","./ReactMarkupChecksum":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMarkupChecksum.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./ReactPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js","./ReactReconcileTransaction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactReconcileTransaction.js","./getReactRootElementInContainer":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getReactRootElementInContainer.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./setInnerHTML":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\setInnerHTML.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCompositeComponent
 */

"use strict";

var ReactComponent = require("./ReactComponent");
var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");
var ReactEmptyComponent = require("./ReactEmptyComponent");
var ReactErrorUtils = require("./ReactErrorUtils");
var ReactLegacyElement = require("./ReactLegacyElement");
var ReactOwner = require("./ReactOwner");
var ReactPerf = require("./ReactPerf");
var ReactPropTransferer = require("./ReactPropTransferer");
var ReactPropTypeLocations = require("./ReactPropTypeLocations");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");
var keyMirror = require("./keyMirror");
var keyOf = require("./keyOf");
var monitorCodeUse = require("./monitorCodeUse");
var mapObject = require("./mapObject");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");
var warning = require("./warning");

var MIXINS_KEY = keyOf({mixins: null});

/**
 * Policies that describe methods in `ReactCompositeComponentInterface`.
 */
var SpecPolicy = keyMirror({
  /**
   * These methods may be defined only once by the class specification or mixin.
   */
  DEFINE_ONCE: null,
  /**
   * These methods may be defined by both the class specification and mixins.
   * Subsequent definitions will be chained. These methods must return void.
   */
  DEFINE_MANY: null,
  /**
   * These methods are overriding the base ReactCompositeComponent class.
   */
  OVERRIDE_BASE: null,
  /**
   * These methods are similar to DEFINE_MANY, except we assume they return
   * objects. We try to merge the keys of the return values of all the mixed in
   * functions. If there is a key conflict we throw.
   */
  DEFINE_MANY_MERGED: null
});


var injectedMixins = [];

/**
 * Composite components are higher-level components that compose other composite
 * or native components.
 *
 * To create a new type of `ReactCompositeComponent`, pass a specification of
 * your new class to `React.createClass`. The only requirement of your class
 * specification is that you implement a `render` method.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return <div>Hello World</div>;
 *     }
 *   });
 *
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `render`). See `ReactCompositeComponentInterface` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will available on the prototype.
 *
 * @interface ReactCompositeComponentInterface
 * @internal
 */
var ReactCompositeComponentInterface = {

  /**
   * An array of Mixin objects to include when defining your component.
   *
   * @type {array}
   * @optional
   */
  mixins: SpecPolicy.DEFINE_MANY,

  /**
   * An object containing properties and methods that should be defined on
   * the component's constructor instead of its prototype (static methods).
   *
   * @type {object}
   * @optional
   */
  statics: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of prop types for this component.
   *
   * @type {object}
   * @optional
   */
  propTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types for this component.
   *
   * @type {object}
   * @optional
   */
  contextTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types this component sets for its children.
   *
   * @type {object}
   * @optional
   */
  childContextTypes: SpecPolicy.DEFINE_MANY,

  // ==== Definition methods ====

  /**
   * Invoked when the component is mounted. Values in the mapping will be set on
   * `this.props` if that prop is not specified (i.e. using an `in` check).
   *
   * This method is invoked before `getInitialState` and therefore cannot rely
   * on `this.state` or use `this.setState`.
   *
   * @return {object}
   * @optional
   */
  getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Invoked once before the component is mounted. The return value will be used
   * as the initial value of `this.state`.
   *
   *   getInitialState: function() {
   *     return {
   *       isOn: false,
   *       fooBaz: new BazFoo()
   *     }
   *   }
   *
   * @return {object}
   * @optional
   */
  getInitialState: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * @return {object}
   * @optional
   */
  getChildContext: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Uses props from `this.props` and state from `this.state` to render the
   * structure of the component.
   *
   * No guarantees are made about when or how often this method is invoked, so
   * it must not have side effects.
   *
   *   render: function() {
   *     var name = this.props.name;
   *     return <div>Hello, {name}!</div>;
   *   }
   *
   * @return {ReactComponent}
   * @nosideeffects
   * @required
   */
  render: SpecPolicy.DEFINE_ONCE,



  // ==== Delegate methods ====

  /**
   * Invoked when the component is initially created and about to be mounted.
   * This may have side effects, but any external subscriptions or data created
   * by this method must be cleaned up in `componentWillUnmount`.
   *
   * @optional
   */
  componentWillMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component has been mounted and has a DOM representation.
   * However, there is no guarantee that the DOM node is in the document.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been mounted (initialized and rendered) for the first time.
   *
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked before the component receives new props.
   *
   * Use this as an opportunity to react to a prop transition by updating the
   * state using `this.setState`. Current props are accessed via `this.props`.
   *
   *   componentWillReceiveProps: function(nextProps, nextContext) {
   *     this.setState({
   *       likesIncreasing: nextProps.likeCount > this.props.likeCount
   *     });
   *   }
   *
   * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
   * transition may cause a state change, but the opposite is not true. If you
   * need it, you are probably looking for `componentWillUpdate`.
   *
   * @param {object} nextProps
   * @optional
   */
  componentWillReceiveProps: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked while deciding if the component should be updated as a result of
   * receiving new props, state and/or context.
   *
   * Use this as an opportunity to `return false` when you're certain that the
   * transition to the new props/state/context will not require a component
   * update.
   *
   *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
   *     return !equal(nextProps, this.props) ||
   *       !equal(nextState, this.state) ||
   *       !equal(nextContext, this.context);
   *   }
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @return {boolean} True if the component should update.
   * @optional
   */
  shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,

  /**
   * Invoked when the component is about to update due to a transition from
   * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
   * and `nextContext`.
   *
   * Use this as an opportunity to perform preparation before an update occurs.
   *
   * NOTE: You **cannot** use `this.setState()` in this method.
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @param {ReactReconcileTransaction} transaction
   * @optional
   */
  componentWillUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component's DOM representation has been updated.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been updated.
   *
   * @param {object} prevProps
   * @param {?object} prevState
   * @param {?object} prevContext
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component is about to be removed from its parent and have
   * its DOM representation destroyed.
   *
   * Use this as an opportunity to deallocate any external resources.
   *
   * NOTE: There is no `componentDidUnmount` since your component will have been
   * destroyed by that point.
   *
   * @optional
   */
  componentWillUnmount: SpecPolicy.DEFINE_MANY,



  // ==== Advanced methods ====

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   * @overridable
   */
  updateComponent: SpecPolicy.OVERRIDE_BASE

};

/**
 * Mapping from class specification keys to special processing functions.
 *
 * Although these are declared like instance properties in the specification
 * when defining classes using `React.createClass`, they are actually static
 * and are accessible on the constructor instead of the prototype. Despite
 * being static, they must be defined outside of the "statics" key under
 * which all other static methods are defined.
 */
var RESERVED_SPEC_KEYS = {
  displayName: function(Constructor, displayName) {
    Constructor.displayName = displayName;
  },
  mixins: function(Constructor, mixins) {
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        mixSpecIntoComponent(Constructor, mixins[i]);
      }
    }
  },
  childContextTypes: function(Constructor, childContextTypes) {
    validateTypeDef(
      Constructor,
      childContextTypes,
      ReactPropTypeLocations.childContext
    );
    Constructor.childContextTypes = assign(
      {},
      Constructor.childContextTypes,
      childContextTypes
    );
  },
  contextTypes: function(Constructor, contextTypes) {
    validateTypeDef(
      Constructor,
      contextTypes,
      ReactPropTypeLocations.context
    );
    Constructor.contextTypes = assign(
      {},
      Constructor.contextTypes,
      contextTypes
    );
  },
  /**
   * Special case getDefaultProps which should move into statics but requires
   * automatic merging.
   */
  getDefaultProps: function(Constructor, getDefaultProps) {
    if (Constructor.getDefaultProps) {
      Constructor.getDefaultProps = createMergedResultFunction(
        Constructor.getDefaultProps,
        getDefaultProps
      );
    } else {
      Constructor.getDefaultProps = getDefaultProps;
    }
  },
  propTypes: function(Constructor, propTypes) {
    validateTypeDef(
      Constructor,
      propTypes,
      ReactPropTypeLocations.prop
    );
    Constructor.propTypes = assign(
      {},
      Constructor.propTypes,
      propTypes
    );
  },
  statics: function(Constructor, statics) {
    mixStaticSpecIntoComponent(Constructor, statics);
  }
};

function getDeclarationErrorAddendum(component) {
  var owner = component._owner || null;
  if (owner && owner.constructor && owner.constructor.displayName) {
    return ' Check the render method of `' + owner.constructor.displayName +
      '`.';
  }
  return '';
}

function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof typeDef[propName] == 'function',
        '%s: %s type `%s` is invalid; it must be a function, usually from ' +
        'React.PropTypes.',
        Constructor.displayName || 'ReactCompositeComponent',
        ReactPropTypeLocationNames[location],
        propName
      ) : invariant(typeof typeDef[propName] == 'function'));
    }
  }
}

function validateMethodOverride(proto, name) {
  var specPolicy = ReactCompositeComponentInterface.hasOwnProperty(name) ?
    ReactCompositeComponentInterface[name] :
    null;

  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactCompositeComponentMixin.hasOwnProperty(name)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      specPolicy === SpecPolicy.OVERRIDE_BASE,
      'ReactCompositeComponentInterface: You are attempting to override ' +
      '`%s` from your class specification. Ensure that your method names ' +
      'do not overlap with React methods.',
      name
    ) : invariant(specPolicy === SpecPolicy.OVERRIDE_BASE));
  }

  // Disallow defining methods more than once unless explicitly allowed.
  if (proto.hasOwnProperty(name)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      specPolicy === SpecPolicy.DEFINE_MANY ||
      specPolicy === SpecPolicy.DEFINE_MANY_MERGED,
      'ReactCompositeComponentInterface: You are attempting to define ' +
      '`%s` on your component more than once. This conflict may be due ' +
      'to a mixin.',
      name
    ) : invariant(specPolicy === SpecPolicy.DEFINE_MANY ||
    specPolicy === SpecPolicy.DEFINE_MANY_MERGED));
  }
}

function validateLifeCycleOnReplaceState(instance) {
  var compositeLifeCycleState = instance._compositeLifeCycleState;
  ("production" !== process.env.NODE_ENV ? invariant(
    instance.isMounted() ||
      compositeLifeCycleState === CompositeLifeCycle.MOUNTING,
    'replaceState(...): Can only update a mounted or mounting component.'
  ) : invariant(instance.isMounted() ||
    compositeLifeCycleState === CompositeLifeCycle.MOUNTING));
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactCurrentOwner.current == null,
    'replaceState(...): Cannot update during an existing state transition ' +
    '(such as within `render`). Render methods should be a pure function ' +
    'of props and state.'
  ) : invariant(ReactCurrentOwner.current == null));
  ("production" !== process.env.NODE_ENV ? invariant(compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING,
    'replaceState(...): Cannot update while unmounting component. This ' +
    'usually means you called setState() on an unmounted component.'
  ) : invariant(compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING));
}

/**
 * Mixin helper which handles policy validation and reserved
 * specification keys when building `ReactCompositeComponent` classses.
 */
function mixSpecIntoComponent(Constructor, spec) {
  if (!spec) {
    return;
  }

  ("production" !== process.env.NODE_ENV ? invariant(
    !ReactLegacyElement.isValidFactory(spec),
    'ReactCompositeComponent: You\'re attempting to ' +
    'use a component class as a mixin. Instead, just use a regular object.'
  ) : invariant(!ReactLegacyElement.isValidFactory(spec)));
  ("production" !== process.env.NODE_ENV ? invariant(
    !ReactElement.isValidElement(spec),
    'ReactCompositeComponent: You\'re attempting to ' +
    'use a component as a mixin. Instead, just use a regular object.'
  ) : invariant(!ReactElement.isValidElement(spec)));

  var proto = Constructor.prototype;

  // By handling mixins before any other properties, we ensure the same
  // chaining order is applied to methods with DEFINE_MANY policy, whether
  // mixins are listed before or after these methods in the spec.
  if (spec.hasOwnProperty(MIXINS_KEY)) {
    RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
  }

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    if (name === MIXINS_KEY) {
      // We have already handled mixins in a special case above
      continue;
    }

    var property = spec[name];
    validateMethodOverride(proto, name);

    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
      RESERVED_SPEC_KEYS[name](Constructor, property);
    } else {
      // Setup methods on prototype:
      // The following member methods should not be automatically bound:
      // 1. Expected ReactCompositeComponent methods (in the "interface").
      // 2. Overridden methods (that were mixed in).
      var isCompositeComponentMethod =
        ReactCompositeComponentInterface.hasOwnProperty(name);
      var isAlreadyDefined = proto.hasOwnProperty(name);
      var markedDontBind = property && property.__reactDontBind;
      var isFunction = typeof property === 'function';
      var shouldAutoBind =
        isFunction &&
        !isCompositeComponentMethod &&
        !isAlreadyDefined &&
        !markedDontBind;

      if (shouldAutoBind) {
        if (!proto.__reactAutoBindMap) {
          proto.__reactAutoBindMap = {};
        }
        proto.__reactAutoBindMap[name] = property;
        proto[name] = property;
      } else {
        if (isAlreadyDefined) {
          var specPolicy = ReactCompositeComponentInterface[name];

          // These cases should already be caught by validateMethodOverride
          ("production" !== process.env.NODE_ENV ? invariant(
            isCompositeComponentMethod && (
              specPolicy === SpecPolicy.DEFINE_MANY_MERGED ||
              specPolicy === SpecPolicy.DEFINE_MANY
            ),
            'ReactCompositeComponent: Unexpected spec policy %s for key %s ' +
            'when mixing in component specs.',
            specPolicy,
            name
          ) : invariant(isCompositeComponentMethod && (
            specPolicy === SpecPolicy.DEFINE_MANY_MERGED ||
            specPolicy === SpecPolicy.DEFINE_MANY
          )));

          // For methods which are defined more than once, call the existing
          // methods before calling the new property, merging if appropriate.
          if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
            proto[name] = createMergedResultFunction(proto[name], property);
          } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
          if ("production" !== process.env.NODE_ENV) {
            // Add verbose displayName to the function, which helps when looking
            // at profiling tools.
            if (typeof property === 'function' && spec.displayName) {
              proto[name].displayName = spec.displayName + '_' + name;
            }
          }
        }
      }
    }
  }
}

function mixStaticSpecIntoComponent(Constructor, statics) {
  if (!statics) {
    return;
  }
  for (var name in statics) {
    var property = statics[name];
    if (!statics.hasOwnProperty(name)) {
      continue;
    }

    var isReserved = name in RESERVED_SPEC_KEYS;
    ("production" !== process.env.NODE_ENV ? invariant(
      !isReserved,
      'ReactCompositeComponent: You are attempting to define a reserved ' +
      'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
      'as an instance property instead; it will still be accessible on the ' +
      'constructor.',
      name
    ) : invariant(!isReserved));

    var isInherited = name in Constructor;
    ("production" !== process.env.NODE_ENV ? invariant(
      !isInherited,
      'ReactCompositeComponent: You are attempting to define ' +
      '`%s` on your component more than once. This conflict may be ' +
      'due to a mixin.',
      name
    ) : invariant(!isInherited));
    Constructor[name] = property;
  }
}

/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeObjectsWithNoDuplicateKeys(one, two) {
  ("production" !== process.env.NODE_ENV ? invariant(
    one && two && typeof one === 'object' && typeof two === 'object',
    'mergeObjectsWithNoDuplicateKeys(): Cannot merge non-objects'
  ) : invariant(one && two && typeof one === 'object' && typeof two === 'object'));

  mapObject(two, function(value, key) {
    ("production" !== process.env.NODE_ENV ? invariant(
      one[key] === undefined,
      'mergeObjectsWithNoDuplicateKeys(): ' +
      'Tried to merge two objects with the same key: `%s`. This conflict ' +
      'may be due to a mixin; in particular, this may be caused by two ' +
      'getInitialState() or getDefaultProps() methods returning objects ' +
      'with clashing keys.',
      key
    ) : invariant(one[key] === undefined));
    one[key] = value;
  });
  return one;
}

/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    return mergeObjectsWithNoDuplicateKeys(a, b);
  };
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

/**
 * `ReactCompositeComponent` maintains an auxiliary life cycle state in
 * `this._compositeLifeCycleState` (which can be null).
 *
 * This is different from the life cycle state maintained by `ReactComponent` in
 * `this._lifeCycleState`. The following diagram shows how the states overlap in
 * time. There are times when the CompositeLifeCycle is null - at those times it
 * is only meaningful to look at ComponentLifeCycle alone.
 *
 * Top Row: ReactComponent.ComponentLifeCycle
 * Low Row: ReactComponent.CompositeLifeCycle
 *
 * +-------+---------------------------------+--------+
 * |  UN   |             MOUNTED             |   UN   |
 * |MOUNTED|                                 | MOUNTED|
 * +-------+---------------------------------+--------+
 * |       ^--------+   +-------+   +--------^        |
 * |       |        |   |       |   |        |        |
 * |    0--|MOUNTING|-0-|RECEIVE|-0-|   UN   |--->0   |
 * |       |        |   |PROPS  |   |MOUNTING|        |
 * |       |        |   |       |   |        |        |
 * |       |        |   |       |   |        |        |
 * |       +--------+   +-------+   +--------+        |
 * |       |                                 |        |
 * +-------+---------------------------------+--------+
 */
var CompositeLifeCycle = keyMirror({
  /**
   * Components in the process of being mounted respond to state changes
   * differently.
   */
  MOUNTING: null,
  /**
   * Components in the process of being unmounted are guarded against state
   * changes.
   */
  UNMOUNTING: null,
  /**
   * Components that are mounted and receiving new props respond to state
   * changes differently.
   */
  RECEIVING_PROPS: null
});

/**
 * @lends {ReactCompositeComponent.prototype}
 */
var ReactCompositeComponentMixin = {

  /**
   * Base constructor for all composite component.
   *
   * @param {ReactElement} element
   * @final
   * @internal
   */
  construct: function(element) {
    // Children can be either an array or more than one argument
    ReactComponent.Mixin.construct.apply(this, arguments);
    ReactOwner.Mixin.construct.apply(this, arguments);

    this.state = null;
    this._pendingState = null;

    // This is the public post-processed context. The real context and pending
    // context lives on the element.
    this.context = null;

    this._compositeLifeCycleState = null;
  },

  /**
   * Checks whether or not this composite component is mounted.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function() {
    return ReactComponent.Mixin.isMounted.call(this) &&
      this._compositeLifeCycleState !== CompositeLifeCycle.MOUNTING;
  },

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {number} mountDepth number of components in the owner hierarchy
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: ReactPerf.measure(
    'ReactCompositeComponent',
    'mountComponent',
    function(rootID, transaction, mountDepth) {
      ReactComponent.Mixin.mountComponent.call(
        this,
        rootID,
        transaction,
        mountDepth
      );
      this._compositeLifeCycleState = CompositeLifeCycle.MOUNTING;

      if (this.__reactAutoBindMap) {
        this._bindAutoBindMethods();
      }

      this.context = this._processContext(this._currentElement._context);
      this.props = this._processProps(this.props);

      this.state = this.getInitialState ? this.getInitialState() : null;
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof this.state === 'object' && !Array.isArray(this.state),
        '%s.getInitialState(): must return an object or null',
        this.constructor.displayName || 'ReactCompositeComponent'
      ) : invariant(typeof this.state === 'object' && !Array.isArray(this.state)));

      this._pendingState = null;
      this._pendingForceUpdate = false;

      if (this.componentWillMount) {
        this.componentWillMount();
        // When mounting, calls to `setState` by `componentWillMount` will set
        // `this._pendingState` without triggering a re-render.
        if (this._pendingState) {
          this.state = this._pendingState;
          this._pendingState = null;
        }
      }

      this._renderedComponent = instantiateReactComponent(
        this._renderValidatedComponent(),
        this._currentElement.type // The wrapping type
      );

      // Done with mounting, `setState` will now trigger UI changes.
      this._compositeLifeCycleState = null;
      var markup = this._renderedComponent.mountComponent(
        rootID,
        transaction,
        mountDepth + 1
      );
      if (this.componentDidMount) {
        transaction.getReactMountReady().enqueue(this.componentDidMount, this);
      }
      return markup;
    }
  ),

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function() {
    this._compositeLifeCycleState = CompositeLifeCycle.UNMOUNTING;
    if (this.componentWillUnmount) {
      this.componentWillUnmount();
    }
    this._compositeLifeCycleState = null;

    this._renderedComponent.unmountComponent();
    this._renderedComponent = null;

    ReactComponent.Mixin.unmountComponent.call(this);

    // Some existing components rely on this.props even after they've been
    // destroyed (in event handlers).
    // TODO: this.props = null;
    // TODO: this.state = null;
  },

  /**
   * Sets a subset of the state. Always use this or `replaceState` to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  setState: function(partialState, callback) {
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof partialState === 'object' || partialState == null,
      'setState(...): takes an object of state variables to update.'
    ) : invariant(typeof partialState === 'object' || partialState == null));
    if ("production" !== process.env.NODE_ENV){
      ("production" !== process.env.NODE_ENV ? warning(
        partialState != null,
        'setState(...): You passed an undefined or null state object; ' +
        'instead, use forceUpdate().'
      ) : null);
    }
    // Merge with `_pendingState` if it exists, otherwise with existing state.
    this.replaceState(
      assign({}, this._pendingState || this.state, partialState),
      callback
    );
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {object} completeState Next state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  replaceState: function(completeState, callback) {
    validateLifeCycleOnReplaceState(this);
    this._pendingState = completeState;
    if (this._compositeLifeCycleState !== CompositeLifeCycle.MOUNTING) {
      // If we're in a componentWillMount handler, don't enqueue a rerender
      // because ReactUpdates assumes we're in a browser context (which is wrong
      // for server rendering) and we're about to do a render anyway.
      // TODO: The callback here is ignored when setState is called from
      // componentWillMount. Either fix it or disallow doing so completely in
      // favor of getInitialState.
      ReactUpdates.enqueueUpdate(this, callback);
    }
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`, and asserts that they are valid.
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _processContext: function(context) {
    var maskedContext = null;
    var contextTypes = this.constructor.contextTypes;
    if (contextTypes) {
      maskedContext = {};
      for (var contextName in contextTypes) {
        maskedContext[contextName] = context[contextName];
      }
      if ("production" !== process.env.NODE_ENV) {
        this._checkPropTypes(
          contextTypes,
          maskedContext,
          ReactPropTypeLocations.context
        );
      }
    }
    return maskedContext;
  },

  /**
   * @param {object} currentContext
   * @return {object}
   * @private
   */
  _processChildContext: function(currentContext) {
    var childContext = this.getChildContext && this.getChildContext();
    var displayName = this.constructor.displayName || 'ReactCompositeComponent';
    if (childContext) {
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof this.constructor.childContextTypes === 'object',
        '%s.getChildContext(): childContextTypes must be defined in order to ' +
        'use getChildContext().',
        displayName
      ) : invariant(typeof this.constructor.childContextTypes === 'object'));
      if ("production" !== process.env.NODE_ENV) {
        this._checkPropTypes(
          this.constructor.childContextTypes,
          childContext,
          ReactPropTypeLocations.childContext
        );
      }
      for (var name in childContext) {
        ("production" !== process.env.NODE_ENV ? invariant(
          name in this.constructor.childContextTypes,
          '%s.getChildContext(): key "%s" is not defined in childContextTypes.',
          displayName,
          name
        ) : invariant(name in this.constructor.childContextTypes));
      }
      return assign({}, currentContext, childContext);
    }
    return currentContext;
  },

  /**
   * Processes props by setting default values for unspecified props and
   * asserting that the props are valid. Does not mutate its argument; returns
   * a new props object with defaults merged in.
   *
   * @param {object} newProps
   * @return {object}
   * @private
   */
  _processProps: function(newProps) {
    if ("production" !== process.env.NODE_ENV) {
      var propTypes = this.constructor.propTypes;
      if (propTypes) {
        this._checkPropTypes(propTypes, newProps, ReactPropTypeLocations.prop);
      }
    }
    return newProps;
  },

  /**
   * Assert that the props are valid
   *
   * @param {object} propTypes Map of prop name to a ReactPropType
   * @param {object} props
   * @param {string} location e.g. "prop", "context", "child context"
   * @private
   */
  _checkPropTypes: function(propTypes, props, location) {
    // TODO: Stop validating prop types here and only use the element
    // validation.
    var componentName = this.constructor.displayName;
    for (var propName in propTypes) {
      if (propTypes.hasOwnProperty(propName)) {
        var error =
          propTypes[propName](props, propName, componentName, location);
        if (error instanceof Error) {
          // We may want to extend this logic for similar errors in
          // renderComponent calls, so I'm abstracting it away into
          // a function to minimize refactoring in the future
          var addendum = getDeclarationErrorAddendum(this);
          ("production" !== process.env.NODE_ENV ? warning(false, error.message + addendum) : null);
        }
      }
    }
  },

  /**
   * If any of `_pendingElement`, `_pendingState`, or `_pendingForceUpdate`
   * is set, update the component.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function(transaction) {
    var compositeLifeCycleState = this._compositeLifeCycleState;
    // Do not trigger a state transition if we are in the middle of mounting or
    // receiving props because both of those will already be doing this.
    if (compositeLifeCycleState === CompositeLifeCycle.MOUNTING ||
        compositeLifeCycleState === CompositeLifeCycle.RECEIVING_PROPS) {
      return;
    }

    if (this._pendingElement == null &&
        this._pendingState == null &&
        !this._pendingForceUpdate) {
      return;
    }

    var nextContext = this.context;
    var nextProps = this.props;
    var nextElement = this._currentElement;
    if (this._pendingElement != null) {
      nextElement = this._pendingElement;
      nextContext = this._processContext(nextElement._context);
      nextProps = this._processProps(nextElement.props);
      this._pendingElement = null;

      this._compositeLifeCycleState = CompositeLifeCycle.RECEIVING_PROPS;
      if (this.componentWillReceiveProps) {
        this.componentWillReceiveProps(nextProps, nextContext);
      }
    }

    this._compositeLifeCycleState = null;

    var nextState = this._pendingState || this.state;
    this._pendingState = null;

    var shouldUpdate =
      this._pendingForceUpdate ||
      !this.shouldComponentUpdate ||
      this.shouldComponentUpdate(nextProps, nextState, nextContext);

    if ("production" !== process.env.NODE_ENV) {
      if (typeof shouldUpdate === "undefined") {
        console.warn(
          (this.constructor.displayName || 'ReactCompositeComponent') +
          '.shouldComponentUpdate(): Returned undefined instead of a ' +
          'boolean value. Make sure to return true or false.'
        );
      }
    }

    if (shouldUpdate) {
      this._pendingForceUpdate = false;
      // Will set `this.props`, `this.state` and `this.context`.
      this._performComponentUpdate(
        nextElement,
        nextProps,
        nextState,
        nextContext,
        transaction
      );
    } else {
      // If it's determined that a component should not update, we still want
      // to set props and state.
      this._currentElement = nextElement;
      this.props = nextProps;
      this.state = nextState;
      this.context = nextContext;

      // Owner cannot change because shouldUpdateReactComponent doesn't allow
      // it. TODO: Remove this._owner completely.
      this._owner = nextElement._owner;
    }
  },

  /**
   * Merges new props and state, notifies delegate methods of update and
   * performs update.
   *
   * @param {ReactElement} nextElement Next element
   * @param {object} nextProps Next public object to set as properties.
   * @param {?object} nextState Next object to set as state.
   * @param {?object} nextContext Next public object to set as context.
   * @param {ReactReconcileTransaction} transaction
   * @private
   */
  _performComponentUpdate: function(
    nextElement,
    nextProps,
    nextState,
    nextContext,
    transaction
  ) {
    var prevElement = this._currentElement;
    var prevProps = this.props;
    var prevState = this.state;
    var prevContext = this.context;

    if (this.componentWillUpdate) {
      this.componentWillUpdate(nextProps, nextState, nextContext);
    }

    this._currentElement = nextElement;
    this.props = nextProps;
    this.state = nextState;
    this.context = nextContext;

    // Owner cannot change because shouldUpdateReactComponent doesn't allow
    // it. TODO: Remove this._owner completely.
    this._owner = nextElement._owner;

    this.updateComponent(
      transaction,
      prevElement
    );

    if (this.componentDidUpdate) {
      transaction.getReactMountReady().enqueue(
        this.componentDidUpdate.bind(this, prevProps, prevState, prevContext),
        this
      );
    }
  },

  receiveComponent: function(nextElement, transaction) {
    if (nextElement === this._currentElement &&
        nextElement._owner != null) {
      // Since elements are immutable after the owner is rendered,
      // we can do a cheap identity compare here to determine if this is a
      // superfluous reconcile. It's possible for state to be mutable but such
      // change should trigger an update of the owner which would recreate
      // the element. We explicitly check for the existence of an owner since
      // it's possible for a element created outside a composite to be
      // deeply mutated and reused.
      return;
    }

    ReactComponent.Mixin.receiveComponent.call(
      this,
      nextElement,
      transaction
    );
  },

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @internal
   * @overridable
   */
  updateComponent: ReactPerf.measure(
    'ReactCompositeComponent',
    'updateComponent',
    function(transaction, prevParentElement) {
      ReactComponent.Mixin.updateComponent.call(
        this,
        transaction,
        prevParentElement
      );

      var prevComponentInstance = this._renderedComponent;
      var prevElement = prevComponentInstance._currentElement;
      var nextElement = this._renderValidatedComponent();
      if (shouldUpdateReactComponent(prevElement, nextElement)) {
        prevComponentInstance.receiveComponent(nextElement, transaction);
      } else {
        // These two IDs are actually the same! But nothing should rely on that.
        var thisID = this._rootNodeID;
        var prevComponentID = prevComponentInstance._rootNodeID;
        prevComponentInstance.unmountComponent();
        this._renderedComponent = instantiateReactComponent(
          nextElement,
          this._currentElement.type
        );
        var nextMarkup = this._renderedComponent.mountComponent(
          thisID,
          transaction,
          this._mountDepth + 1
        );
        ReactComponent.BackendIDOperations.dangerouslyReplaceNodeWithMarkupByID(
          prevComponentID,
          nextMarkup
        );
      }
    }
  ),

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldUpdateComponent`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */
  forceUpdate: function(callback) {
    var compositeLifeCycleState = this._compositeLifeCycleState;
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isMounted() ||
        compositeLifeCycleState === CompositeLifeCycle.MOUNTING,
      'forceUpdate(...): Can only force an update on mounted or mounting ' +
        'components.'
    ) : invariant(this.isMounted() ||
      compositeLifeCycleState === CompositeLifeCycle.MOUNTING));
    ("production" !== process.env.NODE_ENV ? invariant(
      compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING &&
      ReactCurrentOwner.current == null,
      'forceUpdate(...): Cannot force an update while unmounting component ' +
      'or within a `render` function.'
    ) : invariant(compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING &&
    ReactCurrentOwner.current == null));
    this._pendingForceUpdate = true;
    ReactUpdates.enqueueUpdate(this, callback);
  },

  /**
   * @private
   */
  _renderValidatedComponent: ReactPerf.measure(
    'ReactCompositeComponent',
    '_renderValidatedComponent',
    function() {
      var renderedComponent;
      var previousContext = ReactContext.current;
      ReactContext.current = this._processChildContext(
        this._currentElement._context
      );
      ReactCurrentOwner.current = this;
      try {
        renderedComponent = this.render();
        if (renderedComponent === null || renderedComponent === false) {
          renderedComponent = ReactEmptyComponent.getEmptyComponent();
          ReactEmptyComponent.registerNullComponentID(this._rootNodeID);
        } else {
          ReactEmptyComponent.deregisterNullComponentID(this._rootNodeID);
        }
      } finally {
        ReactContext.current = previousContext;
        ReactCurrentOwner.current = null;
      }
      ("production" !== process.env.NODE_ENV ? invariant(
        ReactElement.isValidElement(renderedComponent),
        '%s.render(): A valid ReactComponent must be returned. You may have ' +
          'returned undefined, an array or some other invalid object.',
        this.constructor.displayName || 'ReactCompositeComponent'
      ) : invariant(ReactElement.isValidElement(renderedComponent)));
      return renderedComponent;
    }
  ),

  /**
   * @private
   */
  _bindAutoBindMethods: function() {
    for (var autoBindKey in this.__reactAutoBindMap) {
      if (!this.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
        continue;
      }
      var method = this.__reactAutoBindMap[autoBindKey];
      this[autoBindKey] = this._bindAutoBindMethod(ReactErrorUtils.guard(
        method,
        this.constructor.displayName + '.' + autoBindKey
      ));
    }
  },

  /**
   * Binds a method to the component.
   *
   * @param {function} method Method to be bound.
   * @private
   */
  _bindAutoBindMethod: function(method) {
    var component = this;
    var boundMethod = method.bind(component);
    if ("production" !== process.env.NODE_ENV) {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis ) {for (var args=[],$__0=1,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          monitorCodeUse('react_bind_warning', { component: componentName });
          console.warn(
            'bind(): React component methods may only be bound to the ' +
            'component instance. See ' + componentName
          );
        } else if (!args.length) {
          monitorCodeUse('react_bind_warning', { component: componentName });
          console.warn(
            'bind(): You are binding a component method to the component. ' +
            'React does this for you automatically in a high-performance ' +
            'way, so you can safely remove this call. See ' + componentName
          );
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }
};

var ReactCompositeComponentBase = function() {};
assign(
  ReactCompositeComponentBase.prototype,
  ReactComponent.Mixin,
  ReactOwner.Mixin,
  ReactPropTransferer.Mixin,
  ReactCompositeComponentMixin
);

/**
 * Module for creating composite components.
 *
 * @class ReactCompositeComponent
 * @extends ReactComponent
 * @extends ReactOwner
 * @extends ReactPropTransferer
 */
var ReactCompositeComponent = {

  LifeCycle: CompositeLifeCycle,

  Base: ReactCompositeComponentBase,

  /**
   * Creates a composite component class given a class specification.
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  createClass: function(spec) {
    var Constructor = function(props) {
      // This constructor is overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted. This will later be used
      // by the stand-alone class implementation.
    };
    Constructor.prototype = new ReactCompositeComponentBase();
    Constructor.prototype.constructor = Constructor;

    injectedMixins.forEach(
      mixSpecIntoComponent.bind(null, Constructor)
    );

    mixSpecIntoComponent(Constructor, spec);

    // Initialize the defaultProps property after all mixins have been merged
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    ("production" !== process.env.NODE_ENV ? invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    ) : invariant(Constructor.prototype.render));

    if ("production" !== process.env.NODE_ENV) {
      if (Constructor.prototype.componentShouldUpdate) {
        monitorCodeUse(
          'react_component_should_update_warning',
          { component: spec.displayName }
        );
        console.warn(
          (spec.displayName || 'A component') + ' has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.'
         );
      }
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactCompositeComponentInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    if ("production" !== process.env.NODE_ENV) {
      return ReactLegacyElement.wrapFactory(
        ReactElementValidator.createFactory(Constructor)
      );
    }
    return ReactLegacyElement.wrapFactory(
      ReactElement.createFactory(Constructor)
    );
  },

  injection: {
    injectMixin: function(mixin) {
      injectedMixins.push(mixin);
    }
  }
};

module.exports = ReactCompositeComponent;

}).call(this,require('_process'))
},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactComponent.js","./ReactContext":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactContext.js","./ReactCurrentOwner":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCurrentOwner.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactElementValidator":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElementValidator.js","./ReactEmptyComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactEmptyComponent.js","./ReactErrorUtils":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactErrorUtils.js","./ReactLegacyElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactLegacyElement.js","./ReactOwner":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactOwner.js","./ReactPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js","./ReactPropTransferer":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTransferer.js","./ReactPropTypeLocationNames":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTypeLocationNames.js","./ReactPropTypeLocations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTypeLocations.js","./ReactUpdates":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js","./instantiateReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\instantiateReactComponent.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./keyMirror":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyMirror.js","./keyOf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js","./mapObject":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\mapObject.js","./monitorCodeUse":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\monitorCodeUse.js","./shouldUpdateReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\shouldUpdateReactComponent.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactContext.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactContext
 */

"use strict";

var assign = require("./Object.assign");

/**
 * Keeps track of the current context.
 *
 * The context is automatically passed down the component ownership hierarchy
 * and is accessible via `this.context` on ReactCompositeComponents.
 */
var ReactContext = {

  /**
   * @internal
   * @type {object}
   */
  current: {},

  /**
   * Temporarily extends the current context while executing scopedCallback.
   *
   * A typical use case might look like
   *
   *  render: function() {
   *    var children = ReactContext.withContext({foo: 'foo'}, () => (
   *
   *    ));
   *    return <div>{children}</div>;
   *  }
   *
   * @param {object} newContext New context to merge into the existing context
   * @param {function} scopedCallback Callback to run with the new context
   * @return {ReactComponent|array<ReactComponent>}
   */
  withContext: function(newContext, scopedCallback) {
    var result;
    var previousContext = ReactContext.current;
    ReactContext.current = assign({}, previousContext, newContext);
    try {
      result = scopedCallback();
    } finally {
      ReactContext.current = previousContext;
    }
    return result;
  }

};

module.exports = ReactContext;

},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCurrentOwner.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCurrentOwner
 */

"use strict";

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 *
 * The depth indicate how many composite components are above this render level.
 */
var ReactCurrentOwner = {

  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null

};

module.exports = ReactCurrentOwner;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOM.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOM
 * @typechecks static-only
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");
var ReactLegacyElement = require("./ReactLegacyElement");

var mapObject = require("./mapObject");

/**
 * Create a factory that creates HTML tag elements.
 *
 * @param {string} tag Tag name (e.g. `div`).
 * @private
 */
function createDOMFactory(tag) {
  if ("production" !== process.env.NODE_ENV) {
    return ReactLegacyElement.markNonLegacyFactory(
      ReactElementValidator.createFactory(tag)
    );
  }
  return ReactLegacyElement.markNonLegacyFactory(
    ReactElement.createFactory(tag)
  );
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 * This is also accessible via `React.DOM`.
 *
 * @public
 */
var ReactDOM = mapObject({
  a: 'a',
  abbr: 'abbr',
  address: 'address',
  area: 'area',
  article: 'article',
  aside: 'aside',
  audio: 'audio',
  b: 'b',
  base: 'base',
  bdi: 'bdi',
  bdo: 'bdo',
  big: 'big',
  blockquote: 'blockquote',
  body: 'body',
  br: 'br',
  button: 'button',
  canvas: 'canvas',
  caption: 'caption',
  cite: 'cite',
  code: 'code',
  col: 'col',
  colgroup: 'colgroup',
  data: 'data',
  datalist: 'datalist',
  dd: 'dd',
  del: 'del',
  details: 'details',
  dfn: 'dfn',
  dialog: 'dialog',
  div: 'div',
  dl: 'dl',
  dt: 'dt',
  em: 'em',
  embed: 'embed',
  fieldset: 'fieldset',
  figcaption: 'figcaption',
  figure: 'figure',
  footer: 'footer',
  form: 'form',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  head: 'head',
  header: 'header',
  hr: 'hr',
  html: 'html',
  i: 'i',
  iframe: 'iframe',
  img: 'img',
  input: 'input',
  ins: 'ins',
  kbd: 'kbd',
  keygen: 'keygen',
  label: 'label',
  legend: 'legend',
  li: 'li',
  link: 'link',
  main: 'main',
  map: 'map',
  mark: 'mark',
  menu: 'menu',
  menuitem: 'menuitem',
  meta: 'meta',
  meter: 'meter',
  nav: 'nav',
  noscript: 'noscript',
  object: 'object',
  ol: 'ol',
  optgroup: 'optgroup',
  option: 'option',
  output: 'output',
  p: 'p',
  param: 'param',
  picture: 'picture',
  pre: 'pre',
  progress: 'progress',
  q: 'q',
  rp: 'rp',
  rt: 'rt',
  ruby: 'ruby',
  s: 's',
  samp: 'samp',
  script: 'script',
  section: 'section',
  select: 'select',
  small: 'small',
  source: 'source',
  span: 'span',
  strong: 'strong',
  style: 'style',
  sub: 'sub',
  summary: 'summary',
  sup: 'sup',
  table: 'table',
  tbody: 'tbody',
  td: 'td',
  textarea: 'textarea',
  tfoot: 'tfoot',
  th: 'th',
  thead: 'thead',
  time: 'time',
  title: 'title',
  tr: 'tr',
  track: 'track',
  u: 'u',
  ul: 'ul',
  'var': 'var',
  video: 'video',
  wbr: 'wbr',

  // SVG
  circle: 'circle',
  defs: 'defs',
  ellipse: 'ellipse',
  g: 'g',
  line: 'line',
  linearGradient: 'linearGradient',
  mask: 'mask',
  path: 'path',
  pattern: 'pattern',
  polygon: 'polygon',
  polyline: 'polyline',
  radialGradient: 'radialGradient',
  rect: 'rect',
  stop: 'stop',
  svg: 'svg',
  text: 'text',
  tspan: 'tspan'

}, createDOMFactory);

module.exports = ReactDOM;

}).call(this,require('_process'))
},{"./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactElementValidator":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElementValidator.js","./ReactLegacyElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactLegacyElement.js","./mapObject":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\mapObject.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMButton.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMButton
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");

var keyMirror = require("./keyMirror");

// Store a reference to the <button> `ReactDOMComponent`. TODO: use string
var button = ReactElement.createFactory(ReactDOM.button.type);

var mouseListenerNames = keyMirror({
  onClick: true,
  onDoubleClick: true,
  onMouseDown: true,
  onMouseMove: true,
  onMouseUp: true,
  onClickCapture: true,
  onDoubleClickCapture: true,
  onMouseDownCapture: true,
  onMouseMoveCapture: true,
  onMouseUpCapture: true
});

/**
 * Implements a <button> native component that does not receive mouse events
 * when `disabled` is set.
 */
var ReactDOMButton = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMButton',

  mixins: [AutoFocusMixin, ReactBrowserComponentMixin],

  render: function() {
    var props = {};

    // Copy the props; except the mouse listeners if we're disabled
    for (var key in this.props) {
      if (this.props.hasOwnProperty(key) &&
          (!this.props.disabled || !mouseListenerNames[key])) {
        props[key] = this.props[key];
      }
    }

    return button(props, this.props.children);
  }

});

module.exports = ReactDOMButton;

},{"./AutoFocusMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\AutoFocusMixin.js","./ReactBrowserComponentMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js","./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactDOM":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOM.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./keyMirror":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyMirror.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMComponent.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMComponent
 * @typechecks static-only
 */

"use strict";

var CSSPropertyOperations = require("./CSSPropertyOperations");
var DOMProperty = require("./DOMProperty");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactComponent = require("./ReactComponent");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactMount = require("./ReactMount");
var ReactMultiChild = require("./ReactMultiChild");
var ReactPerf = require("./ReactPerf");

var assign = require("./Object.assign");
var escapeTextForBrowser = require("./escapeTextForBrowser");
var invariant = require("./invariant");
var isEventSupported = require("./isEventSupported");
var keyOf = require("./keyOf");
var monitorCodeUse = require("./monitorCodeUse");

var deleteListener = ReactBrowserEventEmitter.deleteListener;
var listenTo = ReactBrowserEventEmitter.listenTo;
var registrationNameModules = ReactBrowserEventEmitter.registrationNameModules;

// For quickly matching children type, to test if can be treated as content.
var CONTENT_TYPES = {'string': true, 'number': true};

var STYLE = keyOf({style: null});

var ELEMENT_NODE_TYPE = 1;

/**
 * @param {?object} props
 */
function assertValidProps(props) {
  if (!props) {
    return;
  }
  // Note the use of `==` which checks for null or undefined.
  ("production" !== process.env.NODE_ENV ? invariant(
    props.children == null || props.dangerouslySetInnerHTML == null,
    'Can only set one of `children` or `props.dangerouslySetInnerHTML`.'
  ) : invariant(props.children == null || props.dangerouslySetInnerHTML == null));
  if ("production" !== process.env.NODE_ENV) {
    if (props.contentEditable && props.children != null) {
      console.warn(
        'A component is `contentEditable` and contains `children` managed by ' +
        'React. It is now your responsibility to guarantee that none of those '+
        'nodes are unexpectedly modified or duplicated. This is probably not ' +
        'intentional.'
      );
    }
  }
  ("production" !== process.env.NODE_ENV ? invariant(
    props.style == null || typeof props.style === 'object',
    'The `style` prop expects a mapping from style properties to values, ' +
    'not a string.'
  ) : invariant(props.style == null || typeof props.style === 'object'));
}

function putListener(id, registrationName, listener, transaction) {
  if ("production" !== process.env.NODE_ENV) {
    // IE8 has no API for event capturing and the `onScroll` event doesn't
    // bubble.
    if (registrationName === 'onScroll' &&
        !isEventSupported('scroll', true)) {
      monitorCodeUse('react_no_scroll_event');
      console.warn('This browser doesn\'t support the `onScroll` event');
    }
  }
  var container = ReactMount.findReactContainerForID(id);
  if (container) {
    var doc = container.nodeType === ELEMENT_NODE_TYPE ?
      container.ownerDocument :
      container;
    listenTo(registrationName, doc);
  }
  transaction.getPutListenerQueue().enqueuePutListener(
    id,
    registrationName,
    listener
  );
}

// For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special cased tags.

var omittedCloseTags = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
  // NOTE: menuitem's close tag should be omitted, but that causes problems.
};

// We accept any tag to be rendered but since this gets injected into abitrary
// HTML, we want to make sure that it's a safe tag.
// http://www.w3.org/TR/REC-xml/#NT-Name

var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
var validatedTagCache = {};
var hasOwnProperty = {}.hasOwnProperty;

function validateDangerousTag(tag) {
  if (!hasOwnProperty.call(validatedTagCache, tag)) {
    ("production" !== process.env.NODE_ENV ? invariant(VALID_TAG_REGEX.test(tag), 'Invalid tag: %s', tag) : invariant(VALID_TAG_REGEX.test(tag)));
    validatedTagCache[tag] = true;
  }
}

/**
 * Creates a new React class that is idempotent and capable of containing other
 * React components. It accepts event listeners and DOM properties that are
 * valid according to `DOMProperty`.
 *
 *  - Event listeners: `onClick`, `onMouseDown`, etc.
 *  - DOM properties: `className`, `name`, `title`, etc.
 *
 * The `style` property functions differently from the DOM API. It accepts an
 * object mapping of style properties to values.
 *
 * @constructor ReactDOMComponent
 * @extends ReactComponent
 * @extends ReactMultiChild
 */
function ReactDOMComponent(tag) {
  validateDangerousTag(tag);
  this._tag = tag;
  this.tagName = tag.toUpperCase();
}

ReactDOMComponent.displayName = 'ReactDOMComponent';

ReactDOMComponent.Mixin = {

  /**
   * Generates root tag markup then recurses. This method has side effects and
   * is not idempotent.
   *
   * @internal
   * @param {string} rootID The root DOM ID for this node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {number} mountDepth number of components in the owner hierarchy
   * @return {string} The computed markup.
   */
  mountComponent: ReactPerf.measure(
    'ReactDOMComponent',
    'mountComponent',
    function(rootID, transaction, mountDepth) {
      ReactComponent.Mixin.mountComponent.call(
        this,
        rootID,
        transaction,
        mountDepth
      );
      assertValidProps(this.props);
      var closeTag = omittedCloseTags[this._tag] ? '' : '</' + this._tag + '>';
      return (
        this._createOpenTagMarkupAndPutListeners(transaction) +
        this._createContentMarkup(transaction) +
        closeTag
      );
    }
  ),

  /**
   * Creates markup for the open tag and all attributes.
   *
   * This method has side effects because events get registered.
   *
   * Iterating over object properties is faster than iterating over arrays.
   * @see http://jsperf.com/obj-vs-arr-iteration
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Markup of opening tag.
   */
  _createOpenTagMarkupAndPutListeners: function(transaction) {
    var props = this.props;
    var ret = '<' + this._tag;

    for (var propKey in props) {
      if (!props.hasOwnProperty(propKey)) {
        continue;
      }
      var propValue = props[propKey];
      if (propValue == null) {
        continue;
      }
      if (registrationNameModules.hasOwnProperty(propKey)) {
        putListener(this._rootNodeID, propKey, propValue, transaction);
      } else {
        if (propKey === STYLE) {
          if (propValue) {
            propValue = props.style = assign({}, props.style);
          }
          propValue = CSSPropertyOperations.createMarkupForStyles(propValue);
        }
        var markup =
          DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
        if (markup) {
          ret += ' ' + markup;
        }
      }
    }

    // For static pages, no need to put React ID and checksum. Saves lots of
    // bytes.
    if (transaction.renderToStaticMarkup) {
      return ret + '>';
    }

    var markupForID = DOMPropertyOperations.createMarkupForID(this._rootNodeID);
    return ret + ' ' + markupForID + '>';
  },

  /**
   * Creates markup for the content between the tags.
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Content markup.
   */
  _createContentMarkup: function(transaction) {
    // Intentional use of != to avoid catching zero/false.
    var innerHTML = this.props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        return innerHTML.__html;
      }
    } else {
      var contentToUse =
        CONTENT_TYPES[typeof this.props.children] ? this.props.children : null;
      var childrenToUse = contentToUse != null ? null : this.props.children;
      if (contentToUse != null) {
        return escapeTextForBrowser(contentToUse);
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(
          childrenToUse,
          transaction
        );
        return mountImages.join('');
      }
    }
    return '';
  },

  receiveComponent: function(nextElement, transaction) {
    if (nextElement === this._currentElement &&
        nextElement._owner != null) {
      // Since elements are immutable after the owner is rendered,
      // we can do a cheap identity compare here to determine if this is a
      // superfluous reconcile. It's possible for state to be mutable but such
      // change should trigger an update of the owner which would recreate
      // the element. We explicitly check for the existence of an owner since
      // it's possible for a element created outside a composite to be
      // deeply mutated and reused.
      return;
    }

    ReactComponent.Mixin.receiveComponent.call(
      this,
      nextElement,
      transaction
    );
  },

  /**
   * Updates a native DOM component after it has already been allocated and
   * attached to the DOM. Reconciles the root DOM node, then recurses.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @internal
   * @overridable
   */
  updateComponent: ReactPerf.measure(
    'ReactDOMComponent',
    'updateComponent',
    function(transaction, prevElement) {
      assertValidProps(this._currentElement.props);
      ReactComponent.Mixin.updateComponent.call(
        this,
        transaction,
        prevElement
      );
      this._updateDOMProperties(prevElement.props, transaction);
      this._updateDOMChildren(prevElement.props, transaction);
    }
  ),

  /**
   * Reconciles the properties by detecting differences in property values and
   * updating the DOM as necessary. This function is probably the single most
   * critical path for performance optimization.
   *
   * TODO: Benchmark whether checking for changed values in memory actually
   *       improves performance (especially statically positioned elements).
   * TODO: Benchmark the effects of putting this at the top since 99% of props
   *       do not change for a given reconciliation.
   * TODO: Benchmark areas that can be improved with caching.
   *
   * @private
   * @param {object} lastProps
   * @param {ReactReconcileTransaction} transaction
   */
  _updateDOMProperties: function(lastProps, transaction) {
    var nextProps = this.props;
    var propKey;
    var styleName;
    var styleUpdates;
    for (propKey in lastProps) {
      if (nextProps.hasOwnProperty(propKey) ||
         !lastProps.hasOwnProperty(propKey)) {
        continue;
      }
      if (propKey === STYLE) {
        var lastStyle = lastProps[propKey];
        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            styleUpdates = styleUpdates || {};
            styleUpdates[styleName] = '';
          }
        }
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        deleteListener(this._rootNodeID, propKey);
      } else if (
          DOMProperty.isStandardName[propKey] ||
          DOMProperty.isCustomAttribute(propKey)) {
        ReactComponent.BackendIDOperations.deletePropertyByID(
          this._rootNodeID,
          propKey
        );
      }
    }
    for (propKey in nextProps) {
      var nextProp = nextProps[propKey];
      var lastProp = lastProps[propKey];
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp) {
        continue;
      }
      if (propKey === STYLE) {
        if (nextProp) {
          nextProp = nextProps.style = assign({}, nextProp);
        }
        if (lastProp) {
          // Unset styles on `lastProp` but not on `nextProp`.
          for (styleName in lastProp) {
            if (lastProp.hasOwnProperty(styleName) &&
                (!nextProp || !nextProp.hasOwnProperty(styleName))) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          // Update styles that changed since `lastProp`.
          for (styleName in nextProp) {
            if (nextProp.hasOwnProperty(styleName) &&
                lastProp[styleName] !== nextProp[styleName]) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = nextProp[styleName];
            }
          }
        } else {
          // Relies on `updateStylesByID` not mutating `styleUpdates`.
          styleUpdates = nextProp;
        }
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        putListener(this._rootNodeID, propKey, nextProp, transaction);
      } else if (
          DOMProperty.isStandardName[propKey] ||
          DOMProperty.isCustomAttribute(propKey)) {
        ReactComponent.BackendIDOperations.updatePropertyByID(
          this._rootNodeID,
          propKey,
          nextProp
        );
      }
    }
    if (styleUpdates) {
      ReactComponent.BackendIDOperations.updateStylesByID(
        this._rootNodeID,
        styleUpdates
      );
    }
  },

  /**
   * Reconciles the children with the various properties that affect the
   * children content.
   *
   * @param {object} lastProps
   * @param {ReactReconcileTransaction} transaction
   */
  _updateDOMChildren: function(lastProps, transaction) {
    var nextProps = this.props;

    var lastContent =
      CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
    var nextContent =
      CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;

    var lastHtml =
      lastProps.dangerouslySetInnerHTML &&
      lastProps.dangerouslySetInnerHTML.__html;
    var nextHtml =
      nextProps.dangerouslySetInnerHTML &&
      nextProps.dangerouslySetInnerHTML.__html;

    // Note the use of `!=` which checks for null or undefined.
    var lastChildren = lastContent != null ? null : lastProps.children;
    var nextChildren = nextContent != null ? null : nextProps.children;

    // If we're switching from children to content/html or vice versa, remove
    // the old content
    var lastHasContentOrHtml = lastContent != null || lastHtml != null;
    var nextHasContentOrHtml = nextContent != null || nextHtml != null;
    if (lastChildren != null && nextChildren == null) {
      this.updateChildren(null, transaction);
    } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
      this.updateTextContent('');
    }

    if (nextContent != null) {
      if (lastContent !== nextContent) {
        this.updateTextContent('' + nextContent);
      }
    } else if (nextHtml != null) {
      if (lastHtml !== nextHtml) {
        ReactComponent.BackendIDOperations.updateInnerHTMLByID(
          this._rootNodeID,
          nextHtml
        );
      }
    } else if (nextChildren != null) {
      this.updateChildren(nextChildren, transaction);
    }
  },

  /**
   * Destroys all event registrations for this instance. Does not remove from
   * the DOM. That must be done by the parent.
   *
   * @internal
   */
  unmountComponent: function() {
    this.unmountChildren();
    ReactBrowserEventEmitter.deleteAllListeners(this._rootNodeID);
    ReactComponent.Mixin.unmountComponent.call(this);
  }

};

assign(
  ReactDOMComponent.prototype,
  ReactComponent.Mixin,
  ReactDOMComponent.Mixin,
  ReactMultiChild.Mixin,
  ReactBrowserComponentMixin
);

module.exports = ReactDOMComponent;

}).call(this,require('_process'))
},{"./CSSPropertyOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CSSPropertyOperations.js","./DOMProperty":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMProperty.js","./DOMPropertyOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMPropertyOperations.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactBrowserComponentMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js","./ReactBrowserEventEmitter":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserEventEmitter.js","./ReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactComponent.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./ReactMultiChild":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMultiChild.js","./ReactPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js","./escapeTextForBrowser":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\escapeTextForBrowser.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./isEventSupported":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isEventSupported.js","./keyOf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js","./monitorCodeUse":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\monitorCodeUse.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMForm.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMForm
 */

"use strict";

var EventConstants = require("./EventConstants");
var LocalEventTrapMixin = require("./LocalEventTrapMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");

// Store a reference to the <form> `ReactDOMComponent`. TODO: use string
var form = ReactElement.createFactory(ReactDOM.form.type);

/**
 * Since onSubmit doesn't bubble OR capture on the top level in IE8, we need
 * to capture it on the <form> element itself. There are lots of hacks we could
 * do to accomplish this, but the most reliable is to make <form> a
 * composite component and use `componentDidMount` to attach the event handlers.
 */
var ReactDOMForm = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMForm',

  mixins: [ReactBrowserComponentMixin, LocalEventTrapMixin],

  render: function() {
    // TODO: Instead of using `ReactDOM` directly, we should use JSX. However,
    // `jshint` fails to parse JSX so in order for linting to work in the open
    // source repo, we need to just use `ReactDOM.form`.
    return form(this.props);
  },

  componentDidMount: function() {
    this.trapBubbledEvent(EventConstants.topLevelTypes.topReset, 'reset');
    this.trapBubbledEvent(EventConstants.topLevelTypes.topSubmit, 'submit');
  }
});

module.exports = ReactDOMForm;

},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./LocalEventTrapMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\LocalEventTrapMixin.js","./ReactBrowserComponentMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js","./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactDOM":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOM.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMIDOperations.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMIDOperations
 * @typechecks static-only
 */

/*jslint evil: true */

"use strict";

var CSSPropertyOperations = require("./CSSPropertyOperations");
var DOMChildrenOperations = require("./DOMChildrenOperations");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");

var invariant = require("./invariant");
var setInnerHTML = require("./setInnerHTML");

/**
 * Errors for properties that should not be updated with `updatePropertyById()`.
 *
 * @type {object}
 * @private
 */
var INVALID_PROPERTY_ERRORS = {
  dangerouslySetInnerHTML:
    '`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.',
  style: '`style` must be set using `updateStylesByID()`.'
};

/**
 * Operations used to process updates to DOM nodes. This is made injectable via
 * `ReactComponent.BackendIDOperations`.
 */
var ReactDOMIDOperations = {

  /**
   * Updates a DOM node with new property values. This should only be used to
   * update DOM properties in `DOMProperty`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} name A valid property name, see `DOMProperty`.
   * @param {*} value New value of the property.
   * @internal
   */
  updatePropertyByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updatePropertyByID',
    function(id, name, value) {
      var node = ReactMount.getNode(id);
      ("production" !== process.env.NODE_ENV ? invariant(
        !INVALID_PROPERTY_ERRORS.hasOwnProperty(name),
        'updatePropertyByID(...): %s',
        INVALID_PROPERTY_ERRORS[name]
      ) : invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name)));

      // If we're updating to null or undefined, we should remove the property
      // from the DOM node instead of inadvertantly setting to a string. This
      // brings us in line with the same behavior we have on initial render.
      if (value != null) {
        DOMPropertyOperations.setValueForProperty(node, name, value);
      } else {
        DOMPropertyOperations.deleteValueForProperty(node, name);
      }
    }
  ),

  /**
   * Updates a DOM node to remove a property. This should only be used to remove
   * DOM properties in `DOMProperty`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} name A property name to remove, see `DOMProperty`.
   * @internal
   */
  deletePropertyByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'deletePropertyByID',
    function(id, name, value) {
      var node = ReactMount.getNode(id);
      ("production" !== process.env.NODE_ENV ? invariant(
        !INVALID_PROPERTY_ERRORS.hasOwnProperty(name),
        'updatePropertyByID(...): %s',
        INVALID_PROPERTY_ERRORS[name]
      ) : invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name)));
      DOMPropertyOperations.deleteValueForProperty(node, name, value);
    }
  ),

  /**
   * Updates a DOM node with new style values. If a value is specified as '',
   * the corresponding style property will be unset.
   *
   * @param {string} id ID of the node to update.
   * @param {object} styles Mapping from styles to values.
   * @internal
   */
  updateStylesByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updateStylesByID',
    function(id, styles) {
      var node = ReactMount.getNode(id);
      CSSPropertyOperations.setValueForStyles(node, styles);
    }
  ),

  /**
   * Updates a DOM node's innerHTML.
   *
   * @param {string} id ID of the node to update.
   * @param {string} html An HTML string.
   * @internal
   */
  updateInnerHTMLByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updateInnerHTMLByID',
    function(id, html) {
      var node = ReactMount.getNode(id);
      setInnerHTML(node, html);
    }
  ),

  /**
   * Updates a DOM node's text content set by `props.content`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} content Text content.
   * @internal
   */
  updateTextContentByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updateTextContentByID',
    function(id, content) {
      var node = ReactMount.getNode(id);
      DOMChildrenOperations.updateTextContent(node, content);
    }
  ),

  /**
   * Replaces a DOM node that exists in the document with markup.
   *
   * @param {string} id ID of child to be replaced.
   * @param {string} markup Dangerous markup to inject in place of child.
   * @internal
   * @see {Danger.dangerouslyReplaceNodeWithMarkup}
   */
  dangerouslyReplaceNodeWithMarkupByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'dangerouslyReplaceNodeWithMarkupByID',
    function(id, markup) {
      var node = ReactMount.getNode(id);
      DOMChildrenOperations.dangerouslyReplaceNodeWithMarkup(node, markup);
    }
  ),

  /**
   * Updates a component's children by processing a series of updates.
   *
   * @param {array<object>} updates List of update configurations.
   * @param {array<string>} markup List of markup strings.
   * @internal
   */
  dangerouslyProcessChildrenUpdates: ReactPerf.measure(
    'ReactDOMIDOperations',
    'dangerouslyProcessChildrenUpdates',
    function(updates, markup) {
      for (var i = 0; i < updates.length; i++) {
        updates[i].parentNode = ReactMount.getNode(updates[i].parentID);
      }
      DOMChildrenOperations.processUpdates(updates, markup);
    }
  )
};

module.exports = ReactDOMIDOperations;

}).call(this,require('_process'))
},{"./CSSPropertyOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CSSPropertyOperations.js","./DOMChildrenOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMChildrenOperations.js","./DOMPropertyOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMPropertyOperations.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./ReactPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./setInnerHTML":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\setInnerHTML.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMImg.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMImg
 */

"use strict";

var EventConstants = require("./EventConstants");
var LocalEventTrapMixin = require("./LocalEventTrapMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");

// Store a reference to the <img> `ReactDOMComponent`. TODO: use string
var img = ReactElement.createFactory(ReactDOM.img.type);

/**
 * Since onLoad doesn't bubble OR capture on the top level in IE8, we need to
 * capture it on the <img> element itself. There are lots of hacks we could do
 * to accomplish this, but the most reliable is to make <img> a composite
 * component and use `componentDidMount` to attach the event handlers.
 */
var ReactDOMImg = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMImg',
  tagName: 'IMG',

  mixins: [ReactBrowserComponentMixin, LocalEventTrapMixin],

  render: function() {
    return img(this.props);
  },

  componentDidMount: function() {
    this.trapBubbledEvent(EventConstants.topLevelTypes.topLoad, 'load');
    this.trapBubbledEvent(EventConstants.topLevelTypes.topError, 'error');
  }
});

module.exports = ReactDOMImg;

},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./LocalEventTrapMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\LocalEventTrapMixin.js","./ReactBrowserComponentMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js","./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactDOM":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOM.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMInput.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMInput
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");
var ReactMount = require("./ReactMount");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var invariant = require("./invariant");

// Store a reference to the <input> `ReactDOMComponent`. TODO: use string
var input = ReactElement.createFactory(ReactDOM.input.type);

var instancesByReactID = {};

function forceUpdateIfMounted() {
  /*jshint validthis:true */
  if (this.isMounted()) {
    this.forceUpdate();
  }
}

/**
 * Implements an <input> native component that allows setting these optional
 * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
 *
 * If `checked` or `value` are not supplied (or null/undefined), user actions
 * that affect the checked state or value will trigger updates to the element.
 *
 * If they are supplied (and not null/undefined), the rendered element will not
 * trigger updates to the element. Instead, the props must change in order for
 * the rendered element to be updated.
 *
 * The rendered element will be initialized as unchecked (or `defaultChecked`)
 * with an empty value (or `defaultValue`).
 *
 * @see http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
 */
var ReactDOMInput = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMInput',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  getInitialState: function() {
    var defaultValue = this.props.defaultValue;
    return {
      initialChecked: this.props.defaultChecked || false,
      initialValue: defaultValue != null ? defaultValue : null
    };
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = assign({}, this.props);

    props.defaultChecked = null;
    props.defaultValue = null;

    var value = LinkedValueUtils.getValue(this);
    props.value = value != null ? value : this.state.initialValue;

    var checked = LinkedValueUtils.getChecked(this);
    props.checked = checked != null ? checked : this.state.initialChecked;

    props.onChange = this._handleChange;

    return input(props, this.props.children);
  },

  componentDidMount: function() {
    var id = ReactMount.getID(this.getDOMNode());
    instancesByReactID[id] = this;
  },

  componentWillUnmount: function() {
    var rootNode = this.getDOMNode();
    var id = ReactMount.getID(rootNode);
    delete instancesByReactID[id];
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    var rootNode = this.getDOMNode();
    if (this.props.checked != null) {
      DOMPropertyOperations.setValueForProperty(
        rootNode,
        'checked',
        this.props.checked || false
      );
    }

    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      DOMPropertyOperations.setValueForProperty(rootNode, 'value', '' + value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }
    // Here we use asap to wait until all updates have propagated, which
    // is important when using controlled components within layers:
    // https://github.com/facebook/react/issues/1698
    ReactUpdates.asap(forceUpdateIfMounted, this);

    var name = this.props.name;
    if (this.props.type === 'radio' && name != null) {
      var rootNode = this.getDOMNode();
      var queryRoot = rootNode;

      while (queryRoot.parentNode) {
        queryRoot = queryRoot.parentNode;
      }

      // If `rootNode.form` was non-null, then we could try `form.elements`,
      // but that sometimes behaves strangely in IE8. We could also try using
      // `form.getElementsByName`, but that will only return direct children
      // and won't include inputs that use the HTML5 `form=` attribute. Since
      // the input might not even be in a form, let's just use the global
      // `querySelectorAll` to ensure we don't miss anything.
      var group = queryRoot.querySelectorAll(
        'input[name=' + JSON.stringify('' + name) + '][type="radio"]');

      for (var i = 0, groupLen = group.length; i < groupLen; i++) {
        var otherNode = group[i];
        if (otherNode === rootNode ||
            otherNode.form !== rootNode.form) {
          continue;
        }
        var otherID = ReactMount.getID(otherNode);
        ("production" !== process.env.NODE_ENV ? invariant(
          otherID,
          'ReactDOMInput: Mixing React and non-React radio inputs with the ' +
          'same `name` is not supported.'
        ) : invariant(otherID));
        var otherInstance = instancesByReactID[otherID];
        ("production" !== process.env.NODE_ENV ? invariant(
          otherInstance,
          'ReactDOMInput: Unknown radio button ID %s.',
          otherID
        ) : invariant(otherInstance));
        // If this is a controlled radio button group, forcing the input that
        // was previously checked to update will cause it to be come re-checked
        // as appropriate.
        ReactUpdates.asap(forceUpdateIfMounted, otherInstance);
      }
    }

    return returnValue;
  }

});

module.exports = ReactDOMInput;

}).call(this,require('_process'))
},{"./AutoFocusMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\AutoFocusMixin.js","./DOMPropertyOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMPropertyOperations.js","./LinkedValueUtils":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\LinkedValueUtils.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactBrowserComponentMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js","./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactDOM":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOM.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./ReactUpdates":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMOption.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMOption
 */

"use strict";

var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");

var warning = require("./warning");

// Store a reference to the <option> `ReactDOMComponent`. TODO: use string
var option = ReactElement.createFactory(ReactDOM.option.type);

/**
 * Implements an <option> native component that warns when `selected` is set.
 */
var ReactDOMOption = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMOption',

  mixins: [ReactBrowserComponentMixin],

  componentWillMount: function() {
    // TODO (yungsters): Remove support for `selected` in <option>.
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        this.props.selected == null,
        'Use the `defaultValue` or `value` props on <select> instead of ' +
        'setting `selected` on <option>.'
      ) : null);
    }
  },

  render: function() {
    return option(this.props, this.props.children);
  }

});

module.exports = ReactDOMOption;

}).call(this,require('_process'))
},{"./ReactBrowserComponentMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js","./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactDOM":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOM.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMSelect.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMSelect
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");

// Store a reference to the <select> `ReactDOMComponent`. TODO: use string
var select = ReactElement.createFactory(ReactDOM.select.type);

function updateWithPendingValueIfMounted() {
  /*jshint validthis:true */
  if (this.isMounted()) {
    this.setState({value: this._pendingValue});
    this._pendingValue = 0;
  }
}

/**
 * Validation function for `value` and `defaultValue`.
 * @private
 */
function selectValueType(props, propName, componentName) {
  if (props[propName] == null) {
    return;
  }
  if (props.multiple) {
    if (!Array.isArray(props[propName])) {
      return new Error(
        ("The `" + propName + "` prop supplied to <select> must be an array if ") +
        ("`multiple` is true.")
      );
    }
  } else {
    if (Array.isArray(props[propName])) {
      return new Error(
        ("The `" + propName + "` prop supplied to <select> must be a scalar ") +
        ("value if `multiple` is false.")
      );
    }
  }
}

/**
 * If `value` is supplied, updates <option> elements on mount and update.
 * @param {ReactComponent} component Instance of ReactDOMSelect
 * @param {?*} propValue For uncontrolled components, null/undefined. For
 * controlled components, a string (or with `multiple`, a list of strings).
 * @private
 */
function updateOptions(component, propValue) {
  var multiple = component.props.multiple;
  var value = propValue != null ? propValue : component.state.value;
  var options = component.getDOMNode().options;
  var selectedValue, i, l;
  if (multiple) {
    selectedValue = {};
    for (i = 0, l = value.length; i < l; ++i) {
      selectedValue['' + value[i]] = true;
    }
  } else {
    selectedValue = '' + value;
  }
  for (i = 0, l = options.length; i < l; i++) {
    var selected = multiple ?
      selectedValue.hasOwnProperty(options[i].value) :
      options[i].value === selectedValue;

    if (selected !== options[i].selected) {
      options[i].selected = selected;
    }
  }
}

/**
 * Implements a <select> native component that allows optionally setting the
 * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * string. If `multiple` is true, the prop must be an array of strings.
 *
 * If `value` is not supplied (or null/undefined), user actions that change the
 * selected option will trigger updates to the rendered options.
 *
 * If it is supplied (and not null/undefined), the rendered options will not
 * update in response to user actions. Instead, the `value` prop must change in
 * order for the rendered options to update.
 *
 * If `defaultValue` is provided, any options with the supplied values will be
 * selected.
 */
var ReactDOMSelect = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMSelect',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  propTypes: {
    defaultValue: selectValueType,
    value: selectValueType
  },

  getInitialState: function() {
    return {value: this.props.defaultValue || (this.props.multiple ? [] : '')};
  },

  componentWillMount: function() {
    this._pendingValue = null;
  },

  componentWillReceiveProps: function(nextProps) {
    if (!this.props.multiple && nextProps.multiple) {
      this.setState({value: [this.state.value]});
    } else if (this.props.multiple && !nextProps.multiple) {
      this.setState({value: this.state.value[0]});
    }
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = assign({}, this.props);

    props.onChange = this._handleChange;
    props.value = null;

    return select(props, this.props.children);
  },

  componentDidMount: function() {
    updateOptions(this, LinkedValueUtils.getValue(this));
  },

  componentDidUpdate: function(prevProps) {
    var value = LinkedValueUtils.getValue(this);
    var prevMultiple = !!prevProps.multiple;
    var multiple = !!this.props.multiple;
    if (value != null || prevMultiple !== multiple) {
      updateOptions(this, value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }

    var selectedValue;
    if (this.props.multiple) {
      selectedValue = [];
      var options = event.target.options;
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          selectedValue.push(options[i].value);
        }
      }
    } else {
      selectedValue = event.target.value;
    }

    this._pendingValue = selectedValue;
    ReactUpdates.asap(updateWithPendingValueIfMounted, this);
    return returnValue;
  }

});

module.exports = ReactDOMSelect;

},{"./AutoFocusMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\AutoFocusMixin.js","./LinkedValueUtils":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\LinkedValueUtils.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactBrowserComponentMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js","./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactDOM":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOM.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactUpdates":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMSelection.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMSelection
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var getNodeForCharacterOffset = require("./getNodeForCharacterOffset");
var getTextContentAccessor = require("./getTextContentAccessor");

/**
 * While `isCollapsed` is available on the Selection object and `collapsed`
 * is available on the Range object, IE11 sometimes gets them wrong.
 * If the anchor/focus nodes and offsets are the same, the range is collapsed.
 */
function isCollapsed(anchorNode, anchorOffset, focusNode, focusOffset) {
  return anchorNode === focusNode && anchorOffset === focusOffset;
}

/**
 * Get the appropriate anchor and focus node/offset pairs for IE.
 *
 * The catch here is that IE's selection API doesn't provide information
 * about whether the selection is forward or backward, so we have to
 * behave as though it's always forward.
 *
 * IE text differs from modern selection in that it behaves as though
 * block elements end with a new line. This means character offsets will
 * differ between the two APIs.
 *
 * @param {DOMElement} node
 * @return {object}
 */
function getIEOffsets(node) {
  var selection = document.selection;
  var selectedRange = selection.createRange();
  var selectedLength = selectedRange.text.length;

  // Duplicate selection so we can move range without breaking user selection.
  var fromStart = selectedRange.duplicate();
  fromStart.moveToElementText(node);
  fromStart.setEndPoint('EndToStart', selectedRange);

  var startOffset = fromStart.text.length;
  var endOffset = startOffset + selectedLength;

  return {
    start: startOffset,
    end: endOffset
  };
}

/**
 * @param {DOMElement} node
 * @return {?object}
 */
function getModernOffsets(node) {
  var selection = window.getSelection && window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  var anchorNode = selection.anchorNode;
  var anchorOffset = selection.anchorOffset;
  var focusNode = selection.focusNode;
  var focusOffset = selection.focusOffset;

  var currentRange = selection.getRangeAt(0);

  // If the node and offset values are the same, the selection is collapsed.
  // `Selection.isCollapsed` is available natively, but IE sometimes gets
  // this value wrong.
  var isSelectionCollapsed = isCollapsed(
    selection.anchorNode,
    selection.anchorOffset,
    selection.focusNode,
    selection.focusOffset
  );

  var rangeLength = isSelectionCollapsed ? 0 : currentRange.toString().length;

  var tempRange = currentRange.cloneRange();
  tempRange.selectNodeContents(node);
  tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);

  var isTempRangeCollapsed = isCollapsed(
    tempRange.startContainer,
    tempRange.startOffset,
    tempRange.endContainer,
    tempRange.endOffset
  );

  var start = isTempRangeCollapsed ? 0 : tempRange.toString().length;
  var end = start + rangeLength;

  // Detect whether the selection is backward.
  var detectionRange = document.createRange();
  detectionRange.setStart(anchorNode, anchorOffset);
  detectionRange.setEnd(focusNode, focusOffset);
  var isBackward = detectionRange.collapsed;

  return {
    start: isBackward ? end : start,
    end: isBackward ? start : end
  };
}

/**
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setIEOffsets(node, offsets) {
  var range = document.selection.createRange().duplicate();
  var start, end;

  if (typeof offsets.end === 'undefined') {
    start = offsets.start;
    end = start;
  } else if (offsets.start > offsets.end) {
    start = offsets.end;
    end = offsets.start;
  } else {
    start = offsets.start;
    end = offsets.end;
  }

  range.moveToElementText(node);
  range.moveStart('character', start);
  range.setEndPoint('EndToStart', range);
  range.moveEnd('character', end - start);
  range.select();
}

/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 *
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setModernOffsets(node, offsets) {
  if (!window.getSelection) {
    return;
  }

  var selection = window.getSelection();
  var length = node[getTextContentAccessor()].length;
  var start = Math.min(offsets.start, length);
  var end = typeof offsets.end === 'undefined' ?
            start : Math.min(offsets.end, length);

  // IE 11 uses modern selection, but doesn't support the extend method.
  // Flip backward selections, so we can set with a single range.
  if (!selection.extend && start > end) {
    var temp = end;
    end = start;
    start = temp;
  }

  var startMarker = getNodeForCharacterOffset(node, start);
  var endMarker = getNodeForCharacterOffset(node, end);

  if (startMarker && endMarker) {
    var range = document.createRange();
    range.setStart(startMarker.node, startMarker.offset);
    selection.removeAllRanges();

    if (start > end) {
      selection.addRange(range);
      selection.extend(endMarker.node, endMarker.offset);
    } else {
      range.setEnd(endMarker.node, endMarker.offset);
      selection.addRange(range);
    }
  }
}

var useIEOffsets = ExecutionEnvironment.canUseDOM && document.selection;

var ReactDOMSelection = {
  /**
   * @param {DOMElement} node
   */
  getOffsets: useIEOffsets ? getIEOffsets : getModernOffsets,

  /**
   * @param {DOMElement|DOMTextNode} node
   * @param {object} offsets
   */
  setOffsets: useIEOffsets ? setIEOffsets : setModernOffsets
};

module.exports = ReactDOMSelection;

},{"./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./getNodeForCharacterOffset":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getNodeForCharacterOffset.js","./getTextContentAccessor":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getTextContentAccessor.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMTextarea.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMTextarea
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var invariant = require("./invariant");

var warning = require("./warning");

// Store a reference to the <textarea> `ReactDOMComponent`. TODO: use string
var textarea = ReactElement.createFactory(ReactDOM.textarea.type);

function forceUpdateIfMounted() {
  /*jshint validthis:true */
  if (this.isMounted()) {
    this.forceUpdate();
  }
}

/**
 * Implements a <textarea> native component that allows setting `value`, and
 * `defaultValue`. This differs from the traditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If `value` is not supplied (or null/undefined), user actions that affect the
 * value will trigger updates to the element.
 *
 * If `value` is supplied (and not null/undefined), the rendered element will
 * not trigger updates to the element. Instead, the `value` prop must change in
 * order for the rendered element to be updated.
 *
 * The rendered element will be initialized with an empty value, the prop
 * `defaultValue` if specified, or the children content (deprecated).
 */
var ReactDOMTextarea = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMTextarea',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  getInitialState: function() {
    var defaultValue = this.props.defaultValue;
    // TODO (yungsters): Remove support for children content in <textarea>.
    var children = this.props.children;
    if (children != null) {
      if ("production" !== process.env.NODE_ENV) {
        ("production" !== process.env.NODE_ENV ? warning(
          false,
          'Use the `defaultValue` or `value` props instead of setting ' +
          'children on <textarea>.'
        ) : null);
      }
      ("production" !== process.env.NODE_ENV ? invariant(
        defaultValue == null,
        'If you supply `defaultValue` on a <textarea>, do not pass children.'
      ) : invariant(defaultValue == null));
      if (Array.isArray(children)) {
        ("production" !== process.env.NODE_ENV ? invariant(
          children.length <= 1,
          '<textarea> can only have at most one child.'
        ) : invariant(children.length <= 1));
        children = children[0];
      }

      defaultValue = '' + children;
    }
    if (defaultValue == null) {
      defaultValue = '';
    }
    var value = LinkedValueUtils.getValue(this);
    return {
      // We save the initial value so that `ReactDOMComponent` doesn't update
      // `textContent` (unnecessary since we update value).
      // The initial value can be a boolean or object so that's why it's
      // forced to be a string.
      initialValue: '' + (value != null ? value : defaultValue)
    };
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = assign({}, this.props);

    ("production" !== process.env.NODE_ENV ? invariant(
      props.dangerouslySetInnerHTML == null,
      '`dangerouslySetInnerHTML` does not make sense on <textarea>.'
    ) : invariant(props.dangerouslySetInnerHTML == null));

    props.defaultValue = null;
    props.value = null;
    props.onChange = this._handleChange;

    // Always set children to the same thing. In IE9, the selection range will
    // get reset if `textContent` is mutated.
    return textarea(props, this.state.initialValue);
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      var rootNode = this.getDOMNode();
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      DOMPropertyOperations.setValueForProperty(rootNode, 'value', '' + value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }
    ReactUpdates.asap(forceUpdateIfMounted, this);
    return returnValue;
  }

});

module.exports = ReactDOMTextarea;

}).call(this,require('_process'))
},{"./AutoFocusMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\AutoFocusMixin.js","./DOMPropertyOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMPropertyOperations.js","./LinkedValueUtils":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\LinkedValueUtils.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactBrowserComponentMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js","./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactDOM":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOM.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactUpdates":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDefaultBatchingStrategy.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultBatchingStrategy
 */

"use strict";

var ReactUpdates = require("./ReactUpdates");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function() {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactDefaultBatchingStrategyTransaction() {
  this.reinitializeTransaction();
}

assign(
  ReactDefaultBatchingStrategyTransaction.prototype,
  Transaction.Mixin,
  {
    getTransactionWrappers: function() {
      return TRANSACTION_WRAPPERS;
    }
  }
);

var transaction = new ReactDefaultBatchingStrategyTransaction();

var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function(callback, a, b) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      callback(a, b);
    } else {
      transaction.perform(callback, null, a, b);
    }
  }
};

module.exports = ReactDefaultBatchingStrategy;

},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactUpdates":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js","./Transaction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Transaction.js","./emptyFunction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDefaultInjection.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultInjection
 */

"use strict";

var BeforeInputEventPlugin = require("./BeforeInputEventPlugin");
var ChangeEventPlugin = require("./ChangeEventPlugin");
var ClientReactRootIndex = require("./ClientReactRootIndex");
var CompositionEventPlugin = require("./CompositionEventPlugin");
var DefaultEventPluginOrder = require("./DefaultEventPluginOrder");
var EnterLeaveEventPlugin = require("./EnterLeaveEventPlugin");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var HTMLDOMPropertyConfig = require("./HTMLDOMPropertyConfig");
var MobileSafariClickEventPlugin = require("./MobileSafariClickEventPlugin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactComponentBrowserEnvironment =
  require("./ReactComponentBrowserEnvironment");
var ReactDefaultBatchingStrategy = require("./ReactDefaultBatchingStrategy");
var ReactDOMComponent = require("./ReactDOMComponent");
var ReactDOMButton = require("./ReactDOMButton");
var ReactDOMForm = require("./ReactDOMForm");
var ReactDOMImg = require("./ReactDOMImg");
var ReactDOMInput = require("./ReactDOMInput");
var ReactDOMOption = require("./ReactDOMOption");
var ReactDOMSelect = require("./ReactDOMSelect");
var ReactDOMTextarea = require("./ReactDOMTextarea");
var ReactEventListener = require("./ReactEventListener");
var ReactInjection = require("./ReactInjection");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");
var SelectEventPlugin = require("./SelectEventPlugin");
var ServerReactRootIndex = require("./ServerReactRootIndex");
var SimpleEventPlugin = require("./SimpleEventPlugin");
var SVGDOMPropertyConfig = require("./SVGDOMPropertyConfig");

var createFullPageComponent = require("./createFullPageComponent");

function inject() {
  ReactInjection.EventEmitter.injectReactEventListener(
    ReactEventListener
  );

  /**
   * Inject modules for resolving DOM hierarchy and plugin ordering.
   */
  ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
  ReactInjection.EventPluginHub.injectInstanceHandle(ReactInstanceHandles);
  ReactInjection.EventPluginHub.injectMount(ReactMount);

  /**
   * Some important event plugins included by default (without having to require
   * them).
   */
  ReactInjection.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    CompositionEventPlugin: CompositionEventPlugin,
    MobileSafariClickEventPlugin: MobileSafariClickEventPlugin,
    SelectEventPlugin: SelectEventPlugin,
    BeforeInputEventPlugin: BeforeInputEventPlugin
  });

  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactDOMComponent
  );

  ReactInjection.NativeComponent.injectComponentClasses({
    'button': ReactDOMButton,
    'form': ReactDOMForm,
    'img': ReactDOMImg,
    'input': ReactDOMInput,
    'option': ReactDOMOption,
    'select': ReactDOMSelect,
    'textarea': ReactDOMTextarea,

    'html': createFullPageComponent('html'),
    'head': createFullPageComponent('head'),
    'body': createFullPageComponent('body')
  });

  // This needs to happen after createFullPageComponent() otherwise the mixin
  // gets double injected.
  ReactInjection.CompositeComponent.injectMixin(ReactBrowserComponentMixin);

  ReactInjection.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
  ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig);

  ReactInjection.EmptyComponent.injectEmptyComponent('noscript');

  ReactInjection.Updates.injectReconcileTransaction(
    ReactComponentBrowserEnvironment.ReactReconcileTransaction
  );
  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  );

  ReactInjection.RootIndex.injectCreateReactRootIndex(
    ExecutionEnvironment.canUseDOM ?
      ClientReactRootIndex.createReactRootIndex :
      ServerReactRootIndex.createReactRootIndex
  );

  ReactInjection.Component.injectEnvironment(ReactComponentBrowserEnvironment);

  if ("production" !== process.env.NODE_ENV) {
    var url = (ExecutionEnvironment.canUseDOM && window.location.href) || '';
    if ((/[?&]react_perf\b/).test(url)) {
      var ReactDefaultPerf = require("./ReactDefaultPerf");
      ReactDefaultPerf.start();
    }
  }
}

module.exports = {
  inject: inject
};

}).call(this,require('_process'))
},{"./BeforeInputEventPlugin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\BeforeInputEventPlugin.js","./ChangeEventPlugin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ChangeEventPlugin.js","./ClientReactRootIndex":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ClientReactRootIndex.js","./CompositionEventPlugin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CompositionEventPlugin.js","./DefaultEventPluginOrder":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DefaultEventPluginOrder.js","./EnterLeaveEventPlugin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EnterLeaveEventPlugin.js","./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./HTMLDOMPropertyConfig":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\HTMLDOMPropertyConfig.js","./MobileSafariClickEventPlugin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\MobileSafariClickEventPlugin.js","./ReactBrowserComponentMixin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserComponentMixin.js","./ReactComponentBrowserEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactComponentBrowserEnvironment.js","./ReactDOMButton":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMButton.js","./ReactDOMComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMComponent.js","./ReactDOMForm":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMForm.js","./ReactDOMImg":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMImg.js","./ReactDOMInput":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMInput.js","./ReactDOMOption":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMOption.js","./ReactDOMSelect":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMSelect.js","./ReactDOMTextarea":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMTextarea.js","./ReactDefaultBatchingStrategy":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDefaultBatchingStrategy.js","./ReactDefaultPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDefaultPerf.js","./ReactEventListener":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactEventListener.js","./ReactInjection":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInjection.js","./ReactInstanceHandles":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInstanceHandles.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./SVGDOMPropertyConfig":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SVGDOMPropertyConfig.js","./SelectEventPlugin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SelectEventPlugin.js","./ServerReactRootIndex":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ServerReactRootIndex.js","./SimpleEventPlugin":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SimpleEventPlugin.js","./createFullPageComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\createFullPageComponent.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDefaultPerf.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultPerf
 * @typechecks static-only
 */

"use strict";

var DOMProperty = require("./DOMProperty");
var ReactDefaultPerfAnalysis = require("./ReactDefaultPerfAnalysis");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");

var performanceNow = require("./performanceNow");

function roundFloat(val) {
  return Math.floor(val * 100) / 100;
}

function addValue(obj, key, val) {
  obj[key] = (obj[key] || 0) + val;
}

var ReactDefaultPerf = {
  _allMeasurements: [], // last item in the list is the current one
  _mountStack: [0],
  _injected: false,

  start: function() {
    if (!ReactDefaultPerf._injected) {
      ReactPerf.injection.injectMeasure(ReactDefaultPerf.measure);
    }

    ReactDefaultPerf._allMeasurements.length = 0;
    ReactPerf.enableMeasure = true;
  },

  stop: function() {
    ReactPerf.enableMeasure = false;
  },

  getLastMeasurements: function() {
    return ReactDefaultPerf._allMeasurements;
  },

  printExclusive: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getExclusiveSummary(measurements);
    console.table(summary.map(function(item) {
      return {
        'Component class name': item.componentName,
        'Total inclusive time (ms)': roundFloat(item.inclusive),
        'Exclusive mount time (ms)': roundFloat(item.exclusive),
        'Exclusive render time (ms)': roundFloat(item.render),
        'Mount time per instance (ms)': roundFloat(item.exclusive / item.count),
        'Render time per instance (ms)': roundFloat(item.render / item.count),
        'Instances': item.count
      };
    }));
    // TODO: ReactDefaultPerfAnalysis.getTotalTime() does not return the correct
    // number.
  },

  printInclusive: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(measurements);
    console.table(summary.map(function(item) {
      return {
        'Owner > component': item.componentName,
        'Inclusive time (ms)': roundFloat(item.time),
        'Instances': item.count
      };
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  getMeasurementsSummaryMap: function(measurements) {
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(
      measurements,
      true
    );
    return summary.map(function(item) {
      return {
        'Owner > component': item.componentName,
        'Wasted time (ms)': item.time,
        'Instances': item.count
      };
    });
  },

  printWasted: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    console.table(ReactDefaultPerf.getMeasurementsSummaryMap(measurements));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  printDOM: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getDOMSummary(measurements);
    console.table(summary.map(function(item) {
      var result = {};
      result[DOMProperty.ID_ATTRIBUTE_NAME] = item.id;
      result['type'] = item.type;
      result['args'] = JSON.stringify(item.args);
      return result;
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  _recordWrite: function(id, fnName, totalTime, args) {
    // TODO: totalTime isn't that useful since it doesn't count paints/reflows
    var writes =
      ReactDefaultPerf
        ._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1]
        .writes;
    writes[id] = writes[id] || [];
    writes[id].push({
      type: fnName,
      time: totalTime,
      args: args
    });
  },

  measure: function(moduleName, fnName, func) {
    return function() {for (var args=[],$__0=0,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
      var totalTime;
      var rv;
      var start;

      if (fnName === '_renderNewRootComponent' ||
          fnName === 'flushBatchedUpdates') {
        // A "measurement" is a set of metrics recorded for each flush. We want
        // to group the metrics for a given flush together so we can look at the
        // components that rendered and the DOM operations that actually
        // happened to determine the amount of "wasted work" performed.
        ReactDefaultPerf._allMeasurements.push({
          exclusive: {},
          inclusive: {},
          render: {},
          counts: {},
          writes: {},
          displayNames: {},
          totalTime: 0
        });
        start = performanceNow();
        rv = func.apply(this, args);
        ReactDefaultPerf._allMeasurements[
          ReactDefaultPerf._allMeasurements.length - 1
        ].totalTime = performanceNow() - start;
        return rv;
      } else if (moduleName === 'ReactDOMIDOperations' ||
        moduleName === 'ReactComponentBrowserEnvironment') {
        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        if (fnName === 'mountImageIntoNode') {
          var mountID = ReactMount.getID(args[1]);
          ReactDefaultPerf._recordWrite(mountID, fnName, totalTime, args[0]);
        } else if (fnName === 'dangerouslyProcessChildrenUpdates') {
          // special format
          args[0].forEach(function(update) {
            var writeArgs = {};
            if (update.fromIndex !== null) {
              writeArgs.fromIndex = update.fromIndex;
            }
            if (update.toIndex !== null) {
              writeArgs.toIndex = update.toIndex;
            }
            if (update.textContent !== null) {
              writeArgs.textContent = update.textContent;
            }
            if (update.markupIndex !== null) {
              writeArgs.markup = args[1][update.markupIndex];
            }
            ReactDefaultPerf._recordWrite(
              update.parentID,
              update.type,
              totalTime,
              writeArgs
            );
          });
        } else {
          // basic format
          ReactDefaultPerf._recordWrite(
            args[0],
            fnName,
            totalTime,
            Array.prototype.slice.call(args, 1)
          );
        }
        return rv;
      } else if (moduleName === 'ReactCompositeComponent' && (
        fnName === 'mountComponent' ||
        fnName === 'updateComponent' || // TODO: receiveComponent()?
        fnName === '_renderValidatedComponent')) {

        var rootNodeID = fnName === 'mountComponent' ?
          args[0] :
          this._rootNodeID;
        var isRender = fnName === '_renderValidatedComponent';
        var isMount = fnName === 'mountComponent';

        var mountStack = ReactDefaultPerf._mountStack;
        var entry = ReactDefaultPerf._allMeasurements[
          ReactDefaultPerf._allMeasurements.length - 1
        ];

        if (isRender) {
          addValue(entry.counts, rootNodeID, 1);
        } else if (isMount) {
          mountStack.push(0);
        }

        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        if (isRender) {
          addValue(entry.render, rootNodeID, totalTime);
        } else if (isMount) {
          var subMountTime = mountStack.pop();
          mountStack[mountStack.length - 1] += totalTime;
          addValue(entry.exclusive, rootNodeID, totalTime - subMountTime);
          addValue(entry.inclusive, rootNodeID, totalTime);
        } else {
          addValue(entry.inclusive, rootNodeID, totalTime);
        }

        entry.displayNames[rootNodeID] = {
          current: this.constructor.displayName,
          owner: this._owner ? this._owner.constructor.displayName : '<root>'
        };

        return rv;
      } else {
        return func.apply(this, args);
      }
    };
  }
};

module.exports = ReactDefaultPerf;

},{"./DOMProperty":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMProperty.js","./ReactDefaultPerfAnalysis":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDefaultPerfAnalysis.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./ReactPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js","./performanceNow":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\performanceNow.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDefaultPerfAnalysis.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultPerfAnalysis
 */

var assign = require("./Object.assign");

// Don't try to save users less than 1.2ms (a number I made up)
var DONT_CARE_THRESHOLD = 1.2;
var DOM_OPERATION_TYPES = {
  'mountImageIntoNode': 'set innerHTML',
  INSERT_MARKUP: 'set innerHTML',
  MOVE_EXISTING: 'move',
  REMOVE_NODE: 'remove',
  TEXT_CONTENT: 'set textContent',
  'updatePropertyByID': 'update attribute',
  'deletePropertyByID': 'delete attribute',
  'updateStylesByID': 'update styles',
  'updateInnerHTMLByID': 'set innerHTML',
  'dangerouslyReplaceNodeWithMarkupByID': 'replace'
};

function getTotalTime(measurements) {
  // TODO: return number of DOM ops? could be misleading.
  // TODO: measure dropped frames after reconcile?
  // TODO: log total time of each reconcile and the top-level component
  // class that triggered it.
  var totalTime = 0;
  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    totalTime += measurement.totalTime;
  }
  return totalTime;
}

function getDOMSummary(measurements) {
  var items = [];
  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var id;

    for (id in measurement.writes) {
      measurement.writes[id].forEach(function(write) {
        items.push({
          id: id,
          type: DOM_OPERATION_TYPES[write.type] || write.type,
          args: write.args
        });
      });
    }
  }
  return items;
}

function getExclusiveSummary(measurements) {
  var candidates = {};
  var displayName;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = assign(
      {},
      measurement.exclusive,
      measurement.inclusive
    );

    for (var id in allIDs) {
      displayName = measurement.displayNames[id].current;

      candidates[displayName] = candidates[displayName] || {
        componentName: displayName,
        inclusive: 0,
        exclusive: 0,
        render: 0,
        count: 0
      };
      if (measurement.render[id]) {
        candidates[displayName].render += measurement.render[id];
      }
      if (measurement.exclusive[id]) {
        candidates[displayName].exclusive += measurement.exclusive[id];
      }
      if (measurement.inclusive[id]) {
        candidates[displayName].inclusive += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[displayName].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (displayName in candidates) {
    if (candidates[displayName].exclusive >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[displayName]);
    }
  }

  arr.sort(function(a, b) {
    return b.exclusive - a.exclusive;
  });

  return arr;
}

function getInclusiveSummary(measurements, onlyClean) {
  var candidates = {};
  var inclusiveKey;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = assign(
      {},
      measurement.exclusive,
      measurement.inclusive
    );
    var cleanComponents;

    if (onlyClean) {
      cleanComponents = getUnchangedComponents(measurement);
    }

    for (var id in allIDs) {
      if (onlyClean && !cleanComponents[id]) {
        continue;
      }

      var displayName = measurement.displayNames[id];

      // Inclusive time is not useful for many components without knowing where
      // they are instantiated. So we aggregate inclusive time with both the
      // owner and current displayName as the key.
      inclusiveKey = displayName.owner + ' > ' + displayName.current;

      candidates[inclusiveKey] = candidates[inclusiveKey] || {
        componentName: inclusiveKey,
        time: 0,
        count: 0
      };

      if (measurement.inclusive[id]) {
        candidates[inclusiveKey].time += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[inclusiveKey].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (inclusiveKey in candidates) {
    if (candidates[inclusiveKey].time >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[inclusiveKey]);
    }
  }

  arr.sort(function(a, b) {
    return b.time - a.time;
  });

  return arr;
}

function getUnchangedComponents(measurement) {
  // For a given reconcile, look at which components did not actually
  // render anything to the DOM and return a mapping of their ID to
  // the amount of time it took to render the entire subtree.
  var cleanComponents = {};
  var dirtyLeafIDs = Object.keys(measurement.writes);
  var allIDs = assign({}, measurement.exclusive, measurement.inclusive);

  for (var id in allIDs) {
    var isDirty = false;
    // For each component that rendered, see if a component that triggered
    // a DOM op is in its subtree.
    for (var i = 0; i < dirtyLeafIDs.length; i++) {
      if (dirtyLeafIDs[i].indexOf(id) === 0) {
        isDirty = true;
        break;
      }
    }
    if (!isDirty && measurement.counts[id] > 0) {
      cleanComponents[id] = true;
    }
  }
  return cleanComponents;
}

var ReactDefaultPerfAnalysis = {
  getExclusiveSummary: getExclusiveSummary,
  getInclusiveSummary: getInclusiveSummary,
  getDOMSummary: getDOMSummary,
  getTotalTime: getTotalTime
};

module.exports = ReactDefaultPerfAnalysis;

},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElement
 */

"use strict";

var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");

var warning = require("./warning");

var RESERVED_PROPS = {
  key: true,
  ref: true
};

/**
 * Warn for mutations.
 *
 * @internal
 * @param {object} object
 * @param {string} key
 */
function defineWarningProperty(object, key) {
  Object.defineProperty(object, key, {

    configurable: false,
    enumerable: true,

    get: function() {
      if (!this._store) {
        return null;
      }
      return this._store[key];
    },

    set: function(value) {
      ("production" !== process.env.NODE_ENV ? warning(
        false,
        'Don\'t set the ' + key + ' property of the component. ' +
        'Mutate the existing props object instead.'
      ) : null);
      this._store[key] = value;
    }

  });
}

/**
 * This is updated to true if the membrane is successfully created.
 */
var useMutationMembrane = false;

/**
 * Warn for mutations.
 *
 * @internal
 * @param {object} element
 */
function defineMutationMembrane(prototype) {
  try {
    var pseudoFrozenProperties = {
      props: true
    };
    for (var key in pseudoFrozenProperties) {
      defineWarningProperty(prototype, key);
    }
    useMutationMembrane = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

/**
 * Base constructor for all React elements. This is only used to make this
 * work with a dynamic instanceof check. Nothing should live on this prototype.
 *
 * @param {*} type
 * @param {string|object} ref
 * @param {*} key
 * @param {*} props
 * @internal
 */
var ReactElement = function(type, key, ref, owner, context, props) {
  // Built-in properties that belong on the element
  this.type = type;
  this.key = key;
  this.ref = ref;

  // Record the component responsible for creating this element.
  this._owner = owner;

  // TODO: Deprecate withContext, and then the context becomes accessible
  // through the owner.
  this._context = context;

  if ("production" !== process.env.NODE_ENV) {
    // The validation flag and props are currently mutative. We put them on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    this._store = { validated: false, props: props };

    // We're not allowed to set props directly on the object so we early
    // return and rely on the prototype membrane to forward to the backing
    // store.
    if (useMutationMembrane) {
      Object.freeze(this);
      return;
    }
  }

  this.props = props;
};

// We intentionally don't expose the function on the constructor property.
// ReactElement should be indistinguishable from a plain object.
ReactElement.prototype = {
  _isReactElement: true
};

if ("production" !== process.env.NODE_ENV) {
  defineMutationMembrane(ReactElement.prototype);
}

ReactElement.createElement = function(type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        config.key !== null,
        'createElement(...): Encountered component with a `key` of null. In ' +
        'a future version, this will be treated as equivalent to the string ' +
        '\'null\'; instead, provide an explicit key or use undefined.'
      ) : null);
    }
    // TODO: Change this back to `config.key === undefined`
    key = config.key == null ? null : '' + config.key;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (config.hasOwnProperty(propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (typeof props[propName] === 'undefined') {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return new ReactElement(
    type,
    key,
    ref,
    ReactCurrentOwner.current,
    ReactContext.current,
    props
  );
};

ReactElement.createFactory = function(type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. <Foo />.type === Foo.type.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceProps = function(oldElement, newProps) {
  var newElement = new ReactElement(
    oldElement.type,
    oldElement.key,
    oldElement.ref,
    oldElement._owner,
    oldElement._context,
    newProps
  );

  if ("production" !== process.env.NODE_ENV) {
    // If the key on the original is valid, then the clone is valid
    newElement._store.validated = oldElement._store.validated;
  }
  return newElement;
};

/**
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function(object) {
  // ReactTestUtils is often used outside of beforeEach where as React is
  // within it. This leads to two different instances of React on the same
  // page. To identify a element from a different React instance we use
  // a flag instead of an instanceof check.
  var isElement = !!(object && object._isReactElement);
  // if (isElement && !(object instanceof ReactElement)) {
  // This is an indicator that you're using multiple versions of React at the
  // same time. This will screw with ownership and stuff. Fix it, please.
  // TODO: We could possibly warn here.
  // }
  return isElement;
};

module.exports = ReactElement;

}).call(this,require('_process'))
},{"./ReactContext":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactContext.js","./ReactCurrentOwner":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCurrentOwner.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElementValidator.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElementValidator
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactPropTypeLocations = require("./ReactPropTypeLocations");
var ReactCurrentOwner = require("./ReactCurrentOwner");

var monitorCodeUse = require("./monitorCodeUse");
var warning = require("./warning");

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {
  'react_key_warning': {},
  'react_numeric_key_warning': {}
};
var ownerHasMonitoredObjectMap = {};

var loggedTypeFailures = {};

var NUMERIC_PROPERTY_REGEX = /^\d+$/;

/**
 * Gets the current owner's displayName for use in warnings.
 *
 * @internal
 * @return {?string} Display name or undefined
 */
function getCurrentOwnerDisplayName() {
  var current = ReactCurrentOwner.current;
  return current && current.constructor.displayName || undefined;
}

/**
 * Warn if the component doesn't have an explicit key assigned to it.
 * This component is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it.
 *
 * @internal
 * @param {ReactComponent} component Component that requires a key.
 * @param {*} parentType component's parent's type.
 */
function validateExplicitKey(component, parentType) {
  if (component._store.validated || component.key != null) {
    return;
  }
  component._store.validated = true;

  warnAndMonitorForKeyUse(
    'react_key_warning',
    'Each child in an array should have a unique "key" prop.',
    component,
    parentType
  );
}

/**
 * Warn if the key is being defined as an object property but has an incorrect
 * value.
 *
 * @internal
 * @param {string} name Property name of the key.
 * @param {ReactComponent} component Component that requires a key.
 * @param {*} parentType component's parent's type.
 */
function validatePropertyKey(name, component, parentType) {
  if (!NUMERIC_PROPERTY_REGEX.test(name)) {
    return;
  }
  warnAndMonitorForKeyUse(
    'react_numeric_key_warning',
    'Child objects should have non-numeric keys so ordering is preserved.',
    component,
    parentType
  );
}

/**
 * Shared warning and monitoring code for the key warnings.
 *
 * @internal
 * @param {string} warningID The id used when logging.
 * @param {string} message The base warning that gets output.
 * @param {ReactComponent} component Component that requires a key.
 * @param {*} parentType component's parent's type.
 */
function warnAndMonitorForKeyUse(warningID, message, component, parentType) {
  var ownerName = getCurrentOwnerDisplayName();
  var parentName = parentType.displayName;

  var useName = ownerName || parentName;
  var memoizer = ownerHasKeyUseWarning[warningID];
  if (memoizer.hasOwnProperty(useName)) {
    return;
  }
  memoizer[useName] = true;

  message += ownerName ?
    (" Check the render method of " + ownerName + ".") :
    (" Check the renderComponent call using <" + parentName + ">.");

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwnerName = null;
  if (component._owner && component._owner !== ReactCurrentOwner.current) {
    // Name of the component that originally created this child.
    childOwnerName = component._owner.constructor.displayName;

    message += (" It was passed a child from " + childOwnerName + ".");
  }

  message += ' See http://fb.me/react-warning-keys for more information.';
  monitorCodeUse(warningID, {
    component: useName,
    componentOwner: childOwnerName
  });
  console.warn(message);
}

/**
 * Log that we're using an object map. We're considering deprecating this
 * feature and replace it with proper Map and ImmutableMap data structures.
 *
 * @internal
 */
function monitorUseOfObjectMap() {
  var currentName = getCurrentOwnerDisplayName() || '';
  if (ownerHasMonitoredObjectMap.hasOwnProperty(currentName)) {
    return;
  }
  ownerHasMonitoredObjectMap[currentName] = true;
  monitorCodeUse('react_object_map_children');
}

/**
 * Ensure that every component either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {*} component Statically passed child of any type.
 * @param {*} parentType component's parent's type.
 * @return {boolean}
 */
function validateChildKeys(component, parentType) {
  if (Array.isArray(component)) {
    for (var i = 0; i < component.length; i++) {
      var child = component[i];
      if (ReactElement.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement.isValidElement(component)) {
    // This component was passed in a valid location.
    component._store.validated = true;
  } else if (component && typeof component === 'object') {
    monitorUseOfObjectMap();
    for (var name in component) {
      validatePropertyKey(name, component[name], parentType);
    }
  }
}

/**
 * Assert that the props are valid
 *
 * @param {string} componentName Name of the component for error messages.
 * @param {object} propTypes Map of prop name to a ReactPropType
 * @param {object} props
 * @param {string} location e.g. "prop", "context", "child context"
 * @private
 */
function checkPropTypes(componentName, propTypes, props, location) {
  for (var propName in propTypes) {
    if (propTypes.hasOwnProperty(propName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        error = propTypes[propName](props, propName, componentName, location);
      } catch (ex) {
        error = ex;
      }
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;
        // This will soon use the warning module
        monitorCodeUse(
          'react_failed_descriptor_type_check',
          { message: error.message }
        );
      }
    }
  }
}

var ReactElementValidator = {

  createElement: function(type, props, children) {
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    ("production" !== process.env.NODE_ENV ? warning(
      type != null,
      'React.createElement: type should not be null or undefined. It should ' +
        'be a string (for DOM elements) or a ReactClass (for composite ' +
        'components).'
    ) : null);

    var element = ReactElement.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }

    if (type) {
      var name = type.displayName;
      if (type.propTypes) {
        checkPropTypes(
          name,
          type.propTypes,
          element.props,
          ReactPropTypeLocations.prop
        );
      }
      if (type.contextTypes) {
        checkPropTypes(
          name,
          type.contextTypes,
          element._context,
          ReactPropTypeLocations.context
        );
      }
    }
    return element;
  },

  createFactory: function(type) {
    var validatedFactory = ReactElementValidator.createElement.bind(
      null,
      type
    );
    validatedFactory.type = type;
    return validatedFactory;
  }

};

module.exports = ReactElementValidator;

}).call(this,require('_process'))
},{"./ReactCurrentOwner":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCurrentOwner.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactPropTypeLocations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTypeLocations.js","./monitorCodeUse":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\monitorCodeUse.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactEmptyComponent.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEmptyComponent
 */

"use strict";

var ReactElement = require("./ReactElement");

var invariant = require("./invariant");

var component;
// This registry keeps track of the React IDs of the components that rendered to
// `null` (in reality a placeholder such as `noscript`)
var nullComponentIdsRegistry = {};

var ReactEmptyComponentInjection = {
  injectEmptyComponent: function(emptyComponent) {
    component = ReactElement.createFactory(emptyComponent);
  }
};

/**
 * @return {ReactComponent} component The injected empty component.
 */
function getEmptyComponent() {
  ("production" !== process.env.NODE_ENV ? invariant(
    component,
    'Trying to return null from a render, but no null placeholder component ' +
    'was injected.'
  ) : invariant(component));
  return component();
}

/**
 * Mark the component as having rendered to null.
 * @param {string} id Component's `_rootNodeID`.
 */
function registerNullComponentID(id) {
  nullComponentIdsRegistry[id] = true;
}

/**
 * Unmark the component as having rendered to null: it renders to something now.
 * @param {string} id Component's `_rootNodeID`.
 */
function deregisterNullComponentID(id) {
  delete nullComponentIdsRegistry[id];
}

/**
 * @param {string} id Component's `_rootNodeID`.
 * @return {boolean} True if the component is rendered to null.
 */
function isNullComponentID(id) {
  return nullComponentIdsRegistry[id];
}

var ReactEmptyComponent = {
  deregisterNullComponentID: deregisterNullComponentID,
  getEmptyComponent: getEmptyComponent,
  injection: ReactEmptyComponentInjection,
  isNullComponentID: isNullComponentID,
  registerNullComponentID: registerNullComponentID
};

module.exports = ReactEmptyComponent;

}).call(this,require('_process'))
},{"./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactErrorUtils.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactErrorUtils
 * @typechecks
 */

"use strict";

var ReactErrorUtils = {
  /**
   * Creates a guarded version of a function. This is supposed to make debugging
   * of event handlers easier. To aid debugging with the browser's debugger,
   * this currently simply returns the original function.
   *
   * @param {function} func Function to be executed
   * @param {string} name The name of the guard
   * @return {function}
   */
  guard: function(func, name) {
    return func;
  }
};

module.exports = ReactErrorUtils;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactEventEmitterMixin.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEventEmitterMixin
 */

"use strict";

var EventPluginHub = require("./EventPluginHub");

function runEventQueueInBatch(events) {
  EventPluginHub.enqueueEvents(events);
  EventPluginHub.processEventQueue();
}

var ReactEventEmitterMixin = {

  /**
   * Streams a fired top-level event to `EventPluginHub` where plugins have the
   * opportunity to create `ReactEvent`s to be dispatched.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {object} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native environment event.
   */
  handleTopLevel: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var events = EventPluginHub.extractEvents(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent
    );

    runEventQueueInBatch(events);
  }
};

module.exports = ReactEventEmitterMixin;

},{"./EventPluginHub":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginHub.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactEventListener.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEventListener
 * @typechecks static-only
 */

"use strict";

var EventListener = require("./EventListener");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var PooledClass = require("./PooledClass");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var getEventTarget = require("./getEventTarget");
var getUnboundedScrollPosition = require("./getUnboundedScrollPosition");

/**
 * Finds the parent React component of `node`.
 *
 * @param {*} node
 * @return {?DOMEventTarget} Parent container, or `null` if the specified node
 *                           is not nested.
 */
function findParent(node) {
  // TODO: It may be a good idea to cache this to prevent unnecessary DOM
  // traversal, but caching is difficult to do correctly without using a
  // mutation observer to listen for all DOM changes.
  var nodeID = ReactMount.getID(node);
  var rootID = ReactInstanceHandles.getReactRootIDFromNodeID(nodeID);
  var container = ReactMount.findReactContainerForID(rootID);
  var parent = ReactMount.getFirstReactDOM(container);
  return parent;
}

// Used to store ancestor hierarchy in top level callback
function TopLevelCallbackBookKeeping(topLevelType, nativeEvent) {
  this.topLevelType = topLevelType;
  this.nativeEvent = nativeEvent;
  this.ancestors = [];
}
assign(TopLevelCallbackBookKeeping.prototype, {
  destructor: function() {
    this.topLevelType = null;
    this.nativeEvent = null;
    this.ancestors.length = 0;
  }
});
PooledClass.addPoolingTo(
  TopLevelCallbackBookKeeping,
  PooledClass.twoArgumentPooler
);

function handleTopLevelImpl(bookKeeping) {
  var topLevelTarget = ReactMount.getFirstReactDOM(
    getEventTarget(bookKeeping.nativeEvent)
  ) || window;

  // Loop through the hierarchy, in case there's any nested components.
  // It's important that we build the array of ancestors before calling any
  // event handlers, because event handlers can modify the DOM, leading to
  // inconsistencies with ReactMount's node cache. See #1105.
  var ancestor = topLevelTarget;
  while (ancestor) {
    bookKeeping.ancestors.push(ancestor);
    ancestor = findParent(ancestor);
  }

  for (var i = 0, l = bookKeeping.ancestors.length; i < l; i++) {
    topLevelTarget = bookKeeping.ancestors[i];
    var topLevelTargetID = ReactMount.getID(topLevelTarget) || '';
    ReactEventListener._handleTopLevel(
      bookKeeping.topLevelType,
      topLevelTarget,
      topLevelTargetID,
      bookKeeping.nativeEvent
    );
  }
}

function scrollValueMonitor(cb) {
  var scrollPosition = getUnboundedScrollPosition(window);
  cb(scrollPosition);
}

var ReactEventListener = {
  _enabled: true,
  _handleTopLevel: null,

  WINDOW_HANDLE: ExecutionEnvironment.canUseDOM ? window : null,

  setHandleTopLevel: function(handleTopLevel) {
    ReactEventListener._handleTopLevel = handleTopLevel;
  },

  setEnabled: function(enabled) {
    ReactEventListener._enabled = !!enabled;
  },

  isEnabled: function() {
    return ReactEventListener._enabled;
  },


  /**
   * Traps top-level events by using event bubbling.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} handle Element on which to attach listener.
   * @return {object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapBubbledEvent: function(topLevelType, handlerBaseName, handle) {
    var element = handle;
    if (!element) {
      return;
    }
    return EventListener.listen(
      element,
      handlerBaseName,
      ReactEventListener.dispatchEvent.bind(null, topLevelType)
    );
  },

  /**
   * Traps a top-level event by using event capturing.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} handle Element on which to attach listener.
   * @return {object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapCapturedEvent: function(topLevelType, handlerBaseName, handle) {
    var element = handle;
    if (!element) {
      return;
    }
    return EventListener.capture(
      element,
      handlerBaseName,
      ReactEventListener.dispatchEvent.bind(null, topLevelType)
    );
  },

  monitorScrollValue: function(refresh) {
    var callback = scrollValueMonitor.bind(null, refresh);
    EventListener.listen(window, 'scroll', callback);
    EventListener.listen(window, 'resize', callback);
  },

  dispatchEvent: function(topLevelType, nativeEvent) {
    if (!ReactEventListener._enabled) {
      return;
    }

    var bookKeeping = TopLevelCallbackBookKeeping.getPooled(
      topLevelType,
      nativeEvent
    );
    try {
      // Event queue being processed in the same cycle allows
      // `preventDefault`.
      ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
    } finally {
      TopLevelCallbackBookKeeping.release(bookKeeping);
    }
  }
};

module.exports = ReactEventListener;

},{"./EventListener":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventListener.js","./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./PooledClass":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\PooledClass.js","./ReactInstanceHandles":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInstanceHandles.js","./ReactMount":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js","./ReactUpdates":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js","./getEventTarget":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventTarget.js","./getUnboundedScrollPosition":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getUnboundedScrollPosition.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInjection.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInjection
 */

"use strict";

var DOMProperty = require("./DOMProperty");
var EventPluginHub = require("./EventPluginHub");
var ReactComponent = require("./ReactComponent");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactEmptyComponent = require("./ReactEmptyComponent");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactNativeComponent = require("./ReactNativeComponent");
var ReactPerf = require("./ReactPerf");
var ReactRootIndex = require("./ReactRootIndex");
var ReactUpdates = require("./ReactUpdates");

var ReactInjection = {
  Component: ReactComponent.injection,
  CompositeComponent: ReactCompositeComponent.injection,
  DOMProperty: DOMProperty.injection,
  EmptyComponent: ReactEmptyComponent.injection,
  EventPluginHub: EventPluginHub.injection,
  EventEmitter: ReactBrowserEventEmitter.injection,
  NativeComponent: ReactNativeComponent.injection,
  Perf: ReactPerf.injection,
  RootIndex: ReactRootIndex.injection,
  Updates: ReactUpdates.injection
};

module.exports = ReactInjection;

},{"./DOMProperty":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMProperty.js","./EventPluginHub":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginHub.js","./ReactBrowserEventEmitter":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserEventEmitter.js","./ReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactComponent.js","./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactEmptyComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactEmptyComponent.js","./ReactNativeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactNativeComponent.js","./ReactPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js","./ReactRootIndex":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactRootIndex.js","./ReactUpdates":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInputSelection.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInputSelection
 */

"use strict";

var ReactDOMSelection = require("./ReactDOMSelection");

var containsNode = require("./containsNode");
var focusNode = require("./focusNode");
var getActiveElement = require("./getActiveElement");

function isInDocument(node) {
  return containsNode(document.documentElement, node);
}

/**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */
var ReactInputSelection = {

  hasSelectionCapabilities: function(elem) {
    return elem && (
      (elem.nodeName === 'INPUT' && elem.type === 'text') ||
      elem.nodeName === 'TEXTAREA' ||
      elem.contentEditable === 'true'
    );
  },

  getSelectionInformation: function() {
    var focusedElem = getActiveElement();
    return {
      focusedElem: focusedElem,
      selectionRange:
          ReactInputSelection.hasSelectionCapabilities(focusedElem) ?
          ReactInputSelection.getSelection(focusedElem) :
          null
    };
  },

  /**
   * @restoreSelection: If any selection information was potentially lost,
   * restore it. This is useful when performing operations that could remove dom
   * nodes and place them back in, resulting in focus being lost.
   */
  restoreSelection: function(priorSelectionInformation) {
    var curFocusedElem = getActiveElement();
    var priorFocusedElem = priorSelectionInformation.focusedElem;
    var priorSelectionRange = priorSelectionInformation.selectionRange;
    if (curFocusedElem !== priorFocusedElem &&
        isInDocument(priorFocusedElem)) {
      if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
        ReactInputSelection.setSelection(
          priorFocusedElem,
          priorSelectionRange
        );
      }
      focusNode(priorFocusedElem);
    }
  },

  /**
   * @getSelection: Gets the selection bounds of a focused textarea, input or
   * contentEditable node.
   * -@input: Look up selection bounds of this input
   * -@return {start: selectionStart, end: selectionEnd}
   */
  getSelection: function(input) {
    var selection;

    if ('selectionStart' in input) {
      // Modern browser with input or textarea.
      selection = {
        start: input.selectionStart,
        end: input.selectionEnd
      };
    } else if (document.selection && input.nodeName === 'INPUT') {
      // IE8 input.
      var range = document.selection.createRange();
      // There can only be one selection per document in IE, so it must
      // be in our element.
      if (range.parentElement() === input) {
        selection = {
          start: -range.moveStart('character', -input.value.length),
          end: -range.moveEnd('character', -input.value.length)
        };
      }
    } else {
      // Content editable or old IE textarea.
      selection = ReactDOMSelection.getOffsets(input);
    }

    return selection || {start: 0, end: 0};
  },

  /**
   * @setSelection: Sets the selection bounds of a textarea or input and focuses
   * the input.
   * -@input     Set selection bounds of this input or textarea
   * -@offsets   Object of same form that is returned from get*
   */
  setSelection: function(input, offsets) {
    var start = offsets.start;
    var end = offsets.end;
    if (typeof end === 'undefined') {
      end = start;
    }

    if ('selectionStart' in input) {
      input.selectionStart = start;
      input.selectionEnd = Math.min(end, input.value.length);
    } else if (document.selection && input.nodeName === 'INPUT') {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveStart('character', start);
      range.moveEnd('character', end - start);
      range.select();
    } else {
      ReactDOMSelection.setOffsets(input, offsets);
    }
  }
};

module.exports = ReactInputSelection;

},{"./ReactDOMSelection":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactDOMSelection.js","./containsNode":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\containsNode.js","./focusNode":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\focusNode.js","./getActiveElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getActiveElement.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInstanceHandles.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInstanceHandles
 * @typechecks static-only
 */

"use strict";

var ReactRootIndex = require("./ReactRootIndex");

var invariant = require("./invariant");

var SEPARATOR = '.';
var SEPARATOR_LENGTH = SEPARATOR.length;

/**
 * Maximum depth of traversals before we consider the possibility of a bad ID.
 */
var MAX_TREE_DEPTH = 100;

/**
 * Creates a DOM ID prefix to use when mounting React components.
 *
 * @param {number} index A unique integer
 * @return {string} React root ID.
 * @internal
 */
function getReactRootIDString(index) {
  return SEPARATOR + index.toString(36);
}

/**
 * Checks if a character in the supplied ID is a separator or the end.
 *
 * @param {string} id A React DOM ID.
 * @param {number} index Index of the character to check.
 * @return {boolean} True if the character is a separator or end of the ID.
 * @private
 */
function isBoundary(id, index) {
  return id.charAt(index) === SEPARATOR || index === id.length;
}

/**
 * Checks if the supplied string is a valid React DOM ID.
 *
 * @param {string} id A React DOM ID, maybe.
 * @return {boolean} True if the string is a valid React DOM ID.
 * @private
 */
function isValidID(id) {
  return id === '' || (
    id.charAt(0) === SEPARATOR && id.charAt(id.length - 1) !== SEPARATOR
  );
}

/**
 * Checks if the first ID is an ancestor of or equal to the second ID.
 *
 * @param {string} ancestorID
 * @param {string} descendantID
 * @return {boolean} True if `ancestorID` is an ancestor of `descendantID`.
 * @internal
 */
function isAncestorIDOf(ancestorID, descendantID) {
  return (
    descendantID.indexOf(ancestorID) === 0 &&
    isBoundary(descendantID, ancestorID.length)
  );
}

/**
 * Gets the parent ID of the supplied React DOM ID, `id`.
 *
 * @param {string} id ID of a component.
 * @return {string} ID of the parent, or an empty string.
 * @private
 */
function getParentID(id) {
  return id ? id.substr(0, id.lastIndexOf(SEPARATOR)) : '';
}

/**
 * Gets the next DOM ID on the tree path from the supplied `ancestorID` to the
 * supplied `destinationID`. If they are equal, the ID is returned.
 *
 * @param {string} ancestorID ID of an ancestor node of `destinationID`.
 * @param {string} destinationID ID of the destination node.
 * @return {string} Next ID on the path from `ancestorID` to `destinationID`.
 * @private
 */
function getNextDescendantID(ancestorID, destinationID) {
  ("production" !== process.env.NODE_ENV ? invariant(
    isValidID(ancestorID) && isValidID(destinationID),
    'getNextDescendantID(%s, %s): Received an invalid React DOM ID.',
    ancestorID,
    destinationID
  ) : invariant(isValidID(ancestorID) && isValidID(destinationID)));
  ("production" !== process.env.NODE_ENV ? invariant(
    isAncestorIDOf(ancestorID, destinationID),
    'getNextDescendantID(...): React has made an invalid assumption about ' +
    'the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.',
    ancestorID,
    destinationID
  ) : invariant(isAncestorIDOf(ancestorID, destinationID)));
  if (ancestorID === destinationID) {
    return ancestorID;
  }
  // Skip over the ancestor and the immediate separator. Traverse until we hit
  // another separator or we reach the end of `destinationID`.
  var start = ancestorID.length + SEPARATOR_LENGTH;
  for (var i = start; i < destinationID.length; i++) {
    if (isBoundary(destinationID, i)) {
      break;
    }
  }
  return destinationID.substr(0, i);
}

/**
 * Gets the nearest common ancestor ID of two IDs.
 *
 * Using this ID scheme, the nearest common ancestor ID is the longest common
 * prefix of the two IDs that immediately preceded a "marker" in both strings.
 *
 * @param {string} oneID
 * @param {string} twoID
 * @return {string} Nearest common ancestor ID, or the empty string if none.
 * @private
 */
function getFirstCommonAncestorID(oneID, twoID) {
  var minLength = Math.min(oneID.length, twoID.length);
  if (minLength === 0) {
    return '';
  }
  var lastCommonMarkerIndex = 0;
  // Use `<=` to traverse until the "EOL" of the shorter string.
  for (var i = 0; i <= minLength; i++) {
    if (isBoundary(oneID, i) && isBoundary(twoID, i)) {
      lastCommonMarkerIndex = i;
    } else if (oneID.charAt(i) !== twoID.charAt(i)) {
      break;
    }
  }
  var longestCommonID = oneID.substr(0, lastCommonMarkerIndex);
  ("production" !== process.env.NODE_ENV ? invariant(
    isValidID(longestCommonID),
    'getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s',
    oneID,
    twoID,
    longestCommonID
  ) : invariant(isValidID(longestCommonID)));
  return longestCommonID;
}

/**
 * Traverses the parent path between two IDs (either up or down). The IDs must
 * not be the same, and there must exist a parent path between them. If the
 * callback returns `false`, traversal is stopped.
 *
 * @param {?string} start ID at which to start traversal.
 * @param {?string} stop ID at which to end traversal.
 * @param {function} cb Callback to invoke each ID with.
 * @param {?boolean} skipFirst Whether or not to skip the first node.
 * @param {?boolean} skipLast Whether or not to skip the last node.
 * @private
 */
function traverseParentPath(start, stop, cb, arg, skipFirst, skipLast) {
  start = start || '';
  stop = stop || '';
  ("production" !== process.env.NODE_ENV ? invariant(
    start !== stop,
    'traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.',
    start
  ) : invariant(start !== stop));
  var traverseUp = isAncestorIDOf(stop, start);
  ("production" !== process.env.NODE_ENV ? invariant(
    traverseUp || isAncestorIDOf(start, stop),
    'traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do ' +
    'not have a parent path.',
    start,
    stop
  ) : invariant(traverseUp || isAncestorIDOf(start, stop)));
  // Traverse from `start` to `stop` one depth at a time.
  var depth = 0;
  var traverse = traverseUp ? getParentID : getNextDescendantID;
  for (var id = start; /* until break */; id = traverse(id, stop)) {
    var ret;
    if ((!skipFirst || id !== start) && (!skipLast || id !== stop)) {
      ret = cb(id, traverseUp, arg);
    }
    if (ret === false || id === stop) {
      // Only break //after// visiting `stop`.
      break;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      depth++ < MAX_TREE_DEPTH,
      'traverseParentPath(%s, %s, ...): Detected an infinite loop while ' +
      'traversing the React DOM ID tree. This may be due to malformed IDs: %s',
      start, stop
    ) : invariant(depth++ < MAX_TREE_DEPTH));
  }
}

/**
 * Manages the IDs assigned to DOM representations of React components. This
 * uses a specific scheme in order to traverse the DOM efficiently (e.g. in
 * order to simulate events).
 *
 * @internal
 */
var ReactInstanceHandles = {

  /**
   * Constructs a React root ID
   * @return {string} A React root ID.
   */
  createReactRootID: function() {
    return getReactRootIDString(ReactRootIndex.createReactRootIndex());
  },

  /**
   * Constructs a React ID by joining a root ID with a name.
   *
   * @param {string} rootID Root ID of a parent component.
   * @param {string} name A component's name (as flattened children).
   * @return {string} A React ID.
   * @internal
   */
  createReactID: function(rootID, name) {
    return rootID + name;
  },

  /**
   * Gets the DOM ID of the React component that is the root of the tree that
   * contains the React component with the supplied DOM ID.
   *
   * @param {string} id DOM ID of a React component.
   * @return {?string} DOM ID of the React component that is the root.
   * @internal
   */
  getReactRootIDFromNodeID: function(id) {
    if (id && id.charAt(0) === SEPARATOR && id.length > 1) {
      var index = id.indexOf(SEPARATOR, 1);
      return index > -1 ? id.substr(0, index) : id;
    }
    return null;
  },

  /**
   * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
   * should would receive a `mouseEnter` or `mouseLeave` event.
   *
   * NOTE: Does not invoke the callback on the nearest common ancestor because
   * nothing "entered" or "left" that element.
   *
   * @param {string} leaveID ID being left.
   * @param {string} enterID ID being entered.
   * @param {function} cb Callback to invoke on each entered/left ID.
   * @param {*} upArg Argument to invoke the callback with on left IDs.
   * @param {*} downArg Argument to invoke the callback with on entered IDs.
   * @internal
   */
  traverseEnterLeave: function(leaveID, enterID, cb, upArg, downArg) {
    var ancestorID = getFirstCommonAncestorID(leaveID, enterID);
    if (ancestorID !== leaveID) {
      traverseParentPath(leaveID, ancestorID, cb, upArg, false, true);
    }
    if (ancestorID !== enterID) {
      traverseParentPath(ancestorID, enterID, cb, downArg, true, false);
    }
  },

  /**
   * Simulates the traversal of a two-phase, capture/bubble event dispatch.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseTwoPhase: function(targetID, cb, arg) {
    if (targetID) {
      traverseParentPath('', targetID, cb, arg, true, false);
      traverseParentPath(targetID, '', cb, arg, false, true);
    }
  },

  /**
   * Traverse a node ID, calling the supplied `cb` for each ancestor ID. For
   * example, passing `.0.$row-0.1` would result in `cb` getting called
   * with `.0`, `.0.$row-0`, and `.0.$row-0.1`.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseAncestors: function(targetID, cb, arg) {
    traverseParentPath('', targetID, cb, arg, true, false);
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _getFirstCommonAncestorID: getFirstCommonAncestorID,

  /**
   * Exposed for unit testing.
   * @private
   */
  _getNextDescendantID: getNextDescendantID,

  isAncestorIDOf: isAncestorIDOf,

  SEPARATOR: SEPARATOR

};

module.exports = ReactInstanceHandles;

}).call(this,require('_process'))
},{"./ReactRootIndex":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactRootIndex.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactLegacyElement.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactLegacyElement
 */

"use strict";

var ReactCurrentOwner = require("./ReactCurrentOwner");

var invariant = require("./invariant");
var monitorCodeUse = require("./monitorCodeUse");
var warning = require("./warning");

var legacyFactoryLogs = {};
function warnForLegacyFactoryCall() {
  if (!ReactLegacyElementFactory._isLegacyCallWarningEnabled) {
    return;
  }
  var owner = ReactCurrentOwner.current;
  var name = owner && owner.constructor ? owner.constructor.displayName : '';
  if (!name) {
    name = 'Something';
  }
  if (legacyFactoryLogs.hasOwnProperty(name)) {
    return;
  }
  legacyFactoryLogs[name] = true;
  ("production" !== process.env.NODE_ENV ? warning(
    false,
    name + ' is calling a React component directly. ' +
    'Use a factory or JSX instead. See: http://fb.me/react-legacyfactory'
  ) : null);
  monitorCodeUse('react_legacy_factory_call', { version: 3, name: name });
}

function warnForPlainFunctionType(type) {
  var isReactClass =
    type.prototype &&
    typeof type.prototype.mountComponent === 'function' &&
    typeof type.prototype.receiveComponent === 'function';
  if (isReactClass) {
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'Did not expect to get a React class here. Use `Component` instead ' +
      'of `Component.type` or `this.constructor`.'
    ) : null);
  } else {
    if (!type._reactWarnedForThisType) {
      try {
        type._reactWarnedForThisType = true;
      } catch (x) {
        // just incase this is a frozen object or some special object
      }
      monitorCodeUse(
        'react_non_component_in_jsx',
        { version: 3, name: type.name }
      );
    }
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'This JSX uses a plain function. Only React components are ' +
      'valid in React\'s JSX transform.'
    ) : null);
  }
}

function warnForNonLegacyFactory(type) {
  ("production" !== process.env.NODE_ENV ? warning(
    false,
    'Do not pass React.DOM.' + type.type + ' to JSX or createFactory. ' +
    'Use the string "' + type.type + '" instead.'
  ) : null);
}

/**
 * Transfer static properties from the source to the target. Functions are
 * rebound to have this reflect the original source.
 */
function proxyStaticMethods(target, source) {
  if (typeof source !== 'function') {
    return;
  }
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      var value = source[key];
      if (typeof value === 'function') {
        var bound = value.bind(source);
        // Copy any properties defined on the function, such as `isRequired` on
        // a PropTypes validator.
        for (var k in value) {
          if (value.hasOwnProperty(k)) {
            bound[k] = value[k];
          }
        }
        target[key] = bound;
      } else {
        target[key] = value;
      }
    }
  }
}

// We use an object instead of a boolean because booleans are ignored by our
// mocking libraries when these factories gets mocked.
var LEGACY_MARKER = {};
var NON_LEGACY_MARKER = {};

var ReactLegacyElementFactory = {};

ReactLegacyElementFactory.wrapCreateFactory = function(createFactory) {
  var legacyCreateFactory = function(type) {
    if (typeof type !== 'function') {
      // Non-function types cannot be legacy factories
      return createFactory(type);
    }

    if (type.isReactNonLegacyFactory) {
      // This is probably a factory created by ReactDOM we unwrap it to get to
      // the underlying string type. It shouldn't have been passed here so we
      // warn.
      if ("production" !== process.env.NODE_ENV) {
        warnForNonLegacyFactory(type);
      }
      return createFactory(type.type);
    }

    if (type.isReactLegacyFactory) {
      // This is probably a legacy factory created by ReactCompositeComponent.
      // We unwrap it to get to the underlying class.
      return createFactory(type.type);
    }

    if ("production" !== process.env.NODE_ENV) {
      warnForPlainFunctionType(type);
    }

    // Unless it's a legacy factory, then this is probably a plain function,
    // that is expecting to be invoked by JSX. We can just return it as is.
    return type;
  };
  return legacyCreateFactory;
};

ReactLegacyElementFactory.wrapCreateElement = function(createElement) {
  var legacyCreateElement = function(type, props, children) {
    if (typeof type !== 'function') {
      // Non-function types cannot be legacy factories
      return createElement.apply(this, arguments);
    }

    var args;

    if (type.isReactNonLegacyFactory) {
      // This is probably a factory created by ReactDOM we unwrap it to get to
      // the underlying string type. It shouldn't have been passed here so we
      // warn.
      if ("production" !== process.env.NODE_ENV) {
        warnForNonLegacyFactory(type);
      }
      args = Array.prototype.slice.call(arguments, 0);
      args[0] = type.type;
      return createElement.apply(this, args);
    }

    if (type.isReactLegacyFactory) {
      // This is probably a legacy factory created by ReactCompositeComponent.
      // We unwrap it to get to the underlying class.
      if (type._isMockFunction) {
        // If this is a mock function, people will expect it to be called. We
        // will actually call the original mock factory function instead. This
        // future proofs unit testing that assume that these are classes.
        type.type._mockedReactClassConstructor = type;
      }
      args = Array.prototype.slice.call(arguments, 0);
      args[0] = type.type;
      return createElement.apply(this, args);
    }

    if ("production" !== process.env.NODE_ENV) {
      warnForPlainFunctionType(type);
    }

    // This is being called with a plain function we should invoke it
    // immediately as if this was used with legacy JSX.
    return type.apply(null, Array.prototype.slice.call(arguments, 1));
  };
  return legacyCreateElement;
};

ReactLegacyElementFactory.wrapFactory = function(factory) {
  ("production" !== process.env.NODE_ENV ? invariant(
    typeof factory === 'function',
    'This is suppose to accept a element factory'
  ) : invariant(typeof factory === 'function'));
  var legacyElementFactory = function(config, children) {
    // This factory should not be called when JSX is used. Use JSX instead.
    if ("production" !== process.env.NODE_ENV) {
      warnForLegacyFactoryCall();
    }
    return factory.apply(this, arguments);
  };
  proxyStaticMethods(legacyElementFactory, factory.type);
  legacyElementFactory.isReactLegacyFactory = LEGACY_MARKER;
  legacyElementFactory.type = factory.type;
  return legacyElementFactory;
};

// This is used to mark a factory that will remain. E.g. we're allowed to call
// it as a function. However, you're not suppose to pass it to createElement
// or createFactory, so it will warn you if you do.
ReactLegacyElementFactory.markNonLegacyFactory = function(factory) {
  factory.isReactNonLegacyFactory = NON_LEGACY_MARKER;
  return factory;
};

// Checks if a factory function is actually a legacy factory pretending to
// be a class.
ReactLegacyElementFactory.isValidFactory = function(factory) {
  // TODO: This will be removed and moved into a class validator or something.
  return typeof factory === 'function' &&
    factory.isReactLegacyFactory === LEGACY_MARKER;
};

ReactLegacyElementFactory.isValidClass = function(factory) {
  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'isValidClass is deprecated and will be removed in a future release. ' +
      'Use a more specific validator instead.'
    ) : null);
  }
  return ReactLegacyElementFactory.isValidFactory(factory);
};

ReactLegacyElementFactory._isLegacyCallWarningEnabled = true;

module.exports = ReactLegacyElementFactory;

}).call(this,require('_process'))
},{"./ReactCurrentOwner":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCurrentOwner.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./monitorCodeUse":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\monitorCodeUse.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMarkupChecksum.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMarkupChecksum
 */

"use strict";

var adler32 = require("./adler32");

var ReactMarkupChecksum = {
  CHECKSUM_ATTR_NAME: 'data-react-checksum',

  /**
   * @param {string} markup Markup string
   * @return {string} Markup string with checksum attribute attached
   */
  addChecksumToMarkup: function(markup) {
    var checksum = adler32(markup);
    return markup.replace(
      '>',
      ' ' + ReactMarkupChecksum.CHECKSUM_ATTR_NAME + '="' + checksum + '">'
    );
  },

  /**
   * @param {string} markup to use
   * @param {DOMElement} element root React element
   * @returns {boolean} whether or not the markup is the same
   */
  canReuseMarkup: function(markup, element) {
    var existingChecksum = element.getAttribute(
      ReactMarkupChecksum.CHECKSUM_ATTR_NAME
    );
    existingChecksum = existingChecksum && parseInt(existingChecksum, 10);
    var markupChecksum = adler32(markup);
    return markupChecksum === existingChecksum;
  }
};

module.exports = ReactMarkupChecksum;

},{"./adler32":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\adler32.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMount.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMount
 */

"use strict";

var DOMProperty = require("./DOMProperty");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactLegacyElement = require("./ReactLegacyElement");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactPerf = require("./ReactPerf");

var containsNode = require("./containsNode");
var deprecated = require("./deprecated");
var getReactRootElementInContainer = require("./getReactRootElementInContainer");
var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");
var warning = require("./warning");

var createElement = ReactLegacyElement.wrapCreateElement(
  ReactElement.createElement
);

var SEPARATOR = ReactInstanceHandles.SEPARATOR;

var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
var nodeCache = {};

var ELEMENT_NODE_TYPE = 1;
var DOC_NODE_TYPE = 9;

/** Mapping from reactRootID to React component instance. */
var instancesByReactRootID = {};

/** Mapping from reactRootID to `container` nodes. */
var containersByReactRootID = {};

if ("production" !== process.env.NODE_ENV) {
  /** __DEV__-only mapping from reactRootID to root elements. */
  var rootElementsByReactRootID = {};
}

// Used to store breadth-first search state in findComponentRoot.
var findComponentRootReusableArray = [];

/**
 * @param {DOMElement} container DOM element that may contain a React component.
 * @return {?string} A "reactRoot" ID, if a React component is rendered.
 */
function getReactRootID(container) {
  var rootElement = getReactRootElementInContainer(container);
  return rootElement && ReactMount.getID(rootElement);
}

/**
 * Accessing node[ATTR_NAME] or calling getAttribute(ATTR_NAME) on a form
 * element can return its control whose name or ID equals ATTR_NAME. All
 * DOM nodes support `getAttributeNode` but this can also get called on
 * other objects so just return '' if we're given something other than a
 * DOM node (such as window).
 *
 * @param {?DOMElement|DOMWindow|DOMDocument|DOMTextNode} node DOM node.
 * @return {string} ID of the supplied `domNode`.
 */
function getID(node) {
  var id = internalGetID(node);
  if (id) {
    if (nodeCache.hasOwnProperty(id)) {
      var cached = nodeCache[id];
      if (cached !== node) {
        ("production" !== process.env.NODE_ENV ? invariant(
          !isValid(cached, id),
          'ReactMount: Two valid but unequal nodes with the same `%s`: %s',
          ATTR_NAME, id
        ) : invariant(!isValid(cached, id)));

        nodeCache[id] = node;
      }
    } else {
      nodeCache[id] = node;
    }
  }

  return id;
}

function internalGetID(node) {
  // If node is something like a window, document, or text node, none of
  // which support attributes or a .getAttribute method, gracefully return
  // the empty string, as if the attribute were missing.
  return node && node.getAttribute && node.getAttribute(ATTR_NAME) || '';
}

/**
 * Sets the React-specific ID of the given node.
 *
 * @param {DOMElement} node The DOM node whose ID will be set.
 * @param {string} id The value of the ID attribute.
 */
function setID(node, id) {
  var oldID = internalGetID(node);
  if (oldID !== id) {
    delete nodeCache[oldID];
  }
  node.setAttribute(ATTR_NAME, id);
  nodeCache[id] = node;
}

/**
 * Finds the node with the supplied React-generated DOM ID.
 *
 * @param {string} id A React-generated DOM ID.
 * @return {DOMElement} DOM node with the suppled `id`.
 * @internal
 */
function getNode(id) {
  if (!nodeCache.hasOwnProperty(id) || !isValid(nodeCache[id], id)) {
    nodeCache[id] = ReactMount.findReactNodeByID(id);
  }
  return nodeCache[id];
}

/**
 * A node is "valid" if it is contained by a currently mounted container.
 *
 * This means that the node does not have to be contained by a document in
 * order to be considered valid.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @param {string} id The expected ID of the node.
 * @return {boolean} Whether the node is contained by a mounted container.
 */
function isValid(node, id) {
  if (node) {
    ("production" !== process.env.NODE_ENV ? invariant(
      internalGetID(node) === id,
      'ReactMount: Unexpected modification of `%s`',
      ATTR_NAME
    ) : invariant(internalGetID(node) === id));

    var container = ReactMount.findReactContainerForID(id);
    if (container && containsNode(container, node)) {
      return true;
    }
  }

  return false;
}

/**
 * Causes the cache to forget about one React-specific ID.
 *
 * @param {string} id The ID to forget.
 */
function purgeID(id) {
  delete nodeCache[id];
}

var deepestNodeSoFar = null;
function findDeepestCachedAncestorImpl(ancestorID) {
  var ancestor = nodeCache[ancestorID];
  if (ancestor && isValid(ancestor, ancestorID)) {
    deepestNodeSoFar = ancestor;
  } else {
    // This node isn't populated in the cache, so presumably none of its
    // descendants are. Break out of the loop.
    return false;
  }
}

/**
 * Return the deepest cached node whose ID is a prefix of `targetID`.
 */
function findDeepestCachedAncestor(targetID) {
  deepestNodeSoFar = null;
  ReactInstanceHandles.traverseAncestors(
    targetID,
    findDeepestCachedAncestorImpl
  );

  var foundNode = deepestNodeSoFar;
  deepestNodeSoFar = null;
  return foundNode;
}

/**
 * Mounting is the process of initializing a React component by creatings its
 * representative DOM elements and inserting them into a supplied `container`.
 * Any prior content inside `container` is destroyed in the process.
 *
 *   ReactMount.render(
 *     component,
 *     document.getElementById('container')
 *   );
 *
 *   <div id="container">                   <-- Supplied `container`.
 *     <div data-reactid=".3">              <-- Rendered reactRoot of React
 *       // ...                                 component.
 *     </div>
 *   </div>
 *
 * Inside of `container`, the first element rendered is the "reactRoot".
 */
var ReactMount = {
  /** Exposed for debugging purposes **/
  _instancesByReactRootID: instancesByReactRootID,

  /**
   * This is a hook provided to support rendering React components while
   * ensuring that the apparent scroll position of its `container` does not
   * change.
   *
   * @param {DOMElement} container The `container` being rendered into.
   * @param {function} renderCallback This must be called once to do the render.
   */
  scrollMonitor: function(container, renderCallback) {
    renderCallback();
  },

  /**
   * Take a component that's already mounted into the DOM and replace its props
   * @param {ReactComponent} prevComponent component instance already in the DOM
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @param {?function} callback function triggered on completion
   */
  _updateRootComponent: function(
      prevComponent,
      nextComponent,
      container,
      callback) {
    var nextProps = nextComponent.props;
    ReactMount.scrollMonitor(container, function() {
      prevComponent.replaceProps(nextProps, callback);
    });

    if ("production" !== process.env.NODE_ENV) {
      // Record the root element in case it later gets transplanted.
      rootElementsByReactRootID[getReactRootID(container)] =
        getReactRootElementInContainer(container);
    }

    return prevComponent;
  },

  /**
   * Register a component into the instance map and starts scroll value
   * monitoring
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @return {string} reactRoot ID prefix
   */
  _registerComponent: function(nextComponent, container) {
    ("production" !== process.env.NODE_ENV ? invariant(
      container && (
        container.nodeType === ELEMENT_NODE_TYPE ||
        container.nodeType === DOC_NODE_TYPE
      ),
      '_registerComponent(...): Target container is not a DOM element.'
    ) : invariant(container && (
      container.nodeType === ELEMENT_NODE_TYPE ||
      container.nodeType === DOC_NODE_TYPE
    )));

    ReactBrowserEventEmitter.ensureScrollValueMonitoring();

    var reactRootID = ReactMount.registerContainer(container);
    instancesByReactRootID[reactRootID] = nextComponent;
    return reactRootID;
  },

  /**
   * Render a new component into the DOM.
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @param {boolean} shouldReuseMarkup if we should skip the markup insertion
   * @return {ReactComponent} nextComponent
   */
  _renderNewRootComponent: ReactPerf.measure(
    'ReactMount',
    '_renderNewRootComponent',
    function(
        nextComponent,
        container,
        shouldReuseMarkup) {
      // Various parts of our code (such as ReactCompositeComponent's
      // _renderValidatedComponent) assume that calls to render aren't nested;
      // verify that that's the case.
      ("production" !== process.env.NODE_ENV ? warning(
        ReactCurrentOwner.current == null,
        '_renderNewRootComponent(): Render methods should be a pure function ' +
        'of props and state; triggering nested component updates from ' +
        'render is not allowed. If necessary, trigger nested updates in ' +
        'componentDidUpdate.'
      ) : null);

      var componentInstance = instantiateReactComponent(nextComponent, null);
      var reactRootID = ReactMount._registerComponent(
        componentInstance,
        container
      );
      componentInstance.mountComponentIntoNode(
        reactRootID,
        container,
        shouldReuseMarkup
      );

      if ("production" !== process.env.NODE_ENV) {
        // Record the root element in case it later gets transplanted.
        rootElementsByReactRootID[reactRootID] =
          getReactRootElementInContainer(container);
      }

      return componentInstance;
    }
  ),

  /**
   * Renders a React component into the DOM in the supplied `container`.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactElement} nextElement Component element to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  render: function(nextElement, container, callback) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactElement.isValidElement(nextElement),
      'renderComponent(): Invalid component element.%s',
      (
        typeof nextElement === 'string' ?
          ' Instead of passing an element string, make sure to instantiate ' +
          'it by passing it to React.createElement.' :
        ReactLegacyElement.isValidFactory(nextElement) ?
          ' Instead of passing a component class, make sure to instantiate ' +
          'it by passing it to React.createElement.' :
        // Check if it quacks like a element
        typeof nextElement.props !== "undefined" ?
          ' This may be caused by unintentionally loading two independent ' +
          'copies of React.' :
          ''
      )
    ) : invariant(ReactElement.isValidElement(nextElement)));

    var prevComponent = instancesByReactRootID[getReactRootID(container)];

    if (prevComponent) {
      var prevElement = prevComponent._currentElement;
      if (shouldUpdateReactComponent(prevElement, nextElement)) {
        return ReactMount._updateRootComponent(
          prevComponent,
          nextElement,
          container,
          callback
        );
      } else {
        ReactMount.unmountComponentAtNode(container);
      }
    }

    var reactRootElement = getReactRootElementInContainer(container);
    var containerHasReactMarkup =
      reactRootElement && ReactMount.isRenderedByReact(reactRootElement);

    var shouldReuseMarkup = containerHasReactMarkup && !prevComponent;

    var component = ReactMount._renderNewRootComponent(
      nextElement,
      container,
      shouldReuseMarkup
    );
    callback && callback.call(component);
    return component;
  },

  /**
   * Constructs a component instance of `constructor` with `initialProps` and
   * renders it into the supplied `container`.
   *
   * @param {function} constructor React component constructor.
   * @param {?object} props Initial props of the component instance.
   * @param {DOMElement} container DOM element to render into.
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  constructAndRenderComponent: function(constructor, props, container) {
    var element = createElement(constructor, props);
    return ReactMount.render(element, container);
  },

  /**
   * Constructs a component instance of `constructor` with `initialProps` and
   * renders it into a container node identified by supplied `id`.
   *
   * @param {function} componentConstructor React component constructor
   * @param {?object} props Initial props of the component instance.
   * @param {string} id ID of the DOM element to render into.
   * @return {ReactComponent} Component instance rendered in the container node.
   */
  constructAndRenderComponentByID: function(constructor, props, id) {
    var domNode = document.getElementById(id);
    ("production" !== process.env.NODE_ENV ? invariant(
      domNode,
      'Tried to get element with id of "%s" but it is not present on the page.',
      id
    ) : invariant(domNode));
    return ReactMount.constructAndRenderComponent(constructor, props, domNode);
  },

  /**
   * Registers a container node into which React components will be rendered.
   * This also creates the "reactRoot" ID that will be assigned to the element
   * rendered within.
   *
   * @param {DOMElement} container DOM element to register as a container.
   * @return {string} The "reactRoot" ID of elements rendered within.
   */
  registerContainer: function(container) {
    var reactRootID = getReactRootID(container);
    if (reactRootID) {
      // If one exists, make sure it is a valid "reactRoot" ID.
      reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID);
    }
    if (!reactRootID) {
      // No valid "reactRoot" ID found, create one.
      reactRootID = ReactInstanceHandles.createReactRootID();
    }
    containersByReactRootID[reactRootID] = container;
    return reactRootID;
  },

  /**
   * Unmounts and destroys the React component rendered in the `container`.
   *
   * @param {DOMElement} container DOM element containing a React component.
   * @return {boolean} True if a component was found in and unmounted from
   *                   `container`
   */
  unmountComponentAtNode: function(container) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case. (Strictly speaking, unmounting won't cause a
    // render but we still don't expect to be in a render call here.)
    ("production" !== process.env.NODE_ENV ? warning(
      ReactCurrentOwner.current == null,
      'unmountComponentAtNode(): Render methods should be a pure function of ' +
      'props and state; triggering nested component updates from render is ' +
      'not allowed. If necessary, trigger nested updates in ' +
      'componentDidUpdate.'
    ) : null);

    var reactRootID = getReactRootID(container);
    var component = instancesByReactRootID[reactRootID];
    if (!component) {
      return false;
    }
    ReactMount.unmountComponentFromNode(component, container);
    delete instancesByReactRootID[reactRootID];
    delete containersByReactRootID[reactRootID];
    if ("production" !== process.env.NODE_ENV) {
      delete rootElementsByReactRootID[reactRootID];
    }
    return true;
  },

  /**
   * Unmounts a component and removes it from the DOM.
   *
   * @param {ReactComponent} instance React component instance.
   * @param {DOMElement} container DOM element to unmount from.
   * @final
   * @internal
   * @see {ReactMount.unmountComponentAtNode}
   */
  unmountComponentFromNode: function(instance, container) {
    instance.unmountComponent();

    if (container.nodeType === DOC_NODE_TYPE) {
      container = container.documentElement;
    }

    // http://jsperf.com/emptying-a-node
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  },

  /**
   * Finds the container DOM element that contains React component to which the
   * supplied DOM `id` belongs.
   *
   * @param {string} id The ID of an element rendered by a React component.
   * @return {?DOMElement} DOM element that contains the `id`.
   */
  findReactContainerForID: function(id) {
    var reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(id);
    var container = containersByReactRootID[reactRootID];

    if ("production" !== process.env.NODE_ENV) {
      var rootElement = rootElementsByReactRootID[reactRootID];
      if (rootElement && rootElement.parentNode !== container) {
        ("production" !== process.env.NODE_ENV ? invariant(
          // Call internalGetID here because getID calls isValid which calls
          // findReactContainerForID (this function).
          internalGetID(rootElement) === reactRootID,
          'ReactMount: Root element ID differed from reactRootID.'
        ) : invariant(// Call internalGetID here because getID calls isValid which calls
        // findReactContainerForID (this function).
        internalGetID(rootElement) === reactRootID));

        var containerChild = container.firstChild;
        if (containerChild &&
            reactRootID === internalGetID(containerChild)) {
          // If the container has a new child with the same ID as the old
          // root element, then rootElementsByReactRootID[reactRootID] is
          // just stale and needs to be updated. The case that deserves a
          // warning is when the container is empty.
          rootElementsByReactRootID[reactRootID] = containerChild;
        } else {
          console.warn(
            'ReactMount: Root element has been removed from its original ' +
            'container. New container:', rootElement.parentNode
          );
        }
      }
    }

    return container;
  },

  /**
   * Finds an element rendered by React with the supplied ID.
   *
   * @param {string} id ID of a DOM node in the React component.
   * @return {DOMElement} Root DOM node of the React component.
   */
  findReactNodeByID: function(id) {
    var reactRoot = ReactMount.findReactContainerForID(id);
    return ReactMount.findComponentRoot(reactRoot, id);
  },

  /**
   * True if the supplied `node` is rendered by React.
   *
   * @param {*} node DOM Element to check.
   * @return {boolean} True if the DOM Element appears to be rendered by React.
   * @internal
   */
  isRenderedByReact: function(node) {
    if (node.nodeType !== 1) {
      // Not a DOMElement, therefore not a React component
      return false;
    }
    var id = ReactMount.getID(node);
    return id ? id.charAt(0) === SEPARATOR : false;
  },

  /**
   * Traverses up the ancestors of the supplied node to find a node that is a
   * DOM representation of a React component.
   *
   * @param {*} node
   * @return {?DOMEventTarget}
   * @internal
   */
  getFirstReactDOM: function(node) {
    var current = node;
    while (current && current.parentNode !== current) {
      if (ReactMount.isRenderedByReact(current)) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  },

  /**
   * Finds a node with the supplied `targetID` inside of the supplied
   * `ancestorNode`.  Exploits the ID naming scheme to perform the search
   * quickly.
   *
   * @param {DOMEventTarget} ancestorNode Search from this root.
   * @pararm {string} targetID ID of the DOM representation of the component.
   * @return {DOMEventTarget} DOM node with the supplied `targetID`.
   * @internal
   */
  findComponentRoot: function(ancestorNode, targetID) {
    var firstChildren = findComponentRootReusableArray;
    var childIndex = 0;

    var deepestAncestor = findDeepestCachedAncestor(targetID) || ancestorNode;

    firstChildren[0] = deepestAncestor.firstChild;
    firstChildren.length = 1;

    while (childIndex < firstChildren.length) {
      var child = firstChildren[childIndex++];
      var targetChild;

      while (child) {
        var childID = ReactMount.getID(child);
        if (childID) {
          // Even if we find the node we're looking for, we finish looping
          // through its siblings to ensure they're cached so that we don't have
          // to revisit this node again. Otherwise, we make n^2 calls to getID
          // when visiting the many children of a single node in order.

          if (targetID === childID) {
            targetChild = child;
          } else if (ReactInstanceHandles.isAncestorIDOf(childID, targetID)) {
            // If we find a child whose ID is an ancestor of the given ID,
            // then we can be sure that we only want to search the subtree
            // rooted at this child, so we can throw out the rest of the
            // search state.
            firstChildren.length = childIndex = 0;
            firstChildren.push(child.firstChild);
          }

        } else {
          // If this child had no ID, then there's a chance that it was
          // injected automatically by the browser, as when a `<table>`
          // element sprouts an extra `<tbody>` child as a side effect of
          // `.innerHTML` parsing. Optimistically continue down this
          // branch, but not before examining the other siblings.
          firstChildren.push(child.firstChild);
        }

        child = child.nextSibling;
      }

      if (targetChild) {
        // Emptying firstChildren/findComponentRootReusableArray is
        // not necessary for correctness, but it helps the GC reclaim
        // any nodes that were left at the end of the search.
        firstChildren.length = 0;

        return targetChild;
      }
    }

    firstChildren.length = 0;

    ("production" !== process.env.NODE_ENV ? invariant(
      false,
      'findComponentRoot(..., %s): Unable to find element. This probably ' +
      'means the DOM was unexpectedly mutated (e.g., by the browser), ' +
      'usually due to forgetting a <tbody> when using tables, nesting tags ' +
      'like <form>, <p>, or <a>, or using non-SVG elements in an <svg> ' +
      'parent. ' +
      'Try inspecting the child nodes of the element with React ID `%s`.',
      targetID,
      ReactMount.getID(ancestorNode)
    ) : invariant(false));
  },


  /**
   * React ID utilities.
   */

  getReactRootID: getReactRootID,

  getID: getID,

  setID: setID,

  getNode: getNode,

  purgeID: purgeID
};

// Deprecations (remove for 0.13)
ReactMount.renderComponent = deprecated(
  'ReactMount',
  'renderComponent',
  'render',
  this,
  ReactMount.render
);

module.exports = ReactMount;

}).call(this,require('_process'))
},{"./DOMProperty":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMProperty.js","./ReactBrowserEventEmitter":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserEventEmitter.js","./ReactCurrentOwner":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCurrentOwner.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactInstanceHandles":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInstanceHandles.js","./ReactLegacyElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactLegacyElement.js","./ReactPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js","./containsNode":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\containsNode.js","./deprecated":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\deprecated.js","./getReactRootElementInContainer":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getReactRootElementInContainer.js","./instantiateReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\instantiateReactComponent.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./shouldUpdateReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\shouldUpdateReactComponent.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMultiChild.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMultiChild
 * @typechecks static-only
 */

"use strict";

var ReactComponent = require("./ReactComponent");
var ReactMultiChildUpdateTypes = require("./ReactMultiChildUpdateTypes");

var flattenChildren = require("./flattenChildren");
var instantiateReactComponent = require("./instantiateReactComponent");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");

/**
 * Updating children of a component may trigger recursive updates. The depth is
 * used to batch recursive updates to render markup more efficiently.
 *
 * @type {number}
 * @private
 */
var updateDepth = 0;

/**
 * Queue of update configuration objects.
 *
 * Each object has a `type` property that is in `ReactMultiChildUpdateTypes`.
 *
 * @type {array<object>}
 * @private
 */
var updateQueue = [];

/**
 * Queue of markup to be rendered.
 *
 * @type {array<string>}
 * @private
 */
var markupQueue = [];

/**
 * Enqueues markup to be rendered and inserted at a supplied index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} markup Markup that renders into an element.
 * @param {number} toIndex Destination index.
 * @private
 */
function enqueueMarkup(parentID, markup, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.INSERT_MARKUP,
    markupIndex: markupQueue.push(markup) - 1,
    textContent: null,
    fromIndex: null,
    toIndex: toIndex
  });
}

/**
 * Enqueues moving an existing element to another index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Source index of the existing element.
 * @param {number} toIndex Destination index of the element.
 * @private
 */
function enqueueMove(parentID, fromIndex, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.MOVE_EXISTING,
    markupIndex: null,
    textContent: null,
    fromIndex: fromIndex,
    toIndex: toIndex
  });
}

/**
 * Enqueues removing an element at an index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Index of the element to remove.
 * @private
 */
function enqueueRemove(parentID, fromIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.REMOVE_NODE,
    markupIndex: null,
    textContent: null,
    fromIndex: fromIndex,
    toIndex: null
  });
}

/**
 * Enqueues setting the text content.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} textContent Text content to set.
 * @private
 */
function enqueueTextContent(parentID, textContent) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.TEXT_CONTENT,
    markupIndex: null,
    textContent: textContent,
    fromIndex: null,
    toIndex: null
  });
}

/**
 * Processes any enqueued updates.
 *
 * @private
 */
function processQueue() {
  if (updateQueue.length) {
    ReactComponent.BackendIDOperations.dangerouslyProcessChildrenUpdates(
      updateQueue,
      markupQueue
    );
    clearQueue();
  }
}

/**
 * Clears any enqueued updates.
 *
 * @private
 */
function clearQueue() {
  updateQueue.length = 0;
  markupQueue.length = 0;
}

/**
 * ReactMultiChild are capable of reconciling multiple children.
 *
 * @class ReactMultiChild
 * @internal
 */
var ReactMultiChild = {

  /**
   * Provides common functionality for components that must reconcile multiple
   * children. This is used by `ReactDOMComponent` to mount, update, and
   * unmount child components.
   *
   * @lends {ReactMultiChild.prototype}
   */
  Mixin: {

    /**
     * Generates a "mount image" for each of the supplied children. In the case
     * of `ReactDOMComponent`, a mount image is a string of markup.
     *
     * @param {?object} nestedChildren Nested child maps.
     * @return {array} An array of mounted representations.
     * @internal
     */
    mountChildren: function(nestedChildren, transaction) {
      var children = flattenChildren(nestedChildren);
      var mountImages = [];
      var index = 0;
      this._renderedChildren = children;
      for (var name in children) {
        var child = children[name];
        if (children.hasOwnProperty(name)) {
          // The rendered children must be turned into instances as they're
          // mounted.
          var childInstance = instantiateReactComponent(child, null);
          children[name] = childInstance;
          // Inlined for performance, see `ReactInstanceHandles.createReactID`.
          var rootID = this._rootNodeID + name;
          var mountImage = childInstance.mountComponent(
            rootID,
            transaction,
            this._mountDepth + 1
          );
          childInstance._mountIndex = index;
          mountImages.push(mountImage);
          index++;
        }
      }
      return mountImages;
    },

    /**
     * Replaces any rendered children with a text content string.
     *
     * @param {string} nextContent String of content.
     * @internal
     */
    updateTextContent: function(nextContent) {
      updateDepth++;
      var errorThrown = true;
      try {
        var prevChildren = this._renderedChildren;
        // Remove any rendered children.
        for (var name in prevChildren) {
          if (prevChildren.hasOwnProperty(name)) {
            this._unmountChildByName(prevChildren[name], name);
          }
        }
        // Set new text content.
        this.setTextContent(nextContent);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          errorThrown ? clearQueue() : processQueue();
        }
      }
    },

    /**
     * Updates the rendered children with new children.
     *
     * @param {?object} nextNestedChildren Nested child maps.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    updateChildren: function(nextNestedChildren, transaction) {
      updateDepth++;
      var errorThrown = true;
      try {
        this._updateChildren(nextNestedChildren, transaction);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          errorThrown ? clearQueue() : processQueue();
        }
      }
    },

    /**
     * Improve performance by isolating this hot code path from the try/catch
     * block in `updateChildren`.
     *
     * @param {?object} nextNestedChildren Nested child maps.
     * @param {ReactReconcileTransaction} transaction
     * @final
     * @protected
     */
    _updateChildren: function(nextNestedChildren, transaction) {
      var nextChildren = flattenChildren(nextNestedChildren);
      var prevChildren = this._renderedChildren;
      if (!nextChildren && !prevChildren) {
        return;
      }
      var name;
      // `nextIndex` will increment for each child in `nextChildren`, but
      // `lastIndex` will be the last index visited in `prevChildren`.
      var lastIndex = 0;
      var nextIndex = 0;
      for (name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }
        var prevChild = prevChildren && prevChildren[name];
        var prevElement = prevChild && prevChild._currentElement;
        var nextElement = nextChildren[name];
        if (shouldUpdateReactComponent(prevElement, nextElement)) {
          this.moveChild(prevChild, nextIndex, lastIndex);
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          prevChild.receiveComponent(nextElement, transaction);
          prevChild._mountIndex = nextIndex;
        } else {
          if (prevChild) {
            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
            this._unmountChildByName(prevChild, name);
          }
          // The child must be instantiated before it's mounted.
          var nextChildInstance = instantiateReactComponent(
            nextElement,
            null
          );
          this._mountChildByNameAtIndex(
            nextChildInstance, name, nextIndex, transaction
          );
        }
        nextIndex++;
      }
      // Remove children that are no longer present.
      for (name in prevChildren) {
        if (prevChildren.hasOwnProperty(name) &&
            !(nextChildren && nextChildren[name])) {
          this._unmountChildByName(prevChildren[name], name);
        }
      }
    },

    /**
     * Unmounts all rendered children. This should be used to clean up children
     * when this component is unmounted.
     *
     * @internal
     */
    unmountChildren: function() {
      var renderedChildren = this._renderedChildren;
      for (var name in renderedChildren) {
        var renderedChild = renderedChildren[name];
        // TODO: When is this not true?
        if (renderedChild.unmountComponent) {
          renderedChild.unmountComponent();
        }
      }
      this._renderedChildren = null;
    },

    /**
     * Moves a child component to the supplied index.
     *
     * @param {ReactComponent} child Component to move.
     * @param {number} toIndex Destination index of the element.
     * @param {number} lastIndex Last index visited of the siblings of `child`.
     * @protected
     */
    moveChild: function(child, toIndex, lastIndex) {
      // If the index of `child` is less than `lastIndex`, then it needs to
      // be moved. Otherwise, we do not need to move it because a child will be
      // inserted or moved before `child`.
      if (child._mountIndex < lastIndex) {
        enqueueMove(this._rootNodeID, child._mountIndex, toIndex);
      }
    },

    /**
     * Creates a child component.
     *
     * @param {ReactComponent} child Component to create.
     * @param {string} mountImage Markup to insert.
     * @protected
     */
    createChild: function(child, mountImage) {
      enqueueMarkup(this._rootNodeID, mountImage, child._mountIndex);
    },

    /**
     * Removes a child component.
     *
     * @param {ReactComponent} child Child to remove.
     * @protected
     */
    removeChild: function(child) {
      enqueueRemove(this._rootNodeID, child._mountIndex);
    },

    /**
     * Sets this text content string.
     *
     * @param {string} textContent Text content to set.
     * @protected
     */
    setTextContent: function(textContent) {
      enqueueTextContent(this._rootNodeID, textContent);
    },

    /**
     * Mounts a child with the supplied name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to mount.
     * @param {string} name Name of the child.
     * @param {number} index Index at which to insert the child.
     * @param {ReactReconcileTransaction} transaction
     * @private
     */
    _mountChildByNameAtIndex: function(child, name, index, transaction) {
      // Inlined for performance, see `ReactInstanceHandles.createReactID`.
      var rootID = this._rootNodeID + name;
      var mountImage = child.mountComponent(
        rootID,
        transaction,
        this._mountDepth + 1
      );
      child._mountIndex = index;
      this.createChild(child, mountImage);
      this._renderedChildren = this._renderedChildren || {};
      this._renderedChildren[name] = child;
    },

    /**
     * Unmounts a rendered child by name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to unmount.
     * @param {string} name Name of the child in `this._renderedChildren`.
     * @private
     */
    _unmountChildByName: function(child, name) {
      this.removeChild(child);
      child._mountIndex = null;
      child.unmountComponent();
      delete this._renderedChildren[name];
    }

  }

};

module.exports = ReactMultiChild;

},{"./ReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactComponent.js","./ReactMultiChildUpdateTypes":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMultiChildUpdateTypes.js","./flattenChildren":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\flattenChildren.js","./instantiateReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\instantiateReactComponent.js","./shouldUpdateReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\shouldUpdateReactComponent.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMultiChildUpdateTypes.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMultiChildUpdateTypes
 */

"use strict";

var keyMirror = require("./keyMirror");

/**
 * When a component's children are updated, a series of update configuration
 * objects are created in order to batch and serialize the required changes.
 *
 * Enumerates all the possible types of update configurations.
 *
 * @internal
 */
var ReactMultiChildUpdateTypes = keyMirror({
  INSERT_MARKUP: null,
  MOVE_EXISTING: null,
  REMOVE_NODE: null,
  TEXT_CONTENT: null
});

module.exports = ReactMultiChildUpdateTypes;

},{"./keyMirror":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyMirror.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactNativeComponent.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactNativeComponent
 */

"use strict";

var assign = require("./Object.assign");
var invariant = require("./invariant");

var genericComponentClass = null;
// This registry keeps track of wrapper classes around native tags
var tagToComponentClass = {};

var ReactNativeComponentInjection = {
  // This accepts a class that receives the tag string. This is a catch all
  // that can render any kind of tag.
  injectGenericComponentClass: function(componentClass) {
    genericComponentClass = componentClass;
  },
  // This accepts a keyed object with classes as values. Each key represents a
  // tag. That particular tag will use this class instead of the generic one.
  injectComponentClasses: function(componentClasses) {
    assign(tagToComponentClass, componentClasses);
  }
};

/**
 * Create an internal class for a specific tag.
 *
 * @param {string} tag The tag for which to create an internal instance.
 * @param {any} props The props passed to the instance constructor.
 * @return {ReactComponent} component The injected empty component.
 */
function createInstanceForTag(tag, props, parentType) {
  var componentClass = tagToComponentClass[tag];
  if (componentClass == null) {
    ("production" !== process.env.NODE_ENV ? invariant(
      genericComponentClass,
      'There is no registered component for the tag %s',
      tag
    ) : invariant(genericComponentClass));
    return new genericComponentClass(tag, props);
  }
  if (parentType === tag) {
    // Avoid recursion
    ("production" !== process.env.NODE_ENV ? invariant(
      genericComponentClass,
      'There is no registered component for the tag %s',
      tag
    ) : invariant(genericComponentClass));
    return new genericComponentClass(tag, props);
  }
  // Unwrap legacy factories
  return new componentClass.type(props);
}

var ReactNativeComponent = {
  createInstanceForTag: createInstanceForTag,
  injection: ReactNativeComponentInjection
};

module.exports = ReactNativeComponent;

}).call(this,require('_process'))
},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactOwner.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactOwner
 */

"use strict";

var emptyObject = require("./emptyObject");
var invariant = require("./invariant");

/**
 * ReactOwners are capable of storing references to owned components.
 *
 * All components are capable of //being// referenced by owner components, but
 * only ReactOwner components are capable of //referencing// owned components.
 * The named reference is known as a "ref".
 *
 * Refs are available when mounted and updated during reconciliation.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return (
 *         <div onClick={this.handleClick}>
 *           <CustomComponent ref="custom" />
 *         </div>
 *       );
 *     },
 *     handleClick: function() {
 *       this.refs.custom.handleClick();
 *     },
 *     componentDidMount: function() {
 *       this.refs.custom.initialize();
 *     }
 *   });
 *
 * Refs should rarely be used. When refs are used, they should only be done to
 * control data that is not handled by React's data flow.
 *
 * @class ReactOwner
 */
var ReactOwner = {

  /**
   * @param {?object} object
   * @return {boolean} True if `object` is a valid owner.
   * @final
   */
  isValidOwner: function(object) {
    return !!(
      object &&
      typeof object.attachRef === 'function' &&
      typeof object.detachRef === 'function'
    );
  },

  /**
   * Adds a component by ref to an owner component.
   *
   * @param {ReactComponent} component Component to reference.
   * @param {string} ref Name by which to refer to the component.
   * @param {ReactOwner} owner Component on which to record the ref.
   * @final
   * @internal
   */
  addComponentAsRefTo: function(component, ref, owner) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactOwner.isValidOwner(owner),
      'addComponentAsRefTo(...): Only a ReactOwner can have refs. This ' +
      'usually means that you\'re trying to add a ref to a component that ' +
      'doesn\'t have an owner (that is, was not created inside of another ' +
      'component\'s `render` method). Try rendering this component inside of ' +
      'a new top-level component which will hold the ref.'
    ) : invariant(ReactOwner.isValidOwner(owner)));
    owner.attachRef(ref, component);
  },

  /**
   * Removes a component by ref from an owner component.
   *
   * @param {ReactComponent} component Component to dereference.
   * @param {string} ref Name of the ref to remove.
   * @param {ReactOwner} owner Component on which the ref is recorded.
   * @final
   * @internal
   */
  removeComponentAsRefFrom: function(component, ref, owner) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactOwner.isValidOwner(owner),
      'removeComponentAsRefFrom(...): Only a ReactOwner can have refs. This ' +
      'usually means that you\'re trying to remove a ref to a component that ' +
      'doesn\'t have an owner (that is, was not created inside of another ' +
      'component\'s `render` method). Try rendering this component inside of ' +
      'a new top-level component which will hold the ref.'
    ) : invariant(ReactOwner.isValidOwner(owner)));
    // Check that `component` is still the current ref because we do not want to
    // detach the ref if another component stole it.
    if (owner.refs[ref] === component) {
      owner.detachRef(ref);
    }
  },

  /**
   * A ReactComponent must mix this in to have refs.
   *
   * @lends {ReactOwner.prototype}
   */
  Mixin: {

    construct: function() {
      this.refs = emptyObject;
    },

    /**
     * Lazily allocates the refs object and stores `component` as `ref`.
     *
     * @param {string} ref Reference name.
     * @param {component} component Component to store as `ref`.
     * @final
     * @private
     */
    attachRef: function(ref, component) {
      ("production" !== process.env.NODE_ENV ? invariant(
        component.isOwnedBy(this),
        'attachRef(%s, ...): Only a component\'s owner can store a ref to it.',
        ref
      ) : invariant(component.isOwnedBy(this)));
      var refs = this.refs === emptyObject ? (this.refs = {}) : this.refs;
      refs[ref] = component;
    },

    /**
     * Detaches a reference name.
     *
     * @param {string} ref Name to dereference.
     * @final
     * @private
     */
    detachRef: function(ref) {
      delete this.refs[ref];
    }

  }

};

module.exports = ReactOwner;

}).call(this,require('_process'))
},{"./emptyObject":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyObject.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPerf
 * @typechecks static-only
 */

"use strict";

/**
 * ReactPerf is a general AOP system designed to measure performance. This
 * module only has the hooks: see ReactDefaultPerf for the analysis tool.
 */
var ReactPerf = {
  /**
   * Boolean to enable/disable measurement. Set to false by default to prevent
   * accidental logging and perf loss.
   */
  enableMeasure: false,

  /**
   * Holds onto the measure function in use. By default, don't measure
   * anything, but we'll override this if we inject a measure function.
   */
  storedMeasure: _noMeasure,

  /**
   * Use this to wrap methods you want to measure. Zero overhead in production.
   *
   * @param {string} objName
   * @param {string} fnName
   * @param {function} func
   * @return {function}
   */
  measure: function(objName, fnName, func) {
    if ("production" !== process.env.NODE_ENV) {
      var measuredFunc = null;
      var wrapper = function() {
        if (ReactPerf.enableMeasure) {
          if (!measuredFunc) {
            measuredFunc = ReactPerf.storedMeasure(objName, fnName, func);
          }
          return measuredFunc.apply(this, arguments);
        }
        return func.apply(this, arguments);
      };
      wrapper.displayName = objName + '_' + fnName;
      return wrapper;
    }
    return func;
  },

  injection: {
    /**
     * @param {function} measure
     */
    injectMeasure: function(measure) {
      ReactPerf.storedMeasure = measure;
    }
  }
};

/**
 * Simply passes through the measured function, without measuring it.
 *
 * @param {string} objName
 * @param {string} fnName
 * @param {function} func
 * @return {function}
 */
function _noMeasure(objName, fnName, func) {
  return func;
}

module.exports = ReactPerf;

}).call(this,require('_process'))
},{"_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTransferer.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTransferer
 */

"use strict";

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");
var invariant = require("./invariant");
var joinClasses = require("./joinClasses");
var warning = require("./warning");

var didWarn = false;

/**
 * Creates a transfer strategy that will merge prop values using the supplied
 * `mergeStrategy`. If a prop was previously unset, this just sets it.
 *
 * @param {function} mergeStrategy
 * @return {function}
 */
function createTransferStrategy(mergeStrategy) {
  return function(props, key, value) {
    if (!props.hasOwnProperty(key)) {
      props[key] = value;
    } else {
      props[key] = mergeStrategy(props[key], value);
    }
  };
}

var transferStrategyMerge = createTransferStrategy(function(a, b) {
  // `merge` overrides the first object's (`props[key]` above) keys using the
  // second object's (`value`) keys. An object's style's existing `propA` would
  // get overridden. Flip the order here.
  return assign({}, b, a);
});

/**
 * Transfer strategies dictate how props are transferred by `transferPropsTo`.
 * NOTE: if you add any more exceptions to this list you should be sure to
 * update `cloneWithProps()` accordingly.
 */
var TransferStrategies = {
  /**
   * Never transfer `children`.
   */
  children: emptyFunction,
  /**
   * Transfer the `className` prop by merging them.
   */
  className: createTransferStrategy(joinClasses),
  /**
   * Transfer the `style` prop (which is an object) by merging them.
   */
  style: transferStrategyMerge
};

/**
 * Mutates the first argument by transferring the properties from the second
 * argument.
 *
 * @param {object} props
 * @param {object} newProps
 * @return {object}
 */
function transferInto(props, newProps) {
  for (var thisKey in newProps) {
    if (!newProps.hasOwnProperty(thisKey)) {
      continue;
    }

    var transferStrategy = TransferStrategies[thisKey];

    if (transferStrategy && TransferStrategies.hasOwnProperty(thisKey)) {
      transferStrategy(props, thisKey, newProps[thisKey]);
    } else if (!props.hasOwnProperty(thisKey)) {
      props[thisKey] = newProps[thisKey];
    }
  }
  return props;
}

/**
 * ReactPropTransferer are capable of transferring props to another component
 * using a `transferPropsTo` method.
 *
 * @class ReactPropTransferer
 */
var ReactPropTransferer = {

  TransferStrategies: TransferStrategies,

  /**
   * Merge two props objects using TransferStrategies.
   *
   * @param {object} oldProps original props (they take precedence)
   * @param {object} newProps new props to merge in
   * @return {object} a new object containing both sets of props merged.
   */
  mergeProps: function(oldProps, newProps) {
    return transferInto(assign({}, oldProps), newProps);
  },

  /**
   * @lends {ReactPropTransferer.prototype}
   */
  Mixin: {

    /**
     * Transfer props from this component to a target component.
     *
     * Props that do not have an explicit transfer strategy will be transferred
     * only if the target component does not already have the prop set.
     *
     * This is usually used to pass down props to a returned root component.
     *
     * @param {ReactElement} element Component receiving the properties.
     * @return {ReactElement} The supplied `component`.
     * @final
     * @protected
     */
    transferPropsTo: function(element) {
      ("production" !== process.env.NODE_ENV ? invariant(
        element._owner === this,
        '%s: You can\'t call transferPropsTo() on a component that you ' +
        'don\'t own, %s. This usually means you are calling ' +
        'transferPropsTo() on a component passed in as props or children.',
        this.constructor.displayName,
        typeof element.type === 'string' ?
        element.type :
        element.type.displayName
      ) : invariant(element._owner === this));

      if ("production" !== process.env.NODE_ENV) {
        if (!didWarn) {
          didWarn = true;
          ("production" !== process.env.NODE_ENV ? warning(
            false,
            'transferPropsTo is deprecated. ' +
            'See http://fb.me/react-transferpropsto for more information.'
          ) : null);
        }
      }

      // Because elements are immutable we have to merge into the existing
      // props object rather than clone it.
      transferInto(element.props, this.props);

      return element;
    }

  }
};

module.exports = ReactPropTransferer;

}).call(this,require('_process'))
},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./emptyFunction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./joinClasses":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\joinClasses.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTypeLocationNames.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocationNames
 */

"use strict";

var ReactPropTypeLocationNames = {};

if ("production" !== process.env.NODE_ENV) {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;

}).call(this,require('_process'))
},{"_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTypeLocations.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocations
 */

"use strict";

var keyMirror = require("./keyMirror");

var ReactPropTypeLocations = keyMirror({
  prop: null,
  context: null,
  childContext: null
});

module.exports = ReactPropTypeLocations;

},{"./keyMirror":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyMirror.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTypes.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypes
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");

var deprecated = require("./deprecated");
var emptyFunction = require("./emptyFunction");

/**
 * Collection of methods that allow declaration and validation of props that are
 * supplied to React components. Example usage:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyArticle = React.createClass({
 *     propTypes: {
 *       // An optional string prop named "description".
 *       description: Props.string,
 *
 *       // A required enum prop named "category".
 *       category: Props.oneOf(['News','Photos']).isRequired,
 *
 *       // A prop named "dialog" that requires an instance of Dialog.
 *       dialog: Props.instanceOf(Dialog).isRequired
 *     },
 *     render: function() { ... }
 *   });
 *
 * A more formal specification of how these methods are used:
 *
 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
 *   decl := ReactPropTypes.{type}(.isRequired)?
 *
 * Each and every declaration produces a function with the same signature. This
 * allows the creation of custom validation functions. For example:
 *
 *  var MyLink = React.createClass({
 *    propTypes: {
 *      // An optional string or URI prop named "href".
 *      href: function(props, propName, componentName) {
 *        var propValue = props[propName];
 *        if (propValue != null && typeof propValue !== 'string' &&
 *            !(propValue instanceof URI)) {
 *          return new Error(
 *            'Expected a string or an URI for ' + propName + ' in ' +
 *            componentName
 *          );
 *        }
 *      }
 *    },
 *    render: function() {...}
 *  });
 *
 * @internal
 */

var ANONYMOUS = '<<anonymous>>';

var elementTypeChecker = createElementTypeChecker();
var nodeTypeChecker = createNodeChecker();

var ReactPropTypes = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  element: elementTypeChecker,
  instanceOf: createInstanceTypeChecker,
  node: nodeTypeChecker,
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker,

  component: deprecated(
    'React.PropTypes',
    'component',
    'element',
    this,
    elementTypeChecker
  ),
  renderable: deprecated(
    'React.PropTypes',
    'renderable',
    'node',
    this,
    nodeTypeChecker
  )
};

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName, location) {
    componentName = componentName || ANONYMOUS;
    if (props[propName] == null) {
      var locationName = ReactPropTypeLocationNames[location];
      if (isRequired) {
        return new Error(
          ("Required " + locationName + " `" + propName + "` was not specified in ")+
          ("`" + componentName + "`.")
        );
      }
    } else {
      return validate(props, propName, componentName, location);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== expectedType) {
      var locationName = ReactPropTypeLocationNames[location];
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      var preciseType = getPreciseType(propValue);

      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type `" + preciseType + "` ") +
        ("supplied to `" + componentName + "`, expected `" + expectedType + "`.")
      );
    }
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(emptyFunction.thatReturns());
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    if (!Array.isArray(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type ") +
        ("`" + propType + "` supplied to `" + componentName + "`, expected an array.")
      );
    }
    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(propValue, i, componentName, location);
      if (error instanceof Error) {
        return error;
      }
    }
  }
  return createChainableTypeChecker(validate);
}

function createElementTypeChecker() {
  function validate(props, propName, componentName, location) {
    if (!ReactElement.isValidElement(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` supplied to ") +
        ("`" + componentName + "`, expected a ReactElement.")
      );
    }
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, componentName, location) {
    if (!(props[propName] instanceof expectedClass)) {
      var locationName = ReactPropTypeLocationNames[location];
      var expectedClassName = expectedClass.name || ANONYMOUS;
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` supplied to ") +
        ("`" + componentName + "`, expected instance of `" + expectedClassName + "`.")
      );
    }
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    for (var i = 0; i < expectedValues.length; i++) {
      if (propValue === expectedValues[i]) {
        return;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    var valuesString = JSON.stringify(expectedValues);
    return new Error(
      ("Invalid " + locationName + " `" + propName + "` of value `" + propValue + "` ") +
      ("supplied to `" + componentName + "`, expected one of " + valuesString + ".")
    );
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type ") +
        ("`" + propType + "` supplied to `" + componentName + "`, expected an object.")
      );
    }
    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(propValue, key, componentName, location);
        if (error instanceof Error) {
          return error;
        }
      }
    }
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  function validate(props, propName, componentName, location) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (checker(props, propName, componentName, location) == null) {
        return;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    return new Error(
      ("Invalid " + locationName + " `" + propName + "` supplied to ") +
      ("`" + componentName + "`.")
    );
  }
  return createChainableTypeChecker(validate);
}

function createNodeChecker() {
  function validate(props, propName, componentName, location) {
    if (!isNode(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` supplied to ") +
        ("`" + componentName + "`, expected a ReactNode.")
      );
    }
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type `" + propType + "` ") +
        ("supplied to `" + componentName + "`, expected `object`.")
      );
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(propValue, key, componentName, location);
      if (error) {
        return error;
      }
    }
  }
  return createChainableTypeChecker(validate, 'expected `object`');
}

function isNode(propValue) {
  switch(typeof propValue) {
    case 'number':
    case 'string':
      return true;
    case 'boolean':
      return !propValue;
    case 'object':
      if (Array.isArray(propValue)) {
        return propValue.every(isNode);
      }
      if (ReactElement.isValidElement(propValue)) {
        return true;
      }
      for (var k in propValue) {
        if (!isNode(propValue[k])) {
          return false;
        }
      }
      return true;
    default:
      return false;
  }
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

module.exports = ReactPropTypes;

},{"./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactPropTypeLocationNames":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPropTypeLocationNames.js","./deprecated":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\deprecated.js","./emptyFunction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPutListenerQueue.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPutListenerQueue
 */

"use strict";

var PooledClass = require("./PooledClass");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");

var assign = require("./Object.assign");

function ReactPutListenerQueue() {
  this.listenersToPut = [];
}

assign(ReactPutListenerQueue.prototype, {
  enqueuePutListener: function(rootNodeID, propKey, propValue) {
    this.listenersToPut.push({
      rootNodeID: rootNodeID,
      propKey: propKey,
      propValue: propValue
    });
  },

  putListeners: function() {
    for (var i = 0; i < this.listenersToPut.length; i++) {
      var listenerToPut = this.listenersToPut[i];
      ReactBrowserEventEmitter.putListener(
        listenerToPut.rootNodeID,
        listenerToPut.propKey,
        listenerToPut.propValue
      );
    }
  },

  reset: function() {
    this.listenersToPut.length = 0;
  },

  destructor: function() {
    this.reset();
  }
});

PooledClass.addPoolingTo(ReactPutListenerQueue);

module.exports = ReactPutListenerQueue;

},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./PooledClass":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\PooledClass.js","./ReactBrowserEventEmitter":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserEventEmitter.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactReconcileTransaction.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactReconcileTransaction
 * @typechecks static-only
 */

"use strict";

var CallbackQueue = require("./CallbackQueue");
var PooledClass = require("./PooledClass");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactInputSelection = require("./ReactInputSelection");
var ReactPutListenerQueue = require("./ReactPutListenerQueue");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");

/**
 * Ensures that, when possible, the selection range (currently selected text
 * input) is not disturbed by performing the transaction.
 */
var SELECTION_RESTORATION = {
  /**
   * @return {Selection} Selection information.
   */
  initialize: ReactInputSelection.getSelectionInformation,
  /**
   * @param {Selection} sel Selection information returned from `initialize`.
   */
  close: ReactInputSelection.restoreSelection
};

/**
 * Suppresses events (blur/focus) that could be inadvertently dispatched due to
 * high level DOM manipulations (like temporarily removing a text input from the
 * DOM).
 */
var EVENT_SUPPRESSION = {
  /**
   * @return {boolean} The enabled status of `ReactBrowserEventEmitter` before
   * the reconciliation.
   */
  initialize: function() {
    var currentlyEnabled = ReactBrowserEventEmitter.isEnabled();
    ReactBrowserEventEmitter.setEnabled(false);
    return currentlyEnabled;
  },

  /**
   * @param {boolean} previouslyEnabled Enabled status of
   *   `ReactBrowserEventEmitter` before the reconciliation occured. `close`
   *   restores the previous value.
   */
  close: function(previouslyEnabled) {
    ReactBrowserEventEmitter.setEnabled(previouslyEnabled);
  }
};

/**
 * Provides a queue for collecting `componentDidMount` and
 * `componentDidUpdate` callbacks during the the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function() {
    this.reactMountReady.reset();
  },

  /**
   * After DOM is flushed, invoke all registered `onDOMReady` callbacks.
   */
  close: function() {
    this.reactMountReady.notifyAll();
  }
};

var PUT_LISTENER_QUEUEING = {
  initialize: function() {
    this.putListenerQueue.reset();
  },

  close: function() {
    this.putListenerQueue.putListeners();
  }
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [
  PUT_LISTENER_QUEUEING,
  SELECTION_RESTORATION,
  EVENT_SUPPRESSION,
  ON_DOM_READY_QUEUEING
];

/**
 * Currently:
 * - The order that these are listed in the transaction is critical:
 * - Suppresses events.
 * - Restores selection range.
 *
 * Future:
 * - Restore document/overflow scroll positions that were unintentionally
 *   modified via DOM insertions above the top viewport boundary.
 * - Implement/integrate with customized constraint based layout system and keep
 *   track of which dimensions must be remeasured.
 *
 * @class ReactReconcileTransaction
 */
function ReactReconcileTransaction() {
  this.reinitializeTransaction();
  // Only server-side rendering really needs this option (see
  // `ReactServerRendering`), but server-side uses
  // `ReactServerRenderingTransaction` instead. This option is here so that it's
  // accessible and defaults to false when `ReactDOMComponent` and
  // `ReactTextComponent` checks it in `mountComponent`.`
  this.renderToStaticMarkup = false;
  this.reactMountReady = CallbackQueue.getPooled(null);
  this.putListenerQueue = ReactPutListenerQueue.getPooled();
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array<object>} List of operation wrap proceedures.
   *   TODO: convert to array<TransactionWrapper>
   */
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function() {
    return this.reactMountReady;
  },

  getPutListenerQueue: function() {
    return this.putListenerQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be resused.
   */
  destructor: function() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;

    ReactPutListenerQueue.release(this.putListenerQueue);
    this.putListenerQueue = null;
  }
};


assign(ReactReconcileTransaction.prototype, Transaction.Mixin, Mixin);

PooledClass.addPoolingTo(ReactReconcileTransaction);

module.exports = ReactReconcileTransaction;

},{"./CallbackQueue":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CallbackQueue.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./PooledClass":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\PooledClass.js","./ReactBrowserEventEmitter":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactBrowserEventEmitter.js","./ReactInputSelection":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInputSelection.js","./ReactPutListenerQueue":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPutListenerQueue.js","./Transaction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Transaction.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactRootIndex.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRootIndex
 * @typechecks
 */

"use strict";

var ReactRootIndexInjection = {
  /**
   * @param {function} _createReactRootIndex
   */
  injectCreateReactRootIndex: function(_createReactRootIndex) {
    ReactRootIndex.createReactRootIndex = _createReactRootIndex;
  }
};

var ReactRootIndex = {
  createReactRootIndex: null,
  injection: ReactRootIndexInjection
};

module.exports = ReactRootIndex;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactServerRendering.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks static-only
 * @providesModule ReactServerRendering
 */
"use strict";

var ReactElement = require("./ReactElement");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMarkupChecksum = require("./ReactMarkupChecksum");
var ReactServerRenderingTransaction =
  require("./ReactServerRenderingTransaction");

var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");

/**
 * @param {ReactElement} element
 * @return {string} the HTML markup
 */
function renderToString(element) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactElement.isValidElement(element),
    'renderToString(): You must pass a valid ReactElement.'
  ) : invariant(ReactElement.isValidElement(element)));

  var transaction;
  try {
    var id = ReactInstanceHandles.createReactRootID();
    transaction = ReactServerRenderingTransaction.getPooled(false);

    return transaction.perform(function() {
      var componentInstance = instantiateReactComponent(element, null);
      var markup = componentInstance.mountComponent(id, transaction, 0);
      return ReactMarkupChecksum.addChecksumToMarkup(markup);
    }, null);
  } finally {
    ReactServerRenderingTransaction.release(transaction);
  }
}

/**
 * @param {ReactElement} element
 * @return {string} the HTML markup, without the extra React ID and checksum
 * (for generating static pages)
 */
function renderToStaticMarkup(element) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactElement.isValidElement(element),
    'renderToStaticMarkup(): You must pass a valid ReactElement.'
  ) : invariant(ReactElement.isValidElement(element)));

  var transaction;
  try {
    var id = ReactInstanceHandles.createReactRootID();
    transaction = ReactServerRenderingTransaction.getPooled(true);

    return transaction.perform(function() {
      var componentInstance = instantiateReactComponent(element, null);
      return componentInstance.mountComponent(id, transaction, 0);
    }, null);
  } finally {
    ReactServerRenderingTransaction.release(transaction);
  }
}

module.exports = {
  renderToString: renderToString,
  renderToStaticMarkup: renderToStaticMarkup
};

}).call(this,require('_process'))
},{"./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactInstanceHandles":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInstanceHandles.js","./ReactMarkupChecksum":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactMarkupChecksum.js","./ReactServerRenderingTransaction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactServerRenderingTransaction.js","./instantiateReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\instantiateReactComponent.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactServerRenderingTransaction.js":[function(require,module,exports){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactServerRenderingTransaction
 * @typechecks
 */

"use strict";

var PooledClass = require("./PooledClass");
var CallbackQueue = require("./CallbackQueue");
var ReactPutListenerQueue = require("./ReactPutListenerQueue");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");

/**
 * Provides a `CallbackQueue` queue for collecting `onDOMReady` callbacks
 * during the performing of the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function() {
    this.reactMountReady.reset();
  },

  close: emptyFunction
};

var PUT_LISTENER_QUEUEING = {
  initialize: function() {
    this.putListenerQueue.reset();
  },

  close: emptyFunction
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [
  PUT_LISTENER_QUEUEING,
  ON_DOM_READY_QUEUEING
];

/**
 * @class ReactServerRenderingTransaction
 * @param {boolean} renderToStaticMarkup
 */
function ReactServerRenderingTransaction(renderToStaticMarkup) {
  this.reinitializeTransaction();
  this.renderToStaticMarkup = renderToStaticMarkup;
  this.reactMountReady = CallbackQueue.getPooled(null);
  this.putListenerQueue = ReactPutListenerQueue.getPooled();
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array} Empty list of operation wrap proceedures.
   */
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function() {
    return this.reactMountReady;
  },

  getPutListenerQueue: function() {
    return this.putListenerQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be resused.
   */
  destructor: function() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;

    ReactPutListenerQueue.release(this.putListenerQueue);
    this.putListenerQueue = null;
  }
};


assign(
  ReactServerRenderingTransaction.prototype,
  Transaction.Mixin,
  Mixin
);

PooledClass.addPoolingTo(ReactServerRenderingTransaction);

module.exports = ReactServerRenderingTransaction;

},{"./CallbackQueue":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CallbackQueue.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./PooledClass":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\PooledClass.js","./ReactPutListenerQueue":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPutListenerQueue.js","./Transaction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Transaction.js","./emptyFunction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactTextComponent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactTextComponent
 * @typechecks static-only
 */

"use strict";

var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactComponent = require("./ReactComponent");
var ReactElement = require("./ReactElement");

var assign = require("./Object.assign");
var escapeTextForBrowser = require("./escapeTextForBrowser");

/**
 * Text nodes violate a couple assumptions that React makes about components:
 *
 *  - When mounting text into the DOM, adjacent text nodes are merged.
 *  - Text nodes cannot be assigned a React root ID.
 *
 * This component is used to wrap strings in elements so that they can undergo
 * the same reconciliation that is applied to elements.
 *
 * TODO: Investigate representing React components in the DOM with text nodes.
 *
 * @class ReactTextComponent
 * @extends ReactComponent
 * @internal
 */
var ReactTextComponent = function(props) {
  // This constructor and it's argument is currently used by mocks.
};

assign(ReactTextComponent.prototype, ReactComponent.Mixin, {

  /**
   * Creates the markup for this text node. This node is not intended to have
   * any features besides containing text content.
   *
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {number} mountDepth number of components in the owner hierarchy
   * @return {string} Markup for this text node.
   * @internal
   */
  mountComponent: function(rootID, transaction, mountDepth) {
    ReactComponent.Mixin.mountComponent.call(
      this,
      rootID,
      transaction,
      mountDepth
    );

    var escapedText = escapeTextForBrowser(this.props);

    if (transaction.renderToStaticMarkup) {
      // Normally we'd wrap this in a `span` for the reasons stated above, but
      // since this is a situation where React won't take over (static pages),
      // we can simply return the text as it is.
      return escapedText;
    }

    return (
      '<span ' + DOMPropertyOperations.createMarkupForID(rootID) + '>' +
        escapedText +
      '</span>'
    );
  },

  /**
   * Updates this component by updating the text content.
   *
   * @param {object} nextComponent Contains the next text content.
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  receiveComponent: function(nextComponent, transaction) {
    var nextProps = nextComponent.props;
    if (nextProps !== this.props) {
      this.props = nextProps;
      ReactComponent.BackendIDOperations.updateTextContentByID(
        this._rootNodeID,
        nextProps
      );
    }
  }

});

var ReactTextComponentFactory = function(text) {
  // Bypass validation and configuration
  return new ReactElement(ReactTextComponent, null, null, null, null, text);
};

ReactTextComponentFactory.type = ReactTextComponent;

module.exports = ReactTextComponentFactory;

},{"./DOMPropertyOperations":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMPropertyOperations.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./ReactComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactComponent.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./escapeTextForBrowser":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\escapeTextForBrowser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactUpdates.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactUpdates
 */

"use strict";

var CallbackQueue = require("./CallbackQueue");
var PooledClass = require("./PooledClass");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactPerf = require("./ReactPerf");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");
var invariant = require("./invariant");
var warning = require("./warning");

var dirtyComponents = [];
var asapCallbackQueue = CallbackQueue.getPooled();
var asapEnqueued = false;

var batchingStrategy = null;

function ensureInjected() {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactUpdates.ReactReconcileTransaction && batchingStrategy,
    'ReactUpdates: must inject a reconcile transaction class and batching ' +
    'strategy'
  ) : invariant(ReactUpdates.ReactReconcileTransaction && batchingStrategy));
}

var NESTED_UPDATES = {
  initialize: function() {
    this.dirtyComponentsLength = dirtyComponents.length;
  },
  close: function() {
    if (this.dirtyComponentsLength !== dirtyComponents.length) {
      // Additional updates were enqueued by componentDidUpdate handlers or
      // similar; before our own UPDATE_QUEUEING wrapper closes, we want to run
      // these new updates so that if A's componentDidUpdate calls setState on
      // B, B will update before the callback A's updater provided when calling
      // setState.
      dirtyComponents.splice(0, this.dirtyComponentsLength);
      flushBatchedUpdates();
    } else {
      dirtyComponents.length = 0;
    }
  }
};

var UPDATE_QUEUEING = {
  initialize: function() {
    this.callbackQueue.reset();
  },
  close: function() {
    this.callbackQueue.notifyAll();
  }
};

var TRANSACTION_WRAPPERS = [NESTED_UPDATES, UPDATE_QUEUEING];

function ReactUpdatesFlushTransaction() {
  this.reinitializeTransaction();
  this.dirtyComponentsLength = null;
  this.callbackQueue = CallbackQueue.getPooled();
  this.reconcileTransaction =
    ReactUpdates.ReactReconcileTransaction.getPooled();
}

assign(
  ReactUpdatesFlushTransaction.prototype,
  Transaction.Mixin, {
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  destructor: function() {
    this.dirtyComponentsLength = null;
    CallbackQueue.release(this.callbackQueue);
    this.callbackQueue = null;
    ReactUpdates.ReactReconcileTransaction.release(this.reconcileTransaction);
    this.reconcileTransaction = null;
  },

  perform: function(method, scope, a) {
    // Essentially calls `this.reconcileTransaction.perform(method, scope, a)`
    // with this transaction's wrappers around it.
    return Transaction.Mixin.perform.call(
      this,
      this.reconcileTransaction.perform,
      this.reconcileTransaction,
      method,
      scope,
      a
    );
  }
});

PooledClass.addPoolingTo(ReactUpdatesFlushTransaction);

function batchedUpdates(callback, a, b) {
  ensureInjected();
  batchingStrategy.batchedUpdates(callback, a, b);
}

/**
 * Array comparator for ReactComponents by owner depth
 *
 * @param {ReactComponent} c1 first component you're comparing
 * @param {ReactComponent} c2 second component you're comparing
 * @return {number} Return value usable by Array.prototype.sort().
 */
function mountDepthComparator(c1, c2) {
  return c1._mountDepth - c2._mountDepth;
}

function runBatchedUpdates(transaction) {
  var len = transaction.dirtyComponentsLength;
  ("production" !== process.env.NODE_ENV ? invariant(
    len === dirtyComponents.length,
    'Expected flush transaction\'s stored dirty-components length (%s) to ' +
    'match dirty-components array length (%s).',
    len,
    dirtyComponents.length
  ) : invariant(len === dirtyComponents.length));

  // Since reconciling a component higher in the owner hierarchy usually (not
  // always -- see shouldComponentUpdate()) will reconcile children, reconcile
  // them before their children by sorting the array.
  dirtyComponents.sort(mountDepthComparator);

  for (var i = 0; i < len; i++) {
    // If a component is unmounted before pending changes apply, ignore them
    // TODO: Queue unmounts in the same list to avoid this happening at all
    var component = dirtyComponents[i];
    if (component.isMounted()) {
      // If performUpdateIfNecessary happens to enqueue any new updates, we
      // shouldn't execute the callbacks until the next render happens, so
      // stash the callbacks first
      var callbacks = component._pendingCallbacks;
      component._pendingCallbacks = null;
      component.performUpdateIfNecessary(transaction.reconcileTransaction);

      if (callbacks) {
        for (var j = 0; j < callbacks.length; j++) {
          transaction.callbackQueue.enqueue(
            callbacks[j],
            component
          );
        }
      }
    }
  }
}

var flushBatchedUpdates = ReactPerf.measure(
  'ReactUpdates',
  'flushBatchedUpdates',
  function() {
    // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
    // array and perform any updates enqueued by mount-ready handlers (i.e.,
    // componentDidUpdate) but we need to check here too in order to catch
    // updates enqueued by setState callbacks and asap calls.
    while (dirtyComponents.length || asapEnqueued) {
      if (dirtyComponents.length) {
        var transaction = ReactUpdatesFlushTransaction.getPooled();
        transaction.perform(runBatchedUpdates, null, transaction);
        ReactUpdatesFlushTransaction.release(transaction);
      }

      if (asapEnqueued) {
        asapEnqueued = false;
        var queue = asapCallbackQueue;
        asapCallbackQueue = CallbackQueue.getPooled();
        queue.notifyAll();
        CallbackQueue.release(queue);
      }
    }
  }
);

/**
 * Mark a component as needing a rerender, adding an optional callback to a
 * list of functions which will be executed once the rerender occurs.
 */
function enqueueUpdate(component, callback) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !callback || typeof callback === "function",
    'enqueueUpdate(...): You called `setProps`, `replaceProps`, ' +
    '`setState`, `replaceState`, or `forceUpdate` with a callback that ' +
    'isn\'t callable.'
  ) : invariant(!callback || typeof callback === "function"));
  ensureInjected();

  // Various parts of our code (such as ReactCompositeComponent's
  // _renderValidatedComponent) assume that calls to render aren't nested;
  // verify that that's the case. (This is called by each top-level update
  // function, like setProps, setState, forceUpdate, etc.; creation and
  // destruction of top-level components is guarded in ReactMount.)
  ("production" !== process.env.NODE_ENV ? warning(
    ReactCurrentOwner.current == null,
    'enqueueUpdate(): Render methods should be a pure function of props ' +
    'and state; triggering nested component updates from render is not ' +
    'allowed. If necessary, trigger nested updates in ' +
    'componentDidUpdate.'
  ) : null);

  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component, callback);
    return;
  }

  dirtyComponents.push(component);

  if (callback) {
    if (component._pendingCallbacks) {
      component._pendingCallbacks.push(callback);
    } else {
      component._pendingCallbacks = [callback];
    }
  }
}

/**
 * Enqueue a callback to be run at the end of the current batching cycle. Throws
 * if no updates are currently being performed.
 */
function asap(callback, context) {
  ("production" !== process.env.NODE_ENV ? invariant(
    batchingStrategy.isBatchingUpdates,
    'ReactUpdates.asap: Can\'t enqueue an asap callback in a context where' +
    'updates are not being batched.'
  ) : invariant(batchingStrategy.isBatchingUpdates));
  asapCallbackQueue.enqueue(callback, context);
  asapEnqueued = true;
}

var ReactUpdatesInjection = {
  injectReconcileTransaction: function(ReconcileTransaction) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReconcileTransaction,
      'ReactUpdates: must provide a reconcile transaction class'
    ) : invariant(ReconcileTransaction));
    ReactUpdates.ReactReconcileTransaction = ReconcileTransaction;
  },

  injectBatchingStrategy: function(_batchingStrategy) {
    ("production" !== process.env.NODE_ENV ? invariant(
      _batchingStrategy,
      'ReactUpdates: must provide a batching strategy'
    ) : invariant(_batchingStrategy));
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof _batchingStrategy.batchedUpdates === 'function',
      'ReactUpdates: must provide a batchedUpdates() function'
    ) : invariant(typeof _batchingStrategy.batchedUpdates === 'function'));
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof _batchingStrategy.isBatchingUpdates === 'boolean',
      'ReactUpdates: must provide an isBatchingUpdates boolean attribute'
    ) : invariant(typeof _batchingStrategy.isBatchingUpdates === 'boolean'));
    batchingStrategy = _batchingStrategy;
  }
};

var ReactUpdates = {
  /**
   * React references `ReactReconcileTransaction` using this property in order
   * to allow dependency injection.
   *
   * @internal
   */
  ReactReconcileTransaction: null,

  batchedUpdates: batchedUpdates,
  enqueueUpdate: enqueueUpdate,
  flushBatchedUpdates: flushBatchedUpdates,
  injection: ReactUpdatesInjection,
  asap: asap
};

module.exports = ReactUpdates;

}).call(this,require('_process'))
},{"./CallbackQueue":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CallbackQueue.js","./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./PooledClass":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\PooledClass.js","./ReactCurrentOwner":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCurrentOwner.js","./ReactPerf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactPerf.js","./Transaction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Transaction.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SVGDOMPropertyConfig.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SVGDOMPropertyConfig
 */

/*jslint bitwise: true*/

"use strict";

var DOMProperty = require("./DOMProperty");

var MUST_USE_ATTRIBUTE = DOMProperty.injection.MUST_USE_ATTRIBUTE;

var SVGDOMPropertyConfig = {
  Properties: {
    cx: MUST_USE_ATTRIBUTE,
    cy: MUST_USE_ATTRIBUTE,
    d: MUST_USE_ATTRIBUTE,
    dx: MUST_USE_ATTRIBUTE,
    dy: MUST_USE_ATTRIBUTE,
    fill: MUST_USE_ATTRIBUTE,
    fillOpacity: MUST_USE_ATTRIBUTE,
    fontFamily: MUST_USE_ATTRIBUTE,
    fontSize: MUST_USE_ATTRIBUTE,
    fx: MUST_USE_ATTRIBUTE,
    fy: MUST_USE_ATTRIBUTE,
    gradientTransform: MUST_USE_ATTRIBUTE,
    gradientUnits: MUST_USE_ATTRIBUTE,
    markerEnd: MUST_USE_ATTRIBUTE,
    markerMid: MUST_USE_ATTRIBUTE,
    markerStart: MUST_USE_ATTRIBUTE,
    offset: MUST_USE_ATTRIBUTE,
    opacity: MUST_USE_ATTRIBUTE,
    patternContentUnits: MUST_USE_ATTRIBUTE,
    patternUnits: MUST_USE_ATTRIBUTE,
    points: MUST_USE_ATTRIBUTE,
    preserveAspectRatio: MUST_USE_ATTRIBUTE,
    r: MUST_USE_ATTRIBUTE,
    rx: MUST_USE_ATTRIBUTE,
    ry: MUST_USE_ATTRIBUTE,
    spreadMethod: MUST_USE_ATTRIBUTE,
    stopColor: MUST_USE_ATTRIBUTE,
    stopOpacity: MUST_USE_ATTRIBUTE,
    stroke: MUST_USE_ATTRIBUTE,
    strokeDasharray: MUST_USE_ATTRIBUTE,
    strokeLinecap: MUST_USE_ATTRIBUTE,
    strokeOpacity: MUST_USE_ATTRIBUTE,
    strokeWidth: MUST_USE_ATTRIBUTE,
    textAnchor: MUST_USE_ATTRIBUTE,
    transform: MUST_USE_ATTRIBUTE,
    version: MUST_USE_ATTRIBUTE,
    viewBox: MUST_USE_ATTRIBUTE,
    x1: MUST_USE_ATTRIBUTE,
    x2: MUST_USE_ATTRIBUTE,
    x: MUST_USE_ATTRIBUTE,
    y1: MUST_USE_ATTRIBUTE,
    y2: MUST_USE_ATTRIBUTE,
    y: MUST_USE_ATTRIBUTE
  },
  DOMAttributeNames: {
    fillOpacity: 'fill-opacity',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    gradientTransform: 'gradientTransform',
    gradientUnits: 'gradientUnits',
    markerEnd: 'marker-end',
    markerMid: 'marker-mid',
    markerStart: 'marker-start',
    patternContentUnits: 'patternContentUnits',
    patternUnits: 'patternUnits',
    preserveAspectRatio: 'preserveAspectRatio',
    spreadMethod: 'spreadMethod',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strokeDasharray: 'stroke-dasharray',
    strokeLinecap: 'stroke-linecap',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    textAnchor: 'text-anchor',
    viewBox: 'viewBox'
  }
};

module.exports = SVGDOMPropertyConfig;

},{"./DOMProperty":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\DOMProperty.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SelectEventPlugin.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SelectEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ReactInputSelection = require("./ReactInputSelection");
var SyntheticEvent = require("./SyntheticEvent");

var getActiveElement = require("./getActiveElement");
var isTextInputElement = require("./isTextInputElement");
var keyOf = require("./keyOf");
var shallowEqual = require("./shallowEqual");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  select: {
    phasedRegistrationNames: {
      bubbled: keyOf({onSelect: null}),
      captured: keyOf({onSelectCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topContextMenu,
      topLevelTypes.topFocus,
      topLevelTypes.topKeyDown,
      topLevelTypes.topMouseDown,
      topLevelTypes.topMouseUp,
      topLevelTypes.topSelectionChange
    ]
  }
};

var activeElement = null;
var activeElementID = null;
var lastSelection = null;
var mouseDown = false;

/**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @param {object}
 */
function getSelection(node) {
  if ('selectionStart' in node &&
      ReactInputSelection.hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else if (window.getSelection) {
    var selection = window.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  } else if (document.selection) {
    var range = document.selection.createRange();
    return {
      parentElement: range.parentElement(),
      text: range.text,
      top: range.boundingTop,
      left: range.boundingLeft
    };
  }
}

/**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @return {?SyntheticEvent}
 */
function constructSelectEvent(nativeEvent) {
  // Ensure we have the right element, and that the user is not dragging a
  // selection (this matches native `select` event behavior). In HTML5, select
  // fires only on input and textarea thus if there's no focused element we
  // won't dispatch.
  if (mouseDown ||
      activeElement == null ||
      activeElement != getActiveElement()) {
    return;
  }

  // Only fire when selection has actually changed.
  var currentSelection = getSelection(activeElement);
  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;

    var syntheticEvent = SyntheticEvent.getPooled(
      eventTypes.select,
      activeElementID,
      nativeEvent
    );

    syntheticEvent.type = 'select';
    syntheticEvent.target = activeElement;

    EventPropagators.accumulateTwoPhaseDispatches(syntheticEvent);

    return syntheticEvent;
  }
}

/**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */
var SelectEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    switch (topLevelType) {
      // Track the input node that has focus.
      case topLevelTypes.topFocus:
        if (isTextInputElement(topLevelTarget) ||
            topLevelTarget.contentEditable === 'true') {
          activeElement = topLevelTarget;
          activeElementID = topLevelTargetID;
          lastSelection = null;
        }
        break;
      case topLevelTypes.topBlur:
        activeElement = null;
        activeElementID = null;
        lastSelection = null;
        break;

      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.
      case topLevelTypes.topMouseDown:
        mouseDown = true;
        break;
      case topLevelTypes.topContextMenu:
      case topLevelTypes.topMouseUp:
        mouseDown = false;
        return constructSelectEvent(nativeEvent);

      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't).
      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry. The selection changes after keydown and before
      // keyup, but we check on keydown as well in the case of holding down a
      // key, when multiple keydown events are fired but only one keyup is.
      case topLevelTypes.topSelectionChange:
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyUp:
        return constructSelectEvent(nativeEvent);
    }
  }
};

module.exports = SelectEventPlugin;

},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./EventPropagators":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPropagators.js","./ReactInputSelection":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInputSelection.js","./SyntheticEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticEvent.js","./getActiveElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getActiveElement.js","./isTextInputElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isTextInputElement.js","./keyOf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js","./shallowEqual":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\shallowEqual.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ServerReactRootIndex.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ServerReactRootIndex
 * @typechecks
 */

"use strict";

/**
 * Size of the reactRoot ID space. We generate random numbers for React root
 * IDs and if there's a collision the events and DOM update system will
 * get confused. In the future we need a way to generate GUIDs but for
 * now this will work on a smaller scale.
 */
var GLOBAL_MOUNT_POINT_MAX = Math.pow(2, 53);

var ServerReactRootIndex = {
  createReactRootIndex: function() {
    return Math.ceil(Math.random() * GLOBAL_MOUNT_POINT_MAX);
  }
};

module.exports = ServerReactRootIndex;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SimpleEventPlugin.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SimpleEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginUtils = require("./EventPluginUtils");
var EventPropagators = require("./EventPropagators");
var SyntheticClipboardEvent = require("./SyntheticClipboardEvent");
var SyntheticEvent = require("./SyntheticEvent");
var SyntheticFocusEvent = require("./SyntheticFocusEvent");
var SyntheticKeyboardEvent = require("./SyntheticKeyboardEvent");
var SyntheticMouseEvent = require("./SyntheticMouseEvent");
var SyntheticDragEvent = require("./SyntheticDragEvent");
var SyntheticTouchEvent = require("./SyntheticTouchEvent");
var SyntheticUIEvent = require("./SyntheticUIEvent");
var SyntheticWheelEvent = require("./SyntheticWheelEvent");

var getEventCharCode = require("./getEventCharCode");

var invariant = require("./invariant");
var keyOf = require("./keyOf");
var warning = require("./warning");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  blur: {
    phasedRegistrationNames: {
      bubbled: keyOf({onBlur: true}),
      captured: keyOf({onBlurCapture: true})
    }
  },
  click: {
    phasedRegistrationNames: {
      bubbled: keyOf({onClick: true}),
      captured: keyOf({onClickCapture: true})
    }
  },
  contextMenu: {
    phasedRegistrationNames: {
      bubbled: keyOf({onContextMenu: true}),
      captured: keyOf({onContextMenuCapture: true})
    }
  },
  copy: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCopy: true}),
      captured: keyOf({onCopyCapture: true})
    }
  },
  cut: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCut: true}),
      captured: keyOf({onCutCapture: true})
    }
  },
  doubleClick: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDoubleClick: true}),
      captured: keyOf({onDoubleClickCapture: true})
    }
  },
  drag: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrag: true}),
      captured: keyOf({onDragCapture: true})
    }
  },
  dragEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnd: true}),
      captured: keyOf({onDragEndCapture: true})
    }
  },
  dragEnter: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnter: true}),
      captured: keyOf({onDragEnterCapture: true})
    }
  },
  dragExit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragExit: true}),
      captured: keyOf({onDragExitCapture: true})
    }
  },
  dragLeave: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragLeave: true}),
      captured: keyOf({onDragLeaveCapture: true})
    }
  },
  dragOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragOver: true}),
      captured: keyOf({onDragOverCapture: true})
    }
  },
  dragStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragStart: true}),
      captured: keyOf({onDragStartCapture: true})
    }
  },
  drop: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrop: true}),
      captured: keyOf({onDropCapture: true})
    }
  },
  focus: {
    phasedRegistrationNames: {
      bubbled: keyOf({onFocus: true}),
      captured: keyOf({onFocusCapture: true})
    }
  },
  input: {
    phasedRegistrationNames: {
      bubbled: keyOf({onInput: true}),
      captured: keyOf({onInputCapture: true})
    }
  },
  keyDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyDown: true}),
      captured: keyOf({onKeyDownCapture: true})
    }
  },
  keyPress: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyPress: true}),
      captured: keyOf({onKeyPressCapture: true})
    }
  },
  keyUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyUp: true}),
      captured: keyOf({onKeyUpCapture: true})
    }
  },
  load: {
    phasedRegistrationNames: {
      bubbled: keyOf({onLoad: true}),
      captured: keyOf({onLoadCapture: true})
    }
  },
  error: {
    phasedRegistrationNames: {
      bubbled: keyOf({onError: true}),
      captured: keyOf({onErrorCapture: true})
    }
  },
  // Note: We do not allow listening to mouseOver events. Instead, use the
  // onMouseEnter/onMouseLeave created by `EnterLeaveEventPlugin`.
  mouseDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseDown: true}),
      captured: keyOf({onMouseDownCapture: true})
    }
  },
  mouseMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseMove: true}),
      captured: keyOf({onMouseMoveCapture: true})
    }
  },
  mouseOut: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseOut: true}),
      captured: keyOf({onMouseOutCapture: true})
    }
  },
  mouseOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseOver: true}),
      captured: keyOf({onMouseOverCapture: true})
    }
  },
  mouseUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseUp: true}),
      captured: keyOf({onMouseUpCapture: true})
    }
  },
  paste: {
    phasedRegistrationNames: {
      bubbled: keyOf({onPaste: true}),
      captured: keyOf({onPasteCapture: true})
    }
  },
  reset: {
    phasedRegistrationNames: {
      bubbled: keyOf({onReset: true}),
      captured: keyOf({onResetCapture: true})
    }
  },
  scroll: {
    phasedRegistrationNames: {
      bubbled: keyOf({onScroll: true}),
      captured: keyOf({onScrollCapture: true})
    }
  },
  submit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onSubmit: true}),
      captured: keyOf({onSubmitCapture: true})
    }
  },
  touchCancel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchCancel: true}),
      captured: keyOf({onTouchCancelCapture: true})
    }
  },
  touchEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchEnd: true}),
      captured: keyOf({onTouchEndCapture: true})
    }
  },
  touchMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchMove: true}),
      captured: keyOf({onTouchMoveCapture: true})
    }
  },
  touchStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchStart: true}),
      captured: keyOf({onTouchStartCapture: true})
    }
  },
  wheel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onWheel: true}),
      captured: keyOf({onWheelCapture: true})
    }
  }
};

var topLevelEventsToDispatchConfig = {
  topBlur:        eventTypes.blur,
  topClick:       eventTypes.click,
  topContextMenu: eventTypes.contextMenu,
  topCopy:        eventTypes.copy,
  topCut:         eventTypes.cut,
  topDoubleClick: eventTypes.doubleClick,
  topDrag:        eventTypes.drag,
  topDragEnd:     eventTypes.dragEnd,
  topDragEnter:   eventTypes.dragEnter,
  topDragExit:    eventTypes.dragExit,
  topDragLeave:   eventTypes.dragLeave,
  topDragOver:    eventTypes.dragOver,
  topDragStart:   eventTypes.dragStart,
  topDrop:        eventTypes.drop,
  topError:       eventTypes.error,
  topFocus:       eventTypes.focus,
  topInput:       eventTypes.input,
  topKeyDown:     eventTypes.keyDown,
  topKeyPress:    eventTypes.keyPress,
  topKeyUp:       eventTypes.keyUp,
  topLoad:        eventTypes.load,
  topMouseDown:   eventTypes.mouseDown,
  topMouseMove:   eventTypes.mouseMove,
  topMouseOut:    eventTypes.mouseOut,
  topMouseOver:   eventTypes.mouseOver,
  topMouseUp:     eventTypes.mouseUp,
  topPaste:       eventTypes.paste,
  topReset:       eventTypes.reset,
  topScroll:      eventTypes.scroll,
  topSubmit:      eventTypes.submit,
  topTouchCancel: eventTypes.touchCancel,
  topTouchEnd:    eventTypes.touchEnd,
  topTouchMove:   eventTypes.touchMove,
  topTouchStart:  eventTypes.touchStart,
  topWheel:       eventTypes.wheel
};

for (var topLevelType in topLevelEventsToDispatchConfig) {
  topLevelEventsToDispatchConfig[topLevelType].dependencies = [topLevelType];
}

var SimpleEventPlugin = {

  eventTypes: eventTypes,

  /**
   * Same as the default implementation, except cancels the event when return
   * value is false. This behavior will be disabled in a future release.
   *
   * @param {object} Event to be dispatched.
   * @param {function} Application-level callback.
   * @param {string} domID DOM ID to pass to the callback.
   */
  executeDispatch: function(event, listener, domID) {
    var returnValue = EventPluginUtils.executeDispatch(event, listener, domID);

    ("production" !== process.env.NODE_ENV ? warning(
      typeof returnValue !== 'boolean',
      'Returning `false` from an event handler is deprecated and will be ' +
      'ignored in a future release. Instead, manually call ' +
      'e.stopPropagation() or e.preventDefault(), as appropriate.'
    ) : null);

    if (returnValue === false) {
      event.stopPropagation();
      event.preventDefault();
    }
  },

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor;
    switch (topLevelType) {
      case topLevelTypes.topInput:
      case topLevelTypes.topLoad:
      case topLevelTypes.topError:
      case topLevelTypes.topReset:
      case topLevelTypes.topSubmit:
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent;
        break;
      case topLevelTypes.topKeyPress:
        // FireFox creates a keypress event for function keys too. This removes
        // the unwanted keypress events. Enter is however both printable and
        // non-printable. One would expect Tab to be as well (but it isn't).
        if (getEventCharCode(nativeEvent) === 0) {
          return null;
        }
        /* falls through */
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyUp:
        EventConstructor = SyntheticKeyboardEvent;
        break;
      case topLevelTypes.topBlur:
      case topLevelTypes.topFocus:
        EventConstructor = SyntheticFocusEvent;
        break;
      case topLevelTypes.topClick:
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }
        /* falls through */
      case topLevelTypes.topContextMenu:
      case topLevelTypes.topDoubleClick:
      case topLevelTypes.topMouseDown:
      case topLevelTypes.topMouseMove:
      case topLevelTypes.topMouseOut:
      case topLevelTypes.topMouseOver:
      case topLevelTypes.topMouseUp:
        EventConstructor = SyntheticMouseEvent;
        break;
      case topLevelTypes.topDrag:
      case topLevelTypes.topDragEnd:
      case topLevelTypes.topDragEnter:
      case topLevelTypes.topDragExit:
      case topLevelTypes.topDragLeave:
      case topLevelTypes.topDragOver:
      case topLevelTypes.topDragStart:
      case topLevelTypes.topDrop:
        EventConstructor = SyntheticDragEvent;
        break;
      case topLevelTypes.topTouchCancel:
      case topLevelTypes.topTouchEnd:
      case topLevelTypes.topTouchMove:
      case topLevelTypes.topTouchStart:
        EventConstructor = SyntheticTouchEvent;
        break;
      case topLevelTypes.topScroll:
        EventConstructor = SyntheticUIEvent;
        break;
      case topLevelTypes.topWheel:
        EventConstructor = SyntheticWheelEvent;
        break;
      case topLevelTypes.topCopy:
      case topLevelTypes.topCut:
      case topLevelTypes.topPaste:
        EventConstructor = SyntheticClipboardEvent;
        break;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      EventConstructor,
      'SimpleEventPlugin: Unhandled event type, `%s`.',
      topLevelType
    ) : invariant(EventConstructor));
    var event = EventConstructor.getPooled(
      dispatchConfig,
      topLevelTargetID,
      nativeEvent
    );
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  }

};

module.exports = SimpleEventPlugin;

}).call(this,require('_process'))
},{"./EventConstants":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventConstants.js","./EventPluginUtils":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPluginUtils.js","./EventPropagators":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\EventPropagators.js","./SyntheticClipboardEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticClipboardEvent.js","./SyntheticDragEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticDragEvent.js","./SyntheticEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticEvent.js","./SyntheticFocusEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticFocusEvent.js","./SyntheticKeyboardEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticKeyboardEvent.js","./SyntheticMouseEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticMouseEvent.js","./SyntheticTouchEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticTouchEvent.js","./SyntheticUIEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticUIEvent.js","./SyntheticWheelEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticWheelEvent.js","./getEventCharCode":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventCharCode.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","./keyOf":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticClipboardEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticClipboardEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */
var ClipboardEventInterface = {
  clipboardData: function(event) {
    return (
      'clipboardData' in event ?
        event.clipboardData :
        window.clipboardData
    );
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);

module.exports = SyntheticClipboardEvent;


},{"./SyntheticEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticEvent.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticCompositionEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticCompositionEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */
var CompositionEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticCompositionEvent(
  dispatchConfig,
  dispatchMarker,
  nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(
  SyntheticCompositionEvent,
  CompositionEventInterface
);

module.exports = SyntheticCompositionEvent;


},{"./SyntheticEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticEvent.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticDragEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticDragEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticMouseEvent = require("./SyntheticMouseEvent");

/**
 * @interface DragEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var DragEventInterface = {
  dataTransfer: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticDragEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticMouseEvent.augmentClass(SyntheticDragEvent, DragEventInterface);

module.exports = SyntheticDragEvent;

},{"./SyntheticMouseEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticMouseEvent.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticEvent
 * @typechecks static-only
 */

"use strict";

var PooledClass = require("./PooledClass");

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");
var getEventTarget = require("./getEventTarget");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var EventInterface = {
  type: null,
  target: getEventTarget,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: emptyFunction.thatReturnsNull,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 */
function SyntheticEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  this.dispatchConfig = dispatchConfig;
  this.dispatchMarker = dispatchMarker;
  this.nativeEvent = nativeEvent;

  var Interface = this.constructor.Interface;
  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }
    var normalize = Interface[propName];
    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      this[propName] = nativeEvent[propName];
    }
  }

  var defaultPrevented = nativeEvent.defaultPrevented != null ?
    nativeEvent.defaultPrevented :
    nativeEvent.returnValue === false;
  if (defaultPrevented) {
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  } else {
    this.isDefaultPrevented = emptyFunction.thatReturnsFalse;
  }
  this.isPropagationStopped = emptyFunction.thatReturnsFalse;
}

assign(SyntheticEvent.prototype, {

  preventDefault: function() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  },

  stopPropagation: function() {
    var event = this.nativeEvent;
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    this.isPropagationStopped = emptyFunction.thatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function() {
    this.isPersistent = emptyFunction.thatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: emptyFunction.thatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function() {
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      this[propName] = null;
    }
    this.dispatchConfig = null;
    this.dispatchMarker = null;
    this.nativeEvent = null;
  }

});

SyntheticEvent.Interface = EventInterface;

/**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */
SyntheticEvent.augmentClass = function(Class, Interface) {
  var Super = this;

  var prototype = Object.create(Super.prototype);
  assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;

  Class.Interface = assign({}, Super.Interface, Interface);
  Class.augmentClass = Super.augmentClass;

  PooledClass.addPoolingTo(Class, PooledClass.threeArgumentPooler);
};

PooledClass.addPoolingTo(SyntheticEvent, PooledClass.threeArgumentPooler);

module.exports = SyntheticEvent;

},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./PooledClass":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\PooledClass.js","./emptyFunction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js","./getEventTarget":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventTarget.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticFocusEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticFocusEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

/**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var FocusEventInterface = {
  relatedTarget: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticFocusEvent, FocusEventInterface);

module.exports = SyntheticFocusEvent;

},{"./SyntheticUIEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticUIEvent.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticInputEvent.js":[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticInputEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
 *      /#events-inputevents
 */
var InputEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticInputEvent(
  dispatchConfig,
  dispatchMarker,
  nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(
  SyntheticInputEvent,
  InputEventInterface
);

module.exports = SyntheticInputEvent;


},{"./SyntheticEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticEvent.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticKeyboardEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticKeyboardEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

var getEventCharCode = require("./getEventCharCode");
var getEventKey = require("./getEventKey");
var getEventModifierState = require("./getEventModifierState");

/**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var KeyboardEventInterface = {
  key: getEventKey,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  getModifierState: getEventModifierState,
  // Legacy Interface
  charCode: function(event) {
    // `charCode` is the result of a KeyPress event and represents the value of
    // the actual printable character.

    // KeyPress is deprecated, but its replacement is not yet final and not
    // implemented in any major browser. Only KeyPress has charCode.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    return 0;
  },
  keyCode: function(event) {
    // `keyCode` is the result of a KeyDown/Up event and represents the value of
    // physical keyboard key.

    // The actual meaning of the value depends on the users' keyboard layout
    // which cannot be detected. Assuming that it is a US keyboard layout
    // provides a surprisingly accurate mapping for US and European users.
    // Due to this, it is left to the user to implement at this time.
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  },
  which: function(event) {
    // `which` is an alias for either `keyCode` or `charCode` depending on the
    // type of the event.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);

module.exports = SyntheticKeyboardEvent;

},{"./SyntheticUIEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticUIEvent.js","./getEventCharCode":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventCharCode.js","./getEventKey":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventKey.js","./getEventModifierState":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventModifierState.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticMouseEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticMouseEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");
var ViewportMetrics = require("./ViewportMetrics");

var getEventModifierState = require("./getEventModifierState");

/**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var MouseEventInterface = {
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  getModifierState: getEventModifierState,
  button: function(event) {
    // Webkit, Firefox, IE9+
    // which:  1 2 3
    // button: 0 1 2 (standard)
    var button = event.button;
    if ('which' in event) {
      return button;
    }
    // IE<9
    // which:  undefined
    // button: 0 0 0
    // button: 1 4 2 (onmouseup)
    return button === 2 ? 2 : button === 4 ? 1 : 0;
  },
  buttons: null,
  relatedTarget: function(event) {
    return event.relatedTarget || (
      event.fromElement === event.srcElement ?
        event.toElement :
        event.fromElement
    );
  },
  // "Proprietary" Interface.
  pageX: function(event) {
    return 'pageX' in event ?
      event.pageX :
      event.clientX + ViewportMetrics.currentScrollLeft;
  },
  pageY: function(event) {
    return 'pageY' in event ?
      event.pageY :
      event.clientY + ViewportMetrics.currentScrollTop;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);

module.exports = SyntheticMouseEvent;

},{"./SyntheticUIEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticUIEvent.js","./ViewportMetrics":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ViewportMetrics.js","./getEventModifierState":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventModifierState.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticTouchEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticTouchEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

var getEventModifierState = require("./getEventModifierState");

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */
var TouchEventInterface = {
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null,
  getModifierState: getEventModifierState
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);

module.exports = SyntheticTouchEvent;

},{"./SyntheticUIEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticUIEvent.js","./getEventModifierState":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventModifierState.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticUIEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticUIEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

var getEventTarget = require("./getEventTarget");

/**
 * @interface UIEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var UIEventInterface = {
  view: function(event) {
    if (event.view) {
      return event.view;
    }

    var target = getEventTarget(event);
    if (target != null && target.window === target) {
      // target is a window object
      return target;
    }

    var doc = target.ownerDocument;
    // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
    if (doc) {
      return doc.defaultView || doc.parentWindow;
    } else {
      return window;
    }
  },
  detail: function(event) {
    return event.detail || 0;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticUIEvent, UIEventInterface);

module.exports = SyntheticUIEvent;

},{"./SyntheticEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticEvent.js","./getEventTarget":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventTarget.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticWheelEvent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticWheelEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticMouseEvent = require("./SyntheticMouseEvent");

/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var WheelEventInterface = {
  deltaX: function(event) {
    return (
      'deltaX' in event ? event.deltaX :
      // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
      'wheelDeltaX' in event ? -event.wheelDeltaX : 0
    );
  },
  deltaY: function(event) {
    return (
      'deltaY' in event ? event.deltaY :
      // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
      'wheelDeltaY' in event ? -event.wheelDeltaY :
      // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
      'wheelDelta' in event ? -event.wheelDelta : 0
    );
  },
  deltaZ: null,

  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);

module.exports = SyntheticWheelEvent;

},{"./SyntheticMouseEvent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\SyntheticMouseEvent.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Transaction.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Transaction
 */

"use strict";

var invariant = require("./invariant");

/**
 * `Transaction` creates a black box that is able to wrap any method such that
 * certain invariants are maintained before and after the method is invoked
 * (Even if an exception is thrown while invoking the wrapped method). Whoever
 * instantiates a transaction can provide enforcers of the invariants at
 * creation time. The `Transaction` class itself will supply one additional
 * automatic invariant for you - the invariant that any transaction instance
 * should not be run while it is already being run. You would typically create a
 * single instance of a `Transaction` for reuse multiple times, that potentially
 * is used to wrap several different methods. Wrappers are extremely simple -
 * they only require implementing two methods.
 *
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 *
 * Use cases:
 * - Preserving the input selection ranges before/after reconciliation.
 *   Restoring selection even in the event of an unexpected error.
 * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
 *   while guaranteeing that afterwards, the event system is reactivated.
 * - Flushing a queue of collected DOM mutations to the main UI thread after a
 *   reconciliation takes place in a worker thread.
 * - Invoking any collected `componentDidUpdate` callbacks after rendering new
 *   content.
 * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
 *   to preserve the `scrollTop` (an automatic scroll aware DOM).
 * - (Future use case): Layout calculations before and after DOM upates.
 *
 * Transactional plugin API:
 * - A module that has an `initialize` method that returns any precomputation.
 * - and a `close` method that accepts the precomputation. `close` is invoked
 *   when the wrapped process is completed, or has failed.
 *
 * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
 * that implement `initialize` and `close`.
 * @return {Transaction} Single transaction for reuse in thread.
 *
 * @class Transaction
 */
var Mixin = {
  /**
   * Sets up this instance so that it is prepared for collecting metrics. Does
   * so such that this setup method may be used on an instance that is already
   * initialized, in a way that does not consume additional memory upon reuse.
   * That can be useful if you decide to make your subclass of this mixin a
   * "PooledClass".
   */
  reinitializeTransaction: function() {
    this.transactionWrappers = this.getTransactionWrappers();
    if (!this.wrapperInitData) {
      this.wrapperInitData = [];
    } else {
      this.wrapperInitData.length = 0;
    }
    this._isInTransaction = false;
  },

  _isInTransaction: false,

  /**
   * @abstract
   * @return {Array<TransactionWrapper>} Array of transaction wrappers.
   */
  getTransactionWrappers: null,

  isInTransaction: function() {
    return !!this._isInTransaction;
  },

  /**
   * Executes the function within a safety window. Use this for the top level
   * methods that result in large amounts of computation/mutations that would
   * need to be safety checked.
   *
   * @param {function} method Member of scope to call.
   * @param {Object} scope Scope to invoke from.
   * @param {Object?=} args... Arguments to pass to the method (optional).
   *                           Helps prevent need to bind in many cases.
   * @return Return value from `method`.
   */
  perform: function(method, scope, a, b, c, d, e, f) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !this.isInTransaction(),
      'Transaction.perform(...): Cannot initialize a transaction when there ' +
      'is already an outstanding transaction.'
    ) : invariant(!this.isInTransaction()));
    var errorThrown;
    var ret;
    try {
      this._isInTransaction = true;
      // Catching errors makes debugging more difficult, so we start with
      // errorThrown set to true before setting it to false after calling
      // close -- if it's still set to true in the finally block, it means
      // one of these calls threw.
      errorThrown = true;
      this.initializeAll(0);
      ret = method.call(scope, a, b, c, d, e, f);
      errorThrown = false;
    } finally {
      try {
        if (errorThrown) {
          // If `method` throws, prefer to show that stack trace over any thrown
          // by invoking `closeAll`.
          try {
            this.closeAll(0);
          } catch (err) {
          }
        } else {
          // Since `method` didn't throw, we don't want to silence the exception
          // here.
          this.closeAll(0);
        }
      } finally {
        this._isInTransaction = false;
      }
    }
    return ret;
  },

  initializeAll: function(startIndex) {
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      try {
        // Catching errors makes debugging more difficult, so we start with the
        // OBSERVED_ERROR state before overwriting it with the real return value
        // of initialize -- if it's still set to OBSERVED_ERROR in the finally
        // block, it means wrapper.initialize threw.
        this.wrapperInitData[i] = Transaction.OBSERVED_ERROR;
        this.wrapperInitData[i] = wrapper.initialize ?
          wrapper.initialize.call(this) :
          null;
      } finally {
        if (this.wrapperInitData[i] === Transaction.OBSERVED_ERROR) {
          // The initializer for wrapper i threw an error; initialize the
          // remaining wrappers but silence any exceptions from them to ensure
          // that the first error is the one to bubble up.
          try {
            this.initializeAll(i + 1);
          } catch (err) {
          }
        }
      }
    }
  },

  /**
   * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
   * them the respective return values of `this.transactionWrappers.init[i]`
   * (`close`rs that correspond to initializers that failed will not be
   * invoked).
   */
  closeAll: function(startIndex) {
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isInTransaction(),
      'Transaction.closeAll(): Cannot close transaction when none are open.'
    ) : invariant(this.isInTransaction()));
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      var initData = this.wrapperInitData[i];
      var errorThrown;
      try {
        // Catching errors makes debugging more difficult, so we start with
        // errorThrown set to true before setting it to false after calling
        // close -- if it's still set to true in the finally block, it means
        // wrapper.close threw.
        errorThrown = true;
        if (initData !== Transaction.OBSERVED_ERROR) {
          wrapper.close && wrapper.close.call(this, initData);
        }
        errorThrown = false;
      } finally {
        if (errorThrown) {
          // The closer for wrapper i threw an error; close the remaining
          // wrappers but silence any exceptions from them to ensure that the
          // first error is the one to bubble up.
          try {
            this.closeAll(i + 1);
          } catch (e) {
          }
        }
      }
    }
    this.wrapperInitData.length = 0;
  }
};

var Transaction = {

  Mixin: Mixin,

  /**
   * Token to look for to determine if an error occured.
   */
  OBSERVED_ERROR: {}

};

module.exports = Transaction;

}).call(this,require('_process'))
},{"./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ViewportMetrics.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ViewportMetrics
 */

"use strict";

var getUnboundedScrollPosition = require("./getUnboundedScrollPosition");

var ViewportMetrics = {

  currentScrollLeft: 0,

  currentScrollTop: 0,

  refreshScrollValues: function() {
    var scrollPosition = getUnboundedScrollPosition(window);
    ViewportMetrics.currentScrollLeft = scrollPosition.x;
    ViewportMetrics.currentScrollTop = scrollPosition.y;
  }

};

module.exports = ViewportMetrics;

},{"./getUnboundedScrollPosition":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getUnboundedScrollPosition.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\accumulateInto.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule accumulateInto
 */

"use strict";

var invariant = require("./invariant");

/**
 *
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulateInto(current, next) {
  ("production" !== process.env.NODE_ENV ? invariant(
    next != null,
    'accumulateInto(...): Accumulated items must not be null or undefined.'
  ) : invariant(next != null));
  if (current == null) {
    return next;
  }

  // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).
  var currentIsArray = Array.isArray(current);
  var nextIsArray = Array.isArray(next);

  if (currentIsArray && nextIsArray) {
    current.push.apply(current, next);
    return current;
  }

  if (currentIsArray) {
    current.push(next);
    return current;
  }

  if (nextIsArray) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}

module.exports = accumulateInto;

}).call(this,require('_process'))
},{"./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\adler32.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule adler32
 */

/* jslint bitwise:true */

"use strict";

var MOD = 65521;

// This is a clean-room implementation of adler32 designed for detecting
// if markup is not what we expect it to be. It does not need to be
// cryptographically strong, only reasonably good at detecting if markup
// generated on the server is different than that on the client.
function adler32(data) {
  var a = 1;
  var b = 0;
  for (var i = 0; i < data.length; i++) {
    a = (a + data.charCodeAt(i)) % MOD;
    b = (b + a) % MOD;
  }
  return a | (b << 16);
}

module.exports = adler32;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\camelize.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule camelize
 * @typechecks
 */

var _hyphenPattern = /-(.)/g;

/**
 * Camelcases a hyphenated string, for example:
 *
 *   > camelize('background-color')
 *   < "backgroundColor"
 *
 * @param {string} string
 * @return {string}
 */
function camelize(string) {
  return string.replace(_hyphenPattern, function(_, character) {
    return character.toUpperCase();
  });
}

module.exports = camelize;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\camelizeStyleName.js":[function(require,module,exports){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule camelizeStyleName
 * @typechecks
 */

"use strict";

var camelize = require("./camelize");

var msPattern = /^-ms-/;

/**
 * Camelcases a hyphenated CSS property name, for example:
 *
 *   > camelizeStyleName('background-color')
 *   < "backgroundColor"
 *   > camelizeStyleName('-moz-transition')
 *   < "MozTransition"
 *   > camelizeStyleName('-ms-transition')
 *   < "msTransition"
 *
 * As Andi Smith suggests
 * (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
 * is converted to lowercase `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
}

module.exports = camelizeStyleName;

},{"./camelize":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\camelize.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\containsNode.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule containsNode
 * @typechecks
 */

var isTextNode = require("./isTextNode");

/*jslint bitwise:true */

/**
 * Checks if a given DOM node contains or is another DOM node.
 *
 * @param {?DOMNode} outerNode Outer DOM node.
 * @param {?DOMNode} innerNode Inner DOM node.
 * @return {boolean} True if `outerNode` contains or is `innerNode`.
 */
function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if (outerNode.contains) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = containsNode;

},{"./isTextNode":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isTextNode.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\createArrayFrom.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createArrayFrom
 * @typechecks
 */

var toArray = require("./toArray");

/**
 * Perform a heuristic test to determine if an object is "array-like".
 *
 *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
 *   Joshu replied: "Mu."
 *
 * This function determines if its argument has "array nature": it returns
 * true if the argument is an actual array, an `arguments' object, or an
 * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
 *
 * It will return false for other array-like objects like Filelist.
 *
 * @param {*} obj
 * @return {boolean}
 */
function hasArrayNature(obj) {
  return (
    // not null/false
    !!obj &&
    // arrays are objects, NodeLists are functions in Safari
    (typeof obj == 'object' || typeof obj == 'function') &&
    // quacks like an array
    ('length' in obj) &&
    // not window
    !('setInterval' in obj) &&
    // no DOM node should be considered an array-like
    // a 'select' element has 'length' and 'item' properties on IE8
    (typeof obj.nodeType != 'number') &&
    (
      // a real array
      (// HTMLCollection/NodeList
      (Array.isArray(obj) ||
      // arguments
      ('callee' in obj) || 'item' in obj))
    )
  );
}

/**
 * Ensure that the argument is an array by wrapping it in an array if it is not.
 * Creates a copy of the argument if it is already an array.
 *
 * This is mostly useful idiomatically:
 *
 *   var createArrayFrom = require('createArrayFrom');
 *
 *   function takesOneOrMoreThings(things) {
 *     things = createArrayFrom(things);
 *     ...
 *   }
 *
 * This allows you to treat `things' as an array, but accept scalars in the API.
 *
 * If you need to convert an array-like object, like `arguments`, into an array
 * use toArray instead.
 *
 * @param {*} obj
 * @return {array}
 */
function createArrayFrom(obj) {
  if (!hasArrayNature(obj)) {
    return [obj];
  } else if (Array.isArray(obj)) {
    return obj.slice();
  } else {
    return toArray(obj);
  }
}

module.exports = createArrayFrom;

},{"./toArray":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\toArray.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\createFullPageComponent.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createFullPageComponent
 * @typechecks
 */

"use strict";

// Defeat circular references by requiring this directly.
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");

var invariant = require("./invariant");

/**
 * Create a component that will throw an exception when unmounted.
 *
 * Components like <html> <head> and <body> can't be removed or added
 * easily in a cross-browser way, however it's valuable to be able to
 * take advantage of React's reconciliation for styling and <title>
 * management. So we just document it and throw in dangerous cases.
 *
 * @param {string} tag The tag to wrap
 * @return {function} convenience constructor of new component
 */
function createFullPageComponent(tag) {
  var elementFactory = ReactElement.createFactory(tag);

  var FullPageComponent = ReactCompositeComponent.createClass({
    displayName: 'ReactFullPageComponent' + tag,

    componentWillUnmount: function() {
      ("production" !== process.env.NODE_ENV ? invariant(
        false,
        '%s tried to unmount. Because of cross-browser quirks it is ' +
        'impossible to unmount some top-level components (eg <html>, <head>, ' +
        'and <body>) reliably and efficiently. To fix this, have a single ' +
        'top-level component that never unmounts render these elements.',
        this.constructor.displayName
      ) : invariant(false));
    },

    render: function() {
      return elementFactory(this.props);
    }
  });

  return FullPageComponent;
}

module.exports = createFullPageComponent;

}).call(this,require('_process'))
},{"./ReactCompositeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactCompositeComponent.js","./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\createNodesFromMarkup.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createNodesFromMarkup
 * @typechecks
 */

/*jslint evil: true, sub: true */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var createArrayFrom = require("./createArrayFrom");
var getMarkupWrap = require("./getMarkupWrap");
var invariant = require("./invariant");

/**
 * Dummy container used to render all markup.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Pattern used by `getNodeName`.
 */
var nodeNamePattern = /^\s*<(\w+)/;

/**
 * Extracts the `nodeName` of the first element in a string of markup.
 *
 * @param {string} markup String of markup.
 * @return {?string} Node name of the supplied markup.
 */
function getNodeName(markup) {
  var nodeNameMatch = markup.match(nodeNamePattern);
  return nodeNameMatch && nodeNameMatch[1].toLowerCase();
}

/**
 * Creates an array containing the nodes rendered from the supplied markup. The
 * optionally supplied `handleScript` function will be invoked once for each
 * <script> element that is rendered. If no `handleScript` function is supplied,
 * an exception is thrown if any <script> elements are rendered.
 *
 * @param {string} markup A string of valid HTML markup.
 * @param {?function} handleScript Invoked once for each rendered <script>.
 * @return {array<DOMElement|DOMTextNode>} An array of rendered nodes.
 */
function createNodesFromMarkup(markup, handleScript) {
  var node = dummyNode;
  ("production" !== process.env.NODE_ENV ? invariant(!!dummyNode, 'createNodesFromMarkup dummy not initialized') : invariant(!!dummyNode));
  var nodeName = getNodeName(markup);

  var wrap = nodeName && getMarkupWrap(nodeName);
  if (wrap) {
    node.innerHTML = wrap[1] + markup + wrap[2];

    var wrapDepth = wrap[0];
    while (wrapDepth--) {
      node = node.lastChild;
    }
  } else {
    node.innerHTML = markup;
  }

  var scripts = node.getElementsByTagName('script');
  if (scripts.length) {
    ("production" !== process.env.NODE_ENV ? invariant(
      handleScript,
      'createNodesFromMarkup(...): Unexpected <script> element rendered.'
    ) : invariant(handleScript));
    createArrayFrom(scripts).forEach(handleScript);
  }

  var nodes = createArrayFrom(node.childNodes);
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
  return nodes;
}

module.exports = createNodesFromMarkup;

}).call(this,require('_process'))
},{"./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./createArrayFrom":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\createArrayFrom.js","./getMarkupWrap":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getMarkupWrap.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\dangerousStyleValue.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule dangerousStyleValue
 * @typechecks static-only
 */

"use strict";

var CSSProperty = require("./CSSProperty");

var isUnitlessNumber = CSSProperty.isUnitlessNumber;

/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
function dangerousStyleValue(name, value) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901

  var isEmpty = value == null || typeof value === 'boolean' || value === '';
  if (isEmpty) {
    return '';
  }

  var isNonNumeric = isNaN(value);
  if (isNonNumeric || value === 0 ||
      isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) {
    return '' + value; // cast to string
  }

  if (typeof value === 'string') {
    value = value.trim();
  }
  return value + 'px';
}

module.exports = dangerousStyleValue;

},{"./CSSProperty":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\CSSProperty.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\deprecated.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule deprecated
 */

var assign = require("./Object.assign");
var warning = require("./warning");

/**
 * This will log a single deprecation notice per function and forward the call
 * on to the new API.
 *
 * @param {string} namespace The namespace of the call, eg 'React'
 * @param {string} oldName The old function name, eg 'renderComponent'
 * @param {string} newName The new function name, eg 'render'
 * @param {*} ctx The context this forwarded call should run in
 * @param {function} fn The function to forward on to
 * @return {*} Will be the value as returned from `fn`
 */
function deprecated(namespace, oldName, newName, ctx, fn) {
  var warned = false;
  if ("production" !== process.env.NODE_ENV) {
    var newFn = function() {
      ("production" !== process.env.NODE_ENV ? warning(
        warned,
        (namespace + "." + oldName + " will be deprecated in a future version. ") +
        ("Use " + namespace + "." + newName + " instead.")
      ) : null);
      warned = true;
      return fn.apply(ctx, arguments);
    };
    newFn.displayName = (namespace + "_" + oldName);
    // We need to make sure all properties of the original fn are copied over.
    // In particular, this is needed to support PropTypes
    return assign(newFn, fn);
  }

  return fn;
}

module.exports = deprecated;

}).call(this,require('_process'))
},{"./Object.assign":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\Object.assign.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule emptyFunction
 */

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() { return this; };
emptyFunction.thatReturnsArgument = function(arg) { return arg; };

module.exports = emptyFunction;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyObject.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule emptyObject
 */

"use strict";

var emptyObject = {};

if ("production" !== process.env.NODE_ENV) {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;

}).call(this,require('_process'))
},{"_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\escapeTextForBrowser.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule escapeTextForBrowser
 * @typechecks static-only
 */

"use strict";

var ESCAPE_LOOKUP = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  "\"": "&quot;",
  "'": "&#x27;"
};

var ESCAPE_REGEX = /[&><"']/g;

function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
function escapeTextForBrowser(text) {
  return ('' + text).replace(ESCAPE_REGEX, escaper);
}

module.exports = escapeTextForBrowser;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\flattenChildren.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule flattenChildren
 */

"use strict";

var ReactTextComponent = require("./ReactTextComponent");

var traverseAllChildren = require("./traverseAllChildren");
var warning = require("./warning");

/**
 * @param {function} traverseContext Context passed through traversal.
 * @param {?ReactComponent} child React child component.
 * @param {!string} name String name of key path to child.
 */
function flattenSingleChildIntoContext(traverseContext, child, name) {
  // We found a component instance.
  var result = traverseContext;
  var keyUnique = !result.hasOwnProperty(name);
  ("production" !== process.env.NODE_ENV ? warning(
    keyUnique,
    'flattenChildren(...): Encountered two children with the same key, ' +
    '`%s`. Child keys must be unique; when two children share a key, only ' +
    'the first child will be used.',
    name
  ) : null);
  if (keyUnique && child != null) {
    var type = typeof child;
    var normalizedValue;

    if (type === 'string') {
      normalizedValue = ReactTextComponent(child);
    } else if (type === 'number') {
      normalizedValue = ReactTextComponent('' + child);
    } else {
      normalizedValue = child;
    }

    result[name] = normalizedValue;
  }
}

/**
 * Flattens children that are typically specified as `props.children`. Any null
 * children will not be included in the resulting object.
 * @return {!object} flattened children keyed by name.
 */
function flattenChildren(children) {
  if (children == null) {
    return children;
  }
  var result = {};
  traverseAllChildren(children, flattenSingleChildIntoContext, result);
  return result;
}

module.exports = flattenChildren;

}).call(this,require('_process'))
},{"./ReactTextComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactTextComponent.js","./traverseAllChildren":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\traverseAllChildren.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\focusNode.js":[function(require,module,exports){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule focusNode
 */

"use strict";

/**
 * @param {DOMElement} node input/textarea to focus
 */
function focusNode(node) {
  // IE8 can throw "Can't move focus to the control because it is invisible,
  // not enabled, or of a type that does not accept the focus." for all kinds of
  // reasons that are too expensive and fragile to test.
  try {
    node.focus();
  } catch(e) {
  }
}

module.exports = focusNode;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\forEachAccumulated.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule forEachAccumulated
 */

"use strict";

/**
 * @param {array} an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 */
var forEachAccumulated = function(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
};

module.exports = forEachAccumulated;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getActiveElement.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getActiveElement
 * @typechecks
 */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document body is not yet defined.
 */
function getActiveElement() /*?DOMElement*/ {
  try {
    return document.activeElement || document.body;
  } catch (e) {
    return document.body;
  }
}

module.exports = getActiveElement;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventCharCode.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventCharCode
 * @typechecks static-only
 */

"use strict";

/**
 * `charCode` represents the actual "character code" and is safe to use with
 * `String.fromCharCode`. As such, only keys that correspond to printable
 * characters produce a valid `charCode`, the only exception to this is Enter.
 * The Tab-key is considered non-printable and does not have a `charCode`,
 * presumably because it does not produce a tab-character in browsers.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `charCode` property.
 */
function getEventCharCode(nativeEvent) {
  var charCode;
  var keyCode = nativeEvent.keyCode;

  if ('charCode' in nativeEvent) {
    charCode = nativeEvent.charCode;

    // FF does not set `charCode` for the Enter-key, check against `keyCode`.
    if (charCode === 0 && keyCode === 13) {
      charCode = 13;
    }
  } else {
    // IE8 does not implement `charCode`, but `keyCode` has the correct value.
    charCode = keyCode;
  }

  // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
  // Must not discard the (non-)printable Enter-key.
  if (charCode >= 32 || charCode === 13) {
    return charCode;
  }

  return 0;
}

module.exports = getEventCharCode;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventKey.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventKey
 * @typechecks static-only
 */

"use strict";

var getEventCharCode = require("./getEventCharCode");

/**
 * Normalization of deprecated HTML5 `key` values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var normalizeKey = {
  'Esc': 'Escape',
  'Spacebar': ' ',
  'Left': 'ArrowLeft',
  'Up': 'ArrowUp',
  'Right': 'ArrowRight',
  'Down': 'ArrowDown',
  'Del': 'Delete',
  'Win': 'OS',
  'Menu': 'ContextMenu',
  'Apps': 'ContextMenu',
  'Scroll': 'ScrollLock',
  'MozPrintableKey': 'Unidentified'
};

/**
 * Translation from legacy `keyCode` to HTML5 `key`
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var translateToKey = {
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
  32: ' ',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
  118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
  144: 'NumLock',
  145: 'ScrollLock',
  224: 'Meta'
};

/**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */
function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.

    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
    if (key !== 'Unidentified') {
      return key;
    }
  }

  // Browser does not implement `key`, polyfill as much of it as we can.
  if (nativeEvent.type === 'keypress') {
    var charCode = getEventCharCode(nativeEvent);

    // The enter-key is technically both printable and non-printable and can
    // thus be captured by `keypress`, no other non-printable key should.
    return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
  }
  if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
    // While user keyboard layout determines the actual meaning of each
    // `keyCode` value, almost all function keys have a universal value.
    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }
  return '';
}

module.exports = getEventKey;

},{"./getEventCharCode":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventCharCode.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventModifierState.js":[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventModifierState
 * @typechecks static-only
 */

"use strict";

/**
 * Translation from modifier key to the associated property in the event.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
 */

var modifierKeyToProp = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Meta': 'metaKey',
  'Shift': 'shiftKey'
};

// IE8 does not implement getModifierState so we simply map it to the only
// modifier keys exposed by the event itself, does not support Lock-keys.
// Currently, all major browsers except Chrome seems to support Lock-keys.
function modifierStateGetter(keyArg) {
  /*jshint validthis:true */
  var syntheticEvent = this;
  var nativeEvent = syntheticEvent.nativeEvent;
  if (nativeEvent.getModifierState) {
    return nativeEvent.getModifierState(keyArg);
  }
  var keyProp = modifierKeyToProp[keyArg];
  return keyProp ? !!nativeEvent[keyProp] : false;
}

function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}

module.exports = getEventModifierState;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getEventTarget.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventTarget
 * @typechecks static-only
 */

"use strict";

/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */
function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window;
  // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html
  return target.nodeType === 3 ? target.parentNode : target;
}

module.exports = getEventTarget;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getMarkupWrap.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getMarkupWrap
 */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var invariant = require("./invariant");

/**
 * Dummy container used to detect which wraps are necessary.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Some browsers cannot use `innerHTML` to render certain elements standalone,
 * so we wrap them, render the wrapped nodes, then extract the desired node.
 *
 * In IE8, certain elements cannot render alone, so wrap all elements ('*').
 */
var shouldWrap = {
  // Force wrapping for SVG elements because if they get created inside a <div>,
  // they will be initialized in the wrong namespace (and will not display).
  'circle': true,
  'defs': true,
  'ellipse': true,
  'g': true,
  'line': true,
  'linearGradient': true,
  'path': true,
  'polygon': true,
  'polyline': true,
  'radialGradient': true,
  'rect': true,
  'stop': true,
  'text': true
};

var selectWrap = [1, '<select multiple="true">', '</select>'];
var tableWrap = [1, '<table>', '</table>'];
var trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

var svgWrap = [1, '<svg>', '</svg>'];

var markupWrap = {
  '*': [1, '?<div>', '</div>'],

  'area': [1, '<map>', '</map>'],
  'col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  'legend': [1, '<fieldset>', '</fieldset>'],
  'param': [1, '<object>', '</object>'],
  'tr': [2, '<table><tbody>', '</tbody></table>'],

  'optgroup': selectWrap,
  'option': selectWrap,

  'caption': tableWrap,
  'colgroup': tableWrap,
  'tbody': tableWrap,
  'tfoot': tableWrap,
  'thead': tableWrap,

  'td': trWrap,
  'th': trWrap,

  'circle': svgWrap,
  'defs': svgWrap,
  'ellipse': svgWrap,
  'g': svgWrap,
  'line': svgWrap,
  'linearGradient': svgWrap,
  'path': svgWrap,
  'polygon': svgWrap,
  'polyline': svgWrap,
  'radialGradient': svgWrap,
  'rect': svgWrap,
  'stop': svgWrap,
  'text': svgWrap
};

/**
 * Gets the markup wrap configuration for the supplied `nodeName`.
 *
 * NOTE: This lazily detects which wraps are necessary for the current browser.
 *
 * @param {string} nodeName Lowercase `nodeName`.
 * @return {?array} Markup wrap configuration, if applicable.
 */
function getMarkupWrap(nodeName) {
  ("production" !== process.env.NODE_ENV ? invariant(!!dummyNode, 'Markup wrapping node not initialized') : invariant(!!dummyNode));
  if (!markupWrap.hasOwnProperty(nodeName)) {
    nodeName = '*';
  }
  if (!shouldWrap.hasOwnProperty(nodeName)) {
    if (nodeName === '*') {
      dummyNode.innerHTML = '<link />';
    } else {
      dummyNode.innerHTML = '<' + nodeName + '></' + nodeName + '>';
    }
    shouldWrap[nodeName] = !dummyNode.firstChild;
  }
  return shouldWrap[nodeName] ? markupWrap[nodeName] : null;
}


module.exports = getMarkupWrap;

}).call(this,require('_process'))
},{"./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getNodeForCharacterOffset.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getNodeForCharacterOffset
 */

"use strict";

/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */
function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }
  return node;
}

/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */
function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}

/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */
function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType == 3) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

module.exports = getNodeForCharacterOffset;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getReactRootElementInContainer.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getReactRootElementInContainer
 */

"use strict";

var DOC_NODE_TYPE = 9;

/**
 * @param {DOMElement|DOMDocument} container DOM element that may contain
 *                                           a React component
 * @return {?*} DOM element that may have the reactRoot ID, or null.
 */
function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

module.exports = getReactRootElementInContainer;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getTextContentAccessor.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getTextContentAccessor
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var contentKey = null;

/**
 * Gets the key used to access text content on a DOM node.
 *
 * @return {?string} Key used to access text content.
 * @internal
 */
function getTextContentAccessor() {
  if (!contentKey && ExecutionEnvironment.canUseDOM) {
    // Prefer textContent to innerText because many browsers support both but
    // SVG <text> elements don't support innerText even when <div> does.
    contentKey = 'textContent' in document.documentElement ?
      'textContent' :
      'innerText';
  }
  return contentKey;
}

module.exports = getTextContentAccessor;

},{"./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\getUnboundedScrollPosition.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getUnboundedScrollPosition
 * @typechecks
 */

"use strict";

/**
 * Gets the scroll position of the supplied element or window.
 *
 * The return values are unbounded, unlike `getScrollPosition`. This means they
 * may be negative or exceed the element boundaries (which is possible using
 * inertial scrolling).
 *
 * @param {DOMWindow|DOMElement} scrollable
 * @return {object} Map with `x` and `y` keys.
 */
function getUnboundedScrollPosition(scrollable) {
  if (scrollable === window) {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  }
  return {
    x: scrollable.scrollLeft,
    y: scrollable.scrollTop
  };
}

module.exports = getUnboundedScrollPosition;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\hyphenate.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule hyphenate
 * @typechecks
 */

var _uppercasePattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style names, use `hyphenateStyleName` instead which works properly
 * with all vendor prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

module.exports = hyphenate;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\hyphenateStyleName.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule hyphenateStyleName
 * @typechecks
 */

"use strict";

var hyphenate = require("./hyphenate");

var msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, '-ms-');
}

module.exports = hyphenateStyleName;

},{"./hyphenate":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\hyphenate.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\instantiateReactComponent.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule instantiateReactComponent
 * @typechecks static-only
 */

"use strict";

var warning = require("./warning");

var ReactElement = require("./ReactElement");
var ReactLegacyElement = require("./ReactLegacyElement");
var ReactNativeComponent = require("./ReactNativeComponent");
var ReactEmptyComponent = require("./ReactEmptyComponent");

/**
 * Given an `element` create an instance that will actually be mounted.
 *
 * @param {object} element
 * @param {*} parentCompositeType The composite type that resolved this.
 * @return {object} A new instance of the element's constructor.
 * @protected
 */
function instantiateReactComponent(element, parentCompositeType) {
  var instance;

  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      element && (typeof element.type === 'function' ||
                     typeof element.type === 'string'),
      'Only functions or strings can be mounted as React components.'
    ) : null);

    // Resolve mock instances
    if (element.type._mockedReactClassConstructor) {
      // If this is a mocked class, we treat the legacy factory as if it was the
      // class constructor for future proofing unit tests. Because this might
      // be mocked as a legacy factory, we ignore any warnings triggerd by
      // this temporary hack.
      ReactLegacyElement._isLegacyCallWarningEnabled = false;
      try {
        instance = new element.type._mockedReactClassConstructor(
          element.props
        );
      } finally {
        ReactLegacyElement._isLegacyCallWarningEnabled = true;
      }

      // If the mock implementation was a legacy factory, then it returns a
      // element. We need to turn this into a real component instance.
      if (ReactElement.isValidElement(instance)) {
        instance = new instance.type(instance.props);
      }

      var render = instance.render;
      if (!render) {
        // For auto-mocked factories, the prototype isn't shimmed and therefore
        // there is no render function on the instance. We replace the whole
        // component with an empty component instance instead.
        element = ReactEmptyComponent.getEmptyComponent();
      } else {
        if (render._isMockFunction && !render._getMockImplementation()) {
          // Auto-mocked components may have a prototype with a mocked render
          // function. For those, we'll need to mock the result of the render
          // since we consider undefined to be invalid results from render.
          render.mockImplementation(
            ReactEmptyComponent.getEmptyComponent
          );
        }
        instance.construct(element);
        return instance;
      }
    }
  }

  // Special case string values
  if (typeof element.type === 'string') {
    instance = ReactNativeComponent.createInstanceForTag(
      element.type,
      element.props,
      parentCompositeType
    );
  } else {
    // Normal case for non-mocks and non-strings
    instance = new element.type(element.props);
  }

  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      typeof instance.construct === 'function' &&
      typeof instance.mountComponent === 'function' &&
      typeof instance.receiveComponent === 'function',
      'Only React Components can be mounted.'
    ) : null);
  }

  // This actually sets up the internal instance. This will become decoupled
  // from the public instance in a future diff.
  instance.construct(element);

  return instance;
}

module.exports = instantiateReactComponent;

}).call(this,require('_process'))
},{"./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactEmptyComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactEmptyComponent.js","./ReactLegacyElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactLegacyElement.js","./ReactNativeComponent":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactNativeComponent.js","./warning":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))
},{"_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isEventSupported.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isEventSupported
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var useHasFeature;
if (ExecutionEnvironment.canUseDOM) {
  useHasFeature =
    document.implementation &&
    document.implementation.hasFeature &&
    // always returns true in newer browsers as per the standard.
    // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
    document.implementation.hasFeature('', '') !== true;
}

/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function isEventSupported(eventNameSuffix, capture) {
  if (!ExecutionEnvironment.canUseDOM ||
      capture && !('addEventListener' in document)) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = eventName in document;

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}

module.exports = isEventSupported;

},{"./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isNode.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isNode
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  return !!(object && (
    typeof Node === 'function' ? object instanceof Node :
      typeof object === 'object' &&
      typeof object.nodeType === 'number' &&
      typeof object.nodeName === 'string'
  ));
}

module.exports = isNode;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isTextInputElement.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isTextInputElement
 */

"use strict";

/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */
var supportedInputTypes = {
  'color': true,
  'date': true,
  'datetime': true,
  'datetime-local': true,
  'email': true,
  'month': true,
  'number': true,
  'password': true,
  'range': true,
  'search': true,
  'tel': true,
  'text': true,
  'time': true,
  'url': true,
  'week': true
};

function isTextInputElement(elem) {
  return elem && (
    (elem.nodeName === 'INPUT' && supportedInputTypes[elem.type]) ||
    elem.nodeName === 'TEXTAREA'
  );
}

module.exports = isTextInputElement;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isTextNode.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isTextNode
 * @typechecks
 */

var isNode = require("./isNode");

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;

},{"./isNode":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\isNode.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\joinClasses.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule joinClasses
 * @typechecks static-only
 */

"use strict";

/**
 * Combines multiple className strings into one.
 * http://jsperf.com/joinclasses-args-vs-array
 *
 * @param {...?string} classes
 * @return {string}
 */
function joinClasses(className/*, ... */) {
  if (!className) {
    className = '';
  }
  var nextClass;
  var argLength = arguments.length;
  if (argLength > 1) {
    for (var ii = 1; ii < argLength; ii++) {
      nextClass = arguments[ii];
      if (nextClass) {
        className = (className ? className + ' ' : '') + nextClass;
      }
    }
  }
  return className;
}

module.exports = joinClasses;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyMirror.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require('_process'))
},{"./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\keyOf.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyOf
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without loosing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};


module.exports = keyOf;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\mapObject.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule mapObject
 */

'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Executes the provided `callback` once for each enumerable own property in the
 * object and constructs a new object from the results. The `callback` is
 * invoked with three arguments:
 *
 *  - the property value
 *  - the property name
 *  - the object being traversed
 *
 * Properties that are added after the call to `mapObject` will not be visited
 * by `callback`. If the values of existing properties are changed, the value
 * passed to `callback` will be the value at the time `mapObject` visits them.
 * Properties that are deleted before being visited are not visited.
 *
 * @grep function objectMap()
 * @grep function objMap()
 *
 * @param {?object} object
 * @param {function} callback
 * @param {*} context
 * @return {?object}
 */
function mapObject(object, callback, context) {
  if (!object) {
    return null;
  }
  var result = {};
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result[name] = callback.call(context, object[name], name, object);
    }
  }
  return result;
}

module.exports = mapObject;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\memoizeStringOnly.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule memoizeStringOnly
 * @typechecks static-only
 */

"use strict";

/**
 * Memoizes the return value of a function that accepts one string argument.
 *
 * @param {function} callback
 * @return {function}
 */
function memoizeStringOnly(callback) {
  var cache = {};
  return function(string) {
    if (cache.hasOwnProperty(string)) {
      return cache[string];
    } else {
      return cache[string] = callback.call(this, string);
    }
  };
}

module.exports = memoizeStringOnly;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\monitorCodeUse.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule monitorCodeUse
 */

"use strict";

var invariant = require("./invariant");

/**
 * Provides open-source compatible instrumentation for monitoring certain API
 * uses before we're ready to issue a warning or refactor. It accepts an event
 * name which may only contain the characters [a-z0-9_] and an optional data
 * object with further information.
 */

function monitorCodeUse(eventName, data) {
  ("production" !== process.env.NODE_ENV ? invariant(
    eventName && !/[^a-z0-9_]/.test(eventName),
    'You must provide an eventName using only the characters [a-z0-9_]'
  ) : invariant(eventName && !/[^a-z0-9_]/.test(eventName)));
}

module.exports = monitorCodeUse;

}).call(this,require('_process'))
},{"./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\onlyChild.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule onlyChild
 */
"use strict";

var ReactElement = require("./ReactElement");

var invariant = require("./invariant");

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection. The current implementation of this
 * function assumes that a single child gets passed without a wrapper, but the
 * purpose of this helper function is to abstract away the particular structure
 * of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactComponent} The first and only `ReactComponent` contained in the
 * structure.
 */
function onlyChild(children) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactElement.isValidElement(children),
    'onlyChild must be passed a children with exactly one child.'
  ) : invariant(ReactElement.isValidElement(children)));
  return children;
}

module.exports = onlyChild;

}).call(this,require('_process'))
},{"./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\performance.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule performance
 * @typechecks
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var performance;

if (ExecutionEnvironment.canUseDOM) {
  performance =
    window.performance ||
    window.msPerformance ||
    window.webkitPerformance;
}

module.exports = performance || {};

},{"./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\performanceNow.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule performanceNow
 * @typechecks
 */

var performance = require("./performance");

/**
 * Detect if we can use `window.performance.now()` and gracefully fallback to
 * `Date.now()` if it doesn't exist. We need to support Firefox < 15 for now
 * because of Facebook's testing infrastructure.
 */
if (!performance || !performance.now) {
  performance = Date;
}

var performanceNow = performance.now.bind(performance);

module.exports = performanceNow;

},{"./performance":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\performance.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\setInnerHTML.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule setInnerHTML
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var WHITESPACE_TEST = /^[ \r\n\t\f]/;
var NONVISIBLE_TEST = /<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/;

/**
 * Set the innerHTML property of a node, ensuring that whitespace is preserved
 * even in IE8.
 *
 * @param {DOMElement} node
 * @param {string} html
 * @internal
 */
var setInnerHTML = function(node, html) {
  node.innerHTML = html;
};

if (ExecutionEnvironment.canUseDOM) {
  // IE8: When updating a just created node with innerHTML only leading
  // whitespace is removed. When updating an existing node with innerHTML
  // whitespace in root TextNodes is also collapsed.
  // @see quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html

  // Feature detection; only IE8 is known to behave improperly like this.
  var testElement = document.createElement('div');
  testElement.innerHTML = ' ';
  if (testElement.innerHTML === '') {
    setInnerHTML = function(node, html) {
      // Magic theory: IE8 supposedly differentiates between added and updated
      // nodes when processing innerHTML, innerHTML on updated nodes suffers
      // from worse whitespace behavior. Re-adding a node like this triggers
      // the initial and more favorable whitespace behavior.
      // TODO: What to do on a detached node?
      if (node.parentNode) {
        node.parentNode.replaceChild(node, node);
      }

      // We also implement a workaround for non-visible tags disappearing into
      // thin air on IE8, this only happens if there is no visible text
      // in-front of the non-visible tags. Piggyback on the whitespace fix
      // and simply check if any non-visible tags appear in the source.
      if (WHITESPACE_TEST.test(html) ||
          html[0] === '<' && NONVISIBLE_TEST.test(html)) {
        // Recover leading whitespace by temporarily prepending any character.
        // \uFEFF has the potential advantage of being zero-width/invisible.
        node.innerHTML = '\uFEFF' + html;

        // deleteData leaves an empty `TextNode` which offsets the index of all
        // children. Definitely want to avoid this.
        var textNode = node.firstChild;
        if (textNode.data.length === 1) {
          node.removeChild(textNode);
        } else {
          textNode.deleteData(0, 1);
        }
      } else {
        node.innerHTML = html;
      }
    };
  }
}

module.exports = setInnerHTML;

},{"./ExecutionEnvironment":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ExecutionEnvironment.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\shallowEqual.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shallowEqual
 */

"use strict";

/**
 * Performs equality by iterating through keys on an object and returning
 * false when any key has values which are not strictly equal between
 * objA and objB. Returns true when the values of all keys are strictly equal.
 *
 * @return {boolean}
 */
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

module.exports = shallowEqual;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\shouldUpdateReactComponent.js":[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shouldUpdateReactComponent
 * @typechecks static-only
 */

"use strict";

/**
 * Given a `prevElement` and `nextElement`, determines if the existing
 * instance should be updated as opposed to being destroyed or replaced by a new
 * instance. Both arguments are elements. This ensures that this logic can
 * operate on stateless trees without any backing instance.
 *
 * @param {?object} prevElement
 * @param {?object} nextElement
 * @return {boolean} True if the existing instance should be updated.
 * @protected
 */
function shouldUpdateReactComponent(prevElement, nextElement) {
  if (prevElement && nextElement &&
      prevElement.type === nextElement.type &&
      prevElement.key === nextElement.key &&
      prevElement._owner === nextElement._owner) {
    return true;
  }
  return false;
}

module.exports = shouldUpdateReactComponent;

},{}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\toArray.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule toArray
 * @typechecks
 */

var invariant = require("./invariant");

/**
 * Convert array-like objects to arrays.
 *
 * This API assumes the caller knows the contents of the data type. For less
 * well defined inputs use createArrayFrom.
 *
 * @param {object|function|filelist} obj
 * @return {array}
 */
function toArray(obj) {
  var length = obj.length;

  // Some browse builtin objects can report typeof 'function' (e.g. NodeList in
  // old versions of Safari).
  ("production" !== process.env.NODE_ENV ? invariant(
    !Array.isArray(obj) &&
    (typeof obj === 'object' || typeof obj === 'function'),
    'toArray: Array-like object expected'
  ) : invariant(!Array.isArray(obj) &&
  (typeof obj === 'object' || typeof obj === 'function')));

  ("production" !== process.env.NODE_ENV ? invariant(
    typeof length === 'number',
    'toArray: Object needs a length property'
  ) : invariant(typeof length === 'number'));

  ("production" !== process.env.NODE_ENV ? invariant(
    length === 0 ||
    (length - 1) in obj,
    'toArray: Object should have keys for indices'
  ) : invariant(length === 0 ||
  (length - 1) in obj));

  // Old IE doesn't give collections access to hasOwnProperty. Assume inputs
  // without method will throw during the slice call and skip straight to the
  // fallback.
  if (obj.hasOwnProperty) {
    try {
      return Array.prototype.slice.call(obj);
    } catch (e) {
      // IE < 9 does not support Array#slice on collections objects
    }
  }

  // Fall back to copying key by key. This assumes all keys have a value,
  // so will not preserve sparsely populated inputs.
  var ret = Array(length);
  for (var ii = 0; ii < length; ii++) {
    ret[ii] = obj[ii];
  }
  return ret;
}

module.exports = toArray;

}).call(this,require('_process'))
},{"./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\traverseAllChildren.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule traverseAllChildren
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactInstanceHandles = require("./ReactInstanceHandles");

var invariant = require("./invariant");

var SEPARATOR = ReactInstanceHandles.SEPARATOR;
var SUBSEPARATOR = ':';

/**
 * TODO: Test that:
 * 1. `mapChildren` transforms strings and numbers into `ReactTextComponent`.
 * 2. it('should fail when supplied duplicate key', function() {
 * 3. That a single child and an array with one item have the same key pattern.
 * });
 */

var userProvidedKeyEscaperLookup = {
  '=': '=0',
  '.': '=1',
  ':': '=2'
};

var userProvidedKeyEscapeRegex = /[=.:]/g;

function userProvidedKeyEscaper(match) {
  return userProvidedKeyEscaperLookup[match];
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  if (component && component.key != null) {
    // Explicit key
    return wrapUserProvidedKey(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * Escape a component key so that it is safe to use in a reactid.
 *
 * @param {*} key Component key to be escaped.
 * @return {string} An escaped string.
 */
function escapeUserProvidedKey(text) {
  return ('' + text).replace(
    userProvidedKeyEscapeRegex,
    userProvidedKeyEscaper
  );
}

/**
 * Wrap a `key` value explicitly provided by the user to distinguish it from
 * implicitly-generated keys generated by a component's index in its parent.
 *
 * @param {string} key Value of a user-provided `key` attribute
 * @return {string}
 */
function wrapUserProvidedKey(key) {
  return '$' + escapeUserProvidedKey(key);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!number} indexSoFar Number of children encountered until this point.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
var traverseAllChildrenImpl =
  function(children, nameSoFar, indexSoFar, callback, traverseContext) {
    var nextName, nextIndex;
    var subtreeCount = 0;  // Count of children found in the current subtree.
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        nextName = (
          nameSoFar +
          (nameSoFar ? SUBSEPARATOR : SEPARATOR) +
          getComponentKey(child, i)
        );
        nextIndex = indexSoFar + subtreeCount;
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          nextIndex,
          callback,
          traverseContext
        );
      }
    } else {
      var type = typeof children;
      var isOnlyChild = nameSoFar === '';
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows
      var storageName =
        isOnlyChild ? SEPARATOR + getComponentKey(children, 0) : nameSoFar;
      if (children == null || type === 'boolean') {
        // All of the above are perceived as null.
        callback(traverseContext, null, storageName, indexSoFar);
        subtreeCount = 1;
      } else if (type === 'string' || type === 'number' ||
                 ReactElement.isValidElement(children)) {
        callback(traverseContext, children, storageName, indexSoFar);
        subtreeCount = 1;
      } else if (type === 'object') {
        ("production" !== process.env.NODE_ENV ? invariant(
          !children || children.nodeType !== 1,
          'traverseAllChildren(...): Encountered an invalid child; DOM ' +
          'elements are not valid children of React components.'
        ) : invariant(!children || children.nodeType !== 1));
        for (var key in children) {
          if (children.hasOwnProperty(key)) {
            nextName = (
              nameSoFar + (nameSoFar ? SUBSEPARATOR : SEPARATOR) +
              wrapUserProvidedKey(key) + SUBSEPARATOR +
              getComponentKey(children[key], 0)
            );
            nextIndex = indexSoFar + subtreeCount;
            subtreeCount += traverseAllChildrenImpl(
              children[key],
              nextName,
              nextIndex,
              callback,
              traverseContext
            );
          }
        }
      }
    }
    return subtreeCount;
  };

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', 0, callback, traverseContext);
}

module.exports = traverseAllChildren;

}).call(this,require('_process'))
},{"./ReactElement":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactElement.js","./ReactInstanceHandles":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\ReactInstanceHandles.js","./invariant":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\invariant.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\warning.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule warning
 */

"use strict";

var emptyFunction = require("./emptyFunction");

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if ("production" !== process.env.NODE_ENV) {
  warning = function(condition, format ) {for (var args=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (!condition) {
      var argIndex = 0;
      console.warn('Warning: ' + format.replace(/%s/g, function()  {return args[argIndex++];}));
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))
},{"./emptyFunction":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\emptyFunction.js","_process":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\react.js":[function(require,module,exports){
module.exports = require('./lib/React');

},{"./lib/React":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\lib\\React.js"}],"c:\\Users\\Timothy\\repos\\gifit\\src\\components\\ConfigurationPanel.jsx":[function(require,module,exports){
var React = require('react');

var ConfigurationPanel = React.createClass({displayName: "ConfigurationPanel",
	render: function(){
		return (
			React.createElement("div", {className: "gifit-configuration"}, 
				React.createElement("form", {onSubmit: this._onSubmit}, 
					React.createElement("fieldset", {className: "gifit__fieldset--horizontal"}, 
						React.createElement("div", {className: "gifit__inputs"}, 
							React.createElement("label", {className: "gifit__label", for: "gifit-option-start"}, "Start"), 
							React.createElement("input", {
								id: "gifit-option-start", 
								className: "gifit__input", 
								name: "start", type: "text", 
								value: this.props.configuration.start}
							)
						), 
						React.createElement("div", {className: "gifit__inputs"}, 
							React.createElement("label", {className: "gifit__label", for: "gifit-option-end"}, "End"), 
							React.createElement("input", {
								id: "gifit-option-end", 
								className: "gifit__input", 
								name: "end", 
								type: "text", 
								value: this.props.configuration.end}
							)
						)
					), 
					React.createElement("fieldset", {className: "gifit__fieldset--horizontal"}, 
						React.createElement("div", {className: "gifit__inputs"}, 
							React.createElement("label", {className: "gifit__label", for: "gifit-option-width"}, "Width"), 
							React.createElement("input", {
								id: "gifit-option-width", 
								className: "gifit__input", 
								name: "width", 
								type: "number", 
								min: "10", 
								max: "1920", 
								value: this.props.configuration.width}
							)
						), 
						React.createElement("div", {className: "gifit__inputs"}, 
							React.createElement("label", {className: "gifit__label", for: "gifit-option-height"}, "Height"), 
							React.createElement("input", {
								id: "gifit-option-height", 
								className: "gifit__input", 
								name: "height", 
								type: "number", 
								min: "10", 
								max: "1080", 
								value: this.props.configuration.height}
							)
						)
					), 
					React.createElement("fieldset", null, 
						React.createElement("div", {className: "gifit__inputs"}, 
							React.createElement("label", {className: "gifit__label", for: "gifit-option-framerate"}, "Frame Rate"), 
							React.createElement("input", {
								id: "gifit-option-framerate", 
								className: "gifit__input", 
								name: "framerate", 
								type: "number", 
								min: "1", 
								max: "60", 
								value: this.props.configuration.framerate}
							)
						)
					), 
					React.createElement("fieldset", null, 
						React.createElement("div", {className: "gifit__inputs gifit__inputs--range"}, 
							React.createElement("label", {className: "gifit__label", for: "gifit-option-quality"}, "Quality"), 
							React.createElement("input", {
								id: "gifit-option-quality", 
								className: "gifit__input", 
								name: "quality", 
								type: "range", 
								min: "0", 
								max: "10", 
								value: this.props.configuration.quality}
							)
						)
					), 
					React.createElement("div", {className: "gifit-configuration__actions"}, 
						React.createElement("button", {
							id: "gifit-submit", 
							className: "gifit-configuration__submit gifit__button gifit__button--primary", 
							type: "submit"
						}, 
							React.createElement("span", {
								className: "gifit-logo__gif gifit-logo__gif--primary"
							}, "GIF"), React.createElement("span", {
								className: "gifit-logo__it gifit-logo__it--primary"
							}, "it!")
						)
					)
				)
			)
		);
	},
	_onSubmit: function( event ){
		event.preventDefault();
		this.props.onSubmit( this.state );
	}
});

module.exports = ConfigurationPanel;

},{"react":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\react.js"}],"c:\\Users\\Timothy\\repos\\gifit\\src\\components\\GifitApp.jsx":[function(require,module,exports){
var React = require('react');

var GifService = require('../services/GifService.js');
var ConfigurationPanel = require('./ConfigurationPanel.jsx');
var Progress = require('./Progress.jsx');

var GifitApp = React.createClass({displayName: "GifitApp",
	getInitialState: function(){
		return {
			configuration: {
				start: 0,
				end: 1,
				width: 320,
				height: 240,
				framerate: 10,
				quality: 5
			},
			progress: {
				status: null,
				percent: 0
			},
			image: null
		}
	},
	componentWillMount: function(){
		this._GifService = new GifService({
			source_video: this.props.video_element
		});
		this._GifService.on( 'progress', this._onGifProgress );
		this._GifService.on( 'complete', this._onGifComplete );
	},
	componentWillUnmount: function(){
		this._GifService.remove();
	},
	render: function(){
		return (
			React.createElement("div", {className: "gifit-app gifit"}, 
				React.createElement(ConfigurationPanel, {
					configuration: this.state.configuration, 
					onSubmit: this._onConfigurationSubmit}
				), 
				React.createElement(Progress, {
					status: this.state.progress.status, 
					percent: this.state.progress.percent, 
					image: this.state.image}
				)
			)
		);
	},
	show: function(){

	},
	hide: function(){

	},
	_onConfigurationSubmit: function( configuration ){
		this.setState({
			configuration: configuration
		});
		this._GifService.createGif( configuration );
	},
	_onGifProgress: function( status, percent ){
		this.setState({
			progress: {
				status: status,
				percent: percent
			}
		});
	},
	_onGifComplete: function( image_blob ){
		this.setState({
			image: image_blob
		});
	}
});

module.exports = GifitApp;

},{"../services/GifService.js":"c:\\Users\\Timothy\\repos\\gifit\\src\\services\\GifService.js","./ConfigurationPanel.jsx":"c:\\Users\\Timothy\\repos\\gifit\\src\\components\\ConfigurationPanel.jsx","./Progress.jsx":"c:\\Users\\Timothy\\repos\\gifit\\src\\components\\Progress.jsx","react":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\react.js"}],"c:\\Users\\Timothy\\repos\\gifit\\src\\components\\GifitButton.jsx":[function(require,module,exports){
var React = require('react');

var GifitButton = React.createClass({displayName: "GifitButton",
	render: function(){
		return (
			React.createElement("div", {
				className: "gifit-button gifit-logo", 
				role: "button", 
				onClick: this._onclick
			}, 
				React.createElement("span", {className: "gifit-logo__gif"}, "GIF"), React.createElement("span", {className: "gifit-logo__it"}, "it!")
			)
		);
	},
	_onClick: function( event ){
		event.preventDefault();
		this.props.onClick();
	}
});

module.exports = GifitButton;

},{"react":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\react.js"}],"c:\\Users\\Timothy\\repos\\gifit\\src\\components\\Progress.jsx":[function(require,module,exports){
var React = require('react');

var Progress = React.createClass({displayName: "Progress",
	render: function(){
		var image_url = this.props.image
			? URL.createObjectURL( this.props.image )
			: null;
		return (
			React.createElement("div", {className: "gifit-progress"}, 
				React.createElement("a", {className: "gifit-progress__close", href: "#close"}), 
				React.createElement("div", {className: "gifit-progress__details"}, 
					React.createElement("div", {className: "gifit-progress__status"}, this.props.status), 
					React.createElement("div", {className: "gifit-progress__elements"}, 
						React.createElement("progress", {
							className: "gifit-progress__progress", 
							value: this.props.percent, 
							max: "100"
						}), 
						React.createElement("img", {className: "gifit-progress__result", src: image_url})
					)
				)
			)
		)
	}
});

module.exports = Progress;

},{"react":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\react\\react.js"}],"c:\\Users\\Timothy\\repos\\gifit\\src\\services\\GifService.js":[function(require,module,exports){
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

var GifService = function(){
	EventEmitter.call( this );
};

inherits( GifService, EventEmitter );

module.exports = GifService;

},{"events":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\events\\events.js","util":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\browserify\\node_modules\\util\\util.js"}],"c:\\Users\\Timothy\\repos\\gifit\\src\\styles\\content.less":[function(require,module,exports){
var css = "@font-face {\n  font-family: 'robotoregular';\n  src: url(data:application/font-woff;base64,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) format('woff');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'robotobold';\n  src: url(data:application/font-woff;base64,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) format('woff');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'arizoniaregular';\n  src: url(data:application/x-font-woff;charset=utf-8;base64,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) format('woff');\n  font-weight: normal;\n  font-style: normal;\n}\n.ytp-button-gif {\n  float: right;\n}\n.gifit {\n  font-family: 'robotoregular', sans-serif;\n}\n.gifit a {\n  color: #eb0f0f;\n  transition: transform 150ms, color 100ms;\n}\n.gifit a:hover,\n.gifit a:focus {\n  transform: scale(1.05);\n  color: #f66a6a;\n}\n.gifit a:active {\n  transform: scale(0.95);\n  transition: transform 25ms;\n}\n.gifit fieldset {\n  line-height: 35px;\n}\n.gifit label {\n  text-transform: uppercase;\n  font-size: 10px;\n  font-family: 'robotobold', sans-serif;\n  line-height: 10px;\n}\n.gifit input {\n  outline: none;\n}\n.gifit input[type=\"text\"],\n.gifit input[type=\"number\"] {\n  font-family: 'robotoregular', sans-serif;\n  font-size: 22px;\n  color: rgba(25, 25, 25, 0.8);\n  background: none;\n  transition: background-color 550ms, border-color 550ms;\n  border: #d7d7d7 1px solid;\n  border-radius: 3px;\n  padding: 13px 7px 0 7px;\n}\n.gifit input[type=\"text\"]:focus,\n.gifit input[type=\"number\"]:focus {\n  color: #191919;\n  background-color: rgba(255, 255, 255, 0.75);\n  border-color: #bebebe;\n  transition: background-color 225ms, border-color 225ms;\n}\n.gifit input[type=\"text\"][type=\"number\"]::-webkit-inner-spin-button,\n.gifit input[type=\"number\"][type=\"number\"]::-webkit-inner-spin-button,\n.gifit input[type=\"text\"][type=\"number\"]::-webkit-outer-spin-button,\n.gifit input[type=\"number\"][type=\"number\"]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.gifit input[type=\"range\"] {\n  -webkit-appearance: none;\n  cursor: pointer;\n  vertical-align: middle;\n  margin-top: 0;\n  background: transparent;\n}\n.gifit input[type=\"range\"]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  position: relative;\n  z-index: 2;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #ebebeb;\n  border: #191919 2px solid;\n  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.25);\n  transition: border-width 125ms, background-color 125ms;\n}\n.gifit input[type=\"range\"]::-webkit-slider-runnable-track {\n  position: relative;\n  /* the visible range bar */\n}\n.gifit input[type=\"range\"]::-webkit-slider-runnable-track:after {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 5px;\n  left: 0;\n  z-index: 1;\n  height: 5px;\n  width: 100%;\n  border-radius: 3px;\n  background: #d7d7d7;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25);\n  transition: background-color 125ms;\n}\n.gifit input[type=\"range\"]:active::-webkit-slider-thumb {\n  border-width: 5px;\n}\n.gifit input[type=\"range\"]:focus::-webkit-slider-thumb {\n  background-color: #ffffff;\n}\n.gifit input[type=\"range\"]:focus::-webkit-slider-runnable-track:after {\n  background: #cacaca;\n}\n.gifit fieldset {\n  clear: both;\n  margin-bottom: 10px;\n}\n.gifit progress::-webkit-progress-bar {\n  overflow: hidden;\n  border-radius: 3px;\n  background: #d7d7d7;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25);\n}\n.gifit progress::-webkit-progress-value {\n  background: #191919;\n}\n.gifit__button {\n  cursor: pointer;\n  display: inline-block;\n  padding: 0 10px;\n  font-size: 24px;\n  line-height: 35px;\n  background: #191919;\n  border-radius: 3px;\n  outline: none;\n  transition: transform 150ms, background 100ms, box-shadow 150ms;\n}\n.gifit__button:hover,\n.gifit__button:focus {\n  transform: scale(1.025);\n  background: #333333;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);\n}\n.gifit__button:active {\n  transform: scale(0.95);\n  transition: transform 25ms;\n}\n.gifit__button.gifit__button--primary {\n  background: #eb0f0f;\n}\n.gifit__button.gifit__button--primary:hover,\n.gifit__button.gifit__button--primary:focus {\n  background: #f23b3b;\n}\n.gifit__inputs {\n  position: relative;\n  width: 100%;\n}\n.gifit__inputs.gifit__inputs--range {\n  box-sizing: border-box;\n  padding: 20px 7px 0 7px;\n}\n.gifit__inputs label {\n  position: absolute;\n  top: 5px;\n  left: 7px;\n}\n.gifit__inputs input {\n  display: block;\n  box-sizing: border-box;\n  width: 100%;\n}\n.gifit__fieldset--vertical .gifit__inputs:first-child input {\n  border-radius: 3px 3px 0 0;\n}\n.gifit__fieldset--vertical .gifit__inputs:last-child input {\n  margin-top: -1px;\n  border-radius: 0 0 3px 3px;\n  border-top-color: transparent;\n}\n.gifit__fieldset--vertical .gifit__inputs:last-child input:focus {\n  border-top-color: #bebebe;\n}\n.gifit__fieldset--horizontal .gifit__inputs {\n  width: 50%;\n  float: left;\n}\n.gifit__fieldset--horizontal .gifit__inputs:first-child input {\n  border-radius: 3px 0 0 3px;\n}\n.gifit__fieldset--horizontal .gifit__inputs:last-child input {\n  margin-left: -1px;\n  border-radius: 0 3px 3px 0;\n  border-left-color: transparent;\n}\n.gifit__fieldset--horizontal .gifit__inputs:last-child input:focus {\n  border-left-color: #bebebe;\n}\n.gifit-logo__gif {\n  font-family: 'robotobold', sans-serif;\n}\n.gifit-logo__gif.gifit-logo__gif--primary {\n  color: #ffffff;\n}\n.gifit-logo__it {\n  font-family: 'arizoniaregular', sans-serif;\n  font-size: 125%;\n}\n.gifit-logo__it.gifit-logo__it--primary {\n  color: #ffffff;\n}\n.gifit-button {\n  height: 27px;\n  line-height: 27px;\n  color: #757575;\n}\n.gifit-button:hover {\n  color: #a4a4a4;\n}\n.gifit-configuration {\n  box-sizing: border-box;\n  position: absolute;\n  right: 0;\n  bottom: 35px;\n  z-index: 700;\n  width: 300px;\n  padding: 25px;\n  color: #afafaf;\n  background: rgba(255, 255, 255, 0.9);\n}\n.gifit-configuration__submit {\n  display: block;\n  width: 130px;\n  margin: 25px auto 0 auto;\n}\n.gifit-progress {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  align-items: center;\n  justify-content: center;\n}\n.gifit-progress__close {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  font-size: 24px;\n  text-decoration: none;\n}\n.gifit-progress__close:after {\n  content: '×';\n}\n.gifit-progress__details {\n  width: 80%;\n}\n.gifit-progress__details .gifit-progress__status {\n  padding-bottom: 10px;\n  font-family: 'robotobold', sans-serif;\n  text-align: center;\n}\n.gifit-progress__elements {\n  position: relative;\n  width: 100%;\n  height: 5px;\n  overflow: hidden;\n  transition: width 350ms, height 350ms 250ms;\n}\n.gifit-progress__progress {\n  -webkit-appearance: none;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n.gifit-progress__result {\n  opacity: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  transition: -webkit-filter 1000ms 250ms;\n  -webkit-filter: brightness(0%);\n}\n";(require('lessify'))(css); module.exports = css;
},{"lessify":"c:\\Users\\Timothy\\repos\\gifit\\node_modules\\lessify\\transform.js"}]},{},["./src/content.jsx"]);
