/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Context from "../context";
import Menu from '../components/Menu';
import DeleteUserModal from "../components/DeleteUserModal";
import { PAGE_TYPES } from '../utils/types'

const Settings = () => {
  const navigate = useNavigate();
  const { lightMode, userToken, dispatch } = useContext(Context);

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
    header: css({
      marginBottom: '30px',
    }),
  };

  const handleModeChange = () => {
    dispatch({
      type: 'SET_STATE',
      state: {
        lightMode: !lightMode
      }
    });
  };

  return (
    <>
      <Menu page={PAGE_TYPES.Settings} />
      <div className="container" css={styles.container}>
        <Typography variant="h4" css={styles.header}>Settings</Typography>
        <div>
          <Button color="info" variant="contained" onClick={() => navigate("/deleteItems")}>Unlink Accounts</Button>
        </div>
        <br />
        <div>
          <DeleteUserModal />
        </div>
        <br />
        <div>
          <Button color="info" variant="contained" onClick={handleModeChange}>Change mode</Button>
        </div>
      </div>
    </>
  );
};

export default Settings;