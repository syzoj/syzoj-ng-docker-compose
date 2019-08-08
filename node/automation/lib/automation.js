"use strict";

const util = require('util');
const path = require('path');

class Automation {
  constructor(objects) {
    this.tasks = {};
    this.tagTasks = {};
    this.objects = Object.assign({
      automation: this
    }, objects || {});
  }
  onError(err) {
    console.error(err);
  }
  trigger(ev) {
    setImmediate(() => {
      let tags = ev.tags;
      if(typeof tags === 'string')
        tags = [tags];
      let taskSet = {};
      tags.forEach(tag => {
        if(this.tagTasks[tag]) {
          this.tagTasks[tag].forEach(taskId => { taskSet[taskId] = null; });
        }
      });
      for(let taskId in taskSet) {
        let promise = this.tasks[taskId].onEvent(ev);
        if(promise && promise instanceof Promise)
          promise.catch(err => this.onError(err));
      }
    });
  }
  addTask(taskId, taskClass, tags) {
    let task = new taskClass(this.objects);
    task.handler = new AutomationHandler(this, taskId);
    this.tasks[taskId] = task;
    tags.forEach(tag => {
      (this.tagTasks[tag] = this.tagTasks[tag] || []).push(taskId);
    });
  }
}

class AutomationHandler {
  constructor(aut, taskId) {
    this.aut = aut;
    this.taskId = taskId;
  }
  onError(err) {
    this.aut.onError(err);
  }
}
module.exports = Automation;
