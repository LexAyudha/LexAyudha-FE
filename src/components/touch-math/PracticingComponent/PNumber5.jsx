import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Number5 = () => {
  const [touchPoints, setTouchPoints] = useState([false, false, false, false, false]);
  const navigate = useNavigate(); // Initialize navigation

  const correctPattern = [true, true, true, true, true];

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
          Mark the touchpoints for number 5
        </p>
      </div>

      <div>
        <svg width="800" height="600" viewBox="0 0 200 200">
          {/* Number "5" */}
          <text x="50" y="150" fontSize="200" fontFamily="Arial" fill="#0041c2">5</text>

          {/* 5 Touch Points on the number "5" */}
          {touchPoints.map((active, index) => (
            <circle
              key={index}
              cx={
                index === 0 ? 142 :   // First touch point (top curve)
                index === 1 ? 83 :    // Second touch point (upper middle line)
                index === 2 ? 71 :    // Third touch point (middle curve)
                index === 3 ? 143 :   // Fourth touch point (lower line)
                68                    // Fifth touch point (bottom curve)
              }
              cy={
                index === 0 ? 17 :    // Adjust the y-coordinate for the top curve
                index === 1 ? 17 :    // Upper middle line
                index === 2 ? 75 :    // Middle curve
                index === 3 ? 105 :   // Lower line
                119                   // Bottom curve
              }
              r="12"
              fill={active ? "#FFD700" : "#0041c2"}
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
            onClick={() => navigate('/touch-math/quiz_number6')}
            className="pnext-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Number5;
