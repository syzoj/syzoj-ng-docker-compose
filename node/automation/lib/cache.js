const util = require('util');

async function setKey(redisCache, key, value, expire) {
  let multi = redisCache.multi()
    .del(key)
    .lpush(key, value)
    .expire(key, expire);
  multi.execAsync = util.promisify(multi.exec);
  return await multi.execAsync();
}
module.exports.setKey = setKey;

async function waitForKey(redisCache, key, timeout) {
  redisCache.brpoplpushAsync = util.promisify(redisCache.brpoplpush);
  return await redisCache.brpoplpushAsync(key, key, timeout);
}
module.exports.waitForKey = waitForKey;
