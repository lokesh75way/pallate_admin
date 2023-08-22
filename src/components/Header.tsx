import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import Login from "./Login"; 
import { useDispatch } from 'react-redux';
import {logout } from '../store/authReducer';

import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";


const StyledAppBar = styled(AppBar)(({theme})=>({
  background: theme.palette.primary.dark,
  zIndex: 1300,
  width: "100%",
  color: theme.palette.common.white,
  height: "57px",
})
);

const StyledButton = styled(Button)(({theme})=>({
  backgroundColor:theme.palette.primary.dark,
  color:'white',
  margin:'10px',
 
})
)

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false); 
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); 
  const LOGIN_STATUS_KEY = "isLoggedIn";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirmation = (confirmed: boolean) => {
    setShowLogoutConfirmation(false);
    if (confirmed) {
      localStorage.setItem(LOGIN_STATUS_KEY, "false");
      dispatch(logout());

      setShowLoginPopup(true);
    }
    navigate("/")
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
         

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Palette
          </Typography>

          <Avatar
            alt="User Profile"
            src="/path/to/profile-image.jpg"
            sx={{ marginLeft: 2, cursor: "pointer" }}
            onClick={handleAvatarClick}
          />
        </Toolbar>
      </StyledAppBar>

      <Sidebar onClose={handleSidebarClose} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            backgroundColor: "#002D62",
          },
        }}
      >
        <MenuItem onClick={handleLogout}>
          <Typography textAlign="center" color='white'>Logout</Typography>
        </MenuItem>
      </Menu>

      {showLoginPopup && (
        <>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
          }}
        />
        <Login showPopup={true} onLoginSuccess={() => setShowLoginPopup(false)} />
      </>
        
      )}

      <Dialog open={showLogoutConfirmation} onClose={() => handleLogoutConfirmation(false)}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogContent>
          
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => handleLogoutConfirmation(false)} variant="contained">
            Cancel
          </StyledButton>
          <StyledButton onClick={() => handleLogoutConfirmation(true)} variant="contained">
            Logout
          </StyledButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;