module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
        , uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js'
                , dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
        , concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'src/amd-header.js'
                    , 'src/utils.js'
                    , 'src/class-extend.js'
                    , 'src/events.js'
                    , 'src/history.js'
                    , 'src/model.js'
                    , 'src/router.js'
                    , 'src/view.js'
                    , 'src/amd-footer.js'
                ]
                , dest: 'dist/<%= pkg.name %>.js'
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('default', ['concat', 'uglify']);

};
