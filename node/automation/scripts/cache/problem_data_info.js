const request = require('request');
const cache = require('../../lib/cache');

module.exports = class {
  constructor(obj) {
    this.obj = obj;
  }
  async onEvent(ev) {
    return new Promise((resolve, reject) => {
      if(ev.problem_data && ev.problem_data.uid) {
        request.get({
          url: this.obj.httpProblemData + `/problem-data/id/${ev.problem_data.uid}/parse-data`,
          json: true
        }, (err, res, body) => {
          if(err) {
            reject(err);
          } else if(body.error) {
            reject(new Error(`Failed to parse data for ${ev.problem_data.uid}: ${body.error}`));
          } else {
            cache.setKey(this.obj.redisCache, `problem-data:${ev.problem_data.uid}:info`, JSON.stringify(body.info), 14400).then(resolve, reject);
          }
        });
      }
    });
  }
}
