define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');
require('disable-scrolling');

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
{"order":["index","slide2","slide3"],"views":{"slide2":{"class":"FrontPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><h2 style=\"margin-top:80px; color: #f00; font-size:32px;\">FrontPageView</h2><div data-pos_left=\"82.5\" data-pos_top=\"218\" data-size_width=\"153\" data-size_height=\"71\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#0f0\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 82.5px; top: 218px; width: 153px; height: 71px; font-size: 26px; line-height: 36px; color: rgb(0, 255, 0); text-align: center; border: 1px dotted transparent; right: auto; z-index: 11;\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\" data-layer_zindex=\"11\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">手心的蔷薇\n\n林俊杰</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"-2\" data-pos_top=\"109\" data-size_width=\"223\" data-size_height=\"93\" data-view_class=\"ImageSubView\" style=\"position: absolute; left: -2px; top: 109px; width: 223px; height: 93px; border: 1px dotted transparent; z-index: 10;\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"./img/jizhi/8.jpeg\n\" style=\"display: inline;\"></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"auto\" data-pos_top=\"319\" data-size_width=\"242\" data-size_height=\"135\" data-view_class=\"ImageSubView\" style=\"position: absolute; left: auto; top: 319px; width: 242px; height: 135px; border: 1px dotted transparent; right: 0px; z-index: 10;\" data-pos_right=\"0\" data-pos_boxalign_right=\"1\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"./img/jizhi/9.jpeg\n\" style=\"display: inline;\"></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"},"slide3":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" ><div data-pos_left=\"84\" data-pos_top=\"162\" data-size_width=\"150\" data-size_height=\"100\" data-layer_zindex=\"10\" data-view_class=\"ImageSubView\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\" style=\"position: absolute; left: 84px; top: 162px; width: 150px; height: 100px; z-index: 10; border: 1px dotted transparent; right: auto;\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"./img/jizhi/5.jpeg\" style=\"display: inline;\"></div></div><div data-pos_left=\"59\" data-pos_top=\"290\" data-size_width=\"200\" data-size_height=\"30\" data-layer_zindex=\"10\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#9900ff\" data-text_align=\"center\" data-view_class=\"TextSubView\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\" style=\"position: absolute; left: 59px; top: 290px; width: 200px; height: 30px; z-index: 10; font-size: 26px; line-height: 36px; color: rgb(153, 0, 255); text-align: center; border: 1px dotted transparent; right: auto;\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">最强魔方墙</div></div></div>"},"index":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"-186\" data-pos_top=\"-424\" data-size_width=\"1097\" data-size_height=\"1097\" data-view_class=\"ImageSubView\" style=\"position: absolute; left: -186px; top: -424px; width: 1097px; height: 1097px; border: 1px dotted transparent; z-index: 9;\" data-layer_zindex=\"9\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span></div><div class=\"image\"><div class=\"add iconfont\"></div><input type=\"file\"><img src=\"./img/jizhi/10.jpeg\" style=\"display: inline;\"></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"0\" data-pos_top=\"48\" data-size_width=\"254\" data-size_height=\"70\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#d5a6bd\" data-text_align=\"left\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 0px; top: 48px; width: 254px; height: 70px; font-size: 26px; line-height: 36px; color: rgb(213, 166, 189); text-align: left; border: 1px dotted transparent; right: auto; z-index: 10;\" data-pos_right=\"auto\" data-pos_boxalign_left=\"1\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">原来在你眼中，你从未放弃我</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"auto\" data-pos_top=\"127\" data-size_width=\"231\" data-size_height=\"69\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#93c47d\" data-text_align=\"right\" data-view_class=\"TextSubView\" style=\"position: absolute; left: auto; top: 127px; width: 231px; height: 69px; font-size: 26px; line-height: 36px; color: rgb(147, 196, 125); text-align: right; border: 1px dotted transparent; right: 0px; z-index: 10;\" data-pos_right=\"0\" data-pos_boxalign_right=\"1\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">你的爱是我唯一坚持的理由</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"36\" data-pos_top=\"256\" data-size_width=\"246\" data-size_height=\"85\" data-text_font_size=\"80px\" data-text_line_height=\"80px\" data-text_color=\"#ff9900\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 36px; top: 256px; width: 246px; height: 85px; font-size: 80px; line-height: 80px; color: rgb(255, 153, 0); text-align: center; border: 1px dotted transparent; right: auto; z-index: 10;\" data-pos_boxalign=\"1\" data-pos_right=\"auto\" data-pos_boxalign_left=\"1\" data-pos_boxalign_center=\"1\" data-pos_boxalign_right=\"1\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">王力宏</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"59\" data-pos_top=\"355\" data-size_width=\"200\" data-size_height=\"30\" data-text_font_size=\"22px\" data-text_line_height=\"22px\" data-text_color=\"#f6b26b\" data-text_align=\"center\" data-view_class=\"TextSubView\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\" style=\"position: absolute; left: 59px; top: 355px; width: 200px; height: 30px; font-size: 22px; line-height: 22px; color: rgb(246, 178, 107); text-align: center; border: 1px dotted transparent; right: auto; z-index: 10;\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">1982</div></div><div data-pos_left=\"13\" data-pos_top=\"388\" data-size_width=\"292\" data-size_height=\"93\" data-view_class=\"ImageSubView\" style=\"position: absolute; left: 13px; top: 388px; width: 292px; height: 93px; border: 1px dotted transparent; z-index: 9; right: auto;\" data-layer_zindex=\"9\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"./img/jizhi/8.jpeg\" style=\"display: inline;\"></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"}},"isRelease":false}
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

    // TB
    // , defaultPageTransition: 'flipTB'
    // , defaultPageTransition: 'slideTB'
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
    , defaultPageTransition: 'rotatefallscaleup'
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

});
