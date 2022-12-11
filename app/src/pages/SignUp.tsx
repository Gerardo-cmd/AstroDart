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
import createUser from "../utils/Endpoints/CreateUser";

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

const SignUpPage: React.FC = () => {
  const { dispatch } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (password.trim() !== confirmPassword.trim()) {
      setErrorText("Passwords do not match");
      setLoading(false);
      return;
    }

    const data = await createUser(firstName.trim(), lastName.trim(), email.trim().toLowerCase(), password.trim(), confirmPassword.trim());

    if (data === "Email taken") {
      setErrorText("There is already an account registered with this email");
      setLoading(false);
      return;
    }
    if (data === "400") {
      setErrorText("Error: Must fill out all fields");
      setLoading(false);
      return;
    }
    if (data === "500") {
      setErrorText("Error: Something went wrong in the server. Please try again later.");
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
              label="First Name" 
              color="secondary" 
              value={firstName} 
              onChange={(e) => {
                e.preventDefault();
                setErrorText("");
                setFirstName(e.target.value);
              }}
              id="first-name-input" 
              name="firstname" 
            />
          </div>
          <div css={styles.input}>
            <TextField 
              label="Last Name" 
              color="secondary" 
              value={lastName} 
              onChange={(e) => {
                e.preventDefault();
                setErrorText("");
                setLastName(e.target.value);
              }}
              id="last-name-input" 
              name="lastname" 
            />
          </div>
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
              error={errorText === "Passwords do not match"}
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
            <TextField 
              label="Confirm Password" 
              type="password" 
              color="secondary" 
              value={confirmPassword} 
              error={errorText === "Passwords do not match"}
              onChange={(e) => {
                e.preventDefault();
                setErrorText("");
                setConfirmPassword(e.target.value);
              }}
              id="confirm-password-input" 
              name="confirmPassword" 
            />
          </div>
          <div css={styles.input}>
            {loading ? 
              <CircularProgress /> 
              : 
              <Input 
                type="submit" 
                value="Create Account" 
                disabled={ 
                  firstName?.trim() === "" || lastName?.trim() === "" || email?.trim() === "" || password?.trim() === "" || confirmPassword?.trim() === ""} 
              />
            }
          </div>
          <Typography css={styles.error}>{errorText}</Typography>
        </Box>
        <div>
          <div style={{margin: '8px'}}>
            <Button variant="outlined" onClick={() => {navigate("/")}}>Go back</Button>
          </div>
        </div>
      </Paper>
    </Container>
  );
};

export default SignUpPage;