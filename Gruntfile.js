module.exports = function( grunt ) {


  var fs = require( 'fs-extra' );
  var cp = require( 'child_process' );


  var Script = [
    'js/hxManager.js',
    'js/shared/helper.js',
    'js/shared/inject.js',
    'js/shared/config.js',
    'js/shared/vendorPatch.js',
    'js/shared/bezier.js',
    'js/shared/easing.js',
    'js/domNode/styleDefinition.js',
    'js/domNode/cssProperty.js',
    'js/domNode/componentMOJO.js',
    'js/domNode/transitionMOJO.js',
    'js/domNode/queue.js',
    'js/domNode/domNodeFactory.js',
    'js/pod/timingMOJO.js',
    'js/pod/subscriberMOJO.js',
    'js/pod/bean.js',
    'js/pod/iteratorMOJO.js',
    'js/pod/animationPod.js',
    'js/pod/precisionPod.js',
    'js/pod/promisePod.js',
    'js/pod/podFactory.js',
    'js/hx.js',
    'js/init/init.js'
  ];


  var Includes = [
    'bower_components/wee-promise/wee-promise-0.2.1.min.js',
    // 'bower_components/es6-promise/index.js',
    'js/includes/mojo-0.1.6.min.js',
    'js/includes/bezier-easing-0.4.1.js'
  ];


  var Build = Includes.concat( Script );


  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    jshint: {
      all: [ 'Gruntfile.js' , 'js/**/*.js' , '!js/includes/*' ]
    },

    gitinfo: {},

    clean: {
      dist: [ 'dist' ]
    },

    replace: {
      packages: {
        options: {
          patterns: [
            {
              match: /(\"version\")(.*?)(\")(.{1,}?)(\")/i,
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
        files: [ 'Gruntfile.js' , 'package.json' , 'test/*' , 'js/**/*.js' ],
        tasks: [ 'dev' ]
      },
      debugProd: {
        files: [ 'Gruntfile.js' , 'package.json' , 'test/*' , 'js/**/*.js' ],
        tasks: [ '_debugProd' ]
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
        banner: '<%= pkg.config.banner %>\n'
      },
      build: {
        src: Build,
        dest: '<%= pkg.config.dist.dev %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= pkg.config.banner %>'
      },
      release: {
        files: {
          '<%= pkg.config.dist.prod %>' : '<%= pkg.config.dist.dev %>'
        }
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }

  });


  [
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-git-describe',
    'grunt-replace',
    'grunt-contrib-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-watch',
    'grunt-contrib-connect',
    'grunt-gitinfo',
    'grunt-karma'
  ]
  .forEach( grunt.loadNpmTasks );

  grunt.registerTask( 'always' , [
    'jshint',
    'gitinfo',
    'clean'
  ]);

  grunt.registerTask( 'build' , [
    'always',
    'concat'
  ]);

  grunt.registerTask( 'default' , [
    'replace:packages',
    'build',
    'uglify'
  ]);

  grunt.registerTask( 'dev' , [
    'always',
    'concat',
    'karma:unit'
  ]);

  grunt.registerTask( 'debug' , [
    'dev',
    'watch:debug'
  ]);

  grunt.registerTask( '_debugProd' , [
    'build',
    'uglify'
  ]);

  grunt.registerTask( 'debugProd' , [
    '_debugProd',
    'connect',
    'watch:debugProd'
  ]);
};


















