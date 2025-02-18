import React, { useEffect, useState } from 'react' 
import logo from '../assets/lexLogo.png'
export default function MinimalHeader() {
  
  return (
    <div className='w-full  z-40 absolute px-20 flex h-20  items-center justify-start'>
      <div className='w-[50px] h-[50px] mr-2'>
        <img src={logo} alt='LexAyudha logo'/>
      </div>
      <h2 className='h-fit m-0'>LexAyudha</h2>
    </div>
  )
}