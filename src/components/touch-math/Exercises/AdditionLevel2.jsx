import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Feedback
import Number1 from '../Numbers/Number1'; 
import Number2 from '../Numbers/Number2';
import Number3 from '../Numbers/Number3';
import Number4 from '../Numbers/Number4';
import Number5 from '../Numbers/Number5';
import Number6 from '../Numbers/Number6';
import Number7 from '../Numbers/Number7';
import Number8 from '../Numbers/Number8';
import Number9 from '../Numbers/Number9';
import Number0 from '../Numbers/Number0';

const AdditionExerciseWithTouchPoints = () => {
  // Randomly generate two-digit numbers
  const [num1, setNum1] = useState(Math.floor(Math.random() * 90) + 10); // Random number between 10 and 99
  const [num2, setNum2] = useState(Math.floor(Math.random() * 90) + 10); // Random number between 10 and 99
  const [answer, setAnswer] = useState('');

  // Map digits to their respective touch point components
  const numberComponents = {
    1: <Number1 />,
    2: <Number2 />,
    3: <Number3 />,
    4: <Number4 />,
    5: <Number5 />,
    6: <Number6 />,
    7: <Number7 />,
    8: <Number8 />,
    9: <Number9 />,
    0: <Number0 />,
  };

  // Helper function to render two-digit numbers
  const renderNumber = (num) => {
    const digits = num.toString().split('').map(Number);
    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        {digits.map((digit, index) => (
          <div key={index}>{numberComponents[digit]}</div>
        ))}
      </div>
    );
  };

  // Function to check the answer
  const handleSubmit = () => {
    const correctAnswer = num1 + num2;
    if (parseInt(answer) === correctAnswer) {
      Swal.fire({
        title: 'Correct!',
        text: `Good job! ${num1} + ${num2} = ${correctAnswer}`,
        icon: 'success',
        confirmButtonText: 'Next Exercise',
      }).then(() => {
        // Generate new random numbers and reset answer
        setNum1(Math.floor(Math.random() * 90) + 10);
        setNum2(Math.floor(Math.random() * 90) + 10);
        setAnswer('');
      });
    } else {
      Swal.fire({
        title: 'Incorrect!',
        text: `Try again! ${num1} + ${num2} is not ${answer}`,
        icon: 'error',
        confirmButtonText: 'Retry',
      });
    }
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '10px' }}>
      <h2 style={{ fontSize: '50px', marginBottom: '100px' }}>Touch Math Addition Practice</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        {/* Render numbers side by side */}
        <div>{renderNumber(num1)}</div>
        <span style={{ fontSize: '200px', color: '#0041c2' }}>+</span>
        <div>{renderNumber(num2)}</div>
        <span style={{ fontSize: '200px', marginRight: '50px', color: '#0041c2' }}>=</span>

        {/* Answer input box on the same line */}
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{
            fontSize: '200px',
            padding: '10px',
            marginBottom: '50px',
            borderRadius: '5px',
            border: '1px solid #0041c2',
            width: '300px',
            height: '200px',
            textAlign: 'center',
            appearance: 'none',
            MozAppearance: 'textfield',
            WebkitAppearance: 'none',
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{
          marginTop: '50px',
          padding: '8px 16px',
          fontSize: '20px',
          color: '#fff',
          backgroundColor: '#28a745',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default AdditionExerciseWithTouchPoints;
