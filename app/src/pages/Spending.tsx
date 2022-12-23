/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Context from "../context";
import Menu from '../components/Menu';
import TransactionsPieChart from "../components/TransactionsPieChart";
import TransactionsBarChart from "../components/TransactionsBarChart";
import TransactionsTable from "../components/TransactionsTable.tsx";
import { CircularProgress, Container, Typography } from '@mui/material';
import { PAGE_TYPES } from '../utils/types';
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
    marginBottom: '15px',
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
  noAccountsMessage: css({
    marginBottom: '25px'
  }), 
  graph: css({
    marginBottom: '5px',
  })
};

const Spending: React.FC = () => {
  const navigate = useNavigate();
  const { 
    accountsArray, 
    userToken, 
    transactions 
  } = useContext(Context);

  if (userToken === "") {
    navigate("/");
  }

  if (!transactions) {
    return (
      <>
        <Menu page={PAGE_TYPES.Spending} />
        <div css={styles.loadingScreen}> 
          <Typography><CircularProgress color="secondary" /></Typography>
        </div>
      </>
    );
  }

  const userHasNoAccounts = accountsArray.length === 0;

  return (
    <>
      <Menu page={PAGE_TYPES.Spending} />
      <div className="container-lg" css={styles.container}> 
        <Typography variant="h4">Transactions</Typography>
        <br />
        {userHasNoAccounts ? 
          <Typography variant="h5" css={styles.noAccountsMessage}>
            Connect some cash or credit card accounts to see your spending!
          </Typography>
          :
          <div className="row">
          <div className="col-md" css={styles.graph}>
            <TransactionsPieChart />
          </div>
          <div className="col-md" css={styles.graph}>
            <TransactionsBarChart />
          </div>
        </div>
        }
        
        <div css={styles.graph}>
          <TransactionsTable />
        </div>
      </div>
    </>
  );
};

export default Spending;