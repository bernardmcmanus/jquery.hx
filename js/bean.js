(function( window , hx , When , Get , Animator ) {


    var bean = function( seed ) {
        
        var data = _getBeanData( seed );
        $.extend( this , data );

        // create the when module
        When( this );
    };


    bean.prototype = {
        
        setValue: function( value ) {
            this.value = value;
        },

        isComplete: function() {
            if (this.hasAnimator()) {
                return !this.animator.isRunning();
            }
            return false;
        },

        createAnimator: function( options ) {

            if (!this.hasAnimator()) {
                
                $.extend( options , this.options );
                this.animator = new Animator( options );

                this.animator.when( 'complete' , onComplete , this );
            }
        },

        startAnimator: function() {
            if (this.hasAnimator() && !this.animator.isRunning()) {
                this.animator.start();
            }
        },

        complete: function() {
            if (this.hasAnimator() && !this.isComplete()) {
                this.animator.destroy();
            }
        },

        hasAnimator: function() {
            return (typeof this.animator !== 'undefined');
        },

        getData: function( property ) {

            var data = null;

            switch (property) {

                case 'done':
                    data = (this.hasAnimator() ? this.animator.done : function() {});
                break;

                default:
                    data = this[property];
                break;
            }

            return data;
        }
    };


    function _getBeanData( seed ) {

        var xform = Get.xformKeys( seed );
        var options = Get.xformOptions( seed );
        var raw = Get.rawComponents( xform.mapped );
        var defs = Get.xformDefaults( raw );
        var rules = Get.updateRules( xform.mapped , raw );

        return {
            type: seed.type,
            xform: xform,
            options: options,
            raw: raw,
            defaults: defs,
            rules: rules
        };
    }


    function onComplete() {
        this.happen( 'complete' , [ this ] );
    }


    $.extend( hx , {bean: bean} );

    
}( window , hxManager , hxManager.when , hxManager.get , hxManager.animator ));



























