define(function(require){

var undef = void 0;
var $ = require('zepto');
var SettingsUtilsInterface = require('settingsutilsinterface');

var CommonSettingsInterface = {

    _setFontSize: function(opt){
        this._setSettings(opt, 'text_font_size', 'fontSize');
    }

    , _setLineHeight: function(opt){
        this._setSettings(opt, 'text_line_height', 'lineHeight');
    }

    , _setColor: function(opt){
        this._setSettings(opt, 'text_color', 'color');
    }

    , _setTextAlign: function(opt){
        this._setSettings(opt, 'text_align', 'textAlign');
    }

    , _setBackgroundColor: function(opt){
        this._setSettings(opt, 'background_color', 'backgroundColor');
    }

    , _setBackgroundImage: function(opt){
        this._setSettings(opt, 'background_image', 'backgroundImage');
    }

    , _setBackgroundPosition: function(opt){
        this._setSettings(opt, 'background_position', 'backgroundPosition');
    }

    , _setBackgroundRepeat: function(opt){
        this._setSettings(opt, 'background_repeat', 'backgroundRepeat');
    }





    , _getFontSize: function(){
        return this._getSettings('text_font_size', 'fontSize');
    }

    , _getLineHeight: function(){
        return this._getSettings('text_line_height', 'lineHeight');
    }

    , _getColor: function(){
        return this._getSettings('text_color', 'color');
    }

    , _getTextAlign: function(){
        return this._getSettings('text_align', 'textAlign');
    }

    , _getBackgroundColor: function(opt){
        return this._getSettings(opt, 'background_color', 'backgroundColor');
    }

    , _getBackgroundImage: function(opt){
        return this._getSettings(opt, 'background_image', 'backgroundImage');
    }

    , _getBackgroundPosition: function(opt){
        return this._getSettings(opt, 'background_position', 'backgroundPosition');
    }

    , _getBackgroundRepeat: function(opt){
        return this._getSettings(opt, 'background_repeat', 'backgroundRepeat');
    }



    
    , _applyFontSize: function(opt){
        this._applySettings(opt, 'font-size', 'fontSize');
    }

    , _applyLineHeight: function(opt){
        this._applySettings(opt, 'line-height', 'lineHeight');
    }

    , _applyColor: function(opt){
        this._applySettings(opt, 'color', 'color');
    }

    , _applyTextAlign: function(opt){
        this._applySettings(opt, 'text-align', 'textAlign');
    }

    , _applyBackgroundColor: function(opt){
        this._applySettings(opt, 'background_color', 'backgroundColor');
    }

    , _applyBackgroundImage: function(opt){
        this._applySettings(opt, 'background_image', 'backgroundImage');
    }

    , _applyBackgroundPosition: function(opt){
        this._applySettings(opt, 'background_position', 'backgroundPosition');
    }

    , _applyBackgroundRepeat: function(opt){
        this._applySettings(opt, 'background_repeat', 'backgroundRepeat');
    }

};

$.extend(CommonSettingsInterface, SettingsUtilsInterface);

return CommonSettingsInterface;

});
