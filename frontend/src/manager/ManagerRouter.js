// ManagerRouter.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ManagerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "manajer") {
    return <Navigate to="/" replace />;
  }

  return children;
}
