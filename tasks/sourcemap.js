module.exports = function( grunt ) {

  var CWD = process.cwd();

  var fs = require( 'fs-extra' );
  var path = require( 'path' );

  grunt.task.registerMultiTask( 'sourcemap' , 'copy sourcemap to dist directory and append url to the transpiled build' , function() {
    var that = this;
    var data = that.data;
    var buildSrc = path.join( CWD , data.src );
    var buildDest = path.join( CWD , data.dest );
    var mapSrc = path.join( CWD , grunt.config.get( 'pkg.config.build.map' ));
    var mapDest = buildDest + '.map';
    // copy the sourcemap to its destination
    fs.copySync( mapSrc , mapDest );
    // append sourcemap-string to the transpiled build
    fs.appendFileSync( buildDest , grunt.option( 'sourcemap-string' ));
  });
};
