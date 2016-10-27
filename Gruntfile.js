module.exports = function( grunt ) {
  var Router = require( 'urlrouter' );

  // always print a stack trace if something goes wrong
  grunt.option('stack', true);

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    jshint: {
      all: [ 'js/**/*.js' ]
    },
    gitinfo: {},
    clean: {
      dist: [ 'dist' ]
    },
    browserify: {
      dist: {
        options: {
          banner: '<%= pkg.config.banner %>\n',
          plugin: [[ 'browserify-derequire' ]],
          browserifyOptions: {
            paths: [ 'js' , 'node_modules' ],
            debug: 'debug',
            standalone: 'hxManager'
          }
        },
        files: { 'dist/hx.js': 'js/main.js' }
      },
      test: {
        options: {
          transform: [
            [ 'babelify' , { stage: 0 }]
          ],
          browserifyOptions: {
            paths: [ 'dist' , 'node_modules' ]
          }
        },
        files: { 'test/hx-module.compiled.js': 'test/hx-module.js' }
      }
    },
    exorcise: {
      dist: {
        files: { 'dist/hx.js.map': 'dist/hx.js' }
      }
    },
    watch: {
      debug: {
        files: [ 'js/**/*.js' ],
        tasks: [ 'build' ]
      }
    },
    connect: {
      debug: {
        options: {
          port: 9001,
          base: '.',
          hostname: '0.0.0.0',
          interrupt: true,
          middleware: function ( connect , options , middlewares ){
            return [
              Router(function( app ) {
                app.get( '*' , function( req , res , next ){
                  res.setHeader( 'access-control-allow-origin' , '*' );
                  next();
                });
              })
            ]
            .concat( middlewares );
          }
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= pkg.config.banner %>',
        sourceMap: true,
        sourceMapIn: 'dist/hx.js.map',
        screwIE8: true
      },
      release: {
        files: { 'dist/hx.min.js': 'dist/hx.js' }
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    'release-describe': {
      dist: {
        files: { 'dist/hx.min.js': 'dist/hx.js' }
      }
    }
  });

  grunt.loadTasks( 'tasks' );

  [
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-contrib-uglify',
    'grunt-contrib-watch',
    'grunt-contrib-connect',
    'grunt-gitinfo',
    'grunt-browserify',
    'grunt-exorcise',
    'grunt-karma'
  ]
  .forEach( grunt.loadNpmTasks );

  grunt.registerTask( 'default' , [
    'build',
    'uglify',
    'release-describe'
  ]);

  grunt.registerTask( 'build' , [
    'jshint',
    'gitinfo',
    'clean',
    'browserify',
    'exorcise'
  ]);

  grunt.registerTask( 'test' , function() {
    try {
      grunt.task.requires( 'build' );
    }
    catch( err ) {
      grunt.task.run( 'build' );
    }
    grunt.task.run([ 'connect' , 'karma:unit' ]);
  });

  grunt.registerTask( 'debug' , [
    'build',
    'connect',
    'watch:debug'
  ]);
};
