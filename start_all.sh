#!/bin/bash

cd /server
ls
mongod -f mongo.conf &
go run *.go &
# Wait 2 seconds, just so the chance of something trying to access the database while it is still starting up is lower.
sleep 2
cd ..
cd /image_tagging_app
ls
yarn start
