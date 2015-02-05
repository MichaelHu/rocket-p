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
RocketPPT.subViewClasses['ImageWithMaskSubView'] = require('imagewithmasksubview');  





var testConfig =
{"order":["index","slide2","slide3","slide4"],"views":{"slide4":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" ><div data-pos_left=\"42\" data-pos_top=\"89\" data-size_width=\"262\" data-size_height=\"257\" data-layer_zindex=\"10\" style=\"position: absolute; left: 42px; top: 89px; width: 262px; height: 257px; z-index: 10; border: 1px dotted transparent;\" data-view_class=\"ImageWithMaskSubView\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"./img/jizhi/1.jpeg\" data-pos_left=\"-10\" data-pos_top=\"-173\" data-size_width=\"363.6\" style=\"display: inline; position: absolute; top: -173px; left: -10px; width: 363.6px;\"></div><div class=\"iconfont enable-inner-move icon-yidong\"></div><div class=\"inner-panel\"><span class=\"img-move\" data-btn-type=\"img-move\">移动</span><span data-btn-type=\"img-zoom-in\">放大</span><span data-btn-type=\"img-zoom-out\">缩小</span></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div><div class=\"img-mask\" data-background_image=\"url(./img/jizhi/comment_head.png)\" style=\"background-image: url(./img/jizhi/comment_head.png);\"><span class=\"img-mask-change\">换蒙层</span></div></div></div>"},"slide3":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"63\" data-pos_top=\"242\" data-size_width=\"200\" data-size_height=\"30\" data-layer_zindex=\"10\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#9900ff\" data-text_align=\"center\" data-view_class=\"TextSubView\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\" style=\"position: absolute; left: 63px; top: 242px; width: 200px; height: 30px; z-index: 10; font-size: 26px; line-height: 36px; color: rgb(153, 0, 255); text-align: center; border: 1px dotted transparent; right: auto;\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">最强魔方墙</div></div><div data-pos_left=\"74\" data-pos_top=\"122\" data-size_width=\"209\" data-size_height=\"71\" data-layer_zindex=\"10\" data-view_class=\"ImageWithMaskSubView\" style=\"position: absolute; left: 74px; top: 122px; width: 209px; height: 71px; z-index: 10; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"./img/jizhi/5.jpeg\" data-size_width=\"274.5\" data-pos_left=\"18\" data-pos_top=\"-54\" style=\"display: inline; position: absolute; width: 274.5px; top: -54px; left: 18px;\"></div><div class=\"iconfont enable-inner-move icon-yidong\"></div><div class=\"inner-panel\"><span class=\"img-move\" data-btn-type=\"img-move\">移动</span><span data-btn-type=\"img-zoom-in\">放大</span><span data-btn-type=\"img-zoom-out\">缩小</span></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div><div class=\"img-mask\" data-background_image=\"url(./img/jizhi/comment_head.png)\" style=\"background-image: url(./img/jizhi/comment_head.png);\"><span class=\"img-mask-change\">换蒙层</span></div></div></div>"},"slide2":{"class":"FrontPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><h2 style=\"margin-top:80px; color: #f00; font-size:32px;\">FrontPageView</h2><div data-pos_left=\"81.5\" data-pos_top=\"218\" data-size_width=\"153\" data-size_height=\"71\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#0f0\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 81.5px; top: 218px; width: 153px; height: 71px; font-size: 26px; line-height: 36px; color: rgb(0, 255, 0); text-align: center; border: 1px dotted transparent; right: auto; z-index: 11;\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\" data-layer_zindex=\"11\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">手心的蔷薇\n\n林俊杰</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"},"index":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" style=\"display: none;\"><div data-pos_left=\"0\" data-pos_top=\"48\" data-size_width=\"254\" data-size_height=\"70\" data-text_font-size=\"26px\" data-text_line-height=\"36px\" data-text_color=\"#6aa84f\" data-text_align=\"left\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 0px; top: 48px; width: 254px; height: 70px; font-size: 26px; line-height: 36px; color: rgb(106, 168, 79); text-align: left; border: 1px dotted transparent; right: auto; z-index: 10;\" data-pos_right=\"auto\" data-pos_boxalign_left=\"1\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">原来在你眼中，你从未放弃我</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"auto\" data-pos_top=\"127\" data-size_width=\"231\" data-size_height=\"69\" data-text_font_size=\"26px\" data-text_line_height=\"36px\" data-text_color=\"#93c47d\" data-text_align=\"right\" data-view_class=\"TextSubView\" style=\"position: absolute; left: auto; top: 127px; width: 231px; height: 69px; font-size: 26px; line-height: 36px; color: rgb(147, 196, 125); text-align: right; border: 1px dotted transparent; right: 0px; z-index: 10;\" data-pos_right=\"0\" data-pos_boxalign_right=\"1\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">你的爱是我唯一坚持的理由</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"44.5\" data-pos_top=\"256\" data-size_width=\"246\" data-size_height=\"85\" data-text_font_size=\"80px\" data-text_line_height=\"80px\" data-text_color=\"#000000\" data-text_align=\"center\" data-view_class=\"TextSubView\" style=\"position: absolute; left: 44.5px; top: 256px; width: 246px; height: 85px; font-size: 80px; line-height: 80px; color: rgb(0, 0, 0); text-align: center; border: 1px dotted transparent; right: auto; z-index: 10;\" data-pos_boxalign=\"1\" data-pos_right=\"auto\" data-pos_boxalign_left=\"1\" data-pos_boxalign_center=\"1\" data-pos_boxalign_right=\"1\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\" contenteditable=\"false\">王力宏</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"63\" data-pos_top=\"355\" data-size_width=\"200\" data-size_height=\"30\" data-text_font_size=\"22px\" data-text_line_height=\"22px\" data-text_color=\"#000000\" data-text_align=\"center\" data-view_class=\"TextSubView\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\" style=\"position: absolute; left: 63px; top: 355px; width: 200px; height: 30px; font-size: 22px; line-height: 22px; color: rgb(0, 0, 0); text-align: center; border: 1px dotted transparent; right: auto; z-index: 10;\" data-layer_zindex=\"10\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">1982</div></div><div data-pos_left=\"-228\" data-pos_top=\"-88\" data-size_width=\"609\" data-size_height=\"709.2937181663837\" data-layer_zindex=\"8\" data-view_class=\"ImageWithMaskSubView\" style=\"position: absolute; left: -228px; top: -88px; width: 609px; height: 709.293718166384px; z-index: 8; border: 1px dotted transparent;\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"./img/jizhi/8.jpeg\" data-size_width=\"706.2\" data-pos_left=\"-68\" data-pos_top=\"-162\" style=\"display: inline; position: absolute; width: 706.2px; top: -162px; left: -68px;\"></div><div class=\"iconfont enable-inner-move icon-yidong\"></div><div class=\"inner-panel\"><span class=\"img-move\" data-btn-type=\"img-move\">移动</span><span data-btn-type=\"img-zoom-in\">放大</span><span data-btn-type=\"img-zoom-out\">缩小</span></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div><div class=\"img-mask\"><span class=\"img-mask-change\">换蒙层</span></div></div></div>"}},"isRelease":false}
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
