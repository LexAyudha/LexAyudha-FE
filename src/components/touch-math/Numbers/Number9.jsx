import React, { useState } from 'react';

const Number9 = ({ onTouchPointChange }) => {
  const [touchPoints, setTouchPoints] = useState([true, true, true, true, true, true, true, true, true]);

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);

    if (onTouchPointChange) {
      onTouchPointChange(updatedPoints);
    }
  };

  return (
    <svg width="200" height="300" viewBox="0 0 200 300">
      {/* Number "9" */}
      <text x="50" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2">
        9
      </text>

      {/* Larger Touch Points (First 5) */}
      <circle cx={74.5} cy={100} r={12} fill={touchPoints[0] ? "#FFD700" : "#0041c2"} onClick={() => handleTouch(0)} />
      <circle cx={120} cy={32} r={12} fill={touchPoints[1] ? "#FFD700" : "#0041c2"} onClick={() => handleTouch(1)} />
      <circle cx={165.5} cy={90} r={12} fill={touchPoints[2] ? "#FFD700" : "#0041c2"} onClick={() => handleTouch(2)} />
      <circle cx={160} cy={160} r={12} fill={touchPoints[3] ? "#FFD700" : "#0041c2"} onClick={() => handleTouch(3)} />
      <circle cx={75} cy={164} r={12} fill={touchPoints[4] ? "#FFD700" : "#0041c2"} onClick={() => handleTouch(4)} />

      {/* Smaller Touch Points (Next 4) */}
      <circle cx={120} cy={32} r={8} fill={touchPoints[5] ? "#FF0000" : "#0041c2"} onClick={() => handleTouch(5)} />
      <circle cx={165.5} cy={90} r={8} fill={touchPoints[6] ? "#FF0000" : "#0041c2"} onClick={() => handleTouch(6)} />
      <circle cx={160} cy={160} r={8} fill={touchPoints[7] ? "#FF0000" : "#0041c2"} onClick={() => handleTouch(7)} />
      <circle cx={75} cy={164} r={8} fill={touchPoints[8] ? "#FF0000" : "#0041c2"} onClick={() => handleTouch(8)} />
    </svg>
  );
};

export default Number9;
