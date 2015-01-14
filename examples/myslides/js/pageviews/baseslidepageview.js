var BaseSlidePageView = Rocket.PageView.extend({

    className: 'slide'

    , registerEvents: function(){
        var me = this;
        me.gec.on('slideoperation.global', me.onslideoperation, me);
    }

    , unregisterEvents: function(){
        var me = this;
        me.gec.off('slideoperation.global', me.onslideoperation, me);
    }

    , onslideoperation: function(params){
        var me = this;

        if(me.isActivePage()){
            if(params.action == 'delete'){
                me.destroy();
            }
        }
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
            me.tip('Only 1 slide left!');
        }
    }

});

