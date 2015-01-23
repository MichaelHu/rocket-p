define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');

var PopupSubView = Rocket.SubView.extend({

    className: 'popup'

    , init: function(options){
        this._super();
        this.render();
    }

    , render: function(){
        this.$el.css({
            position: 'fixed'
            , 'z-index': 999
            , top: 0
            , left: 0
            , bottom: 0
            , right: 0
            , 'background-color': '#000'
            , opacity: 0.7
        });
    }

    , registerEvents: function(){
        var me = this;
        me.$el.on('click', function(){
            me.close();
        });
    }
    
    , open: function(){
        this.$el.show();
    }

    , close: function(){
        this.$el.hide();
    }

    , toggle: function(){
        this.$el.toggle();
    }

});

return PopupSubView;

});
