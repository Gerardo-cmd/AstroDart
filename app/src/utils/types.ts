export const PAGE_TYPES = {
  Networth: "NETWORTH",
  Spending: "SPENDING",
  Checklist: "CHECKLIST",
  Settings: "SETTINGS"
}; 

const categoryValues: (readonly [string, string])[] = [
  ["Food and Drink", "#38d15b"], // Light Green
  ["Payment", "#05cee8"], // Cyan
  ["Shops", "#ed5361"], // Light Red
  ["Travel", "#F57C00"], // Light Blue
  ["Recreation", "#007bff"], // Blue
  ["Transfer", "#7E57C2"], // Purple 
  ["Restaraunts", "#fafc51"], // Dark Orange
  ["Healthcare", "#f768df"], // Pink
  ["Service", "#458bd6"], // Light Yellow 
  ["Other", "#757475"], // Light grey
];
export const Category = {
  Colors: {
    Dark: new Map<string, string>(categoryValues), 
      // PirateKing: colors.blueGrey[300],
      // Grocery: colors.green[600],
      // Meal: colors.cyan[500],
      // Others: colors.deepPurple[400],
      // Recreation: colors.lightBlue[700],
      // Shopping: colors.red[600],
      // Special: '',
      // Utility: colors.orange[500],
      // Vehicle: colors.yellow[500],
    // },
    Light: new Map<string, string>(categoryValues), 
    //   PirateKing: '#6c757d',
    //   Grocery: '#28a745',
    //   Meal: '#17a2b8',
    //   Others: '#7E57C2',
    //   Recreation: '#007bff',
    //   Shopping: '#dc3545',
    //   Special: '#343a40',
    //   Utility: '#F57C00',
    //   Vehicle: '#ffc107',
    // },
  },
};
