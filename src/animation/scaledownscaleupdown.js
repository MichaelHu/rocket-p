(function(){

function scaledownscaleupdown(currentEle, nextEle, dir, callback) {
    var $currentEle = currentEle && $(currentEle),
        $nextEle = nextEle && $(nextEle);

    if(0 == dir){
        if(currentEle != nextEle){
            currentEle && $currentEle.hide();
            setTimeout(function(){
                nextEle && $nextEle.show();
            }, 0);
        }

        callback && callback();
        return;
    }

    var outClass = 'pt-page-scaleDown', 
        inClass = 'pt-page-scaleUpDown pt-page-delay300'
        ;

    Animation.pageTransition(nextEle, currentEle, inClass, outClass);

};

Animation.register('scaledownscaleupdown', scaledownscaleupdown);

})();

