/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { 
  Container,
  Paper,
  TextField,
  Typography
 } from '@mui/material';

 const styles = {
  container: css({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    color: 'white',
  }),
  header: css({
    marginBottom: '30px',
  }),
  paper: css({
    border: '3px solid #7c4dff',
    background: 'white',
    color: 'white',
  }),
  input: css({
    margin: '50px 0px',
  })
 }

const LoginPage = () => {
  return (
    <Container css={styles.container}>
      <Typography variant="h2" css={styles.header}>AstroDart</Typography>
      <Paper css={styles.paper}>
        <div css={styles.input}>
          <TextField label="Email" color="secondary" id="email-input" />
        </div>
        <div css={styles.input}>
          <TextField label="Password" color="secondary" id="password-input" />
        </div>
      </Paper>
    </Container>
  );
};

export default LoginPage;