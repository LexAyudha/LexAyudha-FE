import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../../../assets/TeachNumber.css"; 

const Number7 = () => {
  const [visiblePoints, setVisiblePoints] = useState(0); // To track the number of visible touchpoints
  const [intervalRunning, setIntervalRunning] = useState(false); // Prevent multiple intervals
  const [voices, setVoices] = useState([]); // Store available voices
  const [femaleVoice, setFemaleVoice] = useState(null); // Store selected female voice
  const navigate = useNavigate(); // Hook for navigation

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

  }, []);

  const handleLearnClick = () => {
    if (intervalRunning) return; // Prevent multiple intervals from starting
    setIntervalRunning(true);

    let currentPoint = 0;

    // Synchronize the first point immediately
    currentPoint++;
    setVisiblePoints(currentPoint);
    speakNumber(currentPoint);

    // Start interval for the remaining points
    const interval = setInterval(() => {
      if (currentPoint < 7) {
        currentPoint++;
        setVisiblePoints(currentPoint);
        speakNumber(currentPoint); // Pronounce the corresponding number
      } else {
        clearInterval(interval); // Stop the interval when all points are shown
        setIntervalRunning(false); // Reset the interval flag
      }
    }, 1000); // Interval of 1 second for subsequent actions
  };

  const handleNextClick = () => {
    navigate("/teaching_number8"); // Navigate to teaching_number8 component
  };

  const handlePracticeClick = () => {
    navigate("/practice_number7"); // Navigate to /practice_number7 for practice
  };

  // Function to handle text-to-speech with a female voice
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

  return (
    <div className="app">

      {/* Header */}
      <h1>Let's Learn Number 7</h1>

      {/* Practice Button */}
      <button className="practice-button" onClick={handlePracticeClick}>
        Practice
      </button>
      
      <div className="number-container">
        {/* Styled Number */}
        <div className="number">7</div>

        {/* Large Touchpoints (First Four) */}
        <div
          className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
          style={{
            width: "80px",
            height: "80px",
            top: "20%",
            left: "25%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "yellow", // yellow color for the first four touchpoints
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
            backgroundColor: "yellow", // yellow color for the first four touchpoints
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
            backgroundColor: "yellow", // yellow color for the first four touchpoints
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
            backgroundColor: "yellow", // yellow color for the first four touchpoints
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
            backgroundColor: "red", // red color for the last three touchpoints
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
            backgroundColor: "red", // red color for the last three touchpoints
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
            backgroundColor: "red", // red color for the last three touchpoints
          }}
        ></div>
      </div>

      {/* Learn Button */}
      <button className="learn-button" onClick={handleLearnClick}>
        Let's Learn
      </button>

      {/* Next Button */}
      <button className="next-button" onClick={handleNextClick}>
        Next
      </button>
    </div>
  );
};

export default Number7;
