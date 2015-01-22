define(function(require){

var $ = require('zepto');
var PopupSubView = require('popupsubview');

var PopupEditSubView = PopupSubView.extend({

    init: function(options){
        var me = this;
        me._super();
        me.$popupEdit = me.$('.popup-edit-subview');
        me.$text = me.$('textarea');
    }

    , popupEditTpl: [
          '<div class="popup-edit-subview">'
        ,     '<textarea></textarea>'
        , '</div>'
    ].join('')

    , render: function(){
        var me = this;
        me._super();
        me.$el.append(me.popupEditTpl);
    }

    , registerEvents: function(){
        var me = this;
        me._super();
        me.$popupEdit.on('click', function(e){
            e.stopPropagation();
        });
    }

    , setValue: function(val){
        if(val !== void 0){
            this.$text.val(val);
        }
    }

    , toggle: function(val){
        var me = this;
        me._super();
        if(me.$el.css('display') != 'none'){
            me.open(val);
        }
        else{
            me.close();
        }
    }

    , open: function(val){
        this._super();
        this.setValue(val);
    }

    , close: function(){
        var me = this;

        me._super();
        me.gec.trigger('afteredit.global', {text: me.$text.val()});
    }
    
    
});

return PopupEditSubView;

});
