module.exports = function( grunt ) {

  var CWD = process.cwd();

  var cp = require( 'child_process' );
  var path = require( 'path' );
  var fs = require( 'fs-extra' );
  var colors = require( 'colors' );
  var Promise = require( 'es6-promise' ).Promise;

  grunt.task.registerMultiTask( 'release-describe' , 'describe build size / minified size.' , function() {
    var that = this;
    var done = that.async();
    var data = grunt.task.normalizeMultiTaskFiles( that.data )[0];
    var options = that.data.options || {};
    var src = path.join( CWD , data.src[0] );
    var dest = path.join( CWD , data.dest );
    var gz = dest + '.gz';
    new Promise(function( resolve , reject ) {
      var proc = cp.spawn( 'gzip' , [ '--keep' , dest ]);
      proc.on( 'close' , function() {
        fs.stat( gz , function( err , stats ) {
          if (err) {
            reject();
          }
          else {
            fs.removeSync( gz );
            resolve( stats.size );
          }
        });
      });
    })
    .catch(function() {
      return false;
    })
    .then(function( bytesGzip ) {
      var bytesInit = fs.statSync( src ).size;
      var bytesFinal = fs.statSync( dest ).size;
      var kbInit = Math.round( bytesInit / 10 ) / 100;
      var kbFinal = Math.round( bytesFinal / 10 ) / 100;
      var kbGzip = bytesGzip ? (Math.round( bytesGzip / 10 ) / 100) : 0;
      var msg = 'File ' + path.basename( dest ).cyan + ' created: ' + (kbInit + ' kB').green + ' \u2192 ' + (kbFinal + ' kB').green;
      if (kbGzip) {
        msg += (' (' + kbGzip + ' kB gzipped)').magenta;
      }
      console.log( msg );
      done();
    });
  });
};
