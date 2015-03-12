'use strict';

var config = require('../config');
var gulp = require('gulp');
var karma = require('gulp-karma');

gulp.task('unit', function() {
    return gulp
        .src('./nonexistingfile')
        .pipe(karma({
            configFile: config.test.karma,
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});
