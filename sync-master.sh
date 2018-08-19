#!/usr/bin/env bash
#
#
#

IS_MASTER=$(git branch | grep '\* master' | wc -l)

if [[ ${IS_MASTER} -eq "0" ]]; then
  echo "Please switch to master first ...";
  exit 1;
fi

git reset --hard HEAD

git branch -D old-master
git branch -m old-master
git fetch
git checkout master
