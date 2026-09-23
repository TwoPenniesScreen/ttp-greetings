import test from 'node:test';import assert from 'node:assert/strict';import {eligible,weightedPick,validateSlide} from '../netlify/functions/_shared/core.js';
const base={id:'a',name:'A',headline:'HELLO',subheading:'',logo:'two-pennies',weight:1,enabled:true,starts:'',ends:'',schedule:{mon:{enabled:true,start:'16:00',end:'19:00'}}};
test('schedule uses London day and time',()=>{assert.equal(eligible(base,{day:'mon',date:'2026-09-21',time:'17:00'}),true);assert.equal(eligible(base,{day:'mon',date:'2026-09-21',time:'19:01'}),false);assert.equal(eligible(base,{day:'tue',date:'2026-09-22',time:'17:00'}),false)});
test('weighted selection respects weights',()=>{const b={...base,id:'b',weight:5};assert.equal(weightedPick([base,b],()=>.2,{day:'mon',date:'2026-09-21',time:'17:00'}).id,'b')});
test('recent slides are excluded when another is eligible',()=>{const b={...base,id:'b'},c={...base,id:'c'};assert.equal(weightedPick([base,b,c],()=>0,{day:'mon',date:'2026-09-21',time:'17:00'},['a','b']).id,'c')});
test('oldest exclusions relax while the previous slide stays blocked',()=>{const b={...base,id:'b'};assert.equal(weightedPick([base,b],()=>0,{day:'mon',date:'2026-09-21',time:'17:00'},['a','b']).id,'b')});
test('sole eligible slide can repeat',()=>assert.equal(weightedPick([base],()=>0,{day:'mon',date:'2026-09-21',time:'17:00'},['a']).id,'a'));
test('validation rejects empty text',()=>assert.throws(()=>validateSlide({...base,headline:'',subheading:''})));
