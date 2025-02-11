import React, { useEffect, useState } from 'react' 
import logo from '../assets/lexLogo.png'
export default function MinimalHeader() {
  
  return (
    <div className='w-full primary-color-bg z-40 sticky px-20 flex h-20 shadow-md items-center justify-start'>
      <div className='w-[50px] h-[50px] mr-2'>
        <img src={logo} alt='LexAyudha logo'/>
      </div>
      <h2 className='h-fit m-0'>LexAyudha</h2>
    </div>
  )
}