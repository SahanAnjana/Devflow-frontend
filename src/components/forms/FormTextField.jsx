// components/forms/FormTextField.jsx
import { TextField } from '@mui/material';

export const FormTextField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error = null,
  type = 'text',
  multiline = false,
  rows = 1,
  helperText = '',
  InputProps = {},
  ...props
}) => (
  <TextField
    label={label}
    name={name}
    type={type}
    fullWidth
    required={required}
    value={value}
    onChange={onChange}
    error={!!error}
    helperText={error || helperText}
    multiline={multiline}
    rows={rows}
    InputProps={InputProps}
    {...props}
  />
);