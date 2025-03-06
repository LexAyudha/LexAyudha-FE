import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../../../assets/TeachNumber.css";
import ChangeThemeFB from "../../changeThemeFB";

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const Number0 = () => {
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
    // Pronounce the number
    speakNumber(numberList[currentNumberIndex]);
  };

  const handleNextClick = () => {
    if (currentNumberIndex + 1 < numberList.length) {
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
