import React, { useState } from 'react';

const Number0 = ({ onTouchPointChange }) => {
  const [touchPoints, setTouchPoints] = useState([false, false]);

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
      {/* Number "0" */}
      <text x="50" y="200" fontSize="250" fontFamily="Arial" fill="#0041c2" className='theme-text-color'>
        0
      </text>

    </svg>
  );
};

export default Number0;
