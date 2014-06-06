(function( window , hx , Helper ) {


    var EACH = Helper.object.each;
    var ODP = Object.defineProperty;


    function KeyMap( master ) {

        master = (master instanceof KeyMap ? master.export() : master);

        var family = Array.isArray( master ) ? 'array' : 'object';

        //master = $.extend( new _empty( family ) , master );

        // EACH( arguments , function( val ) {
        //     val = (val instanceof KeyMap ? val.export() : val);
        //     master = $.extend( new _empty( family ) , val , master );
        // });

        /*ODP( this , 'master' , {
            get: function() {
                return master;
            },
            set: function( value ) {
                master = value;
            }
        });*/

        ODP( this , 'family' , {
            get: function() {
                return family;
            },
            set: function( value ) {
                if (value !== 'array' && value !== 'object') {
                    throw new Error( 'invalid family' );
                }
                family = value;
            }
        });

        ODP( this , 'length' , {
            get: function() {
                return this.keys().length;
            }
        });

        $.extend( this , master );
    }


    KeyMap.prototype = {

        cast: function( deep ) {

            deep = (typeof deep !== 'undefined' ? deep : false);

            this.each(function( val , key ) {

                if (!(val instanceof KeyMap) && typeof val === 'object') {
                    this[key] = new KeyMap( val );
                }

                if (deep && typeof val === 'object') {
                    this[key].cast( true );
                }
            });

            return this;
        },

        merge: function() {

            EACH( arguments , function( extender ) {
                EACH( extender , function( val , key ) {
                    this[key] = (typeof this[key] !== 'undefined' ? this[key] : val);
                } , this );
            } , this );

            this._update();

            return this;
        },

        /*
        **  scrub
        **  removes any properties with keys
        **  that ARE NOT in the template
        */

        scrub: function( template ) {
            clean( this , template , 'scrub' );
            this._update();
            return this;
        },

        /*
        **  subtract
        **  removes any properties with keys
        **  that ARE in the template
        */

        subtract: function( template ) {
            clean( this , template , 'subtract' );
            this._update();
            return this;
        },

        unique: function() {

            if (this.family !== 'array') {
                return this;
            }

            var val, j, k, unique = this.export();

            for (var i = 0; i < unique.length; i++) {
                val = unique[i];
                j = unique.indexOf( val );
                k = unique.lastIndexOf( val );
                if (k >= 0 && j !== k) {
                    delete unique[k];
                    i--;
                }
            }

            this.wipe();
            $.extend( this , unique );
            this._update();

            return this;
        },

        compare: function( compareTo ) {

            if (!compareTo) {
                return false;
            }

            var output = this.clone().cast( true );

            output.each(function( val , key ) {
                if (val instanceof KeyMap) {
                    this[key] = val.compare( compareTo[key] );
                }
                else {
                    this[key] = (compareTo[key] === val);
                }
            });

            return output;
        },

        mapTo: function( template ) {
            map( this , template , 'mapTo' );
            this._update();
            return this;
        },

        mapFrom: function( template ) {
            map( this , template , 'mapFrom' );
            this._update();
            return this;
        },

        wipe: function() {
            this.each(function( val , key ) {
                delete this[key];
            });
            return this;
        },

        clone: function() {
            return new KeyMap(
                this.export()
            );
            /*.setMaster(
                this.getMaster()
            );*/
        },

        export: function() {

            var subject = (typeof arguments[0] === 'object' ? arguments[0] : this);
            var as = (arguments.length === 2 ? arguments[1] : (typeof arguments[0] === 'string' ? arguments[0] : this.family));
            
            var output = new _empty( as );
            return _export( subject , output );
        },

        /*setMaster: function( master ) {
            master = master || this.export();
            this.master = master;
            return this;
        },*/

        /*getMaster: function() {
            var family = Array.isArray( this.master ) ? 'array' : 'object';
            var output = new _empty( family );
            return _export( this.master , output );
        },*/

        invert: function() {
            this.each(function( val , key ) {
                delete this[key];
                this[val] = key;
            });
            this._update();
            return this;
        },

        /*revert: function() {
            this.wipe();
            $.extend( this , this.getMaster() );
            this._update();
            return this;
        },*/

        each: function( iterator ) {
            EACH( this , iterator , this );
            return this;
        },

        keys: function() {
            return Object.keys( this );
        },

        hasAlphaKeys: function() {
            var keyString = this.keys().join( '' );
            return (/[\D]/).test( keyString );
        },

        isSequential: function() {
            var lastKey = parseInt( this.keys().pop() , 10 );
            return lastKey === (this.length - 1);
        },

        isArray: function() {
            return (!this.hasAlphaKeys() && this.isSequential());
        },

        _update: function() {

            if (this.family === 'object' && this.isArray()) {
                this.family = 'array';
            }

            this._normalize();
        },

        _normalize: function() {

            if (this.family !== 'array' || this.isArray()) {
                return;
            }

            this.each(function( val , key , i ) {
                delete this[key];
                this[i] = val;
            });
        }
    };


    function _export( subject , output ) {
        EACH( subject , function( val , key ) {
            output[key] = (val instanceof KeyMap ? val.export() : val);
        });
        return output;
    }


    function _empty( family ) {
        return (family === 'array' ? [] : {});
    }


    function clean( keyMap , template , method ) {

        if (!Array.isArray( template )) {
            throw new TypeError( method + ' template must be an array.' );
        }

        keyMap.each(function( val , key ) {

            switch (keyMap.family) {

                case 'array':
                    if (method === 'scrub' && template.indexOf( val ) < 0) {
                        delete this[key];
                    }
                    if (method === 'subtract' && template.indexOf( val ) >= 0) {
                        delete this[key];
                    }
                break;

                case 'object':
                    if (method === 'scrub' && template.indexOf( key ) < 0) {
                        delete this[key];
                    }
                    if (method === 'subtract' && template.indexOf( key ) >= 0) {
                        delete this[key];
                    }
                break;
            }
        });
    }


    function map( keyMap , template , method ) {

        if (typeof template !== 'object' || Array.isArray( template )) {
            throw new TypeError( method + ' template must be an object.' );
        }

        // invert the template if this is mapFrom
        if (method === 'mapFrom') {
            template = new KeyMap( template ).invert().export();
        }

        keyMap.each(function( val , key ) {

            switch (keyMap.family) {

                case 'array':
                    if (method === 'mapFrom') {
                        delete this[key];
                        this[template[key]] = val;
                    }
                    else if (method === 'mapTo') {
                        if (typeof template[val] !== 'undefined') {
                            this[key] = template[val];
                        }
                    }
                break;

                case 'object':
                    if (typeof template[key] !== 'undefined') {
                        delete this[key];
                        this[template[key]] = val;
                    }
                break;
            }
        });

        if (keyMap.family === 'array' && keyMap.hasAlphaKeys()) {
            keyMap.family = 'object';
        }
        else if (keyMap.family === 'object' && keyMap.isArray()) {
            keyMap.family = 'array';
        }
    }


    $.extend( hx , { KeyMap : KeyMap });

    
}( window , hxManager , hxManager.Helper ));



























