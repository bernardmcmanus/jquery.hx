module.exports = function(grunt) {

    var libs = [
        'js/hxManager.js',
        'js/workflow.js',
        'js/vendorPatch.js',
        'js/easing.js',
        'js/animator.js',
        'js/hx.js',
        'js/extensions.js',
        'js/cdn.js'
    ];

    grunt.initConfig({

            pkg: grunt.file.readJSON('package.json'),

            clean : ["hx.min.js"],

            uglify : {
                options : {
                    banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                release : {
                    files : {
                        'hx.min.js' : libs
                    }
                }
            },

            "git-describe" : {
                "options" : {
                    prop : "git-version"
                }
            },

            jshint : {
                all : [ 'Gruntfile.js', 'js/*.js']
            }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-git-describe');

    grunt.registerTask('default', ['jshint','git-describe', 'clean', 'uglify']);

};