define(function(require){

var $ = require('zepto');

// Disable scrolling

$(document).on('touchmove', function(e){
    e.preventDefault();
});

});
