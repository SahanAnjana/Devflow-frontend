// src/components/fields/RatingField.jsx
import { Grid, Typography, Rating } from '@mui/material';

/**
 * Reusable Rating Field component for performance evaluations
 * @param {Object} props Component props
 * @param {string} props.name Field name for the rating
 * @param {string} props.label Display label for the rating field
 * @param {number} props.value Current rating value
 * @param {function} props.onChange Handler function for rating change
 * @param {string} props.description Optional description text
 * @param {number} props.precision Rating precision (default: 0.5)
 * @param {string} props.size Rating size (default: "large")
 * @param {number} props.gridSize Grid size for the container (default: 6 for half width)
 * @param {boolean} props.readOnly Whether rating is read-only
 */
const RatingField = ({
  name,
  label,
  value,
  onChange,
  description,
  precision = 0.5,
  size = "large",
  gridSize = 6,
  readOnly = false
}) => {
  const handleChange = (event, newValue) => {
    if (onChange) {
      onChange(name, newValue);
    }
  };

  return (
    <Grid item xs={12} md={gridSize}>
      <Typography component="legend" gutterBottom>{label}</Typography>
      <Rating
        name={name}
        value={value || 0}
        onChange={readOnly ? undefined : handleChange}
        precision={precision}
        size={size}
        readOnly={readOnly}
      />
      {description && (
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      )}
    </Grid>
  );
};

export default RatingField;