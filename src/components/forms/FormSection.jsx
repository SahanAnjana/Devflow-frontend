// src/components/forms/FormSection.jsx
import { Grid, Typography, Divider, Box } from '@mui/material';

/**
 * Reusable form section component to group related form fields
 * @param {Object} props Component props
 * @param {string} props.title Section title
 * @param {node} props.children Form fields to render in this section
 * @param {string} props.subtitle Optional subtitle text
 * @param {string} props.icon Optional icon to display with title
 * @param {boolean} props.divider Whether to show a divider after the title
 * @param {Object} props.spacing Grid spacing configuration
 */
const FormSection = ({
  title,
  children,
  subtitle,
  icon,
  divider = true,
  spacing = { xs: 2, md: 3 }
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {title && (
        <Box sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" sx={{ mb: 0.5 }}>
            {icon && (
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                {icon}
              </Box>
            )}
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </Box>
          
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          
          {divider && <Divider sx={{ mt: 1, mb: 2 }} />}
        </Box>
      )}
      
      <Grid container spacing={spacing}>
        {children}
      </Grid>
    </Box>
  );
};

export default FormSection;