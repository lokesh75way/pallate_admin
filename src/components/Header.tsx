import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Sidebar from "./Sidebar";
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
import { LOCAL_TOKEN } from "../util/constants";
import { useLocation, useNavigate } from "react-router";

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
  const LOGIN_STATUS_KEY = "isLoggedIn";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
    localStorage.removeItem(LOCAL_TOKEN);
    dispatch(userSignedOut());
    navigate("/login", { state: { from: location.pathname } });
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pallate Admin
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
    </>
  );
};

export default Header;
