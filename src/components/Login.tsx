import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useLoginMutation } from "../services/userApi";
import MuiAlert from "@mui/material/Alert";

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../services/userApi"; 

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
const ResetContainer = styled(DialogContent)({
  width: "365px",
  margin: "auto",

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
const StyledButtonForget = styled(Button)({
  marginTop: "20px",
  marginLeft: "120px",
  color: "#002D62",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
const StyledButtonReset = styled(Button)({
  backgroundColor: "#002D62",

  marginLeft: "110px",
  color: "white",
});
const DialogBox = styled(Dialog)({
  width: "80%",
});
const BlueCircularProgress = styled(CircularProgress)({
  color: "#002D62",
});
const MuiAlertOtp = styled(MuiAlert)({
  backgroundColor: "#002D62",
  color: "white",
  zIndex: "1500",
  marginLeft: "530px",
  marginTop: "-900px",
});
const MuiAlertReset = styled(MuiAlert)({
  backgroundColor: "#002D62",
  color: "white",
  zIndex: "1500",
  marginLeft: "500px",
  marginTop: "-900px",
});
const MuiAlertUser = styled(MuiAlert)({
  marginLeft: "550px",
  marginTop: "-750px",
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
  const [showSnackbarOtp, setShowSnackbarOtp] = useState(false);
  const [showSnackbarReset, setShowSnackbarReset] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState<number>(0);
  const [newPassword, setNewPassword] = useState("");
  const [emailEntered, setEmailEntered] = useState(false);

  // Mutations
  const [resetPassword, { isLoading, isError }] = useResetPasswordMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [loginMutation] = useLoginMutation();

  const handleOpenRecoveryDialog = () => {
    setShowRecoveryDialog(true);
  };

  const handleCloseRecoveryDialog = () => {
    setShowRecoveryDialog(false);
    setShowResetDialog(false);
  };

  const handleRecoveryEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecoveryEmail(event.target.value);
    setEmailEntered(!!event.target.value);
  };

  const handlePasswordRecoverySubmit = async () => {
    setShowSnackbarReset(true);
    try {
      const response = await resetPassword({
        otp: receivedOtp,
        email: recoveryEmail,
        password: newPassword,
      });

      setShowResetDialog(false);
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };
  const handleSnackbar = () => {
    setShowSnackbarReset(true);
  };

  const handlePasswordResetSubmit = async () => {
    setShowResetDialog(false);
  };
  const handleChangePassword = async () => {
    setLoading(true);
    const response = await forgotPasswordMutation({
      email: recoveryEmail,
    });
    console.log(response);
    setLoading(false);

    if ("error" in response) {
      setUserNotFound(true);
    } else {
      setShowSnackbarOtp(true);
      setShowResetDialog(true);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await loginMutation({
        email: data.username,
        password: data.password,
      });


      if ("data" in response) {
        setLoading(false);
        setIsLoggedIn(true);
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
    setShowSnackbarOtp(false);
    setShowSnackbarReset(false);
    setUserNotFound(false);
  };

  if (isLoggedIn) {
    return null;
  }
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

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
          <Snackbar
            open={showSnackbarReset}
            // autoHideDuration={2000}
            onClose={handleSnackbarClose}
          >
            <MuiAlertReset onClose={handleSnackbarClose} variant="filled">
              Password reset successfully
            </MuiAlertReset>
          </Snackbar>
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
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password ? (errors.password.message as string) : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    ),
                  }}
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
                <StyledButtonForget
                  color="primary"
                  onClick={handleOpenRecoveryDialog}
                >
                  Forgot Password
                </StyledButtonForget>
              </Grid>
              <Grid item xs={12}>
                <Snackbar
                  open={showSnackbar}
                  autoHideDuration={3000}
                  onClose={handleSnackbarClose}
                  message={`${process.env.REACT_APP_AUTH_ERROR_MESSAGE}`}
                />
              </Grid>
            </Grid>
          </form>
        </LoginContainer>
      </Dialog>

      {/* Forget password  */}
      <Dialog open={showRecoveryDialog} onClose={handleCloseRecoveryDialog}>
        <ResetContainer>
            <DialogTitle
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative", 
            }}
          >
            <IconButton
              edge="end"
              color="inherit"
              aria-label="close"
              onClick={handleCloseRecoveryDialog}
              style={{ position: "absolute", right: 0, top: 0 }} 
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <LoginText>Forgot Password</LoginText>
          <form onSubmit={handlePasswordResetSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={recoveryEmail}
                  onChange={handleRecoveryEmailChange}
                />
              </Grid>

              <Grid item xs={12}>
                <StyledButton
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading || !emailEntered}
                  onClick={handleChangePassword}
                >
                  {loading ? (
                    <BlueCircularProgress size={24} color="secondary" />
                  ) : (
                    "Send OTP"
                  )}
                </StyledButton>
              </Grid>
              {userNotFound && (
                <Snackbar
                  open={userNotFound}
                  autoHideDuration={3000}
                  onClose={handleSnackbarClose}
                >
                  <MuiAlertUser
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                  >
                    User not found!
                  </MuiAlertUser>
                </Snackbar>
              )}
            </Grid>
          </form>
        </ResetContainer>
      </Dialog>

      {/* Reset password */}
      <Dialog open={showResetDialog} onClose={handleCloseRecoveryDialog}>
        <LoginContainer>
          <Snackbar
            open={showSnackbarReset}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
          >
            <MuiAlertReset onClose={handleSnackbarClose} variant="filled">
              Password reset successfully
            </MuiAlertReset>
          </Snackbar>
          <Snackbar
            open={showSnackbarOtp}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
          >
            <MuiAlertOtp onClose={handleSnackbarClose} variant="filled">
              OTP sent successfully
            </MuiAlertOtp>
          </Snackbar>
          <DialogTitle
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative", 
            }}
          >
            <IconButton
              edge="end"
              color="inherit"
              aria-label="close"
              onClick={handleCloseRecoveryDialog}
              style={{ position: "absolute", right: 0, top: 10 }} 
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
            <LoginText>Forgot Password</LoginText>

          <form onSubmit={handlePasswordRecoverySubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Enter OTP"
                  value={receivedOtp || ""}
                  onChange={(e) => setReceivedOtp(Number(e.target.value))}
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={recoveryEmail}
                  onChange={handleRecoveryEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButtonReset
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Reset Password
                </StyledButtonReset>
              </Grid>
            </Grid>
          </form>
        </LoginContainer>
      </Dialog>
    </>
  );
};

export default Login;