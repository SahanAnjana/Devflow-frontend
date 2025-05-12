// src/components/common/FilterToolbar.jsx
import { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * Reusable filter toolbar for data tables
 * @param {Object} props Component props
 * @param {string} props.searchValue Current search term
 * @param {function} props.onSearchChange Handler for search input changes
 * @param {function} props.onFilterChange Handler for filter changes
 * @param {function} props.onClearFilters Handler for clearing all filters
 * @param {Array} props.filterColumns Configuration for filter columns
 * @param {Object} props.filters Current filter values
 */
const FilterToolbar = ({
  searchValue = '',
  onSearchChange,
  onFilterChange,
  onClearFilters,
  filterColumns = [],
  filters = {}
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          {/* Search Field */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search..."
              value={searchValue}
              onChange={onSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          {/* Filter Fields */}
          {filterColumns.map((field) => (
            <Grid item xs={12} md={field.gridSize || 2} key={field.name}>
              <FormControl fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={filters[field.name] || ''}
                  onChange={onFilterChange}
                  label={field.label}
                >
                  <MenuItem value="">{field.allLabel || `All ${field.label}s`}</MenuItem>
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
          
          {/* Clear Filters Button */}
          <Grid item xs={12} md={2} display="flex" alignItems="center">
            <Button 
              fullWidth
              variant="outlined"
              onClick={onClearFilters}
              startIcon={<FilterListIcon />}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FilterToolbar;