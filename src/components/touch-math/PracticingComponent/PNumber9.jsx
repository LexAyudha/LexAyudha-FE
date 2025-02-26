import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom';

const Number9 = () => {
  // Initialize 9 touch points (false means not touched yet)
  const [touchPoints, setTouchPoints] = useState([false, false, false, false, false, false, false, false, false]);
  const navigate = useNavigate();

  // Correct pattern for all 7 touch points
  const correctPattern = [true, true, true, true, true, true, true, true, true];

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
          Mark the touchpoints for number 9
        </p>
      </div>

      <div>
        <svg width="800" height="600" viewBox="0 0 200 200">
          {/* Number "9" */}
          <text x="50" y="150" fontSize="200" fontFamily="Arial" fill="#0041c2">9</text>

          {/* 7 Touch Points on the number "9" */}
          {touchPoints.map((active, index) => (
            <circle
              key={index}
              cx={
                index === 0 ? 70 :  // First touch point (top line)
                index === 1 ? 100 :  // Second touch point (top line middle)
                index === 2 ? 140 :   // Third touch point (top line left)
                index === 3 ? 136 :  // Fourth touch point (middle line right)
                index === 4 ? 70 :  // Fifth touch point (middle line left)
                index === 5 ? 100 :   // Sixth touch point (bottom line left)
                index === 6 ? 140 :
                index === 7 ? 70 :
                136                    // Seventh touch point (bottom line)
              }
              cy={
                index === 0 ? 70 :   
                index === 1 ? 15 :   
                index === 2 ? 50 :   
                index === 3 ? 122 :   
                index === 4 ? 125 :   
                index === 5 ? 15 :  
                index === 6 ? 50 :
                index === 7 ? 125 :
                122                  
              }
              r={
                index < 5 ? 13 : 8 // 4 points with radius 13, 3 points with radius 9
              }
              fill={
                index < 5 ? (active ? "#FFD700" : "#0041c2") : (active ? "red" : "#0041c2" ) // Different colors for two point types #FFD700 #008000
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
        </div>
        
      </div>
    </div>
  );
};

export default Number9;
