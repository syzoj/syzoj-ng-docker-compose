const cache = require('../lib/cache');

module.exports = class {
  constructor(obj) {
    this.obj = obj;
  }
  async onEvent(ev) {
    if(ev.problem && ev.problem.uid) {
      const problemId = ev.problem.uid;
      const infoData = await cache.waitForKey(this.obj.redisCache, `problem:${problemId}:info`, 5);
      if(!infoData) return;
      const info = JSON.parse(infoData);
      if(info.deleted) {
        await this.obj.esProblem.delete({
          index: "problem",
          id: problemId
        });
      } else {
        await this.obj.esProblem.index({
          index: "problem",
          id: problemId,
          body: info
        });
      }
    }
  }
}
