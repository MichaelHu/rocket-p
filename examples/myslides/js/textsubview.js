(function(){

var undef = void 0;

this.TextSubView = RectSubView.extend({

    events: {
    }

    , tpl: [
        '<div class="text"></div>'
    ].join('')

    , init: function(options){
        var me = this;
        
        options || (options = {});
        me._super(options);
        me.$el
            .append(me.tpl)
            ;
        me.$text = me.$('.text');
        me.$panel.append('<span class="edit">&#xe60e;</span>');
        me.$editButton = me.$('.edit');
        me.render(options);
    }

    , render: function(options){
        var me = this;
        me._super();
        if(!me.isFirstRender){
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




    , _setFontSize: function(opt){
        return this._setTextSettings(opt, 'text_fontSize', 'fontSize');
    }

    , _setLineHeight: function(opt){
        return this._setTextSettings(opt, 'text_lineHeight', 'lineHeight');
    }

    , _setColor: function(opt){
        return this._setTextSettings(opt, 'text_color', 'color');
    }

    , _setTextAlign: function(opt){
        return this._setTextSettings(opt, 'text_align', 'textAlign');
    }

    , _setTextSettings: function(opt, dataKey, jsonKey){
        if(!opt) return;
        opt[jsonKey] !== undef && this.$el.data(dataKey, opt[jsonKey]);
    }





    , _getFontSize: function(){
        return this._getTextSettings('text_fontSize', 'fontSize');
    }

    , _getLineHeight: function(){
        return this._getTextSettings('text_lineHeight', 'lineHeight');
    }

    , _getColor: function(){
        return this._getTextSettings('text_color', 'color');
    }

    , _getTextAlign: function(){
        return this._getTextSettings('text_align', 'textAlign');
    }

    , _getTextSettings: function(dataKey, jsonKey){
        var me = this, $el = me.$el, data = {},
            value = $el.data(dataKey);

        value !== undef && ( data[jsonKey] = value );
        return data;
    }



    
    , _applyFontSize: function(opt){
        this._applyTextSettings(opt, 'font-size', 'fontSize');
    }

    , _applyLineHeight: function(opt){
        this._applyTextSettings(opt, 'line-height', 'lineHeight');
    }

    , _applyColor: function(opt){
        this._applyTextSettings(opt, 'color', 'color');
    }

    , _applyTextAlign: function(opt){
        this._applyTextSettings(opt, 'text-align', 'textAlign');
    }

    , _applyTextSettings: function(opt, cssKey, jsonKey){
        if(Utils.isEmpty(opt) || Utils.isEmpty(opt[jsonKey])) return;
        this.$el.css(cssKey, opt[jsonKey]);
        this['_set' + jsonKey.replace(/^\w/, function($0){return $0.toUpperCase();})](opt);
    }


});

})();

