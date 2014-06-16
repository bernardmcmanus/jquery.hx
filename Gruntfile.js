module.exports = function( grunt ) {


    var fs = require( 'fs-extra' );


    var libs = [
        'lib/promise-0.1.1.min.js',
        'lib/mojo-0.1.0.min.js',
        'js/hxManager.js',
        'js/hx.js',
        'js/config.js',
        'js/helper.js',
        'js/vendorPatch.js',
        'js/easing.js',
        'js/animator.js',
        'js/bean.js',
        'js/queue.js',
        'js/componentMOJO.js',
        'js/transitionMOJO.js',
        'js/factories/podFactory.js',
        'js/factories/domNodeFactory.js'
    ];


    grunt.initConfig({

        pkg: grunt.file.readJSON( 'package.json' ),

        jshint : {
            all : [ 'Gruntfile.js' , 'js/*.js' , 'js/factories/*.js' ]
        },

        clean: {
            build: [ 'hx-*-nightly*.js' ],
            live: [ 'live' ]
        },

        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: /<\!(\-){2}\s\[scripts\]\s(\-){2}>/,
                            replacement : '<script src=\"../hx-<%= pkg.version %>-nightly.js\"></script>'
                        }
                    ]
                },
                files: [
                    {
                        src: 'live/index.html',
                        dest: 'live/index.html'
                    }
                ]
            },
            live: {
                options: {
                    patterns: [
                        {
                            match: /<\!(\-){2}\s\[scripts\]\s(\-){2}>/,
                            replacement: function() {
                                var template = '<script src=\"../[src]\"></script>';
                                return libs.map(function( src , i ) {
                                    return (i > 0 ? '\t\t' : '') + template.replace( /\[src\]/ , src );
                                })
                                .join( '\n' );
                            }
                        }
                    ]
                },
                files: [
                    {
                        src: 'live/index.html',
                        dest: 'live/index.html'
                    }
                ]
            },
            bower: {
                options: {
                    patterns: [
                        {
                            match: /(\"name\")(.*?)(\")(.{1,}?)(\")/i,
                            replacement: '\"name\": \"<%= pkg.name %>\"'
                        },
                        {
                            match: /(\"version\")(.*?)(\")(.{1,}?)(\")/i,
                            replacement: '\"version\": \"<%= pkg.version %>\"'
                        },
                        {
                            match: /(\"homepage\")(.*?)(\")(.{1,}?)(\")/i,
                            replacement: '\"homepage\": \"<%= pkg.repository.url %>\"'
                        },
                        {
                            match: /(\"description\")(.*?)(\")(.{1,}?)(\")/i,
                            replacement: '\"description\": \"<%= pkg.description %>\"'
                        },
                        {
                            match: /(\"main\")(.*?)(\")(.{1,}?)(\")/i,
                            replacement: '\"main\": \"hx-<%= pkg.version %>-nightly.min.js\"'
                        }
                    ]
                },
                files: [{
                    src: 'bower.json',
                    dest: 'bower.json'
                }]
            }
        },

        watch: {
            src: {
                files: ([ 'Gruntfile.js' , 'package.json' , 'test/*' ]).concat( libs ),
                tasks: [ 'dev' ]
            },
            test: {
                files: [ 'Gruntfile.js' , 'package.json' , 'test/*' ],
                tasks: [ '_live' ]
            }
        },

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


    grunt.registerTask( 'createLive' , function() {
        var src = __dirname + '/test';
        var dest = __dirname + '/live';
        fs.copySync( src , dest );
    });


    grunt.registerTask( 'default' , [
        'jshint',
        'clean',
        'replace:bower',
        'uglify'
    ]);


    grunt.registerTask( 'dev' , [
        'jshint',
        'clean:build',
        'clean:live',
        'createLive',
        'replace:dev',
        'concat'
    ]);


    grunt.registerTask( 'debug' , [
        'dev',
        'watch:src'
    ]);


    grunt.registerTask( '_live' , [
        'clean:live',
        'createLive',
        'replace:live'
    ]);


    grunt.registerTask( 'live' , [
        '_live',
        'watch:test'
    ]);
};


















