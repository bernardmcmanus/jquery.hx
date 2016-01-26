var exports = module.exports;

function keys( subject ) {
    return Object.keys( subject );
}

function each( subject , cb ){
  if (isArr( subject )) {
    for (var i = 0; i < length( subject ); i++) {
      cb( subject[i] , i );
    }
  }
  else if (is( subject , 'object' )) {
    each(keys( subject ), function( key ){
      cb( subject[key] , key );
    });
  }
  else if (subject) {
    cb( subject , 0 );
  }
  return subject;
}

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

exports.keys = keys;
exports.each = each;
exports.compareArray = compareArray;
exports.length = length;
exports.isArr = isArr;
exports.instOf = instOf;
exports.is = is;
exports.treeSearch = treeSearch;

exports.ensureArray = function( subject ) {
    return (isArr( subject ) ? subject : [ subject ]);
};

exports.shift = function( subject ) {
    return Array.prototype.shift.call( subject );
};

exports.pop = function( subject ) {
    return Array.prototype.pop.call( subject );
};

exports.descriptor = function( getter , setter ) {
    return { get: getter, set: setter };
};

exports.indexOf = function( subject , search ) {
    return subject.indexOf( search );
};

exports.create = function( subject ) {
    return Object.create( subject );
};

exports.defProp = function( subject , name , descriptor ) {
    Object.defineProperty( subject , name , descriptor );
};

exports.defProps = function( subject , props ) {
    Object.defineProperties( subject , props );
};

exports.has = function( subject , key ) {
    return subject.hasOwnProperty( key );
};

exports.del = function( subject , key ) {
    delete subject[key];
};

exports.isFunc = function( subject ) {
    return instOf( subject , Function );
};

exports.isObj = function( subject , strict ) {
    return strict ? instOf( subject , Object ) : is( subject , 'object' );
};

exports.isNum = function( subject ) {
    return !isNaN( subject * 1 );
};

exports.isNull = function( subject ) {
    return subject === null;
};

exports.isUndef = function( subject ) {
    return is( subject , 'undefined' );
};

exports.test = function( subject , testval ) {
    return subject.test( testval );
};
