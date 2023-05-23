#!/bin/bash
cd ../docker-images-web
docker load -i redis.tar
docker load -i app-web-router.tar.tar
docker load -i app-site-manager.tar
docker load -i app-auth.tar
docker load -i app-dynamic-content.tar
docker load -i ftp-server.tar
docker swarm init


