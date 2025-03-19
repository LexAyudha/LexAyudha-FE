import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "../../../assets/Styles.css";

// Import number images (replace with actual paths)
import number1Img from "../../../assets/1.png";
import number2Img from "../../../assets/2.png";
import number3Img from "../../../assets/3.png";
import number4Img from "../../../assets/4.png";
import number5Img from "../../../assets/5.png";
import number6Img from "../../../assets/6.png";
import number7Img from "../../../assets/7.png";
import number8Img from "../../../assets/8.png";
import number9Img from "../../../assets/9.png";
import ChangeThemeFB from "../../changeThemeFB";
import AlternativeHeader from "../../alternativeHeader";

const Quiz = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [quizIndex, setQuizIndex] = useState(1);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const totalQuizzes = 10;
  const popupRef = useRef(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Effect to handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (showHint && popupRef.current && !popupRef.current.contains(event.target)) {
        setShowHint(false);
      }
    }

    // Add event listener when popup is shown
    if (showHint) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHint]);

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

  // Number images for the hint popup
  const numberImages = [
    { number: 1, src: number1Img, size: 25 },
    { number: 2, src: number2Img, size: 35 },
    { number: 3, src: number3Img, size: 45 },
    { number: 4, src: number4Img, size: 55 },
    { number: 5, src: number5Img, size: 65 },
    { number: 6, src: number6Img, size: 75 },
    { number: 7, src: number7Img, size: 85 },
    { number: 8, src: number8Img, size: 95 },
    { number: 9, src: number9Img, size: 105 },
  ];

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

  const handleHintClick = () => {
    if (hintsRemaining > 0) {
      setShowHint(true);
      setHintsRemaining(hintsRemaining - 1);
    } else {
      Swal.fire({
        title: "No Hints Left!",
        text: "You've used all your hints for this session.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  const closeHint = () => {
    setShowHint(false);
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
        setHintsRemaining(3); // Reset hints when restarting the quiz
      });
    }
  };

  return (
    <div className="la-container h-screen flex items-center justify-center relative">
      <ChangeThemeFB />
      <AlternativeHeader title="Number Sense" />
      <div className="quiz-container flex justify-center items-center">
        {isCorrect && (
          <div className="">
            <Confetti
              width={windowDimensions.width - 50}
              height={windowDimensions.height}
              gravity={0.2}
              numberOfPieces={300}
              recycle={false}
              initialVelocityX={1}
              initialVelocityY={1}
              colors={['#ff0000', '#00ff00', '#0000ff']}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />
          </div>
        )}

        <div className="quiz-header">
          <button
            className="hint-button"
            onClick={handleHintClick}
            disabled={hintsRemaining <= 0}
          >
            Hint ({hintsRemaining} left)
          </button>
          <div className="quiz-counter-ns">
            Quiz {quizIndex} / {totalQuizzes}
          </div>

        </div>

        <h1 className="quiz-title">Select the larger number</h1>
        <div className="quiz-box">
          {currentQuiz.options.map((num, index) => (
            <div
              key={index}
              className={`number-box ${selectedNumber === num ? "selected" : ""} ${isCorrect && num === currentQuiz.correct ? "correct-answer-highlight" : ""
                }`}
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </div>
          ))}
        </div>

        {isCorrect && (
          <button className="next-quiz absolute bottom-10" onClick={nextQuiz}>
            Next
          </button>
        )}

        {/* Hint Popup */}
        {showHint && (
          <div className="hint-overlay">
            <div className="hint-popup" ref={popupRef}>
              {/* Close button positioned at top-right corner */}
              <button className="close-button-corner" onClick={closeHint}>×</button>

              <h2 className="hint-title">Let's Learn Number Sense</h2>

              <div className="hint-description">
                <p>Here, the size of the number shows its value. Larger numbers have bigger images.</p>
              </div>

              <div className="number-container">
                <div className="single-line-number-display">
                  {numberImages.map((item) => (
                    <div key={item.number} className="number-item">
                      <img
                        src={item.src}
                        alt={`Number ${item.number}`}
                        style={{ width: `${item.size}px`, height: "auto" }}
                        className="number-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default Quiz;