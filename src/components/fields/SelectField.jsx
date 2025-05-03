// components/fields/SelectField.jsx
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
  } from '@mui/material';
  
export const SelectField = ({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    error = null,
    disabled = false
  }) => (
    <FormControl fullWidth required={required} error={!!error} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
  
  