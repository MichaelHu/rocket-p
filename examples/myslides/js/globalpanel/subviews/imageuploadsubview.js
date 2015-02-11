var ImageUploadSubView = Rocket.SubView.extend({

    className: 'image-upload-container'

    , init: function(options){
        var me = this;

        me._super(options);
        me.render();
        me.$form = me.$('form');
        me.$file = me.$('input');
        me.$confirm = me.$('.confirm');
    }

    , tpl: [
          '<form action="' + global_greetingcard_server + '"' 
        ,     ' enctype="multipart/form-data"'
        ,     ' method="POST" target="__hidden_iframe__">'
        ,     '<input class="file-input" name="image" type="file" accept="image/gif,image/jpeg,image/jpg">'
        ,     '<div class="fake-file-input">点击拍照或上传图片</div>'
        ,     '<input name="action" type="hidden" value="uploadimg">'
        ,     '<input name="redirect" type="hidden"'
        ,         ' value="' + global_land_page + '">'
        ,     '<input name="maxwidth" type="hidden" value="800">'
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
        if($('#__hidden_iframe__').length) return;
        $(
            '<iframe id="__hidden_iframe__" name="__hidden_iframe__" style="display:none;"></iframe>'
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

    , onchange: function(e){
        var me = this;     
        me.$form.submit();
        window.__cardAsyncCallback__ = function(opt){
            if(opt && !opt.imgurl) return;
            me._parent.trigger(
                'confirm'
                , {
                    url: opt.imgurl
                    , w: opt.w
                    , h: opt.h
                }
            );
        };
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


