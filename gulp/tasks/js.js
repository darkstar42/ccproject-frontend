'use strict';

var config = require('../config');
var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

gulp.task('js', [ 'analyze' ], function () {
    var source = [].concat(config.js.src);

    return gulp
        .src(source)
        .pipe(plug.concat(config.js.bundleName))
        .pipe(plug.ngAnnotate({ add: true, single_quotes: true }))
        //.pipe(plug.bytediff.start())
        //.pipe(plug.uglify({ mangle: true }))
        //.pipe(plug.bytediff.stop())
        .pipe(gulp.dest(config.js.dest));
});

gulp.task('vendorjs', function() {
    return gulp
        .src(config.vendorjs.src)
        .pipe(plug.concat(config.vendorjs.bundleName))
        //.pipe(plug.bytediff.start())
        //.pipe(plug.uglify({ mangle: true }))
        //.pipe(plug.bytediff.stop())
        .pipe(gulp.dest(config.vendorjs.dest));
});
