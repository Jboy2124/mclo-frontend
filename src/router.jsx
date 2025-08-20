import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./utilities/layout/RootLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import PageNotFound from "./pages/notFound/PageNotFound";
import AccountDashboard from "./pages/account/Account";
import AuthGuard from "./components/authGuard/AuthGuard";
import GuestGuard from "./components/authGuard/GuestGuard";
import Login from "./components/login/Login";
import Register from "./components/register/Register";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <AuthGuard />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    element: <GuestGuard />,
    children: [
      {
        path: "/account",
        element: <AccountDashboard />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default routes;
