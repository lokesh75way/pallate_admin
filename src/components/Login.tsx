import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";

const LoginContainer = styled(DialogContent)({
  width: "400px",
  margin: "auto",
  marginTop: "10px",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
});
const LoginText = styled(DialogTitle)({
  margin: "1px",
  fontSize: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
const StyledButton = styled(Button)({
  backgroundColor: "#002D62",
  color: "white",
});

const BlueCircularProgress = styled(CircularProgress)({
  color: "blue",
});

interface LoginProps {
  showPopup: boolean;
  onLoginSuccess: () => void;
}

type FormData = {
  username: string;
  password: string;
};

const Login: React.FC<LoginProps> = ({ showPopup, onLoginSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Key to store login status in localStorage
  const LOGIN_STATUS_KEY = "isLoggedIn";

  useEffect(() => {
    const storedStatus = localStorage.getItem(LOGIN_STATUS_KEY);
    const jwtToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (storedStatus === "true" && jwtToken) {
      setIsLoggedIn(true);
      onLoginSuccess(); // Automatically trigger login success if already logged in
    }
  }, [onLoginSuccess]);

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: data.username,
          password: data.password,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setIsLoggedIn(true);

        const token = response.data.token;
        document.cookie = `authToken=${token}; path=/; secure; HttpOnly; SameSite=Strict`;
        onLoginSuccess();
      } else {
        setLoading(false);
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error("Error while logging in:", error);
      setLoading(false);
      setShowSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pallete
          </Typography>

          <Avatar
            alt="User Profile"
            src="/path/to/profile-image.jpg"
            sx={{ marginLeft: 2 }}
          />
        </Toolbar>
      </AppBar>

      <Dialog open={showPopup}>
        <LoginContainer>
          <LoginText>Login</LoginText>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  error={Boolean(errors.username)}
                  helperText={
                    errors.username ? (errors.username.message as string) : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password ? (errors.password.message as string) : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <BlueCircularProgress size={24} color="secondary" />
                  ) : (
                    "Login"
                  )}
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <Snackbar
                  open={showSnackbar}
                  autoHideDuration={3000}
                  onClose={handleSnackbarClose}
                  message="Invalid credentials"
                />
              </Grid>
            </Grid>
          </form>
        </LoginContainer>
      </Dialog>
    </>
  );
};

export default Login;