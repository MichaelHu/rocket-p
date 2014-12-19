(function(){

var router = null;
var location = null;
var lastRoute = null;
var lastArgs = [];

var onRoute = function(router, route, args){
    lastRoute = route;
    lastArgs = args;   
};



function Location(href){
    this.replace(href);
}

Utils.extend(Location.prototype, {


    parser: document.createElement('a')

    , replace: function(href){
        this.parser.href = href;
        Utils.extend(
            this
            , Utils.pick(
                this.parser
                , 'href'
                , 'hash'
                , 'host'
                , 'search'
                , 'fragment'
                , 'pathname'
                , 'protocol'
            )
        );

        // In IE, anchor.pathname does not contain a leading slash though
        // window.location.pathname does.
        if (!/^\//.test(this.pathname)) this.pathname = '/' + this.pathname;
    }

    , toString: function(){
        return this.href;
    }


});


module('Router', {

    setup: function(){
        location = new Location('http://example.com');
        History.location = location;
        router = new newRouter({testing: 101});
        History.interval = 9;
        History.start({pushState: false}); 
        lastRoute = null;
        lastArgs = [];
        History.on('route', onRoute);
    }

    , teardown: function(){
        History.stop();
        History.off('route', onRoute);
    }

});


var ExternalObject = {
    value: 'unset'
    , routingFunction: function(value){
        this.value = value;
    }
};

var realRoutingFunction = ExternalObject.routingFunction;
ExternalObject.routingFunction = function(){
    realRoutingFunction.apply(ExternalObject, arguments);
};


var newRouter = Router.extend({

    count: 0

    , routes: {
        /* router                     route       */
        "noCallback":                 "noCallback",
        "counter":                    "counter",
        "search/:query":              "search",
        "search/:query/p:page":       "search",
        "charñ":                      "charUTF",
        "char%C3%B1":                 "charEscaped",
        "contacts":                   "contacts",
        "contacts/new":               "newContact",
        "contacts/:id":               "loadContact",
        "route-event/:arg":           "routeEvent",
        "optional(/:item)":           "optionalItem",
        "named/optional/(y:z)":       "namedOptional",
        "splat/*args/end":            "splat",
        ":repo/compare/*from...*to":  "github",
        "decode/:named/*splat":       "decode",
        "*first/complex-*part/*rest": "complex",
        "query/:entity":              "query",
        "function/:value":            ExternalObject.routingFunction,
        "*anything":                  "anything"
    }

    , initialize: function(options){
        this.testing = options.testing;
        this.route('implicit', 'implicit');
    }

    , _routeToRegExp: function(route){
        var reg = this._super(route);
        // console.log(reg);
        return reg;
    }

    , counter: function() {
        this.count++;
    }

    , implicit: function() {
        this.count++;
    }

    , search: function(query, page) {
        this.query = query;
        this.page = page;
    }

    , charUTF: function() {
        this.charType = 'UTF';
    }

    , charEscaped: function() {
        this.charType = 'escaped';
    }

    , contacts: function(){
        this.contact = 'index';
    }

    , newContact: function(){
        this.contact = 'new';
    }

    , loadContact: function(){
        this.contact = 'load';
    }

    , optionalItem: function(arg){
        this.arg = arg != void 0 ? arg : null;
    }

    , splat: function(args) {
        this.args = args;
    }

    , github: function(repo, from, to) {
        this.repo = repo;
        this.from = from;
        this.to = to;
    }

    , complex: function(first, part, rest) {
        this.first = first;
        this.part = part;
        this.rest = rest;
    }

    , query: function(entity, args) {
        this.entity    = entity;
        this.queryArgs = args;
    }

    , anything: function(whatever) {
        this.anything = whatever;
    }

    , namedOptional: function(z) {
        this.z = z;
    }

    , decode: function(named, path) {
        this.named = named;
        this.path = path;
    }

    , routeEvent: function(arg) {
    }


});



test("initialize", 1, function() {
    equal(router.testing, 101);
});

test("routes (simple)", 4, function() {
    location.replace('http://example.com#search/news');
    History.checkUrl();

    equal(router.query, 'news');
    equal(router.page, void 0);
    equal(lastRoute, 'search');
    equal(lastArgs[0], 'news');
});


test("routes (simple, but unicode)", 4, function() {
    location.replace('http://example.com#search/тест');
    History.checkUrl();

    equal(router.query, "тест");
    equal(router.page, void 0);
    equal(lastRoute, 'search');
    equal(lastArgs[0], "тест");
});


test("routes (two part)", 2, function() {
    location.replace('http://example.com#search/nyc/p10');
    History.checkUrl();
    equal(router.query, 'nyc');
    equal(router.page, '10');
});


test("routes via navigate", 2, function() {
    History.navigate('search/manhattan/p20', {trigger: true});
    equal(router.query, 'manhattan');
    equal(router.page, '20');
});


test("routes via navigate with params", 1, function() {
    History.navigate('query/test?a=b', {trigger: true});
    equal(router.queryArgs, 'a=b');
});

test("routes via navigate for backwards-compatibility", 2, function() {
    History.navigate('search/manhattan/p20', true);
    equal(router.query, 'manhattan');
    equal(router.page, '20');
});

test("reports matched route via nagivate", 1, function() {
    ok(History.navigate('search/manhattan/p20', true));
});


test("route precedence via navigate", 6, function(){
    // check both 0.9.x and backwards-compatibility options
    Utils.each([ { trigger: true }, true ], function( options ){
        History.navigate('contacts', options);
        equal(router.contact, 'index');
        History.navigate('contacts/new', options);
        equal(router.contact, 'new');
        History.navigate('contacts/foo', options);
        equal(router.contact, 'load');
    });
});

test("loadUrl is not called for identical routes.", 0, function() {
    var bakLoadUrl = History.loadUrl;
    History.loadUrl = function(){ ok(false); };

    location.replace('http://example.com#route');
    History.navigate('route');
    History.navigate('/route');
    History.navigate('/route');

    History.loadUrl = bakLoadUrl;
});


test("use implicit callback if none provided", 1, function() {
    router.count = 0;
    router.navigate('implicit', {trigger: true});
    equal(router.count, 1);
});

test("routes via navigate with {replace: true}", 1, function() {
    location.replace('http://example.com#start_here');
    History.checkUrl();
    var bakReplace = location.replace;
    location.replace = function(href) {
        strictEqual(href, new Location('http://example.com#end_here').href);
    };
    History.navigate('end_here', {replace: true});
    location.replace = bakReplace;
});


test("routes (splats)", 1, function() {
    location.replace('http://example.com#splat/long-list/of/splatted_99args/end');
    History.checkUrl();
    equal(router.args, 'long-list/of/splatted_99args');
});


test("routes (github)", 3, function() {
    location.replace('http://example.com#backbone/compare/1.0...braddunbar:with/slash');
    History.checkUrl();
    equal(router.repo, 'backbone');
    equal(router.from, '1.0');
    equal(router.to, 'braddunbar:with/slash');
});


test("routes (optional)", 2, function() {
    location.replace('http://example.com#optional');
    History.checkUrl();
    ok(!router.arg);
    location.replace('http://example.com#optional/thing');
    History.checkUrl();
    equal(router.arg, 'thing');
});

test("routes (complex)", 3, function() {
    location.replace('http://example.com#one/two/three/complex-part/four/five/six/seven');
    History.checkUrl();
    equal(router.first, 'one/two/three');
    equal(router.part, 'part');
    equal(router.rest, 'four/five/six/seven');
});


test("routes (query)", 5, function() {
    location.replace('http://example.com#query/mandel?a=b&c=d');
    History.checkUrl();
    equal(router.entity, 'mandel');
    equal(router.queryArgs, 'a=b&c=d');
    equal(lastRoute, 'query');
    equal(lastArgs[0], 'mandel');
    equal(lastArgs[1], 'a=b&c=d');
});

test("routes (anything)", 1, function() {
    location.replace('http://example.com#doesnt-match-a-route');
    History.checkUrl();
    equal(router.anything, 'doesnt-match-a-route');
});

test("routes (function)", function() {
    // Note: need to off?
    router.on('route', function(name) {
        ok(name === '');
    });
    equal(ExternalObject.value, 'unset');
    location.replace('http://example.com#function/set');
    History.checkUrl();
    equal(ExternalObject.value, 'set');
});

test("Decode named parameters, not splats.", 2, function() {
    location.replace('http://example.com#decode/a%2Fb/c%2Fd/e');
    History.checkUrl();
    strictEqual(router.named, 'a/b');
    strictEqual(router.path, 'c/d/e');
});

test("fires event when router doesn't have callback on it", 1, function() {
    router.on("route:noCallback", function(){ ok(true); });
    location.replace('http://example.com#noCallback');
    History.checkUrl();
});


test("No events are triggered if #execute returns false.", 1, function() {
    var newRouter = Router.extend({

            routes: {
                foo: function() {
                    ok(true);
                }
            },

            execute: function(callback, args) {
                callback.apply(this, args);
                return false;
            }

        });

    var router = new newRouter;

    router.on('route route:foo', function() {
        ok(false);
    });

    var callback = function(){ok(false);};

    History.on('route', callback);

    location.replace('http://example.com#foo');
    History.checkUrl();
    
    History.off('route', callback);
});

test("#933, #908 - leading slash", 2, function() {
    location.replace('http://example.com/root/foo');

    History.stop();

    var history = Utils.extend(new History.constructor, {location: location});
    history.start({root: '/root', hashChange: false, silent: true});
    strictEqual(history.getFragment(), 'foo');

    history.stop();
    history = Utils.extend(new History.constructor, {location: location});
    history.start({root: '/root/', hashChange: false, silent: true});
    strictEqual(history.getFragment(), 'foo');

    history.stop();
    History.start();
});

test("#967 - Route callback gets passed encoded values.", 3, function() {
    var route = 'has%2Fslash/complex-has%23hash/has%20space';
    History.navigate(route, {trigger: true});
    strictEqual(router.first, 'has/slash');
    strictEqual(router.part, 'has#hash');
    strictEqual(router.rest, 'has space');
});


test("correctly handles URLs with % (#868)", 3, function() {
    location.replace('http://example.com#search/fat%3A1.5%25');
    History.checkUrl();
    location.replace('http://example.com#search/fat');
    History.checkUrl();
    equal(router.query, 'fat');
    equal(router.page, void 0);
    equal(lastRoute, 'search');
});

test("#2666 - Hashes with UTF8 in them.", 2, function() {
    History.navigate('charñ', {trigger: true});
    equal(router.charType, 'UTF');
    History.navigate('char%C3%B1', {trigger: true});
    equal(router.charType, 'UTF');
});

test("#1185 - Use pathname when hashChange is not wanted.", 1, function() {
    History.stop();

    location.replace('http://example.com/path/name#hash');
    var history = Utils.extend(new History.constructor, {location: location});
    history.start({hashChange: false});
    var fragment = history.getFragment();
    strictEqual(fragment, location.pathname.replace(/^\//, ''));
    console.log(fragment);
    history.stop();

    History.start();
});

test("#1206 - Strip leading slash before location.assign.", 1, function() {
    History.stop();

    location.replace('http://example.com/root/');
    var history = Utils.extend(new History.constructor, {location: location});
    history.start({hashChange: false, root: '/root/'});

    var bakAssign = location.assign;
    location.assign = function(pathname) {
        strictEqual(pathname, '/root/fragment');
    };
    history.navigate('/fragment');
    location.assign = bakAssign;
    history.stop();

    History.start();
});

test("#1387 - Root fragment without trailing slash.", 1, function() {
    History.stop();

    location.replace('http://example.com/root');
    var history = Utils.extend(new History.constructor, {location: location});
    history.start({hashChange: false, root: '/root/', silent: true});
    strictEqual(history.getFragment(), '');
    history.stop();

    History.start();
});

test("#1366 - History does not prepend root to fragment.", 2, function() {
    History.stop();

    location.replace('http://example.com/root/');
    var history = Utils.extend(new History.constructor, {
            location: location,
            history: {
                pushState: function(state, title, url) {
                    strictEqual(url, '/root/x');
                }
            }
        });

    history.start({
        root: '/root/',
        pushState: true,
        hashChange: false
    });
    history.navigate('x');
    strictEqual(history.fragment, 'x');

    history.stop();

    History.start();
});

test("Normalize root.", 1, function() {
    History.stop();

    location.replace('http://example.com/root');
    var history = Utils.extend(new History.constructor, {
            location: location,
            history: {
                pushState: function(state, title, url) {
                    strictEqual(url, '/root/fragment');
                }
            }
        });

    history.start({
        pushState: true,
        root: '/root',
        hashChange: false
    });
    history.navigate('fragment');
    history.stop();

    History.start();
});

test("Normalize root.", 1, function() {
    History.stop();

    location.replace('http://example.com/root#fragment');
    var history = Utils.extend(new History.constructor, {
            location: location,
            history: {
                pushState: function(state, title, url) {},
                replaceState: function(state, title, url) {
                    strictEqual(url, '/root/fragment');
                }
            }
        });
    history.start({
        pushState: true,
        root: '/root'
    });
    history.stop();

    History.start();
});

test("Normalize root.", 1, function() {
    History.stop();

    location.replace('http://example.com/root');
    var history = Utils.extend(new History.constructor, { 
            location: location,
            history: {
                pushState: function(state, title, url) {},
                replaceState: function(state, title, url) {}
            }
        });
    // loadUrl should be invoked
    history.loadUrl = function() { ok(true); };
    history.start({
        pushState: true,
        root: '/root'
    });
    history.stop();

    History.start();
});

test("Normalize root - leading slash.", 1, function() {
    History.stop();

    location.replace('http://example.com/root');
    var history = Utils.extend(new History.constructor, {
        location: location,
        history: {
            pushState: function(){},
            replaceState: function(){}
        }
    });
    history.start({root: 'root'});
    strictEqual(history.root, '/root/');
    history.stop();

    History.start();
});

test("Transition from hashChange to pushState.", 1, function() {
    History.stop();

    location.replace('http://example.com/root#x/y');
    var history = Utils.extend(new History.constructor, {
            location: location,
            history: {
                pushState: function(){},
                replaceState: function(state, title, url){
                    strictEqual(url, '/root/x/y');
                }
            }
        });
    history.start({
        root: 'root',
        pushState: true
    });
    history.stop();

    History.start();
});

test("#1619: Router: Normalize empty root", 1, function() {
    History.stop();
    location.replace('http://example.com/');

    var history = Utils.extend(new History.constructor, {
        location: location,
        history: {
            pushState: function(){},
            replaceState: function(){}
        }
    });
    history.start({root: ''});
    strictEqual(history.root, '/');
    history.stop();

    History.start();
});

test("#1619: Router: nagivate with empty root", 1, function() {
    History.stop();
    location.replace('http://example.com/');

    var history = Utils.extend(new History.constructor, {
            location: location,
            history: {
                pushState: function(state, title, url) {
                    strictEqual(url, '/fragment');
                }
            }
        });
    history.start({
        pushState: true,
        root: '',
        hashChange: false
    });
    history.navigate('fragment');
    history.stop();

    History.start();
});

test("Transition from pushState to hashChange.", 1, function() {
    History.stop();

    location.replace('http://example.com/root/x/y?a=b');
    var bakReplace = location.replace;
    location.replace = function(url) {
        strictEqual(url, '/root#x/y?a=b');
    };

    var history = Utils.extend(new History.constructor, {
            location: location,
            history: {
                pushState: null,
                replaceState: null
            }
        });

    history.start({
        root: 'root',
        pushState: true
    });
    location.replace = bakReplace;
    history.stop();

    History.start();
});

test("#1695 - hashChange to pushState with search.", 1, function() {
    History.stop();

    location.replace('http://example.com/root#x/y?a=b');
    var history = Utils.extend(new History.constructor, {
            location: location,
            history: {
                pushState: function(){},
                replaceState: function(state, title, url){
                    strictEqual(url, '/root/x/y?a=b');
                }
            }
        });
    history.start({
        root: 'root',
        pushState: true
    });
    history.stop();

    History.start();
});

test("#1746 - Router allows empty route.", 2, function() {
    var newRouter = Router.extend({
            routes: {'': 'empty'},
            empty: function(){},
            route: function(router, route){
                strictEqual(router, '');
                strictEqual(route, 'empty');
            }
        });
    new newRouter;
});

test("#1794 - Trailing space in fragments.", 1, function() {
    var history = new History.constructor;
    strictEqual(history.getFragment('fragment   '), 'fragment');
});

test("#1820 - Leading slash and trailing space.", 1, function() {
    var history = new History.constructor;
    strictEqual(history.getFragment('/fragment '), 'fragment');
});
return;

  test("#1980 - Optional parameters.", 2, function() {
    location.replace('http://example.com#named/optional/y');
    History.checkUrl();
    strictEqual(router.z, undefined);
    location.replace('http://example.com#named/optional/y123');
    History.checkUrl();
    strictEqual(router.z, '123');
  });

  test("#2062 - Trigger 'route' event on router instance.", 2, function() {
    router.on('route', function(name, args) {
      strictEqual(name, 'routeEvent');
      deepEqual(args, ['x', null]);
    });
    location.replace('http://example.com#route-event/x');
    History.checkUrl();
  });

  test("#2255 - Extend routes by making routes a function.", 1, function() {
    var RouterBase = Backbone.Router.extend({
      routes: function() {
        return {
          home:  "root",
          index: "index.html"
        };
      }
    });

    var RouterExtended = RouterBase.extend({
      routes: function() {
        var _super = RouterExtended.__super__.routes;
        return _.extend(_super(),
          { show:   "show",
            search: "search" });
      }
    });

    var router = new RouterExtended();
    deepEqual({home: "root", index: "index.html", show: "show", search: "search"}, router.routes);
  });

  test("#2538 - hashChange to pushState only if both requested.", 0, function() {
    History.stop();
    location.replace('http://example.com/root?a=b#x/y');
    History = _.extend(new Backbone.History, {
      location: location,
      history: {
        pushState: function(){},
        replaceState: function(){ ok(false); }
      }
    });
    History.start({
      root: 'root',
      pushState: true,
      hashChange: false
    });
  });

  test('No hash fallback.', 0, function() {
    History.stop();
    History = _.extend(new Backbone.History, {
      location: location,
      history: {
        pushState: function(){},
        replaceState: function(){}
      }
    });

    var Router = Backbone.Router.extend({
      routes: {
        hash: function() { ok(false); }
      }
    });
    var router = new Router;

    location.replace('http://example.com/');
    History.start({
      pushState: true,
      hashChange: false
    });
    location.replace('http://example.com/nomatch#hash');
    History.checkUrl();
  });

  test('#2656 - No trailing slash on root.', 1, function() {
    History.stop();
    History = _.extend(new Backbone.History, {
      location: location,
      history: {
        pushState: function(state, title, url){
          strictEqual(url, '/root');
        }
      }
    });
    location.replace('http://example.com/root/path');
    History.start({pushState: true, hashChange: false, root: 'root'});
    History.navigate('');
  });

  test('#2656 - No trailing slash on root.', 1, function() {
    History.stop();
    History = _.extend(new Backbone.History, {
      location: location,
      history: {
        pushState: function(state, title, url) {
          strictEqual(url, '/');
        }
      }
    });
    location.replace('http://example.com/path');
    History.start({pushState: true, hashChange: false});
    History.navigate('');
  });

  test('#2656 - No trailing slash on root.', 1, function() {
    History.stop();
    History = _.extend(new Backbone.History, {
      location: location,
      history: {
        pushState: function(state, title, url){
          strictEqual(url, '/root?x=1');
        }
      }
    });
    location.replace('http://example.com/root/path');
    History.start({pushState: true, hashChange: false, root: 'root'});
    History.navigate('?x=1');
  });

  test('#2765 - Fragment matching sans query/hash.', 2, function() {
    History.stop();
    History = _.extend(new Backbone.History, {
      location: location,
      history: {
        pushState: function(state, title, url) {
          strictEqual(url, '/path?query#hash');
        }
      }
    });

    var Router = Backbone.Router.extend({
      routes: {
        path: function() { ok(true); }
      }
    });
    var router = new Router;

    location.replace('http://example.com/');
    History.start({pushState: true, hashChange: false});
    History.navigate('path?query#hash', true);
  });

  test('Do not decode the search params.', function() {
    var Router = Backbone.Router.extend({
      routes: {
        path: function(params){
          strictEqual(params, 'x=y z');
        }
      }
    });
    var router = new Router;
    History.navigate('path?x=y%20z', true);
  });

  test('Navigate to a hash url.', function() {
    History.stop();
    History = _.extend(new Backbone.History, {location: location});
    History.start({pushState: true});
    var Router = Backbone.Router.extend({
      routes: {
        path: function(params) {
          strictEqual(params, 'x=y');
        }
      }
    });
    var router = new Router;
    location.replace('http://example.com/path?x=y#hash');
    History.checkUrl();
  });

  test('#navigate to a hash url.', function() {
    History.stop();
    History = _.extend(new Backbone.History, {location: location});
    History.start({pushState: true});
    var Router = Backbone.Router.extend({
      routes: {
        path: function(params) {
          strictEqual(params, 'x=y');
        }
      }
    });
    var router = new Router;
    History.navigate('path?x=y#hash', true);
  });

  test('unicode pathname', 1, function() {
    location.replace('http://example.com/myyjä');
    History.stop();
    History = _.extend(new Backbone.History, {location: location});
    var Router = Backbone.Router.extend({
      routes: {
        myyjä: function() {
          ok(true);
        }
      }
    });
    new Router;
    History.start({pushState: true});
  });

  test('newline in route', 1, function() {
    location.replace('http://example.com/stuff%0Anonsense?param=foo%0Abar');
    History.stop();
    History = _.extend(new Backbone.History, {location: location});
    var Router = Backbone.Router.extend({
      routes: {
        'stuff\nnonsense': function() {
          ok(true);
        }
      }
    });
    new Router;
    History.start({pushState: true});
  });

  test('Router#execute receives callback, args, name.', 3, function() {
    location.replace('http://example.com#foo/123/bar?x=y');
    History.stop();
    History = _.extend(new Backbone.History, {location: location});
    var Router = Backbone.Router.extend({
      routes: {'foo/:id/bar': 'foo'},
      foo: function(){},
      execute: function(callback, args, name) {
        strictEqual(callback, this.foo);
        deepEqual(args, ['123', 'x=y']);
        strictEqual(name, 'foo');
      }
    });
    var router = new Router;
    History.start();
  });

  test("pushState to hashChange with only search params.", 1, function() {
    History.stop();
    location.replace('http://example.com?a=b');
    location.replace = function(url) {
      strictEqual(url, '/#?a=b');
    };
    History = _.extend(new Backbone.History, {
      location: location,
      history: null
    });
    History.start({pushState: true});
  });

  test("#3123 - History#navigate decodes before comparison.", 1, function() {
    History.stop();
    location.replace('http://example.com/shop/search?keyword=short%20dress');
    History = _.extend(new Backbone.History, {
      location: location,
      history: {
        pushState: function(){ ok(false); },
        replaceState: function(){ ok(false); }
      }
    });
    History.start({pushState: true});
    History.navigate('shop/search?keyword=short%20dress', true);
    strictEqual(History.fragment, 'shop/search?keyword=short dress');
  });

  test('#3175 - Urls in the params', 1, function() {
    History.stop();
    location.replace('http://example.com#login?a=value&backUrl=https%3A%2F%2Fwww.msn.com%2Fidp%2Fidpdemo%3Fspid%3Dspdemo%26target%3Db');
    History = _.extend(new Backbone.History, {location: location});
    var router = new Backbone.Router;
    router.route('login', function(params) {
      strictEqual(params, 'a=value&backUrl=https%3A%2F%2Fwww.msn.com%2Fidp%2Fidpdemo%3Fspid%3Dspdemo%26target%3Db');
    });
    History.start();
  });

  test('#3358 - pushState to hashChange transition with search params', 1, function() {
    History.stop();
    location.replace('/root?foo=bar');
    location.replace = function(url) {
      strictEqual(url, '/root#?foo=bar');
    };
    History = _.extend(new Backbone.History, {
      location: location,
      history: {
        pushState: undefined,
        replaceState: undefined
      }
    });
    History.start({root: '/root', pushState: true});
  });






})();
