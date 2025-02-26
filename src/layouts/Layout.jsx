import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
import Router from "../routes/Router";
// import Footer from "../components/Footer";
// import AdminNavBar from "../components/AdminNavBar";
// import InstructorNavBar from "../components/InstructorNavBar";

const Layouts = () => {
//   const token = localStorage.getItem("jsonwebtoken");
//   const payload = JSON.parse(token);
//   const role = payload?.decodedJWT.userRole;
    const role = '';
  return (
    <div className="page-container">
      {role === "admin" ? (
        <>
          {/* <AdminNavBar /> */}
          <Router />
          {/* <Footer /> */}
        </>
      ) : role === "instructor" ? (
        <>
          {/* <InstructorNavBar /> */}
          <Router />
          {/* <Footer /> */}
        </>
      ) : (
        <>
          {/* <Navbar /> */}
          <Router />
          {/* <Footer /> */}
        </>
      )}
    </div>
  );
};

export default Layouts;
