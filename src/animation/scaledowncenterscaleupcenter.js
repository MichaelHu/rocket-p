(function(){

function scaledowncenterscaleupcenter(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-scaleDownCenter', 
        inClass = 'pt-page-scaleUpCenter pt-page-delay400'
        ;

    Animation.pageTransition(nextEle, currentEle, inClass, outClass);

};

Animation.register('scaledowncenterscaleupcenter', scaledowncenterscaleupcenter);

})();

