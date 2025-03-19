import React, { useState } from 'react';
import Swal from 'sweetalert2';
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
import ChangeThemeFB from '../../changeThemeFB';

const SubtractionExerciseWithTouchPoints = () => {
  const [num1, setNum1] = useState(Math.floor(Math.random() * 9) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * num1));
  const [answer, setAnswer] = useState('');
  const [quizCount, setQuizCount] = useState(0);

  const numberComponents = {
    1: <Number1 />, 2: <Number2 />, 3: <Number3 />, 4: <Number4 />, 5: <Number5 />,
    6: <Number6 />, 7: <Number7 />, 8: <Number8 />, 9: <Number9 />, 0: <Number0 />,
  };

  const handleSubmit = () => {
    const correctAnswer = num1 - num2;
    if (parseInt(answer) === correctAnswer) {
      Swal.fire({
        title: 'Correct!',
        text: `Good job! ${num1} - ${num2} = ${correctAnswer}`,
        icon: 'success',
        confirmButtonText: 'Next Exercise',
      }).then(() => {
        if (quizCount === 9) {
          Swal.fire({
            title: 'Quiz Completed!',
            text: 'You have completed 10 quizzes! Restarting...',
            icon: 'info',
            confirmButtonText: 'Restart',
          }).then(() => {
            setQuizCount(0);
          });
        } else {
          setQuizCount(quizCount + 1);
        }
        setNum1(Math.floor(Math.random() * 9) + 1);
        setNum2(Math.floor(Math.random() * num1));
        setAnswer('');
      });
    } else {
      Swal.fire({
        title: 'Incorrect!',
        text: `Try again! ${num1} - ${num2} is not ${answer}`,
        icon: 'error',
        confirmButtonText: 'Retry',
      });
    }
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '10px' }}>
      <ChangeThemeFB />
      <h2 style={{ fontSize: '50px', marginBottom: '100px' }}>Touch Math Subtraction Practice</h2>
      <div className="quiz-counter">Quiz {quizCount + 1} / 10</div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '250px', marginTop: '50px' }}>{numberComponents[num1]}</div>
        <span style={{ fontSize: '250px', marginLeft: '40px', marginBottom: '57px', color: '#0041c2' }}>-</span>
        <div style={{ fontSize: '250px', marginTop: '50px' }}>{numberComponents[num2]}</div>
        <span style={{ fontSize: '200px', marginRight: '50px', color: '#0041c2' }}>=</span>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{
            fontSize: '200px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #0041c2',
            width: '280px',
            height: '260px',
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

export default SubtractionExerciseWithTouchPoints;
