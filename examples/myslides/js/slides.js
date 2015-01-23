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





var testConfig =
{"order":["index","slide2"],"views":{"slide2":{"class":"FrontPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" ><h2 style=\"margin-top:80px; color: #f00; font-size:32px;\">FrontPageView</h2><div data-pos_left=\"88\" data-pos_top=\"200\" data-size_width=\"153\" data-size_height=\"71\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#0f0\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 88px; top: 200px; width: 153px; height: 71px; font-size: 26px; line-height: 36px; color: rgb(0, 255, 0); text-align: center; border: 1px dotted transparent; right: auto;\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">手心的蔷薇\n\n林俊杰</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"},"index":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"-94\" data-pos_top=\"-469\" data-size_width=\"697\" data-size_height=\"697\" data-view_class=\"ImageSubView\" style=\"position: absolute; left: -94px; top: -469px; width: 697px; height: 697px; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span></div><div class=\"image\"><div class=\"add iconfont\"></div><input type=\"file\"><img src=\"./img/jizhi/10.jpeg\" style=\"display: inline;\"></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"0\" data-pos_top=\"48\" data-size_width=\"254\" data-size_height=\"70\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#d5a6bd\" data-text_align=\"left\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 0px; top: 48px; width: 254px; height: 70px; font-size: 26px; line-height: 36px; color: rgb(213, 166, 189); text-align: left; border: 1px dotted transparent; right: auto;\" data-pos_right=\"auto\" data-pos_boxalign_left=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">原来在你眼中，你从未放弃我</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"auto\" data-pos_top=\"127\" data-size_width=\"231\" data-size_height=\"69\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#93c47d\" data-text_align=\"right\" data-view_class=\"TextSubView\" style=\"position: absolute; left: auto; top: 127px; width: 231px; height: 69px; font-size: 26px; line-height: 36px; color: rgb(147, 196, 125); text-align: right; border: 1px dotted transparent; right: 0px;\" data-pos_right=\"0\" data-pos_boxalign_right=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">你的爱是我唯一坚持的理由</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"51\" data-pos_top=\"256\" data-size_width=\"246\" data-size_height=\"85\" data-text_font_size=\"80px\" data-text_line_height=\"80px\" data-text_color=\"#ff9900\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 51px; top: 256px; width: 246px; height: 85px; font-size: 80px; line-height: 80px; color: rgb(255, 153, 0); text-align: center; border: 1px dotted transparent; right: auto;\" data-pos_boxalign=\"1\" data-pos_right=\"auto\" data-pos_boxalign_left=\"1\" data-pos_boxalign_center=\"1\" data-pos_boxalign_right=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">王力宏</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"69\" data-pos_top=\"355\" data-size_width=\"200\" data-size_height=\"30\" data-text_font_size=\"22px\" data-text_line_height=\"22px\" data-text_color=\"#f6b26b\" data-text_align=\"center\" data-view_class=\"TextSubView\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\" style=\"position: absolute; left: 69px; top: 355px; width: 200px; height: 30px; font-size: 22px; line-height: 22px; color: rgb(246, 178, 107); text-align: center; border: 1px dotted transparent; right: auto;\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">1982</div></div></div>"}},"isRelease":false}
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
