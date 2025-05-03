// src/components/common/ActionMenu.jsx
import { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

/**
 * Reusable action menu for table rows
 * @param {Object} props Component props
 * @param {Array} props.actions List of action items with icons and handlers
 * @param {string|number} props.itemId ID of the item these actions apply to
 */
const ActionMenu = ({ actions = [], itemId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (actionHandler) => {
    handleCloseMenu();
    if (actionHandler) {
      actionHandler(itemId);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpenMenu}
        aria-label="more options"
      >
        <MoreVertIcon />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {actions.map((action, index) => (
          <MenuItem 
            key={index} 
            onClick={() => handleActionClick(action.handler)}
            disabled={action.disabled}
          >
            {action.icon && (
              <ListItemIcon>
                {action.icon}
              </ListItemIcon>
            )}
            <Typography 
              variant="inherit" 
              color={action.color || 'inherit'}
            >
              {action.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionMenu;