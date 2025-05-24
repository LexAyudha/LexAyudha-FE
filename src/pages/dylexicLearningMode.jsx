import React, { useEffect, useState } from 'react'
import AlternativeHeader from '../components/alternativeHeader'
import ChangeThemeFB from '../components/changeThemeFB'

export default function DyslexicLearningMode() {


    return (
        <div className='  w-screen h-screen flex justify-center'>
            <AlternativeHeader />
            <div className='la-container mt-10 flex items-center justify-center '>
                <div className='flex flex-col items-center w-full'>
                    <h1 className=' text-4xl text-center mt-0 mb-[10px] pb-[60px]'>Select the training mode</h1>
                    <div className='flex flex-col items-center justify-center'>

                        <a href='/dyslexia-practice' className=' hover:border-[var(--text-color)] border-2 border-[var(--primary-color)] w-[250px] flex justify-center my-[10px] px-[10px] py-[8px] primary-color-bg rounded-md'>
                            <div>
                                <p className='m-0 text-xl'>Practice mode</p>
                            </div>
                        </a>
                        <a href='/dyslexia-quiz' className='hover:border-[var(--text-color)] border-2 border-[var(--primary-color)] w-[250px] flex justify-center my-[10px] px-[10px] py-[8px] primary-color-bg rounded-md'>
                            <div>
                                <p className='m-0 text-xl'>Quiz mode</p>
                            </div>
                        </a>
                        <a href='/dyslexia-pdf-reader' className='hover:border-[var(--text-color)] border-2 border-[var(--primary-color)] w-[250px] flex justify-center my-[10px] px-[10px] py-[8px] primary-color-bg rounded-md'>
                            <div>
                                <p className='m-0 text-xl'>PDF Reader</p>
                            </div>
                        </a>

                    </div>
                </div>


                <ChangeThemeFB initialFontName={'OpenDyslexic'} />

            </div>

        </div>
    )
}