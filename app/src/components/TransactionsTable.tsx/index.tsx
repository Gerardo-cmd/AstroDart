import React, { useContext } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import Context from "../../context";

interface Column {
  id: 'date' | 'account' | 'amount' | 'name' | 'category';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'date', label: 'Date', minWidth: 170 },
  { id: 'account', label: 'Account', minWidth: 100 },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 170,
  },
  {
    id: 'name',
    label: 'Name',
    minWidth: 170,
  },
  {
    id: 'category',
    label: 'Category',
    minWidth: 170,
  },
];

interface Data {
  date: string; 
  account: string; 
  amount: string; 
  name: string; 
  category: string; 
}

const TransactionsTable: React.FC = () => {
  const { accountsArray, transactions } = useContext(Context);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows: any[] = [];

  transactions.forEach((transaction) => {
    const accountResult = accountsArray.find((account) => {
      return account.accountId.S === transaction.account_id;
    });
    const accountName = accountResult.name.S;
    rows.push({ 
      date: transaction.date, 
      account: accountName,
      name: transaction.name, 
      amount: `$${transaction.amount.toString()}`, 
      category: transaction.category[0] === "Payment" && transaction.category.length > 1 ? transaction.category[1] : transaction.category[0] 
    })
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TransactionsTable;