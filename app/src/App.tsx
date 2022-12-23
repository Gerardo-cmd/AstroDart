/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Theme, useTheme } from "@mui/material"
import LoginPage from './pages/LoginPage';
import Networth from './pages/Networth';
import Spending from './pages/Spending';
import Checklist from './pages/Checklist';
import ChecklistEdit from './pages/ChecklistEdit';
import Settings from './pages/Settings';
import SignUp from './pages/SignUp';
import DeleteItems from './pages/DeleteItems';


import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: '#fffffd'
    },
    secondary: {
      // main: '#FBF4E2'
      main: '#f0ece7' 
    },
  },
  typography: {
    body1: {
      // color: '#024bc2'
      color: 'black' 
    },
    body2: {
      color: 'black'
    },
    h1: {
      color: 'black'
    }, 
    h2: {
      color: 'black'
    },
    h3: {
      color: 'black'
    },
    h4: {
      color: 'black'
    },
    h5: {
      color: 'black'
    }, 
    h6: {
      color: 'black'
    },
  }
});

const styles = {
  basicLayout: (theme: Theme) => css({
    // background: '#e8eaf6',
    background: theme.palette.secondary.main, 
    color: 'black',
    minHeight: '100vh'
  }),
};

const App: React.FC = () => {
  // const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <div css={styles.basicLayout(theme)} className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<LoginPage />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="networth" element={<Networth />} />
              <Route path="spending" element={<Spending />} />
              <Route path="checklist" element={<Checklist />} />
              <Route path="checklist/edit" element={<ChecklistEdit />} />
              <Route path="settings" element={<Settings />} />
              <Route path="deleteItems" element={<DeleteItems />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;