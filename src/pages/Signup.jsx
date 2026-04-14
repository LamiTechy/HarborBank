import { useState } from "react";

function generateAccountNumber() {
  return "****" + Math.floor(1000 + Math.random() * 9000);
}

export default function Signup({ onSignup, onBack }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", username: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) { setError("Please fill in all fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Please enter a valid email address."); return; }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.username.trim() || !form.password || !form.confirmPassword) { setError("Please fill in all fields."); return; }
    if (form.username.length < 4) { setError("Username must be at least 4 characters."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("fvb_users") || "[]");
      const taken = existing.find((u) => u.username === form.username.toLowerCase());
      if (taken) { setError("That username is already taken. Please choose another."); setLoading(false); return; }
      const newUser = {
        id: Date.now(),
        username: form.username.toLowerCase(),
        password: form.password,
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        accountNumber: generateAccountNumber(),
        balance: 0, // ← new users always start at $0
      };
      localStorage.setItem("fvb_users", JSON.stringify([...existing, newUser]));
      setLoading(false);
      onSignup(newUser);
    }, 1400);
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "#dc2626", width: "25%" };
    if (p.length < 10 || !/[0-9]/.test(p)) return { label: "Fair", color: "#d97706", width: "55%" };
    if (/[^a-zA-Z0-9]/.test(p)) return { label: "Strong", color: "#16a34a", width: "100%" };
    return { label: "Good", color: "#2563eb", width: "75%" };
  })();

  return (
    <div style={S.root}>
      <div style={S.bgLeft} className="fvb-bg-left" /><div style={S.bgRight} className="fvb-bg-right" />
      <nav style={S.nav} className="fvb-nav">
        <div style={S.navLogo}>
          <div style={S.logoIcon}><CardSVG /></div>
          <span style={S.logoText} className="fvb-logo-text">HarborBank</span>
        </div>
        <div style={S.navLinks} className="fvb-nav-links">
          {["Personal","Business","Support"].map(l => <span key={l} style={S.navLink}>{l}</span>)}
        </div>
      </nav>

      <div style={S.content} className="fvb-content">
        <div style={S.leftPanel} className="fvb-left-panel">
          <div style={S.badge}>FDIC Insured · Member</div>
          <h1 style={S.headline} className="fvb-headline">Open your account<br /><span style={S.accent}>in minutes.</span></h1>
          <p style={S.subtext} className="fvb-subtext">Join over 1.2 million customers who trust HarborBank. No hidden fees, no paperwork.</p>
          <div style={S.perks}>
            {[
              [<ShieldIcon />, "FDIC insured up to $250,000"],
              [<ZapIcon />, "Instant account activation"],
              [<LockIcon color="rgba(255,255,255,0.85)" />, "Bank-grade 256-bit encryption"],
              [<GiftIcon />, "$200 welcome bonus for new accounts"],
            ].map(([icon, label]) => (
              <div key={label} style={S.perkItem}>
                <div style={S.perkIcon}>{icon}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card} className="fvb-card">
          <div style={S.cardTop}>
            <div style={S.cardLogoSm}><CardSVGBlue /></div>
            <span style={S.cardBank}>HarborBank</span>
          </div>

          {/* Steps indicator */}
          <div style={S.stepsRow}>
            <div style={S.stepItem}>
              <div style={{ ...S.stepCircle, background: "#977DFF", color: "#fff" }}>
                {step > 1 ? <CheckIcon /> : <span>1</span>}
              </div>
              <span style={{ ...S.stepLabel, color: "#977DFF" }}>Personal Info</span>
            </div>
            <div style={{ ...S.stepLine, background: step > 1 ? "#977DFF" : "rgba(151,125,255,0.18)" }} />
            <div style={S.stepItem}>
              <div style={{ ...S.stepCircle, background: step === 2 ? "#977DFF" : "rgba(151,125,255,0.18)", color: step === 2 ? "#fff" : "#7C6C96" }}>
                <span>2</span>
              </div>
              <span style={{ ...S.stepLabel, color: step === 2 ? "#977DFF" : "#7C6C96" }}>Credentials</span>
            </div>
          </div>

          <h2 style={S.cardTitle} className="fvb-card-title">{step === 1 ? "Tell us about yourself" : "Create your login"}</h2>
          <p style={S.cardSub} className="fvb-card-sub">Step {step} of 2 — {step === 1 ? "Personal details" : "Secure credentials"}</p>

          {step === 1 && (
            <form onSubmit={handleNext} style={S.form}>
              <div style={S.row2} className="fvb-signup-row2">
                <div style={S.field}>
                  <label style={S.label}><UserIcon sm /> First Name</label>
                  <input style={S.input} className="fvb-input" placeholder="John" value={form.firstName} onChange={set("firstName")} required />
                </div>
                <div style={S.field}>
                  <label style={S.label}><UserIcon sm /> Last Name</label>
                  <input style={S.input} className="fvb-input" placeholder="Doe" value={form.lastName} onChange={set("lastName")} required />
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}><MailIcon /> Email Address</label>
                <input style={S.input} className="fvb-input" type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} required />
              </div>
              {error && <ErrBox msg={error} />}
              <button type="submit" style={S.submitBtn} className="fvb-submit-btn">Continue →</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} style={S.form}>
              <div style={S.field}>
                <label style={S.label}><AtIcon /> Username</label>
                <input style={S.input} className="fvb-input" placeholder="e.g. john.doe" value={form.username} onChange={set("username")} required autoComplete="username" />
              </div>
              <div style={S.field}>
                <label style={S.label}><LockIcon /> Password</label>
                <div style={{ position: "relative" }}>
                  <input style={{ ...S.input, paddingRight: 40 }} className="fvb-input" type={showPass ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={set("password")} required autoComplete="new-password" />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {strength && (
                  <div style={S.strengthWrap}>
                    <div style={S.strengthBar}><div style={{ ...S.strengthFill, width: strength.width, background: strength.color }} /></div>
                    <span style={{ ...S.strengthLbl, color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>
              <div style={S.field}>
                <label style={S.label}><LockIcon /> Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input style={{ ...S.input, paddingRight: 40 }} className="fvb-input" type={showConfirm ? "text" : "password"} placeholder="Repeat your password" value={form.confirmPassword} onChange={set("confirmPassword")} required autoComplete="new-password" />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              {error && <ErrBox msg={error} />}
              <div style={S.actionRow}>
                <button type="button" style={S.backBtn} onClick={() => { setStep(1); setError(""); }}>← Back</button>
                <button type="submit" style={S.submitBtn} className="fvb-submit-btn" disabled={loading}>
                  {loading ? <Spinner /> : "Create Account →"}
                </button>
              </div>
            </form>
          )}

          <div style={S.divider} />
          <p style={S.loginHint}>Already have an account? <span style={S.loginLink} onClick={onBack}>Sign In</span></p>
        </div>
      </div>

      <footer style={S.footer} className="fvb-footer">
        <span>© 2025 HarborBank, N.A. Member FDIC.</span>
        <span style={S.dot}>·</span><span>Equal Housing Lender</span>
        <span style={S.dot}>·</span><span>Privacy Policy</span>
        <span style={S.dot}>·</span><span>Terms of Use</span>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .fvb-left-panel { display: none !important; }
          .fvb-content {
            padding: 24px 20px !important;
            justify-content: center !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 20px !important;
          }
          .fvb-card {
            width: 100% !important;
            max-width: 100% !important;
            padding: 28px 20px 24px !important;
            border-radius: 12px !important;
            margin: 0 auto !important;
          }
          .fvb-nav {
            padding: 14px 20px !important;
          }
          .fvb-nav-links { display: none !important; }
          .fvb-bg-right {
            width: 100% !important;
            right: 0 !important;
            background: #FCF3FB !important;
          }
          .fvb-logo-text { font-size: 16px !important; }
          .fvb-headline { font-size: 28px !important; }
          .fvb-subtext { font-size: 14px !important; }
          .fvb-card-title { font-size: 20px !important; }
          .fvb-card-sub { font-size: 12px !important; }
          .fvb-submit-btn { font-size: 14px !important; padding: 12px !important; }
          .fvb-input { font-size: 14px !important; padding: 10px 12px !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Tiny helpers ── */
function ErrBox({ msg }) {
  return (
    <div style={S.errBox}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>{msg}</span>
    </div>
  );
}
function Spinner() {
  return <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span style={S.spinner} /> Creating account...</span>;
}

/* ── SVG Icons ── */
function CardSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" fill="#fff" opacity="0.15"/>
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.5"/>
      <path d="M2 11h20" stroke="#fff" strokeWidth="1.5"/><circle cx="6" cy="15" r="1.5" fill="#fff"/>
    </svg>
  );
}
function CardSVGBlue() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" fill="rgba(151,125,255,0.2)" opacity="0.7"/>
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="#977DFF" strokeWidth="1.5"/>
      <path d="M2 11h20" stroke="#977DFF" strokeWidth="1.5"/><circle cx="6" cy="15" r="1.5" fill="#977DFF"/>
    </svg>
  );
}
function UserIcon({ sm }) {
  const s = sm ? 13 : 14;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function MailIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>;
}
function AtIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94"/></svg>;
}
function LockIcon({ color = "#94a3b8" }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
}
function EyeIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
function ShieldIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function ZapIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
function GiftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>;
}
function CheckIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
}

const S = {
  root: { minHeight: "100vh", background: "#F2E9EE", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" },
  bgLeft: { position: "absolute", top: 0, left: 0, width: "55%", height: "100%", background: "linear-gradient(135deg, rgba(151,125,255,0.96) 0%, rgba(151,125,255,0.72) 45%, rgba(242,233,238,0.00) 100%)", zIndex: 0, clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)" },
  bgRight: { position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: "#FCF3FB", zIndex: 0 },
  nav: { position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", background: "rgba(137,99,255,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 24px 70px rgba(126,96,255,0.14)" },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.24)" },
  logoText: { color: "#fff", fontSize: 18, fontWeight: "bold", letterSpacing: "0.04em" },
  navLinks: { display: "flex", gap: 32 },
  navLink: { color: "rgba(255,255,255,0.88)", fontSize: 14, cursor: "pointer" },
  content: { position: "relative", zIndex: 10, flex: 1, display: "flex", alignItems: "center", padding: "40px 48px", gap: 60, maxWidth: 1100, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  leftPanel: { flex: 1, color: "#fff" },
  badge: { display: "inline-block", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 20, padding: "4px 12px", marginBottom: 24 },
  headline: { fontSize: 40, fontWeight: "normal", lineHeight: 1.2, margin: "0 0 16px", color: "#fff" },
  accent: { color: "#F5E4FF" },
  subtext: { fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 380, marginBottom: 32 },
  perks: { display: "flex", flexDirection: "column", gap: 14 },
  perkItem: { display: "flex", alignItems: "center", gap: 12, fontSize: 13.5, color: "rgba(255,255,255,0.82)" },
  perkIcon: { width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 },
  card: { width: 440, background: "#fff", borderRadius: 18, boxShadow: "0 28px 90px rgba(139,105,255,0.14)", padding: "36px 36px 28px", flexShrink: 0, border: "1px solid rgba(151,125,255,0.18)", boxSizing: "border-box" },
  cardTop: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 },
  cardLogoSm: { width: 26, height: 26, borderRadius: 8, background: "rgba(151,125,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" },
  cardBank: { fontSize: 12, fontWeight: "bold", color: "#4B3F73", letterSpacing: "0.04em" },
  stepsRow: { display: "flex", alignItems: "center", marginBottom: 22 },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" },
  stepLine: { flex: 1, height: 2, margin: "0 8px", marginBottom: 18, transition: "background 0.3s" },
  stepLabel: { fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "600" },
  cardTitle: { fontSize: 22, fontWeight: "bold", color: "#2E1B4E", margin: "0 0 4px" },
  cardSub: { fontSize: 12, color: "#7C6C96", marginBottom: 22 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  row2: { display: "flex", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  label: { fontSize: 11, fontWeight: "600", color: "#6E5C90", letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 },
  input: { padding: "11px 13px", fontSize: 14, border: "1.5px solid rgba(151,125,255,0.28)", borderRadius: 12, outline: "none", background: "#F8F2FF", color: "#3F305F", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  eyeBtn: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 },
  strengthWrap: { display: "flex", alignItems: "center", gap: 8, marginTop: 6 },
  strengthBar: { flex: 1, height: 4, background: "rgba(151,125,255,0.16)", borderRadius: 4, overflow: "hidden" },
  strengthFill: { height: "100%", borderRadius: 4, transition: "width 0.3s, background 0.3s" },
  strengthLbl: { fontSize: 11, fontWeight: "bold", width: 44, textAlign: "right" },
  errBox: { background: "#FEEAF8", border: "1px solid #F3C2F3", borderRadius: 10, padding: "10px 13px", fontSize: 13, color: "#9E355D", display: "flex", alignItems: "center", gap: 8 },
  actionRow: { display: "flex", gap: 10 },
  backBtn: { padding: "12px 18px", background: "#F7F0FF", border: "1.5px solid rgba(151,125,255,0.24)", borderRadius: 10, fontSize: 13.5, color: "#5D4B78", cursor: "pointer", fontFamily: "inherit" },
  submitBtn: { flex: 1, background: "linear-gradient(135deg, #977DFF, #6F5BFF)", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" },
  spinner: { width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" },
  divider: { height: 1, background: "rgba(151,125,255,0.18)", margin: "20px 0 16px" },
  loginHint: { textAlign: "center", fontSize: 13, color: "#7C6C96", margin: 0 },
  loginLink: { color: "#977DFF", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" },
  footer: { position: "relative", zIndex: 10, padding: "14px 48px", background: "rgba(151,125,255,0.14)", color: "#5D4B78", fontSize: 11, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  dot: { color: "rgba(151,125,255,0.3)" },
};
