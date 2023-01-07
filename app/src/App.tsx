/** @jsxImportSource @emotion/react */

import React, { useContext } from 'react';
import { css } from '@emotion/react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Theme} from "@mui/material"
import Context from "./context";
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

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#fffffd'
    },
    secondary: {
      main: '#000000' 
    },
    info: {
      main: '#000000'
    }, 
    error: {
      main: '#f53d3d'
    }, 
    background: {
      default: '#f0ece7' 
    }, 
  },
  typography: {
    body1: {
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

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#2f3136'
    },
    secondary: {
      main: '#000000' 
    },
    info: {
      main: '#ffffff'
    }, 
    error: {
      main: '#f53d3d'
    }, 
    background: {
      default: '#202225', 
      paper: '#2f3136'
    }, 
  },
  typography: {
    body1: {
      color: 'white' 
    },
    body2: {
      color: '#adadad'
    },
    h1: {
      color: '#adadad'
    }, 
    h2: {
      color: '#adadad'
    },
    h3: {
      color: '#adadad'
    },
    h4: {
      color: '#adadad'
    },
    h5: {
      color: 'white'
    }, 
    h6: {
      color: '#adadad'
    },
  }
});

const styles = {
  basicLayout: (theme: Theme) => css({
    background: theme.palette.background.default, 
    color: theme.typography.body1.color,
    minHeight: '100vh'
  }),
};

const App: React.FC = () => {
  const { lightMode } = useContext(Context);

  return (
    <ThemeProvider theme={lightMode ? lightTheme : darkTheme}>
      <div css={styles.basicLayout(lightMode ? lightTheme : darkTheme)} className="App">
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