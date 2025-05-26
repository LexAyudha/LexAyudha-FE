import React, { useState } from 'react';

const Number6 = ({ highlightedTouchPoint }) => {
  const [touchPoints, setTouchPoints] = useState([true, true, true, true, true, true]);

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  return (
    <svg width="200" height="300" viewBox="0 0 200 300">
      {/* Number "6" */}
      <text x="50" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2">
        6
      </text>

      {/* Large Touch Points (First 3) */}
      {touchPoints.slice(0, 3).map((isActive, index) => (
        <circle
          key={index}
          cx={index === 0 ? 162.9 : index === 1 ? 73 : 123}
          cy={index === 0 ? 61 : index === 1 ? 134 : 194}
          r={12}
          fill={index === highlightedTouchPoint ? "#c27e00" : "#FFD700" }
          onClick={() => handleTouch(index)}
        />
      ))}

      {/* Small Touch Points (Next 3) */}
      {touchPoints.slice(3, 6).map((isActive, index) => (
        <circle
          key={index + 3}
          cx={index === 0 ? 162.9 : index === 1 ? 73 : 123}
          cy={index === 0 ? 61 : index === 1 ? 134 : 194}
          r={7}
          fill={index + 3 === highlightedTouchPoint ? "#f56342" : "#FF0000"}
          onClick={() => handleTouch(index + 3)}
        />
      ))}
    </svg>
  );
};

export default Number6;
