import { useState } from "react";
import { ADMIN_USERS } from "../constants";

// ── Seed users (non-admin) ───────────────────────────────────────────────
const SEED_USERS = [
  { id: 1, username: "john.doe", password: "password123", name: "John Doe", accountNumber: "****4821", balance: 0 },
  { id: 2, username: "jane.smith", password: "mybank456", name: "Jane Smith", accountNumber: "****7390", balance: 0 },
];

function getAllUsers() {
  const saved = JSON.parse(localStorage.getItem("fvb_users") || "[]");
  const seedIds = new Set([
    ...SEED_USERS.map(u => u.username),
    ...ADMIN_USERS.map(u => u.username),
  ]);
  const newOnly = saved.filter(u => !seedIds.has(u.username));
  return [...ADMIN_USERS, ...SEED_USERS, ...newOnly];
}

export default function Login({ onLogin, onSignup }) {
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const found = getAllUsers().find(
        (u) => u.username === username.toLowerCase() && u.password === password
      );
      if (found) {
        onLogin(found);
      } else {
        setError("Invalid username or password. Please try again.");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={styles.root}>
      {/* Background */}
      <div style={styles.bgLeft} className="fvb-bg-left" />
      <div style={styles.bgRight} className="fvb-bg-right" />

      {/* Top bar */}
      <nav style={styles.nav} className="fvb-nav">
        <div style={styles.navLogo}>
          <div style={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="14" rx="2" fill="#fff" opacity="0.15"/>
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="#fff" strokeWidth="1.5"/>
              <path d="M2 11h20" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="6" cy="15" r="1.5" fill="#fff"/>
            </svg>
          </div>
          <span style={styles.logoText} className="fvb-logo-text">HarborBank</span>
        </div>
        <div style={styles.navLinks} className="fvb-nav-links">
          <span style={styles.navLink}>Personal</span>
          <span style={styles.navLink}>Business</span>
          <span style={styles.navLink}>Support</span>
        </div>
      </nav>

      {/* Main content */}
      <div style={styles.content} className="fvb-content">
        {/* Left panel — hidden on mobile */}
        <div style={styles.leftPanel} className="fvb-left-panel">
          <div style={styles.badge}>FDIC Insured · Member</div>
          <h1 style={styles.headline} className="fvb-headline">
            Your money,<br />
            <span style={styles.headlineAccent}>protected & growing.</span>
          </h1>
          <p style={styles.subtext} className="fvb-subtext">
            Access your accounts securely, transfer funds, and manage your finances — all in one place.
          </p>
          <div style={styles.featureList}>
            {["256-bit SSL encryption", "Zero-fee domestic transfers", "24/7 fraud monitoring"].map((f) => (
              <div key={f} style={styles.featureItem}>
                <span style={styles.featureCheck}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <span style={styles.statNum}>$2.4B+</span>
              <span style={styles.statLbl}>Assets managed</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>1.2M+</span>
              <span style={styles.statLbl}>Customers served</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>50+</span>
              <span style={styles.statLbl}>Years of trust</span>
            </div>
          </div>
        </div>

        {/* Login card */}
        <div style={styles.card} className="fvb-card">
          <div style={styles.cardHeader}>
            <div style={styles.cardLogoSmall}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="14" rx="2" fill="rgba(151,125,255,0.2)" opacity="0.7"/>
                <rect x="2" y="7" width="20" height="14" rx="2" stroke="#977DFF" strokeWidth="1.5"/>
                <path d="M2 11h20" stroke="#977DFF" strokeWidth="1.5"/>
                <circle cx="6" cy="15" r="1.5" fill="#977DFF"/>
              </svg>
            </div>
            <span style={styles.cardBankName}>HarborBank</span>
          </div>
          <h2 style={styles.cardTitle} className="fvb-card-title">Sign In</h2>
          <p style={styles.cardSubtitle}>Access your account securely</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Online ID / Username</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...styles.input, paddingRight: 44 }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.forgotRow}>
              <span style={styles.forgotLink}>Forgot Password?</span>
              <span style={styles.forgotLink}>Forgot Username?</span>
            </div>

            <button type="submit" style={styles.submitBtn} className="fvb-submit-btn" disabled={loading}>
              {loading ? (
                <span style={styles.loadingInner}>
                  <span style={styles.spinner} /> Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div style={styles.divider}><span style={styles.dividerText}>New to HarborBank?</span></div>
          <button style={styles.openAccountBtn} onClick={onSignup}>Open an Account</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer} className="fvb-footer">
        <span>© 2025 HarborBank, N.A. Member FDIC.</span>
        <span style={styles.footerDot}>·</span>
        <span>Equal Housing Lender</span>
        <span style={styles.footerDot}>·</span>
        <span>Privacy Policy</span>
        <span style={styles.footerDot}>·</span>
        <span>Terms of Use</span>
      </footer>

      {/* Responsive styles injected via <style> */}
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
          .fvb-bg-right {
            width: 100% !important;
            right: 0 !important;
            background: #FCF3FB !important;
          }
          .fvb-nav {
            padding: 14px 20px !important;
          }
          .fvb-nav-links { display: none !important; }
          .fvb-footer {
            padding: 12px 20px !important;
            font-size: 10px !important;
          }
          .fvb-bg-left {
            width: 100% !important;
            clip-path: none !important;
            height: 200px !important;
          }
          .fvb-logo-text { font-size: 16px !important; }
          .fvb-card-title { font-size: 22px !important; }
          .fvb-headline { font-size: 28px !important; }
          .fvb-subtext { font-size: 14px !important; }
          .fvb-submit-btn { font-size: 14px !important; padding: 12px !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#F2E9EE",
    fontFamily: "'Inter', 'system-ui', sans-serif",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  bgLeft: {
    position: "absolute", top: 0, left: 0,
    width: "55%", height: "100%",
    background: "linear-gradient(135deg, rgba(151,125,255,0.95) 0%, rgba(151,125,255,0.70) 45%, rgba(242,233,238,0.00) 100%)",
    zIndex: 0, clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)",
    className: "fvb-bg-left",
  },
  bgRight: {
    position: "absolute", top: 0, right: 0,
    width: "50%", height: "100%",
    background: "#FCF3FB", zIndex: 0,
  },
  nav: {
    position: "relative", zIndex: 10,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 48px",
    background: "rgba(137,99,255,0.92)", backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 24px 75px rgba(126,96,255,0.14)",
  },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 38, height: 38, borderRadius: 10,
    background: "rgba(255,255,255,0.16)",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.26)",
  },
  logoText: { color: "#fff", fontSize: 18, fontWeight: "bold", letterSpacing: "0.04em" },
  navLinks: { display: "flex", gap: 32 },
  navLink: { color: "rgba(255,255,255,0.85)", fontSize: 14, cursor: "pointer", letterSpacing: "0.03em" },
  content: {
    position: "relative", zIndex: 10,
    flex: 1, display: "flex", alignItems: "center",
    padding: "60px 48px", gap: 60, maxWidth: 1100, margin: "0 auto", width: "100%",
    boxSizing: "border-box",
  },
  leftPanel: { flex: 1, color: "#fff" },
  badge: {
    display: "inline-block", fontSize: 11, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.8)",
    border: "1px solid rgba(255,255,255,0.28)", borderRadius: 20,
    padding: "4px 12px", marginBottom: 24,
  },
  headline: {
    fontSize: 42, fontWeight: "normal", lineHeight: 1.2,
    margin: "0 0 16px", color: "#fff",
  },
  headlineAccent: { color: "#F5E4FF" },
  subtext: {
    fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.7,
    maxWidth: 400, marginBottom: 32,
  },
  featureList: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 },
  featureItem: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.82)" },
  featureCheck: { color: "#D8B8FF", fontWeight: "bold", fontSize: 16 },
  statsRow: { display: "flex", alignItems: "center", gap: 24 },
  stat: { display: "flex", flexDirection: "column" },
  statNum: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  statLbl: { fontSize: 11, color: "rgba(255,255,255,0.72)", marginTop: 2 },
  statDivider: { width: 1, height: 36, background: "rgba(255,255,255,0.2)" },
  card: {
    width: 420,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 28px 90px rgba(139,105,255,0.14)",
    padding: "40px 40px 32px",
    flexShrink: 0,
    border: "1px solid rgba(151,125,255,0.18)",
    boxSizing: "border-box",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24 },
  cardLogoSmall: {
    width: 28, height: 28, borderRadius: 8,
    background: "rgba(151,125,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center",
  },
  cardBankName: { fontSize: 13, fontWeight: "bold", color: "#4B3F73", letterSpacing: "0.04em" },
  cardTitle: { fontSize: 26, fontWeight: "bold", color: "#2E1B4E", margin: "0 0 6px" },
  cardSubtitle: { fontSize: 13, color: "#7C6C96", marginBottom: 28 },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: "600", color: "#726588", letterSpacing: "0.04em", textTransform: "uppercase" },
  input: {
    padding: "12px 14px", fontSize: 15,
    border: "1.5px solid rgba(151,125,255,0.28)", borderRadius: 12, outline: "none",
    background: "#F8F2FF", color: "#3F305F",
    fontFamily: "inherit", transition: "border-color 0.2s",
    width: "100%", boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 4,
  },
  errorBox: {
    background: "#FEF2F7", border: "1px solid #F4C1E4",
    borderRadius: 12, padding: "12px 16px",
    fontSize: 13, color: "#B8267A",
  },
  forgotRow: { display: "flex", justifyContent: "space-between" },
  forgotLink: { fontSize: 13, color: "#5D4B78", cursor: "pointer", textDecoration: "underline" },
  submitBtn: {
    background: "linear-gradient(135deg, #977DFF, #6F5BFF)",
    color: "#fff", border: "none", borderRadius: 12,
    padding: "14px", fontSize: 15, fontWeight: "bold",
    cursor: "pointer", letterSpacing: "0.04em",
    transition: "opacity 0.2s",
    fontFamily: "inherit",
    width: "100%",
  },
  loadingInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },
  spinner: {
    width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block",
  },
  divider: {
    display: "flex", alignItems: "center",
    margin: "20px 0", gap: 12,
  },
  dividerText: { fontSize: 12, color: "#7C6C96", whiteSpace: "nowrap" },
  openAccountBtn: {
    width: "100%", padding: "12px",
    border: "1.5px solid rgba(151,125,255,0.45)", borderRadius: 12,
    background: "transparent", color: "#5D4B78",
    fontSize: 14, fontWeight: "600", cursor: "pointer",
    fontFamily: "inherit", letterSpacing: "0.04em",
  },
  footer: {
    position: "relative", zIndex: 10,
    padding: "16px 48px", background: "rgba(151,125,255,0.16)",
    color: "#5D4B78", fontSize: 11, letterSpacing: "0.03em",
    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
  },
  footerDot: { color: "#A695C9" },
};
