const { getStore } = require('@netlify/blobs');
const crypto = require('node:crypto');
const headers = {'Content-Type':'application/json','Cache-Control':'no-store'};
const respond=(statusCode,obj)=>({statusCode,headers,body:JSON.stringify(obj)});
function validCode(input,secret){if(!input||!secret)return false;const a=crypto.createHash('sha256').update(input).digest();const b=crypto.createHash('sha256').update(secret).digest();return crypto.timingSafeEqual(a,b)}
exports.handler=async(event)=>{
  if(!['GET','POST'].includes(event.httpMethod))return respond(405,{error:'Method not allowed'});
  const secret=process.env.PRACTICE_SYNC_CODE;
  if(!secret||secret.length<16)return respond(503,{error:'Server sync code not configured'});
  if(!validCode(event.headers['x-practice-code'],secret))return respond(401,{error:'Incorrect sync code'});
  try{
    const store=getStore('repertoire-practice');
    const saved=await store.get('practice-records',{type:'json'})||{revision:0,data:null};
    if(event.httpMethod==='GET')return respond(200,saved);
    if((event.body||'').length>150000)return respond(413,{error:'Data too large'});
    const body=JSON.parse(event.body||'{}');
    if(body.revision!==saved.revision)return respond(409,{error:'Records changed on another device; tap Sync now to reconcile'});
    const data=body.data;
    if(!data||!/^\d{4}-\d{2}-\d{2}$/.test(data.start)||!data.logs||typeof data.logs!=='object'||Array.isArray(data.logs))return respond(400,{error:'Invalid practice data'});
    for(const [date,counts] of Object.entries(data.logs)){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!counts||typeof counts!=='object')return respond(400,{error:'Invalid log'});
      for(const [id,n] of Object.entries(counts))if(!/^\d+$/.test(id)||Number(id)>24||!Number.isSafeInteger(n)||n<0||n>10000)return respond(400,{error:'Invalid count'});
    }
    const next={revision:saved.revision+1,data};
    await store.setJSON('practice-records',next);
    return respond(200,{revision:next.revision});
  }catch(e){return respond(500,{error:'Cloud storage error; check Netlify function logs'})}
};
