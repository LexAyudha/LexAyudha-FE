import React, { useState } from "react";
import EmotionDetection from "./EmotionDetection";

export default function EmotionDetectionButton() {
  const [startDetection, setStartDetection] = useState(false);

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
        onClick={() => setStartDetection((prev) => !prev)}
      >
        {startDetection ? "Stop Emotion Detection" : "Start Emotion Detection"}
      </button>

      {startDetection && <EmotionDetection startDetection={startDetection} />}
    </div>
  );
}
