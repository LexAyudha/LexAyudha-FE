import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ChangeThemeFB from "../../changeThemeFB";
import AlternativeHeader from "../../alternativeHeader";

const TouchMathPractice = () => {
  const number = 3; // Number being practiced
  const expectedPronunciations = ["1.", "2.", "3."]; // Expected sequence
  const [currentPoint, setCurrentPoint] = useState(1);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  // Configure speech recognition with commands for better single word recognition
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
      command: ["one", "two", "three"],
      callback: (command) => {
        // Map word numbers to digits
        const wordToDigit = { "one": "1", "two": "2", "three": "3" };
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
    const wordToDigit = { "one": "1", "two": "2", "three": "3" };
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

  return (
    <div className="la-container h-screen flex items-center justify-center">
      <ChangeThemeFB />
      <AlternativeHeader title="Touch Math" />
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="font-bold">Touch Math Practice</h1>

        <div className="relative text-[400px] leading-[400px] font-bold mt-0 mb-2">
          <p className="arial-font h-fit">{number}</p>
          {/* Touch points */}
          <div className="absolute top-0 left-8">
            {currentPoint >= 1 && <span className="text-red-500 text-9xl arial-font">•</span>}
          </div>
          <div className="absolute top-4 left-16">
            {currentPoint >= 2 && <span className="text-red-500 text-9xl arial-font">•</span>}
          </div>
          <div className="absolute top-8 left-24">
            {currentPoint >= 3 && <span className="text-red-500 text-9xl arial-font">•</span>}
          </div>
        </div>

        {!completed ? (
          <>
            {/* Say this prompt */}
            <p className="mb-2">Say: <strong>{expectedPronunciations[currentPoint - 1]}</strong></p>
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
            <p className=" font-bold text-2xl mb-4">🎉 Great Job! You completed all touch points!</p>
            <button
              onClick={handleReset}
              className="mt-2 py-2 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Practice Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouchMathPractice;