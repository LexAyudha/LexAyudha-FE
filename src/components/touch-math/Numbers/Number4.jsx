import React, { useState } from 'react';

const Number4 = ({ highlightedTouchPoint }) => {
  const [touchPoints, setTouchPoints] = useState([true, true, true, true]);

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  return (
    <svg width="200" height="300" viewBox="0 0 200 300">
      <text x="50" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2">
        4
      </text>
      {/* Touch Points */}
      {touchPoints.map((isActive, index) => (
        <circle
          key={index}
          cx={index === 0 ? 143.5 : index === 1 ? 60 : index === 2 ? 142 : 142}
          cy={index === 0 ? 29 : index === 1 ? 147 : index === 2 ? 147 : 194}
          r={12}
          fill={index === highlightedTouchPoint ? "#FFD700" : "#c27e00"}
          onClick={() => handleTouch(index)}
        />
      ))}
    </svg>
  );
};

export default Number4;
