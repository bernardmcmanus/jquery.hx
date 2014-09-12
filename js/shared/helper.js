hxManager.Helper = (function() {


    return {

        compareArray: function( subject , array ) {

            var Helper = hxManager.Helper;
            
            if (!subject || !array) {
                return false;
            }

            if (Helper.length( subject ) != Helper.length( array )) {
                return false;
            }

            for (var i = 0, l = Helper.length( subject ); i < l; i++) {
                if (Helper.isArr( subject[i] ) && Helper.isArr( array[i] )) {
                    if (!Helper.compareArray( subject[i] , array[i] )) {
                        return false;
                    }
                }
                else if (subject[i] !== array[i]) {
                    return false;
                }
            }

            return true;
        },

        ensureArray: function( subject ) {
            return (Array.isArray( subject ) ? subject : [ subject ]);
        },

        length: function( subject ) {
            return subject.length;
        },

        shift: function( subject ) {
            return Array.prototype.shift.call( subject );
        },

        pop: function( subject ) {
            return Array.prototype.pop.call( subject );
        },

        descriptor: function( getter , setter ) {
            return {
                get: getter,
                set: setter
            };
        },

        has: function( subject , key ) {
            return subject.hasOwnProperty( key );
        },

        del: function( subject , key ) {
            delete subject[key];
        },

        instOf: function( subject , constructor ) {
            return (subject instanceof constructor);
        },

        isFunc: function( subject ) {
            return hxManager.Helper.instOf( subject , Function );
        },

        isArr: function( subject ) {
            return hxManager.Helper.instOf( subject , Array );
        },

        isNull: function( subject ) {
            return subject === null;
        },

        isUndef: function( subject ) {
            return subject === undefined;
        },

        test: function( subject , testval ) {
            return subject.test( testval );
        },

        treeSearch: function( branch , find ) {
            for (var key in branch) {
                if (key === find) {
                    return branch[key];
                }
                else if (find in branch[key]) {
                    return hxManager.Helper.treeSearch( branch[key] , find );
                }
            }
        }
    };

}());























