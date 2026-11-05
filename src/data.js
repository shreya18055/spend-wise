export const initialTransactions = [
  { id: 1, title: "Monthly groceries", category: "Food & Dining", date: "2026-11-02", amount: 2450, type: "expense", icon: "shopping" },
  { id: 2, title: "Freelance payment", category: "Income", date: "2026-11-01", amount: 12000, type: "income", icon: "income" },
  { id: 3, title: "Metro recharge", category: "Transport", date: "2026-10-31", amount: 600, type: "expense", icon: "transport" },
  { id: 4, title: "Coffee with friends", category: "Food & Dining", date: "2026-10-30", amount: 380, type: "expense", icon: "food" },
  { id: 5, title: "Streaming subscription", category: "Subscriptions", date: "2026-10-28", amount: 299, type: "expense", icon: "subscription" },
  { id: 6, title: "Project stipend", category: "Income", date: "2026-10-26", amount: 8500, type: "income", icon: "income" }
];

export const initialBudgets = [
  { name: "Food & Dining", spent: 6250, limit: 9000, color: "#8b7cf6" },
  { name: "Transport", spent: 1850, limit: 3500, color: "#36cfc9" },
  { name: "Shopping", spent: 4200, limit: 5000, color: "#f4a261" },
  { name: "Subscriptions", spent: 899, limit: 1500, color: "#ed79a7" }
];

export const monthlyData = [
  { month: "Jun", income: 24000, expenses: 14200 },
  { month: "Jul", income: 26500, expenses: 16800 },
  { month: "Aug", income: 28000, expenses: 15100 },
  { month: "Sep", income: 25500, expenses: 17900 },
  { month: "Oct", income: 30500, expenses: 16400 },
  { month: "Nov", income: 32000, expenses: 13750 }
];
