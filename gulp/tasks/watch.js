'use strict';

var config = require('../config');
var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var log = plug.util.log;

gulp.task('watch', [ 'browserSync', 'server' ], function() {
    gulp.watch(config.scripts.src, [ 'js', 'vendorjs' ]);
    gulp.watch(config.styles.src, [ 'styles' ]);
    gulp.watch(config.images.src, [ 'images' ]);
    gulp.watch(config.views.watch, [ 'views' ]);

    function logWatch(event) {
        log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    }
});
