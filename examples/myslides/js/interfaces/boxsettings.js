define(function(require){

var undef = void 0;

var $ = require('zepto');
var SettingsUtilsInterface = require('settingsutilsinterface');

var BoxSettingsInterface = {

    _getPos: function($el){
        var me = this, pos = {};
        $el = $el || me.$el;
        $.extend(
            pos
            , me._getSettings('pos_left', 'left', $el) 
            , me._getSettings('pos_top', 'top', $el) 
            , me._getSettings('pos_right', 'right', $el) 
            , me._getSettings('pos_bottom', 'bottom', $el) 
        );

        return pos;
    }

    , _getSize: function($el){
        var me = this, size = {};
        $el = $el || me.$el;
        $.extend(
            size
            , me._getSettings('size_width', 'width', $el) 
            , me._getSettings('size_height', 'height', $el) 
        );

        return size;
    }

    , _getZIndex: function($el){
        var me = this;

        $el = $el || me.$el;
        return me._getSettings('layer_zindex', 'zIndex', $el);
    }

    , _getBoxAlign: function($el){
        var me = this, align = {};
        $el = $el || me.$el;
        $.extend(
            align
            , me._getSettings('pos_boxalign_center', 'boxAlignCenter', $el)
            , me._getSettings('pos_boxalign_left', 'boxAlignLeft', $el)
            , me._getSettings('pos_boxalign_right', 'boxAlignRight', $el)
        );

        return align;
    }




    , _setPos: function(pos, $el){
        var me = this;
        $el = $el || me.$el;
        me._setSettings(pos, 'pos_left', 'left', $el);
        me._setSettings(pos, 'pos_top', 'top', $el);
        me._setSettings(pos, 'pos_right', 'right', $el);
        me._setSettings(pos, 'pos_bottom', 'bottom', $el);
    }

    , _setSize: function(size, $el){
        var me = this;
        $el = $el || me.$el;
        me._setSettings(size, 'size_width', 'width', $el);
        me._setSettings(size, 'size_height', 'height', $el);
    }

    , _setBoxAlign: function(align, $el){
        var me = this;

        $el = $el || me.$el;
        me._setSettings(align, 'pos_boxalign_center', 'boxAlignCenter', $el)
        me._setSettings(align, 'pos_boxalign_left', 'boxAlignLeft', $el)
        me._setSettings(align, 'pos_boxalign_right', 'boxAlignRight', $el)
    }

    , _setZIndex: function(layer, $el){
        var me = this;

        $el = $el || me.$el;
        return me._setSettings(layer, 'layer_zindex', 'zIndex', $el);
    }





    , _applyPos: function(pos, $el){
        if(Utils.isEmpty(pos)) return;
        var opt = $.extend({'position': 'absolute'}, pos);
        $el = $el || this.$el;
        $el.css(opt);
        this._setPos(pos, $el);
    } 

    , _applySize: function(size, $el){
        if(Utils.isEmpty(size)) return;
        var opt = $.extend({'position': 'absolute'}, size);
        $el = $el || this.$el;
        $el.css(opt);
        this._setSize(size, $el);
    }

    , _applyBoxAlign: function(align){
        if(Utils.isEmpty(align)) return;
        var me = this;
    
        apply();

        function apply(){
            // Make sure width we got is correct
            if(!me.ec.isActivePage()){
                setTimeout(apply, 50);
                return;
            }

            if(align.boxAlignCenter){
                var width = me.$el.width(),
                    slideWidth = me.ec.$el.width();

                me._applyPos({
                    left: ( slideWidth - width ) / 2
                    , right: 'auto'
                });
            }
            else if(align.boxAlignLeft){
                me._applyPos({
                    left: 0
                    , right: 'auto'
                });
            }
            else if(align.boxAlignRight){
                me._applyPos({
                    right: 0
                    , left: 'auto'
                });
            }

            me._setBoxAlign(align);
        }
    }

    , _applyZIndex: function(layer, $el){
        if(Utils.isEmpty(layer)) return;
        $el = $el || this.$el;
        $el.css(layer);
        this._setZIndex(layer, $el);
    }


};

$.extend(BoxSettingsInterface, SettingsUtilsInterface);

return BoxSettingsInterface;

});
