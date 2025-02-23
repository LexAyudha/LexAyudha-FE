import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom';

const Number1 = () => {
  // Initialize 1 touch point (false means not touched yet)
  const [touchPoint, setTouchPoint] = useState(false);
  const navigate = useNavigate();

  // Correct pattern for the single touch point
  const correctPattern = true;

  const handleTouch = () => {
    setTouchPoint(!touchPoint);
  };

  const checkProgress = () => {
    if (touchPoint === correctPattern) {
      Swal.fire({
        title: 'Well done!',
        text: 'You marked the correct touch point.',
        icon: 'success',
        confirmButtonText: 'Great!'
      });
    } else {
      Swal.fire({
        title: 'Try again!',
        text: 'You missed the touch point.',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
  };

  return (
    <div>
      <div>
        <p style={{ fontFamily: 'Comic Sans', color: '#000', fontSize: '48px', textAlign: 'center' }}>
          Mark the touchpoint for number 1
        </p>
      </div>

      <div>
        <svg width="800" height="600" viewBox="0 0 200 200">
          {/* Number "1" */}
          <text x="35" y="150" fontSize="200" fontFamily="Arial" fill="#0041c2">1</text>

          {/* Single Touch Point on the number "1" */}
          <circle
            cx={100} // Position the touch point in the center of the number
            cy={22}  // Adjust to position the touch point where it aligns with "1"
            r={14} // Radius of the touch point
            fill={touchPoint ? "#FFD700" : "#0041c2"} // Golden when active
            onClick={handleTouch}
          />
        </svg>

        <div className="button-container">
          <button 
            onClick={checkProgress}
            className="check-answer-button"
          >
            Check Answer
          </button>

          <button
            onClick={() => navigate('/practice_number2')}
            className="pnext-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Number1;
