(function( window , hx ) {


    var helper = {};


    helper.array = {

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


    helper.object = {

        each: function( subject , iterator , context ) {

            if (!subject) {
                return;
            }

            if (!iterator) {
                throw 'Error: you must pass an iterator function to hxManager.helper.object.each';
            }

            context = context || window;

            var i = 0;
            for (var key in subject) {
                iterator.call( context , subject[key] , key , i );
                i++;
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

            var size = 0;

            for (var key in subject) {
                size++;
            }

            return size;
        }

    };

    
    $.extend( hx , {helper: helper} );


}( window , hxManager ));























