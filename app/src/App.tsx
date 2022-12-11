/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
      main: '#7c4dff',
    },
    secondary: {
      main: '#e040fb',
    },
  },
  typography: {
    body1: {
      color: '#e040fb'
    },
    body2: {
      color: '#e040fb'
    },
    h1: {
      color: '#7c4dff'
    }, 
    h2: {
      color: '#7c4dff'
    },
    h3: {
      color: '#7c4dff'
    },
    h4: {
      color: '#7c4dff'
    },
    h5: {
      color: '#7c4dff'
    }
  }
});

const styles = {
  basicLayout: css({
    background: '#e8eaf6',
    color: 'black',
    minHeight: '100vh'
  }),
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <div css={styles.basicLayout} className="App">
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