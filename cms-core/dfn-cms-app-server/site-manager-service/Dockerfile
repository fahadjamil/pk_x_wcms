FROM node:12.18.0-alpine3.11 as node_base

FROM node_base as dependencies
RUN npm install -g gulp-cli
WORKDIR /usr/etc/app

COPY ./cms-core/dfn-cms-shared/packages/ ./shared-packages
COPY ./cms-core/dfn-cms-shared/services/ ./shared-services

RUN mkdir -p ./build-packages/error-handler/
RUN mkdir -p ./build-services/logger-service/
RUN mkdir -p ./build-packages/cache/

RUN cd ./shared-packages/cache && \
    npm i && \
    gulp build && \
    cp -R ./dist/* ./../../build-packages/cache/
RUN cp -R ./shared-packages/error-handler/* ./build-packages/error-handler/
RUN cp -R ./shared-services/logger-service/* ./build-services/logger-service/

RUN cd ./build-packages/error-handler && \
        npm i --only=prod

RUN cd ./build-packages/cache && \
        npm i --only=prod

RUN cd ./build-services/logger-service && \
        npm i --only=prod


FROM node_base as image_build
WORKDIR /usr/etc/app
COPY ./cms-core/dfn-cms-app-server/site-manager-service/package.json ./
RUN npm i --only=prod
COPY --from=dependencies /usr/etc/app/build-packages/ ./node_modules
COPY --from=dependencies /usr/etc/app/build-services/ ./node_modules
COPY ./cms-core/dfn-cms-app-server/site-manager-service/ ./
RUN mkdir -p ./logs/
RUN mkdir -p ./downloads/
RUN mkdir -p ./static_pages/
CMD ["npm","run", "docker-start"]

