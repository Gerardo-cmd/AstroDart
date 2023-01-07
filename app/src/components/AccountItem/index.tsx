/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useContext } from 'react';
import { Paper, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Context from "../../context";

type Props = {
  name: string;
  balance: string;
  type: string;
}

const styles = {
  paper: (theme: Theme, lightMode: boolean) => css({
    border: lightMode ? '0.5px solid black' : '0.5px solid white',
    background: theme.palette.primary.main,
    padding: '10px',
    marginBottom: '10px'
  }),
};

const AccountItem: React.FC<Props> = ({ 
  name,
  balance,
  type
}) => {
  const theme = useTheme();
  const { lightMode } = useContext(Context);
  
  const isLiability = type === "credit" || type === "loan";
  const isNegative = isLiability ? "-" : "";
  
  return (
    <>
      <Paper css={styles.paper(theme, lightMode)}>
        <Typography variant="body1">{`${name}: ${isNegative}$${balance}`}</Typography>
      </Paper>
    </>
  )
};

export default AccountItem;