module.exports = class {
  constructor(data, obj) {
    this.obj = obj;
    this.num = data.num || 0;
    console.log(require('../lib/config'));
  }
  onEvent(ev) {
    this.num++;
    console.log(this.num);
  }
  async save() {
    return { num: this.num };
  }
}
