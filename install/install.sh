#!/bin/bash
set -e
[[ -f DIRTY ]] && exit
echo "Performing first-time installation"
while ! mysqladmin ping -h"$PROBLEM_MYSQL_ADDR" -uroot -p123456; do
	sleep 1
done
echo "Setting up MySQL"
mysql -uroot -p123456 -h"$PROBLEM_MYSQL_ADDR" <<EOF
CREATE DATABASE syzoj COLLATE utf8mb4_unicode_ci;
USE syzoj;
CREATE TABLE problems (id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), statement TEXT);
CREATE TABLE problem_tags (id BIGINT PRIMARY KEY AUTO_INCREMENT, problem_id VARCHAR(255) NOT NULL, tag VARCHAR(255) NOT NULL, name VARCHAR(255), FOREIGN KEY (problem_id) REFERENCES problems(id));
CREATE TABLE problem_events (data BLOB) ENGINE=BLACKHOLE;
CREATE USER 'syzoj' IDENTIFIED BY '123456';
GRANT ALL ON syzoj.* TO 'syzoj';
GRANT REPLICATION CLIENT ON *.* TO 'syzoj';
GRANT REPLICATION SLAVE ON *.* TO 'syzoj';
GRANT RELOAD ON *.* to 'syzoj';
EOF
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
