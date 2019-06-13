(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GIF = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        } else {
          // At least give some kind of context to the user
          var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
          err.context = er;
          throw err;
        }
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
          args = Array.prototype.slice.call(arguments, 1);
          handler.apply(this, args);
      }
    } else if (isObject(handler)) {
      args = Array.prototype.slice.call(arguments, 1);
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
    } else if (listeners) {
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
  
  EventEmitter.prototype.listenerCount = function(type) {
    if (this._events) {
      var evlistener = this._events[type];
  
      if (isFunction(evlistener))
        return 1;
      else if (evlistener)
        return evlistener.length;
    }
    return 0;
  };
  
  EventEmitter.listenerCount = function(emitter, type) {
    return emitter.listenerCount(type);
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
  
  },{}],2:[function(require,module,exports){
  
  /* CoffeeScript version of the browser detection from MooTools */
  var UA, browser, mode, platform, ua;
  
  ua = navigator.userAgent.toLowerCase();
  
  platform = navigator.platform.toLowerCase();
  
  UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0];
  
  mode = UA[1] === 'ie' && document.documentMode;
  
  browser = {
    name: UA[1] === 'version' ? UA[3] : UA[1],
    version: mode || parseFloat(UA[1] === 'opera' && UA[4] ? UA[4] : UA[2]),
    platform: {
      name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
    }
  };
  
  browser[browser.name] = true;
  
  browser[browser.name + parseInt(browser.version, 10)] = true;
  
  browser.platform[browser.platform.name] = true;
  
  module.exports = browser;
  
  
  },{}],3:[function(require,module,exports){
  var EventEmitter, GIF, browser,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;
  
  EventEmitter = require('events').EventEmitter;
  
  browser = require('./browser.coffee');
  
  GIF = (function(superClass) {
    var defaults, frameDefaults;
  
    extend(GIF, superClass);
  
    defaults = {
      workerScript: 'gif.worker.js',
      workers: 2,
      repeat: 0,
      background: '#fff',
      quality: 10,
      width: null,
      height: null,
      transparent: null,
      debug: false,
      dither: false
    };
  
    frameDefaults = {
      delay: 500,
      copy: false,
      dispose: -1
    };
  
    function GIF(options) {
      var base, key, value;
      this.running = false;
      this.options = {};
      this.frames = [];
      this.freeWorkers = [];
      this.activeWorkers = [];
      this.setOptions(options);
      for (key in defaults) {
        value = defaults[key];
        if ((base = this.options)[key] == null) {
          base[key] = value;
        }
      }
    }
  
    GIF.prototype.setOption = function(key, value) {
      this.options[key] = value;
      if ((this._canvas != null) && (key === 'width' || key === 'height')) {
        return this._canvas[key] = value;
      }
    };
  
    GIF.prototype.setOptions = function(options) {
      var key, results, value;
      results = [];
      for (key in options) {
        if (!hasProp.call(options, key)) continue;
        value = options[key];
        results.push(this.setOption(key, value));
      }
      return results;
    };
  
    GIF.prototype.addFrame = function(image, options) {
      var frame, key;
      if (options == null) {
        options = {};
      }
      frame = {};
      frame.transparent = this.options.transparent;
      for (key in frameDefaults) {
        frame[key] = options[key] || frameDefaults[key];
      }
      if (this.options.width == null) {
        this.setOption('width', image.width);
      }
      if (this.options.height == null) {
        this.setOption('height', image.height);
      }
      if ((typeof ImageData !== "undefined" && ImageData !== null) && image instanceof ImageData) {
        frame.data = image.data;
      } else if (((typeof CanvasRenderingContext2D !== "undefined" && CanvasRenderingContext2D !== null) && image instanceof CanvasRenderingContext2D) || ((typeof WebGLRenderingContext !== "undefined" && WebGLRenderingContext !== null) && image instanceof WebGLRenderingContext)) {
        if (options.copy) {
          frame.data = this.getContextData(image);
        } else {
          frame.context = image;
        }
      } else if (image.childNodes != null) {
        if (options.copy) {
          frame.data = this.getImageData(image);
        } else {
          frame.image = image;
        }
      } else {
        throw new Error('Invalid image');
      }
      return this.frames.push(frame);
    };
  
    GIF.prototype.render = function() {
      var i, j, numWorkers, ref;
      if (this.running) {
        throw new Error('Already running');
      }
      if ((this.options.width == null) || (this.options.height == null)) {
        throw new Error('Width and height must be set prior to rendering');
      }
      this.running = true;
      this.nextFrame = 0;
      this.finishedFrames = 0;
      this.imageParts = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 0, ref = this.frames.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          results.push(null);
        }
        return results;
      }).call(this);
      numWorkers = this.spawnWorkers();
      if (this.options.globalPalette === true) {
        this.renderNextFrame();
      } else {
        for (i = j = 0, ref = numWorkers; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          this.renderNextFrame();
        }
      }
      this.emit('start');
      return this.emit('progress', 0);
    };
  
    GIF.prototype.abort = function() {
      var worker;
      while (true) {
        worker = this.activeWorkers.shift();
        if (worker == null) {
          break;
        }
        this.log('killing active worker');
        worker.terminate();
      }
      this.running = false;
      return this.emit('abort');
    };
  
    GIF.prototype.spawnWorkers = function() {
      var j, numWorkers, ref, results;
      numWorkers = Math.min(this.options.workers, this.frames.length);
      (function() {
        results = [];
        for (var j = ref = this.freeWorkers.length; ref <= numWorkers ? j < numWorkers : j > numWorkers; ref <= numWorkers ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this).forEach((function(_this) {
        return function(i) {
          var worker;
          _this.log("spawning worker " + i);
          worker = new Worker(_this.options.workerScript);
          worker.onmessage = function(event) {
            _this.activeWorkers.splice(_this.activeWorkers.indexOf(worker), 1);
            _this.freeWorkers.push(worker);
            return _this.frameFinished(event.data);
          };
          return _this.freeWorkers.push(worker);
        };
      })(this));
      return numWorkers;
    };
  
    GIF.prototype.frameFinished = function(frame) {
      var i, j, ref;
      this.log("frame " + frame.index + " finished - " + this.activeWorkers.length + " active");
      this.finishedFrames++;
      this.emit('progress', this.finishedFrames / this.frames.length);
      this.imageParts[frame.index] = frame;
      if (this.options.globalPalette === true) {
        this.options.globalPalette = frame.globalPalette;
        this.log('global palette analyzed');
        if (this.frames.length > 2) {
          for (i = j = 1, ref = this.freeWorkers.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
            this.renderNextFrame();
          }
        }
      }
      if (indexOf.call(this.imageParts, null) >= 0) {
        return this.renderNextFrame();
      } else {
        return this.finishRendering();
      }
    };
  
    GIF.prototype.finishRendering = function() {
      var data, frame, i, image, j, k, l, len, len1, len2, len3, offset, page, ref, ref1, ref2;
      len = 0;
      ref = this.imageParts;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        frame = ref[j];
        len += (frame.data.length - 1) * frame.pageSize + frame.cursor;
      }
      len += frame.pageSize - frame.cursor;
      this.log("rendering finished - filesize " + (Math.round(len / 1000)) + "kb");
      data = new Uint8Array(len);
      offset = 0;
      ref1 = this.imageParts;
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        frame = ref1[k];
        ref2 = frame.data;
        for (i = l = 0, len3 = ref2.length; l < len3; i = ++l) {
          page = ref2[i];
          data.set(page, offset);
          if (i === frame.data.length - 1) {
            offset += frame.cursor;
          } else {
            offset += frame.pageSize;
          }
        }
      }
      image = new Blob([data], {
        type: 'image/gif'
      });
      return this.emit('finished', image, data);
    };
  
    GIF.prototype.renderNextFrame = function() {
      var frame, task, worker;
      if (this.freeWorkers.length === 0) {
        throw new Error('No free workers');
      }
      if (this.nextFrame >= this.frames.length) {
        return;
      }
      frame = this.frames[this.nextFrame++];
      worker = this.freeWorkers.shift();
      task = this.getTask(frame);
      this.log("starting frame " + (task.index + 1) + " of " + this.frames.length);
      this.activeWorkers.push(worker);
      return worker.postMessage(task);
    };
  
    GIF.prototype.getContextData = function(ctx) {
      return ctx.getImageData(0, 0, this.options.width, this.options.height).data;
    };
  
    GIF.prototype.getImageData = function(image) {
      var ctx;
      if (this._canvas == null) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = this.options.width;
        this._canvas.height = this.options.height;
      }
      ctx = this._canvas.getContext('2d');
      ctx.setFill = this.options.background;
      ctx.fillRect(0, 0, this.options.width, this.options.height);
      ctx.drawImage(image, 0, 0);
      return this.getContextData(ctx);
    };
  
    GIF.prototype.getTask = function(frame) {
      var index, task;
      index = this.frames.indexOf(frame);
      task = {
        index: index,
        last: index === (this.frames.length - 1),
        delay: frame.delay,
        dispose: frame.dispose,
        transparent: frame.transparent,
        width: this.options.width,
        height: this.options.height,
        quality: this.options.quality,
        dither: this.options.dither,
        globalPalette: this.options.globalPalette,
        repeat: this.options.repeat,
        canTransfer: browser.name === 'chrome'
      };
      if (frame.data != null) {
        task.data = frame.data;
      } else if (frame.context != null) {
        task.data = this.getContextData(frame.context);
      } else if (frame.image != null) {
        task.data = this.getImageData(frame.image);
      } else {
        throw new Error('Invalid frame');
      }
      return task;
    };
  
    GIF.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!this.options.debug) {
        return;
      }
      return console.log.apply(console, args);
    };
  
    return GIF;
  
  })(EventEmitter);
  
  module.exports = GIF;
  
  
  },{"./browser.coffee":2,"events":1}]},{},[3])(3)
  });
  
  //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsInNyYy9icm93c2VyLmNvZmZlZSIsInNyYy9naWYuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5U0E7QUFBQSxJQUFBOztBQUVBLEVBQUEsR0FBSyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQXBCLENBQUE7O0FBQ0wsUUFBQSxHQUFXLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBbkIsQ0FBQTs7QUFDWCxFQUFBLEdBQUssRUFBRSxDQUFDLEtBQUgsQ0FBUyw2RkFBVCxDQUFBLElBQTJHLENBQUMsSUFBRCxFQUFPLFNBQVAsRUFBa0IsQ0FBbEI7O0FBQ2hILElBQUEsR0FBTyxFQUFHLENBQUEsQ0FBQSxDQUFILEtBQVMsSUFBVCxJQUFpQixRQUFRLENBQUM7O0FBRWpDLE9BQUEsR0FDRTtFQUFBLElBQUEsRUFBUyxFQUFHLENBQUEsQ0FBQSxDQUFILEtBQVMsU0FBWixHQUEyQixFQUFHLENBQUEsQ0FBQSxDQUE5QixHQUFzQyxFQUFHLENBQUEsQ0FBQSxDQUEvQztFQUNBLE9BQUEsRUFBUyxJQUFBLElBQVEsVUFBQSxDQUFjLEVBQUcsQ0FBQSxDQUFBLENBQUgsS0FBUyxPQUFULElBQW9CLEVBQUcsQ0FBQSxDQUFBLENBQTFCLEdBQWtDLEVBQUcsQ0FBQSxDQUFBLENBQXJDLEdBQTZDLEVBQUcsQ0FBQSxDQUFBLENBQTNELENBRGpCO0VBR0EsUUFBQSxFQUNFO0lBQUEsSUFBQSxFQUFTLEVBQUUsQ0FBQyxLQUFILENBQVMsa0JBQVQsQ0FBSCxHQUFxQyxLQUFyQyxHQUFnRCxDQUFDLEVBQUUsQ0FBQyxLQUFILENBQVMsbUJBQVQsQ0FBQSxJQUFpQyxRQUFRLENBQUMsS0FBVCxDQUFlLGVBQWYsQ0FBakMsSUFBb0UsQ0FBQyxPQUFELENBQXJFLENBQWdGLENBQUEsQ0FBQSxDQUF0STtHQUpGOzs7QUFNRixPQUFRLENBQUEsT0FBTyxDQUFDLElBQVIsQ0FBUixHQUF3Qjs7QUFDeEIsT0FBUSxDQUFBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsUUFBQSxDQUFTLE9BQU8sQ0FBQyxPQUFqQixFQUEwQixFQUExQixDQUFmLENBQVIsR0FBd0Q7O0FBQ3hELE9BQU8sQ0FBQyxRQUFTLENBQUEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFqQixDQUFqQixHQUEwQzs7QUFFMUMsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNsQmpCLElBQUEsMEJBQUE7RUFBQTs7Ozs7QUFBQyxlQUFnQixPQUFBLENBQVEsUUFBUjs7QUFDakIsT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUjs7QUFFSjtBQUVKLE1BQUE7Ozs7RUFBQSxRQUFBLEdBQ0U7SUFBQSxZQUFBLEVBQWMsZUFBZDtJQUNBLE9BQUEsRUFBUyxDQURUO0lBRUEsTUFBQSxFQUFRLENBRlI7SUFHQSxVQUFBLEVBQVksTUFIWjtJQUlBLE9BQUEsRUFBUyxFQUpUO0lBS0EsS0FBQSxFQUFPLElBTFA7SUFNQSxNQUFBLEVBQVEsSUFOUjtJQU9BLFdBQUEsRUFBYSxJQVBiO0lBUUEsS0FBQSxFQUFPLEtBUlA7SUFTQSxNQUFBLEVBQVEsS0FUUjs7O0VBV0YsYUFBQSxHQUNFO0lBQUEsS0FBQSxFQUFPLEdBQVA7SUFDQSxJQUFBLEVBQU0sS0FETjtJQUVBLE9BQUEsRUFBUyxDQUFDLENBRlY7OztFQUlXLGFBQUMsT0FBRDtBQUNYLFFBQUE7SUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRVgsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFFVixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFFakIsSUFBQyxDQUFBLFVBQUQsQ0FBWSxPQUFaO0FBQ0EsU0FBQSxlQUFBOzs7WUFDVyxDQUFBLEdBQUEsSUFBUTs7QUFEbkI7RUFWVzs7Z0JBYWIsU0FBQSxHQUFXLFNBQUMsR0FBRCxFQUFNLEtBQU47SUFDVCxJQUFDLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FBVCxHQUFnQjtJQUNoQixJQUFHLHNCQUFBLElBQWMsQ0FBQSxHQUFBLEtBQVEsT0FBUixJQUFBLEdBQUEsS0FBaUIsUUFBakIsQ0FBakI7YUFDRSxJQUFDLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FBVCxHQUFnQixNQURsQjs7RUFGUzs7Z0JBS1gsVUFBQSxHQUFZLFNBQUMsT0FBRDtBQUNWLFFBQUE7QUFBQTtTQUFBLGNBQUE7OzttQkFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLEdBQVgsRUFBZ0IsS0FBaEI7QUFBQTs7RUFEVTs7Z0JBR1osUUFBQSxHQUFVLFNBQUMsS0FBRCxFQUFRLE9BQVI7QUFDUixRQUFBOztNQURnQixVQUFROztJQUN4QixLQUFBLEdBQVE7SUFDUixLQUFLLENBQUMsV0FBTixHQUFvQixJQUFDLENBQUEsT0FBTyxDQUFDO0FBQzdCLFNBQUEsb0JBQUE7TUFDRSxLQUFNLENBQUEsR0FBQSxDQUFOLEdBQWEsT0FBUSxDQUFBLEdBQUEsQ0FBUixJQUFnQixhQUFjLENBQUEsR0FBQTtBQUQ3QztJQUlBLElBQXVDLDBCQUF2QztNQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsT0FBWCxFQUFvQixLQUFLLENBQUMsS0FBMUIsRUFBQTs7SUFDQSxJQUF5QywyQkFBekM7TUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLFFBQVgsRUFBcUIsS0FBSyxDQUFDLE1BQTNCLEVBQUE7O0lBRUEsSUFBRyx3REFBQSxJQUFlLEtBQUEsWUFBaUIsU0FBbkM7TUFDRyxLQUFLLENBQUMsSUFBTixHQUFhLEtBQUssQ0FBQyxLQUR0QjtLQUFBLE1BRUssSUFBRyxDQUFDLHNGQUFBLElBQThCLEtBQUEsWUFBaUIsd0JBQWhELENBQUEsSUFBNkUsQ0FBQyxnRkFBQSxJQUEyQixLQUFBLFlBQWlCLHFCQUE3QyxDQUFoRjtNQUNILElBQUcsT0FBTyxDQUFDLElBQVg7UUFDRSxLQUFLLENBQUMsSUFBTixHQUFhLElBQUMsQ0FBQSxjQUFELENBQWdCLEtBQWhCLEVBRGY7T0FBQSxNQUFBO1FBR0UsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsTUFIbEI7T0FERztLQUFBLE1BS0EsSUFBRyx3QkFBSDtNQUNILElBQUcsT0FBTyxDQUFDLElBQVg7UUFDRSxLQUFLLENBQUMsSUFBTixHQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsS0FBZCxFQURmO09BQUEsTUFBQTtRQUdFLEtBQUssQ0FBQyxLQUFOLEdBQWMsTUFIaEI7T0FERztLQUFBLE1BQUE7QUFNSCxZQUFNLElBQUksS0FBSixDQUFVLGVBQVYsRUFOSDs7V0FRTCxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxLQUFiO0VBekJROztnQkEyQlYsTUFBQSxHQUFRLFNBQUE7QUFDTixRQUFBO0lBQUEsSUFBcUMsSUFBQyxDQUFBLE9BQXRDO0FBQUEsWUFBTSxJQUFJLEtBQUosQ0FBVSxpQkFBVixFQUFOOztJQUVBLElBQU8sNEJBQUosSUFBMkIsNkJBQTlCO0FBQ0UsWUFBTSxJQUFJLEtBQUosQ0FBVSxpREFBVixFQURSOztJQUdBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsU0FBRCxHQUFhO0lBQ2IsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFFbEIsSUFBQyxDQUFBLFVBQUQ7O0FBQWU7V0FBYywyRkFBZDtxQkFBQTtBQUFBOzs7SUFDZixVQUFBLEdBQWEsSUFBQyxDQUFBLFlBQUQsQ0FBQTtJQUViLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULEtBQTBCLElBQTdCO01BQ0UsSUFBQyxDQUFBLGVBQUQsQ0FBQSxFQURGO0tBQUEsTUFBQTtBQUdFLFdBQTRCLG1GQUE1QjtRQUFBLElBQUMsQ0FBQSxlQUFELENBQUE7QUFBQSxPQUhGOztJQUtBLElBQUMsQ0FBQSxJQUFELENBQU0sT0FBTjtXQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sVUFBTixFQUFrQixDQUFsQjtFQW5CTTs7Z0JBcUJSLEtBQUEsR0FBTyxTQUFBO0FBQ0wsUUFBQTtBQUFBLFdBQUEsSUFBQTtNQUNFLE1BQUEsR0FBUyxJQUFDLENBQUEsYUFBYSxDQUFDLEtBQWYsQ0FBQTtNQUNULElBQWEsY0FBYjtBQUFBLGNBQUE7O01BQ0EsSUFBQyxDQUFBLEdBQUQsQ0FBSyx1QkFBTDtNQUNBLE1BQU0sQ0FBQyxTQUFQLENBQUE7SUFKRjtJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7V0FDWCxJQUFDLENBQUEsSUFBRCxDQUFNLE9BQU47RUFQSzs7Z0JBV1AsWUFBQSxHQUFjLFNBQUE7QUFDWixRQUFBO0lBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFsQixFQUEyQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQW5DO0lBQ2I7Ozs7a0JBQWtDLENBQUMsT0FBbkMsQ0FBMkMsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLENBQUQ7QUFDekMsWUFBQTtRQUFBLEtBQUMsQ0FBQSxHQUFELENBQUssa0JBQUEsR0FBb0IsQ0FBekI7UUFDQSxNQUFBLEdBQVMsSUFBSSxNQUFKLENBQVcsS0FBQyxDQUFBLE9BQU8sQ0FBQyxZQUFwQjtRQUNULE1BQU0sQ0FBQyxTQUFQLEdBQW1CLFNBQUMsS0FBRDtVQUNqQixLQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsQ0FBc0IsS0FBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQXVCLE1BQXZCLENBQXRCLEVBQXNELENBQXREO1VBQ0EsS0FBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLE1BQWxCO2lCQUNBLEtBQUMsQ0FBQSxhQUFELENBQWUsS0FBSyxDQUFDLElBQXJCO1FBSGlCO2VBSW5CLEtBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixNQUFsQjtNQVB5QztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0M7QUFRQSxXQUFPO0VBVks7O2dCQVlkLGFBQUEsR0FBZSxTQUFDLEtBQUQ7QUFDYixRQUFBO0lBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxRQUFBLEdBQVUsS0FBSyxDQUFDLEtBQWhCLEdBQXVCLGNBQXZCLEdBQXNDLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBckQsR0FBNkQsU0FBbEU7SUFDQSxJQUFDLENBQUEsY0FBRDtJQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sVUFBTixFQUFrQixJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQTVDO0lBQ0EsSUFBQyxDQUFBLFVBQVcsQ0FBQSxLQUFLLENBQUMsS0FBTixDQUFaLEdBQTJCO0lBRTNCLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULEtBQTBCLElBQTdCO01BQ0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULEdBQXlCLEtBQUssQ0FBQztNQUMvQixJQUFDLENBQUEsR0FBRCxDQUFLLHlCQUFMO01BQ0EsSUFBeUQsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLENBQTFFO0FBQUEsYUFBNEIsZ0dBQTVCO1VBQUEsSUFBQyxDQUFBLGVBQUQsQ0FBQTtBQUFBLFNBQUE7T0FIRjs7SUFJQSxJQUFHLGFBQVEsSUFBQyxDQUFBLFVBQVQsRUFBQSxJQUFBLE1BQUg7YUFDRSxJQUFDLENBQUEsZUFBRCxDQUFBLEVBREY7S0FBQSxNQUFBO2FBR0UsSUFBQyxDQUFBLGVBQUQsQ0FBQSxFQUhGOztFQVZhOztnQkFlZixlQUFBLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsR0FBQSxHQUFNO0FBQ047QUFBQSxTQUFBLHVDQUFBOztNQUNFLEdBQUEsSUFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBWCxHQUFvQixDQUFyQixDQUFBLEdBQTBCLEtBQUssQ0FBQyxRQUFoQyxHQUEyQyxLQUFLLENBQUM7QUFEMUQ7SUFFQSxHQUFBLElBQU8sS0FBSyxDQUFDLFFBQU4sR0FBaUIsS0FBSyxDQUFDO0lBQzlCLElBQUMsQ0FBQSxHQUFELENBQUssZ0NBQUEsR0FBZ0MsQ0FBRSxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQUEsR0FBTSxJQUFqQixDQUFGLENBQWhDLEdBQTBELElBQS9EO0lBQ0EsSUFBQSxHQUFPLElBQUksVUFBSixDQUFlLEdBQWY7SUFDUCxNQUFBLEdBQVM7QUFDVDtBQUFBLFNBQUEsd0NBQUE7O0FBQ0U7QUFBQSxXQUFBLGdEQUFBOztRQUNFLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBVCxFQUFlLE1BQWY7UUFDQSxJQUFHLENBQUEsS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQVgsR0FBb0IsQ0FBNUI7VUFDRSxNQUFBLElBQVUsS0FBSyxDQUFDLE9BRGxCO1NBQUEsTUFBQTtVQUdFLE1BQUEsSUFBVSxLQUFLLENBQUMsU0FIbEI7O0FBRkY7QUFERjtJQVFBLEtBQUEsR0FBUSxJQUFJLElBQUosQ0FBUyxDQUFDLElBQUQsQ0FBVCxFQUNOO01BQUEsSUFBQSxFQUFNLFdBQU47S0FETTtXQUdSLElBQUMsQ0FBQSxJQUFELENBQU0sVUFBTixFQUFrQixLQUFsQixFQUF5QixJQUF6QjtFQW5CZTs7Z0JBcUJqQixlQUFBLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsSUFBcUMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLEtBQXVCLENBQTVEO0FBQUEsWUFBTSxJQUFJLEtBQUosQ0FBVSxpQkFBVixFQUFOOztJQUNBLElBQVUsSUFBQyxDQUFBLFNBQUQsSUFBYyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQWhDO0FBQUEsYUFBQTs7SUFFQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU8sQ0FBQSxJQUFDLENBQUEsU0FBRCxFQUFBO0lBQ2hCLE1BQUEsR0FBUyxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBQTtJQUNULElBQUEsR0FBTyxJQUFDLENBQUEsT0FBRCxDQUFTLEtBQVQ7SUFFUCxJQUFDLENBQUEsR0FBRCxDQUFLLGlCQUFBLEdBQWlCLENBQUUsSUFBSSxDQUFDLEtBQUwsR0FBYSxDQUFmLENBQWpCLEdBQW1DLE1BQW5DLEdBQTBDLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBdkQ7SUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0IsTUFBcEI7V0FDQSxNQUFNLENBQUMsV0FBUCxDQUFtQixJQUFuQjtFQVZlOztnQkFZakIsY0FBQSxHQUFnQixTQUFDLEdBQUQ7QUFDZCxXQUFPLEdBQUcsQ0FBQyxZQUFKLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQXVCLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBaEMsRUFBdUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFoRCxDQUF1RCxDQUFDO0VBRGpEOztnQkFHaEIsWUFBQSxHQUFjLFNBQUMsS0FBRDtBQUNaLFFBQUE7SUFBQSxJQUFPLG9CQUFQO01BQ0UsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxHQUFpQixJQUFDLENBQUEsT0FBTyxDQUFDO01BQzFCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxHQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDLE9BSDdCOztJQUtBLEdBQUEsR0FBTSxJQUFDLENBQUEsT0FBTyxDQUFDLFVBQVQsQ0FBb0IsSUFBcEI7SUFDTixHQUFHLENBQUMsT0FBSixHQUFjLElBQUMsQ0FBQSxPQUFPLENBQUM7SUFDdkIsR0FBRyxDQUFDLFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBNUIsRUFBbUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUE1QztJQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWMsS0FBZCxFQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUVBLFdBQU8sSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsR0FBaEI7RUFYSzs7Z0JBYWQsT0FBQSxHQUFTLFNBQUMsS0FBRDtBQUNQLFFBQUE7SUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLEtBQWhCO0lBQ1IsSUFBQSxHQUNFO01BQUEsS0FBQSxFQUFPLEtBQVA7TUFDQSxJQUFBLEVBQU0sS0FBQSxLQUFTLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLENBQWxCLENBRGY7TUFFQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBRmI7TUFHQSxPQUFBLEVBQVMsS0FBSyxDQUFDLE9BSGY7TUFJQSxXQUFBLEVBQWEsS0FBSyxDQUFDLFdBSm5CO01BS0EsS0FBQSxFQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FMaEI7TUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQU5qQjtNQU9BLE9BQUEsRUFBUyxJQUFDLENBQUEsT0FBTyxDQUFDLE9BUGxCO01BUUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFSakI7TUFTQSxhQUFBLEVBQWUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQVR4QjtNQVVBLE1BQUEsRUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BVmpCO01BV0EsV0FBQSxFQUFjLE9BQU8sQ0FBQyxJQUFSLEtBQWdCLFFBWDlCOztJQWFGLElBQUcsa0JBQUg7TUFDRSxJQUFJLENBQUMsSUFBTCxHQUFZLEtBQUssQ0FBQyxLQURwQjtLQUFBLE1BRUssSUFBRyxxQkFBSDtNQUNILElBQUksQ0FBQyxJQUFMLEdBQVksSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsS0FBSyxDQUFDLE9BQXRCLEVBRFQ7S0FBQSxNQUVBLElBQUcsbUJBQUg7TUFDSCxJQUFJLENBQUMsSUFBTCxHQUFZLElBQUMsQ0FBQSxZQUFELENBQWMsS0FBSyxDQUFDLEtBQXBCLEVBRFQ7S0FBQSxNQUFBO0FBR0gsWUFBTSxJQUFJLEtBQUosQ0FBVSxlQUFWLEVBSEg7O0FBS0wsV0FBTztFQXpCQTs7Z0JBMkJULEdBQUEsR0FBSyxTQUFBO0FBQ0gsUUFBQTtJQURJO0lBQ0osSUFBQSxDQUFjLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBdkI7QUFBQSxhQUFBOztXQUNBLE9BQU8sQ0FBQyxHQUFSLGdCQUFZLElBQVo7RUFGRzs7OztHQTFNVzs7QUErTWxCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiIyMjIENvZmZlZVNjcmlwdCB2ZXJzaW9uIG9mIHRoZSBicm93c2VyIGRldGVjdGlvbiBmcm9tIE1vb1Rvb2xzICMjI1xuXG51YSA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKVxucGxhdGZvcm0gPSBuYXZpZ2F0b3IucGxhdGZvcm0udG9Mb3dlckNhc2UoKVxuVUEgPSB1YS5tYXRjaCgvKG9wZXJhfGllfGZpcmVmb3h8Y2hyb21lfHZlcnNpb24pW1xcc1xcLzpdKFtcXHdcXGRcXC5dKyk/Lio/KHNhZmFyaXx2ZXJzaW9uW1xcc1xcLzpdKFtcXHdcXGRcXC5dKyl8JCkvKSBvciBbbnVsbCwgJ3Vua25vd24nLCAwXVxubW9kZSA9IFVBWzFdID09ICdpZScgJiYgZG9jdW1lbnQuZG9jdW1lbnRNb2RlXG5cbmJyb3dzZXIgPVxuICBuYW1lOiBpZiBVQVsxXSBpcyAndmVyc2lvbicgdGhlbiBVQVszXSBlbHNlIFVBWzFdXG4gIHZlcnNpb246IG1vZGUgb3IgcGFyc2VGbG9hdChpZiBVQVsxXSBpcyAnb3BlcmEnICYmIFVBWzRdIHRoZW4gVUFbNF0gZWxzZSBVQVsyXSlcblxuICBwbGF0Zm9ybTpcbiAgICBuYW1lOiBpZiB1YS5tYXRjaCgvaXAoPzphZHxvZHxob25lKS8pIHRoZW4gJ2lvcycgZWxzZSAodWEubWF0Y2goLyg/OndlYm9zfGFuZHJvaWQpLykgb3IgcGxhdGZvcm0ubWF0Y2goL21hY3x3aW58bGludXgvKSBvciBbJ290aGVyJ10pWzBdXG5cbmJyb3dzZXJbYnJvd3Nlci5uYW1lXSA9IHRydWVcbmJyb3dzZXJbYnJvd3Nlci5uYW1lICsgcGFyc2VJbnQoYnJvd3Nlci52ZXJzaW9uLCAxMCldID0gdHJ1ZVxuYnJvd3Nlci5wbGF0Zm9ybVticm93c2VyLnBsYXRmb3JtLm5hbWVdID0gdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJyb3dzZXJcbiIsIntFdmVudEVtaXR0ZXJ9ID0gcmVxdWlyZSAnZXZlbnRzJ1xuYnJvd3NlciA9IHJlcXVpcmUgJy4vYnJvd3Nlci5jb2ZmZWUnXG5cbmNsYXNzIEdJRiBleHRlbmRzIEV2ZW50RW1pdHRlclxuXG4gIGRlZmF1bHRzID1cbiAgICB3b3JrZXJTY3JpcHQ6ICdnaWYud29ya2VyLmpzJ1xuICAgIHdvcmtlcnM6IDJcbiAgICByZXBlYXQ6IDAgIyByZXBlYXQgZm9yZXZlciwgLTEgPSByZXBlYXQgb25jZVxuICAgIGJhY2tncm91bmQ6ICcjZmZmJ1xuICAgIHF1YWxpdHk6IDEwICMgcGl4ZWwgc2FtcGxlIGludGVydmFsLCBsb3dlciBpcyBiZXR0ZXJcbiAgICB3aWR0aDogbnVsbCAjIHNpemUgZGVyZXJtaW5lZCBmcm9tIGZpcnN0IGZyYW1lIGlmIHBvc3NpYmxlXG4gICAgaGVpZ2h0OiBudWxsXG4gICAgdHJhbnNwYXJlbnQ6IG51bGxcbiAgICBkZWJ1ZzogZmFsc2VcbiAgICBkaXRoZXI6IGZhbHNlICMgc2VlIEdJRkVuY29kZXIuanMgZm9yIGRpdGhlcmluZyBvcHRpb25zXG5cbiAgZnJhbWVEZWZhdWx0cyA9XG4gICAgZGVsYXk6IDUwMCAjIG1zXG4gICAgY29weTogZmFsc2VcbiAgICBkaXNwb3NlOiAtMVxuXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICBAcnVubmluZyA9IGZhbHNlXG5cbiAgICBAb3B0aW9ucyA9IHt9XG4gICAgQGZyYW1lcyA9IFtdXG5cbiAgICBAZnJlZVdvcmtlcnMgPSBbXVxuICAgIEBhY3RpdmVXb3JrZXJzID0gW11cblxuICAgIEBzZXRPcHRpb25zIG9wdGlvbnNcbiAgICBmb3Iga2V5LCB2YWx1ZSBvZiBkZWZhdWx0c1xuICAgICAgQG9wdGlvbnNba2V5XSA/PSB2YWx1ZVxuXG4gIHNldE9wdGlvbjogKGtleSwgdmFsdWUpIC0+XG4gICAgQG9wdGlvbnNba2V5XSA9IHZhbHVlXG4gICAgaWYgQF9jYW52YXM/IGFuZCBrZXkgaW4gWyd3aWR0aCcsICdoZWlnaHQnXVxuICAgICAgQF9jYW52YXNba2V5XSA9IHZhbHVlXG5cbiAgc2V0T3B0aW9uczogKG9wdGlvbnMpIC0+XG4gICAgQHNldE9wdGlvbiBrZXksIHZhbHVlIGZvciBvd24ga2V5LCB2YWx1ZSBvZiBvcHRpb25zXG5cbiAgYWRkRnJhbWU6IChpbWFnZSwgb3B0aW9ucz17fSkgLT5cbiAgICBmcmFtZSA9IHt9XG4gICAgZnJhbWUudHJhbnNwYXJlbnQgPSBAb3B0aW9ucy50cmFuc3BhcmVudFxuICAgIGZvciBrZXkgb2YgZnJhbWVEZWZhdWx0c1xuICAgICAgZnJhbWVba2V5XSA9IG9wdGlvbnNba2V5XSBvciBmcmFtZURlZmF1bHRzW2tleV1cblxuICAgICMgdXNlIHRoZSBpbWFnZXMgd2lkdGggYW5kIGhlaWdodCBmb3Igb3B0aW9ucyB1bmxlc3MgYWxyZWFkeSBzZXRcbiAgICBAc2V0T3B0aW9uICd3aWR0aCcsIGltYWdlLndpZHRoIHVubGVzcyBAb3B0aW9ucy53aWR0aD9cbiAgICBAc2V0T3B0aW9uICdoZWlnaHQnLCBpbWFnZS5oZWlnaHQgdW5sZXNzIEBvcHRpb25zLmhlaWdodD9cblxuICAgIGlmIEltYWdlRGF0YT8gYW5kIGltYWdlIGluc3RhbmNlb2YgSW1hZ2VEYXRhXG4gICAgICAgZnJhbWUuZGF0YSA9IGltYWdlLmRhdGFcbiAgICBlbHNlIGlmIChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ/IGFuZCBpbWFnZSBpbnN0YW5jZW9mIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkgb3IgKFdlYkdMUmVuZGVyaW5nQ29udGV4dD8gYW5kIGltYWdlIGluc3RhbmNlb2YgV2ViR0xSZW5kZXJpbmdDb250ZXh0KVxuICAgICAgaWYgb3B0aW9ucy5jb3B5XG4gICAgICAgIGZyYW1lLmRhdGEgPSBAZ2V0Q29udGV4dERhdGEgaW1hZ2VcbiAgICAgIGVsc2VcbiAgICAgICAgZnJhbWUuY29udGV4dCA9IGltYWdlXG4gICAgZWxzZSBpZiBpbWFnZS5jaGlsZE5vZGVzP1xuICAgICAgaWYgb3B0aW9ucy5jb3B5XG4gICAgICAgIGZyYW1lLmRhdGEgPSBAZ2V0SW1hZ2VEYXRhIGltYWdlXG4gICAgICBlbHNlXG4gICAgICAgIGZyYW1lLmltYWdlID0gaW1hZ2VcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ0ludmFsaWQgaW1hZ2UnXG5cbiAgICBAZnJhbWVzLnB1c2ggZnJhbWVcblxuICByZW5kZXI6IC0+XG4gICAgdGhyb3cgbmV3IEVycm9yICdBbHJlYWR5IHJ1bm5pbmcnIGlmIEBydW5uaW5nXG5cbiAgICBpZiBub3QgQG9wdGlvbnMud2lkdGg/IG9yIG5vdCBAb3B0aW9ucy5oZWlnaHQ/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ1dpZHRoIGFuZCBoZWlnaHQgbXVzdCBiZSBzZXQgcHJpb3IgdG8gcmVuZGVyaW5nJ1xuXG4gICAgQHJ1bm5pbmcgPSB0cnVlXG4gICAgQG5leHRGcmFtZSA9IDBcbiAgICBAZmluaXNoZWRGcmFtZXMgPSAwXG5cbiAgICBAaW1hZ2VQYXJ0cyA9IChudWxsIGZvciBpIGluIFswLi4uQGZyYW1lcy5sZW5ndGhdKVxuICAgIG51bVdvcmtlcnMgPSBAc3Bhd25Xb3JrZXJzKClcbiAgICAjIHdlIG5lZWQgdG8gd2FpdCBmb3IgdGhlIHBhbGV0dGVcbiAgICBpZiBAb3B0aW9ucy5nbG9iYWxQYWxldHRlID09IHRydWVcbiAgICAgIEByZW5kZXJOZXh0RnJhbWUoKVxuICAgIGVsc2VcbiAgICAgIEByZW5kZXJOZXh0RnJhbWUoKSBmb3IgaSBpbiBbMC4uLm51bVdvcmtlcnNdXG5cbiAgICBAZW1pdCAnc3RhcnQnXG4gICAgQGVtaXQgJ3Byb2dyZXNzJywgMFxuXG4gIGFib3J0OiAtPlxuICAgIGxvb3BcbiAgICAgIHdvcmtlciA9IEBhY3RpdmVXb3JrZXJzLnNoaWZ0KClcbiAgICAgIGJyZWFrIHVubGVzcyB3b3JrZXI/XG4gICAgICBAbG9nICdraWxsaW5nIGFjdGl2ZSB3b3JrZXInXG4gICAgICB3b3JrZXIudGVybWluYXRlKClcbiAgICBAcnVubmluZyA9IGZhbHNlXG4gICAgQGVtaXQgJ2Fib3J0J1xuXG4gICMgcHJpdmF0ZVxuXG4gIHNwYXduV29ya2VyczogLT5cbiAgICBudW1Xb3JrZXJzID0gTWF0aC5taW4oQG9wdGlvbnMud29ya2VycywgQGZyYW1lcy5sZW5ndGgpXG4gICAgW0BmcmVlV29ya2Vycy5sZW5ndGguLi5udW1Xb3JrZXJzXS5mb3JFYWNoIChpKSA9PlxuICAgICAgQGxvZyBcInNwYXduaW5nIHdvcmtlciAjeyBpIH1cIlxuICAgICAgd29ya2VyID0gbmV3IFdvcmtlciBAb3B0aW9ucy53b3JrZXJTY3JpcHRcbiAgICAgIHdvcmtlci5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+XG4gICAgICAgIEBhY3RpdmVXb3JrZXJzLnNwbGljZSBAYWN0aXZlV29ya2Vycy5pbmRleE9mKHdvcmtlciksIDFcbiAgICAgICAgQGZyZWVXb3JrZXJzLnB1c2ggd29ya2VyXG4gICAgICAgIEBmcmFtZUZpbmlzaGVkIGV2ZW50LmRhdGFcbiAgICAgIEBmcmVlV29ya2Vycy5wdXNoIHdvcmtlclxuICAgIHJldHVybiBudW1Xb3JrZXJzXG5cbiAgZnJhbWVGaW5pc2hlZDogKGZyYW1lKSAtPlxuICAgIEBsb2cgXCJmcmFtZSAjeyBmcmFtZS5pbmRleCB9IGZpbmlzaGVkIC0gI3sgQGFjdGl2ZVdvcmtlcnMubGVuZ3RoIH0gYWN0aXZlXCJcbiAgICBAZmluaXNoZWRGcmFtZXMrK1xuICAgIEBlbWl0ICdwcm9ncmVzcycsIEBmaW5pc2hlZEZyYW1lcyAvIEBmcmFtZXMubGVuZ3RoXG4gICAgQGltYWdlUGFydHNbZnJhbWUuaW5kZXhdID0gZnJhbWVcbiAgICAjIHJlbWVtYmVyIGNhbGN1bGF0ZWQgcGFsZXR0ZSwgc3Bhd24gdGhlIHJlc3Qgb2YgdGhlIHdvcmtlcnNcbiAgICBpZiBAb3B0aW9ucy5nbG9iYWxQYWxldHRlID09IHRydWVcbiAgICAgIEBvcHRpb25zLmdsb2JhbFBhbGV0dGUgPSBmcmFtZS5nbG9iYWxQYWxldHRlXG4gICAgICBAbG9nICdnbG9iYWwgcGFsZXR0ZSBhbmFseXplZCdcbiAgICAgIEByZW5kZXJOZXh0RnJhbWUoKSBmb3IgaSBpbiBbMS4uLkBmcmVlV29ya2Vycy5sZW5ndGhdIGlmIEBmcmFtZXMubGVuZ3RoID4gMlxuICAgIGlmIG51bGwgaW4gQGltYWdlUGFydHNcbiAgICAgIEByZW5kZXJOZXh0RnJhbWUoKVxuICAgIGVsc2VcbiAgICAgIEBmaW5pc2hSZW5kZXJpbmcoKVxuXG4gIGZpbmlzaFJlbmRlcmluZzogLT5cbiAgICBsZW4gPSAwXG4gICAgZm9yIGZyYW1lIGluIEBpbWFnZVBhcnRzXG4gICAgICBsZW4gKz0gKGZyYW1lLmRhdGEubGVuZ3RoIC0gMSkgKiBmcmFtZS5wYWdlU2l6ZSArIGZyYW1lLmN1cnNvclxuICAgIGxlbiArPSBmcmFtZS5wYWdlU2l6ZSAtIGZyYW1lLmN1cnNvclxuICAgIEBsb2cgXCJyZW5kZXJpbmcgZmluaXNoZWQgLSBmaWxlc2l6ZSAjeyBNYXRoLnJvdW5kKGxlbiAvIDEwMDApIH1rYlwiXG4gICAgZGF0YSA9IG5ldyBVaW50OEFycmF5IGxlblxuICAgIG9mZnNldCA9IDBcbiAgICBmb3IgZnJhbWUgaW4gQGltYWdlUGFydHNcbiAgICAgIGZvciBwYWdlLCBpIGluIGZyYW1lLmRhdGFcbiAgICAgICAgZGF0YS5zZXQgcGFnZSwgb2Zmc2V0XG4gICAgICAgIGlmIGkgaXMgZnJhbWUuZGF0YS5sZW5ndGggLSAxXG4gICAgICAgICAgb2Zmc2V0ICs9IGZyYW1lLmN1cnNvclxuICAgICAgICBlbHNlXG4gICAgICAgICAgb2Zmc2V0ICs9IGZyYW1lLnBhZ2VTaXplXG5cbiAgICBpbWFnZSA9IG5ldyBCbG9iIFtkYXRhXSxcbiAgICAgIHR5cGU6ICdpbWFnZS9naWYnXG5cbiAgICBAZW1pdCAnZmluaXNoZWQnLCBpbWFnZSwgZGF0YVxuXG4gIHJlbmRlck5leHRGcmFtZTogLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IgJ05vIGZyZWUgd29ya2VycycgaWYgQGZyZWVXb3JrZXJzLmxlbmd0aCBpcyAwXG4gICAgcmV0dXJuIGlmIEBuZXh0RnJhbWUgPj0gQGZyYW1lcy5sZW5ndGggIyBubyBuZXcgZnJhbWUgdG8gcmVuZGVyXG5cbiAgICBmcmFtZSA9IEBmcmFtZXNbQG5leHRGcmFtZSsrXVxuICAgIHdvcmtlciA9IEBmcmVlV29ya2Vycy5zaGlmdCgpXG4gICAgdGFzayA9IEBnZXRUYXNrIGZyYW1lXG5cbiAgICBAbG9nIFwic3RhcnRpbmcgZnJhbWUgI3sgdGFzay5pbmRleCArIDEgfSBvZiAjeyBAZnJhbWVzLmxlbmd0aCB9XCJcbiAgICBAYWN0aXZlV29ya2Vycy5wdXNoIHdvcmtlclxuICAgIHdvcmtlci5wb3N0TWVzc2FnZSB0YXNrIywgW3Rhc2suZGF0YS5idWZmZXJdXG5cbiAgZ2V0Q29udGV4dERhdGE6IChjdHgpIC0+XG4gICAgcmV0dXJuIGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgQG9wdGlvbnMud2lkdGgsIEBvcHRpb25zLmhlaWdodCkuZGF0YVxuXG4gIGdldEltYWdlRGF0YTogKGltYWdlKSAtPlxuICAgIGlmIG5vdCBAX2NhbnZhcz9cbiAgICAgIEBfY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnY2FudmFzJ1xuICAgICAgQF9jYW52YXMud2lkdGggPSBAb3B0aW9ucy53aWR0aFxuICAgICAgQF9jYW52YXMuaGVpZ2h0ID0gQG9wdGlvbnMuaGVpZ2h0XG5cbiAgICBjdHggPSBAX2NhbnZhcy5nZXRDb250ZXh0ICcyZCdcbiAgICBjdHguc2V0RmlsbCA9IEBvcHRpb25zLmJhY2tncm91bmRcbiAgICBjdHguZmlsbFJlY3QgMCwgMCwgQG9wdGlvbnMud2lkdGgsIEBvcHRpb25zLmhlaWdodFxuICAgIGN0eC5kcmF3SW1hZ2UgaW1hZ2UsIDAsIDBcblxuICAgIHJldHVybiBAZ2V0Q29udGV4dERhdGEgY3R4XG5cbiAgZ2V0VGFzazogKGZyYW1lKSAtPlxuICAgIGluZGV4ID0gQGZyYW1lcy5pbmRleE9mIGZyYW1lXG4gICAgdGFzayA9XG4gICAgICBpbmRleDogaW5kZXhcbiAgICAgIGxhc3Q6IGluZGV4IGlzIChAZnJhbWVzLmxlbmd0aCAtIDEpXG4gICAgICBkZWxheTogZnJhbWUuZGVsYXlcbiAgICAgIGRpc3Bvc2U6IGZyYW1lLmRpc3Bvc2VcbiAgICAgIHRyYW5zcGFyZW50OiBmcmFtZS50cmFuc3BhcmVudFxuICAgICAgd2lkdGg6IEBvcHRpb25zLndpZHRoXG4gICAgICBoZWlnaHQ6IEBvcHRpb25zLmhlaWdodFxuICAgICAgcXVhbGl0eTogQG9wdGlvbnMucXVhbGl0eVxuICAgICAgZGl0aGVyOiBAb3B0aW9ucy5kaXRoZXJcbiAgICAgIGdsb2JhbFBhbGV0dGU6IEBvcHRpb25zLmdsb2JhbFBhbGV0dGVcbiAgICAgIHJlcGVhdDogQG9wdGlvbnMucmVwZWF0XG4gICAgICBjYW5UcmFuc2ZlcjogKGJyb3dzZXIubmFtZSBpcyAnY2hyb21lJylcblxuICAgIGlmIGZyYW1lLmRhdGE/XG4gICAgICB0YXNrLmRhdGEgPSBmcmFtZS5kYXRhXG4gICAgZWxzZSBpZiBmcmFtZS5jb250ZXh0P1xuICAgICAgdGFzay5kYXRhID0gQGdldENvbnRleHREYXRhIGZyYW1lLmNvbnRleHRcbiAgICBlbHNlIGlmIGZyYW1lLmltYWdlP1xuICAgICAgdGFzay5kYXRhID0gQGdldEltYWdlRGF0YSBmcmFtZS5pbWFnZVxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvciAnSW52YWxpZCBmcmFtZSdcblxuICAgIHJldHVybiB0YXNrXG5cbiAgbG9nOiAoYXJncy4uLikgLT5cbiAgICByZXR1cm4gdW5sZXNzIEBvcHRpb25zLmRlYnVnXG4gICAgY29uc29sZS5sb2cgYXJncy4uLlxuXG5cbm1vZHVsZS5leHBvcnRzID0gR0lGXG4iXX0=
  