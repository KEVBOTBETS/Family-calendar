export const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
export const parse=s=>new Date(s+'T12:00:00');
export const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
export const today=()=>iso(new Date());
export const addDays=(s,n)=>{const d=parse(s); d.setDate(d.getDate()+n);return iso(d);};
export const addMonths=(s,n)=>{const d=parse(s),day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+n);d.setDate(Math.min(day,new Date(d.getFullYear(),d.getMonth()+1,0).getDate()));return iso(d);};
export const dayIndex=s=>Math.floor(Date.UTC(...s.split('-').map((n,i)=>Number(n)-(i===1?1:0)))/86400000);
export const diffDays=(a,b)=>dayIndex(b)-dayIndex(a);
export const dow=s=>parse(s).getDay();
export const startOfWeek=(s,w=0)=>addDays(s,-((dow(s)-w+7)%7));
export const startOfMonth=s=>s.slice(0,7)+'-01';
export const toMin=s=>s?Number(s.split(':')[0])*60+Number(s.split(':')[1]):null;
export const fromMin=n=>`${pad(Math.floor(n/60))}:${pad(n%60)}`;
export const fmtTime=s=>s?new Date('2000-01-01T'+s).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):'';
export const fmtDate=(s,opts={weekday:'short',month:'short',day:'numeric'})=>parse(s).toLocaleDateString('en-CA',opts);
export const fmtRange=e=>e.allDay?'All day':fmtTime(e.start)+(e.end?' – '+fmtTime(e.end):'');
export const relDay=s=>diffDays(today(),s)===0?'Today':diffDays(today(),s)===1?'Tomorrow':diffDays(today(),s)===-1?'Yesterday':fmtDate(s);
export const PALETTE=['#377b68','#a35b89','#527cc4','#de963c','#9c6bd1','#dc6e66'];
export const DEFAULT_PEOPLE=['Kevin','Kate','Luke','Max'].map((name,i)=>({id:name.toLowerCase(),name,color:PALETTE[i],emoji:['☕','🌷','🏐','⚽'][i]}));
export const CATEGORIES=[['volleyball','Volleyball','🏐'],['soccer','Soccer','⚽'],['baseball','Baseball','⚾'],['ballhockey','Ball Hockey','🏒'],['school','School','🏫'],['work','Work','💼'],['family','Family','🏡'],['birthday','Birthday','🎂'],['appointment','Appointment','🩺'],['social','Social','🎉'],['chores','Chores','🧹'],['other','Other','📌']].map(([id,name,icon],i)=>({id,name,icon,color:PALETTE[i%6],outdoor:['soccer','baseball','ballhockey'].includes(id),routine:['school','work'].includes(id),bring:['volleyball','soccer','baseball'].includes(id)?'Water bottle, sports gear':''}));
export const catById=id=>CATEGORIES.find(c=>c.id===id)||CATEGORIES.at(-1);
export const NEED_LISTS=[['groceries','Groceries','🛒'],['clothes','Clothes','👕'],['school','School','🏫'],['sports','Sports Gear','🏐'],['household','Household','🏠'],['other','Other','📦']].map(([id,name,icon])=>({id,name,icon}));
export const THEMES=[['auto','Auto','#fff','#14241f'],['light','Light','#fff','#e9f2ed'],['dark','Dark','#182622','#344b41'],['maple','Maple','#fcf3e7','#c68b55'],['aurora','Aurora','#162238','#579a90']].map(([id,name,...swatch])=>({id,name,swatch}));
export const ink=c=>{const s=c.replace('#','');return parseInt(s.slice(0,2),16)*.299+parseInt(s.slice(2,4),16)*.587+parseInt(s.slice(4,6),16)*.114>150?'#17251f':'#fff';};
export const REMIND_TIMED=[['','None'],['0','At start'],['15','15 minutes before'],['30','30 minutes before'],['60','1 hour before'],['1440','1 day before']];
export const REMIND_ALLDAY=[['','None'],['-480','At 8am'],['960','Previous day at 8am']];
export const defaultRemind=c=>['volleyball','soccer','baseball','appointment'].includes(c)?'60':'30';
export const remindAt=e=>e.remind===''||e.remind==null?null:(e.allDay?0:toMin(e.start))-Number(e.remind);
export const ROUTINE_TEMPLATES=[['Pack lunches','🥪','20:00'],['Garbage night','🗑️','20:00'],['Sports bags','🎒','20:30'],['Lock up','🔒','22:00'],['Homework check','📚','18:00']].map(([title,icon,time])=>({title,icon,time}));
export const routineOn=(r,d)=>r.active!==false&&(!r.days?.length||r.days.includes(dow(d)));
export function occurrences(ev,from,to){
 if(!ev.date||!/^\d{4}-\d{2}-\d{2}$/.test(ev.date))return [];
 const r=ev.repeat||{},span=Math.max(0,diffDays(ev.date,ev.endDate||ev.date)),out=[],interval=Math.max(1,Number(r.interval)||1);
 let d=from>ev.date?addDays(from,-span):ev.date;if(d<ev.date)d=ev.date;
 for(let i=0;d<=to&&i<40000;i++,d=addDays(d,1)){
  if(r.until&&d>r.until)break;const delta=diffDays(ev.date,d),a=parse(ev.date),b=parse(d);let match=d===ev.date;
  if(r.freq==='daily')match=delta%interval===0;
  if(r.freq==='weekly')match=Math.floor(diffDays(startOfWeek(ev.date),startOfWeek(d))/7)%interval===0&&(r.days?.length?r.days:[dow(ev.date)]).includes(dow(d));
  if(r.freq==='monthly')match=((b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth())%interval===0&&b.getDate()===a.getDate();
  if(r.freq==='yearly')match=(b.getFullYear()-a.getFullYear())%interval===0&&d.slice(5)===ev.date.slice(5);
  if(match&&!ev.exdates?.includes(d))out.push({ev,date:d,endDate:addDays(d,span),key:ev.id+'_'+d});
 }return out;
}
export function layoutDay(items){const result=[];let group=[],end=-1;function flush(){const cols=[];for(const x of group){let c=cols.findIndex(e=>e<=x.s);if(c<0)c=cols.length;cols[c]=x.e;x.col=c;}for(const x of group)result.push({...x,cols:cols.length});group=[];}
 for(const item of [...items].sort((a,b)=>a.s-b.s||b.e-a.e)){if(group.length&&item.s>=end){flush();end=-1;}group.push({...item});end=Math.max(end,item.e);}flush();return result;}
export function holidaysBetween(from,to){const out=[];for(let y=Number(from.slice(0,4));y<=Number(to.slice(0,4));y++){
 const fixed=[['01-01',"New Year's Day",'🎉'],['07-01','Canada Day','🇨🇦'],['10-31','Halloween','🎃'],['11-11','Remembrance Day','🌺'],['12-25','Christmas','🎄'],['12-26','Boxing Day','🎁']];
 const nth=(m,wd,n)=>{let d=`${y}-${pad(m)}-01`;return addDays(d,(wd-dow(d)+7)%7+(n-1)*7);};
 const may=addDays(`${y}-05-24`,-((dow(`${y}-05-24`)-1+7)%7||7));
 fixed.push([nth(2,1,3).slice(5),'Family Day','🏡'],[may.slice(5),'Victoria Day','👑'],[nth(9,1,1).slice(5),'Labour Day','🍁'],[nth(10,1,2).slice(5),'Thanksgiving','🦃']);
 for(const [md,name,icon]of fixed){const date=`${y}-${md}`;if(date>=from&&date<=to)out.push({date,name,icon});}}return out;}
export const weatherInfo=c=>c===0?{icon:'☀️',label:'Clear'}:c<4?{icon:'⛅',label:'Cloudy'}:c<50?{icon:'🌫️',label:'Fog'}:c<70?{icon:'🌧️',label:'Rain'}:c<80?{icon:'❄️',label:'Snow'}:c<95?{icon:'🌦️',label:'Showers'}:{icon:'⛈️',label:'Thunderstorm'};
const icsEsc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/[,;]/g,c=>'\\'+c);
export function calendarFile(events,description){const list=Array.isArray(events)?events:[events];const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Family Hub//EN'];for(const v of list){const e=v.ev||v;const date=v.date||e.date;const dt=(d,t)=>d.replaceAll('-','')+(t?'T'+t.replace(':','')+'00':'');lines.push('BEGIN:VEVENT','UID:'+icsEsc(e.id)+'@familyhub','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+Z/,'Z'),'SUMMARY:'+icsEsc(e.title),`DTSTART${e.allDay||!e.start?';VALUE=DATE':''}:`+dt(date,e.allDay?'':e.start),`DTEND${e.allDay||!e.start?';VALUE=DATE':''}:`+dt(e.allDay||!e.start?addDays(e.endDate||date,1):date,e.allDay?'':e.end||fromMin((toMin(e.start)||0)+60)),'LOCATION:'+icsEsc(e.location),'DESCRIPTION:'+icsEsc(description||e.notes));const r=e.repeat;if(r&&r.freq!=='none'){let rule='FREQ='+r.freq.toUpperCase()+';INTERVAL='+(r.interval||1);if(r.days?.length)rule+=';BYDAY='+r.days.map(i=>['SU','MO','TU','WE','TH','FR','SA'][i]).join(',');if(r.until)rule+=';UNTIL='+dt(r.until,'23:59');lines.push('RRULE:'+rule);}if(e.exdates?.length)lines.push('EXDATE'+(e.allDay?';VALUE=DATE':'')+':'+e.exdates.map(d=>dt(d,e.allDay?'':e.start)).join(','));lines.push('END:VEVENT');}lines.push('END:VCALENDAR');return lines.join('\r\n')+'\r\n';}
