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
        let info = JSON.parse(row.info);
        val = {
          summary: {
            title: info.title
          }
        };
      } else {
        val = { deleted: true };
      }
      await cache.setKey(this.obj.redisCache, `problem:${problemId}:summary`, JSON.stringify(val), 14400);
      this.obj.automation.trigger({
        tags: ["cache/problem/*/summary/loaded"],
        problem: { uid: problemId }
      });
    }
  }
}
