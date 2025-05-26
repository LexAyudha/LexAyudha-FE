import React, { useEffect, useState } from "react";
import MinimalHeader from "../components/minimalHeader";
import ChangeThemeFB from "../components/changeThemeFB";
import SignInWithGoogleBtn from "../components/signInWithGoogle";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmail = (e) => {
    setUserEmail(e.target.value.trim());
  };

  const handlePsw = (e) => {
    setPsw(e.target.value);
  };

  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (userEmail === "") {
      setError("Email is required");
      return false;
    } else if (!emailRegex.test(userEmail)) {
      setError("Invalid email");
      return false;
    }

    if (psw === "") {
      setError("Password is required");
      return false;
    } else if (psw.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    setError(""); // Clear any previous error messages
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      const user = {
        email: userEmail,
        password: psw,
      };

      const res = await axiosInstance.post("/auth/login", user, {
        validateStatus: (status) => status < 500, // Accept any status under 500
      });

      if (res?.status === 200) {
        localStorage.setItem("accessToken", res?.data?.accessToken);
        localStorage.setItem("refreshToken", res?.data?.refreshToken);

        const token = res?.data?.accessToken;
        const decoded = jwtDecode(token);
        console.log("decodec", decoded);
        const userId = decoded?.userId;
        localStorage.setItem("userId", userId);

        toast.success("Login Successful!");
        setTimeout(() => {
          const userId = JSON.parse(
            atob(res?.data?.accessToken.split(".")[1])
          )?.userId;
          window.location.href = `/dashboard/${userId}`;
        }, 5000);
      } else if (res.status === 401) {
        // Handle unauthorized error gracefully
        toast.error("Unauthorized! Please check your credentials.");
      } else {
        toast.error("Login Failed!");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <>
      <MinimalHeader />
      <div className="la-container h-[calc(100vh-80px)] flex-col">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

        {/* <ChangeThemeFB /> */}
        <div className=" flex h-screen w-full justify-center">
          <div className="  w-[50%] flex justify-center items-center z-10 shadow-[8px_0px_10px_1px_rgba(0,_0,_0,_0.1)] ">
            <div className=" flex flex-col w-[400px] mt-[36px] shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] p-6 rounded-[20px] ">
              <h1 className=" font-bold">Hi there,</h1>
              <p className="">Welcome back to LexAyudha</p>
              <input
                type="email"
                placeholder="email"
                onChange={handleEmail}
                required
                className="my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4"
              />
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  onChange={handlePsw}
                  required
                  onKeyDown={handleKeyDown}
                  className="w-full my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="fas fa-eye"></i>
                  ) : (
                    <i className="fas fa-eye-slash"></i>
                  )}
                </button>
              </div>
              <div>
                <a href="/forgotPassword" className="text-sm underline">
                  Forgot Password?
                </a>
              </div>
              <div className="error-div">
                <p className="m-0 text-red-500">{error}</p>
              </div>
              <div>
                <div className=" flex justify-center pt-6">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary m-0 px-4 py-2 rounded-[4px] text-center mt-5 bg-blue-600 text-white w-[200px] hover:bg-blue-700 "
                  >
                    Sign in
                  </button>
                </div>
                {/* <div className='flex items-center justify-evenly py-2'>
                  <div className='w-[35%] h-[2px] bg-slate-900'></div>
                  <p className='m-0'>or</p>
                  <div className='w-[35%] h-[2px] bg-slate-900'></div>
                </div>
                <div className=' flex justify-center py-2'>
                  <SignInWithGoogleBtn />
                </div> */}
                <div className=" flex justify-center pt-4">
                  <p>
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className=" underline hover:text-blue-700"
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="  w-[50%] la-login-right-panel"></div>
        </div>
      </div>
    </>
  );
}
