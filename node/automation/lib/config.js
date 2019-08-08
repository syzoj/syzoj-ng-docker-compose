function getMySQL(name) {
  return {
    host: process.env[name+"_MYSQL_HOST"],
    user: process.env[name+"_MYSQL_USER"],
    password: process.env[name+"_MYSQL_PASSWORD"],
    database: process.env[name+"_MYSQL_DATABASE"]
  };
}
module.exports.getMySQL = getMySQL;

function getHttpListenPort() {
  return parseInt(process.env.HTTP_LISTEN_PORT);
}
module.exports.getHttpListenPort = getHttpListenPort;

function getRedis(name) {
  return {
    host: process.env[name+"_REDIS_HOST"],
    port: process.env[name+"_REDIS_PORT"]
  };
}
module.exports.getRedis = getRedis;

function getHttpURL(name) {
  let url = process.env[name+"_HTTP_URL"];
  if(!url) {
    throw new Error(`Environment variable ${name}_HTTP_URL doesn't exist`);
  }
  if(url.endsWith("/")) {
    console.log(`Warning: Environment variable ${name}_HTTP_URL ends with slash`);
  }
  return url;
}
module.exports.getHttpUrl = getHttpURL;

function getElasticsearch(name) {
  return {
    node: process.env[name+"_ELASTICSEARCH"]
  };
}
module.exports.getElasticsearch = getElasticsearch;
