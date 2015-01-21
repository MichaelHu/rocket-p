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
        this.goNext();
        e.preventDefault();
    }

    , onswipeDown: function(e){
        this.goPrev();
        e.preventDefault();
    }

});

return PlainPageView;

});
