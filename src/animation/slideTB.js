(function(){

function slideTB(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-moveToTop', 
        inClass = 'pt-page-moveFromBottom'
        ;

    if(2 == dir){
        outClass = 'pt-page-moveToBottom'; 
        inClass = 'pt-page-moveFromTop';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass);

};

Animation.register('slideTB', slideTB);

})();

