// =====================================================
// SUB BANK - SCRIPT.JS
// LOGIN ONLY VERSION
// =====================================================
// BALANCE & SUMMARY
// =====================================================

let currentUser =
    localStorage.getItem("loggedInUser") || "guest";

let bankData =
    JSON.parse(localStorage.getItem("bankData")) || {};


// Create account data if not available
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


let balance =
    Number(bankData[currentUser].balance) || 1000;

let totalDeposit =
    Number(bankData[currentUser].totalDeposit) || 0;

let totalWithdraw =
    Number(bankData[currentUser].totalWithdraw) || 0;

let totalTransfer =
    Number(bankData[currentUser].totalTransfer) || 0;

let fdBalance =
    Number(localStorage.getItem("fdBalance")) || 0;

let loanBalance =
    Number(localStorage.getItem("loanBalance")) || 0;


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

    bankData[currentUser].balance = balance;
    bankData[currentUser].totalDeposit = totalDeposit;
    bankData[currentUser].totalWithdraw = totalWithdraw;
    bankData[currentUser].totalTransfer = totalTransfer;

    localStorage.setItem(
        "bankData",
        JSON.stringify(bankData)
    );

    updateDisplay();

    const bar =
        document.getElementById("balanceBar");

    if (bar) {

        let percent =
            (balance / 10000) * 100;

        if (percent > 100)
            percent = 100;

        if (percent < 0)
            percent = 0;

        bar.style.width =
            percent + "%";
    }

    const fdElement =
        document.getElementById("fdBalance");

    if (fdElement) {
        fdElement.innerText =
            "₹" + fdBalance.toFixed(2);
    }

    const loanElement =
        document.getElementById("loanBalance");

    if (loanElement) {
        loanElement.innerText =
            "₹" + loanBalance.toFixed(2);
    }

    updateStatement();
}


// =====================================================
// DISPLAY BALANCE
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


    const statBalance =
        document.getElementById("statBalance");

    const statDeposit =
        document.getElementById("statDeposit");

    const statWithdraw =
        document.getElementById("statWithdraw");

    const statTransfer =
        document.getElementById("statTransfer");


    if (statBalance)
        statBalance.innerText =
            "₹" + balance.toFixed(2);

    if (statDeposit)
        statDeposit.innerText =
            "₹" + totalDeposit.toFixed(2);

    if (statWithdraw)
        statWithdraw.innerText =
            "₹" + totalWithdraw.toFixed(2);

    if (statTransfer)
        statTransfer.innerText =
            "₹" + totalTransfer.toFixed(2);
}


// =====================================================
// ADD HISTORY
// =====================================================

function addHistory(
    text,
    type = "reset"
) {

    const transaction = {

        text: text,

        type: type,

        date:
            new Date().toLocaleString()
    };


    transactionHistory.unshift(
        transaction
    );


    if (transactionHistory.length > 100) {

        transactionHistory =
            transactionHistory.slice(
                0,
                100
            );
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


    if (!historyList)
        return;


    historyList.innerHTML = "";


    if (
        transactionHistory.length === 0
    ) {

        historyList.innerHTML = `
            <li class="no-history">
                No transactions yet.
            </li>
        `;

        return;
    }


    transactionHistory.forEach(
        function (transaction) {

            const li =
                document.createElement("li");


            li.className =
                "transaction-" +
                (transaction.type || "reset");


            let icon = "🔄";


            if (
                transaction.type ===
                "deposit"
            ) {

                icon = "💰";

            }
            else if (
                transaction.type ===
                "withdraw"
            ) {

                icon = "💸";

            }
            else if (
                transaction.type ===
                "transfer"
            ) {

                icon = "🔄";

            }
            else if (
                transaction.type ===
                "fd"
            ) {

                icon = "🏦";

            }
            else if (
                transaction.type ===
                "loan"
            ) {

                icon = "💳";

            }


            li.innerHTML = `
                <div class="transaction-icon">
                    ${icon}
                </div>

                <div class="transaction-info">

                    <strong>
                        ${transaction.text}
                    </strong>

                    <small>
                        ${transaction.date}
                    </small>

                </div>
            `;


            historyList.appendChild(li);
        }
    );
}


// =====================================================
// DEPOSIT
// =====================================================

function deposit() {

    const input =
        document.getElementById(
            "depositAmount"
        );


    if (!input)
        return;


    const amount =
        Number(input.value);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount!"
        );

        return;
    }


    balance += amount;

    totalDeposit += amount;


    updateBalance();


    addHistory(
        "Deposited ₹" +
        amount.toFixed(2),
        "deposit"
    );


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
        document.getElementById(
            "withdrawAmount"
        );


    if (!input)
        return;


    const amount =
        Number(input.value);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount!"
        );

        return;
    }


    if (amount > balance) {

        alert(
            "Insufficient Balance!"
        );

        return;
    }


    balance -= amount;

    totalWithdraw += amount;


    updateBalance();


    addHistory(
        "Withdraw ₹" +
        amount.toFixed(2),
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
// TRANSFER
// =====================================================

function transferMoney() {

    const accountInput =
        document.getElementById(
            "accountNumber"
        );

    const amountInput =
        document.getElementById(
            "transferAmount"
        );


    if (
        !accountInput ||
        !amountInput
    )
        return;


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

        alert(
            "Insufficient Balance!"
        );

        return;
    }


    balance -= amount;

    totalTransfer += amount;


    updateBalance();


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


    if (!confirmReset)
        return;


    balance = 1000;

    totalDeposit = 0;

    totalWithdraw = 0;

    totalTransfer = 0;


    updateBalance();


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
// LOGIN - LOGIN ONLY
// =====================================================

function login() {

    const usernameInput =
        document.getElementById(
            "username"
        );

    const passwordInput =
        document.getElementById(
            "password"
        );


    if (
        !usernameInput ||
        !passwordInput
    )
        return;


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    // DEFAULT LOGIN
    if (
        username === "aman" &&
        password === "1234"
    ) {

        currentUser =
            "Aman Upadhyay";


        localStorage.setItem(
            "loggedInUser",
            currentUser
        );


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


        balance =
            Number(
                bankData[currentUser].balance
            ) || 1000;


        totalDeposit =
            Number(
                bankData[currentUser]
                    .totalDeposit
            ) || 0;


        totalWithdraw =
            Number(
                bankData[currentUser]
                    .totalWithdraw
            ) || 0;


        totalTransfer =
            Number(
                bankData[currentUser]
                    .totalTransfer
            ) || 0;


        const loginPage =
            document.getElementById(
                "loginPage"
            );

        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (loginPage)
            loginPage.style.display =
                "none";


        if (dashboard)
            dashboard.style.display =
                "block";


        loadWelcome();

        loadProfile();

        updateDisplay();

        displayHistory();

        displayNotifications();


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


    if (dashboard)
        dashboard.style.display =
            "none";


    if (loginPage)
        loginPage.style.display =
            "block";


    const username =
        document.getElementById(
            "username"
        );

    const password =
        document.getElementById(
            "password"
        );


    if (username)
        username.value = "";


    if (password)
        password.value = "";


    localStorage.removeItem(
        "loggedInUser"
    );


    currentUser = "guest";


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


    if (!dateTime)
        return;


    dateTime.innerText =
        new Date().toLocaleString();
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
        document.getElementById(
            inputId
        );


    if (!input)
        return;


    if (
        input.type ===
        "password"
    ) {

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
    )
        return;


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
        ) || "1234";


    if (
        currentPassword !==
        savedPassword
    ) {

        alert(
            "Current password is incorrect!"
        );

        return;
    }


    if (
        newPassword !==
        confirmPassword
    ) {

        alert(
            "New passwords do not match!"
        );

        return;
    }


    if (
        newPassword.length < 4
    ) {

        alert(
            "Password must contain at least 4 characters!"
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
// SIDEBAR
// =====================================================

function toggleSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (!sidebar)
        return;


    sidebar.classList.toggle(
        "open"
    );
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


    sections.forEach(
        function (id) {

            const element =
                document.getElementById(id);


            if (element) {

                element.style.display =
                    id === section
                        ? "block"
                        : "none";

            }

        }
    );


    const buttons =
        document.querySelectorAll(
            ".side-btn"
        );


    buttons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );


    const activeButton =
        document.querySelector(
            `.side-btn[onclick="showSection('${section}')"]`
        );


    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


// =====================================================
// QUICK ACTION
// =====================================================

function focusInput(inputId) {

    const input =
        document.getElementById(
            inputId
        );


    if (!input)
        return;


    input.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    setTimeout(
        function () {

            input.focus();

        },
        500
    );
}


// =====================================================
// NOTIFICATIONS
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


    if (!list || !count)
        return;


    list.innerHTML = "";


    count.innerText =
        notifications.length;


    if (
        notifications.length === 0
    ) {

        list.innerHTML = `
            <p class="no-notification">
                No new notifications
            </p>
        `;

        return;
    }


    notifications.forEach(
        function (notification) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "notification-item";


            item.innerHTML = `
                <span>
                    ${notification.icon || "🔔"}
                </span>

                <div>
                    <strong>
                        ${notification.text}
                    </strong>

                    <small>
                        ${notification.date}
                    </small>
                </div>
            `;


            list.appendChild(item);

        }
    );
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

        date:
            new Date().toLocaleString()

    };


    notifications.unshift(
        notification
    );


    if (
        notifications.length > 50
    ) {

        notifications =
            notifications.slice(
                0,
                50
            );
    }


    localStorage.setItem(
        "notifications",
        JSON.stringify(
            notifications
        )
    );


    displayNotifications();
}


// =====================================================
// TOGGLE NOTIFICATIONS
// =====================================================

function toggleNotifications() {

    const panel =
        document.getElementById(
            "notificationPanel"
        );


    if (!panel)
        return;


    panel.classList.toggle(
        "show"
    );
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
// CLEAR HISTORY
// =====================================================

function clearHistory() {

    if (
        transactionHistory.length === 0
    ) {

        alert(
            "No transaction history to clear."
        );

        return;
    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear transaction history?"
        );


    if (!confirmClear)
        return;


    transactionHistory = [];


    localStorage.removeItem(
        "transactionHistory"
    );


    displayHistory();

    displayMiniStatement();


    alert(
        "Transaction history cleared successfully! 🗑️"
    );
}


// =====================================================
// SEARCH HISTORY
// =====================================================

function searchHistory() {

    const searchInput =
        document.getElementById(
            "searchTransaction"
        );


    if (!searchInput)
        return;


    const searchText =
        searchInput.value.toLowerCase();


    const historyItems =
        document.querySelectorAll(
            "#history li"
        );


    historyItems.forEach(
        function (item) {

            const text =
                item.innerText.toLowerCase();


            item.style.display =
                text.includes(searchText)
                    ? ""
                    : "none";

        }
    );
}


// =====================================================
// DARK MODE
// =====================================================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const darkMode =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        darkMode
    );
}


if (
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );
}


// =====================================================
// WELCOME
// =====================================================

function loadWelcome() {

    const username =
        localStorage.getItem(
            "loggedInUser"
        ) || "User";


    const hour =
        new Date().getHours();


    let greeting;


    if (hour < 12) {

        greeting =
            "🌅 Good Morning";

    }
    else if (hour < 17) {

        greeting =
            "☀️ Good Afternoon";

    }
    else {

        greeting =
            "🌙 Good Evening";

    }


    const welcomeText =
        document.getElementById(
            "welcomeText"
        );

    const greetingText =
        document.getElementById(
            "greetingText"
        );


    if (welcomeText) {

        welcomeText.innerText =
            "Welcome, " +
            username +
            " 👋";

    }


    if (greetingText) {

        greetingText.innerText =
            greeting +
            " | Welcome to SUB Bank";

    }
}


// =====================================================
// PROFILE
// =====================================================

function loadProfile() {

    const username =
        localStorage.getItem(
            "loggedInUser"
        ) || "User";


    const profileName =
        document.getElementById(
            "profileName"
        );


    if (profileName) {

        profileName.innerText =
            username;

    }
}


// =====================================================
// TODAY DATE
// =====================================================

function updateTodayDate() {

    const today =
        new Date();


    const todayDate =
        document.getElementById(
            "todayDate"
        );


    if (todayDate) {

        todayDate.innerText =
            today.toDateString();

    }
}


// =====================================================
// MINI STATEMENT
// =====================================================

function displayMiniStatement() {

    const miniHistory =
        document.getElementById(
            "miniHistory"
        );


    if (!miniHistory)
        return;


    miniHistory.innerHTML = "";


    const lastFive =
        transactionHistory.slice(
            0,
            5
        );


    lastFive.forEach(
        function (transaction) {

            const li =
                document.createElement(
                    "li"
                );


            li.innerHTML =
                "<strong>" +
                transaction.text +
                "</strong><br>" +
                "<small>" +
                transaction.date +
                "</small>";


            miniHistory.appendChild(li);

        }
    );
}


// =====================================================
// STATEMENT
// =====================================================

function updateStatement() {

    const statementBalance =
        document.getElementById(
            "statementBalance"
        );

    const statementDeposit =
        document.getElementById(
            "statementDeposit"
        );

    const statementWithdraw =
        document.getElementById(
            "statementWithdraw"
        );

    const statementTransfer =
        document.getElementById(
            "statementTransfer"
        );


    if (statementBalance)
        statementBalance.innerText =
            "₹" + balance.toFixed(2);

    if (statementDeposit)
        statementDeposit.innerText =
            "₹" + totalDeposit.toFixed(2);

    if (statementWithdraw)
        statementWithdraw.innerText =
            "₹" + totalWithdraw.toFixed(2);

    if (statementTransfer)
        statementTransfer.innerText =
            "₹" + totalTransfer.toFixed(2);
}


// =====================================================
// PRINT STATEMENT
// =====================================================

function printStatement() {

    updateStatement();

    window.print();
}


// =====================================================
// PRINT PASSBOOK
// =====================================================

function printPassbook() {

    window.print();
}


// =====================================================
// REQUEST MONEY
// =====================================================

function requestMoney() {

    const account =
        document.getElementById(
            "requestAccount"
        ).value.trim();


    const amount =
        Number(
            document.getElementById(
                "requestAmount"
            ).value
        );


    if (
        account === "" ||
        amount <= 0
    ) {

        alert(
            "Please enter valid details!"
        );

        return;
    }


    addHistory(
        "📩 Money Request ₹" +
        amount +
        " from A/C " +
        account,
        "request"
    );


    addNotification(
        "Money request of ₹" +
        amount +
        " sent.",
        "📩"
    );


    document.getElementById(
        "requestAccount"
    ).value = "";

    document.getElementById(
        "requestAmount"
    ).value = "";


    alert(
        "Money Request Sent Successfully!"
    );
}


// =====================================================
// FIXED DEPOSIT
// =====================================================

function createFD() {

    const input =
        document.getElementById(
            "fdAmount"
        );


    if (!input)
        return;


    const amount =
        Number(input.value);


    if (amount <= 0) {

        alert(
            "Enter a valid amount!"
        );

        return;
    }


    if (amount > balance) {

        alert(
            "Insufficient Balance!"
        );

        return;
    }


    balance -= amount;

    fdBalance += amount;


    localStorage.setItem(
        "balance",
        balance
    );

    localStorage.setItem(
        "fdBalance",
        fdBalance
    );


    const interest =
        fdBalance * 0.07;

    const maturity =
        fdBalance + interest;


    const interestElement =
        document.getElementById(
            "fdInterest"
        );

    const maturityElement =
        document.getElementById(
            "fdMaturity"
        );

    const fdElement =
        document.getElementById(
            "fdBalance"
        );


    if (interestElement)
        interestElement.innerText =
            "₹" + interest.toFixed(2);

    if (maturityElement)
        maturityElement.innerText =
            "₹" + maturity.toFixed(2);

    if (fdElement)
        fdElement.innerText =
            "₹" + fdBalance.toFixed(2);


    updateBalance();


    addHistory(
        "🏦 Fixed Deposit Created ₹" +
        amount,
        "fd"
    );


    addNotification(
        "FD of ₹" +
        amount +
        " created successfully.",
        "🏦"
    );


    input.value = "";


    alert(
        "Fixed Deposit Created Successfully!"
    );
}


// =====================================================
// LOAN
// =====================================================

function applyLoan() {

    const input =
        document.getElementById(
            "loanAmount"
        );


    if (!input)
        return;


    const amount =
        Number(input.value);


    if (amount <= 0) {

        alert(
            "Enter a valid loan amount!"
        );

        return;
    }


    balance += amount;

    loanBalance += amount;


    localStorage.setItem(
        "balance",
        balance
    );

    localStorage.setItem(
        "loanBalance",
        loanBalance
    );


    updateBalance();


    addHistory(
        "💳 Loan Approved ₹" +
        amount,
        "loan"
    );


    addNotification(
        "Loan of ₹" +
        amount +
        " approved.",
        "💳"
    );


    input.value = "";


    alert(
        "Loan Approved Successfully!"
    );
}


// =====================================================
// ADMIN
// =====================================================

function openAdmin() {

    const panel =
        document.getElementById(
            "adminPanel"
        );


    if (!panel)
        return;


    panel.style.display =
        "block";


    document.getElementById(
        "adminBalance"
    ).innerText =
        "₹" + balance.toFixed(2);


    document.getElementById(
        "adminDeposit"
    ).innerText =
        "₹" + totalDeposit.toFixed(2);


    document.getElementById(
        "adminWithdraw"
    ).innerText =
        "₹" + totalWithdraw.toFixed(2);


    document.getElementById(
        "adminTransfer"
    ).innerText =
        "₹" + totalTransfer.toFixed(2);
}


function closeAdmin() {

    const panel =
        document.getElementById(
            "adminPanel"
        );


    if (panel) {

        panel.style.display =
            "none";

    }
}


// =====================================================
// INITIAL LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // IMPORTANT:
        // Dashboard will NOT auto-open.
        // Login must be completed first.

        const loginPage =
            document.getElementById(
                "loginPage"
            );

        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (loginPage)
            loginPage.style.display =
                "block";


        if (dashboard)
            dashboard.style.display =
                "none";


        updateDisplay();

        displayHistory();

        displayMiniStatement();

        displayNotifications();

        updateTodayDate();

    }
);
function openAccount() {

    let name = document.getElementById("customerName").value.trim();
    let mobile = document.getElementById("customerMobile").value.trim();
    let email = document.getElementById("customerEmail").value.trim();
    let type = document.getElementById("accountType").value;
    let balance = Number(document.getElementById("openingBalance").value);

    if (!name || !mobile || !email || !type || balance < 0) {
        alert("Please fill all details.");
        return;
    }

    let accountNumber = "SUB" + Date.now();
let customerId = "CID" + Math.floor(Math.random() * 1000000);
let openingDate = new Date().toLocaleDateString();

let account = {
    customerId,
    accountNumber,
    name,
    mobile,
    email,
    type,
    balance,
    openingDate
};
    localStorage.setItem("account", JSON.stringify(account));

    alert("Account Opened Successfully!\nAccount No: " + accountNumber);
}
function showOpenAccount() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("openAccountSection").style.display = "block";
}

function backToLogin() {
    document.getElementById("openAccountSection").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
}
function showOpenAccount() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("openAccountSection").style.display = "block";
}

function backToLogin() {
    document.getElementById("openAccountSection").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
}
function showOpenAccount() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("openAccountSection").style.display = "block";
}

function backToLogin() {
    document.getElementById("openAccountSection").style.display = "none";
    document.getElementById("accountDetails").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
}