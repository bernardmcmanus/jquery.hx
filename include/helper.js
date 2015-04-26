(function( window , Object , Array ) {

	var PROTOTYPE = 'prototype';

	Array.$cast = function( subject ) {
		return Array[ PROTOTYPE ].slice.call( subject , 0 );
	};

	Array.$ensure = function( subject ) {
		return (Array.isArray( subject ) ? subject : ( subject !== undefined ? [ subject ] : [] ));
	};

	Object.defineProperties( Array[ PROTOTYPE ] , {
		$unique: {
			value: function() {
				var that = this;
				return that.filter(function( element , i ) {
					return that.indexOf( element ) === i;
				});
			}
		},
		$contains: {
			value: function( lookFor ) {
				lookFor = Array.$ensure( lookFor );
				return !!this.reduce(function( prev , current ) {
					return prev + lookFor.indexOf( current ) < 0 ? 0 : 1;
				},0);
			}
		},
		$last: {
			get: function() { return this.slice( -1 )[0] }
		}
	});

	Object.$build = function( key , val ) {
		var object = {};
		object[key] = val;
		return object;
	};

	Object.defineProperties( Object[ PROTOTYPE ] , {
		$keys: {
			get: function() { return Object.keys( this ) }
		},
		$each: {
			value: function( iterator ) {
				var that = this;
				that.$keys.forEach(function( key ) {
					iterator( key , that[key] );
				});
				return that;
			}
		},
		/*$map: {
			value: function( iterator ) {
				var that = this;
				var object = new that.constructor();
				function modify( key , val ) { object[key] = val; }
				that.$keys.forEach(function( key ) {
					iterator( key , that[key] , modify );
				});
				return object;
			}
		},*/
		$fetch: {
			value: function( key , otherwise ) {
				var that = this;
				return key in that ? that[key] : otherwise;
			}
		}
	});

}( window , Object , Array ));
