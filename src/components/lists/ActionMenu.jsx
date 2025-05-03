// components/lists/ActionMenu.jsx
export const ActionMenu = ({ 
    onView, 
    onEdit, 
    onDelete, 
    onApprove, 
    onReject,
    showApproveReject 
  }) => {
    return (
      <Menu>
        {onView && <MenuItem onClick={onView}><VisibilityIcon /> View</MenuItem>}
        {onEdit && <MenuItem onClick={onEdit}><EditIcon /> Edit</MenuItem>}
        {showApproveReject && (
          <>
            <MenuItem onClick={onApprove}><CheckCircleIcon /> Approve</MenuItem>
            <MenuItem onClick={onReject} sx={{ color: 'error.main' }}>
              <CancelIcon /> Reject
            </MenuItem>
          </>
        )}
        {onDelete && (
          <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon /> Delete
          </MenuItem>
        )}
      </Menu>
    );
  };
  
  