import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom';

const Number4 = () => {
  // Initialize 4 touch points (false means not touched yet)
  const [touchPoints, setTouchPoints] = useState([false, false, false, false]);
  const navigate = useNavigate();

  // Correct pattern for all 4 touch points
  const correctPattern = [true, true, true, true];

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  const checkProgress = () => {
    if (JSON.stringify(touchPoints) === JSON.stringify(correctPattern)) {
      Swal.fire({
        title: 'Well done!',
        text: 'You marked all the correct touch points.',
        icon: 'success',
        confirmButtonText: 'Great!'
      });
    } else {
      Swal.fire({
        title: 'Try again!',
        text: 'Some points are missing.',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
  };

  return (
    <div>
      <div>
        <p style={{ fontFamily: 'Comic Sans', color: '#000', fontSize: '48px', textAlign: 'center' }}>
          Mark the touchpoints for number 4
        </p>
      </div>

      <div>
        <svg width="800" height="600" viewBox="0 0 200 200">
          {/* Number "4" */}
          <text x="35" y="150" fontSize="200" fontFamily="Arial" fill="#0041c2">4</text>

          {/* 4 Touch Points on the number "4" */}
          {touchPoints.map((active, index) => (
            <circle
              key={index}
              cx={
                index === 0 ? 108.5 :  // Top left vertical line of 4
                index === 1 ? 108.5 : // Top right horizontal line of 4
                index === 2 ? 46.5 :  // Middle left vertical line of 4
                108.5                  // Bottom right of 4
              }
              cy={
                index === 0 ? 18 :  // Top vertical line
                index === 1 ? 107 :  // Top horizontal line
                index === 2 ? 105 : // Bottom vertical line
                139                 // Bottom horizontal line
              }
              r={14} // Radius of the touch point
              fill={active ? "#FFD700" : "#0041c2"} // Golden when active
              onClick={() => handleTouch(index)}
            />
          ))}
        </svg>

        <div className="button-container">
          <button 
            onClick={checkProgress}
            className="check-answer-button"
          >
            Check Answer
          </button>

          <button
            onClick={() => navigate('/touch-math/quiz_number5')}
            className="pnext-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Number4;
