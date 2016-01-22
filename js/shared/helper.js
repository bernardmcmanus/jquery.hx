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

module.exports.keys = keys;
module.exports.each = each;
module.exports.compareArray = compareArray;
module.exports.length = length;
module.exports.isArr = isArr;
module.exports.instOf = instOf;
module.exports.is = is;
module.exports.treeSearch = treeSearch;

module.exports.ensureArray = function( subject ) {
    return (isArr( subject ) ? subject : [ subject ]);
};

module.exports.shift = function( subject ) {
    return Array.prototype.shift.call( subject );
};

module.exports.pop = function( subject ) {
    return Array.prototype.pop.call( subject );
};

module.exports.descriptor = function( getter , setter ) {
    return { get: getter, set: setter };
};

module.exports.indexOf = function( subject , search ) {
    return subject.indexOf( search );
};

module.exports.create = function( subject ) {
    return Object.create( subject );
};

module.exports.defProp = function( subject , name , descriptor ) {
    Object.defineProperty( subject , name , descriptor );
};

module.exports.defProps = function( subject , props ) {
    Object.defineProperties( subject , props );
};

module.exports.has = function( subject , key ) {
    return subject.hasOwnProperty( key );
};

module.exports.del = function( subject , key ) {
    delete subject[key];
};

module.exports.isFunc = function( subject ) {
    return instOf( subject , Function );
};

module.exports.isObj = function( subject , strict ) {
    return strict ? instOf( subject , Object ) : is( subject , 'object' );
};

module.exports.isNum = function( subject ) {
    return !isNaN( subject * 1 );
};

module.exports.isNull = function( subject ) {
    return subject === null;
};

module.exports.isUndef = function( subject ) {
    return is( subject , 'undefined' );
};

module.exports.test = function( subject , testval ) {
    return subject.test( testval );
};
