/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import LoadingComponent from "./Loading";
import { LOCAL_TOKEN } from "../util/constants";
import { userSignedIn } from "../store/slices/authSlice";

function Authorization() {
  const auth = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem(LOCAL_TOKEN);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.authenticated && auth.token) setLoading(false);
    else if (token)
      dispatch(
        userSignedIn({
          token,
          user: { _id: "", name: "", email: "", role: "" },
        })
      );
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, token]);

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <LoadingComponent />
        </div>
      </div>
    );

  return auth.token && auth.authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}

export default Authorization;
