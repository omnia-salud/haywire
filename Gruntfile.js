module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    typescript: {
      base: {
        src: ['src/haywire.ts', 'src/haywire_tests.ts'],
        dest: 'build',
        options: {
          module: 'amd',
          target: 'es5',
          basePath: 'src'
        }
      }
    },
    mocha: {
      all: {
        src: ['test/test_runner.html'],
      },
      options: {
        reporter: 'Spec',
        run: true
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

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['typescript', 'mocha', 'uglify', 'compress']);
  grunt.registerTask('test', ['typescript', 'mocha']);

};
