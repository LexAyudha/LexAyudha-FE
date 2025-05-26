
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Feedback
import ChangeThemeFB from '../../changeThemeFB';
import AlternativeHeader from "../../alternativeHeader";

const MixedSubtractionQuiz = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [quizCount, setQuizCount] = useState(0);
  const [isTwoDigit, setIsTwoDigit] = useState(false);
  const quizLimit = 10;
  const [quizResults, setQuizResults] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (quizCount < quizLimit) {
      generateNewQuestion();
    } else {
      setIsFinished(true);
    }
  }, [quizCount]);

  const generateNewQuestion = () => {
  let newNum1, newNum2;

  if (quizCount < 3) {
    // Level 1: One-digit - One-digit
    newNum1 = Math.floor(Math.random() * 9) + 1; // 1–9
    newNum2 = Math.floor(Math.random() * newNum1) + 1; // 1–newNum1
  } else if (quizCount < 6) {
    // Level 2: Two-digit - One-digit
    newNum1 = Math.floor(Math.random() * 90) + 10; // 10–99
    newNum2 = Math.floor(Math.random() * 9) + 1; // 1–9
  } else {
    // Level 3: Two-digit - Two-digit
    newNum1 = Math.floor(Math.random() * 90) + 10; // 10–99
    newNum2 = Math.floor(Math.random() * (newNum1 - 9)) + 10; // Ensure num2 ≤ num1
  }

  setNum1(newNum1);
  setNum2(newNum2);
  setIsTwoDigit(newNum1 >= 10 || newNum2 >= 10);
  setAnswer('');
};


  const handleSubmit = () => {
    const correctAnswer = num1 - num2;
    const userAnswer = parseInt(answer);
    const result = {
      question: `${num1} - ${num2}`,
      correctAnswer: correctAnswer,
      userAnswer: isNaN(userAnswer) ? 'No Answer' : userAnswer,
      isCorrect: userAnswer === correctAnswer,
    };

    setQuizResults((prev) => [...prev, result]);
    setQuizCount((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuizCount(0);
    setQuizResults([]);
    setIsFinished(false);
  };

  return (
    <div className="la-container h-screen flex items-center justify-center relative">
      <AlternativeHeader title="Number Sense" />
      <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
        <ChangeThemeFB />

        {!isFinished ? (
          <>
            <h2 style={{ fontSize: '36px', marginBottom: '0px' }}>Subtraction Quizzes</h2>
            <div className="quiz-counter" style={{ marginBottom: '5px', fontSize: '18px',  marginTop: '50px' }}>
              Question {quizCount + 1} / {quizLimit}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '130px', marginBottom: '0px' }}>{num1}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '130px', marginRight: '5px' }}>-</span>
                <div style={{ fontSize: '130px', marginBottom: '0px', marginRight: '83px' }}>{num2}</div>
              </div>
              <hr style={{ width: '100%', borderTop: '4px solid #ccc', marginBottom: '10px' }} />
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="?"
                style={{
                  fontSize: '130px',
                  padding: '15px',
                  borderRadius: '5px',
                  border: '1px solid #dc3545',
                  width: '300px',
                  height: '200px',
                  textAlign: 'center',
                }}
              />
            </div>
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 20px',
                fontSize: '20px',
                color: '#fff',
                backgroundColor: '#dc3545',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#a71d2a')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
            >
              Submit
            </button>
          </>
        ) : (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '30px',
                width: '90%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ fontSize: '28px', marginBottom: '20px', textAlign: 'center' }}>Quiz Summary</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>No</th>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Question</th>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Your Answer</th>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Correct Answer</th>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((q, idx) => (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #ccc', padding: '10px' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #ccc', padding: '10px' }}>{q.question}</td>
                      <td style={{ border: '1px solid #ccc', padding: '10px' }}>{q.userAnswer}</td>
                      <td style={{ border: '1px solid #ccc', padding: '10px' }}>{q.correctAnswer}</td>
                      <td
                        style={{
                          border: '1px solid #ccc',
                          padding: '10px',
                          color: q.isCorrect ? 'green' : 'red',
                          fontWeight: 'bold',
                        }}
                      >
                        {q.isCorrect ? 'Correct' : 'Wrong'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  onClick={handleRestart}
                  style={{
                    padding: '12px 24px',
                    fontSize: '18px',
                    color: '#fff',
                    backgroundColor: '#28a745',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
                >
                  Restart Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MixedSubtractionQuiz;