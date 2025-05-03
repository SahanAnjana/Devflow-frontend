// components/fields/DateField.jsx
import { TextField } from '@mui/material';


export const DateField = ({ label, name, value, onChange, required, error }) => (
    <TextField
      label={label}
      name={name}
      type="date"
      fullWidth
      required={required}
      InputLabelProps={{ shrink: true }}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
    />
  );