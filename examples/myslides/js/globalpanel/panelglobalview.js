var PanelGlobalView = Rocket.GlobalView.extend({

    className: 'global-panel'

    , events: {
        'tap .panel span': 'onpanelbuttonclick'
    }

    , contTpl: [
          '<div class="panel-wrapper">'
        ,   '<div class="panel iconfont">'
        ,     '<span class="panel-bottom icon-xiangxia"></span>'
        ,     '<span class="panel-top icon-xiangshang1"></span>'
        ,     '<span class="slide-new icon-jia1"></span>'
        ,     '<span class="slide-delete icon-jian1"></span>'
        ,     '<span class="slide-prev icon-xiangzuo2"></span>'
        ,     '<span class="slide-next icon-xiangyou2"></span>'
        ,     '<span class="slide-config icon-shezhi"></span>'
        ,     '<span class="text-new icon-wenbenshuru"></span>'
        ,     '<span class="topnewsimagetext-new icon-wenbenshuru"></span>'
        ,     '<span class="image-new icon-tupian"></span>'
        ,     '<span class="imagewithmask-new icon-tupian"></span>'
        ,     '<span class="topnewsimagewithmask-new icon-tupian"></span>'
        ,     '<span class="share-new icon-fenxiang"></span>'
        ,     '<span class="button-new icon-fenxiang"></span>'
        ,     '<span class="boxalign-left icon-juzuo"></span>'
        ,     '<span class="boxalign-center icon-juzhong"></span>'
        ,     '<span class="boxalign-right icon-juyou"></span>'
        ,     '<span class="layer-up icon-xiangshang"></span>'
        ,     '<span class="layer-down icon-paixu"></span>'
        ,     '<span class="align-left icon-juzuo"></span>'
        ,     '<span class="align-center icon-juzhong"></span>'
        ,     '<span class="align-right icon-juyou"></span>'
        ,     '<span class="font-color icon-ziti"></span>'
        ,     '<span class="zoom-in icon-fangda"></span>'
        ,     '<span class="zoom-out icon-suoxiao"></span>'
        ,     '<span class="preview icon-dianshiji"></span>'
        ,     '<span class="save icon-baocun"></span>'
        ,     '<span class="save4partialedit icon-shangchuan"></span>'
        ,     '<span class="release icon-fasong"></span>'
        ,   '</div>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        me.render();
        me.$panel = me.$('.panel');

        if(me.gec.editMode == 'FULLEDIT'){
            me.initIScroll();
        }
        else{
            me.hide();
        }
    }

    , registerEvents: function(){
        var me = this;
        me.ec.on('routechange', me.onroutechange, me);
        me.gec.on('beforeedit.global', me.onbeforeedit, me);
        me.gec.on('beforeimageedit.global', me.onbeforeimageedit, me);
        me.gec.on('release.releasebutton.global', me.onreleasefromreleasebutton, me);
    }

    , render: function(){
        var me = this;
        me.$el.html(me.contTpl)
            .appendTo('body');
        // Default to bottom
        me.positionPanel('bottom');
    }

    , initIScroll: function(){
        var me = this;

        me.iScroll = new IScroll(
            me.$('.panel-wrapper')[0] 
            , {
                scrollX: true
                , scrollY: false
                , mouseWheel: true
                , bounnce: true
            }
        );

        // Delay to make sure width of panel is updated correctly.
        setTimeout(function(){
            me.refreshIScroll();
        }, 200);
    }

    , refreshIScroll: function(){
        var me = this, totalWidth = 0, $panel = me.$panel;
        $.each($panel.children(), function(index, item){
            var $item = $(item);
            totalWidth += $item.width();
        });
        totalWidth += 6 * parseInt(me.$('.boxalign-center').css('margin-left'));
        setTimeout(function(){
            $panel.width(totalWidth );
            setTimeout(function(){
                me.iScroll.refresh();
            }, 100);
        }, 300);
    }

    , onroutechange: function(params){
        this.currentAction = params.to.action;
    }

    , clearState: function(){
        this.gec.trigger('clear.global', {target: this});
    }

    , onpanelbuttonclick: function(e){
        var me = this,
            $btn = $(e.target).closest('span'),
            cls = $btn[0].className;

        $btn.addClass('on');
        setTimeout(function(){
            $btn.removeClass('on');
        }, 300);

        if(/^align-(\w+)/.test(cls)){
            var align = RegExp.$1;
            me.gec.trigger('textalign.global', {textAlign: align});
        }
        else if(/^boxalign-(left|right|center)/.test(cls)){
            me.gec.trigger('boxalign.global', {type: RegExp.$1});
        }
        else if(/panel-(bottom|top)/.test(cls)){
            me.clearState();
            me.positionPanel(RegExp.$1);
        }
        else if(/slide-new/.test(cls)){
            me.clearState();
            me.toggleSlideNewPanel();
        }
        else if(/slide-config/.test(cls)){
            me.clearState();
            me.toggleSlideConfigPanel();
        }
        else if(/slide-(next|prev|delete)/.test(cls)){
            var action = RegExp.$1;
            me.clearState();
            me.gec.trigger('slideoperation.global', {action: action});
        }
        else if(/layer-(up|down)/.test(cls)){
            var action = RegExp.$1;
            me.gec.trigger('layer.global', {action: action});
        }
        else if(/(text|topnewsimagetext)-new/.test(cls)){
            var action = RegExp.$1;
            me.clearState();
            me.gec.trigger('newtext.global', {type: action});
        }
        else if(/(topnewsimagewithmask|imagewithmask|image)-new/.test(cls)){
            var action = RegExp.$1;
            me.clearState();
            me.togglePopupImagePanel({imageType: action});
        }
        else if(/button-new/.test(cls)){
            me.clearState();
            me.gec.trigger('newbutton.global');
        }
        else if(/share-new/.test(cls)){
            me.clearState();
            me.gec.trigger('newshare.global');
        }
        else if(/font-color/.test(cls)){
            me.toggleFontColorPanel();
        }
        else if(/zoom-(in|out)/.test(cls)){
            var action = RegExp.$1;
            me.gec.trigger('zoom.global', {action: action});
        }
        else if(/preview/.test(cls)){
            me.clearState();
            me.gec.trigger('clear.global preview.global');
            me.previewSlides();
        }
        else if(/save4partialedit|release|save/.test(cls)){
            var action = RegExp['$&'];
            me.onsave(action);
        }

    }

    , onsave: function(action){
        var me = this,
            slidesConfig = {
                order: me.gec.pageOrder
                , views: {}
                , images: []
                , topNewsImage: {}
                , isRelease: action == 'release' ? true : false
                , editMode: action == 'save4partialedit'
                    ? 'PARTIALEDIT' 
                    : action == 'save'
                        ? 'FULLEDIT'
                        : 'RELEASE'
            };

        if(!me.isPreviewed){
            me.tip('Please preview first.');
            setTimeout(function(){
                me.previewSlides(function(){
                    me.onsave(action);
                });
            }, 1000);
            return;
        }
        me.gec
            .trigger('clear.global')
            .trigger(
                action + '.global'
                , slidesConfig.views
                , slidesConfig.images
                , slidesConfig.topNewsImage
            );

        me.saveSlides(slidesConfig, action);
    }

    , onreleasefromreleasebutton: function(){
        this.onsave('release');
    }

    , onbeforeedit: function(params){
        this.togglePopupEditPanel(params);
    }

    , onbeforeimageedit: function(params){
        $.extend(params, {isEditing: true});
        this.togglePopupImagePanel(params);
    }

    , toggleFontColorPanel: function(){
        var me = this, panel = me.fontColorPanel;
        if(!panel){
            panel = me.fontColorPanel
                = new PopupFontColorSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle();
    }

    , toggleSlideNewPanel: function(){
        var me = this, panel = me.slideNewPanel;
        if(!panel){
            panel = me.slideNewPanel
                = new PopupSlideNewSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle();
    }

    , toggleSlideConfigPanel: function(){
        var me = this, panel = me.slideConfigPanel;
        if(!panel){
            panel = me.slideConfigPanel
                = new PopupSlideConfigSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle();
    }

    , togglePopupImagePanel: function(params){
        var me = this, panel = me.popupImagePanel;
        if(!panel){
            panel = me.popupImagePanel
                = new PopupImageSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle(params);
    }

    , togglePopupEditPanel: function(params){
        var me = this, panel = me.popupEditPanel;
        if(!panel){
            panel = me.popupEditPanel
                = new PopupEditSubView(null, me);
            me.appendTo(panel, 'body'); 
        }
        panel.toggle(params && params.text || {}.text);
    }

    , positionPanel: function(pos){
        var me = this;

        if('top' == pos){
            me.$el.css({
                top: 0
                , bottom: 'auto'
            });
        }

        if('bottom' == pos){
            me.$el.css({
                bottom: 0
                , top: 'auto'
            });
        }
    }

    , previewSlides: function(callback){
        var me = this
            , order = me.gec.pageOrder
            , i = 0;

        me.tip('Preview start.');
        _play();
        me.isPreviewed = true;

        function _play(){
            if(i < order.length){
                me.navigate(order[i++]);
                setTimeout(function(){_play();}, 2000);
            }
            else{
                me.tip('Preview finish.');
                setTimeout(function(){
                    callback && callback();
                }, 1000);
            }
        }
    }

    , saveSlides: function(config, mode){
        var me = this, topImage = config.topNewsImage;

        console.log(JSON.stringify(config));
        me.ensureSendForm();
        me.$inputContent.val(JSON.stringify(config));
        me.$inputImgUrl.val(topImage.img_url); 
        me.$inputImgWidth.val(topImage.img_width); 
        me.$inputImgHeight.val(topImage.img_height); 
        me.$inputTitle.val(topImage.title); 
        me.$form.submit();
        window.__cardAsyncCallback__ = function(opt){
            var href;
            if(opt && !opt.cardid) return;
            switch(mode){
                case 'save4partialedit':
                    href = './partialedit.html';
                    break;
                case 'release':
                    href = './index.html';
                    break;
                case 'save':
                    href = './fulledit.html';
                    break;
            }
            location.href = href
                + '?cardid=' + opt.cardid
                + '&cut_x=' + ( topImage.x || 0 )
                + '&cut_y=' + ( topImage.y || 0 )
                + '&cut_w=' + ( topImage.w || 640 )
                + '&cut_h=' + ( topImage.h || 400 );
        };
    }

    , ensureSendForm: function(){
        var me = this,
            $form = me.$form,
            formTpl = [
                  '<form action="' + global_greetingcard_server + '"' 
                ,     ' method="POST" target="__hidden_iframe__">'
                ,     '<input name="action" type="hidden" value="add">'
                ,     '<input name="cuid" type="hidden" value="cuid">'
                ,     '<input name="redirect" type="hidden"'
                ,         ' value="' + global_land_page + '">'
                ,     '<input name="maxwidth" type="hidden" value="800">'
                ,     '<input name="name" type="hidden" value="name">'
                ,     '<input name="title" type="hidden" value="title">'
                ,     '<input name="template" type="hidden" value="template">'
                ,     '<input name="content" type="hidden" value="content">'
                ,     '<input name="img_url" type="hidden" value="http://myslides.baidu.com">'
                ,     '<input name="img_width" type="hidden" value="1200">'
                ,     '<input name="img_height" type="hidden" value="600">'
                , '</form>'
            ].join('');

        if(!$form){
            me._ensureHiddenIFrame();
            $form = me.$form = $(formTpl).appendTo('body').hide();
            me.$inputName = $form.find('input[name="name"]'); 
            me.$inputTitle = $form.find('input[name="title"]'); 
            me.$inputContent = $form.find('input[name="content"]'); 
            me.$inputImgUrl = $form.find('input[name="img_url"]'); 
            me.$inputImgWidth = $form.find('input[name="img_width"]'); 
            me.$inputImgHeight = $form.find('input[name="img_height"]'); 
        }
    }

    , _ensureHiddenIFrame: function(){
        if($('#__hidden_iframe__').length) return;
        $(
            '<iframe id="__hidden_iframe__" name="__hidden_iframe__" style="display:none;"></iframe>'
        ).appendTo('body');
    }


});
