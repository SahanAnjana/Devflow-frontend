import BaseLayout from './BaseLayout';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import BugReportIcon from '@mui/icons-material/BugReport';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ScienceIcon from '@mui/icons-material/Science';

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/pm' },
  { text: 'Projects', icon: <FolderIcon />, path: '/pm/projects' },
  { text: 'Tasks', icon: <TaskIcon />, path: '/pm/tasks' },
  { text: 'Resources', icon: <GroupIcon />, path: '/pm/resources' },
  { text: 'Issues', icon: <BugReportIcon />, path: '/pm/issues' },
  { text: 'Timeline', icon: <TimelineIcon />, path: '/pm/timeline' },
  { text: 'Team', icon: <GroupIcon />, path: '/pm/team' },
  { text: 'Test Cases', icon: <ScienceIcon />, path: '/pm/test-cases' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/pm/reports' },
];

const PMLayout = ({ children }) => {
  const roleCheck = (role) => role === 'admin' || role === 'project_manager';

  return (
    <BaseLayout menuItems={menuItems} roleCheck={roleCheck}>
      {children}
    </BaseLayout>
  );
}

export default PMLayout;