import { useState, useMemo } from "react";
import WithdrawModal from "../components/WithdrawModal";
import BlockedModal from "../components/BlockedModal";

// ── Get display name (last name if multiple names) ───────────────────────
function getDisplayName(name) {
  const parts = name.split(" ");
  return parts.length > 1 ? parts[parts.length - 1] : name;
}

// ── Get first name for greeting ──────────────────────────────────────────
function getFirstName(name) {
  const parts = name.split(" ");
  return parts[0];
}

// ── Load or generate a stable account ID for each user ────────────────────
function getStoredAccountId(user) {
  if (typeof window === "undefined") return "0000-0000-0000-0000";
  const key = `fvb_accountId_${user.username}`;
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const newId = Array.from({ length: 4 }, () => String(Math.floor(Math.random() * 10000)).padStart(4, "0")).join("-");
  window.localStorage.setItem(key, newId);
  return newId;
}

function getTransactionKey(username) {
  return `fvb_transactions_${username}`;
}

function loadTransactions(user) {
  if (typeof window === "undefined") return [];
  const saved = JSON.parse(window.localStorage.getItem(getTransactionKey(user.username)) || "null");
  if (Array.isArray(saved) && saved.length) return saved;
  if (Array.isArray(user.transactions) && user.transactions.length) return user.transactions;
  if (user.isAdmin) {
    return [
      { id: 1, desc: "Direct Deposit", date: "Jun 28, 2025", amount: user.balance ?? 0, type: "credit" },
    ];
  }
  return [];
}

function saveTransactions(user, transactions) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getTransactionKey(user.username), JSON.stringify(transactions));
}

export default function Dashboard({ user, onLogout }) {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBlocked, setShowBlocked]   = useState(false);
  const [maskId, setMaskId]             = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(user.balance ?? 0);
  const [transactions, setTransactions] = useState(() => loadTransactions(user));
  const accountId = useMemo(() => getStoredAccountId(user), [user.username]);

  const maskedId = maskId
    ? "••••-••••-••••-" + accountId.split("-")[3]
    : accountId;

  const handleWithdrawSubmit = ({ amount, recipientName }) => {
    const newTx = {
      id: Date.now(),
      desc: recipientName ? `Transfer to ${recipientName}` : "External transfer",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: -Math.abs(amount),
      type: "debit",
    };

    const next = [newTx, ...transactions];
    setTransactions(next);
    saveTransactions(user, next);

    if (!user.isAdmin) {
      const nextBalance = Math.max(0, currentBalance - Math.abs(amount));
      setCurrentBalance(nextBalance);
      const savedUsers = JSON.parse(window.localStorage.getItem("fvb_users") || "[]");
      const updatedUsers = savedUsers.map((u) =>
        u.username === user.username ? { ...u, balance: nextBalance } : u
      );
      window.localStorage.setItem("fvb_users", JSON.stringify(updatedUsers));
    }

    setShowWithdraw(false);
    setShowBlocked(true);
  };

  return (
    <div style={s.root}>
      {/* ── Responsive Styles ───────────────────────────────── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Mobile nav links hidden by default on small screens */
        @media (max-width: 768px) {
          .fvb-nav-links { display: none !important; }
          .fvb-nav-right-full { display: none !important; }
          .fvb-hamburger { display: flex !important; }
          .fvb-nav { padding: 0 16px !important; height: 56px !important; }
          .fvb-logo-text { font-size: 14px !important; }

          .fvb-hero { padding: 24px 16px !important; }
          .fvb-hero-content { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .fvb-hero-greeting { font-size: 20px !important; }
          .fvb-hero-balance { font-size: 28px !important; }
          .fvb-hero-actions { flex-wrap: wrap !important; gap: 8px !important; }
          .fvb-hero-btn { padding: 10px 14px !important; font-size: 12px !important; }

          .fvb-cards-row { padding: 16px 16px 0 !important; }
          .fvb-stat-card { min-width: calc(50% - 8px) !important; }

          .fvb-main { flex-direction: column !important; padding: 16px !important; gap: 16px !important; }
          .fvb-sidebar { width: 100% !important; }
          .fvb-tx-panel { overflow-x: auto !important; }

          .fvb-table-head { display: none !important; }
          .fvb-tx-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px !important;
            padding: 12px !important;
          }
          .fvb-tx-date { text-align: left !important; }
          .fvb-tx-amt { text-align: left !important; }

          .fvb-quick-grid { grid-template-columns: repeat(2, 1fr) !important; }

          .fvb-mobile-menu {
            display: flex !important;
          }
        }

        @media (min-width: 769px) {
          .fvb-hamburger { display: none !important; }
          .fvb-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav style={s.nav} className="fvb-nav">
        <div style={s.navLeft}>
          <div style={s.navLogo}>
            <div style={s.logoBox}><CreditCardIcon color="#fff" size={18} /></div>
            <span style={s.logoText} className="fvb-logo-text">HarborBank</span>
          </div>
          <div style={s.navLinks} className="fvb-nav-links">
            {["Overview","Accounts","Transfers","Payments","Invest"].map(l => (
              <span key={l} style={s.navLink}>{l}</span>
            ))}
          </div>
        </div>
        <div style={s.navRight} className="fvb-nav-right-full">
          <div style={s.notifWrap}>
            <BellIcon color="#fff" size={18} />
            <span style={s.notifDot} />
          </div>
          <div style={s.avatar}>{user.name.split(" ").map(n => n[0]).join("")}</div>
          <span style={s.userName}>{getDisplayName(user.name)}</span>
          <button onClick={onLogout} style={s.logoutBtn}>Sign Out</button>
        </div>
        {/* Mobile hamburger */}
        <button
          className="fvb-hamburger"
          style={s.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span style={{ ...s.hamburgerLine, transform: mobileMenuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
          <span style={{ ...s.hamburgerLine, opacity: mobileMenuOpen ? 0 : 1 }} />
          <span style={{ ...s.hamburgerLine, transform: mobileMenuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
        </button>
      </nav>

      {/* ── Mobile Menu Dropdown ────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fvb-mobile-menu" style={s.mobileMenu}>
          <div style={s.mobileMenuUser}>
            <div style={{ ...s.avatar, width: 42, height: 42, fontSize: 15 }}>
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>{getDisplayName(user.name)}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Account {user.accountNumber}</div>
            </div>
          </div>
          {["Overview","Accounts","Transfers","Payments","Invest"].map(l => (
            <button key={l} style={s.mobileMenuItem} onClick={() => setMobileMenuOpen(false)}>{l}</button>
          ))}
          <button style={s.mobileLogout} onClick={onLogout}>Sign Out</button>
        </div>
      )}

      {/* ── Hero Banner ────────────────────────────────────── */}
      <div style={s.heroBanner} className="fvb-hero">
        <div style={s.heroContent} className="fvb-hero-content">
          <div>
            <h2 style={s.heroGreeting} className="fvb-hero-greeting">Hello {getFirstName(user.name)}!</h2>
            <p style={s.heroLabel}>Total Account Balance</p>
            <h1 style={s.heroBalance} className="fvb-hero-balance">
              ${currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h1>
            <div style={s.accountIdRow}>
              <span style={s.heroSub}>Account ID:&nbsp;</span>
              <span style={s.accountIdValue}>{maskedId}</span>
              <button style={s.maskToggle} onClick={() => setMaskId(v => !v)}>
                {maskId ? <EyeIcon color="rgba(255,255,255,0.6)" size={14} /> : <EyeOffIcon color="rgba(255,255,255,0.6)" size={14} />}
              </button>
              <button style={s.copyBtn} onClick={() => navigator.clipboard?.writeText(accountId)}>
                <CopyIcon color="rgba(255,255,255,0.6)" size={14} />
              </button>
            </div>
            <p style={s.heroSub}>Account ending {user.accountNumber} · Checking Account</p>
          </div>
          <div style={s.heroActions} className="fvb-hero-actions">
            <button style={s.heroBtn} className="fvb-hero-btn" onClick={() => setShowWithdraw(true)}>
              <ArrowDownIcon color="#4B2A88" size={16} /> Withdraw
            </button>
            <button style={{ ...s.heroBtn, ...s.heroBtnOutline }} className="fvb-hero-btn">
              <ArrowRightLeftIcon color="#fff" size={16} /> Transfer
            </button>
            <button style={{ ...s.heroBtn, ...s.heroBtnOutline }} className="fvb-hero-btn">
              <ReceiptIcon color="#fff" size={16} /> Pay Bills
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div style={s.cardsRow} className="fvb-cards-row">
        {[
          { label: "Available Balance", value: `$${currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: <WalletIcon color="#4B2A88" size={20} />, color: "#4B2A88" },
        ].map(card => (
          <div key={card.label} style={s.statCard} className="fvb-stat-card">
            <div style={{ ...s.statIcon, background: card.color + "18" }}>{card.icon}</div>
            <div>
              <p style={s.statLabel}>{card.label}</p>
              <p style={{ ...s.statValue, color: card.color }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main body ──────────────────────────────────────── */}
      <div style={s.main} className="fvb-main">

        {/* Transactions table */}
        <div style={s.txPanel} className="fvb-tx-panel">
          <div style={s.panelHeader}>
            <h2 style={s.panelTitle}>Recent Transactions</h2>
            <span style={s.viewAll}>View All →</span>
          </div>
          <div style={s.tableHead} className="fvb-table-head">
            <span style={{ flex: 3 }}>Description</span>
            <span style={{ flex: 1.5, textAlign: "center" }}>Date</span>
            <span style={{ flex: 1, textAlign: "right" }}>Amount</span>
          </div>
          {transactions.length === 0 ? (
            <div style={s.emptyTx}>
              <p style={s.emptyTxText}>No recent transactions yet. Your activity will appear here.</p>
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} style={s.txRow} className="fvb-tx-row">
                <div style={{ flex: 3, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ ...s.txDot, background: tx.type === "credit" ? "#16a34a" : "#dc2626" }} />
                  <span style={s.txDesc}>{tx.desc}</span>
                </div>
                <span style={{ ...s.txDate, flex: 1.5, textAlign: "center" }} className="fvb-tx-date">{tx.date}</span>
                <span style={{ ...s.txAmt, flex: 1, textAlign: "right", color: tx.type === "credit" ? "#16a34a" : "#dc2626" }} className="fvb-tx-amt">
                  {tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Right sidebar */}
        <div style={s.sidebar} className="fvb-sidebar">

          {/* Quick Withdraw */}
          <div style={s.widget}>
            <div style={s.widgetHeader}>
              <BanknoteIcon color="#4B2A88" size={16} />
              <h3 style={s.widgetTitle}>Quick Withdraw</h3>
            </div>
            <p style={s.widgetSub}>Tap an amount or enter your own</p>
            <div style={s.quickGrid} className="fvb-quick-grid">
              {[100, 500, 1000, 5000].map(amt => (
                <button key={amt} style={s.quickBtn} onClick={() => setShowWithdraw(true)}>
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
            <button style={s.customBtn} onClick={() => setShowWithdraw(true)}>
              <PencilIcon color="#fff" size={14} /> Custom Amount
            </button>
          </div>

          {/* Account ID card */}
          <div style={{ ...s.widget, marginTop: 16 }}>
            <div style={s.widgetHeader}>
              <FingerprintIcon color="#4B2A88" size={16} />
              <h3 style={s.widgetTitle}>Account ID</h3>
            </div>
            <div style={s.idCard}>
              <span style={s.idDisplay}>{maskedId}</span>
              <button style={s.idToggle} onClick={() => setMaskId(v => !v)}>
                {maskId ? <EyeIcon color="#64748b" size={14} /> : <EyeOffIcon color="#64748b" size={14} />}
                {maskId ? "Reveal" : "Hide"}
              </button>
            </div>
            <p style={s.idHint}>Use this ID for incoming transfers</p>
          </div>

          {/* Security */}
          <div style={{ ...s.widget, marginTop: 16 }}>
            <div style={s.widgetHeader}>
              <ShieldCheckIcon color="#4B2A88" size={16} />
              <h3 style={s.widgetTitle}>Account Security</h3>
            </div>
            {[
              { icon: <ShieldCheckIcon color="#16a34a" size={14} />, label: "Two-Factor Auth", value: "Active" },
              { icon: <ClockIcon color="#16a34a" size={14} />,       label: "Last Login",      value: "Today, 9:42 AM" },
              { icon: <ZapIcon color="#16a34a" size={14} />,         label: "Fraud Shield",    value: "Enabled" },
            ].map(item => (
              <div key={item.label} style={s.secRow}>
                {item.icon}
                <span style={s.secLabel}>{item.label}:</span>
                <strong style={s.secValue}>{item.value}</strong>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────── */}
      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          onSubmit={handleWithdrawSubmit}
          balance={currentBalance}
          user={user}
          accountId={accountId}
        />
      )}
      {showBlocked && <BlockedModal onClose={() => setShowBlocked(false)} />}
    </div>
  );
}

// ── SVG icon components ──────────────────────────────────────────────────
const CreditCardIcon    = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M2 11h20"/><circle cx="6" cy="15" r="1.5" fill={color} stroke="none"/></svg>;
const BellIcon          = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const ArrowDownIcon     = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
const ArrowRightLeftIcon= ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
const ReceiptIcon       = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>;
const WalletIcon        = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5"/><path d="M16 12h6"/><circle cx="19" cy="12" r="1" fill={color} stroke="none"/></svg>;
const ClockIcon         = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const BanknoteIcon      = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>;
const PencilIcon        = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const FingerprintIcon   = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0110 10"/><path d="M5 12a7 7 0 017-7"/><path d="M8 12a4 4 0 014-4"/><path d="M12 12v.01"/><path d="M12 16c0-2.5 1-4 3-5"/><path d="M12 20c0-4 2-7 5-8"/></svg>;
const EyeIcon           = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon        = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const CopyIcon          = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
const ShieldCheckIcon   = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
const ZapIcon           = ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

// ── Styles ───────────────────────────────────────────────────────────────
const s = {
  root: { minHeight: "100vh", background: "#F2E9EE", fontFamily: "'Inter', system-ui, sans-serif" },

  // nav
  nav: { background: "linear-gradient(90deg,#977DFF,#7C63FF)", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 18px 55px rgba(151,125,255,0.18)", position: "sticky", top: 0, zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: 40 },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: { width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#fff", fontSize: 16, fontWeight: "bold", letterSpacing: "0.04em" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { color: "rgba(255,255,255,0.85)", fontSize: 13.5, cursor: "pointer" },
  navRight: { display: "flex", alignItems: "center", gap: 16 },
  notifWrap: { position: "relative", cursor: "pointer", display: "flex" },
  notifDot: { position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "#F2C5FF", border: "1.5px solid rgba(255,255,255,0.8)" },
  avatar: { width: 34, height: 34, borderRadius: "50%", background: "#F2D8FF", color: "#4B2A88", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 13 },
  userName: { color: "rgba(255,255,255,0.9)", fontSize: 13 },
  logoutBtn: { background: "rgba(255,255,255,0.16)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "8px 16px", fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" },

  // hamburger
  hamburger: { display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 6 },
  hamburgerLine: { display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, transition: "transform 0.2s, opacity 0.2s" },

  // mobile menu
  mobileMenu: { display: "none", flexDirection: "column", background: "#977DFF", borderBottom: "1px solid rgba(255,255,255,0.18)", zIndex: 99, padding: "8px 0" },
  mobileMenuUser: { display: "flex", alignItems: "center", gap: 12, padding: "12px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 8 },
  mobileMenuItem: { background: "none", border: "none", color: "rgba(255,255,255,0.92)", fontSize: 15, padding: "12px 20px", textAlign: "left", cursor: "pointer", fontFamily: "inherit" },
  mobileLogout: { background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 14, padding: "10px 20px", margin: "8px 20px 4px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "center" },

  // hero
  heroBanner: { background: "linear-gradient(135deg,#977DFF 0%,#8B6BFF 55%,#E6D4FF 100%)", padding: "36px 40px" },
  heroContent: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 },
  heroGreeting: { color: "#fff", fontSize: 24, fontWeight: "bold", margin: "0 0 16px", letterSpacing: "0.02em" },
  heroLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" },
  heroBalance: { color: "#fff", fontSize: 44, fontWeight: "bold", margin: "0 0 10px", letterSpacing: "0.02em" },
  accountIdRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" },
  accountIdValue: { color: "rgba(255,255,255,0.92)", fontSize: 13, fontFamily: "monospace", letterSpacing: "0.08em" },
  maskToggle: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 2 },
  copyBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 2 },
  heroSub: { color: "rgba(255,255,255,0.72)", fontSize: 12.5 },
  heroActions: { display: "flex", gap: 12, flexWrap: "wrap" },
  heroBtn: { display: "flex", alignItems: "center", gap: 8, background: "#fff", color: "#4B2A88", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 18px 40px rgba(151,125,255,0.18)" },
  heroBtnOutline: { background: "rgba(255,255,255,0.18)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.28)" },

  // stat cards
  cardsRow: { display: "flex", gap: 16, padding: "24px 40px 0", maxWidth: 1180, margin: "0 auto", flexWrap: "wrap", boxSizing: "border-box", width: "100%" },
  statCard: { flex: 1, minWidth: 200, background: "#fff", borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 14px 45px rgba(151,125,255,0.12)", border: "1px solid rgba(151,125,255,0.18)" },
  statIcon: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statLabel: { fontSize: 11, color: "#7C6C96", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#2E1B4E" },

  // main
  main: { display: "flex", gap: 20, padding: "24px 40px 40px", maxWidth: 1180, margin: "0 auto", boxSizing: "border-box", width: "100%" },

  // transactions
  txPanel: { flex: 1, background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 14px 45px rgba(151,125,255,0.12)", border: "1px solid rgba(151,125,255,0.16)", minWidth: 0 },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  panelTitle: { fontSize: 17, fontWeight: "bold", color: "#2E1B4E", margin: 0 },
  viewAll: { fontSize: 13, color: "#6E5C90", cursor: "pointer" },
  tableHead: { display: "flex", padding: "8px 12px", background: "#F8F2FF", borderRadius: 8, fontSize: 11, color: "#7C6C96", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 },
  txRow: { display: "flex", alignItems: "center", padding: "13px 12px", borderBottom: "1px solid rgba(151,125,255,0.14)" },
  txDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  txDesc: { fontSize: 13.5, color: "#4B3F74" },
  txDate: { fontSize: 12.5, color: "#7C6C96" },
  txAmt: { fontSize: 14, fontWeight: "600" },
  emptyTx: { padding: "28px 18px", borderRadius: 14, border: "1px dashed rgba(151,125,255,0.22)", background: "#F8F2FF", textAlign: "center" },
  emptyTxText: { margin: 0, color: "#7C6C96", fontSize: 13 },

  // sidebar
  sidebar: { width: 280, flexShrink: 0 },
  widget: { background: "#fff", borderRadius: 14, padding: "22px", boxShadow: "0 14px 45px rgba(151,125,255,0.12)", border: "1px solid rgba(151,125,255,0.16)" },
  widgetHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  widgetTitle: { fontSize: 14, fontWeight: "bold", color: "#2E1B4E", margin: 0 },
  widgetSub: { fontSize: 11.5, color: "#7C6C96", marginBottom: 14 },
  quickGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 },
  quickBtn: { padding: "10px 0", background: "#F4EAFF", border: "1.5px solid rgba(151,125,255,0.24)", borderRadius: 10, fontSize: 13.5, color: "#4B3F74", cursor: "pointer", fontFamily: "inherit", fontWeight: "600", textAlign: "center" },
  customBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", padding: "10px", background: "linear-gradient(135deg,#977DFF,#6F5BFF)", border: "none", borderRadius: 10, fontSize: 13, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: "600" },

  idCard: { background: "#F7F0FF", border: "1px solid rgba(151,125,255,0.2)", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, marginBottom: 6 },
  idDisplay: { fontFamily: "monospace", fontSize: 13, color: "#4B3F74", letterSpacing: "0.06em" },
  idToggle: { display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", fontSize: 11, color: "#7C6C96", cursor: "pointer", fontFamily: "inherit" },
  idHint: { fontSize: 11, color: "#7C6C96", margin: 0 },

  secRow: { display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#5D4B78", marginTop: 10 },
  secLabel: { flex: 1 },
  secValue: { color: "#977DFF" },
};
