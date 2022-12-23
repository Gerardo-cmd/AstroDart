/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import {Paper, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'

type Props = {
  name: string;
  balance: string;
  type: string;
}

const styles = {
  paper: (theme: Theme) => css({
    border: '0.5px solid black',
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
  const isLiability = type === "credit" || type === "loan";
  const isNegative = isLiability ? "-" : "";
  
  return (
    <>
      <Paper css={styles.paper(theme)}>
        <Typography variant="body1">{`${name}: ${isNegative}$${balance}`}</Typography>
      </Paper>
    </>
  )
};

export default AccountItem;