import { useState } from "react";

export default function WithdrawModal({ onClose, onSubmit, balance, user, accountId }) {
  const [amount,      setAmount]      = useState("");
  const [recipientAcct, setRecipientAcct] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [bankName,    setBankName]    = useState("");
  const [note,        setNote]        = useState("");
  const [error,       setError]       = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return setError("Please enter a valid amount.");
    if (!recipientAcct.trim()) return setError("Please enter the destination account number.");
    if (recipientAcct.trim().length < 6) return setError("Account number must be at least 6 digits.");
    setError("");
    onSubmit({
      amount: parseFloat(amount),
      recipientName: recipientName.trim(),
      recipientAcct: recipientAcct.trim(),
      bankName: bankName.trim(),
      note: note.trim(),
    });
  };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.headerIcon}><ArrowDownCircleIcon /></div>
            <div>
              <h2 style={s.title}>Withdraw Funds</h2>
              <p style={s.subtitle}>Transfer to any account</p>
            </div>
          </div>
          <button onClick={onClose} style={s.closeBtn}><XIcon /></button>
        </div>

        {/* Balance pill */}
        <div style={s.balanceBar}>
          <div>
            <p style={s.balLabel}>Available Balance</p>
            <p style={s.balAmt}>${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
          <div style={s.acctPill}>
            <CreditCardIcon />
            <span>{user?.accountNumber ?? "****"}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>

          {/* Amount */}
          <div style={s.field}>
            <label style={s.label}>Amount (USD)</label>
            <div style={s.amtWrap}>
              <span style={s.dollar}>$</span>
              <input
                style={s.amtInput}
                type="number" placeholder="0.00"
                min="1" step="0.01"
                value={amount} onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Divider label */}
          <div style={s.sectionDivider}>
            <span style={s.sectionLine} />
            <span style={s.sectionText}>Recipient Details</span>
            <span style={s.sectionLine} />
          </div>

          {/* Recipient account number — free text */}
          <div style={s.field}>
            <label style={s.label}>Recipient Account Number</label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}><HashIcon /></span>
              <input
                style={s.input}
                type="text"
                placeholder="e.g. 0123456789"
                value={recipientAcct}
                onChange={e => setRecipientAcct(e.target.value.replace(/\D/g, ""))}
                maxLength={20}
                required
              />
            </div>
            <span style={s.hint}>Enter the exact account number you are sending to</span>
          </div>

          {/* Recipient name */}
          <div style={s.field}>
            <label style={s.label}>Recipient Name (optional)</label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}><UserIcon /></span>
              <input
                style={s.input}
                type="text"
                placeholder="e.g. John Doe"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
              />
            </div>
          </div>

          {/* Bank / Institution */}
          <div style={s.field}>
            <label style={s.label}>Bank / Institution (optional)</label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}><BuildingIcon /></span>
              <input
                style={s.input}
                type="text"
                placeholder="e.g. Chase, Wells Fargo, Zelle..."
                value={bankName}
                onChange={e => setBankName(e.target.value)}
              />
            </div>
          </div>

          {/* Note */}
          <div style={s.field}>
            <label style={s.label}>Note (optional)</label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}><MessageIcon /></span>
              <input
                style={s.input}
                type="text"
                placeholder="e.g. Rent, grocery money..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={s.errorBox}>
              <AlertCircleIcon />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div style={s.actionRow}>
            <button type="button" onClick={onClose} style={s.cancelBtn}>Cancel</button>
            <button type="submit" style={s.submitBtn}>
              Confirm Withdrawal <ArrowRightIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Lucide-style icons ────────────────────────────────────────────────────
const ArrowDownCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#977DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><polyline points="8 12 12 16 16 12"/>
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CreditCardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M2 11h20"/>
  </svg>
);
const HashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const BuildingIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="9" width="18" height="13" rx="1"/><path d="M8 22V12h8v10"/><path d="M3 9l9-7 9 7"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const AlertCircleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ── Styles ────────────────────────────────────────────────────────────────
const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(151,125,255,0.18)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 },
  modal: { background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, boxShadow: "0 32px 80px rgba(151,125,255,0.18)", border: "1px solid rgba(151,125,255,0.16)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(151,125,255,0.18)", background: "#F8F0FF" },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  headerIcon: { width: 40, height: 40, borderRadius: 10, background: "#EAE0FF", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { margin: 0, fontSize: 17, fontWeight: "bold", color: "#4B2A88" },
  subtitle: { margin: 0, fontSize: 12, color: "#7C6C96" },
  closeBtn: { background: "#F4EAFF", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  balanceBar: { margin: "16px 24px", background: "linear-gradient(135deg,#977DFF,#6F5BFF)", borderRadius: 12, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  balLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" },
  balAmt: { color: "#fff", fontSize: 20, fontWeight: "bold", margin: 0 },
  acctPill: { display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "6px 12px", color: "rgba(255,255,255,0.92)", fontSize: 12 },
  form: { padding: "4px 24px 24px", display: "flex", flexDirection: "column", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 11, fontWeight: "600", color: "#6E5C90", textTransform: "uppercase", letterSpacing: "0.05em" },
  amtWrap: { position: "relative", display: "flex", alignItems: "center" },
  dollar: { position: "absolute", left: 12, fontSize: 16, color: "#6E5C90", fontWeight: "bold" },
  amtInput: { paddingLeft: 30, paddingRight: 12, paddingTop: 12, paddingBottom: 12, fontSize: 20, fontWeight: "bold", border: "1.5px solid rgba(151,125,255,0.24)", borderRadius: 12, background: "#F8F2FF", color: "#4B2A88", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" },
  sectionDivider: { display: "flex", alignItems: "center", gap: 10, margin: "2px 0" },
  sectionLine: { flex: 1, height: 1, background: "rgba(151,125,255,0.22)" },
  sectionText: { fontSize: 11, color: "#7C6C96", fontWeight: "600", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: 11, display: "flex", alignItems: "center", pointerEvents: "none" },
  input: { paddingLeft: 34, paddingRight: 12, paddingTop: 11, paddingBottom: 11, fontSize: 14, border: "1.5px solid rgba(151,125,255,0.24)", borderRadius: 12, background: "#F8F2FF", color: "#4B2A88", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" },
  hint: { fontSize: 11, color: "#7C6C96", marginTop: 2 },
  errorBox: { display: "flex", alignItems: "center", gap: 8, background: "#FDE8F7", border: "1px solid #F3C2F3", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#9E355D" },
  actionRow: { display: "flex", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, padding: "12px", background: "#F4EAFF", border: "1.5px solid rgba(151,125,255,0.24)", borderRadius: 10, fontSize: 14, color: "#5D4B78", cursor: "pointer", fontFamily: "inherit" },
  submitBtn: { flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "linear-gradient(135deg,#977DFF,#6F5BFF)", border: "none", borderRadius: 10, fontSize: 14, color: "#fff", fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" },
};
