/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useContext } from "react";
import { Chart } from "react-google-charts";
import { CircularProgress } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Context from "../../context";

const styles = {
  pieChart: css({
    fontWeight: 'bold'
  })
};

export const calculateTotals = (transactions: any[]) => {
  const data: any[] = [["Category", "Amount"]];
  const categories = new Map();
  // Go through and get every category there is.
  transactions.forEach((transaction) => {
    const category = transaction.category[0] === "Payment" && transaction.category.length > 1 ? transaction.category[1] : transaction.category[0]
    if (categories.has(category))  {
      const oldValue = categories.get(category);
      categories.set(category, oldValue + transaction.amount);
    }
    else {
      categories.set(category, transaction.amount);
    }
  });

  categories.forEach((amount, category) => {
    data.push([category, amount]);
  });
  return data;
};

const TransactionsPieChart: React.FC = () => {
  const theme = useTheme();
  const { transactions } = useContext(Context);

  // Calculate totals for every category
  const data = calculateTotals(transactions);
  const date = new Date();
  const currentDate = date.getMonth() + 1 + "-" + date.getFullYear();
  const options = {
    title: `Spending Breakdown For This Month (${currentDate})`,
    pieHole: 0.4,
    is3D: false,
    backgroundColor: theme.palette.secondary.main,
    legend: 'bottom'
  };
  
  return (
    <Chart
      css={styles.pieChart} 
      chartType="PieChart"
      width="100%"
      height="400px"
      data={data}
      options={options} 
      loader={<CircularProgress />} 
    />
  );
};

export default TransactionsPieChart;