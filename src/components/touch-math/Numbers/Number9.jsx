import React, { useState, useEffect } from 'react';

const Number9 = ({ highlightedTouchPoint }) => {
  const [touchPoints, setTouchPoints] = useState([true, true, true, true, true, true, true, true, true]);

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  return (
    <svg width="200" height="300" viewBox="0 0 200 300">
      {/* Number "9" */}
      <text x="50" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2">
        9
      </text>

      {/* Larger Touch Points (First 5) */}
      {[{ cx: 74.5, cy: 100 }, { cx: 120, cy: 32 }, { cx: 165.5, cy: 90 }, { cx: 160, cy: 160 }, { cx: 75, cy: 164 }].map((pos, index) => (
        <circle
          key={index}
          cx={pos.cx}
          cy={pos.cy}
          r={12}
          fill={index === highlightedTouchPoint ? "#FFD700" : "#c27e00"}
          onClick={() => handleTouch(index)}
        />
      ))}

      {/* Smaller Touch Points (Next 4) */}
      {[{ cx: 120, cy: 32 }, { cx: 165.5, cy: 90 }, { cx: 160, cy: 160 }, { cx: 75, cy: 164 }].map((pos, index) => (
        <circle
          key={index + 5}
          cx={pos.cx}
          cy={pos.cy}
          r={8}
          fill={index + 5 === highlightedTouchPoint ? "#f56342" : "#FF0000"}
          onClick={() => handleTouch(index + 5)}
        />
      ))}
    </svg>
  );
};

export default Number9;
