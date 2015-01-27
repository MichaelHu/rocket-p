define(function(require){

var BaseSlidePageView = require('baseslidepageview');

var PlainPageView = BaseSlidePageView.extend({

    events: {
        'swipeDown': 'onswipeDown'
        , 'swipeUp': 'onswipeUp'
    }

    , init: function(){
        this._super();
        this.viewClass = 'PlainPageView';
    }

    , registerEvents: function(){
        var me = this;

        me._super();
    }

    , onswipeUp: function(e){
        var me = this;

        if(me.gec.isRelease){
            me.goNext();
            e.preventDefault();
        }
    }

    , onswipeDown: function(e){
        var me = this,
            scrollY = window.scrollY;

        if(me.gec.isRelease
            && scrollY <= 5){
            me.goPrev();
            e.preventDefault();
        }
    }

});

return PlainPageView;

});
