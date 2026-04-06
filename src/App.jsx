import { useState, useEffect, useRef, useCallback } from "react";
import { Home, Target, LayoutDashboard, Sparkles, Calendar, TrendingUp, Layers, Network, Settings, Database, LogOut, Sun, Moon, Search, Send, Plus, Eye, EyeOff, Briefcase, Users, Shield, Clock, MessageSquare, X, ChevronDown, FileText, RefreshCw, Edit3, Trash2, Save, ArrowRight, BarChart3, Zap, Bell, Filter } from "lucide-react";

const SUPA_URL = "https://nujczhqxcxuppatnjbon.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51amN6aHF4Y3h1cHBhdG5qYm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjIyMjAsImV4cCI6MjA4OTE5ODIyMH0.WDy1yI89XDk7g-jnPfrEmewvtayHi87lROeZlAZpZ8U";
const STAGES = ["Recognition", "Proof", "Integration", "Dependency", "Expansion"];
const SECTORS = ["Government", "Oil & Gas", "Healthcare", "Private Sector", "Sport"];
const STAGE_COLORS = { Recognition: "#8A9BAA", Proof: "#FFB800", Integration: "#00879F", Dependency: "#00D49C", Expansion: "#6B8C00" };
const SECTOR_COLORS = { Government: "#00879F", "Oil & Gas": "#FFB800", Healthcare: "#00D49C", "Private Sector": "#D0F94A", Sport: "#FF6B6B" };

async function supa(path, token, opts = {}) {
  const h = { apikey: SUPA_KEY, "Content-Type": "application/json", Authorization: `Bearer ${token || SUPA_KEY}`, Prefer: "return=representation", ...opts.headers };
  const r = await fetch(`${SUPA_URL}${path}`, { ...opts, headers: h });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.message || e.msg || r.statusText); }
  const text = await r.text(); return text ? JSON.parse(text) : null;
}
async function supaAuth(email, password) {
  const r = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: SUPA_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  const d = await r.json(); if (!r.ok) throw new Error(d.error_description || d.msg || "Auth failed"); return d;
}

const TABS = [
  { id: "home", label: "Home", icon: Home }, { id: "crm", label: "CRM", icon: Target },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }, { id: "agents", label: "Agents", icon: Sparkles },
  { id: "meetings", label: "Meetings", icon: Calendar }, { id: "marketing", label: "Marketing", icon: TrendingUp },
  { id: "framework", label: "Framework", icon: Layers }, { id: "engage", label: "Engage OS", icon: Network },
  { id: "admin", label: "Admin", icon: Settings, adminOnly: true }, { id: "setup", label: "DB Setup", icon: Database, adminOnly: true },
];

const mono = { fontFamily: "'DM Mono', monospace" };
const ttl = { fontFamily: "'Optician Sans', 'DM Sans', sans-serif" };
const cardS = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" };
const btnP = { padding: "8px 16px", background: "#00879F", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center" };
const btnG = { padding: "8px 16px", background: "transparent", color: "var(--sub)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, cursor: "pointer" };
const inp = { width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, outline: "none", background: "var(--panel2)", color: "var(--text)", boxSizing: "border-box" };
const lbl = { ...mono, fontSize: 10, letterSpacing: "0.1em", color: "var(--muted)", display: "block", marginBottom: 5 };

function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState(""); const [pwd, setPwd] = useState(""); const [show, setShow] = useState(false);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const go = async () => { if (!email||!pwd){setErr("Enter email and password.");return;} setBusy(true);setErr(""); try{onLogin(await supaAuth(email,pwd));}catch(x){setErr(x.message);}finally{setBusy(false);} };
  return (
    <div style={{ position:"fixed",inset:0,background:"#0D1B1E",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ width:380,background:"#fff",borderRadius:18,overflow:"hidden" }}>
        <div style={{ height:3,background:"linear-gradient(90deg,#00879F,#00D49C,#D0F94A)" }}/>
        <div style={{ padding:"40px 36px 36px" }}>
          <div style={{ ...ttl,fontSize:22,fontWeight:800,marginBottom:4 }}>COMPASS</div>
          <div style={{ ...mono,fontSize:10,color:"#999",letterSpacing:"0.15em",marginBottom:28 }}>STAGING ENVIRONMENT</div>
          <div style={{ marginBottom:14 }}><label style={{...lbl,color:"#999"}}>EMAIL</label><input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="you@humain.com" style={{...inp,background:"#fff",border:"1px solid #e8e8e8"}}/></div>
          <div style={{ marginBottom:20 }}><label style={{...lbl,color:"#999"}}>PASSWORD</label><div style={{position:"relative"}}><input type={show?"text":"password"} value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} style={{...inp,background:"#fff",border:"1px solid #e8e8e8",paddingRight:40}}/><button onClick={()=>setShow(!show)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#999"}}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></div>
          {err && <div style={{color:"#FF4B4B",fontSize:13,marginBottom:12,padding:"8px 12px",background:"rgba(255,75,75,0.06)",borderRadius:8}}>{err}</div>}
          <button onClick={go} disabled={busy} style={{width:"100%",padding:"12px",background:"#0D1B1E",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:busy?"wait":"pointer",opacity:busy?0.7:1}}>{busy?"Signing in...":"Sign In"}</button>
        </div>
      </div>
    </div>
  );
}

function DealModal({ deal, onClose, onSave, onDelete, token }) {
  const isNew = !deal?.id;
  const [f, setF] = useState({ client_name:deal?.client_name||"", sector:deal?.sector||"", stage:deal?.stage||"Recognition", status:deal?.status||"Active", expected_value:deal?.expected_value||0, contact_name:deal?.contact_name||"", next_step:deal?.next_step||"", notes:deal?.notes||"", probability:deal?.probability||0 });
  const [saving, setSaving] = useState(false); const [evts, setEvts] = useState([]);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  useEffect(()=>{ if(deal?.id&&token) supa(`/rest/v1/deal_events?deal_id=eq.${deal.id}&select=*&order=created_at.desc&limit=15`,token).then(setEvts).catch(()=>{}); },[deal?.id,token]);
  const save = async () => { if(!f.client_name.trim())return; setSaving(true); try{ const pl={...f,expected_value:parseFloat(f.expected_value)||0,probability:parseInt(f.probability)||0,weighted_value:(parseFloat(f.expected_value)||0)*((parseInt(f.probability)||0)/100),updated_at:new Date().toISOString()}; if(isNew){await supa("/rest/v1/deals",token,{method:"POST",body:JSON.stringify(pl)});}else{await supa(`/rest/v1/deals?id=eq.${deal.id}`,token,{method:"PATCH",body:JSON.stringify(pl)});} onSave(); }catch(x){alert(x.message);}finally{setSaving(false);} };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}>
      <div style={{width:560,maxHeight:"85vh",background:"var(--panel)",borderRadius:16,overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 24px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{...ttl,fontSize:18,fontWeight:700}}>{isNew?"New Deal":deal.client_name}</div>
          <div style={{display:"flex",gap:8}}>{!isNew&&<button onClick={()=>{if(confirm("Delete?"))onDelete(deal.id);}} style={{...btnG,padding:"6px 10px",color:"#FF4B4B"}}><Trash2 size={14}/></button>}<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><X size={18}/></button></div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            <div><label style={lbl}>CLIENT NAME</label><input value={f.client_name} onChange={e=>set("client_name",e.target.value)} style={inp}/></div>
            <div><label style={lbl}>SECTOR</label><select value={f.sector} onChange={e=>set("sector",e.target.value)} style={inp}><option value="">Select</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select></div>
            <div><label style={lbl}>STAGE</label><select value={f.stage} onChange={e=>set("stage",e.target.value)} style={inp}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div><label style={lbl}>STATUS</label><select value={f.status} onChange={e=>set("status",e.target.value)} style={inp}><option>Active</option><option>Won</option><option>Lost</option><option>Stalled</option></select></div>
            <div><label style={lbl}>VALUE (SAR)</label><input type="number" value={f.expected_value} onChange={e=>set("expected_value",e.target.value)} style={inp}/></div>
            <div><label style={lbl}>PROBABILITY %</label><input type="number" value={f.probability} onChange={e=>set("probability",e.target.value)} style={inp} min={0} max={100}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={lbl}>CONTACT</label><input value={f.contact_name} onChange={e=>set("contact_name",e.target.value)} style={inp}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={lbl}>NEXT STEP</label><input value={f.next_step} onChange={e=>set("next_step",e.target.value)} style={inp}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={lbl}>NOTES</label><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} rows={3} style={{...inp,resize:"vertical"}}/></div>
          </div>
          {evts.length>0&&<div style={{marginTop:8}}><div style={{...mono,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:8}}>ACTIVITY LOG</div>{evts.map((ev,i)=><div key={i} style={{padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:12,color:"var(--sub)",display:"flex",gap:10}}><span style={{...mono,fontSize:10,color:"var(--muted)",width:70,flexShrink:0}}>{new Date(ev.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</span><span>{ev.description||ev.event_type}</span></div>)}</div>}
        </div>
        <div style={{padding:"14px 24px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"flex-end",gap:10}}>
          <button onClick={onClose} style={btnG}>Cancel</button>
          <button onClick={save} disabled={saving} style={{...btnP,opacity:saving?0.6:1}}><Save size={14} style={{marginRight:6}}/>{saving?"Saving...":isNew?"Create Deal":"Save"}</button>
        </div>
      </div>
    </div>
  );
}

function AIChat({ deals, profile }) {
  const [msgs, setMsgs] = useState([]); const [input, setInput] = useState(""); const [busy, setBusy] = useState(false); const end = useRef(null);
  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send = async () => { if(!input.trim()||busy)return; const t=input.trim();setInput("");setBusy(true); setMsgs(p=>[...p,{role:"user",content:t}]); const a=deals.filter(d=>d.status==="Active"); const sys=`You are COMPASS AI for HUMAIN CRM. User: ${profile?.full_name}. ${a.length} active deals, SAR ${a.reduce((s,d)=>s+(d.expected_value||0),0).toLocaleString()} pipeline. Top: ${a.slice(0,5).map(d=>d.client_name+" ("+d.stage+")").join(", ")}. Be concise, strategic.`;
    try{ const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...msgs.slice(-10),{role:"user",content:t}]})}); const d=await r.json(); setMsgs(p=>[...p,{role:"assistant",content:d.content?.map(c=>c.text||"").join("")||"No response"}]); }catch(x){setMsgs(p=>[...p,{role:"assistant",content:"Error: "+x.message}]);}finally{setBusy(false);} };
  return (
    <div style={cardS}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}><div style={{width:26,height:26,borderRadius:7,background:"rgba(0,135,159,0.08)",display:"flex",alignItems:"center",justifyContent:"center",color:"#00879F"}}><MessageSquare size={13}/></div><span style={{...mono,fontSize:10,letterSpacing:"0.06em",color:"var(--muted)"}}>COMPASS AI</span></div>
      <div style={{height:280,overflowY:"auto",padding:14}}>
        {msgs.length===0&&<div style={{textAlign:"center",paddingTop:50,color:"var(--muted)",fontSize:13}}>Ask about deals, pipeline, or strategy</div>}
        {msgs.map((m,i)=><div key={i} style={{marginBottom:10,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"80%",padding:"9px 13px",borderRadius:11,fontSize:13,lineHeight:1.6,background:m.role==="user"?"#0D1B1E":"rgba(0,135,159,0.06)",color:m.role==="user"?"#fff":"var(--text)",border:m.role==="assistant"?"1px solid rgba(0,135,159,0.1)":"none",whiteSpace:"pre-wrap"}}>{m.content}</div></div>)}
        {busy&&<div style={{...mono,color:"var(--muted)",fontSize:11}}>Thinking...</div>}<div ref={end}/>
      </div>
      <div style={{padding:"10px 12px",borderTop:"1px solid var(--border)",display:"flex",gap:8}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask COMPASS AI..." style={{...inp,flex:1}}/><button onClick={send} disabled={busy||!input.trim()} style={{...btnP,padding:"9px 14px",opacity:busy||!input.trim()?0.4:1}}><Send size={14}/></button></div>
    </div>
  );
}

function Kanban({ deals, onOpen }) {
  const g = STAGES.reduce((a,s)=>{a[s]=deals.filter(d=>d.stage===s&&d.status==="Active");return a;},{});
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:0,border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",marginBottom:24}}>
      {STAGES.map((s,i)=><div key={s} style={{borderRight:i<4?"1px solid var(--border)":"none",minHeight:180}}>
        <div style={{padding:"10px 12px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{...mono,fontSize:9,letterSpacing:"0.08em",color:STAGE_COLORS[s],fontWeight:600}}>{s.toUpperCase()}</span><span style={{...mono,fontSize:9,color:"var(--muted)",background:"var(--panel2)",padding:"2px 6px",borderRadius:4}}>{g[s].length}</span></div>
        <div style={{padding:6}}>{g[s].map(d=><div key={d.id} onClick={()=>onOpen(d)} style={{background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:9,padding:"9px 10px",marginBottom:5,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,135,159,0.3)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";}}><div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{d.client_name}</div><div style={{...mono,fontSize:9,color:"var(--muted)"}}>{d.sector||"—"}</div>{d.expected_value>0&&<div style={{...mono,fontSize:9,color:"#00879F",marginTop:3}}>SAR {Number(d.expected_value).toLocaleString()}</div>}</div>)}</div>
      </div>)}
    </div>
  );
}

const KPI=({val,label,color,sub})=>(<div style={{...cardS,padding:"18px 20px"}}><div style={{...ttl,fontSize:24,fontWeight:800,color:color||"var(--text)"}}>{val}</div><div style={{...mono,fontSize:9,letterSpacing:"0.12em",color:"var(--muted)",marginTop:4}}>{label}</div>{sub&&<div style={{...mono,fontSize:10,color:"var(--sub)",marginTop:6}}>{sub}</div>}</div>);

function MeetingBrief({ deals, profile }) {
  const [sel, setSel] = useState(""); const [brief, setBrief] = useState(""); const [busy, setBusy] = useState(false);
  const a = deals.filter(d=>d.status==="Active");
  const gen = async () => { const deal=a.find(d=>d.id===sel); if(!deal)return; setBusy(true);setBrief("");
    const p=`Generate a meeting preparation brief for:\nClient: ${deal.client_name}\nSector: ${deal.sector}\nStage: ${deal.stage}\nValue: SAR ${(deal.expected_value||0).toLocaleString()}\nContact: ${deal.contact_name||"Unknown"}\nNext Step: ${deal.next_step||"None"}\nNotes: ${deal.notes||"None"}\n\nProvide:\n1. Client Context (2-3 lines)\n2. Belief Statement\n3. Conversation Flow (3-4 steps)\n4. Key Questions (3)\n5. Recommended Next Step\n\nBe Saudi/HUMAIN specific. Actionable.`;
    try{ const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:p}]})}); const d=await r.json(); setBrief(d.content?.map(c=>c.text||"").join("")||"No response"); }catch(x){setBrief("Error: "+x.message);}finally{setBusy(false);} };
  return (<div>
    <div style={{marginBottom:20}}><div style={{...ttl,fontSize:22,fontWeight:800}}>Meetings</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>AI-powered brief generation</div></div>
    <div style={{...cardS,padding:20,marginBottom:20}}>
      <div style={{...mono,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>GENERATE MEETING BRIEF</div>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <select value={sel} onChange={e=>setSel(e.target.value)} style={{...inp,flex:1}}><option value="">Select a deal...</option>{a.map(d=><option key={d.id} value={d.id}>{d.client_name} ({d.sector}, {d.stage})</option>)}</select>
        <button onClick={gen} disabled={!sel||busy} style={{...btnP,opacity:!sel||busy?0.5:1,whiteSpace:"nowrap"}}><FileText size={14} style={{marginRight:6}}/>{busy?"Generating...":"Generate Brief"}</button>
      </div>
      {brief&&<div style={{background:"var(--panel2)",border:"1px solid var(--border)",borderRadius:10,padding:"16px 20px",fontSize:13,lineHeight:1.7,color:"var(--sub)",whiteSpace:"pre-wrap",maxHeight:500,overflowY:"auto"}}>{brief}</div>}
    </div>
  </div>);
}

function AdminTab({ token }) {
  const [users, setUsers] = useState([]); const [reqs, setReqs] = useState([]);
  useEffect(()=>{ if(!token)return; supa("/rest/v1/profiles?select=*&order=full_name.asc",token).then(setUsers).catch(()=>{}); supa("/rest/v1/access_requests?select=*&order=requested_at.desc",token).then(setReqs).catch(()=>{}); },[token]);
  return (<div>
    <div style={{marginBottom:20}}><div style={{...ttl,fontSize:22,fontWeight:800}}>Admin</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>{users.length} users · {reqs.filter(r=>r.status==="Pending").length} pending</div></div>
    <div style={{...mono,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>TEAM</div>
    <div style={{...cardS,marginBottom:24}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>
        {["Name","Email","Role","Team","Last Seen"].map(h=><th key={h} style={{...mono,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}
      </tr></thead><tbody>{users.map(u=><tr key={u.id} style={{borderBottom:"1px solid var(--border)"}}>
        <td style={{padding:"10px 14px",fontWeight:600}}>{u.full_name||"—"}</td>
        <td style={{padding:"10px 14px",color:"var(--sub)"}}>{u.email}</td>
        <td style={{padding:"10px 14px"}}><span style={{...mono,fontSize:10,padding:"3px 8px",borderRadius:4,background:u.role==="admin"?"rgba(208,249,74,0.1)":"rgba(0,135,159,0.06)",color:u.role==="admin"?"#6B8C00":"#00879F"}}>{u.role}</span></td>
        <td style={{padding:"10px 14px",...mono,fontSize:11,color:"var(--sub)"}}>{u.team||"—"}</td>
        <td style={{padding:"10px 14px",...mono,fontSize:11,color:"var(--muted)"}}>{u.last_seen?new Date(u.last_seen).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"Never"}</td>
      </tr>)}</tbody></table>
    </div>
    {reqs.length>0&&<><div style={{...mono,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:10}}>ACCESS REQUESTS</div><div style={cardS}>{reqs.map(r=><div key={r.id} style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,fontSize:13}}>{r.full_name}</div><div style={{fontSize:12,color:"var(--sub)"}}>{r.email} · {r.department}</div></div><span style={{...mono,fontSize:10,padding:"3px 10px",borderRadius:4,background:r.status==="Pending"?"rgba(255,184,0,0.08)":"rgba(0,212,156,0.08)",color:r.status==="Pending"?"#FFB800":"#00D49C"}}>{r.status}</span></div>)}</div></>}
  </div>);
}

function Placeholder({ label, icon: Icon }) {
  return <div style={{textAlign:"center",paddingTop:80}}><Icon size={32} style={{color:"var(--muted)",opacity:0.3,marginBottom:12}}/><div style={{...ttl,fontSize:20,fontWeight:700,marginBottom:6}}>{label}</div><div style={{...mono,fontSize:11,color:"var(--muted)",letterSpacing:"0.1em"}}>STAGING — MODULE COMING SOON</div></div>;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [deals, setDeals] = useState([]);
  const [tab, setTab] = useState("home");
  const [dark, setDark] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const token = session?.access_token;
  const isAdmin = profile?.role === "admin";
  const loadDeals = useCallback(() => { if(token) supa("/rest/v1/deals?select=*&order=updated_at.desc",token).then(d=>setDeals(d||[])).catch(console.error); }, [token]);

  useEffect(() => { if(!token)return; const uid=session.user?.id; supa(`/rest/v1/profiles?id=eq.${uid}&select=*`,token).then(d=>{if(d?.[0])setProfile(d[0])}).catch(console.error); loadDeals(); }, [token]);

  const theme = dark ? { "--bg":"#0D1B1E","--panel":"#111F22","--panel2":"#162629","--card-bg":"#162629","--text":"#E8F0F0","--sub":"#8AA0A6","--muted":"#5A7278","--dim":"#4A6268","--border":"rgba(255,255,255,0.08)" }
    : { "--bg":"#EEF3F0","--panel":"#FFFFFF","--panel2":"#F4F8F5","--card-bg":"#FFFFFF","--text":"#0a0a0a","--sub":"#555","--muted":"#8A9BAA","--dim":"#6B8088","--border":"rgba(0,0,0,0.08)" };

  if (!session) return <AuthScreen onLogin={setSession} />;

  const name = profile?.full_name || session.user?.email?.split("@")[0] || "User";
  const hour = new Date().getHours();
  const greet = hour<12?"Good Morning":hour<17?"Good Afternoon":"Good Evening";
  const active = deals.filter(d=>d.status==="Active");
  const pv = active.reduce((s,d)=>s+(d.expected_value||0),0);
  const won = deals.filter(d=>d.status==="Won");
  const sr = search ? deals.filter(d=>(d.client_name||"").toLowerCase().includes(search.toLowerCase())||(d.sector||"").toLowerCase().includes(search.toLowerCase())).slice(0,8) : [];

  const renderTab = () => {
    switch(tab) {
      case "home": return (<div>
        <div style={{marginBottom:28}}><div style={{...ttl,fontSize:26,fontWeight:800,letterSpacing:"-0.02em",marginBottom:4}}>{greet}, {name.split(" ")[0]}</div><div style={{fontSize:14,color:"var(--muted)"}}>Your sovereign intelligence layer is ready.</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}><KPI val={active.length} label="ACTIVE DEALS" color="#00879F"/><KPI val={`SAR ${(pv/1e6).toFixed(1)}M`} label="PIPELINE VALUE" color="#00D49C"/><KPI val={won.length} label="WON DEALS" color="#D0F94A"/><KPI val={SECTORS.filter(s=>active.some(d=>d.sector===s)).length} label="SECTORS ACTIVE" color="#00879F"/></div>
        <AIChat deals={deals} profile={profile}/>
      </div>);
      case "crm": return (<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div><div style={{...ttl,fontSize:22,fontWeight:800}}>Pipeline</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>{active.length} active · SAR {pv.toLocaleString()}</div></div>
          <button onClick={()=>setModal({deal:null})} style={btnP}><Plus size={14} style={{marginRight:6}}/>New Deal</button>
        </div>
        <Kanban deals={deals} onOpen={d=>setModal({deal:d})}/>
        <div style={{...mono,fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",marginBottom:10}}>ALL DEALS ({deals.length})</div>
        <div style={cardS}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{borderBottom:"1px solid var(--border)"}}>
          {["Client","Sector","Stage","Value","Score","Updated"].map(h=><th key={h} style={{...mono,padding:"10px 14px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",color:"var(--muted)",fontWeight:500}}>{h}</th>)}
        </tr></thead><tbody>{deals.slice(0,60).map(d=><tr key={d.id} style={{borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>setModal({deal:d})} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,135,159,0.015)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 14px",fontWeight:600}}>{d.client_name}</td>
          <td style={{padding:"10px 14px",color:"var(--sub)"}}>{d.sector||"—"}</td>
          <td style={{padding:"10px 14px"}}><span style={{...mono,fontSize:10,padding:"3px 8px",borderRadius:4,background:`${STAGE_COLORS[d.stage]||"#999"}12`,color:STAGE_COLORS[d.stage]||"#999",fontWeight:500}}>{d.stage}</span></td>
          <td style={{padding:"10px 14px",...mono,color:"var(--sub)"}}>{d.expected_value>0?`SAR ${Number(d.expected_value).toLocaleString()}`:"—"}</td>
          <td style={{padding:"10px 14px",...mono,color:d.deal_score>=70?"#00D49C":d.deal_score>=40?"#FFB800":"var(--muted)"}}>{d.deal_score||"—"}</td>
          <td style={{padding:"10px 14px",...mono,fontSize:11,color:"var(--muted)"}}>{d.updated_at?new Date(d.updated_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):"—"}</td>
        </tr>)}</tbody></table></div>
      </div>);
      case "dashboard": return (<div>
        <div style={{marginBottom:20}}><div style={{...ttl,fontSize:22,fontWeight:800}}>Dashboard</div><div style={{fontSize:13,color:"var(--muted)",marginTop:2}}>Pipeline health and performance</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          <KPI val={deals.length} label="TOTAL DEALS" sub={`${active.length} active · ${won.length} won`}/>
          <KPI val={`SAR ${(pv/1e6).toFixed(1)}M`} label="ACTIVE PIPELINE" color="#00879F" sub={`Avg: SAR ${active.length?Math.round(pv/active.length).toLocaleString():0}`}/>
          <KPI val={`${deals.length?Math.round(won.length/deals.length*100):0}%`} label="WIN RATE" color="#00D49C"/>
          <KPI val={active.filter(d=>d.deal_score>=70).length} label="HIGH SCORE" color="#D0F94A" sub="Score ≥ 70"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
          <div style={{...cardS,padding:20}}><div style={{...mono,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:12}}>BY STAGE</div>
            {STAGES.map(s=>{const c=active.filter(d=>d.stage===s).length;const pct=active.length?Math.round(c/active.length*100):0;return(<div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{...mono,fontSize:10,color:STAGE_COLORS[s],width:80,flexShrink:0}}>{s}</span><div style={{flex:1,height:6,background:"var(--panel2)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:STAGE_COLORS[s],borderRadius:3}}/></div><span style={{...mono,fontSize:10,color:"var(--muted)",width:30,textAlign:"right"}}>{c}</span></div>);})}</div>
          <div style={{...cardS,padding:20}}><div style={{...mono,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:12}}>BY SECTOR</div>
            {SECTORS.map(s=>{const c=active.filter(d=>d.sector===s).length;const v=active.filter(d=>d.sector===s).reduce((sum,d)=>sum+(d.expected_value||0),0);return(<div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{...mono,fontSize:10,color:SECTOR_COLORS[s],width:90,flexShrink:0}}>{s}</span><div style={{flex:1,fontSize:12,color:"var(--sub)"}}>{c} deals</div><span style={{...mono,fontSize:10,color:"var(--muted)"}}>SAR {(v/1e6).toFixed(1)}M</span></div>);})}</div>
        </div>
        <div style={{...cardS,padding:20}}><div style={{...mono,fontSize:10,letterSpacing:"0.1em",color:"var(--muted)",marginBottom:12}}>STALLED — NEEDS ATTENTION</div>
          {deals.filter(d=>d.status==="Active"&&d.updated_at&&(Date.now()-new Date(d.updated_at).getTime())>14*86400000).slice(0,5).map(d=><div key={d.id} onClick={()=>setModal({deal:d})} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}}><div><span style={{fontWeight:600,fontSize:13}}>{d.client_name}</span><span style={{...mono,fontSize:10,color:"var(--muted)",marginLeft:8}}>{d.sector}</span></div><span style={{...mono,fontSize:10,color:"#FF4B4B"}}>{Math.round((Date.now()-new Date(d.updated_at).getTime())/86400000)}d stale</span></div>)}
          {deals.filter(d=>d.status==="Active"&&d.updated_at&&(Date.now()-new Date(d.updated_at).getTime())>14*86400000).length===0&&<div style={{fontSize:13,color:"var(--muted)",textAlign:"center",padding:16}}>No stalled deals</div>}
        </div>
      </div>);
      case "meetings": return <MeetingBrief deals={deals} profile={profile}/>;
      case "admin": return <AdminTab token={token}/>;
      default: return <Placeholder label={TABS.find(t=>t.id===tab)?.label||tab} icon={TABS.find(t=>t.id===tab)?.icon||Home}/>;
    }
  };

  return (
    <div style={{...theme,fontFamily:"'DM Sans',sans-serif",background:"var(--bg)",color:"var(--text)",minHeight:"100vh",display:"flex"}}>
      <nav style={{width:sidebar?220:64,background:"var(--panel)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",transition:"width .3s cubic-bezier(0.16,1,0.3,1)",position:"fixed",top:0,left:0,bottom:0,zIndex:100,overflow:"hidden"}}>
        <div style={{padding:sidebar?"16px 16px 10px":"16px 12px 10px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setSidebar(!sidebar)}>
          <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#00879F,#00D49C,#D0F94A)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14,flexShrink:0}}>C</div>
          {sidebar&&<span style={{...ttl,fontSize:15,fontWeight:800,whiteSpace:"nowrap"}}>COMPASS</span>}
        </div>
        <div style={{flex:1,padding:"6px",overflowY:"auto"}}>
          {TABS.filter(t=>!t.adminOnly||isAdmin).map(t=>{const I=t.icon;const on=tab===t.id;return(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:sidebar?"8px 10px":"8px 0",justifyContent:sidebar?"flex-start":"center",background:on?"rgba(0,135,159,0.08)":"transparent",border:"none",borderRadius:8,cursor:"pointer",marginBottom:1,color:on?"#00879F":"var(--dim)",transition:"all .15s"}}>
              <I size={17} strokeWidth={on?2:1.5}/>{sidebar&&<span style={{fontSize:13,fontWeight:on?600:400,whiteSpace:"nowrap"}}>{t.label}</span>}
            </button>);})}
        </div>
        <div style={{padding:"10px 6px",borderTop:"1px solid var(--border)"}}>
          <div style={{display:"flex",gap:2,marginBottom:6,justifyContent:"center"}}>
            <button onClick={()=>setDark(false)} style={{padding:"5px 8px",borderRadius:6,border:"none",cursor:"pointer",background:!dark?"rgba(0,135,159,0.1)":"transparent",color:!dark?"#00879F":"var(--muted)"}}><Sun size={13}/></button>
            <button onClick={()=>setDark(true)} style={{padding:"5px 8px",borderRadius:6,border:"none",cursor:"pointer",background:dark?"rgba(0,135,159,0.1)":"transparent",color:dark?"#00879F":"var(--muted)"}}><Moon size={13}/></button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 4px"}}>
            <div style={{width:28,height:28,borderRadius:8,background:"rgba(0,135,159,0.08)",border:"2px solid rgba(0,135,159,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#00879F",flexShrink:0}}>{name[0]?.toUpperCase()}</div>
            {sidebar&&<div style={{overflow:"hidden"}}><div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{name}</div>{isAdmin&&<div style={{...mono,fontSize:8,color:"#D0F94A",letterSpacing:"0.08em"}}>ADMIN</div>}</div>}
          </div>
          <button onClick={()=>{setSession(null);setProfile(null);setDeals([]);}} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:sidebar?"flex-start":"center",gap:8,padding:"7px 10px",background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:11,borderRadius:6}}><LogOut size={13}/>{sidebar&&<span>Sign out</span>}</button>
        </div>
      </nav>
      <main style={{flex:1,marginLeft:sidebar?220:64,transition:"margin-left .3s cubic-bezier(0.16,1,0.3,1)"}}>
        <div style={{position:"sticky",top:0,zIndex:50,background:"var(--panel)",borderBottom:"1px solid var(--border)",padding:"10px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(20px)"}}>
          <div style={{position:"relative",flex:1,maxWidth:360}}>
            <Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--muted)"}}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setSearchOpen(true);}} onFocus={()=>setSearchOpen(true)} onBlur={()=>setTimeout(()=>setSearchOpen(false),200)} placeholder="Search deals..." style={{...inp,paddingLeft:32,fontSize:12}}/>
            {searchOpen&&search&&sr.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--panel)",border:"1px solid var(--border)",borderRadius:10,marginTop:4,boxShadow:"0 8px 24px rgba(0,0,0,0.1)",zIndex:60,overflow:"hidden"}}>{sr.map(d=><div key={d.id} onMouseDown={()=>{setModal({deal:d});setSearch("");}} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)",fontSize:13,display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600}}>{d.client_name}</span><span style={{...mono,fontSize:10,color:STAGE_COLORS[d.stage]}}>{d.stage}</span></div>)}</div>}
          </div>
          <div style={{...mono,fontSize:10,color:"#FFB800",letterSpacing:"0.1em",padding:"4px 10px",background:"rgba(255,184,0,0.06)",border:"1px solid rgba(255,184,0,0.1)",borderRadius:5}}>STAGING</div>
        </div>
        <div style={{padding:"24px 28px 80px",maxWidth:1100}}>{renderTab()}</div>
      </main>
      {modal&&<DealModal deal={modal.deal} onClose={()=>setModal(null)} onSave={()=>{setModal(null);loadDeals();}} onDelete={async(id)=>{try{await supa(`/rest/v1/deals?id=eq.${id}`,token,{method:"DELETE"});setModal(null);loadDeals();}catch(x){alert(x.message);}}} token={token}/>}
    </div>
  );
}
