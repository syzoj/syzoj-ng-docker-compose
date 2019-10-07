import * as url from 'url';
import * as util from 'util';
import { globalConfig as Cfg } from './config';
import msgpack = require('msgpack-lite');
import winston = require('winston');
import { ProgressReportData } from '../interfaces';
import { JudgeTask } from './interfaces';
//import * as SocketIOClient from 'socket.io-client';
const WebSocket = require("ws");

let websocket;
let cancelCurrentPull: Function;
let curTask;

export async function connect() {
}

export async function disconnect() {
    websocket.close();
}

export function waitForTask(handle: (task: JudgeTask) => Promise<void>) {
    const user = encodeURIComponent(Cfg.serverUser);
    const token = encodeURIComponent(Cfg.serverToken);
    const wsUrl = url.resolve(Cfg.serverUrl, `/judge/wait-for-task?user=${user}&token=${token}`);
    winston.verbose(`Connecting to ${wsUrl}`);
    websocket = new WebSocket(wsUrl);
    return new Promise((resolve, reject) => {
        let cancelled = false;
        cancelCurrentPull = () => {
            cancelled = true;
            winston.verbose('Cancelled task polling since disconnected.');
            resolve();
        }
        websocket.on('close', () => {
            winston.verbose("Socket closed");
            if (cancelCurrentPull) cancelCurrentPull();
        });
        websocket.on('message', (payload) => {
            winston.verbose(payload);
            if (cancelled) return;
            curTask = JSON.parse(payload);
            handle(curTask.data).then(resolve, reject);
        });
    });
}

// Difference between result and progress:
// The `progress' is to be handled by *all* frontend proxies and pushed to all clients.
// The `result' is to be handled only *once*, and is to be written to the database.

export async function reportProgress(data: ProgressReportData) {
    winston.verbose('Reporting progress', data);
    websocket.send(JSON.stringify({id: curTask.id, sid: curTask.sid, type: "progress", data: data}));
}

export async function reportResult(data: ProgressReportData) {
    winston.verbose('Reporting result', data);
    websocket.send(JSON.stringify({id: curTask.id, sid: curTask.sid, type: "finish", data: data}));
}
