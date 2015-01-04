module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/lib/bootstrap-dropdown.js', 'js/lib/bootstrap-typeahead.js','js/lib/app.js'],
        dest: 'js/lib/main.js',
      },
    },

    uglify: {
      build: {
        src: 'js/lib/main.js',
        dest: 'js/main.min.js'
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/style.css': 'css/lib/style.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 9']
      },
      target: {
        src: 'css/style.css'
      }
    },
    watch: {
      scripts: {
        files: ['js/lib/*.js'],
        tasks: ['concat','uglify'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['css/lib/*.scss'],
        tasks: ['sass','autoprefixer'],
        options: {
          spawn: false,
        }
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.registerTask('default', ['concat','uglify','sass','autoprefixer','watch']);

};
