var Animation = (function(){

var animations = {};

function register(name, func){
    if(!Utils.isString(name) || name.length == 0){
        throw Error('registerAnimation: name must be non-empty string');
    }

    if(!Utils.isFunction(func)){
        throw Error('registerAnimation: func must be function');
    }

    animations[name] = func;
}

function get(name){
    return animations[name];
}

return {
    register: register
    , get: get
};


})();
