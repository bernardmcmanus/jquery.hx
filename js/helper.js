hxManager.Helper = (function() {


    var Helper = {

        compareArray: function ( subject , array ) {
            
            if (!subject || !array) {
                return false;
            }

            if (subject.length != array.length) {
                return false;
            }

            for (var i = 0, l = subject.length; i < l; i++) {
                if (subject[i] instanceof Array && array[i] instanceof Array) {
                    if (!Helper.compareArray( subject[i] , array[i] )) {
                        return false;
                    }
                }
                else if (subject[i] != array[i]) {
                    return false;
                }
            }

            return true;
        },

        each: function( subject , iterator ) {

            var keys = Object.keys( subject );
            
            for (var i = 0; i < keys.length; i++) {
                iterator( subject[keys[i]] , keys[i] , i );
            }
        }
    };


    return Helper;


}());























