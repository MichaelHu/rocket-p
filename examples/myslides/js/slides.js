define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');

this.RocketPPT = {
    pageViewClasses: {}
    , subViewClasses: {}
    , globalViewClasses: {}
};

RocketPPT.globalViewClasses['PanelGlobalView'] = require('panelglobalview');  

RocketPPT.pageViewClasses['BaseSlidePageView'] = require('baseslidepageview');  
RocketPPT.pageViewClasses['PlainPageView'] = require('plainpageview');  
RocketPPT.pageViewClasses['FrontPageView'] = require('frontpageview');  

RocketPPT.subViewClasses['RectSubView'] = require('rectsubview');  
RocketPPT.subViewClasses['TextSubView'] = require('textsubview');  
RocketPPT.subViewClasses['ImageSubView'] = require('imagesubview');  
RocketPPT.subViewClasses['FontColorPanelSubView'] = require('fontcolorpanelsubview');  





var testConfig =
{"order":["index","slide2"],"views":{"index":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"-18\" data-pos_top=\"-28\" data-size_width=\"457\" data-size_height=\"457\" data-view_class=\"ImageSubView\" style=\"position: absolute; left: -18px; top: -28px; width: 457px; height: 457px; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span></div><div class=\"image\"><div class=\"add iconfont\"></div><input type=\"file\"><img src=\"./img/jizhi/10.jpeg\" style=\"display: inline;\"></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"110\" data-pos_top=\"195\" data-size_width=\"36\" data-size_height=\"32\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#ff0000\" data-text_align=\"left\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 110px; top: 195px; width: 36px; height: 32px; font-size: 26px; line-height: 36px; color: rgb(255, 0, 0); text-align: left; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">刺</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"166\" data-pos_top=\"195\" data-size_width=\"35\" data-size_height=\"32\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#ff0000\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 166px; top: 195px; width: 35px; height: 32px; font-size: 26px; line-height: 36px; color: rgb(255, 0, 0); text-align: center; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">杀</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"102.5\" data-pos_top=\"246\" data-size_width=\"207\" data-size_height=\"49\" data-text_font_size=\"48px\" data-text_line_height=\"48px\" data-text_color=\"#ff9900\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 102.5px; top: 246px; width: 207px; height: 49px; font-size: 48px; line-height: 48px; color: rgb(255, 153, 0); text-align: center; border: 1px dotted transparent;\" data-pos_boxalign=\"1\"><div class=\"iconfont control-panel\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">金正恩</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"},"slide2":{"class":"FrontPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" ><h2 style=\"margin-top:80px; color: #f00; font-size:32px;\">FrontPageView</h2><div data-pos_left=\"20\" data-pos_top=\"200\" data-size_width=\"200\" data-size_height=\"36\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#0f0\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 20px; top: 200px; width: 200px; height: 36px; font-size: 26px; line-height: 36px; color: rgb(0, 255, 0); text-align: center;\"><div class=\"iconfont control-panel\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">TextSubView</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"}},"isRelease":false}
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

    // , defaultPageTransition: 'rotatecubeTB'
    // , defaultPageTransition: 'rotatecubeLR'
    // , defaultPageTransition: 'rotatenewspaper'
    , defaultPageTransition: 'scaledownupscaleup'
    // , defaultPageTransition: 'rotatecarouselLR'
    // , defaultPageTransition: 'slideLR'
    // , defaultPageTransition: 'slideTB'

});

var appRouter = new AppRouter();

$.each(slidesConfig.views, function(key, item){
    var $el = $(item.html).appendTo('#wrapper');
    appRouter.addRoute(key, '_defaultHandler:' + key);
    appRouter.registerViewClass(
        key
        , RocketPPT.pageViewClasses[item['class']].extend({el: $el[0], isSetup: true})
    );
});

if(!appRouter.isRelease){
    new RocketPPT.globalViewClasses['PanelGlobalView'](null, appRouter);
}

window.appRouter = appRouter;

appRouter.start();

$(document).on('touchmove', function(e){
    e.preventDefault();
});
    

});
