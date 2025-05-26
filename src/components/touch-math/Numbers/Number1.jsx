import React, { useState } from 'react';

const Number1 = ({ highlightedTouchPoint }) => {
  const [touchPoints, setTouchPoints] = useState([true]);

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  return (
    <svg width="200" height="300" viewBox="0 0 200 300">
      {/* Number "1" */}
      <text x="70" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2">
        1
      </text>

      {/* Touch Point */}
      {touchPoints.map((isActive, index) => (
        <circle
          key={index}
          cx={155} cy={30} r={12}
          fill={index === highlightedTouchPoint ? "#c27e00" : "#FFD700" }
          onClick={() => handleTouch(index)}
        />
      ))}
    </svg>
  );
};

export default Number1;
