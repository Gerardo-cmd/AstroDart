import React, { useEffect, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@mui/material";

import Context from "../../context";

import { getAccountsArray } from "../../utils/DataHandlers"
import updateItems from "../../utils/Endpoints/UpdateItems";

const Link = () => {
  const { email, items, linkToken, isPaymentInitiation, dispatch } = useContext(Context);

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
          console.log("There was an error. the message is below...");
          const message = await linkResponse.json();
          console.log(message);
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
        
        const authBody = { accessToken: data.access_token };
        const response = await fetch(`http://localhost:5000/api/auth`, { method: "POST", mode: "cors", headers, body: JSON.stringify(authBody) })
        
        if (!response.ok) {
          // Do something
        }

        const apiData = await response.json();
        
        // Get the accounts here for each item.
        const accountsForThisItem = {};
        apiData.accounts.forEach((account: any) => {
          // @ts-ignore
          accountsForThisItem[account.account_id] = {
            M: {
              accountId: { S: account.account_id},
              name: { S: account.name},
              balance: { N: account.balances.available.toString()},
              item_id: { S: data.item_id }
            }
          };
        });

        const newItems = items;
        // @ts-ignore
        newItems[`${data.item_id}`] = {
          M: {
            institution_id: { S: apiData.item.institution_id},
            access_token: {S: data.access_token},
            item_id: {S: data.item_id},
            accounts: {M: accountsForThisItem}
          }
        };

        await updateItems(email, newItems);

        dispatch({
          type: "SET_STATE",
          state: {
            items: newItems,
            accountsArray: getAccountsArray(newItems),
          },
        });
      };

      // 'payment_initiation' products do not require the public_token to be exchanged for an access_token.
      if (isPaymentInitiation){
        dispatch({ type: "SET_STATE", state: { isItemAccess: false } });
      } else {
        exchangePublicTokenForAccessToken();
      }

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
    <Button variant="contained" type="button" onClick={() => open()} disabled={!ready}>
      Add another account
    </Button>
  );
};

Link.displayName = "Link";

export default Link;
