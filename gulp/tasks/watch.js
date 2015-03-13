'use strict';

var config = require('../config');
var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var log = plug.util.log;

gulp.task('watch', [ 'browserSync', 'server' ], function() {
    gulp.watch(config.scripts.src, [ 'js' ], logWatch);
    gulp.watch(config.css.src, [ 'css' ], logWatch);
    gulp.watch(config.images.src, [ 'images' ], logWatch);
    gulp.watch(config.views.watch, [ 'views' ], logWatch);

    function logWatch(event) {
        log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    }
});
