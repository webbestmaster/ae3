#!/usr/bin/env bash

rm -r ./_front/www/_main
rm -r ./_back/_main

cp -r ./_main/ ./_front/www/_main
cp -r ./_main/ ./_back/_main

echo "Files has been coped";
