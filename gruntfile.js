/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

/* eslint camelcase: [2, { properties: "never" }] */
'use strict';


module.exports = function tasks(grunt) {
  // Enable stack trace
  grunt.option('stack', true);
  grunt.option('force', true);

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    script_bundle_src: 'client/js/main.js',
    script_bundle_intermediate: 'build/js/bundle.js',
    script_bundle_dest: 'build/bundle.js',

    style_bundle_src: 'client/css/main.less',
    style_bundle_dest: 'build/bundle.css',

    eslint: {
      client: ['client'],
    },

    clean: {
      all: ['build/'],
    },

    browserify_transform_dev: [
      ['babelify', { loose: ['es6.destructuring', 'es6.properties.computed'] }],
      ['bulkify'],
      ['envify', { global: true, _: 'purge' }],
      ['source-map-path-normalizify'],
    ],

    browserify_transform_prod: [
      ['babelify', { loose: ['es6.destructuring', 'es6.properties.computed'] }],
      ['bulkify'],
      ['envify', { global: true, _: 'purge', NODE_ENV: 'production' }],
    ],

    browserify: {
      dev: {
        options: {
          browserifyOptions: { debug: true },
          transform: '<%= browserify_transform_dev %>',
          watch: true,
        },
        src: '<%= script_bundle_src %>',
        dest: '<%= script_bundle_dest %>',
      },

      prod: {
        options: {
          browserifyOptions: { fullPaths: false },
          transform: '<%= browserify_transform_prod %>',
        },
        src: '<%= script_bundle_src %>',
        dest: '<%= script_bundle_intermediate %>',
      },
    },

    uglify: {
      prod: {
        src: '<%= script_bundle_intermediate %>',
        dest: '<%= script_bundle_dest %>',
      },
    },

    less: {
      options: {
        strictMath: true,
        strictUnits: true,
      },

      dev: {
        options: {
          plugins: [
            new (require('less-plugin-autoprefix'))(),
          ],
          sourceMap: true,
          sourceMapRootpath: '/',
          sourceMapFileInline: true,
          outputSourceFiles: true,
        },
        src: '<%= style_bundle_src %>',
        dest: '<%= style_bundle_dest %>',
      },

      prod: {
        options: {
          plugins: [
            new (require('less-plugin-autoprefix'))(),
            new (require('less-plugin-clean-css'))({
              compatibility: {
                units: {
                  in: false,
                  pc: false,
                  pt: false,
                },
              },
            }),
          ],
        },
        src: '<%= style_bundle_src %>',
        dest: '<%= style_bundle_dest %>',
      },
    },

    jade: {
      all: {
        src: 'client/templates/index.jade',
        dest: 'build/index.html',
      },
    },

    watch: {
      static: {
        files: ['<%= script_bundle_dest %>'],
      },
      client_scripts: {
        files: ['client/**/*.js'],
        tasks: ['eslint:client'],
      },
      client_styles: {
        files: ['client/**/*.less'],
        tasks: ['less:dev'],
      },
      templates: {
        files: ['client/templates/**/*.jade'],
        tasks: ['jade'],
      },
    },
  });

  // The default task, for development
  grunt.registerTask('default', ['run-dev']);

  // Development tasks
  grunt.registerTask('build-dev', [
    'eslint',
    'clean',
    'browserify:dev',
    'less:dev',
    'jade',
  ]);

  grunt.registerTask('run-dev', [
    'build-dev',
    'watch',
  ]);

  // Production tasks
  grunt.registerTask('build-prod', [
    'eslint',
    'clean',
    'browserify:prod',
    'uglify:prod',
    'less:prod',
    'jade',
  ]);
};
