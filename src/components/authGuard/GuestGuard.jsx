import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../utilities/hooks/useAuth";
import { DASHBOARD_ROUTES } from "../../utilities/constants/routes";

const GuestGuard = () => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={DASHBOARD_ROUTES.DASHBOARD} />
  );
};

export default GuestGuard;
