import BaseLayout from './BaseLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import HandshakeIcon from '@mui/icons-material/Handshake';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatIcon from '@mui/icons-material/Chat';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/crm' },
  { text: 'Companies', icon: <BusinessIcon />, path: '/crm/companies' },
  { text: 'Deals', icon: <HandshakeIcon />, path: '/crm/deals' },
  { text: 'Activities', icon: <EventIcon />, path: '/crm/activities' },
  { text: 'Contracts', icon: <DescriptionIcon />, path: '/crm/contracts' },
  { text: 'Contacts', icon: <DescriptionIcon />, path: '/crm/contacts' },
  { text: 'Communications', icon: <ChatIcon />, path: '/crm/communications' },
];

const CRMLayout = ({ children }) => {
  const roleCheck = (role) => role === 'admin' || role === 'crm_manager';

  return (
    <BaseLayout menuItems={menuItems} roleCheck={roleCheck}>
      {children}
    </BaseLayout>
  );
}

export default CRMLayout;