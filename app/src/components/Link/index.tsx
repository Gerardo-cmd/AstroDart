import React, { useEffect, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@mui/material";

import Context from "../../context";
import {Products} from "plaid";

const Link = () => {
  const { email, items, linkToken, isPaymentInitiation, dispatch } = useContext(Context);

  const onSuccess = React.useCallback(
    (public_token: string) => {
      // If the access_token is needed, send public_token to server
      const exchangePublicTokenForAccessToken = async () => {
        console.log("The public_token we have is below...");
        console.log(public_token);
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

        const newItems = items;
        // @ts-ignore
        newItems[`${apiData.item.institution_id}`] = { M: {
          institution_id: { S: apiData.item.institution_id},
          access_token: {S: data.access_token},
          item_id: {S: data.item_id}
        }};
        dispatch({
          type: "SET_STATE",
          state: {
            items: newItems
          },
        });

        const itemsData = {
          email,
          items: newItems
        }
  
        fetch('http://localhost:5000/api/items', {
          method: 'POST',
          mode: 'cors',
          headers,
          body: JSON.stringify(itemsData),
        })
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          if (response.status === 400) {
            throw new Error("400");
          }
          if (response.status === 500) {
            throw new Error("500");
          }
          throw new Error("Unrecongized status code");
        })
        .then(data => {
            console.log('Success:', data.msg);
        })
        .catch((error) => {
          if (error === "400") {
            console.log("Error: We don't have all the necessary information! We need both the email and the checklist.");
            return;
          }
          if (error === "500") {
            console.log("Error: Something went wrong in the server. Please try again later.");
            return;
          }
          console.error('Error:', error);
          return;
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
