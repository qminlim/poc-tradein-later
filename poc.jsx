import { useState } from "react";

const phoneModels = [
  { brand: "Apple",   models: ["iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16","iPhone 15 Pro Max","iPhone 15 Pro","iPhone 15"] },
  { brand: "Samsung", models: ["Galaxy S25 Ultra","Galaxy S25+","Galaxy S25","Galaxy S24 Ultra","Galaxy S24"] },
];

const gradeInfo = {
  S: { label: "Like New",  desc: "No scratches, original box preferred",      value: 100 },
  A: { label: "Excellent", desc: "Minor micro-scratches, fully functional",    value: 85  },
  B: { label: "Good",      desc: "Light scratches, small dents, works perfectly", value: 65 },
  C: { label: "Fair",      desc: "Visible wear, cracked back or bezel only",   value: 40  },
};

// ── Real Mister Mobile SG branches ──────────────────────────
const branches = [
  // East
  { id:"geylang",    region:"East",    name:"Geylang (City Plaza)",  addr:"810 Geylang Rd, #01-67A, S 409286",          mrt:"Paya Lebar MRT" },
  { id:"tampines",   region:"East",    name:"Tampines",              addr:"4 Tampines Central 5, #B1-37, S 529510",     mrt:"Tampines MRT" },
  { id:"bedok",      region:"East",    name:"Bedok Mall",            addr:"311 New Upper Changi Rd, #B1-52, S 467360",  mrt:"Bedok MRT" },
  { id:"pasirris",   region:"East",    name:"Pasir Ris",             addr:"1 Pasir Ris Central St 3, #01-K1, S 518457", mrt:"Pasir Ris MRT" },
  // North
  { id:"hougang",    region:"North",   name:"Hougang",               addr:"21 Hougang St 51, #01-27, S 538719",         mrt:"Hougang MRT" },
  { id:"woodlands",  region:"North",   name:"Woodlands",             addr:"305 Woodlands St 31, #01-71A, S 730305",     mrt:"Woodlands MRT" },
  { id:"yishun",     region:"North",   name:"Yishun",                addr:"930 Yishun Ave 2, #01-48, S 769098",         mrt:"Yishun MRT" },
  // Central
  { id:"chinatown",  region:"Central", name:"Chinatown (People's Park)", addr:"1 Park Rd, #01-14, S 059108",            mrt:"Chinatown MRT" },
  { id:"bishan",     region:"Central", name:"Bishan",                addr:"51 Bishan St 13, #01-01, S 579799",          mrt:"Bishan MRT" },
  { id:"potongpasir",region:"Central", name:"Potong Pasir",          addr:"142 Potong Pasir Ave 3, #01-162, S 350142",  mrt:"Potong Pasir MRT" },
  // West
  { id:"jurong",     region:"West",    name:"Jurong East",           addr:"132 Jurong Gateway Rd, #01-275, S 600132",   mrt:"Jurong East MRT" },
  { id:"bukit",      region:"West",    name:"Bukit Panjang",         addr:"1 Jelebu Rd, #02-29, S 677743",              mrt:"Bukit Panjang MRT" },
];

const regions = ["East","North","Central","West"];

const timeSlots = [
  "11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM",
  "4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM",
];

const PHONE_PRICE  = 1799;   // SGD
const DOORSTEP_FEE = 20;     // SGD

function getDates() {
  const out = [];
  for (let i = 1; i <= 5; i++) {
    const d = new Date(Date.now() + i * 86400000);
    out.push({
      key:  d.toISOString().split("T")[0],
      day:  d.toLocaleDateString("en-SG", { weekday: "short" }),
      date: d.toLocaleDateString("en-SG", { day: "numeric", month: "short" }),
    });
  }
  return out;
}

const fmt = (n) => `S$${n.toLocaleString()}`;

export default function App() {
  const [screen, setScreen]               = useState("product");
  const [tradeType, setTradeType]         = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("Apple");
  const [selectedModel, setSelectedModel] = useState("iPhone 15 Pro");
  const [selectedGrade, setSelectedGrade] = useState("A");
  const [storage, setStorage]             = useState("256GB");
  const [transitioning, setTransitioning] = useState(false);

  const [collectionMethod, setCollectionMethod] = useState(null);
  const [selectedBranch,   setSelectedBranch]   = useState(null);
  const [selectedDate,     setSelectedDate]     = useState(null);
  const [selectedTime,     setSelectedTime]     = useState(null);
  const [doorstepAddress,  setDoorstepAddress]  = useState("");
  const [activeRegion,     setActiveRegion]     = useState("East");

  const dates      = getDates();
  const tradeValue = Math.round((PHONE_PRICE * gradeInfo[selectedGrade].value) / 100 * 0.38);
  const netCredit  = collectionMethod === "doorstep" ? tradeValue - DOORSTEP_FEE : tradeValue;
  const lockRef    = "MM-TIL-4A7X2K";
  const expiryDate = new Date(Date.now() + 5 * 86400000)
    .toLocaleDateString("en-SG", { day:"numeric", month:"short", year:"numeric" });

  const primaryChosen   = collectionMethod === "branch"
    ? !!selectedBranch
    : collectionMethod === "doorstep"
      ? doorstepAddress.trim().length > 5
      : false;
  const collectionReady = primaryChosen && !!selectedDate && !!selectedTime;

  const go = (s) => { setTransitioning(true); setTimeout(() => { setScreen(s); setTransitioning(false); }, 200); };
  const resetCollection = () => { setCollectionMethod(null); setSelectedBranch(null); setSelectedDate(null); setSelectedTime(null); setDoorstepAddress(""); };

  /* ── style tokens ── */
  const S = {
    shell:    { display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"#0a0a0a", fontFamily:"'DM Sans',sans-serif", padding:"24px 16px" },
    device:   { width:375, background:"#111", borderRadius:42, boxShadow:"0 0 0 1.5px #2a2a2a, 0 40px 100px rgba(0,0,0,.9)", overflow:"hidden", border:"8px solid #1c1c1c" },
    notch:    { height:44, background:"#111", display:"flex", alignItems:"center", justifyContent:"center" },
    pill:     { width:110, height:28, background:"#000", borderRadius:20 },
    screen:   { height:720, overflowY:"auto", background:"#f7f6f3", opacity:transitioning?0:1, transition:"opacity .18s ease", scrollbarWidth:"none" },
    nav:      { display:"flex", alignItems:"center", gap:8, padding:"14px 20px 10px", background:"#f7f6f3", position:"sticky", top:0, zIndex:10, borderBottom:"1px solid #ede9e0" },
    backBtn:  { width:32, height:32, borderRadius:"50%", background:"#ece9e3", border:"none", cursor:"pointer", fontSize:16, color:"#444", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
    navTitle: { fontSize:14, fontWeight:700, color:"#111", letterSpacing:"-.01em" },
    tag: (c) => ({ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, letterSpacing:".05em", background:c==="green"?"#d4f5e2":c==="purple"?"#ede9fe":c==="blue"?"#dbeafe":"#fef3c7", color:c==="green"?"#065f46":c==="purple"?"#5b21b6":c==="blue"?"#1e40af":"#92400e" }),
    btn: (v, disabled) => ({ width:"100%", padding:"15px 0", borderRadius:14, border:v==="outline"?"1.5px solid #111":"none", cursor:disabled?"not-allowed":"pointer", fontSize:15, fontWeight:700, letterSpacing:"-.01em", background:v==="primary"?"#111":v==="outline"?"transparent":"#ece9e3", color:v==="primary"?"#fff":"#111", fontFamily:"'DM Sans',sans-serif", opacity:disabled?0.4:1 }),
    card:     { background:"#fff", borderRadius:18, padding:18, marginBottom:12, border:"1px solid #ede9e0" },
    gradeCard:(a)=>({ flex:"0 0 calc(50% - 5px)", borderRadius:14, padding:"12px 14px", border:a?"2px solid #111":"1.5px solid #e5e0d5", background:a?"#111":"#fff", cursor:"pointer", transition:"all .15s" }),
    select:   { width:"100%", padding:"11px 14px", borderRadius:12, border:"1.5px solid #e5e0d5", background:"#fff", fontSize:14, color:"#111", appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center", cursor:"pointer" },
    row:      { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f0ede6" },
    lbl:      { fontSize:13, color:"#888" },
    val:      { fontSize:13, fontWeight:600, color:"#111" },
    lockBox:  { background:"#111", borderRadius:18, padding:20, marginBottom:12, color:"#fff" },
    secLabel: { fontSize:11, fontWeight:700, color:"#777", textTransform:"uppercase", letterSpacing:".07em", marginBottom:8 },
    regionTab:(a)=>({ padding:"5px 12px", borderRadius:20, border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, cursor:"pointer", background:a?"#111":"transparent", color:a?"#fff":"#888", transition:"all .15s" }),
  };

  const Notch = () => <div style={S.notch}><div style={S.pill}/></div>;
  const Font  = () => <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>;

  /* ════════════ PRODUCT ════════════ */
  if (screen === "product") return (
    <div style={S.shell}><Font/>
      <div style={S.device}><Notch/>
        <div style={S.screen}>
          <div style={{...S.nav, borderBottom:"none"}}>
            <span style={{fontSize:13,color:"#999"}}>Mister Mobile SG</span>
            <span style={{color:"#ccc",margin:"0 4px"}}>/</span>
            <span style={{fontSize:13,fontWeight:700,color:"#111"}}>iPhone 15 Pro</span>
          </div>
          <div style={{padding:"4px 20px 28px"}}>
            <div style={{background:"#ece9e3",borderRadius:22,height:210,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,position:"relative",overflow:"hidden"}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:72}}>📱</div><div style={{fontSize:12,color:"#999",marginTop:6,fontWeight:500}}>iPhone 15 Pro</div></div>
              <div style={{position:"absolute",top:12,right:12,background:"#111",borderRadius:20,padding:"4px 10px",fontSize:10,fontWeight:700,color:"#fff",letterSpacing:".04em"}}>NEW</div>
            </div>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              <span style={S.tag("green")}>IN STOCK</span>
              <span style={S.tag("purple")}>TRADE-IN AVAILABLE</span>
            </div>
            <div style={{fontSize:24,fontWeight:800,color:"#111",letterSpacing:"-.04em",marginBottom:4}}>iPhone 15 Pro</div>
            <div style={{fontSize:13,color:"#999",marginBottom:16,fontWeight:500}}>Natural Titanium · 256GB</div>
            <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:20}}>
              <span style={{fontSize:30,fontWeight:800,color:"#111",letterSpacing:"-.03em"}}>S$1,799</span>
              <span style={{fontSize:13,color:"#bbb",textDecoration:"line-through"}}>S$1,999</span>
            </div>
            <div style={{background:"#eef5ff",borderRadius:14,padding:"14px 16px",marginBottom:22,border:"1px solid #c7dffe"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1d4ed8",marginBottom:4}}>🔁 Trade-in available</div>
              <div style={{fontSize:12,color:"#3b82f6",lineHeight:1.6}}>Offset your purchase with your old device. Trade in now or bring it in within 5 days after purchase.</div>
            </div>
            <button style={S.btn("primary")} onClick={()=>go("tradein-select")}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════ TRADE-IN SELECT ════════════ */
  if (screen === "tradein-select") return (
    <div style={S.shell}><Font/>
      <div style={S.device}><Notch/>
        <div style={S.screen}>
          <div style={S.nav}><button style={S.backBtn} onClick={()=>go("product")}>←</button><span style={S.navTitle}>Trade-In Option</span></div>
          <div style={{padding:"12px 20px 28px"}}>
            <div style={{fontSize:18,fontWeight:800,letterSpacing:"-.03em",color:"#111",marginBottom:6}}>Do you have a device to trade in?</div>
            <div style={{fontSize:13,color:"#999",lineHeight:1.6,marginBottom:22}}>Choose how you'd like to trade in your old phone.</div>
            {[
              { id:"now",   title:"Trade-In Now",  desc:"Bring your device today. Value deducted immediately at checkout.",                     tags:[{c:"green",t:"SAME DAY"}],                               isNew:false },
              { id:"later", title:"Trade-In Later", desc:"Bring your device within 5 days. We'll lock in today's trade-in price for you.", tags:[{c:"purple",t:"PRICE LOCKED"},{c:"blue",t:"5-DAY WINDOW"}], isNew:true  },
            ].map(opt=>(
              <div key={opt.id} onClick={()=>setTradeType(opt.id)}
                style={{...S.card, border:tradeType===opt.id?"2px solid #111":"1.5px solid #ede9e0", cursor:"pointer", position:"relative", overflow:"hidden", marginBottom:10}}>
                {opt.isNew && <div style={{position:"absolute",top:0,right:0,background:"#111",padding:"4px 12px",borderBottomLeftRadius:12,fontSize:10,fontWeight:700,color:"#fff",letterSpacing:".04em"}}>NEW</div>}
                <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:700,color:"#111",marginBottom:5}}>{opt.title}</div>
                    <div style={{fontSize:12,color:"#888",lineHeight:1.6}}>{opt.desc}</div>
                  </div>
                  <div style={{width:22,height:22,borderRadius:"50%",border:tradeType===opt.id?"none":"1.5px solid #ccc",background:tradeType===opt.id?"#111":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                    {tradeType===opt.id&&<span style={{color:"#fff",fontSize:11}}>✓</span>}
                  </div>
                </div>
                <div style={{marginTop:10,display:"flex",gap:6}}>{opt.tags.map(tag=><span key={tag.t} style={S.tag(tag.c)}>{tag.t}</span>)}</div>
              </div>
            ))}
            <div onClick={()=>setTradeType("none")}
              style={{...S.card,border:tradeType==="none"?"2px solid #111":"1.5px solid #ede9e0",cursor:"pointer",marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:15,fontWeight:700,color:"#111",marginBottom:2}}>No Trade-In</div><div style={{fontSize:12,color:"#888"}}>I'll pay full price without trading in.</div></div>
                <div style={{width:22,height:22,borderRadius:"50%",border:tradeType==="none"?"none":"1.5px solid #ccc",background:tradeType==="none"?"#111":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {tradeType==="none"&&<span style={{color:"#fff",fontSize:11}}>✓</span>}
                </div>
              </div>
            </div>
            <button style={S.btn("primary", !tradeType)} onClick={()=>tradeType&&go(tradeType==="none"?"payment":"device-declare")}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════ DEVICE DECLARE ════════════ */
  if (screen === "device-declare") return (
    <div style={S.shell}><Font/>
      <div style={S.device}><Notch/>
        <div style={S.screen}>
          <div style={S.nav}><button style={S.backBtn} onClick={()=>go("tradein-select")}>←</button><span style={S.navTitle}>Your Trade-In Device</span></div>
          <div style={{padding:"12px 20px 28px"}}>

            {tradeType==="later"&&(
              <div style={{background:"#eef5ff",borderRadius:12,padding:"10px 14px",marginBottom:18,border:"1px solid #c7dffe"}}>
                <div style={{fontSize:12,color:"#1d4ed8",fontWeight:700,marginBottom:2}}>Trade-In Later selected</div>
                <div style={{fontSize:11,color:"#3b82f6",lineHeight:1.6}}>Declare your device now. Bring it in within 5 days and we'll honor today's price — even if market price drops.</div>
              </div>
            )}

            {/* Brand */}
            <div style={{marginBottom:16}}>
              <div style={S.secLabel}>Brand</div>
              <div style={{display:"flex",gap:8}}>
                {phoneModels.map(b=>(
                  <button key={b.brand} onClick={()=>{setSelectedBrand(b.brand);setSelectedModel(b.models[0]);}}
                    style={{padding:"8px 18px",borderRadius:20,border:selectedBrand===b.brand?"2px solid #111":"1.5px solid #e5e0d5",background:selectedBrand===b.brand?"#111":"#fff",color:selectedBrand===b.brand?"#fff":"#111",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                    {b.brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Model */}
            <div style={{marginBottom:16}}>
              <div style={S.secLabel}>Model</div>
              <select value={selectedModel} onChange={e=>setSelectedModel(e.target.value)} style={S.select}>
                {phoneModels.find(b=>b.brand===selectedBrand)?.models.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>

            {/* Storage */}
            <div style={{marginBottom:16}}>
              <div style={S.secLabel}>Storage</div>
              <div style={{display:"flex",gap:8}}>
                {["128GB","256GB","512GB","1TB"].map(s=>(
                  <button key={s} onClick={()=>setStorage(s)}
                    style={{flex:1,padding:"9px 0",borderRadius:10,border:storage===s?"2px solid #111":"1.5px solid #e5e0d5",background:storage===s?"#111":"#fff",color:storage===s?"#fff":"#111",fontFamily:"inherit",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div style={{marginBottom:18}}>
              <div style={S.secLabel}>Condition</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {Object.entries(gradeInfo).map(([g,info])=>(
                  <div key={g} onClick={()=>setSelectedGrade(g)} style={S.gradeCard(selectedGrade===g)}>
                    <div style={{fontSize:16,fontWeight:800,color:selectedGrade===g?"#fff":"#111",marginBottom:2}}>{g}</div>
                    <div style={{fontSize:12,fontWeight:600,color:selectedGrade===g?"#ddd":"#333"}}>{info.label}</div>
                    <div style={{fontSize:10,color:selectedGrade===g?"#aaa":"#999",marginTop:2,lineHeight:1.4}}>{info.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Return method (Trade-In Later only) ── */}
            {tradeType==="later"&&(
              <div style={{marginBottom:18}}>
                <div style={S.secLabel}>How will you return the device?</div>

                {/* Toggle */}
                <div style={{display:"flex",gap:8,marginBottom:14}}>
                  {[
                    {id:"branch",   icon:"🏪", line1:"Walk-in to branch",       line2:"Choose outlet & time slot"},
                    {id:"doorstep", icon:"🚗", line1:"Doorstep collection",      line2:`+S$${DOORSTEP_FEE} · island-wide`},
                  ].map(m=>(
                    <button key={m.id} onClick={()=>{setCollectionMethod(m.id);setSelectedBranch(null);setSelectedDate(null);setSelectedTime(null);}}
                      style={{flex:1,padding:"13px 8px",borderRadius:14,border:collectionMethod===m.id?"2px solid #111":"1.5px solid #e5e0d5",background:collectionMethod===m.id?"#111":"#fff",color:collectionMethod===m.id?"#fff":"#111",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",lineHeight:1.5,textAlign:"center"}}>
                      <div style={{fontSize:22,marginBottom:5}}>{m.icon}</div>
                      <div>{m.line1}</div>
                      <div style={{fontSize:10,opacity:.65,marginTop:2,fontWeight:500}}>{m.line2}</div>
                    </button>
                  ))}
                </div>

                {/* Branch list with region tabs */}
                {collectionMethod==="branch"&&(
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:8}}>Select outlet</div>
                    {/* Region filter */}
                    <div style={{display:"flex",gap:4,marginBottom:12,background:"#f0ede6",borderRadius:20,padding:3}}>
                      {regions.map(r=>(
                        <button key={r} style={S.regionTab(activeRegion===r)} onClick={()=>setActiveRegion(r)}>{r}</button>
                      ))}
                    </div>
                    {/* Outlets for active region */}
                    <div style={{maxHeight:220,overflowY:"auto",scrollbarWidth:"none"}}>
                      {branches.filter(b=>b.region===activeRegion).map(b=>(
                        <div key={b.id} onClick={()=>setSelectedBranch(b.id)}
                          style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderRadius:12,border:selectedBranch===b.id?"2px solid #111":"1.5px solid #e8e4db",background:selectedBranch===b.id?"#f0ede8":"#fff",marginBottom:8,cursor:"pointer",transition:"all .12s"}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:700,color:"#111"}}>{b.name}</div>
                            <div style={{fontSize:11,color:"#bbb",marginTop:2}}>{b.addr}</div>
                            <div style={{fontSize:10,color:selectedBranch===b.id?"#666":"#ccc",marginTop:2,fontWeight:500}}>🚇 {b.mrt}</div>
                          </div>
                          <div style={{width:20,height:20,borderRadius:"50%",border:selectedBranch===b.id?"none":"1.5px solid #ccc",background:selectedBranch===b.id?"#111":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:10}}>
                            {selectedBranch===b.id&&<span style={{color:"#fff",fontSize:10}}>✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doorstep address */}
                {collectionMethod==="doorstep"&&(
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:8}}>Collection address</div>
                    <textarea value={doorstepAddress} onChange={e=>setDoorstepAddress(e.target.value)}
                      placeholder="Enter your full Singapore address for pickup..."
                      rows={3}
                      style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"1.5px solid #e5e0d5",background:"#fff",fontSize:13,color:"#111",fontFamily:"inherit",resize:"none",outline:"none",lineHeight:1.5,boxSizing:"border-box"}}/>
                    <div style={{fontSize:11,color:"#bbb",marginTop:4}}>Available island-wide. S${DOORSTEP_FEE} fee deducted from trade-in credit.</div>
                  </div>
                )}

                {/* Date picker */}
                {primaryChosen&&(
                  <div style={{marginTop:6,marginBottom:12}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:8}}>
                      Preferred date <span style={{fontWeight:400,color:"#ccc"}}>(within 5 days)</span>
                    </div>
                    <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
                      {dates.map(d=>(
                        <div key={d.key} onClick={()=>{setSelectedDate(d.key);setSelectedTime(null);}}
                          style={{flexShrink:0,width:58,textAlign:"center",padding:"10px 4px",borderRadius:12,border:selectedDate===d.key?"2px solid #111":"1.5px solid #e5e0d5",background:selectedDate===d.key?"#111":"#fff",cursor:"pointer",transition:"all .12s"}}>
                          <div style={{fontSize:10,fontWeight:600,color:selectedDate===d.key?"#aaa":"#999",marginBottom:3}}>{d.day}</div>
                          <div style={{fontSize:13,fontWeight:700,color:selectedDate===d.key?"#fff":"#111"}}>{d.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time picker */}
                {selectedDate&&(
                  <div style={{marginBottom:4}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:8}}>Time slot</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                      {timeSlots.map(t=>(
                        <button key={t} onClick={()=>setSelectedTime(t)}
                          style={{padding:"7px 11px",borderRadius:10,border:selectedTime===t?"2px solid #111":"1.5px solid #e5e0d5",background:selectedTime===t?"#111":"#fff",color:selectedTime===t?"#fff":"#111",fontFamily:"inherit",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .12s"}}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Valuation preview */}
            <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:18,border:"1.5px solid #ede9e0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,color:"#999",marginBottom:3}}>Estimated trade-in value</div>
                  <div style={{fontSize:24,fontWeight:800,color:"#111",letterSpacing:"-.02em"}}>{fmt(tradeValue)}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,color:"#999"}}>You pay today</div>
                  <div style={{fontSize:16,fontWeight:700,color:"#111"}}>{fmt(PHONE_PRICE)}</div>
                </div>
              </div>
              {collectionMethod==="doorstep"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:8,borderTop:"1px solid #f0ede6"}}>
                    <span style={{fontSize:12,color:"#c2410c"}}>− Doorstep collection fee</span>
                    <span style={{fontSize:12,fontWeight:600,color:"#c2410c"}}>S${DOORSTEP_FEE}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                    <span style={{fontSize:12,fontWeight:600,color:"#555"}}>Net trade-in credit</span>
                    <span style={{fontSize:13,fontWeight:700,color:"#111"}}>{fmt(netCredit)}</span>
                  </div>
                </>
              )}
              {tradeType==="later"&&(
                <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid #f0ede6",fontSize:11,color:"#888",lineHeight:1.6}}>
                  🔒 This value will be locked in — honored even if market price changes within 5 days.
                </div>
              )}
            </div>

            <button style={S.btn("primary", tradeType==="later" && !collectionReady)}
              onClick={()=>(tradeType==="later"?collectionReady:true)&&go("valuation")}>
              Confirm Trade-In
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════ VALUATION ════════════ */
  if (screen === "valuation") {
    const branch     = branches.find(b=>b.id===selectedBranch);
    const chosenDate = dates.find(d=>d.key===selectedDate);
    return (
      <div style={S.shell}><Font/>
        <div style={S.device}><Notch/>
          <div style={S.screen}>
            <div style={S.nav}><button style={S.backBtn} onClick={()=>go("device-declare")}>←</button><span style={S.navTitle}>Confirm Valuation</span></div>
            <div style={{padding:"12px 20px 28px"}}>

              {/* Lock box */}
              {tradeType==="later"?(
                <div style={S.lockBox}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",color:"#888",marginBottom:10}}>TRADE-IN LATER — PRICE LOCK</div>
                  <div style={{fontSize:34,fontWeight:800,letterSpacing:"-.04em",marginBottom:4}}>{fmt(tradeValue)}</div>
                  <div style={{fontSize:13,color:"#aaa",marginBottom:16}}>Locked for {selectedModel} · Grade {selectedGrade} · {storage}</div>
                  <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,.07)",borderRadius:12,padding:"11px 14px"}}>
                    <span style={{fontSize:20}}>🔒</span>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>Price locked until {expiryDate}</div>
                      <div style={{fontSize:11,color:"#888",marginTop:1}}>5 days from purchase. Honor guaranteed.</div>
                    </div>
                  </div>
                </div>
              ):(
                <div style={{...S.card,background:"#d4f5e2",border:"1.5px solid #6ee7b7",marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#065f46",marginBottom:4,letterSpacing:".04em"}}>TRADE-IN NOW — INSTANT DEDUCTION</div>
                  <div style={{fontSize:30,fontWeight:800,color:"#064e3b"}}>{fmt(tradeValue)}</div>
                  <div style={{fontSize:12,color:"#047857",marginTop:5}}>{selectedModel} · Grade {selectedGrade} · {storage}</div>
                </div>
              )}

              {/* Order summary */}
              <div style={S.card}>
                <div style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:12}}>Order summary</div>
                <div style={S.row}><span style={S.lbl}>iPhone 15 Pro 256GB</span><span style={S.val}>{fmt(PHONE_PRICE)}</span></div>
                <div style={S.row}><span style={S.lbl}>Trade-in credit</span><span style={{...S.val,color:"#16a34a"}}>− {fmt(tradeValue)}</span></div>
                {collectionMethod==="doorstep"&&(
                  <div style={S.row}><span style={S.lbl}>Doorstep collection fee</span><span style={{...S.val,color:"#c2410c"}}>− S${DOORSTEP_FEE}</span></div>
                )}
                <div style={{...S.row,borderBottom:"none",paddingTop:12}}>
                  <span style={{fontSize:14,fontWeight:700,color:"#111"}}>{tradeType==="later"?"Charged today":"Total"}</span>
                  <span style={{fontSize:20,fontWeight:800,color:"#111"}}>{fmt(tradeType==="later"?PHONE_PRICE:PHONE_PRICE-tradeValue)}</span>
                </div>
                {tradeType==="later"&&(
                  <div style={{marginTop:8,padding:"8px 10px",background:"#f7f6f3",borderRadius:8,fontSize:11,color:"#888",lineHeight:1.5}}>
                    Full amount charged now. {fmt(netCredit)} credited back when we receive your device{collectionMethod==="doorstep"?` (after S$${DOORSTEP_FEE} collection fee)`:""}.
                  </div>
                )}
              </div>

              {/* Collection summary */}
              {tradeType==="later"&&collectionMethod&&(
                <div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:12}}>
                    {collectionMethod==="branch"?"🏪 Walk-in appointment":"🚗 Doorstep collection"}
                  </div>

                  {collectionMethod==="branch"&&branch&&(
                    <>
                      <div style={S.row}>
                        <span style={S.lbl}>Outlet</span>
                        <span style={{...S.val,textAlign:"right",maxWidth:190}}>{branch.name}</span>
                      </div>
                      <div style={{padding:"4px 0 8px"}}>
                        <span style={{fontSize:11,color:"#ccc"}}>{branch.addr}</span>
                      </div>
                      <div style={{...S.row,borderBottom:"none",paddingBottom:0}}>
                        <span style={S.lbl}>Nearest MRT</span>
                        <span style={{...S.val,fontSize:12}}>🚇 {branch.mrt}</span>
                      </div>
                    </>
                  )}

                  {collectionMethod==="doorstep"&&(
                    <div style={{...S.row,alignItems:"flex-start",marginBottom:4}}>
                      <span style={S.lbl}>Address</span>
                      <span style={{...S.val,maxWidth:175,textAlign:"right",fontSize:12,lineHeight:1.5}}>{doorstepAddress}</span>
                    </div>
                  )}

                  <div style={{...S.row,marginTop:collectionMethod==="branch"?8:0}}>
                    <span style={S.lbl}>Date</span>
                    <span style={S.val}>{chosenDate?.date} {selectedDate?.slice(0,4)}</span>
                  </div>
                  <div style={{...S.row,borderBottom:"none"}}>
                    <span style={S.lbl}>Time</span>
                    <span style={S.val}>{selectedTime}</span>
                  </div>

                  {collectionMethod==="doorstep"&&(
                    <div style={{marginTop:10,padding:"9px 12px",background:"#fff7ed",borderRadius:10,border:"1px solid #fed7aa",fontSize:11,color:"#c2410c",lineHeight:1.5}}>
                      S${DOORSTEP_FEE} collection fee deducted from trade-in. Net refund: <strong>{fmt(netCredit)}</strong>
                    </div>
                  )}

                  <div style={{marginTop:10,padding:"9px 12px",background:"#eef5ff",borderRadius:10,border:"1px solid #c7dffe",fontSize:11,color:"#1d4ed8",lineHeight:1.5}}>
                    📅 Reminder sent 2 days before. Reschedule up to 24 hrs in advance.
                  </div>
                </div>
              )}

              {/* Terms */}
              <div style={S.card}>
                <div style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:10}}>Trade-in terms</div>
                {[
                  tradeType==="later"?"Bring device within 5 days of purchase":"Device must be handed in today",
                  "Device must match declared condition grade",
                  "Locked price honored even if market price drops",
                  "Severe damage may require re-grading",
                ].map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                    <span style={{color:"#16a34a",flexShrink:0,fontWeight:700}}>✓</span>
                    <span style={{fontSize:12,color:"#555",lineHeight:1.5}}>{t}</span>
                  </div>
                ))}
              </div>

              <button style={S.btn("primary")} onClick={()=>go("payment")}>Proceed to Payment</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════ PAYMENT ════════════ */
  if (screen === "payment") return (
    <div style={S.shell}><Font/>
      <div style={S.device}><Notch/>
        <div style={S.screen}>
          <div style={S.nav}><button style={S.backBtn} onClick={()=>go("valuation")}>←</button><span style={S.navTitle}>Payment</span></div>
          <div style={{padding:"12px 20px 28px"}}>
            <div style={{fontSize:13,color:"#999",marginBottom:20}}>Select payment method</div>
            {[
              {id:"paynow", icon:"🟣", label:"PayNow",             sub:"Instant transfer via PayNow"},
              {id:"card",   icon:"💳", label:"Credit / Debit Card", sub:"Visa, Mastercard, Amex"},
              {id:"grab",   icon:"💚", label:"GrabPay Later",       sub:"Split into instalments"},
              {id:"nets",   icon:"🔵", label:"NETS",                sub:"NETS FlashPay & CashCard"},
            ].map(m=>(
              <div key={m.id} style={{...S.card,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
                <div style={{width:42,height:42,borderRadius:12,background:"#f7f6f3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{m.icon}</div>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"#111"}}>{m.label}</div><div style={{fontSize:12,color:"#999"}}>{m.sub}</div></div>
                <div style={{color:"#ddd",fontSize:18}}>›</div>
              </div>
            ))}
            <div style={{...S.card,marginTop:8}}>
              <div style={S.row}>
                <span style={S.lbl}>Amount to pay today</span>
                <span style={{fontSize:20,fontWeight:800,color:"#111"}}>{fmt(PHONE_PRICE)}</span>
              </div>
              {tradeType==="later"&&(
                <div style={{fontSize:11,color:"#999",paddingTop:5,lineHeight:1.6}}>
                  {fmt(netCredit)} refunded when device received{collectionMethod==="doorstep"?` (after S$${DOORSTEP_FEE} collection fee)`:""}.
                </div>
              )}
            </div>
            <button style={S.btn("primary")} onClick={()=>go("confirmation")}>Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════ CONFIRMATION ════════════ */
  if (screen === "confirmation") {
    const branch     = branches.find(b=>b.id===selectedBranch);
    const chosenDate = dates.find(d=>d.key===selectedDate);
    return (
      <div style={S.shell}><Font/>
        <div style={S.device}><Notch/>
          <div style={S.screen}>
            <div style={{padding:"20px 20px 36px"}}>
              {/* Success */}
              <div style={{textAlign:"center",padding:"28px 0 22px"}}>
                <div style={{width:68,height:68,borderRadius:"50%",background:"#d4f5e2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:30}}>✓</div>
                <div style={{fontSize:22,fontWeight:800,color:"#111",letterSpacing:"-.04em"}}>Order confirmed!</div>
                <div style={{fontSize:13,color:"#999",marginTop:5}}>iPhone 15 Pro · 256GB · Natural Titanium</div>
              </div>

              {/* Lock card */}
              {tradeType==="later"&&(
                <div style={S.lockBox}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",color:"#888",marginBottom:7}}>TRADE-IN LOCK REFERENCE</div>
                      <div style={{fontSize:24,fontWeight:800,letterSpacing:".06em",fontFamily:"monospace"}}>{lockRef}</div>
                    </div>
                    <span style={{fontSize:26}}>🔒</span>
                  </div>
                  <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:14}}>
                    {[
                      ["Device declared", `${selectedModel} · ${selectedGrade} · ${storage}`],
                      ["Locked value",    fmt(tradeValue)],
                      ["Net refund",      fmt(netCredit)],
                      ["Appointment",     `${chosenDate?.date} · ${selectedTime}`],
                    ].map(([l,v],i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:i<3?9:0}}>
                        <span style={{fontSize:12,color:"#888"}}>{l}</span>
                        <span style={{fontSize:12,color:i===3?"#fbbf24":"#fff",fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointment */}
              {tradeType==="later"&&collectionMethod&&(
                <div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:10}}>
                    {collectionMethod==="branch"?"🏪 Your walk-in appointment":"🚗 Your doorstep pickup"}
                  </div>
                  {collectionMethod==="branch"&&branch&&(
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:14,fontWeight:700,color:"#111"}}>{branch.name}</div>
                      <div style={{fontSize:11,color:"#bbb",marginTop:2}}>{branch.addr}</div>
                      <div style={{fontSize:11,color:"#999",marginTop:2}}>🚇 {branch.mrt}</div>
                    </div>
                  )}
                  {collectionMethod==="doorstep"&&(
                    <div style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:10}}>{doorstepAddress}</div>
                  )}
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <span style={{background:"#eef5ff",color:"#1d4ed8",padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700}}>📅 {chosenDate?.date}</span>
                    <span style={{background:"#eef5ff",color:"#1d4ed8",padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700}}>🕐 {selectedTime}</span>
                    {collectionMethod==="doorstep"&&<span style={{background:"#fff7ed",color:"#c2410c",padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700}}>−S${DOORSTEP_FEE} fee</span>}
                  </div>
                  <div style={{marginTop:10,fontSize:11,color:"#999",lineHeight:1.5}}>
                    Show lock ref <strong style={{color:"#555"}}>{lockRef}</strong> {collectionMethod==="branch"?"to our staff at the outlet":"to the collection agent"}.
                  </div>
                </div>
              )}

              {/* Expiry warning */}
              <div style={{background:"#fffbeb",borderRadius:14,padding:"12px 16px",marginBottom:16,border:"1px solid #fde68a"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:4}}>⚠️ Important reminder</div>
                <div style={{fontSize:12,color:"#b45309",lineHeight:1.5}}>
                  Lock expires at midnight on {expiryDate}. {collectionMethod==="doorstep"?"Ensure your device is ready for pickup":"Visit your chosen outlet within the window"} to claim your {fmt(netCredit)} refund.
                </div>
              </div>

              <button style={S.btn("outline")} onClick={()=>{setScreen("product");setTradeType(null);resetCollection();}}>
                Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
