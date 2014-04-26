#!/bin/bash

cd ~/imprint;

#Activate Submodules
git submodule init
git submodule update

#Node Modules
npm install

#Start Server
forever start start.js
