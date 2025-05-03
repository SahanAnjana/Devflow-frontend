// src/pages/finance/InvoicesList.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Typography,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getInvoices } from '../../../api/finance';
import FinanceLayout from '../../../components/layout/FinanceLayout';
import DataTable from '../../../components/common/DataTable';
import FilterToolbar from '../../../components/common/FilterToolbar';
import ActionMenu from '../../../components/common/ActionMenu';

const InvoicesList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    client: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getInvoices();
        setInvoices(data);
      } catch (err) {
        setError('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { field: 'invoice_number', header: 'Invoice #' },
    { field: 'client_name', header: 'Client' },
    { field: 'total_amount', header: 'Amount', render: (item) => `$${item.total_amount}` },
    { field: 'due_date', header: 'Due Date', render: (item) => new Date(item.due_date).toLocaleDateString() },
    { 
      field: 'status', 
      header: 'Status',
      render: (item) => (
        <Chip 
          label={item.status} 
          color={
            item.status === 'paid' ? 'success' : 
            item.status === 'overdue' ? 'error' : 'warning'
          }
          size="small"
        />
      )
    }
  ];

  const filterFields = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' }
      ],
      allLabel: 'All Statuses'
    },
    {
      name: 'client',
      label: 'Client',
      options: Array.from(new Set(invoices.map(i => i.client_name))).map(client => ({
        value: client,
        label: client
      })),
      allLabel: 'All Clients'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = !filters.status || invoice.status === filters.status;
    const matchesClient = !filters.client || invoice.client_name === filters.client;
    return matchesStatus && matchesClient;
  });

  return (
    <FinanceLayout>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Invoices
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage client invoices
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            component={Link}
            to="/finance/invoices/create"
            startIcon={<AddIcon />}
          >
            New Invoice
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <FilterToolbar
          filters={filters}
          onFilterChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
          filterFields={filterFields}
        />

        <DataTable
          columns={columns}
          data={filteredInvoices}
          renderActions={(item) => (
            <ActionMenu
              itemId={item.id}
              actions={[
                { 
                  label: 'View Details', 
                  handler: (id) => navigate(`/finance/invoices/${id}`)
                },
                { 
                  label: 'Edit', 
                  handler: (id) => navigate(`/finance/invoices/${id}/edit`)
                },
                { 
                  label: 'Send', 
                  handler: (id) => console.log('Send invoice', id),
                  disabled: item.status !== 'draft'
                }
              ]}
            />
          )}
          emptyMessage="No invoices found"
        />
      </Box>
    </FinanceLayout>
  );
};

export default InvoicesList;
