FROM node:12.18.0-alpine3.11 as node_base
WORKDIR /usr/etc/app
COPY ./cms-core/dfn-cms-shared/ui-components ./shared/ui-components
COPY ./kw_bk_ui_components ./shared/kw_bk_ui_components
COPY ./eop_ui_components   ./shared/eop_ui_components

RUN cd ./shared/kw_bk_ui_components && \
    npm i && \
    npm run build

RUN cd ./shared/eop_ui_components && \
    npm i && \
    npm run build

RUN cd ./shared/ui-components && \
    npm i && \
    mkdir -p ./node_modules/bk-specific-ui-components/ && \
    cp -R ./../../shared/kw_bk_ui_components/build/* ./node_modules/bk-specific-ui-components && \
    mkdir -p ./node_modules/eop-ui-components/ && \
    cp -R ./../../shared/eop_ui_components/build/* ./node_modules/eop-ui-components && \
    npm run docker-build


WORKDIR client
COPY ./cms-core/dfn-cms/client/package.json ./
RUN npm i
COPY ./cms-core/dfn-cms/client/ ./

RUN mkdir -p ./node_modules/ui-components/ && \
    cp -R ./../shared/ui-components/build/* ./node_modules/ui-components/

COPY ./cms-core/dfn-cms/themes ./node_modules/themes
COPY ./cms-core/dfn-cms-shared/ck-editor/ckeditor5-build-classic ./node_modules/ckeditor5-build-classic

RUN export NODE_OPTIONS=--max_old_space_size=4096 &&\
    npm run build

FROM nginx:1.19.0-alpine as nginx_base
COPY --from=node_base /usr/etc/app/client/build/ /usr/share/nginx/html
COPY ./cms-core/config/nginx.conf /etc/nginx/nginx.conf
