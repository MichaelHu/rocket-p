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
        ,     '<span class="align-left">&#xe650;</span>'
        ,     '<span class="align-center">&#xe651;</span>'
        ,     '<span class="align-right">&#xe652;</span>'
        ,     '<span class="font-family">&#xe62a;</span>'
        ,     '<span class="font-size">&#xe62e;</span>'
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
            var action = RegExp.$1;

            me.gec.trigger('slideoperation.global', {action: 'new'})
                .registerViewClass('abc', PlainPageView)
                .addRoute('abc', '_defaultHandler:abc')
                .insertPageOrder('abc', {pos: 'AFTER', relatedAction: me.currentAction});

            me.navigate('abc');
        }
        else if(/slide-delete/.test(cls)){
            me.gec.trigger('slideoperation.global', {action: 'delete'});
        }

    }


});

})();
