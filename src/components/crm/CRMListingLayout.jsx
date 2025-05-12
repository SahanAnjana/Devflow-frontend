import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  DialogContentText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import FilterToolbar from '../common/FilterToolbar';

const CRMListingLayout = ({
  title,
  items,
  loading,
  error,
  openDialog,
  setOpenDialog,
  selectedItem,
  setSelectedItem,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleSearch,
  searchQuery,
  setSearchQuery,
  filters,
  filterColumns,
  handleFilterChange,
  clearFilters,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalItems,
  columns,
  dialogContent,
  confirmDelete,
  setConfirmDelete,
  handleConfirmDelete
}) => {


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3, maxWidth: '100%' }}>
      <Paper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h5">{title}</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedItem(null);
              setOpenDialog(true);
            }}
          >
            Add New
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          <TextField
            fullWidth
            label="Search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <IconButton>
                  <EditIcon />
                </IconButton>
              )
            }}
          />
        </Box>
        <FilterToolbar
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          filterColumns={filterColumns}
          filters={filters}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.render ? column.render(item) : item[column.id]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedItem(item);
                        setOpenDialog(true);
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedItem(item);
                        setConfirmDelete(true);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[3, 10, 25, 100]}
                  count={totalItems}
                  rowsPerPage={rowsPerPage}
                  page={page - 1}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>

      {dialogContent}

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CRMListingLayout;
