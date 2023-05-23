FROM node:12.18.0-alpine3.11 as node_base

FROM node_base as dependencies
WORKDIR /usr/etc/app

COPY ./cms-core/dfn-cms-shared/packages/ ./shared-packages
COPY ./cms-core/dfn-cms-shared/services/ ./shared-services

RUN mkdir -p ./build-packages/error-handler/
RUN mkdir -p ./build-services/logger-service/
RUN cp -R ./shared-packages/error-handler/* ./build-packages/error-handler/
RUN cp -R ./shared-services/logger-service/* ./build-services/logger-service/

RUN cd ./build-packages/error-handler && \
        npm i --only=prod

RUN cd ./build-services/logger-service && \
        npm i --only=prod

COPY ./cms-core/dfn-cms-shared/ui-components ./shared/ui-components
COPY ./kw_bk_ui_components ./shared/kw_bk_ui_components
COPY ./eop_ui_components  ./shared/eop_ui_components

RUN cd ./shared/kw_bk_ui_components && \
    npm i && \
    npm run build

RUN cd ./shared/eop_ui_components && \
    npm i && \
    npm run build

RUN cd ./shared/ui-components && \
    npm i && \
    mkdir -p ./node_modules/bk-specific-ui-components/ && \
    cp -R ./../kw_bk_ui_components/build/* ./node_modules/bk-specific-ui-components && \
    mkdir -p ./node_modules/eop-ui-components/ && \
    cp -R ./../eop_ui_components/build/* ./node_modules/eop-ui-components && \
    cd ./ui-gatsby && \
    npm i && \
    npm run docker-build

FROM node_base as image_build
WORKDIR /usr/etc/app
COPY ./cms-core/dfn-cms/services/site-publisher-service/package.json ./
RUN npm install --ignore-scripts --only=prod --unsafe-perm
RUN npm install sharp --unsafe-perm
COPY --from=dependencies /usr/etc/app/build-packages/ ./node_modules
COPY --from=dependencies /usr/etc/app/build-services/ ./node_modules
COPY --from=dependencies /usr/etc/app/shared/ui-components/gatsby-build/ ./node_modules/ui-components
COPY ./cms-core/dfn-cms-shared/ck-editor/ckeditor5-build-classic ./node_modules/ckeditor5-build-classic
COPY ./cms-core/dfn-cms/services/site-publisher-service/ ./
RUN mkdir -p ./logs/
RUN mkdir -p ./archive/
RUN mkdir -p ./public/

CMD ["npm", "run", "docker-start"]
