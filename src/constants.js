// ── Admin users ─────────────────────────────────────────────────────────
// Each admin has its own login, starting balance, and transaction history.
export const ADMIN_USERS = [
  {
    id: 0,
    username: "hannahalabi549@gmail.com",
    password: "Hannah332",
    name: "Janice Faith",
    accountNumber: "****8821",
    balance: 900000.0,
    isAdmin: true,
    transactions: [
      { id: 1, desc: "Direct deposit", date: "Feb 3, 2026", amount: 900000, type: "credit" },
      
    ],
  },
  {
    id: 1,
    username: "ca339533@gmail.com",
    password: "Punctuation",
    name: "Micheal Skelton",
    accountNumber: "****9987",
    balance: 182000.0,
    isAdmin: true,
    transactions: [
      
      { id: 1, desc: "Direct deposit", date: "Feb 3, 2026", amount: 182000.0, type: "credit" },
    ],
  },
  {
    id: 2,
    username: "Smithceaser076@gmail.com",
    password: "smith122",
    name: "Ceaser Smith",
    accountNumber: "****5678",
    balance: 120000.0,
    isAdmin: true,
    transactions: [
      { id: 1, desc: "Direct deposit", date: "April 20, 2026", amount: 120000.0, type: "credit" },
    ],
  },
];