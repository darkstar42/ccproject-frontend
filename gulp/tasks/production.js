'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('prod', [ 'clean' ], function(callback) {
    callback = callback || function() {};

    global.isProd = true;

    runSequence([ 'fonts', 'vendorcss', 'css', 'images', 'views', 'vendorjs', 'js' ], 'gzip', callback);
});
