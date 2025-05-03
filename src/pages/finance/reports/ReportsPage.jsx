// src/pages/finance/ReportsPage.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { getFinancialSummary, getProfitLossReport } from '../../../api/finance-management/reports';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date()
  });
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        let data;
        if(reportType === 'summary') {
          data = await getFinancialSummary(dateRange.start, dateRange.end);
        } else {
          data = await getProfitLossReport(dateRange.start, dateRange.end);
        }
        setReportData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, dateRange]);

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Financial Reports
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="summary">Financial Summary</MenuItem>
                <MenuItem value="profit-loss">Profit & Loss</MenuItem>
                <MenuItem value="cash-flow">Cash Flow</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label="Start Date"
              value={dateRange.start}
              onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))
              }
            />
            <DatePicker
              label="End Date"
              value={dateRange.end}
              onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))
              }
            />
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {reportType === 'summary' ? 'Financial Summary' : 'Profit & Loss Statement'}
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {reportType === 'summary' ? (
                        <BarChart data={reportData?.monthly_breakdown}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="revenue" fill="#8884d8" />
                          <Bar dataKey="expenses" fill="#82ca9d" />
                        </BarChart>
                      ) : (
                        <LineChart data={reportData?.monthly_breakdown}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="net_profit" stroke="#8884d8" />
                          <Line type="monotone" dataKey="gross_profit" stroke="#82ca9d" />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Key Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Total Revenue</Typography>
                        <Typography variant="h4">${reportData?.total_revenue}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Total Expenses</Typography>
                        <Typography variant="h4">${reportData?.total_expenses}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Net Profit</Typography>
                        <Typography variant="h4">${reportData?.net_profit}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Gross Profit</Typography>
                        <Typography variant="h4">${reportData?.gross_profit}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Export
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <Button variant="contained" color="secondary">
                      Export PDF Report
                    </Button>
                    <Button variant="outlined">
                      Export Excel Data
                    </Button>
                    <Button variant="outlined">
                      Export CSV
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </FinanceLayout>
  );
};

export default ReportsPage;