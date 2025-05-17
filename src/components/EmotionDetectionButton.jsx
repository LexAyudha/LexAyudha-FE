import React, { useState } from "react";
import EmotionDetection from "./EmotionDetection";

export default function EmotionDetectionButton({ onModalAction, number }) {
  const [startDetection, setStartDetection] = useState(false);
  const [emotionData, setEmotionData] = useState(null);
  const [disablePopup, setDisablePopup] = useState(false); // Prevent modal reappearing

  const handleStopDetection = () => {
    setStartDetection(false);
  };

  const handleEmotionData = (data) => {
    setEmotionData(data);
  };

  // Handle when the user dismisses the modal
  const handleModalAction = (value) => {
    if (value) {
      setDisablePopup(true); // Disable the popup after clicking hint or "Noo, I got this!"
    }
    onModalAction?.(value);
  };

  return (
    <div>
      <button
        className="hover:bg-[var(--background-color)] bg-[var(--primary-color)] duration-300 transition border-2 border-[var(--text-color)] px-4 py-2 rounded-md mt-4"
        onClick={() => setStartDetection((prev) => !prev)}
      >
        {startDetection ? "Stop Emotion Monitor" : "Start With Emotion Monitor"}
      </button>

      {startDetection && (
        <EmotionDetection
          startDetection={startDetection}
          onStopDetection={handleStopDetection}
          onEmotionData={handleEmotionData}
          onModalAction={handleModalAction}
          disablePopup={disablePopup} // Pass disablePopup to EmotionDetection
          number={number}
          studentId="12345678"
          activityId="2468"
        />
      )}
    </div>
  );
}
