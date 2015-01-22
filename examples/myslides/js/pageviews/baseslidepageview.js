define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');
var TextSubView = require('textsubview');
var ImageSubView = require('imagesubview');
var CommonSettingsInterface = require('commonsettingsinterface');

var BaseSlidePageView = Rocket.PageView.extend({

    className: 'slide'

    , init: function(){
        var me = this;
        me._super();
        me.setupSubViews();
        setTimeout(function(){
            if( !me.viewClass || !Utils.isString(me.viewClass) ){
                throw Error('BaseSlidePageView.init: "viewClass" is undefined or is not of type String'); 
            }    
        }, 0);
    }

    , registerEvents: function(){
        var me = this;
        me.gec.on('slideoperation.global', me.onslideoperation, me);
        me.gec.on('release.global', me.onrelease, me);
        me.gec.on('save.global', me.onsave, me);
        me.gec.on('newtext.global', me.onnewtext, me);
        me.gec.on('newimage.global', me.onnewimage, me);
    }

    , unregisterEvents: function(){
        var me = this;
        me.gec.off('slideoperation.global', me.onslideoperation, me);
        me.gec.off('release.global', me.onrelease, me);
        me.gec.off('save.global', me.onsave, me);
        me.gec.off('newtext.global', me.onnewtext, me);
        me.gec.off('newimage.global', me.onnewimage, me);
    }

    , setupSubViews: function(){
        var me = this;

        me.$el.children().each(function(index, item){
            var viewClass = $(item).data('view_class');
            if(viewClass && Utils.isFunction(RocketPPT.subViewClasses[viewClass])){
                me.append(
                    new ( 
                        RocketPPT.subViewClasses[viewClass].extend({el: item}) 
                    ) ({isSetup: true}, me)
                    , true
                );
            }
        });
    }

    , onslideoperation: function(params){
        var me = this;

        if(me.isActivePage()){
            switch(params.action){
                case 'delete':
                    me.destroy();
                    break;
                case 'prev':
                    me.goPrev();
                    break;
                case 'next':
                    me.goNext();
                    break;
            }
        }
    }

    , onrelease: function(params){
        var me = this;
        
        params[me.action] = {
            'class': me.viewClass
            // Make sure slide is default hidden
            , 'html': me.$el.prop('outerHTML')
                        .replace(/style="display: block;"/, '')
        };
    }

    , onsave: function(params){
        this.onrelease(params);
    }

    , onnewtext: function(){
        var me = this;

        if(!me.isActivePage()) return;
        
        me.append(
            new TextSubView(
                {
                    pos: {
                        top: 100
                        , left: 50
                    }
                    , size: {
                        height: 30
                        , width: 200
                    }
                    , text: {
                        lineHeight: '36px'
                        , color: '#fff'
                        , textAlign: 'center'
                        , fontSize: '26px'
                    }
                }
                , me
            )
            , true
        );

    }

    , onnewimage: function(){
        var me = this;

        if(!me.isActivePage()) return;
        
        me.append(
            new ImageSubView(
                {
                    pos: {
                        top: 160
                        , left: 50
                    }
                    , size: {
                        height: 100
                        , width: 100
                    }
                    , text: {
                        textAlign: 'center'
                    }
                }
                , me
            )
            , true
        );

    }

    , goNext: function(options){
        this.navigate(this._getAction('NEXT'), options);
    }

    , goPrev: function(options){
        this.navigate(this._getAction('PREV'), options);
    }

    , _getAction: function(type){
        var me = this,
            pageOrder = me.gec.getPageOrder(), isPrev, i = 0;

        switch(type){
            case 'PREV': isPrev = 1;
            case 'NEXT':
                while(i < pageOrder.length){
                    if(pageOrder[i] == me.action){
                        if(isPrev){
                            return pageOrder[i > 0 ? i - 1 : i];
                        }
                        return pageOrder[i < pageOrder.length - 1 ? i + 1 : i];
                    }
                    i++;
                }
            default:
                if(/\d+/.test(type)){
                    return pageOrder[type];
                }
                else{
                    return me.action;
                }
        } 
    }

    , destroy: function(){
        var me = this,
            action = me._getAction('PREV');

        if(action != me.action
            || (action = me._getAction('NEXT')) != me.action
            ){
            me.navigate(action, {replace: true});
            setTimeout(function(){
                delete me._router.views[me.action];
                me.gec.removeRoute(me.action)
                    .removePageOrder(me.action);
                // Don't use me._super() in another process 
                BaseSlidePageView._superClass.prototype.destroy.apply(me);
            }, 1000);
        }
        else{
            me.tip('Only 1 slide left !');
        }
    }

});

$.extend(BaseSlidePageView.prototype, CommonSettingsInterface);

return BaseSlidePageView;

});
