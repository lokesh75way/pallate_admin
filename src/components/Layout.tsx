import React, { useState, useEffect, PropsWithChildren } from "react";
import Login from "./Login";
import Header from "./Header";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { userSignedIn } from "../store/slices/authSlice";

const useStyles = makeStyles({
  blurBg: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    zIndex: 1000,
  },
});

const Layout: React.FC<PropsWithChildren> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const classes = useStyles();
  const { authenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const checkLoginStatus = () => {
    const localToken = localStorage.getItem("authToken");
    if (!authenticated && !localToken) return false;
    else if (!authenticated && localToken) {
      dispatch(
        userSignedIn({
          token: localToken,
          user: { email: "", role: "", name: "", _id: "" },
        })
      );
      return true;
    }
    return true;
  };
  const [blur, setBlur] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      setBlur(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const userLoggedIn = checkLoginStatus();
    setIsLoggedIn(userLoggedIn);

    setShowLoginPopup(!userLoggedIn);
  }, [isLoggedIn, showLoginPopup]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginPopup(false);
  };

  // if (loadingApp) return <></>;

  return (
    <>
      <Header />
      {showLoginPopup && blur ? (
        <>
          <div className={classes.blurBg} />
          <Login
            showPopup={showLoginPopup}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      ) : (
        <div style={{ padding: "10px" }}>{props.children}</div>
      )}
    </>
  );
};
export default Layout;
