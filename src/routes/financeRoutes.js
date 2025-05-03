import FinanceDashboard from '../pages/finance/FinanceDashboard';

import AccountsList from '../pages/finance/accounts/AccountsList';
import CreateAccount from '../pages/finance/accounts/CreateAccount';
import AccountDetails from '../pages/finance/accounts/AccountDetails';

// import BudgetsList from '../pages/finance/budget/BudgetsList';
// import CreateBudget from '../pages/finance/budget/CreateBudget';
// import BudgetDetails from '../pages/finance/budget/BudgetDetails';

import ExpensesList from '../pages/finance/expenses/ExpensesList';
import CreateExpense from '../pages/finance/expenses/CreateExpense';
import ExpenseDetails from '../pages/finance/expenses/ExpenseDetails';

// import InvoicesList from '../pages/finance/invoices/InvoicesList';
// import CreateInvoice from '../pages/finance/invoices/CreateInvoice';
// import InvoiceDetails from '../pages/finance/invoices/InvoiceDetails';

import ReportsPage from '../pages/finance/reports/ReportsPage';

import { ProtectedRoute } from './ProtectedRoute';

const financeRoutes = [
  {
    path: '/finance',
    element: (
      <ProtectedRoute roles={['admin', 'finance']}>
        <FinanceDashboard />
      </ProtectedRoute>
    )
  },
  // Finance Account Routes
  {
    path: '/finance/accounts',
    element: (
      <ProtectedRoute roles={['admin', 'finance']}>
        <AccountsList />
      </ProtectedRoute>
    )
  },
  {
    path: '/finance/accounts/create',
    element: (
      <ProtectedRoute roles={['admin', 'finance']}>
        <CreateAccount />
      </ProtectedRoute>
    )
  },
  {
    path: '/finance/accounts/:id',
    element: (
      <ProtectedRoute roles={['admin', 'finance']}>
        <AccountDetails />
      </ProtectedRoute>
    )
  },
  // // Finance Budget Routes
  // {
  //   path: '/finance/budgets',
  //   element: (
  //     <ProtectedRoute roles={['admin', 'finance']}>
  //       <BudgetsList />
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/finance/budgets/create',
  //   element: (
  //     <ProtectedRoute roles={['admin', 'finance']}>
  //       <CreateBudget />
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/finance/budgets/:id',
  //   element: (
  //     <ProtectedRoute roles={['admin', 'finance']}>
  //       <BudgetDetails />
  //     </ProtectedRoute>
  //   )
  // },
  // Finance Expenses Routes
  {
    path: '/finance/expenses',
    element: (
      <ProtectedRoute roles={['admin', 'finance']}>
        <ExpensesList />
      </ProtectedRoute>
    )
  },
  {
    path: '/finance/expenses/create',
    element: (
      <ProtectedRoute roles={['admin', 'finance']}>
        <CreateExpense />
      </ProtectedRoute>
    )
  },
  {
    path: '/finance/expenses/:id',
    element: (
      <ProtectedRoute roles={['admin', 'finance']}>
        <ExpenseDetails />
      </ProtectedRoute>
    )
  },
  // // Finance Invoice Routes
  // {
  //   path: '/finance/invoices',
  //   element: (
  //     <ProtectedRoute roles={['admin', 'finance']}>
  //       <InvoicesList />
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/finance/invoices/create',
  //   element: (
  //     <ProtectedRoute roles={['admin', 'finance']}>
  //       <CreateInvoice />
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/finance/invoices/:id',
  //   element: (
  //     <ProtectedRoute roles={['admin', 'finance']}>
  //       <InvoiceDetails />
  //     </ProtectedRoute>
  //   )
  // }

  // Finance Report Routes
  {
    path: '/finance/reports',
    element: (
      <ProtectedRoute roles={['admin', 'finance']}>
        <ReportsPage />
      </ProtectedRoute>
    )
  },
];

export default financeRoutes;