// =====================================================
// SUB BANK - SCRIPT.JS
// =====================================================

// =====================================================
// BALANCE & SUMMARY
// =====================================================
let loanBalance =
    Number(localStorage.getItem("loanBalance")) || 0;
let currentUser = localStorage.getItem("loggedInUser");

let bankData =
    JSON.parse(localStorage.getItem("bankData")) || {};

if (!bankData[currentUser]) {

    bankData[currentUser] = {
        balance: 1000,
        totalDeposit: 0,
        totalWithdraw: 0,
        totalTransfer: 0,
        history: []
    };

    localStorage.setItem(
        "bankData",
        JSON.stringify(bankData)
    );
}
let fdBalance =
    Number(localStorage.getItem("fdBalance")) || 0;
let balance = bankData[currentUser].balance;
let totalDeposit = bankData[currentUser].totalDeposit;
let totalWithdraw = bankData[currentUser].totalWithdraw;
let totalTransfer = bankData[currentUser].totalTransfer;


// =====================================================
// TRANSACTION HISTORY
// =====================================================

let transactionHistory =
    JSON.parse(localStorage.getItem("transactionHistory")) || [];


// =====================================================
// NOTIFICATIONS
// =====================================================

let notifications =
    JSON.parse(localStorage.getItem("notifications")) || [];


// =====================================================
// UPDATE BALANCE
// =====================================================

function updateBalance() {
    balance = Number(balance) || 0;

    localStorage.setItem("balance", balance);

    updateDisplay();
}bankData[currentUser].balance = balance;
bankData[currentUser].totalDeposit = totalDeposit;
bankData[currentUser].totalWithdraw = totalWithdraw;
bankData[currentUser].totalTransfer = totalTransfer;
const fdElement = document.getElementById("fdBalance");
const loanElement =
    document.getElementById("loanBalance");

if (loanElement) {
    loanElement.innerText =
        "₹" + loanBalance.toFixed(2);
}
if (fdElement) {
    fdElement.innerText = "₹" + fdBalance.toFixed(2);
}
localStorage.setItem(
    "bankData",
    JSON.stringify(bankData)
);
const bar = document.getElementById("balanceBar");

if (bar) {

    let percent = (balance / 10000) * 100;

    if (percent > 100) {
        percent = 100;
    }

    bar.style.width = percent + "%";
}
document.getElementById("statBalance").innerText = "₹" + balance.toFixed(2);
document.getElementById("statDeposit").innerText = "₹" + totalDeposit.toFixed(2);
document.getElementById("statWithdraw").innerText = "₹" + totalWithdraw.toFixed(2);
document.getElementById("statTransfer").innerText = "₹" + totalTransfer.toFixed(2);
updateStatement();

// =====================================================
// DISPLAY BALANCE & SUMMARY
// =====================================================

function updateDisplay() {

    const balanceElement =
        document.getElementById("balance");

    const depositElement =
        document.getElementById("totalDeposit");

    const withdrawElement =
        document.getElementById("totalWithdraw");

    const transferElement =
        document.getElementById("totalTransfer");


    if (balanceElement) {
        balanceElement.innerText =
            "₹" + balance.toFixed(2);
    }

    if (depositElement) {
        depositElement.innerText =
            "₹" + totalDeposit.toFixed(2);
    }

    if (withdrawElement) {
        withdrawElement.innerText =
            "₹" + totalWithdraw.toFixed(2);
    }

    if (transferElement) {
        transferElement.innerText =
            "₹" + totalTransfer.toFixed(2);
    }
}


// =====================================================
// ADD TRANSACTION HISTORY
// =====================================================

function addHistory(text, type = "reset") {

    const transaction = {

        text: text,

        type: type,

        date: new Date().toLocaleString()

    };

    transactionHistory.unshift(transaction);


    // Keep latest 100 transactions
    if (transactionHistory.length > 100) {
        transactionHistory =
            transactionHistory.slice(0, 100);
    }


    localStorage.setItem(
        "transactionHistory",
        JSON.stringify(transactionHistory)
    );


    displayHistory();
    displayMiniStatement();
}


// =====================================================
// DISPLAY HISTORY
// =====================================================

function displayHistory() {
    

    const historyList =
        document.getElementById("history");


    if (!historyList) {
        return;
    }


    historyList.innerHTML = "";


    if (transactionHistory.length === 0) {

        historyList.innerHTML = `
            <li class="no-history">
                No transactions yet.
            </li>
        `;

        return;
    }


    transactionHistory.forEach(function (transaction) {

        const li =
            document.createElement("li");


        li.className =
            "transaction-" +
            (transaction.type || "reset");


        let icon = "🔄";


        if (transaction.type === "deposit") {
            icon = "💰";
        }

        else if (transaction.type === "withdraw") {
            icon = "💸";
        }

        else if (transaction.type === "transfer") {
            icon = "🔄";
        }

        else if (transaction.type === "reset") {
            icon = "🔄";
        }
else if (transaction.type === "fd") {
    icon = "🏦";
}

        const iconDiv =
            document.createElement("div");

        iconDiv.className =
            "transaction-icon";

        iconDiv.innerText = icon;


        const infoDiv =
            document.createElement("div");

        infoDiv.className =
            "transaction-info";


        const strong =
            document.createElement("strong");

        strong.innerText =
            transaction.text;


        const small =
            document.createElement("small");

        small.innerText =
            transaction.date;


        infoDiv.appendChild(strong);
        infoDiv.appendChild(small);

        li.appendChild(iconDiv);
        li.appendChild(infoDiv);

        historyList.appendChild(li);

    });
}


// =====================================================
// WELCOME BUTTON
// =====================================================

const btn =
    document.getElementById("btn");


if (btn) {

    btn.addEventListener("click", function () {

        alert("Welcome Aman! 🎉");

    });

}


// =====================================================
// DEPOSIT
// =====================================================

function deposit() {

    const input =
        document.getElementById("depositAmount");


    if (!input) {
        return;
    }


    const amount =
        Number(input.value);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert("Please enter a valid amount!");

        return;
    }


    balance += amount;

    totalDeposit += amount;


    localStorage.setItem(
        "balance",
        balance
    );

    localStorage.setItem(
        "totalDeposit",
        totalDeposit
    );


    updateDisplay();


    addHistory(
        "Deposited ₹" + amount.toFixed(2),
        "deposit"
    );displayMiniStatement();


    addNotification(
        "₹" +
        amount.toFixed(2) +
        " deposited successfully.",
        "💰"
    );


    input.value = "";


    alert(
        "Money Deposited Successfully! 💰"
    );
}


// =====================================================
// WITHDRAW
// =====================================================

function withdraw() {

    const input =
        document.getElementById("withdrawAmount");


    if (!input) {
        return;
    }


    const amount =
        Number(input.value);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert("Please enter a valid amount!");

        return;
    }


    if (amount > balance) {

        alert("Insufficient Balance!");

        return;
    }


    balance -= amount;

    totalWithdraw += amount;


    localStorage.setItem(
        "balance",
        balance
    );

    localStorage.setItem(
        "totalWithdraw",
        totalWithdraw
    );


    updateDisplay();


    addHistory(
        "Withdraw ₹" + amount.toFixed(2),
        "withdraw"
    );


    addNotification(
        "₹" +
        amount.toFixed(2) +
        " withdrawn successfully.",
        "💸"
    );


    input.value = "";


    alert(
        "Money Withdrawn Successfully! 💸"
    );
}


// =====================================================
// TRANSFER MONEY
// =====================================================

function transferMoney() {

    const accountInput =
        document.getElementById("accountNumber");

    const amountInput =
        document.getElementById("transferAmount");


    if (!accountInput || !amountInput) {
        return;
    }


    const account =
        accountInput.value.trim();

    const amount =
        Number(amountInput.value);


    if (
        account === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter valid transfer details!"
        );

        return;
    }


    if (amount > balance) {

        alert("Insufficient Balance!");

        return;
    }


    balance -= amount;

    totalTransfer += amount;


    localStorage.setItem(
        "balance",
        balance
    );

    localStorage.setItem(
        "totalTransfer",
        totalTransfer
    );


    updateDisplay();


    addHistory(
        "Transfer ₹" +
        amount.toFixed(2) +
        " to A/C " +
        account,
        "transfer"
    );


    addNotification(
        "₹" +
        amount.toFixed(2) +
        " transferred successfully.",
        "🔄"
    );


    accountInput.value = "";

    amountInput.value = "";


    alert(
        "Money Transferred Successfully! 🔄"
    );
}


// =====================================================
// RESET ACCOUNT
// =====================================================

function resetBalance() {

    const confirmReset =
        confirm(
            "Are you sure you want to reset the account?"
        );


    if (!confirmReset) {
        return;
    }


    balance = 1000;

    totalDeposit = 0;

    totalWithdraw = 0;

    totalTransfer = 0;


    localStorage.setItem(
        "balance",
        balance
    );

    localStorage.setItem(
        "totalDeposit",
        totalDeposit
    );

    localStorage.setItem(
        "totalWithdraw",
        totalWithdraw
    );

    localStorage.setItem(
        "totalTransfer",
        totalTransfer
    );


    updateDisplay();


    addHistory(
        "Account Reset",
        "reset"
    );


    addNotification(
        "Your account has been reset.",
        "🔄"
    );


    alert(
        "Account has been reset!"
    );
}


// =====================================================
// SEARCH TRANSACTION HISTORY
// =====================================================

function searchHistory() {

    const searchInput =
        document.getElementById(
            "searchTransaction"
        );


    const historyItems =
        document.querySelectorAll(
            "#history li"
        );


    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value.toLowerCase();


    historyItems.forEach(function (item) {

        const text =
            item.innerText.toLowerCase();


        if (text.includes(searchText)) {

            item.style.display = "";

        }

        else {

            item.style.display = "none";

        }

    });
}


// =====================================================
// DARK MODE
// =====================================================

function toggleDarkMode() {

    document.body.classList.toggle("dark");


    const darkMode =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "darkMode",
        darkMode
    );
}


// Load Dark Mode

if (
    localStorage.getItem("darkMode") === "true"
) {

    document.body.classList.add("dark");

}


// =====================================================
// LOGIN / REGISTER
// =====================================================

function getUsers() {

    const users =
        localStorage.getItem("users");


    if (!users) {
        return [];
    }


    try {

        return JSON.parse(users);

    }

    catch (error) {

        return [];

    }
}


// =====================================================
// SHOW REGISTER
// =====================================================

function showRegister() {

    const loginPage =
        document.getElementById("loginPage");

    const registerPage =
        document.getElementById("registerPage");


    if (loginPage) {
        loginPage.style.display = "none";
    }


    if (registerPage) {
        registerPage.style.display = "block";
    }
}


// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

    const loginPage =
        document.getElementById("loginPage");

    const registerPage =
        document.getElementById("registerPage");


    if (registerPage) {
        registerPage.style.display = "none";
    }


    if (loginPage) {
        loginPage.style.display = "block";
    }
}


// =====================================================
// LOGIN
// =====================================================

function login() {

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");


    if (!usernameInput || !passwordInput) {
        return;
    }


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (
        username === "" ||
        password === ""
    ) {

        alert(
            "Please enter username and password!"
        );

        return;
    }


    const users =
        getUsers();


    const user =
        users.find(function (u) {

            return (
                u.username === username &&
                u.password === password
            );

        });


    if (user) {

        localStorage.setItem(
            "loggedInUser",
            username
        );


        const loginPage =
            document.getElementById(
                "loginPage"
            );


        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (loginPage) {
            loginPage.style.display = "none";
        }


        if (dashboard) {
            dashboard.style.display = "block";
        }


        alert(
            "Login Successful! 🎉"
        );

    }

    else {

        alert(
            "Invalid Username or Password!"
        );

    }
}


// =====================================================
// REGISTER
// =====================================================

function register() {

    const usernameInput =
        document.getElementById("newUsername");

    const passwordInput =
        document.getElementById("newPassword");


    if (!usernameInput || !passwordInput) {
        return;
    }


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (
        username === "" ||
        password === ""
    ) {

        alert("Fill all fields!");

        return;
    }


    if (password.length < 6) {

        alert(
            "Password must contain at least 6 characters!"
        );

        return;
    }


    const users =
        getUsers();


    const exists =
        users.some(function (user) {

            return user.username === username;

        });


    if (exists) {

        alert(
            "Username already exists!"
        );

        return;
    }


    users.push({

        username: username,

        password: password

    });


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    alert(
        "Account Created Successfully! 🎉"
    );


    usernameInput.value = "";

    passwordInput.value = "";


    showLogin();
}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    const dashboard =
        document.getElementById(
            "dashboard"
        );


    const loginPage =
        document.getElementById(
            "loginPage"
        );


    if (dashboard) {
        dashboard.style.display = "none";
    }


    if (loginPage) {
        loginPage.style.display = "block";
    }


    const username =
        document.getElementById("username");


    const password =
        document.getElementById("password");


    if (username) {
        username.value = "";
    }


    if (password) {
        password.value = "";
    }


    localStorage.removeItem(
        "loggedInUser"
    );


    alert(
        "Logged Out Successfully!"
    );
}


// =====================================================
// DATE & TIME
// =====================================================

function updateDateTime() {

    const dateTime =
        document.getElementById(
            "dateTime"
        );


    if (!dateTime) {
        return;
    }


    const now =
        new Date();


    dateTime.innerText =
        now.toLocaleString();
}


updateDateTime();


setInterval(
    updateDateTime,
    1000
);


// =====================================================
// PASSWORD VISIBILITY
// =====================================================

function togglePassword(inputId) {

    const input =
        document.getElementById(inputId);


    if (!input) {
        return;
    }


    if (input.type === "password") {

        input.type = "text";

    }

    else {

        input.type = "password";

    }
}


// =====================================================
// CHANGE PASSWORD
// =====================================================

function changePassword() {

    const currentInput =
        document.getElementById(
            "currentPassword"
        );

    const newInput =
        document.getElementById(
            "newPassword"
        );

    const confirmInput =
        document.getElementById(
            "confirmPassword"
        );


    if (
        !currentInput ||
        !newInput ||
        !confirmInput
    ) {

        return;
    }


    const currentPassword =
        currentInput.value;

    const newPassword =
        newInput.value;

    const confirmPassword =
        confirmInput.value;


    if (
        currentPassword === "" ||
        newPassword === "" ||
        confirmPassword === ""
    ) {

        alert(
            "Please fill all password fields!"
        );

        return;
    }


    const savedPassword =
        localStorage.getItem(
            "bankPassword"
        ) || "au1234@1";


    if (
        currentPassword !== savedPassword
    ) {

        alert(
            "Current password is incorrect!"
        );

        return;
    }


    if (
        newPassword !== confirmPassword
    ) {

        alert(
            "New passwords do not match!"
        );

        return;
    }


    if (newPassword.length < 6) {

        alert(
            "Password must contain at least 6 characters!"
        );

        return;
    }


    localStorage.setItem(
        "bankPassword",
        newPassword
    );


    alert(
        "Password changed successfully! 🔐"
    );


    currentInput.value = "";

    newInput.value = "";

    confirmInput.value = "";
}


// =====================================================
// SIDEBAR NAVIGATION
// =====================================================

function showSection(section) {

    if (section === "home") {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    if (section === "profile") {

        const profile =
            document.querySelector(
                ".profile-card"
            );


        if (profile) {

            profile.scrollIntoView({

                behavior: "smooth"

            });

        }
    }


    if (section === "transactions") {

        const history =
            document.querySelector(
                ".history"
            );


        if (history) {

            history.scrollIntoView({

                behavior: "smooth"

            });

        }
    }


    if (section === "security") {

        const security =
            document.querySelector(
                ".security-card"
            );


        if (security) {

            security.scrollIntoView({

                behavior: "smooth"

            });

        }
    }
}


// =====================================================
// QUICK ACTION
// =====================================================

function focusInput(inputId) {

    const input =
        document.getElementById(inputId);


    if (!input) {
        return;
    }


    input.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    setTimeout(function () {

        input.focus();

    }, 500);
}


// =====================================================
// DISPLAY NOTIFICATIONS
// =====================================================

function displayNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    const count =
        document.getElementById(
            "notificationCount"
        );


    if (!list || !count) {
        return;
    }


    list.innerHTML = "";


    count.innerText =
        notifications.length;


    if (notifications.length === 0) {

        list.innerHTML = `

            <p class="no-notification">
                No new notifications
            </p>

        `;

        return;
    }


    notifications.forEach(function (
        notification
    ) {

        const item =
            document.createElement("div");


        item.className =
            "notification-item";


        const icon =
            document.createElement("span");

        icon.innerText =
            notification.icon || "🔔";


        const content =
            document.createElement("div");


        const strong =
            document.createElement("strong");

        strong.innerText =
            notification.text;


        const small =
            document.createElement("small");

        small.innerText =
            notification.date;


        content.appendChild(strong);
        content.appendChild(small);


        item.appendChild(icon);
        item.appendChild(content);


        list.appendChild(item);

    });
}


// =====================================================
// ADD NOTIFICATION
// =====================================================

function addNotification(
    text,
    icon = "🔔"
) {

    const notification = {

        text: text,

        icon: icon,

        date: new Date().toLocaleString()

    };


    notifications.unshift(
        notification
    );


    if (notifications.length > 50) {

        notifications =
            notifications.slice(0, 50);

    }


    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );


    displayNotifications();
}


// =====================================================
// TOGGLE NOTIFICATION PANEL
// =====================================================

function toggleNotifications() {

    const panel =
        document.getElementById(
            "notificationPanel"
        );


    if (!panel) {
        return;
    }


    panel.classList.toggle("show");
}


// =====================================================
// CLEAR NOTIFICATIONS
// =====================================================

function clearNotifications() {

    notifications = [];


    localStorage.removeItem(
        "notifications"
    );


    displayNotifications();
}


// =====================================================
// AUTO LOGIN CHECK
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loggedInUser =
            localStorage.getItem(
                "loggedInUser"
            );


        const loginPage =
            document.getElementById(
                "loginPage"
            );


        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (
            loggedInUser &&
            dashboard &&
            loginPage
        ) {

            loginPage.style.display =
                "none";

            dashboard.style.display =
                "block";

        }


        updateDisplay();

        displayHistory();

        displayNotifications();

    }
);


// =====================================================
// INITIAL LOAD
// =====================================================

updateDisplay();

displayHistory();

displayNotifications();// =====================================================
// SIDEBAR TOGGLE
// =====================================================

function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle("open");
}


// =====================================================
// SHOW SECTION
// =====================================================

function showSection(section) {

    const sections = [
        "home",
        "profile",
        "transactions",
        "security"
    ];

    sections.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.style.display =
                id === section ? "block" : "none";

        }

    });


    // Active sidebar button

    const buttons =
        document.querySelectorAll(".side-btn");


    buttons.forEach(function (button) {

        button.classList.remove("active");

    });


    const activeButton =
        document.querySelector(
            `.side-btn[onclick="showSection('${section}')"]`
        );


    if (activeButton) {

        activeButton.classList.add("active");

    }


    // Close sidebar on mobile

    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {

        sidebar.classList.remove("open");

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


// =====================================================
// CLEAR TRANSACTION HISTORY
// =====================================================

function clearHistory() {

    if (transactionHistory.length === 0) {

        alert("No transaction history to clear.");

        return;
    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear transaction history?"
        );


    if (!confirmClear) {
        return;
    }


    transactionHistory = [];


    localStorage.removeItem(
        "transactionHistory"
    );


    displayHistory();


    alert(
        "Transaction history cleared successfully! 🗑️"
    );
}function printPassbook() {
    window.print();
}function updateStatement() {

    document.getElementById("statementBalance").innerText =
        "₹" + balance.toFixed(2);

    document.getElementById("statementDeposit").innerText =
        "₹" + totalDeposit.toFixed(2);

    document.getElementById("statementWithdraw").innerText =
        "₹" + totalWithdraw.toFixed(2);

    document.getElementById("statementTransfer").innerText =
        "₹" + totalTransfer.toFixed(2);
}

function printStatement() {

    updateStatement();

    window.print();
}async function downloadPDF() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    let y = 20;

    pdf.setFontSize(20);
    pdf.text("🏦 SUB BANK", 20, y);

    y += 15;

    pdf.setFontSize(12);

    pdf.text("Account Holder : Aman Upadhyay", 20, y);
    y += 10;

    pdf.text("Account Number : SUB10001234", 20, y);
    y += 10;

    pdf.text("Date : " + new Date().toLocaleString(), 20, y);
    y += 15;

    pdf.text("Current Balance : ₹" + balance.toFixed(2), 20, y);
    y += 10;

    pdf.text("Total Deposit : ₹" + totalDeposit.toFixed(2), 20, y);
    y += 10;

    pdf.text("Total Withdraw : ₹" + totalWithdraw.toFixed(2), 20, y);
    y += 10;

    pdf.text("Total Transfer : ₹" + totalTransfer.toFixed(2), 20, y);

    y += 20;

    pdf.setFontSize(15);
    pdf.text("Transaction History", 20, y);

    y += 10;

    transactionHistory.forEach(function(item){

        pdf.setFontSize(10);

        pdf.text(
            item.date + " | " + item.text,
            20,
            y
        );

        y += 8;

        if(y > 270){

            pdf.addPage();

            y = 20;
        }

    });

    y += 20;

    pdf.text(
        "Manager Signature __________",
        20,
        y
    );

    pdf.save("SUB_Bank_Statement.pdf");
}function loadWelcome() {

    const username =
        localStorage.getItem("loggedInUser") || "User";

    const hour =
        new Date().getHours();

    let greeting = "";

    if (hour < 12) {

        greeting = "🌅 Good Morning";

    } else if (hour < 17) {

        greeting = "☀️ Good Afternoon";

    } else {

        greeting = "🌙 Good Evening";

    }

    document.getElementById("welcomeText").innerText =
        "Welcome, " + username + " 👋";

    document.getElementById("greetingText").innerText =
        greeting + " | Welcome to SUB Bank";
}
loadWelcome();
function updateTodayDate() {

    const today = new Date();

    document.getElementById("todayDate").innerText =
        today.toDateString();
}

updateTodayDate();
function loadProfile() {

    const username =
        localStorage.getItem("loggedInUser") || "User";

    document.getElementById("profileName").innerText = username;
}

loadProfile();
function downloadPassbook() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SUB Bank Passbook", 20, 20);

    doc.setFontSize(12);

    doc.text("Current Balance: ₹" + balance, 20, 40);
    doc.text("Total Deposit: ₹" + totalDeposit, 20, 50);
    doc.text("Total Withdraw: ₹" + totalWithdraw, 20, 60);
    doc.text("Total Transfer: ₹" + totalTransfer, 20, 70);

    let y = 90;

    doc.text("Transaction History:", 20, y);

    y += 10;

    transactionHistory.forEach(function(item){

        doc.text(
            item.date + " - " + item.text,
            20,
            y
        );

        y += 10;

        if (y > 280) {
            doc.addPage();
            y = 20;
        }

    });

    doc.save("SUB_Bank_Passbook.pdf");
}
function filterStatement() {

    let selectedDate =
        document.getElementById("statementDate").value;

    let items =
        document.querySelectorAll("#history li");

    if (selectedDate === "") {

        items.forEach(function(item) {
            item.style.display = "";
        });

        return;
    }

    items.forEach(function(item) {

        if (item.innerText.includes(selectedDate)) {

            item.style.display = "";

        } else {

            item.style.display = "none";
        }

    });

}
function displayMiniStatement() {

    const miniHistory =
        document.getElementById("miniHistory");

    if (!miniHistory) return;

    miniHistory.innerHTML = "";

    const lastFive =
        transactionHistory.slice(0, 5);

    lastFive.forEach(function(transaction) {

        let li = document.createElement("li");

        li.innerHTML =
            "<strong>" + transaction.text + "</strong><br>" +
            "<small>" + transaction.date + "</small>";

        miniHistory.appendChild(li);

    });

}
function requestMoney() {

    let account =
        document.getElementById("requestAccount").value.trim();

    let amount =
        Number(document.getElementById("requestAmount").value);

    if (account === "" || amount <= 0) {

        alert("Please enter valid details!");
        return;
    }

    addHistory(
        "📩 Money Request ₹" + amount + " from A/C " + account,
        "request"
    );

    addNotification(
        "Money request of ₹" + amount + " sent.",
        "📩"
    );

    document.getElementById("requestAccount").value = "";
    document.getElementById("requestAmount").value = "";

    alert("Money Request Sent Successfully!");
}
function createFD() {

    let amount =
        Number(document.getElementById("fdAmount").value);

    if (amount <= 0) {
        alert("Enter a valid amount!");
        return;
    }

    if (amount > balance) {
        alert("Insufficient Balance!");
        return;
    }

    balance -= amount;
    fdBalance += amount;

    localStorage.setItem("balance", balance);
    localStorage.setItem("fdBalance", fdBalance);
let fdInterest = 0;
let fdMaturity = 0;
    updateDisplay();
    fdInterest = fdBalance * 0.07;
fdMaturity = fdBalance + fdInterest;

const interest =
    document.getElementById("fdInterest");

const maturity =
    document.getElementById("fdMaturity");

if (interest) {
    interest.innerText =
        "₹" + fdInterest.toFixed(2);
}

if (maturity) {
    maturity.innerText =
        "₹" + fdMaturity.toFixed(2);
}

    addHistory(
        "🏦 Fixed Deposit Created ₹" + amount,
        "fd"
    );

    addNotification(
        "FD of ₹" + amount + " created successfully.",
        "🏦"
    );

    document.getElementById("fdAmount").value = "";

    alert("Fixed Deposit Created Successfully!");
}function applyLoan() {

    let amount =
        Number(document.getElementById("loanAmount").value);

    if (amount <= 0) {
        alert("Enter a valid loan amount!");
        return;
    }

    balance += amount;
    loanBalance += amount;

    localStorage.setItem("balance", balance);
    localStorage.setItem("loanBalance", loanBalance);

    updateDisplay();

    addHistory(
        "💳 Loan Approved ₹" + amount,
        "loan"
    );

    addNotification(
        "Loan of ₹" + amount + " approved.",
        "💳"
    );

    document.getElementById("loanAmount").value = "";

    alert("Loan Approved Successfully!");
}
function openAdmin() {

    let password = prompt("Enter Admin Password");

    if (password === null) {
        return;
    }

    if (password !== "admin123") {
        alert("Wrong Admin Password!");
        return;
    }

    document.getElementById("adminPanel").style.display = "block";

    document.getElementById("adminBalance").innerText =
        "₹" + balance.toFixed(2);

    document.getElementById("adminDeposit").innerText =
        "₹" + totalDeposit.toFixed(2);

    document.getElementById("adminWithdraw").innerText =
        "₹" + totalWithdraw.toFixed(2);

    document.getElementById("adminTransfer").innerText =
        "₹" + totalTransfer.toFixed(2);

}
function closeAdmin() {

    document.getElementById("adminPanel").style.display = "none";

}
