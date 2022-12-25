/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import * as React from 'react';
import { 
  AppBar, 
  Box, 
  Button, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Switch, 
  Toolbar, 
  Typography 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '@mui/material/styles';

import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import Context from "../../context";

type Props = {
  page?: string;
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = ['Networth', 'Spending', 'Checklist', 'Settings', 'Logout'];

const Menu: React.FC<Props> = ({ page, window }) => {
  const theme = useTheme();
  const { email, lightMode, dispatch } = useContext(Context);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    dispatch({
      type: "RESET_STATE",
      state: {
        email: email
      }
    });
    navigate("/");
  };

  const drawer = (
    <>
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', background: theme.palette.primary.main }}>
        <Typography variant="h5" sx={{ my: 2 }}>
          AstroDart
        </Typography>
        <Divider />
        <List>
          {navItems.map((item: string, index: number) => {
            return (
              <div>
                <ListItem key={item} disablePadding>
                  <ListItemButton 
                    sx={{ textAlign: 'center' }} 
                    disabled={page?.toLowerCase() === item.toLowerCase()} 
                    onClick={item === "Logout" ? logout : () => navigate(`/${item.toLowerCase()}`)}
                  >
                    <ListItemText primary={item} />
                  </ListItemButton>
                </ListItem>
              </div>
            );
          })}
        </List>
      </Box>
      <Box sx={{ textAlign: 'center', background: theme.palette.primary.main, minHeight: '100vh' }}>
        <List>
          <ListItem key="switch" disablePadding>
            <ListItemButton sx={{ textAlign: 'center', justifyContent: 'center', color: theme.palette.info.main}}>
              {lightMode ? <LightModeIcon /> : <DarkModeIcon />}
              <Switch 
                color="error"
                checked={ lightMode } 
                onClick={() => {
                  dispatch({
                    type: 'SET_STATE',
                    state: {
                      lightMode: !lightMode
                    }
                  });
                }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            AstroDart
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button 
                sx={{ color: theme.palette.info.main}}
                key={item} 
                disabled={page?.toLowerCase() === item.toLowerCase()} 
                onClick={item === "Logout" ? logout : () => navigate(`/${item.toLowerCase()}`)}
              >
                {item}
              </Button>
            ))}
            <Switch 
              color="error" 
              checked={ lightMode } 
              onClick={() => {
                dispatch({
                  type: 'SET_STATE',
                  state: {
                    lightMode: !lightMode
                  }
                });
              }} 
            />
            {lightMode ? <LightModeIcon /> : <DarkModeIcon />}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
};

export default Menu;
