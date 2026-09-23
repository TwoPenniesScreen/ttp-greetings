import test from 'node:test';import assert from 'node:assert/strict';import {eligible,weightedPick,validateSlide} from '../netlify/functions/_shared/core.js';
const base={id:'a',name:'A',headline:'HELLO',subheading:'',logo:'two-pennies',weight:1,enabled:true,starts:'',ends:'',schedule:{mon:{enabled:true,start:'16:00',end:'19:00'}}};
test('schedule uses London day and time',()=>{assert.equal(eligible(base,{day:'mon',date:'2026-09-21',time:'17:00'}),true);assert.equal(eligible(base,{day:'mon',date:'2026-09-21',time:'19:01'}),false);assert.equal(eligible(base,{day:'tue',date:'2026-09-22',time:'17:00'}),false)});
test('weighted selection respects weights',()=>{const b={...base,id:'b',weight:5};assert.equal(weightedPick([base,b],()=>.2,{day:'mon',date:'2026-09-21',time:'17:00'}).id,'b')});
test('validation rejects empty text',()=>assert.throws(()=>validateSlide({...base,headline:'',subheading:''})));
