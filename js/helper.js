(function( window , hx ) {


    var Helper = {};


    Helper.array = {

        compare: function ( subject , array ) {
            
            if (!subject || !array) {
                return false;
            }

            if (subject.length != array.length) {
                return false;
            }

            for (var i = 0, l = subject.length; i < l; i++) {
                if (subject[i] instanceof Array && array[i] instanceof Array) {
                    if (!subject[i].compare( array[i] )) {
                        return false;
                    }
                }
                else if (subject[i] != array[i]) {
                    return false;
                }
            }

            return true;
        },

        last: function( subject , value ) {

            var L = subject.length > 0 ? subject.length - 1 : 0;

            if (typeof value !== 'undefined') {
                subject[L] = value;
            }

            return subject[L];
        }

    };


    Helper.object = {

        each: function( subject , iterator , context ) {

            if (!subject || !iterator) {
                return;
            }

            context = context || window;

            var keys = Object.keys( subject );

            for (var i = 0; i < keys.length; i++) {
                iterator.call( context , subject[keys[i]] , keys[i] , i );
            }
        },

        getOrder: function( subject ) {
            var a = [];
            for (var key in subject) {
                a.push( key );
            }
            return a;
        },

        size: function( subject ) {

            if (typeof subject !== 'object') {
                return 0;
            }

            var dataTypes = [ Boolean , Number , String ];

            for (var i = 0; i < dataTypes.length; i++) {
                if (subject instanceof dataTypes[i]) {
                    return 0;
                }
            }

            return Object.keys( subject ).length;
        }

    };

    
    $.extend( hx , { Helper : Helper });


}( window , hxManager ));























