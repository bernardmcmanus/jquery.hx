module.exports = function( grunt ){
  grunt.task.ensure = function( task ){
    try {
      grunt.task.requires( task );
    } catch( err ){
      grunt.task.run( task );
    }
  };
};
