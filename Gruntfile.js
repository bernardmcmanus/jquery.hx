module.exports = function( grunt ) {


    var HTTPD_NODE_PORT = 8888;


    var httpd = require( 'httpd-node' );
    var fs = require( 'fs-extra' );
    var exec = require( 'child_process' ).exec;


    httpd.environ( 'root' , __dirname );


    var Script = [
        'js/hxManager.js',
        'js/shared/helper.js',
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
        'js/includes/promise-1.0.0.min.js',
        'js/includes/mojo-0.1.4.min.js',
        'js/includes/bezier-easing-0.4.1.js'
    ];


    var Build = Includes.concat( Script );


    grunt.initConfig({

        pkg: grunt.file.readJSON( 'package.json' ),

        'git-describe': {
            options: {
                prop: 'git-version'
            },
            dist : {}
        },

        jshint: {
            all: [ 'Gruntfile.js' , 'js/**/*.js' , '!js/includes/*' ]
        },

        clean: {
            build: [ 'hx-*.js' ],
            live: [ 'live' ]
        },

        replace: {
            dev: {
                options: {
                    patterns: [{
                        match: /<\!(\-){2}\s\[scripts\]\s(\-){2}>/,
                        replacement: '<script src=\"../hx-<%= pkg.version %>.js\"></script>'
                    }]
                },
                files: [{
                    src: 'live/index.html',
                    dest: 'live/index.html'
                }]
            },
            prod: {
                options: {
                    patterns: [{
                        match: /<\!(\-){2}\s\[scripts\]\s(\-){2}>/,
                        replacement: '<script src=\"../hx-<%= pkg.version %>.min.js\"></script>'
                    }]
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
                            replacement: '\"main\": \"hx-<%= pkg.version %>.min.js\"'
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
                files: ([ 'Gruntfile.js' , 'package.json' , 'test/*' ]).concat( Build ),
                tasks: [ '_debugProd' ]
            },
            src: {
                files: ([ 'Gruntfile.js' , 'package.json' , 'test/*' ]).concat( Build ),
                tasks: [ 'dev' ]
            }
        },

        concat: {
            options: {
                banner: (function() {
                    var banner = '/*\n\n';
                    banner += '<%= pkg.name %> - <%= pkg.version %> - <%= grunt.config.get( \'git-branch\' ) %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %>';
                    banner += '\n\n';
                    banner += fs.readFileSync( 'LICENSE.txt' , 'utf8' );
                    banner += '\n\n*/\n\n';
                    return banner;
                }())
            },
            build: {
                src: Build,
                dest: 'hx-<%= pkg.version %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-branch\' ) %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            release: {
                files: {
                    'hx-<%= pkg.version %>.min.js' : Build
                }
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
        'grunt-contrib-watch'
    ]
    .forEach( grunt.loadNpmTasks );


    grunt.registerTask( 'startServer' , function() {
        var server = new httpd({ port : HTTPD_NODE_PORT });
        server.setHttpDir( 'default' , '/' );
        server.start();
    });


    grunt.registerTask( 'createLive' , function() {
        var src = __dirname + '/test';
        var dest = __dirname + '/live';
        fs.copySync( src , dest );
    });


    grunt.registerTask( 'getHash' , function() {

        grunt.task.requires( 'git-describe' );

        var rev = grunt.config.get( 'git-version' );
        var matches = rev.match( /(\-{0,1})+([A-Za-z0-9]{7})+(\-{0,1})/ );

        var hash = matches
            .filter(function( match ) {
                return match.length === 7;
            })
            .pop();

        if (matches && matches.length > 1) {
            grunt.config.set( 'git-hash' , hash );
        }
        else{
            grunt.config.set( 'git-hash' , rev );
        }
    });


    grunt.registerTask( 'getBranch' , function() {
        var done = this.async();
        exec( 'git status' , function( error , stdout , stderr ) {
            if (!error) {
                var branch = stdout
                    .split( '\n' )
                    .shift()
                    .replace( /on\sbranch\s/i , '' );
                grunt.config.set( 'git-branch' , branch );
            }
            done();
        });
    });


    grunt.registerTask( 'always' , [
        'jshint',
        'git-describe',
        'getHash',
        'getBranch',
        'clean'
    ]);


    grunt.registerTask( 'default' , [
        'always',
        'replace:bower',
        'uglify'
    ]);


    grunt.registerTask( 'dev' , [
        'always',
        'createLive',
        'replace:dev',
        'concat'
    ]);


    grunt.registerTask( 'debug' , [
        'dev',
        'startServer',
        'watch:src'
    ]);

    grunt.registerTask( '_debugProd' , [
        'always',
        'createLive',
        'replace:prod',
        'uglify'
    ]);

    grunt.registerTask( 'debugProd' , [
        '_debugProd',
        'startServer',
        'watch:debugProd'
    ]);
};


















