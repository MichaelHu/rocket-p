var PlainPageView = BaseSlidePageView.extend({

    events: {
        'swipeDown': 'onswipeDown'
        , 'swipeUp': 'onswipeUp'
    }

    , init: function(){
        this.viewClass = 'PlainPageView';
        this._super();
    }

    , onswipeUp: function(e){
        this.goNext();
    }

    , onswipeDown: function(e){
        this.goPrev();
    }

});

