define(
    ['require', 'zepto', 'rocket', 'rocket-ppt', 'cover-loading']
    , function(require, $, Rocket, RocketPPT, CoverLoading){

function getQuery(name){
    var qstr = location.search,
        rname = new RegExp(name + '=([^&]+)'),
        match;
    if((match = qstr.match(rname))){
        return decodeURIComponent(match[1]);
    }
    return null;
}

if(!getQuery('cardid')){
    start();
}
else{
    $.ajax({
        dataType: 'jsonp'
        , url: global_greetingcard_server
        , data: { 
            action: 'get'
            , cardid: getQuery('cardid') 
            , x: getQuery('cut_x') || 0
            , y: getQuery('cut_y') || 0
            , w: getQuery('cut_w') || 640
            , h: getQuery('cut_h') || 400
            , maxwidth: 1000
            , ratio: 1
            , detail: 1
        } 
        , timeout: 5000
        , success: function(resp){
            var config;
            if(resp && resp.data && resp.data.content){
                config = JSON.parse(unescape(resp.data.content));
                start(config);
            }
        }
        , error: function(){
            console.log(arguments);
        }
    });
}


function clearLoading(){
    $('#cover-loading')
        .animate({opacity: 0}, 1000, 'ease-in', function(){$(this).hide();});   
}


function start(initConfig){

    if(initConfig && initConfig.images){
        loadImages(initConfig.images, function(){
            clearLoading();
        });
    }
    else{
        clearLoading();
    }

    initSlides(initConfig);
}




function initSlides(initConfig){

    var slidesConfig = initConfig || {
        order: ['index']
        , views: {
            'index': {
                'class': 'PlainPageView'
                , 'html': '<div class="slide"></div>'
            }
        }
        , isRelease: false
    };


    var AppRouter = Rocket.Router.extend({

        routes: {
            '*anything': '_defaultHandler:index'
        }

        , pageOrder: slidesConfig.order

        , isRelease: slidesConfig.isRelease

        // Default mode is FULLEDIT
        , editMode: slidesConfig.editMode || 'FULLEDIT'

        // TB
        // , defaultPageTransition: 'flipTB'
        , defaultPageTransition: 'slideTB'
        // , defaultPageTransition: 'slidefadeTB'
        // , defaultPageTransition: 'rotatecubeTB'
        // , defaultPageTransition: 'scaledownupscaleup'


        // LR
        // , defaultPageTransition: 'rotateslide'
        // , defaultPageTransition: 'rotateslidedelay'

        // ALL
        // , defaultPageTransition: 'scaledowncenterscaleupcenter'
        // , defaultPageTransition: 'scaledownscaleupdown'
        // , defaultPageTransition: 'scaledownupscaleup'
        // , defaultPageTransition: 'rotatefallscaleup'
        // , defaultPageTransition: 'rotatenewspaper'





        // , defaultPageTransition: 'rotatecubeLR'
        // , defaultPageTransition: 'rotatecarouselLR'
        // , defaultPageTransition: 'slideLR'
        // , defaultPageTransition: 'movefaderotateunfoldTB'
        // , defaultPageTransition: 'rotatecarouselTB'
        // , defaultPageTransition: 'rotatepushslideTB'
        // , defaultPageTransition: 'rotateroomTB'
        // , defaultPageTransition: 'rotateslideTB'
        // , defaultPageTransition: 'scaledownslideTB'
        // , defaultPageTransition: 'slideeasingTB'
        // , defaultPageTransition: 'slidescaleupTB'

        // , defaultPageTransition: 'rotatefoldmovefadeTB'
    });

    var appRouter = new AppRouter();

    $.each(slidesConfig.views, function(key, item){
        var $el = $(item.html)
                .appendTo('#wrapper')
                // Make sure it's hidden.
                .hide();

        appRouter.addRoute(key, '_defaultHandler:' + key);
        appRouter.registerViewClass(
            key
            , RocketPPT[item['class']].extend({el: $el[0], isSetup: true})
        );
    });

    if(appRouter.editMode != 'RELEASE'){
        new RocketPPT['PanelGlobalView'](null, appRouter);
    }

    window.appRouter = appRouter;

    appRouter.start();

}

function loadImages(images, callback){
    if(!images || !images.length) {
        callback && callback();
        return;
    } 
    var len = images.length, 
        i = 0,
        finished = 0,
        img;
    
    while(i < len){
        img = new Image();
        img.src = images[i++];
        img.onload = img.onabort 
            = img.onerror 
            = function(){
                finished++; 
                CoverLoading(Math.ceil(100 * finished / len));
                if(finished >= len){
                    callback && callback();
                }
            };
    } 
}

});
