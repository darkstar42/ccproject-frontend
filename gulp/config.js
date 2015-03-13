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
            'app/js/**/*.html'
        ],
        'src': 'app/js/**/*.html',
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
            'node_modules/angular/angular.js',
            'node_modules/angular-route/angular-route.min.js',
            'node_modules/angular-animate/angular-animate.min.js',
            'node_modules/angular-sanitize/angular-sanitize.min.js',
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/angular-bootstrap/dist/ui-bootstrap.min.js',
            'node_modules/moment/min/moment.min.js',
            'node_modules/toastr/toastr.min.js'
        ],
        'dest': 'build/js/',
        'bundleName': 'vendor.js'
    },
    'css': {
        'src': 'app/css/*.scss',
        'dest': 'build/css/',
        'bundleName': 'ccfrontend.css'
    },
    'vendorcss': {
        'src': [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
            'node_modules/toastr/toastr.min.css'
        ],
        'dest': 'build/css/',
        'bundleName': 'vendor.css'
    },
    'test': {
        'karma': 'test/karma.conf.js',
        'protractor': 'test/protactor.conf.js'
    }
};
