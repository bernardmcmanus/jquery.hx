module.exports = function( grunt ) {


    var HTTPD_NODE_PORT = 8888;


    var httpd = require( 'httpd-node' );
    var fs = require( 'fs-extra' );
    var exec = require( 'child_process' ).exec;


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
        'js/includes/wee-promise-0.1.4.min.js',
        'js/includes/mojo-0.1.6.min.js',
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
            debug: {
                options: {
                    patterns: [{
                        match: /<\!(\-){2}\s\[BUILD\]\s(\-){2}>/,
                        replacement: '<script src=\"../<%= BUILD %>\"></script>'
                    }]
                },
                files: [{
                    src: 'live/index.html',
                    dest: 'live/index.html'
                }]
            },
            packages: {
                options: {
                    patterns: [
                        {
                            match: /(\"version\")(.*?)(\")(.{1,}?)(\")/i,
                            replacement: '\"version\": \"<%= pkg.version %>\"'
                        },
                        {
                            match: /(\"main\")(.*?)(\")(.{1,}?)(\")/i,
                            replacement: '\"main\": \"<%= BUILD %>\"'
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
                dest: '<%= BUILD %>'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-branch\' ) %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            release: {
                files: {
                    '<%= BUILD %>' : Build
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
        
        new httpd({ port : HTTPD_NODE_PORT })
            .environ( 'root' , __dirname )
            .setHttpDir( 'default' , '/' )
            .start();
    });


    grunt.registerTask( 'createLive' , function() {
        var src = __dirname + '/test';
        var dest = __dirname + '/live';
        fs.copySync( src , dest );
    });


    grunt.registerTask( 'getHash' , function() {

        grunt.task.requires( 'git-describe' );

        var rev = grunt.config.get( 'git-version' );
        var matches = rev.match( /\-?([A-Za-z0-9]{7})\-?/ );

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


    grunt.registerTask( 'setBuildName' , function() {
        var version = grunt.config.get( 'pkg.version' );
        var ext = (/(dev|debug)$/).test( process.argv[2] ) ? '.js' : '.min.js';
        var name = 'hx-' + version + ext;
        grunt.config.set( 'BUILD' , name );
    });


    grunt.registerTask( 'always' , [
        'jshint',
        'git-describe',
        'setBuildName',
        'getHash',
        'getBranch',
        'clean'
    ]);


    grunt.registerTask( 'default' , [
        'always',
        'replace:packages',
        'uglify'
    ]);


    grunt.registerTask( 'dev' , [
        'always',
        'createLive',
        'replace:debug',
        'concat'
    ]);


    grunt.registerTask( 'debug' , [
        'dev',
        'startServer',
        'watch:debug'
    ]);

    grunt.registerTask( '_debugProd' , [
        'always',
        'createLive',
        'replace:debug',
        'uglify'
    ]);

    grunt.registerTask( 'debugProd' , [
        '_debugProd',
        'startServer',
        'watch:debugProd'
    ]);
};


















