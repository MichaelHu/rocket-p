var Animation = (function(){

var animations = {};
var isAnimating = false;

function register(name, func){
    if(!Utils.isString(name) || name.length == 0){
        throw Error('registerAnimation: name must be non-empty string');
    }

    if(!Utils.isFunction(func)){
        throw Error('registerAnimation: func must be function');
    }

    animations[name] = func;
}

function get(name){
    return animations[name];
}

function pageTransition(inPage, outPage, inClass, outClass){

    var outPageEnd,
        inPageEnd,
        animationComplete,
        $inPage = $(inPage),
        $outPage = $(outPage)
        ;

    if(isAnimating){
        return;
    }
    isAnimating = true;

    outPageEnd = inPageEnd = false;
    animationComplete = false;

    $outPage
        .data('original-classes', $outPage.attr('class'))
        .addClass(outClass)
        .on('webkitAnimationEnd', function(e){
            outPageEnd = true;
            if(inPageEnd){
                afterAnimation();
            }   
        }); 

    $inPage
        .show()
        .data('original-classes', $inPage.attr('class'))
        .addClass(inClass)
        .on('webkitAnimationEnd', function(e){
            inPageEnd = true;
            if(outPageEnd){
                afterAnimation();
            }   
        }); 


    // afterAnimation may not be called in case of fast swipe
    setTimeout(function(){
        if(!animationComplete){
            afterAnimation();
        }
    }, 2000);


    function beforeAnimation(){
    }


    function afterAnimation(){
        animationComplete = true;

        $outPage.hide()
            .attr('class', $outPage.data('original-classes') || null)
            .off('webkitAnimationEnd');

        $inPage
            .attr('class', $inPage.data('original-classes') || null)
            .off('webkitAnimationEnd');

        isAnimating = false;
    }

}

return {
    register: register
    , get: get
    , pageTransition: pageTransition
};


})();
