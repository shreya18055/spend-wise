
import { useEffect, useMemo, useState } from "react";

import {
  Activity, ArrowDownLeft, ArrowUpRight, Bell, ChevronDown,
  CircleHelp, CreditCard, Ellipsis, FileText, Filter,
  LayoutDashboard, Plus, Search, Settings, ShoppingBag,
  Target, TrendingDown, TrendingUp, Wallet, X,
  CarFront, Clapperboard, BriefcaseBusiness, Utensils, Menu
} from "lucide-react";

import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, PieChart, Pie, Cell
} from "recharts";

import { initialBudgets, monthlyData } from "./data";
import { getTransactions, createTransaction } from "./api";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const iconFor = (category) => {
  if (category === "Transport") return CarFront;
  if (category === "Subscriptions") return Clapperboard;
  if (category === "Income") return BriefcaseBusiness;
  if (category === "Food & Dining" || category === "Food") return Utensils;
  if (category === "Shopping") return ShoppingBag;
  return CreditCard;
};

// SIDEBAR
function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  const items = [
    ["Overview", LayoutDashboard],
    ["Transactions", CreditCard],
    ["Budgets", Wallet],
    ["Savings goals", Target],
    ["Reports", FileText],
  ];

  return (
    <>
      {mobileOpen && (
        <div className="scrim" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={21} /></div>
          <span>spend<span className="brand-accent">wise</span></span>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav>
          {items.map(([name, Icon]) => (
            <button
              key={name}
              className={`nav-item ${active === name ? "active" : ""}`}
              onClick={() => {
                setActive(name);
                setMobileOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Target size={18} /></div>
            <strong>Make every rupee count.</strong>
            <p>Small steps today, bigger goals tomorrow.</p>
            <button onClick={() => setActive("Savings goals")}>
              Explore goals <ArrowUpRight size={14} />
            </button>
          </div>

          <button className="nav-item"><Settings size={18} />Settings</button>
          <button className="nav-item"><CircleHelp size={18} />Help & support</button>

          <div className="profile">
            <div className="avatar">SN</div>
            <div className="profile-copy">
              <strong>Shreya N.</strong>
              <span>Personal account</span>
            </div>
            <Ellipsis size={18} className="muted" />
          </div>
        </div>
      </aside>
    </>
  );
}

// STAT CARD
function StatCard({ title, value, change, positive, icon: Icon, tone, note }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className={`stat-icon ${tone}`}><Icon size={18} /></span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-foot">
        <span className={`change ${positive ? "up" : "down"}`}>
          {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </span>
        <span>{note}</span>
      </div>
    </div>
  );
}

// ADD TRANSACTION MODAL
function AddTransactionModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food & Dining",
    type: "expense",
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || Number(form.amount) <= 0) return;

    setSaving(true);
    setError("");

    try {
      await onAdd({
        ...form,
        amount: Number(form.amount),
      });

      onClose();
    } catch (err) {
      setError(err.message || "Could not save transaction");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form
        className="modal"
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">NEW ENTRY</span>
            <h2>Add transaction</h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>

        <div className="type-switch">
          <button
            type="button"
            className={form.type === "expense" ? "selected expense" : ""}
            onClick={() => update("type", "expense")}
          >
            Expense
          </button>

          <button
            type="button"
            className={form.type === "income" ? "selected income" : ""}
            onClick={() => update("type", "income")}
          >
            Income
          </button>
        </div>

        <label>
          Description
          <input
            required
            placeholder="e.g. Weekly groceries"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </label>

        <label>
          Amount (₹)
          <input
            required
            min="1"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
          />
        </label>

        <div className="form-row">
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {[
                "Food & Dining",
                "Food",
                "Transport",
                "Shopping",
                "Subscriptions",
                "Bills",
                "Health",
                "Income",
                "Other",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </label>
        </div>

        {error && (
          <p style={{ color: "#ff7777" }}>{error}</p>
        )}

        <button
          className="primary-button modal-submit"
          type="submit"
          disabled={saving}
        >
          <Plus size={17} />
          {saving ? "Saving..." : "Save transaction"}
        </button>
      </form>
    </div>
  );
}

// MAIN APPLICATION
function App() {
  const [active, setActive] = useState("Overview");

  const [transactions, setTransactions] = useState([]);
  const [budgets] = useState(initialBudgets);

  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState("Last 6 months");

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // LOAD TRANSACTIONS FROM SPRING BOOT
  useEffect(() => {
    let isMounted = true;

    getTransactions()
      .then((data) => {
        if (isMounted) {
          setTransactions(data);
          setApiError("");
        }
      })
      .catch((error) => {
        if (isMounted) {
          setApiError(error.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // CALCULATE TOTALS FROM DATABASE TRANSACTIONS
  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      savings: income - expenses,
    };
  }, [transactions]);

  // SEARCH TRANSACTIONS
  const filtered = transactions.filter((t) =>
    `${t.title} ${t.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  // SAVE TRANSACTION TO POSTGRESQL THROUGH SPRING BOOT
  const addTransaction = async (transaction) => {
    const savedTransaction = await createTransaction(transaction);

    setTransactions((prev) => [savedTransaction, ...prev]);
    setApiError("");

    return savedTransaction;
  };

  const pieData = budgets.map((b) => ({
    name: b.name,
    value: b.spent,
    color: b.color,
  }));

  const pageTitle =
    active === "Overview" ? "Good morning, Shreya" : active;

  return (
    <div className="app-shell">

      <Sidebar
        active={active}
        setActive={setActive}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="main-content">

        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{active}</strong>
          </div>

          <div className="top-actions">
            <div className="search-box">
              <Search size={16} />
              <input
                placeholder="Search anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd>⌘ K</kbd>
            </div>

            <button className="icon-button notification">
              <Bell size={18} />
              <i />
            </button>

            <div className="top-avatar">SN</div>
          </div>
        </header>

        <div className="page-wrap">

          {loading && (
            <p style={{ color: "#a5acc0", marginBottom: "16px" }}>
              Loading transactions from database...
            </p>
          )}

          {apiError && (
            <p style={{ color: "#ff7777", marginBottom: "16px" }}>
              Backend error: {apiError}
            </p>
          )}

          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).toUpperCase()}
              </div>

              <h1>
                {pageTitle}
                <span className="wave">✦</span>
              </h1>

              <p className="subheading">
                {active === "Overview"
                  ? "Here's what's happening with your money."
                  : `Manage and review your ${active.toLowerCase()}.`}
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setModalOpen(true)}
            >
              <Plus size={17} /> Add transaction
            </button>
          </section>

          {active === "Overview" ? (
            <>
              <section className="stats-grid">
                <StatCard
                  title="Total balance"
                  value={money(totals.balance)}
                  change="Live"
                  positive
                  icon={Wallet}
                  tone="purple"
                  note="from transactions"
                />

                <StatCard
                  title="Total income"
                  value={money(totals.income)}
                  change="Live"
                  positive
                  icon={ArrowDownLeft}
                  tone="green"
                  note="from database"
                />

                <StatCard
                  title="Total expenses"
                  value={money(totals.expenses)}
                  change="Live"
                  positive={false}
                  icon={ArrowUpRight}
                  tone="orange"
                  note="from database"
                />

                <StatCard
                  title="Net savings"
                  value={money(totals.savings)}
                  change="Live"
                  positive={totals.savings >= 0}
                  icon={Target}
                  tone="blue"
                  note="income minus expenses"
                />
              </section>

              <section className="dashboard-grid">

                <div className="panel cashflow-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Cash flow</h3>
                      <p>Track your income and expenses over time</p>
                    </div>

                    <select
                      className="period-select"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option>Last 6 months</option>
                      <option>Last 3 months</option>
                    </select>
                  </div>

                  <div className="chart-legend">
                    <span>
                      <i className="legend-dot income-dot" /> Income
                    </span>
                    <span>
                      <i className="legend-dot expense-dot" /> Expenses
                    </span>
                  </div>

                  <div className="cash-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={
                          period === "Last 3 months"
                            ? monthlyData.slice(-3)
                            : monthlyData
                        }
                        margin={{
                          top: 12,
                          right: 8,
                          left: -18,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="incomeFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#7c6cf0"
                              stopOpacity={0.25}
                            />
                            <stop
                              offset="100%"
                              stopColor="#7c6cf0"
                              stopOpacity={0}
                            />
                          </linearGradient>

                          <linearGradient
                            id="expenseFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#35c9b2"
                              stopOpacity={0.18}
                            />
                            <stop
                              offset="100%"
                              stopColor="#35c9b2"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          stroke="#252c40"
                          strokeDasharray="3 5"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#778099", fontSize: 11 }}
                          dy={10}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#778099", fontSize: 10 }}
                          tickFormatter={(v) => `₹${v / 1000}k`}
                        />

                        <Tooltip
                          contentStyle={{
                            background: "#171e31",
                            border: "1px solid #303951",
                            borderRadius: 10,
                            color: "#fff",
                          }}
                          formatter={(v) => money(v)}
                        />

                        <Area
                          type="monotone"
                          dataKey="income"
                          stroke="#8b7cf6"
                          strokeWidth={2.5}
                          fill="url(#incomeFill)"
                        />

                        <Area
                          type="monotone"
                          dataKey="expenses"
                          stroke="#36cfc9"
                          strokeWidth={2.5}
                          fill="url(#expenseFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="panel spending-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Spending breakdown</h3>
                      <p>Where your money goes</p>
                    </div>

                    <button className="more-button">
                      <Ellipsis size={19} />
                    </button>
                  </div>

                  <div className="donut-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={67}
                          outerRadius={91}
                          paddingAngle={4}
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>

                        <Tooltip
                          formatter={(v) => money(v)}
                          contentStyle={{
                            background: "#171e31",
                            border: "1px solid #303951",
                            borderRadius: 10,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="donut-center">
                      <strong>
                        {money(
                          budgets.reduce((sum, b) => sum + b.spent, 0)
                        )}
                      </strong>
                      <span>Total spent</span>
                    </div>
                  </div>

                  <div className="category-legend">
                    {budgets.map((b) => (
                      <div key={b.name}>
                        <span>
                          <i style={{ background: b.color }} />
                          {b.name}
                        </span>
                        <strong>{money(b.spent)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="bottom-grid">

                <div className="panel transactions-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Recent transactions</h3>
                      <p>Your latest financial activity</p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => setActive("Transactions")}
                    >
                      View all <ArrowUpRight size={14} />
                    </button>
                  </div>

                  <TransactionTable transactions={filtered.slice(0, 5)} />
                </div>

                <div className="panel budgets-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Monthly budgets</h3>
                      <p>November 2026</p>
                    </div>

                    <button className="more-button">
                      <Ellipsis size={19} />
                    </button>
                  </div>

                  <div className="budget-list">
                    {budgets.map((b) => (
                      <div className="budget-item" key={b.name}>
                        <div className="budget-meta">
                          <span>{b.name}</span>
                          <strong>
                            {money(b.spent)} <small>/ {money(b.limit)}</small>
                          </strong>
                        </div>

                        <div className="progress-track">
                          <div
                            style={{
                              width: `${Math.min(
                                100,
                                (b.spent / b.limit) * 100
                              )}%`,
                              background: b.color,
                            }}
                          />
                        </div>

                        <div className="budget-foot">
                          {Math.round((b.spent / b.limit) * 100)}% used
                          <span>{money(b.limit - b.spent)} left</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </section>
            </>
          ) : active === "Transactions" ? (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h3>All transactions</h3>
                  <p>Search, review and add your financial activity</p>
                </div>

                <button className="secondary-button">
                  <Filter size={15} /> Filter
                </button>
              </div>

              <TransactionTable transactions={filtered} full />
            </section>
          ) : active === "Budgets" ? (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h3>Your monthly budgets</h3>
                  <p>November 2026 · Keep your spending on track</p>
                </div>

                <button className="secondary-button">
                  <Plus size={15} /> Create budget
                </button>
              </div>

              <div className="budget-list large">
                {budgets.map((b) => (
                  <div className="budget-item" key={b.name}>
                    <div className="budget-meta">
                      <span>{b.name}</span>
                      <strong>
                        {money(b.spent)} <small>/ {money(b.limit)}</small>
                      </strong>
                    </div>

                    <div className="progress-track">
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            (b.spent / b.limit) * 100
                          )}%`,
                          background: b.color,
                        }}
                      />
                    </div>

                    <div className="budget-foot">
                      {Math.round((b.spent / b.limit) * 100)}% used
                      <span>{money(b.limit - b.spent)} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="panel placeholder-panel">
              <div className="placeholder-icon">
                {active === "Savings goals" ? <Target /> : <FileText />}
              </div>

              <h2>{active} coming soon</h2>
              <p>
                This section is part of the next SpendWise development milestone.
              </p>

              <button
                className="secondary-button"
                onClick={() => setActive("Overview")}
              >
                Back to overview
              </button>
            </section>
          )}

          <footer className="footer">
            <span>© 2026 SpendWise. Built for better money habits.</span>
            <span><i className="status-dot" /> All systems operational</span>
          </footer>

        </div>
      </main>

      {modalOpen && (
        <AddTransactionModal
          onClose={() => setModalOpen(false)}
          onAdd={addTransaction}
        />
      )}

    </div>
  );
}

// TRANSACTION TABLE
function TransactionTable({ transactions }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>TRANSACTION</th>
            <th>CATEGORY</th>
            <th>DATE</th>
            <th className="amount-col">AMOUNT</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length ? (
            transactions.map((t) => {
              const Icon = iconFor(t.category);

              return (
                <tr key={t.id}>
                  <td>
                    <div className="transaction-name">
                      <span className={`transaction-icon ${t.type}`}>
                        <Icon size={16} />
                      </span>
                      <strong>{t.title}</strong>
                    </div>
                  </td>

                  <td>
                    <span className="category-pill">{t.category}</span>
                  </td>

                  <td className="date-cell">
                    {new Date(`${t.date}T00:00:00`).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td className={`amount-cell ${t.type}`}>
                    {t.type === "income" ? "+" : "−"}
                    {money(t.amount)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="empty-state">
                No matching transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
