define(function(require){

var $ = require('zepto');
var RectSubView = require('rectsubview');
var CommonSettingsInterface = require('commonsettingsinterface');

var TextSubView = RectSubView.extend({

    events: {
    }

    , tpl: [
        '<div class="text"></div>'
    ].join('')

    , init: function(options){
        var me = this;
        
        options || (options = {});

        // Parent method first
        me._super(options);

        me.viewClass = 'TextSubView';
        if(!me._isSetup){
            me.$el.append(me.tpl);
            me.$panel.append('<span class="edit icon-bianji"></span>');
        }
        me.$text = me.$('.text');
        me.$editButton = me.$('.edit');
        me.render(options);
    }

    , render: function(options){
        var me = this;
        me._super();
        if(!me.isFirstRender && !me._isSetup){
            me.isFirstRender = true;
            me.$text.html('TextSubView');
        }
        me.applyTextSettings(options && options.text);
    }

    , registerEvents: function(){
        var me = this, 
            gec = me.gec,
            ec = me.ec;

        me._super();

        me.$editButton.on('touchstart', function(e){
            me.$editButton.addClass('on');
            setTimeout(function(){
                me.$editButton.removeClass('on');
            }, 300);

            me.$text.attr('contenteditable', 'true')
                .focus()
                .on('blur', function(e){
                    $(this).attr('contenteditable', 'false');
                }); 

            e.stopPropagation();
            e.preventDefault();
        });

        ec.on('pagebeforechange', me.onpagebeforechange, me);
        gec.on('textalign.global', me.ontextalign, me);
    }

    , unregisterEvents: function(){
        var me = this, 
            ec = me.ec,
            gec = me.gec;

        me.$editButton.off();
        ec.off('pagebeforechange', me.onpagebeforechange, me);
        gec.off('textalign.global', me.ontextalign, me);
        me._super();
    }

    , onpagebeforechange: function(options){
        var me = this,
            to = options.to;

        if(to == me.ec){
            me.render();
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
        me._applyFontSize(opt || me._getFontSize());
        me._applyLineHeight(opt || me._getLineHeight());
        me._applyColor(opt || me._getColor());
        me._applyTextAlign(opt || me._getTextAlign());
    }

});

$.extend(TextSubView.prototype, CommonSettingsInterface);

return TextSubView;

});

