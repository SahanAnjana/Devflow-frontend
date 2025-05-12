import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import CRMLayout from '../../components/layout/CRMLayout';
import { getDeals, deleteDeal, updateDeal, createDeal } from '../../api/crm-management/deals';
import CRMListingLayout from '../../components/crm/CRMListingLayout';

const DealDialog = ({open, handleClose, deal, handleSubmit}) => {
  const [formData, setFormData] = useState({
      name: '',
      stage: '',
      value: '',
      dealType: '',
      priority: '',
      closeDate: '',
      ...deal
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
          <DialogTitle>{deal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
          <form onSubmit={handleSubmitForm}>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="Deal Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Deal Type"
                  name="dealType"
                  value={formData.dealType}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Close Date"
                  name="closeDate"
                  value={formData.closeDate}
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
                {deal ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      );
}



const CRMDeals = () => {
  const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ 
      stage: '', 
      dealType: '',
      priority: ''
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [totalItems, setTotalItems] = useState(0);

  const columns = [
    { id: 'name', label: 'Deal Name', minWidth: 170 },
    { id: 'stage', label: 'Stage', minWidth: 100 },
    { id: 'value', label: 'Value', minWidth: 100 },
    { id: 'dealType', label: 'Deal Type', minWidth: 100, render: (deal) => deal.custom_fields.deal_type },
    { id: 'priority', label: 'Priority', minWidth: 100, render: (deal) => deal.custom_fields.priority },
    { id: 'expected_close_date', label: 'Close Date', minWidth: 100 },
    { id: 'created_at', label: 'Created At', minWidth: 100 },
    { id: 'updated_at', label: 'Updated At', minWidth: 100 },
    { id: 'owner_name', label: 'Owner', minWidth: 100 },
    { id: 'company_name', label: 'Company', minWidth: 100 },
    { id: 'contact_name', label: 'Contact', minWidth: 100 },
  ];

  const fetchDeals = async () => {
      try {
        setLoading(true);
        const params = {
          skip: (page - 1) * rowsPerPage,
          limit: rowsPerPage,
          search: searchTerm
        };
        const response = await getDeals(params);
        setDeals(response.data);
        setTotalItems(response.pagination.totalItems);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch deals');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchDeals();
    }, [page, rowsPerPage, searchTerm]);
  
    const handleCreate = async (formData) => {
      try {
        await createDeal(formData);
        fetchDeals();
        setOpenDialog(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create deal');
      }
    };
  
    const handleUpdate = async (formData) => {
      try {
        await updateDeal(selectedDeal.id, formData);
        fetchDeals();
        setOpenDialog(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update deal');
      }
    };
  
    const handleDelete = async (dealId) => {
      try {
        await deleteDeal(dealId);
        fetchDeals();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete deal');
      }
    };
  
    const handleSearch = async (query) => {
      setSearchTerm(query);
      setPage(1);
      fetchDeals();
    };
  
    const setSearchQuery = (query) => {
      setSearchTerm(query);
    };
  
    const handleConfirmDelete = async () => {
      try {
        await deleteDeal(selectedDeal.id);
        fetchDeals();
        setConfirmDelete(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete deal');
      }
    };

    const filterColumns = [
      { 
        name: 'stage', 
        label: 'Stage',
        options: [...new Set(deals.map(deal => deal.stage))].map(stage => ({
          value: stage,
          label: stage
        })),
        allLabel: 'All Stages', 
        gridSize: 3
      },
      { 
        name: 'dealType', 
        label: 'Deal Type',
        options: [...new Set(deals.map(deal => deal.custom_fields.deal_type))].map(dealType => ({
          value: dealType,
          label: dealType
        })),
        allLabel: 'All Deal Types',
        gridSize: 3
      },
      { 
        name: 'priority', 
        label: 'Priority',
        options: [...new Set(deals.map(deal => deal.custom_fields.priority))].map(priority => ({
          value: priority,
          label: priority
        })),
        allLabel: 'All Priorities',
        gridSize: 3
      }
    ];
  
    const filteredDeals = deals.filter(deal => {
      const matchesSearch = searchTerm === '' || 
        deal.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = filters.stage === '' || deal.stage === filters.stage;
      const matchesDealType = filters.dealType === '' || deal.custom_fields.deal_type === filters.dealType;
      const matchesPriority = filters.priority === '' || deal.custom_fields.priority === filters.priority;
      return matchesSearch && matchesStage && matchesDealType && matchesPriority;
    });
  
    const handleFilterChange = (event) => {
      const { name, value } = event.target;
      setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const clearFilters = () => {
      setFilters({ stage: '', dealType: '', priority: '' });
      setSearchTerm('');
    };
  return (
    <CRMLayout>
      <CRMListingLayout
        title="Deals"
        items={filteredDeals}
        loading={loading}
        error={error}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedItem={selectedDeal}
        setSelectedItem={setSelectedDeal}
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
        dialogContent={<DealDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          deal={selectedDeal}
          handleSubmit={selectedDeal ? handleUpdate : handleCreate}
        />}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </CRMLayout>
  );
};

export default CRMDeals;
