module.exports = function( grunt ) {
  var path = require( 'path' );
  var zlib = require( 'zlib' );
  var fs = require( 'fs-extra' );
  var colors = require( 'colors' );
  var Promise = require( 'bluebird' );

  grunt.task.registerMultiTask( 'release-describe' , 'print total build size / minified size / gzipped size.' , function() {
    var queue = [];
    var done = this.async();

    Promise.all(
      this.files.map(function( f ) {
        return releaseDescribe( f.src , f.dest );
      })
    )
    .then( done );

    function releaseDescribe( src , dest ) {
      return Promise.all([
        Promise.resolve().then(function() {
          var promises = src.map(function( fpath ) {
            return new Promise(function( resolve , reject ) {
              fs.stat( fpath , function( err , stats ) {
                return err ? reject( err ) : resolve( stats.size );
              });
            });
          });
          return Promise.all( promises ).then(function( sizes ) {
            return sizes.reduce(function( p , c ) {
              return p + c;
            },0);
          });
        }),
        new Promise(function( resolve , reject ) {
          fs.stat( dest , function( err , stats ) {
            return err ? reject( err ) : resolve( stats.size );
          });
        }),
        new Promise(function( resolve , reject ) {
          var gzip = zlib.createGzip();
          var stream = fs.createReadStream( dest );
          var size = 0;
          stream
            .pipe( gzip )
            .on( 'data' , function( chunk ) {
              size += chunk.length;
            })
            .on( 'end' , function() {
              resolve( size );
            })
            .on( 'error' , reject );
        })
      ])
      .then(function( bytes ) {
        var kb = bytes.map(function( b ) {
          return Math.round( b / 10 ) / 100;
        });
        var msg = 'File ' + path.basename( dest ).cyan + ' created: ' + (kb[0] + ' kB').green + ' \u2192 ' + (kb[1] + ' kB').green;
        if (kb[2]) {
          msg += (' (' + kb[2] + ' kB gzipped)').magenta;
        }
        console.log( msg );
      })
      .catch(function( err ) {
        grunt.fail.warn( err );
      });
    }
  });
};
