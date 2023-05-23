FROM node:12.18.0-alpine3.11 as node_base
WORKDIR /usr/etc/app
CMD ["npm", "run", "docker-start"]
