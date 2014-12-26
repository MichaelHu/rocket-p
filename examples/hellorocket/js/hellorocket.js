(function(){


var AppRouter = Rocket.Router.extend({

    routes: {
        '': '_defaultHandler:index'
        , 'index': '_defaultHandler:index'
        , 'sayhello': '_defaultHandler:sayhello'
    }

    , pageOrder: ['index', 'sayhello']

    , pageTransition: {
        'index-sayhello': 'slideeasingLR'
    }

});



var IndexPageView = Rocket.PageView.extend({

    el: '#index_page'

    , events: {
        'click a': 'onclick'
    }

    , onclick: function(e){
        this.navigate('sayhello'); 
    }

}); 





var SayhelloPageView = Rocket.PageView.extend({

    el: '#sayhello_page'

    , events: {
        'click .sayhello-page-header-backbtn': 'onbackbtn'
    }

    , onbackbtn: function(e){
        this.navigate('');
    }

});




new AppRouter()
    .registerViewClass('index', IndexPageView)
    .registerViewClass('sayhello', SayhelloPageView)
    .start();
    




})();
