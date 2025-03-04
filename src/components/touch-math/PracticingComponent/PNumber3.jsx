import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom';

const Number3 = () => {
  // Initialize 3 touch points (false means not touched yet)
  const [touchPoints, setTouchPoints] = useState([false, false, false]);
  const navigate = useNavigate();

  // Correct pattern for all 3 touch points
  const correctPattern = [true, true, true];

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
          Mark the touchpoints for number 3
        </p>
      </div>

      <div>
        <svg width="800" height="600" viewBox="0 0 200 200">
          {/* Number "3" */}
          <text x="35" y="150" fontSize="200" fontFamily="Arial" fill="#0041c2">3</text>

          {/* 3 Touch Points on the number "3" */}
          {touchPoints.map((active, index) => (
            <circle
              key={index}
              cx={
                index === 0 ? 55 :  // Top curve of 3
                index === 1 ? 90 :  // Middle curve
                55                    // Bottom curve of 3
              }
              cy={
                index === 0 ? 40 :  // Top curve
                index === 1 ? 75 :  // Middle curve
                120                  // Bottom curve
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
            onClick={() => navigate('/touch-math/quiz_number4')}
            className="pnext-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Number3;
