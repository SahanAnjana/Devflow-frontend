import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  AvatarGroup,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from '../../api/project-management/tasks';
import { getResources } from '../../api/project-management/resources';
import { getProjects } from '../../api/project-management/projects';
import PMLayout from '../../components/layout/PMLayout';

const TaskDialog = ({ open, handleClose, task, projectId, handleSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'to_do',
    priority: 'medium',
    due_date: '',
    assignee: '',
    start_date: '',
    estimated_hours: '',
    resource_assignments: [],
    ...task
  });

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [projectId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResources(projectId);
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResourceAssignment = (resourceId, allocation) => {
    setFormData(prev => {
      const assignments = [...prev.resource_assignments];
      const existingIndex = assignments.findIndex(a => a.resource_id === resourceId);
      
      if (existingIndex >= 0) {
        if (allocation === 0) {
          assignments.splice(existingIndex, 1);
        } else {
          assignments[existingIndex] = { ...assignments[existingIndex], allocation_percentage: allocation };
        }
      } else if (allocation > 0) {
        assignments.push({
          resource_id: resourceId,
          allocation_percentage: allocation,
          start_date: formData.start_date,
          end_date: formData.due_date
        });
      }
      
      return { ...prev, resource_assignments: assignments };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ ...formData, projectId });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {task ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="title"
              label="Task Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="to_do">To Do</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="in_review">Review</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="start_date"
                  label="Start Date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="due_date"
                  label="Due Date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              name="estimated_hours"
              label="Estimated Hours"
              type="number"
              value={formData.estimated_hours}
              onChange={handleChange}
              fullWidth
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Resource Assignments
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {resources.map((resource) => (
                <Box key={resource.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography sx={{ minWidth: 120 }}>{resource.name}</Typography>
                  <TextField
                    type="number"
                    label="Allocation %"
                    size="small"
                    value={formData.resource_assignments.find(a => a.resource_id === resource.id)?.allocation_percentage || 0}
                    onChange={(e) => handleResourceAssignment(resource.id, Number(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0, max: 100 }
                    }}
                    sx={{ width: 120 }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const TaskCard = ({ task, onEdit, onDelete }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
          {task.title}
        </Typography>
        <Box>
          <IconButton size="small" onClick={() => onEdit(task)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(task.id)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {task.description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Chip
          label={task.priority}
          size="small"
          color={
            task.priority === 'high' ? 'error' :
            task.priority === 'medium' ? 'warning' : 'success'
          }
        />
        <Typography variant="caption" color="text.secondary">
          Due: {new Date(task.due_date).toLocaleDateString()}
        </Typography>
      </Box>
      {task.estimated_hours && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Estimated: {task.estimated_hours} hours
        </Typography>
      )}
      {task.resource_assignments?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Resources:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {task.resource_assignments.map((assignment, index) => (
              <Chip
                key={index}
                label={`${assignment.resource_name || 'Resource'} (${assignment.allocation_percentage}%)`}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </CardContent>
  </Card>
);

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const projectsData = await getProjects();
      
      const allTasksPromises = projectsData.map(project => getTasks(project.id));
      const tasksResults = await Promise.all(allTasksPromises);
      
      const allTasks = tasksResults.flatMap((projectTasks, index) => {
        return projectTasks.map(task => ({
          ...task,
          projectId: projectsData[index].id,
          projectName: projectsData[index].name
        }));
      });
      
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData.projectId, taskData);
      fetchTasks();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(taskData.projectId, selectedTask.id, taskData);
      fetchTasks();
      setDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      await updateTaskStatus(draggableId, { status: destination.droppableId });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = {
    to_do: filteredTasks.filter(task => task.status === 'to_do'),
    in_progress: filteredTasks.filter(task => task.status === 'in_progress'),
    in_review: filteredTasks.filter(task => task.status === 'in_review'),
    done: filteredTasks.filter(task => task.status === 'done')
  };

  return (
    <PMLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedTask(null);
              setDialogOpen(true);
            }}
          >
            New Task
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Search tasks..."
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
        </Box>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2}>
            {Object.entries(columns).map(([status, tasks]) => (
              <Grid item xs={12} md={3} key={status}>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    <Chip
                      label={tasks.length}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Droppable droppableId={status} isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={true}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ minHeight: 200 }}
                      >
                        {tasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={(task) => {
                                    setSelectedTask(task);
                                    setDialogOpen(true);
                                  }}
                                  onDelete={handleDeleteTask}
                                />
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>

        <TaskDialog
          open={dialogOpen}
          handleClose={() => {
            setDialogOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          handleSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        />
      </Box>
    </PMLayout>
  );
};

export default Tasks; 