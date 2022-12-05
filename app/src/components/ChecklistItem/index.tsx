/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useEffect, useContext } from 'react';
import Context from "../../context";
import { Button, Checkbox, Container, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  action: string;
  done: boolean;
  disabled?: boolean;
  onDelete?: (action: string) => void;
  onChange?: (action: string, newValue: boolean) => void;
}

const styles = {
  paper: css({
    border: '3px solid #7c4dff',
    background: 'white',
    padding: '10px',
    marginBottom: '10px'
  }),
};

const ChecklistItem: React.FC<Props> = ({ 
  action, 
  done, 
  disabled = false, 
  onDelete, 
  onChange 
}) => {
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



  return !!onDelete ? 
    (
      <>
        <Paper className="row" css={styles.paper}>
          <Checkbox className="col-sm" checked={done} disabled={disabled} onChange={handleChange} />
          <Typography variant="body2" className="col-sm">{action}<Button onClick={handleDelete}><DeleteIcon /></Button></Typography>
          <div className="col-sm" />
        </Paper>
      </>
    )
    :
    (
      <>
        <Paper className="row" css={styles.paper}>
          <Checkbox className="col-sm" checked={done} disabled={disabled} onChange={handleChange} />
          <Typography className="col-sm">{action}</Typography>
          <div className="col-sm" />
        </Paper>
      </>
    )  
};

export default ChecklistItem;