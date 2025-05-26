import React, { useEffect, useState } from "react";
import EmotionDetection from "./EmotionDetection";

export default function EmotionDetectionButton({ onModalAction, number }) {
  const [startDetection, setStartDetection] = useState(false);
  const [emotionData, setEmotionData] = useState(null);
  const [disablePopup, setDisablePopup] = useState(false); // Prevent modal reappearing
  const [userId, setUserId] = useState(0);

  const handleStopDetection = async () => {
    setStartDetection(false);
    
    // Send reset request to the backend
    try {
      const response = await fetch("http://localhost:8005/emotion/reset", {
        method: "POST",
        headers: {
          'Student-Id': userId,
          'Activity-Id': "2468"
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset emotion data');
      }

      const data = await response.json();
      console.log('Emotion data reset successfully:', data);
    } catch (error) {
      console.error('Error resetting emotion data:', error);
    }
  };

  const handleEmotionData = (data) => {
    setEmotionData(data);
  };

  useEffect(() => {
    const user = localStorage.getItem("userId");
    setUserId(user);
  }, []);
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
        onClick={() => {
          if (startDetection) {
            handleStopDetection();
          } else {
            setStartDetection(true);
          }
        }}
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
          studentId={userId}
          activityId="2468"
        />
      )}
    </div>
  );
}
