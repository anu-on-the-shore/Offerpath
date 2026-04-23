import { useState, useEffect, useRef } from "react";

/* ── FONTS & GLOBAL CSS ─────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,700;0,800;1,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #07091a; color: #e2e8f0; overflow-x: hidden; }
  textarea, input, select { font-family: inherit; outline: none; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #07091a; }
  ::-webkit-scrollbar-thumb { background: #2d3a6b; border-radius: 3px; }

  @keyframes fadeUp   { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulse    { 0%,100% { opacity: .4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
  @keyframes glow     { 0%,100% { box-shadow: 0 0 20px rgba(99,102,241,.3); } 50% { box-shadow: 0 0 40px rgba(99,102,241,.6); } }
  @keyframes twinkle  { 0%,100% { opacity: 0; } 50% { opacity: .6; } }
  @keyframes pathDraw { from { stroke-dashoffset: 300; } to { stroke-dashoffset: 0; } }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff; border: none; border-radius: 10px;
    padding: 13px 28px; font-weight: 700; font-size: 15px;
    cursor: pointer; font-family: inherit; transition: all .25s;
    letter-spacing: .01em;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,.45); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { background: #334155; color: #64748b; cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-ghost {
    background: rgba(255,255,255,.06); color: #94a3b8;
    border: 1px solid rgba(255,255,255,.1); border-radius: 10px;
    padding: 11px 24px; font-weight: 600; font-size: 14px;
    cursor: pointer; font-family: inherit; transition: all .2s;
  }
  .btn-ghost:hover { background: rgba(255,255,255,.1); color: #e2e8f0; border-color: rgba(255,255,255,.2); }

  .glass {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    transition: border-color .25s, box-shadow .25s;
  }
  .glass:hover { border-color: rgba(99,102,241,.3); box-shadow: 0 4px 28px rgba(99,102,241,.08); }

  .input-dark {
    width: 100%; background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1); border-radius: 10px;
    padding: 12px 16px; font-size: 14px; color: #e2e8f0;
    transition: all .2s; resize: vertical; display: block;
  }
  .input-dark::placeholder { color: #3d4f6b; }
  .input-dark:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.15) !important; }

  .label { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #64748b; margin-bottom: 8px; display: block; }

  .glass.service-card { cursor: pointer; }
  .glass.service-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(99,102,241,.15); }

  .expandable { border: 1px solid rgba(255,255,255,.08); border-radius: 12px; overflow: hidden; transition: border-color .2s; background: rgba(255,255,255,.03); }
  .expandable:hover { border-color: rgba(99,102,241,.3); }

  .tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: .04em; }

  .back-btn { display: inline-flex; align-items: center; gap: 8px; color: #818cf8; font-weight: 600; font-size: 14px; cursor: pointer; border: none; background: none; font-family: inherit; padding: 0; transition: all .2s; }
  .back-btn:hover { color: #a5b4fc; gap: 12px; }

  .stat-card { transition: transform .25s, box-shadow .25s; }
  .stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 36px rgba(0,0,0,.3); }
`;

/* ── DATA ───────────────────────────────────────────────────── */
const QUOTES = [
  { text: "The offer letter already exists. You just have to go earn it.", attr: "OfferPath" },
  { text: "Preparation is not cheating — it's respect for the opportunity.", attr: "Career Wisdom" },
  { text: "Your story is the most powerful thing in that room. Own every word.", attr: "OfferPath" },
  { text: "Walk in like you already work there. Because soon, you will.", attr: "Career Wisdom" },
  { text: "Nervousness and excitement feel identical. Choose excitement.", attr: "OfferPath" },
  { text: "Every job you've ever wanted, you got. This one is next.", attr: "OfferPath" },
  { text: "They don't just hire skills. They hire the person behind the story.", attr: "Career Wisdom" },
  { text: "You've survived 100% of your hardest days. An interview is not one of them.", attr: "OfferPath" },
];

const LAYOFF_STATS = [
  { num: "262,000+", label: "Tech workers laid off in 2024", color: "#f87171", sub: "That's 700+ people every single day." },
  { num: "5–6 months", label: "Average job search duration", color: "#fb923c", sub: "Up from 3.5 months in 2022." },
  { num: "47%", label: "Applicants ghosted after applying", color: "#facc15", sub: "No response. No feedback. Nothing." },
  { num: "73%", label: "Roles filled via network or referral", color: "#a78bfa", sub: "Cold applications rarely make the cut." },
];

const MARKET_TRENDS = [
  { icon: "🤖", title: "AI is Filtering You Out — Before a Human Sees Your Resume", desc: "Over 75% of resumes are rejected by Applicant Tracking Systems before a recruiter lays eyes on them. If your resume doesn't match keywords precisely, you never existed.", color: "rgba(239,68,68,.08)", border: "rgba(239,68,68,.2)" },
  { icon: "📉", title: "The Mid-Level Crunch is Squeezing the Most Experienced Candidates", desc: "Roles for 3–8 years of experience dropped by 34% in 2024. Companies are polarising — hiring cheap juniors or expensive seniors, leaving the middle to fight over scraps.", color: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.2)" },
  { icon: "🌍", title: "Remote Work is No Longer a Given — It's a Privilege", desc: "Only 12% of new job postings offer fully remote work, down from 32% in 2022. Return-to-office is eliminating flexibility that millions of candidates built their lives around.", color: "rgba(99,102,241,.08)", border: "rgba(99,102,241,.2)" },
  { icon: "⚡", title: "The First 24 Hours After Applying Are Make or Break", desc: "68% of offers go to candidates who respond quickly, follow up confidently, and walk into interviews already prepared. Waiting to prepare is the biggest mistake you can make.", color: "rgba(16,185,129,.08)", border: "rgba(16,185,129,.2)" },
];

const SERVICES = [
  {
    id: "match",
    icon: "🎯",
    title: "Job Match Score",
    tagline: "Know your fit before you apply",
    desc: "Paste your resume and a job description. Get your match %, ATS score, skill gaps, missing keywords, and a tailored opening pitch.",
    accentColor: "#818cf8",
    gradient: "linear-gradient(135deg, rgba(99,102,241,.12), rgba(139,92,246,.04))",
    border: "rgba(99,102,241,.3)",
  },
  {
    id: "prep",
    icon: "📋",
    title: "Interview Prep",
    tagline: "Walk in with stories they'll remember",
    desc: "Generate powerful STAR stories from your resume + tailored interview Q&A with model answers — specific to the role you're applying for.",
    accentColor: "#67e8f9",
    gradient: "linear-gradient(135deg, rgba(6,182,212,.12), rgba(14,165,233,.04))",
    border: "rgba(6,182,212,.3)",
  },
  {
    id: "roles",
    icon: "🔍",
    title: "Role Finder",
    tagline: "Stop applying randomly. Target precisely.",
    desc: "Enter your skills and experience. Get AI-matched role recommendations with fit scores, salary benchmarks, and live job openings pulled from the web.",
    accentColor: "#6ee7b7",
    gradient: "linear-gradient(135deg, rgba(16,185,129,.12), rgba(5,150,105,.04))",
    border: "rgba(16,185,129,.3)",
  },
];

/* ── API ────────────────────────────────────────────────────── */
const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

const callAI = async (system, userMsg, useSearch = false) => {
  const body = { model: MODEL, max_tokens: 4000, system, messages: [{ role: "user", content: userMsg }] };
  if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  const r = await fetch(API_URL, { method: "POST", headers: {"Content-Type": "application/json","x-api-key": window.__OFFERPATH_KEY__ || "","anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true"},body: JSON.stringify(body) });
  const d = await r.json();
  return d.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "";
};

const callAIwithPDF = async (sys, b64, msg) => {
  const r = await fetch(API_URL, { method: "POST", headers: {"Content-Type": "application/json", "x-api-key": window.__OFFERPATH_KEY__ || "","anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true"
}, body: JSON.stringify({ model: MODEL, max_tokens: 4000, system: sys, messages: [{ role: "user", content: [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } }, { type: "text", text: msg }] }] }) });
  return (await r.json()).content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "";
};

const pdfToB64 = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej; r.readAsDataURL(f); });
const safeJSON = t => { try { return JSON.parse(t.replace(/```json|```/g, "").trim()); } catch { return null; } };

/* ── SHARED UI ──────────────────────────────────────────────── */
function Stars() {
  const pts = Array.from({ length: 90 }, (_, i) => ({ id: i, x: Math.random()*100, y: Math.random()*100, s: Math.random()*1.6+.4, d: Math.random()*3+2, delay: Math.random()*5 }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {pts.map(p => <div key={p.id} style={{ position:"absolute", left:`${p.x}%`, top:`${p.y}%`, width:p.s, height:p.s, borderRadius:"50%", background:"#c7d2fe", opacity:0, animation:`twinkle ${p.d}s ${p.delay}s infinite` }} />)}
    </div>
  );
}

function Logo({ size = "md" }) {
  const sizes = { sm: { logo: 28, font: 15, sub: false }, md: { logo: 36, font: 19, sub: true }, lg: { logo: 52, font: 28, sub: true } };
  const s = sizes[size];
  return (
    <div style={{ display:"flex", alignItems:"center", gap: size==="lg"?14:10 }}>
      <div style={{ width:s.logo, height:s.logo, borderRadius: size==="lg"?14:10, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:s.logo*.48, animation:"glow 4s infinite", flexShrink:0 }}>
        ✦
      </div>
      <div>
        <div style={{ fontWeight:800, fontSize:s.font, letterSpacing:"-.02em", color:"#f1f5f9", lineHeight:1 }}>
          <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Offer</span>
          <span style={{ color:"#f1f5f9" }}>Path</span>
        </div>
        {s.sub && <div style={{ fontSize:10, color:"#475569", marginTop:3, fontWeight:600, letterSpacing:".06em" }}>AI CAREER PLATFORM</div>}
      </div>
    </div>
  );
}

function Spinner({ size = 28 }) {
  return <div style={{ width:size, height:size, border:"2.5px solid rgba(255,255,255,.08)", borderTopColor:"#6366f1", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} />;
}

function Badge({ children, color = "indigo" }) {
  const map = { indigo:["rgba(99,102,241,.15)","#a5b4fc","rgba(99,102,241,.3)"], cyan:["rgba(6,182,212,.15)","#67e8f9","rgba(6,182,212,.3)"], green:["rgba(16,185,129,.15)","#6ee7b7","rgba(16,185,129,.3)"], amber:["rgba(245,158,11,.15)","#fcd34d","rgba(245,158,11,.3)"], red:["rgba(239,68,68,.15)","#fca5a5","rgba(239,68,68,.3)"], slate:["rgba(100,116,139,.12)","#64748b","rgba(100,116,139,.25)"] };
  const [bg,text,border] = map[color]||map.indigo;
  return <span className="tag" style={{ background:bg, color:text, border:`1px solid ${border}` }}>{children}</span>;
}

function Loader({ msg, sub }) {
  return (
    <div style={{ textAlign:"center", padding:"90px 24px", position:"relative", zIndex:1 }}>
      <div style={{ position:"relative", width:56, height:56, margin:"0 auto 24px" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(99,102,241,.15)", animation:"spin 3s linear infinite" }} />
        <div style={{ position:"absolute", inset:4, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#6366f1", animation:"spin 1s linear infinite" }} />
        <div style={{ position:"absolute", inset:12, borderRadius:"50%", border:"1.5px solid transparent", borderTopColor:"#a78bfa", animation:"spin .6s linear infinite reverse" }} />
        <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✦</span>
      </div>
      <p style={{ fontWeight:700, color:"#f1f5f9", fontSize:17, marginBottom:6 }}>{msg}</p>
      {sub && <p style={{ color:"#475569", fontSize:14 }}>{sub}</p>}
    </div>
  );
}

function QuoteRotator() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i+1)%QUOTES.length); setVis(true); }, 450);
    }, 5500);
    return () => clearInterval(t);
  }, []);
  const q = QUOTES[idx];
  return (
    <div style={{ transition:"opacity .45s", opacity:vis?1:0, minHeight:88, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(16px,2.5vw,21px)", fontStyle:"italic", color:"#c7d2fe", lineHeight:1.6, marginBottom:10, maxWidth:560, textAlign:"center" }}>
        "{q.text}"
      </p>
      <p style={{ fontSize:12, color:"#6366f1", fontWeight:700, letterSpacing:".05em" }}>— {q.attr}</p>
    </div>
  );
}

/* ── LANDING PAGE ───────────────────────────────────────────── */
function Landing({ onGo }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ position:"relative", zIndex:1 }}>

      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:50, padding:"0 32px", height:66, display:"flex", alignItems:"center", justifyContent:"space-between", background:scrolled?"rgba(7,9,26,.92)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?"1px solid rgba(255,255,255,.07)":"none", transition:"all .35s" }}>
        <Logo size="md" />
        <button className="btn-primary" onClick={() => onGo("services")} style={{ padding:"9px 22px", fontSize:14 }}>Get Started →</button>
      </nav>

      {/* HERO */}
      <section style={{ padding:"90px 24px 70px", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"80%", height:"70%", background:"radial-gradient(ellipse, rgba(99,102,241,.1) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.25)", borderRadius:40, padding:"6px 18px", marginBottom:30, animation:"fadeUp .6s ease" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#6366f1", display:"inline-block", animation:"pulse 1.6s infinite" }} />
          <span style={{ fontSize:11, color:"#a5b4fc", fontWeight:700, letterSpacing:".08em" }}>THE JOB MARKET IS THE TOUGHEST IT'S BEEN IN A DECADE</span>
        </div>

        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(40px,6.5vw,76px)", fontWeight:800, lineHeight:1.08, marginBottom:22, animation:"fadeUp .6s .1s both", maxWidth:820, margin:"0 auto 22px" }}>
          <span style={{ color:"#f1f5f9" }}>Your Career Deserves<br/>a Smarter</span>{" "}
          <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc,#f472b6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Path.</span>
        </h1>

        <p style={{ fontSize:"clamp(15px,2vw,18px)", color:"#64748b", maxWidth:540, margin:"0 auto 44px", lineHeight:1.75, animation:"fadeUp .6s .2s both" }}>
          OfferPath gives you the tools serious candidates use — job fit analysis, STAR stories, role targeting, and real market intelligence. All in one place.
        </p>

        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", animation:"fadeUp .6s .3s both" }}>
          <button className="btn-primary" onClick={() => onGo("services")} style={{ fontSize:16, padding:"15px 38px" }}>Find Your Path →</button>
          <button className="btn-ghost" onClick={() => document.getElementById("reality").scrollIntoView({ behavior:"smooth" })}>See the Reality ↓</button>
        </div>

        <p style={{ marginTop:22, fontSize:13, color:"#334155", animation:"fadeUp .6s .4s both" }}>Free to use · No sign-up required · Powered by Claude AI</p>
      </section>

      {/* STATS */}
      <section style={{ padding:"10px 24px 70px" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <p style={{ textAlign:"center", fontSize:11, fontWeight:700, letterSpacing:".12em", color:"#334155", marginBottom:22 }}>THE NUMBERS EVERY JOB SEEKER NEEDS TO SEE</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14 }}>
            {LAYOFF_STATS.map((s, i) => (
              <div key={i} className="glass stat-card" style={{ padding:"26px 20px", textAlign:"center", animation:`fadeUp .5s ${i*.09}s both` }}>
                <p style={{ fontSize:"clamp(26px,4vw,38px)", fontWeight:800, color:s.color, marginBottom:6, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.num}</p>
                <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.45, marginBottom:6 }}>{s.label}</p>
                <p style={{ fontSize:11, color:"#334155", fontStyle:"italic" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET REALITY */}
      <section id="reality" style={{ padding:"10px 24px 80px" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", color:"#6366f1", marginBottom:12 }}>WHAT'S ACTUALLY HAPPENING OUT THERE</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", lineHeight:1.2 }}>The Market Has Shifted.<br/>Most Candidates Haven't.</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:16 }}>
            {MARKET_TRENDS.map((t, i) => (
              <div key={i} className="glass" style={{ padding:"26px 24px", background:t.color, borderColor:t.border, animation:`fadeUp .5s ${i*.09}s both` }}>
                <span style={{ fontSize:30, display:"block", marginBottom:14 }}>{t.icon}</span>
                <h3 style={{ fontWeight:700, fontSize:14, color:"#e2e8f0", marginBottom:10, lineHeight:1.4 }}>{t.title}</h3>
                <p style={{ fontSize:13, color:"#64748b", lineHeight:1.7 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HUMAN COST */}
      <section style={{ padding:"10px 24px 80px" }}>
        <div style={{ maxWidth:880, margin:"0 auto" }}>
          <div className="glass" style={{ padding:"52px 44px", textAlign:"center", background:"rgba(239,68,68,.03)", borderColor:"rgba(239,68,68,.18)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent 0%,#ef4444 50%,transparent 100%)" }} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent 0%,rgba(239,68,68,.3) 50%,transparent 100%)" }} />
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", color:"#f87171", marginBottom:18 }}>THE HUMAN COST BEHIND EVERY STATISTIC</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(20px,3.5vw,34px)", color:"#fca5a5", fontWeight:700, lineHeight:1.4, marginBottom:26, maxWidth:620, margin:"0 auto 26px" }}>
              "Every single day, over 700 people wake up, open their laptop, and discover they no longer have a job."
            </h2>
            <p style={{ fontSize:15, color:"#64748b", lineHeight:1.8, maxWidth:620, margin:"0 auto 32px" }}>
              In 2024, <strong style={{ color:"#f87171" }}>262,000 tech workers</strong> were laid off globally. These aren't statistics — they're product managers, engineers, analysts, and operators who built careers over a decade, now competing with thousands of equally qualified people for a fraction of the roles.
              <br /><br />
              The average job search now takes <strong style={{ color:"#f87171" }}>5–6 months</strong>. Savings run thin. Confidence erodes. And the brutal truth is — most candidates are applying without knowing their fit score, walking into interviews without prepared stories, or targeting the wrong roles entirely.
              <br /><br />
              <strong style={{ color:"#fca5a5" }}>OfferPath was built for this exact moment.</strong>
            </p>
            <button className="btn-primary" onClick={() => onGo("services")} style={{ fontSize:15, padding:"14px 36px" }}>Start Your OfferPath →</button>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section style={{ padding:"10px 24px 80px" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:46 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", color:"#6366f1", marginBottom:12 }}>YOUR TOOLKIT</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", marginBottom:10 }}>Three Tools.<br/>One Unfair Advantage.</h2>
            <p style={{ fontSize:15, color:"#64748b", maxWidth:440, margin:"0 auto" }}>Most candidates use none of these. That's exactly why you should use all three.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))", gap:18 }}>
            {SERVICES.map((s, i) => (
              <div key={s.id} className="glass service-card" onClick={() => onGo(s.id)} style={{ padding:"30px 26px", background:s.gradient, borderColor:s.border, animation:`fadeUp .5s ${i*.1}s both`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-30, right:-30, width:100, height:100, borderRadius:"50%", background:`${s.accentColor}08`, pointerEvents:"none" }} />
                <span style={{ fontSize:34, display:"block", marginBottom:16 }}>{s.icon}</span>
                <h3 style={{ fontWeight:800, fontSize:18, color:"#f1f5f9", marginBottom:6 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:s.accentColor, fontWeight:600, marginBottom:12, letterSpacing:".01em" }}>{s.tagline}</p>
                <p style={{ fontSize:13, color:"#64748b", lineHeight:1.65, marginBottom:20 }}>{s.desc}</p>
                <span style={{ fontSize:13, fontWeight:700, color:s.accentColor, display:"flex", alignItems:"center", gap:6 }}>Open tool <span style={{ fontSize:16 }}>→</span></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE SECTION */}
      <section style={{ padding:"10px 24px 80px" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div className="glass" style={{ padding:"52px 44px", textAlign:"center", background:"rgba(99,102,241,.04)", borderColor:"rgba(99,102,241,.18)", position:"relative" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#6366f1,transparent)" }} />
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", color:"#6366f1", marginBottom:28 }}>WORDS TO CARRY INTO EVERY INTERVIEW</p>
            <QuoteRotator />
            <div style={{ marginTop:28, display:"flex", justifyContent:"center", gap:5 }}>
              {QUOTES.map((_, i) => <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:i===0?"#6366f1":"rgba(255,255,255,.12)" }} />)}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:"10px 24px 100px", textAlign:"center" }}>
        <div style={{ maxWidth:580, margin:"0 auto" }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", color:"#6366f1", marginBottom:16 }}>YOUR NEXT STEP</p>
          <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(30px,5vw,52px)", fontWeight:800, color:"#f1f5f9", marginBottom:14, lineHeight:1.15 }}>
            The Offer Letter<br />
            <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Already Exists.</span>
          </h2>
          <p style={{ fontSize:16, color:"#475569", marginBottom:34, lineHeight:1.7 }}>You just have to go earn it. Start with knowing your fit, owning your story, and targeting the right roles.</p>
          <button className="btn-primary" onClick={() => onGo("services")} style={{ fontSize:17, padding:"16px 46px" }}>Open OfferPath →</button>
        </div>
      </section>

      {/* FOOTER */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", padding:"28px 24px", textAlign:"center" }}>
        <Logo size="sm" />
        <p style={{ fontSize:12, color:"#1e293b", marginTop:14 }}>© 2025 OfferPath · Powered by Claude AI · Your data never leaves your browser session</p>
        <p style={{ fontSize:11, color:"#1e293b", marginTop:6 }}>Built for the 262,000+ people who deserve a smarter path forward.</p>
      </div>
    </div>
  );
}

/* ── SERVICES HUB ───────────────────────────────────────────── */
function ServicesHub({ onSelect, onBack }) {
  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:"48px 24px", animation:"fadeUp .4s ease", position:"relative", zIndex:1 }}>
      <button className="back-btn" onClick={onBack} style={{ marginBottom:36 }}>← Back to Home</button>
      <div style={{ marginBottom:44 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", color:"#6366f1", marginBottom:12 }}>OFFERPATH TOOLS</p>
        <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(28px,4vw,42px)", fontWeight:800, color:"#f1f5f9", marginBottom:10 }}>Where Would You Like to Start?</h2>
        <p style={{ fontSize:15, color:"#64748b" }}>Each tool is independent. Use one, use all three — your call.</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {SERVICES.map((s, i) => (
          <div key={s.id} className="glass service-card" onClick={() => onSelect(s.id)} style={{ padding:"28px 30px", display:"flex", alignItems:"center", gap:24, background:s.gradient, borderColor:s.border, animation:`fadeUp .4s ${i*.1}s both` }}>
            <span style={{ fontSize:38, flexShrink:0 }}>{s.icon}</span>
            <div style={{ flex:1 }}>
              <h3 style={{ fontWeight:800, fontSize:18, color:"#f1f5f9", marginBottom:4 }}>{s.title}</h3>
              <p style={{ fontSize:13, color:s.accentColor, fontWeight:600, marginBottom:6 }}>{s.tagline}</p>
              <p style={{ fontSize:13, color:"#64748b", lineHeight:1.55 }}>{s.desc}</p>
            </div>
            <span style={{ fontSize:24, color:s.accentColor, flexShrink:0 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── JOB MATCH TOOL ─────────────────────────────────────────── */
function JobMatchTool({ onBack }) {
  const [resumeMode, setResumeMode] = useState("paste");
  const [resumeText, setResumeText] = useState("");
  const [resumePDF, setResumePDF] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();
  const canGo = jd.trim().length > 50 && (resumeMode==="paste" ? resumeText.trim().length>80 : !!resumePDF);

  const analyze = async () => {
    setLoading(true); setResult(null);
    const sys = `You are a senior recruiter and ATS specialist. Analyze the resume-to-JD match and return ONLY JSON: {"overallScore":85,"verdict":"Strong Match|Good Match|Partial Match|Weak Match","summary":"2-sentence honest assessment","strengths":["strength1","strength2","strength3"],"gaps":["gap1","gap2","gap3"],"missingKeywords":["keyword1","keyword2","keyword3"],"atsScore":78,"pitchLine":"one powerful sentence this candidate should open with","topTip":"single most important improvement"}`;
    try {
      let b64 = null;
      if (resumeMode==="upload" && resumePDF) b64 = await pdfToB64(resumePDF);
      const raw = b64 ? await callAIwithPDF(sys, b64, `Analyze match against this JD:\n${jd}`) : await callAI(sys, `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jd}`);
      const p = safeJSON(raw); if (p) setResult(p);
    } catch { alert("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const score = result?.overallScore || 0;
  const scoreColor = score>=80?"#10b981":score>=60?"#f59e0b":"#ef4444";

  if (loading) return <Loader msg="Analyzing your fit for this role…" sub="Comparing skills, experience, keywords and ATS compatibility" />;

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"48px 24px", animation:"fadeUp .4s ease", position:"relative", zIndex:1 }}>
      <button className="back-btn" onClick={onBack} style={{ marginBottom:32 }}>← Back to Tools</button>
      <div style={{ marginBottom:30 }}>
        <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(24px,4vw,36px)", fontWeight:800, color:"#f1f5f9", marginBottom:8 }}>🎯 Job Match Score</h2>
        <p style={{ fontSize:14, color:"#64748b" }}>See exactly how well you fit a role before spending hours on your application.</p>
      </div>

      {!result && (
        <>
          <div className="glass" style={{ padding:24, marginBottom:14 }}>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[["paste","✏️ Paste Text"],["upload","📎 Upload PDF"]].map(([m,l]) => (
                <button key={m} onClick={() => setResumeMode(m)} style={{ padding:"8px 18px", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600, border:`1.5px solid ${resumeMode===m?"#6366f1":"rgba(255,255,255,.1)"}`, background:resumeMode===m?"rgba(99,102,241,.12)":"rgba(255,255,255,.03)", color:resumeMode===m?"#a5b4fc":"#64748b", transition:"all .2s" }}>{l}</button>
              ))}
            </div>
            <span className="label">Your Resume *</span>
            {resumeMode==="paste" ? (
              <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} className="input-dark" placeholder="Click here and paste your resume text (Ctrl+V on Windows, Cmd+V on Mac)…" style={{ minHeight:160, lineHeight:1.65 }} />
            ) : (
              <div onClick={() => fileRef.current.click()} style={{ border:`2px dashed ${resumePDF?"#6366f1":"rgba(255,255,255,.1)"}`, borderRadius:10, padding:30, textAlign:"center", cursor:"pointer", background:resumePDF?"rgba(99,102,241,.07)":"rgba(255,255,255,.02)", transition:"all .25s" }}>
                <input ref={fileRef} type="file" accept="application/pdf" onChange={e => { const f=e.target.files[0]; if(f?.type==="application/pdf") setResumePDF(f); }} style={{ display:"none" }} />
                <p style={{ fontSize:26, marginBottom:8 }}>{resumePDF?"✅":"📄"}</p>
                <p style={{ color:resumePDF?"#a5b4fc":"#64748b", fontWeight:600, fontSize:14 }}>{resumePDF ? resumePDF.name : "Click to upload your PDF resume"}</p>
                <p style={{ fontSize:12, color:"#334155", marginTop:4 }}>PDF only · max 5MB</p>
              </div>
            )}
          </div>

          <div className="glass" style={{ padding:24, marginBottom:20 }}>
            <span className="label">Job Description *</span>
            <textarea value={jd} onChange={e => setJd(e.target.value)} className="input-dark" placeholder="Paste the full job description here — the more complete it is, the better your analysis…" style={{ minHeight:140, lineHeight:1.65 }} />
          </div>

          <button className="btn-primary" onClick={analyze} disabled={!canGo} style={{ width:"100%", padding:14, fontSize:15 }}>Analyze My Fit →</button>
        </>
      )}

      {result && (
        <div style={{ animation:"fadeUp .4s ease" }}>
          <div className="glass" style={{ padding:"36px", textAlign:"center", marginBottom:18, background:`rgba(${score>=80?"16,185,129":score>=60?"245,158,11":"239,68,68"},.04)`, borderColor:`${scoreColor}33` }}>
            <p style={{ fontSize:72, fontWeight:800, color:scoreColor, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{score}%</p>
            <p style={{ fontSize:20, fontWeight:700, color:"#f1f5f9", marginTop:8 }}>{result.verdict}</p>
            <p style={{ fontSize:14, color:"#64748b", marginTop:10, maxWidth:460, margin:"10px auto 0", lineHeight:1.65 }}>{result.summary}</p>
            {result.atsScore && <div style={{ marginTop:16 }}><Badge color={result.atsScore>=70?"green":result.atsScore>=50?"amber":"red"}>ATS Score: {result.atsScore}%</Badge></div>}
          </div>

          {result.pitchLine && (
            <div className="glass" style={{ padding:"20px 24px", marginBottom:14, background:"rgba(99,102,241,.07)", borderColor:"rgba(99,102,241,.25)" }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", color:"#818cf8", marginBottom:8 }}>💬 YOUR OPENING LINE FOR THIS ROLE</p>
              <p style={{ fontSize:15, color:"#c7d2fe", fontStyle:"italic", lineHeight:1.6, fontFamily:"'Playfair Display',Georgia,serif" }}>"{result.pitchLine}"</p>
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            {result.strengths?.length>0 && (
              <div className="glass" style={{ padding:"20px" }}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", color:"#10b981", marginBottom:12 }}>✓ STRENGTHS</p>
                {result.strengths.map((s,i) => <p key={i} style={{ fontSize:13, color:"#64748b", marginBottom:7, paddingLeft:10, borderLeft:"2px solid #10b981", lineHeight:1.5 }}>{s}</p>)}
              </div>
            )}
            {result.gaps?.length>0 && (
              <div className="glass" style={{ padding:"20px" }}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", color:"#ef4444", marginBottom:12 }}>✗ GAPS</p>
                {result.gaps.map((g,i) => <p key={i} style={{ fontSize:13, color:"#64748b", marginBottom:7, paddingLeft:10, borderLeft:"2px solid #ef4444", lineHeight:1.5 }}>{g}</p>)}
              </div>
            )}
          </div>

          {result.missingKeywords?.length>0 && (
            <div className="glass" style={{ padding:"20px", marginBottom:14 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", color:"#f59e0b", marginBottom:12 }}>🔑 ADD THESE KEYWORDS TO YOUR RESUME</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {result.missingKeywords.map((k,i) => <Badge key={i} color="amber">{k}</Badge>)}
              </div>
            </div>
          )}

          {result.topTip && (
            <div className="glass" style={{ padding:"18px 22px", marginBottom:22, background:"rgba(139,92,246,.07)", borderColor:"rgba(139,92,246,.25)" }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", color:"#a78bfa", marginBottom:8 }}>⚡ #1 THING TO FIX RIGHT NOW</p>
              <p style={{ fontSize:14, color:"#c4b5fd", lineHeight:1.65 }}>{result.topTip}</p>
            </div>
          )}

          <button className="btn-ghost" onClick={() => setResult(null)} style={{ width:"100%" }}>← Analyze Another Role</button>
        </div>
      )}
    </div>
  );
}

/* ── INTERVIEW PREP TOOL ────────────────────────────────────── */
function StarCard({ story, index }) {
  const [open, setOpen] = useState(false);
  const secs = [{ k:"situation",c:"#0ea5e9",l:"SITUATION" },{ k:"task",c:"#a78bfa",l:"TASK" },{ k:"action",c:"#34d399",l:"ACTION" },{ k:"result",c:"#fbbf24",l:"RESULT" }];
  return (
    <div className="expandable" style={{ animation:`fadeUp .3s ${index*.07}s both` }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"rgba(99,102,241,.12)", border:"1px solid rgba(99,102,241,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#a5b4fc", flexShrink:0 }}>{index+1}</div>
          <div>
            <p style={{ fontWeight:700, color:"#f1f5f9", fontSize:14 }}>{story.title}</p>
            <p style={{ fontSize:12, color:"#6366f1", marginTop:2, fontWeight:600 }}>{story.competency}</p>
          </div>
        </div>
        <span style={{ color:"#334155", fontSize:20, transition:"transform .25s", transform:open?"rotate(45deg)":"none", flexShrink:0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding:"0 20px 20px", borderTop:"1px solid rgba(255,255,255,.05)", paddingTop:16, animation:"fadeIn .2s ease" }}>
          {secs.map(s => (
            <div key={s.k} style={{ marginBottom:14 }}>
              <span style={{ display:"inline-block", fontSize:10, fontWeight:700, letterSpacing:".08em", color:s.c, background:`${s.c}15`, padding:"2px 9px", borderRadius:4, marginBottom:7 }}>{s.l}</span>
              <p style={{ fontSize:14, color:"#64748b", lineHeight:1.7, paddingLeft:4 }}>{story[s.k]}</p>
            </div>
          ))}
          {story.metrics && <div style={{ padding:"12px 16px", borderRadius:8, background:"rgba(16,185,129,.07)", border:"1px solid rgba(16,185,129,.2)", marginTop:4 }}><p style={{ fontSize:11, fontWeight:700, color:"#34d399", letterSpacing:".06em", marginBottom:4 }}>📊 KEY METRIC</p><p style={{ fontSize:14, color:"#6ee7b7", fontWeight:600 }}>{story.metrics}</p></div>}
        </div>
      )}
    </div>
  );
}

function QACard({ item, index }) {
  const [open, setOpen] = useState(false);
  const dc = { Easy:"green", Medium:"amber", Hard:"red" }[item.difficulty]||"slate";
  return (
    <div className="expandable" style={{ animation:`fadeUp .3s ${index*.07}s both` }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"flex-start", gap:12, padding:"16px 20px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
        <div style={{ width:28, height:28, borderRadius:6, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#475569", flexShrink:0, marginTop:1 }}>Q{index+1}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontWeight:600, color:"#f1f5f9", fontSize:14, lineHeight:1.5 }}>{item.question}</p>
          <div style={{ marginTop:6 }}><Badge color={dc}>{item.difficulty}</Badge></div>
        </div>
        <span style={{ color:"#334155", fontSize:20, transition:"transform .25s", transform:open?"rotate(45deg)":"none", flexShrink:0, marginTop:2 }}>+</span>
      </button>
      {open && (
        <div style={{ padding:"0 20px 20px", borderTop:"1px solid rgba(255,255,255,.05)", paddingTop:16, animation:"fadeIn .2s ease", display:"flex", flexDirection:"column", gap:14 }}>
          <div><p style={{ fontSize:11, fontWeight:700, color:"#334155", letterSpacing:".08em", marginBottom:6 }}>WHY THEY ASK THIS</p><p style={{ fontSize:13, color:"#64748b", lineHeight:1.65 }}>{item.intent}</p></div>
          <div><p style={{ fontSize:11, fontWeight:700, color:"#6366f1", letterSpacing:".08em", marginBottom:6 }}>SUGGESTED ANSWER</p><p style={{ fontSize:14, color:"#94a3b8", lineHeight:1.7 }}>{item.suggestedAnswer}</p></div>
          {item.watchOut && <div style={{ padding:"12px 16px", borderRadius:8, background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.18)" }}><p style={{ fontSize:11, fontWeight:700, color:"#f87171", letterSpacing:".06em", marginBottom:4 }}>⚠ WATCH OUT</p><p style={{ fontSize:13, color:"#fca5a5", lineHeight:1.6 }}>{item.watchOut}</p></div>}
        </div>
      )}
    </div>
  );
}

function InterviewPrepTool({ onBack }) {
  const [resumeMode, setResumeMode] = useState("paste");
  const [resumeText, setResumeText] = useState("");
  const [resumePDF, setResumePDF] = useState(null);
  const [jd, setJd] = useState("");
  const [genMode, setGenMode] = useState("both");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [stars, setStars] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("star");
  const [done, setDone] = useState(false);
  const fileRef = useRef();
  const canGo = resumeMode==="paste" ? resumeText.trim().length>80 : !!resumePDF;

  const generate = async () => {
    setLoading(true); setStars([]); setQuestions([]); setDone(false);
    const starSys = `Elite career coach. Generate 5 rich STAR stories from this resume. Return ONLY JSON: {"stories":[{"title":"...","competency":"...","situation":"...","task":"...","action":"...","result":"...","metrics":"..."}]}`;
    const qaSys = `Expert interview coach. Generate 7 tailored questions with model answers. Return ONLY JSON: {"questions":[{"question":"...","difficulty":"Easy|Medium|Hard","intent":"...","suggestedAnswer":"...","watchOut":"..."}]}`;
    try {
      let b64 = null;
      if (resumeMode==="upload" && resumePDF) b64 = await pdfToB64(resumePDF);
      const jdPart = jd.trim() ? `\n\nJOB DESCRIPTION:\n${jd}` : "";
      if (genMode==="star"||genMode==="both") {
        setLoadMsg("Crafting your STAR stories…");
        const raw = b64 ? await callAIwithPDF(starSys, b64, "Generate STAR stories.") : await callAI(starSys, `RESUME:\n${resumeText}`);
        const p = safeJSON(raw); if (p?.stories) setStars(p.stories);
      }
      if (genMode==="questions"||genMode==="both") {
        setLoadMsg("Building your interview Q&A…");
        const raw = b64 ? await callAIwithPDF(qaSys, b64, `Generate interview questions.${jdPart}`) : await callAI(qaSys, `RESUME:\n${resumeText}${jdPart}`);
        const p = safeJSON(raw); if (p?.questions) setQuestions(p.questions);
      }
      setActiveTab(genMode==="questions"?"qa":"star"); setDone(true);
    } catch { alert("Something went wrong. Please try again."); }
    finally { setLoading(false); setLoadMsg(""); }
  };

  if (loading) return <Loader msg="Building your prep kit…" sub={loadMsg} />;

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"48px 24px", animation:"fadeUp .4s ease", position:"relative", zIndex:1 }}>
      <button className="back-btn" onClick={onBack} style={{ marginBottom:32 }}>← Back to Tools</button>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(24px,4vw,36px)", fontWeight:800, color:"#f1f5f9", marginBottom:8 }}>📋 Interview Prep Kit</h2>
        <p style={{ fontSize:14, color:"#64748b" }}>STAR stories + tailored Q&A built from your resume. Paste your resume below to start.</p>
      </div>

      {!done && (
        <>
          <div className="glass" style={{ padding:24, marginBottom:14 }}>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[["paste","✏️ Paste Text"],["upload","📎 Upload PDF"]].map(([m,l]) => (
                <button key={m} onClick={() => setResumeMode(m)} style={{ padding:"8px 18px", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600, border:`1.5px solid ${resumeMode===m?"#6366f1":"rgba(255,255,255,.1)"}`, background:resumeMode===m?"rgba(99,102,241,.12)":"rgba(255,255,255,.03)", color:resumeMode===m?"#a5b4fc":"#64748b", transition:"all .2s" }}>{l}</button>
              ))}
            </div>
            <span className="label">Resume *</span>
            {resumeMode==="paste" ? (
              <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} className="input-dark" placeholder="Click here and paste your full resume text (Ctrl+V on Windows · Cmd+V on Mac)…" style={{ minHeight:180, lineHeight:1.65 }} />
            ) : (
              <div onClick={() => fileRef.current.click()} style={{ border:`2px dashed ${resumePDF?"#6366f1":"rgba(255,255,255,.1)"}`, borderRadius:10, padding:30, textAlign:"center", cursor:"pointer", background:resumePDF?"rgba(99,102,241,.06)":"rgba(255,255,255,.01)", transition:"all .25s" }}>
                <input ref={fileRef} type="file" accept="application/pdf" onChange={e => { const f=e.target.files[0]; if(f?.type==="application/pdf") setResumePDF(f); }} style={{ display:"none" }} />
                <p style={{ fontSize:26, marginBottom:8 }}>{resumePDF?"✅":"📄"}</p>
                <p style={{ color:resumePDF?"#a5b4fc":"#64748b", fontWeight:600, fontSize:14 }}>{resumePDF ? resumePDF.name : "Click to upload your PDF resume"}</p>
                <p style={{ fontSize:12, color:"#334155", marginTop:4 }}>PDF only · max 5MB</p>
              </div>
            )}
          </div>

          <div className="glass" style={{ padding:24, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span className="label">Job Description</span>
              <Badge color="slate">Optional — improves Q&A quality</Badge>
            </div>
            <textarea value={jd} onChange={e => setJd(e.target.value)} className="input-dark" placeholder="Paste the job description for role-specific questions and tailored answers…" style={{ minHeight:110, lineHeight:1.65 }} />
          </div>

          <div style={{ marginBottom:22 }}>
            <span className="label">What to Generate</span>
            <div style={{ display:"flex", gap:10 }}>
              {[{ id:"both",e:"🔥",l:"Everything",s:"STAR + Q&A" },{ id:"star",e:"⭐",l:"STAR Stories",s:"Narratives only" },{ id:"questions",e:"🎯",l:"Interview Q&A",s:"Questions only" }].map(o => (
                <button key={o.id} onClick={() => setGenMode(o.id)} style={{ flex:1, padding:"13px 8px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", textAlign:"center", border:`1.5px solid ${genMode===o.id?"#6366f1":"rgba(255,255,255,.08)"}`, background:genMode===o.id?"rgba(99,102,241,.1)":"rgba(255,255,255,.02)", transition:"all .2s" }}>
                  <p style={{ fontSize:16, marginBottom:4 }}>{o.e}</p>
                  <p style={{ fontWeight:700, fontSize:12, color:genMode===o.id?"#a5b4fc":"#e2e8f0" }}>{o.l}</p>
                  <p style={{ fontSize:11, color:"#334155", marginTop:2 }}>{o.s}</p>
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={generate} disabled={!canGo} style={{ width:"100%", padding:14, fontSize:15 }}>Generate My Prep Kit →</button>
        </>
      )}

      {done && (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <h3 style={{ fontWeight:800, fontSize:17, color:"#f1f5f9" }}>Your Prep Kit is Ready ✓</h3>
              <p style={{ fontSize:13, color:"#475569", marginTop:3 }}>{stars.length>0&&`${stars.length} STAR stories`}{stars.length>0&&questions.length>0&&" · "}{questions.length>0&&`${questions.length} questions`}</p>
            </div>
            <button className="btn-ghost" onClick={() => { setDone(false); setStars([]); setQuestions([]); }} style={{ fontSize:13, padding:"8px 18px" }}>Start Over</button>
          </div>
          {genMode==="both" && (
            <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,.03)", borderRadius:8, padding:4, marginBottom:18 }}>
              {[{ id:"star",l:`⭐ STAR Stories (${stars.length})` },{ id:"qa",l:`🎯 Q&A (${questions.length})` }].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex:1, padding:"8px 12px", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600, transition:"all .2s", background:activeTab===t.id?"rgba(99,102,241,.15)":"transparent", color:activeTab===t.id?"#a5b4fc":"#64748b", boxShadow:activeTab===t.id?"inset 0 0 0 1px rgba(99,102,241,.3)":"none" }}>{t.l}</button>
              ))}
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {(activeTab==="star"||genMode==="star") && stars.map((s,i) => <StarCard key={i} story={s} index={i} />)}
            {(activeTab==="qa"||genMode==="questions") && questions.map((q,i) => <QACard key={i} item={q} index={i} />)}
          </div>
          <div style={{ marginTop:28, padding:"22px 26px", borderRadius:12, background:"rgba(99,102,241,.06)", border:"1px solid rgba(99,102,241,.18)", textAlign:"center" }}>
            <p style={{ fontSize:16, color:"#c7d2fe", fontStyle:"italic", fontFamily:"'Playfair Display',Georgia,serif" }}>"Walk in like you already work there. Because soon, you will."</p>
            <p style={{ fontSize:11, color:"#334155", marginTop:8, letterSpacing:".04em" }}>— OfferPath</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ROLE FINDER TOOL ───────────────────────────────────────── */
function RoleFinderTool({ onBack }) {
  const [skills, setSkills] = useState("");
  const [exp, setExp] = useState("3-5");
  const [currentRole, setCurrentRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [roles, setRoles] = useState(null);
  const [openings, setOpenings] = useState(null);
  const canGo = skills.trim().length > 10;

  const find = async () => {
    setLoading(true); setRoles(null); setOpenings(null);
    const sys = `Senior career strategist. Return ONLY JSON: {"roles":[{"title":"exact job title","fitScore":85,"why":"2-3 sentence explanation","topSkillsNeeded":["s1","s2","s3"],"salaryRange":"range","demand":"High|Medium|Growing","searchTip":"specific LinkedIn search tip"}]}`;
    try {
      setLoadMsg("Matching your profile to roles…");
      const raw = await callAI(sys, `Candidate:\nSkills: ${skills}\nExperience: ${exp} years\nCurrent role: ${currentRole}\nIndustry: ${industry}\n\nRecommend 4-5 best-fit roles.`);
      const p = safeJSON(raw);
      if (p?.roles) {
        setRoles(p.roles);
        setLoadMsg("Finding live job openings…");
        const jSys = `Job search assistant. Return ONLY JSON: {"openings":[{"title":"...","company":"...","location":"...","type":"Full-time|Remote|Hybrid","posted":"...","link":"...","snippet":"brief description"}]}`;
        const raw2 = await callAI(jSys, `Find 3-4 current openings for: ${p.roles.slice(0,3).map(r=>r.title).join(", ")}`, true);
        const p2 = safeJSON(raw2);
        if (p2?.openings) setOpenings(p2.openings);
      }
    } catch { alert("Something went wrong. Please try again."); }
    finally { setLoading(false); setLoadMsg(""); }
  };

  if (loading) return <Loader msg={loadMsg} sub="Scanning the market for the best fit roles…" />;

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"48px 24px", animation:"fadeUp .4s ease", position:"relative", zIndex:1 }}>
      <button className="back-btn" onClick={onBack} style={{ marginBottom:32 }}>← Back to Tools</button>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(24px,4vw,36px)", fontWeight:800, color:"#f1f5f9", marginBottom:8 }}>🔍 Role Finder</h2>
        <p style={{ fontSize:14, color:"#64748b" }}>Stop applying randomly. Tell us where you stand — we'll tell you where to aim.</p>
      </div>

      {!roles && (
        <div className="glass" style={{ padding:28 }}>
          <div style={{ marginBottom:18 }}>
            <span className="label">Your Skills *</span>
            <textarea value={skills} onChange={e => setSkills(e.target.value)} className="input-dark" placeholder="e.g. Product roadmapping, SQL, stakeholder management, Agile, data analysis, Go-to-market strategy…" style={{ minHeight:90, lineHeight:1.6 }} />
          </div>
          <div style={{ display:"flex", gap:14, marginBottom:18, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:130 }}>
              <span className="label">Years of Experience</span>
              <select value={exp} onChange={e => setExp(e.target.value)} className="input-dark" style={{ cursor:"pointer" }}>
                {["0-1","1-3","3-5","5-8","8-12","12+"].map(v => <option key={v} style={{ background:"#0f1729" }}>{v}</option>)}
              </select>
            </div>
            <div style={{ flex:1, minWidth:130 }}>
              <span className="label">Current / Last Role</span>
              <input value={currentRole} onChange={e => setCurrentRole(e.target.value)} className="input-dark" placeholder="e.g. Product Manager" />
            </div>
          </div>
          <div style={{ marginBottom:26 }}>
            <span className="label">Industry Preference</span>
            <input value={industry} onChange={e => setIndustry(e.target.value)} className="input-dark" placeholder="e.g. SaaS, Fintech, E-commerce — leave blank for all" />
          </div>
          <button className="btn-primary" onClick={find} disabled={!canGo} style={{ width:"100%", padding:14, fontSize:15 }}>Find My Best-Fit Roles →</button>
        </div>
      )}

      {roles && (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <h3 style={{ fontWeight:800, fontSize:16, color:"#f1f5f9" }}>Your Role Matches</h3>
            <button className="btn-ghost" onClick={() => { setRoles(null); setOpenings(null); }} style={{ fontSize:13, padding:"8px 18px" }}>Search Again</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
            {roles.map((r, i) => (
              <div key={i} className="glass" style={{ padding:"20px 24px", animation:`fadeUp .3s ${i*.07}s both` }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:10 }}>
                  <div>
                    <h4 style={{ fontWeight:700, color:"#f1f5f9", fontSize:15 }}>{r.title}</h4>
                    <p style={{ fontSize:13, color:"#6366f1", marginTop:3, fontWeight:600 }}>{r.salaryRange}</p>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <p style={{ fontSize:30, fontWeight:800, color:r.fitScore>=80?"#10b981":r.fitScore>=60?"#f59e0b":"#ef4444", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{r.fitScore}%</p>
                    <p style={{ fontSize:10, color:"#334155", marginTop:1, letterSpacing:".06em" }}>FIT</p>
                  </div>
                </div>
                <p style={{ fontSize:13, color:"#64748b", lineHeight:1.65, marginBottom:12 }}>{r.why}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  <Badge color={r.demand==="High"?"green":r.demand==="Growing"?"cyan":"amber"}>{r.demand} Demand</Badge>
                  {r.topSkillsNeeded?.map((s,j) => <Badge key={j} color="slate">{s}</Badge>)}
                </div>
                {r.searchTip && <p style={{ fontSize:12, color:"#334155", fontStyle:"italic", marginTop:10 }}>💡 {r.searchTip}</p>}
              </div>
            ))}
          </div>

          {openings?.length>0 && (
            <>
              <h3 style={{ fontWeight:700, fontSize:16, color:"#f1f5f9", marginBottom:14 }}>Live Openings</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
                {openings.map((j, i) => (
                  <div key={i} className="glass" style={{ padding:"18px 22px", animation:`fadeUp .3s ${i*.07}s both` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
                      <div style={{ flex:1 }}>
                        <h4 style={{ fontWeight:700, fontSize:14, color:"#f1f5f9" }}>{j.title}</h4>
                        <p style={{ fontSize:13, color:"#64748b", marginTop:3 }}>{j.company} · {j.location}</p>
                        {j.snippet && <p style={{ fontSize:13, color:"#475569", marginTop:6, lineHeight:1.5 }}>{j.snippet}</p>}
                        <div style={{ marginTop:8, display:"flex", gap:6, flexWrap:"wrap" }}>
                          {j.type && <Badge color="cyan">{j.type}</Badge>}
                          {j.posted && <Badge color="slate">{j.posted}</Badge>}
                        </div>
                      </div>
                      {j.link && j.link!=="..." && <a href={j.link} target="_blank" rel="noreferrer" style={{ padding:"8px 16px", borderRadius:8, border:"1px solid rgba(99,102,241,.3)", fontSize:12, fontWeight:700, color:"#a5b4fc", textDecoration:"none", whiteSpace:"nowrap", flexShrink:0, alignSelf:"flex-start", background:"rgba(99,102,241,.08)" }}>Apply →</a>}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:12, color:"#334155", textAlign:"center", fontStyle:"italic" }}>Cross-reference these on LinkedIn, Naukri, and company career pages for the latest listings.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── ROOT ───────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("landing");
const [apiKey, setApiKey] = useState("");
const [keyEntered, setKeyEntered] = useState(false);
const navigate = to => { setPage(to); window.scrollTo({ top:0, behavior:"smooth" }); };

  if (!keyEntered) return (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"#07091a", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
    <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:16, padding:"44px 40px", maxWidth:420, width:"90%", textAlign:"center" }}>
      <div style={{ fontSize:40, marginBottom:16 }}>✦</div>
      <h2 style={{ color:"#f1f5f9", fontWeight:800, fontSize:22, marginBottom:8 }}>Enter API Key to Launch</h2>
      <p style={{ color:"#64748b", fontSize:14, marginBottom:24, lineHeight:1.6 }}>Your Anthropic API key. Never stored — lives only in this browser session.</p>
      <input type="password" placeholder="sk-ant-..." value={apiKey} onChange={e => setApiKey(e.target.value)}
        style={{ width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"12px 16px", fontSize:14, color:"#e2e8f0", marginBottom:16, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
      <button disabled={apiKey.length < 20} onClick={() => { window.__OFFERPATH_KEY__ = apiKey; setKeyEntered(true); }}
        style={{ width:"100%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", border:"none", borderRadius:10, padding:"13px", fontWeight:700, fontSize:15, cursor:apiKey.length<20?"not-allowed":"pointer", opacity:apiKey.length<20?0.5:1 }}>
        Launch OfferPath →
      </button>
    </div>
  </div>
);

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", background:"#07091a", minHeight:"100vh", color:"#e2e8f0" }}>
      <style>{GLOBAL_CSS}</style>
      <Stars />
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse 90% 60% at 50% -5%, rgba(79,70,229,.1) 0%, transparent 65%)" }} />

      {page!=="landing" && (
        <nav style={{ position:"sticky", top:0, zIndex:50, padding:"0 28px", height:62, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(7,9,26,.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
          <Logo size="sm" />
          <div style={{ display:"flex", gap:10 }}>
            {page!=="services" && <button className="btn-ghost" onClick={() => navigate("services")} style={{ fontSize:13, padding:"7px 16px" }}>All Tools</button>}
            <button className="btn-ghost" onClick={() => navigate("landing")} style={{ fontSize:13, padding:"7px 16px" }}>← Home</button>
          </div>
        </nav>
      )}

      {page==="landing"  && <Landing onGo={navigate} />}
      {page==="services" && <ServicesHub onSelect={navigate} onBack={() => navigate("landing")} />}
      {page==="match"    && <JobMatchTool onBack={() => navigate("services")} />}
      {page==="prep"     && <InterviewPrepTool onBack={() => navigate("services")} />}
      {page==="roles"    && <RoleFinderTool onBack={() => navigate("services")} />}
    </div>
  );
}
