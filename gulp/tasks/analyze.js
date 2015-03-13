'use strict';

var gulp = require('gulp');
var config = require('../config');
var jshint = require('gulp-jshint');
var merge = require('merge-stream');
var plug = require('gulp-load-plugins')();

gulp.task('analyze', function() {
    var jshintTests = analyzejshint([].concat('test/**/*.spec.js'), 'test/.jshintrc');
    var jshint = analyzejshint([].concat(config.js.src, '!app/js/templates.js', '!test/**/*.spec.js', '!app/js/lib/*.js'), '.jshintrc');
    var jscs = analyzejscs([].concat(config.js.src, '!app/js/templates.js', '!app/js/lib/*.js'));

    return merge(jshintTests, jshint, jscs);
});

/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {string} jshintrc - file
 * @return {Stream}
 */
function analyzejshint(sources, jshintrc) {
    return gulp
        .src(sources)
        .pipe(plug.jshint(jshintrc))
        .pipe(plug.jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    return gulp
        .src(sources)
        .pipe(plug.jscs('./.jscsrc'));
}
