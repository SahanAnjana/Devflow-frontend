import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Tooltip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Today as TodayIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material';
import { getGanttChartData, getCriticalPath } from '../../api/project-management/tasks';
import { getProjects } from '../../api/project-management/projects';
import PMLayout from '../../components/layout/PMLayout';
import { Chart } from "react-google-charts";

const Timeline = () => {
  const [selectedProject, setSelectedProject] = useState('all');
  const [projects, setProjects] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [criticalPath, setCriticalPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(2); // 1: days, 2: weeks, 3: months

  // Fetch available projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch timeline data when selected project changes
  useEffect(() => {
    if (selectedProject) {
      fetchTimelineData();
    }
  }, [selectedProject]);

  // Function to fetch projects
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // If we can't fetch projects, still allow "All Projects" option
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchTimelineData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get Gantt chart data
      const ganttResponse = await getGanttChartData(selectedProject);
      // Extract the tasks array from the response
      const tasks = ganttResponse?.tasks || [];
      setTimelineData(tasks);
      
      // Get critical path data - could be an array or have a tasks property
      const criticalPathResponse = await getCriticalPath(selectedProject);
      // Handle different possible formats for critical path data
      let criticalPathTasks = [];
      if (Array.isArray(criticalPathResponse)) {
        criticalPathTasks = criticalPathResponse;
      } else if (criticalPathResponse?.tasks && Array.isArray(criticalPathResponse.tasks)) {
        criticalPathTasks = criticalPathResponse.tasks;
      }
      setCriticalPath(criticalPathTasks);
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      setError('Failed to load timeline data. Please try again later.');
      // Initialize with empty arrays to prevent mapping errors
      setTimelineData([]);
      setCriticalPath([]);
    } finally {
      setLoading(false);
    }
  };

  const formatGanttData = () => {
    const columns = [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ];

    // Map over the tasks array
    const rows = timelineData.map(task => {
      // Calculate end date from due_date
      const endDate = task.due_date ? new Date(task.due_date) : new Date();
      
      // Calculate start date (use 7 days before due date if not provided)
      const startDate = task.start_date 
        ? new Date(task.start_date) 
        : new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000));
      
      return [
        task.id.toString(),
        task.title, // API returns "title" instead of "name"
        task.assignee_id || 'Unassigned', // Use assignee_id or 'Unassigned'
        startDate,
        endDate,
        null,
        task.progress || 0,
        task.dependencies?.join(',') || null
      ];
    });

    return [columns, ...rows];
  };

  const getChartOptions = () => {
    return {
      height: 400,
      gantt: {
        trackHeight: 30,
        criticalPathEnabled: true,
        criticalPathStyle: {
          stroke: '#e64a19',
          strokeWidth: 2,
        },
        arrow: {
          angle: 100,
          width: 5,
          color: '#455a64',
          radius: 0
        },
      },
    };
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  // Calculate statistics safely
  const calculateTotalDuration = () => {
    if (!timelineData.length) return 0;
    
    return timelineData.reduce((acc, task) => {
      // If we have both start and due dates, calculate days between them
      if (task.start_date && task.due_date) {
        const start = new Date(task.start_date);
        const end = new Date(task.due_date);
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return acc + daysDiff;
      }
      // Default to 7 days if dates not available
      return acc + 7;
    }, 0);
  };

  const calculateCriticalPathDuration = () => {
    if (!criticalPath.length) return 0;
    
    return criticalPath.reduce((acc, task) => {
      // If we have both start and due dates, calculate days between them
      if (task.start_date && task.due_date) {
        const start = new Date(task.start_date);
        const end = new Date(task.due_date);
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return acc + daysDiff;
      }
      // Default to 7 days if dates not available
      return acc + 7;
    }, 0);
  };

  // Safely get task details
  const getTaskTitle = (task) => {
    return task.title || task.name || 'Untitled Task';
  };

  const getTaskDuration = (task) => {
    if (task.duration) return task.duration;
    
    if (task.start_date && task.due_date) {
      const start = new Date(task.start_date);
      const end = new Date(task.due_date);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
    
    return 7; // Default duration
  };

  return (
    <PMLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Project Timeline
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton onClick={handleZoomOut} disabled={zoomLevel === 1}>
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={handleZoomIn} disabled={zoomLevel === 3}>
              <ZoomInIcon />
            </IconButton>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                label="Project"
                disabled={projectsLoading}
                startAdornment={
                  projectsLoading ? (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  ) : null
                }
              >
                <MenuItem value="all">All Projects</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name || project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: 400 }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading timeline data...</Typography>
                </Box>
              ) : timelineData.length > 0 ? (
                <Chart
                  chartType="Gantt"
                  width="100%"
                  height="400px"
                  data={formatGanttData()}
                  options={getChartOptions()}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: 400 }}>
                  <Typography>No timeline data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Critical Path
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : criticalPath.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {criticalPath.map((task, index) => (
                      <Box
                        key={task.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          bgcolor: 'background.default',
                          borderRadius: 1
                        }}
                      >
                        <TimelineIcon color="error" />
                        <Typography>{getTaskTitle(task)}</Typography>
                        <Chip
                          label={`${getTaskDuration(task)} days`}
                          size="small"
                          color="primary"
                        />
                        {index < criticalPath.length - 1 && (
                          <Box sx={{ flex: 1, textAlign: 'right' }}>
                            →
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography>No critical path data available</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Timeline Statistics
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Total Duration
                        </Typography>
                        <Typography variant="h6">
                          {calculateTotalDuration()} days
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Critical Path Duration
                        </Typography>
                        <Typography variant="h6">
                          {calculateCriticalPathDuration()} days
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Total Tasks
                        </Typography>
                        <Typography variant="h6">
                          {timelineData.length}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Critical Tasks
                        </Typography>
                        <Typography variant="h6">
                          {criticalPath.length}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PMLayout>
  );
};

export default Timeline;