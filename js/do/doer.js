hxManager.Doer = (function( IteratorMOJO ) {


    var Object_defineProperty = Object.defineProperty;


    function Doer( hxm , master ) {

        var that = this;
        var iterators = (that.iterators = []);

        Object_defineProperty( that , 'master' , {
            get: function() {
                return master || that;
            }
        });

        Object_defineProperty( that , 'hxm' , {
            get: function() {
                return hxm;
            }
        });

        Object_defineProperty( that , 'complete' , {
            get: function() {
                for (var i = 0; i < iterators.length; i++) {
                    if (!iterators[i].complete) {
                        return false;
                    }
                }
                return true;
            }
        });
    }

    Doer.prototype = {

        get: function( a , b ) {

            var that = this;
            var hxm = that.hxm;
            var subset = [];

            a = a || 0;
            b = (b !== undefined ? b : a) + 1;

            if (a < 0 || b > hxm.length || b <= a) {
                throw new RangeError( 'Subset out of range' );
            }

            for (var i = a; i < b; i++) {
                subset.push( hxm[i] );
            }

            subset = $(subset);

            return new Doer(
                new hxManager( subset ) , that.master
            );
        },

        do: function( seed ) {

            var that = this;
            var master = that.master;
            var it = new IteratorMOJO( that.hxm , seed );

            it.when( 'complete' , function( e ) {
                master._check();
            });

            master.iterators.push( it );

            return that;
        },

        run: function() {

            var master = this.master;

            master.iterators.forEach(function( it ) {
                it.run();
            });
        },

        calculate: function( percent ) {

            var master = this.master;

            master.iterators.forEach(function( it ) {
                it.calculate( percent );
            });
        },

        destroy: function() {

            var master = this.master;

            master.iterators.forEach(function( it ) {
                it.destroy();
            });
        },

        _check: function() {

            var master = this.master;
            
            if (master.complete) {
                /*master.iterators.forEach(function( it ) {
                    it.final();
                });*/
                master.resolve();
            }
        }
    };


    return Doer;

    
}( hxManager.IteratorMOJO ));




























