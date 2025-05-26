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

//dyslexia
import TrainingWelcome from "../pages/trainingWelcome.jsx";
import ConfigOnBoardingPage from "../pages/configOnBoarding.jsx";
import SpeechCalibPage from "../pages/speechCalib.jsx";
import SelectTrainingPage from "../pages/SelectTraining.jsx";
import DyslexicPracticeControlPanel from "../pages/dyslexicPracticeControlPanel.jsx";
import DyscalculiaTrainingControlPanel from "../pages/dyscalculiaTrainingControlPanel.jsx";
import DyslexicScreenReaderPractice from "../pages/dyslexic/dyslexicScreenReaderPractice.jsx";
import DyslexicScreenReaderQuiz from "../pages/dyslexic/dyslexicScreenReaderQuiz.jsx"
import DyslexicLearningMode from "../pages/dylexicLearningMode.jsx";
import DyslexicPDFReader from "../pages/dyslexicPDFReader.jsx";
import DyslexicQuizControlPanel from "../pages/dyslexicQuizControlPanel.jsx";
import ActivityAnalytics from "../pages/ActivityAnalytics.jsx";

const Router = () => {
 
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
        element={<DyslexicLearningMode />}
      />
      <Route
        path="/dyslexia-practice"
        element={<DyslexicPracticeControlPanel />}
      />
      <Route
        path="/dyslexia-quiz"
        element={<DyslexicQuizControlPanel />}
      />
      <Route
        path="/dyslexia-pdf-reader"
        element={<DyslexicPDFReader />}
      />
      <Route
        path="/dyscalculic-training"
        element={<DyscalculiaTrainingControlPanel />}
      />

      <Route path="/analytics" element={<ActivityAnalytics />} />

      {/* Dyslexic training */}
      <Route
        path="/screen-reader-lessons/:id"
        element={<DyslexicScreenReaderPractice />}
      />
       <Route
        path="/screen-reader-quiz/:id"
        element={<DyslexicScreenReaderQuiz />}
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
