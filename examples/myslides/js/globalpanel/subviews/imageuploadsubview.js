define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');

var ImageUploadSubView = Rocket.SubView.extend({

    className: 'image-upload-container'

    , events: {
        'click .confirm': 'onconfirmclick'
    }

    , init: function(options){
        var me = this;

        me._super();
        me.render();
        me.$form = me.$('form');
        me.$file = me.$('input');
        me.$confirm = me.$('.confirm');
    }

    , tpl: [
          '<form action="/news?tn=uploadfile" enctype="multipart/form-data"'
        ,     ' method="POST" target="__image_upload__">'
        ,     '<input name="pic" type="file" accept="image/png,image/gif,image/png">'
        , '</form>'
        , '<div class="confirm">确定</div>'
    ].join('')

    , render: function(){
        var me = this;
        me._super();
        me.$el.append(me.tpl);
        me.ensureHiddenIFrame();
    }

    , ensureHiddenIFrame: function(){
        if($('#__image_upload__').length) return;
        $(
            '<iframe id="__image_upload__" name="__image_upload__" style="display:none;"></iframe>'
        ).appendTo('body');
    }

    , registerEvents: function(){
        var me = this, pec = me._parent;

        me._super();

        pec.on('typechange', me.ontypechange, me);
        me.$file.on('change', function(e){
            me.onchange();
        });
    }

    , onconfirmclick: function(){
        var me = this;
        me._parent.trigger('confirm', {url: me.$text.val()});
    }

    , onchange: function(e){
        var me = this;     
        me.$form.submit();
        if(!window.__uploadFileCallback__){
            window.__uploadFileCallback__ = function(file){
                me._parent.trigger('confirm', {url: file});
            };
        }
    }

    , ontypechange: function(params){
        var me = this;
        
        if(params && params.type == 'local'){
            me.show();
        }
        else {
            me.hide();
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
        this.show();
    }

    , close: function(){
        var me = this;
        this.hide();
    }
    
    
});

return ImageUploadSubView;

});


