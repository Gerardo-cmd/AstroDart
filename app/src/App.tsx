/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoginPage from './pages/LoginPage';
import Networth from './pages/Networth';
import Spending from './pages/Spending';
import Checklist from './pages/Checklist';
import ChecklistEdit from './pages/ChecklistEdit';


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
    }
  }
});

const styles = {
  basicLayout: css({
    display: 'flex',
    flexWrap: 'wrap',
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
              <Route path="networth" element={<Networth />} />
              <Route path="spending" element={<Spending />} />
              <Route path="checklist" element={<Checklist />} />
              <Route path="checklist/edit" element={<ChecklistEdit />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;