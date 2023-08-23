import React, { FormEvent, useState } from "react";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  CircularProgress,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import { userSignedIn } from "../store/slices/authSlice";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useResetPasswordMutation,
} from "../store/slices/authApiSlice";
import { openAlert } from "../store/slices/alertSlice";

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
const BlueCircularProgress = styled(CircularProgress)({
  color: "#002D62",
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState<number>(0);
  const [newPassword, setNewPassword] = useState("");
  const [emailEntered, setEmailEntered] = useState(false);
  const dispatch = useDispatch();

  // Mutations
  const [resetPassword, { isLoading: loadingReset }] =
    useResetPasswordMutation();
  const [forgotPasswordMutation, { isLoading: loadingForgot }] =
    useForgotPasswordMutation();
  const [loginMutation, { isLoading: loadingLogin }] = useLoginMutation();

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

  //Reseting the password
  const handlePasswordRecoverySubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await resetPassword({
        otp: receivedOtp,
        email: recoveryEmail,
        password: newPassword,
      }).unwrap();

      dispatch(openAlert({ message: response, varient: "success" }));
      setShowResetDialog(false);
    } catch (err) {
      const error = err as ErrorResponse;
      const message =
        error?.message === "Validation error!"
          ? error.data?.errors[0].msg ?? "Something went wrong"
          : error?.message ?? "Something went wrong";

      dispatch(openAlert({ message, varient: "error" }));
    }
  };

  //Sending OTP for forget password
  const handleChangePassword = async () => {
    try {
      const response = await forgotPasswordMutation({
        email: recoveryEmail,
      }).unwrap();

      dispatch(openAlert({ message: response, varient: "success" }));
      setShowResetDialog(true);
    } catch (err) {
      const error = err as ErrorResponse;
      const message =
        error?.message === "Validation error!"
          ? error.data?.errors[0].msg ?? "Something went wrong"
          : error?.message ?? "Something went wrong";

      dispatch(openAlert({ message, varient: "error" }));
    }
  };

  //Log in
  const handleFormSubmit = async (data: FormData) => {
    const { username, password } = data;
    try {
      const response = await loginMutation({
        email: username,
        password,
      }).unwrap();
      dispatch(userSignedIn({ token: response.token, user: response.user }));
      localStorage.setItem("authToken", response.token);
      setIsLoggedIn(true);
      onLoginSuccess();
    } catch (err) {
      const error = err as ErrorResponse;
      const message =
        error?.message === "Validation error!"
          ? error.data?.errors[0].msg ?? "Something went wrong"
          : error?.message ?? "Something went wrong";

      dispatch(openAlert({ message, varient: "error" }));
    }
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
                  disabled={loadingLogin}
                >
                  {loadingLogin ? (
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
            </Grid>
          </form>
        </LoginContainer>
      </Dialog>

      {/* Forget password  */}
      <Dialog open={showRecoveryDialog}>
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
          <form>
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
                  disabled={loadingForgot || !emailEntered}
                  onClick={handleChangePassword}
                >
                  {loadingForgot ? (
                    <BlueCircularProgress size={24} />
                  ) : (
                    "Send OTP"
                  )}
                </StyledButton>
              </Grid>
            </Grid>
          </form>
        </ResetContainer>
      </Dialog>

      {/* Reset password */}
      <Dialog open={showResetDialog} onClose={handleCloseRecoveryDialog}>
        <LoginContainer>
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
          <LoginText>Reset Password</LoginText>

          <form>
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
                  type={showPassword ? "text" : "password"}
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  variant="contained"
                  fullWidth
                  color="primary"
                  disabled={loadingReset || !receivedOtp || !newPassword}
                  onClick={handlePasswordRecoverySubmit}
                >
                  {loadingReset ? (
                    <BlueCircularProgress size={24} />
                  ) : (
                    "Reset Password"
                  )}
                </StyledButton>
              </Grid>
            </Grid>
          </form>
        </LoginContainer>
      </Dialog>
    </>
  );
};

export default Login;
