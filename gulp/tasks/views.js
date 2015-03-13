'use strict';

var config = require('../config');
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');

gulp.task('views', function() {
    // Put the index.html in the dist folder
    gulp
        .src('app/index.html')
        .pipe(gulp.dest(config.dist.root));

    // Process any other view files from app/views
    return gulp
        .src(config.views.src)
        .pipe(templateCache({
            module: 'ccfrontend.templates',
            standalone: true,
            root: 'app/'
        }))
        .pipe(gulp.dest(config.views.dest));
});
