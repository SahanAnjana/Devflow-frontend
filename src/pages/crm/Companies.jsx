import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../../components/layout/CRMLayout';
import CRMListingLayout from '../../components/crm/CRMListingLayout';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany
} from '../../api/crm-management/companies';
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

const CompanyDialog = ({ open, handleClose, company, handleSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    ...company
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
      <DialogTitle>{company ? 'Edit Company' : 'Add New Company'}</DialogTitle>
      <form onSubmit={handleSubmitForm}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.address}
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
            {company ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const CRMCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ industry: '' });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'industry', label: 'Industry' },
    { id: 'address', label: 'Address' },
    { id: 'website', label: 'Website' , render: (company) => (
      <a href={company.website} target="_blank" rel="noopener noreferrer">
        Link
      </a>
    )},
    { id: 'contact_count', label: 'Contact Count' },
    { id: 'deal_count', label: 'Deal Count' },
    { id: 'created_at', label: 'Created At' },
    { id: 'updated_at', label: 'Updated At' },
    { id: 'updated_by', label: 'Updated By' }
  ];

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
        search: searchTerm
      };
      const response = await getCompanies(params);
      setCompanies(response.data);
      setTotalItems(response.pagination.totalItems);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, rowsPerPage, searchTerm]);

  const handleCreate = async (formData) => {
    try {
      await createCompany(formData);
      fetchCompanies();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create company');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateCompany(selectedCompany.id, formData);
      fetchCompanies();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update company');
    }
  };

  const handleDelete = async (companyId) => {
    try {
      await deleteCompany(companyId);
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete company');
    }
  };

  const handleSearch = async (query) => {
    setSearchTerm(query);
    setPage(1);
    fetchCompanies();
  };

  const setSearchQuery = (query) => {
    setSearchTerm(query);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCompany(selectedCompany.id);
      fetchCompanies();
      setConfirmDelete(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete company');
    }
  };

  const filterColumns = [
    { 
      name: 'industry', 
      label: 'Industry',
      options: [...new Set(companies.map(company => company.industry))].map(industry => ({
        value: industry,
        label: industry
      })),
      allLabel: 'All Types', 
      gridSize: 3
    }
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchTerm === '' || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = filters.industry === '' || company.industry === filters.industry;
    return matchesSearch && matchesIndustry;
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ industry: '' });
    setSearchTerm('');
  };

  return (
    <CRMLayout>
      <CRMListingLayout
        title="Companies"
        items={filteredCompanies}
        loading={loading}
        error={error}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedItem={selectedCompany}
        setSelectedItem={setSelectedCompany}
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
        dialogContent={<CompanyDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          company={selectedCompany}
          handleSubmit={selectedCompany ? handleUpdate : handleCreate}
        />}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </CRMLayout>
  );
};

export default CRMCompanies;


