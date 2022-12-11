/** @jsxImportSource @emotion/react */

import { useState, useContext } from "react";
import { css } from "@emotion/react";
import { 
  Box,
  Button, 
  CircularProgress,
  Container,
  Input, 
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router';
import Context from "../context";
import { getAccountsArray } from "../utils/DataHandlers";
import loginUser from "../utils/Endpoints/LoginUser";

const styles = {
  container: css({
    paddingTop: '4rem',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  }),
  header: css({
    marginBottom: '24px',
  }),
  paper: css({
    border: '3px solid #7c4dff',
    background: 'white',
    padding: '24px',
    marginBottom: '24px'
  }),
  input: css({
    margin: '24px 0px',
  }),
  error: css({
    color: 'red',
  })
};

const LoginPage: React.FC = () => {
  const { dispatch } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  // TODO: - Implement google charts in networth page (Pie chart)
  // TODO: - Implement editing for checklist
  // TODO: - Make Edit/Add Checklist a sticky footer
  // TODO: - Do schema for spendng data in dynamodb
  // TODO: - Create spending endpoints 
  // TODO: - Implement the Spending page
  // TODO: - Finish styling the app
  // TODO: - Implement email authentication (SendGrid)

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const data = await loginUser(email.trim().toLowerCase(), password.trim());

    if (data === "400") {
      setErrorText("Error: Need both email and password");
      setLoading(false);
      return;
    }
    if (data === "500") {
      setErrorText("Error: Something went wrong in the server. Please try again later.");
      setLoading(false);
      return;
    }
    if (data === "Invalid credentials") {
      setErrorText("Invalid credentials");
      setLoading(false);
      return;
    }

    dispatch({
      type: "SET_STATE",
      state: {
        userToken: data.token,
        email: email.trim().toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        checklist: data.checklist,
        items: data.items,
        accountsArray: getAccountsArray(data.items),
      },
    });
    setLoading(false);
    navigate("/networth");
  }

  return (
    <Container css={styles.container}>
      <Typography variant="h2" css={styles.header}>AstroDart</Typography>
      <Paper css={styles.paper}>
        <Box
          component="form"
          sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div css={styles.input}>
            <TextField 
              label="Email" 
              color="secondary" 
              value={email} 
              onChange={(e) => {
                e.preventDefault();
                setErrorText("");
                setEmail(e.target.value);
              }}
              id="email-input" 
              name="email" 
            />
          </div>
          <div css={styles.input}>
            <TextField 
              label="Password" 
              type="password" 
              color="secondary" 
              value={password} 
              onChange={(e) => {
                e.preventDefault();
                setErrorText("");
                setPassword(e.target.value);
              }}
              id="password-input" 
              name="password" 
            />
          </div>
          <div css={styles.input}>
            {loading ? 
              <CircularProgress /> 
              : 
              <Input 
                type="submit" 
                value="Login" 
                disabled={email?.trim() === "" || password?.trim() === ""} 
              />
            }
          </div>
          <Typography css={styles.error}>{errorText}</Typography>
        </Box>
        <div>
          <div>
            <Typography>Don't have an account?</Typography>
          </div>
          <div style={{margin: '8px'}}>
            <Button variant="outlined" onClick={() => {navigate("/signup")}}>Sign Up</Button>
          </div>
        </div>
      </Paper>
    </Container>
  );
};

export default LoginPage;