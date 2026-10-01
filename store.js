import CONFIG from './config.js';
export const DEMO=new URLSearchParams(location.search).get('demo')==='1';
const storageKey=k=>DEMO?'demo.'+k:k;
export const uid=(prefix='item')=>prefix+'_'+crypto.randomUUID();
export const ls={get(k,f=null){try{const v=localStorage.getItem(storageKey(k));return v===null?f:JSON.parse(v);}catch{return f;}},set(k,v){try{localStorage.setItem(storageKey(k),JSON.stringify(v));return true;}catch{return false;}}};
const session={get(k){try{return sessionStorage.getItem(storageKey(k));}catch{return null;}},set(k,v){try{sessionStorage.setItem(storageKey(k),v);}catch{}},remove(k){try{sessionStorage.removeItem(storageKey(k));}catch{}}};
const listeners=new Set();const emit=k=>listeners.forEach(fn=>fn(k));
let state=ls.get('fh.state',{items:{},pending:[],cursor:0});
if(!state||typeof state.items!=='object'||!Array.isArray(state.pending))state={items:{},pending:[],cursor:0};
const persist=()=>{store.storageError=!ls.set('fh.state',state);if(store.storageError)emit('storage');};
let api=DEMO?'':ls.get('fh.apiUrl',CONFIG.API_URL||'');let syncing=false;
function validUrl(v){if(!v)return '';const u=new URL(v);if(u.protocol!=='https:'||u.hostname!=='script.google.com'||!/^\/macros\/s\/[\w-]+\/exec$/.test(u.pathname))throw Error('Use the deployed Google Apps Script /exec URL');return u.href;}
export const store={by:'',status:'idle',statusMessage:'',storageError:false,lastSync:0,remindersRunning:false,token:session.get('fh.token')||'',isUnlocked:DEMO||session.get('fh.unlocked')==='yes',
 get apiUrl(){return api;},set apiUrl(v){if(DEMO)throw Error('Demo mode stays on this device.');api=validUrl(v.trim());ls.set('fh.apiUrl',api);state.cursor=0;persist();},get isShared(){return !!api;},get pending(){return state.pending;},on(fn){listeners.add(fn);return()=>listeners.delete(fn);},
 list(type){return Object.values(state.items).filter(x=>!x.deleted&&x.type===type).map(x=>structuredClone(x));},get(id){const x=state.items[id];return x&&!x.deleted?structuredClone(x):null;},meta(id){return state.items[id]?structuredClone(state.items[id]):null;},
 put(type,item){const value={...structuredClone(item),id:item.id||uid(type),type,updatedAt:Date.now(),updatedBy:this.by};state.items[value.id]=value;if(this.isShared){state.pending=state.pending.filter(x=>x.id!==value.id);state.pending.push(value);}persist();emit('data');if(this.isShared&&this.isUnlocked)this.sync();return structuredClone(value);},
 remove(id){const old=this.get(id);if(!old)return null;state.items[id]={...old,deleted:true,updatedAt:Date.now()};if(this.isShared){state.pending=state.pending.filter(x=>x.id!==id);state.pending.push(state.items[id]);}persist();emit('data');if(this.isShared&&this.isUnlocked)this.sync();return old;},
 exportAll(){return {version:2,exportedAt:new Date().toISOString(),items:Object.values(state.items)};},
 importAll(data){const items=Array.isArray(data)?data:Array.isArray(data.items)?data.items:Object.values(data.items||{});if(!items.length)throw Error('No backup items found');if(items.some(x=>!x||typeof x.id!=='string'||typeof x.type!=='string'))throw Error('Invalid backup');for(const x of items)this.put(x.type,x);return items.length;},
 setPreviewPin(pin){ls.set('fh.previewPin',pin);},lock(){this.token='';this.isUnlocked=false;session.remove('fh.token');session.remove('fh.unlocked');emit('lock');},
 async unlock(pin){if(!this.isShared){if(pin!==ls.get('fh.previewPin',CONFIG.PREVIEW_PIN||'1234'))return {ok:false,error:'wrong_pin'};this.isUnlocked=true;session.set('fh.unlocked','yes');return {ok:true};}
 const res=await this.call({action:'unlock',pin});if(res.ok){this.token=res.token;this.isUnlocked=true;session.set('fh.token',res.token);session.set('fh.unlocked','yes');await this.sync(true);}return res;},
 urls(){return {appUrl:new URL('./',location.href).href};},
 async call(payload){try{const res=await fetch(api,{method:'POST',body:JSON.stringify(payload),headers:{'Content-Type':'text/plain;charset=utf-8'},redirect:'follow',signal:AbortSignal.timeout(20000)});if(!res.ok)throw Error('HTTP '+res.status);return await res.json();}catch(err){return {ok:false,error:navigator.onLine?'network':'offline',message:err.message};}},
 async sync(){if(syncing||!this.isShared||!this.isUnlocked||!this.token)return;syncing=true;this.status='syncing';emit('status');const batch=structuredClone(state.pending);try{const res=await this.call({action:'sync',token:this.token,since:state.cursor,changes:batch,...this.urls()});if(!res.ok){this.status=res.error==='auth'?'locked':'error';this.statusMessage=res.message||res.error;if(res.error==='auth')this.lock();return;}
 const sent=new Map(batch.map(x=>[x.id,x.updatedAt]));state.pending=state.pending.filter(x=>sent.get(x.id)!==x.updatedAt);const pending=new Set(state.pending.map(x=>x.id));for(const x of res.items||[])if(!pending.has(x.id))state.items[x.id]=x;state.cursor=res.cursor||state.cursor;this.lastSync=Date.now();this.remindersRunning=!!res.reminders;this.status='idle';this.statusMessage='';persist();emit('remote');
 }finally{syncing=false;emit('status');}},
};
setInterval(()=>store.sync(),(CONFIG.SYNC_SECONDS||25)*1000);
window.addEventListener('storage',e=>{if(e.key===storageKey('fh.state')){state=ls.get('fh.state',state);emit('remote');}});
