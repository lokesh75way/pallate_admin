import React, { useState, useEffect, PropsWithChildren } from "react";
import Login from "./Login";
import Header from "./Header";

const Layout: React.FC<PropsWithChildren> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const checkLoginStatus = () => {
    return false;
  };

  useEffect(() => {
    // Check the login status on component mount or page refres
    const userLoggedIn = checkLoginStatus();
    setIsLoggedIn(userLoggedIn);
    setShowLoginPopup(!userLoggedIn);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginPopup(false);
  };

  return (
    <>
      <Header />
      showLoginPopup && (
      <Login showPopup={showLoginPopup} onLoginSuccess={handleLoginSuccess} />)
      {props.children}
    </>
  );
};

export default Layout;