import test from 'node:test';
import assert from 'node:assert/strict';
import { scheduleProject } from '../src/lib/schedule.ts';
const tasks = [
  { id:'A', duration:4, predecessors:[] },
  { id:'B', duration:6, predecessors:['A'] },
  { id:'C', duration:3, predecessors:['A'] },
  { id:'D', duration:4, predecessors:['B','C'] },
];
test('FS baseline has 14 days and preparation has three days float', () => {
  const r = scheduleProject(tasks);
  assert.equal(r.finish,14);
  assert.deepEqual(r.tasks.map(t=>t.float),[0,0,3,0]);
  assert.deepEqual(r.tasks.map(t=>t.start),[0,4,4,10]);
});
test('delay within float leaves final milestone unchanged',()=>{
  const r=scheduleProject(tasks,{C:2});
  assert.equal(r.finish,14); assert.equal(r.tasks[2].float,1);
});
test('delay exceeding float propagates to successor and switches critical branch',()=>{
  const r=scheduleProject(tasks,{C:5});
  assert.equal(r.finish,16); assert.equal(r.tasks[3].start,12);
  assert.deepEqual(r.tasks.map(t=>t.float),[0,2,0,0]);
});
test('unordered DAG gives same dates and zero duration milestones work',()=>{
  const r=scheduleProject([{id:'M',duration:0,predecessors:['A']},tasks[0]]);
  assert.equal(r.finish,4); assert.equal(r.tasks[0].start,4);
});
test('invalid duration, delay, duplicate, dangling dependency and cycles are rejected',()=>{
  for(const duration of [-1,NaN,Infinity]) assert.throws(()=>scheduleProject([{id:'X',duration,predecessors:[]} ]));
  assert.throws(()=>scheduleProject(tasks,{C:-1}));
  assert.throws(()=>scheduleProject(tasks,{X:1}));
  assert.throws(()=>scheduleProject([tasks[0],tasks[0]]));
  assert.throws(()=>scheduleProject([{id:'A',duration:1,predecessors:['missing']}]));
  assert.throws(()=>scheduleProject([{id:'A',duration:1,predecessors:['B']},{id:'B',duration:1,predecessors:['A']}]));
});
