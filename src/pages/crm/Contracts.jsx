import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../../components/layout/CRMLayout';
import CRMListingLayout from '../../components/crm/CRMListingLayout';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import {
  getContracts,
  createContract,
  updateContract,
  deleteContract
} from '../../api/crm-management/contracts';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack
} from '@mui/material';
import {
  Business as BusinessIcon,
  Mail as MailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const ContractDialog = ({ open, handleClose, contract, handleSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    contract_type: '',
    company_name: '',
    deal_name: '',
    value: '',
    status: 'active',
    ...contract
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{contract ? 'Edit Contract' : 'Add New Contract'}</DialogTitle>
      <form onSubmit={handleSubmitForm}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              label="Contract Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Contract Type"
              name="contract_type"
              value={formData.contract_type}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Company Name"
              name="company_name"
              multiline
              rows={3}
              value={formData.company_name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Deal Name"
              name="deal_name"
              multiline
              rows={3}
              value={formData.deal_name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Value"
              name="value"
              value={formData.value}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {contract ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const CRMContracts = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ contract_type: '', status: '' });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const columns = [
    { id: 'title', label: 'Title' },
    { id: 'contract_type', label: 'Contract Type' },
    { id: 'company_name', label: 'Company Name', render: (contract) => contract.company.name },
    { id: 'deal_name', label: 'Deal Name', render: (contract) => contract.deal.name },
    { id: 'status', label: 'Status', render: (contract) => (
      <Chip
        label={contract.status}
        color={contract.status === 'active' ? 'success' : 'error'}
      />
    )},
    {id: 'value', label: 'Value'}
  ];

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
        search: searchTerm
      };
      const response = await getContracts(params);
      setContracts(response.data);
      setTotalItems(response.pagination.totalItems);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [page, rowsPerPage, searchTerm]);

  const handleCreate = async (formData) => {
    try {
      await createContract(formData);
      fetchContracts();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create contract');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateContract(selectedContract.id, formData);
      fetchContracts();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contract');
    }
  };

  const handleDelete = async (contractId) => {
    try {
      await deleteContract(contractId);
      fetchContracts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contract');
    }
  };

  const handleSearch = async (query) => {
    setSearchTerm(query);
    setPage(1);
    fetchContracts();
  };

  const setSearchQuery = (query) => {
    setSearchTerm(query);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteContract(selectedContract.id);
      fetchContracts();
      setConfirmDelete(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contract');
    }
  };

  const filterColumns = [
    { 
      name: 'contract_type', 
      label: 'Type',
      options: [...new Set(contracts.map(contract => contract.contract_type))].map(type => ({
        value: type,
        label: type
      })),
      allLabel: 'All Types', 
      gridSize: 3
    },
    { 
      name: 'status', 
      label: 'Status',
      options: [...new Set(contracts.map(contract => contract.status))].map(status => ({
        value: status,
        label: status
      })),
      allLabel: 'All Status',
      gridSize: 3
    }
  ];

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = searchTerm === '' || 
      contract.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.contract_type === '' || contract.contract_type === filters.contract_type;
    const matchesStatus = filters.status === '' || contract.status === filters.status;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ contract_type: '', status: '' });
    setSearchTerm('');
  };

  return (
    <CRMLayout>
      <CRMListingLayout
        title="Contracts"
        items={filteredContracts}
        loading={loading}
        error={error}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedItem={selectedContract}
        setSelectedItem={setSelectedContract}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        handleSearch={handleSearch}
        searchQuery={searchTerm}
        setSearchQuery={setSearchQuery}
        filters={filters}
        filterColumns={filterColumns}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
        columns={columns}
        dialogContent={<ContractDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          contract={selectedContract}
          handleSubmit={selectedContract ? handleUpdate : handleCreate}
        />}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </CRMLayout>
  );
};

export default CRMContracts;


