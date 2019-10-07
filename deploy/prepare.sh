#!/bin/bash
SECRET=$(dd if=/dev/urandom | tr -dc A-Za-z0-9 | head -c${1:-16})
sed -i "s/@SESSION_SECRET@/$SECRET/g" config/web.json
sed -i "s/@JUDGE_TOKEN@/$SECRET/g" config/web.json
sed -i "s/@JUDGE_TOKEN@/$SECRET/g" config/daemon.json
sed -i "s/@EMAIL_JWT_SECRET@/$SECRET/g" config/web.json
