const STORAGE_KEY = 'budgetExpenses';

const expenseForm = document.getElementById('expenseForm');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const filterCategory = document.getElementById('filterCategory');
const expenseList = document.getElementById('expenseList');
const totalAmount = document.getElementById('totalAmount');
const errorMessage = document.getElementById('errorMessage');
const clearAllBtn = document.getElementById('clearAllBtn');
const emptyState = document.getElementById('emptyState');
const expensesCount = document.getElementById('expensesCount');

let expenses = loadExpenses();

function loadExpenses() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatCurrency(value) {
  return `${value.toFixed(2)} zł`;
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = '';
}

function validateForm(name, amount, category) {
  if (!name.trim()) {
    return 'Podaj nazwę wydatku.';
  }

  if (!amount || Number(amount) <= 0) {
    return 'Kwota musi być większa od 0.';
  }

  if (!category) {
    return 'Wybierz kategorię.';
  }

  return '';
}

function updateSummary() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalAmount.textContent = formatCurrency(total);
  expensesCount.textContent = `Liczba pozycji: ${expenses.length}`;
}

function getFilteredExpenses() {
  const selectedCategory = filterCategory.value;

  if (selectedCategory === 'Wszystkie') {
    return expenses;
  }

  return expenses.filter(expense => expense.category === selectedCategory);
}

function renderExpenses() {
  const filteredExpenses = getFilteredExpenses();
  expenseList.innerHTML = '';

  if (filteredExpenses.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  filteredExpenses.forEach(expense => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${expense.name}</td>
      <td>${expense.category}</td>
      <td>${formatCurrency(expense.amount)}</td>
      <td>
        <button class="delete-btn" data-id="${expense.id}">Usuń</button>
      </td>
    `;

    expenseList.appendChild(row);
  });
}

function addExpense(name, amount, category) {
  const newExpense = {
    id: Date.now().toString(),
    name: name.trim(),
    amount: Number(amount),
    category
  };

  expenses.push(newExpense);
  saveExpenses();
  updateSummary();
  renderExpenses();
}

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  saveExpenses();
  updateSummary();
  renderExpenses();
}

expenseForm.addEventListener('submit', event => {
  event.preventDefault();

  const name = nameInput.value;
  const amount = amountInput.value;
  const category = categorySelect.value;

  const validationError = validateForm(name, amount, category);

  if (validationError) {
    showError(validationError);
    return;
  }

  clearError();
  addExpense(name, amount, category);
  expenseForm.reset();
});

expenseList.addEventListener('click', event => {
  if (event.target.classList.contains('delete-btn')) {
    const id = event.target.dataset.id;
    deleteExpense(id);
  }
});

filterCategory.addEventListener('change', renderExpenses);

clearAllBtn.addEventListener('click', () => {
  expenses = [];
  saveExpenses();
  updateSummary();
  renderExpenses();
  clearError();
});

updateSummary();
renderExpenses();
