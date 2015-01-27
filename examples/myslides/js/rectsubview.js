define(function(require){

var Rocket = require('rocket');
var $ = require('zepto');
var BoxSettingsInterface = require('boxsettingsinterface');
require('zepto-draggable');
var undef = void 0;

var RectSubView = Rocket.SubView.extend({

    events: {
    }

    , panelTpl: [
          '<div class="iconfont control-panel">'
        ,     '<span class="delete icon-shanchu"></span>'
        ,     '<span class="resize icon-daxiao"></span>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        
        options || (options = {});

        // Whether subview dom node is already existed
        me._isSetup = options.isSetup || false;

        // Whether is release version
        me._isRelease = me.gec.isRelease || false;

        me._setPos(options.pos);
        me._setSize(options.size);

        if(!me._isSetup){
            me.$el.html(me.panelTpl);
        }

        me.$panel = me.$('.control-panel');
        me.$resizeButton = me.$('.resize');
        me.$deleteButton = me.$('.delete');
        // Maybe not existed
        me.$resizeHandle = me.$('.resize-handle');

        me.$panel.hide();
        if(me._isRelease){
            me.$resizeHandle.hide();
        }

        // Make sure correct subclass' viewClass
        setTimeout(function(){
            if( !me.viewClass 
                || !Utils.isString(me.viewClass) ){
                throw Error('RectSubView.init: "viewClass" is undefined or is not of type String'); 
            }    
            me.$el.data('view_class', me.viewClass);
        }, 0);
    }

    , render: function(){
        var me = this;
        me._applyPos(me._getPos());
        me._applyBoxAlign(me._getBoxAlign());
        me._applySize(me._getSize());
        me._applyZIndex(
            $.extend(
                {zIndex: 10}
                , me._getZIndex()
            )
        );
    }

    , onclick: function(e){
        var me = this;

        me.showBorder();
        me.isSelected = true;
        me.$el.enableDrag({
            ondrag: function(deltaX, deltaY){
                me.ondrag.apply(me, arguments);
            }
        });

    }

    , ensureResizeHandle: function(){
        var me = this;
        if(!me.$resizeHandle.length){
            me.$el.append('<div class="iconfont resize-handle icon-jia"></div>')
            me.$resizeHandle = me.$('.resize-handle').hide();
        }
    }

    , showBorder: function(){
        this.$el.css('border', '1px dotted #fff');
    }

    , hideBorder: function(){
        this.$el.css('border', '1px dotted transparent');
    }

    , registerEvents: function(){
        var me = this;

        if(!me._isRelease){
            me.$el.on('click', function(e){
                me.gec.trigger('clear.global', {target: me});
                me.$panel.show();
                me.onclick.apply(me, arguments);
            });
        }

        me.gec.on('zoom.global', me.onzoom, me);
        me.gec.on('layer.global', me.onlayer, me);
        me.gec.on('boxalign.global', me.onboxalign, me);
        me.gec.on('clear.global', me.onclear, me);

        me.$resizeButton.on('touchstart', function(e){
            me.gec.trigger('clear.global', {target: me});
            me.$resizeButton.addClass('on');
            setTimeout(function(){
                me.$resizeButton.removeClass('on');
            }, 300);

            me.ensureResizeHandle();
            me.$resizeHandle.show();
            me.showBorder();;
            me.$resizeHandle.enableDrag({
                ondragstart: function(){
                    me.$resizeHandle.addClass('on');
                }
                , ondrag: function(deltaX, deltaY){
                    me.onresizedrag.apply(me, arguments);
                }
                , ondragend: function(){
                    me.$resizeHandle.removeClass('on');
                }
            });
            e.stopPropagation();
            e.preventDefault();
        });

        me.$deleteButton.on('touchstart', function(e){
            me.$deleteButton.addClass('on');
            setTimeout(function(){
                me.destroy();
            }, 300);

        });

    }
    
    , unregisterEvents: function(){
        var me = this;

        me.$el.off();
        me.gec.off('zoom.global', me.onzoom, me);
        me.gec.off('layer.global', me.onlayer, me);
        me.gec.off('boxalign.global', me.onboxalign, me);
        me.gec.off('clear.global', me.onclear, me);
        me.$resizeButton.off();
        me.$deleteButton.off();
        me.$resizeHandle.disableDrag();
    }

    , onlayer: function(params){
        var me = this, zIndex;

        if(!params || !me.isSelected) return;

        zIndex = parseInt(me.$el.css('z-index')) || 0; 
        switch(params.action){
            case 'up':
                zIndex++;
                break;
            case 'down':
                zIndex--;
                break;
            default:
                return;
        }
        me._applyZIndex({zIndex: zIndex});
    }

    , onclear: function(params){
        var me = this;

        if(!params || params.target != me){
            me.$panel.hide();
        }
        me.$el.disableDrag();
        me.isSelected = false;
        if(me.$resizeHandle){
            me.$resizeHandle.hide().disableDrag();
        }
        me.hideBorder();
    }

    , ondragstart: function(){
        var me = this;
        me.showBorder();
    }

    , ondrag: function(deltaX, deltaY){
        var me = this,
            top = parseInt(me.$el.css('top')) 
                || me.$el.prop('offsetTop')
                || 0,
            left = parseInt(me.$el.css('left')) 
                || me.$el.prop('offsetLeft')
                || 0,
            opt = {
                top: top + deltaY
                , left: left + deltaX
            };

        me._applyPos(opt);
    } 

    , onzoom: function(params){
        var me = this, flag = 1;

        if(!me.isSelected) return;
        if(params.action == 'out'){
            flag = -1;
        }

        var width = parseInt(me.$el.css('width')) || me.$el.width(),
            height = parseInt(me.$el.css('height')) || me.$el.width();

        me.onresizedrag(20 * flag, 20 * height / width * flag);
    }

    , onresizedrag: function(deltaX, deltaY){
        var me = this,
            width = parseInt(me.$el.css('width')) || me.$el.width(),
            height = parseInt(me.$el.css('height')) || me.$el.width(),
            opt = {
                width: width + deltaX
                , height: height + deltaY
            };

        me._applySize(opt);
    } 

    , onboxalign: function(params){
        var me = this;
        if(!me.isSelected) return;
        switch(params.type){
            case 'left': me.positionLeft(); break;
            case 'right': me.positionRight(); break;
            case 'center': me.positionCenter(); break;
        }
    }

    , positionCenter: function(){
        var me = this;
        me._applyBoxAlign({boxAlignCenter: 1});
    }

    , positionLeft: function(){
        var me = this;
        me._applyBoxAlign({boxAlignLeft: 1});
    }

    , positionRight: function(){
        var me = this;
        me._applyBoxAlign({boxAlignRight: 1});
    }


});

$.extend(RectSubView.prototype, BoxSettingsInterface);

return RectSubView;

});