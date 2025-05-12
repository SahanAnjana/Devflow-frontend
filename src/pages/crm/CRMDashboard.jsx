import { useState, useEffect, Fragment } from 'react';
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
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  BugReport as BugReportIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  Group as GroupIcon,
  Folder as FolderIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { getActivities } from '../../api/crm-management/activities';
import { getCompanies } from '../../api/crm-management/companies';
import { getContacts } from '../../api/crm-management/contacts';
import { getContracts } from '../../api/crm-management/contracts';
import { getDeals } from '../../api/crm-management/deals';
import CRMLayout from '../../components/layout/CRMLayout';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Avatar sx={{ bgcolor: `${color}.main`, width: 40, height: 40 }}>
          {icon}
        </Avatar>
        <Stack>
          <Typography variant="h6">
            {title}
          </Typography>
          <Typography variant="h4">
            {value}
          </Typography>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const ActivityCard = ({ activity }) => (
  <Card>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ 
          bgcolor: activity.type === 'Meeting' ? 'primary.light' :
                    activity.type === 'Call' ? 'secondary.light' :
                    activity.type === 'Email' ? 'success.light' :
                    'default'
        }}>
          {activity.type === 'Meeting' ? <GroupIcon /> :
           activity.type === 'Call' ? <PhoneIcon /> :
           activity.type === 'Email' ? <MailIcon /> :
           <ScheduleIcon />}
        </Avatar>
        <Stack>
          <Typography variant="h6">{activity.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {activity.description || 'No description'}
          </Typography>
          <Stack direction="row" spacing={1} mt={1}>
            <Chip 
              icon={<CalendarTodayIcon />} 
              label={new Date(activity.date).toLocaleDateString()} 
              size="small"
            />
            <Chip 
              label={activity.type}
              color={
                activity.type === 'Meeting' ? 'primary' :
                activity.type === 'Call' ? 'secondary' :
                activity.type === 'Email' ? 'success' :
                'default'
              }
              size="small"
            />
            <Chip 
              label={activity.status}
              color={
                activity.status === 'Completed' ? 'success' :
                activity.status === 'Scheduled' ? 'primary' :
                activity.status === 'Overdue' ? 'error' :
                'default'
              }
              size="small"
            />
          </Stack>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const CRMDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalContacts: 0,
    totalDeals: 0,
    totalContracts: 0
  });
  const [activities, setActivities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [companiesData, contactsData, dealsData, contractsData, activitiesData] = await Promise.all([
          getCompanies(),
          getContacts(),
          getDeals(),
          getContracts(),
          getActivities()
        ]);
        
        setStats({
          totalCompanies: companiesData?.data?.length,
          totalContacts: contactsData?.data?.length,
          totalDeals: dealsData?.data?.length,
          totalContracts: contractsData?.data?.length
        });
        setActivities(Array.isArray(activitiesData.data) ? activitiesData.data.slice(0, 5) : []);
        setCompanies(Array.isArray(companiesData.data) ? companiesData.data.slice(0, 5) : []);
      } catch (error) {
        console.error('Error fetching CRM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <CRMLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <LinearProgress />
        </Box>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Companies"
              value={stats.totalCompanies}
              icon={<FolderIcon sx={{ fontSize: 20 }} />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Contacts"
              value={stats.totalContacts}
              icon={<GroupIcon sx={{ fontSize: 20 }} />}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Deals"
              value={stats.totalDeals}
              icon={<AssignmentIcon sx={{ fontSize: 20 }} />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Contracts"
              value={stats.totalContracts}
              icon={<CheckCircleIcon sx={{ fontSize: 20 }} />}
              color="warning"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Recent Activities"
                action={
                  <Button
                    size="small"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/crm/activities')}
                  >
                    View All
                  </Button>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  {activities.map((activity, index) => (
                    <Grid item xs={12} key={index}>
                      <ActivityCard activity={activity} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Recent Companies"
                action={
                  <Button
                    size="small"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/crm/companies')}
                  >
                    View All
                  </Button>
                }
              />
              <CardContent>
                <List>
                  {companies.map((company, index) => (
                    <Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <BusinessIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={company.name} 
                          secondary={
                            <Stack direction="row" spacing={1}>
                              <Chip 
                                icon={<BusinessIcon />} 
                                label={company.industry} 
                                color={
                                  company.industry === 'Technology' ? 'primary' :
                                  company.industry === 'Finance' ? 'secondary' :
                                  company.industry === 'Retail' ? 'success' :
                                  'default'
                                }
                              />
                              <Chip 
                                icon={<CalendarTodayIcon />} 
                                label={new Date(company.created_at).toLocaleDateString()} 
                                size="small"
                              />
                            </Stack>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </CRMLayout>
  );
};

export default CRMDashboard; 