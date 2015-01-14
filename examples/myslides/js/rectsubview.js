(function(){

var undef = void 0;

this.RectSubView = Rocket.SubView.extend({

    events: {
    }

    , panelTpl: [
          '<div class="iconfont control-panel">'
        ,     '<span class="delete">&#xe63d;</span>'
        ,     '<span class="resize">&#xe600;</span>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        
        options || (options = {});
        me._setPos(options.pos);
        me._setSize(options.size);
        me.$el
            .html(me.panelTpl)
            ;
        me.$panel = me.$('.control-panel');
        me.$resizeButton = me.$('.resize');
        me.$deleteButton = me.$('.delete');
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

    , onresizeclick: function(e){
        me.$resizeHandle.show();
        e.stopPropagation();
    }

    , ensureResizeHandle: function(){
        var me = this;
        if(!me.$resizeHandle){
            me.$el.append('<div class="iconfont resize-handle">&#xe611;</div>')
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

        me.$el.on('doubleTap', function(e){
            me.ondoubleTap.apply(me, arguments);
        });

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



    , _getPos: function(){
        var me = this, $el = me.$el, pos = {}, 
            left, top, right, bottom;

        left = $el.data('pos_left'); 
        top = $el.data('pos_top'); 
        right = $el.data('pos_right'); 
        bottom = $el.data('pos_bottom'); 

        left !== undef && (pos.left = left);
        top !== undef && (pos.top = top);
        right !== undef && (pos.right = right);
        bottom !== undef && (pos.bottom = bottom);

        return pos;
    }

    , _getSize: function(){
        var me = this, $el = me.$el, size = {}, 
            width, height;

        width = $el.data('size_width'); 
        height = $el.data('size_height'); 

        width !== undef && (size.width = width);
        height !== undef && (size.height = height);

        return size;
    }

    , _setPos: function(pos){
        if(!pos) return;
        var $el = this.$el;
        pos.left !== undef && $el.data('pos_left', pos.left);
        pos.top !== undef && $el.data('pos_top', pos.top);
        pos.right !== undef && $el.data('pos_right', pos.right);
        pos.bottom !== undef && $el.data('pos_bottom', pos.bottom);
    }

    , _setSize: function(size){
        if(!size) return;
        var $el = this.$el;
        size.width !== undef && $el.data('size_width', size.width);
        size.height !== undef && $el.data('size_height', size.height);
    }

    , _applyPos: function(pos){
        if(Utils.isEmpty(pos)) return;
        var opt = $.extend({'position': 'absolute'}, pos);
        this.$el.css(opt);
        this._setPos(pos);
    } 

    , _applySize: function(size){
        if(Utils.isEmpty(size)) return;
        var opt = $.extend({'position': 'absolute'}, size);
        this.$el.css(opt);
        this._setSize(size);
    }

});

})();
