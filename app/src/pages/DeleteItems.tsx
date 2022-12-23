/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Context from "../context";
import Menu from '../components/Menu';
import DeleteItemModal from "../components/DeleteItemModal";

import { Container, Typography } from '@mui/material';
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
  }),
  unlinkButton: css({
    textTransform: 'none',
  })
};

const DeleteItems: React.FC = () => {
  const navigate = useNavigate();
  const { accountsArray, userToken } = useContext(Context);

  if (userToken === "") {
    navigate("/");
  }

  return (
    <>
      <Menu />
      <Container maxWidth="md" css={styles.container}>
        <Typography>{!!accountsArray.length ? "Click on an account to delete it" : "You don't have any linked accounts"}</Typography>
        <br />
        <div className="row">
          <div className="col" />
          <div className="col-lg-4 col-md-4 col-sm-6">
            {accountsArray.map((account, index) => {
              return (
                <DeleteItemModal 
                  key={index}
                  itemId={account.item_id.S} 
                  accountId={account.accountId.S} 
                  accountName={account.name.S} 
                  accountBalance={account.balance.N}
                  accountType={account.type.S}
                />
              );
            })}
          </div>
          <div className="col" />
        </div>
      </Container>
    </>
  );
};

export default DeleteItems;