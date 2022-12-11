/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import Context from "../context";
import Menu from '../components/Menu';
import DeleteUserModal from "../components/DeleteUserModal";
import { PAGE_TYPES } from '../utils/types'

const Settings = () => {
  const navigate = useNavigate();
  const { accounts, email, items, userToken, dispatch } = useContext(Context);

  if (userToken === "") {
    navigate("/");
  }

  const styles = {
    deleteButton: css({
      background: 'red',
      color: 'white',
    }),
    container: css({
      textAlign: 'center'
    }),
  };

  return (
    <>
      <Menu page={PAGE_TYPES.Settings} />
      <div className="container" css={styles.container}>
        <div>
          <Button variant="contained" onClick={() => navigate("/deleteItems")}>Unlink Accounts</Button>
        </div>
        <br />
        <div>
          <DeleteUserModal />
        </div>
      </div>
    </>
  );
};

export default Settings;