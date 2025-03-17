import React from 'react' 
import lexLogo from '../assets/lexLogo.png'
export default function ScreenLoader() {
  
  return (
    <div className='bg-white w-screen h-screen absolute z-50 flex items-center justify-center'>
      <img src={lexLogo} alt='logo' className='w-[250px] h-[250px] animate-pulse'></img>
    </div>
  )
}