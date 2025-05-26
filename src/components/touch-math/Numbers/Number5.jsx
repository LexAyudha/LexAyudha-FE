import React, { useState } from 'react';

const Number5 = ({ highlightedTouchPoint }) => {
  const [touchPoints, setTouchPoints] = useState([true, true, true, true, true]);

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  return (
    <svg width="200" height="300" viewBox="0 0 200 300">
      {/* Number "5" */}
      <text x="50" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2">
        5
      </text>

      {/* Touch Points */}
      {touchPoints.map((isActive, index) => (
        <circle
          key={index}
          cx={index === 0 ? 170 : index === 1 ? 89.5 : index === 2 ? 76 : index === 3 ? 166.5 : 72.5}
          cy={index === 0 ? 34.5 : index === 1 ? 34.5 : index === 2 ? 108 : index === 3 ? 150 : 157}
          r={12}
          fill={index === highlightedTouchPoint ? "#c27e00" : "#FFD700" }
          onClick={() => handleTouch(index)}
        />
      ))}
    </svg>
  );
};

export default Number5;
