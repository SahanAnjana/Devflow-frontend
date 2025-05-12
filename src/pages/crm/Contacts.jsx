import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLayout from '../../components/layout/CRMLayout';
import CRMListingLayout from '../../components/crm/CRMListingLayout';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact
} from '../../api/crm-management/contacts';
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

const ContactDialog = ({ open, handleClose, contact, handleSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    tags: [],
    ...contact
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
      <DialogTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
      <form onSubmit={handleSubmitForm}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Tags</InputLabel>
              <Select
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                label="Tags"
                multiple
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="tag1">Tag 1</MenuItem>
                <MenuItem value="tag2">Tag 2</MenuItem>
                <MenuItem value="tag3">Tag 3</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {contact ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const CRMContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ company: '', tags: '' });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const columns = [
    { id: 'name', label: 'Name', render: (contact) => (
      <span>{contact.first_name} {contact.last_name}</span>
    ) },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'company', label: 'Company' },
    { id: 'tags', label: 'Tags', render: (contact) => (
        contact.tags.map((tag) => (
            <Chip key={tag} label={tag} />
        ))
    ) },
    {id: 'created_at', label: 'Created'},
    {id: 'updated_at', label: 'Updated'},
    {id: 'last_interaction', label: 'Last Interaction'},
  ];

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
        search: searchTerm
      };
      const response = await getContacts(params);
      setContacts(response.data);
      setTotalItems(response.pagination.totalItems);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, rowsPerPage, searchTerm]);

  const handleCreate = async (formData) => {
    try {
      await createContact(formData);
      fetchContacts();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create contact');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateContact(selectedContact.id, formData);
      fetchContacts();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contact');
    }
  };

  const handleDelete = async (contactId) => {
    try {
      await deleteContact(contactId);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact');
    }
  };

  const handleSearch = async (query) => {
    setSearchTerm(query);
    setPage(1);
    fetchContacts();
  };

  const setSearchQuery = (query) => {
    setSearchTerm(query);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteContact(selectedContact.id);
      fetchContacts();
      setConfirmDelete(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact');
    }
  };

  const filterColumns = [
    { 
      name: 'company', 
      label: 'Company',
      options: [...new Set(contacts.map(contact => contact.company))].map(company => ({
        value: company,
        label: company
      })),
      allLabel: 'All Types', 
      gridSize: 3
    },
    { 
      name: 'tags', 
      label: 'Tags',
      options: [...new Set(contacts.flatMap(contact => contact.tags))].map(tag => ({
        value: tag,
        label: tag
      })),
      allLabel: 'All Status',
      gridSize: 3
    }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchTerm === '' || 
      (contact.first_name+" "+contact.last_name).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.company === '' || contact.company === filters.company;
    const matchesStatus = filters.tags === '' || contact.tags.includes(filters.tags);
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ company: '', tags: '' });
    setSearchTerm('');
  };

  return (
    <CRMLayout>
      <CRMListingLayout
        title="Contacts"
        items={filteredContacts}
        loading={loading}
        error={error}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedItem={selectedContact}
        setSelectedItem={setSelectedContact}
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
        dialogContent={<ContactDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          contact={selectedContact}
          handleSubmit={selectedContact ? handleUpdate : handleCreate}
        />}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </CRMLayout>
  );
};

export default CRMContacts;


