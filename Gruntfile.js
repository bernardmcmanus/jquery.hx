module.exports = function(grunt) {

    var libs = [ 'js/hx.js' , 'js/animator.js' ];

    grunt.initConfig({

            pkg: grunt.file.readJSON('package.json'),

            uglify : {
                options : {
                    banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= grunt.config.get("git-version") %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                release : {
                    files : {
                        'hx.min.js' : libs
                    }
                }
            },

            /*"git-describe" : {
                "options" : {
                    prop : "git-version"
                }
            },*/

            jshint : {
                all : [ 'Gruntfile.js', 'js/*.js']
            }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-git-describe');

    grunt.registerTask('default', ['jshint','git-describe', 'clean', 'uglify']);

};