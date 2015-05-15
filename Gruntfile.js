module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    typescript: {
      base: {
        src: ['src/haywire.ts'],
        dest: 'build',
        options: {
          module: 'amd',
          target: 'es5',
          basePath: 'src'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/haywire.js',
        dest: 'build/haywire.min.js'
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip',
          level: 9
        },
        files: [
          {expand: true, src: ['build/*.min.js'], dest: '', ext: '.gz.js'}
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['typescript', 'uglify', 'compress']);

};