import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import Login from "./Login";
import { useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { userSignedOut } from "../store/slices/authSlice";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.dark,
  zIndex: 1300,
  width: "100%",
  color: theme.palette.common.white,
  height: "57px",
}));

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const LOGIN_STATUS_KEY = "isLoggedIn";
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

  const handleLogoutConfirmation = () => {
    localStorage.setItem(LOGIN_STATUS_KEY, "false");
    localStorage.removeItem("authToken");
    dispatch(userSignedOut());

    setShowLoginPopup(true);
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pallate
          </Typography>

          <Avatar
            alt="Admin"
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
        <MenuItem onClick={handleLogoutConfirmation}>
          <Typography textAlign="center" color="white">
            Logout
          </Typography>
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
          <Login
            showPopup={true}
            onLoginSuccess={() => setShowLoginPopup(false)}
          />
        </>
      )}
    </>
  );
};

export default Header;
