var ReleaseOnlyButtonSubView = TextSubView.extend({

    init: function(options){
        var me = this;
        
        options || (options = {});

        // Parent method first
        me._super(options);

        me.viewClass = 'ReleaseOnlyButtonSubView';
        if(!me._isSetup){
            me.$text.html('仅发布模式可见');
        }

        // Hidden in partial edit mode 
        if(me._isPartialEdit){
            me.$el.hide();
        } 
    }

});

