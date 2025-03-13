import React, { useState } from 'react';

const Number7 = ({ highlightedTouchPoint }) => {
  const [touchPoints, setTouchPoints] = useState([true, true, true, true, true, true, true]);

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  return (
    <svg width="200" height="300" viewBox="0 0 200 300">
      {/* Number "7" */}
      <text x="50" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2">
        7
      </text>

      {/* Large Touch Points (First 4) */}
      {touchPoints.slice(0, 4).map((isActive, index) => (
        <circle
          key={index}
          cx={index === 0 ? 68 : index === 1 ? 169 : index === 2 ? 121 : 99}
          cy={index === 0 ? 34 : index === 1 ? 33 : index === 2 ? 110 : 200}
          r={12}
          fill={index === highlightedTouchPoint ? "#FFD700" : "#c27e00"}
          onClick={() => handleTouch(index)}
        />
      ))}

      {/* Small Touch Points (Next 3) */}
      {touchPoints.slice(4, 7).map((isActive, index) => (
        <circle
          key={index + 4}
          cx={index === 0 ? 169 : index === 1 ? 121 : 99}
          cy={index === 0 ? 33 : index === 1 ? 110 : 200}
          r={7}
          fill={index + 4 === highlightedTouchPoint ? "#f56342" : "#FF0000"}
          onClick={() => handleTouch(index + 4)}
        />
      ))}
    </svg>
  );
};

export default Number7;
