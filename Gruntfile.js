module.exports = function( grunt ) {


    var fs = require( 'fs-extra' );


    var Script = [
        'js/hxManager.js',
        'js/hx.js',
        'js/shared/config.js',
        'js/shared/helper.js',
        'js/shared/vendorPatch.js',
        'js/domNode/cssProperty.js',
        'js/domNode/transform.js',
        'js/domNode/cssFactory.js',
        'js/domNode/componentMOJO.js',
        'js/domNode/transitionMOJO.js',
        'js/domNode/queue.js',
        'js/domNode/domNodeFactory.js',
        'js/pod/easing.js',
        'js/pod/timingMOJO.js',
        'js/pod/iterator.js',
        'js/pod/subscriber.js',
        'js/pod/bean.js',
        'js/pod/animationPod.js',
        'js/pod/promisePod.js',
        'js/pod/podFactory.js'
    ];


    var Lib = [
        'js/lib/promise-0.1.1.min.js',
        'js/lib/mojo-0.1.0.min.js'
    ];


    var All = Lib.concat( Script );


    grunt.initConfig({

        pkg: grunt.file.readJSON( 'package.json' ),

        jshint : {
            all : [ 'Gruntfile.js' ].concat( Script )
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
                files: [{
                    src: 'live/index.html',
                    dest: 'live/index.html'
                }]
            },
            prod: {
                options: {
                    patterns: [
                        {
                            match: /<\!(\-){2}\s\[scripts\]\s(\-){2}>/,
                            replacement : '<script src=\"../hx-<%= pkg.version %>-nightly.min.js\"></script>'
                        }
                    ]
                },
                files: [{
                    src: 'live/index.html',
                    dest: 'live/index.html'
                }]
            },
            live: {
                options: {
                    patterns: [
                        {
                            match: /<\!(\-){2}\s\[scripts\]\s(\-){2}>/,
                            replacement: function() {
                                var template = '<script src=\"../[src]\"></script>';
                                return All.map(function( src , i ) {
                                    return (i > 0 ? '\t\t' : '') + template.replace( /\[src\]/ , src );
                                })
                                .join( '\n' );
                            }
                        }
                    ]
                },
                files: [{
                    src: 'live/index.html',
                    dest: 'live/index.html'
                }]
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
            debugProd: {
                files: ([ 'Gruntfile.js' , 'package.json' , 'test/*' ]).concat( All ),
                tasks: [ '_debugProd' ]
            },
            src: {
                files: ([ 'Gruntfile.js' , 'package.json' , 'test/*' ]).concat( All ),
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
                src: All,
                dest: 'hx-<%= pkg.version %>-nightly.js'
            }
        },

        uglify: {
            options: {
                banner : '/*! <%= pkg.name %> - <%= pkg.version %> nightly build - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            release : {
                files : {
                    'hx-<%= pkg.version %>-nightly.min.js' : All
                }
            }
        }
    });


    [
        'grunt-contrib-jshint',
        'grunt-contrib-clean',
        'grunt-replace',
        'grunt-contrib-concat',
        'grunt-contrib-uglify',
        'grunt-contrib-watch'
    ]
    .forEach( grunt.loadNpmTasks );


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
        'clean',
        'createLive',
        'replace:dev',
        'concat'
    ]);


    grunt.registerTask( 'debug' , [
        'dev',
        'watch:src'
    ]);

    grunt.registerTask( '_debugProd' , [
        'jshint',
        'clean',
        'createLive',
        'replace:prod',
        'uglify'
    ]);

    grunt.registerTask( 'debugProd' , [
        '_debugProd',
        'watch:debugProd'
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


















