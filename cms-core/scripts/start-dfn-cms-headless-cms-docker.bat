title = dfn-cms-dev/headless-cms-service
echo off
cd ../
docker-compose -f docker-compose-dev.yml up -d headless-cms-service
