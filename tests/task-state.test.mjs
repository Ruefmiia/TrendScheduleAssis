import assert from "node:assert/strict";
import { taskStart, taskEnd, taskPhase, formatDuration, choosePriorityTask } from "../extension/task-state.js";

const start = "2026-08-14T12:45:00+08:00";
const task = { id: "task-a", chinaTrendStart: start };
const startMs = Date.parse(start);

assert.equal(taskStart(task), startMs);
assert.equal(taskEnd(task), startMs + 86400000);
assert.deepEqual(taskPhase(task, startMs - 1000), { phase: "upcoming", remaining: 1000 });
assert.deepEqual(taskPhase(task, startMs), { phase: "running", remaining: 86400000 });
assert.deepEqual(taskPhase(task, startMs + 86400000), { phase: "ended", remaining: 0 });
assert.equal(formatDuration(3661000), "01:01:01");
assert.equal(formatDuration(90061000), "1天 01:01:01");

const earlier = { id: "earlier", chinaTrendStart: "2026-08-14T12:00:00+08:00" };
const later = { id: "later", chinaTrendStart: "2026-08-14T16:00:00+08:00" };
assert.equal(choosePriorityTask([later, earlier], Date.parse("2026-08-14T10:00:00+08:00")).id, "earlier");
assert.equal(choosePriorityTask([later, earlier], Date.parse("2026-08-14T12:30:00+08:00")).id, "earlier");
assert.equal(choosePriorityTask([], startMs), null);

console.log("Task countdown and priority tests passed.");
