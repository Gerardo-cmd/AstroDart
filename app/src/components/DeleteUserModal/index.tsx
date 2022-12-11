/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useState, useContext } from 'react';
import Context from "../../context";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  TextField, 
  Typography 
} from '@mui/material';

import { useNavigate } from 'react-router';
import deleteUser from "../../utils/Endpoints/DeleteUser";

type SimpleDialogProps = {
  open: boolean;
  onClose: () => void;
};

const styles = {
  input: css({
    margin: '50px 0px',
  }),
  error: css({
    justoiyContent: 'center',
    color: 'red',
    textAlignment: 'center'
  }),
  unlinkButton: css({
    textTransform: 'none',
  }),
  popupModal: css({
    justifyContent: 'center',
    verticalAlignment: 'center',
    textAlignment: 'center'
  }),
  deleteButton: css({
    background: 'red',
    color: 'white',
  }),
};

const SimpleDialog: React.FC<SimpleDialogProps> = ({ onClose, open }) => {
  const navigate = useNavigate();
  const { email } = useContext(Context);
  const [password, setPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const handleClose = () => {
    setErrorText("")
    onClose();
  };

  const handleDeletion = async () => {
    const result = await deleteUser(email, password.trim());
    if (result === "400") {
      setErrorText("Error: Make sure to type in your password");
      return;
    }
    else if (result === "500") {
      setErrorText("Error: Something went wrong in the server. Please try again later.");
      return;
    }
    else if (result === "Invalid credentials") {
      setErrorText("Invalid credentials");
      return;
    }
    else if (result === "There is not an accont registered with this email") {
      setErrorText("There is not an accont registered with this email");
      return;
    }
    // Close modal
    onClose();
    navigate("/");
    return;
  }

  return (
    <Dialog css={styles.popupModal} onClose={handleClose} open={open}>
      <DialogTitle>You are about to delete your account. This cannot be undone. To confirm, enter your password and click below.</DialogTitle>
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
      <Typography css={styles.error}>{errorText}</Typography>
      <Button color="error" disabled={password.trim() === ""} onClick={handleDeletion}>Delete my account</Button>
    </Dialog>
  );
}

const DeleteUserModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button 
        variant="contained" 
        onClick={handleClickOpen} 
        css={styles.deleteButton}
      >
        Delete Account
      </Button>
      <SimpleDialog
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};

export default DeleteUserModal;