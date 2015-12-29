module.exports = function( grunt ){
  
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
        indent: 2
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
          'tmp/<%= pkg.name %>.js': 'src/main.js',
          'tmp/jquery.<%= pkg.name %>.js': 'src/jquery/main.js'
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
    exorcise: {
      dist: {
        files: {
          'tmp/<%= pkg.name %>.js.map': 'tmp/<%= pkg.name %>.js',
          'tmp/jquery.<%= pkg.name %>.js.map': 'tmp/jquery.<%= pkg.name %>.js'
        }
      },
      unit: {
        files: {
          'test/unit/tests.compiled.js.map': 'test/unit/tests.compiled.js'
        }
      },
      functional: {
        files: {
          'test/functional/tests.compiled.js.map': 'test/functional/tests.compiled.js'
        }
      }
    },
    wrap: {
      options: {
        args: (function(){
          var args = [
            'Object',
            'Array',
            'Math',
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
          'tmp/<%= pkg.name %>.js': 'tmp/<%= pkg.name %>.js',
          'tmp/jquery.<%= pkg.name %>.js': 'tmp/jquery.<%= pkg.name %>.js'
        }
      },
      unit: {
        files: {
          'test/unit/tests.compiled.js': 'test/unit/tests.compiled.js'
        }
      },
      functional: {
        files: {
          'test/functional/tests.compiled.js': 'test/functional/tests.compiled.js'
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
          'compiled/<%= pkg.name %>.js': 'tmp/<%= pkg.name %>.js',
          'compiled/jquery.<%= pkg.name %>.js': 'tmp/jquery.<%= pkg.name %>.js'
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
          'compiled/<%= pkg.name %>.min.js': 'compiled/<%= pkg.name %>.js',
          'compiled/jquery.<%= pkg.name %>.min.js': 'compiled/jquery.<%= pkg.name %>.js'
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
          'compiled/<%= pkg.name %>.min.js': 'compiled/<%= pkg.name %>.js',
          'compiled/jquery.<%= pkg.name %>.min.js': 'compiled/jquery.<%= pkg.name %>.js'
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
    'grunt-wrap',
    'grunt-exorcise'
  ]
  .forEach( grunt.loadNpmTasks );

  grunt.registerTask( 'default' , [ 'prod' ]);
  grunt.registerTask( 'prod' , [ 'release' ]);
  grunt.registerTask( 'dev' , [ 'build' ]);

  grunt.registerTask( 'build' , [
    'clean',
    'gitinfo',
    'lint',
    'browserify:dist',
    'exorcise:dist',
    'wrap',
    'concat',
    'uglify'
  ]);

  grunt.registerTask( 'lint' , [
    'import-clean',
    'jshint'
  ]);

  grunt.registerTask( 'release' , [
    // 'test',
    'build',
    'release-describe',
    'update_json',
    'clean:tests',
    'clean:tmp'
  ]);

  grunt.registerMultiTask( 'test' , function(){
    grunt.task.ensure( 'lint' );
    grunt.task.ensure( 'browserify:' + this.target );
    // grunt.task.ensure( 'wrap:' + this.target );
    grunt.task.ensure( 'exorcise:' + this.target );
    // grunt.task.run( 'karma:' + this.target );
  });

  grunt.registerMultiTask( 'debug' , function(){
    var target = (process.argv.indexOf( 'debug' ) >= 0 ? '' : ':' + this.target);
    grunt.task.ensure( 'connect' );
    grunt.task.ensure( 'test' + target );
    grunt.task.ensure( 'watch' + target );
  });
};
