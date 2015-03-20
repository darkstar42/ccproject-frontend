#!/bin/bash

if [[ $TRAVIS_BRANCH == 'production' ]]; then
    rm -Rf /tmp/deploy
    mkdir -p /tmp/deploy/opt/ccproject-frontend
    cp -pR ./build/* /tmp/deploy/opt/ccproject-frontend
    rm -f *.deb
    fpm -s dir -t deb -C /tmp/deploy --name ccproject-frontend --version 0.0.1 --iteration build-$TRAVIS_BUILD_NUMBER .

    scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null *.deb deployment@puppet.cc.gernox.de:/tmp/
fi
