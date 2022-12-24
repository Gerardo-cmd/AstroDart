/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useContext } from "react";
import { Chart } from "react-google-charts";
import { CircularProgress } from "@mui/material";
import type { Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Context from "../../context";

import { getAllCategories } from "../../utils/DataHandlers";
import { Category } from "../../utils/types";

const styles = {
  pieChart: css({
    fontWeight: 'bold' 
  })
};

export const calculateTotals = (allCategories: string[], monthlySpending: any, transactions: any[]) => {
  const data: any[] = [["Category", "Amount"]];
  const categories = new Map();
  // Go through and get every category/amount from transactions there is into categories map.
  transactions.forEach((transaction) => {
    const category = Category?.Colors["Dark"]?.has(transaction.category[0]) ? transaction.category[0] : "Other";
    // const category = transaction.category[0] === "Payment" && transaction.category.length > 1 ? transaction.category[1] : transaction.category[0];
    if (categories.has(category))  {
      const oldValue = categories.get(category);
      categories.set(category, oldValue + transaction.amount);
    }
    else {
      categories.set(category, transaction.amount);
    }
  });

  // Go through the "All categories" first and add values from categories map into data
  allCategories.forEach((category: string) => {
    if (categories.has(category)) {
      const amount = categories.get(category);
      data.push([category, amount]);
    }
    else {
      data.push([category, 0])
    }
  });

  // Then add values for categories that are new but there shouldn't be any
  categories.forEach((amount, category) => {
    if (!allCategories.includes(category)) {
      data.push([category, amount]);
    }
  });
  return data;
};

const getColors = (data: any) => {
  const colors: string[] = [];
  data.forEach((row: any[], index: number) => {
    if (index !== 0) {
      const category = row[0];
      const amount = row[1];
      // @ts-ignore
      colors.push(Category?.Colors['Dark']?.get(category));
    }
  });
  return colors;
};

const TransactionsPieChart: React.FC = () => {
  const theme = useTheme();
  const { allCategories, monthlySpending, transactions } = useContext(Context);

  const data = calculateTotals(allCategories, monthlySpending, transactions);
  const colors = getColors(data);
  const date = new Date();
  const currentDate = date.getMonth() + 1 + "-" + date.getFullYear();
  const options = {
    title: `Spending Breakdown For This Month (${currentDate})`,
    titleTextStyle: { color: theme.typography.body2.color }, 
    tooltip: { trigger: 'both' }, 
    pieHole: 0.4,
    is3D: false,
    backgroundColor: theme.palette.background.default,
    legend: 'none', 
    colors 
  };
  
  return (
    <Chart
      css={styles.pieChart} 
      chartType="PieChart"
      width="99%"
      height="400px"
      data={data}
      options={options} 
      loader={<CircularProgress />} 
    />
  );
};

export default TransactionsPieChart;