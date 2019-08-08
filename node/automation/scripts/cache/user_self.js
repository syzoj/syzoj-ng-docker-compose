const cache = require('../../lib/cache');

module.exports = class {
  constructor(obj) {
    this.obj = obj;
  }
  async onEvent(ev) {
    if(ev.user && ev.user.uid) {
      let userId = ev.user.uid;
      let results = await this.obj.dbUser.queryAsync("SELECT username FROM users WHERE uid=?", [userId]);
      let val;
      if(results[0]) {
        let row = results[0];
        val = { username: row.username };
      } else {
        val = { deleted: true };
      }
      await cache.setKey(this.obj.redisCache, `user:${userId}:self`, JSON.stringify(val), 14400);
      this.obj.automation.trigger({
        tags: ["cache/user/*/self/loaded"],
        user: { uid: userId }
      });
    }
  }
}
