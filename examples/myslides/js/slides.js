(function(){

var testConfig =
{"order":["index","slide6","slide3","slide4","slide5"],"views":{"index":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"83\" data-pos_top=\"259\" data-size_width=\"200\" data-size_height=\"30\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 83px; top: 259px; width: 200px; height: 30px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\" contenteditable=\"false\">你不知道的事</div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div><div data-pos_left=\"164\" data-pos_top=\"381\" data-size_width=\"200\" data-size_height=\"30\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 164px; top: 381px; width: 200px; height: 30px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\" contenteditable=\"false\">－ 王力宏</div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"},"slide3":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"33\" data-pos_top=\"109\" data-size_width=\"296\" data-size_height=\"327\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 33px; top: 109px; width: 296px; height: 327px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\" contenteditable=\"false\">你不知道我为什么离开你<div><br></div><div>我坚持不能说放任你哭泣</div><div>你的泪滴像倾盆大雨</div><div>碎了满地在心里清晰</div><div><br></div><div>你不知道我为什么狠下心</div><div>盘旋在你看不见的高空里</div><div><br></div><div>多的是你不知道的事</div></div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"},"slide4":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" ><div data-pos_left=\"13\" data-pos_top=\"113\" data-size_width=\"340\" data-size_height=\"400\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 13px; top: 113px; width: 340px; height: 400px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\" contenteditable=\"false\">我飞行但你坠落之际<div><br></div><div>oh ...<br><div><br></div><div>你不知道我为什么离开你</div><div><br></div><div>我坚持不能说放任你哭泣</div></div><div><br></div><div>你的泪滴像倾盆大雨</div><div>碎了满地</div><div>在心里清晰</div></div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"},"slide5":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"37\" data-pos_top=\"162\" data-size_width=\"304\" data-size_height=\"222\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 37px; top: 162px; width: 304px; height: 222px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\" contenteditable=\"false\">你不知道我为什么狠下心<div><br></div><div>盘旋在你看不见的高空里</div><div><br></div><div>多的是</div><div>你不知道事</div></div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"},"slide6":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"30\" data-pos_top=\"161\" data-size_width=\"299\" data-size_height=\"325\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 30px; top: 161px; width: 299px; height: 325px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\" contenteditable=\"false\">蝴蝶眨几次眼睛<div>才学会飞行</div><div>夜空洒满了星星</div><div>但几颗会落地</div><div><br></div><div>我飞行但你坠落之际</div><div>很靠近还听见呼吸</div><div><br></div><div>对不起我却没捉紧你</div></div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"}}}
;

// testConfig = null;

var slidesConfig = testConfig || {
    order: ['index']
    , views: {
        'index': {
            'class': 'PlainPageView'
            , 'html': '<div class="slide"></div>'
        }
    }
};


var AppRouter = Rocket.Router.extend({

    routes: {
        '*anything': '_defaultHandler:index'
    }

    , pageOrder: slidesConfig.order

    , defaultPageTransition: 'rotatecubeTB'
    // , defaultPageTransition: 'rotatecubeLR'
    // , defaultPageTransition: 'rotatenewspaper'
    // , defaultPageTransition: 'rotatecarouselLR'
    // , defaultPageTransition: 'slideLR'

});

var appRouter = new AppRouter();

$.each(slidesConfig.views, function(key, item){
    var $el = $(item.html).appendTo('#wrapper');
    appRouter.addRoute(key, '_defaultHandler:' + key);
    appRouter.registerViewClass(key, window[item['class']].extend({el: $el[0]}));
});

var globalPanel = new PanelGlobalView(null, appRouter);

window.appRouter = appRouter;

appRouter.start();
    




})();
