#!/bin/bash
ng.cmd build --prod --aot
aws s3 rm s3://dashboard-uat.alethena.com/ --recursive
aws s3 cp ./dist/ s3://dashboard-uat.alethena.com/ --recursive