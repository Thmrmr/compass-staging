import { useState, useEffect, useRef, useCallback } from "react";
import { Home, Target, LayoutDashboard, Sparkles, Calendar, TrendingUp, Layers, Network, Settings, Database, LogOut, Sun, Moon, Search, Send, Plus, Eye, EyeOff, MessageSquare, X, FileText, Trash2, Save, Bell, Shield, Users, BarChart3, Megaphone, UserPlus, Globe, Zap, RefreshCw, Clock, Mic, MicOff, Volume2, PanelRightOpen, PanelRightClose, BookOpen, Activity } from "lucide-react";

const SU = "https://nujczhqxcxuppatnjbon.supabase.co";
const SK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51amN6aHF4Y3h1cHBhdG5qYm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjIyMjAsImV4cCI6MjA4OTE5ODIyMH0.WDy1yI89XDk7g-jnPfrEmewvtayHi87lROeZlAZpZ8U";
const STAGES=["Recognition","Proof","Integration","Dependency","Expansion"];
const SECTORS=["Government","Oil & Gas","Healthcare","Private Sector","Sport"];
const SC={Recognition:"#8A9BAA",Proof:"#FFB800",Integration:"#00879F",Dependency:"#00D49C",Expansion:"#6B8C00"};
const XC={Government:"#00879F","Oil & Gas":"#FFB800",Healthcare:"#00D49C","Private Sector":"#D0F94A",Sport:"#FF6B6B"};
const AGENTS=[
  {key:"pipeline_guardian",name:"Pipeline Guardian",desc:"Monitors deal health, flags stalled opportunities",color:"#FF4B4B",type:"hourly",icon:Shield},
  {key:"brief_architect",name:"Brief Architect",desc:"Auto-generates meeting briefs from deal context",color:"#00879F",type:"hourly",icon:FileText},
  {key:"followthrough",name:"Follow-through",desc:"Tracks committed next steps, alerts on overdue",color:"#FFB800",type:"hourly",icon:Clock},
  {key:"deal_scorer",name:"Deal Scorer",desc:"Scores deals based on observable signals",color:"#00D49C",type:"hourly",icon:Target},
  {key:"team_coach",name:"Team Coach",desc:"Analyzes team performance patterns",color:"#A0C020",type:"hourly",icon:Users},
  {key:"debrief_analyst",name:"Debrief Analyst",desc:"Extracts insights from post-meeting debriefs",color:"#00879F",type:"event",icon:RefreshCw},
  {key:"sector_radar",name:"Sector Radar",desc:"Tracks sector news and competitive movements",color:"#D0F94A",type:"event",icon:Globe},
  {key:"lead_nurture",name:"Lead Nurture",desc:"Monitors lead engagement, suggests actions",color:"#00D49C",type:"hourly",icon:UserPlus},
  {key:"content_gap",name:"Content Gap",desc:"Identifies missing content for pipeline stages",color:"#D0F94A",type:"hourly",icon:BarChart3},
  {key:"campaign_roi",name:"Campaign ROI",desc:"Calculates campaign effectiveness and ROI",color:"#FFB800",type:"event",icon:TrendingUp},
  {key:"winloss_intel",name:"Win/Loss Intel",desc:"Analyzes patterns in won and lost deals",color:"#D0F94A",type:"event",icon:Zap},
  {key:"belief_evolution",name:"Belief Evolution",desc:"Tracks how sector beliefs change over time",color:"#00879F",type:"event",icon:RefreshCw},
];

async function q(p,t,o={}){const h={apikey:SK,"Content-Type":"application/json",Authorization:`Bearer ${t||SK}`,Prefer:"return=representation",...o.headers};const r=await fetch(`${SU}${p}`,{...o,headers:h});if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.message||r.statusText);}const x=await r.text();return x?JSON.parse(x):null;}
async function auth(e,p){const r=await fetch(`${SU}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:SK,"Content-Type":"application/json"},body:JSON.stringify({email:e,password:p})});const d=await r.json();if(!r.ok)throw new Error(d.error_description||"Auth failed");return d;}


// Claude API via Netlify proxy (avoids CORS)
async function callClaude(apiKey,messages,opts={}){
  const body={apiKey:apiKey||"",model:opts.model||"claude-sonnet-4-20250514",max_tokens:opts.max_tokens||1000,messages};
  if(opts.system)body.system=opts.system;
  if(opts.tools)body.tools=opts.tools;
  const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok){const e=await r.text();throw new Error(e||"Claude API error");}
  return r.json();
}
const TABS=[{id:"home",label:"Home",icon:Home},{id:"crm",label:"CRM",icon:Target},{id:"dashboard",label:"Dashboard",icon:LayoutDashboard},{id:"agents",label:"Agents",icon:Sparkles},{id:"meetings",label:"Meetings",icon:Calendar},{id:"marketing",label:"Marketing",icon:TrendingUp},{id:"admin",label:"Admin",icon:Settings,ao:true},{id:"setup",label:"DB Setup",icon:Database,ao:true}];
const M={fontFamily:"'DM Mono',monospace"};
const T={fontFamily:"'Optician Sans','DM Sans',sans-serif"};
const CS={background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden"};
const BP={padding:"8px 16px",background:"#00879F",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center"};
const BG={padding:"8px 16px",background:"transparent",color:"var(--sub)",border:"1px solid var(--border)",borderRadius:8,fontSize:13,cursor:"pointer"};
const IP={width:"100%",padding:"9px 12px",border:"1px solid var(--border)",borderRadius:8,fontSize:13,outline:"none",background:"var(--panel2)",color:"var(--text)",boxSizing:"border-box"};
const LB={...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",display:"block",marginBottom:5};

function Auth({onLogin}){const[e,sE]=useState("");const[p,sP]=useState("");const[sh,sSh]=useState(false);const[er,sEr]=useState("");const[b,sB]=useState(false);
const go=async()=>{if(!e||!p){sEr("Enter email and password.");return;}sB(true);sEr("");try{onLogin(await auth(e,p));}catch(x){sEr(x.message);}finally{sB(false);}};
return(<div style={{position:"fixed",inset:0,background:"#0D1B1E",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}><div style={{width:380,background:"#fff",borderRadius:18,overflow:"hidden"}}><div style={{height:3,background:"linear-gradient(90deg,#00879F,#00D49C,#D0F94A)"}}/><div style={{padding:"40px 36px 36px"}}><div style={{...T,fontSize:22,fontWeight:800,marginBottom:4}}>COMPASS</div><div style={{...M,fontSize:10,color:"#999",letterSpacing:"0.15em",marginBottom:28}}>STAGING ENVIRONMENT</div><div style={{marginBottom:14}}><label style={{...LB,color:"#999"}}>EMAIL</label><input value={e} onChange={x=>sE(x.target.value)} onKeyDown={x=>x.key==="Enter"&&go()} placeholder="you@humain.com" style={{...IP,background:"#fff",border:"1px solid #e8e8e8"}}/></div><div style={{marginBottom:20}}><label style={{...LB,color:"#999"}}>PASSWORD</label><div style={{position:"relative"}}><input type={sh?"text":"password"} value={p} onChange={x=>sP(x.target.value)} onKeyDown={x=>x.key==="Enter"&&go()} style={{...IP,background:"#fff",border:"1px solid #e8e8e8",paddingRight:40}}/><button onClick={()=>sSh(!sh)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#999"}}>{sh?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></div>{er&&<div style={{color:"#FF4B4B",fontSize:13,marginBottom:12,padding:"8px 12px",background:"rgba(255,75,75,0.06)",borderRadius:8}}>{er}</div>}<button onClick={go} disabled={b} style={{width:"100%",padding:"12px",background:"#0D1B1E",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:b?"wait":"pointer",opacity:b?0.7:1}}>{b?"Signing in...":"Sign In"}</button></div></div></div>);}

function DealModal({deal,onClose,onSave,onDel,token}){const nw=!deal?.id;const[f,sF]=useState({client_name:deal?.client_name||"",sector:deal?.sector||"",stage:deal?.stage||"Recognition",status:deal?.status||"Active",expected_value:deal?.expected_value||0,contact_name:deal?.contact_name||"",next_step:deal?.next_step||"",notes:deal?.notes||"",probability:deal?.probability||0,tags:deal?.tags||""});const[sv,sSv]=useState(false);const[ev,sEv]=useState([]);const s=(k,v)=>sF(p=>({...p,[k]:v}));
useEffect(()=>{if(deal?.id&&token)q(`/rest/v1/deal_events?deal_id=eq.${deal.id}&select=*&order=created_at.desc&limit=15`,token).then(sEv).catch(()=>{});},[deal?.id,token]);
const sv2=async()=>{if(!f.client_name.trim())return;sSv(true);try{const pl={...f,expected_value:parseFloat(f.expected_value)||0,probability:parseInt(f.probability)||0,weighted_value:(parseFloat(f.expected_value)||0)*((parseInt(f.probability)||0)/100),updated_at:new Date().toISOString()};if(nw){const res=await q("/rest/v1/deals",token,{method:"POST",body:JSON.stringify(pl)});const newId=res?.[0]?.id;if(newId)await q("/rest/v1/deal_events",token,{method:"POST",body:JSON.stringify({deal_id:newId,event_type:"created",description:"Deal created: "+pl.client_name+" ("+pl.stage+")",created_at:new Date().toISOString()})}).catch(()=>{});}else{await q(`/rest/v1/deals?id=eq.${deal.id}`,token,{method:"PATCH",body:JSON.stringify(pl)});await q("/rest/v1/deal_events",token,{method:"POST",body:JSON.stringify({deal_id:deal.id,event_type:"updated",description:"Deal updated: "+Object.keys(pl).filter(k=>pl[k]!==deal[k]&&k!=="updated_at"&&k!=="weighted_value").join(", "),created_at:new Date().toISOString()})}).catch(()=>{});}onSave();}catch(x){alert(x.message);}finally{sSv(false);}};
return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}><div style={{width:560,maxHeight:"85vh",background:"var(--panel)",borderRadius:16,overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}><div style={{padding:"18px 24px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{...T,fontSize:18,fontWeight:700}}>{nw?"New Deal":deal.client_name}</div><div style={{display:"flex",gap:8}}>{!nw&&<button onClick={()=>{if(confirm("Delete?"))onDel(deal.id);}} style={{...BG,padding:"6px 10px",color:"#FF4B4B"}}><Trash2 size={14}/></button>}<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><X size={18}/></button></div></div>
<div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
<div><label style={LB}>CLIENT</label><input value={f.client_name} onChange={e=>s("client_name",e.target.value)} style={IP}/></div>
<div><label style={LB}>SECTOR</label><select value={f.sector} onChange={e=>s("sector",e.target.value)} style={IP}><option value="">Select</option>{SECTORS.map(x=><option key={x}>{x}</option>)}</select></div>
<div><label style={LB}>STAGE</label><select value={f.stage} onChange={e=>s("stage",e.target.value)} style={IP}>{STAGES.map(x=><option key={x}>{x}</option>)}</select></div>
<div><label style={LB}>STATUS</label><select value={f.status} onChange={e=>s("status",e.target.value)} style={IP}><option>Active</option><option>Won</option><option>Lost</option><option>Stalled</option></select></div>
<div><label style={LB}>VALUE (SAR)</label><input type="number" value={f.expected_value} onChange={e=>s("expected_value",e.target.value)} style={IP}/></div>
<div><label style={LB}>PROBABILITY %</label><input type="number" value={f.probability} onChange={e=>s("probability",e.target.value)} style={IP} min={0} max={100}/></div>
<div style={{gridColumn:"1/-1"}}><label style={LB}>CONTACT</label><input value={f.contact_name} onChange={e=>s("contact_name",e.target.value)} style={IP}/></div>
<div style={{gridColumn:"1/-1"}}><label style={LB}>NEXT STEP</label><input value={f.next_step} onChange={e=>s("next_step",e.target.value)} style={IP}/></div>
<div style={{gridColumn:"1/-1"}}><label style={LB}>PRODUCTS / TAGS</label><input value={f.tags||""} onChange={e=>s("tags",e.target.value)} placeholder="e.g. HUMAIN ONE, HUMAIN Chat, Data Center" style={IP}/></div>
<div style={{gridColumn:"1/-1"}}><label style={LB}>NOTES</label><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={3} style={{...IP,resize:"vertical"}}/></div>
</div>{ev.length>0&&<div><div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:8}}>ACTIVITY</div>{ev.map((e,i)=><div key={i} style={{padding:"6px 0",borderBottom:"1px solid var(--border)",fontSize:12,color:"var(--sub)",display:"flex",gap:10}}><span style={{...M,fontSize:10,color:"var(--muted)",width:65,flexShrink:0}}>{new Date(e.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</span><span>{e.description||e.event_type}</span></div>)}</div>}</div>
<div style={{padding:"14px 24px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"flex-end",gap:10}}><button onClick={onClose} style={BG}>Cancel</button><button onClick={sv2} disabled={sv} style={{...BP,opacity:sv?0.6:1}}><Save size={14} style={{marginRight:6}}/>{sv?"Saving...":nw?"Create":"Save"}</button></div></div></div>);}


function useSTT(){const[listening,setL]=useState(false);const[transcript,setTr]=useState("");const recRef=useRef(null);
const start=useCallback(()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;const r=new SR();r.continuous=false;r.interimResults=true;r.lang="en-US";let buf="";r.onresult=(e)=>{buf="";for(let i=0;i<e.results.length;i++)buf+=e.results[i][0].transcript;setTr(buf);};r.onend=()=>setL(false);r.onerror=()=>setL(false);recRef.current=r;r.start();setL(true);},[]);
const stop=useCallback(()=>{recRef.current?.stop();setL(false);},[]);
return{listening,transcript,start,stop,setTranscript:setTr};}

const EL_VOICE_EN='EXAVITQu4vr4xnSDxMaL';
const EL_VOICE_AR='TX3LPaxmHKxFdv7VOQHJ';
async function speakTTS(text,elKey){
  if(!elKey){if(window.speechSynthesis){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=/[\u0600-\u06FF]/.test(text)?"ar-SA":"en-US";window.speechSynthesis.speak(u);}return;}
  const isAr=/[\u0600-\u06FF]/.test(text);const vid=isAr?EL_VOICE_AR:EL_VOICE_EN;
  try{const r=await fetch("https://api.elevenlabs.io/v1/text-to-speech/"+vid+"/stream",{method:"POST",headers:{"xi-api-key":elKey,"Content-Type":"application/json"},body:JSON.stringify({text:text.slice(0,2500),model_id:"eleven_multilingual_v2",voice_settings:{stability:0.5,similarity_boost:0.75}})});
  if(!r.ok)throw new Error("TTS failed");const blob=await r.blob();const url=URL.createObjectURL(blob);const a=new Audio(url);a.play();}catch(e){console.warn("TTS error:",e);if(window.speechSynthesis){const u=new SpeechSynthesisUtterance(text);window.speechSynthesis.speak(u);}}}

function Chat({deals,profile,elKey,claudeKey,token,onDealCreated,onChatActive}){const[ms,sMs]=useState([]);const[inp,sI]=useState("");const[b,sB]=useState(false);const end=useRef(null);const stt=useSTT();useEffect(()=>{if(stt.transcript)sI(stt.transcript);},[stt.transcript]);
  const[pendingDeal,sPD]=useState(null);const[savingDeal,sSD]=useState(false);
  const saveDeal=async()=>{if(!pendingDeal?.client_name)return;sSD(true);try{
    const pl={client_name:pendingDeal.client_name,sector:pendingDeal.sector||"",stage:pendingDeal.stage||"Recognition",status:"Active",expected_value:parseFloat(pendingDeal.expected_value)||0,contact_name:pendingDeal.contact_name||"",next_step:pendingDeal.next_step||"",updated_at:new Date().toISOString()};
    const res=await q("/rest/v1/deals",token,{method:"POST",body:JSON.stringify(pl)});
    const nid=res?.[0]?.id;if(nid)await q("/rest/v1/deal_events",token,{method:"POST",body:JSON.stringify({deal_id:nid,event_type:"created",description:"Deal created via AI chat: "+pl.client_name,created_at:new Date().toISOString()})}).catch(()=>{});
    sMs(p=>[...p,{role:"assistant",content:"Deal registered: "+pl.client_name+" ("+pl.sector+") at "+pl.stage+" stage."+(pl.expected_value?" Value: SAR "+pl.expected_value.toLocaleString():"")}]);
    sPD(null);if(onDealCreated)onDealCreated();
  }catch(e){sMs(p=>[...p,{role:"assistant",content:"Error saving deal: "+e.message}]);}finally{sSD(false);}};
useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[ms]);
const DEAL_TOOL={name:"register_deal",description:"Register a new deal when the user mentions meeting a client, closing a deal, or a new business opportunity.",input_schema:{type:"object",properties:{client_name:{type:"string"},sector:{type:"string",enum:["Government","Oil & Gas","Healthcare","Private Sector","Sport"]},expected_value:{type:"number"},contact_name:{type:"string"},stage:{type:"string",enum:["Recognition","Proof","Integration","Dependency","Expansion"]},next_step:{type:"string"}},required:["client_name"]}};
const BRIEF_TOOL={name:"prepare_meeting_brief",description:"Prepare a meeting brief when user mentions preparing for a meeting or needing to prep.",input_schema:{type:"object",properties:{client_name:{type:"string"},sector:{type:"string"},meeting_type:{type:"string"}},required:["client_name"]}};
const go=async()=>{if(!inp.trim()||b)return;const t=inp.trim();sI("");sB(true);sMs(p=>[...p,{role:"user",content:t}]);const a=deals.filter(d=>d.status==="Active");
  const sys="You are COMPASS AI for HUMAIN CRM. User: "+(profile?.full_name||"")+". "+a.length+" active deals. When the user mentions meeting a client, new opportunity, or deal, use register_deal. When they want to prepare for a meeting, use prepare_meeting_brief. Otherwise respond normally. Be concise.";
  try{const body={apiKey:claudeKey||"",model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[...ms.slice(-10),{role:"user",content:t}],system:sys,tools:[DEAL_TOOL,BRIEF_TOOL]};
    const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});if(!r.ok){const err=await r.text();throw new Error(err||"Claude API error");}const d=await r.json();
    let txt=[];let toolUse=null;
    for(const block of (d.content||[])){if(block.type==="text"&&block.text)txt.push(block.text);if(block.type==="tool_use"&&block.name==="register_deal")toolUse=block.input;if(block.type==="tool_use"&&block.name==="prepare_meeting_brief")txt.push("Opening brief generator for "+(block.input?.client_name||"your client")+"...");}
    if(txt.length)sMs(p=>[...p,{role:"assistant",content:txt.join("")}]);
    if(toolUse)sPD({client_name:toolUse.client_name||"",sector:toolUse.sector||"",expected_value:toolUse.expected_value||0,contact_name:toolUse.contact_name||"",stage:toolUse.stage||"Recognition",next_step:toolUse.next_step||""});
  }catch(x){sMs(p=>[...p,{role:"assistant",content:"Error: "+x.message}]);}finally{sB(false);}};
return(<div style={CS}><div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}><div style={{width:26,height:26,borderRadius:7,background:"rgba(0,135,159,0.08)",display:"flex",alignItems:"center",justifyContent:"center",color:"#00879F"}}><MessageSquare size={13}/></div><span style={{...M,fontSize:10,letterSpacing:"0.06em",color:"var(--muted)"}}>COMPASS AI</span></div>
<div style={{height:280,overflowY:"auto",padding:14}}>{ms.length===0&&<div style={{textAlign:"center",paddingTop:50,color:"var(--muted)",fontSize:13}}>Ask about deals, pipeline, or strategy</div>}{ms.map((m,i)=><div key={i} style={{marginBottom:10,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"80%"}}><div style={{padding:"9px 13px",borderRadius:11,fontSize:13,lineHeight:1.6,background:m.role==="user"?"#0D1B1E":"rgba(0,135,159,0.06)",color:m.role==="user"?"#fff":"var(--text)",border:m.role==="assistant"?"1px solid rgba(0,135,159,0.1)":"none",whiteSpace:"pre-wrap"}}>{m.content}</div>{m.role==="assistant"&&<button onClick={()=>speakTTS(m.content,elKey)} style={{marginTop:3,background:"none",border:"none",cursor:"pointer",color:"var(--muted)",padding:2}}><Volume2 size={12}/></button>}</div></div>)}{b&&<div style={{...M,color:"var(--muted)",fontSize:11}}>Thinking...</div>}<div ref={end}/></div>

      {pendingDeal&&<div style={{margin:"0 12px 8px",padding:"14px 16px",background:"rgba(0,212,156,0.04)",border:"1px solid rgba(0,212,156,0.15)",borderRadius:10}}>
        <div style={{...M,fontSize:9,letterSpacing:"0.1em",color:"#00D49C",marginBottom:10}}>DEAL DETECTED — CONFIRM TO REGISTER</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div><label style={{...LB,fontSize:8}}>CLIENT</label><input value={pendingDeal.client_name} onChange={e=>sPD(p=>({...p,client_name:e.target.value}))} style={{...IP,fontSize:12,padding:"6px 10px"}}/></div>
          <div><label style={{...LB,fontSize:8}}>SECTOR</label><select value={pendingDeal.sector} onChange={e=>sPD(p=>({...p,sector:e.target.value}))} style={{...IP,fontSize:12,padding:"6px 10px"}}><option value="">Select</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label style={{...LB,fontSize:8}}>VALUE (SAR)</label><input type="number" value={pendingDeal.expected_value} onChange={e=>sPD(p=>({...p,expected_value:e.target.value}))} style={{...IP,fontSize:12,padding:"6px 10px"}}/></div>
          <div><label style={{...LB,fontSize:8}}>STAGE</label><select value={pendingDeal.stage} onChange={e=>sPD(p=>({...p,stage:e.target.value}))} style={{...IP,fontSize:12,padding:"6px 10px"}}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={()=>sPD(null)} style={{...BG,padding:"5px 12px",fontSize:11}}>Cancel</button><button onClick={saveDeal} disabled={savingDeal} style={{...BP,padding:"5px 12px",fontSize:11,opacity:savingDeal?0.6:1}}><Save size={12} style={{marginRight:4}}/>{savingDeal?"Saving...":"Register Deal"}</button></div>
      </div>}
      <div style={{padding:"10px 12px",borderTop:"1px solid var(--border)",display:"flex",gap:8}}><button onClick={()=>{if(stt.listening){stt.stop();}else{stt.start();}}} style={{padding:"9px",background:stt.listening?"rgba(255,75,75,0.1)":"transparent",border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",color:stt.listening?"#FF4B4B":"var(--muted)"}}>
{stt.listening?<MicOff size={14}/>:<Mic size={14}/>}</button><input value={inp} onChange={e=>sI(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={stt.listening?"Listening...":"Ask COMPASS AI..."} onFocus={()=>onChatActive&&onChatActive(true)} style={{...IP,flex:1}}/><button onClick={go} disabled={b||!inp.trim()} style={{...BP,padding:"9px 14px",opacity:b||!inp.trim()?0.4:1}}><Send size={14}/></button></div></div>);}

function Kanban({deals,onOpen}){const g=STAGES.reduce((a,s)=>{a[s]=deals.filter(d=>d.stage===s&&d.status==="Active");return a;},{});
return(<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:0,border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",marginBottom:24}}>{STAGES.map((s,i)=><div key={s} style={{borderRight:i<4?"1px solid var(--border)":"none",minHeight:180}}><div style={{padding:"10px 12px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{...M,fontSize:9,letterSpacing:"0.08em",color:SC[s],fontWeight:600}}>{s.toUpperCase()}</span><span style={{...M,fontSize:9,color:"var(--muted)",background:"var(--panel2)",padding:"2px 6px",borderRadius:4}}>{g[s].length}</span></div><div style={{padding:6}}>{g[s].map(d=><div key={d.id} onClick={()=>onOpen(d)} style={{background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:9,padding:"9px 10px",marginBottom:5,cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,135,159,0.3)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";}}><div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{d.client_name}</div><div style={{...M,fontSize:9,color:"var(--muted)"}}>{d.sector||"—"}</div>{d.expected_value>0&&<div style={{...M,fontSize:9,color:"#00879F",marginTop:3}}>SAR {Number(d.expected_value).toLocaleString()}</div>}</div>)}</div></div>)}</div>);}

const KPI=({v,l,c,s})=>(<div style={{...CS,padding:"18px 20px"}}><div style={{...T,fontSize:24,fontWeight:800,color:c||"var(--text)"}}>{v}</div><div style={{...M,fontSize:9,letterSpacing:"0.12em",color:"var(--muted)",marginTop:4}}>{l}</div>{s&&<div style={{...M,fontSize:10,color:"var(--sub)",marginTop:6}}>{s}</div>}</div>);

function MktModal({type,item,onClose,onSave,token}){
  const isNew=!item?.id;
  const configs={
    campaign:{fields:[{k:"name",l:"NAME",r:true},{k:"type",l:"TYPE",sel:["Event","Webinar","Content","Digital","Sponsorship"]},{k:"sector",l:"SECTOR",sel:["","Government","Oil & Gas","Healthcare","Private Sector","Sport"]},{k:"status",l:"STATUS",sel:["Planned","Active","Completed","Cancelled"]},{k:"budget_sar",l:"BUDGET (SAR)",num:true},{k:"target_leads",l:"TARGET LEADS",num:true},{k:"start_date",l:"START DATE",date:true},{k:"end_date",l:"END DATE",date:true},{k:"description",l:"DESCRIPTION",area:true},{k:"objective",l:"OBJECTIVE",area:true}],table:"campaigns"},
    lead:{fields:[{k:"name",l:"NAME",r:true},{k:"organization",l:"ORGANIZATION"},{k:"title",l:"TITLE"},{k:"sector",l:"SECTOR",sel:["","Government","Oil & Gas","Healthcare","Private Sector","Sport"]},{k:"source_type",l:"SOURCE",sel:["Event","Webinar","Referral","Inbound","Outbound","Partner"]},{k:"status",l:"STATUS",sel:["Cold","Warm","Hot","Ready","Converted","Lost"]},{k:"contact_email",l:"EMAIL"},{k:"notes",l:"NOTES",area:true}],table:"leads"},
    asset:{fields:[{k:"title",l:"TITLE",r:true},{k:"asset_type",l:"TYPE",sel:["Deck","Proposal","One-pager","Case Study","Video","Whitepaper","Questionnaire"]},{k:"sector",l:"SECTOR",sel:["","Government","Oil & Gas","Healthcare","Private Sector","Sport"]},{k:"status",l:"STATUS",sel:["Draft","Review","Published","Archived"]},{k:"description",l:"DESCRIPTION",area:true}],table:"content_assets"},
  };
  const cfg=configs[type];if(!cfg)return null;
  const init={};cfg.fields.forEach(f=>{init[f.k]=item?.[f.k]||"";});
  const[f,sF]=useState(init);const[sv,sSv]=useState(false);const s=(k,v)=>sF(p=>({...p,[k]:v}));
  const save=async()=>{const req=cfg.fields.find(x=>x.r);if(req&&!f[req.k]?.trim())return;sSv(true);try{const pl={...f,updated_at:new Date().toISOString()};cfg.fields.filter(x=>x.num).forEach(x=>{pl[x.k]=parseFloat(pl[x.k])||0;});if(isNew)await q(`/rest/v1/${cfg.table}`,token,{method:"POST",body:JSON.stringify(pl)});else await q(`/rest/v1/${cfg.table}?id=eq.${item.id}`,token,{method:"PATCH",body:JSON.stringify(pl)});onSave();}catch(x){alert(x.message);}finally{sSv(false);}};
  const del=async()=>{if(!confirm("Delete?"))return;try{await q(`/rest/v1/${cfg.table}?id=eq.${item.id}`,token,{method:"DELETE"});onSave();}catch(x){alert(x.message);}};
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}><div style={{width:500,maxHeight:"80vh",background:"var(--panel)",borderRadius:16,overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
    <div style={{padding:"16px 22px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{...T,fontSize:16,fontWeight:700}}>{isNew?"New "+type:item.name||item.title||"Edit"}</div><div style={{display:"flex",gap:8}}>{!isNew&&<button onClick={del} style={{...BG,padding:"5px 8px",color:"#FF4B4B"}}><Trash2 size={13}/></button>}<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><X size={16}/></button></div></div>
    <div style={{flex:1,overflowY:"auto",padding:"16px 22px"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      {cfg.fields.map(fld=>{const span=fld.area?{gridColumn:"1/-1"}:{};const sectorSel=fld.sel;
        return(<div key={fld.k} style={span}><label style={LB}>{fld.l}</label>
          {fld.sel?<select value={f[fld.k]} onChange={e=>s(fld.k,e.target.value)} style={IP}>{(sectorSel||fld.sel).map(o=><option key={o} value={o}>{o||"Select"}</option>)}</select>
          :fld.area?<textarea value={f[fld.k]} onChange={e=>s(fld.k,e.target.value)} rows={3} style={{...IP,resize:"vertical"}}/>
          :fld.date?<input type="date" value={f[fld.k]} onChange={e=>s(fld.k,e.target.value)} style={IP}/>
          :fld.num?<input type="number" value={f[fld.k]} onChange={e=>s(fld.k,e.target.value)} style={IP}/>
          :<input value={f[fld.k]} onChange={e=>s(fld.k,e.target.value)} style={IP}/>}
        </div>);})}
    </div></div>
    <div style={{padding:"12px 22px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"flex-end",gap:10}}><button onClick={onClose} style={BG}>Cancel</button><button onClick={save} disabled={sv} style={{...BP,opacity:sv?0.6:1}}><Save size={13} style={{marginRight:5}}/>{sv?"Saving...":isNew?"Create":"Save"}</button></div>
  </div></div>);
}

function Marketing({token}){const[vw,sVw]=useState("campaigns");const[camps,sCamps]=useState([]);const[leads,sLeads]=useState([]);const[assets,sAssets]=useState([]);const[mktModal,sMktModal]=useState(null);
  const loadMkt=useCallback(()=>{if(!token)return;q("/rest/v1/campaigns?select=*&order=created_at.desc",token).then(sCamps).catch(()=>{});q("/rest/v1/leads?select=*&order=created_at.desc",token).then(sLeads).catch(()=>{});q("/rest/v1/content_assets?select=*&order=created_at.desc",token).then(sAssets).catch(()=>{});},[token]);
useEffect(()=>{loadMkt();},[loadMkt]);
const tabs=[{id:"campaigns",label:`Campaigns (${camps.length})`,icon:Megaphone},{id:"leads",label:`Leads (${leads.length})`,icon:UserPlus},{id:"content",label:`Content (${assets.length})`,icon:FileText}];
return(<div><div style={{marginBottom:20}}><div style={{...T,fontSize:22,fontWeight:800}}>Marketing</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>Campaigns, leads, and content assets</div></div>
<div style={{display:"flex",gap:6,marginBottom:20,justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:6}}>{tabs.map(t=>{const I=t.icon;return(<button key={t.id} onClick={()=>sVw(t.id)} style={{...M,fontSize:11,padding:"7px 14px",borderRadius:8,border:"1px solid var(--border)",background:vw===t.id?"rgba(0,135,159,0.06)":"transparent",color:vw===t.id?"#00879F":"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><I size={13}/>{t.label}</button>);})}</div><button onClick={()=>sMktModal({type:vw==="content"?"asset":vw==="leads"?"lead":"campaign",item:null})} style={BP}><Plus size={13} style={{marginRight:5}}/>New</button></div>
{vw==="campaigns"&&<div style={CS}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Name","Type","Sector","Status","Budget","Dates"].map(h=><th key={h} style={{...M,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{camps.map(c=><tr key={c.id} style={{borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>sMktModal({type:"campaign",item:c})} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,135,159,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 14px",fontWeight:600}}>{c.name}</td><td style={{padding:"10px 14px",color:"var(--sub)"}}>{c.type||"—"}</td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{c.sector||"—"}</td><td style={{padding:"10px 14px"}}><span style={{...M,fontSize:10,padding:"3px 8px",borderRadius:4,background:c.status==="Active"?"rgba(0,212,156,0.06)":c.status==="Planned"?"rgba(255,184,0,0.06)":"rgba(138,155,170,0.06)",color:c.status==="Active"?"#00D49C":c.status==="Planned"?"#FFB800":"#8A9BAA"}}>{c.status}</span></td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{c.budget_sar?`SAR ${Number(c.budget_sar).toLocaleString()}`:"—"}</td><td style={{padding:"10px 14px",...M,fontSize:10,color:"var(--muted)"}}>{c.start_date||"—"}</td></tr>)}{camps.length===0&&<tr><td colSpan={6} style={{padding:24,textAlign:"center",color:"var(--muted)"}}>No campaigns yet</td></tr>}</tbody></table></div>}
{vw==="leads"&&<div style={CS}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Name","Organization","Sector","Source","Status","Created"].map(h=><th key={h} style={{...M,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{leads.map(l=><tr key={l.id} style={{borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>sMktModal({type:"lead",item:l})} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,135,159,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 14px",fontWeight:600}}>{l.name}</td><td style={{padding:"10px 14px",color:"var(--sub)"}}>{l.organization||"—"}</td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{l.sector||"—"}</td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{l.source_type||"—"}</td><td style={{padding:"10px 14px"}}><span style={{...M,fontSize:10,padding:"3px 8px",borderRadius:4,background:l.status==="Hot"?"rgba(255,75,75,0.06)":l.status==="Warm"?"rgba(255,184,0,0.06)":"rgba(138,155,170,0.06)",color:l.status==="Hot"?"#FF4B4B":l.status==="Warm"?"#FFB800":"#8A9BAA"}}>{l.status}</span></td><td style={{padding:"10px 14px",...M,fontSize:10,color:"var(--muted)"}}>{l.created_at?new Date(l.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"—"}</td></tr>)}{leads.length===0&&<tr><td colSpan={6} style={{padding:24,textAlign:"center",color:"var(--muted)"}}>No leads yet</td></tr>}</tbody></table></div>}
{vw==="content"&&<div style={CS}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Title","Type","Sector","Status","Created"].map(h=><th key={h} style={{...M,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{assets.map(a=><tr key={a.id} style={{borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>sMktModal({type:"asset",item:a})} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,135,159,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 14px",fontWeight:600}}>{a.title||a.name||"—"}</td><td style={{padding:"10px 14px",color:"var(--sub)"}}>{a.asset_type||a.type||"—"}</td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{a.sector||"—"}</td><td style={{padding:"10px 14px"}}><span style={{...M,fontSize:10,padding:"3px 8px",borderRadius:4,background:"rgba(0,135,159,0.06)",color:"#00879F"}}>{a.status||"Draft"}</span></td><td style={{padding:"10px 14px",...M,fontSize:10,color:"var(--muted)"}}>{a.created_at?new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"—"}</td></tr>)}{assets.length===0&&<tr><td colSpan={5} style={{padding:24,textAlign:"center",color:"var(--muted)"}}>No assets yet</td></tr>}</tbody></table></div>}

{mktModal&&<MktModal type={mktModal.type} item={mktModal.item} onClose={()=>sMktModal(null)} onSave={()=>{sMktModal(null);loadMkt();}} token={token}/>}
</div>);}


// ═══ AGENT EXECUTION ENGINE ═══
async function queueAgentAction(token,agentName,actionType,dealId,title,description,suggestedAction,priority){
  try{
    const existing=await fetch(`${SU}/rest/v1/agent_queue?agent_name=eq.${encodeURIComponent(agentName)}&title=eq.${encodeURIComponent(title)}&status=eq.pending&select=id&limit=1`,{headers:{apikey:SK,Authorization:`Bearer ${token}`}}).then(r=>r.json()).catch(()=>[]);
    if(existing&&existing.length>0)return;
  }catch(e){}
  await q("/rest/v1/agent_queue",token,{method:"POST",body:JSON.stringify({agent_name:agentName,action_type:actionType,deal_id:dealId||null,title,description,suggested_action:suggestedAction||null,priority:priority||"medium",status:"pending",created_at:new Date().toISOString()})});
}

async function runPipelineGuardian(token,deals){
  const active=deals.filter(d=>d.status==="Active");const now=Date.now();const DAY=86400000;let count=0;
  for(const d of active){
    const stale=Math.floor((now-new Date(d.updated_at||d.created_at).getTime())/DAY);
    if(stale>=10){
      const prio=stale>=21?"critical":stale>=14?"high":"medium";
      await queueAgentAction(token,"Pipeline Guardian","flag_stale",d.id,
        d.client_name+": "+stale+" days without activity",
        "Deal stalled "+stale+" days. Deals beyond 14 days have significantly lower close rates. Sector: "+(d.sector||"unknown")+". Stage: "+d.stage+".",
        "Re-engage with "+d.client_name+" or update status to Stalled.",prio);
      count++;
    }
    if(d.next_meeting){const over=Math.floor((now-new Date(d.next_meeting).getTime())/DAY);
      if(over>0){await queueAgentAction(token,"Pipeline Guardian","overdue_meeting",d.id,
        d.client_name+": meeting "+over+" days overdue",
        "Scheduled meeting was "+over+" days ago with no update. Contact: "+(d.contact_name||"unknown")+".",
        "Reschedule or log the meeting outcome.","high");count++;}
    }
  }
  return count+" issues flagged across "+active.length+" active deals";
}

async function runDealScorer(token,deals){
  const active=deals.filter(d=>d.status==="Active");let updated=0;
  const stageOrder={Recognition:0,Proof:1,Integration:2,Dependency:3,Expansion:4};
  for(const d of active){
    let score=0;const now=Date.now();const DAY=86400000;
    const daysSince=Math.floor((now-new Date(d.updated_at||d.created_at).getTime())/DAY);
    if(daysSince<=3)score+=4;else if(daysSince<=7)score+=3;else if(daysSince<=14)score+=2;else if(daysSince<=21)score+=1;
    score+=Math.min(stageOrder[d.stage]||0,3);
    if(d.next_step&&d.next_step.trim())score+=2;
    if(d.tags&&d.tags.trim())score+=2;
    if(d.expected_value&&Number(d.expected_value)>0)score+=2;
    if(d.contact_name&&d.contact_name.trim())score+=1;
    score=Math.min(Math.round(score/16*100),100);
    const diff=Math.abs(score-(d.deal_score||0));
    if(diff>=5){
      const dir=score>(d.deal_score||0)?"up":"down";
      await q(`/rest/v1/deals?id=eq.${d.id}`,token,{method:"PATCH",body:JSON.stringify({deal_score:score,updated_at:new Date().toISOString()})});
      await queueAgentAction(token,"Deal Scorer","score_update",d.id,
        d.client_name+": score "+(d.deal_score||0)+" -> "+score+" ("+dir+")",
        "Score changed based on: activity recency ("+daysSince+"d), stage ("+d.stage+"), completeness.",
        dir==="down"?"Update deal details or re-engage client.":null,"medium");
      updated++;
    }
  }
  return updated+" deals rescored out of "+active.length;
}

async function runFollowThrough(token,deals){
  const active=deals.filter(d=>d.status==="Active");const now=Date.now();const DAY=86400000;let count=0;
  for(const d of active){
    if(d.next_step&&d.next_step.trim()&&d.updated_at){
      const days=Math.floor((now-new Date(d.updated_at).getTime())/DAY);
      if(days>=7){
        await queueAgentAction(token,"Follow-through","overdue_step",d.id,
          d.client_name+": next step pending "+days+" days",
          "Committed next step: \""+d.next_step.slice(0,100)+"\" — "+days+" days without update.",
          "Complete the next step or update it.","high");
        count++;
      }
    }
  }
  return count+" overdue next steps found";
}

async function runLeadNurture(token,leads){
  let count=0;
  const hot=leads.filter(l=>l.status==="Hot"||l.status==="Ready");
  for(const l of hot){
    if(!l.converted_deal_id){
      await queueAgentAction(token,"Lead Nurture","convert_ready",null,
        (l.name||"Unknown")+": "+l.status+" lead ready for conversion",
        "Lead from "+(l.organization||"?")+", sector: "+(l.sector||"?")+". Source: "+(l.source_type||"?")+". Status: "+l.status+".",
        "Convert to deal in CRM at Recognition stage.",l.status==="Ready"?"high":"medium");
      count++;
    }
  }
  return count+" leads flagged for conversion";
}

async function runContentGap(token,deals,assets){
  const activeSectors=[...new Set(deals.filter(d=>d.status==="Active").map(d=>d.sector).filter(Boolean))];
  const assetSectors=[...new Set((assets||[]).map(a=>a.sector).filter(Boolean))];
  const gaps=activeSectors.filter(s=>!assetSectors.includes(s));let count=0;
  for(const s of gaps){
    const dealCount=deals.filter(d=>d.status==="Active"&&d.sector===s).length;
    await queueAgentAction(token,"Content Gap","sector_gap",null,
      s+": "+dealCount+" active deals, zero content assets",
      "Sector "+s+" has "+dealCount+" deals in pipeline but no content assets (decks, proposals, case studies) to support them.",
      "Create at least a one-pager and pitch deck for "+s+" sector.","high");
    count++;
  }
  return count+" sector content gaps identified";
}

async function runAIAgent(token,agentName,prompt,passedKey){
  let ck=passedKey||null;
  if(!ck){try{const kr=await q("/rest/v1/system_config?config_key=eq.claude_api_key&select=config_value",token);if(kr?.[0]?.config_value)ck=kr[0].config_value.replace(/[^\x20-\x7E]/g,"").trim();}catch(e){}}
  try{
    const d=await callClaude(ck,[{role:"user",content:prompt}],{max_tokens:800});
    const text=d.content?.map(c=>c.text||"").join("")||"No response";
    await q("/rest/v1/agent_queue",token,{method:"POST",body:JSON.stringify({
      agent_name:agentName,action_type:"ai_analysis",title:agentName+" Analysis — "+new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short"}),
      description:text.slice(0,2000),priority:"medium",status:"pending",created_at:new Date().toISOString()})});
    return "Analysis complete";
  }catch(e){return"Error: "+e.message;}
}

async function runAllAgents(token,deals,leads,assets,debriefs,claudeKey){
  const results={};
  results.pipeline_guardian=await runPipelineGuardian(token,deals);
  results.deal_scorer=await runDealScorer(token,deals);
  results.followthrough=await runFollowThrough(token,deals);
  results.lead_nurture=await runLeadNurture(token,leads||[]);
  results.content_gap=await runContentGap(token,deals,assets||[]);

  const active=deals.filter(d=>d.status==="Active");
  const dealCtx=active.slice(0,10).map(d=>d.client_name+" ("+d.sector+", "+d.stage+", SAR "+(d.expected_value||0).toLocaleString()+")").join("; ");

  results.sector_radar=await runAIAgent(token,"Sector Radar",
    "Analyze sector patterns in these deals: "+dealCtx+". Identify which sectors are strongest, which are underserved, and recommend where to focus next. Be concise, 3-5 bullet points.",claudeKey);

  if(debriefs&&debriefs.length>0){
    const dbCtx=debriefs.slice(0,5).map(d=>d.sector+": confirmed="+((d.confirmed||"").slice(0,80))+", challenged="+((d.challenged||"").slice(0,80))+", new="+((d.new_signal||"").slice(0,80))).join("\n");
    results.debrief_analyst=await runAIAgent(token,"Debrief Analyst",
      "Analyze these recent meeting debriefs and extract patterns:\n"+dbCtx+"\nWhat themes emerge? What beliefs need updating? 3-5 insights.",claudeKey);
    results.belief_evolution=await runAIAgent(token,"Belief Evolution",
      "Based on these debrief signals:\n"+dbCtx+"\nWhich sector beliefs are being confirmed vs challenged? Recommend belief updates. Be specific.",claudeKey);
  }else{results.debrief_analyst="No debriefs to analyze";results.belief_evolution="No debrief data";}

  const wonLost=deals.filter(d=>d.status==="Won"||d.status==="Lost");
  if(wonLost.length>2){
    const wlCtx=wonLost.slice(0,8).map(d=>d.client_name+" ("+d.sector+") = "+d.status+", value: SAR "+(d.expected_value||0).toLocaleString()).join("; ");
    results.winloss_intel=await runAIAgent(token,"Win/Loss Intel","Analyze won/lost patterns: "+wlCtx+". What differentiates wins from losses? 3-5 insights.",claudeKey);
  }else{results.winloss_intel="Not enough won/lost data";}

  results.team_coach=await runAIAgent(token,"Team Coach",
    "Pipeline has "+active.length+" active deals. "+deals.filter(d=>d.status==="Won").length+" won, "+deals.filter(d=>d.status==="Lost").length+" lost. Average deal value: SAR "+Math.round(active.reduce((s,d)=>s+(d.expected_value||0),0)/Math.max(active.length,1)).toLocaleString()+". Provide 3 coaching recommendations for the BD team.",claudeKey);

  results.campaign_roi=await runAIAgent(token,"Campaign ROI",
    "We have "+active.length+" active deals across sectors. Leads feed from campaigns. Recommend how to measure and improve campaign ROI for a sovereign AI company in Saudi Arabia. 3-5 actionable points.",claudeKey);

  results.brief_architect="Briefs generated on-demand via Meetings tab";
  return results;
}

function AgentsTab({token,deals,leads,assets,debriefs,onRefresh,claudeKey,onOpenDeal}){
  const[queue,sQueue]=useState([]);const[running,sRunning]=useState(null);const[results,sResults]=useState({});const[runAll,sRunAll]=useState(false);
  const loadQueue=useCallback(()=>{if(token)q("/rest/v1/agent_queue?select=*&order=created_at.desc&limit=40",token).then(sQueue).catch(()=>{});},[token]);
  useEffect(()=>{loadQueue();},[loadQueue]);

  const execOne=async(agent)=>{sRunning(agent.key);
    try{
      let res="";
      switch(agent.key){
        case"pipeline_guardian":res=await runPipelineGuardian(token,deals);break;
        case"deal_scorer":res=await runDealScorer(token,deals);break;
        case"followthrough":res=await runFollowThrough(token,deals);break;
        case"lead_nurture":res=await runLeadNurture(token,leads||[]);break;
        case"content_gap":res=await runContentGap(token,deals,assets||[]);break;
        case"brief_architect":res="Briefs generated on-demand in Meetings tab";break;
        default:{
          const active=deals.filter(d=>d.status==="Active");
          const ctx=active.slice(0,10).map(d=>d.client_name+" ("+d.sector+", "+d.stage+")").join("; ");
          res=await runAIAgent(token,agent.name,"You are "+agent.name+" agent. "+agent.desc+". Analyze: "+ctx+". Provide 3-5 actionable insights. Be concise.",claudeKey);
        }
      }
      sResults(p=>({...p,[agent.key]:res}));loadQueue();if(onRefresh)onRefresh();
    }catch(e){sResults(p=>({...p,[agent.key]:"Error: "+e.message}));}
    finally{sRunning(null);}
  };

  const execAll=async()=>{sRunAll(true);
    try{const res=await runAllAgents(token,deals,leads,assets,debriefs,claudeKey);sResults(res);loadQueue();if(onRefresh)onRefresh();}
    catch(e){console.error(e);}finally{sRunAll(false);}
  };

  const dismiss=async(id)=>{
    try{await q(`/rest/v1/agent_queue?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify({status:"dismissed"})});loadQueue();}catch(e){}
  };

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
      <div><div style={{...T,fontSize:22,fontWeight:800}}>Agents</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>12 sovereign intelligence agents</div></div>
      <button onClick={execAll} disabled={runAll} style={{...BP,opacity:runAll?0.6:1}}><Zap size={14} style={{marginRight:6}}/>{runAll?"Running all...":"Run All Agents"}</button>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:28}}>
      {AGENTS.map(a=>{const I=a.icon;const isRunning=running===a.key;const hasResult=results[a.key];
      return(<div key={a.key} style={{...CS,padding:"16px 18px",transition:"all .2s",position:"relative"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,135,159,0.2)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:30,height:30,borderRadius:8,background:a.color+"12",display:"flex",alignItems:"center",justifyContent:"center",color:a.color}}><I size={15}/></div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{a.name}</div><span style={{...M,fontSize:9,color:a.type==="hourly"?"#00D49C":"#FFB800"}}>{a.type.toUpperCase()}</span></div>
          <button onClick={()=>execOne(a)} disabled={isRunning||runAll} style={{padding:"4px 8px",borderRadius:5,border:"1px solid var(--border)",background:isRunning?"rgba(0,135,159,0.06)":"transparent",cursor:isRunning?"wait":"pointer",color:isRunning?"#00879F":"var(--muted)",fontSize:10,...M}}>{isRunning?"Running...":"Run"}</button>
        </div>
        <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{a.desc}</div>
        {hasResult&&<div style={{marginTop:8,padding:"6px 10px",background:"rgba(0,212,156,0.04)",border:"1px solid rgba(0,212,156,0.1)",borderRadius:6,fontSize:11,color:"#00D49C",...M}}>{typeof hasResult==="string"?hasResult.slice(0,100):hasResult}</div>}
      </div>);})}
    </div>

    {queue.filter(q2=>q2.status==="pending").length>0&&<>
      <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>PENDING ACTIONS ({queue.filter(q2=>q2.status==="pending").length})</div>
      <div style={CS}>{queue.filter(q2=>q2.status==="pending").map(item=>(
        <div key={item.id} style={{padding:"14px 18px",borderBottom:"1px solid var(--border)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <span style={{...M,fontSize:9,padding:"2px 6px",borderRadius:3,background:item.priority==="critical"?"rgba(255,75,75,0.08)":item.priority==="high"?"rgba(255,184,0,0.08)":"rgba(0,135,159,0.06)",color:item.priority==="critical"?"#FF4B4B":item.priority==="high"?"#FFB800":"#00879F"}}>{item.priority?.toUpperCase()}</span>
                <span style={{...M,fontSize:9,color:"var(--muted)"}}>{item.agent_name}</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{item.title}</div>
              <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{(item.description||"").slice(0,200)}</div>
              {item.suggested_action&&<div style={{fontSize:11,color:"#00D49C",marginTop:4,...M}}>{item.suggested_action.slice(0,150)}</div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginLeft:10,flexShrink:0}}>
              <button onClick={async()=>{try{await q(`/rest/v1/agent_queue?id=eq.${item.id}`,token,{method:"PATCH",body:JSON.stringify({status:"approved"})});loadQueue();}catch(e){}}} style={{padding:"4px 10px",borderRadius:5,border:"none",background:"#00879F",color:"#fff",cursor:"pointer",fontSize:10,...M}}>Approve</button>
              <button onClick={()=>dismiss(item.id)} style={{padding:"4px 10px",borderRadius:5,border:"1px solid var(--border)",background:"none",cursor:"pointer",color:"var(--muted)",fontSize:10,...M}}>Dismiss</button>
              {item.deal_id&&<button onClick={()=>onOpenDeal&&onOpenDeal(item.deal_id)} style={{padding:"3px 8px",borderRadius:4,border:"1px solid var(--border)",background:"none",cursor:"pointer",color:"#00879F",fontSize:9,...M}}>View Deal</button>}
            </div>
          </div>
        </div>
      ))}</div>
    </>}

    {queue.filter(q2=>q2.status!=="pending").length>0&&<div style={{marginTop:20}}>
      <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>HISTORY</div>
      <div style={CS}>{queue.filter(q2=>q2.status!=="pending").slice(0,10).map(item=>(
        <div key={item.id} style={{padding:"10px 18px",borderBottom:"1px solid var(--border)",opacity:0.6}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:500}}>{item.title}</span><span style={{...M,fontSize:9,color:"var(--muted)"}}>{item.status}</span></div>
        </div>
      ))}</div>
    </div>}
  </div>);
}

function Meetings({deals,profile,token,elKey,claudeKey}){
  const[view,sView]=useState("brief");
  // Brief form
  const[bf,sBf]=useState({client:"",sector:"",meetingType:"First meeting",attendees:"",previous:"",challenges:"",news:"",value:"",goal:""});const[savedBriefs,sSB]=useState([]);
  const[brief,sBrief]=useState("");const[genBusy,sGB]=useState(false);
  const setBf=(k,v)=>sBf(p=>({...p,[k]:v}));
  const clearBf=()=>{sBf({client:"",sector:"",meetingType:"First meeting",attendees:"",previous:"",challenges:"",news:"",value:"",goal:""});sBrief("");};
  // Pre-fill from deal
  const a=deals.filter(d=>d.status==="Active");
  const prefill=(dealId)=>{const d=a.find(x=>x.id===dealId);if(d)sBf(p=>({...p,client:d.client_name||"",sector:d.sector||"",value:d.expected_value?String(d.expected_value):"",goal:d.next_step||""}));};

  const generate=async()=>{if(!bf.client.trim()){alert("Client name required");return;}sGB(true);sBrief("");
    const prompt="Generate a comprehensive pre-meeting brief for the HUMAIN BD team.\n\n"+
      "CLIENT: "+bf.client+"\n"+
      "SECTOR: "+(bf.sector||"Not specified")+"\n"+
      "MEETING TYPE: "+bf.meetingType+"\n"+
      (bf.attendees?"ATTENDEES: "+bf.attendees+"\n":"")+
      (bf.previous?"PREVIOUS MEETING OUTCOMES: "+bf.previous+"\n":"")+
      (bf.challenges?"CHALLENGES MENTIONED: "+bf.challenges+"\n":"")+
      (bf.news?"RECENT NEWS: "+bf.news+"\n":"")+
      (bf.value?"EXPECTED VALUE: SAR "+bf.value+"\n":"")+
      (bf.goal?"MEETING GOAL: "+bf.goal+"\n":"")+
      "\nProvide a structured brief with:\n"+
      "1. CLIENT CONTEXT — 3-4 lines about their sector situation and likely priorities\n"+
      "2. HUMAIN BELIEF STATEMENT — what we believe about their core challenge\n"+
      "3. CONVERSATION FLOW — 4 timed steps with talk tracks (rapport, insight, diagnosis, next step)\n"+
      "4. KEY QUESTIONS — 3 diagnostic questions that reveal the execution gap\n"+
      "5. OBJECTION PREPARATION — 2 likely objections with responses\n"+
      "6. RECOMMENDED NEXT STEP — specific committed action with timeline\n\n"+
      "Be specific to Saudi Arabia and HUMAIN sovereign AI positioning. Use sector intelligence. Every recommendation must be actionable.";
    try{const d=await callClaude(claudeKey,[{role:"user",content:prompt}],{max_tokens:2000});
      const txt=d.content?.map(c=>c.text||"").join("")||"No response";sBrief(txt);
      try{await q("/rest/v1/briefs",token,{method:"POST",body:JSON.stringify({client_name:bf.client,sector:bf.sector,meeting_type:bf.meetingType,context_data:JSON.stringify({attendees:bf.attendees,previous:bf.previous,challenges:bf.challenges,news:bf.news,goal:bf.goal,value:bf.value}),brief_content:txt,generated_by:profile?.full_name||"",created_at:new Date().toISOString()})});
      q("/rest/v1/briefs?select=*&order=created_at.desc&limit=10",token).then(sSB).catch(()=>{});}catch(e){}
    }catch(x){sBrief("Error: "+x.message);}finally{sGB(false);}};

  // Debrief
  const[dbf,sDbf]=useState({client_name:"",sector:"",confirmed:"",challenged:"",new_signal:"",next_step:"",deal_id:""});
  const[dbSv,sDbSv]=useState(false);const[debriefs,sDebriefs]=useState([]);
  const setDb=(k,v)=>sDbf(p=>({...p,[k]:v}));
  useEffect(()=>{if(token){q("/rest/v1/debriefs?select=*&order=created_at.desc&limit=20",token).then(sDebriefs).catch(()=>{});q("/rest/v1/briefs?select=*&order=created_at.desc&limit=10",token).then(sSB).catch(()=>{});}},[token]);
  const saveDebrief=async()=>{if(!dbf.client_name.trim()){alert("Client name required");return;}sDbSv(true);
    try{await q("/rest/v1/debriefs",token,{method:"POST",body:JSON.stringify({...dbf,deal_id:dbf.deal_id||null,created_by:profile?.full_name||"",created_at:new Date().toISOString()})});
    sDbf({client_name:"",sector:"",confirmed:"",challenged:"",new_signal:"",next_step:"",deal_id:""});
    q("/rest/v1/debriefs?select=*&order=created_at.desc&limit=20",token).then(sDebriefs).catch(()=>{});
    }catch(x){alert(x.message);}finally{sDbSv(false);}};

  return(<div>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:24,height:2,background:"linear-gradient(90deg,#00879F,#00D49C)",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.14em",color:"#00879F"}}>BEFORE & AFTER EVERY CLIENT MEETING</span></div>
    <div style={{...T,fontSize:26,fontWeight:800,marginBottom:6}}>Meetings</div>
    <div style={{fontSize:14,color:"var(--sub)",lineHeight:1.6,maxWidth:540,marginBottom:20}}>Prepare the brief before you walk in. Capture the debrief within 90 seconds of walking out. One workflow, one place.</div>

    {/* Toggle */}
    <div style={{display:"inline-flex",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)",marginBottom:28}}>
      <button onClick={()=>sView("brief")} style={{padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",border:"none",background:view==="brief"?"#00879F":"var(--card-bg)",color:view==="brief"?"#fff":"var(--muted)",transition:"all .2s"}}>Pre-Meeting Brief</button>
      <button onClick={()=>sView("debrief")} style={{padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",border:"none",background:view==="debrief"?"#00879F":"var(--card-bg)",color:view==="debrief"?"#fff":"var(--muted)",transition:"all .2s"}}>Post-Meeting Debrief</button>
    </div>

    {view==="brief"&&<div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><div style={{width:20,height:2,background:"#00D49C",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.12em",color:"#00D49C"}}>POWERED BY CLAUDE AI</span></div>
      <div style={{...T,fontSize:20,fontWeight:800,marginBottom:4}}>Pre-Meeting Brief Generator</div>
      <div style={{fontSize:13,color:"var(--sub)",marginBottom:20}}>Real AI brief — specific to your client, your context, your goal.</div>

      {/* Quick-fill from deal */}
      <div style={{marginBottom:16}}><label style={LB}>QUICK-FILL FROM DEAL</label>
        <select onChange={e=>{if(e.target.value)prefill(e.target.value);}} style={{...IP,maxWidth:400}}><option value="">Select to pre-fill fields...</option>{a.map(d=><option key={d.id} value={d.id}>{d.client_name} ({d.sector}, {d.stage})</option>)}</select>
      </div>

      <div style={{...CS,padding:"24px 28px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><FileText size={16} color="#00879F"/><span style={{fontSize:14,fontWeight:700}}>Meeting Details</span></div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:18}}>The more context you give, the sharper the brief</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
          <div><label style={{...LB,color:"#00879F"}}>CLIENT / ENTITY</label><input value={bf.client} onChange={e=>setBf("client",e.target.value)} placeholder="e.g. Saudi Aramco, MOH, PIF" style={IP}/></div>
          <div><label style={{...LB,color:"#00879F"}}>SECTOR</label><select value={bf.sector} onChange={e=>setBf("sector",e.target.value)} style={IP}><option value="">Select</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label style={{...LB,color:"#00879F"}}>MEETING TYPE</label><select value={bf.meetingType} onChange={e=>setBf("meetingType",e.target.value)} style={IP}><option>First meeting</option><option>Follow-up</option><option>Technical deep-dive</option><option>Executive presentation</option></select></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div><label style={{...LB,color:"#00879F"}}>WHO IS ATTENDING? (roles & seniority)</label><textarea value={bf.attendees} onChange={e=>setBf("attendees",e.target.value)} rows={3} placeholder="e.g. CTO, Head of Digital Transformation, 2 senior engineers..." style={{...IP,resize:"vertical"}}/></div>
          <div><label style={{...LB,color:"#00879F"}}>PREVIOUS MEETING OUTCOMES</label><textarea value={bf.previous} onChange={e=>setBf("previous",e.target.value)} rows={3} placeholder="What happened in previous meetings? Agreements, objections, signals..." style={{...IP,resize:"vertical"}}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div><label style={{...LB,color:"#00879F"}}>CHALLENGES THEY MENTIONED</label><textarea value={bf.challenges} onChange={e=>setBf("challenges",e.target.value)} rows={3} placeholder="Pain points, blockers, or concerns they raised..." style={{...IP,resize:"vertical"}}/></div>
          <div><label style={{...LB,color:"#00879F"}}>RECENT NEWS ABOUT THIS ORGANISATION</label><textarea value={bf.news} onChange={e=>setBf("news",e.target.value)} rows={3} placeholder="Leadership changes, announcements, projects, budget cycles..." style={{...IP,resize:"vertical"}}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
          <div><label style={{...LB,color:"#00879F"}}>EXPECTED DEAL VALUE (SAR)</label><input value={bf.value} onChange={e=>setBf("value",e.target.value)} placeholder="e.g. 2,000,000" style={IP}/></div>
          <div><label style={{...LB,color:"#00879F"}}>WHAT MUST THIS MEETING ACHIEVE?</label><input value={bf.goal} onChange={e=>setBf("goal",e.target.value)} placeholder="e.g. Commit to technical session, secure diagnostic engagement" style={IP}/></div>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={generate} disabled={genBusy||!bf.client.trim()} style={{...BP,padding:"10px 24px",opacity:genBusy||!bf.client.trim()?0.5:1}}><FileText size={14} style={{marginRight:6}}/>{genBusy?"Generating...":"Generate Brief"}</button>
          <button onClick={clearBf} style={{...BG,padding:"10px 24px"}}>Clear</button>
        </div>
      </div>

      {brief&&<div style={{...CS,padding:"24px 28px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:20,height:2,background:"#00D49C",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.12em",color:"#00D49C"}}>AI-GENERATED BRIEF</span></div>
        <div style={{fontSize:13.5,lineHeight:1.75,color:"var(--sub)",whiteSpace:"pre-wrap"}}>{brief}</div>
      </div>}
      {savedBriefs.length>0&&<div>
        <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>SAVED BRIEFS ({savedBriefs.length})</div>
        <div style={CS}>{savedBriefs.map(b=><div key={b.id} onClick={()=>sBrief(b.brief_content||"")} style={{padding:"12px 18px",borderBottom:"1px solid var(--border)",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,135,159,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <div><div style={{fontSize:13,fontWeight:600}}>{b.client_name}</div><div style={{...M,fontSize:10,color:"var(--muted)",marginTop:2}}>{b.sector||""} · {b.meeting_type||""} · {b.generated_by||""}</div></div>
          <span style={{...M,fontSize:10,color:"var(--muted)"}}>{b.created_at?new Date(b.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"--"}</span>
        </div>)}</div>
      </div>}
    </div>}

    {view==="debrief"&&<div>
      <div style={{...CS,padding:"24px 28px",marginBottom:20}}>
        <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:14}}>POST-MEETING BELIEF DEBRIEF</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div><label style={LB}>CLIENT NAME</label><input value={dbf.client_name} onChange={e=>setDb("client_name",e.target.value)} style={IP}/></div>
          <div><label style={LB}>SECTOR</label><select value={dbf.sector} onChange={e=>setDb("sector",e.target.value)} style={IP}><option value="">Select</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label style={LB}>LINK TO DEAL</label><select value={dbf.deal_id} onChange={e=>setDb("deal_id",e.target.value)} style={IP}><option value="">None</option>{a.map(d=><option key={d.id} value={d.id}>{d.client_name}</option>)}</select></div>
          <div/>
          <div style={{gridColumn:"1/-1"}}><label style={{...LB,color:"#00D49C"}}>WHAT CONFIRMED OUR BELIEF</label><textarea value={dbf.confirmed} onChange={e=>setDb("confirmed",e.target.value)} rows={3} style={{...IP,borderColor:"rgba(0,212,156,0.2)"}} placeholder="Observable signals that validated our sector belief..."/></div>
          <div style={{gridColumn:"1/-1"}}><label style={{...LB,color:"#FF4B4B"}}>WHAT CHALLENGED OUR BELIEF</label><textarea value={dbf.challenged} onChange={e=>setDb("challenged",e.target.value)} rows={3} style={{...IP,borderColor:"rgba(255,75,75,0.15)"}} placeholder="What contradicted our assumptions..."/></div>
          <div style={{gridColumn:"1/-1"}}><label style={{...LB,color:"#FFB800"}}>WHAT WAS NEW</label><textarea value={dbf.new_signal} onChange={e=>setDb("new_signal",e.target.value)} rows={3} style={{...IP,borderColor:"rgba(255,184,0,0.15)"}} placeholder="Signals or information we did not have before..."/></div>
          <div style={{gridColumn:"1/-1"}}><label style={LB}>COMMITTED NEXT STEP</label><input value={dbf.next_step} onChange={e=>setDb("next_step",e.target.value)} style={IP} placeholder="Specific action with date..."/></div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={saveDebrief} disabled={dbSv} style={{...BP,opacity:dbSv?0.6:1}}><Save size={13} style={{marginRight:5}}/>{dbSv?"Saving...":"Save Debrief"}</button></div>
      </div>
      {debriefs.length>0&&<div>
        <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>RECENT DEBRIEFS ({debriefs.length})</div>
        <div style={CS}>{debriefs.map(d=><div key={d.id} style={{padding:"14px 18px",borderBottom:"1px solid var(--border)"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontWeight:600,fontSize:13}}>{d.client_name}</span><span style={{...M,fontSize:10,color:"var(--muted)"}}>{d.created_at?new Date(d.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"--"}</span></div>
          {d.confirmed&&<div style={{fontSize:12,color:"#00D49C",marginBottom:4}}>Confirmed: {d.confirmed.slice(0,120)}</div>}
          {d.challenged&&<div style={{fontSize:12,color:"#FF4B4B",marginBottom:4}}>Challenged: {d.challenged.slice(0,120)}</div>}
          {d.new_signal&&<div style={{fontSize:12,color:"#FFB800"}}>New: {d.new_signal.slice(0,120)}</div>}
        </div>)}</div>
      </div>}
    </div>}
  </div>);
}

function Admin({token}){const[users,sU]=useState([]);const[reqs,sR]=useState([]);
useEffect(()=>{if(!token)return;q("/rest/v1/profiles?select=*&order=full_name.asc",token).then(sU).catch(()=>{});q("/rest/v1/access_requests?select=*&order=requested_at.desc",token).then(sR).catch(()=>{});},[token]);
return(<div><div style={{marginBottom:20}}><div style={{...T,fontSize:22,fontWeight:800}}>Admin</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>{users.length} users · {reqs.filter(r=>r.status==="Pending").length} pending</div></div>
<div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>TEAM</div>
<div style={{...CS,marginBottom:24}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Name","Email","Role","Team","Last Seen"].map(h=><th key={h} style={{...M,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{users.map(u=><tr key={u.id} style={{borderBottom:"1px solid var(--border)"}}><td style={{padding:"10px 14px",fontWeight:600}}>{u.full_name||"—"}</td><td style={{padding:"10px 14px",color:"var(--sub)"}}>{u.email}</td><td style={{padding:"10px 14px"}}><select value={u.role||"member"} onChange={async(e)=>{const nr=e.target.value;try{await q(`/rest/v1/profiles?id=eq.${u.id}`,token,{method:"PATCH",body:JSON.stringify({role:nr})});sU(p=>p.map(x=>x.id===u.id?{...x,role:nr}:x));}catch(ex){alert(ex.message);}}} style={{...M,fontSize:10,padding:"3px 8px",borderRadius:4,background:u.role==="admin"?"rgba(208,249,74,0.1)":"rgba(0,135,159,0.06)",color:u.role==="admin"?"#6B8C00":"#00879F",border:"none",cursor:"pointer"}}><option value="admin">admin</option><option value="manager">manager</option><option value="member">member</option><option value="viewer">viewer</option></select></td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{u.team||"—"}</td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--muted)"}}>{u.last_seen?new Date(u.last_seen).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"Never"}</td></tr>)}</tbody></table></div>
{reqs.length>0&&<><div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>REQUESTS</div><div style={CS}>{reqs.map(r=><div key={r.id} style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,fontSize:13}}>{r.full_name}</div><div style={{fontSize:12,color:"var(--sub)"}}>{r.email} · {r.department||"—"}</div></div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{...M,fontSize:10,padding:"3px 10px",borderRadius:4,background:r.status==="Pending"?"rgba(255,184,0,0.08)":"rgba(0,212,156,0.08)",color:r.status==="Pending"?"#FFB800":"#00D49C"}}>{r.status}</span>{r.status==="Pending"&&<><button onClick={async()=>{try{await q(`/rest/v1/access_requests?id=eq.${r.id}`,token,{method:"PATCH",body:JSON.stringify({status:"Approved"})});sR(p=>p.map(x=>x.id===r.id?{...x,status:"Approved"}:x));}catch(e){alert(e.message);}}} style={{...BP,padding:"4px 10px",fontSize:10}}>Approve</button><button onClick={async()=>{try{await q(`/rest/v1/access_requests?id=eq.${r.id}`,token,{method:"PATCH",body:JSON.stringify({status:"Rejected"})});sR(p=>p.map(x=>x.id===r.id?{...x,status:"Rejected"}:x));}catch(e){alert(e.message);}}} style={{...BG,padding:"4px 10px",fontSize:10,color:"#FF4B4B"}}>Reject</button></>}</div></div>)}</div></>}
</div>);}


function DailyIntel({deals,profile,open,onClose}){
  const ac=deals.filter(d=>d.status==="Active");const stale=ac.filter(d=>d.updated_at&&(Date.now()-new Date(d.updated_at).getTime())>10*86400000);
  const todayMtgs=ac.filter(d=>d.next_meeting===new Date().toISOString().slice(0,10));
  const sectors=[...new Set(ac.map(d=>d.sector).filter(Boolean))];
  const pv=ac.reduce((s,d)=>s+(d.expected_value||0),0);
  return(<div style={{position:"fixed",top:0,right:open?0:-420,width:400,bottom:0,background:"var(--panel)",borderLeft:"1px solid var(--border)",zIndex:200,transition:"right .35s cubic-bezier(0.16,1,0.3,1)",display:"flex",flexDirection:"column",boxShadow:open?"-8px 0 32px rgba(0,0,0,0.1)":"none"}}>
    <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Activity size={16} color="#00D49C"/><span style={{...T,fontSize:16,fontWeight:700}}>Daily Intelligence</span></div><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><X size={16}/></button></div>
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{...M,fontSize:9,color:"var(--muted)"}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</span></div>
      <div style={{borderLeft:"3px solid #00D49C",padding:"12px 16px",background:"rgba(0,212,156,0.03)",borderRadius:"0 10px 10px 0",marginBottom:16}}>
        <div style={{...M,fontSize:9,letterSpacing:"0.1em",color:"#00D49C",marginBottom:4}}>PIPELINE SNAPSHOT</div>
        <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6}}>{ac.length} active deals across {sectors.length} sectors. Total pipeline: SAR {(pv/1e6).toFixed(1)}M.</div>
      </div>
      {stale.length>0&&<div style={{borderLeft:"3px solid #FF4B4B",padding:"12px 16px",background:"rgba(255,75,75,0.03)",borderRadius:"0 10px 10px 0",marginBottom:16}}>
        <div style={{...M,fontSize:9,letterSpacing:"0.1em",color:"#FF4B4B",marginBottom:4}}>STALLED ({stale.length})</div>
        {stale.slice(0,3).map(d=><div key={d.id} style={{fontSize:12,color:"var(--sub)",padding:"4px 0"}}>{d.client_name} — {Math.round((Date.now()-new Date(d.updated_at).getTime())/86400000)}d inactive</div>)}
      </div>}
      {todayMtgs.length>0&&<div style={{borderLeft:"3px solid #FFB800",padding:"12px 16px",background:"rgba(255,184,0,0.03)",borderRadius:"0 10px 10px 0",marginBottom:16}}>
        <div style={{...M,fontSize:9,letterSpacing:"0.1em",color:"#FFB800",marginBottom:4}}>TODAY'S MEETINGS ({todayMtgs.length})</div>
        {todayMtgs.map(d=><div key={d.id} style={{fontSize:12,color:"var(--sub)",padding:"4px 0"}}>{d.client_name} ({d.sector})</div>)}
      </div>}
      <div style={{borderLeft:"3px solid #00879F",padding:"12px 16px",background:"rgba(0,135,159,0.03)",borderRadius:"0 10px 10px 0",marginBottom:16}}>
        <div style={{...M,fontSize:9,letterSpacing:"0.1em",color:"#00879F",marginBottom:4}}>SECTOR COVERAGE</div>
        {SECTORS.map(s=>{const c=ac.filter(d=>d.sector===s).length;return c>0?<div key={s} style={{fontSize:12,color:"var(--sub)",padding:"3px 0"}}>{s}: {c} deals</div>:null;})}
        {SECTORS.filter(s=>!ac.some(d=>d.sector===s)).length>0&&<div style={{fontSize:11,color:"#FFB800",marginTop:4}}>Gap: {SECTORS.filter(s=>!ac.some(d=>d.sector===s)).join(", ")}</div>}
      </div>
    </div>
  </div>);
}

function FwAcc({b}){const[open,setOpen]=useState(false);return(
  <div style={{...CS,marginBottom:8,cursor:"pointer"}} onClick={()=>setOpen(!open)}>
    <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:28,height:28,borderRadius:8,background:b.c+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:b.c,flexShrink:0}}>◈</div>
      <div style={{flex:1}}><span style={{fontSize:14,fontWeight:600}}>{b.s}</span><span style={{...M,fontSize:11,color:"var(--muted)",marginLeft:8}}>{b.sub}</span></div>
      <span style={{...M,fontSize:10,color:"var(--muted)",transform:open?"rotate(180deg)":"none",transition:"transform .3s"}}>▼</span>
    </div>
    {open&&<div style={{padding:"0 20px 18px",borderTop:"1px solid var(--border)"}}>
      <div style={{marginTop:14}}><div style={{...M,fontSize:9,color:"#FF4B4B",marginBottom:4}}>WHAT THEY FEAR</div><div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:12}}>{b.fear}</div></div>
      <div><div style={{...M,fontSize:9,color:"#00D49C",marginBottom:4}}>OUR BELIEF</div><div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6}}>{b.belief}</div></div>
    </div>}
  </div>);
}
const PH=({label,icon:I})=><div style={{textAlign:"center",paddingTop:80}}><I size={32} style={{color:"var(--muted)",opacity:0.3,marginBottom:12}}/><div style={{...T,fontSize:20,fontWeight:700,marginBottom:6}}>{label}</div><div style={{...M,fontSize:11,color:"var(--muted)",letterSpacing:"0.1em"}}>STAGING — COMING SOON</div></div>;

export default function App(){
  const[session,sS]=useState(null);const[profile,sP]=useState(null);const[deals,sD]=useState([]);const[tab,sT]=useState("home");const[dark,sDk]=useState(false);const[sb,sSb]=useState(true);const[modal,sM]=useState(null);const[search,sSr]=useState("");const[srO,sSrO]=useState(false);const[dealFilter,sDealFilter]=useState("");const[stageFilter,setStageFilter]=useState("");const[statusFilter,setStatusFilter]=useState("");const[dealSort,sDealSort]=useState("updated");const[chatActive,sChatActive]=useState(false);const[notif,sN]=useState(0);const[intel,sIntel]=useState(false);const[elKey,sElKey]=useState('');const[claudeKey,sCK]=useState('');
  const tk=session?.access_token;const isA=profile?.role==="admin";
  const[leads,sLeads]=useState([]);const[assets,sAssets]=useState([]);const[debriefs,sDeb]=useState([]);const[suggestions,sSugg]=useState([]);const[savedBriefs2,sSB2]=useState([]);
  const ld=useCallback(()=>{if(tk){q("/rest/v1/deals?select=*&order=updated_at.desc",tk).then(d=>sD(d||[])).catch(console.error);q("/rest/v1/leads?select=*&order=created_at.desc",tk).then(d=>sLeads(d||[])).catch(()=>{});q("/rest/v1/content_assets?select=*&order=created_at.desc",tk).then(d=>sAssets(d||[])).catch(()=>{});q("/rest/v1/debriefs?select=*&order=created_at.desc&limit=20",tk).then(d=>sDeb(d||[])).catch(()=>{});q('/rest/v1/agent_queue?status=eq.pending&select=*&order=created_at.desc&limit=8',tk).then(d=>sSugg(d||[])).catch(()=>{});q('/rest/v1/briefs?select=id,client_name,sector&order=created_at.desc&limit=10',tk).then(d=>sSB2(d||[])).catch(()=>{});}},[tk]);
  useEffect(()=>{if(!tk)return;const uid=session.user?.id;q('/rest/v1/system_config?config_key=eq.elevenlabs_api_key&select=config_value',tk).then(d=>{if(d?.[0]?.config_value)sElKey(d[0].config_value.trim());}).catch(()=>{});q('/rest/v1/system_config?config_key=eq.claude_api_key&select=config_value',tk).then(d=>{if(d?.[0]?.config_value)sCK(d[0].config_value.replace(/\u2014/g,'--').replace(/[^\x20-\x7E]/g,'').trim());}).catch(()=>{});q(`/rest/v1/profiles?id=eq.${uid}&select=*`,tk).then(d=>{if(d?.[0])sP(d[0]);}).catch(console.error);ld();},[tk]);
  // Poll notifications
  useEffect(()=>{if(!tk||!isA)return;const poll=()=>q("/rest/v1/access_requests?status=eq.Pending&select=id",tk).then(d=>sN(d?.length||0)).catch(()=>{});poll();const iv=setInterval(poll,60000);return()=>clearInterval(iv);},[tk,isA]);
  
  // Session idle timeout
  const[idleWarn,sIdleWarn]=useState(false);
  // Toast notification system
  const[toast,sToast]=useState(null);
  const showToast=(msg,type)=>{sToast({msg,type});setTimeout(()=>sToast(null),5000);};const idleRef=useRef(null);const warnRef=useRef(null);
  useEffect(()=>{if(!tk)return;
    const reset=()=>{clearTimeout(idleRef.current);clearTimeout(warnRef.current);sIdleWarn(false);
      idleRef.current=setTimeout(()=>{sIdleWarn(true);warnRef.current=setTimeout(()=>{sS(null);sP(null);sD([]);},60000);},15*60*1000);};
    const events=["mousedown","keydown","scroll","touchstart"];events.forEach(e=>window.addEventListener(e,reset));reset();
    return()=>{events.forEach(e=>window.removeEventListener(e,reset));clearTimeout(idleRef.current);clearTimeout(warnRef.current);};
  },[tk]);
  // Agent auto-run timer — hourly agents every 60 min
  useEffect(()=>{if(!tk)return;
    const hourlyAgents=async()=>{if(!deals||deals.length===0){console.log("[COMPASS] Skipping agent run — no deals loaded yet");return;}console.log("[COMPASS] Running hourly agents...");
      try{await runPipelineGuardian(tk,deals);await runDealScorer(tk,deals);await runFollowThrough(tk,deals);await runLeadNurture(tk,leads||[]);await runContentGap(tk,deals,assets||[]);
      ld();console.log("[COMPASS] Hourly agents complete");}catch(e){console.warn("Agent run error:",e);}};
    const timer=setTimeout(()=>hourlyAgents(),5000);
    const iv=setInterval(hourlyAgents,60*60*1000);
    return()=>{clearTimeout(timer);clearInterval(iv);}
  },[tk,deals.length]);

  const th=dark?{"--bg":"#0D1B1E","--panel":"#111F22","--panel2":"#162629","--card-bg":"#162629","--text":"#E8F0F0","--sub":"#8AA0A6","--muted":"#5A7278","--dim":"#4A6268","--border":"rgba(255,255,255,0.08)"}:{"--bg":"#EEF3F0","--panel":"#FFFFFF","--panel2":"#F4F8F5","--card-bg":"#FFFFFF","--text":"#0a0a0a","--sub":"#555","--muted":"#8A9BAA","--dim":"#6B8088","--border":"rgba(0,0,0,0.08)"};
  if(!session)return<Auth onLogin={sS}/>;
  const nm=profile?.full_name||session.user?.email?.split("@")[0]||"User";const hr=new Date().getHours();const gr=hr<12?"Good Morning":hr<17?"Good Afternoon":"Good Evening";const ac=deals.filter(d=>d.status==="Active");const pv=ac.reduce((s,d)=>s+(d.expected_value||0),0);const wo=deals.filter(d=>d.status==="Won");const sr=search?(()=>{const s=search.toLowerCase();const r=[];
    deals.filter(d=>(d.client_name||"").toLowerCase().includes(s)).slice(0,4).forEach(d=>r.push({type:"Deal",name:d.client_name,sub:d.sector+" · "+d.stage,deal:d}));
    leads.filter(l=>(l.name||"").toLowerCase().includes(s)||(l.organization||"").toLowerCase().includes(s)).slice(0,3).forEach(l=>r.push({type:"Lead",name:l.name,sub:(l.organization||"")+" · "+l.status}));
    debriefs.filter(d=>(d.client_name||"").toLowerCase().includes(s)).slice(0,3).forEach(d=>r.push({type:"Debrief",name:d.client_name,sub:d.sector||""}));
    savedBriefs2.filter(b=>(b.client_name||"").toLowerCase().includes(s)).slice(0,2).forEach(b=>r.push({type:"Brief",name:b.client_name,sub:b.sector||""}));
    return r.slice(0,10);})():[];

  const renderTab=()=>{switch(tab){
    case"home":return(<div><div style={{marginBottom:28}}><div style={{...T,fontSize:26,fontWeight:800,letterSpacing:"-0.02em",marginBottom:4}}>{gr}, {nm.split(" ")[0]}</div><div style={{fontSize:14,color:"var(--muted)"}}>Your sovereign intelligence layer is ready.</div></div>{!chatActive&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}><KPI v={ac.length} l="ACTIVE DEALS" c="#00879F"/><KPI v={`SAR ${(pv/1e6).toFixed(1)}M`} l="PIPELINE VALUE" c="#00D49C"/><KPI v={wo.length} l="WON DEALS" c="#D0F94A"/><KPI v={SECTORS.filter(s=>ac.some(d=>d.sector===s)).length} l="SECTORS ACTIVE" c="#00879F"/></div>}{suggestions.length>0&&!chatActive&&<div style={{marginBottom:20}}>
          <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>AGENT SUGGESTIONS</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {suggestions.slice(0,4).map(s=>{const prioColor=s.priority==="critical"?"#FF4B4B":s.priority==="high"?"#FFB800":"#00879F";return(
              <div key={s.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:10,cursor:"pointer",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,135,159,0.2)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";}}>
                <div style={{width:6,height:6,borderRadius:3,background:prioColor,flexShrink:0,marginTop:6}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div>
                  <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{(s.suggested_action||s.description||"").slice(0,120)}</div>
                </div>
                <div style={{...M,fontSize:9,color:prioColor,flexShrink:0,padding:"2px 6px",borderRadius:3,background:prioColor+"10"}}>{s.agent_name?.split(" ")[0]}</div>
              </div>);})}
          </div>
        </div>}
        <Chat deals={deals} profile={profile} elKey={elKey} claudeKey={claudeKey} token={tk} onDealCreated={ld} onChatActive={sChatActive}/></div>);
    case"crm":return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div><div style={{...T,fontSize:22,fontWeight:800}}>Pipeline</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>{ac.length} active · SAR {pv.toLocaleString()}</div></div><button onClick={()=>sM({deal:null})} style={BP}><Plus size={14} style={{marginRight:6}}/>New Deal</button></div>
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}><select value={dealFilter} onChange={e=>sDealFilter(e.target.value)} style={{...IP,width:"auto",padding:"6px 10px",fontSize:11}}><option value="">All Sectors</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select><select value={stageFilter} onChange={e=>setStageFilter(e.target.value)} style={{...IP,width:"auto",padding:"6px 10px",fontSize:11}}><option value="">All Stages</option>{STAGES.map(s=><option key={s}>{s}</option>)}</select><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{...IP,width:"auto",padding:"6px 10px",fontSize:11}}><option value="">All Status</option><option>Active</option><option>Won</option><option>Lost</option><option>Stalled</option></select><select value={dealSort} onChange={e=>sDealSort(e.target.value)} style={{...IP,width:"auto",padding:"6px 10px",fontSize:11}}><option value="updated">Recently Updated</option><option value="value_desc">Value High-Low</option><option value="value_asc">Value Low-High</option><option value="name">Name A-Z</option><option value="score">Score High-Low</option></select></div><Kanban deals={deals} onOpen={d=>sM({deal:d})}/><div style={{...M,fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",marginBottom:10}}>ALL DEALS ({deals.length})</div><div style={CS}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Client","Sector","Stage","Value","Score"].map(h=><th key={h} style={{...M,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{(()=>{let fd=[...deals];if(dealFilter)fd=fd.filter(d=>d.sector===dealFilter);if(stageFilter)fd=fd.filter(d=>d.stage===stageFilter);if(statusFilter)fd=fd.filter(d=>d.status===statusFilter);if(dealSort==="value_desc")fd.sort((a,b)=>(b.expected_value||0)-(a.expected_value||0));else if(dealSort==="value_asc")fd.sort((a,b)=>(a.expected_value||0)-(b.expected_value||0));else if(dealSort==="name")fd.sort((a,b)=>(a.client_name||"").localeCompare(b.client_name||""));else if(dealSort==="score")fd.sort((a,b)=>(b.deal_score||0)-(a.deal_score||0));return fd;})().slice(0,60).map(d=><tr key={d.id} style={{borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>sM({deal:d})} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,135,159,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 14px",fontWeight:600}}>{d.client_name}</td><td style={{padding:"10px 14px",color:"var(--sub)"}}>{d.sector||"—"}</td><td style={{padding:"10px 14px"}}><span style={{...M,fontSize:10,padding:"3px 8px",borderRadius:4,background:`${SC[d.stage]||"#999"}12`,color:SC[d.stage]||"#999"}}>{d.stage}</span></td><td style={{padding:"10px 14px",...M,color:"var(--sub)"}}>{d.expected_value>0?`SAR ${Number(d.expected_value).toLocaleString()}`:"—"}</td><td style={{padding:"10px 14px",...M,color:d.deal_score>=70?"#00D49C":d.deal_score>=40?"#FFB800":"var(--muted)"}}>{d.deal_score||"—"}</td></tr>)}</tbody></table></div></div>);
    case"dashboard":return(<div><div style={{marginBottom:20}}><div style={{...T,fontSize:22,fontWeight:800}}>Dashboard</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}><KPI v={deals.length} l="TOTAL DEALS" s={`${ac.length} active`}/><KPI v={`SAR ${(pv/1e6).toFixed(1)}M`} l="PIPELINE" c="#00879F"/><KPI v={`${deals.length?Math.round(wo.length/deals.length*100):0}%`} l="WIN RATE" c="#00D49C"/><KPI v={ac.filter(d=>d.deal_score>=70).length} l="HIGH SCORE" c="#D0F94A"/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}><div style={{...CS,padding:20}}><div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:12}}>BY STAGE</div>{STAGES.map(s=>{const c=ac.filter(d=>d.stage===s).length;const p=ac.length?Math.round(c/ac.length*100):0;return(<div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{...M,fontSize:10,color:SC[s],width:80,flexShrink:0}}>{s}</span><div style={{flex:1,height:6,background:"var(--panel2)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${p}%`,height:"100%",background:SC[s],borderRadius:3}}/></div><span style={{...M,fontSize:10,color:"var(--muted)",width:24,textAlign:"right"}}>{c}</span></div>);})}</div><div style={{...CS,padding:20}}><div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:12}}>BY SECTOR</div>{SECTORS.map(s=>{const c=ac.filter(d=>d.sector===s).length;const v=ac.filter(d=>d.sector===s).reduce((x,d)=>x+(d.expected_value||0),0);return(<div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{...M,fontSize:10,color:XC[s],width:90,flexShrink:0}}>{s}</span><div style={{flex:1,fontSize:12,color:"var(--sub)"}}>{c}</div><span style={{...M,fontSize:10,color:"var(--muted)"}}>SAR {(v/1e6).toFixed(1)}M</span></div>);})}</div></div>
        {isA&&<div style={{...CS,padding:20,marginBottom:16,border:"1px solid rgba(208,249,74,0.15)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Shield size={14} color="#D0F94A"/><span style={{...M,fontSize:10,letterSpacing:"0.1em",color:"#D0F94A"}}>CEO EXECUTIVE SUMMARY</span></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            <div style={{padding:12,background:"var(--panel2)",borderRadius:8}}><div style={{...M,fontSize:9,color:"var(--muted)",marginBottom:4}}>PIPELINE COVERAGE</div><div style={{...T,fontSize:20,fontWeight:800,color:"#00879F"}}>{pv>0?((pv/(10000000))*100).toFixed(0)+"%":"—"}</div><div style={{...M,fontSize:9,color:"var(--muted)",marginTop:2}}>vs SAR 10M target</div></div>
            <div style={{padding:12,background:"var(--panel2)",borderRadius:8}}><div style={{...M,fontSize:9,color:"var(--muted)",marginBottom:4}}>WEIGHTED PIPELINE</div><div style={{...T,fontSize:20,fontWeight:800,color:"#00D49C"}}>SAR {(ac.reduce((s,d)=>s+((d.expected_value||0)*(d.probability||0)/100),0)/1e6).toFixed(1)}M</div><div style={{...M,fontSize:9,color:"var(--muted)",marginTop:2}}>probability-adjusted</div></div>
            <div style={{padding:12,background:"var(--panel2)",borderRadius:8}}><div style={{...M,fontSize:9,color:"var(--muted)",marginBottom:4}}>SECTOR COVERAGE</div><div style={{...T,fontSize:20,fontWeight:800}}>{SECTORS.filter(s=>ac.some(d=>d.sector===s)).length}/{SECTORS.length}</div><div style={{...M,fontSize:9,color:SECTORS.filter(s=>!ac.some(d=>d.sector===s)).length>0?"#FFB800":"#00D49C",marginTop:2}}>{SECTORS.filter(s=>!ac.some(d=>d.sector===s)).length>0?"Gap: "+SECTORS.filter(s=>!ac.some(d=>d.sector===s)).join(", "):"Full coverage"}</div></div>
          </div>
        </div>}
        <div style={{...CS,padding:20}}><div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:12}}>STALLED</div>{deals.filter(d=>d.status==="Active"&&d.updated_at&&(Date.now()-new Date(d.updated_at).getTime())>14*86400000).slice(0,5).map(d=><div key={d.id} onClick={()=>sM({deal:d})} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}}><span style={{fontWeight:600,fontSize:13}}>{d.client_name}</span><span style={{...M,fontSize:10,color:"#FF4B4B"}}>{Math.round((Date.now()-new Date(d.updated_at).getTime())/86400000)}d</span></div>)}{deals.filter(d=>d.status==="Active"&&d.updated_at&&(Date.now()-new Date(d.updated_at).getTime())>14*86400000).length===0&&<div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:16}}>All deals active</div>}</div></div>);
    case"agents":return<AgentsTab token={tk} deals={deals} leads={leads} assets={assets} debriefs={debriefs} onRefresh={ld} claudeKey={claudeKey} onOpenDeal={(did)=>{const d=deals.find(x=>x.id===did);if(d)sM({deal:d});}}/>;
    case"meetings":return<Meetings deals={deals} profile={profile} token={tk} elKey={elKey} claudeKey={claudeKey}/>;
    case"marketing":return<Marketing token={tk}/>;
    case"admin":return<Admin token={tk}/>;
    case"framework":return(<div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:24,height:2,background:"linear-gradient(90deg,#D0F94A,#00D49C,#00879F)",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.14em",color:"#00879F"}}>THE FRAMEWORK</span></div>
        <div style={{...T,fontSize:28,fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.15,marginBottom:6}}>We don't sell AI.<br/>We close the gap between<br/>ambition and <span style={{color:"#00D49C"}}>execution</span>.</div>
        <div style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,maxWidth:540,marginBottom:28}}>Every sector in Saudi Arabia shares the same structural problem. Leadership has announced a direction. The organisation has not caught up. Data does not move. Pilots do not become products.</div>
        <div style={{height:1,background:"linear-gradient(90deg,#D0F94A,#00D49C,#00879F)",marginBottom:32}}/>

        {/* Master Thread */}
        <div style={{borderLeft:"3px solid #00D49C",padding:"20px 28px",background:"rgba(0,212,156,0.012)",borderRadius:"0 12px 12px 0",marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.18em",color:"#00D49C",marginBottom:6}}>MASTER THREAD</div>
          <div style={{fontSize:14.5,color:"var(--sub)",lineHeight:1.75}}>Every sector has the same execution gap between sovereign ambition and operational reality. HUMAIN closes that gap. Not as a vendor. Not as a consultant. As the sovereign intelligence partner that stays, builds, and compounds.</div>
        </div>

        {/* Sector Beliefs */}
        <div style={{marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>SECTION 01</div>
          <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>Sector Belief Statements</div>
          <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>Five convictions built from real sector intelligence. These are not use cases. They are what HUMAIN holds as true going into every room.</div>
          {[{s:"Government",sub:"Cross-ministry orchestration",fear:"Losing the AI narrative while the execution machinery between 193 entities stays broken beneath world-class platform appearances.",belief:"The government proved it can transform at scale. Digital transformation is the reference. Now they need to repeat it with AI. The blockers are structural. HUMAIN's role is trusted connective tissue.",c:"#00879F"},
            {s:"Oil & Gas",sub:"OT/IT + domain expertise",fear:"Becoming strategically irrelevant before proving O&G companies are technology companies. Two clocks. One window.",belief:"Leadership manages two simultaneous clocks: proving relevance and extracting asset value. The blockers are human and cultural: OT/IT that won't integrate, AI teams that don't understand oilfields.",c:"#FFB800"},
            {s:"Healthcare",sub:"Arabic clinical AI",fear:"Deploying AI that causes clinical harm, or losing Vision 2030 momentum during the MOH-to-clusters structural shift.",belief:"Healthcare leadership navigates two fears simultaneously. Every dimension is underserved: broken EHR data, no Arabic clinical AI, clinicians who won't change, governance unwritten. HUMAIN builds the full stack.",c:"#00D49C"},
            {s:"Private Sector",sub:"Data foundation first",fear:"PIF competitors, Saudization mandates, CEO promises the org cannot execute, and talent drain to giga-projects.",belief:"The most exposed sector, least equipped to absorb pressure. Blockers run deep: legacy infrastructure, no AI talent pipeline, decision structures too centralized for AI speed. HUMAIN is the honest diagnostic.",c:"#D0F94A"},
            {s:"Sport",sub:"Ecosystem data fabric",fear:"Spending billions and producing nothing sustainable. Spectacle narrative cementing before substance has time to develop.",belief:"Saudi sport operates under the most visible accountability. The answer is not more investment. It is intelligence. The connective tissue that has never existed between clubs, federations, venues, academies.",c:"#FF6B6B"}
          ].map(b=><FwAcc key={b.s} b={b}/>)}
        </div>

        {/* 5 Stages */}
        <div style={{marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>SECTION 02</div>
          <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>The Five-Stage Client Progression</div>
          <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>The stages are not milestones to be declared. They are observed states. A client cannot be pushed to the next stage.</div>
          {[{n:"Recognition",d:"Client feels understood. Our belief matched their reality. They want to continue the conversation.",c:"#8A9BAA"},
            {n:"Proof",d:"First visible, attributable result delivered. Client has something to show internally. Trust is earned.",c:"#FFB800"},
            {n:"Integration",d:"HUMAIN is embedded in a workflow. Removing us now costs real effort. Dependency is forming.",c:"#00879F"},
            {n:"Dependency",d:"Client cannot operate the relevant function without HUMAIN. Saudi talent is built on our systems.",c:"#00D49C"},
            {n:"Expansion",d:"Client pulls HUMAIN into adjacent problems. We are invited into rooms never originally scoped.",c:"#6B8C00"}
          ].map((s,i)=><div key={s.n} style={{display:"flex",gap:16,padding:"16px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{width:36,height:36,borderRadius:10,background:s.c+"15",display:"flex",alignItems:"center",justifyContent:"center",...T,fontSize:16,fontWeight:800,color:s.c,flexShrink:0}}>{i+1}</div>
            <div><div style={{fontSize:15,fontWeight:700,marginBottom:3}}>{s.n}</div><div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6}}>{s.d}</div></div>
          </div>)}
        </div>

        {/* 8 Principles */}
        <div style={{marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>SECTION 03</div>
          <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>The Eight Engagement Principles</div>
          <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>The operating system of HUMAIN's client relationships. Violating any one collapses trust that takes months to rebuild.</div>
          {["Lead with the execution gap, never the product","The belief statement is the key, not the demo","Every meeting ends with an advance, not a continuation","Observable signals only. No assumptions.","The debrief is mandatory, not optional","Never create urgency that does not exist","The WhatsApp message from the CEO is the highest buying signal","Sovereignty is not a feature. It is the foundation."
          ].map((p,i)=><div key={i} style={{padding:"14px 18px",background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:10,marginBottom:6,display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{...M,fontSize:10,color:"#00879F",flexShrink:0,marginTop:2}}>0{i+1}</span>
            <span style={{fontSize:14,fontWeight:600,lineHeight:1.5}}>{p}</span>
          </div>)}
        </div>

        {/* Irreversibility */}
        <div style={{marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>SECTION 04</div>
          <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>The Four Conditions of Irreversibility</div>
          <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>The goal is not a signed contract. The goal is a client who cannot imagine operating without HUMAIN.</div>
          {[{t:"Workflow Dependency",d:"HUMAIN is embedded in a production workflow that runs daily. Removing it would require rebuilding from scratch."},
            {t:"Capability Dependency",d:"The client's team has built skills on HUMAIN's platform. Leaving would mean losing capabilities they have already internalised."},
            {t:"Sovereign Trust",d:"HUMAIN has been granted access to data or decisions that no foreign competitor could be given."},
            {t:"Expanding Invitation",d:"Other departments or entities are asking for access because of what the first department achieved."}
          ].map((c2,i)=><div key={i} style={{...CS,padding:"18px 22px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><div style={{width:24,height:24,borderRadius:6,background:"rgba(0,135,159,0.06)",display:"flex",alignItems:"center",justifyContent:"center",...M,fontSize:10,color:"#00879F"}}>{i+1}</div><span style={{fontSize:14,fontWeight:700}}>{c2.t}</span></div>
            <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,paddingLeft:34}}>{c2.d}</div>
          </div>)}
          <div style={{...M,fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:12}}>All four must be true simultaneously. Three out of four is a strong relationship. Four out of four is irreversible attachment.</div>
        </div>
      </div>);
    case"engage":return(<div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:24,height:2,background:"linear-gradient(90deg,#D0F94A,#00D49C,#00879F)",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.14em",color:"#00879F"}}>ENGAGEMENT OS</span></div>
        <div style={{...T,fontSize:28,fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.15,marginBottom:6}}>Win every meeting.<br/>Not with products.<br/>With <span style={{color:"#00D49C"}}>intelligence</span>.</div>
        <div style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,maxWidth:540,marginBottom:28}}>Sector-specific entry scripts, conversation flows, objection handling, follow-up architecture, and the complete tactical toolkit for closing the execution gap.</div>
        <div style={{height:1,background:"linear-gradient(90deg,#D0F94A,#00D49C,#00879F)",marginBottom:32}}/>

        {/* Sector Entry */}
        <div style={{marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>01 — SECTOR ENTRY GUIDES</div>
          <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>What to say when you walk in the door</div>
          <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>Sector-specific entry scripts, conversation flows, and proof frameworks.</div>
          {[{s:"Government",fear:"Losing the AI narrative to foreign vendors while 193 entities still don't share data.",want:"Replicate digital transformation success with AI at national scale.",entry:"Trusted connective tissue. Name the execution gap: data that doesn't move, pilots that don't scale.",c:"#00879F"},
            {s:"Oil & Gas",fear:"Two clocks running: proving strategic relevance while extracting asset value before the window narrows.",want:"AI teams that understand oilfields, not just models. OT/IT integration that works.",entry:"Speak oilfield, not algorithm. Lead with operational understanding. Proof in oilfield language.",c:"#FFB800"},
            {s:"Healthcare",fear:"Too fast causes clinical harm. Too slow misses Vision 2030. Both fears rational, both active simultaneously.",want:"Arabic clinical AI, trustworthy EHR data, governance frameworks.",entry:"Start with data quality truth. Don't arrive with AI demos. Arrive with a data readiness framework.",c:"#00D49C"},
            {s:"Private Sector",fear:"CEO announced AI-first. Organization can't execute. 81% claim AI-first, only 27.6% show actual adoption.",want:"Close the gap between boardroom ambition and operational readiness.",entry:"An honest diagnostic question, not a pitch. Fix data first, sell AI second.",c:"#D0F94A"},
            {s:"Sport",fear:"Historic investment, world watching if it lasts beyond star signings. No data connective tissue anywhere.",want:"Ecosystem data fabric and fan intelligence. 2034 World Cup is a hard deadline.",entry:"Name the legitimacy tension directly. Sovereign intelligence that connects the ecosystem.",c:"#FF6B6B"}
          ].map(s=><div key={s.s} style={{...CS,padding:"18px 22px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:8,height:8,borderRadius:4,background:s.c}}/><span style={{fontSize:15,fontWeight:700}}>{s.s}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <div><div style={{...M,fontSize:9,color:"#FF4B4B",marginBottom:4}}>WHAT THEY FEAR</div><div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{s.fear}</div></div>
              <div><div style={{...M,fontSize:9,color:"#FFB800",marginBottom:4}}>WHAT THEY WANT</div><div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{s.want}</div></div>
              <div><div style={{...M,fontSize:9,color:"#00D49C",marginBottom:4}}>HUMAIN'S ENTRY</div><div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{s.entry}</div></div>
            </div>
          </div>)}
        </div>

        {/* Meeting Toolkit */}
        <div style={{marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>02 — MEETING TOOLKIT</div>
          <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>48-Hour Meeting Architecture</div>
          <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>The door opens easily. What keeps it open is disciplined architecture applied before, during, and after every meeting.</div>
          {[{t:"48 HOURS BEFORE",items:["Research client's latest announcements using AI brief tool","Map all attendees on LinkedIn: seniority, background, decision role","Prepare one Challenger-style sector insight that reframes their thinking","Load sector belief statement: know the fear, the ambition, the gap by memory"],c:"#00879F"},
            {t:"2 HOURS BEFORE",items:["Check overnight news about client organization or sector","Decide primary next-step ask AND fallback if refused","Know which HUMAIN stack layer is the lowest-friction entry"],c:"#FFB800"},
            {t:"IN THE MEETING",items:["Lead with sector insight, not product pitch","43:57 talk-to-listen ratio","FINAL 5 MIN: Book calendar invite before leaving the room"],c:"#00D49C"},
            {t:"WITHIN 2 HOURS AFTER",items:["Follow-up email under 200 words with one specific insight","WhatsApp referencing the email and a specific topic discussed","Log meeting signals in CRM based on observables only"],c:"#D0F94A"}
          ].map(phase=><div key={phase.t} style={{borderLeft:"3px solid "+phase.c,padding:"14px 20px",background:phase.c+"06",borderRadius:"0 10px 10px 0",marginBottom:10}}>
            <div style={{...M,fontSize:9,letterSpacing:"0.12em",color:phase.c,marginBottom:8}}>{phase.t}</div>
            {phase.items.map((item,j)=><div key={j} style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,padding:"3px 0",display:"flex",gap:8}}><span style={{color:phase.c,flexShrink:0}}>—</span>{item}</div>)}
          </div>)}
        </div>

        {/* Signal Decoder */}
        <div style={{marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>03 — SAUDI SIGNAL DECODER</div>
          <div style={{...T,fontSize:22,fontWeight:800,marginBottom:20}}>Reading the room</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <div style={{...CS,padding:"16px 18px"}}><div style={{...M,fontSize:9,color:"#00D49C",marginBottom:8}}>GENUINE BUYING INTENT</div>
              {["WhatsApp connection + active follow-up by client","Introduction to additional senior stakeholders","Specific questions about PDPL, data localization","Social invite (dinner, istiraha) = major trust"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>{s}</div>)}</div>
            <div style={{...CS,padding:"16px 18px"}}><div style={{...M,fontSize:9,color:"#FFB800",marginBottom:8}}>WATCH CAREFULLY</div>
              {["'We will study this' without who, when, or what","Meeting stayed entirely social after 60+ minutes","Only junior staff, no path to senior decision-makers","Enthusiastic agreement with everything, no hard questions"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>{s}</div>)}</div>
            <div style={{...CS,padding:"16px 18px"}}><div style={{...M,fontSize:9,color:"#FF4B4B",marginBottom:8}}>LIKELY NO DECISION</div>
              {["No follow-up after 10+ days despite agreed next step","Senior attendee distracted, left early, never engaged","Three+ touchpoints with no progression signal"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>{s}</div>)}</div>
          </div>
        </div>

        {/* Cross-Sell */}
        <div style={{marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>04 — CROSS-SELL LOGIC</div>
          <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>Clients pull HUMAIN forward</div>
          <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>The cross-sell motion is not a sales process. It is a consequence of being embedded at the right depth. Clients pull HUMAIN forward. We never push.</div>
          {[{t:"Visible Result Trigger",d:"Client achieves a measurable outcome. Leadership asks what else is possible.",arrow:"Core → Compute"},{t:"Trust Threshold Trigger",d:"Relationship deep enough for honest conversation about a new problem.",arrow:"Compute → Intelligence"},{t:"Client Pull Trigger",d:"Client identifies a new problem and calls HUMAIN first.",arrow:"Intelligence → Shift"},{t:"HUMAIN Sees First Trigger",d:"HUMAIN identifies a gap before the client names it. Presenting this insight first builds deepest trust.",arrow:"Shift → Expansion"}
          ].map((t,i)=><div key={i} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{width:32,height:32,borderRadius:8,background:"rgba(0,135,159,0.06)",display:"flex",alignItems:"center",justifyContent:"center",...M,fontSize:10,color:"#00879F",flexShrink:0}}>{i+1}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{t.t}</div><div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{t.d}</div></div>
            <span style={{...M,fontSize:9,color:"#00D49C",flexShrink:0,marginTop:4}}>{t.arrow}</span>
          </div>)}
        </div>

        {/* Advisory vs Vendor */}
        <div style={{marginBottom:40}}>
          <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>05 — ADVISORY POSITIONING</div>
          <div style={{...T,fontSize:22,fontWeight:800,marginBottom:20}}>Not a vendor. A sovereign partner.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{...CS,padding:"18px 22px",opacity:0.5}}><div style={{...M,fontSize:9,color:"#FF4B4B",marginBottom:10}}>TECHNOLOGY VENDOR</div>
              {["Sells what it has already built","Measures success in licenses and deployments","Leaves after implementation is complete","Knows the technology, not the business","Replicable by any better-funded competitor"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0"}}>— {s}</div>)}</div>
            <div style={{...CS,padding:"18px 22px",border:"1px solid rgba(0,135,159,0.2)"}}><div style={{...M,fontSize:9,color:"#00D49C",marginBottom:10}}>HUMAIN AS SOVEREIGN ADVISER</div>
              {["Enters through the client's deepest sector fear","Measures success in the client's own P&L language","Stays embedded and builds Saudi capability inside the client","Knows the sector, the operation, and the Arabic context","Irreplaceable because intelligence compounds with every engagement"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0"}}>— {s}</div>)}</div>
          </div>
        </div>
      </div>);
    default:return<PH label={TABS.find(t=>t.id===tab)?.label||tab} icon={TABS.find(t=>t.id===tab)?.icon||Home}/>;
  }};

  return(<div style={{...th,fontFamily:"'DM Sans',sans-serif",background:"var(--bg)",color:"var(--text)",minHeight:"100vh",display:"flex"}}>
    <nav style={{width:sb?230:56,background:"var(--panel)",borderRight:"1px solid rgba(0,135,159,0.06)",display:"flex",flexDirection:"column",transition:"width .28s cubic-bezier(.4,0,.2,1)",position:"fixed",top:0,left:0,bottom:0,zIndex:100,overflow:"hidden",flexShrink:0}}>
        {/* ── H Logo ── */}
        <div onClick={()=>sSb(!sb)} style={{display:"flex",alignItems:"center",justifyContent:sb?"flex-start":"center",gap:8,padding:sb?"12px 16px":"12px 0",height:52,cursor:"pointer",borderBottom:"1px solid rgba(0,135,159,0.06)",flexShrink:0}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="4" x2="4" y2="20"/><line x1="20" y1="4" x2="20" y2="20"/><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/></svg>
          {sb&&<span style={{...T,fontSize:12,letterSpacing:"0.08em",fontWeight:800}}>HUMAIN</span>}
        </div>

        {/* ── Home ── */}
        <div style={{padding:"6px 8px",flexShrink:0}}>
          <button onClick={()=>{sT("home");sChatActive(false);}} style={{width:sb?"100%":40,height:36,borderRadius:6,display:"flex",alignItems:"center",justifyContent:sb?"flex-start":"center",gap:8,color:tab==="home"?"#00879F":"var(--dim)",background:tab==="home"?"rgba(0,135,159,0.06)":"rgba(0,135,159,0.03)",border:"1px solid rgba(0,135,159,0.06)",cursor:"pointer",overflow:"hidden",padding:sb?"0 10px":0,transition:"all .18s"}}
            onMouseEnter={e=>{if(tab!=="home"){e.currentTarget.style.background="rgba(0,135,159,0.08)";e.currentTarget.style.color="#00879F";}}}
            onMouseLeave={e=>{if(tab!=="home"){e.currentTarget.style.background="rgba(0,135,159,0.03)";e.currentTarget.style.color="var(--dim)";}}}>
            <Home size={18} strokeWidth={1.8}/>{sb&&<span style={{fontSize:12,fontWeight:500}}>Home</span>}
          </button>
        </div>

        {sb&&<div style={{...T,fontSize:8,letterSpacing:"0.14em",color:"var(--muted)",opacity:0.6,padding:"10px 16px 4px"}}>WORKSPACE</div>}

        {/* ── Nav Items ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:2,overflowY:"auto",overflowX:"hidden",padding:sb?"4px 8px":"6px 8px",alignItems:sb?"stretch":"center",scrollbarWidth:"none"}}>
          {TABS.filter(t=>t.id!=="home"&&(!t.ao||isA)).map(t=>{const I=t.icon;const on=tab===t.id;const isAd=t.id==="admin";
          return(<div key={t.id}>
            {isAd&&sb&&<div style={{...T,fontSize:8,letterSpacing:"0.14em",color:"var(--muted)",opacity:0.6,padding:"8px 8px 2px",marginTop:4}}>ADMIN</div>}
            {isAd&&!sb&&<div style={{width:32,margin:"4px auto",height:1,background:"rgba(0,135,159,0.06)"}}/>}
            <button onClick={()=>{sT(t.id);sChatActive(false);}} style={{background:on?"#023c47":"none",width:sb?"100%":40,height:40,borderRadius:6,display:"flex",alignItems:"center",justifyContent:sb?"flex-start":"center",gap:sb?10:0,cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",flexShrink:0,border:"none",position:"relative",transition:"all .18s",padding:sb?"0 10px":0,color:on?"#D0F94A":"var(--muted)"}}
              onMouseEnter={e=>{if(!on){e.currentTarget.style.color="var(--text)";e.currentTarget.style.background="rgba(0,135,159,0.04)";}}}
              onMouseLeave={e=>{if(!on){e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="none";}}}>
              <I size={18} strokeWidth={on?2:1.5}/>
              {sb&&<span style={{fontSize:12,fontWeight:on?600:500,color:on?"#fff":"#4A5E6E"}}>{t.label}</span>}
              {t.id==="admin"&&notif>0&&<span style={{position:"absolute",right:sb?10:2,top:2,minWidth:15,height:15,borderRadius:8,background:"#FF4B4B",color:"#fff",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{notif}</span>}
            </button>
          </div>);})}
        </div>

        {/* ── Bottom Controls ── */}
        <div style={{borderTop:"1px solid rgba(0,135,159,0.06)",padding:sb?"8px 12px":"8px",display:"flex",flexDirection:"column",gap:3,flexShrink:0,alignItems:sb?"stretch":"center"}}>
          {/* Framework + Engage OS */}
          {[{id:"framework",label:"Framework",icon:Layers},{id:"engage",label:"Engage OS",icon:Network}].map(t=>{const I=t.icon;const on=tab===t.id;return(
            <button key={t.id} onClick={()=>{sT(t.id);sChatActive(false);}} style={{width:sb?"100%":40,height:36,borderRadius:6,display:"flex",alignItems:"center",justifyContent:sb?"flex-start":"center",gap:8,background:on?"#023c47":"transparent",border:"none",cursor:"pointer",color:on?"#D0F94A":"var(--muted)",padding:sb?"0 10px":0,transition:"all .18s"}}
              onMouseEnter={e=>{if(!on){e.currentTarget.style.color="var(--text)";e.currentTarget.style.background="rgba(0,135,159,0.04)";}}}
              onMouseLeave={e=>{if(!on){e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="transparent";}}}>
              <I size={16} strokeWidth={on?2:1.5}/>{sb&&<span style={{fontSize:12,fontWeight:on?600:500,color:on?"#fff":"#4A5E6E"}}>{t.label}</span>}
            </button>);})}
          {/* Daily Intel */}
          <button onClick={()=>sIntel(!intel)} style={{width:sb?"100%":40,height:36,borderRadius:6,display:"flex",alignItems:"center",justifyContent:sb?"flex-start":"center",gap:8,background:intel?"rgba(0,212,156,0.08)":"transparent",border:"none",cursor:"pointer",color:intel?"#00D49C":"var(--muted)",padding:sb?"0 10px":0,transition:"all .18s"}}
            onMouseEnter={e=>{if(!intel)e.currentTarget.style.color="#00D49C";}}
            onMouseLeave={e=>{if(!intel)e.currentTarget.style.color="var(--muted)";}}>
            <Activity size={16} strokeWidth={1.5}/>{sb&&<span style={{fontSize:12,fontWeight:500,color:intel?"#00D49C":"#4A5E6E"}}>Daily Intel</span>}
          </button>
          {/* Theme */}
          <div style={{display:"flex",justifyContent:"center",gap:2}}>
            <button onClick={()=>sDk(false)} style={{padding:"4px 7px",borderRadius:5,border:"none",cursor:"pointer",background:!dark?"rgba(0,135,159,0.1)":"transparent",color:!dark?"#00879F":"#a9a29d"}}><Sun size={12}/></button>
            <button onClick={()=>sDk(true)} style={{padding:"4px 7px",borderRadius:5,border:"none",cursor:"pointer",background:dark?"rgba(0,135,159,0.1)":"transparent",color:dark?"#00879F":"#a9a29d"}}><Moon size={12}/></button>
          </div>
          {/* Avatar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"2px 0"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#00879F,#00D49C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",border:"2px solid var(--panel)",boxShadow:"0 0 0 1px rgba(0,135,159,0.12)"}}>{nm[0]?.toUpperCase()}</div>
            {sb&&<div style={{marginLeft:8,overflow:"hidden",flex:1}}><div style={{fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{nm}</div>{isA&&<div style={{...M,fontSize:7,color:"#D0F94A",letterSpacing:"0.08em"}}>ADMIN</div>}</div>}
          </div>
          {/* Sign out */}
          <button onClick={()=>{sS(null);sP(null);sD([]);}} style={{width:sb?"100%":40,height:28,display:"flex",alignItems:"center",justifyContent:sb?"flex-start":"center",gap:8,padding:sb?"0 10px":0,background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:11,borderRadius:6}}
            onMouseEnter={e=>{e.currentTarget.style.color="#44403c";}} onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";}}>
            <LogOut size={13}/>{sb&&<span>Sign out</span>}
          </button>
          {/* Toggle */}
          <button onClick={()=>sSb(!sb)} style={{width:sb?"100%":40,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:sb?"flex-end":"center",color:"var(--muted)",cursor:"pointer",background:"transparent",border:"none",paddingRight:sb?8:0,transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,135,159,0.06)";e.currentTarget.style.color="#00879F";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--muted)";}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">{sb?<><path d="M6 3L2 8L6 13"/><line x1="14" y1="8" x2="2" y2="8"/></>:<><path d="M10 3L14 8L10 13"/><line x1="2" y1="8" x2="14" y2="8"/></>}</svg>
          </button>
        </div>
      </nav>
    <main style={{flex:1,marginLeft:sb?230:56,transition:"margin-left .3s cubic-bezier(0.16,1,0.3,1)"}}>
      <div style={{position:"sticky",top:0,zIndex:50,background:"var(--panel)",borderBottom:"1px solid var(--border)",padding:"10px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(20px)"}}>
        <div style={{position:"relative",flex:1,maxWidth:360}}><Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--muted)"}}/><input value={search} onChange={e=>{sSr(e.target.value);sSrO(true);}} onFocus={()=>sSrO(true)} onBlur={()=>setTimeout(()=>sSrO(false),200)} placeholder="Search deals..." style={{...IP,paddingLeft:32,fontSize:12}}/>{srO&&search&&sr.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--panel)",border:"1px solid var(--border)",borderRadius:10,marginTop:4,boxShadow:"0 8px 24px rgba(0,0,0,0.1)",zIndex:60,overflow:"hidden",maxHeight:400,overflowY:"auto"}}>{sr.map((r,i)=><div key={i} onMouseDown={()=>{if(r.deal)sM({deal:r.deal});sSr("");}} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)",fontSize:13,display:"flex",alignItems:"center",gap:10}}><span style={{...M,fontSize:9,padding:"2px 6px",borderRadius:3,background:r.type==="Deal"?"rgba(0,135,159,0.06)":r.type==="Lead"?"rgba(0,212,156,0.06)":"rgba(255,184,0,0.06)",color:r.type==="Deal"?"#00879F":r.type==="Lead"?"#00D49C":"#FFB800",flexShrink:0}}>{r.type}</span><span style={{fontWeight:600,flex:1}}>{r.name}</span><span style={{...M,fontSize:10,color:"var(--muted)"}}>{r.sub}</span></div>)}</div>}</div>
        <div style={{...M,fontSize:9,color:"#FFB800",letterSpacing:"0.1em",padding:"3px 8px",background:"rgba(255,184,0,0.05)",border:"1px solid rgba(255,184,0,0.08)",borderRadius:4}}>STAGING</div>
      </div>
      <div style={{padding:"24px 28px 80px",maxWidth:1100}}>{renderTab()}</div>
    </main>
    <DailyIntel deals={deals} profile={profile} open={intel} onClose={()=>sIntel(false)}/>
    
    
    {toast&&<div style={{position:"fixed",top:20,right:20,background:toast.type==="error"?"#FF4B4B":"#00879F",color:"#fff",padding:"12px 20px",borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",zIndex:3000,fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:8,animation:"fadeIn .2s"}}>{toast.msg}<button onClick={()=>sToast(null)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",marginLeft:8}}><X size={14}/></button></div>}
    {idleWarn&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
      <div style={{background:"var(--panel)",borderRadius:16,padding:"32px 36px",textAlign:"center",maxWidth:380}}>
        <div style={{...T,fontSize:18,fontWeight:800,marginBottom:8}}>Session Timeout</div>
        <div style={{fontSize:13,color:"var(--sub)",marginBottom:20}}>You've been inactive for 15 minutes. Click below to stay signed in, or you'll be signed out in 60 seconds.</div>
        <button onClick={()=>{sIdleWarn(false);clearTimeout(warnRef.current);}} style={{...BP,padding:"10px 28px"}}>I'm Still Here</button>
      </div>
    </div>}
    
    {typeof navigator!=="undefined"&&/Mobi|Android/i.test(navigator.userAgent)&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:"var(--panel)",borderTop:"1px solid var(--border)",padding:"14px 20px",zIndex:1500,display:"flex",alignItems:"center",gap:12,boxShadow:"0 -4px 16px rgba(0,0,0,0.1)"}}>
      <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#00879F,#00D49C,#D0F94A)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12,flexShrink:0}}>C</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>COMPASS Mobile</div><div style={{fontSize:11,color:"var(--muted)"}}>For the best experience, use the mobile app</div></div>
      <button onClick={e=>e.currentTarget.parentElement.style.display="none"} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><X size={16}/></button>
    </div>}
    {modal&&<DealModal deal={modal.deal} onClose={()=>sM(null)} onSave={()=>{sM(null);ld();}} onDel={async(id)=>{try{await q(`/rest/v1/deals?id=eq.${id}`,tk,{method:"DELETE"});sM(null);ld();}catch(x){alert(x.message);}}} token={tk}/>}
  </div>);
}
