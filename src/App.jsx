import { useState, useEffect, useRef, useCallback } from "react";
import { Home, Target, LayoutDashboard, Sparkles, Calendar, TrendingUp, Layers, Network, Settings, Database, LogOut, Sun, Moon, Search, Send, Plus, Eye, EyeOff, MessageSquare, X, FileText, Trash2, Save, Bell, Shield, Users, BarChart3, Megaphone, UserPlus, Globe, Zap, RefreshCw, Clock, Mic, MicOff, Volume2, PanelRightOpen, PanelRightClose, BookOpen, Activity } from "lucide-react";

const SU = "https://nujczhqxcxuppatnjbon.supabase.co";
const SK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51amN6aHF4Y3h1cHBhdG5qYm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjIyMjAsImV4cCI6MjA4OTE5ODIyMH0.WDy1yI89XDk7g-jnPfrEmewvtayHi87lROeZlAZpZ8U";
const STAGES=["Recognition","Proof","Integration","Dependency","Expansion"];
const SECTORS=["Government","Oil & Gas","Healthcare","Private Sector","Sport"];
const SC={Recognition:"#8A9BAA",Proof:"#FFB800",Integration:"#009688",Dependency:"#00B89C",Expansion:"#5B7A0F"};
const XC={Government:"#009688","Oil & Gas":"#FFB800",Healthcare:"#00B89C","Private Sector":"#B8E636",Sport:"#FF6B6B"};
const AGENTS=[
  {key:"pipeline_guardian",name:"Pipeline Guardian",desc:"Monitors deal health, flags stalled opportunities",color:"#FF4B4B",type:"hourly",icon:Shield},
  {key:"brief_architect",name:"Brief Architect",desc:"Auto-generates meeting briefs from deal context",color:"#009688",type:"hourly",icon:FileText},
  {key:"followthrough",name:"Follow-through",desc:"Tracks committed next steps, alerts on overdue",color:"#FFB800",type:"hourly",icon:Clock},
  {key:"deal_scorer",name:"Deal Scorer",desc:"Scores deals based on observable signals",color:"#00B89C",type:"hourly",icon:Target},
  {key:"team_coach",name:"Team Coach",desc:"Analyzes team performance patterns",color:"#A0C020",type:"hourly",icon:Users},
  {key:"debrief_analyst",name:"Debrief Analyst",desc:"Extracts insights from post-meeting debriefs",color:"#009688",type:"event",icon:RefreshCw},
  {key:"sector_radar",name:"Sector Radar",desc:"Tracks sector news and competitive movements",color:"#B8E636",type:"event",icon:Globe},
  {key:"lead_nurture",name:"Lead Nurture",desc:"Monitors lead engagement, suggests actions",color:"#00B89C",type:"hourly",icon:UserPlus},
  {key:"content_gap",name:"Content Gap",desc:"Identifies missing content for pipeline stages",color:"#B8E636",type:"hourly",icon:BarChart3},
  {key:"campaign_roi",name:"Campaign ROI",desc:"Calculates campaign effectiveness and ROI",color:"#FFB800",type:"event",icon:TrendingUp},
  {key:"winloss_intel",name:"Win/Loss Intel",desc:"Analyzes patterns in won and lost deals",color:"#B8E636",type:"event",icon:Zap},
  {key:"belief_evolution",name:"Belief Evolution",desc:"Tracks how sector beliefs change over time",color:"#009688",type:"event",icon:RefreshCw},
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
const BP={padding:"8px 18px",background:"#009688",color:"#fff",border:"none",borderRadius:999,fontSize:13,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center"};
const BG={padding:"8px 16px",background:"transparent",color:"var(--sub)",border:"1px solid var(--border)",borderRadius:999,fontSize:13,cursor:"pointer"};
const IP={width:"100%",padding:"10px 14px",border:"1px solid var(--border)",borderRadius:8,fontSize:13,outline:"none",background:"var(--panel2)",color:"var(--text)",boxSizing:"border-box"};
const LB={...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",display:"block",marginBottom:5};

function Auth({onLogin}){const[e,sE]=useState("");const[p,sP]=useState("");const[sh,sSh]=useState(false);const[er,sEr]=useState("");const[b,sB]=useState(false);
const go=async()=>{if(!e||!p){sEr("Enter email and password.");return;}sB(true);sEr("");try{onLogin(await auth(e,p));}catch(x){sEr(x.message);}finally{sB(false);}};
return(<div style={{position:"fixed",inset:0,background:"linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'ABC Repro','Inter','DM Sans',sans-serif"}}><div style={{width:380,background:"#fff",borderRadius:20,overflow:"hidden"}}><div style={{height:3,background:"linear-gradient(90deg,#009688,#00B89C,#B8E636)"}}/><div style={{padding:"40px 36px 36px"}}><div style={{...T,fontSize:22,fontWeight:800,marginBottom:4}}>COMPASS</div><div style={{...M,fontSize:10,color:"#999",letterSpacing:"0.15em",marginBottom:28}}>STAGING ENVIRONMENT</div><div style={{marginBottom:14}}><label style={{...LB,color:"#999"}}>EMAIL</label><input value={e} onChange={x=>sE(x.target.value)} onKeyDown={x=>x.key==="Enter"&&go()} placeholder="you@humain.com" style={{...IP,background:"rgba(0,0,0,0.03)",border:"1px solid rgba(0,0,0,0.08)"}}/></div><div style={{marginBottom:20}}><label style={{...LB,color:"#999"}}>PASSWORD</label><div style={{position:"relative"}}><input type={sh?"text":"password"} value={p} onChange={x=>sP(x.target.value)} onKeyDown={x=>x.key==="Enter"&&go()} style={{...IP,background:"rgba(0,0,0,0.03)",border:"1px solid rgba(0,0,0,0.08)",paddingRight:40}}/><button onClick={()=>sSh(!sh)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#999"}}>{sh?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></div>{er&&<div style={{color:"#FF4B4B",fontSize:13,marginBottom:12,padding:"8px 12px",background:"rgba(255,75,75,0.06)",borderRadius:8}}>{er}</div>}<button onClick={go} disabled={b} style={{width:"100%",padding:"12px",background:"#009688",color:"#fff",border:"none",borderRadius:999,fontSize:14,fontWeight:600,cursor:b?"wait":"pointer",opacity:b?0.7:1}}>{b?"Signing in...":"Sign In"}</button></div></div></div>);}

function DealModal({deal,onClose,onSave,onDel,token}){const nw=!deal?.id;const[f,sF]=useState({client_name:deal?.client_name||"",sector:deal?.sector||"",stage:deal?.stage||"Recognition",status:deal?.status||"Active",expected_value:deal?.expected_value||0,contact_name:deal?.contact_name||"",next_step:deal?.next_step||"",notes:deal?.notes||"",probability:deal?.probability||0,tags:deal?.tags||""});const[sv,sSv]=useState(false);const[ev,sEv]=useState([]);const s=(k,v)=>sF(p=>({...p,[k]:v}));
useEffect(()=>{if(deal?.id&&token)q(`/rest/v1/deal_events?deal_id=eq.${deal.id}&select=*&order=created_at.desc&limit=15`,token).then(sEv).catch(()=>{});},[deal?.id,token]);
const sv2=async()=>{if(!f.client_name.trim())return;sSv(true);try{const pl={...f,expected_value:parseFloat(f.expected_value)||0,probability:parseInt(f.probability)||0,weighted_value:(parseFloat(f.expected_value)||0)*((parseInt(f.probability)||0)/100),updated_at:new Date().toISOString()};if(nw){const res=await q("/rest/v1/deals",token,{method:"POST",body:JSON.stringify(pl)});const newId=res?.[0]?.id;if(newId)await q("/rest/v1/deal_events",token,{method:"POST",body:JSON.stringify({deal_id:newId,event_type:"created",description:"Deal created: "+pl.client_name+" ("+pl.stage+")",created_at:new Date().toISOString()})}).catch(()=>{});}else{await q(`/rest/v1/deals?id=eq.${deal.id}`,token,{method:"PATCH",body:JSON.stringify(pl)});await q("/rest/v1/deal_events",token,{method:"POST",body:JSON.stringify({deal_id:deal.id,event_type:"updated",description:"Deal updated: "+Object.keys(pl).filter(k=>pl[k]!==deal[k]&&k!=="updated_at"&&k!=="weighted_value").join(", "),created_at:new Date().toISOString()})}).catch(()=>{});}onSave();}catch(x){alert(x.message);}finally{sSv(false);}};
return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}><div style={{width:560,maxHeight:"85vh",background:"var(--panel)",borderRadius:20,overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}><div style={{padding:"18px 24px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{...T,fontSize:18,fontWeight:700}}>{nw?"New Deal":deal.client_name}</div><div style={{display:"flex",gap:8}}>{!nw&&<button onClick={()=>{if(confirm("Delete?"))onDel(deal.id);}} style={{...BG,padding:"6px 10px",color:"#FF4B4B"}}><Trash2 size={14}/></button>}<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><X size={18}/></button></div></div>
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

const COMPASS_KB=`HUMAIN KNOWLEDGE BASE — USE THIS TO ANSWER QUESTIONS

MASTER THREAD: Every sector has the same execution gap between sovereign ambition and operational reality. HUMAIN closes that gap as the sovereign intelligence partner that stays, builds, and compounds.

SECTOR BELIEFS:
- Government: Cross-ministry orchestration. Fear: losing AI narrative while 193 entities can't share data. Belief: they proved digital transformation works, now repeat with AI. HUMAIN is trusted connective tissue.
- Oil & Gas: OT/IT + domain expertise. Fear: strategic irrelevance before proving they're tech companies. Two clocks: relevance + asset value. Blockers are human/cultural. Speak oilfield, not algorithm.
- Healthcare: Arabic clinical AI. Fear: too fast = clinical harm, too slow = miss Vision 2030. EHR data broken, no Arabic clinical AI. Start with data quality truth, not AI demos.
- Private Sector: Data foundation first. Fear: CEO announced AI-first but org can't execute (81% claim, 27% adopt). Honest diagnostic, fix data first.
- Sport: Ecosystem data fabric. Fear: billions spent, nothing sustainable. 2034 World Cup hard deadline. Intelligence, not investment. Connect clubs/federations/venues/academies.

5 STAGES: Recognition (belief lands) → Proof (visible result) → Integration (embedded in workflow) → Dependency (can't operate without HUMAIN) → Expansion (invited into new rooms)

8 PRINCIPLES:
1. Lead with execution gap, never product
2. Belief statement is the key, not the demo
3. Every meeting ends with an advance, not a continuation
4. Observable signals only, no assumptions
5. Debrief is mandatory within 90 seconds
6. Never create urgency that doesn't exist
7. WhatsApp from CEO = highest buying signal
8. Sovereignty is the foundation, not a feature

IRREVERSIBILITY: 4 conditions must be simultaneously true: Workflow Dependency, Capability Dependency, Sovereign Trust, Expanding Invitation.

MEETING TOOLKIT:
- 48h before: research client, map attendees, prepare Challenger insight, load belief statement
- 2h before: check overnight news, decide next-step ask + fallback
- In meeting: lead with insight not product, 43:57 talk:listen, book calendar in final 5 min
- 2h after: follow-up email <200 words, WhatsApp referencing email, log signals in CRM

SIGNAL DECODER:
- Buying intent: WhatsApp connection, intro to senior stakeholders, PDPL questions, social invite
- Watch: "we will study this" without specifics, 60+ min social only, only junior staff
- No decision: no follow-up 10+ days, senior distracted/left early, 3+ touchpoints no progression

CROSS-SELL TRIGGERS: Visible Result → Trust Threshold → Client Pull → HUMAIN Sees First

PRODUCTS: HUMAIN ONE (unified AI interface), Brain/ALLAM (Arabic LLM), CORE (infrastructure), OS (workflow), Create (creative AI), Life (consumer), Code (developer), Care (healthcare), Next (research)

OBJECTION RESPONSES:
- "Already with Microsoft/Google": They're infrastructure, HUMAIN is sovereignty. Who owns the intelligence?
- "HUMAIN is new": PIF mandate, Crown Prince directive. Early mover advantage.
- "No budget": Suggest diagnostic assessment, no cost, becomes budget justification.
- "Procurement process": Already on Etimad, MISA-licensed. Relationship during procurement IS the deal.
- "Tried AI before, didn't scale": 69% GCC still in pilot. Problem is data infrastructure, not AI capability.
- "Inshallah": Three meanings. Look for specific action, not just warmth.`;

function MD({text}){if(!text)return null;const lines=text.split("\n");const out=[];let key=0;for(let i=0;i<lines.length;i++){let line=lines[i];const isBullet=/^(\s*)([-*•])\s+(.+)/.exec(line);const isNumbered=/^(\s*)(\d+)\.\s+(.+)/.exec(line);const isHeader=/^#{1,3}\s+(.+)/.exec(line);const renderInline=(s)=>{const parts=[];let last=0;const re=/(\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;let m;while((m=re.exec(s))!==null){if(m.index>last)parts.push(s.slice(last,m.index));if(m[2])parts.push(<strong key={"b"+key++}>{m[2]}</strong>);else if(m[3])parts.push(<code key={"c"+key++} style={{background:"var(--panel2)",padding:"1px 5px",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11}}>{m[3]}</code>);else if(m[4])parts.push(<em key={"i"+key++}>{m[4]}</em>);last=m.index+m[0].length;}if(last<s.length)parts.push(s.slice(last));return parts.length?parts:s;};if(isHeader){out.push(<div key={key++} style={{...T,fontSize:14,fontWeight:700,marginTop:i>0?10:0,marginBottom:6,color:"#009688"}}>{renderInline(isHeader[1])}</div>);}else if(isBullet){out.push(<div key={key++} style={{display:"flex",gap:8,marginBottom:4,paddingLeft:isBullet[1].length*6}}><span style={{color:"#009688",flexShrink:0}}>•</span><span>{renderInline(isBullet[3])}</span></div>);}else if(isNumbered){out.push(<div key={key++} style={{display:"flex",gap:8,marginBottom:4}}><span style={{color:"#009688",fontWeight:600,flexShrink:0,minWidth:16}}>{isNumbered[2]}.</span><span>{renderInline(isNumbered[3])}</span></div>);}else if(line.trim()===""){out.push(<div key={key++} style={{height:6}}/>);}else{out.push(<div key={key++} style={{marginBottom:4}}>{renderInline(line)}</div>);}}return<div>{out}</div>;}

function Chat({deals,profile,elKey,claudeKey,token,onDealCreated,onChatActive}){const[ms,sMs]=useState([]);const[inp,sI]=useState("");const[b,sB]=useState(false);const end=useRef(null);const stt=useSTT();useEffect(()=>{if(stt.transcript)sI(stt.transcript);},[stt.transcript]);
  const[pendingDeal,sPD]=useState(null);const[agentCtx,sAgentCtx]=useState("");const[savingDeal,sSD]=useState(false);
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
  const selectedAgent=agentCtx?AGENTS.find(x=>x.key===agentCtx):null;
    const today=new Date().toISOString().slice(0,10);
    const upcoming=a.filter(d=>d.next_meeting&&d.next_meeting>=today).sort((x,y)=>(x.next_meeting||"").localeCompare(y.next_meeting||"")).slice(0,10);
    const topDeals=[...a].sort((x,y)=>(y.expected_value||0)-(x.expected_value||0)).slice(0,15);
    const stalledDeals=a.filter(d=>d.updated_at&&(Date.now()-new Date(d.updated_at).getTime())>14*86400000).slice(0,5);
    const dealContext="CURRENT PIPELINE DATA:\n"+
      "Today: "+today+"\n"+
      "Total active deals: "+a.length+"\n\n"+
      (upcoming.length>0?"UPCOMING MEETINGS (next "+upcoming.length+"):\n"+upcoming.map(d=>"- "+d.next_meeting+": "+d.client_name+" ("+(d.sector||"?")+", "+d.stage+" stage)"+(d.next_step?" — next: "+d.next_step:"")).join("\n")+"\n\n":"NO UPCOMING MEETINGS SCHEDULED.\n\n")+
      "TOP DEALS BY VALUE:\n"+topDeals.map(d=>"- "+d.client_name+" ("+(d.sector||"?")+") — "+d.stage+" stage"+(d.expected_value?", SAR "+Number(d.expected_value).toLocaleString():"")+(d.deal_score?", score "+d.deal_score:"")+(d.contact_name?", contact: "+d.contact_name:"")).join("\n")+
      (stalledDeals.length>0?"\n\nSTALLED DEALS (no update >14 days):\n"+stalledDeals.map(d=>"- "+d.client_name+" ("+Math.round((Date.now()-new Date(d.updated_at).getTime())/86400000)+" days stalled)").join("\n"):"");
    const sys=selectedAgent
      ?"You are "+selectedAgent.name+", a specialized HUMAIN COMPASS agent. "+selectedAgent.desc+". User: "+(profile?.full_name||"")+".\n\n"+dealContext+"\n\n"+COMPASS_KB+"\n\nRespond from your agent perspective using the pipeline data and knowledge base above. Reference specific clients, meetings, sector beliefs, and principles. Be specific and actionable."
      :"You are COMPASS AI, the sovereign intelligence layer for HUMAIN CRM. User: "+(profile?.full_name||"")+".\n\n"+dealContext+"\n\n"+COMPASS_KB+"\n\nWhen the user asks about upcoming meetings, next sessions, or scheduled activity, use the UPCOMING MEETINGS data above. When they ask about specific clients, reference the pipeline data. When they mention a new opportunity or deal, use register_deal. When they want to prepare for a meeting, use prepare_meeting_brief. Use the knowledge base for sector beliefs, engagement principles, meeting tactics, and HUMAIN products. Be specific and actionable. Be concise.";
  try{const body={apiKey:claudeKey||"",model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[...ms.slice(-10),{role:"user",content:t}],system:sys,tools:[DEAL_TOOL,BRIEF_TOOL]};
    const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});if(!r.ok){const err=await r.text();throw new Error(err||"Claude API error");}const d=await r.json();
    let txt=[];let toolUse=null;
    for(const block of (d.content||[])){if(block.type==="text"&&block.text)txt.push(block.text);if(block.type==="tool_use"&&block.name==="register_deal")toolUse=block.input;if(block.type==="tool_use"&&block.name==="prepare_meeting_brief")txt.push("Opening brief generator for "+(block.input?.client_name||"your client")+"...");}
    if(txt.length)sMs(p=>[...p,{role:"assistant",content:txt.join("")}]);
    if(toolUse)sPD({client_name:toolUse.client_name||"",sector:toolUse.sector||"",expected_value:toolUse.expected_value||0,contact_name:toolUse.contact_name||"",stage:toolUse.stage||"Recognition",next_step:toolUse.next_step||""});
  }catch(x){sMs(p=>[...p,{role:"assistant",content:"Error: "+x.message}]);}finally{sB(false);}};
return(<div style={{...CS,border:"1px solid rgba(0,150,136,0.15)",boxShadow:"0 2px 12px rgba(0,150,136,0.06)"}}><div style={{height:2,background:"linear-gradient(90deg,#B8E636,#00B89C,#009688)"}}/><div style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:26,height:26,borderRadius:8,background:"rgba(0,150,136,0.08)",display:"flex",alignItems:"center",justifyContent:"center",color:"#009688"}}><MessageSquare size={13}/></div>
      <span style={{...M,fontSize:10,letterSpacing:"0.06em",color:"var(--muted)",flex:1}}>COMPASS AI</span>
      <select value={agentCtx} onChange={e=>sAgentCtx(e.target.value)} style={{...M,fontSize:9,padding:"3px 8px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel2)",color:"var(--muted)",cursor:"pointer"}}>
        <option value="">General</option>{AGENTS.map(a=><option key={a.key} value={a.key}>{a.name}</option>)}
      </select>
    </div>
<div style={{height:320,overflowY:"auto",padding:14}}>{ms.length===0&&<div style={{textAlign:"center",paddingTop:50,color:"var(--muted)",fontSize:13}}>Ask about deals, pipeline, or strategy</div>}{ms.map((m,i)=><div key={i} style={{marginBottom:10,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"80%"}}><div style={{padding:"9px 13px",borderRadius:10,fontSize:13,lineHeight:1.6,background:m.role==="user"?"#0D1B1E":"rgba(0,150,136,0.06)",color:m.role==="user"?"#fff":"var(--text)",border:m.role==="assistant"?"1px solid rgba(0,150,136,0.1)":"none",whiteSpace:"normal"}}>{m.role==="assistant"?<MD text={m.content}/>:m.content}</div>{m.role==="assistant"&&<button onClick={()=>speakTTS(m.content,elKey)} style={{marginTop:3,background:"none",border:"none",cursor:"pointer",color:"var(--muted)",padding:2}}><Volume2 size={12}/></button>}</div></div>)}{b&&<div style={{...M,color:"var(--muted)",fontSize:11}}>Thinking...</div>}<div ref={end}/></div>

      {pendingDeal&&<div style={{margin:"0 12px 8px",padding:"14px 16px",background:"rgba(0,184,156,0.04)",border:"1px solid rgba(0,184,156,0.15)",borderRadius:10}}>
        <div style={{...M,fontSize:9,letterSpacing:"0.1em",color:"#00B89C",marginBottom:10}}>DEAL DETECTED — CONFIRM TO REGISTER</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div><label style={{...LB,fontSize:8}}>CLIENT</label><input value={pendingDeal.client_name} onChange={e=>sPD(p=>({...p,client_name:e.target.value}))} style={{...IP,fontSize:12,padding:"6px 10px"}}/></div>
          <div><label style={{...LB,fontSize:8}}>SECTOR</label><select value={pendingDeal.sector} onChange={e=>sPD(p=>({...p,sector:e.target.value}))} style={{...IP,fontSize:12,padding:"6px 10px"}}><option value="">Select</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label style={{...LB,fontSize:8}}>VALUE (SAR)</label><input type="number" value={pendingDeal.expected_value} onChange={e=>sPD(p=>({...p,expected_value:e.target.value}))} style={{...IP,fontSize:12,padding:"6px 10px"}}/></div>
          <div><label style={{...LB,fontSize:8}}>STAGE</label><select value={pendingDeal.stage} onChange={e=>sPD(p=>({...p,stage:e.target.value}))} style={{...IP,fontSize:12,padding:"6px 10px"}}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={()=>sPD(null)} style={{...BG,padding:"5px 12px",fontSize:11}}>Cancel</button><button onClick={saveDeal} disabled={savingDeal} style={{...BP,padding:"5px 12px",fontSize:11,opacity:savingDeal?0.6:1}}><Save size={12} style={{marginRight:4}}/>{savingDeal?"Saving...":"Register Deal"}</button></div>
      </div>}
      <div style={{padding:"12px 14px",borderTop:"1px solid var(--border)",background:"var(--panel2)",display:"flex",gap:8}}><button onClick={()=>{if(stt.listening){stt.stop();}else{stt.start();}}} style={{padding:"9px",background:stt.listening?"rgba(255,75,75,0.1)":"transparent",border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",color:stt.listening?"#FF4B4B":"var(--muted)"}}>
{stt.listening?<MicOff size={14}/>:<Mic size={14}/>}</button><input value={inp} onChange={e=>sI(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={stt.listening?"Listening...":"Ask COMPASS anything..."} onFocus={()=>onChatActive&&onChatActive(true)} style={{...IP,flex:1}}/><button onClick={go} disabled={b||!inp.trim()} style={{...BP,padding:"10px 18px",opacity:b||!inp.trim()?0.4:1}}><Send size={14}/></button></div></div>);}

function Kanban({deals,onOpen}){const g=STAGES.reduce((a,s)=>{a[s]=deals.filter(d=>d.stage===s&&d.status==="Active");return a;},{});
return(<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:0,border:"1px solid var(--border)",borderRadius:20,overflow:"hidden",marginBottom:24}}>{STAGES.map((s,i)=><div key={s} style={{borderRight:i<4?"1px solid var(--border)":"none",minHeight:180}}><div style={{padding:"10px 12px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{...M,fontSize:9,letterSpacing:"0.08em",color:SC[s],fontWeight:600}}>{s.toUpperCase()}</span><span style={{...M,fontSize:9,color:"var(--muted)",background:"var(--panel2)",padding:"2px 6px",borderRadius:8}}>{g[s].length}</span></div><div style={{padding:6}}>{g[s].map(d=><div key={d.id} onClick={()=>onOpen(d)} style={{background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:10,padding:"9px 10px",marginBottom:5,cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,150,136,0.3)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";}}><div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{d.client_name}</div><div style={{...M,fontSize:9,color:"var(--muted)"}}>{d.sector||"—"}</div>{d.expected_value>0&&<div style={{...M,fontSize:9,color:"#009688",marginTop:3}}>SAR {Number(d.expected_value).toLocaleString()}</div>}</div>)}</div></div>)}</div>);}

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
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}><div style={{width:500,maxHeight:"80vh",background:"var(--panel)",borderRadius:20,overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
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

function Marketing({token,claudeKey:mktCK}){const[vw,sVw]=useState("campaigns");const[camps,sCamps]=useState([]);const[leads,sLeads]=useState([]);const[assets,sAssets]=useState([]);const[mktModal,sMktModal]=useState(null);
  const loadMkt=useCallback(()=>{if(!token)return;q("/rest/v1/campaigns?select=*&order=created_at.desc",token).then(sCamps).catch(()=>{});q("/rest/v1/leads?select=*&order=created_at.desc",token).then(sLeads).catch(()=>{});q("/rest/v1/content_assets?select=*&order=created_at.desc",token).then(sAssets).catch(()=>{});},[token]);
useEffect(()=>{loadMkt();},[loadMkt]);
const tabs=[{id:"campaigns",label:`Campaigns (${camps.length})`,icon:Megaphone},{id:"leads",label:`Leads (${leads.length})`,icon:UserPlus},{id:"content",label:`Content (${assets.length})`,icon:FileText},{id:"calendar",label:"Calendar",icon:Calendar}];
return(<div><div style={{marginBottom:20}}><div style={{...T,fontSize:22,fontWeight:800}}>Marketing</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>Campaigns, leads, content assets, and calendar.</div></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
    <KPI v={leads.length} l="ACTIVE LEADS" c="#009688"/>
    <KPI v={camps.filter(x=>x.status==="Active").length} l="ACTIVE CAMPAIGNS" c="#00B89C"/>
    <KPI v={assets.length} l="CONTENT ASSETS" c="#5B7A0F"/>
    <KPI v={camps.filter(x=>x.status==="Active").reduce((s,x)=>(s+(x.budget_sar||0)),0)>0?"SAR "+(camps.filter(x=>x.status==="Active").reduce((s,x)=>(s+(x.budget_sar||0)),0)/1e6).toFixed(1)+"M":"—"} l="BUDGET ACTIVE" c="#FFB800"/>
  </div>
<div style={{...CS,padding:"16px 20px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(0,184,156,0.02)",border:"1px solid rgba(0,184,156,0.1)"}}>
    <div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><div style={{width:6,height:6,borderRadius:8,background:"#00B89C"}}/><span style={{...M,fontSize:9,color:"#00B89C",letterSpacing:"0.1em"}}>AI WEEKLY BRIEF</span></div><div style={{fontSize:13,color:"var(--sub)"}}>Click Refresh to generate this week's marketing intelligence brief.</div></div>
    <button onClick={async()=>{if(!window._mktBriefBusy){window._mktBriefBusy=true;try{const d=await callClaude(mktCK,[{role:"user",content:"Generate a weekly marketing intelligence brief.\n\n"+COMPASS_KB+"\n\nCurrent data: "+camps.length+" campaigns, "+leads.length+" leads, "+assets.length+" content assets. Active campaigns: "+camps.filter(x=>x.status==="Active").map(x=>x.name).join(", ")+". Provide 3 insights about campaign effectiveness and 2 recommendations aligned with HUMAIN sector strategy. Reference specific sectors. Be concise."}],{max_tokens:600});alert(d.content?.[0]?.text||"No response");}catch(e){alert("Error: "+e.message);}finally{window._mktBriefBusy=false;}}}} style={{...BG,padding:"8px 16px",display:"flex",alignItems:"center",gap:6,flexShrink:0}}><RefreshCw size={13}/>Refresh</button>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
    <div style={{...CS,padding:20}}>
      <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:12}}>CAMPAIGN PERFORMANCE</div>
      {camps.slice(0,5).map(cp=>{const cpLeads=leads.filter(l=>l.source_campaign_id===cp.id).length;const cpDeals=leads.filter(l=>l.source_campaign_id===cp.id&&l.converted_deal_id).length;return(
        <div key={cp.id} style={{padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{cp.name}</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{...M,fontSize:10,color:"var(--muted)"}}>{cp.type} · {cp.status}</span><span style={{...M,fontSize:10,color:"#00B89C"}}>{cpLeads} leads → {cpDeals} deals</span></div>
        </div>);})}
      {camps.length===0&&<div style={{fontSize:12,color:"var(--muted)",textAlign:"center",padding:12}}>No campaigns yet</div>}
    </div>
    <div style={{...CS,padding:20}}>
      <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:12}}>CONVERSION FUNNEL</div>
      {(()=>{const funnelData=[{label:"Leads",count:leads.length,color:"#8A9BAA"},{label:"Warm",count:leads.filter(l=>l.status==="Warm").length,color:"#FFB800"},{label:"Hot",count:leads.filter(l=>l.status==="Hot").length,color:"#FF6B6B"},{label:"Ready",count:leads.filter(l=>l.status==="Ready").length,color:"#00B89C"},{label:"Converted",count:leads.filter(l=>l.status==="Converted").length,color:"#009688"},{label:"Won",count:leads.filter(l=>l.converted_deal_id).length,color:"#B8E636"}];const maxCount=Math.max(...funnelData.map(f=>f.count),1);return(
        <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120}}>
          {funnelData.map(f=><div key={f.label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <span style={{...M,fontSize:9,color:"var(--muted)"}}>{f.count}</span>
            <div style={{width:"100%",background:f.color,borderRadius:8,height:Math.max(f.count/maxCount*80,4)}}/>
            <span style={{...M,fontSize:8,color:"var(--muted)"}}>{f.label}</span>
          </div>)}
        </div>);})()}
    </div>
  </div>
  <div style={{display:"flex",gap:0,marginBottom:20,justifyContent:"space-between",alignItems:"center"}}><div style={{display:"inline-flex",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>{tabs.map(t=>{const I=t.icon;return(<button key={t.id} onClick={()=>sVw(t.id)} style={{...M,fontSize:11,padding:"9px 18px",border:"none",background:vw===t.id?"#009688":"var(--card-bg)",color:vw===t.id?"#fff":"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><I size={13}/>{t.label}</button>);})}</div><div style={{display:"flex",gap:8}}><button onClick={async()=>{try{const d=await callClaude(mktCK,[{role:"user",content:"You are a marketing strategist for HUMAIN.\n\n"+COMPASS_KB+"\n\nCurrent campaigns: "+camps.map(x=>x.name+" ("+x.status+", "+x.sector+")").join(", ")+". "+leads.length+" leads across sectors.\n\nSuggest 3 new campaign ideas. Each must: target a specific sector gap from the knowledge base, name the fear it addresses, specify type (Event/Webinar/Content/Digital), estimated budget in SAR, and expected pipeline impact. Format clearly."}],{max_tokens:800});alert(d.content?.[0]?.text||"No response");}catch(e){alert("Error: "+e.message);}}} style={{...BG,padding:"8px 14px",fontSize:11,color:"#5B7A0F",borderColor:"rgba(90,122,0,0.2)"}}>AI Campaign Planner</button><button onClick={()=>sMktModal({type:vw==="content"?"asset":vw==="leads"?"lead":"campaign",item:null})} style={BP}><Plus size={13} style={{marginRight:5}}/>New</button></div></div>
{vw==="campaigns"&&<div style={CS}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Name","Type","Sector","Status","Budget","Dates"].map(h=><th key={h} style={{...M,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{camps.map(c=><tr key={c.id} style={{borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>sMktModal({type:"campaign",item:c})} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,150,136,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 14px",fontWeight:600}}>{c.name}</td><td style={{padding:"10px 14px",color:"var(--sub)"}}>{c.type||"—"}</td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{c.sector||"—"}</td><td style={{padding:"10px 14px"}}><span style={{...M,fontSize:10,padding:"3px 8px",borderRadius:999,background:c.status==="Active"?"rgba(0,184,156,0.06)":c.status==="Planned"?"rgba(255,184,0,0.06)":"rgba(138,155,170,0.06)",color:c.status==="Active"?"#00B89C":c.status==="Planned"?"#FFB800":"#8A9BAA"}}>{c.status}</span></td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{c.budget_sar?`SAR ${Number(c.budget_sar).toLocaleString()}`:"—"}</td><td style={{padding:"10px 14px",...M,fontSize:10,color:"var(--muted)"}}>{c.start_date||"—"}</td></tr>)}{camps.length===0&&<tr><td colSpan={6} style={{padding:24,textAlign:"center",color:"var(--muted)"}}>No campaigns yet</td></tr>}</tbody></table></div>}
{vw==="leads"&&<div style={CS}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Name","Organization","Sector","Source","Status","Created"].map(h=><th key={h} style={{...M,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{leads.map(l=><tr key={l.id} style={{borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>sMktModal({type:"lead",item:l})} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,150,136,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 14px",fontWeight:600}}>{l.name}</td><td style={{padding:"10px 14px",color:"var(--sub)"}}>{l.organization||"—"}</td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{l.sector||"—"}</td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{l.source_type||"—"}</td><td style={{padding:"10px 14px"}}><span style={{...M,fontSize:10,padding:"3px 8px",borderRadius:999,background:l.status==="Hot"?"rgba(255,75,75,0.06)":l.status==="Warm"?"rgba(255,184,0,0.06)":"rgba(138,155,170,0.06)",color:l.status==="Hot"?"#FF4B4B":l.status==="Warm"?"#FFB800":"#8A9BAA"}}>{l.status}</span></td><td style={{padding:"10px 14px",...M,fontSize:10,color:"var(--muted)"}}>{l.created_at?new Date(l.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"—"}</td></tr>)}{leads.length===0&&<tr><td colSpan={6} style={{padding:24,textAlign:"center",color:"var(--muted)"}}>No leads yet</td></tr>}</tbody></table></div>}
{vw==="content"&&<div style={CS}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Title","Type","Sector","Status","Created"].map(h=><th key={h} style={{...M,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{assets.map(a=><tr key={a.id} style={{borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>sMktModal({type:"asset",item:a})} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,150,136,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 14px",fontWeight:600}}>{a.title||a.name||"—"}</td><td style={{padding:"10px 14px",color:"var(--sub)"}}>{a.asset_type||a.type||"—"}</td><td style={{padding:"10px 14px",...M,fontSize:11,color:"var(--sub)"}}>{a.sector||"—"}</td><td style={{padding:"10px 14px"}}><span style={{...M,fontSize:10,padding:"3px 8px",borderRadius:999,background:"rgba(0,150,136,0.06)",color:"#009688"}}>{a.status||"Draft"}</span></td><td style={{padding:"10px 14px",...M,fontSize:10,color:"var(--muted)"}}>{a.created_at?new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"—"}</td></tr>)}{assets.length===0&&<tr><td colSpan={5} style={{padding:24,textAlign:"center",color:"var(--muted)"}}>No assets yet</td></tr>}</tbody></table></div>}

{vw==="calendar"&&<div style={CS}><div style={{padding:20}}>
  <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:14}}>CAMPAIGN TIMELINE</div>
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {camps.filter(c2=>c2.start_date).sort((a,b2)=>(a.start_date||"").localeCompare(b2.start_date||"")).map(c2=>{const isActive=c2.status==="Active";return(
      <div key={c2.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:isActive?"rgba(0,184,156,0.03)":"transparent",borderRadius:8,border:"1px solid var(--border)"}}>
        <div style={{...M,fontSize:10,color:"var(--muted)",width:70,flexShrink:0}}>{c2.start_date?new Date(c2.start_date+"T00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"—"}</div>
        <div style={{width:8,height:8,borderRadius:8,background:isActive?"#00B89C":c2.status==="Planned"?"#FFB800":"#8A9BAA",flexShrink:0}}/>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{c2.name}</div><div style={{...M,fontSize:10,color:"var(--muted)"}}>{c2.type||""} · {c2.sector||"All sectors"}</div></div>
        <div style={{...M,fontSize:10,color:"var(--muted)"}}>{c2.end_date?new Date(c2.end_date+"T00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"—"}</div>
        <span style={{...M,fontSize:9,padding:"2px 6px",borderRadius:8,background:isActive?"rgba(0,184,156,0.06)":"rgba(138,155,170,0.06)",color:isActive?"#00B89C":"#8A9BAA"}}>{c2.status}</span>
      </div>);})}
    {camps.filter(c2=>c2.start_date).length===0&&<div style={{textAlign:"center",padding:24,color:"var(--muted)",fontSize:13}}>No campaigns with dates set</div>}
  </div>
</div></div>}
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
    const d=await callClaude(ck,[{role:"user",content:prompt}],{max_tokens:800,system:"You are a HUMAIN COMPASS intelligence agent. Use this knowledge base:\n"+COMPASS_KB+"\nProvide specific, actionable insights based on HUMAIN's actual beliefs and methodology."});
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
    "You are Sector Radar for HUMAIN sovereign AI. Analyze these active deals: "+dealCtx+". Cross-reference with HUMAIN sector beliefs. Which sectors align with our beliefs? Where are gaps between our pipeline and our sector strategy? 3-5 specific recommendations.",claudeKey);

  if(debriefs&&debriefs.length>0){
    const dbCtx=debriefs.slice(0,5).map(d=>d.sector+": confirmed="+((d.confirmed||"").slice(0,80))+", challenged="+((d.challenged||"").slice(0,80))+", new="+((d.new_signal||"").slice(0,80))).join("\n");
    results.debrief_analyst=await runAIAgent(token,"Debrief Analyst",
      "You are Debrief Analyst for HUMAIN. Analyze these meeting debriefs against our sector beliefs:\n"+dbCtx+"\nWhich HUMAIN beliefs were confirmed? Which were challenged? What new signals should update our sector intelligence? 3-5 specific insights.",claudeKey);
    results.belief_evolution=await runAIAgent(token,"Belief Evolution",
      "You are Belief Evolution tracker for HUMAIN. Based on these debrief signals:\n"+dbCtx+"\nCompare against our current sector beliefs (Government: cross-ministry orchestration, O&G: OT/IT domain expertise, Healthcare: Arabic clinical AI, Private Sector: data foundation first, Sport: ecosystem data fabric). Which are strengthening? Which need revision? Recommend specific belief statement updates.",claudeKey);
  }else{results.debrief_analyst="No debriefs to analyze";results.belief_evolution="No debrief data";}

  const wonLost=deals.filter(d=>d.status==="Won"||d.status==="Lost");
  if(wonLost.length>2){
    const wlCtx=wonLost.slice(0,8).map(d=>d.client_name+" ("+d.sector+") = "+d.status+", value: SAR "+(d.expected_value||0).toLocaleString()).join("; ");
    results.winloss_intel=await runAIAgent(token,"Win/Loss Intel","You are Win/Loss Intel for HUMAIN. Analyze these outcomes: "+wlCtx+". Against our 5-stage progression (Recognition→Proof→Integration→Dependency→Expansion) and 8 engagement principles, what patterns differentiate wins from losses? Which principles were followed in wins? Which were violated in losses? 3-5 actionable insights.",claudeKey);
  }else{results.winloss_intel="Not enough won/lost data";}

  results.team_coach=await runAIAgent(token,"Team Coach",
    "You are Team Coach for HUMAIN BD team. Pipeline: "+active.length+" active deals, "+deals.filter(d=>d.status==="Won").length+" won, "+deals.filter(d=>d.status==="Lost").length+" lost. Avg deal: SAR "+Math.round(active.reduce((s,d)=>s+(d.expected_value||0),0)/Math.max(active.length,1)).toLocaleString()+". Based on HUMAIN's 8 engagement principles (lead with gap not product, belief is the key, advance not continuation, observable signals only, mandatory debrief, no manufactured urgency, WhatsApp = buying signal, sovereignty = foundation), provide 3 coaching recommendations. Reference specific principles the team should focus on.",claudeKey);

  results.campaign_roi=await runAIAgent(token,"Campaign ROI",
    "You are Campaign ROI analyst for HUMAIN. "+active.length+" active deals across 5 sectors (Government, O&G, Healthcare, Private Sector, Sport). Leads feed from campaigns into the 5-stage pipeline. Based on HUMAIN sector beliefs and the cross-sell logic (Visible Result→Trust Threshold→Client Pull→HUMAIN Sees First), recommend how to measure and improve campaign ROI. Which sector campaigns should accelerate? 3-5 actionable points.",claudeKey);

  results.brief_architect="Briefs generated on-demand via Meetings tab";
  return results;
}

function AgentsTab({token,deals,leads,assets,debriefs,onRefresh,claudeKey,onOpenDeal}){
  const[qFilter,sQF]=useState("all");
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
          res=await runAIAgent(token,agent.name,"You are "+agent.name+" agent for HUMAIN sovereign AI in Saudi Arabia. "+agent.desc+". Use the HUMAIN knowledge base to ground your analysis.\n\nActive pipeline: "+ctx+"\n\nProvide 3-5 actionable insights referencing specific HUMAIN sector beliefs, engagement principles, or methodology where relevant. Be concise.",claudeKey);
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
      <div><div style={{...T,fontSize:22,fontWeight:800}}>Agents</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>12 sovereign intelligence agents · <span style={{color:"#FFB800"}}>{queue.filter(q2=>q2.status==="pending").length} pending actions</span></div></div>
      <button onClick={execAll} disabled={runAll} style={{...BP,opacity:runAll?0.6:1}}><Zap size={14} style={{marginRight:6}}/>{runAll?"Running all...":"Run All Agents"}</button>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:28}}>
      {AGENTS.map(a=>{const I=a.icon;const isRunning=running===a.key;const hasResult=results[a.key];
      return(<div key={a.key} style={{...CS,padding:"16px 18px",transition:"all .2s",position:"relative"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,150,136,0.2)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:30,height:30,borderRadius:8,background:a.color+"12",display:"flex",alignItems:"center",justifyContent:"center",color:a.color}}><I size={15}/></div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{a.name}</div><span style={{...M,fontSize:9,color:a.type==="hourly"?"#00B89C":"#FFB800"}}>{a.type.toUpperCase()}</span></div>
          <button onClick={()=>execOne(a)} disabled={isRunning||runAll} style={{padding:"4px 8px",borderRadius:8,border:"1px solid var(--border)",background:isRunning?"rgba(0,150,136,0.06)":"transparent",cursor:isRunning?"wait":"pointer",color:isRunning?"#009688":"var(--muted)",fontSize:10,...M}}>{isRunning?"Running...":"Run"}</button>
        </div>
        <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{a.desc}</div>
        {hasResult&&<div style={{marginTop:8,padding:"6px 10px",background:"rgba(0,184,156,0.04)",border:"1px solid rgba(0,184,156,0.1)",borderRadius:8,fontSize:11,color:"#00B89C",...M}}>{typeof hasResult==="string"?hasResult.slice(0,100):hasResult}</div>}
      </div>);})}
    </div>

    <div style={{...CS,padding:20,marginBottom:20,border:"1px solid rgba(0,150,136,0.1)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><Globe size={14} color="#009688"/><span style={{...M,fontSize:10,letterSpacing:"0.1em",color:"#009688"}}>LIVING SECTOR INTELLIGENCE</span></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
        {SECTORS.map(s=>{const sDeals=deals.filter(d=>d.sector===s&&d.status==="Active");const sVal=sDeals.reduce((x,d)=>x+(d.expected_value||0),0);const avgScore=sDeals.length?Math.round(sDeals.reduce((x,d)=>x+(d.deal_score||0),0)/sDeals.length):0;return(
          <div key={s} style={{padding:"12px 14px",background:"var(--panel2)",borderRadius:8,borderLeft:"3px solid "+(XC[s]||"#8A9BAA")}}>
            <div style={{...M,fontSize:9,color:XC[s],marginBottom:6}}>{s.toUpperCase()}</div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{sDeals.length} deal{sDeals.length!==1?"s":""}</div>
            <div style={{...M,fontSize:10,color:"var(--muted)"}}>SAR {(sVal/1e6).toFixed(1)}M</div>
            <div style={{...M,fontSize:9,color:avgScore>=60?"#00B89C":avgScore>=30?"#FFB800":"var(--muted)",marginTop:4}}>Avg score: {avgScore||"—"}</div>
          </div>);})}
      </div>
    </div>

    {(qFilter!=="all"||queue.filter(q2=>q2.status==="pending").length>0)&&<>
      <div style={{display:"flex",gap:4,marginBottom:12}}>{["all","pending","critical","high","approved","dismissed"].map(f=><button key={f} onClick={()=>sQF(f)} style={{...M,fontSize:9,padding:"4px 10px",borderRadius:8,border:"1px solid var(--border)",background:qFilter===f?"rgba(0,150,136,0.06)":"transparent",color:qFilter===f?"#009688":"var(--muted)",cursor:"pointer",textTransform:"capitalize"}}>{f==="all"?"All":f}</button>)}</div>
      <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>ACTION QUEUE ({queue.filter(q2=>qFilter==="all"?true:qFilter==="pending"?q2.status==="pending":qFilter==="critical"?q2.priority==="critical":qFilter==="high"?q2.priority==="high":q2.status===qFilter).length})</div>
      <div style={CS}>{queue.filter(q2=>qFilter==="all"?q2.status==="pending":qFilter==="pending"?q2.status==="pending":qFilter==="critical"?q2.priority==="critical"&&q2.status==="pending":qFilter==="high"?q2.priority==="high"&&q2.status==="pending":q2.status===qFilter).map(item=>(
        <div key={item.id} style={{padding:"14px 18px",borderBottom:"1px solid var(--border)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <span style={{...M,fontSize:9,padding:"2px 6px",borderRadius:8,background:item.priority==="critical"?"rgba(255,75,75,0.08)":item.priority==="high"?"rgba(255,184,0,0.08)":"rgba(0,150,136,0.06)",color:item.priority==="critical"?"#FF4B4B":item.priority==="high"?"#FFB800":"#009688"}}>{item.priority?.toUpperCase()}</span>
                <span style={{...M,fontSize:9,color:"var(--muted)"}}>{item.agent_name}</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{item.title}</div>
              <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{(item.description||"").slice(0,200)}</div>
              {item.suggested_action&&<div style={{fontSize:11,color:"#00B89C",marginTop:4,...M}}>{item.suggested_action.slice(0,150)}</div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginLeft:10,flexShrink:0}}>
              <button onClick={async()=>{try{await q(`/rest/v1/agent_queue?id=eq.${item.id}`,token,{method:"PATCH",body:JSON.stringify({status:"approved"})});loadQueue();}catch(e){}}} style={{padding:"4px 10px",borderRadius:8,border:"none",background:"#009688",color:"#fff",cursor:"pointer",fontSize:10,...M}}>Approve</button>
              <button onClick={()=>dismiss(item.id)} style={{padding:"4px 10px",borderRadius:8,border:"1px solid var(--border)",background:"none",cursor:"pointer",color:"var(--muted)",fontSize:10,...M}}>Dismiss</button>
              {item.deal_id&&<button onClick={()=>onOpenDeal&&onOpenDeal(item.deal_id)} style={{padding:"3px 8px",borderRadius:999,border:"1px solid var(--border)",background:"none",cursor:"pointer",color:"#009688",fontSize:9,...M}}>View Deal</button>}
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
    const prompt="Generate a comprehensive pre-meeting brief for the HUMAIN BD team. Use the following HUMAIN knowledge base for sector beliefs and engagement principles:\n\n"+COMPASS_KB+"\n\n"+
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
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:24,height:2,background:"linear-gradient(90deg,#009688,#00B89C)",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.14em",color:"#009688"}}>BEFORE & AFTER EVERY CLIENT MEETING</span></div>
    <div style={{...T,fontSize:26,fontWeight:800,marginBottom:6}}>Meetings</div>
    <div style={{fontSize:14,color:"var(--sub)",lineHeight:1.6,maxWidth:540,marginBottom:20}}>Prepare the brief before you walk in. Capture the debrief within 90 seconds of walking out. One workflow, one place.</div>

    {/* Toggle */}
    <div style={{display:"inline-flex",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)",marginBottom:28}}>
      <button onClick={()=>sView("brief")} style={{padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",border:"none",background:view==="brief"?"#009688":"var(--card-bg)",color:view==="brief"?"#fff":"var(--muted)",transition:"all .2s"}}>Pre-Meeting Brief</button>
      <button onClick={()=>sView("debrief")} style={{padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",border:"none",background:view==="debrief"?"#009688":"var(--card-bg)",color:view==="debrief"?"#fff":"var(--muted)",transition:"all .2s"}}>Post-Meeting Debrief</button>
    </div>

    {view==="brief"&&<div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><div style={{width:20,height:2,background:"#00B89C",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.12em",color:"#00B89C"}}>POWERED BY CLAUDE AI</span></div>
      <div style={{...T,fontSize:20,fontWeight:800,marginBottom:4}}>Pre-Meeting Brief Generator</div>
      <div style={{fontSize:13,color:"var(--sub)",marginBottom:20}}>Real AI brief — specific to your client, your context, your goal.</div>

      {/* Quick-fill from deal */}
      <div style={{marginBottom:16}}><label style={LB}>QUICK-FILL FROM DEAL</label>
        <select onChange={e=>{if(e.target.value)prefill(e.target.value);}} style={{...IP,maxWidth:400}}><option value="">Select to pre-fill fields...</option>{a.map(d=><option key={d.id} value={d.id}>{d.client_name} ({d.sector}, {d.stage})</option>)}</select>
      </div>

      <div style={{...CS,padding:"24px 28px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><FileText size={16} color="#009688"/><span style={{fontSize:14,fontWeight:700}}>Meeting Details</span></div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:18}}>The more context you give, the sharper the brief</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
          <div><label style={{...LB,color:"#009688"}}>CLIENT / ENTITY</label><input value={bf.client} onChange={e=>setBf("client",e.target.value)} placeholder="e.g. Saudi Aramco, MOH, PIF" style={IP}/></div>
          <div><label style={{...LB,color:"#009688"}}>SECTOR</label><select value={bf.sector} onChange={e=>setBf("sector",e.target.value)} style={IP}><option value="">Select</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label style={{...LB,color:"#009688"}}>MEETING TYPE</label><select value={bf.meetingType} onChange={e=>setBf("meetingType",e.target.value)} style={IP}><option>First meeting</option><option>Follow-up</option><option>Technical deep-dive</option><option>Executive presentation</option></select></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div><label style={{...LB,color:"#009688"}}>WHO IS ATTENDING? (roles & seniority)</label><textarea value={bf.attendees} onChange={e=>setBf("attendees",e.target.value)} rows={3} placeholder="e.g. CTO, Head of Digital Transformation, 2 senior engineers..." style={{...IP,resize:"vertical"}}/></div>
          <div><label style={{...LB,color:"#009688"}}>PREVIOUS MEETING OUTCOMES</label><textarea value={bf.previous} onChange={e=>setBf("previous",e.target.value)} rows={3} placeholder="What happened in previous meetings? Agreements, objections, signals..." style={{...IP,resize:"vertical"}}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div><label style={{...LB,color:"#009688"}}>CHALLENGES THEY MENTIONED</label><textarea value={bf.challenges} onChange={e=>setBf("challenges",e.target.value)} rows={3} placeholder="Pain points, blockers, or concerns they raised..." style={{...IP,resize:"vertical"}}/></div>
          <div><label style={{...LB,color:"#009688"}}>RECENT NEWS ABOUT THIS ORGANISATION</label><textarea value={bf.news} onChange={e=>setBf("news",e.target.value)} rows={3} placeholder="Leadership changes, announcements, projects, budget cycles..." style={{...IP,resize:"vertical"}}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
          <div><label style={{...LB,color:"#009688"}}>EXPECTED DEAL VALUE (SAR)</label><input value={bf.value} onChange={e=>setBf("value",e.target.value)} placeholder="e.g. 2,000,000" style={IP}/></div>
          <div><label style={{...LB,color:"#009688"}}>WHAT MUST THIS MEETING ACHIEVE?</label><input value={bf.goal} onChange={e=>setBf("goal",e.target.value)} placeholder="e.g. Commit to technical session, secure diagnostic engagement" style={IP}/></div>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={generate} disabled={genBusy||!bf.client.trim()} style={{...BP,padding:"10px 24px",opacity:genBusy||!bf.client.trim()?0.5:1}}><FileText size={14} style={{marginRight:6}}/>{genBusy?"Generating...":"Generate Brief"}</button>
          {brief&&<button onClick={()=>{const w=window.open("","_blank");w.document.write("<html><head><title>COMPASS Brief — "+bf.client+"</title><style>body{font-family:DM Sans,sans-serif;max-width:700px;margin:40px auto;padding:0 32px;color:#0a0a0a;line-height:1.75}h1{font-size:24px;margin-bottom:4px}h2{font-size:11px;letter-spacing:0.15em;color:#009688;margin-bottom:20px;font-family:DM Mono,monospace}.meta{font-size:12px;color:#999;margin-bottom:24px}.bar{height:2px;background:linear-gradient(90deg,#B8E636,#00B89C,#009688);margin-bottom:24px}pre{white-space:pre-wrap;font-family:DM Sans,sans-serif;font-size:13.5px;line-height:1.75;color:#333}</style></head><body><h2>HUMAIN COMPASS — PRE-MEETING BRIEF</h2><h1>"+bf.client+"</h1><div class=meta>"+bf.sector+" · "+bf.meetingType+" · Generated "+new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})+"</div><div class=bar></div><pre>"+brief.replace(/</g,"&lt;")+"</pre></body></html>");w.document.close();w.print();}} style={{...BG,padding:"10px 24px"}}><FileText size={14} style={{marginRight:6}}/>Print / PDF</button>}
          <button onClick={clearBf} style={{...BG,padding:"10px 24px"}}>Clear</button>
        </div>
      </div>

      {brief&&<div style={{...CS,padding:"24px 28px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:20,height:2,background:"#00B89C",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.12em",color:"#00B89C"}}>AI-GENERATED BRIEF</span></div>
        <div style={{fontSize:13.5,lineHeight:1.75,color:"var(--sub)",whiteSpace:"pre-wrap"}}>{brief}</div>
      </div>}
      {savedBriefs.length>0&&<div>
        <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>SAVED BRIEFS ({savedBriefs.length})</div>
        <div style={CS}>{savedBriefs.map(b=><div key={b.id} onClick={()=>sBrief(b.brief_content||"")} style={{padding:"12px 18px",borderBottom:"1px solid var(--border)",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,150,136,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
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
          <div style={{gridColumn:"1/-1"}}><label style={{...LB,color:"#00B89C"}}>WHAT CONFIRMED OUR BELIEF</label><textarea value={dbf.confirmed} onChange={e=>setDb("confirmed",e.target.value)} rows={3} style={{...IP,borderColor:"rgba(0,184,156,0.2)"}} placeholder="Observable signals that validated our sector belief..."/></div>
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
          {d.confirmed&&<div style={{fontSize:12,color:"#00B89C",marginBottom:4}}>Confirmed: {d.confirmed.slice(0,120)}</div>}
          {d.challenged&&<div style={{fontSize:12,color:"#FF4B4B",marginBottom:4}}>Challenged: {d.challenged.slice(0,120)}</div>}
          {d.new_signal&&<div style={{fontSize:12,color:"#FFB800"}}>New: {d.new_signal.slice(0,120)}</div>}
        </div>)}</div>
      </div>}
    </div>}
  </div>);
}

function Admin({token,isA,claudeKey,elKey,onKeyChange,profile}){const[users,sU]=useState([]);const[reqs,sR]=useState([]);const[newUser,sNU]=useState(null);const[aiKey,sAIKey]=useState(claudeKey||"");const[saving,sSaving]=useState(false);const[testing,sTesting]=useState(false);const[testResult,sTR]=useState("");
useEffect(()=>{if(!token)return;q("/rest/v1/profiles?select=*&order=full_name.asc",token).then(sU).catch(()=>{});q("/rest/v1/access_requests?select=*&order=requested_at.desc",token).then(sR).catch(()=>{});},[token]);
const saveKey=async()=>{sSaving(true);try{await q("/rest/v1/system_config?config_key=eq.claude_api_key",token,{method:"PATCH",body:JSON.stringify({config_value:aiKey})});if(onKeyChange)onKeyChange(aiKey);sTR("Saved");}catch(e){sTR("Error: "+e.message);}finally{sSaving(false);}};
const testKey=async()=>{sTesting(true);sTR("");try{const d=await callClaude(aiKey,[{role:"user",content:"Say OK"}],{max_tokens:10});sTR(d.content?.[0]?.text?"Connected":"No response");}catch(e){sTR("Failed: "+e.message);}finally{sTesting(false);}};
return(<div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
    <div><div style={{...T,fontSize:22,fontWeight:800}}>User Management</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>{users.length} users · {reqs.filter(r=>r.status==="Pending").length} pending</div></div>
    <button onClick={()=>sNU({})} style={BP}><UserPlus size={14} style={{marginRight:6}}/>Create User</button>
  </div>
  {newUser&&<div style={{...CS,padding:20,marginBottom:20}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><UserPlus size={16} color="#009688"/><span style={{...T,fontSize:16,fontWeight:700}}>Create New User</span></div>
    <div style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>User will receive a password reset email to set their own password</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
      <div><label style={{...LB,color:"#009688"}}>FULL NAME</label><input placeholder="Your full name" style={IP} onChange={e=>sNU(p=>({...p,name:e.target.value}))}/></div>
      <div><label style={{...LB,color:"#009688"}}>EMAIL ADDRESS</label><input placeholder="name@humain.com" style={IP} onChange={e=>sNU(p=>({...p,email:e.target.value}))}/></div>
      <div><label style={{...LB,color:"#009688"}}>TEMPORARY PASSWORD</label><input placeholder="Minimum 8 characters" type="password" style={IP} onChange={e=>sNU(p=>({...p,pass:e.target.value}))}/></div>
      <div><label style={{...LB,color:"#009688"}}>ACCESS ROLE</label><select style={IP} onChange={e=>sNU(p=>({...p,role:e.target.value}))}><option value="member">Member</option><option value="manager">Manager</option><option value="admin">Admin</option><option value="viewer">Viewer</option></select></div>
      <div><label style={{...LB,color:"#009688"}}>DEPARTMENT</label><select style={IP} onChange={e=>sNU(p=>({...p,dept:e.target.value}))}><option value="">Select</option><option>BD</option><option>Marketing</option><option>Executive</option><option>Engineering</option><option>Operations</option></select></div>
      <div><label style={{...LB,color:"#009688"}}>PRIMARY SECTOR FOCUS</label><select style={IP} onChange={e=>sNU(p=>({...p,sector:e.target.value}))}><option value="">All sectors</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select></div>
    </div>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><button onClick={()=>sNU(null)} style={BG}>Cancel</button><button onClick={async()=>{if(!newUser.name||!newUser.email||!newUser.pass){alert("Fill all required fields");return;}try{const r=await fetch(SU+"/auth/v1/admin/users",{method:"POST",headers:{apikey:SK,"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({email:newUser.email,password:newUser.pass,email_confirm:true,user_metadata:{full_name:newUser.name}})});if(!r.ok)throw new Error((await r.json()).msg||"Failed");sNU(null);q("/rest/v1/profiles?select=*&order=full_name.asc",token).then(sU).catch(()=>{});}catch(e){alert(e.message);}}} style={BP}>Create User</button></div>
  </div>}
  <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>TEAM MEMBERS</div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280,1fr))",gap:12,marginBottom:24}}>
    {users.map(u=><div key={u.id} style={{...CS,padding:"16px 18px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#009688,#00B89C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>{(u.full_name||u.email||"?")[0].toUpperCase()}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.full_name||"—"}</div>
          <div style={{...M,fontSize:10,color:"var(--muted)"}}>{u.email}</div>
        </div>
        {u.id===profile?.id&&<span style={{...M,fontSize:8,color:"#5B7A0F",padding:"2px 6px",background:"rgba(90,122,0,0.08)",borderRadius:8}}>YOU</span>}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <select value={u.role||"member"} onChange={async(e)=>{const nr=e.target.value;try{await q("/rest/v1/profiles?id=eq."+u.id,token,{method:"PATCH",body:JSON.stringify({role:nr})});sU(p=>p.map(x=>x.id===u.id?{...x,role:nr}:x));}catch(ex){alert(ex.message);}}} style={{...M,fontSize:10,padding:"3px 8px",borderRadius:999,background:u.role==="admin"?"rgba(208,249,74,0.1)":"rgba(0,150,136,0.06)",color:u.role==="admin"?"#5B7A0F":"#009688",border:"none",cursor:"pointer"}}><option value="admin">Admin</option><option value="manager">Manager</option><option value="member">Member</option><option value="viewer">Viewer</option></select>
        <select value={u.team||""} onChange={async(e)=>{try{await q("/rest/v1/profiles?id=eq."+u.id,token,{method:"PATCH",body:JSON.stringify({team:e.target.value})});sU(p=>p.map(x=>x.id===u.id?{...x,team:e.target.value}:x));}catch(ex){}}} style={{...M,fontSize:10,padding:"3px 8px",borderRadius:999,border:"1px solid var(--border)",background:"transparent",color:"var(--sub)",cursor:"pointer"}}><option value="">Team</option><option>Executive</option><option>BD</option><option>Marketing</option><option>Engineering</option></select>
        <span style={{...M,fontSize:9,color:"var(--muted)",marginLeft:"auto"}}>{u.last_seen?new Date(u.last_seen).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"Never"}</span>
      </div>
    </div>)}
  </div>
  {reqs.filter(r=>r.status==="Pending").length>0&&<><div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>PENDING REQUESTS</div><div style={{...CS,marginBottom:24}}>{reqs.filter(r=>r.status==="Pending").map(r=><div key={r.id} style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,fontSize:13}}>{r.full_name}</div><div style={{fontSize:12,color:"var(--sub)"}}>{r.email} · {r.department||"—"}</div></div><div style={{display:"flex",gap:6}}><button onClick={async()=>{try{await q("/rest/v1/access_requests?id=eq."+r.id,token,{method:"PATCH",body:JSON.stringify({status:"Approved"})});sR(p=>p.map(x=>x.id===r.id?{...x,status:"Approved"}:x));}catch(e){alert(e.message);}}} style={{...BP,padding:"4px 10px",fontSize:10}}>Approve</button><button onClick={async()=>{try{await q("/rest/v1/access_requests?id=eq."+r.id,token,{method:"PATCH",body:JSON.stringify({status:"Rejected"})});sR(p=>p.map(x=>x.id===r.id?{...x,status:"Rejected"}:x));}catch(e){alert(e.message);}}} style={{...BG,padding:"4px 10px",fontSize:10,color:"#FF4B4B"}}>Reject</button></div></div>)}</div></>}
  <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>AI CONFIGURATION</div>
  <div style={{...CS,padding:20,marginBottom:20}}>
    <div style={{fontSize:13,color:"var(--sub)",marginBottom:12}}>Your Claude API key is stored securely in the database. It is never exposed in source code.</div>
    <div style={{display:"flex",gap:10,alignItems:"center"}}>
      <input value={aiKey} onChange={e=>sAIKey(e.target.value)} placeholder="sk-ant-api03-..." style={{...IP,flex:1,fontFamily:"'DM Mono',monospace",fontSize:11}} type="password"/>
      <button onClick={saveKey} disabled={saving} style={{...BP,padding:"9px 16px"}}>{saving?"Saving...":"Save Key"}</button>
      <button onClick={testKey} disabled={testing} style={{...BG,padding:"9px 16px"}}>{testing?"Testing...":"Test"}</button>
    </div>
    {testResult&&<div style={{...M,fontSize:10,color:testResult.includes("Connected")||testResult==="Saved"?"#00B89C":"#FF4B4B",marginTop:8}}>{testResult}</div>}
  </div>
  <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>VOICE CONFIGURATION</div>
  <div style={{...CS,padding:20,marginBottom:20}}>
    <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6}}>Voice input uses browser-native speech recognition (no API key needed). ElevenLabs provides premium text-to-speech output. Key is stored in system_config table.</div>
  </div>
  <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>KNOWLEDGE BASE</div>
  <div style={{...CS,padding:20}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div><div style={{fontSize:14,fontWeight:700,marginBottom:2}}>Embedded Knowledge</div><div style={{fontSize:12,color:"var(--sub)"}}>Framework and Engagement OS are loaded as native React components. Content is injected into every AI prompt — Claude references beliefs, principles, and tactics in all responses.</div></div>
    </div>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1,padding:"12px 16px",background:"var(--panel2)",borderRadius:8,border:"1px solid var(--border)"}}>
        <div style={{...M,fontSize:9,color:"#009688",marginBottom:4}}>THE FRAMEWORK</div>
        <div style={{fontSize:12,color:"var(--sub)"}}>Sector beliefs, 5-stage progression, 8 principles, irreversibility conditions</div>
      </div>
      <div style={{flex:1,padding:"12px 16px",background:"var(--panel2)",borderRadius:8,border:"1px solid var(--border)"}}>
        <div style={{...M,fontSize:9,color:"#00B89C",marginBottom:4}}>ENGAGEMENT OS</div>
        <div style={{fontSize:12,color:"var(--sub)"}}>Sector entry guides, meeting toolkit, signal decoder, cross-sell logic</div>
      </div>
    </div>
  </div>
</div>);}

function DailyIntel({deals,profile,open,onClose}){
  const ac=deals.filter(d=>d.status==="Active");const stale=ac.filter(d=>d.updated_at&&(Date.now()-new Date(d.updated_at).getTime())>10*86400000);
  const todayMtgs=ac.filter(d=>d.next_meeting===new Date().toISOString().slice(0,10));
  const sectors=[...new Set(ac.map(d=>d.sector).filter(Boolean))];
  const pv=ac.reduce((s,d)=>s+(d.expected_value||0),0);
  return(<div style={{position:"fixed",top:0,right:open?0:-420,width:400,bottom:0,background:"var(--panel)",borderLeft:"1px solid var(--border)",zIndex:200,transition:"right .35s cubic-bezier(0.16,1,0.3,1)",display:"flex",flexDirection:"column",boxShadow:open?"-8px 0 32px rgba(0,0,0,0.1)":"none"}}>
    <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Activity size={16} color="#00B89C"/><span style={{...T,fontSize:16,fontWeight:700}}>Daily Intelligence</span></div><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><X size={16}/></button></div>
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{...M,fontSize:9,color:"var(--muted)"}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</span></div>
      <div style={{borderLeft:"3px solid #00B89C",padding:"12px 16px",background:"rgba(0,184,156,0.03)",borderRadius:"0 10px 10px 0",marginBottom:16}}>
        <div style={{...M,fontSize:9,letterSpacing:"0.1em",color:"#00B89C",marginBottom:4}}>PIPELINE SNAPSHOT</div>
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
      <div style={{borderLeft:"3px solid #009688",padding:"12px 16px",background:"rgba(0,150,136,0.03)",borderRadius:"0 10px 10px 0",marginBottom:16}}>
        <div style={{...M,fontSize:9,letterSpacing:"0.1em",color:"#009688",marginBottom:4}}>SECTOR COVERAGE</div>
        {SECTORS.map(s=>{const c=ac.filter(d=>d.sector===s).length;return c>0?<div key={s} style={{fontSize:12,color:"var(--sub)",padding:"3px 0"}}>{s}: {c} deals</div>:null;})}
        {SECTORS.filter(s=>!ac.some(d=>d.sector===s)).length>0&&<div style={{fontSize:11,color:"#FFB800",marginTop:4}}>Gap: {SECTORS.filter(s=>!ac.some(d=>d.sector===s)).join(", ")}</div>}
      </div>
    </div>
  </div>);
}


function NotifPanel({open,onClose,requests,token,onRefresh}){
  const markRead=async(id)=>{try{await q(`/rest/v1/access_requests?id=eq.${id}`,token,{method:"PATCH",body:JSON.stringify({status:"Reviewed"})});if(onRefresh)onRefresh();}catch(e){}};
  return(<div style={{position:"fixed",top:0,right:open?0:-400,width:380,bottom:0,background:"var(--panel)",borderLeft:"1px solid var(--border)",zIndex:250,transition:"right .35s cubic-bezier(0.16,1,0.3,1)",display:"flex",flexDirection:"column",boxShadow:open?"-8px 0 32px rgba(0,0,0,0.1)":"none"}}>
    <div style={{padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Bell size={16} color="#009688"/><span style={{...T,fontSize:16,fontWeight:700}}>Notifications</span></div><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><X size={16}/></button></div>
    <div style={{flex:1,overflowY:"auto"}}>
      {requests.filter(r=>r.status==="Pending").map(r=><div key={r.id} style={{padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#009688,#00B89C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{(r.full_name||"?")[0]}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{r.full_name}</div><div style={{fontSize:12,color:"var(--sub)",marginTop:2}}>Requested access · {r.department||"—"}</div><div style={{...M,fontSize:10,color:"var(--muted)",marginTop:4}}>{r.requested_at?new Date(r.requested_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"—"}</div></div>
        <button onClick={()=>markRead(r.id)} style={{...M,fontSize:9,padding:"3px 8px",borderRadius:999,border:"1px solid var(--border)",background:"none",color:"var(--muted)",cursor:"pointer"}}>Dismiss</button>
      </div>)}
      {requests.filter(r=>r.status==="Pending").length===0&&<div style={{padding:40,textAlign:"center",color:"var(--muted)",fontSize:13}}>No pending notifications</div>}
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
      <div><div style={{...M,fontSize:9,color:"#00B89C",marginBottom:4}}>OUR BELIEF</div><div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6}}>{b.belief}</div></div>
    </div>}
  </div>);
}
const PH=({label,icon:I})=><div style={{textAlign:"center",paddingTop:80}}><I size={32} style={{color:"var(--muted)",opacity:0.3,marginBottom:12}}/><div style={{...T,fontSize:20,fontWeight:700,marginBottom:6}}>{label}</div><div style={{...M,fontSize:11,color:"var(--muted)",letterSpacing:"0.1em"}}>STAGING — COMING SOON</div></div>;

export default function App(){
  const[session,sS]=useState(null);const[profile,sP]=useState(null);const[deals,sD]=useState([]);const[tab,sT]=useState("home");const[dark,sDk]=useState(false);const[modal,sM]=useState(null);const[search,sSr]=useState("");const[srO,sSrO]=useState(false);const[dealFilter,sDealFilter]=useState("");const[stageFilter,setStageFilter]=useState("");const[statusFilter,setStatusFilter]=useState("");const[dealSort,sDealSort]=useState("updated");const[chatActive,sChatActive]=useState(false);const[homeCat,sHomeCat]=useState("foryou");const[dashPeriod,sDashPeriod]=useState("all");const[notif,sN]=useState(0);const[intel,sIntel]=useState(false);const[notifOpen,sNotifOpen]=useState(false);const[accessReqs,sAR]=useState([]);const[elKey,sElKey]=useState('');const[claudeKey,sCK]=useState('');
  const tk=session?.access_token;const isA=profile?.role==="admin";
  const[leads,sLeads]=useState([]);const[assets,sAssets]=useState([]);const[debriefs,sDeb]=useState([]);const[suggestions,sSugg]=useState([]);const[savedBriefs2,sSB2]=useState([]);
  const ld=useCallback(()=>{if(tk){q("/rest/v1/deals?select=*&order=updated_at.desc",tk).then(d=>sD(d||[])).catch(console.error);q("/rest/v1/leads?select=*&order=created_at.desc",tk).then(d=>sLeads(d||[])).catch(()=>{});q("/rest/v1/content_assets?select=*&order=created_at.desc",tk).then(d=>sAssets(d||[])).catch(()=>{});q("/rest/v1/debriefs?select=*&order=created_at.desc&limit=20",tk).then(d=>sDeb(d||[])).catch(()=>{});q('/rest/v1/agent_queue?status=eq.pending&select=*&order=created_at.desc&limit=8',tk).then(d=>sSugg(d||[]));q('/rest/v1/access_requests?select=*&order=requested_at.desc&limit=20',tk).then(d=>sAR(d||[])).then(d=>sSugg(d||[])).catch(()=>{});q('/rest/v1/briefs?select=id,client_name,sector&order=created_at.desc&limit=10',tk).then(d=>sSB2(d||[])).catch(()=>{});}},[tk]);
  useEffect(()=>{if(!tk)return;const uid=session.user?.id;q('/rest/v1/system_config?config_key=eq.elevenlabs_api_key&select=config_value',tk).then(d=>{if(d?.[0]?.config_value)sElKey(d[0].config_value.trim());}).catch(()=>{});q('/rest/v1/system_config?config_key=eq.claude_api_key&select=config_value',tk).then(d=>{if(d?.[0]?.config_value)sCK(d[0].config_value.replace(/\u2014/g,'--').replace(/[^\x20-\x7E]/g,'').trim());}).catch(()=>{});q(`/rest/v1/profiles?id=eq.${uid}&select=*`,tk).then(d=>{if(d?.[0])sP(d[0]);}).catch(console.error);ld();},[tk]);
  // Poll notifications
  useEffect(()=>{if(!tk||!isA)return;const poll=()=>q("/rest/v1/access_requests?status=eq.Pending&select=id",tk).then(d=>{const n=d?.length||0;sN(n);if(n>0&&document.hidden)document.title="("+n+") COMPASS Staging";else document.title="COMPASS Staging";}).catch(()=>{});poll();const iv=setInterval(poll,60000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)document.title="COMPASS Staging";});return()=>clearInterval(iv);},[tk,isA]);
  
  // Session idle timeout
  const[idleWarn,sIdleWarn]=useState(false);const[tourStep,sTourStep]=useState(-1);
  // Toast notification system
  const[toast,sToast]=useState(null);
  const showToast=(msg,type)=>{sToast({msg,type});setTimeout(()=>sToast(null),5000);};const idleRef=useRef(null);const warnRef=useRef(null);
  useEffect(()=>{if(!tk)return;
    const reset=()=>{clearTimeout(idleRef.current);clearTimeout(warnRef.current);sIdleWarn(false);
      idleRef.current=setTimeout(()=>{sIdleWarn(true);warnRef.current=setTimeout(()=>{sS(null);sP(null);sD([]);},60000);},15*60*1000);};
    const events=["mousedown","keydown","scroll","touchstart"];events.forEach(e=>window.addEventListener(e,reset));reset();
    return()=>{events.forEach(e=>window.removeEventListener(e,reset));clearTimeout(idleRef.current);clearTimeout(warnRef.current);};
  },[tk]);
  // Inject CSS animations
  useEffect(()=>{const s=document.createElement("style");s.textContent="@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)}}";document.head.appendChild(s);return()=>s.remove();},[]);
  // Agent auto-run timer — hourly agents every 60 min
  useEffect(()=>{if(!tk)return;
    const hourlyAgents=async()=>{if(!deals||deals.length===0){console.log("[COMPASS] Skipping agent run — no deals loaded yet");return;}console.log("[COMPASS] Running hourly agents...");
      try{await runPipelineGuardian(tk,deals);await runDealScorer(tk,deals);await runFollowThrough(tk,deals);await runLeadNurture(tk,leads||[]);await runContentGap(tk,deals,assets||[]);
      ld();console.log("[COMPASS] Hourly agents complete");}catch(e){console.warn("Agent run error:",e);}};
    const timer=setTimeout(()=>hourlyAgents(),5000);
    const iv=setInterval(hourlyAgents,60*60*1000);
    return()=>{clearTimeout(timer);clearInterval(iv);}
  },[tk,deals.length]);

  const th=dark?{"--bg":"#0D1B1E","--panel":"#111F22","--panel2":"#162629","--card-bg":"#162629","--text":"#E8F0F0","--sub":"#8AA0A6","--muted":"#5A7278","--dim":"#4A6268","--border":"rgba(255,255,255,0.08)"}:{"--bg":"#FAFAFA","--panel":"#FFFFFF","--panel2":"rgba(0,0,0,0.03)","--card-bg":"#FFFFFF","--text":"#1A1A1A","--sub":"#555","--muted":"#8A9BAA","--dim":"#6B8088","--border":"rgba(0,0,0,0.08)"};
  if(!session)return<Auth onLogin={sS}/>;
  const nm=profile?.full_name||session.user?.email?.split("@")[0]||"User";const hr=new Date().getHours();const gr=hr<12?"Good Morning":hr<17?"Good Afternoon":"Good Evening";const ac=deals.filter(d=>d.status==="Active");const pv=ac.reduce((s,d)=>s+(d.expected_value||0),0);const wo=deals.filter(d=>d.status==="Won");const sr=search?(()=>{const s=search.toLowerCase();const r=[];
    deals.filter(d=>(d.client_name||"").toLowerCase().includes(s)).slice(0,4).forEach(d=>r.push({type:"Deal",name:d.client_name,sub:d.sector+" · "+d.stage,deal:d}));
    leads.filter(l=>(l.name||"").toLowerCase().includes(s)||(l.organization||"").toLowerCase().includes(s)).slice(0,3).forEach(l=>r.push({type:"Lead",name:l.name,sub:(l.organization||"")+" · "+l.status}));
    debriefs.filter(d=>(d.client_name||"").toLowerCase().includes(s)).slice(0,3).forEach(d=>r.push({type:"Debrief",name:d.client_name,sub:d.sector||""}));
    savedBriefs2.filter(b=>(b.client_name||"").toLowerCase().includes(s)).slice(0,2).forEach(b=>r.push({type:"Brief",name:b.client_name,sub:b.sector||""}));
    return r.slice(0,10);})():[];

  const renderTab=()=>{switch(tab){
    case"home":{const todayStr=new Date().toISOString().slice(0,10);const todayMtgs=ac.filter(d=>d.next_meeting===todayStr);const pendingActs=suggestions.length;const readyLeads=leads.filter(l=>l.status==="Hot"||l.status==="Ready").length;
return(<div>
  <div style={{marginBottom:20}}>
    <div style={{...T,fontSize:26,fontWeight:800,letterSpacing:"-0.02em",marginBottom:4}}>{gr}, {nm.split(" ")[0]}</div>
    <div style={{fontSize:14,color:"var(--sub)"}}>{todayMtgs.length>0?todayMtgs.length+" meeting"+(todayMtgs.length>1?"s":"")+" today. ":""}{pendingActs>0?pendingActs+" agent actions pending.":"Your pipeline is clear."}</div>
  </div>
  <Chat deals={deals} profile={profile} elKey={elKey} claudeKey={claudeKey} token={tk} onDealCreated={ld} onChatActive={sChatActive}/>
  {!chatActive&&<div style={{display:"flex",alignItems:"center",gap:8,margin:"16px 0 12px"}}><div style={{width:6,height:6,borderRadius:8,background:"#00B89C"}}/><span style={{...M,fontSize:10,color:"var(--sub)"}}>{AGENTS.length} agents active</span><span style={{...M,fontSize:10,color:"#FFB800"}}>{pendingActs} actions pending</span></div>}
  {!chatActive&&<div style={{display:"flex",gap:6,marginBottom:16}}>{[{id:"foryou",label:"For you"},{id:"pipeline",label:"Pipeline"},{id:"intelligence",label:"Intelligence"},{id:"marketing",label:"Marketing"}].map(cat=><button key={cat.id} onClick={()=>sHomeCat(cat.id)} style={{...M,fontSize:10,padding:"6px 14px",borderRadius:8,border:"1px solid var(--border)",background:homeCat===cat.id?"rgba(0,150,136,0.06)":"transparent",color:homeCat===cat.id?"#009688":"var(--muted)",cursor:"pointer"}}>{cat.label}</button>)}</div>}
  {suggestions.length>0&&!chatActive&&<div style={{marginBottom:20}}>
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {suggestions.slice(0,4).map(s=>{const prioColor=s.priority==="critical"?"#FF4B4B":s.priority==="high"?"#FFB800":"#009688";return(
        <div key={s.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:10,cursor:"pointer"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,150,136,0.2)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";}}>
          <div style={{width:6,height:6,borderRadius:8,background:prioColor,flexShrink:0,marginTop:6}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div>
            <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{(s.suggested_action||s.description||"").slice(0,120)}</div>
          </div>
          <div style={{...M,fontSize:9,color:prioColor,flexShrink:0,padding:"2px 6px",borderRadius:8,background:prioColor+"10"}}>{s.agent_name}</div>
        </div>);})}
    </div>
  </div>}
  {!chatActive&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
    <KPI v={ac.length} l="ACTIVE DEALS" c="#009688"/>
    <KPI v={"SAR "+(pv/1e6).toFixed(1)+"M"} l="PIPELINE" c="#00B89C"/>
    <KPI v={pendingActs} l="AGENT ACTIONS" c="#FFB800"/>
    <KPI v={readyLeads} l="READY LEADS" c="#5B7A0F"/>
  </div>}
  {!chatActive&&<div style={{textAlign:"center",padding:"12px 0 0",...M,fontSize:9,color:"var(--muted)",letterSpacing:"0.08em"}}>HUMAIN COMPASS V2.0 — 12 AGENTS · 5 SECTORS · SOVEREIGN AI</div>}
</div>);}
    case"crm":return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div><div style={{...T,fontSize:22,fontWeight:800}}>Pipeline</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>{ac.length} active · SAR {pv.toLocaleString()}</div></div><button onClick={()=>sM({deal:null})} style={BP}><Plus size={14} style={{marginRight:6}}/>New Deal</button></div>
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}><select value={dealFilter} onChange={e=>sDealFilter(e.target.value)} style={{...IP,width:"auto",padding:"6px 10px",fontSize:11}}><option value="">All Sectors</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select><select value={stageFilter} onChange={e=>setStageFilter(e.target.value)} style={{...IP,width:"auto",padding:"6px 10px",fontSize:11}}><option value="">All Stages</option>{STAGES.map(s=><option key={s}>{s}</option>)}</select><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{...IP,width:"auto",padding:"6px 10px",fontSize:11}}><option value="">All Status</option><option>Active</option><option>Won</option><option>Lost</option><option>Stalled</option></select><select value={dealSort} onChange={e=>sDealSort(e.target.value)} style={{...IP,width:"auto",padding:"6px 10px",fontSize:11}}><option value="updated">Recently Updated</option><option value="value_desc">Value High-Low</option><option value="value_asc">Value Low-High</option><option value="name">Name A-Z</option><option value="score">Score High-Low</option></select></div><Kanban deals={deals} onOpen={d=>sM({deal:d})}/><div style={{...M,fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",marginBottom:10}}>ALL DEALS ({deals.length})</div><div style={CS}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Client","Sector","Stage","Value","Score"].map(h=><th key={h} style={{...M,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{(()=>{let fd=[...deals];if(dealFilter)fd=fd.filter(d=>d.sector===dealFilter);if(stageFilter)fd=fd.filter(d=>d.stage===stageFilter);if(statusFilter)fd=fd.filter(d=>d.status===statusFilter);if(dealSort==="value_desc")fd.sort((a,b)=>(b.expected_value||0)-(a.expected_value||0));else if(dealSort==="value_asc")fd.sort((a,b)=>(a.expected_value||0)-(b.expected_value||0));else if(dealSort==="name")fd.sort((a,b)=>(a.client_name||"").localeCompare(b.client_name||""));else if(dealSort==="score")fd.sort((a,b)=>(b.deal_score||0)-(a.deal_score||0));return fd;})().slice(0,60).map(d=><tr key={d.id} style={{borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>sM({deal:d})} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,150,136,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 14px",fontWeight:600}}>{d.client_name}</td><td style={{padding:"10px 14px",color:"var(--sub)"}}>{d.sector||"—"}</td><td style={{padding:"10px 14px"}}><span style={{...M,fontSize:10,padding:"3px 8px",borderRadius:999,background:`${SC[d.stage]||"#999"}12`,color:SC[d.stage]||"#999"}}>{d.stage}</span></td><td style={{padding:"10px 14px",...M,color:"var(--sub)"}}>{d.expected_value>0?`SAR ${Number(d.expected_value).toLocaleString()}`:"—"}</td><td style={{padding:"10px 14px",...M,color:d.deal_score>=70?"#00B89C":d.deal_score>=40?"#FFB800":"var(--muted)"}}>{d.deal_score||"—"}</td></tr>)}</tbody></table></div></div>);
    case"dashboard":{const wv=ac.reduce((s,d)=>s+((d.expected_value||0)*(d.probability||0)/100),0);const wonV=wo.reduce((s,d)=>s+(d.expected_value||0),0);const lo=deals.filter(d=>d.status==="Lost");const st=deals.filter(d=>d.status==="Stalled"||d.status==="Active"&&d.updated_at&&(Date.now()-new Date(d.updated_at).getTime())>14*86400000);const avgCycle=wo.length>0?Math.round(wo.reduce((s,d)=>{const created=new Date(d.created_at||Date.now());const updated=new Date(d.updated_at||Date.now());return s+((updated-created)/86400000);},0)/wo.length):0;const prods={};ac.forEach(d=>{(d.tags||"").split(",").map(t=>t.trim()).filter(Boolean).forEach(t=>{if(!prods[t])prods[t]={count:0,value:0};prods[t].count++;prods[t].value+=(d.expected_value||0);});});
return(<div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
    <div><div style={{...T,fontSize:22,fontWeight:800}}>Dashboard & Reporting</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>Pipeline analytics, sector intelligence, and deal velocity.</div></div>
    <div style={{display:"flex",gap:8,alignItems:"center"}}><button onClick={()=>{const rows=[["Client","Sector","Stage","Status","Value","Score","Contact","Next Step","Updated"],...deals.map(d=>[d.client_name,d.sector,d.stage,d.status,d.expected_value||0,d.deal_score||0,d.contact_name||"",d.next_step||"",d.updated_at||""])];const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n");const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="compass_pipeline_"+new Date().toISOString().slice(0,10)+".csv";a.click();}} style={{...BG,padding:"8px 14px",fontSize:11}}>Export CSV</button>
    <div style={{display:"inline-flex",borderRadius:8,overflow:"hidden",border:"1px solid var(--border)"}}>{[{id:"all",label:"All Time"},{id:"90",label:"90 Days"},{id:"30",label:"30 Days"},{id:"7",label:"7 Days"}].map(p=><button key={p.id} onClick={()=>sDashPeriod(p.id)} style={{padding:"6px 14px",border:"none",fontSize:11,...M,cursor:"pointer",background:dashPeriod===p.id?"#009688":"var(--card-bg)",color:dashPeriod===p.id?"#fff":"var(--muted)"}}>{p.label}</button>)}</div></div>
  </div>
  {isA&&<div style={{...CS,padding:20,marginBottom:20,border:"1px solid rgba(90,122,0,0.15)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{display:"flex",alignItems:"center",gap:8}}><Shield size={14} color="#5B7A0F"/><span style={{...M,fontSize:10,letterSpacing:"0.1em",color:"#5B7A0F"}}>EXECUTIVE SUMMARY</span></div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:16}}>
      <div style={{padding:10,background:"var(--panel2)",borderRadius:8,textAlign:"center"}}><div style={{...T,fontSize:18,fontWeight:800,color:"#009688"}}>SAR {(pv/1e6).toFixed(1)}M</div><div style={{...M,fontSize:8,color:"var(--muted)",marginTop:2}}>PIPELINE</div></div>
      <div style={{padding:10,background:"var(--panel2)",borderRadius:8,textAlign:"center"}}><div style={{...T,fontSize:18,fontWeight:800,color:"#00B89C"}}>SAR {(wv/1e6).toFixed(1)}M</div><div style={{...M,fontSize:8,color:"var(--muted)",marginTop:2}}>WEIGHTED</div></div>
      <div style={{padding:10,background:"var(--panel2)",borderRadius:8,textAlign:"center"}}><div style={{...T,fontSize:18,fontWeight:800,color:"#5B7A0F"}}>SAR {(wonV/1e6).toFixed(1)}M</div><div style={{...M,fontSize:8,color:"var(--muted)",marginTop:2}}>WON</div></div>
      <div style={{padding:10,background:"var(--panel2)",borderRadius:8,textAlign:"center"}}><div style={{...T,fontSize:18,fontWeight:800}}>{deals.length?Math.round(wo.length/deals.length*100):0}%</div><div style={{...M,fontSize:8,color:"var(--muted)",marginTop:2}}>WIN RATE</div></div>
      <div style={{padding:10,background:"var(--panel2)",borderRadius:8,textAlign:"center"}}><div style={{...T,fontSize:18,fontWeight:800}}>{avgCycle}D</div><div style={{...M,fontSize:8,color:"var(--muted)",marginTop:2}}>AVG CYCLE</div></div>
      <div style={{padding:10,background:"var(--panel2)",borderRadius:8,textAlign:"center"}}><div style={{...T,fontSize:18,fontWeight:800,color:pv>=10000000?"#00B89C":"#FFB800"}}>{wv>=5000000?"HEALTHY":"AT RISK"}</div><div style={{...M,fontSize:8,color:"var(--muted)",marginTop:2}}>PIPELINE HEALTH</div></div>
    </div>
  </div>}
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
    <div style={{...CS,padding:20}}>
      <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:14}}>PIPELINE FUNNEL</div>
      {STAGES.map(s=>{const cnt=ac.filter(d=>d.stage===s).length;const val=ac.filter(d=>d.stage===s).reduce((x,d)=>x+(d.expected_value||0),0);const pct=ac.length?Math.round(cnt/ac.length*100):0;return(
        <div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <span style={{...M,fontSize:10,width:80,flexShrink:0,color:"var(--sub)"}}>{s}</span>
          <div style={{flex:1,height:24,background:"var(--panel2)",borderRadius:8,overflow:"hidden",position:"relative"}}>
            <div style={{width:pct+"%",height:"100%",background:SC[s],borderRadius:8,display:"flex",alignItems:"center",paddingLeft:6}}>
              {cnt>0&&<span style={{...M,fontSize:9,color:"#fff",fontWeight:600}}>{cnt}</span>}
            </div>
          </div>
          <span style={{...M,fontSize:9,color:"var(--muted)",width:60,textAlign:"right"}}>SAR {(val/1e6).toFixed(1)}M</span>
        </div>);})}
    </div>
    <div style={{...CS,padding:20}}>
      <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:14}}>SECTOR MIX</div>
      {SECTORS.map(s=>{const cnt=deals.filter(d=>d.sector===s).length;const pct=deals.length?Math.round(cnt/deals.length*100):0;return(
        <div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:10,height:10,borderRadius:8,background:XC[s],flexShrink:0}}/>
          <span style={{fontSize:12,flex:1}}>{s}</span>
          <div style={{width:60,height:6,background:"var(--panel2)",borderRadius:8,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:XC[s],borderRadius:8}}/></div>
          <span style={{...M,fontSize:10,color:"var(--muted)",width:20,textAlign:"right"}}>{cnt}</span>
        </div>);})}
    </div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
    <div style={{...CS,padding:20}}>
      <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:14}}>WIN RATE BY SECTOR</div>
      {SECTORS.map(s=>{const total=deals.filter(d=>d.sector===s).length;const won2=deals.filter(d=>d.sector===s&&d.status==="Won").length;const rate=total?Math.round(won2/total*100):0;return(
        <div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{...M,fontSize:10,color:XC[s],width:90,flexShrink:0}}>{s}</span>
          <div style={{flex:1,height:6,background:"var(--panel2)",borderRadius:8,overflow:"hidden"}}><div style={{width:rate+"%",height:"100%",background:XC[s],borderRadius:8}}/></div>
          <span style={{...M,fontSize:10,color:"var(--muted)",width:30,textAlign:"right"}}>{rate}%</span>
        </div>);})}
    </div>
    <div style={{...CS,padding:20}}>
      <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:14}}>PRODUCT PIPELINE</div>
      {Object.entries(prods).sort((a,b)=>b[1].value-a[1].value).slice(0,8).map(([name,data])=>(
        <div key={name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:12,fontWeight:600,flex:1}}>{name}</span>
          <span style={{...M,fontSize:10,color:"#009688"}}>{data.count} deal{data.count>1?"s":""}</span>
          <span style={{...M,fontSize:10,color:"var(--muted)"}}>SAR {(data.value/1e6).toFixed(1)}M</span>
        </div>))}
      {Object.keys(prods).length===0&&<div style={{fontSize:12,color:"var(--muted)",textAlign:"center",padding:12}}>Tag deals with products to see breakdown</div>}
    </div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
    <div style={{...CS,padding:16,textAlign:"center"}}><div style={{...T,fontSize:22,fontWeight:800,color:"#009688"}}>{ac.length}</div><div style={{...M,fontSize:9,color:"var(--muted)"}}>ACTIVE</div></div>
    <div style={{...CS,padding:16,textAlign:"center"}}><div style={{...T,fontSize:22,fontWeight:800,color:"#00B89C"}}>{wo.length}</div><div style={{...M,fontSize:9,color:"var(--muted)"}}>WON</div></div>
    <div style={{...CS,padding:16,textAlign:"center"}}><div style={{...T,fontSize:22,fontWeight:800,color:"#FF4B4B"}}>{lo.length}</div><div style={{...M,fontSize:9,color:"var(--muted)"}}>LOST</div></div>
    <div style={{...CS,padding:16,textAlign:"center"}}><div style={{...T,fontSize:22,fontWeight:800,color:"#FFB800"}}>{st.length}</div><div style={{...M,fontSize:9,color:"var(--muted)"}}>STALLED</div></div>
  </div>
  <div style={{...CS,padding:20,marginBottom:20}}>
    <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:14}}>MONTHLY DEAL CREATION</div>
    {(()=>{const months=[];const now=new Date();for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push({label:d.toLocaleDateString("en-GB",{month:"short"}),count:deals.filter(dl=>{const cd=new Date(dl.created_at||dl.updated_at);return cd.getMonth()===d.getMonth()&&cd.getFullYear()===d.getFullYear();}).length});}const maxM=Math.max(...months.map(m=>m.count),1);return(
      <div style={{display:"flex",alignItems:"flex-end",gap:10,height:80}}>
        {months.map(m=><div key={m.label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{...M,fontSize:9,color:"var(--muted)"}}>{m.count}</span>
          <div style={{width:"100%",background:"#009688",borderRadius:8,height:Math.max(m.count/maxM*60,4)}}/>
          <span style={{...M,fontSize:8,color:"var(--muted)"}}>{m.label}</span>
        </div>)}
      </div>);})()}
  </div>
  {st.length>0&&<div style={{...CS,padding:20}}>
    <div style={{...M,fontSize:10,letterSpacing:"0.1em",color:"#FF4B4B",marginBottom:10}}>NEEDS ATTENTION</div>
    {st.slice(0,5).map(d=><div key={d.id} onClick={()=>sM({deal:d})} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}}><span style={{fontWeight:600,fontSize:13}}>{d.client_name}</span><span style={{...M,fontSize:10,color:"#FF4B4B"}}>{Math.round((Date.now()-new Date(d.updated_at).getTime())/86400000)}d</span></div>)}
  </div>}
</div>);}
    case"agents":return<AgentsTab token={tk} deals={deals} leads={leads} assets={assets} debriefs={debriefs} onRefresh={ld} claudeKey={claudeKey} onOpenDeal={(did)=>{const d=deals.find(x=>x.id===did);if(d)sM({deal:d});}}/>;
    case"meetings":return<Meetings deals={deals} profile={profile} token={tk} elKey={elKey} claudeKey={claudeKey}/>;
    case"marketing":return<Marketing token={tk} claudeKey={claudeKey}/>;
    case"admin":return<Admin token={tk} isA={isA} claudeKey={claudeKey} elKey={elKey} onKeyChange={(k)=>sCK(k)} profile={profile}/>
    case"framework":return(<div>
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:24,height:2,background:"linear-gradient(90deg,#B8E636,#00B89C,#009688)",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.14em",color:"#009688"}}>THE FRAMEWORK</span></div>
  <div style={{...T,fontSize:28,fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.15,marginBottom:6}}>We don't sell AI.<br/>We close the gap between<br/>ambition and <span style={{color:"#00B89C"}}>execution</span>.</div>
  <div style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,maxWidth:540,marginBottom:28}}>Every sector in Saudi Arabia shares the same structural problem. Leadership has announced a direction. The organisation has not caught up.</div>
  <div style={{height:1,background:"linear-gradient(90deg,#B8E636,#00B89C,#009688)",marginBottom:32}}/>
  <div style={{borderLeft:"3px solid #00B89C",padding:"20px 28px",background:"rgba(0,184,156,0.012)",borderRadius:"0 12px 12px 0",marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.18em",color:"#00B89C",marginBottom:6}}>MASTER THREAD</div>
    <div style={{fontSize:14.5,color:"var(--sub)",lineHeight:1.75}}>Every sector has the same execution gap between sovereign ambition and operational reality. HUMAIN closes that gap. Not as a vendor. Not as a consultant. As the sovereign intelligence partner that stays, builds, and compounds.</div>
  </div>
  <div style={{marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>SECTION 01</div>
    <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>Sector Belief Statements</div>
    <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>Five convictions built from real sector intelligence. Click to expand.</div>
    {[{s:"Government",sub:"Cross-ministry orchestration",fear:"Losing the AI narrative while execution machinery between 193 entities stays broken.",belief:"The government proved it can transform at scale. Now they need to repeat it with AI. HUMAIN's role is trusted connective tissue.",c:"#009688"},{s:"Oil & Gas",sub:"OT/IT + domain expertise",fear:"Becoming strategically irrelevant before proving O&G companies are technology companies.",belief:"Leadership manages two simultaneous clocks: proving relevance and extracting asset value. The blockers are human and cultural.",c:"#FFB800"},{s:"Healthcare",sub:"Arabic clinical AI",fear:"Deploying AI that causes clinical harm, or losing Vision 2030 momentum during structural shift.",belief:"Every dimension is underserved: broken EHR data, no Arabic clinical AI, clinicians who won't change. HUMAIN builds the full stack.",c:"#00B89C"},{s:"Private Sector",sub:"Data foundation first",fear:"PIF competitors, Saudization mandates, CEO promises the org cannot execute.",belief:"The most exposed sector, least equipped. Blockers: legacy infrastructure, no AI talent, decisions too centralized for AI speed.",c:"#B8E636"},{s:"Sport",sub:"Ecosystem data fabric",fear:"Spending billions producing nothing sustainable. Spectacle before substance.",belief:"The answer is not more investment. It is intelligence. Connective tissue between clubs, federations, venues, academies.",c:"#FF6B6B"}].map(b=><FwAcc key={b.s} b={b}/>)}
  </div>
  <div style={{marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>SECTION 02</div>
    <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>The Five-Stage Client Progression</div>
    <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>Observed states, not declared milestones. A client is pulled to the next stage by the value of the current one.</div>
    {[{n:"Recognition",d:"Client feels understood. Our belief matched their reality. They want to continue.",c:"#8A9BAA"},{n:"Proof",d:"First visible, attributable result. Client has something to show internally. Trust earned.",c:"#FFB800"},{n:"Integration",d:"HUMAIN is embedded in a workflow. Removing us costs real effort. Dependency forming.",c:"#009688"},{n:"Dependency",d:"Client cannot operate the relevant function without HUMAIN. Saudi talent built on our systems.",c:"#00B89C"},{n:"Expansion",d:"Client pulls HUMAIN into adjacent problems. Invited into rooms never originally scoped.",c:"#5B7A0F"}].map((s,i)=><div key={s.n} style={{display:"flex",gap:16,padding:"16px 0",borderBottom:"1px solid var(--border)"}}><div style={{width:36,height:36,borderRadius:10,background:s.c+"15",display:"flex",alignItems:"center",justifyContent:"center",...T,fontSize:16,fontWeight:800,color:s.c,flexShrink:0}}>{i+1}</div><div><div style={{fontSize:15,fontWeight:700,marginBottom:3}}>{s.n}</div><div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6}}>{s.d}</div></div></div>)}
  </div>
  <div style={{marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>SECTION 03</div>
    <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>The Eight Engagement Principles</div>
    <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>The operating system of HUMAIN's client relationships.</div>
    {["Lead with the execution gap, never the product","The belief statement is the key, not the demo","Every meeting ends with an advance, not a continuation","Observable signals only. No assumptions.","The debrief is mandatory, not optional","Never create urgency that does not exist","The WhatsApp message from the CEO is the highest buying signal","Sovereignty is not a feature. It is the foundation."].map((p,i)=><div key={i} style={{padding:"14px 18px",background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:10,marginBottom:6,display:"flex",gap:12,alignItems:"flex-start"}}><span style={{...M,fontSize:10,color:"#009688",flexShrink:0,marginTop:2}}>0{i+1}</span><span style={{fontSize:14,fontWeight:600,lineHeight:1.5}}>{p}</span></div>)}
  </div>
  <div style={{marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>SECTION 04</div>
    <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>The Four Conditions of Irreversibility</div>
    <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>The goal is a client who cannot imagine operating without HUMAIN.</div>
    {[{t:"Workflow Dependency",d:"HUMAIN is embedded in a production workflow that runs daily."},{t:"Capability Dependency",d:"The client's team has built skills on HUMAIN's platform."},{t:"Sovereign Trust",d:"HUMAIN has been granted access no foreign competitor could be given."},{t:"Expanding Invitation",d:"Other departments are asking for access because of what the first achieved."}].map((c2,i)=><div key={i} style={{...CS,padding:"18px 22px",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><div style={{width:24,height:24,borderRadius:8,background:"rgba(0,150,136,0.06)",display:"flex",alignItems:"center",justifyContent:"center",...M,fontSize:10,color:"#009688"}}>{i+1}</div><span style={{fontSize:14,fontWeight:700}}>{c2.t}</span></div><div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,paddingLeft:34}}>{c2.d}</div></div>)}
    <div style={{...M,fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:12}}>All four must be true simultaneously.</div>
  </div>
</div>);
    case"engage":return(<div>
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:24,height:2,background:"linear-gradient(90deg,#B8E636,#00B89C,#009688)",borderRadius:1}}/><span style={{...M,fontSize:9,letterSpacing:"0.14em",color:"#009688"}}>ENGAGEMENT OS</span></div>
  <div style={{...T,fontSize:28,fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.15,marginBottom:6}}>Win every meeting.<br/>Not with products.<br/>With <span style={{color:"#00B89C"}}>intelligence</span>.</div>
  <div style={{fontSize:14,color:"var(--sub)",lineHeight:1.7,maxWidth:540,marginBottom:28}}>Sector-specific entry scripts, conversation flows, objection handling, follow-up architecture, and the complete tactical toolkit.</div>
  <div style={{height:1,background:"linear-gradient(90deg,#B8E636,#00B89C,#009688)",marginBottom:32}}/>
  <div style={{marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>01 — SECTOR ENTRY GUIDES</div>
    <div style={{...T,fontSize:22,fontWeight:800,marginBottom:20}}>What to say when you walk in the door</div>
    {[{s:"Government",fear:"Losing the AI narrative while 193 entities don't share data.",want:"Replicate digital transformation success with AI at national scale.",entry:"Trusted connective tissue. Name the execution gap precisely.",c:"#009688"},{s:"Oil & Gas",fear:"Two clocks: proving relevance while extracting asset value.",want:"AI teams that understand oilfields, OT/IT integration.",entry:"Speak oilfield, not algorithm. Proof in operational language.",c:"#FFB800"},{s:"Healthcare",fear:"Too fast causes harm. Too slow misses Vision 2030.",want:"Arabic clinical AI, trustworthy EHR data, governance.",entry:"Start with data quality truth. Arrive with a readiness framework.",c:"#00B89C"},{s:"Private Sector",fear:"CEO announced AI-first. Org can't execute. 81% claim, 27% adopt.",want:"Close the gap between boardroom ambition and operational readiness.",entry:"Honest diagnostic, not a pitch. Fix data first, sell AI second.",c:"#B8E636"},{s:"Sport",fear:"Historic investment, world watching if it lasts beyond star signings.",want:"Ecosystem data fabric. 2034 World Cup is a hard deadline.",entry:"Name the legitimacy tension. Sovereign intelligence connecting the ecosystem.",c:"#FF6B6B"}].map(s=><div key={s.s} style={{...CS,padding:"18px 22px",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:8,height:8,borderRadius:8,background:s.c}}/><span style={{fontSize:15,fontWeight:700}}>{s.s}</span></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}><div><div style={{...M,fontSize:9,color:"#FF4B4B",marginBottom:4}}>FEAR</div><div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{s.fear}</div></div><div><div style={{...M,fontSize:9,color:"#FFB800",marginBottom:4}}>WANT</div><div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{s.want}</div></div><div><div style={{...M,fontSize:9,color:"#00B89C",marginBottom:4}}>ENTRY</div><div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{s.entry}</div></div></div></div>)}
  </div>
  <div style={{marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>02 — MEETING TOOLKIT</div>
    <div style={{...T,fontSize:22,fontWeight:800,marginBottom:20}}>48-Hour Meeting Architecture</div>
    {[{t:"48 HOURS BEFORE",items:["Research client announcements using AI brief tool","Map all attendees: seniority, background, decision role","Prepare one Challenger-style sector insight","Load sector belief statement by memory"],c:"#009688"},{t:"2 HOURS BEFORE",items:["Check overnight news about client","Decide primary next-step ask AND fallback","Know which HUMAIN stack layer is lowest friction"],c:"#FFB800"},{t:"IN THE MEETING",items:["Lead with sector insight, not product pitch","43:57 talk-to-listen ratio","FINAL 5 MIN: Book calendar invite before leaving"],c:"#00B89C"},{t:"WITHIN 2 HOURS AFTER",items:["Follow-up email under 200 words, one specific insight","WhatsApp referencing email and a specific topic","Log meeting signals in CRM, observables only"],c:"#B8E636"}].map(p=><div key={p.t} style={{borderLeft:"3px solid "+p.c,padding:"14px 20px",background:p.c+"06",borderRadius:"0 10px 10px 0",marginBottom:10}}><div style={{...M,fontSize:9,letterSpacing:"0.12em",color:p.c,marginBottom:8}}>{p.t}</div>{p.items.map((item,j)=><div key={j} style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,padding:"3px 0",display:"flex",gap:8}}><span style={{color:p.c,flexShrink:0}}>—</span><span>{item}</span></div>)}</div>)}
  </div>
  <div style={{marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>03 — SIGNAL DECODER</div>
    <div style={{...T,fontSize:22,fontWeight:800,marginBottom:20}}>Reading the room</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
      <div style={{...CS,padding:"16px 18px"}}><div style={{...M,fontSize:9,color:"#00B89C",marginBottom:8}}>BUYING INTENT</div>{["WhatsApp connection + client follow-up","Introduction to senior stakeholders","PDPL / data localization questions","Social invite = major trust milestone"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>{s}</div>)}</div>
      <div style={{...CS,padding:"16px 18px"}}><div style={{...M,fontSize:9,color:"#FFB800",marginBottom:8}}>WATCH CAREFULLY</div>{["'We will study this' — no who/when/what","Meeting stayed social after 60+ minutes","Only junior staff, no senior path","Enthusiastic agreement, no hard questions"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>{s}</div>)}</div>
      <div style={{...CS,padding:"16px 18px"}}><div style={{...M,fontSize:9,color:"#FF4B4B",marginBottom:8}}>NO DECISION</div>{["No follow-up after 10+ days","Senior attendee distracted, left early","Three+ touchpoints, no progression"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>{s}</div>)}</div>
    </div>
  </div>
  <div style={{marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>04 — CROSS-SELL LOGIC</div>
    <div style={{...T,fontSize:22,fontWeight:800,marginBottom:20}}>Clients pull HUMAIN forward</div>
    {[{t:"Visible Result Trigger",d:"Client achieves measurable outcome. Leadership asks what else is possible.",a:"Core → Compute"},{t:"Trust Threshold Trigger",d:"Relationship deep enough for honest conversation about a new problem.",a:"Compute → Intelligence"},{t:"Client Pull Trigger",d:"Client identifies new problem and calls HUMAIN first.",a:"Intelligence → Shift"},{t:"HUMAIN Sees First",d:"HUMAIN identifies a gap before the client names it.",a:"Shift → Expansion"}].map((t,i)=><div key={i} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:"1px solid var(--border)"}}><div style={{width:32,height:32,borderRadius:8,background:"rgba(0,150,136,0.06)",display:"flex",alignItems:"center",justifyContent:"center",...M,fontSize:10,color:"#009688",flexShrink:0}}>{i+1}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{t.t}</div><div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{t.d}</div></div><span style={{...M,fontSize:9,color:"#00B89C",flexShrink:0,marginTop:4}}>{t.a}</span></div>)}
  </div>
  <div style={{marginBottom:40}}>
    <div style={{...M,fontSize:9,letterSpacing:"0.2em",color:"var(--muted)",marginBottom:4}}>05 — ADVISORY POSITIONING</div>
    <div style={{...T,fontSize:22,fontWeight:800,marginBottom:20}}>Not a vendor. A sovereign partner.</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div style={{...CS,padding:"18px 22px",opacity:0.5}}><div style={{...M,fontSize:9,color:"#FF4B4B",marginBottom:10}}>TECHNOLOGY VENDOR</div>{["Sells what it has already built","Measures success in licenses","Leaves after implementation","Knows technology, not the business","Replicable by any better-funded competitor"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0"}}>— {s}</div>)}</div>
      <div style={{...CS,padding:"18px 22px",border:"1px solid rgba(0,150,136,0.2)"}}><div style={{...M,fontSize:9,color:"#00B89C",marginBottom:10}}>HUMAIN AS SOVEREIGN ADVISER</div>{["Enters through the client's deepest sector fear","Measures success in the client's P&L language","Stays embedded, builds Saudi capability","Knows sector, operation, and Arabic context","Irreplaceable — intelligence compounds"].map((s,i)=><div key={i} style={{fontSize:12,color:"var(--sub)",padding:"4px 0"}}>— {s}</div>)}</div>
    </div>
  </div>
</div>);
    case"setup":return(<div>
  <div style={{...T,fontSize:22,fontWeight:800,marginBottom:6}}>How to Activate the Database</div>
  <div style={{fontSize:13,color:"var(--sub)",marginBottom:24}}>Follow these steps exactly. Takes about 10 minutes total.</div>
  <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:32}}>
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"#009688",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",...T,fontSize:16,fontWeight:800,flexShrink:0}}>1</div>
      <div><div style={{...T,fontSize:16,fontWeight:700,marginBottom:4}}>Open Your Supabase Project</div><div style={{fontSize:13,color:"var(--sub)"}}>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{color:"#009688",textDecoration:"none"}}>supabase.com</a> and open project <a href="https://nujczhqxcxuppatnjbon.supabase.co" target="_blank" rel="noreferrer" style={{color:"#009688",textDecoration:"none",...M,fontSize:11}}>nujczhqxcxuppatnjbon.supabase.co</a></div></div>
    </div>
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"#00B89C",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",...T,fontSize:16,fontWeight:800,flexShrink:0}}>2</div>
      <div><div style={{...T,fontSize:16,fontWeight:700,marginBottom:4}}>Disable Email Confirmation</div><div style={{fontSize:13,color:"var(--sub)"}}>Authentication → Settings → Email Auth → turn OFF "Confirm email" → Save</div></div>
    </div>
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"#B8E636",display:"flex",alignItems:"center",justifyContent:"center",color:"#0D1B1E",...T,fontSize:16,fontWeight:800,flexShrink:0}}>3</div>
      <div><div style={{...T,fontSize:16,fontWeight:700,marginBottom:4}}>Run the SQL Schema</div><div style={{fontSize:13,color:"var(--sub)"}}>Supabase → SQL Editor → New Query → paste → Run. Should show "Success".</div></div>
    </div>
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"#FFB800",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",...T,fontSize:16,fontWeight:800,flexShrink:0}}>4</div>
      <div><div style={{...T,fontSize:16,fontWeight:700,marginBottom:4}}>Sign In Once, Then Set Yourself as Admin</div><div style={{fontSize:13,color:"var(--sub)"}}>Sign into COMPASS first (creates your profile row). Then run the admin query below.</div></div>
    </div>
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"#8A9BAA",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",...T,fontSize:16,fontWeight:800,flexShrink:0}}>5</div>
      <div><div style={{...T,fontSize:16,fontWeight:700,marginBottom:4}}>Add Claude API Key</div><div style={{fontSize:13,color:"var(--sub)"}}>Admin → AI Configuration → paste your Anthropic API key → Save Key → Test.</div></div>
    </div>
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"#8A9BAA",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",...T,fontSize:16,fontWeight:800,flexShrink:0}}>6</div>
      <div><div style={{...T,fontSize:16,fontWeight:700,marginBottom:4}}>Add ElevenLabs Key (Optional)</div><div style={{fontSize:13,color:"var(--sub)"}}>Run in SQL Editor: INSERT INTO system_config (config_key, config_value) VALUES ('elevenlabs_api_key', 'your-key-here');</div></div>
    </div>
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"#8A9BAA",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",...T,fontSize:16,fontWeight:800,flexShrink:0}}>7</div>
      <div><div style={{...T,fontSize:16,fontWeight:700,marginBottom:4}}>Enable RLS Policies</div><div style={{fontSize:13,color:"var(--sub)"}}>Enable Row Level Security on all tables. Add policies: authenticated users can SELECT, INSERT, UPDATE, DELETE.</div></div>
    </div>
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"#8A9BAA",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",...T,fontSize:16,fontWeight:800,flexShrink:0}}>8</div>
      <div><div style={{...T,fontSize:16,fontWeight:700,marginBottom:4}}>Invite Your Team</div><div style={{fontSize:13,color:"var(--sub)"}}>Admin → Create User for each team member. They'll sign in with the temporary password you set.</div></div>
    </div>
  </div>
  <div style={{...CS,marginBottom:16}}>
    <div style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid var(--border)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><Database size={14} color="#009688"/><span style={{...T,fontSize:14,fontWeight:700}}>Full SQL Schema</span><span style={{...M,fontSize:9,color:"var(--muted)"}}>Creates all 11 tables</span></div>
      <button onClick={()=>{const sql=["-- HUMAIN COMPASS — Full Database Schema","-- Paste into Supabase SQL Editor and click Run","","CREATE TABLE IF NOT EXISTS deals (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, client_name text, sector text, stage text DEFAULT 'Recognition', status text DEFAULT 'Active', expected_value numeric DEFAULT 0, probability int DEFAULT 0, weighted_value numeric DEFAULT 0, deal_score int DEFAULT 0, contact_name text, next_step text, next_meeting date, notes text, tags text, assigned_name text, created_by uuid, updated_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS deal_events (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, deal_id uuid REFERENCES deals(id), event_type text, description text, created_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS briefs (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, client_name text, sector text, meeting_type text, context_data text, brief_content text, generated_by text, created_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS debriefs (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, client_name text, sector text, deal_id uuid, confirmed text, challenged text, new_signal text, next_step text, created_by text, created_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS campaigns (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, name text, type text, sector text, status text DEFAULT 'Planned', budget_sar numeric, target_leads int, start_date date, end_date date, description text, objective text, created_by uuid, updated_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS leads (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, name text, organization text, title text, sector text, source_type text, source_campaign_id uuid, status text DEFAULT 'Cold', contact_email text, notes text, converted_deal_id uuid, converted_at timestamptz, owner_id uuid, created_by uuid, updated_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS content_assets (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, title text, asset_type text, sector text, status text DEFAULT 'Draft', description text, created_by uuid, updated_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS agent_queue (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, agent_name text, action_type text, deal_id uuid, title text, description text, suggested_action text, draft_content text, priority text DEFAULT 'medium', status text DEFAULT 'pending', created_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS profiles (id uuid PRIMARY KEY, email text, full_name text, role text DEFAULT 'member', team text, department text, sector_focus text, last_seen timestamptz, created_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS access_requests (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, email text, full_name text, department text, status text DEFAULT 'Pending', requested_at timestamptz DEFAULT now());","","CREATE TABLE IF NOT EXISTS system_config (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, config_key text UNIQUE, config_value text);"].join("\n");navigator.clipboard.writeText(sql).then(()=>alert("SQL copied to clipboard"));}} style={{...BP,padding:"8px 16px",fontSize:11}}>Copy SQL</button>
    </div>
    <div style={{padding:"16px 18px",background:dark?"#0D1B1E":"var(--panel2)",fontFamily:"'DM Mono',monospace",fontSize:11,color:dark?"#a8d8a8":"var(--sub)",lineHeight:1.7,maxHeight:300,overflowY:"auto",whiteSpace:"pre-wrap"}}>{"-- HUMAIN COMPASS — Full Database Schema\n-- Creates 11 tables: deals, deal_events, briefs, debriefs, campaigns, leads, content_assets, agent_queue, profiles, access_requests, system_config\n\nCREATE TABLE IF NOT EXISTS deals (\n  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,\n  client_name text, sector text,\n  stage text DEFAULT 'Recognition',\n  status text DEFAULT 'Active',\n  expected_value numeric DEFAULT 0,\n  probability int DEFAULT 0,\n  ...\n);\n\n-- + 10 more tables. Click Copy SQL for the full schema."}</div>
  </div>
  <div style={{padding:"14px 18px",background:"rgba(0,184,156,0.04)",border:"1px solid rgba(0,184,156,0.12)",borderRadius:10}}>
    <div style={{fontSize:13,color:"#00B89C",fontWeight:600,marginBottom:4}}>You have already signed in successfully.</div>
    <div style={{fontSize:12,color:"var(--sub)"}}>Run this query now to confirm your admin role:</div>
    <div style={{...M,fontSize:11,color:dark?"#a8d8a8":"var(--sub)",background:dark?"#0D1B1E":"var(--panel2)",padding:"10px 14px",borderRadius:8,marginTop:8}}>UPDATE profiles SET role = 'admin' WHERE email = '{profile?.email||"your@email.com"}';</div>
  </div>
</div>);
    default:return<PH label={TABS.find(t=>t.id===tab)?.label||tab} icon={TABS.find(t=>t.id===tab)?.icon||Home}/>;
  }};

  return(<div style={{...th,fontFamily:"'ABC Repro','Inter','DM Sans',sans-serif",background:"var(--bg)",color:"var(--text)",minHeight:"100vh",display:"flex"}}>
    <style>{`
      .cr{width:64px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:18px 0;gap:4px;transition:width .2s ease;overflow:hidden;position:fixed;top:0;left:0;bottom:0;z-index:100}
      .cr:hover{width:200px}
      .cr-lb{opacity:0;font-size:13px;font-weight:500;transition:opacity .15s;pointer-events:none;white-space:nowrap}
      .cr:hover .cr-lb{opacity:1}
      .cr-ui{opacity:0;transition:opacity .15s}
      .cr:hover .cr-ui{opacity:1}
    `}</style>
    <nav className="cr" style={{background:dark?"var(--panel)":"transparent"}}>
        {/* Logo */}
        <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,alignSelf:"flex-start",marginLeft:12,flexShrink:0}}>
          <svg width="26" height="22" viewBox="0 0 24 24" fill="none" stroke={dark?"#8AA0A6":"#1A1A1A"} strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="4" x2="4" y2="20"/><line x1="20" y1="4" x2="20" y2="20"/><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/></svg>
        </div>
        {/* Nav items */}
        {[{id:"home",label:"Home",icon:Home},...TABS.filter(t=>t.id!=="home"&&(!t.ao||isA)),{id:"framework",label:"Framework",icon:Layers},{id:"engage",label:"Engage OS",icon:Network}].map(t=>{const I=t.icon;const on=tab===t.id;return(
          <button key={t.id} onClick={()=>{sT(t.id);sChatActive(false);}} style={{display:"flex",alignItems:"center",gap:12,width:"calc(100% - 12px)",margin:"0 6px",padding:"0 10px",height:32,borderRadius:8,cursor:"pointer",color:on?"#009688":dark?"#8AA0A6":"#8A9BAA",background:on?"rgba(0,150,136,0.12)":"transparent",border:"none",position:"relative",whiteSpace:"nowrap",transition:"background .15s, color .15s",flexShrink:0}}
            onMouseEnter={e=>{if(!on){e.currentTarget.style.background=dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)";e.currentTarget.style.color=dark?"#E8F0F0":"#1A1A1A";}}}
            onMouseLeave={e=>{if(!on){e.currentTarget.style.background="transparent";e.currentTarget.style.color=dark?"#8AA0A6":"#8A9BAA";}}}>
            <I size={18} strokeWidth={1.8} style={{flexShrink:0,minWidth:18}}/>
            <span className="cr-lb" style={{fontWeight:on?600:500}}>{t.label}</span>
            {t.id==="admin"&&notif>0&&<span style={{position:"absolute",top:6,left:30,width:14,height:14,background:"#009688",color:"#fff",borderRadius:"50%",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{notif}</span>}
          </button>);})}
        {/* Daily Intel */}
        <button onClick={()=>sIntel(!intel)} style={{display:"flex",alignItems:"center",gap:12,width:"calc(100% - 12px)",margin:"0 6px",padding:"0 10px",height:32,borderRadius:8,cursor:"pointer",color:intel?"#00B89C":dark?"#8AA0A6":"#8A9BAA",background:intel?"rgba(0,184,156,0.12)":"transparent",border:"none",whiteSpace:"nowrap",transition:"background .15s, color .15s",flexShrink:0}}>
          <div style={{position:"relative",flexShrink:0,minWidth:18,display:"flex",alignItems:"center",justifyContent:"center"}}><Activity size={18} strokeWidth={1.8}/><div style={{position:"absolute",top:-2,right:-3,width:6,height:6,borderRadius:8,background:"#00B89C",animation:"pulse 2s ease-in-out infinite"}}/></div>
          <span className="cr-lb">Daily Intel</span>
        </button>
        {/* Spacer */}
        <div style={{flex:1}}/>
        {/* Theme toggle */}
        <div style={{display:"flex",gap:2,marginBottom:4,flexShrink:0}}>
          <button onClick={()=>sDk(false)} style={{padding:"5px 8px",borderRadius:8,border:"none",cursor:"pointer",background:!dark?"rgba(0,150,136,0.12)":"transparent",color:!dark?"#009688":"#a9a29d"}}><Sun size={14}/></button>
          <button onClick={()=>sDk(true)} style={{padding:"5px 8px",borderRadius:8,border:"none",cursor:"pointer",background:dark?"rgba(0,150,136,0.12)":"transparent",color:dark?"#009688":"#a9a29d"}}><Moon size={14}/></button>
        </div>
        {/* Sign out */}
        <button onClick={()=>{sS(null);sP(null);sD([]);}} style={{display:"flex",alignItems:"center",gap:12,width:"calc(100% - 12px)",margin:"0 6px",padding:"0 10px",height:32,borderRadius:8,cursor:"pointer",color:dark?"#5A7278":"#8A9BAA",background:"transparent",border:"none",whiteSpace:"nowrap",transition:"background .15s, color .15s",flexShrink:0}}>
          <LogOut size={18} strokeWidth={1.8} style={{flexShrink:0,minWidth:18}}/><span className="cr-lb">Sign out</span>
        </button>
        {/* Avatar */}
        <div style={{display:"flex",alignItems:"center",gap:10,width:"calc(100% - 12px)",margin:"4px 6px 0",padding:"6px 4px",borderRadius:8,flexShrink:0}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"#009688",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,flexShrink:0}}>{nm[0]?.toUpperCase()}</div>
          <div className="cr-ui" style={{display:"flex",flexDirection:"column",minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:dark?"#E8F0F0":"#1A1A1A",whiteSpace:"nowrap"}}>{nm}</div>
            {isA&&<div style={{fontSize:10,color:dark?"#5A7278":"#8A9BAA"}}>Admin</div>}
          </div>
        </div>
      </nav>
    <main style={{flex:1,marginLeft:64,padding:"16px 24px 16px 0",minHeight:"100vh"}}>
      <div style={{background:"var(--panel)",borderRadius:20,border:dark?"none":"1px solid var(--border)",boxShadow:"0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)",overflow:"hidden",minHeight:"calc(100vh - 32px)"}}>
      <div style={{position:"sticky",top:0,zIndex:50,background:dark?"var(--panel)":"rgba(255,255,255,0.85)",backdropFilter:"blur(40px) saturate(150%)",WebkitBackdropFilter:"blur(40px) saturate(150%)",borderBottom:"1px solid var(--border)",padding:"10px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:"20px 20px 0 0"}}>
        <div style={{position:"relative",flex:1,maxWidth:360}}><Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--muted)"}}/><input value={search} onChange={e=>{sSr(e.target.value);sSrO(true);}} onFocus={()=>sSrO(true)} onBlur={()=>setTimeout(()=>sSrO(false),200)} placeholder="Search deals..." style={{...IP,paddingLeft:32,fontSize:12}}/>{srO&&search&&sr.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--panel)",border:"1px solid var(--border)",borderRadius:10,marginTop:4,boxShadow:"0 8px 24px rgba(0,0,0,0.1)",zIndex:60,overflow:"hidden",maxHeight:400,overflowY:"auto"}}>{sr.map((r,i)=><div key={i} onMouseDown={()=>{if(r.deal)sM({deal:r.deal});sSr("");}} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)",fontSize:13,display:"flex",alignItems:"center",gap:10}}><span style={{...M,fontSize:9,padding:"2px 6px",borderRadius:8,background:r.type==="Deal"?"rgba(0,150,136,0.06)":r.type==="Lead"?"rgba(0,184,156,0.06)":"rgba(255,184,0,0.06)",color:r.type==="Deal"?"#009688":r.type==="Lead"?"#00B89C":"#FFB800",flexShrink:0}}>{r.type}</span><span style={{fontWeight:600,flex:1}}>{r.name}</span><span style={{...M,fontSize:10,color:"var(--muted)"}}>{r.sub}</span></div>)}</div>}</div>
        <button onClick={()=>sTourStep(0)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"5px 8px",cursor:"pointer",color:"var(--muted)"}} title="Guided Tour"><BookOpen size={14}/></button><div style={{display:"flex",alignItems:"center",gap:8}}>{isA&&<button onClick={()=>sNotifOpen(!notifOpen)} style={{position:"relative",background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"5px 8px",cursor:"pointer",color:"var(--muted)"}}><Bell size={14}/>{notif>0&&<span style={{position:"absolute",top:-4,right:-4,width:14,height:14,borderRadius:8,background:"#FF4B4B",color:"#fff",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{notif}</span>}</button>}<div style={{...M,fontSize:9,color:"#FFB800",letterSpacing:"0.1em",padding:"3px 8px",background:"rgba(255,184,0,0.05)",border:"1px solid rgba(255,184,0,0.08)",borderRadius:8}}>STAGING</div></div>
      </div>
      <div style={{padding:"24px 28px 80px",maxWidth:1100}}>{renderTab()}</div>
      </div>
    </main>
    <NotifPanel open={notifOpen} onClose={()=>sNotifOpen(false)} requests={accessReqs} token={tk} onRefresh={ld}/>
    <DailyIntel deals={deals} profile={profile} open={intel} onClose={()=>sIntel(false)}/>
    
    
    {toast&&<div style={{position:"fixed",top:20,right:20,background:toast.type==="error"?"#FF4B4B":"#009688",color:"#fff",padding:"12px 20px",borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",zIndex:3000,fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:8,animation:"fadeIn .2s"}}>{toast.msg}<button onClick={()=>sToast(null)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",marginLeft:8}}><X size={14}/></button></div>}
    
    {tourStep>=0&&(()=>{const steps=[
      {title:"Welcome to COMPASS",desc:"Your sovereign intelligence layer. Let's take a quick tour of what's here.",tab:"home"},
      {title:"AI Chat",desc:"Ask about deals, pipeline, strategy. Mention a client meeting and COMPASS will offer to register the deal automatically.",tab:"home"},
      {title:"CRM Pipeline",desc:"Your 5-stage pipeline kanban. Click any deal to view, edit, or track activity. Use filters to slice by sector, stage, or status.",tab:"crm"},
      {title:"Dashboard",desc:"Pipeline health at a glance. Stage breakdown, sector coverage, stalled deals alert. Admin users see the CEO Executive Summary.",tab:"dashboard"},
      {title:"12 Agents",desc:"Sovereign intelligence agents that analyze your pipeline. Run individually or all at once. Logic agents score deals and flag issues. AI agents provide strategic insights.",tab:"agents"},
      {title:"Meeting Briefs",desc:"Select a deal, fill in context, generate an AI brief. 6 sections: client context, belief statement, conversation flow, questions, objection prep, next step. Saves automatically.",tab:"meetings"},
      {title:"Marketing",desc:"Campaigns, leads, and content assets. Full CRUD — create, edit, delete. Calendar view shows campaign timeline.",tab:"marketing"},
      {title:"The Framework",desc:"Sector beliefs, 5-stage progression, 8 principles, irreversibility conditions. The operating system of HUMAIN's client relationships.",tab:"framework"},
      {title:"Engagement OS",desc:"Sector entry scripts, meeting toolkit, signal decoder, cross-sell logic, advisory positioning. Everything for every meeting.",tab:"engage"},
      {title:"Tour Complete",desc:"You're ready. COMPASS learns from every deal, every debrief, every meeting. The intelligence compounds.",tab:"home"},
    ];const step=steps[tourStep]||steps[0];return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000}} onClick={()=>sTourStep(-1)}>
        <div style={{background:"var(--panel)",borderRadius:20,padding:"28px 32px",maxWidth:420,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
          <div style={{...M,fontSize:9,color:"#009688",letterSpacing:"0.12em",marginBottom:8}}>STEP {tourStep+1} OF {steps.length}</div>
          <div style={{...T,fontSize:20,fontWeight:800,marginBottom:8}}>{step.title}</div>
          <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.6,marginBottom:20}}>{step.desc}</div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            {tourStep>0&&<button onClick={()=>{sTourStep(tourStep-1);sT(steps[tourStep-1].tab);sChatActive(false);}} style={{...BG,padding:"8px 20px"}}>Back</button>}
            {tourStep<steps.length-1?<button onClick={()=>{sTourStep(tourStep+1);sT(steps[tourStep+1].tab);sChatActive(false);}} style={{...BP,padding:"8px 24px"}}>Next</button>
            :<button onClick={()=>sTourStep(-1)} style={{...BP,padding:"8px 24px"}}>Finish</button>}
          </div>
          <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:14}}>{steps.map((_,i)=><div key={i} style={{width:6,height:6,borderRadius:8,background:i===tourStep?"#009688":i<tourStep?"#00B89C":"var(--border)"}}/>)}</div>
        </div>
      </div>);})()}
    {idleWarn&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
      <div style={{background:"var(--panel)",borderRadius:20,padding:"32px 36px",textAlign:"center",maxWidth:380}}>
        <div style={{...T,fontSize:18,fontWeight:800,marginBottom:8}}>Session Timeout</div>
        <div style={{fontSize:13,color:"var(--sub)",marginBottom:20}}>You've been inactive for 15 minutes. Click below to stay signed in, or you'll be signed out in 60 seconds.</div>
        <button onClick={()=>{sIdleWarn(false);clearTimeout(warnRef.current);}} style={{...BP,padding:"10px 28px"}}>I'm Still Here</button>
      </div>
    </div>}
    
    {typeof navigator!=="undefined"&&/Mobi|Android/i.test(navigator.userAgent)&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:"var(--panel)",borderTop:"1px solid var(--border)",padding:"14px 20px",zIndex:1500,display:"flex",alignItems:"center",gap:12,boxShadow:"0 -4px 16px rgba(0,0,0,0.1)"}}>
      <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#009688,#00B89C,#B8E636)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12,flexShrink:0}}>C</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>COMPASS Mobile</div><div style={{fontSize:11,color:"var(--muted)"}}>For the best experience, use the mobile app</div></div>
      <button onClick={e=>e.currentTarget.parentElement.style.display="none"} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><X size={16}/></button>
    </div>}
    {modal&&<DealModal deal={modal.deal} onClose={()=>sM(null)} onSave={()=>{sM(null);ld();}} onDel={async(id)=>{try{await q(`/rest/v1/deals?id=eq.${id}`,tk,{method:"DELETE"});sM(null);ld();}catch(x){alert(x.message);}}} token={tk}/>}
  </div>);
}
