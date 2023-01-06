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
import type { Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import Context from "../context";
import { 
  getAllCategories, 
  getAccountsArray, 
  getCashAccountsArray, 
  getCreditAccountsArray, 
  getLoanAccountsArray, 
  getInvestmentAccountsArray 
} from "../utils/DataHandlers";
import loginUser from "../utils/Endpoints/LoginUser";
import getTransactions from "../utils/Endpoints/GetTransactions";

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
  paper:  () => css({
    border: '0.5px solid black',
    padding: '24px',
    marginBottom: '24px'
  }),
  input: (theme: Theme) => css({
    margin: '24px 0px', 
    color: theme.typography.body2.color 
  }),
  error: css({
    color: 'red',
  })
};

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const { dispatch } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  // TODO: If the user links a duplicate bank account, notify and nothing happens (Need to add account numer and routing number for that?)
  // TODO: Finish styling the app
  // TODO: Make checklist items draggable. Would have to change the keys in db to be index numbers\
  // TODO: Make BE serverless with lambda functons
  // OPTIONAL: Implement email authentication (SendGrid)

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

    const transactionsData: any[] = await getTransactions(email.trim().toLowerCase());
    dispatch({
      type: "SET_STATE",
      state: {
        userToken: data.token,
        email: email.trim().toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        checklist: data.checklist,
        items: data.items,
        networthHistory: data.networthHistory,
        accountsArray: getAccountsArray(data.items),
        cashAccountsArray: getCashAccountsArray(data.items),
        creditAccountsArray: getCreditAccountsArray(data.items),
        loanAccountsArray: getLoanAccountsArray(data.items),
        investmentAccountsArray: getInvestmentAccountsArray(data.items), 
        transactions: transactionsData, 
        monthlySpending: data.monthlySpending, 
        allCategories: getAllCategories(transactionsData, data.monthlySpending)
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
          color="primary" 
          component="form"
          sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div css={styles.input(theme)}>
            <TextField 
              label="Email" 
              color="info" 
              value={email} 
              onChange={(e) => {
                e.preventDefault();
                setErrorText("");
                setEmail(e.target.value);
              }}
              id="email-input" 
              name="email" 
              sx={{
                "& .MuiInputBase-root": {
                    color: theme.typography.body1.color
                }
              }} 
            />
          </div>
          <div css={styles.input(theme)}>
            <TextField 
              label="Password" 
              type="password" 
              color="info" 
              value={password} 
              onChange={(e) => {
                e.preventDefault();
                setErrorText("");
                setPassword(e.target.value);
              }}
              id="password-input" 
              name="password" 
              sx={{
                "& .MuiInputBase-root": {
                    color: theme.typography.body1.color
                }
              }} 
            />
          </div>
          <div css={styles.input(theme)}>
            {loading ? 
              <CircularProgress color="info" /> 
              : 
              <Input 
                color="secondary" 
                type="submit" 
                value="Login" 
                disabled={email?.trim() === "" || password?.trim() === ""} 
                sx={{
                  "& .MuiInputBase-root": {
                      color: theme.typography.body1.color
                  }
                }} 
              />
            }
          </div>
          <Typography color="error">{errorText}</Typography>
        </Box>
        <div>
          <div>
            <Typography>Don't have an account?</Typography>
          </div>
          <div style={{margin: '8px'}}>
            <Button color="info" variant="contained" onClick={() => {navigate("/signup")}}>Sign Up</Button>
          </div>
        </div>
      </Paper>
    </Container>
  );
};

export default LoginPage;