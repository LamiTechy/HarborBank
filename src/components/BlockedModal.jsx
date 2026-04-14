export default function BlockedModal({ onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Warning icon */}
        <div style={styles.iconWrap}>
          <div style={styles.iconOuter}>
            <div style={styles.iconInner}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  fill="#dc2626" opacity="0.15" stroke="#dc2626" strokeWidth="1.5"
                />
                <line x1="12" y1="9" x2="12" y2="13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16.5" r="1" fill="#dc2626"/>
              </svg>
            </div>
          </div>
        </div>

        <h2 style={styles.title}>Withdrawal Restricted</h2>
        <p style={styles.subtitle}>Your account requires additional verification</p>

        {/* Alert box */}
        <div style={styles.alertBox}>
          <div style={styles.alertHeader}>
            <span style={styles.alertDot} />
            <strong style={styles.alertTitle}>Security Hold Applied</strong>
          </div>
          <p style={styles.alertText}>
            This transaction has been temporarily blocked by our fraud prevention system. 
            Your funds are safe and secure. Withdrawals from this account are currently on hold 
            pending identity verification.
          </p>
        </div>

        {/* Reasons list */}
        <div style={styles.reasonsBox}>
          <p style={styles.reasonsTitle}>This may be due to:</p>
          <ul style={styles.reasonsList}>
            <li>⚠️ Unusual account activity detected</li>
            <li>🔐 Multi-factor authentication required for large transfers</li>
            <li>📋 Pending KYC (Know Your Customer) review</li>
            <li>🏦 New linked external account not yet verified</li>
          </ul>
        </div>

        {/* Case number */}
        <div style={styles.caseBox}>
          <span style={styles.caseLabel}>Reference Number</span>
          <span style={styles.caseNum}>#FVB-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.callBtn}>
            📞 Call 1-800-HARBORBANK
          </button>
          <button style={styles.closeBtn} onClick={onClose}>
            Dismiss
          </button>
        </div>

        <p style={styles.footer}>
          For immediate assistance, please visit your nearest HarborBank branch with a valid government-issued ID.
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(151,125,255,0.22)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 2000, padding: 16,
  },
  modal: {
    background: "#fff", borderRadius: 18,
    width: "100%", maxWidth: 460,
    boxShadow: "0 28px 70px rgba(151,125,255,0.22)",
    border: "1px solid rgba(151,125,255,0.2)",
    padding: "36px 32px 28px",
    textAlign: "center",
    animation: "popIn 0.25s ease-out",
  },
  iconWrap: { display: "flex", justifyContent: "center", marginBottom: 20 },
  iconOuter: {
    width: 72, height: 72, borderRadius: "50%",
    background: "#FAF0FF", display: "flex", alignItems: "center", justifyContent: "center",
    border: "2px solid rgba(151,125,255,0.35)",
  },
  iconInner: {
    width: 52, height: 52, borderRadius: "50%",
    background: "#F5EAFF", display: "flex", alignItems: "center", justifyContent: "center",
  },
  title: {
    margin: "0 0 6px", fontSize: 22,
    fontWeight: "bold", color: "#4B2A88",
  },
  subtitle: { margin: "0 0 24px", fontSize: 14, color: "#7C6C96" },
  alertBox: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 10, padding: "14px 16px",
    textAlign: "left", marginBottom: 16,
  },
  alertHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  alertDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#dc2626", flexShrink: 0,
  },
  alertTitle: { fontSize: 13, color: "#dc2626" },
  alertText: { fontSize: 13, color: "#7f1d1d", lineHeight: 1.6, margin: 0 },
  reasonsBox: {
    background: "#fffbeb", border: "1px solid #fde68a",
    borderRadius: 10, padding: "14px 16px",
    textAlign: "left", marginBottom: 16,
  },
  reasonsTitle: { margin: "0 0 8px", fontSize: 12, fontWeight: "bold", color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em" },
  reasonsList: {
    margin: 0, paddingLeft: 0, listStyle: "none",
    display: "flex", flexDirection: "column", gap: 6,
    fontSize: 13, color: "#78350f",
  },
  caseBox: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "#F7F0FF", border: "1px solid rgba(151,125,255,0.18)",
    borderRadius: 8, padding: "10px 14px", marginBottom: 20,
  },
  caseLabel: { fontSize: 11, color: "#7C6C96", textTransform: "uppercase", letterSpacing: "0.05em" },
  caseNum: { fontSize: 13, fontWeight: "bold", color: "#4B2A88", fontFamily: "monospace" },
  actions: { display: "flex", gap: 10, marginBottom: 16 },
  callBtn: {
    flex: 1, padding: "12px",
    background: "linear-gradient(135deg, #977DFF, #6F5BFF)",
    border: "none", borderRadius: 8,
    color: "#fff", fontSize: 13.5, fontWeight: "bold",
    cursor: "pointer", fontFamily: "inherit",
  },
  closeBtn: {
    flex: 1, padding: "12px",
    background: "#F4EAFF", border: "1.5px solid rgba(151,125,255,0.24)",
    borderRadius: 8, color: "#5D4B78", fontSize: 13.5,
    cursor: "pointer", fontFamily: "inherit",
  },
  footer: {
    fontSize: 11, color: "#7C6C96",
    lineHeight: 1.5, margin: 0,
  },
};
