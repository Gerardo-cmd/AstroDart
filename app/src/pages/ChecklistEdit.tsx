/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import Menu from '../components/Menu';
import Context from "../context";
import ChecklistItem from "../components/ChecklistItem";
import { PAGE_TYPES } from '../utils/types';
import updateChecklist from "../utils/Endpoints/UpdateChecklist";
import { getUserChecklist } from "../utils/DataHandlers";
import { 
  Button, 
  Checkbox, 
  Paper, 
  TextField, 
  Typography
} from '@mui/material';

const styles = {
  container: css({
    textAlign: 'center',
  }),
  header: css({
    marginBottom: '30px',
  }),
  paper: css({
    border: '0.5px solid black',
    background: 'white',
    padding: '10px',
    marginBottom: '10px'
  }),
  input: css({
    margin: '50px 0px',
  })
};

const Checklist = () => {
  const navigate = useNavigate();
  const { email, checklist, userToken, dispatch } = useContext(Context);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newAction, setNewAction] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  if (userToken === "") {
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

  const handleSave = async () => {
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

    await updateChecklist(email, newChecklist);

    dispatch({
      type: "SET_STATE",
      state: {
        checklist: newChecklist
      },
    });

    setNewAction("");
    setIsEditing(false);
  };

  const handleDelete = async (itemName: string) => {
    let newChecklist = {};
    const checklistKeys = Object.keys(checklist);
    checklistKeys.forEach((key) => {
      if (key !== itemName) {
        // @ts-ignore
        newChecklist[key] = checklist[key];
      }
    });

    await updateChecklist(email, newChecklist);

    dispatch({
      type: "SET_STATE",
      state: {
        checklist: newChecklist
      },
    });
  };

  const handleExit = () => {
    navigate("/checklist");
  };

  return (
    <>
      <Menu page={PAGE_TYPES.Checklist} />
      <div className="container-sm" css={styles.container}>
        <Typography variant="h4" css={styles.header}>Editing Checklist Items</Typography>
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
        <br />
        <Button variant="contained" onClick={handleExit}>Exit</Button>
      </div>
    </>
  );
};

export default Checklist;