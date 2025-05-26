import React, { useState, useEffect } from 'react';
import ChangeThemeFB from '../../changeThemeFB';
import AlternativeHeader from '../../alternativeHeader';

const BackwardCountingGame = () => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [stepsBack, setStepsBack] = useState(0);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const number = Math.floor(Math.random() * 30) + 10; // 10–40
    const steps = Math.floor(Math.random() * 3) + 2; // 2–4 steps back
    const answer = number - steps;

    const wrong1 = answer + Math.floor(Math.random() * 3 + 1);
    const wrong2 = answer - Math.floor(Math.random() * 3 + 1);

    const shuffledOptions = shuffleArray([answer, wrong1, wrong2]);

    setCurrentNumber(number);
    setStepsBack(steps);
    setCorrectAnswer(answer);
    setOptions(shuffledOptions);
    setFeedback('');
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleSelect = (selected) => {
    if (selected === correctAnswer) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback('❌ Try Again!');
    }
  };

  return (
    <div className="la-container h-screen w-full flex flex-col relative text-center px-4">
      <AlternativeHeader title="Backward Counting" />
      <ChangeThemeFB />

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Backward Counting Game
        </h1>

        <p className="text-xl md:text-4xl text-gray-800 dark:text-gray-200 font-medium max-w-3xl">
          What is the{' '}
          <span className="font-bold text-blue-700 dark:text-blue-400">
            {stepsBack}
            <sup>{getOrdinalSuffix(stepsBack)}</sup>
          </span>{' '}
          number before{' '}
          <span className="font-bold text-blue-700 dark:text-blue-400">
            {currentNumber}
          </span>
          ?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-xl">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className="bg-white dark:bg-gray-800 border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-700 dark:text-blue-300 font-semibold py-4 rounded-xl transition duration-200 text-2xl shadow-md"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="text-2xl font-semibold text-green-700 dark:text-green-400 min-h-[2rem]">
          {feedback}
        </div>

        <button
          onClick={generateNewQuestion}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-md transition"
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

// Helper to get ordinal suffix (st, nd, rd, th)
function getOrdinalSuffix(n) {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

export default BackwardCountingGame;
