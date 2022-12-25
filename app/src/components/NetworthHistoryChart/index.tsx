import React, { useContext } from "react";
import { Chart } from "react-google-charts";
import { CircularProgress } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Context from "../../context";

const transformNetworthHistoryIntoData = (networthObject: any, currentNetworth: number) => {
  const networthData: Array<Array<string | number>> = [
    [
      "Date",
      "Networth"
    ]
  ];

  const networthKeys = Object.keys(networthObject);

  networthKeys.forEach((networthKey) => {
    networthData.push([networthObject[networthKey].M.Date.S, parseFloat(networthObject[networthKey].M.Networth.N)]);
  });

  networthData.push(["Today", currentNetworth]);
  return networthData;
}

type Props = {
  currentNetworth: number;
}

const NetworthHistoryChart: React.FC<Props> = ({ currentNetworth }) => {
  const theme = useTheme();
  const { lightMode, networthHistory } = useContext(Context);

  const networthData = transformNetworthHistoryIntoData(networthHistory, currentNetworth);

  const options = {
    title: "Networth (USD) Over Time", 
    titleTextStyle: { color: theme.typography.body2.color }, 
    subtitle: "in dollars (USD)", 
    chartArea: { width: "75%" }, 
    curveType: "function", 
    legend: "none", 
    backgroundColor: theme.palette.background.default, 
    vAxis: {
      title: 'Networth ($)', 
      titleTextStyle: { color: theme.typography.body2.color }, 
      textStyle: { color: theme.typography.body2.color }, 
    },
    hAxis: {
      title: 'Date (mm-yyyy)', 
      titleTextStyle: { color: theme.typography.body2.color }, 
      textStyle: { color: theme.typography.body2.color }, 
    },
    colors: lightMode ? ['blue'] : ["#05cee8"] 
  };

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="350px"
      data={networthData}
      options={options} 
      loader={<CircularProgress color="info" />}
    />
  );
};

export default NetworthHistoryChart;