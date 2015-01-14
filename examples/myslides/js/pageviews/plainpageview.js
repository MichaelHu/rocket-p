var PlainPageView = BaseSlidePageView.extend({

    events: {
        'swipeDown': 'onswipeDown'
        , 'swipeUp': 'onswipeUp'
    }

    , init: function(){
        this.append(
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
                , this
            )
            , true
        );
    }

    , onswipeUp: function(e){
        this.goNext();
    }

    , onswipeDown: function(e){
        this.goPrev();
    }

});

