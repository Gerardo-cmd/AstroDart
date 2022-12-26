/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import * as React from 'react';
import { 
  AppBar, 
  Box, 
  Button, 
  ClickAwayListener, 
  Divider, 
  Drawer, 
  Grow, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  MenuItem, 
  MenuList, 
  Paper, 
  Popper, 
  Switch, 
  Toolbar, 
  Typography 
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
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

const Menu: React.FC<Props> = ({ page, window }) => {
  const theme = useTheme();
  const { email, lightMode, dispatch } = useContext(Context);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSettingClick = (event: Event | React.SyntheticEvent) => {
    handleClose(event);
    navigate("/settings");
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
          <ListItem key="networth" disablePadding>
            <ListItemButton 
              color="info"
              sx={{ textAlign: 'center' }} 
              disabled={page?.toLowerCase() === "networth"} 
              onClick={() => navigate("/networth")}
            >
              <ListItemText primary={<><AccountBalanceIcon />&nbsp;Networth</>} /> 
            </ListItemButton>
          </ListItem>
          <ListItem key="spending" disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center' }} 
              disabled={page?.toLowerCase() === "spending"} 
              onClick={() => navigate("/spending")}
            >
              <ListItemText primary={<><CreditCardIcon />&nbsp;Spending</>} /> 
              
            </ListItemButton>
          </ListItem>
          <ListItem key="checklist" disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center' }} 
              disabled={page?.toLowerCase() === "checklist"} 
              onClick={() => navigate("/checklist")}
            >
              <ListItemText primary={<><ListAltIcon />&nbsp;Checklist</>} /> 
            </ListItemButton>
          </ListItem>
          <ListItem key="settings" disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center' }} 
              disabled={page?.toLowerCase() === "settings"}  
              onClick={() => navigate("/settings")}
            >
              <ListItemText primary={<><SettingsIcon />&nbsp;Settings</>} /> 
            </ListItemButton>
          </ListItem>
          <ListItem key="logout" disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center' }} 
              onClick={logout}
            >
              <ListItemText primary={<><LogoutIcon />&nbsp;Logout</>} /> 
            </ListItemButton>
          </ListItem>
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
            <Button 
              sx={{ color: theme.palette.info.main}}
              key="networth" 
              disabled={page?.toLowerCase() === "networth"} 
              onClick={() => navigate("/networth")}
            >
              <AccountBalanceIcon />&nbsp;Networth 
            </Button>
            <Button 
              sx={{ color: theme.palette.info.main}}
              key="spending" 
              disabled={page?.toLowerCase() === "spending"} 
              onClick={() => navigate("/spending")}
            >
              <CreditCardIcon />&nbsp;Spending
            </Button>
            <Button 
              sx={{ color: theme.palette.info.main}}
              key="checklist" 
              disabled={page?.toLowerCase() === "checklist"} 
              onClick={() => navigate("/checklist")}
            >
              <ListAltIcon />&nbsp;Checklist
            </Button>
            <Button
              ref={anchorRef}
              color="info" 
              id="composition-button"
              aria-controls={open ? 'composition-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <SettingsIcon />
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                      >
                        &nbsp;
                        &nbsp;
                        {lightMode ? <LightModeIcon sx={{paddingLeft: '3px'}} color="info" /> : <DarkModeIcon sx={{paddingLeft: '3px'}} color="info" />}&nbsp;
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
                          
                        <MenuItem disabled={page?.toLowerCase() === "settings"}  onClick={handleSettingClick}><AdminPanelSettingsIcon />&nbsp;Account Settings</MenuItem>
                        <MenuItem onClick={logout}><LogoutIcon />&nbsp;Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
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
