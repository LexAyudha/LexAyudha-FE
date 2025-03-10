import React, { useState } from "react";
import Swal from "sweetalert2";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "../../../assets/Styles.css";

const Quiz = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [quizIndex, setQuizIndex] = useState(1);
  const [isCorrect, setIsCorrect] = useState(false);
  const totalQuizzes = 10;

  const { width, height } = useWindowSize();

  const generateRandomNumber = () => Math.floor(Math.random() * 9) + 1;

  const generateQuiz = () => {
    let num1 = generateRandomNumber();
    let num2 = generateRandomNumber();

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

    if (num === currentQuiz.correct) {
      setIsCorrect(true); 
    } else {
      Swal.fire({
        title: "Wrong!",
        text: "That's not the largest number. Try again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        setSelectedNumber(null);
      });
    }
  };

  const nextQuiz = () => {
    if (quizIndex < totalQuizzes) {
      setSelectedNumber(null);
      setIsCorrect(false);
      setCurrentQuiz(generateQuiz());
      setQuizIndex(quizIndex + 1);
    } else {
      Swal.fire({
        title: "Quiz Completed!",
        text: "You have completed all the quizzes.",
        icon: "success",
        confirmButtonText: "Restart Quiz",
      }).then(() => {
        setQuizIndex(1);
        setSelectedNumber(null);
        setIsCorrect(false);
        setCurrentQuiz(generateQuiz());
      });
    }
  };

  return (
    <div className="quiz-container">
      {isCorrect && (
        <div className="fireworks-container">
          <Confetti
            width={width}
            height={height}
            gravity={0.2}
            numberOfPieces={300}
            recycle={false}
            initialVelocityX={1}
            initialVelocityY={1}
            colors={['#ff0000', '#00ff00', '#0000ff']}
            style={{
              position: 'absolute',
              bottom: 0, // Start from the bottom of the screen
              left: 0,
              right: 0,
            }}
          />
        </div>
      )}

      <div className="quiz-counter">
        Quiz {quizIndex} / {totalQuizzes}
      </div>

      <h1 className="quiz-title">Select the larger number</h1>
      <div className="quiz-box">
        {currentQuiz.options.map((num, index) => (
          <div
            key={index}
            className={`number-box ${selectedNumber === num ? "selected" : ""} ${
              isCorrect && num === currentQuiz.correct ? "correct-answer-highlight" : ""
            }`}
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </div>
        ))}
      </div>

      {isCorrect && (
        <button className="next-quiz" onClick={nextQuiz}>
          Next
        </button>
      )}
    </div>
  );
};

export default Quiz;
