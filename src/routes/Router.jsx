import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AccountList from "../pages/yourAccounts.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import Dashboard from "../pages/dashboard.jsx";
import NotFound from "../components/notFoundPage.jsx";

//touch-math
import PNumber0 from "../components/touch-math/PracticingComponent/PNumber0.jsx";
import TNumber0 from "../components/touch-math/TeachingComponents/TNumber0.jsx";
import TNumberSense from "../components/touch-math/Number_Sense/Teaching_Number_Sense.jsx";
import NumberSenseQuiz from "../components/touch-math/Number_Sense/Number_sense_quiz.jsx";
import Addition from "../components/touch-math/Exercises/Addition.jsx";
import Subtraction from "../components/touch-math/Exercises/Subtraction.jsx";
import Addition2 from "../components/touch-math/Exercises/AdditionLevel2.jsx";
import TAddition from "../components/touch-math/TeachingOperations/TeachingAddition.jsx";
import TSubtraction from "../components/touch-math/TeachingOperations/TeachingSubtraction.jsx";
import PTouchMath from "../components/touch-math/TouchMath/TochMathPractice.jsx";
import QAddition from "../components/touch-math/Quizzes/Addition_Quiz.jsx";
import QSubtraction from "../components/touch-math/Quizzes/Subtraction_Quiz.jsx";

import TrainingWelcome from "../pages/trainingWelcome.jsx";
import ConfigOnBoardingPage from "../pages/configOnBoarding.jsx";
import SpeechCalibPage from "../pages/speechCalib.jsx";
import SelectTrainingPage from "../pages/SelectTraining.jsx";
import DyslexicTrainingControlPanel from "../pages/dyslexicTrainingControlPanel.jsx";
import DyscalculiaTrainingControlPanel from "../pages/dyscalculiaTrainingControlPanel.jsx";
import DyslexicScreenReader from "../pages/dyslexic/dyslexicScreenReader.jsx";

import ActivityAnalytics from "../pages/ActivityAnalytics.jsx";

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
      <Route
        path="/dyslexic-training"
        element={<DyslexicTrainingControlPanel />}
      />
      <Route
        path="/dyscalculic-training"
        element={<DyscalculiaTrainingControlPanel />}
      />

      <Route path="/analytics" element={<ActivityAnalytics />} />

      {/* Dyslexic training */}
      <Route
        path="/screen-reader-lessons/:id"
        element={<DyslexicScreenReader />}
      />

      {/* touch maths */}
      <Route path="/touch-math/teaching_number" element={<TNumber0 />} />

      <Route path="/touch-math-practice" element={<PTouchMath />} />

      <Route path="/touch-math/quiz_number/:id" element={<PNumber0 />} />

      <Route
        path="/touch-math/teaching-number-sense"
        element={<TNumberSense />}
      />
      <Route
        path="/touch-math/quiz-number-sense"
        element={<NumberSenseQuiz />}
      />

      <Route path="/touch-math/teaching-addition" element={<TAddition />} />
      <Route
        path="/touch-math/teaching-subtraction"
        element={<TSubtraction />}
      />

      <Route path="/practice-addition" element={<Addition />} />
      <Route path="/practice-substraction" element={<Subtraction />} />
      <Route path="/addition_level2" element={<Addition2 />} />

      <Route path="/quiz_addition" element={<QAddition />} />
      <Route path="/quiz_subtraction" element={<QSubtraction />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
