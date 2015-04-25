hxManager.Helper = (function( Function , Object , Array , isNaN ) {


    var UNDEFINED;
    var NULL = null;
    var PROTOTYPE = 'prototype';
    var CALL = 'call';


    function compareArray( subject , array ) {
        
        if (!subject || !array) {
            return false;
        }

        if (length( subject ) != length( array )) {
            return false;
        }

        for (var i = 0, l = length( subject ); i < l; i++) {
            if (isArr( subject[i] ) && isArr( array[i] )) {
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


    function length( subject ) {
        return subject.length;
    }


    function isArr( subject ) {
        return instOf( subject , Array );
    }


    function instOf( subject , constructor ) {
        return (subject instanceof constructor);
    }


    function is( subject , type ) {
        return typeof subject === type;
    }


    function treeSearch( branch , find ) {
        for (var key in branch) {
            if (key === find) {
                return branch[key];
            }
            else if (find in branch[key]) {
                return treeSearch( branch[key] , find );
            }
        }
    }


    return {

        NULL: NULL,

        PROTOTYPE: PROTOTYPE,

        compareArray: compareArray,

        ensureArray: function( subject ) {
            return (isArr( subject ) ? subject : [ subject ]);
        },

        length: length,

        shift: function( subject ) {
            return Array[ PROTOTYPE ].shift[ CALL ]( subject );
        },

        pop: function( subject ) {
            return Array[ PROTOTYPE ].pop[ CALL ]( subject );
        },

        descriptor: function( getter , setter ) {
            return {
                get: getter,
                set: setter
            };
        },

        indexOf: function( subject , search ) {
            return subject.indexOf( search );
        },

        keys: function( subject ) {
            return Object.keys( subject );
        },

        create: function( subject ) {
            return Object.create( subject );
        },

        defProp: function( subject , name , descriptor ) {
            Object.defineProperty( subject , name , descriptor );
        },

        defProps: function( subject , props ) {
            Object.defineProperties( subject , props );
        },

        has: function( subject , key ) {
            return subject.hasOwnProperty( key );
        },

        is: is,

        del: function( subject , key ) {
            delete subject[key];
        },

        instOf: instOf,

        isFunc: function( subject ) {
            return instOf( subject , Function );
        },

        isObj: function( subject , strict ) {
            return strict ? instOf( subject , Object ) : is( subject , 'object' );
        },

        isArr: isArr,

        isNum: function( subject ) {
            return !isNaN( subject * 1 );
        },

        isNull: function( subject ) {
            return subject === NULL;
        },

        isUndef: function( subject ) {
            return subject === UNDEFINED;
        },

        test: function( subject , testval ) {
            return subject.test( testval );
        },

        treeSearch: treeSearch
    };


}( Function , Object , Array , isNaN ));























