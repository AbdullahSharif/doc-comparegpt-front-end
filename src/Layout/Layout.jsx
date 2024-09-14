import React from "react";
import Navbar from "../Components/Navbar/Navbar";

export default function Layout({ children }) {
  const user = localStorage.getItem("access");
  return (
    <div>
      {user && <Navbar />}
      {children}
    </div>
  );
}
