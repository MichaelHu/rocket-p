(function(){

var undef = void 0;

this.PanelGlobalView = Rocket.GlobalView.extend({

    className: 'global-panel'

    , events: {
        'click .panel span': 'onpanelbuttonclick'
    }

    , contTpl: [
          '<div class="panel iconfont">'
        ,     '<span class="slide-new">&#xe64d;</span>'
        ,     '<span class="slide-delete">&#xe64e;</span>'
        ,     '<span class="text-new">&#xe647;</span>'
        ,     '<span class="image-new">&#xe617;</span>'
        ,     '<span class="align-left">&#xe650;</span>'
        ,     '<span class="align-center">&#xe651;</span>'
        ,     '<span class="align-right">&#xe652;</span>'
        ,     '<span class="font-family">&#xe62a;</span>'
        ,     '<span class="font-size">&#xe62e;</span>'
        ,     '<span class="release-debug">&#xe612;</span>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        me.render();
        me.$panel = me.$('.panel');
    }

    , registerEvents: function(){
        var me = this;
        me.ec.on('routechange', me.onroutechange, me);
    }

    , render: function(){
        var me = this;
        me.$el.html(me.contTpl)
            .appendTo('#wrapper');
    }

    , onroutechange: function(params){
        this.currentAction = params.to.action;
    }

    , _getMaxSlideID: function(){
        var order = this.router.getPageOrder(), 
            i = order.length - 1,
            max = 2; 
       
        while(i >= 0){
            if(/^slide(\d+)$/.test(order[i])){
                if(RegExp.$1 - 0 > max) {
                    max = RegExp.$1 - 0; 
                }
            }
            i--;
        }
        return max;
    }

    , getUniqueSlideID: function(){
        var me = this;
        if(void 0 === me._uniqueSlideID){
            me._uniqueSlideID = me._getMaxSlideID();
        }
        return ++me._uniqueSlideID;
    }

    , onpanelbuttonclick: function(e){
        var me = this,
            $btn = $(e.target).closest('span'),
            cls = $btn[0].className;

        $btn.addClass('on');
        setTimeout(function(){
            $btn.removeClass('on');
        }, 300);

        if(/align-(\w+)/.test(cls)){
            var align = RegExp.$1;
            me.gec.trigger('textalign.global', {textAlign: align});
        }
        else if(/slide-new/.test(cls)){
            var action = RegExp.$1,
                action = 'slide' + me.getUniqueSlideID();

            me.gec.trigger('slideoperation.global', {action: 'new'})
                .registerViewClass(action, PlainPageView)
                .addRoute(action, '_defaultHandler:' + action)
                .insertPageOrder(action, {pos: 'AFTER', relatedAction: me.currentAction});

            me.navigate(action);
        }
        else if(/slide-delete/.test(cls)){
            me.gec.trigger('slideoperation.global', {action: 'delete'});
        }
        else if(/text-new/.test(cls)){
            me.gec.trigger('newtext.global');
        }
        else if(/image-new/.test(cls)){
            me.gec.trigger('newimage.global');
        }
        else if(/release/.test(cls)){
            var slidesConfig = {
                    order: me.gec.pageOrder
                    , views: {}
                };

            me.gec.trigger('release.global', slidesConfig.views);
            console.log(JSON.stringify(slidesConfig));
        }

    }


});

})();
