import React, { useEffect, useState } from 'react'
import logo from '../assets/lexLogo.png'
export default function MinimalHeader() {

  return (
    <div className='w-full z-40 absolute top-0  flex h-20  items-center justify-center'>
      <div className='items-center justify-start la-container flex'>
        <div className='w-[50px] h-[50px] mr-2'>
          <img src={logo} loading="lazy" alt='LexAyudha logo' />
        </div>
        <h2 className='h-fit m-0'>LexAyudha</h2>
      </div>

    </div>
  )
}