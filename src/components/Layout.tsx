import React, { useState, useEffect, PropsWithChildren } from "react";
import Login from "./Login";
import Header from "./Header";

const Layout: React.FC<PropsWithChildren> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const checkLoginStatus = () => {
    return false;
  };
  const [blur, setBlur] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      setBlur(false);
      console.log("blur")
    }
  }, [isLoggedIn]);

  useEffect(() => {

    const userLoggedIn = checkLoginStatus();
    setIsLoggedIn(userLoggedIn);
 
    setShowLoginPopup(!userLoggedIn);
  }, [isLoggedIn,showLoginPopup]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);

    setShowLoginPopup(false);

  };
console.log("user",isLoggedIn)
  return (
    <>
      <Header />
      {showLoginPopup && blur && (
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
          <Login showPopup={showLoginPopup} onLoginSuccess={handleLoginSuccess} />
        </>
      )}
      {props.children}
    </>
  );
};
export default Layout;