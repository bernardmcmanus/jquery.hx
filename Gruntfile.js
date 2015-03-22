module.exports = function( grunt ) {


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
      all: '<%= pkg.config.src %>'
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
            'E$',
            'BezierEasing',
            [ '$' , 'jQuery' ],
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
      }
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
          '<%= pkg.config.build.header %>',
          '<%= pkg.config.lib %>',
          '<%= pkg.config.build.tmp %>',
          '<%= pkg.config.build.footer %>'
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

  grunt.registerTask( 'init' , [ 'bower-install' ]);
  grunt.registerTask( 'default' , [ 'prod' ]);
  grunt.registerTask( 'prod' , [ 'release' ]);
  grunt.registerTask( 'dev' , [ 'build' ]);

  grunt.registerTask( 'build' , [
    'init',
    'clean',
    'gitinfo',
    'lint',
    'transpile',
    'concat'
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
    'uglify',
    'release-describe',
    'test',
    'clean:tmp'
  ]);

  grunt.registerTask( 'debug' , [
    'build',
    'connect',
    'karma:unit',
    'watch:debug'
  ]);
};


















