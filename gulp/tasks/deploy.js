'use strict';

var config = require('../config');
var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('deploy', [ 'prod' ], shell.task([
    'rm -Rf /tmp/deploy',
    'mkdir -p /tmp/deploy/opt/ccproject-frontend',
    'cp -pR ' + config.dist.root + '/* /tmp/deploy/opt/ccproject-frontend',
    'rm -f *.deb',
    'fpm -s dir -t deb -C /tmp/deploy --name ccproject-frontend --version 0.0.1 --iteration build-$TRAVIS_BUILD_NUMBER .',
    'chmod 0600 deploy_key',
    'scp -i deploy_key -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null *.deb deployment@puppet.cc.gernox.de:/tmp/'
]));
