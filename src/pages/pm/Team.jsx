import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { getProjectMembers, addProjectMember, updateMemberRole, removeProjectMember, getProjects } from '../../api/project-management/projects';
import { getEmployees} from '../../api/hr-management/employees';
import PMLayout from '../../components/layout/PMLayout';

const TeamMemberDialog = ({ open, onClose, member, onSave, employees_list, projects_list }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    project_id: '',
    role: 'Developer' // Default role
  });

  useEffect(() => {
    if (member) {
      setFormData({
        id: member.id,
        user_id: member.user_id,
        project_id: member.projectId,
        role: member.role
      });
    } else {
      setFormData({
        user_id: '',
        project_id: '',
        role: 'Developer'
      });
    }
  }, [member]);

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {member ? 'Edit Team Member' : 'Add Team Member'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>User</InputLabel>
            <Select
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              label="User"
            >
              {employees_list.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name} ({employee.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Project</InputLabel>
            <Select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              label="Project"
            >
              {projects_list.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              label="Role"
            >
              <MenuItem value="Project Manager">Project Manager</MenuItem>
              <MenuItem value="Developer">Developer</MenuItem>
              <MenuItem value="Designer">Designer</MenuItem>
              <MenuItem value="QA Engineer">QA Engineer</MenuItem>
              <MenuItem value="Business Analyst">Business Analyst</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchTeamMembers();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
        const allEmployees = await getEmployees();
        setEmployees(allEmployees);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
  }

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
        const projectsData = await getProjects();
        setProjects(projectsData);

        const allProjectMembersPromises = projectsData.map(project => getProjectMembers(project.id));
        const projectMembersResults = await Promise.all(allProjectMembersPromises);
        
        const allProjectMembers = projectMembersResults.flatMap((projectMembers, index) => {
            return projectMembers.map(task => ({
            ...task,
            projectId: projectsData[index].id,
            projectName: projectsData[index].name
            }));
        });
      setTeamMembers(allProjectMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await removeProjectMember(memberId);
        await fetchTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const handleSaveMember = async (formData) => {
    try {
      if (selectedMember) {
        await updateMemberRole(selectedMember.id, formData);
      } else {
        await addProjectMember(formData);
      }
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'Project Manager': 'error',
      'Developer': 'primary',
      'Designer': 'secondary',
      'QA Engineer': 'warning',
      'Business Analyst': 'info'
    };
    return colors[role] || 'default';
  };

  return (
    <PMLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Team Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddMember}
          >
            Add Team Member
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Joined At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar>{member.id.charAt(0)}</Avatar>
                          <Typography>{member.id}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{member.user_id}</TableCell>
                      <TableCell>{member.projectName}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<WorkIcon />}
                          label={member.role}
                          color={getRoleColor(member.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{member.joined_at}</TableCell>
                      <TableCell>{member.updated_at}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditMember(member)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <TeamMemberDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          member={selectedMember}
          onSave={handleSaveMember}
          employees_list={employees}
          projects_list={projects}
        />
      </Box>
    </PMLayout>
  );
};

export default Team;