'use strict';

var istanbul = require('browserify-istanbul');

module.exports = function(config) {
    config.set({
        basePath: '../',

        frameworks: [ 'mocha', 'chai', 'sinon', 'chai-sinon' ],

        files: [
            './app/js/ccfrontend.module.js',
            './app/js/**/*.module.js',
            './app/js/**/*.js',

            './test/unit/*.js'
        ],

        exclude: [
        
        ],

        proxies: {
            '/': 'http://localhost:9876/'
        },

        urlRoot: '/_karma_/',

        preprocessors: {
            './app/js/**/*.js': 'coverage'
        },

        reporters: [ 'progress' ],

        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage'
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: [ 'PhantomJS' ],

        singleRun: true
    });
};
