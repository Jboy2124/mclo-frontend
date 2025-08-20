import React from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const user = useSelector((state) => state.auth.authUser.fname);
  return { isAuthenticated: !!user };
};

export default useAuth;
