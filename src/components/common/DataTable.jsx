// components/common/DataTable.jsx
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Typography
  } from '@mui/material';
  
  const DataTable = ({ 
    columns, 
    data, 
    renderActions,
    emptyMessage = "No data found"
  }) => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field}>{col.header}</TableCell>
              ))}
              {renderActions && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      {col.render ? col.render(item) : item[col.field]}
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell>{renderActions(item)}</TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Typography variant="body2" color="textSecondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default DataTable;