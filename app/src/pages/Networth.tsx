/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useEffect, useContext, useCallback } from 'react';
import { usePlaidLink } from "react-plaid-link";
import { useTheme } from '@mui/material/styles';
import Context from "../context";
import Menu from '../components/Menu';
import Header from '../components/Headers';
import AccountItem from "../components/AccountItem";
import NetworthHistoryChart from "../components/NetworthHistoryChart";
import { Accordion, AccordionSummary, AccordionDetails, Button, CircularProgress, Container, Dialog, DialogTitle, Typography } from '@mui/material';
import type { Theme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PAGE_TYPES } from '../utils/types';
import createLinkToken from "../utils/Endpoints/CreateLinkToken";
import { useNavigate } from "react-router-dom";
import { getAccountsArray } from "../utils/DataHandlers"
import updateItems from "../utils/Endpoints/UpdateItems";
import getAccountAuth from "../utils/Endpoints/GetAccountAuth";

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
    marginBottom: '10px',
  }),
  input: css({
    margin: '50px 0px',
  }),
  popupModal: css({
    justifyContent: 'center',
    verticalAlignment: 'center',
    textAlignment: 'center'
  }),
  error: css({
    justifyContent: 'center',
    color: 'red',
    textAlignment: 'center'
  }),
  accountGroup: css({
    marginBottom: '20px',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    verticalAlignment: 'center',
  }),
  graph: css({
    marginBottom: '5px',
  }), 
  accordion: (theme: Theme) => css({
    background: theme.palette.primary.main, 
    color: theme.typography.body2.color 
  })
};

type SimpleDialogProps = {
  open: boolean;
  onClose: () => void;
};

const SimpleDialog: React.FC<SimpleDialogProps> = ({ onClose, open }) => {
  const [errorText, setErrorText] = useState<string>("");

  const handleClose = () => {
    setErrorText("")
    onClose();
  };
  
  return (
    <Dialog css={styles.popupModal} disableScrollLock={true} onClose={handleClose} open={open}>
      <DialogTitle>We use Plaid to link your accounts. Click below to proceed.</DialogTitle>
      <Typography css={styles.error}>{errorText}</Typography>
      <div css={styles.container}>
        <Header />
      </div>
    </Dialog>
  );
}

const Networth: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { 
    accountsArray, 
    cashAccountsArray, 
    creditAccountsArray, 
    loanAccountsArray, 
    investmentAccountsArray, 
    email, 
    items, 
    linkToken, 
    userToken, 
    dispatch 
  } = useContext(Context);
  const [networth, setNetworth] = useState<number | null>(null);
  const [cashNetworth, setCashNetworth] = useState<number | null>(null);
  const [creditNetworth, setCreditNetworth] = useState<number | null>(null);
  const [loanNetworth, setLoanNetworth] = useState<number | null>(null);
  const [investmentNetworth, setInvestmentNetworth] = useState<number | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);

  if (userToken === "") {
    navigate("/");
  }

  const onSuccess = useCallback(
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

        const authData = await getAccountAuth(data.access_token);
        // Get the accounts here for each item.
        const accountsForThisItem = {};
        authData.accounts.forEach((account: any) => {
          // @ts-ignore
          accountsForThisItem[account.account_id] = {
            M: {
              accountId: { S: account.account_id},
              name: { S: account.name},
              balance: { N: account.balances.current.toString()},
              item_id: { S: data.item_id },
              type: { S: account.type }
            }
          };
        });

        const newItems = items;
        // @ts-ignore
        newItems[`${data.item_id}`] = {
          M: {
            institution_id: { S: authData.item.institution_id },
            access_token: { S: data.access_token },
            item_id: { S: data.item_id },
            accounts: { M: accountsForThisItem },
            products: { S: authData.item.products[0] }
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

      exchangePublicTokenForAccessToken();
      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      window.history.pushState("", "", "/");
    },
    [dispatch, email, items]
  );

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  if (window.location.href.includes("?oauth_state_id=")) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  // Creates the linkToken and dispatches it to Context and saves it in local storage
  const generateToken = useCallback(
    async (type: string) => {
      const data = await createLinkToken(userToken, type);

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

      dispatch({ type: "SET_STATE", state: { linkToken: data.link_token, currentAccountType: type } });

      // Save the link_token to be used later in the Oauth flow.
      localStorage.setItem("link_token", data.link_token);
    },
    [dispatch, userToken]
  );

  const handleNewCashAccount = async () => {
    await generateToken('auth');
    setModalOpen(true);
  };
  const handleNewCreditCardAccount = async () => {
    await generateToken('liabilities');
    setModalOpen(true);
  };
  const handleNewInvestmentAccount = async () => {
    await generateToken('investments');
    setModalOpen(true);
  };

  useEffect(() => {
    generateToken('auth');
  }, []);
    
  useEffect(() => {
    const init = async () => {
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
    };

    const getNetworth = () => {
      if (!items) {
        setNetworth(0);
        return;
      }
  
      let currentCashNetworth = 0;
      let currentCreditNetworth = 0;
      let currentLoanNetworth = 0;
      let currentInvestmentNetworth = 0;
      // @ts-ignore
      accountsArray.forEach((account: any) => {
        let accountBalance = parseFloat(account.balance.N);
        if (account.type.S === "depository") {
          currentCashNetworth += accountBalance;
        }
        else if (account.type.S === "credit") {
          accountBalance *= -1;
          currentCreditNetworth += accountBalance;
        }
        else if (account.type.S === "loan") {
          accountBalance *= -1;
          currentLoanNetworth += accountBalance;
        }
        else if (account.type.S === "investment") {
          currentInvestmentNetworth += accountBalance;
        }
      });

      const totalNetworth = currentCashNetworth + currentCreditNetworth + currentLoanNetworth + currentInvestmentNetworth;
      setCashNetworth(Math.floor(currentCashNetworth));
      setCreditNetworth(Math.floor(currentCreditNetworth));
      setLoanNetworth(Math.floor(currentLoanNetworth));
      setInvestmentNetworth(Math.floor(currentInvestmentNetworth));
      setNetworth(Math.floor(totalNetworth));
    };

    init(); 
    getNetworth();
    if (isOauth && ready) {
      open();
    }
  }, [dispatch, accountsArray, items, ready, open, isOauth]);

  const handleClose = () => {
    setModalOpen(false);
  };

  if (!networth && networth !== 0) {
    return (
      <>
        <Menu page={PAGE_TYPES.Networth} />
        <div css={styles.loadingScreen}> 
          <Typography><CircularProgress color="info" /></Typography>
        </div>
      </>
    );
  }

  const networthIsNegative = networth < 0;

  return (
    <>
      <Menu page={PAGE_TYPES.Networth} />
      <Container maxWidth="lg" css={styles.container}> 
        <Typography variant="h4">Networth: {networthIsNegative && "-"}${ (networthIsNegative) ? networth * -1 : networth }</Typography>
        <br />
        <div css={styles.graph}>
          <NetworthHistoryChart currentNetworth={networth} />
        </div>
        <div className="container-lg" css={styles.container}> 
          <div css={styles.accountGroup}>
            {/** Cash */}
            <Accordion css={styles.accordion(theme)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  borderRadius: 0,
                  transformDuration: '0s'
                }}
              >
                <Typography variant="h6">Cash Accounts (${cashNetworth})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {!!cashAccountsArray.length && (
                  <div className="row">
                    <div className="col" />
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      {cashAccountsArray.map((account, index) => {
                        return (
                          // @ts-ignore
                          <AccountItem key={index} name={account.name.S} balance={account.balance.N} type={account.type.S} />
                        );
                      })}
                    </div>
                    <div className="col" />
                  </div>
                )}
                <div>
                  <Button color="info" variant="contained" onClick={handleNewCashAccount}>{!!cashAccountsArray.length ? "Connect another cash account" : "Connect a cash account"}</Button>
                </div>
              </AccordionDetails>
            </Accordion>
            {/** Credit Cards */}
            <Accordion css={styles.accordion(theme)}>
              <AccordionSummary
                sx={{transform: "none"}}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                {creditNetworth === 0 ? 
                  <Typography variant="h6">Credit Card Accounts (${creditNetworth})</Typography>
                :
                  // @ts-ignore
                  <Typography variant="h6">Credit Card Accounts (-${creditNetworth * -1})</Typography>
                }
              </AccordionSummary>
              <AccordionDetails>
                {!!creditAccountsArray.length && (
                  <div className="row">
                    <div className="col" />
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      {creditAccountsArray.map((account, index) => {
                        return (
                          // @ts-ignore
                          <AccountItem key={index} name={account.name.S} balance={account.balance.N} type={account.type.S} />
                        );
                      })}
                    </div>
                    <div className="col" />
                  </div>
                )}
                <div>
                  <Button color="info" variant="contained" onClick={handleNewCreditCardAccount}>{!!creditAccountsArray.length ? "Connect another credit card account" : "Connect a credit card account"}</Button>
                </div>
              </AccordionDetails>
            </Accordion>
            {/** Loans */}
            <Accordion css={styles.accordion(theme)}>
              <AccordionSummary
                sx={{transform: "none"}}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                {loanNetworth === 0 ? 
                  <Typography variant="h6">Loan Accounts (${loanNetworth})</Typography>
                :
                  // @ts-ignore
                  <Typography variant="h6">Loan Accounts (-${loanNetworth * -1})</Typography>
                }
              </AccordionSummary>
              <AccordionDetails>
                {!!loanAccountsArray.length && (
                  <div className="row">
                    <div className="col" />
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      {loanAccountsArray.map((account, index) => {
                        return (
                          // @ts-ignore
                          <AccountItem key={index} name={account.name.S} balance={account.balance.N} type={account.type.S} />
                        );
                      })}
                    </div>
                    <div className="col" />
                  </div>
                )}
                <div>
                  <Button color="info" variant="contained" onClick={handleNewCreditCardAccount}>{!!loanAccountsArray.length ? "Connect another credit card account" : "Connect a credit card account"}</Button>
                </div>
              </AccordionDetails>
            </Accordion>
            {/** Investments */}
            <Accordion css={styles.accordion(theme)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6">Investment Accounts (${investmentNetworth})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {!!investmentAccountsArray.length && (
                  <div className="row">
                    <div className="col" />
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      {investmentAccountsArray.map((account, index) => {
                        return (
                          // @ts-ignore
                          <AccountItem key={index} name={account.name.S} balance={account.balance.N} type={account.type.S} />
                        );
                      })}
                    </div>
                    <div className="col" />
                  </div>
                )}
                <div>
                  <Button color="info" variant="contained" onClick={handleNewInvestmentAccount}>{!!investmentAccountsArray.length ? "Connect another investment account" : "Connect an investment account"}</Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <SimpleDialog
            open={modalOpen}
            onClose={handleClose}
          />
        </div>
      </Container>
    </>
  );
};

export default Networth;