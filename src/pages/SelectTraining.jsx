import React, { useEffect, useState } from 'react'
import ChangeThemeFB from '../components/changeThemeFB.jsx'
import dyl_t_bg from '../assets/Dyslexic_t_bg.png'
import dyc_t_bg from '../assets/Dyscalculic_t_bg.png'
import AlternativeHeader from '../components/alternativeHeader.jsx';


export default function SelectTrainingPage() {

    useEffect(() => {

    }, []);

    return (
        <div className='  w-screen h-screen flex justify-center'>
            <AlternativeHeader />
            <div className='la-container mt-10 flex items-center justify-center '>
                <div className='flex flex-col items-center w-full'>
                    <h1 className=' text-5xl text-center mt-0 mb-[10px] pb-[60px]'>Select the Training Type</h1>
                    <div className=' w-full px-0 py-1 flex justify-evenly items-center'>
                        <a href='/dyslexic-training' target='' >
                            <div className='dyl-choose-training-bg w-[350px] h-[350px] flex justify-center items-center primary-color-bg rounded-lg '>

                                <div className=' px-[16px] py-[8px] bg-[var(--background-color)] rounded-md'>

                                    <p className='m-0'>Dyslexic Training</p>


                                </div>

                            </div>
                        </a>
                        <a href='/dyscalculic-training' target='' >
                            <div className='dysc-choose-training-bg w-[350px] h-[350px] flex justify-center items-center primary-color-bg align-middle rounded-lg'>

                                <div className=' px-[16px] py-[8px] bg-[var(--background-color)] rounded-md  '>

                                    <p className='m-0'>Dyscalculia Training</p>


                                </div>

                            </div>
                        </a>
                    </div>
                </div>


                <ChangeThemeFB initialFontName={'OpenDyslexic'} />

            </div>

        </div>
    )
}