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
      options: { force: true },
      all: '<%= pkg.config.src %>'
    },

    browserify: {
      dist: {
        options: {
          transform: [[ 'babelify' , { stage: 0 }]]
        },
        files: {
          '<%= pkg.config.build.tmp %>': 'src/main.js'
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
      bower: {
        options: {
          patterns: [{
            match: /"version".+"[\d\.]+"/i,
            replacement: '\"version\": \"<%= pkg.version %>\"'
          }]
        },
        files: [{
          src: 'bower.json',
          dest: 'bower.json'
        }]
      }
    },

    watch: {
      debug: {
        files: '<%= pkg.config.watch.files %>',
        options: '<%= pkg.config.watch.options %>',
        tasks: [ 'build' /*, 'karma:unit'*/ ]
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
          '<%= pkg.config.lib %>',
          '<%= pkg.config.include.helper %>',
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
    'grunt-karma',

    'grunt-babel',
    'grunt-browserify'
  ]
  .forEach( grunt.loadNpmTasks );

  grunt.registerTask( 'default' , [ 'prod' ]);
  grunt.registerTask( 'prod' , [ 'release' ]);
  grunt.registerTask( 'dev' , [ 'build' ]);

  grunt.registerTask( 'build' , [
    'clean',
    'gitinfo',
    'lint',
    'browserify',
    'concat',
    'uglify'
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
    'replace:bower',
    'build',
    'test',
    'release-describe',
    'clean:tmp'
  ]);

  grunt.registerTask( 'debug' , [
    'build',
    'connect',
    // 'karma:unit',
    'watch:debug'
  ]);
};









