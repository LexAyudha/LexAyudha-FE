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
import AlternativeHeader from "../../alternativeHeader";

const TeachingSubtraction = () => {
  const [num1, setNum1] = useState(Math.floor(Math.random() * 9) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * num1));
  const [answer, setAnswer] = useState('');
  const [highlightedTouchPoint, setHighlightedTouchPoint] = useState(0);

  const numberComponents = {
    1: <Number1 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />,
    2: <Number2 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />,
    3: <Number3 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />,
    4: <Number4 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />,
    5: <Number5 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />,
    6: <Number6 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />,
    7: <Number7 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />,
    8: <Number8 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />,
    9: <Number9 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />,
    0: <Number0 onTouchPointChange={setHighlightedTouchPoint} highlightedTouchPoint={highlightedTouchPoint} />
  };

  const pronounceNumber = (number, callback) => {
    const synth = window.speechSynthesis;
    const touchPoints = Array(number).fill(number).map((_, i) => i + 1).join(', ');
    const utterance = new SpeechSynthesisUtterance(`Let's count Touch points for ${number}: ${touchPoints}`);
    utterance.onend = callback;
    synth.speak(utterance);
  };

  const startTeaching = () => {
    setAnswer('');
    pronounceNumber(num1, () => {
      setTimeout(() => {
        const minusUtterance = new SpeechSynthesisUtterance('Minus');
        window.speechSynthesis.speak(minusUtterance);
      }, 1000);

      setTimeout(() => {
        pronounceNumber(num2, () => {
          setTimeout(() => {
            const result = num1 - num2;
            setAnswer(result);
            const answerUtterance = new SpeechSynthesisUtterance(`The answer is ${result}`);
            window.speechSynthesis.speak(answerUtterance);
          }, 1000);
        });
      }, 2000);
    });
  };

  const nextLesson = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * num1));
    setAnswer('');
    setHighlightedTouchPoint(0);
  };

  return (
   <div className="la-container h-screen flex items-center justify-center relative">
    <AlternativeHeader title="Number Sense"/>
    <ChangeThemeFB/>
    <div style={{ textAlign: 'center', fontFamily: 'Arial', padding: '10px' }}>
      <h2 style={{ fontSize: '50px', marginBottom: '100px' }}>Touch Math Subtraction Teaching</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <div>{numberComponents[num1]}</div>
        <span style={{ fontSize: '200px', color: '#0041c2', marginLeft: '30px', marginBottom: '60px' }}>-</span>
        <div>{numberComponents[num2]}</div>
        <span style={{ fontSize: '200px', color: '#0041c2', marginLeft: '30px', marginBottom: '60px' }}>=</span>
        <input
          type="text"
          value={answer}
          readOnly
          style={{
            fontSize: '200px',
            padding: '10px',
            marginBottom: '60px',
            marginLeft: '50px',
            borderRadius: '5px',
            border: '1px solid #0041c2',
            width: '250px',
            height: '200px',
            textAlign: 'center',
            backgroundColor: '#f0f0f0',
            cursor: 'default'
          }}
        />
      </div>
      <button
        onClick={startTeaching}
        style={{
          marginTop: '50px',
          padding: '8px 16px',
          fontSize: '20px',
          color: '#fff',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        Start Teaching
      </button>

      <button
        onClick={nextLesson}
        style={{
          position: 'absolute',
          right: '20px',
          bottom: '73px',
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
        Next Lesson
      </button>
    </div>
  </div>
  );
};

export default TeachingSubtraction;
