(function(){

var testConfig =
 {"order":["index","slide2"],"views":{"index":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" ><div data-pos_left=\"2\" data-pos_top=\"41\" data-size_width=\"369\" data-size_height=\"512\" data-view_class=\"ImageSubView\" style=\"position: absolute; left: 2px; top: 41px; width: 369px; height: 512px; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span></div><div class=\"image\"><div class=\"add iconfont\"></div><input type=\"file\"><img src=\"./img/10.jpg\" style=\"display: inline;\"></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"9\" data-pos_top=\"76\" data-size_width=\"200\" data-size_height=\"30\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"left\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 9px; top: 76px; width: 200px; height: 30px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: left; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">刺杀金正恩</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"},"slide2":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"39\" data-pos_top=\"196\" data-size_width=\"271\" data-size_height=\"147\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 39px; top: 196px; width: 271px; height: 147px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">看着你的眼睛<div>你说你是雨</div><div>就会变成泪滴</div><div>忘掉过去</div></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"}},"isRelease":true}
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
    , isRelease: false
};


var AppRouter = Rocket.Router.extend({

    routes: {
        '*anything': '_defaultHandler:index'
    }

    , pageOrder: slidesConfig.order

    , isRelease: slidesConfig.isRelease

    , defaultPageTransition: 'rotatecubeTB'
    // , defaultPageTransition: 'rotatecubeLR'
    // , defaultPageTransition: 'rotatenewspaper'
    // , defaultPageTransition: 'scaledownupscaleup'
    // , defaultPageTransition: 'rotatecarouselLR'
    // , defaultPageTransition: 'slideLR'

});

var appRouter = new AppRouter();

$.each(slidesConfig.views, function(key, item){
    var $el = $(item.html).appendTo('#wrapper');
    appRouter.addRoute(key, '_defaultHandler:' + key);
    appRouter.registerViewClass(key, window[item['class']].extend({el: $el[0]}));
});

if(!appRouter.isRelease){
    new PanelGlobalView(null, appRouter);
}

window.appRouter = appRouter;

appRouter.start();
    




})();
