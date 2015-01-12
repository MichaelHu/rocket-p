(function(){

var undef = void 0;

this.PanelGlobalView = Rocket.GlobalView.extend({

    className: 'global-panel'

    , events: {
        'click .panel span': 'onpanelbuttonclick'
    }

    , contTpl: [
          '<div class="panel iconfont">'
        ,     '<span class="align-left">&#xe619;</span>'
        ,     '<span class="align-center">&#xe61a;</span>'
        ,     '<span class="align-right">&#xe61b;</span>'
        , '</div>'
    ].join('')

    , init: function(options){
        var me = this;
        me.render();
        me.$panel = me.$('.panel');
    }

    , render: function(){
        var me = this;
        me.$el.html(me.contTpl)
            .appendTo('#wrapper');
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
    }


});

})();
