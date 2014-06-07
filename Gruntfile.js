module.exports = function( grunt ) {


    var libs = [
        'js/hxManager.js',
        'js/prototypes/when.js',
        'js/config.js',
        'js/helper.js',
        'js/vendorPatch.js',
        'js/easing.js',
        'js/getters.js',
        'js/animator.js',
        'js/keyMap.js',
        'js/bean.js',
        'js/pod.js',
        'js/queue.js',
        'js/domNode.js',
        'js/hx.js',
        'lib/promise-0.1.1.min.js'
    ];


    grunt.initConfig({

        pkg: grunt.file.readJSON( 'package.json' ),

        jshint : {
            all : [ 'Gruntfile.js' , 'js/*.js' , 'js/prototypes/*.js' ]
        },

        clean : [ 'hx-<%= pkg.version %>-nightly*.js' ],

        replace: {

            dev: {
                options: {
                    patterns: [
                        {
                            match : /(\.\.\/hx\-)(.*?)(\.js)/,
                            replacement : '../hx-<%= pkg.version %>-nightly.js'
                        }
                    ]
                },
                files: [
                    {
                        src: 'test/index.html',
                        dest: 'test/index.html'
                    }
                ]
            },

            prod: {
                options: {
                    patterns: [
                        {
                            match: /(\"version\")(.*?)(\")(.{1,}?)(\")/i,
                            replacement: '\"version\": \"<%= pkg.version %>\"'
                        },
                        {
                            match: /(\"main\")(.*?)(\")(.{1,}?)(\")/i,
                            replacement: '\"main\": \"hx-<%= pkg.version %>-nightly.min.js\"'
                        }
                    ]
                },
                files: [
                    {
                        src: 'bower.json',
                        dest: 'bower.json'
                    },
                    {
                        src: 'bower.json',
                        dest: 'bower.json'
                    }
                ]
            }
        },

        watch: [{
            files: ([ 'package.json' ]).concat( libs ),
            tasks: [ 'dev' ]
        }],

        concat: {
            options: {
                banner : '/*! <%= pkg.name %> - <%= pkg.version %> nightly build - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n\n'
            },
            build: {
                src: libs,
                dest: 'hx-<%= pkg.version %>-nightly.js'
            }
        },

        uglify: {
            options: {
                banner : '/*! <%= pkg.name %> - <%= pkg.version %> nightly build - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            release : {
                files : {
                    'hx-<%= pkg.version %>-nightly.min.js' : libs
                }
            }
        }
    });


    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-replace' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );


    grunt.registerTask( 'default' , [
        'jshint',
        'clean',
        'replace:prod',
        'uglify'
    ]);

    grunt.registerTask( 'dev' , [
        'jshint',
        'clean',
        'replace:dev',
        'concat'
    ]);

    grunt.registerTask( 'debug' , [
        'dev',
        'watch'
    ]);
};
