define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');
var PlainPageView = require('plainpageview');
var FrontPageView = require('frontpageview');

var SlideNewPanelSubView = Rocket.SubView.extend({

    className: 'slidenewpanel'

    , events: {
        'click h2 span': 'onnewslideclick'
    }

    , init: function(options){
        this.render();
    }

    , tpl: [
          '<div>'
        ,     '<h2>'
        ,         '<span>Plain</span>'
        ,         '<span>Front</span>'
        ,     '</h2>'
        , '</div>'
    ].join('')

    , render: function(){
        var me = this; 

        me.$el.html(me.tpl);
        return me;
    } 

    , toggle: function(){
        this.$el.toggle();
    }

    , _getMaxSlideID: function(){
        var order = this.gec.getPageOrder(), 
            i = order.length - 1,
            max = 1; 
       
        while(i >= 0){
            if(/^slide(\d+)$/.test(order[i])){
                if(RegExp.$1 - 0 > max) {
                    max = RegExp.$1 - 0; 
                }
            }
            i--;
        }
        return max;
    }

    , getUniqueSlideID: function(){
        var me = this;
        if(void 0 === me._uniqueSlideID){
            me._uniqueSlideID = me._getMaxSlideID();
        }
        return ++me._uniqueSlideID;
    }

    , onnewslideclick: function(e){
        var me = this,
            $target = $(e.target),
            action = 'slide' + me.getUniqueSlideID(),
            PageView;

        switch($target.html()){
            case 'Plain':
                PageView = PlainPageView;
                break;
            case 'Front':
                PageView = FrontPageView;
                break;

            default:
                PageView = PlainPageView;
        }

        me.gec.trigger('slideoperation.global', {action: 'new'})
            .registerViewClass(action, PageView)
            .addRoute(action, '_defaultHandler:' + action)
            .insertPageOrder(action, {pos: 'AFTER', relatedAction: me.ec.currentAction});

        me.navigate(action);
    }

});

return SlideNewPanelSubView;

});
