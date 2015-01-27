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
    ].join('')

    , init: function(options){
        var me = this;
        
        options || (options = {});
        me._super(options);

        me.viewClass = 'ImageSubView';

        me.render(options);
        me.$image = me.$('.image');
        me.$img = me.$('img');
        me.$editButton = me.$('.edit');
        me.initImage(options);
    }

    , render: function(options){
        var me = this;

        me._super();
        if(!me._isSetup){
            me.$el.append(me.tpl);
            me.$panel.append('<span class="edit icon-bianji"></span>');
        }

        me.applyTextSettings(options && options.image);
    }

    , initImage: function(options){
        var me = this;
        if(options.data && options.data.url){
            me.$img.attr('src', options.data.url);
            setTimeout(function(){ 
                me.$img.show(); 
            }, 0);
        }
    }

    , registerEvents: function(){
        var me = this, 
            gec = me.gec,
            ec = me.ec;

        me._super();
        ec.on('pagebeforechange', me.onpagebeforechange, me);
        gec.on('textalign.global', me.ontextalign, me);
        gec.on('imagechange.global', me.onimagechange, me);

        me.$editButton.on('touchstart', function(e){
            e.stopPropagation();
            e.preventDefault();

            me.gec.trigger('clear.global', {target: me});
            me.$editButton.addClass('on');
            setTimeout(function(){
                me.$editButton.removeClass('on');
            }, 300);
            me.isEdited = true;
            me.gec.trigger('beforeimageedit.global', {url: me.$img.attr('src')});
            return;
        });
    }

    , unregisterEvents: function(){
        var me = this, 
            ec = me.ec,
            gec = me.gec;

        ec.off('pagebeforechange', me.onpagebeforechange, me);
        gec.off('textalign.global', me.ontextalign, me);
        gec.off('imagechange.global', me.onimagechange, me);
        me.$editButton.off();
        me._super();
    }

    , onimagechange: function(params){
        var me = this;
        if(!params || !params.url || !me.isSelected) return;
        me.$img.attr('src', params.url)
            .show();;
        me.isEdited = false;
    }

    , onpagebeforechange: function(options){
        var me = this,
            to = options.to;

        if(to == me.ec){
            me.show();
        }
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

});

$.extend(ImageSubView.prototype, CommonSettingsInterface);

return ImageSubView;

});

