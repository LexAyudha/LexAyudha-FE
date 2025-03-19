// EmotionDetectionButton.jsx
import React, { useState } from "react";
import EmotionDetection from "./EmotionDetection";

export default function EmotionDetectionButton({ onModalAction }) {
  const [startDetection, setStartDetection] = useState(false);
  const [emotionData, setEmotionData] = useState(null);

  const handleStopDetection = () => {
    setStartDetection(false);
  };

  const handleEmotionData = (data) => {
    setEmotionData(data);
  };

  console.log("emotin from button", emotionData);
  return (
    <div>
      <button
        className="hover:bg-[var(--background-color)] bg-[var(--primary-color)] duration-300 transition border-2 border-[var(--text-color)] px-4 py-2 rounded-md mt-4"
        onClick={() => setStartDetection((prev) => !prev)}
      >
        {startDetection ? "Stop Emotion Detection" : "Start Emotion Detection"}
      </button>

      {startDetection && (
        <EmotionDetection
          startDetection={startDetection}
          onStopDetection={handleStopDetection}
          onEmotionData={handleEmotionData}
          onModalAction={onModalAction}
        />
      )}
    </div>
  );
}
