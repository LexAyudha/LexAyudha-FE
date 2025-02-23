import React from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom';

const Number0 = () => {
  const navigate = useNavigate();

  const checkProgress = () => {
    Swal.fire({
      title: 'Well done!',
      text: 'There are no touch points to mark for 0!',
      icon: 'success',
      confirmButtonText: 'Great!'
    });
  };

  return (
    <div>
      <div>
        <p style={{ fontFamily: 'Comic Sans', color: '#000', fontSize: '48px', textAlign: 'center' }}>
          There are no touchpoints for number 0
        </p>
      </div>

      <div>
        <svg width="800" height="600" viewBox="0 0 200 200">
          {/* Number "0" */}
          <text x="35" y="150" fontSize="200" fontFamily="Arial" fill="#0041c2">0</text>
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

export default Number0;
