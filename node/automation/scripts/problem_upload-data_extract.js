const request = require('request');

module.exports = class {
  constructor(obj) {
    this.obj = obj;
  }
  async onEvent(ev) {
    return new Promise((resolve, reject) => {
      if(ev.problem_data && ev.problem_data.uid) {
        request.post({
          url: this.obj.httpProblemData + `/problem-data/${ev.problem_data.uid}/extract`,
          json: true
        }, (err, res, body) => {
          if(err) {
            reject(err);
          } else if(body.error) {
            reject(new Error(`Failed to extract: ${ev.problem_data.uid}: ${body.error}`));
          } else {
            resolve();
          }
        });
      }
    });
  }
}
