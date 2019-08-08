const request = require('request');

module.exports = class {
  constructor(obj) {
    this.obj = obj;
  }
  async onEvent(ev) {
    return new Promise((resolve, reject) => {
      if(ev.problem && ev.problem.uid) {
        request.post({
          url: this.obj.httpProblemData + `/problem/${ev.problem.uid}/extract`,
          json: true,
          body: {}
        }, (err, res, body) => {
          if(err) {
            reject(err);
          } else if(body.error) {
            reject(new Error("Failed to extract: " + String(body.error)));
          } else {
            resolve();
          }
        });
      }
    });
  }
}
