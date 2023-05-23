#!/bin/bash
cd ../docker-images-cms
docker load -i redis.tar
docker load -i headless-cms-service.tar
docker load -i web-router-service.tar
docker load -i cms-admin-console.tar
docker load -i cms-auth-service.tar
docker load -i site-publisher-service.tar
docker swarm init


