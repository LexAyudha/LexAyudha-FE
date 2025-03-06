import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AccountList from "../pages/yourAccounts.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import Dashboard from "../pages/dashboard.jsx";

//touch-math
import PNumber0 from "../components/touch-math/PracticingComponent/PNumber0.jsx";
import PNumber1 from "../components/touch-math/PracticingComponent/PNumber1.jsx";
import PNumber2 from "../components/touch-math/PracticingComponent/PNumber2.jsx";
import PNumber3 from "../components/touch-math/PracticingComponent/PNumber3.jsx";
import PNumber4 from "../components/touch-math/PracticingComponent/PNumber4.jsx";
import PNumber5 from "../components/touch-math/PracticingComponent/PNumber5.jsx";
import PNumber6 from "../components/touch-math/PracticingComponent/PNumber6.jsx";
import PNumber7 from "../components/touch-math/PracticingComponent/PNumber7.jsx";
import PNumber8 from "../components/touch-math/PracticingComponent/PNumber8.jsx";
import PNumber9 from "../components/touch-math/PracticingComponent/PNumber9.jsx";
import TNumber0 from "../components/touch-math/TeachingComponents/TNumber0.jsx";
import TNumber1 from "../components/touch-math/TeachingComponents/TNumber1.jsx";
import TNumber2 from "../components/touch-math/TeachingComponents/TNumber2.jsx";
import TNumber3 from "../components/touch-math/TeachingComponents/TNumber3.jsx";
import TNumber4 from "../components/touch-math/TeachingComponents/TNumber4.jsx";
import TNumber5 from "../components/touch-math/TeachingComponents/TNumber5.jsx";
import TNumber6 from "../components/touch-math/TeachingComponents/TNumber6.jsx";
import TNumber7 from "../components/touch-math/TeachingComponents/TNumber7.jsx";
import TNumber8 from "../components/touch-math/TeachingComponents/TNumber8.jsx";
import TNumber9 from "../components/touch-math/TeachingComponents/TNumber9.jsx";
import TNumberSense from "../components/touch-math/Number_Sense/Teaching_Number_Sense.jsx"
import NumberSenseQuiz from "../components/touch-math/Number_Sense/Number_sense_quiz.jsx"
import Addition from "../components/touch-math/Exercises/Addition.jsx";
import Subtraction from "../components/touch-math/Exercises/Subtraction.jsx";
import Addition2 from "../components/touch-math/Exercises/AdditionLevel2.jsx";
import TAddition from "../components/touch-math/TeachingOperations/TeachingAddition.jsx";

import TrainingWelcome from "../pages/trainingWelcome.jsx";
import ConfigOnBoardingPage from "../pages/configOnBoarding.jsx";
import SpeechCalibPage from "../pages/speechCalib.jsx";
import SelectTrainingPage from "../pages/SelectTraining.jsx";
import DyslexicTrainingControlPanel from "../pages/dyslexicTrainingControlPanel.jsx";
import DyscalculiaTrainingControlPanel from "../pages/dyscalculiaTrainingControlPanel.jsx";
import DyslexicScreenReader from "../pages/dyslexic/dyslexicScreenReader.jsx";

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
      <Route path="/config-onboarding" element={<ConfigOnBoardingPage />} />
      <Route path="/speechCalibration" element={<SpeechCalibPage />} />
      <Route path="/selectTraining" element={<SelectTrainingPage />} />
      <Route path="/dyslexic-training" element={<DyslexicTrainingControlPanel />} />
      <Route path="/dyscalculic-training" element={<DyscalculiaTrainingControlPanel />}/>

      {/* Dyslexic training */}
      <Route path ='/screen-reader-lessons/:id' element={<DyslexicScreenReader/>}/>
      
      {/* touch maths */}
      <Route path="/touch-math/teaching_number/:id" element={<TNumber0 />} />
      {/* Following TNumber routes should be deleted */}
      <Route path="/touch-math/teaching_number1" element={<TNumber1 />} /> 
      <Route path="/touch-math/teaching_number2" element={<TNumber2 />} />
      <Route path="/touch-math/teaching_number3" element={<TNumber3 />} />
      <Route path="/touch-math/teaching_number4" element={<TNumber4 />} />
      <Route path="/touch-math/teaching_number5" element={<TNumber5 />} />
      <Route path="/touch-math/teaching_number6" element={<TNumber6 />} />
      <Route path="/touch-math/teaching_number7" element={<TNumber7 />} />
      <Route path="/touch-math/teaching_number8" element={<TNumber8 />} />
      <Route path="/touch-math/teaching_number9" element={<TNumber9 />} />

      <Route path="/touch-math/quiz_number/:id" element={<PNumber0 />} />

      {/* <Route path="/touch-math/quiz_number1" element={<PNumber1 />} />
      <Route path="/touch-math/quiz_number2" element={<PNumber2 />} />
      <Route path="/touch-math/quiz_number3" element={<PNumber3 />} />
      <Route path="/touch-math/quiz_number4" element={<PNumber4 />} />
      <Route path="/touch-math/quiz_number5" element={<PNumber5 />} />
      <Route path="/touch-math/quiz_number6" element={<PNumber6 />} />
      <Route path="/touch-math/quiz_number7" element={<PNumber7 />} />
      <Route path="/touch-math/quiz_number8" element={<PNumber8 />} />
      <Route path="/touch-math/quiz_number9" element={<PNumber9 />} /> */}

      <Route path="/touch-math/teaching-number-sense" element={<TNumberSense />} />
      <Route path="/touch-math/quiz-number-sense" element={<NumberSenseQuiz />} />

      <Route path="/touch-math/teaching-addition" element={<TAddition />} />
      <Route path="/practice-addition" element={<Addition />} />
      <Route path="/practice-substraction" element={<Subtraction />} />
      <Route path="/addition_level2" element={<Addition2 />} />
      
    </Routes>
  );
};

export default Router;
