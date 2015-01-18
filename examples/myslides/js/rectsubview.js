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
        me.$resizeHandle = me.$('.resize-handle');

        if(me._isRelease){
            me.$panel.hide();
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
        me._applySize(me._getSize());
    }

    , ondoubleTap: function(e){
        var me = this;

        me.showBorder();
        me.isSelected = true;
        me.$el.enableDrag({
            ondragstart: function(){
                me.ondragstart.apply(me, arguments);
            }
            , ondrag: function(deltaX, deltaY){
                me.ondrag.apply(me, arguments);
            }
            , ondragend: function(){
                me.ondragend.apply(me, arguments);
                me.$el.disableDrag();
                delete me.isSelected;
            }
        });

    }

    , ensureResizeHandle: function(){
        var me = this;
        if(!me.$resizeHandle.length){
            me.$el.append('<div class="iconfont resize-handle icon-jia"></div>')
            me.$resizeHandle = me.$('.resize-handle').hide();
        }
        return me.$resizeHandle;
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
            me.$el.on('doubleTap', function(e){
                me.ondoubleTap.apply(me, arguments);
            });
        }

        me.$resizeButton.on('touchstart', function(e){
            me.$resizeButton.addClass('on');
            setTimeout(function(){
                me.$resizeButton.removeClass('on');
            }, 300);

            me.$resizeHandle.show();
            me.showBorder();;
            e.stopPropagation();
            e.preventDefault();
        });

        me.$deleteButton.on('touchstart', function(e){
            me.$deleteButton.addClass('on');
            setTimeout(function(){
                me.destroy();
            }, 300);

        });

        me.ensureResizeHandle().enableDrag({
            ondragstart: function(){
                me.onresizedragstart.apply(me, arguments);
            }
            , ondrag: function(deltaX, deltaY){
                me.onresizedrag.apply(me, arguments);
            }
            , ondragend: function(){
                me.onresizedragend.apply(me, arguments);
            }
        });
    }
    
    , unregisterEvents: function(){
        var me = this;

        me.$el.off();
        me.$resizeButton.off();
        me.$resizeHandle.disableDrag();
        me.$deleteButton.off();
    }

    , ondragstart: function(){
        var me = this;
        me.showBorder();
    }

    , ondrag: function(deltaX, deltaY){
        var me = this,
            top = parseInt(me.$el.css('top')) || 0,
            left = parseInt(me.$el.css('left')) || 0,
            opt = {
                top: top + deltaY
                , left: left + deltaX
            };

        me._applyPos(opt);
    } 

    , ondragend: function(){
        var me = this;
        me.hideBorder();
    }


    , onresizedragstart: function(){
        var me = this;
        me.$resizeHandle.addClass('on');
    }

    , onresizedrag: function(deltaX, deltaY){
        var me = this,
            width = parseInt(me.$el.css('width')) || 0,
            height = parseInt(me.$el.css('height')) || 0,
            opt = {
                width: width + deltaX
                , height: height + deltaY
            };

        me._applySize(opt);
    } 

    , onresizedragend: function(){
        var me = this;
        me.$resizeHandle.removeClass('on').hide();
        me.hideBorder();
    }

});

$.extend(RectSubView.prototype, BoxSettingsInterface);

return RectSubView;

});
