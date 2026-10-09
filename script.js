/* SUB Bank — educational demo only.
   This client-side app is not secure enough for real banking or real money. */
const DB_KEY = "subBankDemoUsers_v2";
const SESSION_KEY = "subBankDemoCurrentUser_v2";
const STARTING_BALANCE = 25000;

const $ = (id) => document.getElementById(id);
let currentPage = "dashboard";
let moneyAction = "transfer";
let toastTimer;

function readUsers() {
  try { const data = JSON.parse(localStorage.getItem(DB_KEY) || "[]"); return Array.isArray(data) ? data : []; }
  catch { return []; }
}
function saveUsers(users) { localStorage.setItem(DB_KEY, JSON.stringify(users)); }
function getSessionId() { return localStorage.getItem(SESSION_KEY); }
function getCurrentUser() { const id = getSessionId(); return readUsers().find(u => u.id === id) || null; }
function updateUser(updated) {
  const users = readUsers().map(u => u.id === updated.id ? updated : u);
  saveUsers(users);
}
function uid() { return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`); }
function accountNumber() { return "SUB" + Math.floor(1000000000 + Math.random() * 9000000000); }
function currency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(Number(value) || 0);
}
function safe(text) { return String(text ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c])); }
function toast(message) {
  $("toast").textContent = message; $("toast").classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2600);
}
function setMessage(id, message, success = false) {
  const el = $(id); if (!el) return;
  el.textContent = message; el.classList.toggle("success", success);
}
function setAuthTab(tab) {
  document.querySelectorAll(".auth-tabs .tab").forEach(b => b.classList.toggle("active", b.dataset.auth === tab));
  $("loginForm").classList.toggle("hidden", tab !== "login");
  $("registerForm").classList.toggle("hidden", tab !== "register");
  setMessage("authMessage", "");
}
function showAuth(tab = "login") {
  $("authView").classList.remove("hidden"); $("appView").classList.add("hidden"); setAuthTab(tab);
}
function showApp() {
  const user = getCurrentUser();
  if (!user) { localStorage.removeItem(SESSION_KEY); showAuth(); return; }
  $("authView").classList.add("hidden"); $("appView").classList.remove("hidden");
  renderAll(); navigate("dashboard");
}
function addTransaction(user, type, amount, description, note = "", otherParty = "") {
  user.transactions = Array.isArray(user.transactions) ? user.transactions : [];
  user.transactions.unshift({
    id: "TXN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
    type, amount: Number(amount), description, note, otherParty, date: new Date().toISOString()
  });
}
function registerUser(name, email, password) {
  const users = readUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error("An account with this email already exists.");
  // Demo only: plaintext passwords are not safe. A real app must use server-side password hashing.
  const user = {
    id: uid(), name, email: email.toLowerCase(), password,
    accountNumber: accountNumber(), balance: STARTING_BALANCE,
    createdAt: new Date().toISOString(), transactions: []
  };
  addTransaction(user, "deposit", STARTING_BALANCE, "Opening demo balance", "Welcome to SUB Bank");
  users.push(user); saveUsers(users);
  localStorage.setItem(SESSION_KEY, user.id);
}
function loginUser(email, password) {
  const user = readUsers().find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) throw new Error("Email or password is incorrect.");
  localStorage.setItem(SESSION_KEY, user.id);
}
function navigate(page) {
  const user = getCurrentUser(); if (!user) return showAuth();
  const allowed = ["dashboard", "transactions", "transfer", "deposit", "withdraw", "profile", "security"];
  if (!allowed.includes(page)) page = "dashboard";
  currentPage = page;
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("hidden", p.id !== `page-${page}`));
  document.querySelectorAll(".nav-link[data-page]").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  const titles = {dashboard:"Dashboard",transactions:"Transactions",transfer:"Transfer money",deposit:"Deposit money",withdraw:"Withdraw money",profile:"Profile",security:"Security"};
  $("pageTitle").textContent = titles[page];
  if (page === "transfer" || page === "deposit" || page === "withdraw") setupMoneyForm(page);
  if (page === "profile") renderProfile();
  $("sidebar").classList.remove("open");
}
function renderAll() {
  const user = getCurrentUser(); if (!user) return;
  const initial = (user.name.trim()[0] || "U").toUpperCase();
  $("sideName").textContent = user.name; $("sideAvatar").textContent = initial;
  $("topAvatar").textContent = initial; $("welcomeName").textContent = user.name.split(/\s+/)[0] + " 👋";
  $("balanceValue").textContent = currency(user.balance);
  const tx = user.transactions || [];
  const received = tx.filter(t => ["deposit","transfer-in"].includes(t.type)).reduce((s,t)=>s+t.amount,0);
  const sent = tx.filter(t => ["withdraw","transfer-out"].includes(t.type)).reduce((s,t)=>s+t.amount,0);
  $("receivedValue").textContent = currency(received); $("sentValue").textContent = currency(sent);
  renderTransactions("recentTransactions", tx.slice(0, 5));
  renderTransactions("allTransactions", filterTransactions(tx));
  renderProfile();
}
function typeLabel(type) {
  return ({deposit:"Deposit",withdraw:"Withdrawal","transfer-in":"Transfer received","transfer-out":"Transfer sent"})[type] || "Transaction";
}
function renderTransactions(containerId, transactions) {
  const container = $(containerId);
  if (!transactions.length) { container.innerHTML = '<div class="empty">No transactions yet. Your activity will appear here.</div>'; return; }
  container.innerHTML = transactions.map(tx => {
    const incoming = ["deposit","transfer-in"].includes(tx.type);
    const icon = tx.type === "deposit" ? "↓" : tx.type === "withdraw" ? "↑" : "⇄";
    const date = new Date(tx.date);
    return `<div class="transaction-row"><div class="tx-icon ${incoming ? "" : "out"}">${icon}</div><div class="tx-main"><b>${safe(tx.description || typeLabel(tx.type))}</b><small>${safe(date.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}))} · ${safe(date.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}))}${tx.note ? " · " + safe(tx.note) : ""}</small></div><div class="tx-amount ${incoming ? "in" : "out"}">${incoming ? "+" : "−"}${currency(tx.amount)}</div></div>`;
  }).join("");
}
function filterTransactions(tx) {
  const search = ($("transactionSearch")?.value || "").trim().toLowerCase();
  const filter = $("transactionFilter")?.value || "all";
  return tx.filter(t => (filter === "all" || t.type === filter) &&
    `${t.description} ${t.note} ${t.otherParty} ${t.id} ${typeLabel(t.type)}`.toLowerCase().includes(search));
}
function renderProfile() {
  const user = getCurrentUser(); if (!user) return;
  $("profileAvatar").textContent = (user.name[0] || "U").toUpperCase();
  $("profileHeading").textContent = user.name;
  $("profileName").value = user.name; $("profileEmail").value = user.email; $("profileAccount").value = user.accountNumber;
}
function setupMoneyForm(page) {
  moneyAction = page;
  const titles = {transfer:"Transfer money",deposit:"Deposit money",withdraw:"Withdraw money"};
  $("moneyTitle").textContent = titles[page];
  $("recipientLabel").classList.toggle("hidden", page !== "transfer");
  $("moneySubmit").textContent = page === "transfer" ? "Confirm transfer →" : page === "deposit" ? "Deposit demo funds →" : "Withdraw demo funds →";
  $("moneyAmount").value = ""; $("moneyNote").value = ""; $("recipientEmail").value = ""; setMessage("moneyMessage","");
}
function performMoneyAction(action, amount, note, recipientEmail = "") {
  const sender = getCurrentUser(); if (!sender) throw new Error("Please sign in again.");
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000) throw new Error("Enter an amount between ₹1 and ₹10,00,000.");
  if (action === "deposit") {
    sender.balance = Number((sender.balance + amount).toFixed(2));
    addTransaction(sender, "deposit", amount, "Demo deposit", note || "Added demo funds");
    updateUser(sender); return "Demo deposit completed.";
  }
  if (action === "withdraw") {
    if (amount > sender.balance) throw new Error("Insufficient demo balance.");
    sender.balance = Number((sender.balance - amount).toFixed(2));
    addTransaction(sender, "withdraw", amount, "Demo withdrawal", note || "Withdrawn demo funds");
    updateUser(sender); return "Demo withdrawal completed.";
  }
  const email = recipientEmail.trim().toLowerCase();
  if (!email) throw new Error("Enter the recipient's registered email.");
  if (email === sender.email) throw new Error("You cannot transfer to your own account.");
  if (amount > sender.balance) throw new Error("Insufficient demo balance.");
  const users = readUsers();
  const recipient = users.find(u => u.email.toLowerCase() === email);
  if (!recipient) throw new Error("Recipient not found. They must register in this browser first.");
  sender.balance = Number((sender.balance - amount).toFixed(2));
  recipient.balance = Number((recipient.balance + amount).toFixed(2));
  addTransaction(sender, "transfer-out", amount, `Transfer to ${recipient.name}`, note, recipient.email);
  addTransaction(recipient, "transfer-in", amount, `Transfer from ${sender.name}`, note, sender.email);
  saveUsers(users.map(u => u.id === sender.id ? sender : u.id === recipient.id ? recipient : u));
  return `Demo transfer sent to ${recipient.name}.`;
}
function downloadCSV() {
  const user = getCurrentUser(); if (!user) return;
  const rows = [["Transaction ID","Date","Type","Description","Amount (INR)","Note"], ...(user.transactions || []).map(t => [t.id,t.date,typeLabel(t.type),t.description,t.amount,t.note || ""])];
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = "sub-bank-transactions.csv"; a.click(); URL.revokeObjectURL(url);
}

document.querySelectorAll("[data-auth]").forEach(button => button.addEventListener("click", () => setAuthTab(button.dataset.auth)));
document.querySelectorAll("[data-switch]").forEach(button => button.addEventListener("click", () => setAuthTab(button.dataset.switch)));
$("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  try { loginUser($("loginEmail").value.trim(), $("loginPassword").value); showApp(); }
  catch (error) { setMessage("authMessage", error.message); }
});
$("registerForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("registerName").value.trim(), email = $("registerEmail").value.trim();
  const password = $("registerPassword").value, confirm = $("registerConfirm").value;
  if (name.length < 2) return setMessage("authMessage", "Please enter your full name.");
  if (password !== confirm) return setMessage("authMessage", "Passwords do not match.");
  try { registerUser(name, email, password); showApp(); toast("Demo account created."); }
  catch (error) { setMessage("authMessage", error.message); }
});
document.querySelectorAll("[data-page]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.page)));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));
$("moneyForm").addEventListener("submit", event => {
  event.preventDefault();
  try {
    const amount = Number($("moneyAmount").value), note = $("moneyNote").value.trim(), recipient = $("recipientEmail").value;
    const message = performMoneyAction(moneyAction, amount, note, recipient);
    renderAll(); setMessage("moneyMessage", message, true); toast(message); $("moneyForm").reset();
  } catch (error) { setMessage("moneyMessage", error.message); }
});
$("depositForm").addEventListener("submit", event => {
  event.preventDefault();
  try { const message = performMoneyAction("deposit", Number($("depositAmount").value), $("depositNote").value.trim()); renderAll(); setMessage("depositMessage", message, true); toast(message); event.target.reset(); }
  catch (error) { setMessage("depositMessage", error.message); }
});
$("withdrawForm").addEventListener("submit", event => {
  event.preventDefault();
  try { const message = performMoneyAction("withdraw", Number($("withdrawAmount").value), $("withdrawNote").value.trim()); renderAll(); setMessage("withdrawMessage", message, true); toast(message); event.target.reset(); }
  catch (error) { setMessage("withdrawMessage", error.message); }
});
$("profileForm").addEventListener("submit", event => {
  event.preventDefault();
  const user = getCurrentUser(), name = $("profileName").value.trim();
  if (!user || name.length < 2) return setMessage("profileMessage", "Enter a valid name.");
  user.name = name; updateUser(user); renderAll(); setMessage("profileMessage", "Profile updated.", true); toast("Profile updated.");
});
$("transactionSearch").addEventListener("input", () => renderTransactions("allTransactions", filterTransactions(getCurrentUser()?.transactions || [])));
$("transactionFilter").addEventListener("change", () => renderTransactions("allTransactions", filterTransactions(getCurrentUser()?.transactions || [])));
$("exportBtn").addEventListener("click", downloadCSV);
$("logoutBtn").addEventListener("click", () => { localStorage.removeItem(SESSION_KEY); showAuth(); toast("Logged out."); });
$("themeBtn").addEventListener("click", () => { document.body.classList.toggle("dark"); localStorage.setItem("subBankDemoTheme", document.body.classList.contains("dark") ? "dark" : "light"); });
$("mobileMenu").addEventListener("click", () => $("sidebar").classList.toggle("open"));
$("resetDataBtn").addEventListener("click", () => {
  if (!confirm("Delete every SUB Bank demo account and transaction stored in this browser? This cannot be undone.")) return;
  localStorage.removeItem(DB_KEY); localStorage.removeItem(SESSION_KEY); showAuth(); toast("Demo data cleared.");
});
if (localStorage.getItem("subBankDemoTheme") === "dark") document.body.classList.add("dark");
if (getCurrentUser()) showApp(); else showAuth();
