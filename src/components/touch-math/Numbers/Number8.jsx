import React, { useState } from 'react';

const Number8 = ({ highlightedTouchPoint }) => {
  const [touchPoints, setTouchPoints] = useState([true, true, true, true, true, true, true, true]);

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  return (
    <svg width="200" height="300" viewBox="0 0 200 300">
      {/* Number "8" */}
      <text x="50" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2">
        8
      </text>

      {/* Large Touch Points (First 4) */}
      {touchPoints.slice(0, 4).map((isActive, index) => (
        <circle
          key={index}
          cx={index === 0 ? 79 : index === 1 ? 159.5 : index === 2 ? 72 : 166.5}
          cy={index === 0 || index === 1 ? 65 : 153}
          r={12}
          fill={index === highlightedTouchPoint ? "#c27e00" : "#FFD700"}
          onClick={() => handleTouch(index)}
        />
      ))}

      {/* Small Touch Points (Next 4) */}
      {touchPoints.slice(4, 8).map((isActive, index) => (
        <circle
          key={index + 4}
          cx={index === 0 ? 79 : index === 1 ? 159.5 : index === 2 ? 72 : 166.5}
          cy={index === 0 || index === 1 ? 65 : 153}
          r={7}
          fill={index + 4 === highlightedTouchPoint ? "#f56342" : "#FF0000"}
          onClick={() => handleTouch(index + 4)}
        />
      ))}
    </svg>
  );
};

export default Number8;
