#!/bin/bash
#
#
#

APP_ENV=qa
IMAGE_VERSION=4.2.0-beat04-${APP_ENV}
IMAGE_NAME=mislbd/ababil-ng-ui:${IMAGE_VERSION}
DOCKER_REGISTRY_TAG=172.16.190.13:5000/${IMAGE_NAME}

npm install

if [ $? -ne 0 ]; then
    echo "dependency install failed !!!"
    exit 1
fi

BUILD_START_TIME=$(date)

#npm rebuild node-sass
npm --max_old_space_size=3072 run pre-build
node --max_old_space_size=3072 $(which ng) build --env=${APP_ENV} --prod --stats-json

echo "return value: $?"

if [ $? -ne 0 ]; then
    echo "build failed !!!"
    exit 1
fi

BUILD_END_TIME=$(date)

echo "App build start: $BUILD_START_TIME"
echo "App build finish: $BUILD_END_TIME"
echo "."
echo "."
echo "."

echo "Creating image: ${IMAGE_NAME}"
docker build -t ${IMAGE_NAME} .
echo "Creating tag: ${DOCKER_REGISTRY_TAG}"
docker tag ${IMAGE_NAME} ${DOCKER_REGISTRY_TAG}
echo "Pushing tag: ${DOCKER_REGISTRY_TAG}"
docker push ${DOCKER_REGISTRY_TAG}
