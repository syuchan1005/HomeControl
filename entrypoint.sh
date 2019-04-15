#!/usr/bin/env sh

diff -q <(envsubst < Config.template.js) Config.js > /dev/null
if [ ! $? = 0 ] ; then
    envsubst < Config.template.js > Config.js
    npm install
    npm run build
fi

npm start
