'use strict';

var config = require('../config');
var gulp = require('gulp');
var sass = require('gulp-sass');
var handleErrors = require('../utils/handleErrors');
var browserSync = require('browser-sync');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var plug = require('gulp-load-plugins')();

gulp.task('css', [ 'vendorcss' ], function() {
    return gulp
        .src(config.css.src)
        .pipe(sass({
            sourceComments: global.isProd ? 'none' : 'map',
            sourceMap: 'sass',
            outputStyle: global.isProd ? 'compressed' : 'nested'
        }))
        .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.css.dest))
        .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true })));
});

gulp.task('vendorcss', function() {
    return gulp
        .src(config.vendorcss.src)
        .pipe(plug.concat(config.vendorcss.bundleName))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss({}))
        .pipe(plug.bytediff.stop())
        .pipe(gulp.dest(config.vendorcss.dest));
});
