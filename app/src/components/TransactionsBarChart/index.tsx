/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useContext } from "react";
import { Chart } from "react-google-charts";
import { CircularProgress, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

import Context from "../../context";
import { calculateTotals } from "../TransactionsPieChart";
import { Category } from "../../utils/types";

const styles = {
  barChart: css({
    fontWeight: 'bold' 
  })
};

//First element will be an array with the date (mm-yyyy) and then each category. Go througheach month and get every category. Then go through each month and ask for all categories even if it doesn't exist in that month (make it 0)
const getData = (lightMode: boolean, allCategories: string[], monthlySpending: any, transactions: any[]) => {
  // Get all categories
  const data: any[][] = [["Date"]];
  const headers = data[0].concat(allCategories);
  data[0] = headers;
  data[0].push({ role: 'annotation' });

  // Go through each "month" and get the amount of each category in our "allCategories" array. If it does not exist, then set the value to 0
  const monthlySpendingKeys = Object.keys(monthlySpending);
  monthlySpendingKeys.forEach((monthlySpendingKey: string) => {
    const monthlyData = [];
    const date = monthlySpending[monthlySpendingKey]?.M?.Date?.S;
    monthlyData.push(date);
    const spending = monthlySpending[monthlySpendingKey]?.M?.Spending?.M;
    allCategories.forEach((category: string) => {
      const value = spending[category]?.M?.Amount?.N ? parseFloat(spending[category]?.M?.Amount?.N) : 0;
      monthlyData.push(value);
    });
    // Lastly, push the overall spending for the month for annotation
    monthlyData.push(`$${spending.Overall?.N}`);
    data.push(monthlyData);
  });

  // Now for the current month
  const currentMonth = calculateTotals(lightMode, allCategories, monthlySpending, transactions);
  const currentMonthData: any[] = ["This month"];

  allCategories.forEach((category: string) => {
    let currentValue = 0;
    currentMonth.forEach((value, index) => {
      if (index !== 0) {
        const amount = value[1];
        if (category === value[0]) {
          currentValue = amount;
        }
      }
    });
    currentMonthData.push(currentValue);
  });

  // Add the overall amount to currentMonthData
  let total = 0;
  currentMonth.forEach((category, index) => {
    if (index !== 0) {
      const amount = category[1];
      total += amount;
    }
  });

  currentMonthData.push(`$${Math.round((total + Number.EPSILON) * 100) / 100}`);
  data.push(currentMonthData);
  return data;
};

const TransactionsBarChart: React.FC = () => {
  const theme = useTheme();
  const { allCategories, lightMode, monthlySpending, transactions } = useContext(Context);

  if (Object.keys(monthlySpending).length === 0) {
    return <Typography>You have no data on spending</Typography>
  }

  const data = getData(lightMode, allCategories, monthlySpending, transactions);
  const options = {
    title: "Spending Per Month", 
    titleTextStyle: { color: theme.typography.body2.color }, 
    tooltip: { trigger: 'both' }, 
    legend: "none", 
    chartArea: { width: "75%" }, 
    isStacked: true, 
    hAxis: {
      title: "Total Spending ($)", 
      titleTextStyle: { color: theme.typography.body2.color }, 
      textStyle: { color: theme.typography.body2.color }, 
      minValue: 0, 
    }, 
    vAxis: {
      title: "Date (mm-yyyy)", 
      titleTextStyle: { color: theme.typography.body2.color }, 
      textStyle: { color: theme.typography.body2.color }, 
    }, 
    backgroundColor: theme.palette.background.default, 
    series: {
      0:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Food and Drink")},
      1:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Payment")},
      2:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Shops")},
      3:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Travel")},
      4:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Recreation")}, 
      5:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Transfer")},
      6:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Restaraunts")},
      7:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Healthcare")},
      8:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Service")}, 
      9:{color: Category.Colors[lightMode ? 'Light' : 'Dark'].get("Other")}, 
    }
  };

  return (
    <Chart
      css={styles.barChart}
      chartType="BarChart"
      width="100%"
      height="380px"
      data={data}
      options={options} 
      loader={<CircularProgress color="info" />}
    />
  );
}


export default TransactionsBarChart;