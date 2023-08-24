import React from "react";
import Header from "./Header";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <Header />
      <div style={{ marginLeft: "250px", marginTop: "70px", padding: "10px" }}>
        <Outlet />
      </div>
    </>
  );
};
export default Layout;
