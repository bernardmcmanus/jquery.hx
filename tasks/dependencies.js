module.exports = function( grunt ) {
  var fs = require( 'fs-extra' );
  var cp = require( 'child_process' );
  var path = require( 'path' );
  var Promise = require( 'es6-promise' ).Promise;

  function dirExists( dirname ) {
    return new Promise(function( resolve , reject ) {
      var packageDir = path.join( process.cwd() , dirname );
      fs.stat( packageDir , function( err , stats ) {
        return err ? reject( err ) : resolve();
      });
    });
  }

  function install( command , args ) {
    return new Promise(function( resolve ) {
      var task = cp.spawn( command , args );
      var readable = task.stdout;
      readable.pipe( process.stdout );
      readable.on( 'end' , resolve );
    });
  }

  grunt.task.registerTask( 'dependencies' , function() {
    var done = this.async();
    Promise.resolve().then(function() {
      return dirExists( 'node_modules' );
    })
    .catch(function( err ) {
      return install( 'npm' , [ 'install' ]);
    })
    .then(function() {
      return dirExists( 'bower_components' );
    })
    .catch(function( err ) {
      return install( 'bower' , [ 'install' ]);
    })
    .catch( grunt.fail.fatal )
    .then( done );
  });
};
