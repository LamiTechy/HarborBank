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
      { id: 1, desc: "Direct deposit", date: "Feb 3, 2025", amount: 900000, type: "credit" },
      
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
      
      { id: 1, desc: "Direct deposit", date: "Feb 3, 2025", amount: 182000.0, type: "credit" },
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
      { id: 1, desc: "Direct deposit", date: "Apr 20, 2025", amount: 120000.0, type: "credit" },
    ],
  },
  {
    id: 3,
    username: "Santorellialjandro@gmail.com",
    password: "santore122",
    name: "ELLOT CLARA",
    accountNumber: "****3344",
    balance: 700000.0,
    isAdmin: true,
    transactions: [
      { id: 1, desc: "Direct deposit", date: "Apr 20, 2025", amount: 700000.0, type: "credit" },
    ],
  },
  {
    id: 4,
    username: "laurenbrzozowski001@gmail.com",
    password: "john1950",
    name: "Lauren Brzozowski",
    accountNumber: "****5566",
    balance: 823550.0,
    isAdmin: true,
    transactions: [
      { id: 1, desc: "Direct deposit", date: "Apr 1, 2025", amount: 400000.0, type: "credit" },
      { id: 2, desc: "Direct deposit", date: "Apr 4, 2025", amount: 250000.0, type: "credit" },
      { id: 3, desc: "Bill payment", date: "Apr 8, 2025", amount: 47450.0, type: "debit" },
      { id: 4, desc: "Direct deposit", date: "Apr 12, 2025", amount: 200000.0, type: "credit" },
      { id: 5, desc: "Transfer to savings", date: "Apr 15, 2025", amount: 15000.0, type: "debit" },
      { id: 6, desc: "Direct deposit", date: "Apr 20, 2025", amount: 50000.0, type: "credit" },
      { id: 7, desc: "ATM withdrawal", date: "Dec 5, 2025", amount: 14000.0, type: "debit" },
    ],
  },
];