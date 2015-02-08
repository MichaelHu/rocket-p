define(function(require){

var undef = void 0;

var $ = require('zepto');
var CommonSettingsInterface = require('commonsettingsinterface');
var RectSubView = require('rectsubview');

var ImageSubView = RectSubView.extend({

    events: {
    }

    , tpl: [
          '<div class="image">'
        ,     '<img>'
        , '</div>'
        , '<div class="inner-panel">'
        ,     '<span class="img-move" data-btn-type="img-move">移动</span>'
        ,     '<span data-btn-type="img-zoom-in">放大</span>'
        ,     '<span data-btn-type="img-zoom-out">缩小</span>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        
        options || (options = {});
        me._super(options);

        me.viewClass = 'ImageSubView';

        if(!me._isSetup){
            me.$el.append(me.tpl);
            me.$panel.append('<span class="edit icon-bianji"></span>');
        }

        me.$image = me.$('.image');
        me.$img = me.$('img');
        me.$editButton = me.$('.edit');
        me.initImage(options);

        me.$innerPanel = me.$('.inner-panel');
        if(me._isRelease
            || me._isPartialEdit && me._isLocked){
            me.$innerPanel.hide();
        }
    }

    , render: function(options){
        var me = this;

        me._super();
        setTimeout(function(){
            me.applyTextSettings(options && options.image);
        }, 200);
    }

    , initImage: function(options){
        var me = this;
        if(options.data && options.data.url){
            setTimeout(function(){ 
                me.$img.attr('src', options.data.url);
                me.$img.show(); 
            }, 5000);
        }
    }

    , registerEvents: function(){
        var me = this, 
            gec = me.gec,
            ec = me.ec;

        me._super();

        if(me._isRelease) return;

        if(me._isPartialEdit && !me._isLocked){
            me.$el.on('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                me.gec.trigger('clear.global', {target: me});
                // Make sure it can response to `imagechange` event
                me.isSelected = true;
                me.isEdited = true;
                me.gec.trigger('beforeimageedit.global', {url: me.$img.attr('src')});
            });
            me.showBorder();
        }

        ec.on('pagebeforechange', me.onpagebeforechange, me);
        gec.on('textalign.global', me.ontextalign, me);
        gec.on('imagechange.global', me.onimagechange, me);
        gec.on('release.global save4partialedit.global save.global', me.onrelease, me);

        me.$editButton.on('touchstart', function(e){
            e.stopPropagation();
            e.preventDefault();

            me.gec.trigger('clear.global', {target: me});
            // Make sure it can response to `imagechange` event
            me.isSelected = true;
            me.$editButton.addClass('on');
            setTimeout(function(){
                me.$editButton.removeClass('on');
            }, 300);
            me.isEdited = true;
            me.gec.trigger('beforeimageedit.global', {url: me.$img.attr('src')});
            return;
        });

        me.$innerPanel.on('touchstart', function(e){
            e.preventDefault();
            e.stopPropagation();

            var $target = $(e.target).closest('span');

            switch($target.data('btn-type')){
                case 'img-move':
                    me.toggleImageMove($target);
                    break;
                case 'img-zoom-in':
                    me.imgZoomIn();
                    break;
                case 'img-zoom-out':
                    me.imgZoomOut();
                    break;
            }
        });
    }

    , unregisterEvents: function(){
        var me = this, 
            ec = me.ec,
            gec = me.gec;

        if(me._isRelease) return;

        ec.off('pagebeforechange', me.onpagebeforechange, me);
        gec.off('textalign.global', me.ontextalign, me);
        gec.off('imagechange.global', me.onimagechange, me);
        gec.off('release.global save4partialedit.global save.global', me.onrelease, me);
        me.$editButton.off();
        me.$innerPanel.off();
        me._super();
    }

    , onimagechange: function(params){
        var me = this;
        if(!params || !params.url || !me.isSelected) return;

        setTimeout(function(){
            me.$img.attr('src', params.url)
                .show();
            me.isEdited = false;
        }, 5000);
    }

    , onrelease: function(views, images){
        var me = this;
        images.push(me.$img.attr('src'));
    }

    , onpagebeforechange: function(options){
        var me = this,
            to = options.to;

        me._super(options);
    }

    , ontextalign: function(params){
        var me = this;
        if(me.isSelected){
            me._applyTextAlign(params);
        }
    }

    , applyTextSettings: function(opt){
        var me = this;
        me._applyTextAlign(opt || me._getTextAlign());
    }

    , enableImageDrag: function(){
        var me = this;

        me.gec.trigger('clear.global', {target: me});
        me.$img.enableDrag({
            ondrag: function(deltaX, deltaY){
                me.onimgdrag.apply(me, arguments);
            }
        });
    }

    , onimgdrag: function(deltaX, deltaY){
        var me = this,
            $img = me.$img,
            top = parseInt($img.css('top')) 
                || $img.prop('offsetTop')
                || 0,
            left = parseInt($img.css('left')) 
                || $img.prop('offsetLeft')
                || 0,
            opt = {
                top: top + deltaY
                , left: left + deltaX
            };

        me._applyPos(opt, $img);
    } 

    , imgZoomIn: function(){
        var me = this,
            width = me.$img.width(),
            opt = {width: width * 1.1};
        me._applySize(opt, me.$img);
    }

    , imgZoomOut: function(){
        var me = this,
            width = me.$img.width(),
            opt = {width: width * 0.9};
        me._applySize(opt, me.$img);
    }

    , onclear: function(params){
        var me = this;

        me._super();
        me.$img.disableDrag();
    }

    , toggleImageMove: function($el){
        var me = this;
        
        me.gec.trigger('clear.global', {target: me});
        me.isEnableImageMove = !me.isEnableImageMove;
        if(me.isEnableImageMove){
            $el.addClass('on');
            me.enableImageDrag();
        }
        else{
            $el.removeClass('on');
        }
    }

});

$.extend(ImageSubView.prototype, CommonSettingsInterface);

return ImageSubView;

});

