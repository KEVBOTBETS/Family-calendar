import {addDays,diffDays,iso,parse} from './lib.js';
export function moveCalendarEvent(event,occurrenceDate,targetDate,scope='occurrence') {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)||iso(parse(targetDate))!==targetDate)throw Error('Choose a valid date');
 const original=structuredClone(event),delta=diffDays(occurrenceDate,targetDate),span=Math.max(0,diffDays(event.date,event.endDate||event.date));
 if(delta===0)return {unchanged:true};
 const recurring=event.repeat?.freq&&event.repeat.freq!=='none';
 if(recurring&&scope==='occurrence')return {
  series:{...original,exdates:[...new Set([...(event.exdates||[]),occurrenceDate])]},
  detached:{...original,id:'',date:targetDate,endDate:span?addDays(targetDate,span):'',repeat:{freq:'none'},exdates:[]}
 };
 const moved={...original,date:addDays(event.date,delta),endDate:event.endDate?addDays(event.endDate,delta):''};
 if(recurring){moved.repeat={...event.repeat,days:event.repeat.days?.map(d=>(d+delta%7+7)%7),until:event.repeat.until?addDays(event.repeat.until,delta):''};moved.exdates=(event.exdates||[]).map(d=>addDays(d,delta));}
 return {series:moved};
}
export const taskProgress=(tasks,done)=>({total:tasks.length,done:tasks.filter(done).length,percent:tasks.length?Math.round(tasks.filter(done).length/tasks.length*100):0});
