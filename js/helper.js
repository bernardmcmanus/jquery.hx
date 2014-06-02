(function( window , hx ) {


    var Helper = {};
    var type = 'type';
    var name = 'name';
    var array = 'array';
    var object = 'object';


    Helper[array] = {};
    Helper[object] = {};


    function compare( subject , array ) {
        
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
    }
    compare[type] = array;
    Helper[compare[type]][compare[name]] = compare;


    function last( subject , value ) {

        var L = subject.length > 0 ? subject.length - 1 : 0;

        if (typeof value !== 'undefined') {
            subject[L] = value;
        }

        return subject[L];
    }
    last[type] = array;
    Helper[last[type]][last[name]] = last;


    function each( subject , iterator , context ) {

        if (!subject || !iterator) {
            return;
        }

        context = context || window;

        var keys = Object.keys( subject );

        for (var i = 0; i < keys.length; i++) {
            iterator.call( context , subject[keys[i]] , keys[i] , i );
        }
    }
    each[type] = object;
    Helper[each[type]][each[name]] = each;


    function getOrder( subject ) {
        var a = [];
        for (var key in subject) {
            a.push( key );
        }
        return a;
    }
    getOrder[type] = object;
    Helper[getOrder[type]][getOrder[name]] = getOrder;


    function size( subject ) {

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

        /*var size = 0;

        for (var key in subject) {
            size++;
        }

        return size;*/
    }
    size[type] = object;
    Helper[size[type]][size[name]] = size;

    
    $.extend( hx , { Helper : Helper });


}( window , hxManager ));























