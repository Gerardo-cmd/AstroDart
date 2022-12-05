/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useEffect, useContext } from 'react';
import Menu from '../components/Menu';
import Context from "../context";
import ChecklistItem from "../components/ChecklistItem";
import { PAGE_TYPES } from '../utils/types'
import { Box, Button, Container, Paper, Typography } from '@mui/material';
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

  if(userToken === "") {
    navigate("/");
  }

  const userChecklist = getUserChecklist(checklist);

  const handleChange = (itemName: string, newValue: boolean) => {
    let newChecklist = checklist;
    // @ts-ignore
    newChecklist[itemName] = { BOOL: newValue };
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
      checklist
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
    })
    .catch((error) => {
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
                onChange={handleChange}
              />
            );
          })}
          <Button variant="contained" onClick={() => navigate("/checklist/edit")}>Edit</Button>
        </Container>
    </>
  );
};

export default Checklist;