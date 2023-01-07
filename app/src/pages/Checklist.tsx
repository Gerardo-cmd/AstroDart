/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { Button, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Menu from '../components/Menu';
import Context from "../context";
import ChecklistItem from "../components/ChecklistItem";
import { PAGE_TYPES } from '../utils/types'
import { getUserChecklist } from "../utils/DataHandlers";
import updateChecklist from "../utils/Endpoints/UpdateChecklist";

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
  }),
  input: css({
    margin: '50px 0px',
  }),
  noItemsMessage: css({
    marginBottom: '12px'
  }), 
  stickyFooter: (theme: Theme) => css({
    display: 'flex', 
    position: 'sticky',
    bottom: 0,
    zIndex: 9, 
    padding: '20px', 
    justifyContent: 'center',
    alignItems: 'center', 
    width: '200px', 
    marginLeft: 'auto', 
    marginRight: 'auto', 
    background: theme.palette.background.default, 
    borderLeft: `0.25px solid ${theme.palette.info.main}`, 
    borderRight: `0.25px solid ${theme.palette.info.main}`, 
    borderTop: `0.25px solid ${theme.palette.info.main}`
  }),
  footerButton: css({
    margin: '0px 10px', 
    width: '40px',
    height: '30px'
  })
};

const Checklist = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { email, checklist, userToken, dispatch } = useContext(Context);

  if(userToken === "") {
    navigate("/");
  }

  const userChecklist = getUserChecklist(checklist);

  const handleChange = async (itemName: string, newValue: boolean) => {
    let newChecklist = checklist;
    // @ts-ignore
    newChecklist[itemName] = { BOOL: newValue };

    const data = await updateChecklist(email, newChecklist);
    dispatch({
      type: "SET_STATE",
      state: {
        checklist: newChecklist
      },
    });
  };

  return (
    <>
      <Menu page={PAGE_TYPES.Checklist} />
        <div className="container" css={styles.container}>
          <div className="container">
            <Typography variant="h3" css={styles.header}>Checklist</Typography>
            {!userChecklist.length && <Typography css={styles.noItemsMessage}>You don't have any items in your checklist. Click on "Edit" below to add some!</Typography>}
            {userChecklist?.map((item) => {
              return (
                <ChecklistItem 
                  key={`${item[0]}`} 
                  action={item[0]} 
                  done={item[1]["BOOL"]}
                  onChange={handleChange}
                />
              );
            })}
            <Paper css={styles.stickyFooter(theme)}>
              <Button css={styles.footerButton} color="info" variant="contained" onClick={() => navigate("/checklist/edit")}><EditIcon sx={{fontSize: 'medium'}} />&nbsp;Edit&nbsp;</Button>
            </Paper>
          </div>
        </div>
    </>
  );
};

export default Checklist;