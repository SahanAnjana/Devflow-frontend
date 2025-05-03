// components/lists/FilterBar.jsx
export const FilterBar = ({ filters, onFilterChange, onClearFilters, filterConfig }) => {
    return (
      <Grid container spacing={2}>
        {filterConfig.map((filter) => (
          <Grid item key={filter.name} xs={12} md={filter.width || 3}>
            <FormControl fullWidth>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                name={filter.name}
                value={filters[filter.name]}
                onChange={onFilterChange}
                label={filter.label}
              >
                {filter.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
        <Grid item xs={12} md={2}>
          <Button fullWidth variant="outlined" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    );
  };