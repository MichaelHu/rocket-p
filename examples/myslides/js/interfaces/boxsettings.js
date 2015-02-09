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

    , _getLockTag: function($el){
        var me = this;

        $el = $el || me.$el;
        return me._getSettings('lock', 'lock', $el);
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

    , _setLockTag: function(lock, $el){
        var me = this;

        $el = $el || me.$el;
        return me._setSettings(lock, 'lock', 'lock', $el);
    }





    , _clearBoxAlign: function(align, $el){
        var me = this;

        $el = $el || me.$el;
        me._clearSettings(align, 'pos_boxalign_center', 'boxAlignCenter', $el)
        me._clearSettings(align, 'pos_boxalign_left', 'boxAlignLeft', $el)
        me._clearSettings(align, 'pos_boxalign_right', 'boxAlignRight', $el)
    }

    , _clearBoxAlignAll: function($el){
        var me = this;

        $el = $el || me.$el;
        me._clearBoxAlign(
            {
                'boxAlignCenter': 1
                , 'boxAlignRight': 1
                , 'boxAlignLeft': 1
            }
            , $el
        );
    }

    , _clearLockTag: function(lock, $el){
        var me = this;
        if(Utils.isEmpty(lock) || !lock.lock) return;

        $el = $el || me.$el;
        me._clearSettings(lock, 'lock', 'lock', $el);
        me._isLocked = false;
        me.$lockButton.removeClass('icon-suoding')
            .addClass('icon-jiesuo');
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

    , _applyLockTag: function(lock, $el){
        var me = this;

        $el = $el || me.$el;
        if(Utils.isEmpty(lock)){
            me._clearLockTag({lock: 'lock'}, $el);
        }
        else{
            me._isLocked = true;
            me._setLockTag(lock, $el);
            me.$lockButton.removeClass('icon-jiesuo')
                .addClass('icon-suoding');
        }
    }


};

$.extend(BoxSettingsInterface, SettingsUtilsInterface);
