import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useSelector((state) => state.auth);

  console.log("ProtectedRoute:", {
    hasToken: !!token,
    hasUser: !!user,
    userRole: user?.role,
  });

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
