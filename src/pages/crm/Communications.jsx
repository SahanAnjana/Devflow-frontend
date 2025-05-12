import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../../components/layout/CRMLayout';
import CRMListingLayout from '../../components/crm/CRMListingLayout';
import {
  getCommunications,
  createCommunication,
  updateCommunication,
  deleteCommunication
} from '../../api/crm-management/communications';
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

const CommunicationDialog = ({ open, handleClose, communication, handleSubmit }) => {
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    direction: '',
    contact_name: '',
    deal_name: '',
    created_at: '',
    ...communication
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
      <DialogTitle>{communication ? 'Edit Communication' : 'Add New Communication'}</DialogTitle>
      <form onSubmit={handleSubmitForm}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              label="Communication Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              multiline
              rows={3}
              value={formData.subject}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Direction"
              name="direction"
              value={formData.direction}
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
            {communication ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const CRMCommunications = () => {
  const navigate = useNavigate();
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    direction: '',
    
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const columns = [
    { id: 'type', label: 'Type' },
    { id: 'subject', label: 'Subject' },
    { id: 'direction', label: 'Direction' },
    { id: 'contact_name', label: 'Contact Name' },
    { id: 'company_name', label: 'Company Name' },
    { id: 'deal_name', label: 'Deal Name' },
    { id: 'created_at', label: 'Created At' },
    { id: 'updated_at', label: 'Updated At' },
    { id: 'created_by', label: 'Created By' },
  ];

  const fetchCommunications = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
        search: searchTerm
      };
      const response = await getCommunications(params);
      setCommunications(response.data);
      setTotalItems(response.pagination.totalItems);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch communications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, [page, rowsPerPage, searchTerm]);

  const handleCreate = async (formData) => {
    try {
      await createCommunication(formData);
      fetchCommunications();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create communication');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateCommunication(selectedCommunication.id, formData);
      fetchCommunications();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update communication');
    }
  };

  const handleDelete = async (communicationId) => {
    try {
      await deleteCommunication(communicationId);
      fetchCommunications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete communication');
    }
  };

  const handleSearch = async (query) => {
    setSearchTerm(query);
    setPage(1);
    fetchCommunications();
  };

  const setSearchQuery = (query) => {
    setSearchTerm(query);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCommunication(selectedCommunication.id);
      fetchCommunications();
      setConfirmDelete(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete communication');
    }
  };

  const filterColumns = [
    { 
      name: 'type', 
      label: 'Type',
      options: [...new Set(communications.map(communication => communication.type))].map(type => ({
        value: type,
        label: type
      })),
      allLabel: 'All Types', 
      gridSize: 3
    },
    { 
      name: 'direction', 
      label: 'Direction',
      options: [...new Set(communications.map(communication => communication.direction))].map(direction => ({
        value: direction,
        label: direction
      })),
      allLabel: 'All Direction',
      gridSize: 3
    }
  ];

  const filteredCommunications = communications.filter(communication => {
    const matchesSearch = searchTerm === '' || 
      communication.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === '' || communication.type === filters.type;
    const matchesDirection = filters.direction === '' || communication.direction === filters.direction;
    return matchesSearch && matchesType && matchesDirection;
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: '', direction: '' });
    setSearchTerm('');
  };  

  return (
    <CRMLayout>
      <CRMListingLayout
        title="Communications"
        items={filteredCommunications}
        loading={loading}
        error={error}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedItem={selectedCommunication}
        setSelectedItem={setSelectedCommunication}
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
        dialogContent={<CommunicationDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          communication={selectedCommunication}
          handleSubmit={selectedCommunication ? handleUpdate : handleCreate}
        />}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </CRMLayout>
  );
};

export default CRMCommunications;


