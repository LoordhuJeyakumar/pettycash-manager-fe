import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoutes({ role }) {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const location = useLocation();
  const user = sessionStorage.getItem("user");

  if (!isLoggedIn) {
    return <Navigate to={"/login"} replace={true} />;
  }

  return (
    <>
      {undefined == role ? (
        <Outlet />
      ) : JSON.parse(user).role == role ? (
        <Outlet />
      ) : isLoggedIn ? (
        <Navigate to={"/error403"} state={{ from: location }} replace />
      ) : (
        <Navigate to={"/login"} replace={true} />
      )}
    </>
  );
}

export default ProtectedRoutes;
