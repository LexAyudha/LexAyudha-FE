
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Feedback
import ChangeThemeFB from '../../changeThemeFB';
import AlternativeHeader from "../../alternativeHeader";

const MixedAdditionQuiz = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [quizCount, setQuizCount] = useState(0);
  const [isTwoDigit, setIsTwoDigit] = useState(false);
  const quizLimit = 10;

  useEffect(() => {
    generateNewQuestion();
  }, []); // Run once on component mount

  const generateNewQuestion = () => {
    const shouldBeTwoDigit = Math.random() < 0.5; // 50% chance for two-digit numbers
    setIsTwoDigit(shouldBeTwoDigit);

    let newNum1, newNum2;
    if (shouldBeTwoDigit) {
      newNum1 = Math.floor(Math.random() * 90) + 10; // 10 to 99
      newNum2 = Math.floor(Math.random() * 90) + 10; // 10 to 99
    } else {
      newNum1 = Math.floor(Math.random() * 9) + 1;  // 1 to 9
      newNum2 = Math.floor(Math.random() * 9) + 1;  // 1 to 9
    }
    setNum1(newNum1);
    setNum2(newNum2);
    setAnswer('');
  };

  const handleSubmit = () => {
    const correctAnswer = num1 + num2;
    if (parseInt(answer) === correctAnswer) {
      Swal.fire({
        title: 'Correct!',
        text: `Good job! ${num1} + ${num2} = ${correctAnswer}`,
        icon: 'success',
        confirmButtonText: 'Next',
      }).then(() => {
        if (quizCount + 1 === quizLimit) {
          Swal.fire({
            title: 'Quiz Completed!',
            text: `You have completed ${quizLimit} quizzes!`,
            icon: 'info',
            confirmButtonText: 'Restart',
          }).then(() => {
            setQuizCount(0);
            generateNewQuestion();
          });
        } else {
          setQuizCount(quizCount + 1);
          generateNewQuestion();
        }
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
   <div className="la-container h-screen flex items-center justify-center relative">
     <AlternativeHeader title="Number Sense"/>
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
      <ChangeThemeFB />
      <h2 style={{ fontSize: '36px', marginBottom: '0px' }}>Addition Quizzes</h2>
      <div className="quiz-counter" style={{ marginBottom: '5px', fontSize: '18px', color: '#555', marginTop: '50px' }}>
        Question {quizCount + 1} / {quizLimit}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: isTwoDigit ? '130px' : '130px', marginBottom: '0px' }}>{num1}</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: isTwoDigit ? '130px' : '130px', marginRight: '5px' }}>+</span>
          <div style={{ fontSize: isTwoDigit ? '130px' : '130px', marginBottom: '0px', marginRight: '83px' }}>{num2}</div>
        </div>
        <hr style={{ width: '100%', borderTop: '4px solid #ccc', marginBottom: '10px' }} />
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="?"
          style={{
            fontSize: isTwoDigit ? '130px' : '130px',
            padding: '15px',
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
          padding: '10px 20px',
          fontSize: '20px',
          color: '#fff',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        Submit
      </button>
    </div>
    </div>
      );
};

export default MixedAdditionQuiz;