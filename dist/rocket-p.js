(function(root, factory){


if(typeof define === 'function' && define.amd){
    define(['zepto', 'exports'], function($, exports){
        factory(root, exports, $); 
    });
}
else{
    root.Rocket = factory(root, {}, root.Zepto || root.jQuery);
}


})(this, function(root, Rocket, $) {
;var Utils = (function(){

var toString = Object.prototype.toString;

function isObject(obj){
    var type = typeof obj;
    return type === 'function'
        || type === 'object'
            // typeof null == 'object'
            && !!obj;
}

function isArray(obj){
    if(Array.isArray){
        return Array.isArray(obj);
    }
    return toString.call(obj) === '[object Array]';
}


function isFunction(obj){
    return toString.call(obj) === '[object Function]';
}

function isString(obj){
    return toString.call(obj) === '[object String]';
}

function isArguments(obj){
    return toString.call(obj) === '[object Arguments]';
}

function isRegExp(obj){
    return toString.call(obj) === '[object RegExp]';
}

function isNumber(obj){
    return toString.call(obj) === '[object Number]';
}

function isDate(obj){
    return toString.call(obj) === '[object Date]';
}

function isError(obj){
    return toString.call(obj) === '[object Error]';
}

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj){
    if(obj == null) return true;
    if(isArray(obj) || isString(obj) || isArguments(obj)) return obj.length === 0;
    for(var key in obj) if(has(obj, key)) return false;
    return true;
}


// Internal recursive comparison function for `isEqual`.
function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  // A strict comparison is necessary because `null == undefined`.
  if (a == null || b == null) return a === b;
  // Unwrap any wrapped objects.
  // if (a instanceof _) a = a._wrapped;
  // if (b instanceof _) b = b._wrapped;
  // Compare `[[Class]]` names.
  var className = toString.call(a);
  if (className !== toString.call(b)) return false;
  switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case '[object RegExp]':
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return '' + a === '' + b;
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN
      if (+a !== +a) return +b !== +b;
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
  }

  var areArrays = className === '[object Array]';
  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') return false;

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                             isFunction(bCtor) && bCtor instanceof bCtor)
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
  }

  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);

  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false;
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!(eq(a[length], b[length], aStack, bStack))) return false;
    }
  } else {
    // Deep compare objects.
    var keys = _keys(a), key;
    length = keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (_keys(b).length !== length) return false;
    while (length--) {
      // Deep compare each member
      key = keys[length];
      if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
};


function isEqual(a, b){
    return eq(a, b, [], []);
}




function pick(obj, iteratee, context){
    var result = {}, key;

    if(obj == null) return result;
    if(isFunction(iteratee)){
        iteratee = optimizeCb(iteratee, context);
        for(key in obj){
            var value = obj[key];
            if(iteratee(value, key, obj)) result[key] = value;
        }
    }
    else{
        var keys = _flatten(arguments, false, false, 1);
        obj = new Object(obj);
        for(var i=0, length = keys.length; i<length; i++){
            key = keys[i];
            if(key in obj) result[key] = obj[key];
        }
    }
    return result;
}

// Internal implementation of a recursive `flatten` function.
function _flatten(input, shallow, strict, startIndex) {
    var output = [], idx = 0, value;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
        value = input[i];
        if (value && value.length >= 0 && (isArray(value) || isArguments(value))) {
            //flatten current level of array or arguments object
            if (!shallow) value = _flatten(value, shallow, strict);
            var j = 0, len = value.length;
            output.length += len;
            while (j < len) {
                output[idx++] = value[j++];
            }
        } else if (!strict) {
            output[idx++] = value;
        }
    }
    return output;
};

function flatten(array, shallow){
    return _flatten(array, shallow, false);
}






function each(obj, iteratee, context){
    if(obj == null) return obj;
    iteratee = optimizeCb(iteratee, context);
    var i, length = obj.length;
    if(length === +length){
        for(i=0; i<length; i++){
            iteratee(obj[i], i, obj);
        }
    }
    else{
        var keys = _keys(obj);
        for(i=0, length=keys.length; i<length; i++){
            iteratee(obj[keys[i]], keys[i], obj);
        }
    }
    return obj;
}


// Convert an object into a list of `[key, value]` pairs.
function _pairs(obj) {
    var keys = _keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
        pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
};


var _identity = function(value) {return value};
var _matches = function(attrs){
    var pairs = _pairs(attrs), length = pairs.length;
    return function(obj) {
        if (obj == null) return !length;
        obj = new Object(obj);
        for (var i = 0; i < length; i++) {
            var pair = pairs[i], key = pair[0];
            if (pair[1] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };
};
var _property = function(key){
    return function(obj){
        return obj == null ? void 0 : obj[key];
    };
};


function _cb(value, context, argCount){
    if(value == null) return _identity;
    if(isFunction(value)) return optimizeCb(value, context, argCount);
    if(isObject(value)) return _matches(value);
    return _property(value);
}


function map(obj, iteratee, context){
    if(obj == null) return [];
    iteratee = _cb(iteratee, context); 
    var keys = obj.length !== +obj.length && _keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;

    for(var index=0; index<length; index++){
        currentKey = keys ? keys[index] : index;
        results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
}


function any(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _cb(predicate, context);
    var keys = obj.length !== +obj.length && _keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
        currentKey = keys ? keys[index] : index;
        if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
}




// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
        case 1: return function(value) {
            return func.call(context, value);
        };
        case 2: return function(value, other) {
            return func.call(context, value, other);
        };
        case 3: return function(value, index, collection) {
            return func.call(context, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
        };
    }
    return function() {
        return func.apply(context, arguments);
    };
};


// create a (shallow-cloned) duplicate of an object.
function clone(obj){
    if(!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
}


function defaults(obj){
    if (!isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
}

function has(obj, key){
    return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

function _keys(obj){
    if(!isObject(obj)) return [];
    if(Object.keys) return Object.keys(obj);
    var keys = [];
    for(var key in obj) {
        if(has(obj, key)){
            keys.push(key);
        }
    }
    return keys;
}

function keysIn(obj){
    if (!isObject(obj)) return [];
    var keys = [];
    for(var key in obj) keys.push(key);
    return keys;
}

function createAssigner(keysFunc){
    return function(obj){
        var length = arguments.length;
        if(length < 2 || obj == null) return obj;
        for(var index = 0; index < length; index++){
            var source = arguments[index],
                keys = keysFunc(source),
                len = keys.length;
            for(var i=0; i<len; i++){
                var key = keys[i];
                obj[key] = source[key];
            }
        }
        return obj;
    };
}

var extend = createAssigner(keysIn);




// If the value of the named `property` is a function then invoke it with the
// `object` as context; otherwise, return it.
function result(object, property, fallback){
    var value = object == null ? void 0 : object[property];
    if(value === void 0){
        value = fallback;
    }

    return isFunction(value) ? value.call(object) : value;
}


var idCounter = 0;
function uniqueId(prefix){
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
}



var methodMap = {
    'create': 'POST'
    , 'update': 'PUT'
    , 'patch': 'PATCH'
    , 'delete': 'DELETE'
    , 'read': 'GET'
}; 

function ajax(){
    return $.ajax.apply($, arguments);
}

var syncArgs = {};

function sync(method, model, options){
    var type = methodMap[method];

    syncArgs.method = method;
    syncArgs.model = model;
    syncArgs.options = options;

    Utils.defaults(
        options || (options = {})
        , {
            emulateHTTP: false
            , emulateJSON: false
        }
    );

    var params = {type: type, dataType: 'json'};

    if(!options.url){
        params.url = result(model, 'url') || urlError();
    }

    if(options.data == null
        && model
        && (
            method === 'create'
            || method === 'update'
            || method === 'patch'
        )
    ){
        params.contentType = 'application/json';
        params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    if(options.emulateJSON){
        params.contentType = 'application/x-www-form-urlencoded';
        params.data = params.data ? {model: params.data} : {};
    }

    if(options.emulateHTTP
        && (
            type === 'PUT'
            || type === 'DELETE'
            || type === 'PATCH'
        )
    ){
        params.type = 'POST';
        if(options.emulateJSON) params.data._method = type;
        var beforeSend = options.beforeSend;
        options.beforeSend = function(xhr){
            xhr.setRequestHeader('X-HTTP-Method-Override', type);
            if(beforeSend) return beforeSend.apply(this, arguments);
        };
    }

    if(params.type !== 'GET'){
        params.processData = false;
    }

    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown){
        options.textStatus = textStatus;
        options.errorThrown = errorThrown;
        if(error) error.apply(this, arguments);
    };

    syncArgs.ajaxData = params.data;

    var xhr = options.xhr 
        = Utils.ajax(extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
}

function urlError(){
    throw new Error('A "url" property or function must be specified');
}


return {
    isObject: isObject
    , isFunction: isFunction
    , isArray: isArray
    , isEqual: isEqual
    , isEmpty: isEmpty
    , isRegExp: isRegExp
    , keys: _keys
    , defaults: defaults
    , extend: extend
    , result: result
    , pick: pick
    , flatten: flatten
    , each: each
    , map: map
    , any: any
    , clone: clone
    , has: has
    , uniqueId: uniqueId

    , ajax: ajax
    , sync: sync
    , syncArgs: syncArgs
};


})();
;function classExtend(protoProps, staticProps){

    var parentClass = this;
    var subClass;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if(protoProps && Utils.has(protoProps, 'constructor')){
        subClass = protoProps.constructor;
    }
    else{
        subClass = function(){ return parentClass.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    Utils.extend(subClass, parentClass, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = subClass; };
    Surrogate.prototype = parentClass.prototype;
    subClass.prototype = new Surrogate;

    function _superFactory(name, fn) {
        return function() {
            var tmp = this._super;

            /* Add a new ._super() method that is the same method */
            /* but on the super-class */
            this._super = parentClass.prototype[name] || function(){};

            /* The method only need to be bound temporarily, so we */
            /* remove it when we're done executing */
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
        };
    }

    if(protoProps){
        // Note: Does not take effect when name is `"constructor"`
        for(var name in protoProps){
            subClass.prototype[name] = 
                typeof protoProps[name] === 'function'
                    && typeof parentClass.prototype[name] === 'function'
                ? _superFactory(name, protoProps[name])
                : protoProps[name];
        }
    } 

    subClass._superClass = parentClass; 
    
    return subClass;
}
;var Events = (function(){


var slice = [].slice;
var eventSplitter = /\s+/;

// Implement fancy features of the Events API such as multiple event
// names `"change blur"` and jQuery-style event maps `{change: action}`
// in terms of the existing API.
function eventsApi(obj, action, name, rest){
    if(!name) return true;

    // Handle event maps.
    if(typeof name === 'object'){
        for(var key in name){
            obj[action].apply(obj, [key, name[key]].concat(rest));
        }
        return false;
    }

    // Handle space separated event names.
    if(eventSplitter.test(name)){
        var names = name.split(eventSplitter);
        for(var i=0, length = names.length; i<length; i++){
            obj[action].apply(obj, [names[i]].concat(rest));
        }
        return false;
    }

    return true;
}

function triggerEvents(events, args){
    var ev, i=-1, l=events.length, a1=args[0], a2=args[1], a3=args[2];

    switch(args.length){
        case 0: while(++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        case 1: while(++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
        case 2: while(++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
        case 3: while(++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
        default: while(++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
}


var Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context){
        if(!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({callback: callback, context: context, ctx: context || this});
        return this;
    }


    , once: function(name, callback, context){
        if(!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
        var self = this;
        // Note: todo
        var once = function(){
            self.off(name, once); 
            callback.apply(this, arguments);
        };
        once._callback = callback;
        return this.on(name, once, context);
    }


    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    , off: function(name, callback, context){
        if(!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
    
        // Remove all callbacks for all events.
        if(!name && !callback && !context){
            this._events = void 0;
            return this;
        }
        
        var names = name ? [name] : Utils.keys(this._events);
        for(var i=0, length = names.length; i<length; i++){
            name = names[i];
            
            var events = this._events[name];            
            if(!events) continue;

            if(!callback && !context){
                delete this._events[name];
                continue;
            }


            var remaining = [];
            for(var j=0, k=events.length; j<k; j++){
                var event = events[j];
                if(
                    callback && callback !== event.callback
                        && callback !== event.callback._callback
                    || context && context !== event.context
                ){
                    remaining.push(event);
                }
            }

            if(remaining.length){
                this._events[name] = remaining;
            }
            else{
                delete this._events[name];
            }

        }

        return this;
    }


    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    , trigger: function(name){
        if(!this._events) return this; 
        var args = slice.call(arguments, 1);
        if(!eventsApi(this, 'trigger', name, args)) return this;
        var events = this._events[name];
        var allEvents = this._events.all;
        if(events) triggerEvents(events, args);
        if(allEvents) triggerEvents(allEvents, arguments);
        return this;
    }


    // Inversion-of-control versions of `on` and `once`. Tell *this* object to
    // listen to an event in another object ... keeping track of what it's
    // listening to. 
    , listenTo: function(obj, name, callback){
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var id = obj._listenId || (obj._listenId = Utils.uniqueId('l'));
        listeningTo[id] = obj;
        if(!callback && typeof name === 'object') callback = this;
        obj.on(name, callback, this);
    }


    , listenToOnce: function(obj, name, callback){
        if(typeof name === 'object'){
            for(var event in name) this.listenToOnce(obj, event, name[event]);
            return this;
        }
        var cb = function(){
            this.stopListening(obj, name, cb);
            callback.apply(this, arguments);
        };
        cb._callback = callback;
        return this.listenTo(obj, name, cb);
    }


    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    , stopListening: function(obj, name, callback){
        var listeningTo = this._listeningTo;
        if(!listeningTo) return this;
        var remove = !name && !callback;
        if(!callback && typeof name === 'object') callback = this;
        if(obj) (listeningTo = {})[obj._listenId] = obj;
        for(var id in listeningTo){
            obj = listeningTo[id];
            obj.off(name, callback, this);
            if(remove || Utils.isEmpty(obj._events)) delete this._listeningTo[id];
        }
        return this;
    }



};


Events.bind = Events.on;
Events.unbind = Events.off;

return Events;


})();

;var History = (function(){


function History(){
    this.handlers = [];

    if(typeof window !== 'undefined'){
        this.location = window.location;
        this.history = window.history;
    }

    // Wrap a callback
    var me = this, func = me.checkUrl;
    me.checkUrl = function(){
        func.apply(me, arguments);
    };
}

var routeStripper = /^[#\/]|\s+$/g;
var rootStripper = /^\/+|\/+$/g;
var pathStripper = /#.*$/;

History.started = false;

Utils.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50

    // Are we at the app root?
    , atRoot: function() {
        var path = this.location.pathname.replace(/[^\/]$/, '$&/');
        return path === this.root && !this.getSearch();
    }

    // In IE6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    , getSearch: function() {
        var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
        return match ? match[0] : '';
    }

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    , getHash: function(window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : '';
    }

    // Get the pathname and search params, without the root.
    , getPath: function() {
        var path = decodeURI(this.location.pathname + this.getSearch());
        var root = this.root.slice(0, -1);
        if (!path.indexOf(root)) path = path.slice(root.length);
        return path.charAt(0) === '/' ? path.slice(1) : path;
    }

    // Get the cross-browser normalized URL fragment from the path or hash.
    , getFragment: function(fragment) {
        if (fragment == null) {
            if (this._hasPushState || !this._wantsHashChange) {
                fragment = this.getPath();
            } else {
                fragment = this.getHash();
            }
        }
        return fragment.replace(routeStripper, '');
    }

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    , start: function(options) {
        if (History.started) throw new Error('history has already been started');
        History.started = true;

        // Figure out the initial configuration. Do we need an iframe?
        // Is pushState desired ... is it available?
        this.options          = Utils.extend({root: '/'}, this.options, options);
        this.root             = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._hasHashChange   = 'onhashchange' in window;
        this._wantsPushState  = !!this.options.pushState;
        this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
        this.fragment         = this.getFragment();

        // Normalize root to always include a leading and trailing slash.
        this.root = ('/' + this.root + '/').replace(rootStripper, '/');

        // Transition from hashChange to pushState or vice versa if both are
        // requested.
        if (this._wantsHashChange && this._wantsPushState) {

            // If we've started off with a route from a `pushState`-enabled
            // browser, but we're currently in a browser that doesn't support it...
            if (!this._hasPushState && !this.atRoot()) {
                var root = this.root.slice(0, -1) || '/';
                this.location.replace(root + '#' + this.getPath());
                // Return immediately as browser will do redirect to new url
                return true;

            // Or if we've started out with a hash-based route, but we're currently
            // in a browser where it could be `pushState`-based instead...
            } else if (this._hasPushState && this.atRoot()) {
                this.navigate(this.getHash(), {replace: true});
            }

        }

        // Proxy an iframe to handle location events if the browser doesn't
        // support the `hashchange` event, HTML5 history, or the user wants
        // `hashChange` but not `pushState`.
        if (!this._hasHashChange && this._wantsHashChange && (!this._wantsPushState || !this._hasPushState)) {
            var iframe = document.createElement('iframe');
            iframe.src = 'javascript:0';
            iframe.style.display = 'none';
            iframe.tabIndex = -1;
            var body = document.body;
            // Using `appendChild` will throw on IE < 9 if the document is not ready.
            this.iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
            this.iframe.document.open().close();
            this.iframe.location.hash = '#' + this.fragment;
        }

        // Add a cross-platform `addEventListener` shim for older browsers.
        var addEventListener = window.addEventListener || function (eventName, listener) {
            return attachEvent('on' + eventName, listener);
        };

        // Depending on whether we're using pushState or hashes, and whether
        // 'onhashchange' is supported, determine how we check the URL state.
        if (this._hasPushState) {
            addEventListener('popstate', this.checkUrl, false);
        } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
            addEventListener('hashchange', this.checkUrl, false);
        } else if (this._wantsHashChange) {
            this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }

        if (!this.options.silent) return this.loadUrl();
    }

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    , stop: function() {
        // Add a cross-platform `removeEventListener` shim for older browsers.
        var removeEventListener = window.removeEventListener || function (eventName, listener) {
            return detachEvent('on' + eventName, listener);
        };

        // Remove window listeners.
        if (this._hasPushState) {
            removeEventListener('popstate', this.checkUrl, false);
        } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
            removeEventListener('hashchange', this.checkUrl, false);
        }

        // Clean up the iframe if necessary.
        if (this.iframe) {
            document.body.removeChild(this.iframe.frameElement);
            this.iframe = null;
        }

        // Some environments will throw when clearing an undefined interval.
        if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
        History.started = false;
    }

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    , route: function(route, callback) {
        this.handlers.unshift({route: route, callback: callback});
    }

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    , checkUrl: function(e) {
        var current = this.getFragment();

        // If the user pressed the back button, the iframe's hash will have
        // changed and we should use that for comparison.
        if (current === this.fragment && this.iframe) {
            current = this.getHash(this.iframe);
        }

        if (current === this.fragment) return false;
        if (this.iframe) this.navigate(current);
        this.loadUrl();
    }

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    , loadUrl: function(fragment) {
        fragment = this.fragment = this.getFragment(fragment);
        return Utils.any(this.handlers, function(handler) {
            if (handler.route.test(fragment)) {
                handler.callback(fragment);
                return true;
            }
        });
    }

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    , navigate: function(fragment, options) {
        if (!History.started) return false;
        if (!options || options === true) options = {trigger: !!options};

        // Normalize the fragment.
        fragment = this.getFragment(fragment || '');

        // Don't include a trailing slash on the root.
        var root = this.root;
        if (fragment === '' || fragment.charAt(0) === '?') {
            root = root.slice(0, -1) || '/';
        }
        var url = root + fragment;

        // Strip the hash and decode for matching.
        fragment = decodeURI(fragment.replace(pathStripper, ''));

        if (this.fragment === fragment) return;
        this.fragment = fragment;

        // If pushState is available, we use it to set the fragment as a real URL.
        if (this._hasPushState) {
            this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

        // If hash changes haven't been explicitly disabled, update the hash
        // fragment to store history.
        } else if (this._wantsHashChange) {
            this._updateHash(this.location, fragment, options.replace);
            if (this.iframe && (fragment !== this.getHash(this.iframe))) {
                // Opening and closing the iframe tricks IE7 and earlier to push a
                // history entry on hash-tag change.  When replace is true, we don't
                // want this.
                if (!options.replace) this.iframe.document.open().close();
                this._updateHash(this.iframe.location, fragment, options.replace);
            }

        // If you've told us that you explicitly don't want fallback hashchange-
        // based history, then `navigate` becomes a page refresh.
        } else {
            return this.location.assign(url);
        }
        if (options.trigger) return this.loadUrl(fragment);
    }

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    , _updateHash: function(location, fragment, replace) {
        if (replace) {
            var href = location.href.replace(/(javascript:|#).*$/, '');
            location.replace(href + '#' + fragment);
        } else {
            // Some browsers require that `hash` contains a leading #.
            location.hash = '#' + fragment;
        }
    }


});

return new History();

})(); 
;var Model = (function(){

var Model = function(attributes, options){
        var attrs = attributes || {};
        options || (options = {});
        this.attributes = {};
        if(options.parse) attrs = this.parse(attrs, options) || {};
        attrs = Utils.defaults({}, attrs, Utils.result(this, 'defaults'));
        this.set(attrs, options);
        this.changed = {};
        this.initialize.apply(this, arguments);
    };


Utils.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null

    // The value returned during the last failed validation.
    , validationError: null 

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    , idAttribute: 'id' 

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    , initialize: function(){}
    
    // Return a copy of the model's attributes object.
    , toJSON: function(options){
        return Utils.clone(this.attributes);
    }

    // Proxy `Utils.sync` by default
    , sync: function(){
        return Utils.sync.apply(this, arguments);
    }

    // todo
    , escape: function(attr){}
    
    , get: function(attr){
        return this.attributes[attr];
    }

    , has: function(attr){
        return this.get(attr) != null;
    }


    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    , set: function(key, val, options){
        var attr, attrs, unset, changes, silent, changing, prev, current;
        if(key == null) return this;

        if(typeof key === 'object'){
            attrs = key;
            options = val;
        } 
        else{
            (attrs = {})[key] = val;
        }

        options || (options = {});

        // Run validation
        if(!this._validate(attrs, options)) return false;


        // Extract attributes and options. 
        unset = options.unset;
        silent = options.silent;
        changes = [];
        changing = this._changing;

        this._changing = true;

        if(!changing){
            // initialize when starting changing
            this._previousAttributes = Utils.clone(this.attributes);
            this.changed = {};
        }
        current = this.attributes;
        prev = this._previousAttributes;

        // Check for changes of `id`
        if(this.idAttribute in attrs) this.id = attrs[this.idAttribute];

        // For each `set` attribute, update or delete the current value.
        for(attr in attrs){
            val = attrs[attr];
            if(!Utils.isEqual(current[attr], val)) changes.push(attr);
            if(!Utils.isEqual(prev[attr], val)){
                this.changed[attr] = val;
            }
            else{
                delete this.changed[attr];
            }
            unset ? delete current[attr] : ( current[attr] = val );
        }

        // Trigger all relevant attribute changes.
        if(!silent){
            if(changes.length) this._pending = options;
            for(var i=0, length = changes.length; i<length; i++){
                this.trigger('change:' + changes[i], this, current[changes[i]], options);
            }
        } 

        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if(changing) return this;

        // Only the first set can arrive here, nested set can never.
        if(!silent){
            while(this._pending){
                options = this._pending;
                this._pending = false;
                this.trigger('change', this, options);
            }
        }
        this._pending = false; 
        this._changing = false; 
        return this;

    }


    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    , unset: function(attr, options) {
        return this.set(attr, void 0, Utils.extend({}, options, {unset: true}));
    }


    // Clear all attributes on the model, firing `"change"`.
    , clear: function(options){
        var attrs = {};
        for (var key in this.attributes) attrs[key] = void 0;
        return this.set(attrs, Utils.extend({}, options, {unset: true}));
    }


    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    , hasChanged: function(attr){
        if(attr == null) return !Utils.isEmpty(this.changed); 
        return Utils.has(this.changed, attr); 
    }

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    , changedAttributes: function(diff){
        if(!diff) return this.hasChanged() ? Utils.clone(this.changed) : false;
        var val, changed = false;
        var old = this._changing ? this._previousAttributes : this.attributes;
        for(var attr in diff){
            if(Utils.isEqual(old[attr], (val = diff[attr]))) continue;
            (changed || (changed = {}))[attr] = val;
        }
        return changed;
    }


    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    , previous: function(attr){
        if(attr == null || !this._previousAttributes) return null;
        return this._previousAttributes[attr];
    }


    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    , previousAttributes: function(){
        return Utils.clone(this._previousAttributes);
    }


    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    , fetch: function(options){
        options = options ? Utils.clone(options) : {};
        if(options.parse === void 0) options.parse = true;
        var model = this;
        var success = options.success;
        options.success = function(resp){
            if(!model.set(model.parse(resp, options), options)) return false;
            if(success) success(model, resp, options);
            model.trigger('sync', model, resp, options);
        };
        wrapError(this, options);
        return this.sync('read', this, options);
    }


    , save: function(key, val, options){
        var attrs, method, xhr, attributes = this.attributes;
    
        if(key == null || typeof key == 'object'){
            attrs = key;
            options = val;
        }
        else {
            (attrs = {})[key] = val;
        }

        options = Utils.extend({validate: true}, options);

        // If we're not waiting and attributes exist, save acts as
        // `set(attr).save(null, opts)` with validation. Otherwise, check if
        // the model will be valid when the attributes, if any, are set.
        if(attrs && !options.wait){
            if(!this.set(attrs, options)) return false;
        }
        else{
            if(!this._validate(attrs, options)) return false;
        }

        // Set temporary attributes if `{wait: true}`.
        if(attrs && options.wait){
            this.attributes = Utils.extend({}, attributes, attrs);
        }


        // After a successful server-side save, the client is (optionally)
        // updated with the server-side state.
        if(options.parse === void 0) options.parse = true;
        var model = this;
        var success = options.success;

        options.success = function(resp) {
            // Ensure attributes are restored during synchronous saves.
            model.attributes = attributes;
            var serverAttrs = model.parse(resp, options);
            // merge server into local when wait flag is on
            if(options.wait) serverAttrs = Utils.extend(attrs || {}, serverAttrs);
            if(Utils.isObject(serverAttrs) && !model.set(serverAttrs, options)){
                return false;
            }
            if(success) success(model, resp, options);
            model.trigger('sync', model, resp, options);
        };
        wrapError(this, options);



        method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
        if(method === 'patch' && !options.attrs) options.attrs = attrs;
    
        xhr = this.sync(method, this, options);
        
        // Restore attributes.
        if(attrs && options.wait) this.attributes = attributes; 

        return xhr;
    }


    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    , destroy: function(options){
        options = options ? Utils.clone(options) : {};
        var model = this;
        var success = options.success;
        
        var destroy = function(){
            model.stopListening();
            model.trigger('destroy', model, model.collection, options);
        };

        options.success = function(resp){
            if(options.wait || model.isNew()) destroy();
            if(success) success(model, resp, options);
            if(!model.isNew()) model.trigger('sync', model, resp, options);
        };

        if(this.isNew()){
            options.success();
            return false;
        }
        wrapError(this, options);
        
        var xhr = this.sync('delete', this, options);
        if(!options.wait) destroy();
        return xhr;
    }

    
    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    , url: function(){
        var base = Utils.result(this, 'urlRoot') 
                || Utils.result(this.collection, 'url')
                || urlError(); 
        if(this.isNew()) return base;
        return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id); 
    }

    
    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    , parse: function(resp, options){
        return resp;
    } 


    // Create a new model with identical attributes to this one.
    , clone: function(){
        return new this.constructor(this.attributes);
    }


    // A model is new if it has never been saved to the server, and lacks an id.
    , isNew: function(){
        return !this.has(this.idAttribute);
    }


    // Check if the model is currently in a valid state.
    , isValid: function(options){
        return this._validate({}, Utils.extend(options || {}, {validate: true}));
    }


    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    , _validate: function(attrs, options){
        if(!options.validate || !this.validate) return true;
        attrs = Utils.extend({}, this.attributes, attrs);
        var error = this.validationError = this.validate(attrs, options) || null;
        if(!error) return true;
        this.trigger('invalid', this, error, Utils.extend(options, {validationError: error}));
        return false;
    }


});


function wrapError(model, options){
    var error = options.error;
    options.error = function(resp){
        if(error) error(model, resp, options);
        model.trigger('error', model, resp, options);
    }
}

Model.extend = classExtend;

return Model;

})();
;var Router = (function(){


var Router = function(options){
    options || (options = {});
    if(options.routes) this.routes = options.routes;

    this.history = options.history || this.history || History;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
};

/**
 * 'named/optional/(y:z)'
 * 'optional(/:item)'
 */
var optionalParam = /\((.*?)\)/g;

/**
 * 'named/:param1/:param2'
 * 'named(/:param1)'
 */
var namedParam = /(\(\?)?:\w+/g;

/**
 * '*first/complex-*part/*rest'
 * '*anything'
 */
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

Utils.extend(Router.prototype, Events, {

    initialize: function(){}

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    , route: function(route, name, callback){
        if(!Utils.isRegExp(route)) route = this._routeToRegExp(route);
        if(Utils.isFunction(name)){
            callback = name;
            name = '';
        }
        if(!callback) callback = this[name];
        var router = this, history = Utils.result(this, 'history');
        history.route(route, function(fragment){
            var args = router._extractParameters(route, fragment);
            if(router.execute(callback, args, name) !== false){
                router.trigger.apply(router, ['route:' + name].concat(args));
                router.trigger('route', name, args);
                history.trigger('route', router, name, args);
            }
        });
        return this;
    } 

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    , execute: function(callback, args, name){
        if(callback) callback.apply(this, args);
    }

    , navigate: function(fragment, options){
        Utils.result(this, 'history')
            .navigate(fragment, options);
        return this;
    }

    , _bindRoutes: function(){
        if(!this.routes) return;
        this.routes = Utils.result(this, 'routes');
        var route, routes = Utils.keys(this.routes);
        while((route = routes.pop()) != null){
            this.route(route, this.routes[route]);
        }
    }
    
    , _routeToRegExp: function(route){
        route = route.replace(escapeRegExp, '\\$&')
                    .replace(optionalParam, '(?:$1)?')
                    .replace(namedParam, function(match, optional){
                        return optional ? match : '([^/?]+)'; 
                    })
                    .replace(splatParam, '([^?]*?)');

        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    }

    , _extractParameters: function(route, fragment){
        var params = route.exec(fragment).slice(1);
        return Utils.map(params, function(param, i){
            // Query params should not be decoded
            if(i === params.length - 1) return param || null;
            return param ? decodeURIComponent(param) : null;
        });
    }


});

Router.extend = classExtend;

return Router;


})();
;var View = (function(){

var viewOptions = [
        'model'
        , 'collection'
        , 'el'
        , 'id'
        , 'attributes'
        , 'className'
        , 'tagName'
        , 'events'
    ];

var delegateEventSplitter = /^(\S+)\s*(.*)$/;

var View = function(options){
    this.cid = Utils.uniqueId('view');
    options || (options = {});
    Utils.extend(this, Utils.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
};


Utils.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div'

    , $: function(selector){
        return this.$el.find(selector);
    }

    , initialize: function(){}

    , render: function(){
        return this;
    }

    , remove: function(){
        this._removeElement();
        this.stopListening();
        return this;
    }

    , _removeElement: function(){
        this.$el.remove();
    }

    , setElement: function(element){
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
    }

    , _setElement: function(el){
        this.$el = el instanceof $ ? el : $(el);
        this.el = this.$el[0];
    }

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    , delegateEvents: function(events){
        if(!(events || (events = Utils.result(this, 'events')))) return this;
        this.undelegateEvents();
        for(var key in events){
            var method = events[key];
            if(!Utils.isFunction(method)) method = this[method];
            if(!method) continue;
            var match = key.match(delegateEventSplitter);
            var me = this;
            this.delegate(match[1], match[2], function(){method.apply(me, arguments);});
        }
    }

    , delegate: function(eventName, selector, listener){
        // Namespace: delegateEvents + cid
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
    }

    , undelegateEvents: function(){
        if(this.$el) this.$el.off('.delegateEvents' + this.cid); 
        return this;
    }

    , undelegate: function(eventName, selector, listener){
        this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
    }

    , _createElement: function(tagName){
        return document.createElement(tagName);
    }

    , _ensureElement: function(){
        if(!this.el){
            var attrs = Utils.extend({}, Utils.result(this, 'attributes'));
            if(this.id) attrs.id = Utils.result(this, 'id');
            if(this.className) attrs['class'] = Utils.result(this, 'className');
            this.setElement(this._createElement(Utils.result(this, 'tagName')));
            this._setAttributes(attrs);
        }
        else{
            this.setElement(Utils.result(this, 'el'));
        }
    }

    , _setAttributes: function(attributes){
        this.$el.attr(attributes);
    }

});

View.extend = classExtend;

return View;


})();
;
Utils.extend(
    Rocket
    , {
        Events: Events
        , Model: Model
        , View: View
        , History: History
        , Router: Router
        , Utils: Utils
        , extend: classExtend
    }
);

return Rocket;

});
