#!/bin/bash
cd ../dump
mongorestore --host localhost dump/ --drop 

