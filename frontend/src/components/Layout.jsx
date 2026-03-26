import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen container mx-auto px-4 py-8">
         <Toaster />
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;