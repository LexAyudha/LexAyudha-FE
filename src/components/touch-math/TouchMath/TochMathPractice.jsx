import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ChangeThemeFB from "../../changeThemeFB";
import AlternativeHeader from "../../alternativeHeader";

const TouchMathPractice = () => {
  // Change default number to 1
  const [number, setNumber] = useState(1); // Start with number 1
  const [currentPoint, setCurrentPoint] = useState(1);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  // Touch points configuration for each digit
  const digitConfigurations = {
    1: {
      touchPoints: 1,
      positions: [
        { top: "-58%", left: "50%", type: "primary" }
      ]
    },
    2: {
      touchPoints: 2,
      positions: [
        { top: "-48%", left: "10%", type: "primary" },
        { top: "1%", left: "70%", type: "primary" }
        
      ]
    },
    3: {
      touchPoints: 3,
      positions: [
        { top: "-48%", left: "12%", type: "primary" },
        { top: "-30%", left: "38%", type: "primary" },
        { top: "-8%", left: "10%", type: "primary" }
      ]
    },
    4: {
      touchPoints: 4,
      positions: [
        { top: "-58%", left: "57%", type: "primary" },
        { top: "-13%", left: "3%", type: "primary" },
        { top: "-13%", left: "57%", type: "primary" },
        { top: "2%", left: "57%", type: "primary" }
      ]
    },
    5: {
      touchPoints: 5,
      positions: [
        { top: "-56%", left: "70%", type: "primary" },
        { top: "-56%", left: "23%", type: "primary" },
        { top: "-30%", left: "14%", type: "primary" },
        { top: "-15%", left: "70%", type: "primary" },
        { top: "-7%", left: "12%", type: "primary" }
      ]
    },
    6: {
      touchPoints: 6,
      positions: [
        { top: "-50%", left: "67%", type: "primary" },
        { top: "-27%", left: "10%", type: "primary" },
        { top: "2%", left: "44%", type: "primary" },
        { top: "-52%", left: "70%", type: "secondary" },
        { top: "-27%", left: "12%", type: "secondary" },
        { top: "0%", left: "45%", type: "secondary" }
      ]
    },
    7: {
      touchPoints: 7,
      positions: [
        { top: "-56%", left: "7%", type: "primary" },
        { top: "-56%", left: "70%", type: "primary" },
        { top: "-25%", left: "40%", type: "primary" },
        { top: "2%", left: "28%", type: "primary" },
        { top: "-59%", left: "75%", type: "secondary" },
        { top: "-25%", left: "40%", type: "secondary" },
        { top: "0%", left: "30%", type: "secondary" }

      ]
    },
    8: {
      touchPoints: 8,
      positions: [
        { top: "-45%", left: "13%", type: "primary" },
        { top: "-45%", left: "65%", type: "primary" },
        { top: "-13%", left: "10%", type: "primary" },
        { top: "-13%", left: "70%", type: "primary" },
        { top: "-47%", left: "15%", type: "secondary" },
        { top: "-47%", left: "67%", type: "secondary" },
        { top: "-15%", left: "12%", type: "secondary" },
        { top: "-15%", left: "70%", type: "secondary" }
      ]
    },
    9: {
      touchPoints: 9,
      positions: [
        { top: "-30%", left: "13%", type: "primary" },
        { top: "-58%", left: "35%", type: "primary" },
        { top: "-33%", left: "68%", type: "primary" },
        { top: "-8%", left: "63%", type: "primary" },
        { top: "-5%", left: "12%", type: "primary" },
        { top: "-60%", left: "35%", type: "secondary" },
        { top: "-35%", left: "68%", type: "secondary" },
        { top: "-10%", left: "65%", type: "secondary" },
        { top: "-9%", left: "14%", type: "secondary" }
      ]
    }
  };

  // Generate expected pronunciations based on the number of touch points
  const getExpectedPronunciations = (num) => {
    const touchPoints = digitConfigurations[num].touchPoints;
    return Array.from({ length: touchPoints }, (_, i) => `${i + 1}.`);
  };

  // State for expected pronunciations
  const [expectedPronunciations, setExpectedPronunciations] = useState(getExpectedPronunciations(number));

  // Update expected pronunciations when number changes
  useEffect(() => {
    setExpectedPronunciations(getExpectedPronunciations(number));
    handleReset();
  }, [number]);

  // Configure speech recognition commands
  const wordToDigit = { 
    "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", 
    "six": "6", "seven": "7", "eight": "8", "nine": "9", "zero": "0"
  };

  const commands = [
    {
      command: expectedPronunciations.join(" | "), // Join all expected words with OR operator
      callback: (command) => processSpokenWord(command),
      matchInterim: false,
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.7,
    },
    // Additional number word variations for better recognition
    {
      command: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "zero"],
      callback: (command) => {
        processSpokenWord(wordToDigit[command]);
      },
      matchInterim: false,
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.7,
    }
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({ commands });

  // Process spoken word through commands or directly
  const processSpokenWord = (spokenWord) => {
    console.log("Processing word:", spokenWord);

    // Check if the spoken word matches the expected pronunciation
    if (spokenWord === expectedPronunciations[currentPoint - 1]) {
      setMessage(`✅ Correct! "${spokenWord}" recognized.`);

      // Check if all points are completed
      if (currentPoint === expectedPronunciations.length) {
        setCompleted(true);
      } else {
        handleNextPoint();
      }
    } else {
      setMessage(`❌ Try again! You said "${spokenWord}", but expected "${expectedPronunciations[currentPoint - 1]}"`);
    }
  };

  // Check validity when stopping speech recognition
  const checkValidity = () => {
    if (!transcript || !transcript.trim()) {
        setMessage("No speech detected. Try again.");
        return;
    }

    const spokenWords = transcript.trim().toLowerCase().split(/\s+/); // Split transcript into words
    console.log("User said:", spokenWords);

    // Convert word numbers to digits if needed
    const normalizedWords = spokenWords.map((word) => wordToDigit[word] || word); // Normalize words to digits

    // Check if the expected pronunciation matches any word in the transcript
    const expectedValue = expectedPronunciations[currentPoint - 1];
    if (normalizedWords.includes(expectedValue)) {
        setMessage(`✅ Correct! "${expectedValue}" recognized.`);

        // Check if all points are completed
        if (currentPoint === expectedPronunciations.length) {
            setCompleted(true);
        } else {
            handleNextPoint();
        }
    } else {
        setMessage(`❌ Try again! You said "${transcript}", but expected "${expectedValue}".`);
    }

    // Reset transcript for next input
    resetTranscript();
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      checkValidity();
      // Don't clear the message here as checkValidity sets it
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ 
        language: 'en-US', 
        continuous: true, 
        interimResults: false,
        maxAlternatives: 1
      });
      setMessage("Listening...");
    }
  };

  // Move to next point
  const handleNextPoint = () => {
    if (currentPoint < expectedPronunciations.length) {
      setCurrentPoint(currentPoint + 1);
      setMessage("");
      resetTranscript();
    }
  };

  // Reset the exercise
  const handleReset = () => {
    setCurrentPoint(1);
    setMessage("");
    setCompleted(false);
    resetTranscript();
  };

  // Handle number selection
  const handleNumberChange = (num) => {
    setNumber(num);
  };

  // Handle moving to the next number
  const handleNextNumber = () => {
    // Move to the next number (0-9)
    const nextNumber = (number + 1) % 10;
    setNumber(nextNumber === 0 ? 1 : nextNumber); // Skip 0, go to 1 instead
    setCompleted(false);
  };

  // Render fallback for unsupported browsers
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="la-container flex items-center justify-center">
        <ChangeThemeFB />
        <AlternativeHeader title="Touch Math" />
        <div className="flex flex-col items-center p-4">
          <h1 className="font-bold">Touch Math Practice</h1>
          <p className="text-red-500 mt-4">❌ Speech Recognition not supported. Please try Chrome browser.</p>
        </div>
      </div>
    );
  }

  // Render fallback for microphone permission issues
  if (!isMicrophoneAvailable) {
    return (
      <div className="la-container flex items-center justify-center">
        <ChangeThemeFB />
        <AlternativeHeader title="Touch Math" />
        <div className="flex flex-col items-center p-4">
          <h1 className="font-bold">Touch Math Practice</h1>
          <p className="text-red-500 mt-4">⚠️ Microphone access is needed. Please allow microphone permission.</p>
        </div>
      </div>
    );
  }

  // Helper function to generate position style from position object
  const getPositionStyle = (position) => {
    const style = {};
    for (const [key, value] of Object.entries(position)) {
      if (key !== 'type') { // Skip the 'type' property
        style[key] = typeof value === 'number' ? `${value}px` : value;
      }
    }
    return style;
  };

  // Helper to get point class based on type
  const getPointClass = (type) => {
    if (type === "primary") {
      return "text-red-500 text-9xl arial-font";
    } else {
      return "text-blue-500 text-8xl arial-font"; // Secondary points are blue and smaller
    }
  };

  return (
    <div className="la-container h-screen flex items-center justify-center">
      <ChangeThemeFB />
      <AlternativeHeader title="Touch Math" />
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="font-bold">Touch Math Practice</h1>

        {/* Current Number Display */}
        <div className="text-2xl font-bold mt-2 mb-4">
          Currently practicing: Number {number}
        </div>

        {/* Number Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button 
              key={num}
              onClick={() => handleNumberChange(num)}
              className={`w-10 h-10 flex items-center justify-center rounded-md transition duration-300 ${
                number === num 
                  ? "bg-blue-500 text-white" 
                  : "bg-[var(--background-color)] border border-[var(--text-color)] hover:bg-[var(--primary-color)]"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="relative text-[400px] leading-[400px] font-bold mt-0 mb-0">
          <p className="arial-font h-fit">{number}</p>
          {/* Touch points with different colors and sizes based on type */}
          {digitConfigurations[number].positions.map((position, index) => (
            <div 
              key={index} 
              className="absolute" 
              style={getPositionStyle(position)}
            >
              {currentPoint > index && (
                <span className={getPointClass(position.type)}>•</span>
              )}
            </div>
          ))}
        </div>

        {!completed ? (
          <>
            {/* Say this prompt */}
            <p className="mb-0">Say: <strong>{expectedPronunciations[currentPoint - 1]}</strong></p>
            <p>{listening && !transcript ? 'Capturing your voice...':''}</p>
            <p>{transcript ?  `You said ${transcript}` : ''}</p>
            {/* Mic Button */}
            <button
              onClick={toggleListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-[var(--text-color)] transition duration-300 ${listening ? "bg-red-800 hover:bg-red-500" : "bg-[var(--background-color)] hover:bg-[var(--primary-color)]"} cursor-pointer`}
              disabled={completed}
            >
              🎤
            </button>

            {/* Voice Wave Animation */}
            {listening && (
              <div className="mt-3 flex flex-col items-center">
                <div className="h-1 w-16 bg-blue-500 rounded-full mb-1 animate-pulse"></div>
                <div className="h-1 w-12 bg-blue-400 rounded-full mb-1 animate-pulse"></div>
                <div className="h-1 w-8 bg-blue-300 rounded-full animate-pulse"></div>
              </div>
            )}

            {/* Feedback message */}
            <p className="mt-4 text-lg">{message}</p>

            {/* Next button appears after correct pronunciation */}
            {message.includes("✅ Correct") && !completed && (
              <button
                onClick={handleNextPoint}
                className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Next
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center">
            <p className="font-bold text-2xl mb-4">🎉 Great Job! You completed all touch points!</p>
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="mt-2 py-2 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Practice Again
              </button>
              <button
                onClick={handleNextNumber}
                className="mt-2 py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Next Number ({(number + 1) % 10 === 0 ? 1 : (number + 1) % 10})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouchMathPractice;