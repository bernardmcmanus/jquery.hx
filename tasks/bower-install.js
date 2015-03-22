module.exports = function( grunt ) {
  var cp = require( 'child_process' );
  grunt.task.registerTask( 'bower-install' , function() {
    var done = this.async();
    var task = cp.spawn( 'bower' , [ 'install' ]);
    var readable = task.stdout;
    readable.pipe( process.stdout );
    readable.on( 'end' , done );
  });
};
