import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { getResources, createResource, updateResource, deleteResource } from '../../api/project-management/resources';
import { getProjects } from '../../api/project-management/projects';
import { getResourcesUtilizationMetrics } from '../../api/project-management/pm';
import PMLayout from '../../components/layout/PMLayout';

const ResourceDialog = ({ open, handleClose, resource, projectId, handleSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'person',
    cost_rate: '',
    availability: 100,
    skills: [],
    description: '',
    email: '',
    phone: '',
    ...resource
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ ...formData, project_id: projectId });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {resource ? 'Edit Resource' : 'Add New Resource'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type"
                required
              >
                <MenuItem value="person">Person</MenuItem>
                <MenuItem value="equipment">Equipment</MenuItem>
                <MenuItem value="material">Material</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="cost_rate"
              label="Cost Rate (per hour/unit)"
              type="number"
              value={formData.cost_rate}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="availability"
              label="Availability (%)"
              type="number"
              value={formData.availability}
              onChange={handleChange}
              fullWidth
              InputProps={{
                inputProps: { min: 0, max: 100 }
              }}
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            {formData.type === 'person' && (
              <>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  name="phone"
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {resource ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [error, setError] = useState(null);
  const [utilization, setUtilization] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      Promise.all([
        fetchResources(),
        fetchUtilization()
      ]);
    } else {
      setResources([]);
      setUtilization(null);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResources(selectedProjectId);
      setResources(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUtilization = async () => {
    try {
      const data = await getResourcesUtilizationMetrics(selectedProjectId);
      setUtilization(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching resource utilization:', error);
      setError('Failed to load resource utilization data.');
    }
  };

  const handleCreateResource = async (resourceData) => {
    try {
      await createResource(selectedProjectId, resourceData);
      fetchResources();
      setDialogOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error creating resource:', error);
      setError('Failed to create resource. Please try again.');
    }
  };

  const handleUpdateResource = async (resourceData) => {
    try {
      await updateResource(selectedProjectId, selectedResource.id, resourceData);
      fetchResources();
      setDialogOpen(false);
      setSelectedResource(null);
      setError(null);
    } catch (error) {
      console.error('Error updating resource:', error);
      setError('Failed to update resource. Please try again.');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(selectedProjectId, resourceId);
        fetchResources();
        setError(null);
      } catch (error) {
        console.error('Error deleting resource:', error);
        setError('Failed to delete resource. Please try again.');
      }
    }
  };

  const filteredResources = resources.filter(resource => 
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (typeFilter === 'all' || resource.type === typeFilter)
  );

  return (
    <PMLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Resources
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedResource(null);
              setDialogOpen(true);
            }}
            disabled={!selectedProjectId}
          >
            Add Resource
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Project</InputLabel>
            <Select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              label="Project"
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <FormControl sx={{ width: 200 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="person">Person</MenuItem>
              <MenuItem value="equipment">Equipment</MenuItem>
              <MenuItem value="material">Material</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {utilization && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overall Utilization
                  </Typography>
                  <Typography variant="h4">
                    {utilization.overall_utilization}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Available Resources
                  </Typography>
                  <Typography variant="h4">
                    {utilization.available_resources}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overallocated Resources
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {utilization.overallocated_resources}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resource Cost
                  </Typography>
                  <Typography variant="h4">
                    ${utilization.total_cost}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : !selectedProjectId ? (
          <Alert severity="info">Please select a project to view its resources.</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Cost Rate</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell>Skills</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No resources found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>{resource.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={resource.type}
                          color={
                            resource.type === 'person' ? 'primary' :
                            resource.type === 'equipment' ? 'secondary' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {resource.cost_rate ? `$${resource.cost_rate}/hr` : '-'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2">
                            {resource.availability}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {resource.skills?.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        {resource.type === 'person' ? (
                          <>
                            <Typography variant="body2">{resource.email}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {resource.phone}
                            </Typography>
                          </>
                        ) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => {
                            setSelectedResource(resource);
                            setDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteResource(resource.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <ResourceDialog
          open={dialogOpen}
          handleClose={() => {
            setDialogOpen(false);
            setSelectedResource(null);
          }}
          resource={selectedResource}
          projectId={selectedProjectId}
          handleSubmit={selectedResource ? handleUpdateResource : handleCreateResource}
        />
      </Box>
    </PMLayout>
  );
};

export default Resources; 