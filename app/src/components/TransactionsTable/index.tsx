import React, { useContext } from 'react';
import { isArray } from "lodash";
import FormGroup from '@mui/material/FormGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { 
  Box, 
  Chip, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  OutlinedInput, 
  Paper, 
  TextField 
} from '@mui/material';
import type { Theme } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Context from "../../context";
import { useTheme } from '@mui/material';
import { Categories, Category } from "../../utils/types";

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
};

interface FilterObject {
  foodanddrinkFilterOn: boolean; 
  paymentFilterOn: boolean; 
  shopsFilterOn: boolean; 
  travelFilterOn: boolean; 
  recreationFilterOn: boolean; 
  transferFilterOn: boolean; 
  restarauntsFilterOn: boolean; 
  healthcareFilterOn: boolean; 
  serviceFilterOn: boolean; 
  otherFilterOn: boolean; 
};

// const sortingOptions = [
//   {
//     value: 'Alphabetically (Name)'
//   },
//   {
//     value: 'Amount'
//   }
// ];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const hexToRgb = (hex: string | undefined) => {
  // @ts-ignore
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return "rgb(" + r + "," + g + "," + b + ",0.25)";
}

const getStyles = (category: string, filterValues: readonly string[], theme: Theme, lightMode: boolean) => {
  return {
    color: `${Category?.Colors[lightMode ? 'Light' : 'Dark']?.get(category) ? Category?.Colors[lightMode ? 'Light' : 'Dark']?.get(category) : ""}`, 
    fontWeight:
      filterValues.indexOf(category) === -1
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    background: filterValues.includes(category) 
      ? `${Category?.Colors[lightMode ? 'Light' : 'Dark']?.get(category) ? hexToRgb(Category?.Colors[lightMode ? 'Light' : 'Dark']?.get(category)?.slice(1)) : ""}`
      : '', 
  };
}

const TransactionsTable: React.FC = () => {
  const theme = useTheme();
  const { accountsArray, lightMode, transactions } = useContext(Context);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const [search, setSearch] = React.useState<string>("");
  // const [sortBy, setSortBy] = React.useState<String>("Income");
  const [filter, setFilter] = React.useState<FilterObject>({
    foodanddrinkFilterOn: false, 
    paymentFilterOn: false, 
    shopsFilterOn: false, 
    travelFilterOn: false, 
    recreationFilterOn: false, 
    transferFilterOn: false, 
    restarauntsFilterOn: false, 
    healthcareFilterOn: false, 
    serviceFilterOn: false, 
    otherFilterOn: false 
  });
  const [filterValues, setFilterValues] = React.useState<Array<string>>([]);
  const [rows, setRows] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    const initialRows: any[] = [];
    transactions.forEach((transaction) => {
      const accountResult = accountsArray.find((account) => {
        return account.accountId.S === transaction.account_id;
      });
      const accountName = accountResult.name.S;
      initialRows.push({ 
        date: transaction.date, 
        account: accountName,
        name: transaction.name, 
        amount: `$${transaction.amount.toString()}`, 
        category: transaction.category[0] === "Payment" && transaction.category.length > 1 ? transaction.category[1] : transaction.category[0] 
      });
    });
    setRows(initialRows);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSortingChange:((event: React.ChangeEvent<HTMLInputElement>) => void) = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setSortBy(event.target.value);
  }

  const handleSearchChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Changing search to " + event.target.value.trim());
    // setSearch(event.target.value.trim());
  };

  const changeFilter = (options: string[]) => {
    const newFilter = {
      foodanddrinkFilterOn: false, 
      paymentFilterOn: false, 
      shopsFilterOn: false, 
      travelFilterOn: false, 
      recreationFilterOn: false, 
      transferFilterOn: false, 
      restarauntsFilterOn: false, 
      healthcareFilterOn: false, 
      serviceFilterOn: false, 
      otherFilterOn: false 
    };
    options.forEach((option) => {
      // @ts-ignore
      newFilter[`${option.toLowerCase()}FilterOn`] = true;
    });

    setFilter(newFilter);
    setFilterValues(options);
  };

  const filterTransaction:((tranaction: Data) => boolean) = (tranaction: Data) => {
    let passes = false;
    if (filter.foodanddrinkFilterOn && tranaction.category.toLowerCase() === "foodanddrink") {
        passes = true;
    }
    if (filter.paymentFilterOn && tranaction.category.toLowerCase() === "payment") {
        passes = true;
    }
    if (filter.shopsFilterOn && tranaction.category.toLowerCase() === "shops") {
        passes = true;
    }
    if (filter.travelFilterOn && tranaction.category.toLowerCase() === "travel") {
        passes = true;
    }
    if (filter.recreationFilterOn && tranaction.category.toLowerCase() === "recreation") {
      passes = true;
    }
    if (filter.transferFilterOn && tranaction.category.toLowerCase() === "transfer") {
        passes = true;
    }
    if (filter.restarauntsFilterOn && tranaction.category.toLowerCase() === "restaraunts") {
        passes = true;
    }
    if (filter.healthcareFilterOn && tranaction.category.toLowerCase() === "healthcare") {
        passes = true;
    }
    if (filter.serviceFilterOn && tranaction.category.toLowerCase() === "service") {
      passes = true;
    }
    if (filter.otherFilterOn && tranaction.category.toLowerCase() === "other") {
      passes = true;
    }
    return passes;
  };

  const handleChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    if (isArray(event.target.value)) {
      changeFilter(event.target.value);
    }
    else {
      console.error("The values were not an array!");
    }
  };

  return (
    <Paper sx={{overflow: 'hidden', background: theme.palette.background.paper, border: `1px solid ${lightMode ? 'black' : 'white' }` }}>
      <FormGroup className="row" style={{margin: "1.5rem"}}>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel
            color="info" 
            id="filter-select-input-label"
          >
            Filter
          </InputLabel>
          <Select
            color="info" 
            labelId="filter-select-label"
            id="filter-select"
            multiple
            // @ts-ignore
            value={filterValues}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {
                  // @ts-ignore
                  selected.map((value) => (
                    <Chip color="info" key={value} label={value} />
                  ))
                }
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Categories.map((category) => (
              <MenuItem key={category} value={category} style={getStyles(category, filterValues, theme, lightMode)}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <div className="row"style={{marginBottom: "10px"}} >
          <div className="col-2" />
          <div className="col-8">
            <div className="row">
              <div style={{marginTop: "0.6rem"}} className="col-md-6">
                <TextField id="outlined-basic" onChange={handleSearchChange} label="Search (Name)" variant="outlined" name="search" />
              </div>
              <div style={{marginTop: "0.6rem"}} className="col-md-6">
                <TextField
                  id="standard-select-status"
                  select
                  label="Sort By"
                  value={sortBy}
                  onChange={handleSortingChange}
                  SelectProps={{
                    native: true,
                  }}
                  variant="outlined"
                  >
                  {sortingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </TextField>
              </div>
            </div>
          </div>
          <div className="col-2" />
        </div> */}
      </FormGroup>
      <TableContainer sx={{ maxHeight: 440, background: theme.palette.primary.main }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id+"head"}
                  align={column.align}
                  style={{ minWidth: column.minWidth, color: theme.typography.body1.color }} 
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
                if (!filterTransaction(row)) {
                  return "";
                }

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code} style={{ color: theme.typography.body1.color }}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} style={{ color: theme.typography.body1.color }}>
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