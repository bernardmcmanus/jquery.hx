module.exports = function( grunt ) {

    var libs = [
        'js/hxManager.js',
        'js/config.js',
        'js/helper.js',
        'js/when.js',
        'js/vendorPatch.js',
        'js/easing.js',
        'js/getters.js',
        'js/animator.js',
        'js/bean.js',
        'js/pod.js',
        'js/queue.js',
        'js/domNode.js',
        'js/hx.js',
        'lib/promise-0.1.1.min.js'
    ];

    grunt.initConfig({

            pkg: grunt.file.readJSON( 'package.json' ),

            clean : [ 'hx-*' ],

            uglify : {
                options : {
                    banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                release : {
                    files : {
                        'hx-<%= pkg.version %>.min.js' : libs
                    }
                }
            },

            'git-describe' : {
                'options' : {
                    prop : 'git-version'
                }
            },

            jshint : {
                all : [ 'Gruntfile.js' , 'js/*.js' ]
            }

    });

    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-git-describe' );

    grunt.registerTask( 'default' , [ 'jshint' , 'git-describe' , 'clean' , 'uglify' ]);

};