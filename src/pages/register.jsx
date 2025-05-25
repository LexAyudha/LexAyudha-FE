import React, { useEffect, useState } from "react";
import MinimalHeader from "../components/minimalHeader.jsx";
import ChangeThemeFB from "../components/changeThemeFB.jsx";
import SignInWithGoogleBtn from "../components/signInWithGoogle.jsx";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { data } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import sha256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";

export default function Register() {
  const [userEmail, setUserEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [rePsw, setRePsw] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState();
  const [userOtp, setUserOtp] = useState();
  const [stepCompleted, setStepCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmail = (e) => {
    setUserEmail(e.target.value.trim());
  };

  const handlePsw = (e) => {
    setPsw(e.target.value);
  };

  const handleRePsw = (e) => {
    setRePsw(e.target.value);
  };

  const validateInput = (param = null) => {
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

    if (param === null) {
      if (rePsw !== psw) {
        setError("Passwords do not match");
        return false;
      }
    }

    setError(""); // Clear any previous error messages
    return true;
  };

  const generateOtpHtmlTemplate = (otp) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f6f8;
        padding: 20px;
        margin: 0;
      }
      .container {
        max-width: 500px;
        margin: auto;
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 5px;
        color: #2d3748;
        text-align: center;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        color: #888;
        margin-top: 30px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>OTP Verification</h2>
      <p>Dear User,</p>
      <p>Please use the following One-Time Password (OTP) to complete your verification process. This OTP is valid for the next 5 minutes:</p>
      <div class="otp">${otp}</div>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>Thank you,<br/>Lexayudha Team</p>
      <div class="footer">
        &copy; 2025 Lexayudha. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
  };

  const generateOTP = async () => {
    const res = await axiosInstance.get("/auth/otp");

    // const res = {
    //     status: 200,
    //     data: {
    //         otp: 123456
    //     }
    // } // Mock response

    if (res?.status === 200) {
      toast.success("OTP code sent!");
      console.log("otp: ", res?.data?.otp);
      setOtp(res?.data?.otp);
      await axios.post("http://localhost:8007/email/send-email", {
        to: userEmail,
        subject: "Verify Your Lexayudha Account",
        text: `Your OTP code is: ${otp}`,
        html: generateOtpHtmlTemplate(res?.data?.otp),
      });
      return true;
    } else {
      toast.error("Failed to send OTP code!");
      return false;
    }
  };

  const handleStepCompleted = async () => {
    if (validateInput()) {
      if (await generateOTP()) {
        setStepCompleted(true);
      }
    }
  };
  const handleVerifyOTP = async (e) => {
    if (verifyOTP(e)) {
      handleSubmit(e);
    }
  };

  const handleOtpInput = (e) => {
    setUserOtp(parseInt(e.target.value, 10));
  };

  const verifyOTP = (e) => {
    const hashedOtp = sha256(otp?.toString()).toString(Hex);
    setError(""); // Clear any previous error messages
    console.log("hashedOtp", userOtp);
    console.log("otp", otp);
    if (otp == userOtp) {
      return true;
    } else if (otp === "") {
      setError("OTP is required");
      return false;
    } else {
      setError("Invalid OTP");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      const user = {
        email: userEmail,
        password: psw,
      };

      const res = await axiosInstance.post("/auth/register", user);

      //const res = { status: 200 } // Mock response

      if (res.status === 200) {
        localStorage.setItem("accessToken", res?.data?.accessToken);
        localStorage.setItem("refreshToken", res?.data?.refreshToken);

        toast.success("Registration Successful!");

        setTimeout(async () => {
          const userId = JSON.parse(
            atob(res?.data?.accessToken.split(".")[1])
          )?.userId;

          if (userId) {
            window.location.href = `/dashboard/${userId}`;
          } else {
            window.location.href = "/login";
          }
        }, 5000);
      } else {
        toast.error("Registration Failed!");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleStepCompleted();
    }
  };

  const handleKeyDownVerify = (e) => {
    if (e.key === "Enter") {
      handleVerifyOTP(e);
    }
  };

  return (
    <>
      {" "}
      <MinimalHeader />
      <div className="w-screen la-container h-[calc(100vh-80px)] flex-col">
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
        <div className="flex h-screen w-full  justify-center">
          <div className="  w-[50%] flex justify-center   items-center z-10 shadow-[8px_0px_10px_1px_rgba(0,_0,_0,_0.1)] ">
            <div className=" flex flex-col w-[400px] mt-[36px] shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-[20px] p-6">
              {!stepCompleted ? (
                <>
                  <h1 className=" font-bold">Register Now!</h1>
                  <p className="">let's get you started...</p>
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

                  <div className="relative w-full">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="re-enter password"
                      onChange={handleRePsw}
                      required
                      onKeyDown={handleKeyDown}
                      className="w-full my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </button>
                  </div>
                  <div className="error-div">
                    <p className="m-0 text-red-500">{error}</p>
                  </div>
                  <div className=" flex justify-center pt-6">
                    <button
                      type="submit"
                      onClick={handleStepCompleted}
                      className="btn btn-primary m-0 px-4 py-2 rounded-[4px] text-center mt-5 bg-blue-600 text-white w-[200px] hover:bg-blue-700 "
                    >
                      Sign up
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className=" font-bold">Verify Account</h1>
                  <p className="">
                    Please enter the OTP code sent to your email..
                  </p>
                  <input
                    type="number"
                    placeholder="Enter OTP"
                    onChange={handleOtpInput}
                    onKeyDown={handleKeyDownVerify}
                    required
                    className="my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="error-div">
                    <p className="m-0 text-red-500">{error}</p>
                  </div>
                  <div className=" flex justify-center">
                    <button
                      type="submit"
                      onClick={handleVerifyOTP}
                      className="btn btn-primary m-0 px-4 py-2 rounded-[4px] text-center mt-5 bg-blue-600 text-white w-[200px] hover:bg-blue-700 "
                    >
                      Verify
                    </button>
                  </div>
                </>
              )}
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
                  Already have an account?{" "}
                  <a href="/login" className=" underline hover:text-blue-600">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="  w-[50%]  la-login-right-panel"></div>
        </div>
      </div>
    </>
  );
}
