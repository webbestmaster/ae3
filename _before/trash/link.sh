#!/usr/bin/env bash

cd ./_front/www/
ln -s ./../../_main/

cd ./../../_back/
ln -s ./../_main/

echo "Symlink has been created."
