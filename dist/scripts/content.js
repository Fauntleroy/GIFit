(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(c){function a(b,d){if({}.hasOwnProperty.call(a.cache,b))return a.cache[b];var e=a.resolve(b);if(!e)throw new Error('Failed to resolve module '+b);var c={id:b,require:a,filename:b,exports:{},loaded:!1,parent:d,children:[]};d&&d.children.push(c);var f=b.slice(0,b.lastIndexOf('/')+1);return a.cache[b]=c.exports,e.call(c.exports,c,c.exports,f,b),c.loaded=!0,a.cache[b]=c.exports}a.modules={},a.cache={},a.resolve=function(b){return{}.hasOwnProperty.call(a.modules,b)?a.modules[b]:void 0},a.define=function(b,c){a.modules[b]=c};var b=function(a){return a='/',{title:'browser',version:'v0.10.26',browser:!0,env:{},argv:[],nextTick:c.setImmediate||function(a){setTimeout(a,0)},cwd:function(){return a},chdir:function(b){a=b}}}();a.define('/gif.coffee',function(d,m,l,k){function g(a,b){return{}.hasOwnProperty.call(a,b)}function j(d,b){for(var a=0,c=b.length;a<c;++a)if(a in b&&b[a]===d)return!0;return!1}function i(a,b){function d(){this.constructor=a}for(var c in b)g(b,c)&&(a[c]=b[c]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a}var h,c,f,b,e;f=a('events',d).EventEmitter,h=a('/browser.coffee',d),e=function(d){function a(d){var a,b;this.running=!1,this.options={},this.frames=[],this.freeWorkers=[],this.activeWorkers=[],this.setOptions(d);for(a in c)b=c[a],null!=this.options[a]?this.options[a]:this.options[a]=b}return i(a,d),c={workerScript:'gif.worker.js',workers:2,repeat:0,background:'#fff',quality:10,width:null,height:null,transparent:null},b={delay:500,copy:!1},a.prototype.setOption=function(a,b){return this.options[a]=b,null!=this._canvas&&(a==='width'||a==='height')?this._canvas[a]=b:void 0},a.prototype.setOptions=function(b){var a,c;return function(d){for(a in b){if(!g(b,a))continue;c=b[a],d.push(this.setOption(a,c))}return d}.call(this,[])},a.prototype.addFrame=function(a,d){var c,e;null==d&&(d={}),c={},c.transparent=this.options.transparent;for(e in b)c[e]=d[e]||b[e];if(null!=this.options.width||this.setOption('width',a.width),null!=this.options.height||this.setOption('height',a.height),'undefined'!==typeof ImageData&&null!=ImageData&&a instanceof ImageData)c.data=a.data;else if('undefined'!==typeof CanvasRenderingContext2D&&null!=CanvasRenderingContext2D&&a instanceof CanvasRenderingContext2D||'undefined'!==typeof WebGLRenderingContext&&null!=WebGLRenderingContext&&a instanceof WebGLRenderingContext)d.copy?c.data=this.getContextData(a):c.context=a;else if(null!=a.childNodes)d.copy?c.data=this.getImageData(a):c.image=a;else throw new Error('Invalid image');return this.frames.push(c)},a.prototype.render=function(){var d,a;if(this.running)throw new Error('Already running');if(!(null!=this.options.width&&null!=this.options.height))throw new Error('Width and height must be set prior to rendering');this.running=!0,this.nextFrame=0,this.finishedFrames=0,this.imageParts=function(c){for(var b=function(){var b;b=[];for(var a=0;0<=this.frames.length?a<this.frames.length:a>this.frames.length;0<=this.frames.length?++a:--a)b.push(a);return b}.apply(this,arguments),a=0,e=b.length;a<e;++a)d=b[a],c.push(null);return c}.call(this,[]),a=this.spawnWorkers();for(var c=function(){var c;c=[];for(var b=0;0<=a?b<a:b>a;0<=a?++b:--b)c.push(b);return c}.apply(this,arguments),b=0,e=c.length;b<e;++b)d=c[b],this.renderNextFrame();return this.emit('start'),this.emit('progress',0)},a.prototype.abort=function(){var a;while(!0){if(a=this.activeWorkers.shift(),!(null!=a))break;console.log('killing active worker'),a.terminate()}return this.running=!1,this.emit('abort')},a.prototype.spawnWorkers=function(){var a;return a=Math.min(this.options.workers,this.frames.length),function(){var c;c=[];for(var b=this.freeWorkers.length;this.freeWorkers.length<=a?b<a:b>a;this.freeWorkers.length<=a?++b:--b)c.push(b);return c}.apply(this,arguments).forEach(function(a){return function(c){var b;return console.log('spawning worker '+c),b=new Worker(a.options.workerScript),b.onmessage=function(a){return function(c){return a.activeWorkers.splice(a.activeWorkers.indexOf(b),1),a.freeWorkers.push(b),a.frameFinished(c.data)}}(a),a.freeWorkers.push(b)}}(this)),a},a.prototype.frameFinished=function(a){return console.log('frame '+a.index+' finished - '+this.activeWorkers.length+' active'),this.finishedFrames++,this.emit('progress',this.finishedFrames/this.frames.length),this.imageParts[a.index]=a,j(null,this.imageParts)?this.renderNextFrame():this.finishRendering()},a.prototype.finishRendering=function(){var e,a,k,m,b,d,h;b=0;for(var f=0,j=this.imageParts.length;f<j;++f)a=this.imageParts[f],b+=(a.data.length-1)*a.pageSize+a.cursor;b+=a.pageSize-a.cursor,console.log('rendering finished - filesize '+Math.round(b/1e3)+'kb'),e=new Uint8Array(b),d=0;for(var g=0,l=this.imageParts.length;g<l;++g){a=this.imageParts[g];for(var c=0,i=a.data.length;c<i;++c)h=a.data[c],k=c,e.set(h,d),k===a.data.length-1?d+=a.cursor:d+=a.pageSize}return m=new Blob([e],{type:'image/gif'}),this.emit('finished',m,e)},a.prototype.renderNextFrame=function(){var c,a,b;if(this.freeWorkers.length===0)throw new Error('No free workers');return this.nextFrame>=this.frames.length?void 0:(c=this.frames[this.nextFrame++],b=this.freeWorkers.shift(),a=this.getTask(c),console.log('starting frame '+(a.index+1)+' of '+this.frames.length),this.activeWorkers.push(b),b.postMessage(a))},a.prototype.getContextData=function(a){return a.getImageData(0,0,this.options.width,this.options.height).data},a.prototype.getImageData=function(b){var a;return null!=this._canvas||(this._canvas=document.createElement('canvas'),this._canvas.width=this.options.width,this._canvas.height=this.options.height),a=this._canvas.getContext('2d'),a.setFill=this.options.background,a.fillRect(0,0,this.options.width,this.options.height),a.drawImage(b,0,0),this.getContextData(a)},a.prototype.getTask=function(a){var c,b;if(c=this.frames.indexOf(a),b={index:c,last:c===this.frames.length-1,delay:a.delay,transparent:a.transparent,width:this.options.width,height:this.options.height,quality:this.options.quality,repeat:this.options.repeat,canTransfer:h.name==='chrome'},null!=a.data)b.data=a.data;else if(null!=a.context)b.data=this.getContextData(a.context);else if(null!=a.image)b.data=this.getImageData(a.image);else throw new Error('Invalid frame');return b},a}(f),d.exports=e}),a.define('/browser.coffee',function(f,g,h,i){var a,d,e,c,b;c=navigator.userAgent.toLowerCase(),e=navigator.platform.toLowerCase(),b=c.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/)||[null,'unknown',0],d=b[1]==='ie'&&document.documentMode,a={name:b[1]==='version'?b[3]:b[1],version:d||parseFloat(b[1]==='opera'&&b[4]?b[4]:b[2]),platform:{name:c.match(/ip(?:ad|od|hone)/)?'ios':(c.match(/(?:webos|android)/)||e.match(/mac|win|linux/)||['other'])[0]}},a[a.name]=!0,a[a.name+parseInt(a.version,10)]=!0,a.platform[a.platform.name]=!0,f.exports=a}),a.define('events',function(f,e,g,h){b.EventEmitter||(b.EventEmitter=function(){});var a=e.EventEmitter=b.EventEmitter,c=typeof Array.isArray==='function'?Array.isArray:function(a){return Object.prototype.toString.call(a)==='[object Array]'},d=10;a.prototype.setMaxListeners=function(a){this._events||(this._events={}),this._events.maxListeners=a},a.prototype.emit=function(f){if(f==='error'&&(!(this._events&&this._events.error)||c(this._events.error)&&!this._events.error.length))throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");if(!this._events)return!1;var a=this._events[f];if(!a)return!1;if(!(typeof a=='function'))if(c(a)){var b=Array.prototype.slice.call(arguments,1),e=a.slice();for(var d=0,g=e.length;d<g;d++)e[d].apply(this,b);return!0}else return!1;switch(arguments.length){case 1:a.call(this);break;case 2:a.call(this,arguments[1]);break;case 3:a.call(this,arguments[1],arguments[2]);break;default:var b=Array.prototype.slice.call(arguments,1);a.apply(this,b)}return!0},a.prototype.addListener=function(a,b){if('function'!==typeof b)throw new Error('addListener only takes instances of Function');if(this._events||(this._events={}),this.emit('newListener',a,b),!this._events[a])this._events[a]=b;else if(c(this._events[a])){if(!this._events[a].warned){var e;this._events.maxListeners!==undefined?e=this._events.maxListeners:e=d,e&&e>0&&this._events[a].length>e&&(this._events[a].warned=!0,console.error('(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',this._events[a].length),console.trace())}this._events[a].push(b)}else this._events[a]=[this._events[a],b];return this},a.prototype.on=a.prototype.addListener,a.prototype.once=function(b,c){var a=this;return a.on(b,function d(){a.removeListener(b,d),c.apply(this,arguments)}),this},a.prototype.removeListener=function(a,d){if('function'!==typeof d)throw new Error('removeListener only takes instances of Function');if(!(this._events&&this._events[a]))return this;var b=this._events[a];if(c(b)){var e=b.indexOf(d);if(e<0)return this;b.splice(e,1),b.length==0&&delete this._events[a]}else this._events[a]===d&&delete this._events[a];return this},a.prototype.removeAllListeners=function(a){return a&&this._events&&this._events[a]&&(this._events[a]=null),this},a.prototype.listeners=function(a){return this._events||(this._events={}),this._events[a]||(this._events[a]=[]),c(this._events[a])||(this._events[a]=[this._events[a]]),this._events[a]}}),c.GIF=a('/gif.coffee')}.call(this,this))
//# sourceMappingURL=gif.js.map
// gif.js 0.1.6 - https://github.com/jnordberg/gif.js

},{}],2:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":3,"./handlebars/exception":4,"./handlebars/runtime":5,"./handlebars/safe-string":6,"./handlebars/utils":7}],3:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":4,"./utils":7}],4:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],5:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":3,"./exception":4,"./utils":7}],6:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],7:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":6}],8:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":2}],9:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":8}],10:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.1.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:11Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
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
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
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

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

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

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return !jQuery.isArray( obj ) && obj - parseFloat( obj ) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android < 4.0, iOS < 6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
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
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
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
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
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
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
(function( window ) {

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
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
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
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
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
		return (cache[ key + " " ] = value);
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
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
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
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
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
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
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
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowclip^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
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
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
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
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
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
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
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
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
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
		while ( (elem = results[i++]) ) {
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
		while ( (node = elem[i++]) ) {
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
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
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
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
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

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
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
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
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
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
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
			return !Expr.pseudos["empty"]( elem );
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
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

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
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
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
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
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
		if ( (elem = unmatched[i]) ) {
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
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

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
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
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
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
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
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
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
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
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
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
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
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

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
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

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
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
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
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
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
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
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
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
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
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
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
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
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


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
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
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

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
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

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

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
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
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
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
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
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
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
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

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
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
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	// Support: Windows Web Apps (WWA)
	// `name` and `type` need .setAttribute for WWA
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE9-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
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
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

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
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
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
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

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
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
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
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
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
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
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
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
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
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
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
				// Support: Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
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

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
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
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
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
			return this;
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
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
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
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
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

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
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

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
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
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
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

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
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

				value = value.replace( rxhtmlTag, "<$1></$2>" );

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
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
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

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') in IE9, see #12537
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

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
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {
				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {
				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({
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
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
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
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
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
	},
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

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
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

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
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
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
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
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
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

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
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

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
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
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
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
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
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
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

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
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
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
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

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
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
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
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

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
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

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
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

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
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

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
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
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
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
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
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
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
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
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
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
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
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
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
			xml: /xml/,
			html: /html/,
			json: /json/
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
			"text json": jQuery.parseJSON,

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
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
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
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
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
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

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
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
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

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
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
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
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
					jQuery.event.trigger("ajaxStop");
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
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
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
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

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
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

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
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

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
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
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

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
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
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




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
	});
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

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
module.exports = require('cssify');

},{"cssify":11}],13:[function(require,module,exports){
/*! VelocityJS.org (1.0.0). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

/*************************
   Velocity jQuery Shim
*************************/

/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */

/* This file contains the jQuery functions that Velocity relies on, thereby removing Velocity's dependency on a full copy of jQuery, and allowing it to work in any environment. */
/* These shimmed functions are only used if jQuery isn't present. If both this shim and jQuery are loaded, Velocity defaults to jQuery proper. */
/* Browser support: Using this shim instead of jQuery proper removes support for IE8. */

;(function (window) {
    /***************
         Setup
    ***************/

    /* If jQuery is already loaded, there's no point in loading this shim. */
    if (window.jQuery) {
        return;
    }

    /* jQuery base. */
    var $ = function (selector, context) {
        return new $.fn.init(selector, context);
    };

    /********************
       Private Methods
    ********************/

    /* jQuery */
    $.isWindow = function (obj) {
        /* jshint eqeqeq: false */
        return obj != null && obj == obj.window;
    };

    /* jQuery */
    $.type = function (obj) {
        if (obj == null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    };

    /* jQuery */
    $.isArray = Array.isArray || function (obj) {
        return $.type(obj) === "array";
    };

    /* jQuery */
    function isArraylike (obj) {
        var length = obj.length,
            type = $.type(obj);

        if (type === "function" || $.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    /***************
       $ Methods
    ***************/

    /* jQuery: Support removed for IE<9. */
    $.isPlainObject = function (obj) {
        var key;

        if (!obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
    };

    /* jQuery */
    $.each = function(obj, callback, args) {
        var value,
            i = 0,
            length = obj.length,
            isArray = isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

        } else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    /* Custom */
    $.data = function (node, key, value) {
        /* $.getData() */
        if (value === undefined) {
            var id = node[$.expando],
                store = id && cache[id];

            if (key === undefined) {
                return store;
            } else if (store) {
                if (key in store) {
                    return store[key];
                }
            }
        /* $.setData() */
        } else if (key !== undefined) {
            var id = node[$.expando] || (node[$.expando] = ++$.uuid);

            cache[id] = cache[id] || {};
            cache[id][key] = value;

            return value;
        }
    };

    /* Custom */
    $.removeData = function (node, keys) {
        var id = node[$.expando],
            store = id && cache[id];

        if (store) {
            $.each(keys, function(_, key) {
                delete store[key];
            });
        }
    };

    /* jQuery */
    $.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && $.type(target) !== "function") {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];

                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }

                        target[name] = $.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    /* jQuery 1.4.3 */
    $.queue = function (elem, type, data) {
        function $makeArray (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    /* $.merge */
                    (function(first, second) {
                        var len = +second.length,
                            j = 0,
                            i = first.length;

                        while (j < len) {
                            first[i++] = second[j++];
                        }

                        if (len !== len) {
                            while (second[j] !== undefined) {
                                first[i++] = second[j++];
                            }
                        }

                        first.length = i;

                        return first;
                    })(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    [].push.call(ret, arr);
                }
            }

            return ret;
        }

        if (!elem) {
            return;
        }

        type = (type || "fx") + "queue";

        var q = $.data(elem, type);

        if (!data) {
            return q || [];
        }

        if (!q || $.isArray(data)) {
            q = $.data(elem, type, $makeArray(data));
        } else {
            q.push(data);
        }

        return q;
    };

    /* jQuery 1.4.3 */
    $.dequeue = function (elems, type) {
        /* Custom: Embed element iteration. */
        $.each(elems.nodeType ? [ elems ] : elems, function(i, elem) {
            type = type || "fx";

            var queue = $.queue(elem, type),
                fn = queue.shift();

            if (fn === "inprogress") {
                fn = queue.shift();
            }

            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function() {
                    $.dequeue(elem, type);
                });
            }
        });
    };

    /******************
       $.fn Methods
    ******************/

    /* jQuery */
    $.fn = $.prototype = {
        init: function (selector) {
            /* Just return the element wrapped inside an array; don't proceed with the actual jQuery node wrapping process. */
            if (selector.nodeType) {
                this[0] = selector;

                return this;
            } else {
                throw new Error("Not a DOM node.");
            }
        },

        offset: function () {
            /* jQuery altered code: Dropped disconnected DOM node checking. */
            var box = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : { top: 0, left: 0 };

            return {
                top: box.top + (window.pageYOffset || document.scrollTop  || 0)  - (document.clientTop  || 0),
                left: box.left + (window.pageXOffset || document.scrollLeft  || 0) - (document.clientLeft || 0)
            };
        },

        position: function () {
            /* jQuery */
            function offsetParent() {
                var offsetParent = this.offsetParent || document;

                while (offsetParent && (!offsetParent.nodeType.toLowerCase === "html" && offsetParent.style.position === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || document;
            }

            /* Zepto */
            var elem = this[0],
                offsetParent = offsetParent.apply(elem),
                offset = this.offset(),
                parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? { top: 0, left: 0 } : $(offsetParent).offset()

            offset.top -= parseFloat(elem.style.marginTop) || 0;
            offset.left -= parseFloat(elem.style.marginLeft) || 0;

            if (offsetParent.style) {
                parentOffset.top += parseFloat(offsetParent.style.borderTopWidth) || 0
                parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0
            }

            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        }
    };

    /**********************
       Private Variables
    **********************/

    /* For $.data() */
    var cache = {};
    $.expando = "velocity" + (new Date().getTime());
    $.uuid = 0;

    /* For $.queue() */
    var class2type = {},
        hasOwn = class2type.hasOwnProperty,
        toString = class2type.toString;

    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var i = 0; i < types.length; i++) {
        class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
    }

    /* Makes $(node) possible, without having to call init. */
    $.fn.init.prototype = $.fn;

    /* Globalize Velocity onto the window, and assign its Utilities property. */
    window.Velocity = { Utilities: $ };
})(window);

/******************
    Velocity.js
******************/

;(function (factory) {
    /* CommonJS module. */
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    /* Browser globals. */
    } else {
        factory();
    }
}(function() {
return function (global, window, document, undefined) {

    /***************
        Summary
    ***************/

    /*
    - CSS: CSS stack that works independently from the rest of Velocity.
    - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
      - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
      - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack.
                  Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
      - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
    - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
    - completeCall(): Handles the cleanup process for each Velocity call.
    */

    /*********************
       Helper Functions
    *********************/

    /* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
    var IE = (function() {
        if (document.documentMode) {
            return document.documentMode;
        } else {
            for (var i = 7; i > 4; i--) {
                var div = document.createElement("div");

                div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                if (div.getElementsByTagName("span").length) {
                    div = null;

                    return i;
                }
            }
        }

        return undefined;
    })();

    /* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
    var rAFShim = (function() {
        var timeLast = 0;

        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            var timeCurrent = (new Date()).getTime(),
                timeDelta;

            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
            timeLast = timeCurrent + timeDelta;

            return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
        };
    })();

    /* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
    function compactSparseArray (array) {
        var index = -1,
            length = array ? array.length : 0,
            result = [];

        while (++index < length) {
            var value = array[index];

            if (value) {
                result.push(value);
            }
        }

        return result;
    }

    function sanitizeElements (elements) {
        /* Unwrap jQuery/Zepto objects. */
        if (Type.isWrapped(elements)) {
            elements = [].slice.call(elements);
        /* Wrap a single element in an array so that $.each() can iterate with the element instead of its node's children. */
        } else if (Type.isNode(elements)) {
            elements = [ elements ];
        }

        return elements;
    }

    var Type = {
        isString: function (variable) {
            return (typeof variable === "string");
        },
        isArray: Array.isArray || function (variable) {
            return Object.prototype.toString.call(variable) === "[object Array]";
        },
        isFunction: function (variable) {
            return Object.prototype.toString.call(variable) === "[object Function]";
        },
        isNode: function (variable) {
            return variable && variable.nodeType;
        },
        /* Copyright Martin Bohm. MIT License: https://gist.github.com/Tomalak/818a78a226a0738eaade */
        isNodeList: function (variable) {
            return typeof variable === "object" &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(variable)) &&
                variable.length !== undefined &&
                (variable.length === 0 || (typeof variable[0] === "object" && variable[0].nodeType > 0));
        },
        /* Determine if variable is a wrapped jQuery or Zepto element. */
        isWrapped: function (variable) {
            return variable && (variable.jquery || (window.Zepto && window.Zepto.zepto.isZ(variable)));
        },
        isSVG: function (variable) {
            return window.SVGElement && (variable instanceof window.SVGElement);
        },
        isEmptyObject: function (variable) {
            for (var name in variable) {
                return false;
            }

            return true;
        }
    };

    /*****************
       Dependencies
    *****************/

    var $,
        isJQuery = false;

    if (global.fn && global.fn.jquery) {
        $ = global;
        isJQuery = true;
    } else {
        $ = window.Velocity.Utilities;
    }

    if (IE <= 8 && !isJQuery) {
        throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
    } else if (IE <= 7) {
        /* Revert to jQuery's $.animate(), and lose Velocity's extra features. */
        jQuery.fn.velocity = jQuery.fn.animate;

        /* Now that $.fn.velocity is aliased, abort this Velocity declaration. */
        return;
    }

    /*****************
        Constants
    *****************/

    var DURATION_DEFAULT = 400,
        EASING_DEFAULT = "swing";

    /*************
        State
    *************/

    /* Note: The global object also doubles as a publicly-accessible data store for the purposes of unit testing. */
    /* Note: Alias the lowercase and uppercase variants of "velocity" to minimize user confusion due to the lowercase nature of the $.fn extension. */
    var Velocity = {
        /* Container for page-wide Velocity state data. */
        State: {
            /* Detect mobile devices to determine if mobileHA should be turned on. */
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            /* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
            isAndroid: /Android/i.test(navigator.userAgent),
            isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
            isChrome: window.chrome,
            isFirefox: /Firefox/i.test(navigator.userAgent),
            /* Create a cached element for re-use when checking for CSS property prefixes. */
            prefixElement: document.createElement("div"),
            /* Cache every prefix match to avoid repeating lookups. */
            prefixMatches: {},
            /* Cache the anchor used for animating window scrolling. */
            scrollAnchor: null,
            /* Cache the property names associated with the scroll anchor. */
            scrollPropertyLeft: null,
            scrollPropertyTop: null,
            /* Keep track of whether our RAF tick is running. */
            isTicking: false,
            /* Container for every in-progress call to Velocity. */
            calls: []
        },
        /* Velocity's custom CSS stack. Made global for unit testing. */
        CSS: { /* Defined below. */ },
        /* Defined by Velocity's optional jQuery shim. */
        Utilities: $,
        /* Container for the user's custom animation redirects that are referenced by name in place of a properties map object. */
        Redirects: { /* Manually registered by the user. */ },
        Easings: { /* Defined below. */ },
        /* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
        Promise: window.Promise,
        /* Page-wide option defaults, which can be overriden by the user. */
        defaults: {
            queue: "",
            duration: DURATION_DEFAULT,
            easing: EASING_DEFAULT,
            begin: undefined,
            complete: undefined,
            progress: undefined,
            display: undefined,
            visibility: undefined,
            loop: false,
            delay: false,
            mobileHA: true,
            /* Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
            _cacheValues: true
        },
        /* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying.
           Accordingly, each element has a data cache instantiated on it. */
        init: function (element) {
            $.data(element, "velocity", {
                /* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
                isSVG: Type.isSVG(element),
                /* Keep track of whether the element is currently being animated by Velocity.
                   This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
                isAnimating: false,
                /* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
                computedStyle: null,
                /* Tween data is cached for each animation on the element so that data can be passed across calls --
                   in particular, end values are used as subsequent start values in consecutive Velocity calls. */
                tweensContainer: null,
                /* The full root property values of each CSS hook being animated on this element are cached so that:
                   1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
                   2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
                rootPropertyValueCache: {},
                /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
                transformCache: {}
            });
        },
        /* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
        hook: null, /* Defined below. */
        /* Velocity-wide animation time remapping for testing purposes. */
        mock: false,
        version: { major: 1, minor: 1, patch: 0 },
        /* Set to 1 or 2 (most verbose) to output debug info to console. */
        debug: false
    };

    /* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
    if (window.pageYOffset !== undefined) {
        Velocity.State.scrollAnchor = window;
        Velocity.State.scrollPropertyLeft = "pageXOffset";
        Velocity.State.scrollPropertyTop = "pageYOffset";
    } else {
        Velocity.State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
        Velocity.State.scrollPropertyLeft = "scrollLeft";
        Velocity.State.scrollPropertyTop = "scrollTop";
    }

    /* Shorthand alias for jQuery's $.data() utility. */
    function Data (element) {
        /* Hardcode a reference to the plugin name. */
        var response = $.data(element, "velocity");

        /* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
        return response === null ? undefined : response;
    };

    /**************
        Easing
    **************/

    /* Step easing generator. */
    function generateStep (steps) {
        return function (p) {
            return Math.round(p * steps) * (1 / steps);
        };
    }

    /* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    function generateBezier (mX1, mY1, mX2, mY2) {
        var NEWTON_ITERATIONS = 4,
            NEWTON_MIN_SLOPE = 0.001,
            SUBDIVISION_PRECISION = 0.0000001,
            SUBDIVISION_MAX_ITERATIONS = 10,
            kSplineTableSize = 11,
            kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
            float32ArraySupported = "Float32Array" in window;

        /* Must contain four arguments. */
        if (arguments.length !== 4) {
            return false;
        }

        /* Arguments must be numbers. */
        for (var i = 0; i < 4; ++i) {
            if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
                return false;
            }
        }

        /* X values must be in the [0, 1] range. */
        mX1 = Math.min(mX1, 1);
        mX2 = Math.min(mX2, 1);
        mX1 = Math.max(mX1, 0);
        mX2 = Math.max(mX2, 0);

        var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

        function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
        function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
        function C (aA1)      { return 3.0 * aA1; }

        function calcBezier (aT, aA1, aA2) {
            return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
        }

        function getSlope (aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }

        function newtonRaphsonIterate (aX, aGuessT) {
            for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                var currentSlope = getSlope(aGuessT, mX1, mX2);

                if (currentSlope === 0.0) return aGuessT;

                var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }

            return aGuessT;
        }

        function calcSampleValues () {
            for (var i = 0; i < kSplineTableSize; ++i) {
                mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        }

        function binarySubdivide (aX, aA, aB) {
            var currentX, currentT, i = 0;

            do {
                currentT = aA + (aB - aA) / 2.0;
                currentX = calcBezier(currentT, mX1, mX2) - aX;
                if (currentX > 0.0) {
                  aB = currentT;
                } else {
                  aA = currentT;
                }
            } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

            return currentT;
        }

        function getTForX (aX) {
            var intervalStart = 0.0,
                currentSample = 1,
                lastSample = kSplineTableSize - 1;

            for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }

            --currentSample;

            var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]),
                guessForT = intervalStart + dist * kSampleStepSize,
                initialSlope = getSlope(guessForT, mX1, mX2);

            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT);
            } else if (initialSlope == 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
            }
        }

        var _precomputed = false;

        function precompute() {
            _precomputed = true;
            if (mX1 != mY1 || mX2 != mY2) calcSampleValues();
        }

        var f = function (aX) {
            if (!_precomputed) precompute();
            if (mX1 === mY1 && mX2 === mY2) return aX;
            if (aX === 0) return 0;
            if (aX === 1) return 1;

            return calcBezier(getTForX(aX), mY1, mY2);
        };

        f.getControlPoints = function() { return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }]; };

        var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
        f.toString = function () { return str; };

        return f;
    }

    /* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    /* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
       then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
    var generateSpringRK4 = (function () {
        function springAccelerationForState (state) {
            return (-state.tension * state.x) - (state.friction * state.v);
        }

        function springEvaluateStateWithDerivative (initialState, dt, derivative) {
            var state = {
                x: initialState.x + derivative.dx * dt,
                v: initialState.v + derivative.dv * dt,
                tension: initialState.tension,
                friction: initialState.friction
            };

            return { dx: state.v, dv: springAccelerationForState(state) };
        }

        function springIntegrateState (state, dt) {
            var a = {
                    dx: state.v,
                    dv: springAccelerationForState(state)
                },
                b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
                c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
                d = springEvaluateStateWithDerivative(state, dt, c),
                dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
                dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

            state.x = state.x + dxdt * dt;
            state.v = state.v + dvdt * dt;

            return state;
        }

        return function springRK4Factory (tension, friction, duration) {

            var initState = {
                    x: -1,
                    v: 0,
                    tension: null,
                    friction: null
                },
                path = [0],
                time_lapsed = 0,
                tolerance = 1 / 10000,
                DT = 16 / 1000,
                have_duration, dt, last_state;

            tension = parseFloat(tension) || 500;
            friction = parseFloat(friction) || 20;
            duration = duration || null;

            initState.tension = tension;
            initState.friction = friction;

            have_duration = duration !== null;

            /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
            if (have_duration) {
                /* Run the simulation without a duration. */
                time_lapsed = springRK4Factory(tension, friction);
                /* Compute the adjusted time delta. */
                dt = time_lapsed / duration * DT;
            } else {
                dt = DT;
            }

            while (true) {
                /* Next/step function .*/
                last_state = springIntegrateState(last_state || initState, dt);
                /* Store the position. */
                path.push(1 + last_state.x);
                time_lapsed += 16;
                /* If the change threshold is reached, break. */
                if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                    break;
                }
            }

            /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
               computed path and returns a snapshot of the position according to a given percentComplete. */
            return !have_duration ? time_lapsed : function(percentComplete) { return path[ (percentComplete * (path.length - 1)) | 0 ]; };
        };
    }());

    /* jQuery easings. */
    Velocity.Easings = {
        linear: function(p) { return p; },
        swing: function(p) { return 0.5 - Math.cos( p * Math.PI ) / 2 },
        /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
        spring: function(p) { return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6)); }
    };

    /* CSS3 and Robert Penner easings. */
    $.each(
        [
            [ "ease", [ 0.25, 0.1, 0.25, 1.0 ] ],
            [ "ease-in", [ 0.42, 0.0, 1.00, 1.0 ] ],
            [ "ease-out", [ 0.00, 0.0, 0.58, 1.0 ] ],
            [ "ease-in-out", [ 0.42, 0.0, 0.58, 1.0 ] ],
            [ "easeInSine", [ 0.47, 0, 0.745, 0.715 ] ],
            [ "easeOutSine", [ 0.39, 0.575, 0.565, 1 ] ],
            [ "easeInOutSine", [ 0.445, 0.05, 0.55, 0.95 ] ],
            [ "easeInQuad", [ 0.55, 0.085, 0.68, 0.53 ] ],
            [ "easeOutQuad", [ 0.25, 0.46, 0.45, 0.94 ] ],
            [ "easeInOutQuad", [ 0.455, 0.03, 0.515, 0.955 ] ],
            [ "easeInCubic", [ 0.55, 0.055, 0.675, 0.19 ] ],
            [ "easeOutCubic", [ 0.215, 0.61, 0.355, 1 ] ],
            [ "easeInOutCubic", [ 0.645, 0.045, 0.355, 1 ] ],
            [ "easeInQuart", [ 0.895, 0.03, 0.685, 0.22 ] ],
            [ "easeOutQuart", [ 0.165, 0.84, 0.44, 1 ] ],
            [ "easeInOutQuart", [ 0.77, 0, 0.175, 1 ] ],
            [ "easeInQuint", [ 0.755, 0.05, 0.855, 0.06 ] ],
            [ "easeOutQuint", [ 0.23, 1, 0.32, 1 ] ],
            [ "easeInOutQuint", [ 0.86, 0, 0.07, 1 ] ],
            [ "easeInExpo", [ 0.95, 0.05, 0.795, 0.035 ] ],
            [ "easeOutExpo", [ 0.19, 1, 0.22, 1 ] ],
            [ "easeInOutExpo", [ 1, 0, 0, 1 ] ],
            [ "easeInCirc", [ 0.6, 0.04, 0.98, 0.335 ] ],
            [ "easeOutCirc", [ 0.075, 0.82, 0.165, 1 ] ],
            [ "easeInOutCirc", [ 0.785, 0.135, 0.15, 0.86 ] ]
        ], function(i, easingArray) {
            Velocity.Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
        });

    /* Determine the appropriate easing type given an easing input. */
    function getEasing(value, duration) {
        var easing = value;

        /* The easing option can either be a string that references a pre-registered easing,
           or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
        if (Type.isString(value)) {
            /* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
            if (!Velocity.Easings[value]) {
                easing = false;
            }
        } else if (Type.isArray(value) && value.length === 1) {
            easing = generateStep.apply(null, value);
        } else if (Type.isArray(value) && value.length === 2) {
            /* springRK4 must be passed the animation's duration. */
            /* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
               function generated with default tension and friction values. */
            easing = generateSpringRK4.apply(null, value.concat([ duration ]));
        } else if (Type.isArray(value) && value.length === 4) {
            /* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
            easing = generateBezier.apply(null, value);
        } else {
            easing = false;
        }

        /* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
           if the Velocity-wide default has been incorrectly modified. */
        if (easing === false) {
            if (Velocity.Easings[Velocity.defaults.easing]) {
                easing = Velocity.defaults.easing;
            } else {
                easing = EASING_DEFAULT;
            }
        }

        return easing;
    }

    /*****************
        CSS Stack
    *****************/

    /* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
       It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
    /* Note: A "CSS" shorthand is aliased so that our code is easier to read. */
    var CSS = Velocity.CSS = {

        /*************
            RegEx
        *************/

        RegEx: {
            isHex: /^#([A-f\d]{3}){1,2}$/i,
            /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
        },

        /************
            Lists
        ************/

        Lists: {
            colors: [ "fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor" ],
            transformsBase: [ "translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ" ],
            transforms3D: [ "transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY" ]
        },

        /************
            Hooks
        ************/

        /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
           (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
        /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
           tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
        Hooks: {
            /********************
                Registration
            ********************/

            /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
            /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
            templates: {
                "textShadow": [ "Color X Y Blur", "black 0px 0px 0px" ],
                /* Todo: Add support for inset boxShadows. (webkit places it last whereas IE places it first.) */
                "boxShadow": [ "Color X Y Blur Spread", "black 0px 0px 0px 0px" ],
                "clip": [ "Top Right Bottom Left", "0px 0px 0px 0px" ],
                "backgroundPosition": [ "X Y", "0% 0%" ],
                "transformOrigin": [ "X Y Z", "50% 50% 0px" ],
                "perspectiveOrigin": [ "X Y", "50% 50%" ]
            },

            /* A "registered" hook is one that has been converted from its template form into a live,
               tweenable property. It contains data to associate it with its root property. */
            registered: {
                /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
                   which consists of the subproperty's name, the associated root property's name,
                   and the subproperty's position in the root's value. */
            },
            /* Convert the templates into individual hooks then append them to the registered object above. */
            register: function () {
                /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
                   currently set to "transparent" default to their respective template below when color-animated,
                   and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
                   which is almost always set closer to black than white. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    var rgbComponents = (CSS.Lists.colors[i] === "color") ? "0 0 0 1" : "255 255 255 1";
                    CSS.Hooks.templates[CSS.Lists.colors[i]] = [ "Red Green Blue Alpha", rgbComponents ];
                }

                var rootProperty,
                    hookTemplate,
                    hookNames;

                /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
                   Thus, we re-arrange the templates accordingly. */
                if (IE) {
                    for (rootProperty in CSS.Hooks.templates) {
                        hookTemplate = CSS.Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");

                        var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

                        if (hookNames[0] === "Color") {
                            /* Reposition both the hook's name and its default value to the end of their respective strings. */
                            hookNames.push(hookNames.shift());
                            defaultValues.push(defaultValues.shift());

                            /* Replace the existing template for the hook's root property. */
                            CSS.Hooks.templates[rootProperty] = [ hookNames.join(" "), defaultValues.join(" ") ];
                        }
                    }
                }

                /* Hook registration. */
                for (rootProperty in CSS.Hooks.templates) {
                    hookTemplate = CSS.Hooks.templates[rootProperty];
                    hookNames = hookTemplate[0].split(" ");

                    for (var i in hookNames) {
                        var fullHookName = rootProperty + hookNames[i],
                            hookPosition = i;

                        /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
                           and the hook's position in its template's default value string. */
                        CSS.Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
                    }
                }
            },

            /*****************************
               Injection and Extraction
            *****************************/

            /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
            /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
            getRoot: function (property) {
                var hookData = CSS.Hooks.registered[property];

                if (hookData) {
                    return hookData[0];
                } else {
                    /* If there was no hook match, return the property name untouched. */
                    return property;
                }
            },
            /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
               the targeted hook can be injected or extracted at its standard position. */
            cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
                /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
                if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                    rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                }

                /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
                   default to the root's default value as defined in CSS.Hooks.templates. */
                /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
                   zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
                if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                }

                return rootPropertyValue;
            },
            /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
            extractValue: function (fullHookName, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1];

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                    return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            },
            /* Inject the hook's value into its root property's value. This is used to piece back together the root property
               once Velocity has updated one of its individually hooked values through tweening. */
            injectValue: function (fullHookName, hookValue, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1],
                        rootPropertyValueParts,
                        rootPropertyValueUpdated;

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
                       then reconstruct the rootPropertyValue string. */
                    rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                    rootPropertyValueParts[hookPosition] = hookValue;
                    rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

                    return rootPropertyValueUpdated;
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            }
        },

        /*******************
           Normalizations
        *******************/

        /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
           and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
        Normalizations: {
            /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
               the targeted element (which may need to be queried), and the targeted property value. */
            registered: {
                clip: function (type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return "clip";
                        /* Clip needs to be unwrapped and stripped of its commas during extraction. */
                        case "extract":
                            var extracted;

                            /* If Velocity also extracted this value, skip extraction. */
                            if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                extracted = propertyValue;
                            } else {
                                /* Remove the "rect()" wrapper. */
                                extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                                /* Strip off commas. */
                                extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                            }

                            return extracted;
                        /* Clip needs to be re-wrapped during injection. */
                        case "inject":
                            return "rect(" + propertyValue + ")";
                    }
                },

                blur: function(type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return "-webkit-filter";
                        case "extract":
                            var extracted = parseFloat(propertyValue);

                            /* If extracted is NaN, meaning the value isn't already extracted. */
                            if (!(extracted || extracted === 0)) {
                                var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                                /* If the filter string had a blur component, return just the blur value and unit type. */
                                if (blurComponent) {
                                    extracted = blurComponent[1];
                                /* If the component doesn't exist, default blur to 0. */
                                } else {
                                    extracted = 0;
                                }
                            }

                            return extracted;
                        /* Blur needs to be re-wrapped during injection. */
                        case "inject":
                            /* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
                            if (!parseFloat(propertyValue)) {
                                return "none";
                            } else {
                                return "blur(" + propertyValue + ")";
                            }
                    }
                },

                /* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
                opacity: function (type, element, propertyValue) {
                    if (IE <= 8) {
                        switch (type) {
                            case "name":
                                return "filter";
                            case "extract":
                                /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
                                   Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                                var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

                                if (extracted) {
                                    /* Convert to decimal value. */
                                    propertyValue = extracted[1] / 100;
                                } else {
                                    /* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
                                    propertyValue = 1;
                                }

                                return propertyValue;
                            case "inject":
                                /* Opacified elements are required to have their zoom property set to a non-zero value. */
                                element.style.zoom = 1;

                                /* Setting the filter property on elements with certain font property combinations can result in a
                                   highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
                                   value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
                                if (parseFloat(propertyValue) >= 1) {
                                    return "";
                                } else {
                                  /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                                  return "alpha(opacity=" + parseInt(parseFloat(propertyValue) * 100, 10) + ")";
                                }
                        }
                    /* With all other browsers, normalization is not required; return the same values that were passed in. */
                    } else {
                        switch (type) {
                            case "name":
                                return "opacity";
                            case "extract":
                                return propertyValue;
                            case "inject":
                                return propertyValue;
                        }
                    }
                }
            },

            /*****************************
                Batched Registrations
            *****************************/

            /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
            register: function () {

                /*****************
                    Transforms
                *****************/

                /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
                   so that they can be referenced in a properties map by their individual names. */
                /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
                   setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM.
                   Transform setting is batched in this way to improve performance: the transform style only needs to be updated
                   once when multiple transform subproperties are being animated simultaneously. */
                /* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
                   transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
                   from being normalized for these browsers so that tweening skips these properties altogether
                   (since it will ignore them as being unsupported by the browser.) */
                if (!(IE <= 9) && !Velocity.State.isGingerbread) {
                    /* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
                    share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
                    CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
                }

                for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
                    paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
                    (function() {
                        var transformName = CSS.Lists.transformsBase[i];

                        CSS.Normalizations.registered[transformName] = function (type, element, propertyValue) {
                            switch (type) {
                                /* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
                                case "name":
                                    return "transform";
                                /* Transform values are cached onto a per-element transformCache object. */
                                case "extract":
                                    /* If this transform has yet to be assigned a value, return its null value. */
                                    if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                                        /* Scale CSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                                        return /^scale/i.test(transformName) ? 1 : 0;
                                    /* When transform values are set, they are wrapped in parentheses as per the CSS spec.
                                       Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                                    } else {
                                        return Data(element).transformCache[transformName].replace(/[()]/g, "");
                                    }
                                case "inject":
                                    var invalid = false;

                                    /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
                                       Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                                    /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                                    switch (transformName.substr(0, transformName.length - 1)) {
                                        /* Whitelist unit types for each transform. */
                                        case "translate":
                                            invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                                            break;
                                        /* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
                                        case "scal":
                                        case "scale":
                                            /* Chrome on Android has a bug in which scaled elements blur if their initial scale
                                               value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
                                               and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
                                            if (Velocity.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
                                                propertyValue = 1;
                                            }

                                            invalid = !/(\d)$/i.test(propertyValue);
                                            break;
                                        case "skew":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                        case "rotate":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                    }

                                    if (!invalid) {
                                        /* As per the CSS spec, wrap the value in parentheses. */
                                        Data(element).transformCache[transformName] = "(" + propertyValue + ")";
                                    }

                                    /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                                    return Data(element).transformCache[transformName];
                            }
                        };
                    })();
                }

                /*************
                    Colors
                *************/

                /* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
                   Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
                       (Otherwise, all functions would take the final for loop's colorName.) */
                    (function () {
                        var colorName = CSS.Lists.colors[i];

                        /* Note: In IE<=8, which support rgb but not rgba, color properties are reverted to rgb by stripping off the alpha component. */
                        CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return colorName;
                                /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                                case "extract":
                                    var extracted;

                                    /* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
                                    if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                        extracted = propertyValue;
                                    } else {
                                        var converted,
                                            colorNames = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };

                                        /* Convert color names to rgb. */
                                        if (/^[A-z]+$/i.test(propertyValue)) {
                                            if (colorNames[propertyValue] !== undefined) {
                                                converted = colorNames[propertyValue]
                                            } else {
                                                /* If an unmatched color name is provided, default to black. */
                                                converted = colorNames.black;
                                            }
                                        /* Convert hex values to rgb. */
                                        } else if (CSS.RegEx.isHex.test(propertyValue)) {
                                            converted = "rgb(" + CSS.Values.hexToRgb(propertyValue).join(" ") + ")";
                                        /* If the provided color doesn't match any of the accepted color formats, default to black. */
                                        } else if (!(/^rgba?\(/i.test(propertyValue))) {
                                            converted = colorNames.black;
                                        }

                                        /* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip
                                           repeated spaces (in case the value included spaces to begin with). */
                                        extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                                    }

                                    /* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    if (!(IE <= 8) && extracted.split(" ").length === 3) {
                                        extracted += " 1";
                                    }

                                    return extracted;
                                case "inject":
                                    /* If this is IE<=8 and an alpha component exists, strip it off. */
                                    if (IE <= 8) {
                                        if (propertyValue.split(" ").length === 4) {
                                            propertyValue = propertyValue.split(/\s+/).slice(0, 3).join(" ");
                                        }
                                    /* Otherwise, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    } else if (propertyValue.split(" ").length === 3) {
                                        propertyValue += " 1";
                                    }

                                    /* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units
                                       on all values but the fourth (R, G, and B only accept whole numbers). */
                                    return (IE <= 8 ? "rgb" : "rgba") + "(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                            }
                        };
                    })();
                }
            }
        },

        /************************
           CSS Property Names
        ************************/

        Names: {
            /* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
               Camelcasing is used to normalize property names between and across calls. */
            camelCase: function (property) {
                return property.replace(/-(\w)/g, function (match, subMatch) {
                    return subMatch.toUpperCase();
                });
            },

            /* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
            SVGAttribute: function (property) {
                var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";

                /* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
                if (IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) {
                    SVGAttributes += "|transform";
                }

                return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
            },

            /* Determine whether a property should be set with a vendor prefix. */
            /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
               If the property is not at all supported by the browser, return a false flag. */
            prefixCheck: function (property) {
                /* If this property has already been checked, return the cached value. */
                if (Velocity.State.prefixMatches[property]) {
                    return [ Velocity.State.prefixMatches[property], true ];
                } else {
                    var vendors = [ "", "Webkit", "Moz", "ms", "O" ];

                    for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                        var propertyPrefixed;

                        if (i === 0) {
                            propertyPrefixed = property;
                        } else {
                            /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
                            propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) { return match.toUpperCase(); });
                        }

                        /* Check if the browser supports this property as prefixed. */
                        if (Type.isString(Velocity.State.prefixElement.style[propertyPrefixed])) {
                            /* Cache the match. */
                            Velocity.State.prefixMatches[property] = propertyPrefixed;

                            return [ propertyPrefixed, true ];
                        }
                    }

                    /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
                    return [ property, false ];
                }
            }
        },

        /************************
           CSS Property Values
        ************************/

        Values: {
            /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
            hexToRgb: function (hex) {
                var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                    longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                    rgbParts;

                hex = hex.replace(shortformRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                rgbParts = longformRegex.exec(hex);

                return rgbParts ? [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16) ] : [ 0, 0, 0 ];
            },

            isCSSNullValue: function (value) {
                /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
                   Thus, we check for both falsiness and these special strings. */
                /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
                   templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
                /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
                return (value == 0 || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
            },

            /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
            getUnitType: function (property) {
                if (/^(rotate|skew)/i.test(property)) {
                    return "deg";
                } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
                    /* The above properties are unitless. */
                    return "";
                } else {
                    /* Default to px for all other properties. */
                    return "px";
                }
            },

            /* HTML elements default to an associated display type when they're not set to display:none. */
            /* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
            getDisplayType: function (element) {
                var tagName = element && element.tagName.toString().toLowerCase();

                if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
                    return "inline";
                } else if (/^(li)$/i.test(tagName)) {
                    return "list-item";
                } else if (/^(tr)$/i.test(tagName)) {
                    return "table-row";
                /* Default to "block" when no match is found. */
                } else {
                    return "block";
                }
            },

            /* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
            addClass: function (element, className) {
                if (element.classList) {
                    element.classList.add(className);
                } else {
                    element.className += (element.className.length ? " " : "") + className;
                }
            },

            removeClass: function (element, className) {
                if (element.classList) {
                    element.classList.remove(className);
                } else {
                    element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                }
            }
        },

        /****************************
           Style Getting & Setting
        ****************************/

        /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        getPropertyValue: function (element, property, rootPropertyValue, forceStyleLookup) {
            /* Get an element's computed property value. */
            /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
               style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
               *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
            function computePropertyValue (element, property) {
                /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
                   element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
                   offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
                   We subtract border and padding to get the sum of interior + scrollbar. */
                var computedValue = 0;

                /* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array
                   of hacks to accurately retrieve IE8 property values. Re-implementing that logic here is not worth bloating the
                   codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
                   Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
                if (IE <= 8) {
                    computedValue = $.css(element, property); /* GET */
                /* All other browsers support getComputedStyle. The returned live object reference is cached onto its
                   associated element so that it does not need to be refetched upon every GET. */
                } else {
                    /* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
                       toggle display to the element type's default value. */
                    var toggleDisplay = false;

                    if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, "display") === 0) {
                        toggleDisplay = true;
                        CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element));
                    }

                    function revertDisplay () {
                        if (toggleDisplay) {
                            CSS.setPropertyValue(element, "display", "none");
                        }
                    }

                    if (!forceStyleLookup) {
                        if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                            revertDisplay();

                            return contentBoxHeight;
                        } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                            revertDisplay();

                            return contentBoxWidth;
                        }
                    }

                    var computedStyle;

                    /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
                       of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
                    if (Data(element) === undefined) {
                        computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If the computedStyle object has yet to be cached, do so now. */
                    } else if (!Data(element).computedStyle) {
                        computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If computedStyle is cached, use it. */
                    } else {
                        computedStyle = Data(element).computedStyle;
                    }

                    /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
                       As a polyfill for querying individual border side colors, just return the top border's color. */
                    if ((IE || Velocity.State.isFirefox) && property === "borderColor") {
                        property = "borderTopColor";
                    }

                    /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
                       instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
                    if (IE === 9 && property === "filter") {
                        computedValue = computedStyle.getPropertyValue(property); /* GET */
                    } else {
                        computedValue = computedStyle[property];
                    }

                    /* Fall back to the property's style value (if defined) when computedValue returns nothing,
                       which can happen when the element hasn't been painted. */
                    if (computedValue === "" || computedValue === null) {
                        computedValue = element.style[property];
                    }

                    revertDisplay();
                }

                /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
                   defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
                   effect as being set to 0, so no conversion is necessary.) */
                /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
                   property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
                   to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
                if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                    var position = computePropertyValue(element, "position"); /* GET */

                    /* For absolute positioning, jQuery's $.position() only returns values for top and left;
                       right and bottom will have their "auto" value reverted to 0. */
                    /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
                       Not a big deal since we're currently in a GET batch anyway. */
                    if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
                        /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
                        computedValue = $(element).position()[property] + "px"; /* GET */
                    }
                }

                return computedValue;
            }

            var propertyValue;

            /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
               extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
            if (CSS.Hooks.registered[property]) {
                var hook = property,
                    hookRoot = CSS.Hooks.getRoot(hook);

                /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
                   query the DOM for the root property's value. */
                if (rootPropertyValue === undefined) {
                    /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
                    rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
                }

                /* If this root has a normalization registered, peform the associated normalization extraction. */
                if (CSS.Normalizations.registered[hookRoot]) {
                    rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                }

                /* Extract the hook's value. */
                propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

            /* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
               normalize the property's name and value, and handle the special case of transforms. */
            /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
               numerical and therefore do not require normalization extraction. */
            } else if (CSS.Normalizations.registered[property]) {
                var normalizedPropertyName,
                    normalizedPropertyValue;

                normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);

                /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
                   At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
                   This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
                   thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
                if (normalizedPropertyName !== "transform") {
                    normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

                    /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
                    if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                        normalizedPropertyValue = CSS.Hooks.templates[property][1];
                    }
                }

                propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
            }

            /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
            if (!/^[\d-]/.test(propertyValue)) {
                /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
                   their HTML attribute values instead of their CSS style values. */
                if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                    /* Since the height/width attribute values must be set manually, they don't reflect computed values.
                       Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
                    if (/^(height|width)$/i.test(property)) {
                        propertyValue = element.getBBox()[property];
                    /* Otherwise, access the attribute value directly. */
                    } else {
                        propertyValue = element.getAttribute(property);
                    }
                } else {
                    propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
                }
            }

            /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
               convert CSS null-values to an integer of value 0. */
            if (CSS.Values.isCSSNullValue(propertyValue)) {
                propertyValue = 0;
            }

            if (Velocity.debug >= 2) console.log("Get " + property + ": " + propertyValue);

            return propertyValue;
        },

        /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        setPropertyValue: function(element, property, propertyValue, rootPropertyValue, scrollData) {
            var propertyName = property;

            /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
            if (property === "scroll") {
                /* If a container option is present, scroll the container instead of the browser window. */
                if (scrollData.container) {
                    scrollData.container["scroll" + scrollData.direction] = propertyValue;
                /* Otherwise, Velocity defaults to scrolling the browser window. */
                } else {
                    if (scrollData.direction === "Left") {
                        window.scrollTo(propertyValue, scrollData.alternateValue);
                    } else {
                        window.scrollTo(scrollData.alternateValue, propertyValue);
                    }
                }
            } else {
                /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
                   Thus, for now, we merely cache transforms being SET. */
                if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                    /* Perform a normalization injection. */
                    /* Note: The normalization logic handles the transformCache updating. */
                    CSS.Normalizations.registered[property]("inject", element, propertyValue);

                    propertyName = "transform";
                    propertyValue = Data(element).transformCache[property];
                } else {
                    /* Inject hooks. */
                    if (CSS.Hooks.registered[property]) {
                        var hookName = property,
                            hookRoot = CSS.Hooks.getRoot(property);

                        /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                        rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

                        propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                        property = hookRoot;
                    }

                    /* Normalize names and values. */
                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);
                    }

                    /* Assign the appropriate vendor prefix before performing an official style update. */
                    propertyName = CSS.Names.prefixCheck(property)[0];

                    /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
                       Try/catch is avoided for other browsers since it incurs a performance overhead. */
                    if (IE <= 8) {
                        try {
                            element.style[propertyName] = propertyValue;
                        } catch (error) { if (Velocity.debug) console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]"); }
                    /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
                    /* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
                    } else if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                        /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                        /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                        element.setAttribute(property, propertyValue);
                    } else {
                        element.style[propertyName] = propertyValue;
                    }

                    if (Velocity.debug >= 2) console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                }
            }

            /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
            return [ propertyName, propertyValue ];
        },

        /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
        /* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
        flushTransformCache: function(element) {
            var transformString = "";

            /* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
               (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
            if ((IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) && Data(element).isSVG) {
                /* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
                   Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
                function getTransformFloat (transformProperty) {
                    return parseFloat(CSS.getPropertyValue(element, transformProperty));
                }

                /* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
                   we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
                var SVGTransforms = {
                    translate: [ getTransformFloat("translateX"), getTransformFloat("translateY") ],
                    skewX: [ getTransformFloat("skewX") ], skewY: [ getTransformFloat("skewY") ],
                    /* If the scale property is set (non-1), use that value for the scaleX and scaleY values
                       (this behavior mimics the result of animating all these properties at once on HTML elements). */
                    scale: getTransformFloat("scale") !== 1 ? [ getTransformFloat("scale"), getTransformFloat("scale") ] : [ getTransformFloat("scaleX"), getTransformFloat("scaleY") ],
                    /* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
                       defining the rotation's origin point. We ignore the origin values (default them to 0). */
                    rotate: [ getTransformFloat("rotateZ"), 0, 0 ]
                };

                /* Iterate through the transform properties in the user-defined property map order.
                   (This mimics the behavior of non-SVG transform animation.) */
                $.each(Data(element).transformCache, function(transformName) {
                    /* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
                       properties so that they match up with SVG's accepted transform properties. */
                    if (/^translate/i.test(transformName)) {
                        transformName = "translate";
                    } else if (/^scale/i.test(transformName)) {
                        transformName = "scale";
                    } else if (/^rotate/i.test(transformName)) {
                        transformName = "rotate";
                    }

                    /* Check that we haven't yet deleted the property from the SVGTransforms container. */
                    if (SVGTransforms[transformName]) {
                        /* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
                        transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

                        /* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
                           re-insert the same master property if we encounter another one of its axis-specific properties. */
                        delete SVGTransforms[transformName];
                    }
                });
            } else {
                var transformValue,
                    perspective;

                /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
                $.each(Data(element).transformCache, function(transformName) {
                    transformValue = Data(element).transformCache[transformName];

                    /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
                    if (transformName === "transformPerspective") {
                        perspective = transformValue;
                        return true;
                    }

                    /* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
                    if (IE === 9 && transformName === "rotateZ") {
                        transformName = "rotate";
                    }

                    transformString += transformName + transformValue + " ";
                });

                /* If present, set the perspective subproperty first. */
                if (perspective) {
                    transformString = "perspective" + perspective + " " + transformString;
                }
            }

            CSS.setPropertyValue(element, "transform", transformString);
        }
    };

    /* Register hooks and normalizations. */
    CSS.Hooks.register();
    CSS.Normalizations.register();

    /* Allow hook setting in the same fashion as jQuery's $.css(). */
    Velocity.hook = function (elements, arg2, arg3) {
        var value = undefined;

        elements = sanitizeElements(elements);

        $.each(elements, function(i, element) {
            /* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /* Get property value. If an element set was passed in, only return the value for the first element. */
            if (arg3 === undefined) {
                if (value === undefined) {
                    value = Velocity.CSS.getPropertyValue(element, arg2);
                }
            /* Set property value. */
            } else {
                /* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
                var adjustedSet = Velocity.CSS.setPropertyValue(element, arg2, arg3);

                /* Transform properties don't automatically set. They have to be flushed to the DOM. */
                if (adjustedSet[0] === "transform") {
                    Velocity.CSS.flushTransformCache(element);
                }

                value = adjustedSet;
            }
        });

        return value;
    };

    /*****************
        Animation
    *****************/

    var animate = function() {

        /******************
            Call Chain
        ******************/

        /* Logic for determining what to return to the call stack when exiting out of Velocity. */
        function getChain () {
            /* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
               default to null instead of returning the targeted elements so that utility function's return value is standardized. */
            if (isUtility) {
                return promiseData.promise || null;
            /* Otherwise, if we're using $.fn, return the jQuery-/Zepto-wrapped element set. */
            } else {
                return elementsWrapped;
            }
        }

        /*************************
           Arguments Assignment
        *************************/

        /* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "properties" and "options"
           objects are defined on a container object that's passed in as Velocity's sole argument. */
        /* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
        var syntacticSugar = (arguments[0] && (($.isPlainObject(arguments[0].properties) && !arguments[0].properties.names) || Type.isString(arguments[0].properties))),
            /* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
            isUtility,
            /* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
               passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
            elementsWrapped,
            argumentIndex;

        var elements,
            propertiesMap,
            options;

        /* Detect jQuery/Zepto elements being animated via the $.fn method. */
        if (Type.isWrapped(this)) {
            isUtility = false;

            argumentIndex = 0;
            elements = this;
            elementsWrapped = this;
        /* Otherwise, raw elements are being animated via the utility function. */
        } else {
            isUtility = true;

            argumentIndex = 1;
            elements = syntacticSugar ? arguments[0].elements : arguments[0];
        }

        elements = sanitizeElements(elements);

        if (!elements) {
            return;
        }

        if (syntacticSugar) {
            propertiesMap = arguments[0].properties;
            options = arguments[0].options;
        } else {
            propertiesMap = arguments[argumentIndex];
            options = arguments[argumentIndex + 1];
        }

        /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
           single raw DOM element is passed in (which doesn't contain a length property). */
        var elementsLength = elements.length,
            elementsIndex = 0;

        /***************************
            Argument Overloading
        ***************************/

        /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
           Overloading is detected by checking for the absence of an object being passed into options. */
        /* Note: The stop action does not accept animation options, and is therefore excluded from this check. */
        if (propertiesMap !== "stop" && !$.isPlainObject(options)) {
            /* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
            var startingArgumentPosition = argumentIndex + 1;

            options = {};

            /* Iterate through all options arguments */
            for (var i = startingArgumentPosition; i < arguments.length; i++) {
                /* Treat a number as a duration. Parse it out. */
                /* Note: The following RegEx will return true if passed an array with a number as its first item.
                   Thus, arrays are skipped from this check. */
                if (!Type.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
                    options.duration = arguments[i];
                /* Treat strings and arrays as easings. */
                } else if (Type.isString(arguments[i]) || Type.isArray(arguments[i])) {
                    options.easing = arguments[i];
                /* Treat a function as a complete callback. */
                } else if (Type.isFunction(arguments[i])) {
                    options.complete = arguments[i];
                }
            }
        }

        /***************
            Promises
        ***************/

        var promiseData = {
                promise: null,
                resolver: null,
                rejecter: null
            };

        /* If this call was made via the utility function (which is the default method of invocation when jQuery/Zepto are not being used), and if
           promise support was detected, create a promise object for this call and store references to its resolver and rejecter methods. The resolve
           method is used when a call completes naturally or is prematurely stopped by the user. In both cases, completeCall() handles the associated
           call cleanup and promise resolving logic. The reject method is used when an invalid set of arguments is passed into a Velocity call. */
        /* Note: Velocity employs a call-based queueing architecture, which means that stopping an animating element actually stops the full call that
           triggered it -- not that one element exclusively. Similarly, there is one promise per call, and all elements targeted by a Velocity call are
           grouped together for the purposes of resolving and rejecting a promise. */
        if (isUtility && Velocity.Promise) {
            promiseData.promise = new Velocity.Promise(function (resolve, reject) {
                promiseData.resolver = resolve;
                promiseData.rejecter = reject;
            });
        }

        /*********************
           Action Detection
        *********************/

        /* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view,
           or they can be started, stopped, or reversed. If a literal or referenced properties map is passed in as Velocity's
           first argument, the associated action is "start". Alternatively, "scroll", "reverse", or "stop" can be passed in instead of a properties map. */
        var action;

        switch (propertiesMap) {
            case "scroll":
                action = "scroll";
                break;

            case "reverse":
                action = "reverse";
                break;

            case "stop":
                /*******************
                    Action: Stop
                *******************/

                /* Clear the currently-active delay on each targeted element. */
                $.each(elements, function(i, element) {
                    if (Data(element) && Data(element).delayTimer) {
                        /* Stop the timer from triggering its cached next() function. */
                        clearTimeout(Data(element).delayTimer.setTimeout);

                        /* Manually call the next() function so that the subsequent queue items can progress. */
                        if (Data(element).delayTimer.next) {
                            Data(element).delayTimer.next();
                        }

                        delete Data(element).delayTimer;
                    }
                });

                var callsToStop = [];

                /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
                   been applied to multiple elements, in which case all of the call's elements will be subjected to stopping. When an element
                   is stopped, the next item in its animation queue is immediately triggered. */
                /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
                   or a custom queue string can be passed in. */
                /* Note: The stop command runs prior to Queueing since its behavior is intended to take effect *immediately*,
                   regardless of the element's current queue state. */

                /* Iterate through every active call. */
                $.each(Velocity.State.calls, function(i, activeCall) {
                    /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
                    if (activeCall) {
                        /* Iterate through the active call's targeted elements. */
                        $.each(activeCall[1], function(k, activeElement) {
                            var queueName = Type.isString(options) ? options : "";

                            if (options !== undefined && activeCall[2].queue !== queueName) {
                                return true;
                            }

                            /* Iterate through the calls targeted by the stop command. */
                            $.each(elements, function(l, element) {
                                /* Check that this call was applied to the target element. */
                                if (element === activeElement) {
                                    /* Optionally clear the remaining queued calls. */
                                    if (options !== undefined) {
                                        /* Iterate through the items in the element's queue. */
                                        $.each($.queue(element, queueName), function(_, item) {
                                            /* The queue array can contain an "inprogress" string, which we skip. */
                                            if (Type.isFunction(item)) {
                                                /* Pass the item's callback a flag indicating that we want to abort from the queue call.
                                                   (Specifically, the queue will resolve the call's associated promise then abort.)  */
                                                item(null, true);
                                            }
                                        });

                                        /* Clearing the $.queue() array is achieved by resetting it to []. */
                                        $.queue(element, queueName, []);
                                    }

                                    if (Data(element) && queueName === "") {
                                        /* Since "reverse" uses cached start values (the previous call's endValues),
                                           these values must be changed to reflect the final value that the elements were actually tweened to. */
                                        $.each(Data(element).tweensContainer, function(m, activeTween) {
                                            activeTween.endValue = activeTween.currentValue;
                                        });
                                    }

                                    callsToStop.push(i);
                                }
                            });
                        });
                    }
                });

                /* Prematurely call completeCall() on each matched active call, passing an additional flag to indicate
                   that the complete callback and display:none setting should be skipped since we're completing prematurely. */
                $.each(callsToStop, function(i, j) {
                    completeCall(j, true);
                });

                if (promiseData.promise) {
                    /* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
                    promiseData.resolver(elements);
                }

                /* Since we're stopping, and not proceeding with queueing, exit out of Velocity. */
                return getChain();

            default:
                /* Treat a non-empty plain object as a literal properties map. */
                if ($.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
                    action = "start";

                /****************
                    Redirects
                ****************/

                /* Check if a string matches a registered redirect (see Redirects above). */
                } else if (Type.isString(propertiesMap) && Velocity.Redirects[propertiesMap]) {
                    var opts = $.extend({}, options),
                        durationOriginal = opts.duration,
                        delayOriginal = opts.delay || 0;

                    /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
                    if (opts.backwards === true) {
                        elements = $.extend(true, [], elements).reverse();
                    }

                    /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
                    $.each(elements, function(elementIndex, element) {
                        /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
                        if (parseFloat(opts.stagger)) {
                            opts.delay = delayOriginal + (parseFloat(opts.stagger) * elementIndex);
                        } else if (Type.isFunction(opts.stagger)) {
                            opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                        }

                        /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                           the duration of each element's animation, using floors to prevent producing very short durations. */
                        if (opts.drag) {
                            /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                            opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                            /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                               B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                               The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                            opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex/elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
                        }

                        /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                           reduce the opts checking logic required inside the redirect. */
                        Velocity.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
                    });

                    /* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
                       (The performance overhead up to this point is virtually non-existant.) */
                    /* Note: The jQuery call chain is kept intact by returning the complete element set. */
                    return getChain();
                } else {
                    var abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

                    if (promiseData.promise) {
                        promiseData.rejecter(new Error(abortError));
                    } else {
                        console.log(abortError);
                    }

                    return getChain();
                }
        }

        /**************************
            Call-Wide Variables
        **************************/

        /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
           being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
           avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
           conversion metrics across Velocity animations that are not immediately consecutively chained. */
        var callUnitConversionData = {
                lastParent: null,
                lastPosition: null,
                lastFontSize: null,
                lastPercentToPxWidth: null,
                lastPercentToPxHeight: null,
                lastEmToPx: null,
                remToPx: null,
                vwToPx: null,
                vhToPx: null
            };

        /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
           Velocity.State.calls array that is processed during animation ticking. */
        var call = [];

        /************************
           Element Processing
        ************************/

        /* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
           1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
           2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
           3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
        */

        function processElement () {

            /*************************
               Part I: Pre-Queueing
            *************************/

            /***************************
               Element-Wide Variables
            ***************************/

            var element = this,
                /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */
                opts = $.extend({}, Velocity.defaults, options),
                /* A container for the processed data associated with each property in the propertyMap.
                   (Each property in the map produces its own "tween".) */
                tweensContainer = {},
                elementUnitConversionData;

            /******************
               Element Init
            ******************/

            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /******************
               Option: Delay
            ******************/

            /* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
            /* Note: Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay()
               (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
            if (parseFloat(opts.delay) && opts.queue !== false) {
                $.queue(element, opts.queue, function(next) {
                    /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    /* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay.
                       The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Velocity's "stop" command. */
                    Data(element).delayTimer = {
                        setTimeout: setTimeout(next, parseFloat(opts.delay)),
                        next: next
                    };
                });
            }

            /*********************
               Option: Duration
            *********************/

            /* Support for jQuery's named durations. */
            switch (opts.duration.toString().toLowerCase()) {
                case "fast":
                    opts.duration = 200;
                    break;

                case "normal":
                    opts.duration = DURATION_DEFAULT;
                    break;

                case "slow":
                    opts.duration = 600;
                    break;

                default:
                    /* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
                    opts.duration = parseFloat(opts.duration) || 1;
            }

            /************************
               Global Option: Mock
            ************************/

            if (Velocity.mock !== false) {
                /* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
                   Alternatively, a multiplier can be passed in to time remap all delays and durations. */
                if (Velocity.mock === true) {
                    opts.duration = opts.delay = 1;
                } else {
                    opts.duration *= parseFloat(Velocity.mock) || 1;
                    opts.delay *= parseFloat(Velocity.mock) || 1;
                }
            }

            /*******************
               Option: Easing
            *******************/

            opts.easing = getEasing(opts.easing, opts.duration);

            /**********************
               Option: Callbacks
            **********************/

            /* Callbacks must functions. Otherwise, default to null. */
            if (opts.begin && !Type.isFunction(opts.begin)) {
                opts.begin = null;
            }

            if (opts.progress && !Type.isFunction(opts.progress)) {
                opts.progress = null;
            }

            if (opts.complete && !Type.isFunction(opts.complete)) {
                opts.complete = null;
            }

            /*********************************
               Option: Display & Visibility
            *********************************/

            /* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
            /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
            if (opts.display !== undefined && opts.display !== null) {
                opts.display = opts.display.toString().toLowerCase();

                /* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
                if (opts.display === "auto") {
                    opts.display = Velocity.CSS.Values.getDisplayType(element);
                }
            }

            if (opts.visibility !== undefined && opts.visibility !== null) {
                opts.visibility = opts.visibility.toString().toLowerCase();
            }

            /**********************
               Option: mobileHA
            **********************/

            /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
               on animating elements. HA is removed from the element at the completion of its animation. */
            /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
            /* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
            opts.mobileHA = (opts.mobileHA && Velocity.State.isMobile && !Velocity.State.isGingerbread);

            /***********************
               Part II: Queueing
            ***********************/

            /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
               In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
            /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
               the call array is pushed to Velocity.State.calls for live processing by the requestAnimationFrame tick. */
            function buildQueue (next) {

                /*******************
                   Option: Begin
                *******************/

                /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
                if (opts.begin && elementsIndex === 0) {
                    /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                    try {
                        opts.begin.call(elements, elements);
                    } catch (error) {
                        setTimeout(function() { throw error; }, 1);
                    }
                }

                /*****************************************
                   Tween Data Construction (for Scroll)
                *****************************************/

                /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
                if (action === "scroll") {
                    /* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
                    var scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
                        scrollOffset = parseFloat(opts.offset) || 0,
                        scrollPositionCurrent,
                        scrollPositionCurrentAlternate,
                        scrollPositionEnd;

                    /* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
                       as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
                    if (opts.container) {
                        /* Ensure that either a jQuery object or a raw DOM element was passed in. */
                        if (Type.isWrapped(opts.container) || Type.isNode(opts.container)) {
                            /* Extract the raw DOM element from the jQuery wrapper. */
                            opts.container = opts.container[0] || opts.container;
                            /* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
                               (due to the user's natural interaction with the page). */
                            scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */

                            /* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions
                               -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
                               the scroll container's current scroll position. */
                            /* Note: jQuery does not offer a utility alias for $.position(), so we have to incur jQuery object conversion here.
                               This syncs up with an ensuing batch of GETs, so it fortunately does not trigger layout thrashing. */
                            scrollPositionEnd = (scrollPositionCurrent + $(element).position()[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
                        /* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
                        } else {
                            opts.container = null;
                        }
                    } else {
                        /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
                           the appropriate cached property names (which differ based on browser type). */
                        scrollPositionCurrent = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + scrollDirection]]; /* GET */
                        /* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
                        scrollPositionCurrentAlternate = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */

                        /* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
                           and therefore end values do not need to be compounded onto current values. */
                        scrollPositionEnd = $(element).offset()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
                    }

                    /* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
                    tweensContainer = {
                        scroll: {
                            rootPropertyValue: false,
                            startValue: scrollPositionCurrent,
                            currentValue: scrollPositionCurrent,
                            endValue: scrollPositionEnd,
                            unitType: "",
                            easing: opts.easing,
                            scrollData: {
                                container: opts.container,
                                direction: scrollDirection,
                                alternateValue: scrollPositionCurrentAlternate
                            }
                        },
                        element: element
                    };

                    if (Velocity.debug) console.log("tweensContainer (scroll): ", tweensContainer.scroll, element);

                /******************************************
                   Tween Data Construction (for Reverse)
                ******************************************/

                /* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
                   that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
                   the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
                /* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
                /* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
                   there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
                   as reverting to the element's values as they were prior to the previous *Velocity* call. */
                } else if (action === "reverse") {
                    /* Abort if there is no prior animation data to reverse to. */
                    if (!Data(element).tweensContainer) {
                        /* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
                        $.dequeue(element, opts.queue);

                        return;
                    } else {
                        /*********************
                           Options Parsing
                        *********************/

                        /* If the element was hidden via the display option in the previous call,
                           revert display to "auto" prior to reversal so that the element is visible again. */
                        if (Data(element).opts.display === "none") {
                            Data(element).opts.display = "auto";
                        }

                        if (Data(element).opts.visibility === "hidden") {
                            Data(element).opts.visibility = "visible";
                        }

                        /* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
                           Further, remove the previous call's callback options; typically, users do not want these to be refired. */
                        Data(element).opts.loop = false;
                        Data(element).opts.begin = null;
                        Data(element).opts.complete = null;

                        /* Since we're extending an opts object that has already been extended with the defaults options object,
                           we remove non-explicitly-defined properties that are auto-assigned values. */
                        if (!options.easing) {
                            delete opts.easing;
                        }

                        if (!options.duration) {
                            delete opts.duration;
                        }

                        /* The opts object used for reversal is an extension of the options object optionally passed into this
                           reverse call plus the options used in the previous Velocity call. */
                        opts = $.extend({}, Data(element).opts, opts);

                        /*************************************
                           Tweens Container Reconstruction
                        *************************************/

                        /* Create a deepy copy (indicated via the true flag) of the previous call's tweensContainer. */
                        var lastTweensContainer = $.extend(true, {}, Data(element).tweensContainer);

                        /* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
                        for (var lastTween in lastTweensContainer) {
                            /* In addition to tween data, tweensContainers contain an element property that we ignore here. */
                            if (lastTween !== "element") {
                                var lastStartValue = lastTweensContainer[lastTween].startValue;

                                lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
                                lastTweensContainer[lastTween].endValue = lastStartValue;

                                /* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
                                   Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
                                   The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
                                if (!Type.isEmptyObject(options)) {
                                    lastTweensContainer[lastTween].easing = opts.easing;
                                }

                                if (Velocity.debug) console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
                            }
                        }

                        tweensContainer = lastTweensContainer;
                    }

                /*****************************************
                   Tween Data Construction (for Start)
                *****************************************/

                } else if (action === "start") {

                    /*************************
                        Value Transferring
                    *************************/

                    /* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
                       while the element was in the process of being animated by Velocity, then this current call is safe to use
                       the end values from the prior call as its start values. Velocity attempts to perform this value transfer
                       process whenever possible in order to avoid requerying the DOM. */
                    /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
                       then the DOM is queried for the element's current values as a last resort. */
                    /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */
                    var lastTweensContainer;

                    /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
                       to transfer over end values to use as start values. If it's set to true and there is a previous
                       Velocity call to pull values from, do so. */
                    if (Data(element).tweensContainer && Data(element).isAnimating === true) {
                        lastTweensContainer = Data(element).tweensContainer;
                    }

                    /***************************
                       Tween Data Calculation
                    ***************************/

                    /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
                    /* Property map values can either take the form of 1) a single value representing the end value,
                       or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
                       The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
                       the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
                    function parsePropertyValue (valueData, skipResolvingEasing) {
                        var endValue = undefined,
                            easing = undefined,
                            startValue = undefined;

                        /* Handle the array format, which can be structured as one of three potential overloads:
                           A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
                        if (Type.isArray(valueData)) {
                            /* endValue is always the first item in the array. Don't bother validating endValue's value now
                               since the ensuing property cycling logic does that. */
                            endValue = valueData[0];

                            /* Two-item array format: If the second item is a number, function, or hex string, treat it as a
                               start value since easings can only be non-hex strings or arrays. */
                            if ((!Type.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || Type.isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
                                startValue = valueData[1];
                            /* Two or three-item array: If the second item is a non-hex string or an array, treat it as an easing. */
                            } else if ((Type.isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1])) || Type.isArray(valueData[1])) {
                                easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

                                /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                                if (valueData[2] !== undefined) {
                                    startValue = valueData[2];
                                }
                            }
                        /* Handle the single-value format. */
                        } else {
                            endValue = valueData;
                        }

                        /* Default to the call's easing if a per-property easing type was not defined. */
                        if (!skipResolvingEasing) {
                            easing = easing || opts.easing;
                        }

                        /* If functions were passed in as values, pass the function the current element as its context,
                           plus the element's index and the element set's size as arguments. Then, assign the returned value. */
                        if (Type.isFunction(endValue)) {
                            endValue = endValue.call(element, elementsIndex, elementsLength);
                        }

                        if (Type.isFunction(startValue)) {
                            startValue = startValue.call(element, elementsIndex, elementsLength);
                        }

                        /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
                        return [ endValue || 0, easing, startValue ];
                    }

                    /* Cycle through each property in the map, looking for shorthand color properties (e.g. "color" as opposed to "colorRed"). Inject the corresponding
                       colorRed, colorGreen, and colorBlue RGB component tweens into the propertiesMap (which Velocity understands) and remove the shorthand property. */
                    $.each(propertiesMap, function(property, value) {
                        /* Find shorthand color properties that have been passed a hex string. */
                        if (RegExp("^" + CSS.Lists.colors.join("$|^") + "$").test(property)) {
                            /* Parse the value data for each shorthand. */
                            var valueData = parsePropertyValue(value, true),
                                endValue = valueData[0],
                                easing = valueData[1],
                                startValue = valueData[2];

                            if (CSS.RegEx.isHex.test(endValue)) {
                                /* Convert the hex strings into their RGB component arrays. */
                                var colorComponents = [ "Red", "Green", "Blue" ],
                                    endValueRGB = CSS.Values.hexToRgb(endValue),
                                    startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;

                                /* Inject the RGB component tweens into propertiesMap. */
                                for (var i = 0; i < colorComponents.length; i++) {
                                    var dataArray = [ endValueRGB[i] ];

                                    if (easing) {
                                        dataArray.push(easing);
                                    }

                                    if (startValueRGB !== undefined) {
                                        dataArray.push(startValueRGB[i]);
                                    }

                                    propertiesMap[property + colorComponents[i]] = dataArray;
                                }

                                /* Remove the intermediary shorthand property entry now that we've processed it. */
                                delete propertiesMap[property];
                            }
                        }
                    });

                    /* Create a tween out of each property, and append its associated data to tweensContainer. */
                    for (var property in propertiesMap) {

                        /**************************
                           Start Value Sourcing
                        **************************/

                        /* Parse out endValue, easing, and startValue from the property's data. */
                        var valueData = parsePropertyValue(propertiesMap[property]),
                            endValue = valueData[0],
                            easing = valueData[1],
                            startValue = valueData[2];

                        /* Now that the original property name's format has been used for the parsePropertyValue() lookup above,
                           we force the property to its camelCase styling to normalize it for manipulation. */
                        property = CSS.Names.camelCase(property);

                        /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
                        var rootProperty = CSS.Hooks.getRoot(property),
                            rootPropertyValue = false;

                        /* Properties that are not supported by the browser (and do not have an associated normalization) will
                           inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
                           Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
                        /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
                           there is no way to check for their explicit browser support, and so we skip skip this check for them. */
                        if (!Data(element).isSVG && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                            if (Velocity.debug) console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");

                            continue;
                        }

                        /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
                           animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
                           a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
                        if (((opts.display !== undefined && opts.display !== null && opts.display !== "none") || (opts.visibility !== undefined && opts.visibility !== "hidden")) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                            startValue = 0;
                        }

                        /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
                           for all of the current call's properties that were *also* animated in the previous call. */
                        /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
                        if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                            if (startValue === undefined) {
                                startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                            }

                            /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
                               instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
                               attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                            rootPropertyValue = Data(element).rootPropertyValueCache[rootProperty];
                        /* If values were not transferred from a previous Velocity call, query the DOM as needed. */
                        } else {
                            /* Handle hooked properties. */
                            if (CSS.Hooks.registered[property]) {
                               if (startValue === undefined) {
                                    rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
                                    /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
                                       getPropertyValue() will extract the hook from rootPropertyValue. */
                                    startValue = CSS.getPropertyValue(element, property, rootPropertyValue);
                                /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
                                   just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
                                   root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
                                   to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
                                } else {
                                    /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                                }
                            /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
                            } else if (startValue === undefined) {
                                startValue = CSS.getPropertyValue(element, property); /* GET */
                            }
                        }

                        /**************************
                           Value Data Extraction
                        **************************/

                        var separatedValue,
                            endValueUnitType,
                            startValueUnitType,
                            operator = false;

                        /* Separates a property value into its numeric value and its unit type. */
                        function separateValue (property, value) {
                            var unitType,
                                numericValue;

                            numericValue = (value || "0")
                                .toString()
                                .toLowerCase()
                                /* Match the unit type at the end of the value. */
                                .replace(/[%A-z]+$/, function(match) {
                                    /* Grab the unit type. */
                                    unitType = match;

                                    /* Strip the unit type off of value. */
                                    return "";
                                });

                            /* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
                            if (!unitType) {
                                unitType = CSS.Values.getUnitType(property);
                            }

                            return [ numericValue, unitType ];
                        }

                        /* Separate startValue. */
                        separatedValue = separateValue(property, startValue);
                        startValue = separatedValue[0];
                        startValueUnitType = separatedValue[1];

                        /* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
                        separatedValue = separateValue(property, endValue);
                        endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
                            operator = subMatch;

                            /* Strip the operator off of the value. */
                            return "";
                        });
                        endValueUnitType = separatedValue[1];

                        /* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
                        startValue = parseFloat(startValue) || 0;
                        endValue = parseFloat(endValue) || 0;

                        /***************************************
                           Property-Specific Value Conversion
                        ***************************************/

                        /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
                        if (endValueUnitType === "%") {
                            /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
                               which is identical to the em unit's behavior, so we piggyback off of that. */
                            if (/^(fontSize|lineHeight)$/.test(property)) {
                                /* Convert % into an em decimal value. */
                                endValue = endValue / 100;
                                endValueUnitType = "em";
                            /* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
                            } else if (/^scale/.test(property)) {
                                endValue = endValue / 100;
                                endValueUnitType = "";
                            /* For RGB components, take the defined percentage of 255 and strip off the unit type. */
                            } else if (/(Red|Green|Blue)$/i.test(property)) {
                                endValue = (endValue / 100) * 255;
                                endValueUnitType = "";
                            }
                        }

                        /***************************
                           Unit Ratio Calculation
                        ***************************/

                        /* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
                           %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
                           for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
                           from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
                           1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
                           2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
                        /* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
                           setting values with the target unit type then comparing the returned pixel value. */
                        /* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
                           of batching the SETs and GETs together upfront outweights the potential overhead
                           of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
                        /* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
                        function calculateUnitRatios () {

                            /************************
                                Same Ratio Checks
                            ************************/

                            /* The properties below are used to determine whether the element differs sufficiently from this call's
                               previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
                               of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
                               this is done to minimize DOM querying. */
                            var sameRatioIndicators = {
                                    myParent: element.parentNode || document.body, /* GET */
                                    position: CSS.getPropertyValue(element, "position"), /* GET */
                                    fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
                                },
                                /* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
                                samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
                                /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                                sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);

                            /* Store these ratio indicators call-wide for the next element to compare against. */
                            callUnitConversionData.lastParent = sameRatioIndicators.myParent;
                            callUnitConversionData.lastPosition = sameRatioIndicators.position;
                            callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;

                            /***************************
                               Element-Specific Units
                            ***************************/

                            /* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
                               of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
                            var measurement = 100,
                                unitRatios = {};

                            if (!sameEmRatio || !samePercentRatio) {
                                var dummy = Data(element).isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");

                                Velocity.init(dummy);
                                sameRatioIndicators.myParent.appendChild(dummy);

                                /* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
                                   Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
                                /* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
                                $.each([ "overflow", "overflowX", "overflowY" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, "hidden");
                                });
                                Velocity.CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
                                Velocity.CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
                                Velocity.CSS.setPropertyValue(dummy, "boxSizing", "content-box");

                                /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
                                $.each([ "minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, measurement + "%");
                                });
                                /* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
                                Velocity.CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");

                                /* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */

                                sameRatioIndicators.myParent.removeChild(dummy);
                            } else {
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx;
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
                            }

                            /***************************
                               Element-Agnostic Units
                            ***************************/

                            /* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
                               once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
                               that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
                               so we calculate it now. */
                            if (callUnitConversionData.remToPx === null) {
                                /* Default to browsers' default fontSize of 16px in the case of 0. */
                                callUnitConversionData.remToPx = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                            }

                            /* Similarly, viewport units are %-relative to the window's inner dimensions. */
                            if (callUnitConversionData.vwToPx === null) {
                                callUnitConversionData.vwToPx = parseFloat(window.innerWidth) / 100; /* GET */
                                callUnitConversionData.vhToPx = parseFloat(window.innerHeight) / 100; /* GET */
                            }

                            unitRatios.remToPx = callUnitConversionData.remToPx;
                            unitRatios.vwToPx = callUnitConversionData.vwToPx;
                            unitRatios.vhToPx = callUnitConversionData.vhToPx;

                            if (Velocity.debug >= 1) console.log("Unit ratios: " + JSON.stringify(unitRatios), element);

                            return unitRatios;
                        }

                        /********************
                           Unit Conversion
                        ********************/

                        /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
                        if (/[\/*]/.test(operator)) {
                            endValueUnitType = startValueUnitType;
                        /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
                           is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
                           on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
                           would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                        /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitType. */
                        } else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
                            /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
                            /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
                               match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
                               which remains past the point of the animation's completion. */
                            if (endValue === 0) {
                                endValueUnitType = startValueUnitType;
                            } else {
                                /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
                                   If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                                elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();

                                /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                                /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
                                var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";

                                /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
                                   1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                                switch (startValueUnitType) {
                                    case "%":
                                        /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
                                           Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
                                           to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                                        startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* px acts as our midpoint in the unit conversion process; do nothing. */
                                        break;

                                    default:
                                        startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
                                }

                                /* Invert the px ratios to convert into to the target unit. */
                                switch (endValueUnitType) {
                                    case "%":
                                        startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* startValue is already in px, do nothing; we're done. */
                                        break;

                                    default:
                                        startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
                                }
                            }
                        }

                        /*********************
                           Relative Values
                        *********************/

                        /* Operator logic must be performed last since it requires unit-normalized start and end values. */
                        /* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
                           to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
                           50 points is added on top of the current % value. */
                        switch (operator) {
                            case "+":
                                endValue = startValue + endValue;
                                break;

                            case "-":
                                endValue = startValue - endValue;
                                break;

                            case "*":
                                endValue = startValue * endValue;
                                break;

                            case "/":
                                endValue = startValue / endValue;
                                break;
                        }

                        /**************************
                           tweensContainer Push
                        **************************/

                        /* Construct the per-property tween object, and push it to the element's tweensContainer. */
                        tweensContainer[property] = {
                            rootPropertyValue: rootPropertyValue,
                            startValue: startValue,
                            currentValue: startValue,
                            endValue: endValue,
                            unitType: endValueUnitType,
                            easing: easing
                        };

                        if (Velocity.debug) console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
                    }

                    /* Along with its property data, store a reference to the element itself onto tweensContainer. */
                    tweensContainer.element = element;
                }

                /*****************
                    Call Push
                *****************/

                /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
                   being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
                if (tweensContainer.element) {
                    /* Apply the "velocity-animating" indicator class. */
                    CSS.Values.addClass(element, "velocity-animating");

                    /* The call array houses the tweensContainers for each element being animated in the current call. */
                    call.push(tweensContainer);

                    /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
                    if (opts.queue === "") {
                        Data(element).tweensContainer = tweensContainer;
                        Data(element).opts = opts;
                    }

                    /* Switch on the element's animating flag. */
                    Data(element).isAnimating = true;

                    /* Once the final element in this call's element set has been processed, push the call array onto
                       Velocity.State.calls for the animation tick to immediately begin processing. */
                    if (elementsIndex === elementsLength - 1) {
                        /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
                           when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
                           has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears Velocity.State.calls. */
                        if (Velocity.State.calls.length > 10000) {
                            Velocity.State.calls = compactSparseArray(Velocity.State.calls);
                        }

                        /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
                           Anything on this call container is subjected to tick() processing. */
                        Velocity.State.calls.push([ call, elements, opts, null, promiseData.resolver ]);

                        /* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
                        if (Velocity.State.isTicking === false) {
                            Velocity.State.isTicking = true;

                            /* Start the tick loop. */
                            tick();
                        }
                    } else {
                        elementsIndex++;
                    }
                }
            }

            /* When the queue option is set to false, the call skips the element's queue and fires immediately. */
            if (opts.queue === false) {
                /* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
                   we manually inject the delay property here with an explicit setTimeout. */
                if (opts.delay) {
                    setTimeout(buildQueue, opts.delay);
                } else {
                    buildQueue();
                }
            /* Otherwise, the call undergoes element queueing as normal. */
            /* Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic. */
            } else {
                $.queue(element, opts.queue, function(next, clearQueue) {
                    /* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
                       so it's fine if this is repeatedly triggered for each element in the associated call.) */
                    if (clearQueue === true) {
                        if (promiseData.promise) {
                            promiseData.resolver(elements);
                        }

                        /* Do not continue with animation queueing. */
                        return true;
                    }

                    /* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Velocity.
                       See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    buildQueue(next);
                });
            }

            /*********************
                Auto-Dequeuing
            *********************/

            /* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element
               must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
               for the "inprogress" item that jQuery prepends to active queue stack arrays.) Regardless, whenever the element's
               queue is further appended with additional items -- including $.delay()'s or even $.animate() calls, the queue's
               first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
            /* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until
               each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
            /* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function.
               Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
            if ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress") {
                $.dequeue(element);
            }
        }

        /**************************
           Element Set Iteration
        **************************/

        /* If the "nodeType" property exists on the elements variable, we're animating a single element.
           Place it in an array so that $.each() can iterate over it. */
        $.each(elements, function(i, element) {
            /* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
            if (Type.isNode(element)) {
                processElement.call(element);
            }
        });

        /******************
           Option: Loop
        ******************/

        /* The loop option accepts an integer indicating how many times the element should loop between the values in the
           current call's properties map and the element's property values prior to this call. */
        /* Note: The loop option's logic is performed here -- after element processing -- because the current call needs
           to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
           which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
        var opts = $.extend({}, Velocity.defaults, options),
            reverseCallsCount;

        opts.loop = parseInt(opts.loop);
        reverseCallsCount = (opts.loop * 2) - 1;

        if (opts.loop) {
            /* Double the loop count to convert it into its appropriate number of "reverse" calls.
               Subtract 1 from the resulting value since the current call is included in the total alternation count. */
            for (var x = 0; x < reverseCallsCount; x++) {
                /* Since the logic for the reverse action occurs inside Queueing and therefore this call's options object
                   isn't parsed until then as well, the current call's delay option must be explicitly passed into the reverse
                   call so that the delay logic that occurs inside *Pre-Queueing* can process it. */
                var reverseOptions = {
                    delay: opts.delay,
                    progress: opts.progress
                };

                /* If a complete callback was passed into this call, transfer it to the loop redirect's final "reverse" call
                   so that it's triggered when the entire redirect is complete (and not when the very first animation is complete). */
                if (x === reverseCallsCount - 1) {
                    reverseOptions.display = opts.display;
                    reverseOptions.visibility = opts.visibility;
                    reverseOptions.complete = opts.complete;
                }

                animate(elements, "reverse", reverseOptions);
            }
        }

        /***************
            Chaining
        ***************/

        /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
        return getChain();
    };

    /* Turn Velocity into the animation function, extended with the pre-existing Velocity object. */
    Velocity = $.extend(animate, Velocity);
    /* For legacy support, also expose the literal animate method. */
    Velocity.animate = animate;

    /**************
        Timing
    **************/

    /* Ticker function. */
    var ticker = window.requestAnimationFrame || rAFShim;

    /* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
       To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
       devices to avoid wasting battery power on inactive tabs. */
    /* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
    if (!Velocity.State.isMobile && document.hidden !== undefined) {
        document.addEventListener("visibilitychange", function() {
            /* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
            if (document.hidden) {
                ticker = function(callback) {
                    /* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
                    return setTimeout(function() { callback(true) }, 16);
                };

                /* The rAF loop has been paused by the browser, so we manually restart the tick. */
                tick();
            } else {
                ticker = window.requestAnimationFrame || rAFShim;
            }
        });
    }

    /************
        Tick
    ************/

    /* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
    function tick (timestamp) {
        /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
           We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
           the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
           calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
           the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
           by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
        if (timestamp) {
            /* We ignore RAF's high resolution timestamp since it can be significantly offset when the browser is
               under high stress; we opt for choppiness over allowing the browser to drop huge chunks of frames. */
            var timeCurrent = (new Date).getTime();

            /********************
               Call Iteration
            ********************/

            /* Iterate through each active call. */
            for (var i = 0, callsLength = Velocity.State.calls.length; i < callsLength; i++) {
                /* When a Velocity call is completed, its Velocity.State.calls entry is set to false. Continue on to the next call. */
                if (!Velocity.State.calls[i]) {
                    continue;
                }

                /************************
                   Call-Wide Variables
                ************************/

                var callContainer = Velocity.State.calls[i],
                    call = callContainer[0],
                    opts = callContainer[2],
                    timeStart = callContainer[3],
                    firstTick = !!timeStart;

                /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
                   We assign timeStart now so that its value is as close to the real animation start time as possible.
                   (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
                   between that time and now would cause the first few frames of the tween to be skipped since
                   percentComplete is calculated relative to timeStart.) */
                /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
                   first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
                   same style value as the element's current value. */
                if (!timeStart) {
                    timeStart = Velocity.State.calls[i][3] = timeCurrent - 16;
                }

                /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
                   (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
                   Accordingly, we ensure that percentComplete does not exceed 1. */
                var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);

                /**********************
                   Element Iteration
                **********************/

                /* For every call, iterate through each of the elements in its set. */
                for (var j = 0, callLength = call.length; j < callLength; j++) {
                    var tweensContainer = call[j],
                        element = tweensContainer.element;

                    /* Check to see if this element has been deleted midway through the animation by checking for the
                       continued existence of its data cache. If it's gone, skip animating this element. */
                    if (!Data(element)) {
                        continue;
                    }

                    var transformPropertyExists = false;

                    /**********************************
                       Display & Visibility Toggling
                    **********************************/

                    /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
                       (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
                    if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
                        if (opts.display === "flex") {
                            var flexValues = [ "-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex" ];

                            $.each(flexValues, function(i, flexValue) {
                                CSS.setPropertyValue(element, "display", flexValue);
                            });
                        }

                        CSS.setPropertyValue(element, "display", opts.display);
                    }

                    /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
                    if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                        CSS.setPropertyValue(element, "visibility", opts.visibility);
                    }

                    /************************
                       Property Iteration
                    ************************/

                    /* For every element, iterate through each property. */
                    for (var property in tweensContainer) {
                        /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
                        if (property !== "element") {
                            var tween = tweensContainer[property],
                                currentValue,
                                /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                                   on the Velocity.Easings object. In either case, return the appropriate easing *function*. */
                                easing = Type.isString(tween.easing) ? Velocity.Easings[tween.easing] : tween.easing;

                            /******************************
                               Current Value Calculation
                            ******************************/

                            /* If this is the last tick pass (if we've reached 100% completion for this tween),
                               ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                            if (percentComplete === 1) {
                                currentValue = tween.endValue;
                            /* Otherwise, calculate currentValue based on the current delta from startValue. */
                            } else {
                                currentValue = tween.startValue + ((tween.endValue - tween.startValue) * easing(percentComplete));

                                /* If no value change is occurring, don't proceed with DOM updating. */
                                if (!firstTick && (currentValue === tween.currentValue)) {
                                    continue;
                                }
                            }

                            tween.currentValue = currentValue;

                            /******************
                               Hooks: Part I
                            ******************/

                            /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
                               for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
                               rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
                               updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
                               subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                            if (CSS.Hooks.registered[property]) {
                                var hookRoot = CSS.Hooks.getRoot(property),
                                    rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

                                if (rootPropertyValueCache) {
                                    tween.rootPropertyValue = rootPropertyValueCache;
                                }
                            }

                            /*****************
                                DOM Update
                            *****************/

                            /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                            /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                            var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                                                                       property,
                                                                       tween.currentValue + (parseFloat(currentValue) === 0 ? "" : tween.unitType),
                                                                       tween.rootPropertyValue,
                                                                       tween.scrollData);

                            /*******************
                               Hooks: Part II
                            *******************/

                            /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                            if (CSS.Hooks.registered[property]) {
                                /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                                if (CSS.Normalizations.registered[hookRoot]) {
                                    Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                                } else {
                                    Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                                }
                            }

                            /***************
                               Transforms
                            ***************/

                            /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
                            if (adjustedSetData[0] === "transform") {
                                transformPropertyExists = true;
                            }
                        }
                    }

                    /****************
                        mobileHA
                    ****************/

                    /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
                       It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
                    if (opts.mobileHA) {
                        /* Don't set the null transform hack if we've already done so. */
                        if (Data(element).transformCache.translate3d === undefined) {
                            /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                            Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

                            transformPropertyExists = true;
                        }
                    }

                    if (transformPropertyExists) {
                        CSS.flushTransformCache(element);
                    }
                }

                /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
                   Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
                if (opts.display !== undefined && opts.display !== "none") {
                    Velocity.State.calls[i][2].display = false;
                }
                if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                    Velocity.State.calls[i][2].visibility = false;
                }


                /* Pass the elements and the timing data (percentComplete, msRemaining, and timeStart) into the progress callback. */
                if (opts.progress) {
                    opts.progress.call(callContainer[1],
                                       callContainer[1],
                                       percentComplete,
                                       Math.max(0, (timeStart + opts.duration) - timeCurrent),
                                       timeStart);
                }

                /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
                if (percentComplete === 1) {
                    completeCall(i);
                }
            }
        }

        /* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
        if (Velocity.State.isTicking) {
            ticker(tick);
        }
    }

    /**********************
        Call Completion
    **********************/

    /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
    function completeCall (callIndex, isStopped) {
        /* Ensure the call exists. */
        if (!Velocity.State.calls[callIndex]) {
            return false;
        }

        /* Pull the metadata from the call. */
        var call = Velocity.State.calls[callIndex][0],
            elements = Velocity.State.calls[callIndex][1],
            opts = Velocity.State.calls[callIndex][2],
            resolver = Velocity.State.calls[callIndex][4];

        var remainingCallsExist = false;

        /*************************
           Element Finalization
        *************************/

        for (var i = 0, callLength = call.length; i < callLength; i++) {
            var element = call[i].element;

            /* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
            /* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
            /* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
            if (!isStopped && !opts.loop) {
                if (opts.display === "none") {
                    CSS.setPropertyValue(element, "display", opts.display);
                }

                if (opts.visibility === "hidden") {
                    CSS.setPropertyValue(element, "visibility", opts.visibility);
                }
            }

            /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
               a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
               an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
               we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
               is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
            if (opts.loop !== true && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
                /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
                if (Data(element)) {
                    Data(element).isAnimating = false;
                    /* Clear the element's rootPropertyValueCache, which will become stale. */
                    Data(element).rootPropertyValueCache = {};

                    var transformHAPropertyExists = false;
                    /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
                    $.each(CSS.Lists.transforms3D, function(i, transformName) {
                        var defaultValue = /^scale/.test(transformName) ? 1 : 0,
                            currentValue = Data(element).transformCache[transformName];

                        if (Data(element).transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                            transformHAPropertyExists = true;

                            delete Data(element).transformCache[transformName];
                        }
                    });

                    /* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
                    if (opts.mobileHA) {
                        transformHAPropertyExists = true;
                        delete Data(element).transformCache.translate3d;
                    }

                    /* Flush the subproperty removals to the DOM. */
                    if (transformHAPropertyExists) {
                        CSS.flushTransformCache(element);
                    }

                    /* Remove the "velocity-animating" indicator class. */
                    CSS.Values.removeClass(element, "velocity-animating");
                }
            }

            /*********************
               Option: Complete
            *********************/

            /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
            /* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
            if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
                /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                try {
                    opts.complete.call(elements, elements);
                } catch (error) {
                    setTimeout(function() { throw error; }, 1);
                }
            }

            /**********************
               Promise Resolving
            **********************/

            /* Note: Infinite loops don't return promises. */
            if (resolver && opts.loop !== true) {
                resolver(elements);
            }

            /****************************
               Option: Loop (Infinite)
            ****************************/

            if (opts.loop === true && !isStopped) {
                /* If a rotateX/Y/Z property is being animated to 360 deg with loop:true, swap tween start/end values to enable
                   continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
                $.each(Data(element).tweensContainer, function(propertyName, tweenContainer) {
                    if (/^rotate/.test(propertyName) && parseFloat(tweenContainer.endValue) === 360) {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 360;
                    }
                });

                Velocity(element, "reverse", { loop: true, delay: opts.delay });
            }

            /***************
               Dequeueing
            ***************/

            /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
               which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
               $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
            if (opts.queue !== false) {
                $.dequeue(element, opts.queue);
            }
        }

        /************************
           Calls Array Cleanup
        ************************/

        /* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
          (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
        Velocity.State.calls[callIndex] = false;

        /* Iterate through the calls array to determine if this was the final in-progress animation.
           If so, set a flag to end ticking and clear the calls array. */
        for (var j = 0, callsLength = Velocity.State.calls.length; j < callsLength; j++) {
            if (Velocity.State.calls[j] !== false) {
                remainingCallsExist = true;

                break;
            }
        }

        if (remainingCallsExist === false) {
            /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
            Velocity.State.isTicking = false;

            /* Clear the calls array so that its length is reset. */
            delete Velocity.State.calls;
            Velocity.State.calls = [];
        }
    }

    /******************
        Frameworks
    ******************/

    /* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
       If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
       also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
       accessible beyond just a per-element scope. This master object contains an .animate() method, which is later assigned to $.fn
       (if jQuery or Zepto are present). Accordingly, Velocity can both act on wrapped DOM elements and stand alone for targeting raw DOM elements. */
    global.Velocity = Velocity;

    if (global !== window) {
        /* Assign the element function to Velocity's core animate() method. */
        global.fn.velocity = animate;
        /* Assign the object function's defaults to Velocity's global defaults object. */
        global.fn.velocity.defaults = Velocity.defaults;
    }

    /***********************
       Packaged Redirects
    ***********************/

    /* slideUp, slideDown */
    $.each([ "Down", "Up" ], function(i, direction) {
        Velocity.Redirects["slide" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                begin = opts.begin,
                complete = opts.complete,
                computedValues = { height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: "" },
                inlineValues = {};

            if (opts.display === undefined) {
                /* Show the element before slideDown begins and hide the element after slideUp completes. */
                /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
                opts.display = (direction === "Down" ? (Velocity.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
            }

            opts.begin = function() {
                /* If the user passed in a begin callback, fire it now. */
                begin && begin.call(elements, elements);

                /* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
                for (var property in computedValues) {
                    /* Cache all inline values, we reset to upon animation completion. */
                    inlineValues[property] = element.style[property];

                    /* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
                       use forcefeeding to start from computed values and animate down to 0. */
                    var propertyValue = Velocity.CSS.getPropertyValue(element, property);
                    computedValues[property] = (direction === "Down") ? [ propertyValue, 0 ] : [ 0, propertyValue ];
                }

                /* Force vertical overflow content to clip so that sliding works as expected. */
                inlineValues.overflow = element.style.overflow;
                element.style.overflow = "hidden";
            }

            opts.complete = function() {
                /* Reset element to its pre-slide inline values once its slide animation is complete. */
                for (var property in inlineValues) {
                    element.style[property] = inlineValues[property];
                }

                /* If the user passed in a complete callback, fire it now. */
                complete && complete.call(elements, elements);
                promiseData && promiseData.resolver(elements);
            };

            Velocity(element, computedValues, opts);
        };
    });

    /* fadeIn, fadeOut */
    $.each([ "In", "Out" ], function(i, direction) {
        Velocity.Redirects["fade" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                propertiesMap = { opacity: (direction === "In") ? 1 : 0 },
                originalComplete = opts.complete;

            /* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
               callbacks by firing them only when the final element has been reached. */
            if (elementsIndex !== elementsSize - 1) {
                opts.complete = opts.begin = null;
            } else {
                opts.complete = function() {
                    if (originalComplete) {
                        originalComplete.call(elements, elements);
                    }

                    promiseData && promiseData.resolver(elements);
                }
            }

            /* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
            /* Note: We allow users to pass in "null" to skip display setting altogether. */
            if (opts.display === undefined) {
                opts.display = (direction === "In" ? "auto" : "none");
            }

            Velocity(this, propertiesMap, opts);
        };
    });

    return Velocity;
}((window.jQuery || window.Zepto || window), window, document);
}));

/******************
   Known Issues
******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */
},{}],14:[function(require,module,exports){
/**********************
   Velocity UI Pack
**********************/

/* VelocityJS.org UI Pack (5.0.0). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License. Portions copyright Daniel Eden, Christian Pucci. */

;(function (factory) {
    /* CommonJS module. */
    if (typeof require === "function" && typeof exports === "object" ) {
        module.exports = factory();
    /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define([ "velocity" ], factory);
    /* Browser globals. */
    } else {
        factory();
    }
}(function() {
return function (global, window, document, undefined) {

    /*************
        Checks
    *************/

    if (!global.Velocity || !global.Velocity.Utilities) {
        window.console && console.log("Velocity UI Pack: Velocity must be loaded first. Aborting.");
        return;
    } else {
        var Velocity = global.Velocity,
            $ = Velocity.Utilities;
    }

    var velocityVersion = Velocity.version,
        requiredVersion = { major: 1, minor: 1, patch: 0 };

    function greaterSemver (primary, secondary) {
        var versionInts = [];

        if (!primary || !secondary) { return false; }

        $.each([ primary, secondary ], function(i, versionObject) {
            var versionIntsComponents = [];

            $.each(versionObject, function(component, value) {
                while (value.toString().length < 5) {
                    value = "0" + value;
                }
                versionIntsComponents.push(value);
            });

            versionInts.push(versionIntsComponents.join(""))
        });

        return (parseFloat(versionInts[0]) > parseFloat(versionInts[1]));
    }

    if (greaterSemver(requiredVersion, velocityVersion)){
        var abortError = "Velocity UI Pack: You need to update Velocity (jquery.velocity.js) to a newer version. Visit http://github.com/julianshapiro/velocity.";
        alert(abortError);
        throw new Error(abortError);
    }

    /************************
       Effect Registration
    ************************/

    /* Note: RegisterUI is a legacy name. */
    Velocity.RegisterEffect = Velocity.RegisterUI = function (effectName, properties) {
        /* Animate the expansion/contraction of the elements' parent's height for In/Out effects. */
        function animateParentHeight (elements, direction, totalDuration, stagger) {
            var totalHeightDelta = 0,
                parentNode;

            /* Sum the total height (including padding and margin) of all targeted elements. */
            $.each(elements.nodeType ? [ elements ] : elements, function(i, element) {
                if (stagger) {
                    /* Increase the totalDuration by the successive delay amounts produced by the stagger option. */
                    totalDuration += i * stagger;
                }

                parentNode = element.parentNode;

                $.each([ "height", "paddingTop", "paddingBottom", "marginTop", "marginBottom"], function(i, property) {
                    totalHeightDelta += parseFloat(Velocity.CSS.getPropertyValue(element, property));
                });
            });

            /* Animate the parent element's height adjustment (with a varying duration multiplier for aesthetic benefits). */
            Velocity.animate(
                parentNode,
                { height: (direction === "In" ? "+" : "-") + "=" + totalHeightDelta },
                { queue: false, easing: "ease-in-out", duration: totalDuration * (direction === "In" ? 0.6 : 1) }
            );
        }

        /* Register a custom redirect for each effect. */
        Velocity.Redirects[effectName] = function (element, redirectOptions, elementsIndex, elementsSize, elements, promiseData) {
            var finalElement = (elementsIndex === elementsSize - 1);

            if (typeof properties.defaultDuration === "function") {
                properties.defaultDuration = properties.defaultDuration.call(elements, elements);
            } else {
                properties.defaultDuration = parseFloat(properties.defaultDuration);
            }

            /* Iterate through each effect's call array. */
            for (var callIndex = 0; callIndex < properties.calls.length; callIndex++) {
                var call = properties.calls[callIndex],
                    propertyMap = call[0],
                    redirectDuration = (redirectOptions.duration || properties.defaultDuration || 1000),
                    durationPercentage = call[1],
                    callOptions = call[2] || {},
                    opts = {};

                /* Assign the whitelisted per-call options. */
                opts.duration = redirectDuration * (durationPercentage || 1);
                opts.queue = redirectOptions.queue || "";
                opts.easing = callOptions.easing || "ease";
                opts.delay = parseFloat(callOptions.delay) || 0;
                opts._cacheValues = callOptions._cacheValues || true;

                /* Special processing for the first effect call. */
                if (callIndex === 0) {
                    /* If a delay was passed into the redirect, combine it with the first call's delay. */
                    opts.delay += (parseFloat(redirectOptions.delay) || 0);

                    if (elementsIndex === 0) {
                        opts.begin = function() {
                            /* Only trigger a begin callback on the first effect call with the first element in the set. */
                            redirectOptions.begin && redirectOptions.begin.call(elements, elements);

                            var direction = effectName.match(/(In|Out)$/);

                            /* Make "in" transitioning elements invisible immediately so that there's no FOUC between now
                               and the first RAF tick. */
                            if ((direction && direction[0] === "In") && propertyMap.opacity !== undefined) {
                                $.each(elements.nodeType ? [ elements ] : elements, function(i, element) {
                                    Velocity.CSS.setPropertyValue(element, "opacity", 0);
                                });
                            }

                            /* Only trigger animateParentHeight() if we're using an In/Out transition. */
                            if (redirectOptions.animateParentHeight && direction) {
                                animateParentHeight(elements, direction[0], redirectDuration + opts.delay, redirectOptions.stagger);
                            }
                        }
                    }

                    /* If the user isn't overriding the display option, default to "auto" for "In"-suffixed transitions. */
                    if (redirectOptions.display !== null) {
                        if (redirectOptions.display !== undefined && redirectOptions.display !== "none") {
                            opts.display = redirectOptions.display;
                        } else if (/In$/.test(effectName)) {
                            /* Inline elements cannot be subjected to transforms, so we switch them to inline-block. */
                            var defaultDisplay = Velocity.CSS.Values.getDisplayType(element);
                            opts.display = (defaultDisplay === "inline") ? "inline-block" : defaultDisplay;
                        }
                    }

                    if (redirectOptions.visibility && redirectOptions.visibility !== "hidden") {
                        opts.visibility = redirectOptions.visibility;
                    }
                }

                /* Special processing for the last effect call. */
                if (callIndex === properties.calls.length - 1) {
                    /* Append promise resolving onto the user's redirect callback. */
                    function injectFinalCallbacks () {
                        if ((redirectOptions.display === undefined || redirectOptions.display === "none") && /Out$/.test(effectName)) {
                            $.each(elements.nodeType ? [ elements ] : elements, function(i, element) {
                                Velocity.CSS.setPropertyValue(element, "display", "none");
                            });
                        }

                        redirectOptions.complete && redirectOptions.complete.call(elements, elements);

                        if (promiseData) {
                            promiseData.resolver(elements || element);
                        }
                    }

                    opts.complete = function() {
                        if (properties.reset) {
                            for (var resetProperty in properties.reset) {
                                var resetValue = properties.reset[resetProperty];

                                /* Format each non-array value in the reset property map to [ value, value ] so that changes apply
                                   immediately and DOM querying is avoided (via forcefeeding). */
                                /* Note: Don't forcefeed hooks, otherwise their hook roots will be defaulted to their null values. */
                                if (Velocity.CSS.Hooks.registered[resetProperty] === undefined && (typeof resetValue === "string" || typeof resetValue === "number")) {
                                    properties.reset[resetProperty] = [ properties.reset[resetProperty], properties.reset[resetProperty] ];
                                }
                            }

                            /* So that the reset values are applied instantly upon the next rAF tick, use a zero duration and parallel queueing. */
                            var resetOptions = { duration: 0, queue: false };

                            /* Since the reset option uses up the complete callback, we trigger the user's complete callback at the end of ours. */
                            if (finalElement) {
                                resetOptions.complete = injectFinalCallbacks;
                            }

                            Velocity.animate(element, properties.reset, resetOptions);
                        /* Only trigger the user's complete callback on the last effect call with the last element in the set. */
                        } else if (finalElement) {
                            injectFinalCallbacks();
                        }
                    };

                    if (redirectOptions.visibility === "hidden") {
                        opts.visibility = redirectOptions.visibility;
                    }
                }

                Velocity.animate(element, propertyMap, opts);
            }
        };

        /* Return the Velocity object so that RegisterUI calls can be chained. */
        return Velocity;
    };

    /*********************
       Packaged Effects
    *********************/

    /* Externalize the packagedEffects data so that they can optionally be modified and re-registered. */
    /* Support: <=IE8: Callouts will have no effect, and transitions will simply fade in/out. IE9/Android 2.3: Most effects are fully supported, the rest fade in/out. All other browsers: full support. */
    Velocity.RegisterEffect.packagedEffects =
        {
            /* Animate.css */
            "callout.bounce": {
                defaultDuration: 550,
                calls: [
                    [ { translateY: -30 }, 0.25 ],
                    [ { translateY: 0 }, 0.125 ],
                    [ { translateY: -15 }, 0.125 ],
                    [ { translateY: 0 }, 0.25 ]
                ]
            },
            /* Animate.css */
            "callout.shake": {
                defaultDuration: 800,
                calls: [
                    [ { translateX: -11 }, 0.125 ],
                    [ { translateX: 11 }, 0.125 ],
                    [ { translateX: -11 }, 0.125 ],
                    [ { translateX: 11 }, 0.125 ],
                    [ { translateX: -11 }, 0.125 ],
                    [ { translateX: 11 }, 0.125 ],
                    [ { translateX: -11 }, 0.125 ],
                    [ { translateX: 0 }, 0.125 ]
                ]
            },
            /* Animate.css */
            "callout.flash": {
                defaultDuration: 1100,
                calls: [
                    [ { opacity: [ 0, "easeInOutQuad", 1 ] }, 0.25 ],
                    [ { opacity: [ 1, "easeInOutQuad" ] }, 0.25 ],
                    [ { opacity: [ 0, "easeInOutQuad" ] }, 0.25 ],
                    [ { opacity: [ 1, "easeInOutQuad" ] }, 0.25 ]
                ]
            },
            /* Animate.css */
            "callout.pulse": {
                defaultDuration: 825,
                calls: [
                    [ { scaleX: 1.1, scaleY: 1.1 }, 0.50 ],
                    [ { scaleX: 1, scaleY: 1 }, 0.50 ]
                ]
            },
            /* Animate.css */
            "callout.swing": {
                defaultDuration: 950,
                calls: [
                    [ { rotateZ: 15 }, 0.20 ],
                    [ { rotateZ: -10 }, 0.20 ],
                    [ { rotateZ: 5 }, 0.20 ],
                    [ { rotateZ: -5 }, 0.20 ],
                    [ { rotateZ: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "callout.tada": {
                defaultDuration: 1000,
                calls: [
                    [ { scaleX: 0.9, scaleY: 0.9, rotateZ: -3 }, 0.10 ],
                    [ { scaleX: 1.1, scaleY: 1.1, rotateZ: 3 }, 0.10 ],
                    [ { scaleX: 1.1, scaleY: 1.1, rotateZ: -3 }, 0.10 ],
                    [ "reverse", 0.125 ],
                    [ "reverse", 0.125 ],
                    [ "reverse", 0.125 ],
                    [ "reverse", 0.125 ],
                    [ "reverse", 0.125 ],
                    [ { scaleX: 1, scaleY: 1, rotateZ: 0 }, 0.20 ]
                ]
            },
            "transition.fadeIn": {
                defaultDuration: 500,
                calls: [
                    [ { opacity: [ 1, 0 ] } ]
                ]
            },
            "transition.fadeOut": {
                defaultDuration: 500,
                calls: [
                    [ { opacity: [ 0, 1 ] } ]
                ]
            },
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipXIn": {
                defaultDuration: 700,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], rotateY: [ 0, -55 ] } ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipXOut": {
                defaultDuration: 700,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], rotateY: 55 } ]
                ],
                reset: { transformPerspective: 0, rotateY: 0 }
            },
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipYIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], rotateX: [ 0, -45 ] } ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipYOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], rotateX: 25 } ]
                ],
                reset: { transformPerspective: 0, rotateX: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipBounceXIn": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 0.725, 0 ], transformPerspective: [ 400, 400 ], rotateY: [ -10, 90 ] }, 0.50 ],
                    [ { opacity: 0.80, rotateY: 10 }, 0.25 ],
                    [ { opacity: 1, rotateY: 0 }, 0.25 ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipBounceXOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0.9, 1 ], transformPerspective: [ 400, 400 ], rotateY: -10 }, 0.50 ],
                    [ { opacity: 0, rotateY: 90 }, 0.50 ]
                ],
                reset: { transformPerspective: 0, rotateY: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipBounceYIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 0.725, 0 ], transformPerspective: [ 400, 400 ], rotateX: [ -10, 90 ] }, 0.50 ],
                    [ { opacity: 0.80, rotateX: 10 }, 0.25 ],
                    [ { opacity: 1, rotateX: 0 }, 0.25 ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipBounceYOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0.9, 1 ], transformPerspective: [ 400, 400 ], rotateX: -15 }, 0.50 ],
                    [ { opacity: 0, rotateX: 90 }, 0.50 ]
                ],
                reset: { transformPerspective: 0, rotateX: 0 }
            },
            /* Magic.css */
            "transition.swoopIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "100%", "50%" ], transformOriginY: [ "100%", "100%" ], scaleX: [ 1, 0 ], scaleY: [ 1, 0 ], translateX: [ 0, -700 ], translateZ: 0 } ]
                ],
                reset: { transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            "transition.swoopOut": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "50%", "100%" ], transformOriginY: [ "100%", "100%" ], scaleX: 0, scaleY: 0, translateX: -700, translateZ: 0 } ]
                ],
                reset: { transformOriginX: "50%", transformOriginY: "50%", scaleX: 1, scaleY: 1, translateX: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades and scales only.) */
            "transition.whirlIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: [ 1, 0 ], scaleY: [ 1, 0 ], rotateY: [ 0, 160 ] }, 1, { easing: "easeInOutSine" } ]
                ]
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades and scales only.) */
            "transition.whirlOut": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 0, "easeInOutQuint", 1 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: 0, scaleY: 0, rotateY: 160 }, 1, { easing: "swing" } ]
                ],
                reset: { scaleX: 1, scaleY: 1, rotateY: 0 }
            },
            "transition.shrinkIn": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: [ 1, 1.5 ], scaleY: [ 1, 1.5 ], translateZ: 0 } ]
                ]
            },
            "transition.shrinkOut": {
                defaultDuration: 600,
                calls: [
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: 1.3, scaleY: 1.3, translateZ: 0 } ]
                ],
                reset: { scaleX: 1, scaleY: 1 }
            },
            "transition.expandIn": {
                defaultDuration: 700,
                calls: [
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: [ 1, 0.625 ], scaleY: [ 1, 0.625 ], translateZ: 0 } ]
                ]
            },
            "transition.expandOut": {
                defaultDuration: 700,
                calls: [
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: 0.5, scaleY: 0.5, translateZ: 0 } ]
                ],
                reset: { scaleX: 1, scaleY: 1 }
            },
            /* Animate.css */
            "transition.bounceIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], scaleX: [ 1.05, 0.3 ], scaleY: [ 1.05, 0.3 ] }, 0.40 ],
                    [ { scaleX: 0.9, scaleY: 0.9, translateZ: 0 }, 0.20 ],
                    [ { scaleX: 1, scaleY: 1 }, 0.50 ]
                ]
            },
            /* Animate.css */
            "transition.bounceOut": {
                defaultDuration: 800,
                calls: [
                    [ { scaleX: 0.95, scaleY: 0.95 }, 0.35 ],
                    [ { scaleX: 1.1, scaleY: 1.1, translateZ: 0 }, 0.35 ],
                    [ { opacity: [ 0, 1 ], scaleX: 0.3, scaleY: 0.3 }, 0.30 ]
                ],
                reset: { scaleX: 1, scaleY: 1 }
            },
            /* Animate.css */
            "transition.bounceUpIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ -30, 1000 ] }, 0.60, { easing: "easeOutCirc" } ],
                    [ { translateY: 10 }, 0.20 ],
                    [ { translateY: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceUpOut": {
                defaultDuration: 1000,
                calls: [
                    [ { translateY: 20 }, 0.20 ],
                    [ { opacity: [ 0, "easeInCirc", 1 ], translateY: -1000 }, 0.80 ]
                ],
                reset: { translateY: 0 }
            },
            /* Animate.css */
            "transition.bounceDownIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 30, -1000 ] }, 0.60, { easing: "easeOutCirc" } ],
                    [ { translateY: -10 }, 0.20 ],
                    [ { translateY: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceDownOut": {
                defaultDuration: 1000,
                calls: [
                    [ { translateY: -20 }, 0.20 ],
                    [ { opacity: [ 0, "easeInCirc", 1 ], translateY: 1000 }, 0.80 ]
                ],
                reset: { translateY: 0 }
            },
            /* Animate.css */
            "transition.bounceLeftIn": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 30, -1250 ] }, 0.60, { easing: "easeOutCirc" } ],
                    [ { translateX: -10 }, 0.20 ],
                    [ { translateX: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceLeftOut": {
                defaultDuration: 750,
                calls: [
                    [ { translateX: 30 }, 0.20 ],
                    [ { opacity: [ 0, "easeInCirc", 1 ], translateX: -1250 }, 0.80 ]
                ],
                reset: { translateX: 0 }
            },
            /* Animate.css */
            "transition.bounceRightIn": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ -30, 1250 ] }, 0.60, { easing: "easeOutCirc" } ],
                    [ { translateX: 10 }, 0.20 ],
                    [ { translateX: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceRightOut": {
                defaultDuration: 750,
                calls: [
                    [ { translateX: -30 }, 0.20 ],
                    [ { opacity: [ 0, "easeInCirc", 1 ], translateX: 1250 }, 0.80 ]
                ],
                reset: { translateX: 0 }
            },
            "transition.slideUpIn": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 0, 20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideUpOut": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 0, 1 ], translateY: -20, translateZ: 0 } ]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideDownIn": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 0, -20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideDownOut": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 0, 1 ], translateY: 20, translateZ: 0 } ]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideLeftIn": {
                defaultDuration: 1000,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 0, -20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideLeftOut": {
                defaultDuration: 1050,
                calls: [
                    [ { opacity: [ 0, 1 ], translateX: -20, translateZ: 0 } ]
                ],
                reset: { translateX: 0 }
            },
            "transition.slideRightIn": {
                defaultDuration: 1000,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 0, 20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideRightOut": {
                defaultDuration: 1050,
                calls: [
                    [ { opacity: [ 0, 1 ], translateX: 20, translateZ: 0 } ]
                ],
                reset: { translateX: 0 }
            },
            "transition.slideUpBigIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 0, 75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideUpBigOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0, 1 ], translateY: -75, translateZ: 0 } ]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideDownBigIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 0, -75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideDownBigOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0, 1 ], translateY: 75, translateZ: 0 } ]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideLeftBigIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 0, -75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideLeftBigOut": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 0, 1 ], translateX: -75, translateZ: 0 } ]
                ],
                reset: { translateX: 0 }
            },
            "transition.slideRightBigIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 0, 75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideRightBigOut": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 0, 1 ], translateX: 75, translateZ: 0 } ]
                ],
                reset: { translateX: 0 }
            },
            /* Magic.css */
            "transition.perspectiveUpIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ "100%", "100%" ], rotateX: [ 0, -180 ] } ]
                ]
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveUpOut": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ "100%", "100%" ], rotateX: -180 } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveDownIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], rotateX: [ 0, 180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveDownOut": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], rotateX: 180 } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveLeftIn": {
                defaultDuration: 950,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], rotateY: [ 0, -180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveLeftOut": {
                defaultDuration: 950,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], rotateY: -180 } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveRightIn": {
                defaultDuration: 950,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ "100%", "100%" ], transformOriginY: [ 0, 0 ], rotateY: [ 0, 180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveRightOut": {
                defaultDuration: 950,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ "100%", "100%" ], transformOriginY: [ 0, 0 ], rotateY: 180 } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0 }
            }
        };

    /* Register the packaged effects. */
    for (var effectName in Velocity.RegisterEffect.packagedEffects) {
        Velocity.RegisterEffect(effectName, Velocity.RegisterEffect.packagedEffects[effectName]);
    }

    /*********************
       Sequence Running
    **********************/

    /* Sequence calls must use Velocity's single-object arguments syntax. */
    Velocity.RunSequence = function (originalSequence) {
        var sequence = $.extend(true, [], originalSequence);

        if (sequence.length > 1) {
            $.each(sequence.reverse(), function(i, currentCall) {
                var nextCall = sequence[i + 1];

                if (nextCall) {
                    /* Parallel sequence calls (indicated via sequenceQueue:false) are triggered
                       in the previous call's begin callback. Otherwise, chained calls are normally triggered
                       in the previous call's complete callback. */
                    var timing = (currentCall.options && currentCall.options.sequenceQueue === false) ? "begin" : "complete",
                        callbackOriginal = nextCall.options && nextCall.options[timing],
                        options = {};

                    options[timing] = function() {
                        var elements = nextCall.elements.nodeType ? [ nextCall.elements ] : nextCall.elements;

                        callbackOriginal && callbackOriginal.call(elements, elements);
                        Velocity(currentCall);
                    }

                    nextCall.options = $.extend({}, nextCall.options, options);
                }
            });

            sequence.reverse();
        }

        Velocity(sequence[0]);
    };
}((window.jQuery || window.Zepto || window), window, document);
}));
},{}],15:[function(require,module,exports){
// automatically inject CSS
require('../styles/content.less');

// third party modules
var gifjs = require('gif.js');
var $ = window.jQuery = window.$ = require('jquery');
var velocity = require('velocity-animate');
require('velocity-animate/velocity.ui.js');
var getFormData = require('./vendor/getFormData.js');
var toSeconds = require('./vendor/toSeconds.js');

// templates
var gifit_button_template = require('../templates/button.hbs');
var gifit_options_template = require('../templates/options.hbs');
var _gifit_progress_template = require('../templates/progress.hbs');

var Handlebars = require('hbsfy/runtime');
Handlebars.registerPartial( 'progress', _gifit_progress_template );

const MAXIMUM_Z_INDEX = 2147483647;

// get DOM selections sorted
var $window = $(window);
var $body = $('body');
var $youtube_player_api = $('#player-api');
var $youtube_video_container = $youtube_player_api.find('.html5-video-container');
var $youtube_video = $youtube_player_api.find('video.video-stream');
var youtube_video = $youtube_video.get(0);
var $youtube_controls = $youtube_player_api.find('.html5-video-controls');
var $youtube_controls_chrome = $youtube_controls.find('.html5-player-chrome');
var $gifit_button = $( gifit_button_template() );
$youtube_controls_chrome.append( $gifit_button );

var $gifit_canvas = $('<canvas id="gifit-canvas"></canvas>');
var gifit_canvas_context = $gifit_canvas.get(0).getContext('2d');
$body.append( $gifit_canvas );

var $gifit_options = $( gifit_options_template() );
var $gifit_options_form = $gifit_options.children('form');
$youtube_controls.append( $gifit_options );

var $gifit_progress = $gifit_options.find('.gifit-progress');
var $gifit_progress_container = $gifit_progress.find('.gifit-progress-container');
var $gifit_progress_progress = $gifit_progress.find('progress');
var $gifit_progress_image = $gifit_progress.find('img');
var $gifit_progress_close = $gifit_progress.find('.gifit-progress-close');

var gif;
var capture_interval;

$.Velocity.RegisterEffect('gifit.slideUpIn', {
	defaultDuration: 900,
	calls: [ 
		[{
			scaleX: [ 1, 0.8 ],
			translateY: [ 0, 350 ],
			translateZ: 0
		}, 1, {
			easing: [0.165, 0.84, 0.44, 1]
		}]
	]
});

$.Velocity.RegisterEffect('gifit.slideDownOut', {
	defaultDuration: 500,
	calls: [ 
		[{
			scaleX: [ 0.8, 1 ],
			translateY: 350,
			translateZ: 0
		}, 1, {
			easing: [0.895, 0.03, 0.685, 0.22]
		}]
	],
	reset: { translateY: 0 }
});

var generateGIF = function( options ){
	progressState();
	// generate GIF options
	var defaults = {
		width: 320,
		colors: 128,
		framerate: 10,
		quality: 5
	};
	options = $.extend( defaults, options );
	options.frame_interval = 1000 / options.framerate;
	options.start = toSeconds( options.start );
	options.end = toSeconds( options.end );
	options.height = Math.ceil( ( options.width * $youtube_video.height() ) / $youtube_video.width() );
	// create GIF encoder
	gif = new gifjs.GIF({
		workers: 8,
		quality: options.quality,
		repeat: 0,
		width: options.width,
		height: options.height,
		workerScript: chrome.runtime.getURL('scripts/vendor/gif.worker.js')
	});
	gif.on( 'finished', function( blob ){
		$gifit_progress_image.attr( 'src', URL.createObjectURL( blob ) );
		// you have to wait for the image to load in order to measure it
		// even though it's just a blob image
		$gifit_progress_image.on('load', function(){
			$gifit_progress_progress.attr( 'value', 0 );
			displayState();
		});
	});
	gif.on( 'progress', function( progress_ratio ){
		$gifit_progress_progress.attr( 'value', progress_ratio );
	});
	// make sure the video is paused before we jump frames
	if( !youtube_video.paused ){
		youtube_video.pause();
	}
	// prepare canvas for receiving frames
	$gifit_canvas
		.attr( 'width', options.width )
		.attr( 'height', options.height );
	// play the part of the video we want to convert
	youtube_video.currentTime = options.start;
	youtube_video.play();
	var addFrameInterval = setInterval( function(){
		if( youtube_video.currentTime >= options.end ){
			// render the GIF
			gif.render();
			youtube_video.pause();
			clearInterval( addFrameInterval );
			return;
		}
		gifit_canvas_context.drawImage( youtube_video, 0, 0, options.width, options.height );
		gif.addFrame( $gifit_canvas.get(0), {
			delay: options.frame_interval,
			copy: true
		});
	}, options.frame_interval );
};

var progressState = function(){
	$gifit_options_form.find('input, button').prop( 'disabled', true );
	$gifit_options.addClass('gifit-processing');
};

var displayState = function(){
	var image_height = $gifit_progress_image.height();
	$gifit_progress.addClass('gifit-loaded');
	$gifit_progress_container.css('height', image_height);
	$gifit_options_form.find('input, button').prop( 'disabled', false );
	$gifit_options.removeClass('gifit-processing');
	$gifit_options.addClass('gifit-displaying');
};

var normalState = function(){
	$gifit_options.removeClass('gifit-displaying');
	$gifit_options.removeClass('gifit-loaded');
	$gifit_progress_image.attr('src', '');
	$gifit_progress_container.css('height', '');
};

$gifit_button.on( 'click', function( e ){
	$body.toggleClass('gifit-active');
	if( $gifit_options.is(':visible') ){
		$gifit_options.velocity( 'gifit.slideDownOut', 250, {
			complete: function(){
				$gifit_options.find('fieldset, .gifit-actions').velocity({
					opacity: 0
				}, 0 );
			}
		});
	}
	else {
		$gifit_options.velocity( 'gifit.slideUpIn', 250 );
		$gifit_options.find('fieldset, .gifit-actions').velocity( 'transition.slideUpIn', { stagger: 35 }, 55 );
	}
});

$gifit_options_form.on( 'submit', function( e ){
	e.preventDefault();
	var options = getFormData( $gifit_options_form.get(0) );
	generateGIF( options );
});

$gifit_options.on( 'keydown keypress click contextmenu', function( e ){
	e.stopImmediatePropagation();
});

$gifit_progress_close.on( 'click', function( e ){
	e.preventDefault();
	normalState();
});

},{"../styles/content.less":18,"../templates/button.hbs":19,"../templates/options.hbs":20,"../templates/progress.hbs":21,"./vendor/getFormData.js":16,"./vendor/toSeconds.js":17,"gif.js":1,"hbsfy/runtime":9,"jquery":10,"velocity-animate":13,"velocity-animate/velocity.ui.js":14}],16:[function(require,module,exports){
var getFormData = function( form ){
    var form_data = {};
    Array.prototype.forEach.call( form.elements, function( el, i ){
        switch( el.tagName ){
            case 'INPUT':
            case 'TEXTAREA':
            case 'SELECT':
                var value = el.value;
                if( el.type === 'number' || el.type === 'range' ){
                    value = parseInt( value, 10 );
                }
                form_data[el.name] = value;
            break;
        }
    });
    return form_data;
};

module.exports = getFormData;
},{}],17:[function(require,module,exports){
var toSeconds = function( time_string ){
	var seconds = 0;
	var time_array = time_string.split(':').reverse();
	for( var i = 0; i < time_array.length; i++ ){
		var time_segment = parseFloat( time_array[i] );
		switch( i ){
			case 0:
				seconds += time_segment;
			break;
			case 1:
				seconds += time_segment * 60;
			break;
			case 2:
				seconds += time_segment * 60 * 60;
			break;
		}
	}
	return seconds;
};

module.exports = toSeconds;
},{}],18:[function(require,module,exports){
var css = "@font-face {\n  font-family: 'robotoregular';\n  src: url(data:application/font-woff;base64,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) format('woff');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'robotobold';\n  src: url(data:application/font-woff;base64,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) format('woff');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: 'arizoniaregular';\n  src: url(data:application/x-font-woff;charset=utf-8;base64,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) format('woff');\n  font-weight: normal;\n  font-style: normal;\n}\n@-webkit-keyframes glow {\n  0% {\n    background: #f23b3b;\n  }\n  50% {\n    background: #f66a6a;\n  }\n  100% {\n    background: #f23b3b;\n  }\n}\n#gifit-start {\n  float: right;\n  height: 27px;\n  line-height: 27px;\n  color: #757575;\n}\n#gifit-start:hover {\n  color: #a4a4a4;\n}\n#gifit-start .gifit-gif {\n  font-family: 'robotobold', sans-serif;\n}\n#gifit-start .gifit-it {\n  font-family: 'arizoniaregular', sans-serif;\n  font-size: 125%;\n}\nbody.gifit-active #gifit-start {\n  color: #ffffff;\n}\n#gifit-options {\n  display: none;\n  box-sizing: border-box;\n  position: absolute;\n  right: 0;\n  bottom: 35px;\n  z-index: 700;\n  width: 300px;\n  padding: 25px;\n  color: #afafaf;\n  background: rgba(255, 255, 255, 0.9);\n}\n#gifit-options fieldset,\n#gifit-options .gifit-actions {\n  opacity: 0;\n}\n#gifit-options form {\n  transition: -webkit-filter 300ms, opacity 300ms;\n}\n#gifit-options.gifit-processing #gifit-submit {\n  -webkit-animation: glow 2000ms infinite;\n}\n#gifit-options.gifit-processing form,\n#gifit-options.gifit-displaying form {\n  -webkit-filter: blur(2px);\n  opacity: 0.25;\n}\n#gifit-submit {\n  cursor: pointer;\n  display: block;\n  width: 130px;\n  margin: 25px auto 0 auto;\n  padding: 0 10px;\n  font-size: 24px;\n  line-height: 35px;\n  background: #eb0f0f;\n  border-radius: 3px;\n  outline: none;\n  transition: transform 150ms, background 100ms, box-shadow 150ms;\n}\n#gifit-submit:hover,\n#gifit-submit:focus {\n  transform: scale(1.025);\n  background: #f23b3b;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);\n}\n#gifit-submit:active {\n  transform: scale(0.95);\n  transition: transform 25ms;\n}\n#gifit-submit .gifit-gif {\n  font-family: 'robotobold', sans-serif;\n  color: #ffffff;\n}\n#gifit-submit .gifit-it {\n  font-family: 'arizoniaregular', sans-serif;\n  font-size: 125%;\n  color: #ffffff;\n}\n#gifit-canvas {\n  position: fixed;\n  top: -9999px;\n  left: -9999px;\n}\n.gifit-progress {\n  display: none;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  align-items: center;\n  justify-content: center;\n}\n.gifit-progress .gifit-progress-close {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}\n.gifit-progress .gifit-progress-close:after {\n  content: '×';\n  text-decoration: none;\n}\n.gifit-progress .gifit-progress-container {\n  position: relative;\n  width: 70%;\n  height: 5px;\n  overflow: hidden;\n  transition: width 350ms, height 350ms;\n}\n.gifit-progress .gifit-progress-container progress,\n.gifit-progress .gifit-progress-container img {\n  display: block;\n}\n.gifit-progress .gifit-progress-container progress {\n  -webkit-appearance: none;\n  width: 100%;\n  height: 100%;\n}\n.gifit-progress .gifit-progress-container img {\n  opacity: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  transition: opacity 250ms, -webkit-filter 750ms;\n  -webkit-filter: brightness(0%);\n}\n.gifit-progress.gifit-loaded .gifit-progress-container {\n  width: 80%;\n}\n.gifit-progress.gifit-loaded .gifit-progress-container img {\n  opacity: 1;\n  -webkit-filter: brightness(100%);\n}\n#gifit-options.gifit-processing .gifit-progress,\n#gifit-options.gifit-displaying .gifit-progress {\n  display: flex;\n}\n.gifit fieldset {\n  line-height: 35px;\n}\n.gifit label {\n  text-transform: uppercase;\n  font-size: 10px;\n  font-family: 'robotobold', sans-serif;\n  line-height: 10px;\n}\n.gifit input {\n  outline: none;\n}\n.gifit input[type=\"text\"],\n.gifit input[type=\"number\"] {\n  font-family: 'robotoregular', sans-serif;\n  font-size: 22px;\n  color: rgba(25, 25, 25, 0.8);\n  background: none;\n  transition: background-color 550ms, border-color 550ms;\n  border: #d7d7d7 1px solid;\n  border-radius: 3px;\n  padding: 13px 7px 0 7px;\n}\n.gifit input[type=\"text\"]:focus,\n.gifit input[type=\"number\"]:focus {\n  color: #191919;\n  background-color: rgba(255, 255, 255, 0.75);\n  border-color: #bebebe;\n  transition: background-color 225ms, border-color 225ms;\n}\n.gifit input[type=\"text\"][type=\"number\"]::-webkit-inner-spin-button,\n.gifit input[type=\"number\"][type=\"number\"]::-webkit-inner-spin-button,\n.gifit input[type=\"text\"][type=\"number\"]::-webkit-outer-spin-button,\n.gifit input[type=\"number\"][type=\"number\"]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.gifit input[type=\"range\"] {\n  -webkit-appearance: none;\n  cursor: pointer;\n  vertical-align: middle;\n  margin-top: 0;\n  background: transparent;\n}\n.gifit input[type=\"range\"]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  position: relative;\n  z-index: 2;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #ebebeb;\n  border: #191919 2px solid;\n  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.25);\n  transition: border-width 125ms, background-color 125ms;\n}\n.gifit input[type=\"range\"]::-webkit-slider-runnable-track {\n  position: relative;\n  /* the visible range bar */\n}\n.gifit input[type=\"range\"]::-webkit-slider-runnable-track:after {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 5px;\n  left: 0;\n  z-index: 1;\n  height: 5px;\n  width: 100%;\n  border-radius: 3px;\n  background: #d7d7d7;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25);\n  transition: background-color 125ms;\n}\n.gifit input[type=\"range\"]:active::-webkit-slider-thumb {\n  border-width: 5px;\n}\n.gifit input[type=\"range\"]:focus::-webkit-slider-thumb {\n  background-color: #ffffff;\n}\n.gifit input[type=\"range\"]:focus::-webkit-slider-runnable-track:after {\n  background: #cacaca;\n}\n.gifit fieldset {\n  clear: both;\n  margin-bottom: 10px;\n}\n.gifit progress::-webkit-progress-bar {\n  overflow: hidden;\n  border-radius: 3px;\n  background: #d7d7d7;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25);\n}\n.gifit progress::-webkit-progress-value {\n  background: #191919;\n}\n.gifit .gifit-input-container {\n  position: relative;\n  width: 100%;\n}\n.gifit .gifit-input-container.gifit-input-container__range {\n  box-sizing: border-box;\n  padding: 20px 7px 0 7px;\n}\n.gifit .gifit-input-container label {\n  position: absolute;\n  top: 5px;\n  left: 7px;\n}\n.gifit .gifit-input-container input {\n  display: block;\n  box-sizing: border-box;\n  width: 100%;\n}\n.gifit .gifit-inputs-linked__vertical .gifit-input-container:first-child input {\n  border-radius: 3px 3px 0 0;\n}\n.gifit .gifit-inputs-linked__vertical .gifit-input-container:last-child input {\n  margin-top: -1px;\n  border-radius: 0 0 3px 3px;\n  border-top-color: transparent;\n}\n.gifit .gifit-inputs-linked__vertical .gifit-input-container:last-child input:focus {\n  border-top-color: #bebebe;\n}\n.gifit .gifit-inputs-linked__horizontal .gifit-input-container {\n  width: 50%;\n  float: left;\n}\n.gifit .gifit-inputs-linked__horizontal .gifit-input-container:first-child input {\n  border-radius: 3px 0 0 3px;\n}\n.gifit .gifit-inputs-linked__horizontal .gifit-input-container:last-child input {\n  margin-left: -1px;\n  border-radius: 0 3px 3px 0;\n  border-left-color: transparent;\n}\n.gifit .gifit-inputs-linked__horizontal .gifit-input-container:last-child input:focus {\n  border-left-color: #bebebe;\n}\n";(require('lessify'))(css); module.exports = css;
},{"lessify":12}],19:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"gifit-start\" class=\"ytp-button ytp-button-gif gifit\" role=\"button\">\n	<span class=\"gifit-gif\">GIF</span><span class=\"gifit-it\">it!</span>\n</div>";
  });

},{"hbsfy/runtime":9}],20:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;


  buffer += "<div id=\"gifit-options\" class=\"gifit\">\n	<form>\n		<fieldset class=\"gifit-inputs-linked__horizontal\">\n			<div class=\"gifit-input-container\">\n				<label for=\"gifit-option-start\">Start</label>\n				<input id=\"gifit-option-start\" name=\"start\" type=\"text\" value=\"0:00\" />\n			</div>\n			<div class=\"gifit-input-container\">\n				<label for=\"gifit-option-end\">End</label>\n				<input id=\"gifit-option-end\" name=\"end\" type=\"text\" value=\"0:01\" />\n			</div>\n		</fieldset>\n		<fieldset class=\"gifit-inputs-linked__horizontal\">\n			<div class=\"gifit-input-container\">\n				<label for=\"gifit-option-width\">Width</label>\n				<input id=\"gifit-option-width\" name=\"width\" type=\"number\" min=\"10\" max=\"1920\" value=\"320\" />\n			</div>\n			<div class=\"gifit-input-container\">\n				<label for=\"gifit-option-height\">Height</label>\n				<input id=\"gifit-option-height\" name=\"height\" type=\"number\" min=\"10\" max=\"1080\" value=\"240\" />\n			</div>\n		</fieldset>\n		<fieldset class=\"gifit-inputs-linked__horizontal\">\n			<div class=\"gifit-input-container\">\n				<label for=\"gifit-option-framerate\">Frame Rate</label>\n				<input id=\"gifit-option-framerate\" name=\"framerate\" type=\"number\" min=\"1\" max=\"60\" value=\"10\" />\n			</div>\n			<div class=\"gifit-input-container\">\n				<label for=\"gifit-option-colors\">Colors</label>\n				<input id=\"gifit-option-colors\" name=\"colors\" type=\"number\" min=\"2\" max=\"256\" value=\"128\" />\n			</div>\n		</fieldset>\n		<fieldset>\n			<div class=\"gifit-input-container gifit-input-container__range\">\n				<label for=\"gifit-option-quality\">Quality</label>\n				<input id=\"gifit-option-quality\" name=\"quality\" type=\"range\" min=\"0\" max=\"10\" value=\"5\" />\n			</div>\n		</fieldset>\n		<div class=\"gifit-actions\">\n			<button id=\"gifit-submit\" type=\"submit\">\n				<span class=\"gifit-gif\">GIF</span><span class=\"gifit-it\">it!</span>\n			</button>\n		</div>\n	</form>\n	";
  stack1 = self.invokePartial(partials.progress, 'progress', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });

},{"hbsfy/runtime":9}],21:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gifit-progress\">\n	<a class=\"gifit-progress-close\" href=\"#close\"></a>\n	<div class=\"gifit-progress-container\">\n		<progress max=\"1\"></progress>\n		<img />\n	</div>\n</div>";
  });

},{"hbsfy/runtime":9}]},{},[15])