CREATE DATABASE user COLLATE utf8mb4_unicode_ci;
USE user;
CREATE USER 'user' IDENTIFIED BY '123456';
GRANT ALL ON user.* TO 'user';
CREATE TABLE users (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	uid VARCHAR(255) UNIQUE,
	username VARCHAR(255) UNIQUE,
	password BLOB
);

CREATE DATABASE problem COLLATE utf8mb4_unicode_ci;
USE problem;
CREATE USER 'problem' IDENTIFIED BY '123456';
GRANT ALL ON problem.* TO 'problem';
CREATE TABLE problems (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	uid VARCHAR(255) UNIQUE,
	owner_user_uid VARCHAR(255),
	info JSON,
	INDEX (owner_user_uid)
);

