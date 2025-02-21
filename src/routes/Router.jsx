import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/TestWelcom.jsx";
import AccountList from "../pages/yourAccounts.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import Dashboard from "../pages/dashboard.jsx";
import TrainingWelcome from "../pages/trainingWelcome.jsx";


const Router = () => {
//   const ProtectedRoute = ({ children }) => {
//     // const isAuthenticated = localStorage.getItem("jsonwebtoken") ? true : false;

//     if (!isAuthenticated) {
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };
//   const AdminRoute = ({ children }) => {
//     const token = localStorage.getItem("jsonwebtoken");
//     const isAuthenticated = token ? true : false;
//     const payload = JSON.parse(token);
//     console.log(payload);
//     const isAdmin = payload.decodedJWT.userRole === "admin";

//     if (!isAuthenticated || !isAdmin) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Please Logout Login to your Admin Account",
//       });
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };
//   const InstructorRoute = ({ children }) => {
//     const token = localStorage.getItem("jsonwebtoken");
//     const isAuthenticated = token ? true : false;
//     const payload = JSON.parse(token);
//     console.log(payload);
//     const isAdmin = payload.decodedJWT.userRole === "instructor";

//     if (!isAuthenticated || !isAdmin) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Please Logout Login to your Instructor Account",
//       });
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };
  
// const LoggedOutRoute = ({ children }) => {
//     const token = localStorage.getItem("jsonwebtoken");
//     const isAuthenticated = token ? true : false;
//     let role;
//     if (token) {
//       const payload = JSON.parse(token);
//       console.log(payload);
//       role = payload.decodedJWT.userRole;
//     }

//     if (isAuthenticated) {
//       if (role === "admin") {
//         return <Navigate to="/admin/home" />;
//       } else if (role === "instructor") {
//         return <Navigate to="/instructor/home" />;
//       } else {
//         return <Navigate to="/" />;
//       }
//     }
//     return children;
//   };

  return (
    <Routes>
      <Route path="/" element={<AccountList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/:id" element={<Dashboard />} />
      <Route path="/training" element={<TrainingWelcome />} />
    </Routes>
  );
};

export default Router;
