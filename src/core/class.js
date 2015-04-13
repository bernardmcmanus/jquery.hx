import { $_is } from 'core/util';

export default function $Class( constructor ) {
	return {
		inherits: function() {
			var args = Array.$cast( arguments );
			var target = $_is( args.$last , 'object' ) ? args.pop() : {};
			var prototypes = args.map(function( constructor ) { return getPrototype( constructor ); });
			var proto = $.extend.apply( null , [ {} ].concat( prototypes , target ));
			var $new = proto._new || function(){};
			delete proto._new;
			proto.constructor = constructor;
			constructor.prototype = proto;
			constructor.$new = function() {
				var args = Array.$cast( arguments );
				var instance = args.shift();
				$new.apply( instance , args );
				return instance;
			};
		}
	};
}

export function getPrototype( subject ) {
	return $_is( subject , 'function' ) ? subject.prototype : Object.getPrototypeOf( subject );
}
