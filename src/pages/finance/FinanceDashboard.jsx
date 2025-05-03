// src/pages/finance/FinanceDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button
} from '@mui/material';
import {getAccounts} from '../../api/finance-management/accounts';
import {getBudgets} from '../../api/finance-management/budgets';
import {getExpenses} from '../../api/finance-management/expenses';
import {getInvoices} from '../../api/finance-management/invoices';
import {getFinancialSummary} from '../../api/finance-management/reports';
import FinanceLayout from '../../components/layout/FinanceLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FinanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalAccounts: 0,
    activeBudgets: 0,
    pendingExpenses: 0,
    overdueInvoices: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accounts, budgets, expenses, invoices, summaryData] = await Promise.all([
          getAccounts(),
          getBudgets(),
          getExpenses({ status: 'pending' }),
          getInvoices({ status: 'overdue' }),
          getFinancialSummary(new Date().getFullYear())
        ]);

        setSummary({
          totalAccounts: accounts.length,
          activeBudgets: budgets.filter(b => b.status === 'active').length,
          pendingExpenses: expenses.length,
          overdueInvoices: invoices.length
        });

        setChartData(summaryData.monthly_breakdown);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <FinanceLayout>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </FinanceLayout>
    );
  }

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Finance Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Financial overview and key metrics
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">Accounts</Typography>
              <Typography variant="h4">{summary.totalAccounts}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">Active Budgets</Typography>
              <Typography variant="h4">{summary.activeBudgets}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">Pending Expenses</Typography>
              <Typography variant="h4">{summary.pendingExpenses}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">Overdue Invoices</Typography>
              <Typography variant="h4">{summary.overdueInvoices}</Typography>
            </Paper>
          </Grid>

          {/* Financial Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Financial Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8884d8" />
                      <Bar dataKey="expenses" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    component={Link}
                    to="/finance/expenses/create"
                  >
                    Create New Expense
                  </Button>
                  <Button 
                    variant="outlined" 
                    component={Link}
                    to="/finance/invoices/create"
                  >
                    Generate Invoice
                  </Button>
                  <Button 
                    variant="outlined" 
                    component={Link}
                    to="/finance/budgets/create"
                  >
                    Create Budget
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </FinanceLayout>
  );
};

export default FinanceDashboard;