(function(){

var SLIDES_COUNT = 21;


var AppRouter = Rocket.Router.extend({

    routes: function(){
        var rs = {};
        for(var i=1; i<=SLIDES_COUNT; i++){
            rs['gslide' + i] = '_defaultHandler:gslide' + i;
        }
        rs['*default'] = '_defaultHandler:gslide1';
        return rs;
    }

    , pageOrder: function(){
        var order = [];
        for(var i=1; i<=SLIDES_COUNT; i++){
            order.push('gslide' + i);
        }
        return order;
    }

    , defaultPageTransition: 'rotatecubeTB'
    // , defaultPageTransition: 'rotatecubeLR'
    // , defaultPageTransition: 'rotatenewspaper'
    // , defaultPageTransition: 'rotatecarouselLR'
    // , defaultPageTransition: 'slideLR'

    , pageTransition: function(){
        var trans = {};
        trans['gslide' + SLIDES_COUNT + '-gslide1']
            = 'scaledownupscaleup'; 
        return trans;
    }

});



var pageViews = {},
    ids = [];

for(var i=1; i<22; i++) ids.push('slide' + i);

$.each(
    ids
    , function(index, item){
        pageViews[item] = BaseSlidePageView.extend({

            el: '#' + item

            , events: {
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
    }
);


var appRouter = new AppRouter();

$.each(pageViews, function(key, item){
    appRouter.registerViewClass('g' + key, item);
});

var globalPanel = new PanelGlobalView(null, appRouter);

appRouter.start();
    




})();
