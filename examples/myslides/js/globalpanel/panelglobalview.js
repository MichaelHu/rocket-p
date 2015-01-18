define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');
var PlainPageView = require('plainpageview');
var FontColorPanelSubView = require('fontcolorpanelsubview');
var undef = void 0;

var PanelGlobalView = Rocket.GlobalView.extend({

    className: 'global-panel'

    , events: {
        'click .panel span': 'onpanelbuttonclick'
    }

    , contTpl: [
          '<div class="panel iconfont">'
        ,     '<span class="slide-new icon-jia1"></span>'
        ,     '<span class="slide-delete icon-jian1"></span>'
        ,     '<span class="text-new icon-wenbenshuru"></span>'
        ,     '<span class="image-new icon-tupian"></span>'
        ,     '<span class="align-left icon-juzuo"></span>'
        ,     '<span class="align-center icon-juzhong"></span>'
        ,     '<span class="align-right icon-juyou"></span>'
        ,     '<span class="font-color icon-ziti"></span>'
        ,     '<span class="font-size icon-diaojie"></span>'
        ,     '<span class="save icon-baocun"></span>'
        ,     '<span class="release icon-fasong"></span>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        me.render();
        me.$panel = me.$('.panel');
    }

    , registerEvents: function(){
        var me = this;
        me.ec.on('routechange', me.onroutechange, me);
    }

    , render: function(){
        var me = this;
        me.$el.html(me.contTpl)
            .appendTo('#wrapper');
    }

    , onroutechange: function(params){
        this.currentAction = params.to.action;
    }

    , _getMaxSlideID: function(){
        var order = this.router.getPageOrder(), 
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

    , onpanelbuttonclick: function(e){
        var me = this,
            $btn = $(e.target).closest('span'),
            cls = $btn[0].className;

        $btn.addClass('on');
        setTimeout(function(){
            $btn.removeClass('on');
        }, 300);

        if(/align-(\w+)/.test(cls)){
            var align = RegExp.$1;
            me.gec.trigger('textalign.global', {textAlign: align});
        }
        else if(/slide-new/.test(cls)){
            var action = RegExp.$1,
                action = 'slide' + me.getUniqueSlideID();

            me.gec.trigger('slideoperation.global', {action: 'new'})
                .registerViewClass(action, PlainPageView)
                .addRoute(action, '_defaultHandler:' + action)
                .insertPageOrder(action, {pos: 'AFTER', relatedAction: me.currentAction});

            me.navigate(action);
        }
        else if(/slide-delete/.test(cls)){
            me.gec.trigger('slideoperation.global', {action: 'delete'});
        }
        else if(/text-new/.test(cls)){
            me.gec.trigger('newtext.global');
        }
        else if(/image-new/.test(cls)){
            me.gec.trigger('newimage.global');
        }
        else if(/font-color/.test(cls)){
            me.toggleFontColorPanel();
        }
        else if(/release|save/.test(cls)){
            var action = RegExp['$&'],
                slidesConfig = {
                    order: me.gec.pageOrder
                    , views: {}
                    , isRelease: action == 'release' ? true : false
                };

            me.gec.trigger(action + '.global', slidesConfig.views);
            console.log(JSON.stringify(slidesConfig));
        }

    }

    , toggleFontColorPanel: function(){
        var me = this, panel = me.fontColorPanel;
        if(!panel){
            panel = me.fontColorPanel
                = new FontColorPanelSubView(null, me);
            me.append(panel); 
        }
        panel.toggle();
    }


});

return PanelGlobalView;

});
