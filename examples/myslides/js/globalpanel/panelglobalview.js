define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');

var PopupEditSubView = require('popupeditsubview');
var PopupImageSubView = require('popupimagesubview');
var PopupFontColorSubView = require('popupfontcolorsubview');
var PopupSlideNewSubView = require('popupslidenewsubview');
var PopupSlideConfigSubView = require('popupslideconfigsubview');

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
        ,     '<span class="slide-config icon-shezhi"></span>'
        ,     '<span class="text-new icon-wenbenshuru"></span>'
        ,     '<span class="image-new icon-tupian"></span>'
        ,     '<span class="boxalign-left icon-juzuo"></span>'
        ,     '<span class="boxalign-center icon-juzhong"></span>'
        ,     '<span class="boxalign-right icon-juyou"></span>'
        ,     '<span class="layer-up icon-xiangshang"></span>'
        ,     '<span class="layer-down icon-paixu"></span>'
        ,     '<span class="align-left icon-juzuo"></span>'
        ,     '<span class="align-center icon-juzhong"></span>'
        ,     '<span class="align-right icon-juyou"></span>'
        ,     '<span class="font-color icon-ziti"></span>'
        ,     '<span class="zoom-in icon-fangda"></span>'
        ,     '<span class="zoom-out icon-suoxiao"></span>'
        ,     '<span class="preview icon-dianshiji"></span>'
        ,     '<span class="save icon-baocun"></span>'
        ,     '<span class="cardedit icon-shangchuan"></span>'
        ,     '<span class="release icon-fasong"></span>'
        ,   '</div>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        me.render();
        me.$panel = me.$('.panel');

        if(me.gec.editMode == 'FULLEDIT'){
            me.initIScroll();
        }
        else{
            me.hide();
        }
    }

    , registerEvents: function(){
        var me = this;
        me.ec.on('routechange', me.onroutechange, me);
        me.gec.on('beforeedit.global', me.onbeforeedit, me);
        me.gec.on('beforeimageedit.global', me.onbeforeimageedit, me);
    }

    , render: function(){
        var me = this;
        me.$el.html(me.contTpl)
            .appendTo('body');
        // Default to bottom
        me.positionPanel('bottom');
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
        }, 200);
    }

    , refreshIScroll: function(){
        var me = this, totalWidth = 0, $panel = me.$panel;
        $.each($panel.children(), function(index, item){
            var $item = $(item);
            totalWidth += $item.width();
        });
        totalWidth += 6 * parseInt(me.$('.boxalign-center').css('margin-left'));
        setTimeout(function(){
            $panel.width(totalWidth );
            setTimeout(function(){
                me.iScroll.refresh();
            }, 100);
        }, 300);
    }

    , onroutechange: function(params){
        this.currentAction = params.to.action;
    }

    , clearState: function(){
        this.gec.trigger('clear.global', {target: this});
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
        else if(/^boxalign-(left|right|center)/.test(cls)){
            me.gec.trigger('boxalign.global', {type: RegExp.$1});
        }
        else if(/panel-(bottom|top)/.test(cls)){
            me.clearState();
            me.positionPanel(RegExp.$1);
        }
        else if(/slide-new/.test(cls)){
            me.clearState();
            me.toggleSlideNewPanel();
        }
        else if(/slide-config/.test(cls)){
            me.clearState();
            me.toggleSlideConfigPanel();
        }
        else if(/slide-(next|prev|delete)/.test(cls)){
            var action = RegExp.$1;
            me.clearState();
            me.gec.trigger('slideoperation.global', {action: action});
        }
        else if(/layer-(up|down)/.test(cls)){
            var action = RegExp.$1;
            me.gec.trigger('layer.global', {action: action});
        }
        else if(/text-new/.test(cls)){
            me.clearState();
            me.gec.trigger('newtext.global');
        }
        else if(/image-new/.test(cls)){
            // me.gec.trigger('newimage.global');
            me.clearState();
            me.togglePopupImagePanel();
        }
        else if(/font-color/.test(cls)){
            me.toggleFontColorPanel();
        }
        else if(/zoom-(in|out)/.test(cls)){
            var action = RegExp.$1;
            me.gec.trigger('zoom.global', {action: action});
        }
        else if(/preview/.test(cls)){
            me.clearState();
            me.gec.trigger('clear.global preview.global');
            me.previewSlides();
        }
        else if(/cardedit|release|save/.test(cls)){
            var action = RegExp['$&'],
                slidesConfig = {
                    order: me.gec.pageOrder
                    , views: {}
                    , isRelease: action == 'release' ? true : false
                    , editMode: action == 'cardedit'
                        ? 'PARTIALEDIT' 
                        : action == 'save'
                            ? 'FULLEDIT'
                            : 'RELEASE'
                };

            if(!me.isPreviewed){
                me.tip('Please preview first.');
                return;
            }
            me.gec
                .trigger('clear.global')
                .trigger(action + '.global', slidesConfig.views);
            console.log(JSON.stringify(slidesConfig));
        }

    }

    , onbeforeedit: function(params){
        this.togglePopupEditPanel(params);
    }

    , onbeforeimageedit: function(params){
        $.extend(params, {isEditing: true});
        this.togglePopupImagePanel(params);
    }

    , toggleFontColorPanel: function(){
        var me = this, panel = me.fontColorPanel;
        if(!panel){
            panel = me.fontColorPanel
                = new PopupFontColorSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle();
    }

    , toggleSlideNewPanel: function(){
        var me = this, panel = me.slideNewPanel;
        if(!panel){
            panel = me.slideNewPanel
                = new PopupSlideNewSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle();
    }

    , toggleSlideConfigPanel: function(){
        var me = this, panel = me.slideConfigPanel;
        if(!panel){
            panel = me.slideConfigPanel
                = new PopupSlideConfigSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle();
    }

    , togglePopupImagePanel: function(params){
        var me = this, panel = me.popupImagePanel;
        if(!panel){
            panel = me.popupImagePanel
                = new PopupImageSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle(params);
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

    , previewSlides: function(){
        var me = this
            , order = me.gec.pageOrder
            , i = 0;

        me.tip('Preview start.');
        _play();
        me.isPreviewed = true;

        function _play(){
            if(i < order.length){
                me.navigate(order[i++]);
                setTimeout(function(){_play();}, 2000);
            }
            else{
                me.tip('Preview finish.');
            }
        }
    }


});

return PanelGlobalView;

});
