module.exports = function( grunt ){

  var extend = require( 'extend' );

  grunt.task.ensure = function( task ){
    try {
      grunt.task.requires( task );
    } catch( err ){
      grunt.task.run( task );
    }
  };

  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    gitinfo: {},

    clean: {
      tests: [ 'test/*/*.compiled.js' ],
      compiled: [ 'compiled' ],
      tmp: [ 'tmp' ]
    },

    jshint: {
      all: 'src/**/*.js',
      options: {
        esnext: true,
        laxbreak: true
      }
    },

    'import-clean': {
      options: { force: true },
      all: 'src/**/*.js'
    },

    update_json: {
      options: {
        src: 'package.json',
        indent: '  '
      },
      bower: {
        dest: 'bower.json',
        fields: [
          'name',
          'version',
          'main',
          'description',
          'keywords',
          'homepage',
          'license'
        ]
      }
    },

    /*compile: {
      options: {
        transform: [[ 'babelify' , { stage: 0 }]],
        plugin: [
          [ 'browserify-derequire' ]
        ],
        browserifyOptions: { 'debug': 'debug' }
      },
      dist: {
        browserifyOptions: {
          'paths': [ 'src' , 'bower_components' ],
          'standalone': '$hx'
        }
      },
      unit: {
        browserifyOptions: {
          'paths': [ 'src' , 'bower_components' , 'compiled' ]
        }
      },
      functional: {
        browserifyOptions: {
          'paths': [ 'src' , 'bower_components' , 'compiled' ]
        }
      }
    },*/

    browserify: {
      options: {
        transform: [[ 'babelify' , { stage: 0 }]],
        plugin: [
          [ 'browserify-derequire' ]
        ],
        browserifyOptions: {
          'paths': [ 'src' , 'bower_components' , 'compiled' ],
          'debug': 'debug',
          'standalone': '$hx'
        }
      },
      dist: {
        files: {
          'tmp/<%= pkg.name %>.js': 'src/main.js'
        }
      },
      unit: {
        files: {
          'test/unit/tests.compiled.js': 'test/unit/tests.js'
        }
      },
      functional: {
        files: {
          'test/functional/tests.compiled.js': 'test/functional/tests.js'
        }
      }
    },

    wrap: {
      options: {
        args: (function(){
          /*[
            'window',
            'document',
            'navigator',
            'Object',
            'Array',
            'Image',
            'RegExp',
            'XMLHttpRequest',
            'Math',
            'Date',
            'Error',
            'JSON',
            'setTimeout',
            'isNaN',
            'parseFloat',
            'encodeURIComponent',
            'decodeURIComponent',
            [ 'Promise' , 'ES6Promise.Promise' ]
          ]*/
          var args = [
            'Object',
            'Array',
            'Error',
            ['UNDEFINED']
          ];

          var leadingWrapArgs = args.map(function( arg ){
            return Array.isArray( arg ) ? arg.shift() : arg;
          })
          .filter(function( arg ){
            return !!arg;
          });

          var trailingWrapArgs = args.map(function( arg ){
            return Array.isArray( arg ) ? arg.pop() : arg;
          })
          .filter(function( arg ){
            return !!arg;
          });

          return {
            leading: leadingWrapArgs,
            trailing: trailingWrapArgs
          };
        }()),
        wrapper: [
          '(function(<%= wrap.options.args.leading %>){\n"use strict";\n',
          '\n}(<%= wrap.options.args.trailing %>))'
        ]
      },
      dist: {
        files: {
          'tmp/<%= pkg.name %>.js': 'tmp/<%= pkg.name %>.js'
        }
      }
    },

    concat: {
      options: {
        banner: '<%= pkg.config.banner %>\n',
        stripBanners: {
          options: { block: true }
        }
      },
      dist: {
        files: {
          'compiled/<%= pkg.name %>.js': 'tmp/<%= pkg.name %>.js'
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= pkg.config.banner %>',
        screwIE8: true
      },
      dist: {
        files: {
          'compiled/<%= pkg.name %>.min.js': 'compiled/<%= pkg.name %>.js'
        }
      }
    },

    watch: {
      options: { interrupt: true },
      files: [ 'src/**/*.js' , 'test/*/tests.js' ],
      unit: {
        files: '<%= watch.files %>',
        tasks: [ 'test:unit' ]
      },
      functional: {
        files: '<%= watch.files %>',
        tasks: [ 'test:functional' ]
      }
    },

    connect: {
      server: {
        options: '<%= pkg.config.connect %>'
      }
    },

    karma: {
      unit: {
        configFile: 'test/unit/karma.conf.js',
        singleRun: true
      },
      functional: {
        configFile: 'test/functional/karma.conf.js',
        singleRun: true
      }
    },

    'release-describe': {
      dist: {
        files: {
          'compiled/<%= pkg.name %>.min.js': 'compiled/<%= pkg.name %>.js'
        }
      }
    },

    test: {
      unit: {},
      functional: {}
    },

    debug: {
      unit: {},
      functional: {}
    }
  });
  
  grunt.loadTasks( 'tasks' );

  [
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-contrib-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-watch',
    'grunt-contrib-connect',
    'grunt-import-clean',
    'grunt-update-json',
    'grunt-gitinfo',
    'grunt-karma',
    'grunt-browserify',
    'grunt-wrap'
  ]
  .forEach( grunt.loadNpmTasks );

  grunt.registerTask( 'default' , [ 'prod' ]);
  grunt.registerTask( 'prod' , [ 'release' ]);
  grunt.registerTask( 'dev' , [ 'build' ]);

  grunt.registerTask( 'build' , [
    'clean',
    'gitinfo',
    'lint',
    // 'compile:dist',
    'browserify:dist',
    'wrap',
    'concat',
    'uglify'
  ]);

  grunt.registerTask( 'lint' , [
    'import-clean',
    'jshint'
  ]);

  grunt.registerTask( 'release' , [
    'test',
    'build',
    'release-describe',
    'update_json',
    'clean:tests',
    'clean:tmp'
  ]);

  /*grunt.registerMultiTask( 'compile' , function(){
    var target = this.target;
    var options = extend( true , this.options() , this.data );
    grunt.config.set( 'browserify.' + target + '.options' , options );
    grunt.task.run( 'browserify:' + target );
  });*/

  grunt.registerMultiTask( 'test' , function(){
    // grunt.task.ensure( 'compile:' + this.target );
    grunt.task.ensure( 'browserify:' + this.target );
    // grunt.task.run( 'karma:' + this.target );
  });

  grunt.registerMultiTask( 'debug' , function(){
    var target = (process.argv.indexOf( 'debug' ) >= 0 ? '' : ':' + this.target);
    grunt.task.ensure( 'connect' );
    grunt.task.ensure( 'test' + target );
    grunt.task.ensure( 'watch' + target );
  });
};
