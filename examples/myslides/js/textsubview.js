define(function(require){

var $ = require('zepto');
var RectSubView = require('rectsubview');
var CommonSettingsInterface = require('commonsettingsinterface');

var TextSubView = RectSubView.extend({

    events: {
    }

    , texttpl: [
        '<div class="text"></div>'
    ].join('')

    , init: function(options){
        var me = this;
        
        options || (options = {});

        // Parent method first
        me._super(options);

        me.viewClass = 'TextSubView';
        if(!me._isSetup){
            me.$el.append(me.textTpl);
            me.$panel.append('<span class="edit icon-bianji"></span>');
        }

        me.$text = me.$('.text');
        me.$editButton = me.$('.edit');

        if(!me._isSetup){
            me.$text.html('TextSubView');
        }
    }

    , render: function(options){
        var me = this;
        me._super();
        setTimeout(function(){
            me.applyTextSettings(options && options.text);
        }, 200); 
    }

    , registerEvents: function(){
        var me = this, 
            gec = me.gec,
            ec = me.ec;

        me._super();

        me.$editButton.on('touchstart', function(e){
            e.stopPropagation();
            e.preventDefault();

            me.gec.trigger('clear.global', {target: me});
            me.$editButton.addClass('on');
            setTimeout(function(){
                me.$editButton.removeClass('on');
            }, 300);
            me.isEdited = true;
            me.gec.trigger('beforeedit.global', {text: me.$text.html()});
            return;

            // Discarded
            me.$text.attr('contenteditable', 'true')
                .focus()
                .on('blur', function(e){
                    $(this).attr('contenteditable', 'false')
                        .off();
                }) 
                .on('click', function(e){
                    e.stopPropagation();
                });

        });


        ec.on('pagebeforechange', me.onpagebeforechange, me);
        gec.on('textalign.global', me.ontextalign, me);
        gec.on('color.global', me.oncolor, me);
        gec.on('fontsize.global', me.onfontsize, me);
        gec.on('afteredit.global', me.onafteredit, me);
    }

    , unregisterEvents: function(){
        var me = this, 
            ec = me.ec,
            gec = me.gec;

        me.$editButton.off();
        ec.off('pagebeforechange', me.onpagebeforechange, me);
        gec.off('textalign.global', me.ontextalign, me);
        gec.off('color.global', me.oncolor, me);
        gec.off('fontsize.global', me.onfontsize, me);
        gec.off('afteredit.global', me.onafteredit, me);
        me._super();
    }

    , onpagebeforechange: function(options){
        this._super(options);
    }

    , onafteredit: function(params){
        var me = this;

        if(params.text !== void 0 && me.isEdited){
            me.$text.html(params.text);
        }
        me.isEdited = false;
    }

    , onfontsize: function(params){
        var me = this;
        if(me.isSelected){
            me._applyFontSize(params);
            me._applyLineHeight(params);
        }
    }

    , ontextalign: function(params){
        var me = this;
        if(me.isSelected){
            me._applyTextAlign(params);
        }
    }

    , oncolor: function(params){
        var me = this;
        if(me.isSelected){
            me._applyColor(params);
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

