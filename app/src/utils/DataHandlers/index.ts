import { Category } from "../../utils/types";
export const getAccountsArray = (newItems: any) => {
  const accountsArray: Array<any> = [];

  if (!newItems || Object.keys(newItems).length === 0) {
    return accountsArray;
  }
  
  // @ts-ignore
  const itemKeys = Object.keys(newItems);
  
  itemKeys.forEach((itemId) => {
    // @ts-ignore
    const accountKeys: Array<string> = Object.keys(newItems[itemId]?.M?.accounts?.M);
    accountKeys.forEach((accountId) => {
      // @ts-ignore
      accountsArray.push(newItems[itemId].M.accounts.M[accountId]?.M);
    });
  });

  return accountsArray;
};

export const getCashAccountsArray = (newItems: any) => {
  const cashAccountsArray: Array<any> = [];

  if (!newItems || Object.keys(newItems).length === 0) {
    return cashAccountsArray;
  }
  
  // @ts-ignore
  const itemKeys = Object.keys(newItems);
  
  itemKeys.forEach((itemId) => {
    // @ts-ignore
    const accountKeys: Array<string> = Object.keys(newItems[itemId]?.M?.accounts?.M);
    accountKeys.forEach((accountId) => {
      
      if (newItems[itemId].M.accounts.M[accountId]?.M.type.S === "depository") {
        // @ts-ignore
        cashAccountsArray.push(newItems[itemId].M.accounts.M[accountId]?.M);
      }
    });
  });

  return cashAccountsArray;
};

export const getCreditAccountsArray = (newItems: any) => {
  const liabilityAccountsArray: Array<any> = [];

  if (!newItems || Object.keys(newItems).length === 0) {
    return liabilityAccountsArray;
  }
  
  // @ts-ignore
  const itemKeys = Object.keys(newItems);
  
  itemKeys.forEach((itemId) => {
    // @ts-ignore
    const accountKeys: Array<string> = Object.keys(newItems[itemId]?.M?.accounts?.M);
    accountKeys.forEach((accountId) => {
      
      if (newItems[itemId].M.accounts.M[accountId]?.M.type.S === "credit") {
        // @ts-ignore
        liabilityAccountsArray.push(newItems[itemId].M.accounts.M[accountId]?.M);
      }
    });
  });

  return liabilityAccountsArray;
};

export const getLoanAccountsArray = (newItems: any) => {
  const liabilityAccountsArray: Array<any> = [];

  if (!newItems || Object.keys(newItems).length === 0) {
    return liabilityAccountsArray;
  }
  
  // @ts-ignore
  const itemKeys = Object.keys(newItems);
  
  itemKeys.forEach((itemId) => {
    // @ts-ignore
    const accountKeys: Array<string> = Object.keys(newItems[itemId]?.M?.accounts?.M);
    accountKeys.forEach((accountId) => {
      
      if (newItems[itemId].M.accounts.M[accountId]?.M.type.S === "loan") {
        // @ts-ignore
        liabilityAccountsArray.push(newItems[itemId].M.accounts.M[accountId]?.M);
      }
    });
  });

  return liabilityAccountsArray;
};

export const getInvestmentAccountsArray = (newItems: any) => {
  const investmentAccountsArray: Array<any> = [];

  if (!newItems || Object.keys(newItems).length === 0) {
    return investmentAccountsArray;
  }
  
  // @ts-ignore
  const itemKeys = Object.keys(newItems);
  
  itemKeys.forEach((itemId) => {
    // @ts-ignore
    const accountKeys: Array<string> = Object.keys(newItems[itemId]?.M?.accounts?.M);
    accountKeys.forEach((accountId) => {
      
      if (newItems[itemId].M.accounts.M[accountId]?.M.type.S === "investment") {
        // @ts-ignore
        investmentAccountsArray.push(newItems[itemId].M.accounts.M[accountId]?.M);
      }
    });
  });

  return investmentAccountsArray;
};

export const getUserChecklist = (checklist: Map<string, Map<string, boolean>> | {}) => {
  const checklistKeys = Object.keys(checklist);
  const userChecklist: Array<Array<any>> = [];
  let index = 0;
  checklistKeys.forEach((key) => {
    // @ts-ignore
    userChecklist[index] = [key, checklist[key]];
    index++;
  });
  return userChecklist;
};

export const deleteItem = async (items: any, itemId: string) => {
  const newItems = {};
  const itemKeys: Array<string> = Object.keys(items);
  itemKeys.forEach((itemKey: any) => {
    if (itemKey !== itemId) {
      // @ts-ignore
      newItems[itemKey] = items[itemKey];
    }
  });
  // Call the endpoint (with accessToken as param) to unlink an item once it is empty. Not necessary in dev mode

  return newItems;
};

export const unlinkAccount = async (items: any, itemId: string, accountId: string) => {
  // @ts-ignore
  const newAccounts = { M: {} };
  const newItems = items;
  // @ts-ignore
  const accountKeys: Array<string> = Object.keys(items[itemId].M.accounts.M);
  if (accountKeys.length <= 1) {
    return await deleteItem(items, itemId);
  }
  accountKeys.forEach((accountKey: any) => {
    if (accountKey !== accountId) {
      // @ts-ignore
      newAccounts.M[accountKey] = items[itemId].M.accounts.M[accountKey];
    }
  });

  // @ts-ignore
  newItems[itemId].M.accounts = newAccounts;

  return newItems;
};

export const getAllCategories = (transactions: any, monthlySpending: any) => {
  const allCategories: string[] = [];
  Category.Colors["Dark"].forEach((value, key) => {
    allCategories.push(key);
  });
  return allCategories;
};
