import React from "react";
import { Navigate } from "react-router-dom";

export const AuthenticatedRoute = ({ user, children }) => {
  return user === "user" || user === "admin" ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export const AdminRoute = ({ user, children }) => {
  return user === "admin" ? children : <Navigate to="/login" />;
};
