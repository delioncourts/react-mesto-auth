import { Outlet, Navigate } from "react-router-dom"
import React from "react";

const ProtectedRoute = (props) => {
  return props.loggedIn ? <Outlet /> : <Navigate to="/signin" replace />;
}

export default ProtectedRoute;