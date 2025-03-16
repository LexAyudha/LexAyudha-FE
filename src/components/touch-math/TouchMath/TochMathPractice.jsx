import React, { useState, useEffect } from "react";

const TouchMathPractice = () => {
  const number = 3; // Number being practiced
  const expectedPronunciations = ["one", "two", "three"]; // Expected sequence
  const [currentPoint, setCurrentPoint] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [capturedAudio, setCapturedAudio] = useState("");

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const RecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new RecognitionAPI();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setMessage("🎤 Listening...");
        setCapturedAudio(""); // Clear previous audio
      };

      recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
        
        console.log("User said:", spokenWord);
        setCapturedAudio(spokenWord); // Capture the audio

        if (spokenWord == expectedPronunciations[currentPoint - 1]) {
          setMessage(`✅ Correct! "${spokenWord}" recognized.`);
          setCurrentPoint((prev) => prev + 1);
        } else {
          setMessage(`❌ Try again! You said "${spokenWord}", but expected "${expectedPronunciations[currentPoint - 1]}"`);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setMessage("⚠️ Error recognizing speech. Make sure your mic is allowed.");
      };

      recognition.onend = () => {
        setIsListening(false);
    
      };

      setSpeechRecognition(recognition);
    } else {
      setMessage("❌ Speech Recognition not supported. Try Chrome.");
    }
  }, [currentPoint, capturedAudio]);

  const toggleRecognition = () => {
    if (!speechRecognition) return;
    if (isListening) {
      speechRecognition.stop();
    } else {
      speechRecognition.start();
    }
  };

  const handleNextClick = () => {
    if (currentPoint <= expectedPronunciations.length) {
      setMessage(""); // Clear previous message
      setCurrentPoint(currentPoint + 1); // Move to next point
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-5xl font-bold">Touch Math Practice</h2>

      <div className="relative text-[30rem] font-bold mt-0 mb-2">
        {number}
        <div className="absolute top-0 left-8">
            {currentPoint >= 1 && <span className="text-red-500 text-6xl">•</span>}
        </div>
        <div className="absolute top-4 left-16">
            {currentPoint >= 2 && <span className="text-red-500 text-6xl">•</span>}
        </div>
        <div className="absolute top-8 left-24">
            {currentPoint >= 3 && <span className="text-red-500 text-6xl">•</span>}
        </div>
      </div>

      {currentPoint <= expectedPronunciations.length ? (
        <>
          {/* Mic Button */}
          <button
            onClick={toggleRecognition}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${isListening ? "bg-red-500" : "bg-gray-300"}`}
          >
            🎤
          </button>

          {/* Voice Wave Animation */}
          {isListening && (
            <div className="mt-3 animate-pulse">
              <div className="h-1 w-16 bg-blue-500 rounded-full mb-1"></div>
              <div className="h-1 w-12 bg-blue-400 rounded-full mb-1"></div>
              <div className="h-1 w-8 bg-blue-300 rounded-full"></div>
            </div>
          )}

          <p className="mt-2 text-gray-700">{message}</p>

          {/* Show Next Button after correct pronunciation */}
          {message.includes("✅ Correct") && currentPoint <= expectedPronunciations.length && (
            <button
              onClick={handleNextClick}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Next
            </button>
          )}
        </>
      ) : (
        <p className="text-green-600 font-bold">🎉 Great Job! You completed the touch points.</p>
      )}
    </div>
  );
};

export default TouchMathPractice;