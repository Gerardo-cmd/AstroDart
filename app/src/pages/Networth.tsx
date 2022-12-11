/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useEffect, useContext, useCallback } from 'react';
import Context from "../context";
import Menu from '../components/Menu';
import Header from '../components/Headers';
import AccountItem from "../components/AccountItem";
import { CircularProgress, Container, Typography } from '@mui/material';
import { PAGE_TYPES } from '../utils/types'
import getPlaidInfo from "../utils/Endpoints/GetPlaidInfo";
import createLinkToken from "../utils/Endpoints/CreateLinkToken";
import { useNavigate } from "react-router-dom";

const styles = {
  loadingScreen: css({
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center',
    verticalAlignment: 'center',
  }),
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
  const { accountsArray, items, userToken, dispatch } = useContext(Context);
  const [networth, setNetworth] = useState<number | null>(null);

  if (userToken === "") {
    navigate("/");
  }

  const getInfo = useCallback(async () => {
    const data = await getPlaidInfo();
    if (!data) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }
    else {
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
    }
  }, [dispatch]);

  // Creates the linkToken and dispatches it to Context and saves it in local storage
  const generateToken = useCallback(
    async (isPaymentInitiation: boolean) => {
      const data = await createLinkToken(userToken, isPaymentInitiation);

      if (!data) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }

      if (data?.error !== undefined) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: null,
            linkTokenError: data.error,
          },
        });
        return;
      }

      dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });

      // Save the link_token to be used later in the Oauth flow.
      localStorage.setItem("link_token", data.link_token);
    },
    [dispatch, userToken]
  );
    
  useEffect(() => {
    const init = async () => {
      const { paymentInitiation } = await getInfo();
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

    const getNetworth = () => {
      if (!items) {
        setNetworth(0);
        return;
      }
  
      let currentNetworth = 0;
      // @ts-ignore
      accountsArray.forEach((account: any) => {
        currentNetworth += parseInt(account.balance.N);
      });
  
      setNetworth(currentNetworth);
    };

    init(); 
    getNetworth();
  }, [dispatch, generateToken, getInfo, accountsArray, items]);

  if (!networth && networth !== 0) {
    return (
      <>
        <Menu page={PAGE_TYPES.Networth} />
        <div css={styles.loadingScreen}> 
          <Typography><CircularProgress color="secondary" /></Typography>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu page={PAGE_TYPES.Networth} />
      <Container maxWidth="md" css={styles.container}> 
        <Typography>Networth: ${networth}</Typography>
        <br />
        <>
          {!!accountsArray.length && (
            <div className="row">
              <div className="col" />
              <div className="col-lg-4 col-md-4 col-sm-6">
                {accountsArray.map((account, index) => {
                  return (
                    // @ts-ignore
                    <AccountItem key={index} name={account.name.S} balance={account.balance.N} />
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