import React, { useEffect, useState } from 'react';
import readImage from '../assets/Read.png';
import numberImage from '../assets/Numbers.png';
import ChangeThemeFB from '../components/changeThemeFB';

export default function TrainingWelcome() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
      checkFirstTime();
      
    }, 5000);
  }, []);

  const checkFirstTime = () =>{
   if(isFirstTime){
      window.location.href='/config-onboarding'
   }
  }

  return (
    <div className='la-container '>
      <ChangeThemeFB initialThemeName={'theme3'} initialFontName={'OpenDyslexic'} />
      <div
        className={`flex w-full flex-col justify-center absolute top-0 right-0 left-0 mt-[25px] z-20 transition-transform duration-1000 ${
          showWelcome ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col w-full  items-center justify-center py-[50px]'>
          <h1 className='text-center'>Welcome, GuestUser2112232</h1>
          <p>Where learning adapts to you, not the other way around...</p>
        </div>
        <div className='flex justify-evenly items-center'>
          <img src={readImage} alt='read' className='w-[400px] h-fit object-cover' />
          <img src={numberImage} alt='number' className='w-[400px] h-fit object-cover' />
        </div>
        <div className='flex justify-center'>
          <div className="custom-loader"></div>
        </div>
       
      </div>
    </div>
  );
}