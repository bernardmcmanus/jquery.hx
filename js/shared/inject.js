hxManager.Inject = (function( hxManager ) {


    var Helper = hxManager.Helper;
    var pop = Helper.pop;
    var has = Helper.has;
    var is = Helper.is;


    function Inject() {

        var that = this;
        var args = arguments;
        var callback = pop( args );
        var imports = pop( args ) || parse( callback );

        imports = imports.map(function( subject ) {
            
            var out;

            if (is( subject , 'string' )) {
                if (has( Helper , subject )) {
                    out = Helper[subject];
                }
                else {
                    out = hxManager[subject];
                }
            }
            else {
                out = subject;
            }

            return out;
        });

        return callback.apply( null , imports );
    }


    Inject.parse = parse;


    function parse( func ) {
        return (/\((.*?)\)/)
            .exec( func.toString() )
            .pop()
            .replace( /(\s|(\/\*)(.*?)(\*\/))/g , '' )
            .split( ',' );
    }


    return Inject;


}( hxManager ));
