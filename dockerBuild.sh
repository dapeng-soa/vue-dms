#!/bin/bash
echo "==== commit id ====="
gid=$(git rev-parse --short=7 HEAD)
echo $gid
echo -e "runing [cnpm || npm install]······"
cnpm install || { echo -e "run [cnpm install] faild, try run [ npm install ]"; npm install; };
echo "==== runing [npm run build] ===="
npm run build || { echo -e "run [npm run build] faild, exit"; exit 1; };
echo "==== copy dist to docker/apps ===="
mkdir docker/apps
cp -R dist docker/apps
cd docker
docker build -t docker.today36524.com.cn:5000/basic/dapeng-mock-dms:2.1.1 .
echo "==== clear apps ===="
rm -rf apps
echo "==== successful build! ===="