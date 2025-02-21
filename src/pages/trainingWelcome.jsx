import React, { useEffect, useState } from 'react';
import readImage from '../assets/Read.png';
import numberImage from '../assets/Numbers.png';
import ChangeThemeFB from '../components/changeThemeFB';

export default function TrainingWelcome() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
  }, []);

  return (
    <div className='la-container'>
      <ChangeThemeFB initialThemeName={'theme3'} initialFontName={'OpenDyslexic'} />
      <div
        className={`flex w-full flex-col justify-center absolute z-20 transition-transform duration-1000 ${
          showWelcome ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col w-full items-center justify-center py-[50px]'>
          <h1 className='text-center'>Welcome, GuestUser2112232</h1>
          <p>Where learning adapts to you, not the other way around...</p>
        </div>
        <div className='flex justify-evenly items-center'>
          <img src={readImage} alt='read' className='w-[500px] h-fit object-cover' />
          <img src={numberImage} alt='number' className='w-[500px] h-fit object-cover' />
        </div>
      </div>
    </div>
  );
}