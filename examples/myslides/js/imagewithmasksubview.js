define(function(require){

var undef = void 0;

var $ = require('zepto');
var ImageSubView = require('imagesubview');

var ImageWithMaskSubView = ImageSubView.extend({

    init: function(options){
        var me = this;
        
        options || (options = {});
        me._super(options);

        me.viewClass = 'ImageWithMaskSubView';
    }

    , render: function(options){
        var me = this;

        me._super();
    }

    , registerEvents: function(){
        var me = this, 
            gec = me.gec,
            ec = me.ec;

        me._super();

    }

    , unregisterEvents: function(){
        var me = this, 
            ec = me.ec,
            gec = me.gec;

        me._super();
    }

});

return ImageWithMaskSubView;

});

