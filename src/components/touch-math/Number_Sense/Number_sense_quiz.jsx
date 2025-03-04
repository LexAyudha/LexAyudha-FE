import React, { useState } from "react";
import Swal from "sweetalert2";

const Quiz = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [checked, setChecked] = useState(false); // Track if the answer has been checked
  const [quizIndex, setQuizIndex] = useState(1); // Track the current quiz number
  const totalQuizzes = 10; // Limit to 10 quizzes

  const generateRandomNumber = () => Math.floor(Math.random() * 9) + 1;

  // Modify generateQuiz to ensure different numbers for num1 and num2
  const generateQuiz = () => {
    let num1 = generateRandomNumber();
    let num2 = generateRandomNumber();

    // Ensure num1 and num2 are not the same
    while (num1 === num2) {
      num2 = generateRandomNumber();
    }

    return {
      num1,
      num2,
      correct: num1 > num2 ? num1 : num2,
      options: [num1, num2],
    };
  };

  const [currentQuiz, setCurrentQuiz] = useState(generateQuiz());

  const handleNumberClick = (num) => {
    setSelectedNumber(num);
  };

  const checkAnswer = () => {
    setChecked(true); // Mark as checked when the button is clicked

    if (selectedNumber === currentQuiz.correct) {
      Swal.fire({
        title: "Correct!",
        text: "You selected the correct number.",
        icon: "success",
        confirmButtonText: "Next Quiz",
      }).then(() => {
        nextQuiz(); // Move to the next quiz after SweetAlert confirmation
      });
    } else {
      Swal.fire({
        title: "Wrong!",
        text: "That's not the largest number.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const nextQuiz = () => {
    if (quizIndex < totalQuizzes) {
      setChecked(false); // Reset checked state for the next quiz
      setSelectedNumber(null);
      setCurrentQuiz(generateQuiz());
      setQuizIndex(quizIndex + 1); // Increase quiz index
    } else {
      Swal.fire({
        title: "Quiz Completed!",
        text: "You have completed all the quizzes.",
        icon: "success",
        confirmButtonText: "Restart Quiz",
      }).then(() => {
        setQuizIndex(1); // Restart quizzes from the first quiz
        setChecked(false);
        setSelectedNumber(null);
        setCurrentQuiz(generateQuiz());
      });
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-counter">
        Quiz {quizIndex} / {totalQuizzes} {/* Display quiz number out of total */}
      </div>

      <h1 className="quiz-title">Select the larger number</h1>
      <div className="quiz-box">
        {currentQuiz.options.map((num, index) => (
          <div
            key={index}
            className={`number-box ${selectedNumber === num ? "selected" : ""} ${
              checked && selectedNumber === currentQuiz.correct && num === currentQuiz.correct
                ? "correct-answer-highlight"
                : ""
            }`}
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="quiz-actions">
        <button className="check-answer" onClick={checkAnswer}>
          Check Answer
        </button>
      </div>
    </div>
  );
};

export default Quiz;
