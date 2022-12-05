/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useContext } from 'react';
import Menu from '../components/Menu';
import Context from "../context";
import ChecklistItem from "../components/ChecklistItem";
import { PAGE_TYPES } from '../utils/types'
import { 
  Box, 
  Button, 
  Checkbox, 
  Container, 
  Input, 
  Paper, 
  TextField, 
  Typography 
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';

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
    padding: '10px',
    marginBottom: '10px'
  }),
  input: css({
    margin: '50px 0px',
  })
};

type Checklist = Map<string, Map<string, boolean>> | {};

const getUserChecklist = (checklist: Checklist) => {
  const checklistKeys = Object.keys(checklist);
  const userChecklist: Array<Array<any>> = [];
  let index = 0;
  checklistKeys.forEach((key) => {
    // @ts-ignore
    userChecklist[index] = [key, checklist[key]];
    index++;
  });
  return userChecklist;
};


const Checklist = () => {
  const navigate = useNavigate();
  const { email, checklist, userToken, dispatch } = useContext(Context);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newAction, setNewAction] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  if(userToken === "") {
    navigate("/");
  }

  const userChecklist = getUserChecklist(checklist);


  const actionAlreadyExists = () => {
    // @ts-ignore
    if (checklist[`${newAction.trim()}`] === undefined) {
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (newAction.trim().length === 0) {
      setErrorText("Action cannot be empty");
      setHasError(true);
      return;
    }
    if (actionAlreadyExists()) {
      setErrorText("This action already exists");
      setHasError(true);
      return;
    }
    let newChecklist = checklist;
    // @ts-ignore
    newChecklist[`${newAction.trim()}`] = { BOOL: false };
    dispatch({
      type: "SET_STATE",
      state: {
        checklist: newChecklist
      },
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const data = {
      email: email.trim().toLowerCase(),
      checklist: newChecklist
    };

    fetch('http://localhost:5000/api/checklist', {
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
        console.log('Success:', data.msg);
        setIsEditing(false);
    })
    .catch((error) => {
      setIsEditing(false);
      if (error === "400") {
        console.log("Error: We don't have all the necessary information! We need both the email and the checklist.");
        return;
      }
      if (error === "500") {
        console.log("Error: Something went wrong in the server. Please try again later.");
        return;
      }
      console.error('Error:', error);
      return;
    });
  };

  const handleDelete = (itemName: string) => {
    let newChecklist = {};
    const checklistKeys = Object.keys(checklist);
    checklistKeys.forEach((key) => {
      if (key !== itemName) {
        // @ts-ignore
        newChecklist[key] = checklist[key];
      }
    });
    dispatch({
      type: "SET_STATE",
      state: {
        checklist: newChecklist
      },
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const data = {
      email: email.trim().toLowerCase(),
      checklist: newChecklist
    };

    fetch('http://localhost:5000/api/checklist', {
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
        console.log('Success:', data.msg);
        setIsEditing(false);
    })
    .catch((error) => {
      setIsEditing(false);
      if (error === "400") {
        console.log("Error: We don't have all the necessary information! We need both the email and the checklist.");
        return;
      }
      if (error === "500") {
        console.log("Error: Something went wrong in the server. Please try again later.");
        return;
      }
      console.error('Error:', error);
      return;
    });
  };

  const handleExit = () => {
    navigate("/checklist");
  };

  return (
    <>
      <Menu page={PAGE_TYPES.Checklist} />
      <Container css={styles.container}>
        {userChecklist?.map((item) => {
          return (
            <ChecklistItem 
              key={`${item[0]}`} 
              action={item[0]} 
              done={item[1]["BOOL"]}  
              disabled
              onDelete={handleDelete}
            />
          );
        })}
        {isEditing ? 
          (
            <Paper css={styles.paper}>
              <Checkbox checked={false} disabled />
              <TextField
                label="Action"
                error={hasError}
                helperText={errorText}
                multiline
                value={newAction}
                onChange={(e) => {
                  e.preventDefault();
                  setHasError(false);
                  setErrorText("");
                  setNewAction(e.target.value);
                }}
                id="action-input" 
                name="action" 
              />
              <Button onClick={handleSave}><CheckIcon /></Button>
              <Button onClick={() => {
                setNewAction("");
                setIsEditing(false);
              }}><DeleteIcon /></Button>
            </Paper>
          ) 
          : 
          ""
        }
        <Button variant="contained" disabled={isEditing} onClick={() => setIsEditing(true)}>Add</Button>
        <br />
        <Button variant="contained" onClick={handleExit}>Exit</Button>
      </Container>
    </>
  );
};

export default Checklist;