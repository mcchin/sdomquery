module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['dist/sdomquery.js'], dest: 'test/lib/'}
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/sdomquery.js']
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/sdomquery.js': ['src/main.js'],
        },
        options: {
          debug: true
        }
      }
    },
    karma: {
      local: {
        configFile: 'test/karma.conf.js'
      },
      sauce: {
        configFile: 'test/karma-sauce.conf.js'
      }
    },
    jshint: {
      files: ['src/**/*.js'],
      options: {
        globals: {
          DomQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['jshint', 'browserify', 'copy', 'karma:local']);
  grunt.registerTask('compile', ['jshint', 'browserify', 'copy', 'uglify']);
  grunt.registerTask('build', ['jshint', 'browserify', 'copy', 'karma:local', 'uglify']);
  grunt.registerTask('default', ['jshint', 'browserify', 'copy', 'karma:sauce', 'uglify']);

};
