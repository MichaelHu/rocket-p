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
        ,     '<div class="add iconfont">&#xe617;</div>'
        ,     '<input type="file">'
        ,     '<img>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        
        options || (options = {});
        me._super(options);

        me.viewClass = 'ImageSubView';
        if(!me._isSetup){
            me.$el.append(me.tpl);
        }
        me.$image = me.$('.image');
        me.$file = me.$('input[type="file"]');
        me.$img = me.$('img');
        me.render(options);
    }

    , render: function(options){
        var me = this;
        me._super();
        if(!me.isFirstRender){
            me.isFirstRender = true;
        }
        me.applyTextSettings(options && options.image);
    }

    , registerEvents: function(){
        var me = this, 
            gec = me.gec,
            ec = me.ec;

        me._super();
        me.$file.on('change', function(e){me.onfilechange.apply(me, arguments);});
        ec.on('pagebeforechange', me.onpagebeforechange, me);
        gec.on('textalign.global', me.ontextalign, me);
    }

    , unregisterEvents: function(){
        var me = this, 
            ec = me.ec,
            gec = me.gec;

        me.$file.off('change', function(e){me.onfilechange.apply(me, arguments);});
        ec.off('pagebeforechange', me.onpagebeforechange, me);
        gec.off('textalign.global', me.ontextalign, me);
        me._super();
    }

    , onfilechange: function(e){
        var me = this;
        me.$img.attr('src', './img/10.jpg')
            .show();;
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

