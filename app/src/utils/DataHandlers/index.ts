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

  return newItems;
};

export const unlinkAccount = async (items: any, itemId: string, accountId: string) => {
  // @ts-ignore
  const newAccounts = { M: {} };
  const newItems = items;
  // @ts-ignore
  const accountKeys: Array<string> = Object.keys(items[itemId].M.accounts.M);
  if (accountKeys.length <= 1) {
    deleteItem(items, itemId);
    return;
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
