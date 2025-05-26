import React, { useState } from 'react';

const Number3 = ({ highlightedTouchPoint }) => {
  const [touchPoints, setTouchPoints] = useState([true, true, true]);

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  return (
    <svg width="200" height="300" viewBox="0 0 200 300">
      {/* Number "3" */}
      <text x="50" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2">
        3
      </text>

      {/* Touch Points */}
      {touchPoints.map((isActive, index) => (
        <circle
          key={index}
          cx={index === 0 ? 75 : index === 1 ? 110 : 72}
          cy={index === 0 ? 64 : index === 1 ? 106 : 156}
          r={12}
          fill={index === highlightedTouchPoint ? "#c27e00" : "#FFD700" }
          onClick={() => handleTouch(index)}
        />
      ))}
    </svg>
  );
};

export default Number3;
