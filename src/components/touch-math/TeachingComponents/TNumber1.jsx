import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../../Style/TeachNumber.css"; 

const Number1 = () => {
  const [visiblePoints, setVisiblePoints] = useState(0); // To track the number of visible touchpoints
  const [intervalRunning, setIntervalRunning] = useState(false); // Prevent multiple intervals
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

    // Synchronize the first point immediately
    setVisiblePoints(1);
    speakNumber(1);

    // Reset interval-running flag after pronunciation
    setTimeout(() => {
      setIntervalRunning(false); // Allow button to be clicked again
    }, 1000); // Adjust duration to match speech time
  };

  const handleNextClick = () => {
    navigate("/teaching_number2"); // Navigate to teaching_number2 component
  };

  const handlePracticeClick = () => {
    navigate("/practice_number1"); // Navigate to /practice_number1 for practice
  };

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

  return (
    <div className="app">

      {/* Header */}
      <h1>Let's Learn Number 1</h1>

      {/* Practice Button */}
      <button className="practice-button" onClick={handlePracticeClick}>
        Practice
      </button>

      <div className="number-container">
        {/* Styled Number */}
        <div className="number">1</div>

        {/* Single Touchpoint */}
        <div
          className={`touchpoint ${visiblePoints > 0 ? "visible" : ""}`}
          style={{ top: "18%", left: "57%", transform: "translate(-50%, -50%)" }}
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

export default Number1;
