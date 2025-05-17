import React, { useEffect, useState } from 'react';
import readImage from '../assets/Read.png';
import { useLocation, useNavigate } from 'react-router-dom';
import numberImage from '../assets/Numbers.png';
import ChangeThemeFB from '../components/changeThemeFB';

export default function TrainingWelcome() {
  const [showWelcome, setShowWelcome] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const newParam = queryParams.get('new');
  const userName = queryParams.get('u');

  console.log('userName: ', userName)

  useEffect(() => {

    //if newParam true, isFirstTimeValue is true, else false
    const isFirstTimeValue = newParam === 'true'

    setTimeout(() => {
      setShowWelcome(false);

      if (isFirstTimeValue) {
        navigate('/config-onboarding');
      } else {
        navigate('/selectTraining');
      }
    }, 5000);
  }, [location.search, navigate]);


  return (
    <div className='la-container '>
      <ChangeThemeFB initialFontName={'OpenDyslexic'} />
      <div
        className={`flex w-full flex-col justify-center absolute top-0 right-0 left-0 mt-[25px] z-20 transition-transform duration-1000 ${showWelcome ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className='flex flex-col w-full  items-center justify-center py-[50px]'>
          <h1 className='text-center'>Welcome, {userName} </h1>
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