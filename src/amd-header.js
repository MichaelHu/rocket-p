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
