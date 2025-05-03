import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Button,
  Chip
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  BugReport as BugReportIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  Group as GroupIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { getProjects } from '../../api/project-management/projects';
import { getTasks } from '../../api/project-management/tasks';
import { getIssues } from '../../api/project-management/qa';
import PMLayout from '../../components/layout/PMLayout';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          backgroundColor: `${color}15`,
          borderRadius: '50%',
          p: 1,
          mr: 2
        }}>
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const ProjectProgress = ({ project }) => (
  <ListItem>
    <ListItemIcon>
      <FolderIcon />
    </ListItemIcon>
    <ListItemText
      primary={project.name}
      secondary={
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={project.progress} 
            sx={{ flexGrow: 1, mr: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            {project.progress}%
          </Typography>
        </Box>
      }
    />
  </ListItem>
);

const PMDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // First fetch all projects
        const projectsData = await getProjects();
        setProjects(projectsData);

        // Then fetch tasks and issues for each project
        const tasksPromises = projectsData.map(project => getTasks(project.id));
        const issuesPromises = projectsData.map(project => getIssues(project.id));

        const tasksResults = await Promise.all(tasksPromises);
        const issuesResults = await Promise.all(issuesPromises);

        // Combine all tasks and issues
        const allTasksData = tasksResults.flat();
        const allIssuesData = issuesResults.flat();

        setAllTasks(allTasksData);
        setAllIssues(allIssuesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length || 0,
      icon: <FolderIcon sx={{ color: '#2196f3' }} />,
      color: '#2196f3'
    },
    {
      title: 'Active Tasks',
      value: allTasks.filter(task => task.status !== 'completed').length || 0,
      icon: <AssignmentIcon sx={{ color: '#4caf50' }} />,
      color: '#4caf50'
    },
    {
      title: 'Open Issues',
      value: allIssues.filter(issue => issue.status === 'OPEN').length || 0,
      icon: <BugReportIcon sx={{ color: '#f44336' }} />,
      color: '#f44336'
    },
    {
      title: 'Team Members',
      value: projects.reduce((total, project) => total + (project.team_members_count || 0), 0),
      icon: <GroupIcon sx={{ color: '#ff9800' }} />,
      color: '#ff9800'
    }
  ];

  const recentTasks = allTasks
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
    .map(task => ({
      ...task,
      icon: <AssignmentIcon />,
      color: task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'
    }));

  if (loading) {
    return (
      <PMLayout>
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      </PMLayout>
    );
  }

  return (
    <PMLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}

          {/* Project Progress */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Project Progress"
                action={
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/pm/projects')}
                  >
                    View All
                  </Button>
                }
              />
              <Divider />
              <List>
                {projects.slice(0, 4).map((project, index) => (
                  <ProjectProgress key={index} project={project} />
                ))}
              </List>
            </Card>
          </Grid>

          {/* Recent Tasks */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Recent Tasks"
                action={
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/pm/tasks')}
                  >
                    View All
                  </Button>
                }
              />
              <Divider />
              <List>
                {recentTasks.map((task, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {task.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={task.status}
                            size="small"
                            color={task.color}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>

          {/* Recent Issues */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Recent Issues"
                action={
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/pm/issues')}
                  >
                    View All
                  </Button>
                }
              />
              <Divider />
              <List>
                {allIssues.slice(0, 5).map((issue, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <BugReportIcon color={issue.severity === 'high' ? 'error' : 'warning'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={issue.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={issue.status}
                            size="small"
                            color={issue.status === 'open' ? 'error' : 'success'}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Reported: {new Date(issue.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PMLayout>
  );
};

export default PMDashboard; 