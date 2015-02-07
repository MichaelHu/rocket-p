define(function(require){

var undef = void 0;

var $ = require('zepto');
var ImageSubView = require('imagesubview');

var ImageWithMaskSubView = ImageSubView.extend({

    maskImageTpl: [
          '<div class="img-mask">'
        ,     '<span class="img-mask-change">换蒙层</span>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        
        options || (options = {});
        me._super(options);

        me.viewClass = 'ImageWithMaskSubView';

        if(!me._isSetup){
            me.$el.append(me.maskImageTpl);
        }

        me.$imgMask = me.$('.img-mask');
        me.$changeMaskBtn = me.$('.img-mask-change');

        if(me._isRelease
            || me._isPartialEdit){
            me.$changeMaskBtn.hide();
        }
    }

    , render: function(options){
        var me = this;

        me._super();
    }

    , registerEvents: function(){
        var me = this, 
            gec = me.gec,
            ec = me.ec;

        me._super();

        if(me._isRelease || me._isPartialEdit) return;

        me.$changeMaskBtn.on('touchstart', function(e){
            e.stopPropagation();
            e.preventDefault();

            me.gec.trigger('clear.global', {target: me});
            me.isSelected = true;
            me.$changeMaskBtn.addClass('on');
            setTimeout(function(){
                me.$changeMaskBtn.removeClass('on');
            }, 300);
            me.isMaskEdited = true;
            me.gec.trigger('beforeimageedit.global', {url: me.$imgMask.attr('src')});
            return;
        });
    }

    , unregisterEvents: function(){
        var me = this, 
            ec = me.ec,
            gec = me.gec;

        me.$changeMaskBtn.off();
        me._super();
    }

    , onimagechange: function(params){
        var me = this;

        if(!params || !params.url || !me.isSelected) return;

        if(me.isEdited){
            me.$img.attr('src', params.url)
                .show();
            me.isEdited = false;
        }

        if(me.isMaskEdited){
            me._applyBackgroundImage(
                {
                    backgroundImage: 'url(' + params.url + ')'
                }
                , me.$imgMask
            );
            me.isMaskEdited = false;
        }
    }

    , enableImageMaskDrag: function(){
        var me = this;

        me.$imgMask.enableDrag({
            ondrag: function(deltaX, deltaY){
                me.onimgdrag.apply(me, arguments);
            }
        });
    }

    , toggleImageMove: function($el){
        var me = this;
        
        me.gec.trigger('clear.global', {target: me});
        me.isEnableImageMove = !me.isEnableImageMove;
        if(me.isEnableImageMove){
            $el.addClass('on');

            // call enableImageMaskDrag, not enableImageDrag. Because it's now on mask layer
            me.enableImageMaskDrag();
        }
        else{
            $el.removeClass('on');
        }
    }

    , onclear: function(params){
        var me = this;

        me._super(params);
        me.$imgMask.disableDrag();
    }

});

return ImageWithMaskSubView;

});

