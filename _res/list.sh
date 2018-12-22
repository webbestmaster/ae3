#!/usr/bin/env bash

# import solider from './i/unit/soldier-black.png';

for entry in *
do
    #  echo "import ${entry//\.png/} from './i/unit/$entry';"
    echo "'${entry//\.png/}': ${entry//\.png/},"
done
