define(function(require){

var undef = void 0;
var $ = require('zepto');

var SettingsUtilsInterface = {

    _getSettings: function(dataKey, jsonKey, $el){
        var me = this, $el = $el || me.$el, data = {},
            value = $el.data(dataKey);

        value !== undef && ( data[jsonKey] = value );
        return data;
    }

    , _setSettings: function(opt, dataKey, jsonKey, $el){
        if(!opt) return;
        $el = $el || this.$el;
        opt[jsonKey] !== undef && $el.data(dataKey, opt[jsonKey]);
    }

    , _applySettings: function(opt, cssKey, jsonKey, $el){
        if(Utils.isEmpty(opt) || Utils.isEmpty(opt[jsonKey])) return;
        $el = $el || this.$el;
        $el.css(cssKey, opt[jsonKey]);
        this['_set' + jsonKey.replace(/^\w/, function($0){return $0.toUpperCase();})](opt, $el);
    }

};

return SettingsUtilsInterface;

});
