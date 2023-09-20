/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import LoadingComponent from "./Loading";
import { LOCAL_TOKEN } from "../util/constants";
import { userSignedIn } from "../store/slices/authSlice";
import jwtDecode from "jwt-decode";
import AccessControl from "./AccessControl";

function Authorization() {
  const auth = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem(LOCAL_TOKEN);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user?.role && auth.token) setLoading(false);
    else if (token) {
      const decode: { user: User } = jwtDecode(token ?? "");
      dispatch(
        userSignedIn({
          token,
          user: { ...decode.user },
        })
      );
    } else setLoading(false);
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

  return auth.token && auth.user?.role ? (
    <AccessControl>
      <Outlet />
    </AccessControl>
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}

export default Authorization;
