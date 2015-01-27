define(function(require){

var undef = void 0;

var $ = require('zepto');
var SettingsUtilsInterface = require('settingsutilsinterface');

var BoxSettingsInterface = {

    _getPos: function(){
        var me = this, pos = {};
        $.extend(
            pos
            , me._getSettings('pos_left', 'left') 
            , me._getSettings('pos_top', 'top') 
            , me._getSettings('pos_right', 'right') 
            , me._getSettings('pos_bottom', 'bottom') 
        );

        return pos;
    }

    , _getSize: function(){
        var me = this, size = {};
        $.extend(
            size
            , me._getSettings('size_width', 'width') 
            , me._getSettings('size_height', 'height') 
        );

        return size;
    }

    , _getZIndex: function(){
        var me = this;

        return me._getSettings('layer_zindex', 'zIndex');
    }

    , _getBoxAlign: function(){
        var me = this, align = {};
        $.extend(
            align
            , me._getSettings('pos_boxalign_center', 'boxAlignCenter')
            , me._getSettings('pos_boxalign_left', 'boxAlignLeft')
            , me._getSettings('pos_boxalign_right', 'boxAlignRight')
        );

        return align;
    }




    , _setPos: function(pos){
        var me = this;
        me._setSettings(pos, 'pos_left', 'left');
        me._setSettings(pos, 'pos_top', 'top');
        me._setSettings(pos, 'pos_right', 'right');
        me._setSettings(pos, 'pos_bottom', 'bottom');
    }

    , _setSize: function(size){
        var me = this;
        me._setSettings(size, 'size_width', 'width');
        me._setSettings(size, 'size_height', 'height');
    }

    , _setBoxAlign: function(align){
        var me = this;

        me._setSettings(align, 'pos_boxalign_center', 'boxAlignCenter')
        me._setSettings(align, 'pos_boxalign_left', 'boxAlignLeft')
        me._setSettings(align, 'pos_boxalign_right', 'boxAlignRight')
    }

    , _setZIndex: function(layer){
        var me = this;

        return me._setSettings(layer, 'layer_zindex', 'zIndex');
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

    , _applyZIndex: function(layer){
        if(Utils.isEmpty(layer)) return;
        this.$el.css(layer);
        this._setZIndex(layer);
    }


};

$.extend(BoxSettingsInterface, SettingsUtilsInterface);

return BoxSettingsInterface;

});
