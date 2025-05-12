// src/components/layout/FinanceLayout.jsx
import BaseLayout from './BaseLayout';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AssessmentIcon from '@mui/icons-material/Assessment';

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/finance' },
  { text: 'Accounts', icon: <AccountBalanceIcon />, path: '/finance/accounts' },
  { text: 'Budgets', icon: <AttachMoneyIcon />, path: '/finance/budgets' },
  { text: 'Expenses', icon: <ReceiptIcon />, path: '/finance/expenses' },
  { text: 'Invoices', icon: <ShowChartIcon />, path: '/finance/invoices' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/finance/reports' },
];

const FinanceLayout = ({ children }) => {
  const roleCheck = (role) => role === 'admin' || role === 'finance_manager';

  return (
    <BaseLayout menuItems={menuItems} roleCheck={roleCheck}>
      {children}
    </BaseLayout>
  );
}

export default FinanceLayout;