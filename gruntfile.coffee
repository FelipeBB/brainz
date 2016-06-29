module.exports = (grunt) ->
  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    clean:
      release: 'dist'

    mochaTest:
      options:
        reporter: 'spec'
      src: 'test/**/*-test.js'

    uglify:
      options:
        mangle: false
      release:
        files:
          'dist/brainz.min.js': ['dist/brainz.js']

    browserify:
      options:
        browserifyOptions:
          standalone: 'Brainz'
      release:
        src: ['brainz.js']
        dest: 'dist/brainz.js'

  require('load-grunt-tasks')(grunt)

  grunt.registerTask 'test', ['mochaTest']

  grunt.registerTask 'release', ['test', 'clean:release', 'browserify:release','uglify:release']
