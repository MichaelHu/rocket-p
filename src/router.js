var Router = (function(){


var Router = function(options){
    options || (options = {});
    if(options.routes) this.routes = options.routes;
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
        var router = this;
        History.route(route, function(fragment){
            var args = router._extractParameters(route, fragment);
            if(router.execute(callback, args, name) !== false){
                router.trigger.apply(router, ['route:' + name].concat(args));
                router.trigger('route', name, args);
                History.trigger('route', router, name, args);
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
        History.navigate(fragment, options);
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
