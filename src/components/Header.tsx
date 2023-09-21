import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Avatar, Menu, MenuItem, Box } from "@mui/material";
import { userSignedOut } from "../store/slices/authSlice";
import { LOCAL_TOKEN } from "../util/constants";
import { useLocation, useNavigate } from "react-router";
import { RootState } from "../store/store";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const LOGIN_STATUS_KEY = "isLoggedIn";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pallate Admin
        </Typography>

        <Avatar
          alt={user.name?.toUpperCase() || "A"}
          src="/path/to/profile-image.jpg"
          sx={{ marginLeft: 2, cursor: "pointer" }}
          onClick={handleAvatarClick}
        />
      </Box>
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
