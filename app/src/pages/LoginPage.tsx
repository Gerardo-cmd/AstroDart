/** @jsxImportSource @emotion/react */

import { useState, useContext } from "react";
import { css } from "@emotion/react";
import { 
  Box,
  CircularProgress,
  Container,
  Input,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router';
import Context from "../context";

const styles = {
  container: css({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  }),
  header: css({
    marginBottom: '30px',
  }),
  paper: css({
    border: '3px solid #7c4dff',
    background: 'white',
  }),
  input: css({
    margin: '50px 0px',
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const data = {
      email: email.trim().toLowerCase(),
      password: password.trim()
    };
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      mode: 'cors',
      headers: headers,
      body: JSON.stringify(data),
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 400) {
        throw new Error("400");
      }
      if (response.status === 500) {
        throw new Error("500");
      }
      throw new Error("Unrecongized status code");
    })
    .then(data => {
        console.log('Success:', data);
        if (!!data?.data) {
          dispatch({
            type: "SET_STATE",
            state: {
              userToken: data.data.token,
              email: email.trim().toLowerCase(),
              firstName: data.data.firstName,
              lastName: data.data.lastName,
              checklist: data.data.checklist,
              items: data.data.items,
            },
          });
          setLoading(false);
          navigate("/networth");
        }
        else {
          throw new Error("Invalid credentials");
        }
    })
    .catch((error) => {
      setLoading(false);
      if (error === "400") {
        console.log("Error: We don't have all the necessary information! We need both an email and a password.");
        setErrorText("We don't have all the necessary information! We need both an email and a password.");
        return;
      }
      if (error === "500") {
        console.log("Error: Something went wrong in the server. Please try again later.");
        setErrorText("Something went wrong in the server. Please try again later.");
        return;
      }
      console.error('Error:', error);
      setErrorText("Invalid credentials");
      return;
    });
  }

  return (
    <Container css={styles.container}>
      <Typography variant="h2" css={styles.header}>AstroDart</Typography>
      <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
      <Paper css={styles.paper}>
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
        <Typography css={styles.error}>{errorText}</Typography>
        <div css={styles.input}>
          {loading ? <CircularProgress /> : <Input type="submit" value="Login" disabled={email?.trim() === "" || password?.trim() === ""} />}
        </div>
      </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;