(function( window , hx , When , Get , Animator ) {


    var bean = function( action ) {
        
        var data = _getBeanData( action );
        $.extend( this , data );

        var whenModule = new When();
        this.when = whenModule.when.bind( whenModule );
        this.happen = whenModule.happen.bind( whenModule );
    };


    bean.prototype = {
        
        setValue: function( value ) {
            this.value = value;
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

        hasAnimator: function() {
            return (typeof this.animator !== 'undefined');
        },

        getData: function( property ) {
            return this[property];
        }
    };


    function _getBeanData( action ) {

        var xform = Get.xformKeys( action );
        var options = Get.xformOptions( action );
        var raw = Get.rawComponents( xform.mapped );
        var defs = Get.xformDefaults( raw );

        return {
            type: action.type,
            xform: xform,
            options: options,
            raw: raw,
            defaults: defs
        };
    }


    function onComplete() {
        this.happen( 'complete' , [ this ] );
    }


    $.extend( hx , {bean: bean} );

    
}( window , hxManager , hxManager.when , hxManager.get , hxManager.animator ));



























