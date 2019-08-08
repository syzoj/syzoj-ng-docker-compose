#!/bin/bash
set -e
[[ -f DIRTY ]] && exit
echo "Performing first-time installation"
while ! mysqladmin ping -h"$PROBLEM_MYSQL_ADDR" -uroot -p123456; do
	sleep 1
done
echo "Setting up MySQL"
mysql -uroot -p123456 -h"$PROBLEM_MYSQL_ADDR" < install.sql
echo "Setting up Elasticsearch"
while ! curl "$ELASTIC_ADDR" ; do
	sleep 1
done
curl -XPUT "$ELASTIC_ADDR/problem" --header "Content-Type: application/json" --data '
{
	"settings": {
		"index": {
			"analysis": {
				"analyzer": {
					"default": {
						"type": "smartcn"
					}
				}
			}
		}
	}
}'
echo "Setup done!"
touch DIRTY
