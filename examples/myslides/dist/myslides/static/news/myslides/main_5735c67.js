define(["require","zepto","rocket","rocket-ppt","cover-loading"],function(e,n,t,i,a){function o(e){var n,t=location.search,i=new RegExp(e+"=([^&]+)");return(n=t.match(i))?decodeURIComponent(n[1]):null}function r(){n("#cover-loading").animate({opacity:0},1e3,"ease-in",function(){n(this).hide()})}function d(e){e&&e.images?s(e.images,function(){r()}):r(),c(e)}function c(e){var a=null,a=JSON.parse(unescape(a)),o=e||a||{order:["index"],views:{index:{"class":"PlainPageView",html:'<div class="slide"></div>'}},isRelease:!1},r=t.Router.extend({routes:{"*anything":"_defaultHandler:index"},pageOrder:o.order,isRelease:o.isRelease,editMode:o.editMode||"FULLEDIT",defaultPageTransition:"slideTB",isAllPagesOpened:function(){for(var e=this,n=e.views,t=e.pageOrder,i=0;i<t.length;i++)if(!n[t[i]])return!1;
return!0}}),d=new r;n.each(o.views,function(e,t){var a=n(t.html).appendTo("#wrapper").hide();d.addRoute(e,"_defaultHandler:"+e),d.registerViewClass(e,i[t["class"]].extend({el:a[0],isSetup:!0}))}),"RELEASE"!=d.editMode&&new i.PanelGlobalView(null,d),"PARTIALEDIT"==d.editMode&&l(),window.appRouter=d,"RELEASE"==d.editMode&&(location.href="#"),d.start()}function s(e,n){if(!e||!e.length)return void(n&&n());var t,i=e.length,o=0,r=0;for(a(30);i>o;)t=new Image,t.src=e[o++],t.onload=t.onabort=t.onerror=function(){r++,a(Math.ceil(70*r/i+30)),r>=i&&setTimeout(function(){n&&n()
},100)}}function l(){f.show()}function u(){f.hide()}o("cardid")?n.ajax({dataType:"jsonp",url:global_greetingcard_server,data:{action:"get",cardid:o("cardid"),x:o("cut_x")||0,y:o("cut_y")||0,w:o("cut_w")||640,h:o("cut_h")||400,ratio:1,detail:1},timeout:5e3,success:function(e){var n;e&&e.data&&e.data.content&&(n=JSON.parse(unescape(e.data.content)),d(n))},error:function(){console.log(arguments)}}):d();var f=n('<div class="operation-tip"></div>').appendTo("body").hide();f.on("click",function(){u()})
});