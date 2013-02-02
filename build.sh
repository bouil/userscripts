#!/usr/bin/env bash

sprockets

FILES=`find target -name "*.js"`
for f in $FILES
do
    NEW_NAME=`echo $f|sed -e 's/\(.*\)-\(.*\)\.js/\1.js/'`
    mv -v "$f" $NEW_NAME
done
