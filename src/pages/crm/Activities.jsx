import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../../components/layout/CRMLayout';
import CRMListingLayout from '../../components/crm/CRMListingLayout';
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity
} from '../../api/crm-management/activities';
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

const ActivityDialog = ({ open, handleClose, activity, handleSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    activityType: '',
    description: '',
    email: '',
    phone: '',
    status: 'active',
    ...activity
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
      <DialogTitle>{activity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
      <form onSubmit={handleSubmitForm}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              label="Activity Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel>Activity Type</InputLabel>
              <Select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                label="Activity Type"
              >
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="call">Call</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="task">Task</MenuItem>
              </Select>
            </FormControl>
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
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {activity ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const CRMActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: ''
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const columns = [
    { id: 'type', label: 'Type' },
    { id: 'subject', label: 'Subject' },
    { id: 'due_date', label: 'Due Date' },
    { id: 'created_at', label: 'Created At' },
    { id: 'updated_at', label: 'Updated At' },
    { id: 'created_by', label: 'Created By' },
    { id: 'status', label: 'Status', render: (activity) => (
      <Chip
        label={activity.status}
        color={activity.status === 'completed' ? 'success' : 
               activity.status === 'pending' ? 'primary' : 'error'}
      />
    )}
  ];

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
        search: searchTerm
      };
      const response = await getActivities(params);
      setActivities(response.data);
      setTotalItems(response.pagination.totalItems);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, rowsPerPage, searchTerm]);

  const handleCreate = async (formData) => {
    try {
      await createActivity(formData);
      fetchActivities();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create activity');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateActivity(selectedActivity.id, formData);
      fetchActivities();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update activity');
    }
  };

  const handleDelete = async (activityId) => {
    try {
      await deleteActivity(activityId);
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete activity');
    }
  };

  const handleSearch = async (query) => {
    setSearchTerm(query);
    setPage(1);
    fetchActivities();
  };

  const setSearchQuery = (query) => {
    setSearchTerm(query);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteActivity(selectedActivity.id);
      fetchActivities();
      setConfirmDelete(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete activity');
    }
  };

  const filterColumns = [
    { 
      name: 'type', 
      label: 'Type',
      options: [...new Set(activities.map(activity => activity.type))].map(type => ({
        value: type,
        label: type
      })),
      allLabel: 'All Types', 
      gridSize: 3
    },
    { 
      name: 'status', 
      label: 'Status',
      options: [...new Set(activities.map(activity => activity.status))].map(status => ({
        value: status,
        label: status
      })),
      allLabel: 'All Status',
      gridSize: 3
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchTerm === '' || 
      activity.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === '' || activity.type === filters.type;
    const matchesStatus = filters.status === '' || activity.status === filters.status;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: '', status: '' });
    setSearchTerm('');
  };
  
  return (
    <CRMLayout>
      <CRMListingLayout
        title="Activities"
        items={filteredActivities}
        loading={loading}
        error={error}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedItem={selectedActivity}
        setSelectedItem={setSelectedActivity}
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
        dialogContent={<ActivityDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          activity={selectedActivity}
          handleSubmit={selectedActivity ? handleUpdate : handleCreate}
        />}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </CRMLayout>
  );
};

export default CRMActivities;
