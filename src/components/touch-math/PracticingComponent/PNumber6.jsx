import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom';

const Number6 = () => {
  // Initialize 5 touch points (false means not touched yet)
  const [touchPoints, setTouchPoints] = useState([false, false, false, false, false, false]);
  const navigate = useNavigate();

  // Correct pattern for all 5 touch points
  const correctPattern = [true, true, true, true, true, true];

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
          Mark the touchpoints for number 6
        </p>
      </div>

      <div>
        <svg width="800" height="600" viewBox="0 0 200 200">
          {/* Number "6" */}
          <text x="35" y="150" fontSize="200" fontFamily="Arial" fill="#0041c2">6</text>

          {/* 5 Touch Points on the number "6" */}
          {touchPoints.map((active, index) => (
            <circle
              key={index}
              cx={
                index === 0 ? 125 :   
                index === 1 ? 53 :  
                index === 2 ? 92 :   
                index === 3 ? 125 :
                index === 4 ? 53 :   
                92                    
              }
              cy={
                index === 0 ? 33 :  
                index === 1 ? 90 : 
                index === 2 ? 144 :  
                index === 3 ? 33 :
                index === 4 ? 90 : 
                144                   
              }
              r={
                index < 3 ? 13 : 8 // 4 points with radius 13, 3 points with radius 9
              }
              fill={
                index < 3 ? (active ? "#FFD700" : "#0041c2") : (active ? "red" : "#0041c2" ) // Different colors for two point types #FFD700 #008000
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
            onClick={() => navigate('/practice_number7')}
            className="pnext-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Number6;
