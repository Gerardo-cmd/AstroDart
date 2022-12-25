/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useEffect, useContext } from 'react';
import Context from "../../context";
import { Button, Checkbox, Container, Paper, TextField, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import updateChecklist from "../../utils/Endpoints/UpdateChecklist";

type Props = {
  action: string;
  done: boolean;
  disabled?: boolean;
  onDelete?: (action: string) => void; 
  onChange?: (action: string, newValue: boolean) => void;
}

const styles = {
  paper: css({
    border: '0.5px solid black', 
    paddingTop: '10px', 
    paddingBottom: '10px',
    marginBottom: '10px', 
    textAlign: 'left'
  }),
};

const ChecklistItem: React.FC<Props> = ({ 
  action, 
  done, 
  disabled = false, 
  onDelete, 
  onChange 
}) => {
  const theme = useTheme();
  const { email, checklist, userToken, dispatch } = useContext(Context);
  const [updatedAction, setUpdatedAction] = useState<string>(action);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");


  const handleChange = () => {
    if (!onChange) {
      return;
    }
    onChange(action, !done);
  };

  const handleDelete = () => {
    if (!onDelete) {
      return;
    }
    onDelete(action);
  };

  const actionAlreadyExists = () => {
    // @ts-ignore
    return (!checklist[`${updatedAction.trim()}`] === undefined)
  };

  const handleSave = async () => {
    if (updatedAction.trim().length === 0) {
      setErrorText("Action cannot be empty");
      setHasError(true);
      return;
    }
    if (updatedAction === action) {
      setIsEditing(false);
      return;
    }
    if (actionAlreadyExists()) {
      setErrorText("This action already exists");
      setHasError(true);
      return;
    }

    let newChecklist = {};
    const checklistKeys = Object.keys(checklist);
    checklistKeys.forEach((currentAction) => {
      if (action !== currentAction) {
        // @ts-ignore
        newChecklist[`${currentAction}`] = checklist[`${currentAction}`];
      }
    });
    // @ts-ignore
    newChecklist[`${updatedAction.trim()}`] = checklist[`${action}`];

    await updateChecklist(email, newChecklist);

    dispatch({
      type: "SET_STATE",
      state: {
        checklist: newChecklist
      },
    });

    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Paper css={styles.paper} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Checkbox color="success" checked={done} disabled />
        <TextField 
          color="info" 
          label="Action"
          error={hasError}
          helperText={errorText}
          multiline
          value={updatedAction}
          onChange={(e) => {
            e.preventDefault();
            setHasError(false);
            setErrorText("");
            setUpdatedAction(e.target.value);
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
          setUpdatedAction("");
          setIsEditing(false);
        }}><DeleteIcon /></Button>
      </Paper>
    )
  }



  return !!onDelete ? 
    (
      <>
        <Paper className="row" css={styles.paper} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="col-md col-2">
            <Button color="info" onClick={() => setIsEditing(true)}>
              <EditIcon />
            </Button>
            <Button color="info" onClick={handleDelete}>
              <DeleteIcon />
            </Button>
          </div>
          <Checkbox className="col-md col-2" color="info" checked={done} disabled={disabled} onChange={handleChange} />
          <Typography className="col-md col-6">
            {action}
          </Typography>
          <div className="col-lg" />
          <div className="col-lg" />
          <div className="col-lg" />
          <div className="col-lg" />
          <div className="col-lg" />
        </Paper>
      </>
    )
    :
    (
      <>
        <Paper className="row" css={styles.paper}>
          <Checkbox className="col-sm" color="info" checked={done} disabled={disabled} onChange={handleChange} />
          <Typography className="col-sm">{action}</Typography>
          <div className="col-sm" />
          <div className="col-sm" />
        </Paper>
      </>
    )  
};

export default ChecklistItem;