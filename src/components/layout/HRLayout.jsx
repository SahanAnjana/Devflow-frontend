// src/components/layout/HRLayout.jsx
import BaseLayout from './BaseLayout';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WorkIcon from '@mui/icons-material/Work';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/hr' },
  { text: 'Employees', icon: <PeopleAltIcon />, path: '/hr/employees' },
  { text: 'Departments', icon: <BusinessIcon />, path: '/hr/departments' },
  { text: 'Positions', icon: <WorkIcon />, path: '/hr/positions' },
  { text: 'Leave Requests', icon: <EventNoteIcon />, path: '/hr/leaves' },
  { text: 'Performance', icon: <AssessmentIcon />, path: '/hr/performance' },
];

const HRLayout = ({ children }) => {
  const roleCheck = (role) => role === 'admin' || role === 'hr';

  return (
    <BaseLayout menuItems={menuItems} roleCheck={roleCheck}>
      {children}
    </BaseLayout>
  );
}

export default HRLayout;