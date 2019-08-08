const cache = require('../../lib/cache');

module.exports = class {
  constructor(obj) {
    this.obj = obj;
  }
  async onEvent(ev) {
    if(ev.problem && ev.problem.uid) {
      let problemId = ev.problem.uid;
      let results = await this.obj.dbProblem.queryAsync("SELECT info FROM problems WHERE uid=?", [problemId]);
      let val;
      if(results[0]) {
        let row = results[0];
        val = { info: JSON.parse(row.info) };
      } else {
        val = { deleted: true };
      }
      await cache.setKey(this.obj.redisCache, `problem:${problemId}:info`, JSON.stringify(val), 14400);
      this.obj.automation.trigger({
        tags: ["cache/problem/*/info/loaded"],
        problem: { uid: problemId }
      });
    }
  }
}
