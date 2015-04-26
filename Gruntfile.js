module.exports = function( grunt ) {

  var path = require( 'path' );
  var config = require( './tasks/config' )( grunt );

  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    gitinfo: {},

    clean: {
      dist: [ 'dist' ],
      tmp: [ 'tmp' ]
    },

    jshint: {
      all: '<%= pkg.config.src %>',
      options: {
        esnext: true,
        laxbreak: true
      }
    },

    'import-clean': {
      all: '<%= pkg.config.src %>',
      options: { force: true }
    },

    transpile: {
      build: {
        src: '<%= pkg.config.src %>',
        dest: '<%= pkg.config.build.tmp %>',
        umd: '<%= pkg.config.build.umd %>',
        options: {
          inject: [
            'window',
            'document',
            'Object',
            'Array',
            'RegExp',
            'Math',
            'Error',
            [ 'Worker' , 'window.Worker' ],
            [ 'Blob' , 'window.Blob' ],
            [ 'URL' , 'window.URL' ],
            'E$',
            'BezierEasing',
            [ 'Promise' , 'WeePromise' ]
          ]
        }
      }
    },

    'release-describe': {
      build: {
        src: '<%= pkg.config.build.dev %>',
        dest: '<%= pkg.config.build.prod %>'
      }
    },

    sourcemap: {
      dev: {
        src: '<%= pkg.config.build.dev %>',
        dest: '<%= pkg.config.build.dev %>'
      },
      prod: {
        src: '<%= pkg.config.build.prod %>',
        dest: '<%= pkg.config.build.prod %>'
      }
    },

    replace: {
      packages: {
        options: {
          patterns: [
            {
              match: /"version".+"[\d\.]+"/i,
              replacement: '\"version\": \"<%= pkg.version %>\"'
            }
          ]
        },
        files: [
          {
            src: 'package.json',
            dest: 'package.json'
          },
          {
            src: 'bower.json',
            dest: 'bower.json'
          }
        ]
      },
      dev: config.replace({
        /*
         *  target: {
         *    key: value
         *    --- OR ---
         *    key: function( match , group ) { return value; }
         *  }
        */
        replacements: {
          BUILD: function() {
            return path.basename( grunt.config.process( '<%= pkg.config.build.dev %>' ));
          },
          SOURCEMAP: function() {
            // return path.basename( grunt.config.process( '<%= pkg.config.build.dev %>' )) + '.map';
          }
        },
        files: [{
          src: '<%= pkg.config.build.dev %>',
          dest: '<%= pkg.config.build.dev %>'
        }]
      }),
      prod: config.replace({
        replacements: {
          BUILD: function() {
            return path.basename( grunt.config.process( '<%= pkg.config.build.dev %>' ));
          },
          SOURCEMAP: function() {
            // return path.basename( grunt.config.process( '<%= pkg.config.build.prod %>' )) + '.map';
          }
        },
        files: [{
          src: '<%= pkg.config.build.prod %>',
          dest: '<%= pkg.config.build.prod %>'
        }]
      })
    },

    watch: {
      debug: {
        files: '<%= pkg.config.watch.files %>',
        options: '<%= pkg.config.watch.options %>',
        tasks: [ 'build' , 'karma:unit' ]
      }
    },

    connect: {
      debug: {
        options: {
          port: '<%= pkg.config.connect.port %>',
          base: '<%= pkg.config.connect.base %>',
          hostname: '<%= pkg.config.connect.hostname %>',
          interrupt: true
        }
      }
    },

    concat: {
      options: {
        banner: '<%= pkg.config.banner %>',
        stripBanners: {
          options: { block: true }
        }
      },
      build: {
        src: [
          '<%= pkg.config.include.undefine %>',
          '<%= pkg.config.lib %>',
          '<%= pkg.config.include.helper %>',
          '<%= pkg.config.include.redefine %>',
          '<%= pkg.config.build.tmp %>'
        ],
        dest: '<%= pkg.config.build.dev %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= pkg.config.banner %>',
        screwIE8: true
      },
      build: {
        src: '<%= pkg.config.build.dev %>',
        dest: '<%= pkg.config.build.prod %>'
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
    }

  });

  
  grunt.loadTasks( 'tasks' );

  [
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-git-describe',
    'grunt-replace',
    'grunt-contrib-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-watch',
    'grunt-contrib-connect',
    'grunt-import-clean',
    'grunt-gitinfo',
    'grunt-karma'
  ]
  .forEach( grunt.loadNpmTasks );

  grunt.registerTask( 'init' , [ 'dependencies' ]);
  grunt.registerTask( 'default' , [ 'prod' ]);
  grunt.registerTask( 'prod' , [ 'release' ]);
  grunt.registerTask( 'dev' , [ 'build' ]);

  grunt.registerTask( 'build' , [
    'init',
    'clean',
    'gitinfo',
    'lint',
    'transpile',
    'concat',
    'sourcemap:dev',
    'replace:dev',
    'uglify',
    'sourcemap:prod',
    'replace:prod'
  ]);

  grunt.registerTask( 'lint' , [
    'jshint',
    'import-clean'
  ]);

  grunt.registerTask( 'test' , function() {
    try {
      grunt.task.requires( 'build' );
    }
    catch( err ) {
      grunt.task.run( 'build' );
    }
    grunt.task.run([ 'karma' ]);
  });

  grunt.registerTask( 'release' , [
    'replace:packages',
    'build',
    'test',
    'release-describe',
    'clean:tmp'
  ]);

  grunt.registerTask( 'debug' , [
    'build',
    'connect',
    'karma:unit',
    'watch:debug'
  ]);
};


















