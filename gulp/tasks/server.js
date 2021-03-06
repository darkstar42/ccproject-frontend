'use strict';

var config = require('../config');
var gulp = require('gulp');
var http = require('http');
var express = require('express');
var gutil = require('gulp-util');
var morgan = require('morgan');

gulp.task('server', function () {
    var server = express();

    // Log all requests to the console
    server.use(morgan('dev'));
    server.use(express.static(config.dist.root));

    // Serve index.html for all routes to leave routing up to Angular
    server.all('/*', function(req, res) {
        res.sendFile('index.html', { root: 'build' });
    });

    // Start web server if not already running
    var s = http.createServer(server);

    s.on('error', function(err) {
        if (err.code === 'EADDRINUSE') {
            gutil.log('Development server is already started at port ' + config.serverport);
        } else {
            throw err;
        }
    });

    s.listen(config.serverport);
});
