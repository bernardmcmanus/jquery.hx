hxManager.Helper = (function( Function , Object , Array ) {


    var T = true;
    var F = false;
    var UNDEFINED;
    var NULL = null;
    var Array_prototype = Array.prototype;


    function compareArray( subject , array ) {
        
        if (!subject || !array) {
            return F;
        }

        if (length( subject ) != length( array )) {
            return F;
        }

        for (var i = 0, l = length( subject ); i < l; i++) {
            if (isArr( subject[i] ) && isArr( array[i] )) {
                if (!compareArray( subject[i] , array[i] )) {
                    return F;
                }
            }
            else if (subject[i] !== array[i]) {
                return F;
            }
        }

        return T;
    }


    function ensureArray( subject ) {
        return (isArr( subject ) ? subject : [ subject ]);
    }


    function length( subject ) {
        return subject.length;
    }


    function shift( subject ) {
        return Array_prototype.shift.call( subject );
    }


    function pop( subject ) {
        return Array_prototype.pop.call( subject );
    }


    function descriptor( getter , setter ) {
        return {
            get: getter,
            set: setter
        };
    }


    function del( subject , key ) {
        delete subject[key];
    }


    function instOf( subject , constructor ) {
        return (subject instanceof constructor);
    }


    function isFunc( subject ) {
        return instOf( subject , Function );
    }


    function isObj( subject ) {
        return instOf( subject , Object );
    }


    function isArr( subject ) {
        return instOf( subject , Array );
    }


    function isNull( subject ) {
        return subject === NULL;
    }


    function isUndef( subject ) {
        return subject === UNDEFINED;
    }


    function test( subject , testval ) {
        return subject.test( testval );
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
        compareArray: compareArray,
        ensureArray: ensureArray,
        length: length,
        shift: shift,
        pop: pop,
        descriptor: descriptor,
        del: del,
        instOf: instOf,
        isFunc: isFunc,
        isObj: isObj,
        isArr: isArr,
        isNull: isNull,
        isUndef: isUndef,
        test: test,
        treeSearch: treeSearch
    };


}( Function , Object , Array ));























