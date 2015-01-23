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

    , onswipeUp: function(e){
        var me = this;
        if(me.gec.isRelease){
            me.goNext();
            e.preventDefault();
        }
    }

    , onswipeDown: function(e){
        var me = this;
        if(me.gec.isRelease){
            me.goPrev();
            e.preventDefault();
        }
    }

});

return PlainPageView;

});
