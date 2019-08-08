CREATE TABLE tasks (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	script_name VARCHAR(255) NOT NULL,
	data TEXT,
	trigger_time DATETIME,
	INDEX trigger_time (trigger_time)
);
CREATE TABLE task_tags (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
	task_id BIGINT,
	tag VARCHAR(255),
	UNIQUE task_tag (task_id, tag),
	FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
