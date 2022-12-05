/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useEffect, useContext, useCallback } from 'react';
import Context from "../context";
import Menu from '../components/Menu';
import Header from '../components/Headers';
import Products from "../components/ProductTypes/Products";
import AccountItem from "../components/AccountItem";
import Items from "../components/ProductTypes/Items";
import { Container, Typography } from '@mui/material';
import { PAGE_TYPES } from '../utils/types'
import { useNavigate } from "react-router-dom";

// Want a tab for:
// Net Worth (A breakdown, maybe a pie graph of what it consists of and a graph showing how it changes over time)
// Spending/Budgeting (Manual tracking)
// A checklist for each check one recieves


const styles = {
  container: css({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  }),
  header: css({
    marginBottom: '30px',
  }),
  input: css({
    margin: '50px 0px',
  })
};

const Networth: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, linkSuccess, items, userToken, dispatch } = useContext(Context);
  const [networth, setNetworth] = useState<number | null>(null);

  if (userToken === "") {
    navigate("/");
  }

  const getInfo = useCallback(async () => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const data = await fetch("http://localhost:5000/api/info", { 
      method: "GET",
      mode: 'cors',
      headers: headers,
    })
    .then((response) => {
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { backend: false } });
        return { paymentInitiation: false };
      }
      return response.json();
    })
    .then((data) => {
      return data.data;
    });

    const paymentInitiation: boolean = data.products.includes(
      "payment_initiation"
    );
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
        isPaymentInitiation: paymentInitiation,
      },
    });
    return { paymentInitiation };
  }, [dispatch]);

  const itemKeys: Array<string> = Object.keys(items);

  const generateToken = useCallback(
    async (isPaymentInitiation: boolean) => {
      // Link tokens for 'payment_initiation' use a different creation flow in your backend.
      const path = isPaymentInitiation
        ? "/api/create_link_token_for_payment"
        : "/api/create_link_token";

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      const body = { userToken };

      const response = await fetch(`http://localhost:5000${path}`, {
        method: "POST",
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();

      if (data?.data) {
        if (data?.data?.error != undefined) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          });
          return;
        }
        dispatch({ type: "SET_STATE", state: { linkToken: data.data.link_token } });
      }
      // Save the link_token to be used later in the Oauth flow.
      localStorage.setItem("link_token", data.data.link_token);
    },
    [dispatch]
  );

  const getNetworth = () => {
    const promiseArray: any[] = [];

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    // Go through every item in context to get the accounts from each bank
    // @ts-ignore
    itemKeys.forEach((item: any) => {
      promiseArray[promiseArray.length] = new Promise((resolve, reject) => {
        const body = { accessToken: items[item].M.access_token.S };
        fetch(`http://localhost:5000/api/auth`, 
        { 
          method: "POST", 
          mode: "cors", 
          headers, 
          body: JSON.stringify(body) 
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const itemAccounts = data.accounts;
          // accounts = [{name: "", balances: {available: ""} }, ...]
          resolve(itemAccounts);
        })
        .catch((error) => {
          reject(error);
        })
      });
    });

    // Now that we have all the accounts, go through all of them and add them to dispatch
    Promise.all(promiseArray).then((dataArray) => {
      let currentNetworth = 0;
      const newAccounts: any[] = [];
      // @ts-ignore
      dataArray.forEach((accountGroup: any) => {
        // accountGroup = [{name: "", balances: {available: ""} }, ...]
        accountGroup.forEach((account: any) => {
          // account = {name: "", balances: {available: ""} }
          newAccounts[newAccounts.length] = {
            name: account.name,
            balance: account.balances.available
          };
          currentNetworth += account.balances.available;
        });
      })
      setNetworth(currentNetworth);
      dispatch({
        type: "SET_STATE",
        state: {
          accounts: newAccounts
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
  };

    
  useEffect(() => {
    const init = async () => {
      const { paymentInitiation } = await getInfo(); // used to determine which path to take when generating token
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }
      generateToken(paymentInitiation);
    };
    init(); 
    getNetworth();
  }, [dispatch, generateToken, getInfo, items]);

  return (
    <>
      <Menu page={PAGE_TYPES.Networth} />
      <Container css={styles.container}> 
        <Typography>Networth: {networth}</Typography>
        <br />
        <>
          {!!accounts.length && (
            <div className="row">
              <div className="col" />
              <div className="col-lg-4 col-md-4 col-sm-6">
                {accounts.map((account, index) => {
                  return (
                    // @ts-ignore
                    <AccountItem key={index} name={account.name} balance={account.balance} />
                  );
                })}
              </div>
              <div className="col" />
            </div>
          )}
          <div>
            <Header />
          </div>
        </>
      </Container>
    </>
  );
};

export default Networth;