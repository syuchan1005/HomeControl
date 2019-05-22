#!/bin/sh

envsubst < Config.template.js | diff -q - Config.js > /dev/null
if [ ! $? = 0 ] ; then
    envsubst < Config.template.js > Config.js
fi

node server
