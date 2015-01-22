define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');
var FontColorPanelSubView = require('fontcolorpanelsubview');
var SlideNewPanelSubView = require('slidenewpanelsubview');
var PopupEditSubView = require('popupeditsubview');

// window.IScroll
require('iscroll');

var undef = void 0;

var PanelGlobalView = Rocket.GlobalView.extend({

    className: 'global-panel'

    , events: {
        'tap .panel span': 'onpanelbuttonclick'
    }

    , contTpl: [
          '<div class="panel-wrapper">'
        ,   '<div class="panel iconfont">'
        ,     '<span class="panel-bottom icon-xiangxia2"></span>'
        ,     '<span class="panel-top icon-xiangshang3"></span>'
        ,     '<span class="slide-new icon-jia1"></span>'
        ,     '<span class="slide-delete icon-jian1"></span>'
        ,     '<span class="slide-prev icon-xiangzuo2"></span>'
        ,     '<span class="slide-next icon-xiangyou2"></span>'
        ,     '<span class="text-new icon-wenbenshuru"></span>'
        ,     '<span class="image-new icon-tupian"></span>'
        ,     '<span class="boxalign-center icon-juzhong"></span>'
        ,     '<span class="align-left icon-juzuo"></span>'
        ,     '<span class="align-center icon-juzhong"></span>'
        ,     '<span class="align-right icon-juyou"></span>'
        ,     '<span class="font-color icon-ziti"></span>'
        ,     '<span class="zoom-in icon-fangda"></span>'
        ,     '<span class="zoom-out icon-suoxiao"></span>'
        ,     '<span class="save icon-baocun"></span>'
        ,     '<span class="release icon-fasong"></span>'
        ,   '</div>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        me.render();
        me.$panel = me.$('.panel');
        me.initIScroll();
    }

    , registerEvents: function(){
        var me = this;
        me.ec.on('routechange', me.onroutechange, me);
        me.gec.on('beforeedit.global', me.onbeforeedit, me);
    }

    , render: function(){
        var me = this;
        me.$el.html(me.contTpl)
            .appendTo('body');
    }

    , initIScroll: function(){
        var me = this;

        me.iScroll = new IScroll(
            me.$('.panel-wrapper')[0] 
            , {
                scrollX: true
                , scrollY: false
                , mouseWheel: true
                , bounnce: true
            }
        );

        // Delay to make sure width of panel is updated correctly.
        setTimeout(function(){
            me.refreshIScroll();
        }, 500);
    }

    , refreshIScroll: function(){
        var me = this, totalWidth = 0, $panel = me.$panel;
        $.each($panel.children(), function(index, item){
            var $item = $(item);
            totalWidth += $item.width();
        });
        totalWidth += 2 * parseInt(me.$('.boxalign-center').css('margin-left'));
        setTimeout(function(){
            $panel.width(totalWidth );
            setTimeout(function(){
                me.iScroll.refresh();
            }, 0);
        }, 0);
    }

    , onroutechange: function(params){
        this.currentAction = params.to.action;
    }

    , onpanelbuttonclick: function(e){
        var me = this,
            $btn = $(e.target).closest('span'),
            cls = $btn[0].className;

        $btn.addClass('on');
        setTimeout(function(){
            $btn.removeClass('on');
        }, 300);

        if(/^align-(\w+)/.test(cls)){
            var align = RegExp.$1;
            me.gec.trigger('textalign.global', {textAlign: align});
        }
        else if(/^boxalign-center/.test(cls)){
            me.gec.trigger('boxalign.global', {type: 'x'});
        }
        else if(/panel-(bottom|top)/.test(cls)){
            me.positionPanel(RegExp.$1);
        }
        else if(/slide-new/.test(cls)){
            me.toggleSlideNewPanel();
        }
        else if(/slide-(next|prev|delete)/.test(cls)){
            var action = RegExp.$1;
            me.gec.trigger('slideoperation.global', {action: action});
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
        else if(/zoom-(in|out)/.test(cls)){
            var action = RegExp.$1;
            me.gec.trigger('zoom.global', {action: action});
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

    , onbeforeedit: function(params){
        this.togglePopupEditPanel(params);
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

    , toggleSlideNewPanel: function(){
        var me = this, panel = me.slideNewPanel;
        if(!panel){
            panel = me.slideNewPanel
                = new SlideNewPanelSubView(null, me);
            me.append(panel); 
        }
        panel.toggle();
    }

    , togglePopupEditPanel: function(params){
        var me = this, panel = me.popupEditPanel;
        if(!panel){
            panel = me.popupEditPanel
                = new PopupEditSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle(params && params.text || {}.text);
    }

    , positionPanel: function(pos){
        var me = this;

        if('top' == pos){
            me.$el.css({
                top: 0
                , bottom: 'auto'
            });
        }

        if('bottom' == pos){
            me.$el.css({
                bottom: 0
                , top: 'auto'
            });
        }
    }


});

return PanelGlobalView;

});
