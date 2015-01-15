(function(){

var slidesConfig = {
    order: ['index']
    , views: {
        'index': {
            'class': 'PlainPageView'
            , 'html': '<div class="slide"></div>'
        }
    }
};

slidesConfig = 
{"order":["index","abc","slide1","slide2","slide3"],"views":{"slide3":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"50\" data-pos_top=\"100\" data-size_width=\"200\" data-size_height=\"30\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 50px; top: 100px; width: 200px; height: 30px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\">TextSubView</div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"},"slide2":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"50\" data-pos_top=\"100\" data-size_width=\"200\" data-size_height=\"30\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 50px; top: 100px; width: 200px; height: 30px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\">TextSubView</div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"},"slide1":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"81\" data-pos_top=\"305\" data-size_width=\"200\" data-size_height=\"30\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 81px; top: 305px; width: 200px; height: 30px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\" contenteditable=\"false\">早已听惯了你的<div>联调陈词</div></div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"},"abc":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"74\" data-pos_top=\"376\" data-size_width=\"239\" data-size_height=\"38\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 74px; top: 376px; width: 239px; height: 38px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\" contenteditable=\"false\">你在梦里喊他的名字</div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"},"index":{"class":"PlainPageView","html":"<div class=\"slide\"  data-original-classes=\"slide\"><div data-pos_left=\"32\" data-pos_top=\"154\" data-size_width=\"321\" data-size_height=\"48\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#fff\" data-text_align=\"center\" style=\"position: absolute; left: 32px; top: 154px; width: 321px; height: 48px; font-size: 26px; line-height: 36px; color: rgb(255, 255, 255); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete\"></span><span class=\"resize\"></span><span class=\"edit\"></span></div><div class=\"text\" contenteditable=\"false\">所有一切都将都将重新开始</div><div class=\"iconfont resize-handle\" style=\"display: none;\"></div></div></div>"}}}
;


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
