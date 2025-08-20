import React from "react";
import useAuth from "../../utilities/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { ACCOUNT_ROUTES } from "../../utilities/constants/routes";

const AuthGuard = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to={ACCOUNT_ROUTES.LOGIN} />;
};

export default AuthGuard;
