define(function(require){

var $ = require('zepto');
var Rocket = require('rocket');
var RocketPPT = require('rocket-ppt');

var testConfig =
{"order":["index","slide2","slide3"],"views":{"index":{"class":"PlainPageView","html":"<div class=\"slide\" data-background_color=\"#fff6df\" style=\"display: none; background-color: rgb(255, 246, 223);\" data-original-classes=\"slide\"><div data-pos_left=\"-4.5\" data-pos_top=\"-1\" data-size_width=\"327\" data-size_height=\"486.77198697068405\" data-view_class=\"ImageWithMaskSubView\" data-layer_zindex=\"10\" data-pos_right=\"auto\" data-lock=\"lock\" style=\"position: absolute; left: -4.5px; top: -1px; width: 327px; height: 486.771986970684px; z-index: 10; border: 1px dotted transparent; right: auto;\" data-pos_boxalign_center=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"lock icon-suoding\"></span><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"/static/news/myslides/img/1/1-a.png\" data-size_width=\"305.8\" data-pos_left=\"10\" data-pos_top=\"-16\" style=\"display: inline; position: absolute; width: 305.8px; top: -16px; left: 10px;\"></div><div class=\"inner-panel\"><span class=\"img-move\" data-btn-type=\"img-move\">移动</span><span data-btn-type=\"img-zoom-in\">放大</span><span data-btn-type=\"img-zoom-out\">缩小</span></div><div class=\"img-mask\"><span class=\"img-mask-change\">换蒙层</span></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"4.5\" data-pos_top=\"136\" data-size_width=\"309\" data-size_height=\"174\" data-view_class=\"ImageWithMaskSubView\" data-layer_zindex=\"10\" data-text_align=\"left\" data-pos_right=\"auto\" style=\"position: absolute; left: 4.5px; top: 136px; width: 309px; height: 174px; z-index: 10; border: 1px dotted transparent; text-align: left; right: auto;\" data-pos_boxalign_center=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"lock icon-jiesuo\"></span><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"/static/news/myslides/img/1/1-a-2.png\" data-size_width=\"254.70000000000002\" data-pos_left=\"33\" data-pos_top=\"19\" style=\"display: inline; position: absolute; width: 254.7px; top: 19px; left: 33px;\"></div><div class=\"inner-panel\"><span class=\"img-move\" data-btn-type=\"img-move\">移动</span><span data-btn-type=\"img-zoom-in\">放大</span><span data-btn-type=\"img-zoom-out\">缩小</span></div><div class=\"img-mask\" data-background_image=\"url(./img/1/1-a-1.png)\" style=\"background-image: url(http://test.baidu.com:8300/static/news/myslides/img/1/1-a-1.png);\"><span class=\"img-mask-change\">换蒙层</span></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"},"slide2":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" data-background_color=\"#fff6df\" style=\"display: none; background-color: rgb(255, 246, 223);\"><div data-pos_left=\"0\" data-pos_top=\"0\" data-size_width=\"318\" data-size_height=\"453\" data-view_class=\"ImageWithMaskSubView\" data-layer_zindex=\"10\" data-pos_right=\"auto\" style=\"position: absolute; left: 0px; top: 0px; width: 318px; height: 453px; z-index: 10; border: 1px dotted transparent; right: auto;\" data-lock=\"lock\" data-pos_boxalign_center=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"lock icon-suoding\"></span><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"/static/news/myslides/img/1/1-b.png\" data-size_width=\"309.1\" style=\"display: inline; position: absolute; width: 309.1px; top: -6px; left: 7px;\" data-pos_left=\"7\" data-pos_top=\"-6\"></div><div class=\"inner-panel\"><span class=\"img-move on\" data-btn-type=\"img-move\">移动</span><span data-btn-type=\"img-zoom-in\">放大</span><span data-btn-type=\"img-zoom-out\">缩小</span></div><div class=\"img-mask\"><span class=\"img-mask-change\">换蒙层</span></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"8\" data-pos_top=\"141\" data-size_width=\"302\" data-size_height=\"171\" data-view_class=\"ImageWithMaskSubView\" data-layer_zindex=\"10\" style=\"position: absolute; left: 8px; top: 141px; width: 302px; height: 171px; z-index: 10; border: 1px dotted transparent; right: auto;\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"lock icon-jiesuo\"></span><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"/static/news/myslides/img/1/1-b-1.png\" data-size_width=\"280.5\" data-pos_left=\"13\" data-pos_top=\"9\" style=\"display: inline; position: absolute; width: 280.5px; top: 9px; left: 13px;\"></div><div class=\"inner-panel\"><span class=\"img-move\" data-btn-type=\"img-move\">移动</span><span data-btn-type=\"img-zoom-in\">放大</span><span data-btn-type=\"img-zoom-out\">缩小</span></div><div class=\"img-mask\" data-background_image=\"url(./img/1/1-a-1.png)\" style=\"background-image: url(http://test.baidu.com:8300/static/news/myslides/img/1/1-a-1.png);\"><span class=\"img-mask-change\">换蒙层</span></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"},"slide3":{"class":"PlainPageView","html":"<div class=\"slide\" data-original-classes=\"slide\" data-background_color=\"#fff6df\" style=\"display: block; background-color: rgb(255, 246, 223);\"><div data-pos_left=\"0.5\" data-pos_top=\"-2\" data-size_width=\"317\" data-size_height=\"565\" data-view_class=\"ImageWithMaskSubView\" data-layer_zindex=\"6\" data-lock=\"lock\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\" style=\"position: absolute; left: 0.5px; top: -2px; width: 317px; height: 565px; z-index: 6; border: 1px dotted transparent; right: auto;\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"lock icon-suoding\"></span><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"image\"><img src=\"/static/news/myslides/img/1/1-c.png\" data-size_width=\"315.70000000000005\" style=\"display: inline; position: absolute; width: 315.7px;\"></div><div class=\"inner-panel\"><span class=\"img-move\" data-btn-type=\"img-move\">移动</span><span data-btn-type=\"img-zoom-in\">放大</span><span data-btn-type=\"img-zoom-out\">缩小</span></div><div class=\"img-mask\"><span class=\"img-mask-change\">换蒙层</span></div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"28\" data-pos_top=\"271\" data-size_width=\"262\" data-size_height=\"27\" data-view_class=\"TextSubView\" data-layer_zindex=\"10\" data-text_font_size=\"22px\" data-text_line_height=\"22px\" data-text_color=\"#444444\" data-text_align=\"left\" style=\"position: absolute; left: 28px; top: 271px; width: 262px; height: 27px; z-index: 10; font-size: 22px; line-height: 22px; color: rgb(68, 68, 68); text-align: left; border: 1px dotted transparent; right: auto;\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"lock icon-jiesuo\"></span><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">    王小微：</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"55\" data-pos_top=\"308\" data-size_width=\"208\" data-size_height=\"54\" data-view_class=\"TextSubView\" data-layer_zindex=\"10\" data-text_font_size=\"22px\" data-text_line_height=\"22px\" data-text_color=\"#444444\" data-text_align=\"left\" style=\"position: absolute; left: 55px; top: 308px; width: 208px; height: 54px; z-index: 10; font-size: 22px; line-height: 22px; color: rgb(68, 68, 68); text-align: left; border: 1px dotted transparent; right: auto;\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"lock icon-jiesuo\"></span><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">你是我的好朋友<br>\n也是我一辈子的牵挂</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div><div data-pos_left=\"34.5\" data-pos_top=\"361\" data-size_width=\"249\" data-size_height=\"27\" data-view_class=\"TextSubView\" data-layer_zindex=\"10\" data-text_font_size=\"22px\" data-text_line_height=\"22px\" data-text_color=\"#444444\" data-text_align=\"right\" style=\"position: absolute; left: 34.5px; top: 361px; width: 249px; height: 27px; z-index: 10; font-size: 22px; line-height: 22px; color: rgb(68, 68, 68); text-align: right; border: 1px dotted transparent; right: auto;\" data-pos_right=\"auto\" data-pos_boxalign_center=\"1\"><div class=\"iconfont control-panel\" style=\"display: none;\"><span class=\"lock icon-jiesuo\"></span><span class=\"delete icon-shanchu\"></span><span class=\"resize icon-daxiao\"></span><span class=\"edit icon-bianji\"></span></div><div class=\"text\">－－ 小曼</div><div class=\"iconfont resize-handle icon-jia\" style=\"display: none;\"></div></div></div>"}},"isRelease":false,"editMode":"RELEASE"}
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

});