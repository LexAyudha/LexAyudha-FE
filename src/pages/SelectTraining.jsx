import React, { useEffect, useState } from 'react'
import ChangeThemeFB from '../components/changeThemeFB.jsx'
import dyl_t_bg from '../assets/Dyslexic_t_bg.png'
import dyc_t_bg from '../assets/Dyscalculic_t_bg.png'


export default function SelectTrainingPage() {

    useEffect(() => {

    }, []);

    return (
        <div className='  w-screen h-screen flex justify-center'>
            <div className='la-container  flex flex-col items-center  w-full'>
                <h1 className=' text-5xl text-center my-[20px] py-[70px]'>Select the Training Type</h1>
                <div className=' w-full px-0 py-10 flex justify-evenly items-center'>
                    <a href='/dyslexic-training' target='' >
                        <div className='dyl-choose-training-bg w-[350px] h-[350px] flex justify-center items-center primary-color-bg rounded-lg '>

                            <div className=' px-[16px] py-[8px] main-border-color rounded-md'>

                                <p className='m-0'>Dyslexic training</p>


                            </div>

                        </div>
                    </a>
                    <a href='/dyscalculic-training' target='' >
                        <div className='dysc-choose-training-bg w-[350px] h-[350px] flex justify-center items-center primary-color-bg align-middle rounded-lg'>

                            <div className=' px-[16px] py-[8px] main-border-color rounded-md  '>

                                <p className='m-0'>Dyscalculia training</p>


                            </div>

                        </div>
                    </a>
                </div>

                <ChangeThemeFB />

            </div>

        </div>
    )
}