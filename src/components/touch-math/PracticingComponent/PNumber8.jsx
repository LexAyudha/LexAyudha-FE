import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom';

const Number8 = () => {
  // Initialize 8 touch points (false means not touched yet)
  const [touchPoints, setTouchPoints] = useState([false, false, false, false, false, false, false, false]);
  const navigate = useNavigate();

  // Correct pattern for all 8 touch points
  const correctPattern = [true, true, true, true, true, true, true, true];

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
          Mark the touchpoints for number 8
        </p>
      </div>

      <div>
        <svg width="800" height="600" viewBox="0 0 200 200">
          {/* Number "8" */}
          <text x="50" y="150" fontSize="200" fontFamily="Arial" fill="#0041c2">8</text>

          {/* 7 Touch Points on the number "8" */}
          {touchPoints.map((active, index) => (
            <circle
              key={index}
              cx={
                index === 0 ? 73 :  // First touch point (top line)
                index === 1 ? 135 :  // Second touch point (top line middle)
                index === 2 ? 67 :   // Third touch point (top line left)
                index === 3 ? 142 :  // Fourth touch point (middle line right)
                index === 4 ? 73 :  // Fifth touch point (middle line left)
                index === 5 ? 135 :   // Sixth touch point (bottom line left)
                index === 6 ? 67 :
                142                    // Seventh touch point (bottom line)
              }
              cy={
                index === 0 ? 40 :   // Top right corner
                index === 1 ? 40 :   // Top line middle
                index === 2 ? 110 :   // Top line left
                index === 3 ? 110 :   // Middle line right
                index === 4 ? 40 :   // Middle line left
                index === 5 ? 40 :  // Bottom left
                index === 6 ? 110 :
                110                   // Bottom right
              }
              r={
                index < 4 ? 13 : 8 // 4 points with radius 13, 3 points with radius 9
              }
              fill={
                index < 4 ? (active ? "#FFD700" : "#0041c2") : (active ? "red" : "#0041c2" ) // Different colors for two point types #FFD700 #008000
              }
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
            onClick={() => navigate('/touch-math/quiz_number9')}
            className="pnext-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Number8;
