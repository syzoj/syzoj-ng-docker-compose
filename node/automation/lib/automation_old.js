"use strict";

const mysql = require('mysql');
const util = require('util');
const path = require('path');

class Automation {
  constructor(config, objects) {
    this.pool = mysql.createPool(config.mysql);
    this.pool.queryAsync = util.promisify(this.pool.query);
    this.tasks = {};
    this.scripts = config.scripts;
    this.objects = Object.assign({
      manager: this
    }, objects || {});
    this.timers = {};
    this.loadTimer = null;
    this.loadTimers().catch(err => this.onError(err));
  }
  async loadTimers() {
    if(this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
    let rows = await this.pool.queryAsync("SELECT id, trigger_time FROM tasks WHERE trigger_time IS NOT NULL ORDER BY trigger_time ASC LIMIT 100");
    let curTime = (new Date()).getTime();
    if(!rows[0]) {
      this.loadTimer = setTimeout(() => this.loadTimers().catch(err => this.onError(err)), 5000);
    }
    rows.forEach(row => {
      let id = row.id;
      if(this.timers[id] || this.tasks[id]) return;
      if(!row.trigger_time) return;
      let d = Math.max(0, row.trigger_time.getTime() - curTime);
      this.timers[id] = setTimeout(() => {
        this.loadTask(id, () => {});
        let empty = true;
        for(let prop in this.timers) {
          if(this.timers.hasOwnProperty(prop)) {
            empty = false;
          }
        }
        if(empty) {
          this.loadTimers().catch(err => this.onError(err));
        }
      }, d);
    });
  }
  loadTask(taskId, callback) {
    if(this.timers[taskId]) {
      clearTimeout(this.timers[taskId]);
      delete this.timers[taskId];
    }
    if(this.loadTimer) {
      clearTimeout(this.loadTimer);
      delete this.loadTimer;
    }
    if(!this.tasks[taskId]) {
      this.tasks[taskId] = {
        queue: Promise.resolve(),
        dirty: false,
        timer: setTimeout(() => this.saveTaskTimer(taskId), 5000*(2+Math.random()))
      };
    }
    let task = this.tasks[taskId];
    return task.queue = task.queue.then(() => {
      if(task.obj) {
        return callback(task);
      } else {
        let promise = this.loadTaskPrivate(taskId);
        return promise.then(obj => {
          task.obj = obj;
          return callback(task);
        });
      }
    }).catch(err => this.onError(err));
  }
  async loadTaskPrivate(taskId) {
    let result = await this.pool.queryAsync("SELECT script_name, data FROM tasks WHERE ?", { id: taskId });
    if(!result[0]) throw new Error(`Task ${taskId} doesn't exist`); // this may happen because of race condition
    let row = result[0];
    let klass = require(path.join(this.scripts, row.script_name));
    let task = new klass(JSON.parse(row.data), this.objects);
    task.handler = new AutomationHandler(this, taskId);
    console.log("Loaded task ", taskId);
    return task;
  }
  async saveTaskTimer(taskId) {
    let task = this.tasks[taskId];
    if(!task) {
      throw new Error(`Task ${taskId} was not loaded`);
    }
    task.dirty = false;
    let promise = task.obj.save();
    let data = await promise;
    if(data) {
      let res = JSON.stringify(data);
      let trigger_time = typeof data.trigger_time == 'number' ? new Date(data.trigger_time) : null;
      await this.pool.queryAsync("UPDATE tasks SET data=?, trigger_time=? WHERE id=?", [res, trigger_time, taskId]);
    } else {
      await this.pool.queryAsync("DELETE FROM tasks WHERE id=?", [taskId]);
    }
    let p = task.queue.then(() => {
      if(!task.dirty && p == task.queue) {
        console.log("Saved task: ", taskId);
        delete this.tasks[taskId];
      } else {
        console.log("Updated task: ", taskId);
        task.timer = setTimeout(() => this.saveTaskTimer(taskId), 5000*(2+Math.random()));
      }
    });
    task.queue = p;
    await p;
  }
  onError(err) {
    console.error(err);
  }
  // argument should be a JSON object with 'tag' field and 'data' field
  trigger(data) {
    this.triggerPrivate(data).catch(err => this.onError(err));
  }
  async triggerPrivate(data) {
    if(typeof data.tags == 'string') {
      data.tags = [data.tags];
    }
    let tasks = await this.pool.queryAsync("SELECT DISTINCT task_id FROM task_tags WHERE tag IN (?)", [data.tags]);
    tasks.forEach(row => {
      this.loadTask(row.task_id, task => {
        task.dirty = true;
        task.obj.onEvent(data);
      }).catch(err => this.onError(err));
    });
  }
  shutdown() {
    // note that this does not shutdown timer completely
    for(let taskId in this.timers) {
      clearTimeout(this.timers[taskId]);
      delete this.timers[taskId];
    }
    for(let taskId in this.tasks) {
      let task = this.tasks[taskId];
      if(task.timer) {
        clearTimeout(task.timer);
        delete task.timer;
      }
      this.saveTaskTimer(taskId);
    }
  }
}

class AutomationHandler {
  constructor(aut, taskId) {
    this.aut = aut;
    this.taskId = taskId;
  }
  markDirty() {
    if(this.aut.tasks[taskId]) {
      this.aut.tasks[taskId].dirty = true;
    } else {
      console.log(`Warning: calling markDirty on task ${taskId} when task is already unloaded`)
    }
  }
  onError(err) {
    this.aut.onError(err);
  }
}
module.exports = Automation;
