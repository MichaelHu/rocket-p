(function(){

function rotatefoldmovefadeLR(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-rotateFoldLeft', 
        inClass = 'pt-page-moveFromRightFade'
        ;

    if(2 == dir){
        outClass = 'pt-page-rotateFoldRight'; 
        inClass = 'pt-page-moveFromLeftFade';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass);

};

Animation.register('rotatefoldmovefadeLR', rotatefoldmovefadeLR);

})();


