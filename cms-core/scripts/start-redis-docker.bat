title = redis-service
echo off
cd ../
docker-compose -f docker-compose-dev.yml up -d redis-service
