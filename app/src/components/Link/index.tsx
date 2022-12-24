import React, { useEffect, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@mui/material";

import Context from "../../context";

import { 
  getAccountsArray,
  getCashAccountsArray,
  getCreditAccountsArray, 
  getLoanAccountsArray, 
  getInvestmentAccountsArray
 } from "../../utils/DataHandlers"
import updateItems from "../../utils/Endpoints/UpdateItems";
import getAccountAuth from "../../utils/Endpoints/GetAccountAuth";
import getLiabilities from "../../utils/Endpoints/GetLiabilities";
import getInvestments from "../../utils/Endpoints/GetInvestments";
import getTransactions from "../../utils/Endpoints/GetTransactions";

const Link = () => {
  const { email, items, linkToken, currentAccountType, dispatch } = useContext(Context);

  const onSuccess = React.useCallback(
    (public_token: string) => {
      // If the access_token is needed, send public_token to server
      const exchangePublicTokenForAccessToken = async () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        const accessTokenData = { public_token };
        const linkResponse = await fetch("http://localhost:5000/api/set_access_token", {
          method: "POST",
          mode: "cors",
          headers: headers,
          body: JSON.stringify(accessTokenData),
        });

        if (!linkResponse.ok) {
          const message = await linkResponse.json();
          console.error(message);
          dispatch({
            type: "SET_STATE",
            state: {
              itemId: `no item_id retrieved`,
              accessToken: `no access_token retrieved`,
              isItemAccess: false,
            },
          });
          return;
        }

        const data = await linkResponse.json();
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: data.item_id,
            accessToken: data.access_token,
            isItemAccess: true,
          },
        });

        let balanceData = null;
        if (currentAccountType === "auth") {
          balanceData = await getAccountAuth(data.access_token);
        }
        else if (currentAccountType === "liabilities") {
          balanceData = await getLiabilities(data.access_token);
        }
        else if (currentAccountType === "investments") {
          balanceData = await getInvestments(data.access_token);
        }
        
        // Get the accounts here for each item.
        const accountsForThisItem = {};
        balanceData.accounts.forEach((account: any) => {
          // @ts-ignore
          accountsForThisItem[account.account_id] = {
            M: {
              accountId: { S: account.account_id},
              name: { S: account.name},
              balance: { N: account.balances.current.toString()},
              item_id: { S: data.item_id },
              type: { S: account.type}
            }
          };
        });

        const newItems = items;
        // @ts-ignore
        newItems[`${data.item_id}`] = {
          M: {
            institution_id: { S: balanceData.item.institution_id },
            access_token: { S: data.access_token },
            item_id: { S: data.item_id },
            accounts: { M: accountsForThisItem },
            product: { S: balanceData.item.products[0] }
          }
        };

        await updateItems(email, newItems);
        const transactionsData: any[] = await getTransactions(email.trim().toLowerCase());
        dispatch({
          type: "SET_STATE",
          state: {
            items: newItems, 
            accountsArray: getAccountsArray(newItems), 
            cashAccountsArray: getCashAccountsArray(newItems), 
            creditAccountsArray: getCreditAccountsArray(newItems), 
            loanAccountsArray: getLoanAccountsArray(newItems), 
            investmentAccountsArray: getInvestmentAccountsArray(newItems), 
            transactions: transactionsData 
          },
        });
      };

      exchangePublicTokenForAccessToken();

      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      window.history.pushState("", "", "/");
    },
    [dispatch]
  );

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  if (window.location.href.includes("?oauth_state_id=")) {
    // TODO: figure out how to delete this ts-ignore
    // @ts-ignore
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [ready, open, isOauth]);

  return (
    <Button color="info" variant="contained" type="button" onClick={() => open()} disabled={!ready}>
      Add another account
    </Button>
  );
};

Link.displayName = "Link";

export default Link;
