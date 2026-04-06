import { useState, useEffect, useRef, useCallback } from "react";
import { Home, Target, LayoutDashboard, Sparkles, Calendar, TrendingUp, Layers, Network, Settings, Database, LogOut, Sun, Moon, Search, Send, ChevronRight, Plus, Eye, EyeOff, UserPlus, Briefcase, Users, Shield, Clock, ArrowRight, MessageSquare, X, Menu, Bell } from "lucide-react";

/* ═══════════════════════════════════════════
   COMPASS V2 STAGING — React / Supabase
   ═══════════════════════════════════════════ */

const SUPA_URL = "https://nujczhqxcxuppatnjbon.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51amN6aHF4Y3h1cHBhdG5qYm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjIyMjAsImV4cCI6MjA4OTE5ODIyMH0.WDy1yI89XDk7g-jnPfrEmewvtayHi87lROeZlAZpZ8U";

const STAGES = ["Recognition", "Proof", "Integration", "Dependency", "Expansion"];
const SECTORS = ["Government", "Oil & Gas", "Healthcare", "Private Sector", "Sport"];
const STAGE_COLORS = { Recognition: "#999", Proof: "#FFB800", Integration: "#00879F", Dependency: "#00D49C", Expansion: "#6B8C00" };

// ─── Supabase REST helpers ───
async function supaFetch(path, token, opts = {}) {
  const headers = { apikey: SUPA_KEY, "Content-Type": "application/json", Authorization: `Bearer ${token || SUPA_KEY}`, ...opts.headers };
  const res = await fetch(`${SUPA_URL}${path}`, { ...opts, headers });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || err.msg || res.statusText); }
  return res.json();
}

async function supaAuth(email, password) {
  const res = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
    method: "POST", headers: { apikey: SUPA_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Authentication failed");
  return data;
}

// ─── Tabs config ───
const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "crm", label: "CRM", icon: Target },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "agents", label: "Agents", icon: Sparkles },
  { id: "meetings", label: "Meetings", icon: Calendar },
  { id: "marketing", label: "Marketing", icon: TrendingUp },
  { id: "framework", label: "Framework", icon: Layers },
  { id: "engage", label: "Engage OS", icon: Network },
  { id: "admin", label: "Admin", icon: Settings, adminOnly: true },
  { id: "setup", label: "DB Setup", icon: Database, adminOnly: true },
];

// ═══════════════════════════════════════════
//  AUTH SCREEN
// ═══════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !pwd) { setErr("Enter your email and password."); return; }
    setLoading(true); setErr("");
    try {
      const data = await supaAuth(email, pwd);
      onLogin(data);
    } catch (ex) { setErr(ex.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0D1B1E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: 380, background: "#fff", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #00879F, #00D49C, #D0F94A)" }} />
        <div style={{ padding: "40px 36px 36px" }}>
          <div style={{ fontFamily: "'Optician Sans', 'DM Sans', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>COMPASS</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#999", letterSpacing: "0.15em", marginBottom: 28 }}>STAGING ENVIRONMENT</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#999", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="you@humain.com"
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #e8e8e8", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#999", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input type={showPwd ? "text" : "password"} value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #e8e8e8", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              <button onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {err && <div style={{ color: "#FF4B4B", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(255,75,75,0.06)", borderRadius: 8 }}>{err}</div>}
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#0D1B1E", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  PIPELINE KANBAN
// ═══════════════════════════════════════════
function PipelineKanban({ deals }) {
  const grouped = STAGES.reduce((acc, s) => { acc[s] = deals.filter(d => d.stage === s && d.status === "Active"); return acc; }, {});
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, gap: 0, border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
      {STAGES.map(stage => (
        <div key={stage} style={{ borderRight: stage !== "Expansion" ? "1px solid var(--border)" : "none", minHeight: 200 }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.08em", color: STAGE_COLORS[stage], fontWeight: 600 }}>{stage.toUpperCase()}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--muted)", background: "var(--panel2)", padding: "2px 8px", borderRadius: 4 }}>{grouped[stage].length}</span>
          </div>
          <div style={{ padding: 8 }}>
            {grouped[stage].map(d => (
              <div key={d.id} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", marginBottom: 6, cursor: "pointer", transition: "all .2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "var(--text)" }}>{d.client_name}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--muted)" }}>{d.sector || "—"}</div>
                {d.expected_value > 0 && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#00879F", marginTop: 4 }}>SAR {Number(d.expected_value).toLocaleString()}</div>}
              </div>
            ))}
            {grouped[stage].length === 0 && <div style={{ textAlign: "center", padding: 20, color: "var(--muted)", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>No deals</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
//  AI CHAT
// ═══════════════════════════════════════════
function AIChat({ deals, profile, claudeKey }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput(""); setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    const activeDeals = deals.filter(d => d.status === "Active");
    const systemPrompt = `You are COMPASS AI, the intelligence assistant for HUMAIN's sovereign AI CRM. User: ${profile?.full_name}. Active deals: ${activeDeals.length}. Pipeline value: SAR ${activeDeals.reduce((s, d) => s + (d.expected_value || 0), 0).toLocaleString()}. Sectors covered: ${[...new Set(activeDeals.map(d => d.sector).filter(Boolean))].join(", ") || "none yet"}. Be concise, strategic, use sector intelligence. This is the STAGING environment.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: systemPrompt,
          messages: [...messages.slice(-10), { role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text || "").join("") || "No response";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (ex) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error: " + ex.message }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", background: "var(--card-bg)" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,135,159,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00879F" }}>
          <MessageSquare size={14} />
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.05em", color: "var(--muted)" }}>COMPASS AI — STAGING</span>
      </div>
      <div style={{ height: 300, overflowY: "auto", padding: "16px 18px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 60, color: "var(--muted)" }}>
            <MessageSquare size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
            <div style={{ fontSize: 13 }}>Ask about deals, pipeline health, or strategy</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.6,
              background: m.role === "user" ? "#0D1B1E" : "rgba(0,135,159,0.06)",
              color: m.role === "user" ? "#fff" : "var(--text)",
              border: m.role === "assistant" ? "1px solid rgba(0,135,159,0.12)" : "none",
            }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ color: "var(--muted)", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>Thinking...</div>}
        <div ref={chatEnd} />
      </div>
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask COMPASS AI..." style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, outline: "none", background: "var(--panel2)", color: "var(--text)" }} />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          style={{ padding: "10px 14px", background: "#00879F", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", opacity: loading || !input.trim() ? 0.5 : 1 }}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  PLACEHOLDER TAB
// ═══════════════════════════════════════════
function PlaceholderTab({ label, icon: Icon }) {
  return (
    <div style={{ textAlign: "center", paddingTop: 80 }}>
      <Icon size={32} style={{ color: "var(--muted)", opacity: 0.3, marginBottom: 12 }} />
      <div style={{ fontFamily: "'Optician Sans', 'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>{label}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em" }}>STAGING — MODULE COMING SOON</div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [deals, setDeals] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [claudeKey, setClaudeKey] = useState("");

  const token = session?.access_token;
  const isAdmin = profile?.role === "admin";

  // Load profile + data after auth
  useEffect(() => {
    if (!token) return;
    const uid = session.user?.id;
    // Load profile
    supaFetch(`/rest/v1/profiles?id=eq.${uid}&select=*`, token, { headers: { Prefer: "return=representation" } })
      .then(data => { if (data?.[0]) setProfile(data[0]); })
      .catch(console.error);
    // Load deals
    supaFetch("/rest/v1/deals?select=*&order=updated_at.desc", token)
      .then(data => setDeals(data || []))
      .catch(console.error);
    // Load Claude key
    supaFetch("/rest/v1/system_config?config_key=eq.claude_api_key&select=config_value", token)
      .then(data => { if (data?.[0]?.config_value) setClaudeKey(data[0].config_value.trim()); })
      .catch(() => {});
  }, [token]);

  // Theme CSS vars
  const theme = dark ? {
    "--bg": "#0D1B1E", "--panel": "#111F22", "--panel2": "#162629", "--card-bg": "#162629",
    "--text": "#E8F0F0", "--sub": "#8AA0A6", "--muted": "#5A7278", "--dim": "#4A6268",
    "--border": "rgba(255,255,255,0.08)", "--nav-bg": "#0D1B1E",
  } : {
    "--bg": "#EEF3F0", "--panel": "#FFFFFF", "--panel2": "#F4F8F5", "--card-bg": "#FFFFFF",
    "--text": "#0a0a0a", "--sub": "#555", "--muted": "#8A9BAA", "--dim": "#6B8088",
    "--border": "rgba(0,0,0,0.08)", "--nav-bg": "#FFFFFF",
  };

  if (!session) return <AuthScreen onLogin={setSession} />;

  const name = profile?.full_name || session.user?.email?.split("@")[0] || "User";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const activeDeals = deals.filter(d => d.status === "Active");
  const pipelineVal = activeDeals.reduce((s, d) => s + (d.expected_value || 0), 0);

  const renderTab = () => {
    const TabIcon = TABS.find(t => t.id === activeTab)?.icon || Home;
    switch (activeTab) {
      case "home": return (
        <div>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "'Optician Sans', 'DM Sans', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>
              {greeting}, {name.split(" ")[0]}
            </div>
            <div style={{ fontSize: 14, color: "var(--muted)" }}>Your sovereign intelligence layer is ready.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { val: activeDeals.length, label: "ACTIVE DEALS", color: "#00879F" },
              { val: `SAR ${(pipelineVal / 1e6).toFixed(1)}M`, label: "PIPELINE VALUE", color: "#00D49C" },
              { val: `${activeDeals.length > 0 ? Math.round(activeDeals.filter(d => d.stage === "Expansion").length / activeDeals.length * 100) : 0}%`, label: "WIN RATE", color: "#D0F94A" },
              { val: SECTORS.filter(s => activeDeals.some(d => d.sector === s)).length, label: "SECTORS ACTIVE", color: "#00879F" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Optician Sans', 'DM Sans', sans-serif", fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.12em", color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <AIChat deals={deals} profile={profile} claudeKey={claudeKey} />
        </div>
      );
      case "crm": return (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Optician Sans', 'DM Sans', sans-serif", fontSize: 22, fontWeight: 800 }}>Pipeline</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{activeDeals.length} active deals · SAR {pipelineVal.toLocaleString()}</div>
            </div>
          </div>
          <PipelineKanban deals={deals} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", marginBottom: 12 }}>ALL DEALS ({deals.length})</div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Client", "Sector", "Stage", "Value", "Score", "Updated"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--muted)", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.slice(0, 50).map(d => (
                  <tr key={d.id} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,135,159,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 14px", fontWeight: 600 }}>{d.client_name}</td>
                    <td style={{ padding: "10px 14px", color: "var(--sub)" }}>{d.sector || "—"}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, padding: "3px 8px", borderRadius: 4, background: `${STAGE_COLORS[d.stage] || "#999"}15`, color: STAGE_COLORS[d.stage] || "#999", fontWeight: 500 }}>
                        {d.stage}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: "'DM Mono', monospace", color: "var(--sub)" }}>{d.expected_value > 0 ? `SAR ${Number(d.expected_value).toLocaleString()}` : "—"}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "'DM Mono', monospace", color: d.deal_score >= 70 ? "#00D49C" : d.deal_score >= 40 ? "#FFB800" : "var(--muted)" }}>{d.deal_score || "—"}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--muted)" }}>{d.updated_at ? new Date(d.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      default: return <PlaceholderTab label={TABS.find(t => t.id === activeTab)?.label || activeTab} icon={TabIcon} />;
    }
  };

  return (
    <div style={{ ...theme, fontFamily: "'DM Sans', sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh", display: "flex" }}>
      {/* ─── SIDEBAR ─── */}
      <nav style={{
        width: sidebarOpen ? 220 : 64, background: "var(--nav-bg)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", transition: "width .3s cubic-bezier(0.16,1,0.3,1)",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? "18px 18px 12px" : "18px 12px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #00879F, #00D49C, #D0F94A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>C</div>
          {sidebarOpen && <span style={{ fontFamily: "'Optician Sans', 'DM Sans', sans-serif", fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>COMPASS</span>}
        </div>

        {/* Tabs */}
        <div style={{ flex: 1, padding: "8px 8px", overflowY: "auto" }}>
          {TABS.filter(t => !t.adminOnly || isAdmin).map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: sidebarOpen ? "9px 12px" : "9px 0", justifyContent: sidebarOpen ? "flex-start" : "center",
                  background: active ? "rgba(0,135,159,0.08)" : "transparent",
                  border: "none", borderRadius: 8, cursor: "pointer", marginBottom: 2,
                  color: active ? "#00879F" : "var(--dim)", transition: "all .2s ease",
                }}>
                <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                {sidebarOpen && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>{t.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Theme + User */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 8, justifyContent: "center" }}>
            <button onClick={() => setDark(false)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: !dark ? "rgba(0,135,159,0.1)" : "transparent", color: !dark ? "#00879F" : "var(--muted)" }}><Sun size={14} /></button>
            <button onClick={() => setDark(true)} style={{ padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: dark ? "rgba(0,135,159,0.1)" : "transparent", color: dark ? "#00879F" : "var(--muted)" }}><Moon size={14} /></button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 4px" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(0,135,159,0.08)", border: "2px solid rgba(0,135,159,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#00879F", flexShrink: 0 }}>
              {name[0]?.toUpperCase()}
            </div>
            {sidebarOpen && (
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{name}</div>
                {isAdmin && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#D0F94A", letterSpacing: "0.08em" }}>ADMIN</div>}
              </div>
            )}
          </div>
          <button onClick={() => { setSession(null); setProfile(null); setDeals([]); }}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: 8, padding: "8px 12px", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 12, borderRadius: 6 }}>
            <LogOut size={14} />
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </nav>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? 220 : 64, padding: "28px 36px 80px", transition: "margin-left .3s cubic-bezier(0.16,1,0.3,1)", maxWidth: 1100 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#FFB800", letterSpacing: "0.12em", marginBottom: 20, padding: "6px 12px", background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.12)", borderRadius: 6, display: "inline-block" }}>
          ⚠ STAGING ENVIRONMENT — Connected to live Supabase
        </div>
        {renderTab()}
      </main>
    </div>
  );
}
