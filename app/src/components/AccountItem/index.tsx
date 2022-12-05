/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import {Paper, Typography } from '@mui/material';

type Props = {
  name: string;
  balance: string;
}

const styles = {
  paper: css({
    border: '3px solid #7c4dff',
    background: 'white',
    padding: '10px',
    marginBottom: '10px'
  }),
};

const AccountItem: React.FC<Props> = ({ 
  name,
  balance
}) => {

  return (
    <>
      <Paper css={styles.paper}>
        <Typography variant="body1">{`${name}: $${balance}`}</Typography>
      </Paper>
    </>
  )
};

export default AccountItem;