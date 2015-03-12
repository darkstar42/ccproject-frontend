'use strict';

module.exports = {
    'serverport': 3000,
    'scripts': {
        'src': 'app/js/**/*.js',
        'dest': 'build/js'
    },
    'images': {
        'src': 'app/images/**/*',
        'dest': 'build/images'
    },
    'views': {
        'watch': [
            'app/index.html',
            'app/views/**/*.html'
        ],
        'src': 'app/views/**/*.html',
        'dest': 'app/js'
    },
    'gzip': {
        'src': 'build/**/*.{html,xml,json,css,js,js.map',
        'dest': 'build/',
        'options': {}
    },
    'dist': {
        'root': 'build'
    },
    'browserify': {
        'entries': [ './app/js/ccfrontend.module.js' ],
        'bundleName': 'ccfrontend.js',
        'sourcemap': true
    },
    'js': {
        'src': [
            'app/**/*module*.js',
            'app/**/*.js'
        ],
        'dest': 'build/js/',
        'bundleName': 'ccfrontend.js'
    },
    'vendorjs': {
        'src': [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-bootstrap/dist/ui-bootstrap.min.js'
        ],
        'dest': 'build/js/',
        'bundleName': 'vendor.js'
    },
    'css': {
        'src': 'app/styles/**/*.scss',
        'dest': 'build/css/',
        'bundleName': 'ccfontend.css'
    },
    'vendorcss': {
        'src': [

        ],
        'dest': 'build/css/',
        'bundleName': 'vendor.css'
    },
    'test': {
        'karma': 'test/karma.conf.js',
        'protractor': 'test/protactor.conf.js'
    }
};
