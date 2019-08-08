const path = require('path');
const express = require('express');
const body_parser = require('body-parser');
const redis = require('redis');
const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
const yaml = require('js-yaml');
const elasticsearch = require('@elastic/elasticsearch');

const Automation = require('./lib/automation');
const config = require('./lib/config');

const redisCache = redis.createClient(config.getRedis("CACHE"));
redisCache.getAsync = util.promisify(redisCache.get);
redisCache.setAsync = util.promisify(redisCache.set);
const dbUser = mysql.createPool(config.getMySQL("USER"));
dbUser.queryAsync = util.promisify(dbUser.query);
const dbProblem = mysql.createPool(config.getMySQL("PROBLEM"));
dbProblem.queryAsync = util.promisify(dbProblem.query);
const httpProblemData = config.getHttpUrl("PROBLEM_DATA");
const esProblem = new elasticsearch.Client(config.getElasticsearch("PROBLEM"));
let auto = new Automation({
  redisCache: redisCache,
  dbUser: dbUser,
  dbProblem: dbProblem,
  httpProblemData: httpProblemData,
  esProblem: esProblem
});

const task_config = yaml.safeLoad(fs.readFileSync("settings.yml", "utf8"));
task_config.tasks.forEach((task, id) => {
  auto.addTask(String(id), require('./scripts/'+task.script), task.tags);
});

let app = express();
// JSON body limit: 100kb
// Requires Content-Type: application/json
app.post('/trigger', body_parser.json(), (req, res) => {
  console.log(req.body);
  auto.trigger(req.body);
  res.sendStatus(204);
});
app.listen(config.getHttpListenPort(), () => console.log("Listening"));
module.exports.app = app;
