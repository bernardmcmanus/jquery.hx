/*jshint -W061 */
hxManager.Inject = (function( window , hxManager ) {


    var Helper = hxManager.Helper;


    function Inject() {
        
        var that = this;
        var args = arguments;
        var callback = Helper.pop( args );
        var imports = Helper.pop( args ) || parse( callback );

        imports = imports.map(function( subject ) {
            
            var func;

            if (typeof subject === 'string') {
                
                if (Helper.has( Helper , subject )) {
                    func = Helper[subject];
                }
                else {
                    func = hxManager[subject];
                }

                eval( 'var ' + subject + ' = ' + func.toString() );
                return eval( subject );
            }
            else {
                return subject;
            }
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


}( window , hxManager ));























