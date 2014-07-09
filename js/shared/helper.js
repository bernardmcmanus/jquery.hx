hxManager.Helper = (function() {
    

    function compareArray( subject , array ) {
        
        if (!subject || !array) {
            return false;
        }

        if (subject.length != array.length) {
            return false;
        }

        for (var i = 0, l = subject.length; i < l; i++) {
            if (subject[i] instanceof Array && array[i] instanceof Array) {
                if (!compareArray( subject[i] , array[i] )) {
                    return false;
                }
            }
            else if (subject[i] !== array[i]) {
                return false;
            }
        }

        return true;
    }


    return {
        compareArray: compareArray
    };


}());























