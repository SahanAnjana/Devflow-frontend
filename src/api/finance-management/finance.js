// src/api/finance.js
import axios from 'axios';

const API_URL = 'http://140.245.213.62:8002';

// Create axios instance with authorization header
const financeApi = axios.create({
  baseURL: API_URL
});

// Request interceptor to add the auth token
financeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Account API calls
export const getAccounts = async () => {
  try {
    const response = await financeApi.get('/accounts/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch accounts');
  }
};

export const getAccountById = async (id) => {
  try {
    const response = await financeApi.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch account');
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await financeApi.post('/accounts', accountData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create account');
  }
};

export const updateAccount = async (id, accountData) => {
  try {
    const response = await financeApi.put(`/accounts/${id}`, accountData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update account');
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await financeApi.delete(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete account');
  }
};

export const activateAccount = async (id) => {
  try {
    const response = await financeApi.put(`/accounts/${id}/activate`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to activate account');
  }
};

export const deactivateAccount = async (id) => {
  try {
    const response = await financeApi.put(`/accounts/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to deactivate account');
  }
};

// Budget API calls
export const getBudgets = async (filters = {}) => {
  try {
    const response = await financeApi.get('/budgets/', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch budgets');
  }
};

export const getBudgetById = async (id) => {
  try {
    const response = await financeApi.get(`/budgets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch budget');
  }
};

export const createBudget = async (budgetData) => {
  try {
    const response = await financeApi.post('/budgets/', budgetData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create budget');
  }
};

export const updateBudget = async (id, budgetData) => {
  try {
    const response = await financeApi.put(`/budgets/${id}`, budgetData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update budget');
  }
};

export const deleteBudget = async (id) => {
  try {
    const response = await financeApi.delete(`/budgets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete budget');
  }
};

export const getBudgetsByProject = async (projectId) => {
  try {
    const response = await financeApi.get(`/budgets/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch budgets for project');
  }
};

export const getBudgetsByDepartment = async (departmentId) => {
  try {
    const response = await financeApi.get(`/budgets/department/${departmentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch budgets for department');
  }
};

// Expense API calls
export const getExpenses = async (filters = {}) => {
  try {
    const response = await financeApi.get('/expenses/', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch expenses');
  }
};

export const getExpenseById = async (id) => {
  try {
    const response = await financeApi.get(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch expense');
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await financeApi.post('/expenses/', expenseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create expense');
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await financeApi.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update expense');
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await financeApi.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete expense');
  }
};

export const approveExpense = async (id, approverId) => {
  try {
    const response = await financeApi.post(`/expenses/${id}/approve`, null, {
      params: { approver_id: approverId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to approve expense');
  }
};

export const rejectExpense = async (id, approverId) => {
  try {
    const response = await financeApi.post(`/expenses/${id}/reject`, null, {
      params: { approver_id: approverId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to reject expense');
  }
};

export const getEmployeeExpenses = async (employeeId) => {
  try {
    const response = await financeApi.get(`/expenses/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch employee expenses');
  }
};

// Invoice API calls
export const getInvoices = async (filters = {}) => {
  try {
    const response = await financeApi.get('/invoices/', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch invoices');
  }
};

export const getInvoiceById = async (id) => {
  try {
    const response = await financeApi.get(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch invoice');
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    const response = await financeApi.post('/invoices/', invoiceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create invoice');
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await financeApi.put(`/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update invoice');
  }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await financeApi.delete(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete invoice');
  }
};

export const sendInvoice = async (id) => {
  try {
    const response = await financeApi.post(`/invoices/${id}/send`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to send invoice');
  }
};

export const markInvoiceAsPaid = async (id) => {
  try {
    const response = await financeApi.post(`/invoices/${id}/mark-paid`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to mark invoice as paid');
  }
};

export const getClientInvoices = async (clientId) => {
  try {
    const response = await financeApi.get(`/invoices/client/${clientId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch client invoices');
  }
};

// Transaction API calls
export const getTransactions = async (filters = {}) => {
  try {
    const response = await financeApi.get('/transactions/', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch transactions');
  }
};

export const getTransactionById = async (id) => {
  try {
    const response = await financeApi.get(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch transaction');
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await financeApi.post('/transactions', transactionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create transaction');
  }
};

export const getAccountTransactions = async (accountId) => {
  try {
    const response = await financeApi.get(`/transactions/account/${accountId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch account transactions');
  }
};

// Reports API calls
export const getFinancialSummary = async (fromDate, toDate) => {
  try {
    const response = await financeApi.get('/reports/summary', {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch financial summary');
  }
};

export const getProfitLossReport = async (fromDate, toDate) => {
  try {
    const response = await financeApi.get('/reports/profit-loss', {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch profit and loss report');
  }
};

export const getRevenueReport = async (fromDate, toDate) => {
  try {
    const response = await financeApi.get('/reports/revenue', {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch revenue report');
  }
};

export const getProjectFinanceReport = async (projectId, fromDate, toDate) => {
  try {
    const response = await financeApi.get(`/reports/project/${projectId}`, {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch project finance report');
  }
};

export const getExpensesReport = async (fromDate, toDate) => {
  try {
    const response = await financeApi.get('/reports/expenses', {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch expenses report');
  }
};