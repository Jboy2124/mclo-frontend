import React from "react";
import Navbar from "../../components/nav/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default RootLayout;
