// Expense List
let expenses = [];

// Chart.js
let expenseChart;

// Add Expense
document.getElementById('addExpenseBtn')?.addEventListener('click', () => {
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = new Date().toISOString().split('T')[0];

  if (description && !isNaN(amount)) {
    const expense = { description, amount, category, date };
    expenses.push(expense);
    saveExpenses();
    renderExpenses();
    updateTotals();
    updateChart();
    clearForm();
  } else {
    alert('Please enter valid description and amount.');
  }
});

// Save to localStorage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Load from localStorage
function loadExpenses() {
  const storedExpenses = localStorage.getItem('expenses');
  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
  }
}

// Render Expenses Table
function renderExpenses() {
  const tbody = document.getElementById('expenseList');
  if (!tbody) return;
  tbody.innerHTML = '';

  expenses.forEach((expense, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${expense.description}</td>
      <td>₹${expense.amount.toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td class="actions">
        <button onclick="deleteExpense(${index})">🗑️ Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Delete Expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
  updateTotals();
  updateChart();
}

// Clear Form after Adding
function clearForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').selectedIndex = 0;
}

// Update Today's and Monthly Total
function updateTotals() {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.slice(0, 7);

  let todayTotal = 0;
  let monthTotal = 0;

  expenses.forEach(exp => {
    if (exp.date === today) {
      todayTotal += exp.amount;
    }
    if (exp.date.startsWith(thisMonth)) {
      monthTotal += exp.amount;
    }
  });

  document.getElementById('todayTotal').textContent = todayTotal.toFixed(2);
  document.getElementById('monthTotal').textContent = monthTotal.toFixed(2);
}

// Filter Expenses by Date Range
function filterExpenses() {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;

  if (!start || !end) {
    alert('Please select start and end dates!');
    return;
  }

  const tbody = document.getElementById('expenseList');
  if (!tbody) return;
  tbody.innerHTML = '';

  expenses
    .filter(exp => exp.date >= start && exp.date <= end)
    .forEach((expense, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.description}</td>
        <td>₹${expense.amount.toFixed(2)}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td class="actions">
          <button onclick="deleteExpense(${index})">🗑️ Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
}

// Clear Filter (show all)
function clearFilter() {
  renderExpenses();
}

// Chart.js - Create/Update Pie Chart
function updateChart() {
  const ctx = document.getElementById('chart').getContext('2d');

  const categories = {};
  expenses.forEach(exp => {
    categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'
        ]
      }]
    }
  });
}

// INIT
loadExpenses();
renderExpenses();
updateTotals();
updateChart();
