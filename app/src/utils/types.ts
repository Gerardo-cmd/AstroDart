export const PAGE_TYPES = {
  Networth: "NETWORTH",
  Spending: "SPENDING",
  Checklist: "CHECKLIST",
  Settings: "SETTINGS"
}; 

export const Categories = [
  "Food and Drink", 
  "Payment", 
  "Shops", 
  "Travel", 
  "Recreation", 
  "Transfer", 
  "Restaraunts", 
  "Healthcare", 
  "Service", 
  "Other" 
];

const darkCategoryValues: (readonly [string, string])[] = [
  ["Food and Drink", "#38d15b"], // Light Green
  ["Payment", "#05cee8"], // Cyan
  ["Shops", "#ed5361"], // Light Red
  ["Travel", "#F57C00"], // Orange
  ["Recreation", "#007bff"], // Dark Blue
  ["Transfer", "#7E57C2"], // Purple 
  ["Restaraunts", "#fafc51"], // Yellow
  ["Healthcare", "#f768df"], // Pink
  ["Service", "#458bd6"], // Blue
  ["Other", "#757475"], // Light grey
];

const lightCategoryValues: (readonly [string, string])[] = [
  ["Food and Drink", "#06d135"], // Light Green
  ["Payment", "#02b9d1"], // Cyan
  ["Shops", "#e63545"], // Light Red
  ["Travel", "#F57C00"], // Orange
  ["Recreation", "#007bff"], // Dark Blue
  ["Transfer", "#7E57C2"], // Purple 
  ["Restaraunts", "#ffcf0f"], // Light Orange
  ["Healthcare", "#ff57e3"], // Pink
  ["Service", "#357ac4"], // Blue
  ["Other", "#4d4d4d"], // Dark Grey
];

export const Category = {
  Colors: {
    Dark: new Map<string, string>(darkCategoryValues), 
    Light: new Map<string, string>(lightCategoryValues), 
  },
};
