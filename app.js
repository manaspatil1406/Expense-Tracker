const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const appContainer = document.getElementById("app-container");
const userDisplay = document.getElementById("user-display");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "") {
        alert("Please add text and amount");
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
            category: category.value,
            date: new Date().toLocaleDateString() // Adding date
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        text.value = "";
        amount.value = "";
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Add transaction to DOM list
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)} (${
        transaction.category
    })</span> <button class="delete-btn" onclick="removeTransaction(${
        transaction.id
    })">x</button>
    `;
    list.appendChild(item);
}

// Update balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize app
function init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Login functionality
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = username.value.trim();
    const pass = password.value.trim();

    // Simple validation for non-empty username and password
    if (user === "" || pass === "") {
        alert("Please enter a valid username and password");
    } else {
        userDisplay.innerText = user;
        appContainer.classList.remove("hidden");
        loginForm.parentElement.classList.add("hidden"); // Hide login on success
        init();
    }
});

form.addEventListener("submit", addTransaction);

