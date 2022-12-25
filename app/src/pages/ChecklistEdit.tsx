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
    marginBottom: '10px', 
    textAlign: 'left'
  }),
  input: css({
    margin: '50px 0px',
  })
};

const Checklist = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { email, checklist, userToken, dispatch } = useContext(Context);
  const [isCreating, setIsCreating] = useState<boolean>(false);
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
    setIsCreating(false);
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
      <div className="container" css={styles.container}>
        <div className="container">
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
          {isCreating ? 
            (
              <Paper css={styles.paper}>
                <Checkbox color="success" checked={false} disabled />
                <TextField 
                  color="info" 
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
                  sx={{
                    "& .MuiInputBase-root": {
                        color: theme.typography.body1.color
                    }
                  }} 
                />
                <Button color="info" onClick={handleSave}><CheckIcon /></Button>
                <Button color="info" onClick={() => {
                  setNewAction("");
                  setIsCreating(false);
                }}><DeleteIcon /></Button>
              </Paper>
            ) 
            : 
            ""
          }
          <Button color="info" variant="contained" disabled={isCreating} onClick={() => setIsCreating(true)}>Add</Button>
          <br />
          <br />
          <Button color="info" variant="contained" onClick={handleExit}>Exit</Button>
        </div>
      </div>
    </>
  );
};

export default Checklist;