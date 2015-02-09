define(function(require){

var $$ = require('jquery');
var $ = require('zepto');
var Rocket = require('rocket');
var undef = void 0;
var subViewClasses = {};

// window.IScroll
require('iscroll');
// Spectrum
require('spectrum'); 

__inline('disable-scrolling.js')
__inline('draggable.js')

__inline('globalpanel/panelglobalview.js')
__inline('globalpanel/popupsubview.js')
__inline('globalpanel/popupeditsubview.js')
__inline('globalpanel/popupfontcolorsubview.js')
__inline('globalpanel/popupimagesubview.js')
__inline('globalpanel/popupslideconfigsubview.js')
__inline('globalpanel/popupslidenewsubview.js')
__inline('globalpanel/subviews/imageuploadsubview.js')
__inline('globalpanel/subviews/imageurlsubview.js')

__inline('interfaces/settingsutils.js')
__inline('interfaces/boxsettings.js')
__inline('interfaces/commonsettings.js')

__inline('pageviews/baseslidepageview.js')
__inline('pageviews/plainpageview.js')
__inline('pageviews/frontpageview.js')

__inline('rectsubview.js')
__inline('textsubview.js')
__inline('imagesubview.js')
__inline('imagewithmasksubview.js')



$.extend(
    subViewClasses
    , {
        RectSubView: RectSubView
        , TextSubView: TextSubView
        , ImageSubView: ImageSubView
        , ImageWithMaskSubView: ImageWithMaskSubView
    }
);


return {
    PanelGlobalView: PanelGlobalView  
    , PlainPageView: PlainPageView 
    , FrontPageView: FrontPageView 
};

});
