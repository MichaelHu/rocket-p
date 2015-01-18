define(function(require){

var undef = void 0;
var $ = require('zepto');

var SettingsUtilsInterface = {

    _getSettings: function(dataKey, jsonKey){
        var me = this, $el = me.$el, data = {},
            value = $el.data(dataKey);

        value !== undef && ( data[jsonKey] = value );
        return data;
    }

    , _setSettings: function(opt, dataKey, jsonKey){
        if(!opt) return;
        opt[jsonKey] !== undef && this.$el.data(dataKey, opt[jsonKey]);
    }

    , _applySettings: function(opt, cssKey, jsonKey){
        if(Utils.isEmpty(opt) || Utils.isEmpty(opt[jsonKey])) return;
        this.$el.css(cssKey, opt[jsonKey]);
        this['_set' + jsonKey.replace(/^\w/, function($0){return $0.toUpperCase();})](opt);
    }

};

return SettingsUtilsInterface;

});
