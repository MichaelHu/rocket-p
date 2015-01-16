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
    }

    , onswipeDown: function(e){
        this.goPrev();
    }

});

