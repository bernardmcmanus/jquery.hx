module.exports = function( grunt ) {

  var CWD = process.cwd();

  var path = require( 'path' );
  var fs = require( 'fs-extra' );
  var colors = require( 'colors' );

  grunt.task.registerMultiTask( 'release-describe' , 'describe build size / minified size.' , function() {
    var that = this;
    var data = grunt.task.normalizeMultiTaskFiles( that.data )[0];
    var options = that.data.options || {};
    var src = path.join( CWD , data.src[0] );
    var dest = path.join( CWD , data.dest );
    var bytesInit = fs.statSync( src ).size;
    var bytesFinal = fs.statSync( dest ).size;
    var kbInit = Math.round( bytesInit / 10 ) / 100;
    var kbFinal = Math.round( bytesFinal / 10 ) / 100;
    console.log('File ' + path.basename( dest ).cyan + ' created: ' + (kbInit + ' kB').green + ' \u2192 ' + (kbFinal + ' kB').green);
  });
};
