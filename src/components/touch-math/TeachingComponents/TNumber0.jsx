import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../../../assets/TeachNumber.css";
import ChangeThemeFB from "../../changeThemeFB";

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const Number0 = () => {
  const [visiblePoints, setVisiblePoints] = useState(0); // To track the number of visible touchpoints
  const [intervalRunning, setIntervalRunning] = useState(false); // Prevent multiple intervals
  const [femaleVoice, setFemaleVoice] = useState(null); // Store selected female voice
  const navigate = useNavigate(); // Hook for navigation
  const [numberList, setNumberList] = useState(numbers)
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0)

  useEffect(() => {
    // Get voices when they are loaded
    const synth = window.speechSynthesis;
    const getAvailableVoices = () => {
      const availableVoices = synth.getVoices();
      const female = availableVoices.find(voice => voice.name.includes("Female") || voice.name.includes("Woman"));
      if (female) {
        setFemaleVoice(female);
      } else {
        // If no specific female voice found, use the first available voice
        setFemaleVoice(availableVoices[0]);
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = getAvailableVoices;
    }

    // Initialize voices if they are already loaded
    if (speechSynthesis.getVoices().length > 0) {
      getAvailableVoices();
    }

    if (numberList.length == 0) {
      setNumberList(numbers)
      setCurrentNumberIndex(0);
    }
  }, []);

  const handleLearnClick = () => {
    if (numberList[currentNumberIndex] == 0) {
      speakNumber(numberList[currentNumberIndex]);
      return;
    }

    if (intervalRunning) return; // Prevent multiple intervals from starting
    setIntervalRunning(true);

    let currentPoint = 0;

    // Synchronize the first point immediately
    currentPoint++;
    setVisiblePoints(currentPoint);
    speakNumber(currentPoint);

    // Start interval for the remaining points
    const interval = setInterval(() => {
      if (currentPoint < currentNumberIndex) {
        currentPoint++;
        setVisiblePoints(currentPoint);
        speakNumber(currentPoint); // Pronounce the corresponding number
      } else {
        clearInterval(interval); // Stop the interval when all points are shown
        setIntervalRunning(false); // Reset the interval flag
      }
    }, 1500); // Interval of 1 second for subsequent actions
  };

  const handleNextClick = () => {
    if (currentNumberIndex + 1 < numberList.length) {
      setVisiblePoints(0); // Reset the visible points
      setCurrentNumberIndex(currentNumberIndex + 1)
    }

    //navigate("/touch-math/teaching_number1"); // Navigate to TNumber1 component
  };

  const handlePracticeClick = () => {
    navigate(`/touch-math/quiz_number/${currentNumberIndex}`); // Navigate to /number2 for practice
  };
  const handleFinish = () => {
    navigate(`/dyscalculic-training`)
  }

  // Function to handle text-to-speech
  const speakNumber = (number) => {
    if ("speechSynthesis" in window && femaleVoice) {
      const message = new SpeechSynthesisUtterance(number.toString());
      message.lang = "en-US"; // Set language
      message.rate = 1; // Speed of speech
      message.pitch = 1.2; // Pitch to make the voice sound friendly for children
      message.voice = femaleVoice; // Set the female voice

      window.speechSynthesis.speak(message);
    } else {
      console.warn("Text-to-Speech not supported or female voice is not loaded.");
    }
  };

  const numberPointsSnippets = {
    '0': (<div></div>),
    '1': (
      <div
        className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
        style={{ top: "18%", left: "57%", transform: "translate(-50%, -50%)" }}
      ></div>),
    '2': (<><div
      className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
      style={{ top: "31%", left: "29.5%", transform: "translate(-50%, -50%)", backgroundColor: "var(--main-ring-color)" }}
    ></div>
      <div
        className={`touchpoint ${visiblePoints > 1 ? "visible" : ""}`}
        style={{ top: "78.3%", left: "72.5%", transform: "translate(-50%, -50%)" }}
      ></div></>),
    '3': (<>
      <div
        className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
        style={{ top: "28%", left: "30%", transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 1 ? "visible" : ""}`}
        style={{ top: "47%", left: "45%", transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 2 ? "visible" : ""}`}
        style={{ top: "68%", left: "29%", transform: "translate(-50%, -50%)" }}
      ></div>
    </>),
    '4': (<>
      <div
        className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
        style={{ top: "17%", left: "62.5%", transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 1 ? "visible" : ""}`}
        style={{ top: "63.8%", left: "23.5%", transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 2 ? "visible" : ""}`}
        style={{ top: "63.8%", left: "62.5%", transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 3 ? "visible" : ""}`}
        style={{ top: "82%", left: "62.5%", transform: "translate(-50%, -50%)" }}
      ></div>
    </>),
    '5': (<>
      <div
        className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
        style={{ top: "20%", left: "72%", transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 1 ? "visible" : ""}`}
        style={{ top: "20%", left: "38%", transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 2 ? "visible" : ""}`}
        style={{ top: "47%", left: "31%", transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 3 ? "visible" : ""}`}
        style={{ top: "63%", left: "72%", transform: "translate(-50%, -50%)" }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 4 ? "visible" : ""}`}
        style={{ top: "69%", left: "30%", transform: "translate(-50%, -50%)" }}
      ></div>
    </>),
    '6': (<>
      <div
        className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "27%",
          left: "70%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first three touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 1 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "53%",
          left: "30%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first three touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 2 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "80%",
          left: "53%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first three touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 3 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "27%",
          left: "70%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last three touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 4 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "53%",
          left: "30%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last three touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 5 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "80%",
          left: "53%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last three touchpoints
        }}
      ></div>
    </>),
    '7': (<>
      <div
        className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "20%",
          left: "25%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 1 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "20%",
          left: "72.5%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 2 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 3 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "80%",
          left: "40.8%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first four touchpoints
        }}
      ></div>

      {/* Small Touchpoints (Last Three) with Different Color */}
      <div
        className={`touchpoint ${visiblePoints > 4 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "20%",
          left: "72.5%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last three touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 5 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last three touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 6 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "80%",
          left: "40.8%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last three touchpoints
        }}
      ></div>
    </>),
    '8': (<>
      <div
        className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "32%",
          left: "31.5%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 1 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "32%",
          left: "67%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 2 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "64%",
          left: "29.5%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 3 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "64%",
          left: "70%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 4 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "32%",
          left: "31.5%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 5 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "32%",
          left: "67%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 6 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "64%",
          left: "29.5%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 7 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "64%",
          left: "70%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last four touchpoints
        }}
      ></div>
    </>),
    '9': (<>
      <div
        className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "45%",
          left: "30%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first five touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 1 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "20%",
          left: "45%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first five touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 3 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "40%",
          left: "69%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first five touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 5 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "73%",
          left: "65%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first five touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 7 ? "visible" : ""}`}
        style={{
          width: "80px",
          height: "80px",
          top: "71.5%",
          left: "29.5%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--main-ring-color)", // var(--main-ring-color) color for the first five touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 2 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "20%",
          left: "45%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 4 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "40%",
          left: "69%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 6 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "73%",
          left: "65%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last four touchpoints
        }}
      ></div>
      <div
        className={`touchpoint ${visiblePoints > 8 ? "visible" : ""}`}
        style={{
          width: "50px",
          height: "50px",
          top: "71.5%",
          left: "29.5%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--secondary-ring-color)", // var(--secondary-ring-color) color for the last four touchpoints
        }}
      ></div>
    </>)

  }

  return (
    <div className="la-container relative flex flex-col items-center justify-center h-screen">
      <ChangeThemeFB />
      <div className=" w-full justify-center items-center h-fit relative">
        <div className="flex flex-col items-center justify-center">

          {/* Header */}
          <h1 className="w-fit">Let's Learn Number {numberList[currentNumberIndex]}</h1>

          <div className="number-container">
            {/* Styled Number */}
            <div className="number">{numberList[currentNumberIndex]}</div>
            {numberPointsSnippets[numberList[currentNumberIndex]]}
          </div>

          {/* Learn Button */}
          <button className="learn-button" onClick={handleLearnClick}>
            Let's Learn
          </button>
        </div>

        {/* Practice Button */}
        <button className="practice-button" onClick={handlePracticeClick}>
          Practice
        </button>
        {/* Next Button */}
        <div>
          <button className={`next-button ${currentNumberIndex + 1 < numberList.length ? 'flex' : 'hidden'}`} onClick={handleNextClick}>
            Next
          </button>
          <button className={`next-button ${currentNumberIndex + 1 < numberList.length ? 'hidden' : 'flex'}`} onClick={handleFinish}>
            Finish
          </button>
        </div>
      </div>


    </div>
  );
};

export default Number0;
